var ctx = document.querySelector("canvas").getContext("2d");
var cvsWidth = ctx.canvas.width = 1248;
var cvsHeight = ctx.canvas.height = 576;

var startSpill = false;

var startSide = document.getElementById("startSide");
var startKnapp = document.getElementById("startKnapp");

var controller = {
  left:false,
  right:false,
  keyUpDown:function(event) {
    var key_state = (event.type == "keydown")?true:false;
    switch(event.keyCode) {
      case 65: controller.a = key_state; break; // a key
      case 68: controller.d = key_state; break; // d key
      case 37: controller.leftArrow = key_state; break; // left key
      case 39: controller.rightArrow = key_state; break; // right key
    }
  }
};

var objekter = {
  width: 80,
  height: 30,
  rows: 6,
  columns: 12,
  get objektCount() {return this.rows * this.columns},
  get length()      {return (this.columns * this.width) + (this.mellomrom * (this.columns-1))},
  get marginLeft()  {return (ctx.canvas.width - this.length)/2},
  marginTop: 80,
  mellomrom: 10
};

var objektArray = [];

var spiller = new Spiller();

var ball = new Ball();

var powerUpSpawnRate = 6000;
var lagNyPowerUp, timeout1, timeout2, timeout3, timeout4;
var powerUps = [
  {type: 1, color: "lime", symbol: "<>"},
  {type: 2, color: "red", symbol: "><"},
  {type: 3, color: "skyblue", symbol: "+"},
  {type: 4, color: "red", symbol: "v+"},
  {type: 5, color: "lime", symbol: "v-"}
];
var powerUpArray = [];

function nyPowerUp(){
  lagNyPowerUp = setTimeout(function(){
    var i = powerUpArray.length;
    powerUpArray[i] = new Object();
    powerUpArray[i] = {...powerUpArray[i], ...powerUps[Math.floor(Math.random() * 5)]};
    powerUpArray[i].xPos = Math.floor(Math.random()*(ctx.canvas.width - ball.radius*2) + ball.radius);
    powerUpArray[i].yPos = Math.floor(Math.random()*(ctx.canvas.height - ball.radius*2) + ball.radius);
    nyPowerUp();
  }, powerUpSpawnRate);
};

function lagObjektArray(){
  for (var i = 0; i < objekter.objektCount; i++){
    objektArray[i] = new Object();
    objektArray[i].width = objekter.width;
    objektArray[i].height = objekter.height;
    objektArray[i].xPos = (objekter.marginLeft + (i * objekter.width) + (i * objekter.mellomrom)) - ((objekter.length + objekter.mellomrom) * Math.floor(i / objekter.columns));
    objektArray[i].yPos = objekter.marginTop + (Math.floor(i / objekter.columns) * objekter.height) + (Math.floor(i / objekter.columns) * objekter.mellomrom)
    getRandomColor();
    objektArray[i].color = getRandomColor();
    objektArray[i].top = objektArray[i].yPos;
    objektArray[i].left = objektArray[i].xPos;
    objektArray[i].right = objektArray[i].xPos + objektArray[i].width;
    objektArray[i].bottom = objektArray[i].yPos + objektArray[i].height;
  };
}; lagObjektArray();

function Spiller(){
  this.xPos = ctx.canvas.width/2 - 100;
  this.xVel = 0;
  this.width = 200;
  this.height = 20;
  this.movementSpeed = 2;
  this.color = "white";
};

function Ball(){
  this.xPos = ctx.canvas.width/2;
  this.yPos = ctx.canvas.height/1.2;
  this.xPosOld = ctx.canvas.width/2;
  this.yPosOld = ctx.canvas.height/2;
  this.movementSpeed = 6;
  this.xVel = Math.sqrt(Math.pow(this.movementSpeed, 2)/2);
  this.yVel = -Math.sqrt(Math.pow(this.movementSpeed, 2)/2);
  this.radius = 20;
  this.color = "white";
  this.top = this.yPos - this.radius;
  this.bottom = this.yPos + this.radius;
  this.left = this.xPos - this.radius;
  this.right = this.xPos + this.radius;
  this.topOld = this.yPosOld - this.radius;
  this.bottomOld = this.yPosOld + this.radius;
  this.leftOld = this.xPosOld - this.radius;
  this.rightOld = this.xPosOld + this.radius;
};

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  };
  return color;
};

