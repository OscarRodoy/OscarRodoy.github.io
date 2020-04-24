// move screen with player
var translateX = Number();
var translateY = Number();
      // x
if (player.left > camera.centerX && camera.centerX < world.length - cvsWidth/2) {
  if (player.left > camera.centerX + tileSize/2){
    translateX = -player.movementSpeed*1.5;
  } else {
    translateX = -player.movementSpeed;
  };
  camera.centerX -= translateX;
  ctx.translate(translateX, 0);
};
if (player.right < camera.centerX && camera.centerX > cvsWidth/2) {
  if (player.right < camera.centerX - tileSize/2){
    translateX = player.movementSpeed*1.5;
  } else {
    translateX = player.movementSpeed;
  };
  camera.centerX -= translateX;
  ctx.translate(translateX, 0);
};
if (camera.centerX < cvsWidth/2) {
  ctx.translate(-1,0);
  camera.centerX += 1;
};
if (camera.centerX > world.length - cvsWidth/2){
  ctx.translate(1,0);
  camera.centerX -= 1;
};
      // y
if (player.top > camera.centerY && camera.centerY < world.height - cvsHeight/2){
  if (player.top > camera.centerY + tileSize/2){
    translateY = -player.movementSpeed*1.5;
  } else {
    translateY = -player.movementSpeed;
  };
  camera.centerY -= translateY;
  ctx.translate(0, translateY);
};
if (player.bottom < camera.centerY && camera.centerY > cvsHeight/2){
  if (player.bottom < camera.centerY - tileSize/2){
    translateY = player.movementSpeed*1.5;
  } else {
    translateY = player.movementSpeed;
  };
  camera.centerY -= translateY;
  ctx.translate(0, translateY);
};
if (camera.centerY < cvsHeight/2) {
  ctx.translate(0,-1);
  camera.centerY += 1;
};
if (camera.centerY > world.height - cvsHeight/2){
  ctx.translate(0,1);
  camera.centerY -= 1;
};

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


// old tiles

else if (world.map[n] == 11) { // corner background tile
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(xPos, yPos, tileSize, tileSize);
  ctx.fillStyle = "green";
  ctx.fillRect(xPos, yPos, tileSize/2, tileSize/2);
}
else if (world.map[n] == 12) {
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(xPos, yPos, tileSize, tileSize);
  ctx.fillStyle = "green";
  ctx.fillRect(xPos, yPos + tileSize/2, tileSize/2, tileSize/2);
}
else if (world.map[n] == 13) {
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(xPos, yPos, tileSize, tileSize);
  ctx.fillStyle = "green";
  ctx.fillRect(xPos + tileSize/2, yPos + tileSize/2, tileSize/2, tileSize/2);
}
else if (world.map[n] == 14) {
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(xPos, yPos, tileSize, tileSize);
  ctx.fillStyle = "green";
  ctx.fillRect(xPos + tileSize/2, yPos, tileSize/2, tileSize/2);
}


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

// collision bottom
if (object.right > xPos && object.left < xPos + tileSize &&
    object.bottom > yPos && object.bottomOld <= yPos){
  if (object.hit != -1){
    var i = object.hit; var x;
    if (enemies[i].xPos - object.xPos > 0) {x = -1} else if (enemies[i].xPos - object.xPos < 0) {x = 1} else {
      x = Math.ceil(Math.random()*2);
      if (x == 2) {x = -1};
    }
    //if (n - 1 - world.columns != 00 || n - 2 - world.columns != 00) {x = 1};
    //if (n + 1 - world.columns != 00 || n + 2 - world.columns != 00) {x = -1};
    object.xVel = object.yVel/2 * x;
    object.xPos += tileSize * x;
  };
  object.yVel = 0;
  object.yPos = yPos - object.height;
};
};

else if (world.map[n] == 30) {} // full invisible block resource
else if (world.map[n] == 31) { // tree
  resources.push(new tree(xPos, yPos, n));
  world.map.splice(n, 1, 30);
}
else if (world.map[n] == 32) { // stone
  resources.push(new stone(xPos, yPos, n));
  world.map.splice(n, 1, 30);
}
else if (world.map[n] == 33) { // bronze
  resources.push(new bronze(xPos, yPos, n));
  world.map.splice(n, 1, 30);
}
else if (world.map[n] == 34) { // silver
  resources.push(new silver(xPos, yPos, n));
  world.map.splice(n, 1, 30);
}
else if (world.map[n] == 35) { // gold
  resources.push(new gold(xPos, yPos, n));
  world.map.splice(n, 1, 30);
}
// structures => converted into 40
else if (world.map[n] == 40) {} // invisible block structure
else if (world.map[n] == 41) { // a structure
  structures.push(new structure(xPos, yPos, n));
  world.map.splice(n, 1, 40);
}

world.map.splice(n, 1, structures[structures.length-1]);

      00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
      00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
      00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
      00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
      00,00,00,00,00,15,00,00,00,00,16,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
      00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
      00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
      00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,99,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
      00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
      00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
      00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
      00,00,00,00,31,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
      00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
      00,00,00,00,00,00,00,32,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
      00,00,00,34,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
      00,00,00,00,00,00,00,00,00,00,35,00,00,00,00,00,00,00,00,00,00,00,00,98,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
      00,00,00,00,35,00,33,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
      00,00,00,35,00,00,00,33,00,00,00,00,00,00,31,31,31,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
      00,00,00,00,00,00,00,00,00,00,00,00,00,00,31,31,31,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
      00,00,00,34,00,00,00,32,00,00,00,00,00,00,31,31,31,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
      00,00,00,00,34,00,32,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
      00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
      00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,
      00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00,00
