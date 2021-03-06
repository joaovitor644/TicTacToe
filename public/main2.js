const canvas = document.getElementById("canvas")
const testX = document.getElementById("x")
const testY = document.getElementById("y")
const ctx = canvas.getContext("2d")
const w = canvas.width
const h = canvas.height
let p1 = 0;
let p2 = 0;
let empates = 0;
let x;
let y;
let plays = 0
socket.on("reset"+code,(resp) => {
	plays = resp.plays
	turn = resp.turn
	blockChoice = resp.choice
})
function resetAll(){
	ctx.reset()
		
	blockChoice.A1 = null
	blockChoice.A2 = null
	blockChoice.A3 = null
	
	blockChoice.A4 = null
	blockChoice.A5 = null
	blockChoice.A6 = null
	
	blockChoice.A7 = null
	blockChoice.A8 = null
	blockChoice.A9 = null
	
	table = [[1,2,3],[4,5,6],[7,8,9]]
	unlock = false
	if(choice == true){
		document.getElementById('play2').innerHTML = " "
	} else {
		document.getElementById('play1').innerHTML = " "
	}
	document.getElementById('p1').innerHTML = 0
	document.getElementById('p2').innerHTML = 0
	document.getElementById('empates').innerHTML = 0
	if(choice == true){
		document.getElementById('info').innerHTML = "Player 2 Disconnect"
	} else {
		document.getElementById('info').innerHTML = "Player 1 Disconnect"
	}
}
socket.on("resetALL"+code,(resp) => {
	console.log("emitido - resetAll")
	socket.emit("resetALL")
	resetAll()
})
socket.on("updatePlays"+code, (resp) => {
	plays = resp.plays
	table = resp.table
	blockChoice = resp.choice
	turn = resp.turn

	if(turn == true && choice == true ){
		document.getElementById('info').innerHTML = "Is your turn - x"
	} else if( turn == false && choice == true){
		document.getElementById('info').innerHTML = " "
	}

	if( turn == true && choice == false){
		document.getElementById('info').innerHTML = ""
	} else if( turn == false && choice == false) {
		document.getElementById('info').innerHTML = "Is your turn - 0"
	}

	console.log(turn)
	if(resp.area){
		if(choice == true){
			drawCircle(resp.area)
			tableAnalytics()
		} else {
			drawX(resp.area)
			tableAnalytics()
		}
	}
})
socket.on("startGame"+code, () => {
	if(unlock == false){
		unlock = true
	}
	startGame()
})
socket.on("resetClients"+code, (resp) => {
	reset()
})
let blockChoice = {
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
let table = [[1,2,3],[4,5,6],[7,8,9]]
function updatePlays(area){
	socket.emit("updatePlays",{
		"choice":blockChoice,
		"table":table,
		"area":area,
	})
}
class Analytics {
	 AnalyticGroup1 = {
		"typeOne":{
			"A1":table[0][0],
			"B1":table[0][1],
			"C1":table[0][2]
		},
		"typeTwo":{
			"A2":table[1][0],
			"B2":table[1][1],
			"C2":table[1][2]
		},
		"typeThree":{
			"A3":table[2][0],
			"B3":table[2][1],
			"C3":table[2][2]
		},
		"analytic":() => {
			if(this.AnalyticGroup1.typeOne.A1 == this.AnalyticGroup1.typeOne.B1 && this.AnalyticGroup1.typeOne.B1 == this.AnalyticGroup1.typeOne.C1){
				if(this.AnalyticGroup1.typeOne.A1 == 'X'){
					console.log("X wins")
					return 1
				} else if(this.AnalyticGroup1.typeOne.A1 == 'O'){
					console.log("O Wins")
					return 2
				}
				
			}
			if(this.AnalyticGroup1.typeTwo.A2 == this.AnalyticGroup1.typeTwo.B2 && this.AnalyticGroup1.typeTwo.B2 == this.AnalyticGroup1.typeTwo.C2){
				console.log("work?")
				if(this.AnalyticGroup1.typeTwo.B2 == 'X'){
					console.log("X wins")
					return 1
				} else if(this.AnalyticGroup1.typeTwo.B2 == 'O'){
					console.log("O Wins")
					return 2
				}
			}
			if(this.AnalyticGroup1.typeThree.A3 == this.AnalyticGroup1.typeThree.B3 && this.AnalyticGroup1.typeThree.B3 == this.AnalyticGroup1.typeThree.C3){
				if(this.AnalyticGroup1.typeThree.A3 == 'X'){
					console.log("X wins")
					return 1
				} else if(this.AnalyticGroup1.typeThree.A3 == 'O'){
					console.log("O Wins")
					return 2
				}
			}else {
				return 0
			}
		}
	}
	 AnalyticGroup2 = {
		"typeOne":{
			"A1":table[0][0],
			"A2":table[1][0],
			"A3":table[2][0]
		},
		"typeTwo":{
			"B1":table[0][1],
			"B2":table[1][1],
			"B3":table[2][1]
		},
		"typeThree":{
			"C1":table[0][2],
			"C2":table[1][2],
			"C3":table[2][2]
		},
		"analytic":() => {
			if(this.AnalyticGroup2.typeOne.A1 == this.AnalyticGroup2.typeOne.A2 && this.AnalyticGroup2.typeOne.A2 == this.AnalyticGroup2.typeOne.A3){
				if(this.AnalyticGroup2.typeOne.A1 == 'X'){
					console.log("X wins")
					return 1
				} else if(this.AnalyticGroup2.typeOne.A1 == 'O'){
					console.log("O Wins")
					return 2
				}
			}
			if(this.AnalyticGroup2.typeTwo.B1 == this.AnalyticGroup2.typeTwo.B2 && this.AnalyticGroup2.typeTwo.B2 == this.AnalyticGroup2.typeTwo.B3){
				if(this.AnalyticGroup2.typeTwo.B2 == 'X'){
					console.log("X wins")
					return 1
				} else if(this.AnalyticGroup2.typeTwo.B2 == 'O'){
					console.log("O Wins")
					return 2
				}
			}
			if(this.AnalyticGroup2.typeThree.C1 == this.AnalyticGroup2.typeThree.C2 && this.AnalyticGroup2.typeThree.C2 == this.AnalyticGroup2.typeThree.C3){
				if(this.AnalyticGroup2.typeThree.C1 == 'X'){
					console.log("X wins")
					return 1
				} else if(this.AnalyticGroup2.typeThree.C1 == 'O'){
					console.log("O Wins")
					return 2
				}
			}else {
				return 0
			}
		}
	}
	AnalyticGroup3 = {
		"typeOne":{
			"A1":table[0][0],
			"B2":table[1][1],
			"C3":table[2][2]
		},
		"typeTwo": {
			"A3":table[2][0],
			"B2":table[1][1],
			"C1":table[0][2]
		},
		"analytic":() => {
			if(this.AnalyticGroup3.typeOne.A1 == this.AnalyticGroup3.typeOne.B2 && this.AnalyticGroup3.typeOne.B2 == this.AnalyticGroup3.typeOne.C3){
				if(this.AnalyticGroup3.typeOne.A1 == 'X'){
					console.log("X wins")
					return 1
				} else if(this.AnalyticGroup3.typeOne.A1 == 'O'){
					console.log("O Wins")
					return 2
				}
			}
			if(this.AnalyticGroup3.typeTwo.A3 == this.AnalyticGroup3.typeTwo.B2 && this.AnalyticGroup3.typeTwo.B2 == this.AnalyticGroup3.typeTwo.C1){
				if(this.AnalyticGroup3.typeTwo.B2 == 'X'){
					console.log("X wins")
					return 1
				} else if(this.AnalyticGroup3.typeTwo.B2 == 'O'){
					console.log("O Wins")
					return 2
				}
			}else {
				return 0
			}
		}	
	}
}
function startGame(){
		//primeira linha vertical
		ctx.fillRect(w/3, 0, 5, h);
		ctx.fillStyle = "black";

		//segunda linha vertical
		ctx.fillRect((w/3) * 2, 0, 5, h);
		ctx.fillStyle = "black";

		//primeira linha horizontal
		ctx.fillRect(0, h/3, w, 5);
		ctx.fillStyle = "black";

		//segunda linnha horizontal
		ctx.fillRect(0, (h/3)*2, w, 5);
		ctx.fillStyle = "black";

	if(turn == true && choice == true ){
		document.getElementById('info').innerHTML = "Is your turn - x"
	} else if( turn == false && choice == true){
		document.getElementById('info').innerHTML = " "
	}

	if( turn == true && choice == false){
		document.getElementById('info').innerHTML = ""
	} else if( turn == false && choice == false) {
		document.getElementById('info').innerHTML = "Is your turn - 0"
	}

}



canvas.addEventListener('mousemove', (e) => {
	x = e.offsetX
	y = e.offsetY
	
	testX.innerHTML = x;
	testY.innerHTML = y;
})

canvas.addEventListener('click', (e) => {
	tableAnalytics()
	console.log(blockChoice)
	if(unlock == true){
		if(choice == true && turn == true){
			if((x > 0 && x < 100) && (y > 0 && y < 100)){
				if(blockChoice.A1 != true){
					choiceDraw(1,choice)
					blockChoice.A1 = true
					if(choice == true){
						table[0][0] = 'X'
					} else {
						table[0][0] = 'O'
					}	
					updatePlays(1)
					tableAnalytics()
					if(plays == 9){
						tableAnalytics()
						plays = 0
					}
				}
			}
			if((x > 100 && x < 200) && (y > 0 && y < 100)){
				if(blockChoice.A2 != true){
					choiceDraw(2,choice)
					blockChoice.A2 = true
					if(choice == true){
						table[0][1] = 'X'
					} else {
						table[0][1] = 'O'
					}
					updatePlays(2)
					tableAnalytics()
					if(plays == 9){
						tableAnalytics()
						plays = 0
					}
				}
			}
			if((x > 200 && x < 300) && (y > 0 && y < 100)){
				if(blockChoice.A3 != true){
					choiceDraw(3,choice)
					blockChoice.A3 = true
					if(choice == true){
						table[0][2] = 'X'
					} else {
						table[0][2] = 'O'
					}
					updatePlays(3)
					tableAnalytics()
					if(plays == 9){
						tableAnalytics()
						plays = 0
					}
				}
			}
			
			//line 2
			
			if((x > 0 && x < 100) && (y > 100 && y < 200)){
				if(blockChoice.A4 != true){
					choiceDraw(4,choice)
					blockChoice.A4 = true
					if(choice == true){
						table[1][0] = 'X'
					} else {
						table[1][0] = 'O'
					}
					updatePlays(4)
					tableAnalytics()
					if(plays == 9){
						tableAnalytics()
						plays = 0
					}
				}
			}
			if((x > 100 && x < 200) && (y > 100 && y < 200)){
				if(blockChoice.A5 != true){
					choiceDraw(5,choice)
					blockChoice.A5 = true
					if(choice == true){
						table[1][1] = 'X'
					} else {
						table[1][1] = 'O'
					}
					updatePlays(5)
					tableAnalytics()
					if(plays == 9){
						tableAnalytics()
						plays = 0
					}
				}
			}
			if((x > 200 && x < 300) && (y > 100 && y < 200)){
				if(blockChoice.A6 != true){
					choiceDraw(6,choice)
					blockChoice.A6 = true
					if(choice == true){
						table[1][2] = 'X'
					} else {
						table[1][2] = 'O'
					}
					updatePlays(6)
					tableAnalytics()
					if(plays == 9){
						tableAnalytics()
						plays = 0
					}
				}
			}
			
			//line 3
			
			if((x > 0 && x < 100) && (y > 200 && y < 300)){
				if(blockChoice.A7 != true){
					choiceDraw(7,choice)
					blockChoice.A7 = true
					if(choice == true){
						table[2][0] = 'X'
					} else {
						table[2][0] = 'O'
					}
					updatePlays(7)
					tableAnalytics()
					if(plays == 9){
						tableAnalytics()
						plays = 0
					}
				}
			}
			if((x > 100 && x < 200) && (y > 200 && y < 300)){
				if(blockChoice.A8 != true){
					choiceDraw(8,choice)
					blockChoice.A8 = true
					if(choice == true){
						table[2][1] = 'X'
					} else {
						table[2][1] = 'O'
					}
					updatePlays(8)
					tableAnalytics()
					if(plays == 9){
						tableAnalytics()
						plays = 0
					}
				}
			}
			if((x > 200 && x < 300) && (y > 200 && y < 300)){
				if(blockChoice.A9 != true){
					choiceDraw(9,choice)
					blockChoice.A9 = true
					if(choice == true){
						table[2][2] = 'X'
					} else {
						table[2][2] = 'O'
					}
					updatePlays(9)
					tableAnalytics()
					if(plays == 9){
						tableAnalytics()
						plays = 0
					}
				}
			}
			console.log(table)
		} else if(choice == false && turn == false){
			if((x > 0 && x < 100) && (y > 0 && y < 100)){
				if(blockChoice.A1 != true){
					choiceDraw(1,choice)
					blockChoice.A1 = true
					if(choice == true){
						table[0][0] = 'X'
					} else {
						table[0][0] = 'O'
					}	
					updatePlays(1)
					tableAnalytics()
					if(plays == 9){
						tableAnalytics()
						plays = 0
					}
				}
			}
			if((x > 100 && x < 200) && (y > 0 && y < 100)){
				if(blockChoice.A2 != true){
					choiceDraw(2,choice)
					blockChoice.A2 = true
					if(choice == true){
						table[0][1] = 'X'
					} else {
						table[0][1] = 'O'
					}
					updatePlays(2)
					tableAnalytics()
					if(plays == 9){
						tableAnalytics()
						plays = 0
					}
				}
			}
			if((x > 200 && x < 300) && (y > 0 && y < 100)){
				if(blockChoice.A3 != true){
					choiceDraw(3,choice)
					blockChoice.A3 = true
					if(choice == true){
						table[0][2] = 'X'
					} else {
						table[0][2] = 'O'
					}
					updatePlays(3)
					tableAnalytics()
					if(plays == 9){
						tableAnalytics()
						plays = 0
					}
				}
			}
			
			//line 2
			
			if((x > 0 && x < 100) && (y > 100 && y < 200)){
				if(blockChoice.A4 != true){
					choiceDraw(4,choice)
					blockChoice.A4 = true
					if(choice == true){
						table[1][0] = 'X'
					} else {
						table[1][0] = 'O'
					}
					updatePlays(4)
					tableAnalytics()
					if(plays == 9){
						tableAnalytics()
						plays = 0
					}
				}
			}
			if((x > 100 && x < 200) && (y > 100 && y < 200)){
				if(blockChoice.A5 != true){
					choiceDraw(5,choice)
					blockChoice.A5 = true
					if(choice == true){
						table[1][1] = 'X'
					} else {
						table[1][1] = 'O'
					}
					updatePlays(5)
					tableAnalytics()
					if(plays == 9){
						tableAnalytics()
						plays = 0
					}
				}
			}
			if((x > 200 && x < 300) && (y > 100 && y < 200)){
				if(blockChoice.A6 != true){
					choiceDraw(6,choice)
					blockChoice.A6 = true
					if(choice == true){
						table[1][2] = 'X'
					} else {
						table[1][2] = 'O'
					}
					updatePlays(6)
					tableAnalytics()
					if(plays == 9){
						tableAnalytics()
						plays = 0
					}
				}
			}
			
			//line 3
			
			if((x > 0 && x < 100) && (y > 200 && y < 300)){
				if(blockChoice.A7 != true){
					choiceDraw(7,choice)
					blockChoice.A7 = true
					if(choice == true){
						table[2][0] = 'X'
					} else {
						table[2][0] = 'O'
					}
					updatePlays(7)
					tableAnalytics()
					if(plays == 9){
						tableAnalytics()
						plays = 0
					}
				}
			}
			if((x > 100 && x < 200) && (y > 200 && y < 300)){
				if(blockChoice.A8 != true){
					choiceDraw(8,choice)
					blockChoice.A8 = true
					if(choice == true){
						table[2][1] = 'X'
					} else {
						table[2][1] = 'O'
					}
					updatePlays(8)
					tableAnalytics()
					if(plays == 9){
						tableAnalytics()
						plays = 0
					}
				}
			}
			if((x > 200 && x < 300) && (y > 200 && y < 300)){
				if(blockChoice.A9 != true){
					choiceDraw(9,choice)
					blockChoice.A9 = true
					if(choice == true){
						table[2][2] = 'X'
					} else {
						table[2][2] = 'O'
					}
					updatePlays(9)
					tableAnalytics()
					if(plays == 9){
						tableAnalytics()
						plays = 0
					}
				}
			}
			console.log(table)
		}
	}
		
})
function drawX(area){
	switch(area){
		case 1:
			ctx.font = '48px Arial';
			ctx.fillText('X', 35, 65);
			break;
		case 2:
			ctx.font = '48px Arial';
			ctx.fillText('X', 35*3.9, 65);
			break;
		case 3:
			ctx.font = '48px Arial';
			ctx.fillText('X', 35*6.8, 65);
			break;
		case 4:
			ctx.font = '48px Arial';
			ctx.fillText('X', 35, 165);
			break;
		case 5:
			ctx.font = '48px Arial';
			ctx.fillText('X', 35*3.9, 165);
			break;
		case 6:
			ctx.font = '48px Arial';
			ctx.fillText('X', 35*6.8, 165);
			break;
		case 7:
			ctx.font = '48px Arial';
			ctx.fillText('X', 35, 265);
			break;
		case 8:
			ctx.font = '48px Arial';
			ctx.fillText('X', 35*3.9, 265);
			break;
		case 9:
			ctx.font = '48px Arial';
			ctx.fillText('X', 35*6.8, 265);
			break;
		default:
			break;	
	}
}
function drawCircle(area){
	switch(area){
		case 1:
			ctx.beginPath();
			ctx.arc(50, 50, 30, 0, Math.PI * 2, false)
			ctx.stroke();
			break;
		case 2:
			ctx.beginPath();
			ctx.arc(150, 50, 30, 0, Math.PI * 2, false)
			ctx.stroke();
			break;
		case 3:
			ctx.beginPath();
			ctx.arc(250, 50, 30, 0, Math.PI * 2, false)
			ctx.stroke();
			break;
		case 4:
			ctx.beginPath();
			ctx.arc(50, 150, 30, 0, Math.PI * 2, false)
			ctx.stroke();
			break;
		case 5:
			ctx.beginPath();
			ctx.arc(150, 150, 30, 0, Math.PI * 2, false)
			ctx.stroke();
			break;
		case 6:
			ctx.beginPath();
			ctx.arc(250, 150, 30, 0, Math.PI * 2, false)
			ctx.stroke();
			break;
		case 7:
			ctx.beginPath();
			ctx.arc(50, 250, 30, 0, Math.PI * 2, false)
			ctx.stroke();
			break;
		case 8:
			ctx.beginPath();
			ctx.arc(150, 250, 30, 0, Math.PI * 2, false)
			ctx.stroke();
			break;
		case 9:
			ctx.beginPath();
			ctx.arc(250, 250, 30, 0, Math.PI * 2, false)
			ctx.stroke();
			break;
		default:
			break;	
	}
}
function choiceDraw(area,key){
	if(key == true){
		drawX(area)
	} else {
		drawCircle(area)
	}
}
function reset(){
	ctx.reset()
	
	//primeira linha vertical
	ctx.fillRect(w/3, 0, 5, h);
	ctx.fillStyle = "black";

	//segunda linha vertical
	ctx.fillRect((w/3) * 2, 0, 5, h);
	ctx.fillStyle = "black";

	//primeira linha horizontal
	ctx.fillRect(0, h/3, w, 5);
	ctx.fillStyle = "black";

	//segunda linnha horizontal
	ctx.fillRect(0, (h/3)*2, w, 5);
	ctx.fillStyle = "black";
	
	blockChoice.A1 = null
	blockChoice.A2 = null
	blockChoice.A3 = null
	
	blockChoice.A4 = null
	blockChoice.A5 = null
	blockChoice.A6 = null
	
	blockChoice.A7 = null
	blockChoice.A8 = null
	blockChoice.A9 = null
	
	table = [[1,2,3],[4,5,6],[7,8,9]]
}

function tableAnalytics(){
	let nA = new Analytics
	let winner = false;

	if(choice == true){
		if(nA.AnalyticGroup1.analytic() == 1){
			winner = true
	
			socket.emit("updatePoint",{
				"p1":true,
				"p2":null
			})
			console.log("group1 - 1")
			socket.emit("reset")
			reset()
		}
		if(nA.AnalyticGroup2.analytic() == 1){
			winner = true
	
			socket.emit("updatePoint",{
				"p1":true,
				"p2":null
			})
			console.log("group2")
			socket.emit("reset")
			reset()
		}
		if(nA.AnalyticGroup3.analytic() == 1){

			winner = true
			socket.emit("updatePoint",{
				"p1":true,
				"p2":null
			})
			console.log("group3 - 1")
			socket.emit("reset")
			reset()
		}
	} else {
		if(nA.AnalyticGroup1.analytic() == 2){

			winner = true
			socket.emit("updatePoint",{
				"p1":null,
				"p2":true
			})
			console.log("group1 - 2")
			socket.emit("reset")
			reset()
		}
	
		if(nA.AnalyticGroup2.analytic() == 2){
			winner = true

			socket.emit("updatePoint",{
				"p1":null,
				"p2":true
			})
			console.log("group2")
			socket.emit("reset")
			reset()
		}
		
		if(nA.AnalyticGroup3.analytic() == 2){

			winner = true
			socket.emit("updatePoint",{
				"p1":null,
				"p2":true
			})
			console.log("group3")
			socket.emit("reset")
			reset()
		}
	}
	
	
	if(plays == 9 && winner == false){

		socket.emit("updatePoint",{
			"p1":null,
			"p2":null
		})

		console.log("empate")
		socket.emit("reset")
		reset()
	}
}