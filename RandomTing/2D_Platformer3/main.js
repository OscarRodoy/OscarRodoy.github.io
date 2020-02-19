var ctx = document.querySelector("canvas").getContext("2d");
const cvsWidth = ctx.canvas.width = 1248;
const cvsHeight = ctx.canvas.height = 576;
const tileSize = 48;

var money = document.getElementById("money");
var health = document.getElementById("health");
var btnPause = document.getElementById("btnPause");
var btnContinue = document.getElementById("btnContinue");

var gamePaused = true;

btnPause.onclick = function(){
  gamePaused = true;
  canvas.style.filter = "brightness(50%)";
  pausedMenu.style.display = "block";
};

btnContinue.onclick = function(){
  gamePaused = false;
  window.requestAnimationFrame(loop);
  canvas.style.filter = "brightness(100%)";
  pausedMenu.style.display = "none";
};

var camera = {
  center: ctx.canvas.width/2,
  columns: (cvsWidth / tileSize) + 2,
  tileTL: 0,
  tilesPassed: 1
};

var controller = {
  left:false,
  right:false,
  keyUpDown:function(event) {
    var key_state = (event.type == "keydown")?true:false;
    switch(event.keyCode) {
      case 65: controller.a = key_state; break; // a key
      case 87: controller.w = key_state; break; // w key
      case 68: controller.d = key_state; break; // d key
      case 83: controller.s = key_state; break; // s key
      case 32: controller.space = key_state; break; // spcae key
      case 16: controller.shift = key_state; break; // spcae key
    }
  }
};

var level_1 = {
  xPosStart: tileSize * 3,
  yPosStart: tileSize * 9,
  background: "Images/Background_W1.jpg",
  get rows() { return cvsHeight / tileSize;},
  get columns() { return this.map.length / this.rows;},
  get length() { return this.columns * tileSize;},
  map: [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,02,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,13,03,07,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,99,00,00,00,00,00,00,00,00,00,00,00,00,02,10,10,10,10,21,03,03,03,03,03,03,03,03,03,03,03,03,03,03,03,03,03,20,10,10,10,04,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,00,00,00,99,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,99,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,02,10,10,10,21,17,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,16,20,10,10,04,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,99,00,00,00,99,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,09,09,09,00,00,00,00,00,00,00,00,00,00,00,06,03,03,03,17,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,16,20,10,14,01,08,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,16,20,10,10,04,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,99,00,00,00,00,00,09,09,09,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,09,09,09,00,00,00,00,00,51,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,52,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,16,03,03,07,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,00,00,09,09,09,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,52,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,09,09,09,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,09,09,09,00,00,00,00,00,00,05,01,01,18,00,00,00,00,00,00,00,00,00,00,00,00,09,09,09,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,05,01,01,01,01,01,08,00,00,00,05,01,18,00,00,00,00,00,99,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,02,10,10,22,18,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,15,01,01,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,00,00,00,00,00,00,00,00,00,15,08,00,00,00,05,18,00,00,00,00,00,00,00,00,02,10,10,10,10,10,04,00,00,00,02,10,22,18,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,52,00,00,00,00,00,05,01,01,01,01,01,01,01,18,00,00,00,00,00,00,00,00,00,00,00,00,00,02,10,10,10,22,18,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,15,19,10,10,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,00,00,00,00,00,00,51,00,15,19,04,00,00,00,02,22,18,00,00,00,00,00,00,00,02,10,10,10,10,10,04,00,00,00,02,10,10,22,18,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,05,01,01,01,01,08,00,00,00,02,10,10,10,10,10,10,10,22,18,00,00,00,00,00,00,51,00,00,00,00,00,02,10,10,10,10,22,18,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,15,19,10,10,10,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        01,01,01,01,01,01,01,01,01,01,01,01,01,19,10,04,00,00,00,02,10,22,01,01,01,01,01,01,01,11,10,10,10,10,10,04,00,00,00,02,10,10,10,22,01,01,01,01,01,01,01,01,01,01,01,01,01,08,00,00,00,02,10,10,10,10,04,00,00,00,02,10,10,10,10,10,10,10,10,22,01,01,01,01,01,01,01,01,08,00,00,00,02,10,10,10,10,10,22,01,01,01,01,01,01,01,01,01,01,01,01,01,01,08,00,00,00,02,10,10,10,10,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,04,00,00,00,02,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,04,00,00,00,02,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,04,00,00,00,02,10,10,10,10,04,00,00,00,02,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,04,00,00,00,02,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,10,04,00,00,00,02,10,10,10,10,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00]
};

