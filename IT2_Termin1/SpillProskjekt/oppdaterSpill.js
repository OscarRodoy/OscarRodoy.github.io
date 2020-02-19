function oppdaterSpill(){

  // oppdater spiller
  spiller.xPos += spiller.xVel;
  spiller.xVel *= 0.8;
  if (controller.a || controller.leftArrow){
    spiller.xVel -= spiller.movementSpeed;
  };
  if (controller.d || controller.rightArrow){
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
  };

  // collisjon mellom ball og objekter
  for (var i = 0; i < objekter.objektCount; i++){
    if (ball.right > objektArray[i].left && ball.left < objektArray[i].right && // ball colliderer under i fra
        ball.top < objektArray[i].bottom && ball.topOld >= objektArray[i].bottom){
      ball.yVel = Math.abs(ball.yVel);
      objektArray[i] = "";
      objekterFjernet += 1;
      score += 100;
    } else if (ball.right > objektArray[i].left && ball.left < objektArray[i].right &&   // ball colliderer over i fra
        ball.bottom > objektArray[i].top && ball.bottomOld <= objektArray[i].top){
      ball.yVel = -Math.abs(ball.yVel);
      objektArray[i] = "";
      objekterFjernet += 1;
      score += 100;
    } else if (ball.top < objektArray[i].bottom && ball.bottom > objektArray[i].top && // ball colliderer fra venstre
        ball.right > objektArray[i].left && ball.rightOld <= objektArray[i].left){
      ball.xVel = -Math.abs(ball.xVel);
      objektArray[i] = "";
      objekterFjernet += 1;
      score += 100;
    } else if (ball.top < objektArray[i].bottom && ball.bottom > objektArray[i].top && // ball colliderer fra høyre
        ball.left < objektArray[i].right && ball.leftOld >= objektArray[i].right){
      ball.xVel = Math.abs(ball.xVel);
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
