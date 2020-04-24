var ctx = document.querySelector("canvas").getContext("2d");
var cvs = document.querySelector("canvas");
const tileSize = 48;
// size of visible area
const cvsWidth = window.innerWidth - document.getElementById("sideBar").offsetWidth;
const cvsHeight = window.innerHeight;
document.getElementById("canvasArea").style.maxWidth = cvsWidth + "px";
document.getElementById("canvasArea").style.maxHeight = cvsHeight + "px";
// size of entire canvas
ctx.canvas.width = Math.floor(cvsWidth * 1.5 / tileSize) * tileSize;
ctx.canvas.height = Math.floor(cvsHeight * 1.5 / tileSize) * tileSize;

var gameState = {
  holding: false,
  state: "building", // testing, building, editing, configuring
  editState: "", // select, deselect, delete
  selectStart: "",
  selectEnd: "",
  object: [],
};

var camera = {
  centerX: cvsWidth/2,
  centerY: cvsHeight/2,
  columns: Math.ceil(cvsWidth / tileSize) + 1,
  rows: Math.ceil(cvsHeight / tileSize) + 1,
  tileTL: 0,
  offsetX: 250 + 2,
  offsetY: 0,
  hoveredTile: 0,
  hoveredxPos: 0,
  hoveredyPos: 0,
  isHovered: false
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
    }
  }
};

var world = {
  xPosStart: tileSize * 3,
  yPosStart: tileSize * 15,
  background: "#202020",
  columns: ctx.canvas.width / tileSize,
  rows: ctx.canvas.height / tileSize,
  get width() { return this.columns * tileSize;},
  get height() { return this.rows * tileSize;},
  map: [],
  entities: [],
  objcts: []
};

