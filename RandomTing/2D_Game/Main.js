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
      case 16: controller.shift = key_state; break; // shift key
      case 49: controller.one = key_state; break; // 1 key
      case 50: controller.two = key_state; break; // 2 key
      case 51: controller.three = key_state; break; // 3 key
      case 52: controller.four = key_state; break; // 4 key
      case 69: controller.e = key_state; break; // e key
    }
  }
};

var world = {
  xPosStart: tileSize * 6,
  yPosStart: tileSize * 6,
  background: "BackgroundGrass.jpg",
  rows: 60,
  columns: 60,
  get length() { return this.columns * tileSize;},
  get height() { return this.rows * tileSize;},
  map: [],
  resources: 40,
  enemies: 5
};

for (var i = 0; i < world.rows * world.columns; i++){
  world.map[i] = 00;
};

var background = new Image(); background.src = world.background;
var fog = new Image(); fog.src = "fog.png";
var fog90 = new Image(); fog90.src = "fog90.png";
var fog180 = new Image(); fog180.src = "fog180.png";
var fog270 = new Image(); fog270.src = "fog270.png";

var placeBuildable = new Image();

var gameState = {
  building: false,
  holding: false,
  object: "",
  canPickup: false,
  closestPickup: "",
  closestPickupDistance: "",
  closestPickupIndex: "",
  invShortcut: "",
  invShortcutIndex: "",
};

var xpRequired = [];
for (var i = 1; i < 1001; i++) {
  var num = 15 * Math.pow(i, 2) + 85;
  xpRequired.push(num)
};
var xpAnimationDelay = false;

/************************************************ SPAWNING ****************************************************/

var players = [];
var enemies = [];
var resources = [];

// enemies
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

  //states
  this.hit = -1;
  this.attacking = false;
  this.attackingCooldown = false;

  // stats
  this.color = "red";
  this.movementSpeed = 2;
  this.range = tileSize * 3.5;
  this.health = 200;
  this.maxHealth = 200;

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

  //states
  this.hit = -1;
  this.attacking = false;
  this.attackingCooldown = false;

  //stats
  this.color = "orange";
  this.movementSpeed = 1;
  this.range = tileSize * 3.5;
  this.health = 200;
  this.maxHealth = 200;

  Object.defineProperty(this, 'top', { get: function() { return this.yPos; }});
  Object.defineProperty(this, 'bottom', { get: function() { return this.yPos + this.height; }});
  Object.defineProperty(this, 'left', { get: function() { return this.xPos; }});
  Object.defineProperty(this, 'right', { get: function() { return this.xPos + this.width; }});
  Object.defineProperty(this, 'topOld', { get: function() { return this.yPosOld; }});
  Object.defineProperty(this, 'bottomOld', { get: function() { return this.yPosOld + this.height; }});
  Object.defineProperty(this, 'leftOld', { get: function() { return this.xPosOld; }});
  Object.defineProperty(this, 'rightOld', { get: function() { return this.xPosOld + this.width; }});
};

for (var i = 0; i < world.enemies; i++){
  spawnEnemy();
};
function spawnEnemy() {
  var n = Math.floor(Math.random() * (world.map.length));
  for (var i = 0; i < 9; i++){
    var k = Math.floor(i / 3);
    var x = (world.columns * k) - world.columns + n - 1 + i - (3 * k);
    if (world.map[x] != 00 && world.map[x] != undefined) { spawnEnemy(); return; };
  }; // check for adjecent tiles
  var xPos = (n * tileSize) - (world.length * Math.floor((n * tileSize) / world.length));
  var yPos = Math.floor(n / world.columns) * tileSize;
  for (var i = 0; i < enemies.length; i++){
    if (Math.abs(xPos - enemies[i].xPos) < tileSize*2 && Math.abs(yPos - enemies[i].yPos) < tileSize*2) { spawnEnemy(); return; };
  };   // check for adjecent enemies
  for (var i = 0; i < players.length; i++){
    if (Math.abs(xPos - players[i].xPos) < tileSize*6 && Math.abs(yPos - players[i].yPos) < tileSize*6) { spawnEnemy(); return; };
  };   // check for adjecent players
  enemies.push(randomEnemy(xPos, yPos));
};
function randomEnemy(xPos, yPos) {
  var x = Math.ceil(Math.random()*100);
  if (x <= 50) {return new enemy99(xPos, yPos);}
  else if (x <= 100) {return new enemy98(xPos, yPos);};
};

// resources
function tree(xPos, yPos, n){
  this.xPos = xPos;
  this.yPos = yPos;
  this.index = n;
  this.tile = 09;
  this.resource = "Wood";
  this.type = "resource";
  this.health = 500;
  this.maxHealth = 500;
  this.img = new Image();
  this.img.src = "Tree.png";
};
function stone(xPos, yPos, n){
  this.xPos = xPos;
  this.yPos = yPos;
  this.index = n;
  this.tile = 09;
  this.resource = "Stone";
  this.type = "resource";
  this.health = 500;
  this.maxHealth = 500;
};
function bronze(xPos, yPos, n){
  this.xPos = xPos;
  this.yPos = yPos;
  this.index = n;
  this.tile = 09;
  this.resource = "Bronze";
  this.type = "resource";
  this.health = 500;
  this.maxHealth = 500;
};
function silver(xPos, yPos, n){
  this.xPos = xPos;
  this.yPos = yPos;
  this.index = n;
  this.tile = 09;
  this.resource = "Silver";
  this.type = "resource";
  this.health = 500;
  this.maxHealth = 500;
};
function gold(xPos, yPos, n){
  this.xPos = xPos;
  this.yPos = yPos;
  this.index = n;
  this.tile = 09;
  this.resource = "Gold";
  this.type = "resource";
  this.health = 500;
  this.maxHealth = 500;
};

