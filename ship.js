var game = {
	boardSize: 7,
	numShips: 5,
	shipSunk: 0,
	attempts: [],
	shots: 0,
	gameFinished: false,

	ships: [{shipLen:4, location: [], hits:0, isSunk:false},
			{shipLen:3, location: [], hits:0, isSunk:false},
			{shipLen:3, location: [], hits:0, isSunk:false},
			{shipLen:2, location: [], hits:0, isSunk:false},
			{shipLen:2, location: [], hits:0, isSunk:false}],

	alocate: function(){
		for (var i=0; i<this.numShips; i++){
			while(this.ships[i].location.length == 0){
				var orientation = Math.floor(Math.random()*10);
				if (orientation%2 == 0){
					//vertical
					var col = Math.floor(Math.random()*this.boardSize);
					var row = Math.floor(Math.random()*(this.boardSize - this.ships[i].shipLen));
					var perhapsLocation = [];
					for (var j=0; j<this.ships[i].shipLen; j++) {
						var xy = (row+j) + "" + col;
						perhapsLocation.push(xy);
					}
					if (this.isEmpty(perhapsLocation)){
						this.ships[i].location = perhapsLocation; 

					}
				}
				else{
					//horizontal
					var row = Math.floor(Math.random()*this.boardSize);
					var col = Math.floor(Math.random()*(this.boardSize - this.ships[i].shipLen));
					var perhapsLocation = [];
					for (var j=0; j<this.ships[i].shipLen; j++){
						var xy = row + "" + (col+j);
						perhapsLocation.push(xy);
					}
					if (this.isEmpty(perhapsLocation)){
						this.ships[i].location = perhapsLocation;
					}
				}
			}
		}
	},

	isEmpty: function(locationArray){
		for (var q=0; q<locationArray.length; q++){  
			for (var r=0; r<this.numShips; r++){      
				for (var p=0; p<this.ships[r].shipLen; p++){    
					if (this.ships[r].location[p] == locationArray[q]){
						console.log("Pole zajęte: " + locationArray[q]);
						return false;
					}
				}	
			}
		}
		console.log("Pole puste" + locationArray);
		return true;
	},

	validate: function(guess){
		alfabet = ["A", "B", "C", "D", "E", "F", "G"];
		if(this.gameFinished == false){
			if (guess===null || guess.length != 2){
				interact.message("Podaj dane w odpowiednim formacie");
				return null;
			}
			else{
				guessChar = guess.charAt(0).toUpperCase();
				row = alfabet.indexOf(guessChar);
				col = Number(guess.charAt(1));
				if ((row>=0 && row<this.boardSize)&&(col>=0 && col<this.boardSize)){
					strGuess = row.toString() + col.toString();
					this.shots++;
					if (this.attempts.length){
						for (var i=0; i<this.attempts.length; i++){
							if (this.attempts[i]==strGuess){
								interact.message("Tam już próbowałeś");
								return null;
							}
						}
					}
					this.attempts.push(strGuess);
					this.shoot(strGuess);
					return strGuess;
				}
				else{
					interact.message("Podaj dane w odpowiednim formacie");
					return null;
				}
			}
		}
	},

	shoot: function(inputShot){
		for (var n=0; n<this.numShips; n++){
			for (var m=0; m<this.ships[n].location.length; m++){
				if (this.ships[n].location[m] == inputShot){
					this.ships[n].hits++;
					interact.hit(inputShot);
					if (this.isSunk(n)){
						this.ships[n].isSunk = true;
						this.shipSunk++;
						interact.sunk(n);
						if (this.endGame()){
							interact.gameOver();
						}
					}
				return true;
				}
			}
		}
		interact.miss(inputShot);
		return false;
	},

	isSunk: function(n){
		if(this.ships[n].hits == this.ships[n].shipLen){
			return true;
		}
	},

	endGame: function(){
		if (this.numShips == this.shipSunk){
			return true;
		}
	}
}

var interact = {
	hit: function(inputShot) {
		document.getElementById(inputShot).setAttribute("class", "hit");
		this.message("Fuksiarzu! Trafiłeś!");
	},

	miss: function(inputShot){
		document.getElementById(inputShot).setAttribute("class", "miss");
		this.message("Nie tym razem ;)");
	},

	sunk: function(n){
		for (var z=0; z<game.ships[n].shipLen; z++){
			document.getElementById(game.ships[n].location[z]).setAttribute("class", "sunk");
			document.getElementById("s"+n+z).setAttribute("class", "sunk");

		}
		this.message("Zatopiłeś mnie :[");
	},

	message: function(infoMessage){
		var message = document.getElementsByClassName("info")[0];
		message.innerHTML = infoMessage;
	},

	gameOver: function(){
		this.message("Koniec gry. Gratulacje! potrzebowałeś " + game.shots + " strzałów");
		document.getElementsByTagName("button")[0].setAttribute("class", "inactive");
		game.gameFinished = true;
		newGame.restartGame();
		//document.getElementById("hitButton").removeEventListener("click", handleHitButton);
		//document.getElementById("hitButton").removeEventListener("keypress", handleFireEnter);
	}
}

var newGame = {
	restartGame: function(){
		const divReset = document.createElement("div");
		const divExit = document.createElement("div")
		divReset.innerHTML = "<div class='restart'>Zagraj ponownie </div>";
		divExit.innerHTML = "<div class='goHome'> A idź pan </div>";
		document.getElementsByClassName("info")[0].appendChild(divReset);
		document.getElementsByClassName("info")[0].appendChild(divExit);
		document.getElementsByClassName('restart')[0].onclick = this.playAgain;
		document.getElementsByClassName('goHome')[0].onclick = this.dontPlay;
	},

	playAgain: function(){
		location.reload();
	},

	dontPlay: function(){
		document.getElementsByTagName("body")[0].innerHTML = "";
		const foch = document.createElement("div");
		foch.innerHTML = "<h2 class='dontPlay'> NIE TO NIE. </h2>";
		document.body.appendChild(foch);
	}
}

function handleHitButton(){
	var inputValue = document.getElementById("guessInput");
	var loc = inputValue.value;
	game.validate(loc);
	inputValue.value = "";	
}

function handleFireEnter(e){
	if (e.keyCode === 13){
		handleHitButton();
		return false;
	}
}

function handleClickArea(eventObj){
	var idTarget = eventObj.target.id;
	var convertRow = idTarget.charAt(0);
	const alfabet = ["A", "B", "C", "D", "E", "F", "G"];
	var converted = alfabet[convertRow];
	var clickedHit = converted + "" + idTarget.charAt(1);
	game.validate(clickedHit);
}


function init(){
	game.alocate();
	document.getElementById("hitButton").onclick = handleHitButton;
	document.getElementById("guessInput").onkeypress = handleFireEnter;
	areas = document.getElementsByTagName("td");
	for (var i = 0; i<areas.length; i++){
		areas[i].onclick = handleClickArea;
	}
	//document.getElementById("hitButton").addEventListener("click", handleHitButton);
	//document.getElementById("guessInput").addEventListener("keypress", handleFireEnter);

	for (var i=0; i<game.numShips; i++){
		for (var j=0; j<game.ships[i].shipLen; j++){
			var shipId = "s"+i+j;
			document.getElementById(shipId).setAttribute("class", "hidden");
		}
	}
}

window.onload = init;