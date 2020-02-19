var ctx = document.querySelector("canvas").getContext("2d");
var cvsWidth = ctx.canvas.width = 1248;
var cvsHeight = ctx.canvas.height = 576;

var startSpill = false;
var timerInterval;
var minutter = sekunder = 0;
var tid = 0;
var objekterFjernet = 0;
var score = 0;
var navn;

var displayGrid = document.getElementById("displayGrid");
var timer = document.getElementById("timer");
var visObjekterFjernet = document.getElementById("visObjekterFjernet");
var visScore = document.getElementById("visScore");
var startSide = document.getElementById("startSide");
var rekorder = document.getElementById("rekorder");
var startKnapp = document.getElementById("startKnapp");
var gameoverSide = document.getElementById("gameoverSide");
var statistikk = document.getElementById("statistikk");
var fortsettKnapp = document.getElementById("fortsettKnapp");

var controller = {
  left:false,
  right:false,
  keyUpDown:function(event) {
    var key_state = (event.type == "keydown")?true:false;
    switch(event.keyCode) {
      case 65: controller.a = key_state; break; // a key
      case 68: controller.d = key_state; break; // d key
      case 37: controller.leftArrow = key_state; break; // venstre pil
      case 39: controller.rightArrow = key_state; break; // høyre pil
    }
  }
};

var rekordArray = [];

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

var spiller = new lagSpiller();

var ball = new lagBall();

function lagObjektArray(){
  for (var i = 0; i < objekter.objektCount; i++){
    objektArray[i] = new Object();
    objektArray[i].width = objekter.width;
    objektArray[i].height = objekter.height;
    objektArray[i].xPos = (objekter.marginLeft + (i * objekter.width) + (i * objekter.mellomrom)) - ((objekter.length + objekter.mellomrom) * Math.floor(i / objekter.columns));
    objektArray[i].yPos = objekter.marginTop + (Math.floor(i / objekter.columns) * objekter.height) + (Math.floor(i / objekter.columns) * objekter.mellomrom);
    objektArray[i].color = getRandomColor();
    objektArray[i].top = objektArray[i].yPos;
    objektArray[i].left = objektArray[i].xPos;
    objektArray[i].right = objektArray[i].xPos + objektArray[i].width;
    objektArray[i].bottom = objektArray[i].yPos + objektArray[i].height;
  };
}; lagObjektArray();

function lagSpiller(){
  this.xPos = ctx.canvas.width/2 - 100;
  this.xVel = 0;
  this.width = 200;
  this.height = 20;
  this.movementSpeed = 2;
  this.color = "white";
};

function lagBall(){
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
  // spiller
  ctx.fillStyle = spiller.color;
  ctx.fillRect(spiller.xPos, ctx.canvas.height - spiller.height, spiller.width, spiller.height);
  ctx.font = "20px Comic Sans MS";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("<-- a                 d -->", spiller.xPos + spiller.width/2, ctx.canvas.height - 3);
};

function oppdaterSpill(){
  // oppdater spiller
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
    gameOver();
  };
  // collisjon mellom ball og spiller
  if (ball.bottom > ctx.canvas.height - spiller.height && ball.xPos > spiller.xPos && ball.xPos < spiller.xPos + spiller.width){
    var distBallMid = ball.xPos - (spiller.xPos + spiller.width/2);
    var divisor = spiller.width / 5;
    ball.yVel = -1 * (ball.movementSpeed - Math.abs(distBallMid)/divisor);
    ball.xVel = ((Math.floor(distBallMid/100)*2)+1) * (Math.sqrt(Math.pow(ball.movementSpeed, 2) - Math.pow((ball.movementSpeed - Math.abs(distBallMid)/divisor), 2)));
    //console.log(divisor);
  };
  // collisjon mellom ball og objekter
  for (var i = 0; i < objekter.objektCount; i++){
    if (ball.right > objektArray[i].left && ball.left < objektArray[i].right && // collisjon under i fra
        ball.top < objektArray[i].bottom && ball.topOld >= objektArray[i].bottom){
      ball.yVel = Math.abs(ball.yVel);//*= -1; //  ball.movementSpeed;
      objektArray[i] = "";
      objekterFjernet += 1;
      score += 100;
    } else if (ball.right > objektArray[i].left && ball.left < objektArray[i].right &&   // collisjon over i fra
        ball.bottom > objektArray[i].top && ball.bottomOld <= objektArray[i].top){
      ball.yVel = -Math.abs(ball.yVel); //*= -1; // -ball.movementSpeed;
      objektArray[i] = "";
      objekterFjernet += 1;
      score += 100;
    } else if (ball.top < objektArray[i].bottom && ball.bottom > objektArray[i].top && // collisjon fra venstre
        ball.right > objektArray[i].left && ball.rightOld <= objektArray[i].left){
      ball.xVel = -Math.abs(ball.xVel); //*= -1; // -ball.movementSpeed;
      objektArray[i] = "";
      objekterFjernet += 1;
      score += 100;
    } else if (ball.top < objektArray[i].bottom && ball.bottom > objektArray[i].top && // collisjon fra høyre
        ball.left < objektArray[i].right && ball.leftOld >= objektArray[i].right){
      ball.xVel = Math.abs(ball.xVel); //*= -1; // ball.movementSpeed;
      objektArray[i] = "";
      objekterFjernet += 1;
      score += 100;
    };
  };
  // når alle objekter er fjenet
  if (objekterFjernet == objekter.objektCount){
    gameOver();
  };
  // oppdater display
  visObjekterFjernet.innerHTML = `<p>${objekterFjernet} / ${objekter.objektCount}</p>`;
  visScore.innerHTML = `<p>${score}</p>`;
  if (startSpill == true && tid == 0){
    timer.innerHTML = `<p>0:00</p>`;
    tid += 1;
    timerInterval = setInterval(function(){
      minutter = Math.floor(tid / 60);
      sekunder = tid % 60;
      if (sekunder < 10) {sekunder = "0" + sekunder;};
      tid += 1;
      if (score > 0) {score -= 10;};
      timer.innerHTML = `<p>${minutter}:${sekunder}</p>`;
    }, 1000);
  };
};

