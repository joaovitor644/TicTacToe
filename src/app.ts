import express from 'express'
import socketIo from 'socket.io'
import http from 'http'
import path from 'path'
import bodyParser from 'body-parser'
import request from  'request'
import Lobby from "./models/Lobby"
import Players from "./models/Player"

const app = express()
const server = http.createServer(app)
const io = socketIo.Server
const socket = new io(server)
const port = 3000
let rooms:any = []

let tempname = " "

app.use('/public',express.static(path.join(__dirname,"../public")))
app.set('views','src/views')
app.set('view engine' , 'ejs' );
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

function code(len: number){
    let code = ''
    do{
        code = code + Math.random().toString(36).substr(2)
    }while(code.length < len)
    code = code.substr(0,len)
    return code
}

app.get('/',(req,res) => {
    res.render('index')
})
app.get("/lobbys/:loby",(req,res) => {
    let confirm = true
    rooms.forEach((elem: any,index: any,array: any) => {
        if(elem.code != req.params.loby){
            confirm = true
        } else if(elem.code == req.params.loby){
            if(elem.connections < 2){
                if(elem.players[tempname]){
                    confirm = true
                } else {
                    res.render('session',{
                        "Code":req.params.loby,
                        "Name":tempname
                    })
                    confirm = false
                } 
            } else {
                confirm = false
                res.redirect("/")
            }
        } else {
            confirm = false
            res.redirect("/")
        }
    })
    if(confirm == true){
        res.redirect("/")
    }
    tempname = " "
})
app.post("/lobbys/",(req,res) => {
    let code1 = code(10)
    tempname = req.body.playname
    rooms.push(new Lobby(code1,code1))
    res.redirect("/lobbys/"+code1);
})

app.post("/enterlobby",(req,res) => {
    let confirm2 = true;
    tempname = req.body.Nameplayer
    for(let index = 0; index < rooms.length ; index += 1){
        if(req.body.lobbyName == rooms[index].code){
            res.redirect("/lobbys/"+req.body.lobbyName)
            confirm2 = false
            break;
        }        
    }
    if(confirm2){
        res.redirect("/")
    }
})

server.listen(8000,() => {
    setInterval(() => {
        console.clear()
        console.log('rodando em http://localhost:8000\n')
        console.log(rooms)
    },1000)
})

