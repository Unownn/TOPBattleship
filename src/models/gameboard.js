export class Gameboard {
    constructor(){
        // Board: Empty 10x10 board
        // hitBoxes: set of variables containing hit
        // shipAt: set of variables containing ships
        this.board = this.generate();
        this.hitBoxes = new Set();
        this.shipAt = new Set();
    }

    // Generate a 10x10 board with nulls
    generate(){
        let out = [];
        for(let i = 0; i < 10; i++){
            for(let j = 0; j < 10; j++){
                out.push(null);
            }
        }
        return out;
    }

    placeShip(ship, coord){
        // X axis placement [y, x]
        if(ship.xAxis === true){
            // If length overreaches board bounds
            if((ship.length + coord[1]) > 9){
                return false;
            }
            // If ship already on the placement
            for(let i = coord[1]; i < coord[1] + ship.length; i++){
                if(this.shipAt.has(toKey([coord[0], i]))){return false;}
            }
            // Redo the loop to place ship
            for(let i = coord[1]; i < coord[1] + ship.length; i++){
                this.shipAt.add(toKey([coord[0], i]));
                this.board[toKey([coord[0], i])] = ship;
            }
            return true;
        }
        // Y axis placement [y, x]
        else{
            // If length overreaches board bounds
            if((ship.length + coord[0]) > 9){
                return false;
            }
            // If ship already on the placement
            for(let i = coord[0]; i < coord[0] + ship.length; i++){
                if(this.shipAt.has(toKey([i, coord[1]]))){return false;}
            }
            // Place ship
            for(let i = coord[0]; i < coord[0] + ship.length; i++){
                this.shipAt.add(toKey([i, coord[1]]));
                this.board[toKey([i, coord[1]])] = ship;
            }
            return true;
        }
    }

    receiveAttack(xy){
        // Ignore squares already hit
        if(this.hitBoxes.has(toKey(xy))){
            return false;
        }

        // Invalid coordinates
        if(xy[0] > 9 || xy[1] > 9 || xy[0] < 0 || xy[1] < 0){
            return false;
        }

        // See if there is a ship in the coordinate
        if(this.board[toKey(xy)]){
            this.board[toKey(xy)].hit();
        }

        // Add the hit square to the set
        this.hitBoxes.add(toKey(xy));

        return true;
    }
}

const toKey = ([x,y]) => `${x}${y}`;

//module.exports = { Gameboard };