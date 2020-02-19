function drawWorld(){
  /* entire map
  for (var i = 0; i < world.map.length; i++){
    var xPos = (i * tileSize) - (world.length * Math.floor((i * tileSize) / world.length));
    var yPos = Math.floor(i / world.columns) * tileSize;
  };*/
  /* entire screen
  for (var i = 0; i < camera.columns * world.rows; i++){
    var k = Math.floor(i / camera.columns);
    var n = (world.columns * k) + camera.tileTL - 1 + i - camera.columns * k;
    var xPos = (n * tileSize) - (world.length * Math.floor((n * tileSize) / world.length));
    var yPos = Math.floor(n / world.columns) * tileSize;
  }*/
  /* around player
  for (var i = 0; i < 25; i++){
    var k = Math.floor(i / 5);
    var n = (world.columns * k) + player.adjecentTL + i - (5 * k)
    var xPos = (n * tileSize) - (world.length * Math.floor((n * tileSize) / world.length));
    var yPos = Math.floor(n / world.columns) * tileSize;
  }*/

  // draw background
  ctx.drawImage(background, camera.center - cvsWidth/2, 0, cvsWidth, cvsHeight);

  // draw tiles
  for (var i = 0; i < camera.columns * world.rows; i++){
    var k = Math.floor(i / camera.columns);
    var n = (world.columns * k) + camera.tileTL - 1 + i - camera.columns * k;
    var xPos = (n * tileSize) - (world.length * Math.floor((n * tileSize) / world.length));
    var yPos = Math.floor(n / world.columns) * tileSize;
    if (world.map[n] == 00){}
    else if (world.map[n] == 01) {
    //  ctx.fillStyle = "green";
    //  ctx.fillRect(xPos, yPos, tileSize, tileSize);
    //  ctx.fillStyle = "#8B4513";
    //  ctx.fillRect(xPos, yPos + tileSize/2, tileSize, tileSize/2);
      ctx.drawImage(tile_01, xPos, yPos, tileSize, tileSize);
    }
    else if (world.map[n] == 02) {
      ctx.fillStyle = "green";
      ctx.fillRect(xPos, yPos, tileSize, tileSize);
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(xPos + tileSize/2, yPos, tileSize/2, tileSize);
    }
    else if (world.map[n] == 03) {
      ctx.fillStyle = "green";
      ctx.fillRect(xPos, yPos, tileSize, tileSize);
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(xPos, yPos, tileSize, tileSize/2);
    }
    else if (world.map[n] == 04) {
      ctx.fillStyle = "green";
      ctx.fillRect(xPos, yPos, tileSize, tileSize);
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(xPos, yPos, tileSize/2, tileSize);
    }
    else if (world.map[n] == 05) {
      ctx.fillStyle = "green";
      ctx.fillRect(xPos, yPos, tileSize, tileSize);
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(xPos + tileSize/2, yPos + tileSize/2, tileSize/2, tileSize/2);
    }
    else if (world.map[n] == 06) {
      ctx.fillStyle = "green";
      ctx.fillRect(xPos, yPos, tileSize, tileSize);
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(xPos + tileSize/2, yPos, tileSize/2, tileSize/2);
    }
    else if (world.map[n] == 07) {
      ctx.fillStyle = "green";
      ctx.fillRect(xPos, yPos, tileSize, tileSize);
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(xPos, yPos, tileSize/2, tileSize/2);
    }
    else if (world.map[n] == 08) {
      ctx.fillStyle = "green";
      ctx.fillRect(xPos, yPos, tileSize, tileSize);
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(xPos, yPos + tileSize/2, tileSize/2, tileSize/2);
    }
    else if (world.map[n] == 09) {
      ctx.fillStyle = "green";
      ctx.fillRect(xPos, yPos, tileSize, tileSize);
    }
    else if (world.map[n] == 10) {
      //ctx.fillStyle = "#8B4513";
      //ctx.fillRect(xPos, yPos, tileSize, tileSize);
      ctx.drawImage(tile_10, xPos, yPos, tileSize, tileSize);
    }
    else if (world.map[n] == 11) {
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
    else if (world.map[n] == 15) {
      ctx.fillStyle = "green";
      ctx.beginPath();
      ctx.moveTo(xPos, yPos + tileSize);
      ctx.lineTo(xPos + tileSize, yPos + tileSize);
      ctx.lineTo(xPos + tileSize, yPos);
      ctx.fill();
      ctx.fillStyle = "#8B4513"
      ctx.beginPath();
      ctx.moveTo(xPos + tileSize/2, yPos + tileSize);
      ctx.lineTo(xPos + tileSize, yPos + tileSize);
      ctx.lineTo(xPos + tileSize, yPos + tileSize/2);
      ctx.fill();
    }
    else if (world.map[n] == 16) {
      ctx.fillStyle = "green";
      ctx.beginPath();
      ctx.moveTo(xPos, yPos);
      ctx.lineTo(xPos + tileSize, yPos);
      ctx.lineTo(xPos + tileSize, yPos + tileSize);
      ctx.fill();
      ctx.fillStyle = "#8B4513"
      ctx.beginPath();
      ctx.moveTo(xPos + tileSize/2, yPos);
      ctx.lineTo(xPos + tileSize, yPos);
      ctx.lineTo(xPos + tileSize, yPos + tileSize/2);
      ctx.fill();
    }
    else if (world.map[n] == 17) {
      ctx.fillStyle = "green";
      ctx.beginPath();
      ctx.moveTo(xPos + tileSize, yPos);
      ctx.lineTo(xPos, yPos);
      ctx.lineTo(xPos, yPos + tileSize);
      ctx.fill();
      ctx.fillStyle = "#8B4513"
      ctx.beginPath();
      ctx.moveTo(xPos + tileSize/2, yPos);
      ctx.lineTo(xPos, yPos);
      ctx.lineTo(xPos, yPos + tileSize/2);
      ctx.fill();
    }
    else if (world.map[n] == 18) {
      ctx.fillStyle = "green";
      ctx.beginPath();
      ctx.moveTo(xPos + tileSize, yPos + tileSize);
      ctx.lineTo(xPos, yPos + tileSize);
      ctx.lineTo(xPos, yPos);
      ctx.fill();
      ctx.fillStyle = "#8B4513"
      ctx.beginPath();
      ctx.moveTo(xPos + tileSize/2, yPos + tileSize);
      ctx.lineTo(xPos, yPos + tileSize);
      ctx.lineTo(xPos, yPos + tileSize/2);
      ctx.fill();
    }
    else if (world.map[n] == 19) {
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(xPos, yPos, tileSize, tileSize);
      ctx.fillStyle = "green";
      ctx.beginPath();
      ctx.moveTo(xPos, yPos);
      ctx.lineTo(xPos, yPos + tileSize/2);
      ctx.lineTo(xPos + tileSize/2, yPos);
      ctx.fill();
    }
    else if (world.map[n] == 20) {
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(xPos, yPos, tileSize, tileSize);
      ctx.fillStyle = "green";
      ctx.beginPath();
      ctx.moveTo(xPos, yPos + tileSize/2);
      ctx.lineTo(xPos, yPos + tileSize);
      ctx.lineTo(xPos + tileSize/2, yPos + tileSize);
      ctx.fill();
    }
    else if (world.map[n] == 21) {
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(xPos, yPos, tileSize, tileSize);
      ctx.fillStyle = "green";
      ctx.beginPath();
      ctx.moveTo(xPos + tileSize/2, yPos + tileSize);
      ctx.lineTo(xPos + tileSize, yPos + tileSize);
      ctx.lineTo(xPos + tileSize, yPos + tileSize/2);
      ctx.fill();
    }
    else if (world.map[n] == 22) {
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(xPos, yPos, tileSize, tileSize);
      ctx.fillStyle = "green";
      ctx.beginPath();
      ctx.moveTo(xPos + tileSize, yPos);
      ctx.lineTo(xPos + tileSize/2, yPos);
      ctx.lineTo(xPos + tileSize, yPos + tileSize/2);
      ctx.fill();
    }
    // spesial tiles
    else if (world.map[n] == 99) {
    //  ctx.fillStyle = "gold";
    //  ctx.beginPath();
    //  ctx.arc(xPos + tileSize/2, yPos + tileSize/2, tileSize/2.2, 0, 2*Math.PI, false);
    //  ctx.fill();
    //  ctx.lineWidth = 2;
    //  ctx.strokeStyle = "black";
    //  ctx.stroke();
      ctx.drawImage(tile_99, xPos, yPos, tileSize, tileSize);
    }
    // enemies
    else if (world.map[n] == 51) {
      enemies.push(new enemy01(xPos, yPos));
      world.map.splice(n, 1, 00);
    }
    else if (world.map[n] == 52) {
      enemies.push(new enemy02(xPos, yPos));
      world.map.splice(n, 1, 00);
    }
  };

  //draw player
  ctx.drawImage(playerImage, player.xPos, player.yPos, player.width, player.height); // redrawing image ruins gif effect
  //ctx.fillStyle = player.color;
  //tx.fillRect(player.xPos, player.yPos, player.width, player.height);

  //draw enemies
  for (var i = 0; i < enemies.length; i++){
    ctx.fillStyle = enemies[i].color;
    ctx.fillRect(enemies[i].xPos, enemies[i].yPos, enemies[i].width, enemies[i].height);
  };
};
