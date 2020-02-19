function tegnSpill(){

  // tegn bakgrunn
  ctx.fillStyle = "#202020";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // tegn ball
  ctx.fillStyle = ball.color;
  ctx.beginPath();
  ctx.arc(ball.xPos, ball.yPos, ball.radius, 0, 2*Math.PI, false);
  ctx.fill();

  // tegn objekter
  for (var i = 0; i < objekter.objektCount; i++){
    ctx.fillStyle = objektArray[i].color;
    ctx.fillRect(objektArray[i].xPos, objektArray[i].yPos, objektArray[i].width, objektArray[i].height);
    ctx.strokeStyle = "white";
    ctx.rect(objektArray[i].xPos, objektArray[i].yPos, objektArray[i].width, objektArray[i].height);
    ctx.stroke();
  };

  // tegn spiller
  ctx.fillStyle = spiller.color;
  ctx.fillRect(spiller.xPos, ctx.canvas.height - spiller.height, spiller.width, spiller.height);
  ctx.font = "20px Comic Sans MS";
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("<-- a                 d -->", spiller.xPos + spiller.width/2, ctx.canvas.height - 3);
  
};