var world = level_1;

var background = new Image();
background.src = world.background;
var tile_01 = new Image();
tile_01.src = "Images/Tile01.png";
var tile_10 = new Image();
tile_10.src = "Images/Tile10.png";
var tile_99 = new Image();
tile_99.src = "Images/tile99.png";
var playerImage = new Image();
playerImage.src = "Images/playerSprite.png";

var player = {
    xPosStart: world.xPosStart,
    yPosStart: world.yPosStart,
    xPosOld: world.xPosStart,
    yPosOld: world.yPosStart,
    xPos: world.xPosStart,
    yPos: world.yPosStart,
    xVel: 0,
    yVel: 0,
    height: tileSize,
    width: tileSize,
    adjecentTL: ((world.xPosStart / tileSize) - 2) + ((world.yPosStart / tileSize) * world.columns - world.columns*2),
    xDistMoved: 0,
    yDistMoved: 0,

    color: "blue",
    movementSpeed: 6,
    jumps: 0,
    jumpTimeout: false,
    onGround: false,
    hit: false,
    health: 200,
    coins: 0,

    get top()       { return this.yPos; },
    get bottom()    { return this.yPos + this.height; },
    get left()      { return this.xPos; },
    get right()     { return this.xPos + this.width; },
    get topOld()    { return this.yPosOld; },
    get bottomOld() { return this.yPosOld + this.height; },
    get leftOld()   { return this.xPosOld; },
    get rightOld()  { return this.xPosOld + this.width; }
  };

var enemies = [];

function enemy01(xPos, yPos){
  this.xPosStart = xPos;
  this.yPosStart = yPos;
  this.xPosOld = xPos;
  this.yPosOld = yPos;
  this.xPos = xPos;
  this.yPos = yPos;
  this.xVel = 0;
  this.yVel = 0;
  this.height = tileSize;
  this.width = tileSize;
  this.adjecentTL = ((this.xPosStart / tileSize) - 2) + ((this.yPosStart / tileSize) * world.columns - world.columns*2);
  this.xDistMoved = 0;
  this.yDistMoved = 0;

  this.color = "red";
  this.movementSpeed = 2;
  this.jumps = 0;
  this.jumpTimeout = false;
  this.onGround = false;
  this.range = tileSize * 4;

  Object.defineProperty(this, 'top', { get: function() { return this.yPos; }});
  Object.defineProperty(this, 'bottom', { get: function() { return this.yPos + this.height; }});
  Object.defineProperty(this, 'left', { get: function() { return this.xPos; }});
  Object.defineProperty(this, 'right', { get: function() { return this.xPos + this.width; }});
  Object.defineProperty(this, 'topOld', { get: function() { return this.yPosOld; }});
  Object.defineProperty(this, 'bottomOld', { get: function() { return this.yPosOld + this.height; }});
  Object.defineProperty(this, 'leftOld', { get: function() { return this.xPosOld; }});
  Object.defineProperty(this, 'rightOld', { get: function() { return this.xPosOld + this.width; }});
};