socket.on('connection', (client) => {
    let code: any;
    let player: any;
    let unlock: any;
    client.on('message', (resp) => {
        code = resp.code
        player = new Players(resp.name,client.id)
        let turnPlayer;
        for(let index = 0; index < rooms.length ; index += 1){
            if(resp.code == rooms[index].code){
                client.join(code)
                rooms[index].connections = rooms[index].connections + 1
                if(rooms[index].connections < 2){
                    unlock = false
                } else {
                    unlock = true
                }
                if(rooms[index].pieces["X"] == null){
                    player.piece = "X"
                    turnPlayer = true
                    rooms[index].pieces["X"] = player
                    rooms[index].players[player.name] = player
                    client.emit("message", {
                        "op":true,
                        "turn":turnPlayer,
                        "unlock":unlock,
                        "player1":rooms[index].pieces["X"].name,
                    })
                    if(rooms[index].connections == 2) {
                        client.emit("message", {
                            "op":true,
                            "turn":turnPlayer,
                            "unlock":unlock,
                            "player1":rooms[index].pieces["X"].name,
                            "player2":rooms[index].pieces["O"].name
                        })
                        client.broadcast.emit("message", {
                            "player1":rooms[index].pieces["X"].name,
                            "player2":rooms[index].pieces["O"].name
                        })
                    }
                    if(rooms[index].connections == 2){
                        client.broadcast.emit("startGame"+code)
                        client.emit("startGame"+code)
                    }   
                } else {
                    player.piece = "O"
                    turnPlayer = false
                    rooms[index].pieces["O"] = player
                    rooms[index].players[player.name] = player
                    client.emit("message", {
                        "op":false,
                        "turn":turnPlayer,
                        "unlock":unlock,
                        "player1":rooms[index].pieces["X"].name,
                        "player2":rooms[index].pieces["O"].name
                    })
                    client.broadcast.emit("message", {
                        "player1":rooms[index].pieces["X"].name,
                        "player2":rooms[index].pieces["O"].name
                    })
                    if(rooms[index].connections == 2){
                        client.broadcast.emit("startGame"+code)
                        client.emit("startGame"+code)
                    }
                }
                break;
            }
        }
    })
    client.on("disconnect",(resp) => {
        for(let index = 0; index < rooms.length ; index += 1){
            if(code == rooms[index].code){
                rooms[index].connections = rooms[index].connections - 1
                rooms[index].pieces[player.piece] = null
                client.leave(code)
                client.broadcast.emit("resetALL"+code)
                delete rooms[index].players[player.name]
                if(rooms[index].connections == 0){
                    rooms.splice(index, 1);
                }
               break; 
            }
        }
    })
    client.on("updatePoint",(resp) => {
        if(resp.p1 == null && resp.p2 == true){
            for(let index = 0; index < rooms.length ; index += 1){
                if(code == rooms[index].code){
                    rooms[index].P2 += 1
                    rooms[index].rounds += 1
                    client.emit("updateData"+code,{
                        'p2':rooms[index].P2
                    })
                    client.broadcast.emit("updateData"+code,{
                        'p2':rooms[index].P2
                    })
                    break;
                }
            }
        } else if(resp.p1 == true && resp.p2 == null){
            for(let index = 0; index < rooms.length ; index += 1){
                if(code == rooms[index].code){
                    rooms[index].P1 += 1
                    rooms[index].rounds += 1
                    client.emit("updateData"+code,{
                        'p1':rooms[index].P1
                    })
                    client.broadcast.emit("updateData"+code,{
                        'p1':rooms[index].P1
                    })
                    break;
                }
            }
        } else if(resp.p1 == null && resp.p2 == null){
            for(let index = 0; index < rooms.length ; index += 1){
                if(code == rooms[index].code){
                    rooms[index].E += 1
                    rooms[index].rounds += 1
                    client.emit("updateData"+code,{
                        'e':rooms[index].E
                    })
                    client.broadcast.emit("updateData"+code,{
                        'e':rooms[index].E
                    })
                    break;
                }
            }
        }
    })
    client.on("reset",(resp) => {
        for(let index = 0; index < rooms.length ; index += 1){
            if(code == rooms[index].code){
               rooms[index].plays = 0
               rooms[index].table = [[1,2,3],[4,5,6],[7,8,9]]
               rooms[index].blockChoice = {
                    "A1": null,
                    "A2": null,
                    "A3": null,
                    
                    "A4": null,
                    "A5": null,
                    "A6": null,
                    
                    "A7": null,
                    "A8": null,
                    "A9": null,
                }
                /**WARNING - Esse armazenamento de valor muda a ordem de jogada**/
               // rooms[index].turn = true
               /************************************************/
                client.emit("reset"+code,{
                    "turn":rooms[index].turn,
                    "choice":rooms[index].blockChoice,
                    "plays":rooms[index].plays
                })
                client.broadcast.emit("reset"+code,{
                    "turn":rooms[index].turn,
                    "choice":rooms[index].blockChoice,
                    "plays":rooms[index].plays
                })
                client.emit("resetClients"+code)
                client.broadcast.emit("resetClients"+code)
                break;
            }
        }
    })
    //resetALL é chamado quando um dos jogadores sai da partida ou perde a conexão
    client.on("resetALL",(resp) => {
        for(let index = 0; index < rooms.length ; index += 1){
            if(code == rooms[index].code){
               rooms[index].plays = 0
               rooms[index].table = [[1,2,3],[4,5,6],[7,8,9]]
               rooms[index].E = 0
               rooms[index].P1 = 0
               rooms[index].P2 = 0
               rooms[index].rounds = 0
               rooms[index].blockChoice = {
                    "A1": null,
                    "A2": null,
                    "A3": null,
                    
                    "A4": null,
                    "A5": null,
                    "A6": null,
                    
                    "A7": null,
                    "A8": null,
                    "A9": null,
                }
                break;
            }
        }
    })
    client.on("updatePlays", (resp) => {
        let turn;
        for(let index = 0; index < rooms.length ; index += 1){
            if(code == rooms[index].code){
               rooms[index].plays += 1
               rooms[index].blockChoice = resp.choice
               rooms[index].table = resp.table
               if(rooms[index].turn == true){
                    rooms[index].turn = false
                    turn = false
               } else {
                    rooms[index].turn = true
                    turn = true
               }
               if(rooms[index].plays == 9){
                    client.emit("resetClients"+code)
                    client.broadcast.emit("resetClients"+code)
               }
               client.broadcast.emit("updatePlays"+code, {
                    "plays":rooms[index].plays,
                    "table":rooms[index].table,
                    "choice":rooms[index].blockChoice,
                    "area":resp.area,
                    "turn":rooms[index].turn
               })
               client.emit("updatePlays"+code, {
                    "plays":rooms[index].plays,
                    "table":rooms[index].table,
                    "choice":rooms[index].blockChoice,
                    "area":null,
                    "turn":rooms[index].turn
               })
               break;
            }
        }
    })
})