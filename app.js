/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLOBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

My rules
- Use two dices,
- When when is a 1 current player looses current point
- When user rolls two 6 twice, current player looses current point and entire score(Be wise, LOL)

*/


//change the value of the HTML document directly from JavaScript using DOM
var scores, roundScore, activePlayer, isGamePlaying, winningScore, isScoreTextEnabled, lastTopDice6, lastBottomDice6;


init();



function init() {
	
	isGamePlaying = true;
	previous6 = 0;
	scores = [0,0];//variable to save the user global scores
	roundScore = 0;//current played score
	activePlayer = 0;//current player 0: player 1 and  1: player 2. This is 0/1 because it will be used as an index on scores.
	winningScore = 100;//default
	resetLastDice6ToZero();
	
	
	hideOrShowDiceImage(true);
	scoreValueField(false);
	
	document.querySelector('.score_form').reset();
	document.getElementById('name-0').textContent = 'Player 1';
	document.getElementById('name-1').textContent = 'Player 2';
	document.getElementById('score-0').textContent = '0';
	document.getElementById('score-1').textContent = '0';
	document.getElementById('current-0').textContent = '0';
	document.getElementById('current-1').textContent = '0';
	
	document.querySelector('.player-0-panel').classList.remove('winner');
	document.querySelector('.player-1-panel').classList.remove('winner');
	document.querySelector('.player-0-panel').classList.remove('active');
	document.querySelector('.player-1-panel').classList.remove('active');
	document.querySelector('.player-0-panel').classList.add('active');
	
}

function hideOrShowDiceImage(hide) {
	if (hide) {
		document.querySelector('.dice').style.display = 'none';
		document.querySelector('.dice_2').style.display = 'none';
	}
	else {
		document.querySelector('.dice').style.display = 'block';
		document.querySelector('.dice_2').style.display = 'block';
	}
}

//Diable input field when game is on or Enable when game is done
function scoreValueField(enable) {
	isScoreTextEnabled = enable;
	document.getElementById('input_score').disabled = enable;
}

function setScoreInputValue() {
	document.getElementById('input_score').value = 'Winning Score = ' +winningScore;
}

function buttonRoll() {
	//Only roll dice when game is on play, i.e, not winner yet.
	if (isGamePlaying) {
		if (!isScoreTextEnabled) {
			var insertedScore = Number(document.getElementById('input_score').value);
			if (winningScore !== insertedScore && insertedScore !== 0) {
				winningScore = insertedScore;
				setScoreInputValue();
			}
			else if(insertedScore === 100) {
				setScoreInputValue();
			}
		}
		scoreValueField(true);
		
		setDiceImage();
	}
}


function setDiceImage() {
	
	//random button
	var dice = Math.floor(Math.random() * 6) + 1;//get a random value of 0 - 5, floor to int and add 1 for value 1 - 6 as it is on a dice
	var dice_2 = Math.floor(Math.random() * 6) + 1;


	//set image of button value on view
	var diceDOM = document.querySelector('.dice');
	var diceDOM_2 = document.querySelector('.dice_2');
	//diceDOM.style.display = 'block';//make image visible
	diceDOM.src = 'dice-' +dice +'.png';
	diceDOM_2.src = 'dice-' +dice_2 +'.png';
	//make image visible
	hideOrShowDiceImage(false);
	
	
	//update ther roundscore with random value
	//if dice is greater than 1 add else remove score and move to next
	
	//When the play rolls two 6 twice then he looses the entire score
	//console.log('Current 6, Top: ' +dice +' Bottom: ' +dice_2 +' lastTop: ' +lastTopDice6 +' bottom: ' +lastBottomDice6);
	if (dice === 6 && dice_2 === 6 && lastTopDice6 === 6 && lastBottomDice6 === 6) {
		scores[activePlayer] = 0;
		document.getElementById('score-' +activePlayer).textContent = '0';
		
		//Next player
		nextPlayer();
	}
	else {
		if (!(dice === 1 || dice_2 === 1)) {
			resetLastDice6ToZero();
			//Add dice points
			roundScore = roundScore + dice + dice_2;
			document.querySelector('#current-' +activePlayer).textContent = roundScore; //setting new dice current score value

		}
		else {
			//Next player
			nextPlayer();
		}
	}
	
	//When user roll two 6, save the 6 once so it records for consecutive times
	if (lastTopDice6 !==6 && lastBottomDice6 !== 6) {
		lastTopDice6 = dice;
		lastBottomDice6 = dice_2;
	}
	//console.log('Previous 6, Top: ' +lastTopDice6 +' Bottom: ' +lastBottomDice6);
	
}


function nextPlayer() {
	
	roundScore = 0;
	resetLastDice6ToZero();
	activePlayer === 0 ? activePlayer = 1 : activePlayer = 0;
		
	document.getElementById('current-0').textContent = '0';
	document.getElementById('current-1').textContent = '0';

	//change active class on player view

	//document.querySelector('.player-0-panel').classList.remove('active');
	//document.querySelector('.player-1-panel').classList.add('active');

	//use toggle to change active class, this will remove is added or add if removed.
	document.querySelector('.player-0-panel').classList.toggle('active');
	document.querySelector('.player-1-panel').classList.toggle('active');

	//let hide the dice image when dice is one as a reset.
	hideOrShowDiceImage(true);
}

function resetLastDice6ToZero() {
	lastTopDice6 = 0;//default
	lastBottomDice6 = 0;//default
}


//click listener for new button using querySelector
document.querySelector('.btn-new').addEventListener('click', init);//Using call back function
//click listener for roll dice button using querySelector
document.querySelector('.btn-roll').addEventListener('click', buttonRoll);//Using call back function
//click listener for hold dice button 
document.querySelector('.btn-hold').addEventListener('click', function() {
	
	//Only roll dice when game is on play, i.e, not winner yet.
	if (isGamePlaying) {
		//Add current points to global points
		scores[activePlayer] += roundScore;
		document.getElementById('score-' +activePlayer).textContent = scores[activePlayer];

		//check winner if player is above 100 points
		if (scores[activePlayer] >= winningScore) {
			isGamePlaying = false;
			//set winner style class
			hideOrShowDiceImage(true);
			document.querySelector('#name-' +activePlayer).textContent = 'Winner!';
			document.querySelector('.player-' +activePlayer+ '-panel').classList.add('winner');
			document.querySelector('.player-' +activePlayer+ '-panel').classList.remove('active');
		}
		else {
			//Next player
			nextPlayer();
		}
	}
	
});//Using anonymous function.