function tegnSpill(){
  // bakgrunn
  ctx.fillStyle = "#202020";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  // ball
  ctx.fillStyle = ball.color;
  ctx.beginPath();
  ctx.arc(ball.xPos, ball.yPos, ball.radius, 0, 2*Math.PI, false);
  ctx.fill();
  // objekter
  for (var i = 0; i < objekter.objektCount; i++){
    ctx.fillStyle = objektArray[i].color;
    ctx.fillRect(objektArray[i].xPos, objektArray[i].yPos, objektArray[i].width, objektArray[i].height);
    ctx.strokeStyle = "white";
    ctx.rect(objektArray[i].xPos, objektArray[i].yPos, objektArray[i].width, objektArray[i].height);
    ctx.stroke();
  };
  // power ups
  for (var i = 0; i < powerUpArray.length; i++){
    ctx.fillStyle = powerUpArray[i].color;
    ctx.beginPath();
    ctx.arc(powerUpArray[i].xPos, powerUpArray[i].yPos, ball.radius, 0, 2*Math.PI, false);
    ctx.fill();
    ctx.stroke();
    ctx.font = "30px Georgia";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(powerUpArray[i].symbol, powerUpArray[i].xPos, powerUpArray[i].yPos+7);
  };
  // spiller
  ctx.fillStyle = spiller.color;
  ctx.fillRect(spiller.xPos, ctx.canvas.height - spiller.height, spiller.width, spiller.height);
  ctx.font = "20px Comic Sans MS";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("<-- a                d -->", spiller.xPos + spiller.width/2, ctx.canvas.height - 3);
};

