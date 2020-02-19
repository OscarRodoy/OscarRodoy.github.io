
var spiller = new lagSpiller();

function lagSpiller(){
  this.xPos = ctx.canvas.width/2 - 100;
  this.xVel = 0;
  this.width = 200;
  this.height = 20;
  this.movementSpeed = 2;
  this.color = "white";
};
