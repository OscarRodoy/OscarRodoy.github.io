function updateWorld(){
  // game physics
  for (var i = -1; i < enemies.length; i++){
    var object;
    if (i == -1) { object = player} else { object = enemies[i]};
    object.xPosOld = object.xPos;
    object.yPosOld = object.yPos;
    object.xPos += object.xVel;
    object.yPos += object.yVel;
    object.xVel *= 0.85; // friction x
    object.yVel *= 0.9; // friction y
    object.yVel += 1; // gravity
  };

  // collision detection
  for (var j = -1; j < enemies.length; j++){
    var object;
    if (j == -1) { object = player} else { object = enemies[j]};
    for (var i = 0; i < 25; i++){
      var k = Math.floor(i / 5);
      var n = (world.columns * k) + object.adjecentTL + i - (5 * k)
      var xPos = (n * tileSize) - (world.length * Math.floor((n * tileSize) / world.length));
      var yPos = Math.floor(n / world.columns) * tileSize;
      // show tiles being checked =>> ctx.fillStyle = "black"; ctx.fillRect(xPos + tileSize/2.5, yPos + tileSize/2.5, tileSize/5, tileSize/5);
      if (world.map[n] == 01) {collisionBottom(xPos, yPos, object)}
      else if (world.map[n] == 02) {collisionRight(xPos, yPos, object)}
      else if (world.map[n] == 03) {collisionTop(xPos, yPos, object)}
      else if (world.map[n] == 04) {collisionLeft(xPos, yPos, object)}
      else if (world.map[n] == 05) {collisionRight(xPos, yPos, object); collisionBottom(xPos, yPos, object)}
      else if (world.map[n] == 06) {collisionRight(xPos, yPos, object); collisionTop(xPos, yPos, object)}
      else if (world.map[n] == 07) {collisionLeft(xPos, yPos, object); collisionTop(xPos, yPos, object)}
      else if (world.map[n] == 08) {collisionLeft(xPos, yPos, object); collisionBottom(xPos, yPos, object)}
      else if (world.map[n] == 09) {collisionRight(xPos, yPos, object); collisionTop(xPos, yPos, object); collisionLeft(xPos, yPos, object); collisionBottom(xPos, yPos, object)}
      else if (world.map[n] == 15) {collisionSlopeBR(xPos, yPos, object)}
      else if (world.map[n] == 18) {collisionSlopeBL(xPos, yPos, object)}
      else if (world.map[n] == 99) {collisionCoin(xPos, yPos, n, object)};
    //  else if (world.map[n] == 16) {collisionSlopeTR(xPos, yPos, object)};
    };
  };

  // collison between player and enemies
  for (var i = 0; i < enemies.length; i++){
    var distanceX = (enemies[i].xPos + enemies[i].width/2) - (player.xPos + player.width/2);
    var distanceY = (enemies[i].yPos + enemies[i].height/2) - (player.yPos + player.height/2);
    if (Math.abs(distanceX) < enemies[i].width/2 + player.width/2 &&
        Math.abs(distanceY) < enemies[i].height/2 + player.height/2){
      if (player.rightOld <= enemies[i].leftOld){
        player.xPos = enemies[i].xPos - player.width;
        player.xVel = -25;
        player.health -= 25;
        health.innerHTML = "&#128151; " + player.health;
        var oldColor = player.color;
        player.color = "white";
        setTimeout(function(){player.color = oldColor;}, 50);
        player.hit = true;
        setTimeout(function(){player.hit = false;}, 100);
      } else
      if (player.bottomOld <= enemies[i].topOld){
        player.yPos = enemies[i].yPos - player.height;
        player.yVel = -25;
        player.jumps = 1;
        var oldColor = enemies[i].color;
        var enemy = enemies[i];
        enemies[i].color = "white";
        setTimeout(function(){enemy.color = oldColor;}, 50);
      } else
      if (player.leftOld >= enemies[i].rightOld){
        player.xPos = enemies[i].xPos + player.width;
        player.xVel = 25;
        player.health -= 25;
        health.innerHTML = "&#128151; " + player.health;
        var oldColor = player.color;
        player.color = "white";
        setTimeout(function(){player.color = oldColor;}, 50);
        player.hit = true;
        setTimeout(function(){player.hit = false;}, 100);
      } else
      if (player.topOld >= enemies[i].bottomOld){
        player.yPos = enemies[i].yPos + player.height;
        player.yVel = 25;
        player.health -= 25;
        health.innerHTML = "&#128151; " + player.health;
        var oldColor = player.color;
        player.color = "white";
        setTimeout(function(){player.color = oldColor;}, 50);
        player.hit = true;
        setTimeout(function(){player.hit = false;}, 100);
      };
    };
  };

  // enemy01 AI
  for (var i = 0; i < enemies.length; i++){
    var distanceX = player.xPos - enemies[i].xPos;
    var distanceY = player.yPos - enemies[i].yPos;
    if (Math.abs(distanceX) < enemies[i].range){
      if (Math.abs(distanceX) < enemies[i].movementSpeed) {
        enemies[i].xVel = 0;
      } else if (distanceX < 0){
        enemies[i].xVel = -enemies[i].movementSpeed;
      } else if (distanceX > 0){
        enemies[i].xVel = enemies[i].movementSpeed;
      };
    };
  };

  // player collision with boundaries of screen
  if (player.xPos < 0){
    player.xVel = 0;
    player.xPos = 0;
  };
  if (player.xPos > world.length - player.width){
    player.xVel = 0;
    player.xPos = world.length - player.width;
  };
  if (player.yPos > ctx.canvas.height){
    window.location.reload();
  };

  // player movement
  if (controller.a && !player.hit){
    player.xVel = -player.movementSpeed;
  };
  if (controller.d && !player.hit){
    player.xVel = player.movementSpeed;
  };
  if (controller.w && player.jumps > 0 && player.jumpTimeout == false){
    player.yVel = -25;
    player.onGround = false;
    player.jumps -= 1;
    player.jumpTimeout = true;
    setTimeout(function(){player.jumpTimeout = false;}, 200);
  };
  if (controller.shift){
    player.movementSpeed = 3;
  } else {
    player.movementSpeed = 6;
  };

  // move screen with player
  var translateX = Number();
  if (controller.d && player.left > camera.center && camera.center < world.length - cvsWidth/2){
    if (player.left > camera.center + tileSize/2){
      translateX = -player.movementSpeed*1.5;
    } else {
      translateX = -player.movementSpeed;
    };
    camera.center -= translateX;
    ctx.translate(translateX, 0);
  };
  if (controller.a && player.right < camera.center && camera.center > cvsWidth/2){
    if (player.right < camera.center - tileSize/2){
      translateX = player.movementSpeed*1.5;
    } else {
      translateX = player.movementSpeed;
    };
    camera.center -= translateX;
    ctx.translate(translateX, 0);
  };
  if (camera.center < cvsWidth/2) {
    ctx.translate(-1,0);
    camera.center += 1;
  };
  if (camera.center > world.length - cvsWidth/2){

  };

  // calculate top left tile
  if (camera.center - cvsWidth/2 > tileSize * camera.tilesPassed){
    camera.tilesPassed += 1;
    camera.tileTL += 1;
  };
  if ((camera.center - cvsWidth/2) - ((camera.tilesPassed - 1)*tileSize) <= -tileSize){
    camera.tilesPassed -= 1;
    camera.tileTL -= 1;
  };

  // calculate top left tile adjecent to player
  for (var i = -1; i < enemies.length; i++){
    var object;
    if (i == -1) { object = player} else { object = enemies[i]};
    if (object.xPosStart + tileSize + object.xDistMoved <= object.xPos){
      object.adjecentTL += 1;
      object.xDistMoved += tileSize;
    };
    if (object.xPosStart - tileSize + object.xDistMoved >= object.xPos){
      object.adjecentTL -= 1;
      object.xDistMoved -= tileSize;
    };
    if (object.yPosStart + tileSize + object.yDistMoved <= object.yPos){
      object.adjecentTL += world.columns;
      object.yDistMoved += tileSize;
    };
    if (object.yPosStart - tileSize + object.yDistMoved >= object.yPos){
      object.adjecentTL -= world.columns;
      object.yDistMoved -= tileSize;
    };
  };

};
