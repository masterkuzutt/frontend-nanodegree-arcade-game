// initial settings.
var height = 83,
    width = 101,
    playerSpeed = 3,
    defaultPlayerX = width  * 2,
    defaultPlayerY = height * 5;

/**
 * @description Represents a Charactor in the game. this class is intended for parente class for Player/Enemy class
 * @constructor
 * @param  {string} pics
 * @param  {number} speed
 * @param  {number} x_def
 * @param  {number} y_def
 * @param  {number} x_max
 * @param  {number} y_max
 * @param  {number} x_min
 * @param  {number} y_min
 */
var Charactor = function (pics,speed,x_def,y_def,x_max,y_max,x_min,y_min) {
    "use strict";
    this.sprite = pics;
    this.x_def = x_def || 0;
    this.y_def = y_def || 0;
    this.x_max = x_max || 600 ;
    this.y_max = y_max || 600 ;

    this.x_min = x_min || 0 ;
    this.y_min = x_min || 0 ;

    this.x = this.x_def;
    this.y = this.y_def;

    this.speed = speed || 1;
    this.x_speed = 0;
    this.y_speed = 0;
};

/**
* @description render images on canvas
*/

Charactor.prototype.render = function() {
    "use strict";
    ctx.drawImage(Resources.get(this.sprite), this.x  , this.y  );
};

/**
* @description reset images position on canvas
*/
Charactor.prototype.resetPosition = function () {
    "use strict";
    this.x = this.x_def;
    this.y = this.y_def;
    this.x_speed = 0;
    this.y_speed = 0;
};

/**
* @description  check images position it is outside boundary or not
* @param {number} dt
* @return {boolean} true if it is outside of boundary
*/
Charactor.prototype.boundaryChecker = function (dt) {
    "use strict";
    var result_max_x  = this.x + this.x_speed * dt > this.x_max ? true : false,
        result_max_y  = this.y + this.y_speed * dt > this.y_max ? true : false,
        result_min_x  = this.x + this.x_speed * dt < this.x_min ? true : false,
        result_min_y  = this.y + this.y_speed + dt < this.y_min ? true : false;
    return result_max_x || result_max_y || result_min_x || result_min_y;
};

/**
 * @description Represents a Player in the game.this is sub-class of Charactor.water_boundary represent goal position. it stat from 0 at the top of canvas.pis p
 * @constructor
 * @param  {string} pics
 * @param  {number} speed
 * @param  {number} x_def
 * @param  {number} y_def
 * @param  {number} x_max
 * @param  {number} y_max
 * @param  {number} water_boundary
 * @param  {number} x_min
 * @param  {number} y_minr
 */

var Player = function (pics,speed,x_def,y_def,x_max,y_max,water_boundary,x_min,y_min) {
    "use strict";
    Charactor.call(this,pics,speed,x_def,y_def,x_max,y_max,x_min,y_min);
    this.water_boundary = water_boundary || 0;
    this.handle = "";
    this.score = 0;

};

Player.prototype = Object.create(Charactor.prototype);
Player.prototype.constractor = Player;

/**
* @description  render player images and score text on canvas
*/
Player.prototype.render = function() {
    "use strict";
    //ctx object is definded in engine.js.
    //render player images
    ctx.drawImage(Resources.get(this.sprite), this.x  , this.y  );

    //set text setting and render text
    ctx.fillStyle = 'white';
    ctx.font = '25px "sans-serif"';
    ctx.fillText("Score : " + this.score,10,75);
};

/**
* @description  update player position and score. result of this update is reflected on canvas.
*/
Player.prototype.update = function(dt) {
    "use strict";

    if (typeof dt !== 'number'){
       dt = 1;
    }

    if ( ! this.boundaryChecker(dt) ){
      this.x  = this.x +  this.x_speed * dt;
      this.y  = this.y +  this.y_speed * dt;
    }

    if ( this.waterChecker() ){
      this.score += 1;
      this.resetPosition();
    }

};

