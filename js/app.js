"use strict";

var height = 83,
    width = 101;
    // defaultPlayerX = width  * 2
    // defaultPlayerY = height * 5;

var Charactor = function (pics,speed,x_def,y_def,x_min,y_min,x_max,y_max) {
    this.sprite = pics;
    this.x_def = x_def || 0;
    this.y_def = y_def || 0;
    this.x_min = x_min || 0 ;
    this.y_min = x_min || 0 ;

    this.x_max = x_max || 1000 ;
    this.y_max = y_max || 1000 ;

    this.x = this.x_def;
    this.y = this.y_def;

    this.speed = speed || 1;
    this.x_speed = 0;
    this.y_speed = 0;
}

Charactor.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x  , this.y  );
};

Charactor.prototype.resetPosition = function () {
    this.x = this.x_def;
    this.y = this.y_def;
    this.x_speed = 0;
    this.y_speed = 0;
};


Charactor.prototype.boundaryChecker = function (dt) {
    var result_max_x  = this.x + this.x_speed * dt > this.x_max ? true : false,
        result_max_y  = this.y + this.y_speed * dt > this.y_max ? true : false,
        result_min_x  = this.x + this.x_speed * dt < this.x_min ? true : false,
        result_min_y  = this.y + this.y_speed + dt < this.y_min ? true : false;
    return result_max_x || result_max_y || result_min_x || result_min_y;
}

Charactor.prototype.waterChecker = function () {
    return this.y  < this.y_min   ? true : false;
}



// Enemies our player must avoid
var Enemy = function() {
    Charactor.call(this,arguments);
    // this.sprite = 'images/enemy-bug.png';
    // this.x = x || 0;
    // this.y = y || 0;
    // this.speed = speed || 1;
};
Enemy.prototype = Object.create(Charactor.prototype);
Enemy.prototype.constractor = Enemy;

Enemy.prototype.checkCollisions = function(){

    if ( player.x - 20  <  this.x && player.x + 20  > this.x &&
         player.y - 20  <  this.y && player.y + 20  > this.y ){
         player.resetPosition();
    }

};

Enemy.prototype.update = function(dt) {
    this.x  = this.x + ( this.speed * dt );
    // [TODO] handle colision with Player
    this.checkCollisions();
        //  checkCollisions
};

// Draw the enemy on the screen, required method for game
// Enemy.prototype.render = function() {
//     ctx.drawImage(Resources.get(this.sprite), this.x  , this.y  );
// };

var Player = function () {
    Charactor.call(this,arguments);
    this.handle = "";
    // console.dir(this.x);
}
Player.prototype = Object.create(Charactor.prototype);
Player.prototype.constractor = Player;
// Player.prototype.boundaryChecker = function (dt) {
//     var result_max_x  = this.x + this.x_speed * dt > this.x_max ? true : false,
//         result_max_y  = this.y + this.y_speed * dt > this.y_max ? true : false;
//         result_min_x  = this.x + this.x_speed * dt < this.x_min ? true : false;
//         result_min_y  = this.y + this.y_speed + dt < this.y_min ? true : false;
//     return result_max_x || result_max_y || result_min_x || result_min_y;
// };


// Player.prototype.waterChecker = function () {
//     return this.y  < this.y_min   ? true : false;
// }

Player.prototype.update = function(dt) {

    if (typeof dt !== 'number'){
       dt = 1;
    }

    if ( ! this.boundaryChecker(dt) ){
      this.x  = this.x +  this.x_speed * dt;
      this.y  = this.y +  this.y_speed * dt;
    };

    if ( this.waterChecker() ){
      this.resetPosition();
    }

};

// Player.prototype.render = function() {
//     ctx.drawImage(Resources.get(this.sprite), this.x , this.y);
// };

Player.prototype.handleInput = function (code) {
  if ( typeof code === 'string'){

    if ( code === 'left' || code === 'up' )  {
      this.speed = Math.abs(this.speed) * -1;
    } else if ( code === 'right' || code === 'down' ) {
      this.speed = Math.abs(this.speed);
    }

    if ( code === 'left' || code === 'right' )  {
      this.x_speed = this.speed;
      this.y_speed = 0;
    }else if ( code === 'up' || code === 'down' ) {
      this.x_speed = 0;
      this.y_speed = this.speed;
    }

  }
};

// Player.prototype.resetPosition = function () {
//     this.x = this.x_def;
//     this.y = this.y_def;
//     this.x_speed = 0;
//     this.y_speed = 0;
// };

var allEnemies = [];
allEnemies.push(new Enemy('images/enemy-bug.png', 50 , - width, 0 ));
allEnemies.push(new Enemy('images/enemy-bug.png', 100, - width, height ));
allEnemies.push(new Enemy('images/enemy-bug.png', 150, - width, height * 2 ));
allEnemies.push(new Enemy('images/enemy-bug.png', 150, - width, height * 3 ));
// var player = new Player(4,defaultPlayerX,defaultPlayerY,0,0,415,415);
var player = new Player('images/char-boy.png');


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