function enemy02(xPos, yPos){
  this.xPosStart = xPos;
  this.yPosStart = yPos;
  this.xPosOld = xPos;
  this.yPosOld = yPos;
  this.xPos = xPos;
  this.yPos = yPos;
  this.xVel = 0;
  this.yVel = 0;
  this.height = tileSize;
  this.width = tileSize;
  this.adjecentTL = ((this.xPosStart / tileSize) - 2) + ((this.yPosStart / tileSize) * world.columns - world.columns*2);
  this.xDistMoved = 0;
  this.yDistMoved = 0;

  this.color = "orange";
  this.movementSpeed = 1;
  this.jumps = 0;
  this.jumpTimeout = false;
  this.onGround = false;
  this.range = tileSize * 4;

  Object.defineProperty(this, 'top', { get: function() { return this.yPos; }});
  Object.defineProperty(this, 'bottom', { get: function() { return this.yPos + this.height; }});
  Object.defineProperty(this, 'left', { get: function() { return this.xPos; }});
  Object.defineProperty(this, 'right', { get: function() { return this.xPos + this.width; }});
  Object.defineProperty(this, 'topOld', { get: function() { return this.yPosOld; }});
  Object.defineProperty(this, 'bottomOld', { get: function() { return this.yPosOld + this.height; }});
  Object.defineProperty(this, 'leftOld', { get: function() { return this.xPosOld; }});
  Object.defineProperty(this, 'rightOld', { get: function() { return this.xPosOld + this.width; }});
};

function collisionBottom(xPos, yPos, object) {
  // (bottom of object)
  if (object.right > xPos && object.left < xPos + tileSize &&
      object.bottom > yPos && object.bottomOld <= yPos){
    object.onGround = true;
    object.yVel = 0;
    object.jumps = 2;
    object.yPos = yPos - object.height;
  };
};
function collisionRight(xPos, yPos, object){
  if (object.right > xPos && object.rightOld <= xPos &&
      object.bottom > yPos && object.top < yPos + tileSize){
    object.xVel = 0;
    object.xPos = xPos - object.width;
  };
};
function collisionTop(xPos, yPos, object){
  if (object.right > xPos && object.left < xPos + tileSize &&
      object.top < yPos + tileSize && object.topOld >= yPos + tileSize){
    object.yVel = 0;
    object.yPos = yPos + tileSize;
  };
};
function collisionLeft(xPos, yPos, object){
  if (object.left < xPos + tileSize && object.leftOld >= xPos + tileSize &&
      object.bottom > yPos && object.top < yPos + tileSize){
    object.xVel = 0;
    object.xPos = xPos + tileSize;
  };
};
function collisionSlopeBR(xPos, yPos, object){
  let xCurrent = object.right - xPos;
  let slopeTop = -1 * xCurrent + yPos + tileSize;
  if (xCurrent > tileSize && object.bottom > yPos && object.top < yPos + tileSize && object.right > xPos && object.left < xPos + tileSize){
    object.onGround = true;
    object.yVel = 0;
    object.jumps = 2;
    object.yPos = yPos - object.height;
  } else if (object.bottom > slopeTop && object.bottom > yPos && object.top < yPos + tileSize && object.right > xPos && object.left < xPos + tileSize){
    object.onGround = true;
    object.yVel = 0;
    object.jumps = 2;
    object.yPos = slopeTop - object.height;
  };
};
function collisionSlopeTR(xPos, yPos, object){

};
function collisionSlopeTL(xPos, yPos, object){

};
function collisionSlopeBL(xPos, yPos, object){
  let xCurrent = xPos + tileSize - object.left;
  let slopeTop = -1 * xCurrent + yPos + tileSize;
  if (xCurrent > tileSize && object.bottom > yPos && object.top < yPos + tileSize && object.left < xPos + tileSize && object.right > xPos){
    object.onGround = true;
    object.yVel = 0;
    object.jumps = 2;
    object.yPos = yPos - object.height;
  } else if (object.bottom > slopeTop && object.bottom > yPos && object.top < yPos + tileSize && object.left < xPos + tileSize && object.right > xPos){
    object.onGround = true;
    object.yVel = 0;
    object.jumps = 2;
    object.yPos = slopeTop - object.height;
  };
};
function collisionCoin(xPos, yPos, n, object){
  if (object.right > xPos && object.left < xPos + tileSize &&
      object.bottom > yPos && object.top < yPos + tileSize && object == player){
    world.map.splice(n, 1, 00);
    object.coins += 1;
    money.innerHTML = "&#128176; " + object.coins;
  };
};

var loop = function(){

  if (gamePaused) {return}

  drawWorld();

  updateWorld();

  window.requestAnimationFrame(loop);
};
window.requestAnimationFrame(loop);
window.addEventListener("keydown", controller.keyUpDown);
window.addEventListener("keyup", controller.keyUpDown);
