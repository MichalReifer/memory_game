import {Card} from './card.js';

var startGame = false;
export var pauseGame = false;
export let revealed = [];
var removed = [];
var numOfCards;
var time;
var sec;
var min;
var countMistakes = 0;
var messageTime = 1500;
var board = $("#board");
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

/* JQuery */ 
$(document).ready(function(){
    alert("Jquery Loaded");
});

/* when clicking this button, toggle between hiding and showing the list of number of cards */
$('#start-button').click(function startGame() {
    $(".levels-list")[0].classList.toggle("show");
});   

// close the list if the user clicks outside of it
$(window).click(function(event) {
    if ($(event.target).attr('id')!='start-button') {
      $(".levels-list").removeClass('show');
    }
});  

// when clicking the selected number of cards - Start Game: 
// arrange/rearrange board, start/restart timer and reset variables
function quantity(num){

    startGame = true;
    arrangeBoard(num);

    // change buttons and show timer and mistakes:
    $('#start-button').html('Cards: '+num);
    $('#pause').removeClass('press-pause');
    $('#info').children().css('visibility', 'visible');

    // reset variables
    revealed = [];
    removed = [];
    pauseGame = false;

    // reset mistakes:
    $('#mistakes').html('Mistakes: 0');
    countMistakes=0;

    // start or restart timer:
    $('#timer').html("0:00");
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
            board.css('maxWidth','753px');
            break;
        case 18:
            board.css('maxWidth','1117px');
            break;
        case 24:
            board.css('maxWidth','1481px');
            break;
        case 30:
            board.css('maxWidth','1845px');
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
    board.html('');
    cards = cards.sort(() => Math.random() - 0.5);
    for (var i=0; i<numOfCards; i++){
        board.append(cards[i].element);
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
        $('#timer').html(min + ":0" + sec);
    } else{
        $('#timer').html(min + ":" + sec);
    }
}

// when clicking the pause button - time stops and can't reveal any card
$('#pause').click(function pause(){
    if (startGame) {
        this.classList.toggle("press-pause");
        pauseGame = pauseGame ? false : true;
        // stop timer:
        if (time){
            clearInterval(time);
            time = false;
        } else{
            time = setInterval(countTime, 1000);
        }
    }
});


// compare after revealing 2 cards
export function compareCards(){
    if (revealed[0].image.getAttribute("src")==revealed[1].image.getAttribute("src")) {
        $('#message').html("Very Good!");
        setTimeout(removeCards, messageTime);
    } else {
        $('#message').html("Almost... try again.");
        countMistakes++;
        $('#mistakes').html('Mistakes: '+ countMistakes);
        setTimeout(turnBackOver, messageTime);
    }
}

// if cards don't match, turn them back over
function turnBackOver(){
    $('#message').html('');
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
    board.html("");
    board.append($('<h1 id="end-message">Well Done!</h1>'));
    clearInterval(time);
}