function gameOver(){
  if (objekterFjernet == objekter.objektCount){
    gameoverSide.querySelector("h1").innerHTML = "Du vant!";
  } else {
    gameoverSide.querySelector("h1").innerHTML = "Game Over";
  };
  statistikk.innerHTML = `
    <p style="margin: 10px; text-decoration: underline;">Statistikk:</p>
    <table>
      <tr>
        <td>Objekter:</td>
        <td>${objekterFjernet} / ${objekter.rows * objekter.columns}</td>
      </tr>
      <tr>
        <td>Tid:</td>
        <td>${minutter}:${sekunder}</td>
      </tr>
      <tr>
        <td><b>Score:</b></td>
        <td><b>${score}</b></td>
      </tr>
    </table>
  `;
  spiller = new lagSpiller();
  ball = new lagBall();
  controller.a = controller.d = controller.leftArrow = controller.rightArrow = false;
  clearInterval(timerInterval);
  startSpill = false;
  tid = 0;
  objekterFjernet = 0;
  lagObjektArray();
  tegnSpill();
  oppdaterSpill();
  visObjekterFjernet.innerHTML = `<p>${objekterFjernet} / ${objekter.objektCount}</p>`;
  timer.innerHTML = `<p>0:00</p>`;
  visScore.innerHTML = `<p>0</p>`;
  displayGrid.style.opacity = "0.3";
  gameoverSide.style.display = "block";
  setTimeout(function(){
    do {
      navn = prompt("(Maks 12 symboler) Skriv inn navnet ditt her:");
    } while (navn == null || navn == "" || navn.length > 12);
    rekordArray.push({navn: navn, score: score});
    score = 0;
    rekordArray.sort(sorterRekorder);
  }, 10);
};

function sorterRekorder(a, b){
  return b.score - a.score;
};

fortsettKnapp.onclick = function(){
  startSide.style.display = "block";
  gameoverSide.style.display = "none";
  rekorder.innerHTML = `<p style="margin: 10px; text-decoration: underline;">Rekorder:</p><table id="rekordTabell"></table>`;
  for (var i = 0; i < 3; i++){
    if (i >= rekordArray.length) {return;};
    var plass = i + 1;
    document.getElementById("rekordTabell").innerHTML += `
      <tr>
        <td>${plass}.</td>
        <td>${rekordArray[i].navn}:</td>
        <td>${rekordArray[i].score}</td>
      </tr>
    `;
  };
};

startKnapp.onclick = function(){
  startSpill = true;
  startSide.style.display = "none";
  displayGrid.style.opacity = "1";
  ctx.canvas.style.filter = "brightness(100%)";
  window.requestAnimationFrame(loop);
};

var loop = function(){

  tegnSpill();

  oppdaterSpill();

  if (startSpill == false){
    ctx.canvas.style.filter = "brightness(30%)";
    return;
  };

  window.requestAnimationFrame(loop);
};
window.requestAnimationFrame(loop);
window.addEventListener("keydown", controller.keyUpDown);
window.addEventListener("keyup", controller.keyUpDown);
