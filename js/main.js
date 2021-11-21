import {Card} from './card.js';

export var pauseGame = false;
export let revealed = [];
var removed = [];
var numOfCards;
var time;
var sec;
var min;
var countMistakes = 0;
var messageTime = 1500;
var board = document.getElementById("board");
var images = [ 
    'images\\arrow.jpg',
    'images\\circle.png',
    'images\\cloud.jpg',
    'images\\dimnd.png',
    'images\\sqr.png',
    'images\\ellipse.png',
    'images\\hex.png', 
    'images\\moon.jpg',
    'images\\pentagon.png',
    'images\\plus.png',
    'images\\rectngl.png', 
    'images\\sqr.png',
    'images\\star.png',
    'images\\triangle.png',
    'images\\trpz.png'
];


/* when clicking this button, toggle between hiding and showing the list of number of cards */
function startGame() {
    document.getElementsByClassName("levels-list")[0].classList.toggle("show");
  }
window.startGame = startGame;

// close the list if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('#start-button')) {
      var dropdowns = document.getElementsByClassName("levels-list");
      for (var i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
}  

// when clicking the selected number of cards - Start Game: 
// arrange/rearrange board, start/restart timer and reset variables
function quantity(num){

    arrangeBoard(num);

    // change buttons and show timer and mistakes:
    document.getElementById('start-button').innerHTML = 'Cards: '+num;
    document.getElementById('pause').style.backgroundColor = ' #3498DB';
    document.getElementById('info').children[0].style.visibility = 'visible';
    document.getElementById('info').children[1].style.visibility = 'visible';

    // reset variables
    revealed = [];
    removed = [];
    pauseGame = false;

    // reset mistakes:
    document.getElementById('mistakes').innerHTML='Mistakes: 0';
    countMistakes=0;

    // start or restart timer:
    timer.innerHTML= "0:00";
    sec=0;
    min=0;
    clearInterval(time);
    time = false;
    time = setInterval(countTime, 1000);

}
window.quantity = quantity;

// set size of board, create cards and attach their images, and shuffle cards.
function arrangeBoard(num){
    numOfCards = num;
    switch(numOfCards){
        case 12:
            board.style.maxWidth = '753px';
            break;
        case 18:
            board.style.maxWidth = '1117px';
            break;
        case 24:
            board.style.maxWidth = '1481px';
            break;
        case 30:
            board.style.maxWidth = '1845px';
            break;
    }

    // clean board, create cards and attach their images:
    var numOfImages=numOfCards/2;
    var cards = [];
    for (var i=0; i<numOfImages; i++){
        var card1 = new Card(i);            
        var card2 = new Card(i+numOfImages);
        card1.attachImage(images[i]);
        card2.attachImage(images[i]);
        cards.push(card1, card2);
    }

    // shuffle cards and set them on the board:
    board.innerHTML = '';
    cards = cards.sort(() => Math.random() - 0.5);
    for (var i=0; i<numOfCards; i++){
        board.appendChild(cards[i].element);
    }
}

// time function
function countTime(){
    sec++;
    if (sec>59){
        sec=0;
        min++;
        if (min>59){
            min=0;
        }
    }
    if (sec<10){
        sec = ''+ sec;
        timer.innerHTML= min + ":0" + sec;
    } else{
        timer.innerHTML= min + ":" + sec;
    }
}

// when clicking the pause button - time stops and can't reveal any card
function pause(){
    if (pauseGame == false ){
        clearInterval(time);
        time = false;
        pauseGame = true;
        event.target.style.backgroundColor = 'darkblue';
    } else{
        time = setInterval(countTime, 1000);
        pauseGame=false;
        event.target.style.backgroundColor = ' #3498DB';
    }
}
window.pause = pause;

// compare after revealing 2 cards
export function compareCards(){
    if (revealed[0].image.getAttribute("src")==revealed[1].image.getAttribute("src")) {
        message.innerHTML="Very Good!";
        setTimeout(removeCards, messageTime);
    } else {
        message.innerHTML="Almost... try again.";
        countMistakes++;
        document.getElementById('mistakes').innerHTML= 'Mistakes: '+ countMistakes;
        setTimeout(turnBackOver, messageTime);
    }
}

// if cards don't match, turn them back over
function turnBackOver(){
    message.innerHTML = '';
    revealed[0].hideCard();
    revealed[1].hideCard();
    revealed = [];
}

// if cards match, remove them.
function removeCards(){
    message.innerHTML = '';
    revealed[0].removeCard();
    revealed[1].removeCard();
    removed.push(revealed[0], revealed[1]);
    if (removed.length == numOfCards){
        gameOver();
    }
    revealed = [];
}

// if all cards are removed, time stops and Well Done message appears
function gameOver(){
    board.innerHTML = "";
    var endMessage = document.createElement('h1');
    endMessage.setAttribute("id", 'end-message');
    endMessage.appendChild(document.createTextNode("Well Done!"));
    board.appendChild(endMessage);
    clearInterval(time);
}
