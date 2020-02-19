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