function oppdaterSpill(){
  // spiller
  spiller.xPos += spiller.xVel;
  spiller.xVel *= 0.8;
  if (controller.a){
    spiller.xVel -= spiller.movementSpeed;
  };
  if (controller.d){
    spiller.xVel += spiller.movementSpeed;
  };
  if (spiller.xPos < 0){
    spiller.xPos = 0;
    spiller.xVel = 0;
  };
  if (spiller.xPos + spiller.width > ctx.canvas.width){
    spiller.xPos = ctx.canvas.width - spiller.width;
  };
  // oppdater ball
  ball.xPosOld = ball.xPos;
  ball.yPosOld = ball.yPos;
  ball.xPos += ball.xVel;
  ball.yPos += ball.yVel;
  ball.top = ball.yPos - ball.radius;
  ball.bottom = ball.yPos + ball.radius;
  ball.left = ball.xPos - ball.radius;
  ball.right = ball.xPos + ball.radius;
  ball.topOld = ball.yPosOld - ball.radius;
  ball.bottomOld = ball.yPosOld + ball.radius;
  ball.leftOld = ball.xPosOld - ball.radius;
  ball.rightOld = ball.xPosOld + ball.radius;
  // collisjon mellom ball og sidene av canvase
  if (ball.xPos - ball.radius < 0){
    ball.xVel = Math.abs(ball.xVel);
  };
  if (ball.xPos + ball.radius > ctx.canvas.width){
    ball.xVel = -Math.abs(ball.xVel);
  };
  if (ball.yPos - ball.radius < 0){
    ball.yVel = Math.abs(ball.yVel);
  };
  if (ball.bottom > ctx.canvas.height){
    resetSpill();
    startSpill = false;
  };
  // collisjon mellom ball og spiller
  if (ball.bottom > ctx.canvas.height - spiller.height && ball.xPos > spiller.xPos && ball.xPos < spiller.xPos + spiller.width){
    var distBallMid = ball.xPos - (spiller.xPos + spiller.width/2);
    var divisor = spiller.width / 5;
    ball.yVel = -1 * (ball.movementSpeed - Math.abs(distBallMid)/divisor);
    ball.xVel = ((Math.floor(distBallMid/100)*2)+1) * (Math.sqrt(Math.pow(ball.movementSpeed, 2) - Math.pow((ball.movementSpeed - Math.abs(distBallMid)/divisor), 2)));
    console.log(divisor);
  };
  // collisjon mellom ball og power ups
  for (var i = 0; i < powerUpArray.length; i++){
    var distX = ball.xPos-powerUpArray[i].xPos;
    var distY = ball.yPos-powerUpArray[i].yPos;
    if (Math.pow(distX, 2) + Math.pow(distY, 2) <= Math.pow(ball.radius+ball.radius, 2)){
      if (powerUpArray[i].type == 1){
        spiller.width *= 1.33;
        timeout1 = setTimeout(function(){spiller.width = Math.ceil(spiller.width*0.75)}, 5000);
        powerUpArray[i] = "";
      } else if (powerUpArray[i].type == 2){
        spiller.width *= 0.66;
        timeout2 = setTimeout(function(){spiller.width = Math.floor(spiller.width*1.52)}, 5000);
        powerUpArray[i] = "";
      } else if (powerUpArray[i].type == 3){
        powerUpSpawnRate *= 0.8;
        powerUpArray[i] = "";
      } else if (powerUpArray[i].type == 4){ // 1.2 ceil 0.83 || 0.8 ceil 1.25
        ball.movementSpeed *= 1.33;
        ball.yVel *= 1.33;
        ball.xVel *= 1.33;
        timeout3 = setTimeout(function(){
          ball.movementSpeed = Math.ceil(ball.movementSpeed*0.75);
          ball.yVel = Math.ceil(ball.yVel*0.75);
          ball.xVel = Math.ceil(ball.xVel*0.75);
        }, 5000);
        powerUpArray[i] = "";
      } else if (powerUpArray[i].type == 5){
        ball.movementSpeed *= 0.66;
        ball.yVel *= 0.66;
        ball.xVel *= 0.66;
        timeout4 = setTimeout(function(){
          ball.movementSpeed = Math.floor(ball.movementSpeed*1.52)
          ball.yVel = Math.floor(ball.yVel*1.52);
          ball.xVel = Math.floor(ball.xVel*1.52);
        }, 5000);
        powerUpArray[i] = "";
      };
    }
  }
  // collisjon mellom ball og objekter
  for (var i = 0; i < objekter.objektCount; i++){
    if (ball.right > objektArray[i].left && ball.left < objektArray[i].right && // collisjon under i fra
        ball.top < objektArray[i].bottom && ball.topOld >= objektArray[i].bottom){
      ball.yVel = Math.abs(ball.yVel);//*= -1; //  ball.movementSpeed;
      objektArray[i] = "";
    } else if (ball.right > objektArray[i].left && ball.left < objektArray[i].right &&   // collisjon over i fra
        ball.bottom > objektArray[i].top && ball.bottomOld <= objektArray[i].top){
      ball.yVel = -Math.abs(ball.yVel); //*= -1; // -ball.movementSpeed;
      objektArray[i] = "";
    } else if (ball.top < objektArray[i].bottom && ball.bottom > objektArray[i].top && // collisjon fra venstre
        ball.right > objektArray[i].left && ball.rightOld <= objektArray[i].left){
      ball.xVel = -Math.abs(ball.xVel); //*= -1; // -ball.movementSpeed;
      objektArray[i] = "";
    } else if (ball.top < objektArray[i].bottom && ball.bottom > objektArray[i].top && // collisjon fra høyre
        ball.left < objektArray[i].right && ball.leftOld >= objektArray[i].right){
      ball.xVel = Math.abs(ball.xVel); //*= -1; // ball.movementSpeed;
      objektArray[i] = "";
    };
  };
};

function resetSpill(){
  clearTimeout(lagNyPowerUp);
  clearTimeout(timeout1);
  clearTimeout(timeout2);
  clearTimeout(timeout3);
  clearTimeout(timeout4);
  spiller = new Spiller();
  ball = new Ball();
  objektArray.splice(0, objektArray.length);
  powerUpArray.splice(0, powerUpArray.length);
  powerUpSpawnRate = 6000;
  controller.a = false;
  controller.d = false;
  lagObjektArray();
  tegnSpill();
  oppdaterSpill();
};

startKnapp.onclick = function(){
  startSpill = true;
  startSide.style.display = "none";
  ctx.canvas.style.filter = "brightness(100%)";
  window.requestAnimationFrame(loop);
  nyPowerUp()
};

var loop = function(){

  tegnSpill();

  oppdaterSpill();

  if (startSpill == false){
    ctx.canvas.style.filter = "brightness(50%)";
    startSide.style.display = "block";
    return;
  };

  window.requestAnimationFrame(loop);
};
window.requestAnimationFrame(loop);
window.addEventListener("keydown", controller.keyUpDown);
window.addEventListener("keyup", controller.keyUpDown);

// width power up må flytte spiller mot venstre 50% av størrelse økningen
// ball fart endring forandrer retningen
// større width gjør at spiller colliderer med ballen feil
// pause knapp
// deathscreen
// rekord
