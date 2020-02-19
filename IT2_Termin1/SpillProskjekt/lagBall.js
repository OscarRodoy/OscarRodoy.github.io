
var ball = new lagBall();

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
