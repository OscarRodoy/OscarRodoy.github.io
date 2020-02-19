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
    object.yVel *= 0.85; // friction y
    if (Math.abs(object.xVel) < 0.01) {object.xVel = 0};
    if (Math.abs(object.yVel) < 0.01) {object.yVel = 0};
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
        var oldColor = player.color;
        player.color = "white";
        setTimeout(function(){player.color = oldColor;}, 50);
        player.hit = i;
        setTimeout(function(){player.hit = -1;}, 100);
      } else
      if (player.bottomOld <= enemies[i].topOld){
        player.yPos = enemies[i].yPos - player.height;
        player.yVel = -25;
        player.health -= 25;
        var oldColor = player.color;
        player.color = "white";
        setTimeout(function(){player.color = oldColor;}, 50);
        player.hit = i;
        setTimeout(function(){player.hit = -1;}, 100);
      } else
      if (player.leftOld >= enemies[i].rightOld){
        player.xPos = enemies[i].xPos + player.width;
        player.xVel = 25;
        player.health -= 25;
        var oldColor = player.color;
        player.color = "white";
        setTimeout(function(){player.color = oldColor;}, 50);
        player.hit = i;
        setTimeout(function(){player.hit = -1;}, 100);
      } else
      if (player.topOld >= enemies[i].bottomOld){
        player.yPos = enemies[i].yPos + player.height;
        player.yVel = 25;
        player.health -= 25;
        var oldColor = player.color;
        player.color = "white";
        setTimeout(function(){player.color = oldColor;}, 50);
        player.hit = i;
        setTimeout(function(){player.hit = -1;}, 100);
      };
    };
  };

  // collision detection
  for (var j = -1; j < enemies.length; j++){
    var object;
    if (j == -1) { object = player} else { object = enemies[j]};
    collisionBottom(object.xPos, world.height, null, object); //boundaries of screen
    collisionRight(world.length, object.yPos, null, object);
    collisionTop(object.xPos, -tileSize, null, object);
    collisionLeft(-tileSize, object.yPos, null, object);
    for (var i = 0; i < 25; i++){
      var k = Math.floor(i / 5);
      var n = (world.columns * k) + object.adjecentTL + i - (5 * k)
      var xPos = (n * tileSize) - (world.length * Math.floor((n * tileSize) / world.length));
      var yPos = Math.floor(n / world.columns) * tileSize;
      // show tiles being checked =>>ctx.fillStyle = "black"; ctx.fillRect(xPos + tileSize/2.5, yPos + tileSize/2.5, tileSize/5, tileSize/5);
      if (world.map[n] == 00) {continue;}
      else if (world.map[n] == 01) {collisionBottom(xPos, yPos, n, object)}
      else if (world.map[n] == 02) {collisionRight(xPos, yPos, n, object)}
      else if (world.map[n] == 03) {collisionTop(xPos, yPos, n, object)}
      else if (world.map[n] == 04) {collisionLeft(xPos, yPos, n, object)}
      else if (world.map[n] == 05) {collisionRight(xPos, yPos, n, object); collisionBottom(xPos, yPos, n, object)}
      else if (world.map[n] == 06) {collisionRight(xPos, yPos, n, object); collisionTop(xPos, yPos, n, object)}
      else if (world.map[n] == 07) {collisionLeft(xPos, yPos, n, object); collisionTop(xPos, yPos, n, object)}
      else if (world.map[n] == 08) {collisionLeft(xPos, yPos, n, object); collisionBottom(xPos, yPos, n, object)}
      else if (world.map[n] == 09 || world.map[n] == 30 || world.map[n] == 31 || world.map[n] == 32 || world.map[n] == 33 || world.map[n] == 34 || world.map[n] == 35 || world.map[n] == 40) {collisionRight(xPos, yPos, n, object); collisionTop(xPos, yPos, n, object); collisionLeft(xPos, yPos, n, object); collisionBottom(xPos, yPos, n, object)}
      else if (world.map[n] == 11) {collisionRight(xPos, yPos, n, object); collisionBottom(xPos, yPos, n, object); collisionLeft(xPos, yPos, n, object)}
      else if (world.map[n] == 12) {collisionTop(xPos, yPos, n, object); collisionRight(xPos, yPos, n, object); collisionBottom(xPos, yPos, n, object)}
      else if (world.map[n] == 13) {collisionRight(xPos, yPos, n, object); collisionTop(xPos, yPos, n, object); collisionLeft(xPos, yPos, n, object)}
      else if (world.map[n] == 14) {collisionTop(xPos, yPos, n, object); collisionLeft(xPos, yPos, n, object); collisionBottom(xPos, yPos, n, object)};
    };
  };

  // enemy01 AI
  for (var i = 0; i < enemies.length; i++){
    var distanceX = player.xPos - enemies[i].xPos;
    var distanceY = player.yPos - enemies[i].yPos;
    if (Math.pow(Math.abs(distanceX), 2) + Math.pow(Math.abs(distanceY), 2) < Math.pow(enemies[i].range + (player.width/2), 2)){
      if (distanceX == 0) {
        enemies[i].xVel = 0;
      } else if (Math.abs(distanceX) < enemies[i].movementSpeed) {
        enemies[i].xVel = distanceX;
      } else if (distanceX < 0){
        enemies[i].xVel = -enemies[i].movementSpeed;
      } else if (distanceX > 0){
        enemies[i].xVel = enemies[i].movementSpeed;
      };
      if (distanceY == 0) {
        enemies[i].yVel = 0;
      } else if (Math.abs(distanceY) < enemies[i].movementSpeed) {
        enemies[i].yVel = distanceY;
      } else if (distanceY < 0){
        enemies[i].yVel = -enemies[i].movementSpeed;
      } else if (distanceY > 0){
        enemies[i].yVel = enemies[i].movementSpeed;
      };
    };
  };

  // player collision with boundaries of screen
  /*if (player.xPos < 0){
    player.xVel = 0;
    player.xPos = 0;
  };
  if (player.xPos > world.length - player.width){
    player.xVel = 0;
    player.xPos = world.length - player.width;
  };
  if (player.yPos < 0){
    player.yVel = 0;
    player.yPos = 0;
  };
  if (player.yPos > world.height - player.height){
    player.yVel = 0;
    player.yPos = world.height - player.height;
  };*/

  // player movement
  var pressed = 0
  if (controller.a && player.hit == -1){
    player.xVel = -player.movementSpeed;
    pressed += 1;
  };
  if (controller.d && player.hit == -1){
    player.xVel = player.movementSpeed;
    pressed += 1;
  };
  if (controller.w && player.hit == -1){
    player.yVel = -player.movementSpeed;
    pressed += 1;
  };
  if (controller.s && player.hit == -1){
    player.yVel = player.movementSpeed;
    pressed += 1;
  };
  if (controller.space && !player.clickTimeoutR){
    document.querySelector("canvas").click()
    player.clickTimeoutR = true;
    setTimeout(function(){player.clickTimeoutR = false;}, 200);
  };

  // slow down for diagonal movement
  if (pressed == 2) {
    player.movementSpeed = Math.sqrt(72)/2;
  } else {
    player.movementSpeed = 6;
  };
  /*var angle = Math.atan2(player.xVel, player.yVel);
  var angle2 = Math.atan2(player.xVel, player.yVel)*180/Math.PI;
  player.xVel = Math.abs(Math.cos(angle)) * player.xVel;
  player.yVel = Math.abs(Math.sin(angle)) * player.yVel;
  console.log(angle2, player.xVel, player.yVel);
  */

  // move screen with player
  ctx.resetTransform();
  ctx.translate(-(player.xPos + player.width/2 - cvsWidth/2), -(player.yPos + player.height/2 - cvsHeight/2));
  camera.centerX = player.xPos + player.width/2;
  camera.centerY = player.yPos + player.height/2;

  // calculate top left tile (camera)
  if (camera.centerX - cvsWidth/2 > tileSize * camera.tilesPassedX){
    camera.tilesPassedX += 1;
    camera.tileTL += 1;
  };
  if ((camera.centerX - cvsWidth/2) - ((camera.tilesPassedX - 1)*tileSize) <= -tileSize){
    camera.tilesPassedX -= 1;
    camera.tileTL -= 1;
  };
  if (camera.centerY - cvsHeight/2 > tileSize * camera.tilesPassedY){
    camera.tilesPassedY += 1;
    camera.tileTL += world.columns;
  };
  if ((camera.centerY - cvsHeight/2) - ((camera.tilesPassedY - 1)*tileSize) <= -tileSize){
    camera.tilesPassedY -= 1;
    camera.tileTL -= world.columns;
  };

  // calculate top left tile adjecent to player (collision detection)
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

  // calculate top left tile checking for line intersections (closest intersect)
  if (0 < angle && angle <= 90){
    player.adjecentTL2_OffsetX = 3;
    player.adjecentTL2_OffsetY = 0;
    segment1 = {
      a: {x: 0, y: 0},
      b: {x: 0, y: tileSize}
    };
    segment2 = {
      a: {x: 0, y: tileSize},
      b: {x: tileSize, y: tileSize}
    };
  } else if (90 < angle && angle <= 180){
    player.adjecentTL2_OffsetX = 3;
    player.adjecentTL2_OffsetY = 3;
    segment1 = {
      a: {x: 0, y: 0},
      b: {x: tileSize, y: 0}
    };
    segment2 = {
      a: {x: 0, y: 0},
      b: {x: 0, y: tileSize}
    };
  } else if (180 < angle && angle <= 270){
    player.adjecentTL2_OffsetY = 3;
    player.adjecentTL2_OffsetX = 0;
    segment1 = {
      a: {x: 0, y: 0},
      b: {x: tileSize, y: 0}
    };
    segment2 = {
      a: {x: tileSize, y: 0},
      b: {x: tileSize, y: tileSize}
    };
  } else {
    player.adjecentTL2_OffsetX = 0;
    player.adjecentTL2_OffsetY = 0;
    segment1 = {
      a: {x: tileSize, y: 0},
      b: {x: tileSize, y: tileSize}
    };
    segment2 = {
      a: {x: 0, y: tileSize},
      b: {x: tileSize, y: tileSize}
    };
  };
  player.adjecentTL2 = player.adjecentTL - 2 + player.adjecentTL2_OffsetX - world.columns*2 + world.columns*player.adjecentTL2_OffsetY;

  // calculate line
  line = {
    a: {x: player.xPos + player.width/2, y: player.yPos + player.height/2},
    b: {x: cvsMouseX, y: cvsMouseY}
  };

  // the tiles being checked for line intersect
  segment = [];
  for (var i = 0; i < 36; i++){
    var k = Math.floor(i / 6);
    var n = (world.columns * k) + player.adjecentTL2 + i - (6 * k)
    var xPos = (n * tileSize) - (world.length * Math.floor((n * tileSize) / world.length));
    var yPos = Math.floor(n / world.columns) * tileSize;
    // display tiles being checked: ctx.fillStyle = "black"; ctx.fillRect(xPos + tileSize/2.5, yPos + tileSize/2.5, tileSize/5, tileSize/5);
    if (world.map[n] != 00 && n >= 0 && n <= world.map.length) {
      segment.push(
        {a: {x: xPos + segment1.a.x, y: yPos + segment1.a.y}, b: {x: xPos + segment1.b.x, y: yPos + segment1.b.y}, tile: n},
        {a: {x: xPos + segment2.a.x, y: yPos + segment2.a.y}, b: {x: xPos + segment2.b.x, y: yPos + segment2.b.y}, tile: n}
      );
    };
  };

  // find closest intersect
  closestIntersect = null;
  for (var i = 0; i < segment.length; i++){
    var intersect = getIntersection(line, segment[i]);
    if(!intersect) continue;
    if(!closestIntersect || intersect.param < closestIntersect.param) {
      if (Math.pow(Math.abs(intersect.x - (player.xPos + player.width/2)), 2) + Math.pow(Math.abs(intersect.y - (player.yPos + player.height/2)), 2) < Math.pow(player.range, 2)) {
        closestIntersect = intersect;
      };
    };
  };
  intersect = closestIntersect;

  //draw hovered tile
  if (intersect != null){
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect((intersect.tile * tileSize) - (world.length * Math.floor((intersect.tile * tileSize) / world.length)), Math.floor(intersect.tile / world.columns) * tileSize, tileSize, tileSize);
  };

  //draw line
  /*
  ctx.strokeStyle = "grey";
  ctx.beginPath();
  ctx.moveTo(player.xPos + player.width/2, player.yPos + player.height/2);
  if (intersect != null){
    ctx.lineTo(intersect.x, intersect.y);
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.fillRect((intersect.tile * tileSize) - (world.length * Math.floor((intersect.tile * tileSize) / world.length)), Math.floor(intersect.tile / world.columns) * tileSize, tileSize, tileSize);
  } else {
    var distX = cvsMouseX - (player.xPos + player.width/2);
    var distY = cvsMouseY - (player.yPos + player.height/2);
    var dist = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
    var konstant = dist / player.range;
    var distXnew = distX / konstant;
    var distYnew = distY / konstant;
    ctx.lineTo(player.xPos + player.width/2 + distXnew, player.yPos + player.height/2 + distYnew);
  //  ctx.lineTo(cvsMouseX, cvsMouseY);
  };
  ctx.stroke();
  ctx.closePath();
  */

  // delete destroyed objects
  for (var i = 0; i < resources.length; i++){
    if (resources[i].health <= 0){
      world.map.splice(resources[i].index, 1, 00);
      resources.splice(i, 1);
    };
  };

  for (var i = 0; i < structures.length; i++){
    if (structures[i].health <= 0){
      world.map.splice(structures[i].index, 1, 00);
      structures.splice(i, 1);
    };
  };

};