for (var i = 0; i < world.resources; i++){
  spawnResource();
};
function spawnResource() {
  var n = Math.floor(Math.random() * (world.map.length));
  for (var i = 0; i < 9; i++){
    var k = Math.floor(i / 3);
    var x = (world.columns * k) - world.columns + n - 1 + i - (3 * k);
    if (world.map[x] != 00 && world.map[x] != undefined) { spawnResource(); return; };
  };
  var xPos = (n * tileSize) - (world.length * Math.floor((n * tileSize) / world.length));
  var yPos = Math.floor(n / world.columns) * tileSize;
  for (var i = 0; i < enemies.length; i++){
    if (Math.abs(xPos - enemies[i].xPos) < tileSize*2 && Math.abs(yPos - enemies[i].yPos) < tileSize*2) { spawnResource(); return; };
  };
  for (var i = 0; i < players.length; i++){
    if (Math.abs(xPos - players[i].xPos) < tileSize*6 && Math.abs(yPos - players[i].yPos) < tileSize*6) { spawnResource(); return; };
  };
  resources.push(randomResource(xPos, yPos, n));
  world.map[n] = resources[resources.length-1];
};
function randomResource(xPos, yPos, n) {
  var x = Math.ceil(Math.random()*100);
  if (x <= 35) {return new tree(xPos, yPos, n);}
  else if (x <= 70) {return new stone(xPos, yPos, n);}
  else if (x <= 85) {return new bronze(xPos, yPos, n);}
  else if (x <= 95) {return new silver(xPos, yPos, n);}
  else if (x <= 100) {return new gold(xPos, yPos, n);}
};

// player
function createPlayer(xPos, yPos) {
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
  this.adjecentTL = ((xPos / tileSize) - 2) + ((yPos / tileSize) * world.columns - world.columns*2);
  this.xDistMoved = 0;
  this.yDistMoved = 0;
  this.adjecentTL2 = 0;
  this.adjecentTL2_OffsetX = 0;
  this.adjecentTL2_OffsetY = 0;

  // states
  this.hit = -1;
  this.punching = false;
  this.clickTimeout = false;
  this.clickTimeoutTime = 300;
  this.invSlot = 1;
  this.pickupTimeout = false;

  // stats
  this.color = "skyblue";
  this.movementSpeed = 6;
  this.range = tileSize * 3.5;
  this.health = 200;
  this.maxHealth = 200;
  this.armour = 0;
  this.maxArmour = 0;
  this.attackDMG = 5;
  this.mineDMG = 10;
  this.lvl = 1;
  this.xp = 0;

  // inventory
  this.inventory = {
    wood: 0,
    stone: 0,
    bronze: 0,
    silver: 0,
    gold: 0
  };

  Object.defineProperty(this, 'xPosHandL', { get: function() { return this.xPos - 4; }});
  Object.defineProperty(this, 'yPosHandL', { get: function() { return this.yPos + this.height/2; }});
  Object.defineProperty(this, 'xPosHandR', { get: function() { return this.yPos + this.width + 4; }});
  Object.defineProperty(this, 'yPosHandR', { get: function() { return this.yPos + this.height/2; }});

  Object.defineProperty(this, 'top', { get: function() { return this.yPos; }});
  Object.defineProperty(this, 'bottom', { get: function() { return this.yPos + this.height; }});
  Object.defineProperty(this, 'left', { get: function() { return this.xPos; }});
  Object.defineProperty(this, 'right', { get: function() { return this.xPos + this.width; }});
  Object.defineProperty(this, 'topOld', { get: function() { return this.yPosOld; }});
  Object.defineProperty(this, 'bottomOld', { get: function() { return this.yPosOld + this.height; }});
  Object.defineProperty(this, 'leftOld', { get: function() { return this.xPosOld; }});
  Object.defineProperty(this, 'rightOld', { get: function() { return this.xPosOld + this.width; }});
};

function spawnPlayer() {
  var n = Math.floor(Math.random() * (world.map.length));
  for (var i = 0; i < 9; i++){
    var k = Math.floor(i / 3);
    var x = (world.columns * k) - world.columns + n - 1 + i - (3 * k);
    if (world.map[x] != 00 && world.map[x] != undefined) { spawnPlayer(); return; };
  };
  var xPos = (n * tileSize) - (world.length * Math.floor((n * tileSize) / world.length));
  var yPos = Math.floor(n / world.columns) * tileSize;
  for (var i = 0; i < enemies.length; i++){
    if (Math.abs(xPos - enemies[i].xPos) < tileSize*6 && Math.abs(yPos - enemies[i].yPos) < tileSize*6) { spawnPlayer(); return; };
  };
  for (var i = 0; i < players.length; i++){
    if (Math.abs(xPos - players[i].xPos) < tileSize*6 && Math.abs(yPos - players[i].yPos) < tileSize*6) { spawnEnemy(); return; };
  };
  players.push(new createPlayer(xPos, yPos));
};
spawnPlayer();

