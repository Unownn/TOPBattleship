export class Ship {
    constructor(length){
        this.length = length; // HP
        this.hits = 0;
        this.sunk = false;
        this.xAxis = true;
    }

    hit(){
        // If sunk, pass
        if(this.sunk){return;}
        this.hits++;
        this.isSunk();
    }

    isSunk(){
        if(this.hits >= this.length){
            this.sunk = true; 
        }
    }

    swithAxis(){
        this.xAxis = !this.xAxis;
    }
}


//module.exports = { Ship };