for (var i = 0; i < world.rows * world.columns; i++){
  world.map[i] = 0;
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

/*********************************************************************************************************************/

var gridBuild = document.getElementById("gridBuild");
var gridEdit = document.getElementById("gridEdit");
var gridBuildItems = [
  {tile: 12, type: "Grass", autotile: "True", img: "Imported/TileGrass12.png"},
  {tile: 14, type: "Grass", autotile: "True", img: "Imported/TileGrass14.png"},
  {tile: 10, type: "Grass", autotile: "True", img: "Imported/TileGrass10.png"},
  {tile: 08, type: "Grass", autotile: "True", img: "Imported/TileGrass08.png"},
  {tile: 13, type: "Grass", autotile: "True", img: "Imported/TileGrass13.png"},
  {tile: 15, type: "Grass", autotile: "True", img: "Imported/TileGrass15.png"},
  {tile: 11, type: "Grass", autotile: "True", img: "Imported/TileGrass11.png"},
  {tile: 09, type: "Grass", autotile: "True", img: "Imported/TileGrass09.png"},
  {tile: 05, type: "Grass", autotile: "True", img: "Imported/TileGrass05.png"},
  {tile: 07, type: "Grass", autotile: "True", img: "Imported/TileGrass07.png"},
  {tile: 03, type: "Grass", autotile: "True", img: "Imported/TileGrass03.png"},
  {tile: 01, type: "Grass", autotile: "True", img: "Imported/TileGrass01.png"},
  {tile: 04, type: "Grass", autotile: "True", img: "Imported/TileGrass04.png"},
  {tile: 06, type: "Grass", autotile: "True", img: "Imported/TileGrass06.png"},
  {tile: 02, type: "Grass", autotile: "True", img: "Imported/TileGrass02.png"},
  {tile: 00, type: "Grass", autotile: "True", img: "Imported/TileGrass00.png"},

  {tile: 25, type: "Grass", autotile: "Slope", img: "Imported/TileGrass25.png"},
  {tile: 26, type: "Grass", autotile: "Slope", img: "Imported/TileGrass26.png"},
  {tile: 266, type: "Grass", autotile: "Slope", img: "Imported/TileGrass266.png"},
  {tile: 35, type: "Grass", autotile: "Slope", img: "Imported/TileGrass35.png"},
  {tile: 27, type: "Grass", autotile: "Slope", img: "Imported/TileGrass27.png"},
  {tile: 28, type: "Grass", autotile: "Slope", img: "Imported/TileGrass28.png"},
  {tile: 288, type: "Grass", autotile: "Slope", img: "Imported/TileGrass288.png"},
  {tile: 37, type: "Grass", autotile: "Slope", img: "Imported/TileGrass37.png"},

  {tile: 05, img: "Tiles/Tile05.png"},
  {tile: 01, img: "Tiles/Tile01.png"},
  {tile: 08, img: "Tiles/Tile08.png"},
  {tile: 16, img: "Tiles/Tile16.png"},
  {tile: 02, img: "Tiles/Tile02.png"},
  {tile: 10, img: "Tiles/Tile10.png"},
  {tile: 04, img: "Tiles/Tile04.png"},
  {tile: 17, img: "Tiles/Tile17.png"},
  {tile: 06, img: "Tiles/Tile06.png"},
  {tile: 03, img: "Tiles/Tile03.png"},
  {tile: 07, img: "Tiles/Tile07.png"},
  {tile: 18, img: "Tiles/Tile18.png"},
  {tile: 20, img: "Tiles/Tile20.png"},
  {tile: 19, img: "Tiles/Tile19.png"},
  {tile: 21, img: "Tiles/Tile21.png"},
  {tile: 09, img: "Tiles/Tile09.png"},
  {tile: 14, img: "Tiles/Tile14.png"},
  {tile: 15, img: "Tiles/Tile15.png"},
  {tile: 11, img: "Tiles/Tile11.png"},
  {tile: 99, img: "Tiles/TileSnow.png"},
  {tile: 25, img: "Tiles/Tile25.png"},
  {tile: 26, img: "Tiles/Tile26.png"},
  {tile: 27, img: "Tiles/Tile27.png"},
  {tile: 28, img: "Tiles/Tile28.png"},
  {tile: 29, img: "Tiles/Tile29.png"},
  {tile: 30, img: "Tiles/Tile30.png"},
  {tile: 31, img: "Tiles/Tile31.png"},
  {tile: 32, img: "Tiles/Tile32.png"},
  {tile: 40, img: "Tiles/Tile40.png"},
  {tile: 41, img: "Tiles/Tile41.png"},
  {tile: 50, img: "Tiles/Tile50.png"},
  {tile: 51, img: "Tiles/Tile51.png"},
  {tile: 52, img: "Tiles/Tile52.png"},
  {tile: 60, img: "Tiles/Tile60.png"},
  {tile: 61, img: "Tiles/Tile61.png"},
  {tile: 62, img: "Tiles/Tile62.png"},
  {tile: 63, img: "Tiles/Tile63.png"},
  {tile: 64, img: "Tiles/Tile64.png"},
  {tile: 65, img: "Tiles/Tile65.png"},
  {tile: 66, img: "Tiles/Tile66.png"},
  {tile: 67, img: "Tiles/Tile67.png"},
  {tile: 70, img: "Tiles/Tile70.png"},
  {tile: 71, img: "Tiles/Tile71.png"},
  {tile: 72, img: "Tiles/Tile72.png"},
  {tile: 73, img: "Tiles/Tile73.png"},
  {tile: 74, img: "Tiles/Tile74.png"},
  {tile: 75, img: "Tiles/Tile75.png"},
  {tile: 80, img: "Tiles/Tile80.png"},
  {tile: 81, img: "Tiles/Tile81.png"},
  {tile: 82, img: "Tiles/Tile82.png"},
  {tile: 83, img: "Tiles/Tile83.png"},
];

function createGridBuild() {
  gridBuild.innerHTML = ``;
  for (var i = 0; i < gridBuildItems.length; i++){
    gridBuild.innerHTML += `<div onclick="selectGridItem(${i})"></div>`;
    gridBuild.getElementsByTagName('div')[i].style.backgroundImage = `url(${gridBuildItems[i].img})`;
  };
};

function setModeConfig(){
  gameState.state = "configuring";
  deselectAll();
  gridConfig.style.display = "block";
  gridBuild.style.display = "none";
  gridEdit.style.display = "none";
  document.getElementById("btnConfig").querySelector("p").classList.add("active");
  document.getElementById("btnBuild").querySelector("p").classList.remove("active");
  document.getElementById("btnEdit").querySelector("p").classList.remove("active");
  document.getElementById("fadeout-gridBottom").style.display = "none";
  document.getElementById("fadeout-gridTop").style.display = "none";
};
function setModeBuild(){
  createGridBuild()
  gameState.state = "building";
  deselectAll();
  gridConfig.style.display = "none";
  gridBuild.style.display = "grid";
  gridEdit.style.display = "none";
  document.getElementById("btnConfig").querySelector("p").classList.remove("active");
  document.getElementById("btnBuild").querySelector("p").classList.add("active");
  document.getElementById("btnEdit").querySelector("p").classList.remove("active");
  document.getElementById("fadeout-gridBottom").style.display = "block";
  document.getElementById("fadeout-gridTop").style.display = "block";
};
function setModeEdit(){
  gameState.state = "editing";
  deselectAll();
  gridConfig.style.display = "none";
  gridBuild.style.display = "none";
  gridEdit.style.display = "grid";
  setEditState("select");
  document.getElementById("btnConfig").querySelector("p").classList.remove("active");
  document.getElementById("btnBuild").querySelector("p").classList.remove("active");
  document.getElementById("btnEdit").querySelector("p").classList.add("active");
  document.getElementById("fadeout-gridBottom").style.display = "none";
  document.getElementById("fadeout-gridTop").style.display = "none";
};

function setEditState(state) {
  gameState.editState = String(state);
  document.getElementById("select").classList.remove("active");
  document.getElementById("deselect").classList.remove("active");
  document.getElementById("delete").classList.remove("active");
  document.getElementById(String(state)).classList.add("active");
}; // used in game.html

function selectGridItem(i) {
  createGridBuild()
  gameState.object = Object.assign({}, gridBuildItems[i]);
  var img = new Image();
  img.src = gameState.object.img;
  gameState.object.img = img;
  gridBuild.getElementsByTagName('div')[i].style.border = "2px solid white";
  gridBuild.getElementsByTagName('div')[i].style.height = "52px";
};

gridBuild.addEventListener('scroll', function(event){
  var element = event.target;
  if (element.scrollHeight - Math.ceil(element.scrollTop) <= element.clientHeight){
    document.getElementById("fadeout-gridBottom").style.opacity = "0";
  } else {
    document.getElementById("fadeout-gridBottom").style.opacity = "1";
  };
  if (element.scrollTop == 0){
    document.getElementById("fadeout-gridTop").style.opacity = "0";
  } else {
    document.getElementById("fadeout-gridTop").style.opacity = "1";
  };
});

var occupiedTiles = [];
function addOccupiedTile(tile) {
  var xPos = (tile * tileSize) - (world.width * Math.floor((tile * tileSize) / world.width));
  var yPos = Math.floor(tile / world.columns) * tileSize;
  occupiedTiles.push({
    xPos: xPos,
    yPos: yPos,
    opacity: 0.40
  });
};

function deselectAll() {
  gameState.object = [];
  document.getElementById("spanText").innerHTML = `Deselect all (${gameState.object.length})`;
};

function translateUp() {
  gameState.object.sort(sortArrayTopFirst);
  var commence = true;
  for (var i = 0; i < gameState.object.length; i++){
    var newIndex = gameState.object[i] - world.columns;
    if (world.map[newIndex] != 0 && gameState.object.indexOf(newIndex) == -1) {
      addOccupiedTile(newIndex);
      commence = false;
    };
    if (newIndex > world.map.length || newIndex < 0){
      addOccupiedTile(gameState.object[i]);
      commence = false;
    };
  };
  if (commence == false) {return; };
  for (var i = 0; i < gameState.object.length; i++){
    var newIndex = gameState.object[i] - world.columns;
    world.map[newIndex] = Object.assign({}, world.map[gameState.object[i]]);
    world.map[gameState.object[i]] = 0;
    gameState.object[i] -= world.columns;
  };
};
function translateRight() {
  gameState.object.sort(sortArrayRightFirst);
  var commence = true;
  for (var i = 0; i < gameState.object.length; i++){
    var newIndex = gameState.object[i] + 1;
    if (world.map[newIndex] != 0 && gameState.object.indexOf(newIndex) == -1) {
      addOccupiedTile(newIndex);
      commence = false;
    };
    if (Math.floor(newIndex / world.columns) != Math.floor(gameState.object[i] / world.columns)) {
      addOccupiedTile(gameState.object[i]);
      commence = false;
    };
  };
  if (commence == false) {return; };
  for (var i = 0; i < gameState.object.length; i++){
    var newIndex = gameState.object[i] + 1;
    world.map[newIndex] = Object.assign({}, world.map[gameState.object[i]]);
    world.map[gameState.object[i]] = 0;
    gameState.object[i] += 1;
  };
};
function translateDown() {
  gameState.object.sort(sortArrayBottomFirst);
  var commence = true;
  for (var i = 0; i < gameState.object.length; i++){
    var newIndex = gameState.object[i] + world.columns;
    if (world.map[newIndex] != 0 && gameState.object.indexOf(newIndex) == -1) {
      addOccupiedTile(newIndex);
      commence = false;
    };
    if (newIndex > world.map.length || newIndex < 0){
      addOccupiedTile(gameState.object[i]);
      commence = false;
    };
  };
  if (commence == false) {return; };
  for (var i = 0; i < gameState.object.length; i++){
    var newIndex = gameState.object[i] + world.columns;
    world.map[newIndex] = Object.assign({}, world.map[gameState.object[i]]);
    world.map[gameState.object[i]] = 0;
    gameState.object[i] += world.columns;
  };
};
function translateLeft() {
  gameState.object.sort(sortArrayLeftFirst);
  var commence = true;
  for (var i = 0; i < gameState.object.length; i++){
    var newIndex = gameState.object[i] - 1;
    if (world.map[newIndex] != 0 && gameState.object.indexOf(newIndex) == -1) {
      addOccupiedTile(newIndex);
      commence = false;
    };
    if (Math.floor(newIndex / world.columns) != Math.floor(gameState.object[i] / world.columns)) {
      addOccupiedTile(gameState.object[i]);
      commence = false;
    };
  };
  if (commence == false) {return; };
  for (var i = 0; i < gameState.object.length; i++){
    var newIndex = gameState.object[i] - 1;
    world.map[newIndex] = Object.assign({}, world.map[gameState.object[i]]);
    world.map[gameState.object[i]] = 0;
    gameState.object[i] -= 1;
  };
};

function sortArrayTopFirst(a, b){
  return a - b;
};
function sortArrayRightFirst(a, b){
  var aa = a % world.columns;
  var bb = b % world.columns;
  return bb - aa;
};
function sortArrayBottomFirst(a, b){
  return b - a;
};
function sortArrayLeftFirst(a, b){
  var aa = a % world.columns;
  var bb = b % world.columns;
  return aa - bb;
};

function deleteAll() {
  for (var i = 0; i < gameState.object.length; i += 0){
    world.map[gameState.object[i]] = 0;
    gameState.object.splice(i, 1);
  };
  document.getElementById("spanText").innerHTML = `Deselect all (${gameState.object.length})`;
};

var holdTimeout, holdInterval;

function onHold(func) {
  holdTimeout = setTimeout(function(){
    holdInterval = setInterval(function(){
      window[func]();
    }, 100);
  }, 300);
};

function onRelease() {
  clearTimeout(holdTimeout);
  clearInterval(holdInterval);
};

/********************************************************************************************************************/

function updateTile(type, tile, target) {
  if (tile < 10 ) {tile = "0" + tile};
  var find = "Imported/Tile" + type + tile + ".png";
  var index = gridBuildItems.findIndex(i => i.img === find);
  world.map[target] = Object.assign({}, gridBuildItems[index]);
  var img = new Image();
  img.src = find;
  world.map[target].img = img;
};
function autoTile(type, target) {
  // placed tile
  var tile = 0;
  for (var i = 0; i < 4; i++){
    var n = i * 2 + 1;
    var k = Math.floor(n / 3);
    var x = (world.columns * k) - world.columns + target - 1 + n - (3 * k);
    if (world.map[x] != 0) { // OPTIMIZE
      tile += Math.pow(2, i);
    };
  };
  updateTile(type, tile, target);
  // adjecent tiles
  for (var i = 0; i < 4; i++){
    tile = 0;
    var n = i * 2 + 1;
    var k = Math.floor(n / 3);
    var x = (world.columns * k) - world.columns + target - 1 + n - (3 * k);
    if (world.map[x] != 0) { // OPTIMIZE
      for (var j = 0; j < 4; j++){
        var m = j * 2 + 1;
        var l = Math.floor(m / 3);
        var z = (world.columns * l) - world.columns + x - 1 + m - (3 * l);
        if (world.map[z] != 0) { // OPTIMIZE
          tile += Math.pow(2, j);
        };
      };
      updateTile(world.map[x].type, tile, x);
    };
  };
};

var mouseX, mouseY, cvsMouseX, cvsMouseY;
cvs.onmousemove = function(e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
  var scrollOffset = cvs.getBoundingClientRect();
  cvsMouseX = mouseX - camera.offsetX - (scrollOffset.left - camera.offsetX);
  cvsMouseY = mouseY - camera.offsetY - (scrollOffset.top - camera.offsetY);
  camera.hoveredTile = Math.floor(cvsMouseX / tileSize) + (Math.floor(cvsMouseY / tileSize) * world.columns);
  camera.hoveredxPos = (camera.hoveredTile * tileSize) - (world.width * Math.floor((camera.hoveredTile * tileSize) / world.width));
  camera.hoveredyPos = Math.floor(camera.hoveredTile / world.columns) * tileSize;
  camera.isHovered = true;
  if (gameState.state == "building" && gameState.holding == true && gameState.object != "" && world.map[camera.hoveredTile] == 0 && (Math.abs(player.xPos - camera.hoveredxPos) >= tileSize || Math.abs(player.yPos - camera.hoveredyPos) >= tileSize)) {
    //world.map[camera.hoveredTile] = Object.assign({}, gameState.object);
    autoTile(gameState.object.type, camera.hoveredTile);
  };
  if (gameState.state == "editing" && gameState.editState == "delete" && gameState.holding == true && world.map[camera.hoveredTile] != 0) {
    world.map[camera.hoveredTile] = 0;
    if (gameState.object != "") {
      var index = gameState.object.indexOf(camera.hoveredTile);
      if (index != -1) {
        gameState.object.splice(index, 1);
        document.getElementById("spanText").innerHTML = `Deselect all (${gameState.object.length})`;
      };
    };
  };
};

cvs.onmouseout = function() {
  camera.isHovered = false;
  gameState.holding = false;
};

var clickedX, clickedY, clickedTile;
cvs.onclick = function(e){
  var scrollOffset = cvs.getBoundingClientRect();
  clickedX = e.clientX - camera.offsetX - (scrollOffset.left - camera.offsetX);
  clickedY = e.clientY - camera.offsetY - (scrollOffset.top - camera.offsetY);
  clickedTile = Math.floor(clickedX / tileSize) + (Math.floor(clickedY / tileSize) * world.columns);
  var xPos = (clickedTile * tileSize) - (world.width * Math.floor((clickedTile * tileSize) / world.width));
  var yPos = Math.floor(clickedTile / world.columns) * tileSize;
  // clicking in building state
  if (gameState.state == "building" && gameState.object != "") {
   if (world.map[clickedTile] == 0 && (Math.abs(player.xPos - xPos) >= tileSize || Math.abs(player.yPos - yPos) >= tileSize)) {
     //world.map[clickedTile] = Object.assign({}, gameState.object);
     autoTile(gameState.object.type, clickedTile);
   } else {
     //addOccupiedTile(clickedTile);
     return;
   };
 };
  // clicking in editing state delete
  if (gameState.state == "editing" && gameState.editState == "delete" && world.map[clickedTile] != 0) {
    world.map[clickedTile] = 0;
    if (gameState.object != "") {
      var index = gameState.object.indexOf(clickedTile);
      if (index != -1) {
        gameState.object.splice(index, 1);
        document.getElementById("spanText").innerHTML = `Deselect all (${gameState.object.length})`;
      };
    };
  };
};

cvs.onmousedown = function(e){
  gameState.holding = true;
  if (gameState.state == "editing") {
    var scrollOffset = cvs.getBoundingClientRect();
    clickedX = e.clientX - camera.offsetX - (scrollOffset.left - camera.offsetX);
    clickedY = e.clientY - camera.offsetY - (scrollOffset.top - camera.offsetY);
    clickedTile = Math.floor(clickedX / tileSize) + (Math.floor(clickedY / tileSize) * world.columns);
    if (gameState.editState == "select" || gameState.editState == "deselect") {
      gameState.selectStart = clickedTile;
    };
  };
};

cvs.onmouseup = function(e){
  gameState.holding = false;
  if (gameState.state == "editing") {
    var scrollOffset = cvs.getBoundingClientRect();
    clickedX = e.clientX - camera.offsetX - (scrollOffset.left - camera.offsetX);
    clickedY = e.clientY - camera.offsetY - (scrollOffset.top - camera.offsetY);
    gameState.selectEnd = clickedTile = Math.floor(clickedX / tileSize) + (Math.floor(clickedY / tileSize) * world.columns);
    if (gameState.editState == "select" || gameState.editState == "deselect") {
      var aaa = Math.floor(gameState.selectStart / world.columns);
      var bbb = Math.floor(gameState.selectEnd / world.columns);
      var rowDist = bbb - aaa;
      var colDist = gameState.selectEnd - gameState.selectStart - (rowDist * world.columns);
      if (colDist < 0) {
        gameState.selectStart += colDist;
        clickedTile -= colDist;
      }
      if (rowDist < 0) {
        gameState.selectStart += (rowDist * world.columns);
        clickedTile -= (rowDist * world.columns);
      };
      var x = Math.abs(colDist) + 1;
      var y = Math.abs(rowDist) + 1;
      if (gameState.editState == "select") {
        for (var i = 0; i < Math.abs(x * y); i++){
          var k = Math.floor(i / x);
          var n = (world.columns * k) + gameState.selectStart + i - (x * k);
          if (world.map[n] == 0) {continue; };
          var index = gameState.object.indexOf(n);
          if (index != -1) {continue; };
          gameState.object.push(n);
        };
      } else if (gameState.editState == "deselect") {
        for (var i = 0; i < Math.abs(x * y); i++){
          var k = Math.floor(i / x);
          var n = (world.columns * k) + gameState.selectStart + i - (x * k);
          if (world.map[n] == 0) {continue; };
          var index = gameState.object.indexOf(n);
          if (index == -1) {continue; };
          gameState.object.splice(index, 1);
        };
      };
      document.getElementById("spanText").innerHTML = `Deselect all (${gameState.object.length})`;
    };
  };
};

document.getElementById("canvasArea").addEventListener('scroll', function(event){
  var scrollOffset = cvs.getBoundingClientRect();
  camera.centerX = (-scrollOffset.left + camera.offsetX) + cvsWidth/2;
  camera.centerY = -scrollOffset.top + cvsHeight/2;
});

/*function displayInfoText(text, color) {
  document.getElementById("informationContainer").innerHTML += `<p style="color:${color}">${text}</p>`;
};*/

/*******************************************************************************************************************/

var inpWorldWidth = document.getElementById("inpWorldWidth");
var inpWorldHeight = document.getElementById("inpWorldHeight");

var minWorldWidth = Math.floor(cvsWidth * 1.5 / tileSize);
var minWorldHeight = Math.floor(cvsHeight * 1.5 / tileSize);
var maxTotalTiles = 10000;

function selectBackground(radio) {
  if (radio.value == "color") {
    world.background = document.getElementById("colorPicker").value;
  } else if (radio.value == "file") {
    return;
    //world.background = new Image();
    //world.background.src = document.getElementById("filePicker").value;
  } else {
    world.background = new Image();
    world.background.src = radio.value;
  };
};

document.getElementById("colorPicker").onchange = function(){
   this.parentNode.parentNode.style.backgroundColor = this.value;
   document.getElementById("bgOption1").click();
};

inpWorldWidth.onchange = function(){
  // check if value is too great or small
  if (inpWorldWidth.value < minWorldWidth){
    inpWorldWidth.value = minWorldWidth;
  } else if (inpWorldWidth.value * inpWorldHeight.value > maxTotalTiles){
    inpWorldWidth.value = Math.floor(maxTotalTiles / inpWorldHeight.value);
  };
  // change world size
  var columnDifference = inpWorldWidth.value - world.columns;
  if (columnDifference > 0) {
    for (var j = 0; j < columnDifference; j++) {
      for (var i = 1; i <= world.rows; i++){
        world.map.splice(((world.columns + j) * i) + (i-1), 0, 0);
      };
    };
  } else if (columnDifference < 0) {
    for (var i = world.rows; i > 0; i--){
      world.map.splice((world.columns * i) + columnDifference, -columnDifference);
    };
  };
  ctx.canvas.width = Number(inpWorldWidth.value) * tileSize;
  world.columns = Number(inpWorldWidth.value);
  document.getElementById("currentTiles").innerHTML = "*10.000 Max tiles (current: " + inpWorldWidth.value * inpWorldHeight.value + ")\n*adds/removes from the right/top";
};

inpWorldHeight.onchange = function(){
  // check if value is too great or small
  if (inpWorldHeight.value < minWorldHeight){
    inpWorldHeight.value = minWorldHeight;
  } else if (inpWorldWidth.value * inpWorldHeight.value > maxTotalTiles){
    inpWorldHeight.value = Math.floor(maxTotalTiles / inpWorldWidth.value);
  };
  // change world size
  var rowDifference = inpWorldHeight.value - world.rows;
  if (rowDifference > 0) {
    for (var j = 0; j < rowDifference; j++) {
      for (var i = 0; i < world.columns; i++){
        world.map.unshift(0);
      };
    };
  } else if (rowDifference < 0) {
    for (var i = 0; i < -rowDifference; i++) {
      world.map.splice(0, world.columns);
    };
  };
  ctx.canvas.height = Number(inpWorldHeight.value) * tileSize;
  document.getElementById("canvasArea").scrollBy(0, tileSize * rowDifference);
  world.rows = Number(inpWorldHeight.value);
  document.getElementById("currentTiles").innerHTML = "*10.000 Max tiles (current: " + inpWorldWidth.value * inpWorldHeight.value + ")\n*adds/removes from the right/top";
};

window.onload = function() {
  createGridBuild()
  setModeBuild();
  document.getElementById("canvasArea").scrollTop = document.getElementById("canvasArea").scrollHeight;

  inpWorldWidth.setAttribute("min", minWorldWidth);
  inpWorldWidth.setAttribute("value", minWorldWidth);
  inpWorldWidth.setAttribute("placeholder", minWorldWidth);

  inpWorldHeight.setAttribute("min", minWorldHeight);
  inpWorldHeight.setAttribute("value", minWorldHeight);
  inpWorldHeight.setAttribute("placeholder", minWorldHeight);

  document.getElementById("currentTiles").innerHTML = "*10.000 Max tiles (current: " + inpWorldWidth.value * inpWorldHeight.value + ")\n*adds/removes from the right/top";
};

var loop = function(){

  Draw();

  //Update();

  window.requestAnimationFrame(loop);
};
window.requestAnimationFrame(loop);
window.addEventListener("keydown", controller.keyUpDown);
window.addEventListener("keyup", controller.keyUpDown);
