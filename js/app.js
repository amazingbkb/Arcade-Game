//Start the Game.
let game = true;


//Setup for enemies.


//Creating enemies.
var Enemy = function(x,y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/enemy-bug.png';
};

//Define enemies positions and how they apear.
const enemyPositions = [55, 140, 230];

const allEnemies = enemyPositions.map((y, index) => {
    return new Enemy((-100 * (index + 1)), y)
});

//Enemies will be constantly appear.
Enemy.prototype.update = function(dt) {
    
    if (this.x > ctx.canvas.width) {
        this.x = -100 * Math.floor(Math.random() * 4) + 1;
    } else {
        this.x += 150 * dt;
    }
    // When player collide with enemy, player will lose a life.
    if (player.x > (this.x - 50) && player.x < (this.x + 50) && player.y > (this.y - 50) && player.y < (this.y + 50)) {
        dead.play();
        reset ();
        player.lives -= 1;
    }
};


Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Setup the player.
var Player = function(x,y, sprite) {
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.score = 0;
    this.lives = 3;
    this.timer = 30;
};

const player = new Player(202, 400,'images/char-boy.png');

/*When player reach to river, player earns 20points.
*and this will reset player back to original position.
*When the player lost all his lives, the game reset.
*/ 
Player.prototype.update = function(dt) {
    if (game && player.y < 40) {
        win.play();
        this.score  += 20;
        reset ();
    }

    if (this.lives === 0) {        
        newGame ();
    }
};

//Information of player will apear on the board.
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + this.score, 20, 80);
    ctx.fillText("Lives: " + this.lives, 120, 80);
    ctx.fillText("Timer: " + this.timer, 210, 80);
};

//Player will not move off screen, and stay only inside the board.
Player.prototype.handleInput = function(direction) {
    const horizontal = 101,
        vertical = 83;

    if (direction === 'left' && this.x - horizontal >= 0) {
        this.x -= horizontal;
    } else if (direction === 'right' && this.x + horizontal < ctx.canvas.width) {
        this.x += horizontal;
    } else if (direction === 'up' && this.y - vertical > 0 - 75) {
        this.y -= vertical;
    } else if (direction === 'down' && this.y + vertical < ctx.canvas.height -200) {
        this.y += vertical;
    }
};

//Setup player's movement
document.addEventListener('keyup', function(e) {
    move.play();
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//Player's original positions
let reset  = function() {
    player.x = 202;
    player.y = 400;
};

/*When time's up the game is over, a screen will apear showing 
*how much points player earned and it will start over.
*/
let newGame = function() {
    player.x = 202;
    player.y = 400;
    player.score = 0;
    player.lives = 3;
    player.timer = 30;
    var id = setInterval(function(){ 
        player.timer--; 
      if(player.timer< 0){
        Game.play();
        clearInterval(id);
        alert('Game Over! Your score is ' + player.score + ' Points');
        newGame();
       }
    }, 1000);
};


window.onload = function() {
    newGame();
    background.play();
};

// Adding sounds effect and backgroung music

var background = new Audio('sounds/background.mp3')
var dead = new Audio('sounds/dead.m4a')
var move = new Audio('sounds/move.wav')
var win = new Audio('sounds/win.wav')
var Game = new Audio('sounds/GameOver.wav')