var player = players[0];

// structures
var structures = [];
function structure(xPos, yPos, clickedTile){
  this.xPos = xPos;
  this.yPos = yPos;
  this.index = clickedTile;
  this.tile = gameState.object.tile;
  this.type = "structure";
  this.health = gameState.object.health;
  this.maxHealth = gameState.object.health;
  this.img = new Image();
  this.img.src = gameState.object.img;
  this.quality = gameState.object.quality;
  this.connectionTop = false;
  this.connectionLeft = false;
  this.connectionRight = false;
  this.connectionBottom = false;
};

var droppedItems = [];
var droppedAnimationSpace = 0;
var droppedAnimationDirection = -1;

/***************************************************************************************************************/

// collisions
function collisionBottom(xPos, yPos, n, object) {
  // (bottom of object)
  if (object.right > xPos && object.left < xPos + tileSize &&
      object.bottom > yPos && object.bottomOld <= yPos){
    object.yVel = 0;
    object.yPos = yPos - object.height;
  };
};
function collisionRight(xPos, yPos, n, object){
  if (object.right > xPos && object.rightOld <= xPos &&
      object.bottom > yPos && object.top < yPos + tileSize){
    object.xVel = 0;
    object.xPos = xPos - object.width;
  };
};
function collisionTop(xPos, yPos, n, object){
  if (object.right > xPos && object.left < xPos + tileSize &&
      object.top < yPos + tileSize && object.topOld >= yPos + tileSize){
    object.yVel = 0;
    object.yPos = yPos + tileSize;
  };
};
function collisionLeft(xPos, yPos, n, object){
  if (object.left < xPos + tileSize && object.leftOld >= xPos + tileSize &&
      object.bottom > yPos && object.top < yPos + tileSize){
    object.xVel = 0;
    object.xPos = xPos + tileSize;
  };
};

