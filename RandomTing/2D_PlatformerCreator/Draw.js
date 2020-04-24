function Draw(){
  /* entire map
  for (var i = 0; i < world.map.length; i++){
    var xPos = (i * tileSize) - (world.width * Math.floor((i * tileSize) / world.width));
    var yPos = Math.floor(i / world.columns) * tileSize;
  };*/
  /* entire screen
  for (var i = 0; i < camera.columns * world.rows; i++){
    var k = Math.floor(i / camera.columns);
    var n = (world.columns * k) + camera.tileTL - 1 + i - camera.columns * k;
    var xPos = (n * tileSize) - (world.width * Math.floor((n * tileSize) / world.width));
    var yPos = Math.floor(n / world.columns) * tileSize;
  }*/
  /* around player
  for (var i = 0; i < 25; i++){
    var k = Math.floor(i / 5);
    var n = (world.columns * k) + player.adjecentTL + i - (5 * k)
    var xPos = (n * tileSize) - (world.width * Math.floor((n * tileSize) / world.width));
    var yPos = Math.floor(n / world.columns) * tileSize;
  }*/

  // calculate top left tile adjecent to camera
  camera.tileTL = Math.floor((camera.centerY - cvsHeight/2) / tileSize) * world.columns + Math.floor((camera.centerX - cvsWidth/2) / tileSize);

  // draw background
  if (typeof world.background === 'string' || world.background instanceof String) {
    ctx.fillStyle = world.background;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  } else {
    ctx.fillStyle = "#202020";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(world.background, camera.centerX - cvsWidth/2, camera.centerY - cvsHeight/2, cvsWidth, cvsHeight);
  };

  // draw tiles
  for (var i = 0; i < camera.columns * camera.rows; i++){
    var k = Math.floor(i / camera.columns);
    var n = (world.columns * k) + camera.tileTL + i - camera.columns * k;
    var xPos = (n * tileSize) - (world.width * Math.floor((n * tileSize) / world.width));
    var yPos = Math.floor(n / world.columns) * tileSize;
    if (world.map[n] == undefined || world.map[n] == null) {
      continue;
    } else if (world.map[n] == 0) {
      ctx.fillStyle = "rgba(255, 255, 255, .05)";
      ctx.fillRect(xPos + 2, yPos + 2, tileSize - 4, tileSize - 4);
      // draw tile numbers ctx.fillStyle = "red"; ctx.fillText(n, xPos + tileSize/2 - 5, yPos + tileSize/2 + 5);
    } else {
      ctx.drawImage(world.map[n].img, xPos, yPos, tileSize, tileSize);
    }
  };

  //draw center
  /*ctx.fillStyle = "white";
  ctx.fillRect(camera.centerX, 0, 1, world.height);
  ctx.fillRect(0, camera.centerY, world.width, 1);*/

  //draw hovered tile
  if (gameState.state == "building" && gameState.object != "" && camera.isHovered == true) {
    if (world.map[camera.hoveredTile] != 0){
      ctx.globalAlpha = 0.4;
      ctx.drawImage(gameState.object.img, camera.hoveredxPos, camera.hoveredyPos, tileSize, tileSize);
    } else {
      ctx.drawImage(gameState.object.img, camera.hoveredxPos, camera.hoveredyPos, tileSize, tileSize);
    };
    ctx.globalAlpha = 1;
  };

  if (gameState.state == "editing" && gameState.object.constructor === Array) {
    for (var i = 0; i < gameState.object.length; i++){
      var xPos = (gameState.object[i] * tileSize) - (world.width * Math.floor((gameState.object[i] * tileSize) / world.width));
      var yPos = Math.floor(gameState.object[i] / world.columns) * tileSize;
      ctx.fillStyle = "rgba(255, 255, 255, .2)";
      ctx.fillRect(xPos, yPos, tileSize, tileSize);
    };
  };

  if (gameState.state == "editing" && camera.isHovered == true) {
    ctx.fillStyle = "rgba(255, 255, 255, .2)";
    ctx.fillRect(camera.hoveredxPos, camera.hoveredyPos, tileSize, tileSize);
  };

  // draw holding rect
  if (gameState.state == "editing" && (gameState.editState == "select" || gameState.editState == "deselect") && gameState.holding == true){
    ctx.fillStyle = "rgba(255, 255, 255, .2)";
    ctx.lineWidth = "4";
    ctx.strokeStyle = "white";
    ctx.beginPath()
    ctx.moveTo(clickedX, clickedY);
    ctx.lineTo(cvsMouseX, clickedY);
    ctx.lineTo(cvsMouseX, cvsMouseY);
    ctx.lineTo(clickedX, cvsMouseY);
    ctx.lineTo(clickedX, clickedY);
    ctx.stroke();
    ctx.fill();
    ctx.closePath();
  };

  // draw occupied tile error
  for (var i = 0; i < occupiedTiles.length; i++){
    ctx.fillStyle = "rgba(255, 0, 0, " + occupiedTiles[i].opacity + ")";
    ctx.fillRect(occupiedTiles[i].xPos, occupiedTiles[i].yPos, tileSize, tileSize);
    occupiedTiles[i].opacity -= 0.01;
    if (occupiedTiles.opacity < 0) {
      occupiedTiles.splice(i, 1);
    };
  };

  //draw player
  //ctx.drawImage(playerImage, player.xPos, player.yPos, player.width, player.height); // redrawing image ruins gif effect
  ctx.fillStyle = player.color;
  ctx.fillRect(player.xPos, player.yPos, player.width, player.height);

  //draw enemies
  for (var i = 0; i < enemies.length; i++){
    ctx.fillStyle = enemies[i].color;
    ctx.fillRect(enemies[i].xPos, enemies[i].yPos, enemies[i].width, enemies[i].height);
  };

};
