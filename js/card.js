import {compareCards, revealed, pauseGame} from './main.js';
// test
export class Card {
    constructor(id){
    this.state = 'Hidden';
    this.element = document.createElement('div');
    this.element.setAttribute("id", "_"+id);
    this.element.classList.add("card");
    this.element.addEventListener('click', event => this.cardClick());
    this.cardColor = this.element.style.background;

    this.innerElement = document.createElement('div');
    this.innerElement.classList.add('card-inner');
    this.element.appendChild(this.innerElement);


    this.back =  document.createElement('div');
    this.back.classList.add('card-back');
    this.innerElement.appendChild(this.back);

    this.front = document.createElement('div');
    this.front.classList.add('card-front');
    this.innerElement.appendChild(this.front);

    this.image = document.createElement('img');
    this.front.appendChild(this.image);

    // console.log(this.element.classList);
    }

    get color(){
        return this.element.style.background;
    }

    set color(color){
        this.element.style.background = color;
    }

    attachImage(image){
        this.image.setAttribute("src", image);
    }

    cardClick(){
        if (revealed.length < 2 & pauseGame==false & this.state == 'Hidden'){
            this.revealCard();
            revealed.push(this);
            if (revealed.length == 2){
                compareCards();
            }
        }
    }

    revealCard(){
        this.state = 'Revealed';
        this.element.style.transform = 'rotateY(180deg)';
        this.innerElement.style.transform = 'rotateY(180deg)';
        this.image.style.transform = 'rotateY(180deg)';
    }

    hideCard(){
        this.color = this.cardColor;
        this.state = "Hidden";
        this.element.style.transform = '';
        this.innerElement.style.transform = '';
        this.image.style.transform = '';
    }

    removeCard(){
        this.element.style.visibility = 'hidden';
        this.image.style.visibility = 'hidden';
        this.state = 'Removed';
    }

}