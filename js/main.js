// variables:
var pauseGame = false;
var numOfCards = 12;
var cards = [...Array(12).keys()];
var cardColor = ' #2980b9';
var revealed = [];
var hidden = [];
var countMistakes = 0;
var time;
var timer = document.getElementById("timer");
var buttonStart = document.getElementById("btnstart");
var start = false;
var message = document.getElementById("message");
var messageTime = 1500;
var board = document.getElementById("board");
var width = '753px';
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
    'images\\trpz.png'];



/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function startGame() {
    document.getElementsByClassName("levels-list")[0].classList.toggle("show");
  }

// select the number of cards for the game
function quantity(num){
    numOfCards = num;
    document.getElementById('start-button').innerHTML = 'Cards: '+numOfCards;
    cards = [...Array(numOfCards).keys()];
    switch(numOfCards){
        case 12:
            width = '753px';
            break;
        case 18:
            width = '1117px';
            break;
        case 24:
            width = '1481px';
            break;
        case 30:
            width = '1845px';
            break;
    }
    startOrStopGame()
}

// Close the dropdown if the user clicks outside of it
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

// start or restart the game
function startOrStopGame(){
    start = true;
    document.getElementById('info').children[0].style.visibility = 'visible';
    document.getElementById('info').children[1].style.visibility = 'visible';
    timer.innerHTML= "0:00";
    document.getElementById('mistakes').innerHTML='Mistakes: 0';
    arrangeBoard();
    sec=0;
    min=0;
    clearInterval(time);
    time = false;
    pauseGame = false;
    document.getElementById('pause').style.backgroundColor = ' #3498DB';
    time = setInterval(countTime, 1000);
    suffleCards();
    resetCards();
}

function arrangeBoard(){
    board.style.maxWidth = width;
    board.innerHTML = '';
    for (var i=0; i<numOfCards; i++){
        var card = document.createElement('div');
        card.setAttribute("id", "_"+i);
        card.setAttribute("class", "card");
        card.setAttribute("onclick", 'revealCard("_'+i+'")');
        board.appendChild(card);
    }
}

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

function resetCards(){
    revealed = [];
    hidden = [];
    countMistakes=0;
    for (var i=0; i<cards.length; i++){
        var card = document.getElementById("_"+cards[i]);
        var image = card.firstElementChild;
        card.style.visibility = "visible";
        card.style.backgroundColor = cardColor;
        image.style.visibility = "hidden";    
    }
}

// suffle and attach images to cards:
function suffleCards(){
    cards = cards.sort(() => Math.random() - 0.5);
    var numOfImages=numOfCards/2;
    for (var i=0; i<numOfImages; i++){
        card_1 = document.getElementById("_"+cards[i]);
        card_2 = document.getElementById("_"+cards[i+numOfImages]);
        card_1.innerHTML = '';
        card_2.innerHTML = '';
        var image1 = document.createElement('img');
        var image2 = document.createElement('img');
        image1.setAttribute("src", images[i]);
        image2.setAttribute("src", images[i]);
        card_1.appendChild(image1);
        card_2.appendChild(image2);
    }
}

function pause(){
    if (start==true){
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
}

// reveal a card on click:
function revealCard(id){
    var card = document.getElementById(id);
    if (revealed.length < 2 & start == true & pauseGame==false
            & card.style.backgroundColor != "white") {
        card.style.backgroundColor = "white";
        card.children[0].style.visibility = "visible";
        revealed.push(id);
        if (revealed.length == 2){
            compareCards();
        }   
    }
}

// compare after revealing 2 cards:
function compareCards(){
        card1 = document.getElementById(revealed[0]);
        card2 = document.getElementById(revealed[1]);
        image1 = card1.children[0];
        image2 = card2.children[0];
        // if cards match:
        if (image1.getAttribute("src")==image2.getAttribute("src")) {
            message.innerHTML="Very Good!";
            setTimeout(removeCards, messageTime);
        // if cards don't match:
        } else {
            countMistakes++;
            document.getElementById('mistakes').innerHTML= 'Mistakes: '+ countMistakes;
            message.innerHTML="Almost... try again.";
            setTimeout(turnBackOver, messageTime);
        }
        // wait until cards are removed/turned over to enable revealing another card:
        setTimeout(function(){revealed = [];}, messageTime);
}

// if cards don't match, turn them back over:
function turnBackOver(){
    message.innerHTML = '';
    card1.style.backgroundColor = cardColor;
    image1.style.visibility = "hidden";
    card2.style.backgroundColor = cardColor;
    image2.style.visibility = "hidden";
}

// if cards match, remove them:
function removeCards(){
    message.innerHTML = '';
    card1.style.visibility = "hidden";
    card2.style.visibility = "hidden";
    image1.style.visibility = "hidden";
    image2.style.visibility = "hidden";
    hidden.push(revealed[0], revealed[1]);
    // if all cards were removed, show end of game message:
    if (hidden.length == numOfCards){
        board.innerHTML = "";
        var endMessage = document.createElement('h1');
        endMessage.setAttribute("id", 'end-message');
        endMessage.appendChild(document.createTextNode("Well Done!"));
        board.appendChild(endMessage);
        clearInterval(time);
    }
}