// vector from mouse to player
var angle = 0;
var mouseX, mouseY, cvsMouseX, cvsMouseY;
onmousemove = function(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
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

var texts = [];
function displayText(xPos, yPos, text, color) {
  texts.push({xPos: xPos, yPos: yPos, text: text, color: color, opacity: 1.00});
};

var dmgTexts = [];
function displayDmgText(xPos, yPos, text, color) {
  dmgTexts.push({xPos: xPos, yPos: yPos, text: text, color: color, opacity: 1.00});
};

/*************************************************************************************************************/

// clicking
var clickedX, clickedY, clickedTile;
document.querySelector("canvas").onclick = function(e){
  clickedX = e.clientX - camera.offsetX + camera.centerX - cvsWidth/2;
  clickedY = e.clientY - camera.offsetY + camera.centerY - cvsHeight/2;
  clickedTile = Math.floor(clickedX / tileSize) + (Math.floor(clickedY / tileSize) * world.columns);
  var xPos = (clickedTile * tileSize) - (world.length * Math.floor((clickedTile * tileSize) / world.length));
  var yPos = Math.floor(clickedTile / world.columns) * tileSize;
  // clicking in building state
  if (gameState.building == true) {
    if (world.map[clickedTile] != 00 || (Math.abs(player.xPos - xPos) < tileSize && Math.abs(player.yPos - yPos) < tileSize) || clickedX < 0 || clickedX > world.length || clickedY < 0 || clickedY > world.height){
      displayText(player.xPos, player.yPos, "Area not clear!", "rgba(255, 255, 255, ");
    } else {
      structures.push(new structure(xPos, yPos, clickedTile));
      world.map[clickedTile] = structures[structures.length-1];
      for (var i = 0; i < 9; i++){
        var k = Math.floor(i / 3);
        var x = (world.columns * k) - world.columns + clickedTile - 1 + i - (3 * k);
        if (world.map[x] != 00 && world.map[x] != undefined && i != 4) {
          if (world.map[x].type == "structure") {
            if (i == 1) {structures[structures.length-1].connectionTop = true; world.map[x].connectionBottom = true;};
            if (i == 3) { structures[structures.length-1].connectionLeft = true; world.map[x].connectionRight = true;};
            if (i == 5) { structures[structures.length-1].connectionRight = true; world.map[x].connectionLeft = true;};
            if (i == 7) { structures[structures.length-1].connectionBottom = true; world.map[x].connectionTop = true;};
          } else if (world.map[x].type == "resource") {
            // nothing as of now...
          };
        };
      };
      player.inventory.wood -= gameState.object.costWood;
      player.inventory.stone -= gameState.object.costStone;
      player.inventory.bronze -= gameState.object.costBronze;
      player.inventory.silver -= gameState.object.costSilver;
      player.inventory.gold -= gameState.object.costGold;
      var space = 0;
      if (gameState.object.costWood > 0) {displayText(player.xPos, player.yPos - space, "-" + gameState.object.costWood + " Wood", "rgba(255, 0, 0, "); space += 20;};
      if (gameState.object.costStone > 0) {displayText(player.xPos, player.yPos - space, "-" + gameState.object.costStone + " Stone", "rgba(255, 0, 0, "); space += 20;};
      if (gameState.object.costBronze > 0) {displayText(player.xPos, player.yPos - space, "-" + gameState.object.costBronze + " Bronze", "rgba(255, 0, 0, "); space += 20;};
      if (gameState.object.costSilver > 0) {displayText(player.xPos, player.yPos - space, "-" + gameState.object.costSilver + " Silver", "rgba(255, 0, 0, "); space += 20;};
      if (gameState.object.costGold > 0) {displayText(player.xPos, player.yPos - space, "-" + gameState.object.costGold + " Gold", "rgba(255, 0, 0, ");};
      gameState.building = false;
      displayGrid();
    };
    return;
  };
  // clicking in holding state
  if (gameState.holding == true) {
    gameState.object.imgDropped = new Image();
    gameState.object.imgDropped.src = gameState.object.img;
    if (45 < angle && angle <= 135) {
      gameState.object.xPos = player.xPos + player.width + tileSize*2;
      gameState.object.yPos = player.yPos;
    } else if (135 < angle && angle <= 225) {
      gameState.object.xPos = player.xPos;
      gameState.object.yPos = player.yPos + player.height + tileSize*2;
    } else if (225 < angle || angle <= -45) {
      gameState.object.xPos = player.xPos - tileSize*2;
      gameState.object.yPos = player.yPos;
    } else {
      gameState.object.xPos = player.xPos;
      gameState.object.yPos = player.yPos - tileSize*2;
    };
    droppedItems.push(gameState.object);
    gameState.holding = false;
    holdingItem.style.display = "none";
    return;
  };
  // clicking normaly
  if (closestIntersect != null && !player.clickTimeout) {
    player.clickTimeout = true;
    setTimeout(function(){player.clickTimeout = false;}, player.clickTimeoutTime);
//  if (world.map[closestIntersect.tile] == 30) {
    if (world.map[closestIntersect.tile].type == "resource") {
      var index = resources.findIndex(i => i.index === closestIntersect.tile);
      var resource = resources[index].resource;
      resources[index].health -= player.mineDMG;
      var difference = 0;
      if (resources[index].health <= 0){
        difference = resources[index].health;
        if (resource == "Wood" || resource == "Stone") {player.xp += 50;}
        else if (resource == "Bronze") {player.xp += 150;}
        else if (resource == "Silver") {player.xp += 400;}
        else if (resource == "Gold") {player.xp += 900;}
      };
      displayText(player.xPos, player.yPos, "+" + (Math.floor((player.mineDMG + difference) / 10)) + " " + resource, "rgba(45, 235, 64, ");
      player.inventory[resource.toLowerCase()] += Math.floor((player.mineDMG + difference) / 10);
    } else if (world.map[closestIntersect.tile].type == "structure") {
      var index = structures.findIndex(i => i.index === closestIntersect.tile);
      structures[index].health -= player.mineDMG;
    } else {
      enemies[closestIntersect.tile].health -= player.attackDMG;
      displayDmgText(enemies[closestIntersect.tile].xPos, enemies[closestIntersect.tile].yPos, "-" + player.attackDMG, "rgba(255, 0, 0, ");
      if (enemies[closestIntersect.tile].health <= 0) {
        displayText(player.xPos, player.yPos, "Enemy killed...", "rgba(255, 0, 255, ");
        player.xp += 400;
        return;
      };
      var oldColor = enemies[closestIntersect.tile].color;
      enemies[closestIntersect.tile].color = "white";
      setTimeout(function(){enemies[closestIntersect.tile].color = oldColor;}, 50);
    };
  };
};

document.querySelector("canvas").oncontextmenu = function(e){
  e.preventDefault();
}

// grid slots
var craftables = [
  {name: "Wooden Sword", type: "weapon", attackDMG: 10, mineDMG: 10, img: "Craftables/ItemPlaceholder.png", lvlReq: 1, costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Stone Sword", type: "weapon", attackDMG: 15, mineDMG: 10, img: "Craftables/ItemPlaceholder.png", lvlReq: 3, costWood: 50, costStone: 100, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Bronze Sword", type: "weapon", attackDMG: 25, mineDMG: 10, img: "Craftables/ItemPlaceholder.png", lvlReq: 6, costWood: 100, costStone: 0, costBronze: 200, costSilver: 0, costGold: 0},
  {name: "Silver Sword", type: "weapon", attackDMG: 40, mineDMG: 10, img: "Craftables/ItemPlaceholder.png", lvlReq: 12, costWood: 150, costStone: 0, costBronze: 100, costSilver: 300, costGold: 0},
  {name: "Golden Sword", type: "weapon", attackDMG: 70, mineDMG: 10, img: "Craftables/ItemPlaceholder.png", lvlReq: 20, costWood: 200, costStone: 0, costBronze: 200, costSilver: 0, costGold: 400},
  {name: "Wooden Hammer", type: "weapon", attackDMG: 5, mineDMG: 20, img: "Craftables/Wooden_Hammer.png", lvlReq: 1, costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Stone Hammer", type: "weapon", attackDMG: 5, mineDMG: 30, img: "Craftables/Stone_Hammer.png", lvlReq: 3, costWood: 50, costStone: 100, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Bronze Hammer", type: "weapon", attackDMG: 5, mineDMG: 60, img: "Craftables/Bronze_Hammer.png", lvlReq: 6, costWood: 100, costStone: 0, costBronze: 200, costSilver: 0, costGold: 0},
  {name: "Silver Hammer", type: "weapon", attackDMG: 5, mineDMG: 120, img: "Craftables/Silver_Hammer.png", lvlReq: 12, costWood: 150, costStone: 0, costBronze: 100, costSilver: 300, costGold: 0},
  {name: "Golden Hammer", type: "weapon", attackDMG: 5, mineDMG: 180, img: "Craftables/Golden_Hammer.png", lvlReq: 20, costWood: 200, costStone: 0, costBronze: 200, costSilver: 0, costGold: 400},
  {name: "Wooden Spear", type: "weapon", attackDMG: 10, mineDMG: 10, img: "Craftables/ItemPlaceholder.png", lvlReq: 3, costWood: 200, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Stone Spear", type: "weapon", attackDMG: 15, mineDMG: 10, img: "Craftables/ItemPlaceholder.png", lvlReq: 6, costWood: 200, costStone: 200, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Bronze Spear", type: "weapon", attackDMG: 25, mineDMG: 10, img: "Craftables/ItemPlaceholder.png", lvlReq: 12, costWood: 200, costStone: 0, costBronze: 400, costSilver: 0, costGold: 0},
  {name: "Silver Spear", type: "weapon", attackDMG: 39, mineDMG: 10, img: "Craftables/ItemPlaceholder.png", lvlReq: 20, costWood: 200, costStone: 0, costBronze: 0, costSilver: 600, costGold: 0},
  {name: "Golden Spear", type: "weapon", attackDMG: 67, mineDMG: 10, img: "Craftables/ItemPlaceholder.png", lvlReq: 30, costWood: 200, costStone: 0, costBronze: 0, costSilver: 0, costGold: 800},
  {name: "Wooden Sheild", type: "sheild", attackDMG: 5, mineDMG: 10, img: "Craftables/ItemPlaceholder.png", lvlReq: 3, costWood: 400, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Stone Sheild", type: "sheild", attackDMG: 5, mineDMG: 10, img: "Craftables/ItemPlaceholder.png", lvlReq: 6, costWood: 200, costStone: 400, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Bronze Sheild", type: "sheild", attackDMG: 5, mineDMG: 10, img: "Craftables/ItemPlaceholder.png", lvlReq: 12, costWood: 200, costStone: 0, costBronze: 600, costSilver: 0, costGold: 0},
  {name: "Silver Sheild", type: "sheild", attackDMG: 5, mineDMG: 10, img: "Craftables/ItemPlaceholder.png", lvlReq: 20, costWood: 200, costStone: 0, costBronze: 0, costSilver: 800, costGold: 0},
  {name: "Golden Sheild", type: "sheild", attackDMG: 5, mineDMG: 10, img: "Craftables/ItemPlaceholder.png", lvlReq: 30, costWood: 200, costStone: 0, costBronze: 0, costSilver: 0, costGold: 1000},
  {name: "Leather Armour", type: "armour", armour: 100, img: "Craftables/ItemPlaceholder.png", lvlReq: 3, costWood: 800, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Bone Armour", type: "armour", armour: 200, img: "Craftables/ItemPlaceholder.png", lvlReq: 6, costWood: 0, costStone: 800, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Bronze Armour", type: "armour", armour: 400, img: "Craftables/ItemPlaceholder.png", lvlReq: 12, costWood: 0, costStone: 0, costBronze: 1200, costSilver: 0, costGold: 0},
  {name: "Silver Armour", type: "armour", armour: 800, img: "Craftables/ItemPlaceholder.png", lvlReq: 20, costWood: 0, costStone: 0, costBronze: 0, costSilver: 1600, costGold: 0},
  {name: "Golden Armour", type: "armour", armour: 1600, img: "Craftables/ItemPlaceholder.png", lvlReq: 30, costWood: 0, costStone: 30, costBronze: 0, costSilver: 0, costGold: 2000},
  {name: "a Sword", type: "weapon", attackDMG: 15, mineDMG: 15, img: "Craftables/ItemPlaceholder.png", lvlReq: 0, costWood: 0, costStone: 30, costBronze: 0, costSilver: 0, costGold: 2000},
  {name: "a Sword", type: "weapon", attackDMG: 15, mineDMG: 15, img: "Craftables/ItemPlaceholder.png", lvlReq: 0, costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "a Sword", type: "weapon", attackDMG: 15, mineDMG: 15, img: "Craftables/ItemPlaceholder.png", lvlReq: 0, costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "a Sword", type: "weapon", attackDMG: 15, mineDMG: 15, img: "Craftables/ItemPlaceholder.png", lvlReq: 0, costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "a Sword", type: "weapon", attackDMG: 15, mineDMG: 15, img: "Craftables/ItemPlaceholder.png", lvlReq: 0, costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "a Sword", type: "weapon", attackDMG: 15, mineDMG: 15, img: "Craftables/ItemPlaceholder.png", lvlReq: 0, costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "a Sword", type: "weapon", attackDMG: 15, mineDMG: 15, img: "Craftables/ItemPlaceholder.png", lvlReq: 0, costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "a Sword", type: "weapon", attackDMG: 15, mineDMG: 15, img: "Craftables/ItemPlaceholder.png", lvlReq: 0, costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "a Sword", type: "weapon", attackDMG: 15, mineDMG: 15, img: "Craftables/ItemPlaceholder.png", lvlReq: 0, costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "a Sword", type: "weapon", attackDMG: 15, mineDMG: 15, img: "Craftables/ItemPlaceholder.png", lvlReq: 0, costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "a Sword", type: "weapon", attackDMG: 15, mineDMG: 15, img: "Craftables/ItemPlaceholder.png", lvlReq: 0, costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "a Sword", type: "special", attackDMG: 15, mineDMG: 15, img: "Craftables/ItemPlaceholder.png", lvlReq: 0, costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0}
];
var buildables = [
  {name: "Wooden Wall", quality: "Wood", tile: 09, health: 700, img: "Buildables/WallWood09.png", lvlReq: 1, costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Stone Wall", quality: "Stone", tile: 09, health: 1000, img: "Buildables/WallStone09.png", lvlReq: 1, costWood: 0, costStone: 100, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Bronze Wall", quality: "Bronze", tile: 09, health: 2000, img: "Buildables/WallBronze09.png", lvlReq: 1, costWood: 0, costStone: 0, costBronze: 150, costSilver: 0, costGold: 0},
  {name: "Silver Wall", quality: "Silver", tile: 09, health: 5000, img: "Buildables/WallSilver09.png", lvlReq: 1, costWood: 0, costStone: 0, costBronze: 0, costSilver: 150, costGold: 0},
  {name: "Golden Wall", quality: "Gold", tile: 09, health: 12000, img: "Buildables/WallGold09.png", lvlReq: 1, costWood: 0, costStone: 0, costBronze: 0, costSilver: 0, costGold: 200},
  {name: "Wooden Gate", open: false, quality: "Wood", tile: 09, health: 700, img: "Buildables/GateWood2.png", lvlReq: 1, costWood: 200, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Stone Gate", quality: "Stone", tile: 09, health: 1000, img: "Buildables/StructurePlaceholder.png", lvlReq: 1, costWood: 000, costStone: 200, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Bronze Gate", quality: "Bronze", tile: 09, health: 2000, img: "Buildables/StructurePlaceholder.png", lvlReq: 1, costWood: 000, costStone: 0, costBronze: 300, costSilver: 0, costGold: 0},
  {name: "Silver Gate", quality: "Silver", tile: 09, health: 5000, img: "Buildables/StructurePlaceholder.png", lvlReq: 1, costWood: 000, costStone: 0, costBronze: 0, costSilver: 300, costGold: 0},
  {name: "Golden Gate", quality: "Gold", tile: 09, health: 12000, img: "Buildables/StructurePlaceholder.png", lvlReq: 1, costWood: 000, costStone: 0, costBronze: 0, costSilver: 0, costGold: 400},
  {name: "Cannon", quality: "unspecified", tile: 09, health: 800, img: "Buildables/StructurePlaceholder.png", lvlReq: 1, costWood: 500, costStone: 500, costBronze: 2000, costSilver: 0, costGold: 0},
  {name: "Mortar", quality: "unspecified", tile: 09, health: 1200, img: "Buildables/StructurePlaceholder.png", lvlReq: 1, costWood: 500, costStone: 500, costBronze: 2000, costSilver: 0, costGold: 0},
  {name: "X-Bow", quality: "unspecified", tile: 09, health: 1600, img: "Buildables/StructurePlaceholder.png", lvlReq: 1, costWood: 5000, costStone: 500, costBronze: 500, costSilver: 0, costGold: 0},
  {name: "Dragon Breath", quality: "Wood", tile: 09, health: 200, img: "Buildables/StructurePlaceholder.png", lvlReq: 1, costWood: 100, costStone: 0, costBronze: 0, costSilver: 400, costGold: 0},
  {name: "Wooden Sword", quality: "Wood", tile: 09, health: 200, img: "Buildables/StructurePlaceholder.png", lvlReq: 1, costWood: 100, costStone: 0, costBronze: 0, costSilver: 0, costGold: 500},
  {name: "Wooden Sword", quality: "Wood", tile: 09, health: 200, img: "Buildables/StructurePlaceholder.png", lvlReq: 1, costWood: 400, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Wooden Sword", quality: "Wood", tile: 09, health: 200, img: "Buildables/StructurePlaceholder.png", lvlReq: 1, costWood: 200, costStone: 400, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Wooden Sword", quality: "Wood", tile: 09, health: 200, img: "Buildables/StructurePlaceholder.png", lvlReq: 1, costWood: 200, costStone: 0, costBronze: 600, costSilver: 0, costGold: 0},
  {name: "Wooden Sword", quality: "Wood", tile: 09, health: 200, img: "Buildables/StructurePlaceholder.png", lvlReq: 1, costWood: 200, costStone: 0, costBronze: 0, costSilver: 800, costGold: 0},
  {name: "Wooden Sword", quality: "Wood", tile: 09, health: 200, img: "Buildables/StructurePlaceholder.png", lvlReq: 1, costWood: 200, costStone: 0, costBronze: 0, costSilver: 0, costGold: 1000},
  {name: "Wooden Sword", quality: "Wood", tile: 09, health: 200, img: "Buildables/WallWoodRuins.png", lvlReq: 1, costWood: 800, costStone: 0, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Wooden Sword", quality: "Wood", tile: 09, health: 200, img: "Buildables/WallStoneRuins.png", lvlReq: 1, costWood: 0, costStone: 800, costBronze: 0, costSilver: 0, costGold: 0},
  {name: "Wooden Sword", quality: "Wood", tile: 09, health: 200, img: "Buildables/WallBronzeRuins.png", lvlReq: 1, costWood: 0, costStone: 0, costBronze: 1200, costSilver: 0, costGold: 0},
  {name: "Wooden Sword", quality: "Wood", tile: 09, health: 200, img: "Buildables/WallSilverRuins.png", lvlReq: 1, costWood: 0, costStone: 0, costBronze: 0, costSilver: 1600, costGold: 0},
  {name: "Wooden Sword", quality: "Wood", tile: 09, health: 200, img: "Buildables/WallGoldRuins.png", lvlReq: 1, costWood: 0, costStone: 30, costBronze: 0, costSilver: 0, costGold: 2000}
];
var inventory = [];

var gridSlots = document.getElementById("gridSlots");
var itemInfo = document.getElementById("itemInfo");
var currentPage = 1;
var infoDelay;
var array;
var holdingItem = document.getElementById("holdingItem");
document.getElementById("primary").style.border = "2px solid blue";
document.getElementById("primary").style.width = "50px";
document.getElementById("primary").style.height = "50px";

function gridBtnOnclick(i) {
  if (gameState.building == true){ return; };
  if (gameState.holding == true) { return; };
  currentPage = i;
  displayGrid();
};

// display grid
function displayGrid(){
  gridSlots.innerHTML = "";
  if (gameState.building == true) {
    clearTimeout(infoDelay);
    itemInfo.style.display = "none";
    array = null;
    itemInfo.innerHTML = ``;
    gridSlots.innerHTML = `
      <div style="grid-column: 1 / span 3; height: 138px; position: relative; filter: brightness(100%);">
        <p style="margin: 0px; position: absolute; top: 10px; left: 50%; transform: translateX(-50%); text-decoration: underline; white-space: nowrap;">${gameState.object.name}</p>
        <div style="position: absolute; top: 60%; left: 50%; transform: translate(-50%, -50%); width: 54px; height: 54px; filter: brightness(100%);">
          <img style="width: 100%;" src="${gameState.object.img}">
        </div>
      </div>
      <div style="grid-column: 4 / span 5; height: 138px; filter: position: relative; filter: brightness(100%); margin-left: -0px;">
        <p style="color: red; margin: 0px; position: absolute; top: 50%; right: 10px; transform: translateY(-50%);">
          -${gameState.object.costWood} Wood<br>
          -${gameState.object.costStone} Stone<br>
          -${gameState.object.costBronze} Bronze<br>
          -${gameState.object.costSilver} Silver<br>
          -${gameState.object.costGold} Gold<br>
        </p>
      </div>
      <div onclick="cancelBuild()" style="grid-column: 1 / span 8; height: 138px; filter: brightness(100%); position: relative;">
        <p style="margin: 0px; position: absolute; top: 0px; left: 50%; transform: translateX(-50%); white-space: nowrap;">(Click on the canvas to build)</p>
        <p style="animation: textPulse 1.5s linear infinite; text-align: center; font-size: 23px; margin-top: 35px;">Click here<br>to Cancel!</p>
      </div>
    `;
    return;
  };
  if (currentPage == 1) {
    array = craftables;
    document.getElementById("btnCraft").style.opacity = "1";
    document.getElementById("btnBuild").style.opacity = "0.6";
    document.getElementById("btnInventory").style.opacity = "0.6";
  } else if (currentPage == 2) {
    array = buildables;
    document.getElementById("btnCraft").style.opacity = "0.6";
    document.getElementById("btnBuild").style.opacity = "1";
    document.getElementById("btnInventory").style.opacity = "0.6";
  } else if (currentPage == 3) {
    array = inventory;
    document.getElementById("btnCraft").style.opacity = "0.6";
    document.getElementById("btnBuild").style.opacity = "0.6";
    document.getElementById("btnInventory").style.opacity = "1";
  };
  var emptySlots = 25 - array.length;
  for (var i = 0; i < array.length; i++){
    gridSlots.innerHTML += `<div onmouseover="displayObjectInfo(${event, i})" onmouseout="RemoveObjectInfo(${event, i})" onclick="clickObject(${event, i})"> <img src="${array[i].img}"> </div>`
  };
  if (emptySlots > 0) {
    for (var i = 0; i < emptySlots; i++){
      gridSlots.innerHTML += `<div onclick="clickEmptyObject(${event, i})"></div>`
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

// hover over object
function displayObjectInfo(i){
  if (i == "primary" || i == "secondary" || i == "special" || i == "armour") {
    if (window[i] == null) {return;};
    itemInfo.style.display = "inline-block";
    itemInfo.innerHTML = `${window[i].name}<br>`;
    return;
  };
  event.target.style.border = "2px solid black";
  event.target.style.width = "50px";
  event.target.style.height = "50px";
  if (currentPage == 3) {
    itemInfo.style.display = "inline-block";
    itemInfo.innerHTML = `${array[i].name}<br>`;
    gameState.invShortcut = Object.assign({}, array[i]);
    gameState.invShortcutIndex = i;
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
  if (i == "primary" || i == "secondary" || i == "special" || i == "armour") {
    if (window[i] == null) {return;};
    clearTimeout(infoDelay);
    itemInfo.style.display = "none";
    itemInfo.innerHTML = ``;
    return;
  };
  if (currentPage == 3){
    gameState.invShortcut = "";
    gameState.invShortcutIndex = "";
  };
  event.target.style.border = "";
  event.target.style.width = "54px";
  event.target.style.height = "54px";
  clearTimeout(infoDelay);
  itemInfo.style.display = "none";
  itemInfo.innerHTML = ``;
}

// clicking on object
function clickObject(i){
  var target = event.target;
  var targetParent = event.target.parentElement;
  if (targetParent == gridSlots) {
    targetParent = target;
    target = event.target.querySelector("img");
  }
  if (currentPage == 1){
    if (array[i].lvlReq > player.lvl) {
      displayText(player.xPos, player.yPos, "Require a higher lvl!", "rgba(255, 255, 255, ");
      cantBuyAnimation(target, targetParent);
      return;
    };
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
      gameState.building = true;
      gameState.object = array[i];
      displayGrid();
    };
  } else if (currentPage == 3){
    if (gameState.holding == true){
      displayText(player.xPos, player.yPos, "Already occupied!", "rgba(255, 255, 255, ");
      return;
    };
    gameState.holding = true;
    gameState.object = Object.assign({}, array[i]);
    itemInfo.style.display = "none";
    itemInfo.innerHTML = ``;
    clearTimeout(infoDelay);
    inventory.splice(i, 1);
    displayGrid();
  };
};

function clickEmptyObject(i){
  if (gameState.holding == true){
    inventory.push(gameState.object);
    displayGrid();
    gameState.holding = false;
    holdingItem.style.display = "none";
  };
};

// clicking on holding slot
var primary, secondary, special, armour;
function invOnclick(i){
  if (gameState.holding == true){
    if (window[i] != null) {
      displayText(player.xPos, player.yPos, "Already occupied!", "rgba(255, 255, 255, ");
      return;
    }
    if (i == "primary" || i == "secondary") {
      if (gameState.object.type != "weapon" && gameState.object.type != "sheild") {
        displayText(player.xPos, player.yPos, "Wrong class!", "rgba(255, 255, 255, ");
        return;
      };
    } else if (i == "special") {
      if (gameState.object.type != "special") {
        displayText(player.xPos, player.yPos, "Wrong class!", "rgba(255, 255, 255, ");
        return;
      };
    } else if (i == "armour") {
      if (gameState.object.type != "armour") {
        displayText(player.xPos, player.yPos, "Wrong class!", "rgba(255, 255, 255, ");
        return;
      };
      player.health += gameState.object.armour;
      player.maxHealth = 200 + gameState.object.armour;
    };
    window[i] = gameState.object;
    var div = document.getElementById(i);
    div.innerHTML = `<img style="width: 100%" src="${gameState.object.img}">`;
    div.style.filter = "brightness(100%)";
    div.style.opacity = "1";
    gameState.holding = false;
    holdingItem.style.display = "none";
    updatePlayerStats();
  } else {
    if (window[i] == null) {return;};
    gameState.holding = true;
    gameState.object = Object.assign({}, window[i]);
    itemInfo.style.display = "none";
    itemInfo.innerHTML = ``;
    clearTimeout(infoDelay);
    var div = document.getElementById(i);
    if (window[i] == primary || window[i] == secondary) {
      div.innerHTML = `<img src="Icon_PrimarySecondary.png">`;
    } else if (window[i] == armour) {
      div.innerHTML = `<img src="Icon_Armour.png">`;
      player.health = 200;
      player.maxHealth = 200;
    } else if (window[i] == special) {
      div.innerHTML = ``;
    };
    div.style.filter = "brightness(50%)";
    div.style.opacity = "0.9";
    window[i] = null;
    updatePlayerStats();
  };
};

// animations
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

// cancel build
function cancelBuild() {
  gameState.building = false;
  displayGrid();
};

// update player on slot change
function updatePlayerStats() {
  if (player.invSlot == 1) {
    if (primary != null) {
      player.attackDMG = primary.attackDMG;
      player.mineDMG = primary.mineDMG;
    } else {
      player.attackDMG = 5;
      player.mineDMG = 5;
    };
  } else if (player.invSlot == 2) {
    if (secondary != null) {
      player.attackDMG = secondary.attackDMG;
      player.mineDMG = secondary.mineDMG;
    } else {
      player.attackDMG = 5;
      player.mineDMG = 5;
    };
  } else if (player.invSlot == 3) {
    player.attackDMG = 5;
    player.mineDMG = 5;
    //something else
  };
};

/*************************************************************************************************************/
/*
  - fix health armour mess...

  colors:
    wood: #8D6142
    stone: grey 	#808080
    bronze: #cd7f32
    silver: silver 	#C0C0C0
    gold: gold #FFDF00
*/

gridSlots.addEventListener('scroll', function(event){
  var element = event.target;
  if (element.scrollHeight - element.scrollTop === element.clientHeight){
    console.log('scrolled');
  };
});

window.addEventListener('keydown', function(e) {
  if(e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
  };
});
/*
player.inventory.wood += 10000;
player.inventory.stone += 10000;
player.inventory.bronze += 10000;
player.inventory.silver += 10000;
player.inventory.gold += 10000;
player.lvl += 30;*/

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