/**
* @description  handle Player's direction.
* @param {object} "left,right,up,down" is only acceptable;
*/

Player.prototype.handleInput = function (code) {
  "use strict";

  if ( typeof code === 'string'){
    if ( code === 'left' || code === 'up' )  {
    // if code is "left" or "up" , this.speed  is changed to negative value.
    // Bacause that direction is negative to current position on canvas"
      this.speed = Math.abs(this.speed) * -1;
    } else if ( code === 'right' || code === 'down' ) {
    // if code is "rigth" or "down" , this.speed  is changed to positive value.
    // Bacause that direction is positive to current position on canvas"
      this.speed = Math.abs(this.speed);
    }

    if ( code === 'left' || code === 'right' )  {
      // if code is "left" or "right" , this.x_speed (that replesent speed to horizontal direction) is updated and y_speed(that replesent speed to vertical direction) is set to 0
      this.x_speed = this.speed;
      this.y_speed = 0;
    }else if ( code === 'up' || code === 'down' ) {
      // if code is "left" or "right" , this.x_speed (that replesent speed to horizontal direction) is set to 0 and y_speed(that replesent speed to vertical direction) is updated.
      this.x_speed = 0;
      this.y_speed = this.speed;
    }
  }

};

/**
* @description  check player's position is smaller than this.water_boundary or not.
* @return {boolean}
*/
Player.prototype.waterChecker = function () {
  "use strict";
  return this.y  < this.water_boundary   ? true : false;
};

/**
 * @description Represents a Enemy in the game.this is sub-class of Charactor. first argument require Player Class instance.
 * @constructor
 * @param  {object} player
 * @param  {string} pics
 * @param  {number} speed
 * @param  {number} x_def
 * @param  {number} y_def
 * @param  {number} x_max
 * @param  {number} y_max
 * @param  {number} x_min
 * @param  {number} y_min
 */

var Enemy = function(player,pics,speed,x_def,y_def,x_max,y_max,x_min,y_min) {
  "use strict";
    Charactor.call(this,pics,speed,x_def,y_def,x_max,y_max,x_min,y_min);
    this.player = player;
};

Enemy.prototype = Object.create(Charactor.prototype);
Enemy.prototype.constractor = Enemy;

/**
* @description  check player's position is smaller than this.water_boundary or not.
* @return {boolean}
*/
Enemy.prototype.checkCollisions = function(){
  "use strict";
    // if player instance position is overlapping enemy instance, reset players positon and score.
    if (
         this.player.x - 20  <  this.x && this.player.x + 20  > this.x &&
         this.player.y - 20  <  this.y && this.player.y + 20  > this.y
        ){
         this.player.resetPosition();
         this.player.score = 0;
    }

};

/**
* @description  update Emeny position.result of this update is reflected on canvas.
*/
Enemy.prototype.update = function(dt) {
  "use strict";

    this.x  = this.x + ( this.speed * dt );
    this.checkCollisions();

    // if enamy reach the end of canvas, start from the top (0 width)
    if (this.x  > this.x_max){
      this.resetPosition();
    }
};


// execution
// create Player instance
var player = new Player('images/char-boy.png',playerSpeed,defaultPlayerX,defaultPlayerY,width * 4 , height * 5, 3 );

// create array for enemy object.this array is refered from engin.js. don't rename it;
var allEnemies = [];
// create and push enemy instance. first argument have to be Player instance.
allEnemies.push(new Enemy(player,'images/enemy-bug.png', 50 , - width, 0 ));
allEnemies.push(new Enemy(player,'images/enemy-bug.png', 100, - width, height ));
allEnemies.push(new Enemy(player,'images/enemy-bug.png', 150, - width, height * 2 ));
allEnemies.push(new Enemy(player,'images/enemy-bug.png', 150, - width, height * 3 ));

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  "use strict";
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
