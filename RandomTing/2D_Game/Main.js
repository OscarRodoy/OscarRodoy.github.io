var ctx = document.querySelector("canvas").getContext("2d");
const cvsWidth = ctx.canvas.width = window.innerWidth - 300; // 1248
const cvsHeight = ctx.canvas.height = window.innerHeight; // 576
const tileSize = 48;

var gamePaused = false;

var camera = {
  centerX: cvsWidth/2,
  centerY: cvsHeight/2,
  columns: Math.ceil(cvsWidth / tileSize) + 2,
  rows: Math.ceil(cvsHeight / tileSize) + 2,
  tileTL: 0,
  tilesPassedX: 1,
  tilesPassedY: 2,
  offsetX: 300, //16,
  offsetY: -1, //15
  hoveredTile: 0,
  hoveredxPos: 0,
  hoveredyPoS: 0
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

var world = {
  xPosStart: tileSize * 6,
  yPosStart: tileSize * 6,
  background: "BackgroundGrass.jpg",
  get rows() { return 24;},
  get columns() { return this.map.length / this.rows;},
  get length() { return this.columns * tileSize;},
  get height() { return this.rows * tileSize;},
  map: [00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,11,00,00,00,00,00,00,00,00,12,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,12,00,14,00,11,00,00,13,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,13,00,00,00,00,00,00,00,00,00,00,32,00,32,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,00,00,00,00,00,00,00,32,00,00,00,33,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,00,00,00,00,00,00,32,00,00,00,00,00,34,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,99,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,09,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,00,00,00,00,05,01,01,08,00,00,32,34,35,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,00,00,33,00,02,10,10,04,00,00,00,33,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,31,00,00,00,00,02,10,10,04,00,00,00,32,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,00,00,00,00,06,03,03,07,00,00,00,34,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,00,32,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,34,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,98,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,35,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,00,00,00,00,00,00,00,00,00,31,31,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,00,00,00,00,00,00,00,00,00,31,31,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,00,00,00,00,00,00,00,00,00,31,31,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
        00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00]
};

var background = new Image(); background.src = world.background;
var fog = new Image(); fog.src = "fog.png";
var fog90 = new Image(); fog90.src = "fog90.png";
var fog180 = new Image(); fog180.src = "fog180.png";
var fog270 = new Image(); fog270.src = "fog270.png";

var placeBuildable = new Image();
var building = {
  state: false,
  object: "",
};

var player = {
    xPosStart: world.xPosStart,
    yPosStart: world.yPosStart,
    xPosOld: world.xPosStart,
    yPosOld: world.yPosStart,
    xPos: world.xPosStart,
    yPos: world.yPosStart,
    xVel: 0,
    yVel: 0,
    height: tileSize-2,
    width: tileSize-2,
    adjecentTL: ((world.xPosStart / tileSize) - 2) + ((world.yPosStart / tileSize) * world.columns - world.columns*2),
    xDistMoved: 0,
    yDistMoved: 0,
    adjecentTL2: 0,
    adjecentTL2_OffsetX: 0,
    adjecentTL2_OffsetY: 0,

    // states
    hit: -1,
    punching: false,
    clickTimeoutR: false,
    clickTimeoutL: false,

    // stats
    color: "skyblue",
    movementSpeed: 6,
    range: tileSize * 3.5,
    health: 200,
    attackDMG: 10,

    // inventory
    inventory: {
      wood: 0,
      stone: 0,
      bronze: 0,
      silver: 0,
      gold: 0
    },

    get xPosHandL() { return this.xPos - 4;},
    get yPosHandL() { return this.yPos + this.height/2;},
    get xPosHandR() { return this.xPos + this.width + 4;},
    get yPosHandR() { return this.yPos + this.height/2;},

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
function enemy99(xPos, yPos){
  this.xPosStart = xPos;
  this.yPosStart = yPos;
  this.xPosOld = xPos;
  this.yPosOld = yPos;
  this.xPos = xPos;
  this.yPos = yPos;
  this.xVel = 0;
  this.yVel = 0;
  this.height = tileSize-2;
  this.width = tileSize-2;
  this.adjecentTL = ((this.xPosStart / tileSize) - 2) + ((this.yPosStart / tileSize) * world.columns - world.columns*2);
  this.xDistMoved = 0;
  this.yDistMoved = 0;

  this.color = "red";
  this.movementSpeed = 2;
  this.range = tileSize * 3.5;
  this.hit = -1;

  Object.defineProperty(this, 'top', { get: function() { return this.yPos; }});
  Object.defineProperty(this, 'bottom', { get: function() { return this.yPos + this.height; }});
  Object.defineProperty(this, 'left', { get: function() { return this.xPos; }});
  Object.defineProperty(this, 'right', { get: function() { return this.xPos + this.width; }});
  Object.defineProperty(this, 'topOld', { get: function() { return this.yPosOld; }});
  Object.defineProperty(this, 'bottomOld', { get: function() { return this.yPosOld + this.height; }});
  Object.defineProperty(this, 'leftOld', { get: function() { return this.xPosOld; }});
  Object.defineProperty(this, 'rightOld', { get: function() { return this.xPosOld + this.width; }});
};
function enemy98(xPos, yPos){
  this.xPosStart = xPos;
  this.yPosStart = yPos;
  this.xPosOld = xPos;
  this.yPosOld = yPos;
  this.xPos = xPos;
  this.yPos = yPos;
  this.xVel = 0;
  this.yVel = 0;
  this.height = tileSize-2;
  this.width = tileSize-2;
  this.adjecentTL = ((this.xPosStart / tileSize) - 2) + ((this.yPosStart / tileSize) * world.columns - world.columns*2);
  this.xDistMoved = 0;
  this.yDistMoved = 0;

  this.color = "orange";
  this.movementSpeed = 1;
  this.range = tileSize * 3.5;
  this.hit = -1;

  Object.defineProperty(this, 'top', { get: function() { return this.yPos; }});
  Object.defineProperty(this, 'bottom', { get: function() { return this.yPos + this.height; }});
  Object.defineProperty(this, 'left', { get: function() { return this.xPos; }});
  Object.defineProperty(this, 'right', { get: function() { return this.xPos + this.width; }});
  Object.defineProperty(this, 'topOld', { get: function() { return this.yPosOld; }});
  Object.defineProperty(this, 'bottomOld', { get: function() { return this.yPosOld + this.height; }});
  Object.defineProperty(this, 'leftOld', { get: function() { return this.xPosOld; }});
  Object.defineProperty(this, 'rightOld', { get: function() { return this.xPosOld + this.width; }});
};

var resources = [];
function tree(xPos, yPos, n){
  this.xPos = xPos;
  this.yPos = yPos;
  this.index = n;
  this.type = "Wood";
  this.health = 200;
  this.maxHealth = 200;
  this.img = new Image();
  this.img.src = "Tree.png";
};
function stone(xPos, yPos, n){
  this.xPos = xPos;
  this.yPos = yPos;
  this.index = n;
  this.type = "Stone";
  this.health = 200;
  this.maxHealth = 200;
};
function bronze(xPos, yPos, n){
  this.xPos = xPos;
  this.yPos = yPos;
  this.index = n;
  this.type = "Bronze";
  this.health = 300;
  this.maxHealth = 300;
};
function silver(xPos, yPos, n){
  this.xPos = xPos;
  this.yPos = yPos;
  this.index = n;
  this.type = "Silver";
  this.health = 400;
  this.maxHealth = 400;
};
function gold(xPos, yPos, n){
  this.xPos = xPos;
  this.yPos = yPos;
  this.index = n;
  this.type = "Gold";
  this.health = 500;
  this.maxHealth = 500;
};

var structures = [];
function structure(xPos, yPos, n){
  this.xPos = xPos;
  this.yPos = yPos;
  this.index = n;
  this.tileType = building.object.tileType;
  this.health = building.object.health;
  this.maxHealth = building.object.health;
  this.img = new Image();
  this.img.src = building.object.img;
};

function collisionBottom(xPos, yPos, n, object) {
  // (bottom of object)
  if (object.right > xPos && object.left < xPos + tileSize &&
      object.bottom > yPos && object.bottomOld <= yPos){
    if (object.hit != -1){
      var i = object.hit; var x;
      if (enemies[i].xPos - object.xPos > 0) {x = -1} else if (enemies[i].xPos - object.xPos < 0) {x = 1} else {
        x = Math.ceil(Math.random()*2);
        if (x == 2) {x = -1};
      }
      //if (n - 1 - world.columns != 00 || n - 2 - world.columns != 00) {x = 1};
      //if (n + 1 - world.columns != 00 || n + 2 - world.columns != 00) {x = -1};
      object.xVel = object.yVel/2 * x;
      object.xPos += tileSize * x;
    };
    object.yVel = 0;
    object.yPos = yPos - object.height;
  };
};
function collisionRight(xPos, yPos, n, object){
  if (object.right > xPos && object.rightOld <= xPos &&
      object.bottom > yPos && object.top < yPos + tileSize){
    if (object.hit != -1){
      var i = object.hit; var x;
      if (enemies[i].yPos - object.yPos > 0) {x = -1} else if (enemies[i].yPos - object.yPos < 0) {x = 1} else {
        x = Math.ceil(Math.random()*2);
        if (x == 2) {x = -1};
      }
      //if (n - 1 - world.columns != 00 || n - 1 - world.columns*2 != 00) {x = -1};
      //if (n - 1 + world.columns != 00 || n - 1 + world.columns*2 != 00) {x = 1};
      object.yVel = object.xVel/2 * x;
      object.yPos += tileSize * x;
    };
    object.xVel = 0;
    object.xPos = xPos - object.width;
  };
};
function collisionTop(xPos, yPos, n, object){
  if (object.right > xPos && object.left < xPos + tileSize &&
      object.top < yPos + tileSize && object.topOld >= yPos + tileSize){
    if (object.hit != -1){
      var i = object.hit; var x;
      if (enemies[i].xPos - object.xPos > 0) {x = -1} else if (enemies[i].xPos - object.xPos < 0) {x = 1} else {
        x = Math.ceil(Math.random()*2);
        if (x == 2) {x = -1};
      }
      //if (n - 1 + world.columns != 00 || n - 2 + world.columns != 00) {x = -1};
      //if (n + 1 + world.columns != 00 || n + 2 + world.columns != 00) {x = 1};
      object.xVel = -object.yVel/2 * x;
      object.xPos += tileSize * x;
    };
    object.yVel = 0;
    object.yPos = yPos + tileSize;
  };
};
function collisionLeft(xPos, yPos, n, object){
  if (object.left < xPos + tileSize && object.leftOld >= xPos + tileSize &&
      object.bottom > yPos && object.top < yPos + tileSize){
    if (object.hit != -1){
    /*  var x;
      if (n - world.columns + 1 != 00 || n - world.columns*2 + 1 != 00) {x = 1;}
      else if (n + world.columns + 1 != 00 || n + world.columns*2 + 1 != 00) {x = -1;}
      else {
        x = Math.ceil(Math.random()*2);
        if (x == 2) {x = -1};
      };*/
      var i = object.hit; var x;
      if (enemies[i].yPos - object.yPos > 0) {x = -1} else if (enemies[i].yPos - object.yPos < 0) {x = 1} else {
        x = Math.ceil(Math.random()*2);
        if (x == 2) {x = -1};
      }
      //if (n + 1 - world.columns != 00 || n + 1 - world.columns*2 != 00) {x = -1};
      //if (n + 1 + world.columns != 00 || n + 1 + world.columns*2 != 00) {x = 1};
      object.yVel = -object.xVel/2 * x;
      object.yPos += tileSize * x;
    };
    object.xVel = 0;
    object.xPos = xPos + tileSize;
  };
};

// calculate vector from mouse to player
var angle = 0;
var mouseX, mouseY, cvsMouseX, cvsMouseY;
onmousemove = function(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
};

var clickedX, clickedY, clickedTile;
document.querySelector("canvas").onclick = function(e){
  clickedX = e.clientX - camera.offsetX + camera.centerX - cvsWidth/2;
  clickedY = e.clientY - camera.offsetY + camera.centerY - cvsHeight/2;
  clickedTile = Math.floor(clickedX / tileSize) + (Math.floor(clickedY / tileSize) * world.columns);
  var xPos = (clickedTile * tileSize) - (world.length * Math.floor((clickedTile * tileSize) / world.length));
  var yPos = Math.floor(clickedTile / world.columns) * tileSize;
  // clicking in building state
  if (building.state == true) {
    if (world.map[clickedTile] != 00 || (Math.abs(player.xPos - xPos) < tileSize && Math.abs(player.yPos - yPos) < tileSize) || clickedX < 0 || clickedX > world.length || clickedY < 0 || clickedY > world.height){
      displayText(player.xPos, player.yPos, "Area not clear!", "rgba(255, 255, 255, ");
    } else {
      world.map[clickedTile] = building.object.tileType;
      player.inventory.wood -= building.object.costWood;
      player.inventory.stone -= building.object.costStone;
      player.inventory.bronze -= building.object.costBronze;
      player.inventory.silver -= building.object.costSilver;
      player.inventory.gold -= building.object.costGold;
      var space = 0;
      if (building.object.costWood > 0) {displayText(player.xPos, player.yPos - space, "-" + building.object.costWood + " Wood", "rgba(255, 0, 0, "); space += 20;};
      if (building.object.costStone > 0) {displayText(player.xPos, player.yPos - space, "-" + building.object.costStone + " Stone", "rgba(255, 0, 0, "); space += 20;};
      if (building.object.costBronze > 0) {displayText(player.xPos, player.yPos - space, "-" + building.object.costBronze + " Bronze", "rgba(255, 0, 0, "); space += 20;};
      if (building.object.costSilver > 0) {displayText(player.xPos, player.yPos - space, "-" + building.object.costSilver + " Silver", "rgba(255, 0, 0, "); space += 20;};
      if (building.object.costGold > 0) {displayText(player.xPos, player.yPos - space, "-" + building.object.costGold + " Gold", "rgba(255, 0, 0, ");};
      building.state = false;
      displayGrid();
    };
    return;
  };
  // clicking normaly
  if (closestIntersect != null) {
    if (world.map[closestIntersect.tile] == 30) {
      var index = resources.findIndex(i => i.index === closestIntersect.tile);
      var type = resources[index].type
      displayText(player.xPos, player.yPos, "+10 " + type, "rgba(45, 235, 64, ");
      resources[index].health -= player.attackDMG;
      player.inventory[type.toLowerCase()] += 10;
    } else if (world.map[closestIntersect.tile] == 40) {
      var index = structures.findIndex(i => i.index === closestIntersect.tile);
      structures[index].health -= player.attackDMG;
    };
  };
};

document.querySelector("canvas").oncontextmenu = function(e){
  e.preventDefault();
}

var texts = [];
function displayText(xPos, yPos, text, color) {
  texts.push({xPos: xPos, yPos: yPos, text: text, color: color, opacity: 1.00});
};

// Find intersection of your Line & Segments
var line, segment, segment1, segment2, closestIntersect, intersect;

function getIntersection(line, segment){
  // Line
	var r_px = line.a.x; // position point a: x
	var r_py = line.a.y; // position point a: y
	var r_dx = line.b.x - line.a.x; // direction a to b: x
	var r_dy = line.b.y - line.a.y; // direction a to b: y
  // Segment
	var s_px = segment.a.x;
	var s_py = segment.a.y;
	var s_dx = segment.b.x - segment.a.x;
	var s_dy = segment.b.y - segment.a.y;
	// Are they parallel? If so, no intersect
	var r_mag = Math.sqrt(r_dx * r_dx + r_dy * r_dy);
	var s_mag = Math.sqrt(s_dx * s_dx + s_dy * s_dy);
	if(r_dx / r_mag == s_dx / s_mag && r_dy / r_mag == s_dy / s_mag){ // Directions are the same.
		return null;
	}
	// SOLVE FOR T1 & T2
	var T2 = (r_dx*(s_py - r_py) + r_dy*(r_px - s_px)) / (s_dx*r_dy - s_dy*r_dx);
	var T1 = (s_px + s_dx * T2 - r_px) / r_dx;
	// Must be within parametic whatevers for Line / Segment
	if(T1<0) return null;
	if(T2<0 || T2>1) return null;
	// Return the POINT OF INTERSECTION
	return {
		x: r_px+r_dx*T1,
		y: r_py+r_dy*T1,
		param: T1,
    tile: segment.tile
	};
};

// grid slots
var craftables = [
  {name: "Wooden Sword", img: "ItemPlaceholder.png", costWood: 200, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Stone Sword", img: "ItemPlaceholder.png", costWood: 100, costStone: 200, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Bronze Sword", img: "ItemPlaceholder.png", costWood: 100, costStone: 0, costBronze: 300, costSilver: 0, costGold: 0},
  {name: "Silver Sword", img: "ItemPlaceholder.png", costWood: 100, costStone: 0, costBronze: 0, costSilver: 400, costGold: 0},
  {name: "Golden Sword", img: "ItemPlaceholder.png", costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 500},
  {name: "Wooden Axe", img: "ItemPlaceholder.png", costWood: 200, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Stone Axe", img: "ItemPlaceholder.png", costWood: 100, costStone: 200, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Bronze Axe", img: "ItemPlaceholder.png", costWood: 100, costStone: 0, costBronze: 300, costSilver: 0, costGold: 0},
  {name: "Silver Axe", img: "ItemPlaceholder.png", costWood: 100, costStone: 0, costBronze: 0, costSilver: 400, costGold: 0},
  {name: "Golden Axe", img: "ItemPlaceholder.png", costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 500},
  {name: "Wooden Pickaxe", img: "ItemPlaceholder.png", costWood: 200, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Stone Pickaxe", img: "ItemPlaceholder.png", costWood: 100, costStone: 200, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Bronze Pickaxe", img: "ItemPlaceholder.png", costWood: 100, costStone: 0, costBronze: 300, costSilver: 0, costGold: 0},
  {name: "Silver Pickaxe", img: "ItemPlaceholder.png", costWood: 100, costStone: 0, costBronze: 0, costSilver: 400, costGold: 0},
  {name: "Golden Pickaxe", img: "ItemPlaceholder.png", costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 500},
  {name: "Wooden Sheild", img: "ItemPlaceholder.png", costWood: 400, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Stone Sheild", img: "ItemPlaceholder.png", costWood: 200, costStone: 400, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Bronze Sheild", img: "ItemPlaceholder.png", costWood: 200, costStone: 0, costBronze: 600, costSilver: 0, costGold: 0},
  {name: "Silver Sheild", img: "ItemPlaceholder.png", costWood: 200, costStone: 0, costBronze: 0, costSilver: 800, costGold: 0},
  {name: "Golden Sheild", img: "ItemPlaceholder.png", costWood: 200, costStone: 0, costBronze: 0, costSilver: 0, costGold: 1000},
  {name: "Wooden Sword", img: "ItemPlaceholder.png", costWood: 800, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Wooden Sword", img: "ItemPlaceholder.png", costWood: 0, costStone: 800, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Wooden Sword", img: "ItemPlaceholder.png", costWood: 0, costStone: 0, costBronze: 1200, costSilver: 0, costGold: 0},
  {name: "Wooden Sword", img: "ItemPlaceholder.png", costWood: 0, costStone: 0, costBronze: 0, costSilver: 1600, costGold: 0},
  {name: "Wooden Sword", img: "ItemPlaceholder.png", costWood: 0, costStone: 30, costBronze: 0, costSilver: 0, costGold: 2000},
  {name: "a Sword", img: "ItemPlaceholder.png", costWood: 0, costStone: 30, costBronze: 0, costSilver: 0, costGold: 2000},
  {name: "a Sword", img: "ItemPlaceholder.png", costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "a Sword", img: "ItemPlaceholder.png", costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "a Sword", img: "ItemPlaceholder.png", costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "a Sword", img: "ItemPlaceholder.png", costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "a Sword", img: "ItemPlaceholder.png", costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "a Sword", img: "ItemPlaceholder.png", costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "a Sword", img: "ItemPlaceholder.png", costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "a Sword", img: "ItemPlaceholder.png", costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "a Sword", img: "ItemPlaceholder.png", costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "a Sword", img: "ItemPlaceholder.png", costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "a Sword", img: "ItemPlaceholder.png", costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0}
];
var buildables = [
  {name: "Wooden Wall", tileType: 41, health: 200, img: "StructurePlaceholder.png", costWood: 200, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Stone Wall", tileType: 41, health: 300, img: "StructurePlaceholder.png", costWood: 100, costStone: 200, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Bronze Wall", tileType: 41, health: 500, img: "StructurePlaceholder.png", costWood: 100, costStone: 0, costBronze: 300, costSilver: 0, costGold: 0},
  {name: "Silver Wall", tileType: 41, health: 1000, img: "StructurePlaceholder.png", costWood: 100, costStone: 0, costBronze: 0, costSilver: 400, costGold: 0},
  {name: "Golden Wall", tileType: 41, health: 2500, img: "StructurePlaceholder.png", costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 500},
  {name: "Wooden Sword", tileType: 41, health: 200, img: "StructurePlaceholder.png", costWood: 200, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Wooden Sword", tileType: 41, health: 200, img: "StructurePlaceholder.png", costWood: 100, costStone: 200, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Wooden Sword", tileType: 41, health: 200, img: "StructurePlaceholder.png", costWood: 100, costStone: 0, costBronze: 300, costSilver: 0, costGold: 0},
  {name: "Wooden Sword", tileType: 41, health: 200, img: "StructurePlaceholder.png", costWood: 100, costStone: 0, costBronze: 0, costSilver: 400, costGold: 0},
  {name: "Wooden Sword", tileType: 41, health: 200, img: "StructurePlaceholder.png", costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 500},
  {name: "Wooden Sword", tileType: 41, health: 200, img: "StructurePlaceholder.png", costWood: 200, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Wooden Sword", tileType: 41, health: 200, img: "StructurePlaceholder.png", costWood: 100, costStone: 200, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Wooden Sword", tileType: 41, health: 200, img: "StructurePlaceholder.png", costWood: 100, costStone: 0, costBronze: 300, costSilver: 0, costGold: 0},
  {name: "Wooden Sword", tileType: 41, health: 200, img: "StructurePlaceholder.png", costWood: 100, costStone: 0, costBronze: 0, costSilver: 400, costGold: 0},
  {name: "Wooden Sword", tileType: 41, health: 200, img: "StructurePlaceholder.png", costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 500},
  {name: "Wooden Sword", tileType: 41, health: 200, img: "StructurePlaceholder.png", costWood: 400, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Wooden Sword", tileType: 41, health: 200, img: "StructurePlaceholder.png", costWood: 200, costStone: 400, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Wooden Sword", tileType: 41, health: 200, img: "StructurePlaceholder.png", costWood: 200, costStone: 0, costBronze: 600, costSilver: 0, costGold: 0},
  {name: "Wooden Sword", tileType: 41, health: 200, img: "StructurePlaceholder.png", costWood: 200, costStone: 0, costBronze: 0, costSilver: 800, costGold: 0},
  {name: "Wooden Sword", tileType: 41, health: 200, img: "StructurePlaceholder.png", costWood: 200, costStone: 0, costBronze: 0, costSilver: 0, costGold: 1000},
  {name: "Wooden Sword", tileType: 41, health: 200, img: "StructurePlaceholder.png", costWood: 800, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Wooden Sword", tileType: 41, health: 200, img: "StructurePlaceholder.png", costWood: 0, costStone: 800, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Wooden Sword", tileType: 41, health: 200, img: "StructurePlaceholder.png", costWood: 0, costStone: 0, costBronze: 1200, costSilver: 0, costGold: 0},
  {name: "Wooden Sword", tileType: 41, health: 200, img: "StructurePlaceholder.png", costWood: 0, costStone: 0, costBronze: 0, costSilver: 1600, costGold: 0},
  {name: "Wooden Sword", tileType: 41, health: 200, img: "StructurePlaceholder.png", costWood: 0, costStone: 30, costBronze: 0, costSilver: 0, costGold: 2000}
];
var inventory = [];

var gridSlots = document.getElementById("gridSlots");
var itemInfo = document.getElementById("itemInfo");
var currentPage = 1;
var infoDelay;
var array;

function gridBtnOnclick(i) {
  if (building.state == true){
    return;
  };
  currentPage = i;
  displayGrid();
};

function displayGrid(){
  gridSlots.innerHTML = "";
  if (building.state == true) {
    clearTimeout(infoDelay);
    itemInfo.style.display = "none";
    array = null;
    itemInfo.innerHTML = ``;
    gridSlots.innerHTML = `
      <div style="grid-column: 1 / span 3; height: 138px; position: relative; filter: brightness(100%);">
        <p style="margin: 0px; position: absolute; top: 10px; left: 50%; transform: translateX(-50%); text-decoration: underline; white-space: nowrap;">${building.object.name}</p>
        <div style="position: absolute; top: 60%; left: 50%; transform: translate(-50%, -50%); width: 54px; height: 54px; filter: brightness(100%);">
          <img style="width: 100%;" src="${building.object.img}">
        </div>
      </div>
      <div style="grid-column: 4 / span 5; height: 138px; filter: position: relative; filter: brightness(100%); margin-left: -0px;">
        <p style="color: red; margin: 0px; position: absolute; top: 50%; right: 10px; transform: translateY(-50%);">
          -${building.object.costWood} Wood<br>
          -${building.object.costStone} Stone<br>
          -${building.object.costBronze} Bronze<br>
          -${building.object.costSilver} Silver<br>
          -${building.object.costGold} Gold<br>
        </p>
      </div>
      <div onclick="cancelBuild()" style="grid-column: 1 / span 8; height: 138px; filter: brightness(100%); position: relative;">
        <p style="margin: 0px; position: absolute; top: 0px; left: 50%; transform: translateX(-50%); white-space: nowrap;">(Click on the canvas to build)</p>
        <p style="animation: textPulse 1.5s linear infinite; text-align: center; font-size: 23px; margin-top: 35px;">Click here<br>to Cancel!</p>
      </div>
    `;
    return;
  };
  if (currentPage == 1) {array = craftables;} else if (currentPage == 2) {array = buildables;} else if (currentPage == 3) {array = inventory;};
  var emptySlots = 25 - array.length;
  for (var i = 0; i < array.length; i++){
    gridSlots.innerHTML += `<div onmouseover="displayObjectInfo(${event, i})" onmouseout="RemoveObjectInfo(${event, i})" onclick="clickObject(${event, i})"> <img src="${array[i].img}"> </div>`
  };
  if (emptySlots > 0) {
    for (var i = 0; i < emptySlots; i++){
      gridSlots.innerHTML += `<div></div>`
    };
  };
  if (array.length > 25){
    gridSlots.style.overflowY = "scroll";
    gridSlots.style.margin = "10px 0px 0px 10px"
  } else {
    gridSlots.style.overflowY = "hidden";
    gridSlots.style.margin = "10px 10px 0px 10px"
  }
} displayGrid();

function displayObjectInfo(i){
  event.target.style.border = "2px solid black";
  event.target.style.width = "50px";
  event.target.style.height = "50px";
  if (currentPage == 3) {
    itemInfo.style.display = "inline-block";
    itemInfo.innerHTML = `${array[i].name}<br>`;
  } else {
    infoDelay = setTimeout(function(){
      itemInfo.style.display = "inline-block";
      itemInfo.innerHTML = `${array[i].name}<br>`;
      if (array[i].costWood > 0) {itemInfo.innerHTML += `-${array[i].costWood} Wood <br>`;};
      if (array[i].costStone > 0) {itemInfo.innerHTML += `-${array[i].costStone} Stone <br>`;};
      if (array[i].costBronze > 0) {itemInfo.innerHTML += `-${array[i].costBronze} Bronze <br>`;};
      if (array[i].costSilver > 0) {itemInfo.innerHTML += `-${array[i].costSilver} Silver <br>`;};
      if (array[i].costGold > 0) {itemInfo.innerHTML += `-${array[i].costGold} Gold <br>`;};
    }, 100);
  };
};

function RemoveObjectInfo(i){
  event.target.style.border = "";
  event.target.style.width = "54px";
  event.target.style.height = "54px";
  clearTimeout(infoDelay);
  itemInfo.style.display = "none";
  itemInfo.innerHTML = ``;
}

function clickObject(i){
  var target = event.target;
  var targetParent = event.target.parentElement;
  if (targetParent == gridSlots) {
    targetParent = target;
    target = event.target.querySelector("img");
  }
  if (currentPage == 1){
    if (player.inventory.wood < array[i].costWood ||
        player.inventory.stone < array[i].costStone ||
        player.inventory.bronze < array[i].costBronze ||
        player.inventory.silver < array[i].costSilver ||
        player.inventory.gold < array[i].costGold) {
      displayText(player.xPos, player.yPos, "Need more resources!", "rgba(255, 255, 255, ");
      cantBuyAnimation(target, targetParent);
    } else {
      if (inventory.length >= 25) {
        displayText(player.xPos, player.yPos, "Inventory full!", "rgba(255, 255, 255, ");
        cantBuyAnimation(target, targetParent);
        return;
      };
      player.inventory.wood -= array[i].costWood;
      player.inventory.stone -= array[i].costStone;
      player.inventory.bronze -= array[i].costBronze;
      player.inventory.silver -= array[i].costSilver;
      player.inventory.gold -= array[i].costGold;
      var space = 0;
      if (array[i].costWood > 0) {displayText(player.xPos, player.yPos - space, "-" + array[i].costWood + " Wood", "rgba(255, 0, 0, "); space += 20;};
      if (array[i].costStone > 0) {displayText(player.xPos, player.yPos - space, "-" + array[i].costStone + " Stone", "rgba(255, 0, 0, "); space += 20;};
      if (array[i].costBronze > 0) {displayText(player.xPos, player.yPos - space, "-" + array[i].costBronze + " Bronze", "rgba(255, 0, 0, "); space += 20;};
      if (array[i].costSilver > 0) {displayText(player.xPos, player.yPos - space, "-" + array[i].costSilver + " Silver", "rgba(255, 0, 0, "); space += 20;};
      if (array[i].costGold > 0) {displayText(player.xPos, player.yPos - space, "-" + array[i].costGold + " Gold", "rgba(255, 0, 0, ");};
      displayText(player.xPos, player.yPos - space, "+1 " + array[i].name, "rgba(0, 255, 0, ");
      inventory.push(array[i]);
      buyAnimation(target, targetParent);
    };
  } else if (currentPage == 2){
    if (player.inventory.wood < array[i].costWood ||
        player.inventory.stone < array[i].costStone ||
        player.inventory.bronze < array[i].costBronze ||
        player.inventory.silver < array[i].costSilver ||
        player.inventory.gold < array[i].costGold) {
      displayText(player.xPos, player.yPos, "Need more resources!", "rgba(255, 255, 255, ");
      cantBuyAnimation(target, targetParent);
    } else {
      placeBuildable.src = array[i].img;
      building.state = true;
      building.object = array[i];
      displayGrid();
    };
  } else if (currentPage == 3){

  };
};

function cantBuyAnimation(target, targetParent){
  target.style.animation = "cantBuy 0.5s";
  targetParent.style.animation = "cantBuy 0.5s";
  setTimeout(function(){
    target.style.animation = "";
    targetParent.style.animation = "";
  }, 500);
};

function buyAnimation(target, targetParent){
  target.style.animation = "buy 0.5s";
  targetParent.style.animation = "buy 0.5s";
  setTimeout(function(){
    target.style.animation = "";
    targetParent.style.animation = "";
  }, 500);
};

function cancelBuild() {
  building.state = false;
  displayGrid();
};

gridSlots.addEventListener('scroll', function(event){
  var element = event.target;
  if (element.scrollHeight - element.scrollTop === element.clientHeight){
    console.log('scrolled');
  };
});

window.addEventListener('keydown', function(e) {
  if(e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
  }
});

player.inventory.wood += 10000;
player.inventory.stone += 10000;

var loop = function(){

  if (gamePaused) {return}

  cvsMouseX = mouseX - camera.offsetX + camera.centerX - cvsWidth/2;
  cvsMouseY = mouseY - camera.offsetY + camera.centerY - cvsHeight/2;
  angle = Math.atan2(cvsMouseY - (player.yPos + player.height/2), cvsMouseX - (player.xPos + player.width/2)) * 180 / Math.PI;
  angle += 90;

  drawWorld();

  updateWorld();

  window.requestAnimationFrame(loop);
};
window.requestAnimationFrame(loop);
window.addEventListener("keydown", controller.keyUpDown);
window.addEventListener("keyup", controller.keyUpDown);
