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
  ctx.fillStyle = "#303840";
  ctx.fillRect(camera.centerX - cvsWidth/2, camera.centerY - cvsHeight/2, cvsWidth, cvsHeight);
//  ctx.drawImage(background, camera.centerX - cvsWidth/2, camera.centerY - cvsHeight/2, cvsWidth, cvsHeight);

  // draw tiles
  ctx.strokeStyle = "white";
  ctx.lineWidth = 2;
  for (var i = 0; i < camera.columns * camera.rows; i++){
    var k = Math.floor(i / camera.columns);
    var n = (world.columns * k) + camera.tileTL - 1 + i - camera.columns * k;
    var xPos = (n * tileSize) - (world.length * Math.floor((n * tileSize) / world.length));
    var yPos = Math.floor(n / world.columns) * tileSize;
    if (world.map[n] == 00 && building.state == true){ // nothing
      ctx.fillStyle = "rgba(255, 255, 255, .05)";
      ctx.fillRect(xPos + 2, yPos + 2, tileSize - 4, tileSize - 4);
    }
    else if (world.map[n] == 01) { // one-sided tile
      ctx.beginPath();
      ctx.moveTo(xPos, yPos);
      ctx.lineTo(xPos + tileSize, yPos);
      ctx.stroke();
      ctx.closePath();
   }
    else if (world.map[n] == 02) {
      ctx.beginPath();
      ctx.moveTo(xPos, yPos);
      ctx.lineTo(xPos, yPos + tileSize);
      ctx.stroke();
      ctx.closePath();
    }
    else if (world.map[n] == 03) {
      ctx.beginPath();
      ctx.moveTo(xPos, yPos + tileSize);
      ctx.lineTo(xPos + tileSize, yPos + tileSize);
      ctx.stroke();
      ctx.closePath();
    }
    else if (world.map[n] == 04) {
      ctx.beginPath();
      ctx.moveTo(xPos + tileSize, yPos);
      ctx.lineTo(xPos + tileSize, yPos + tileSize);
      ctx.stroke();
      ctx.closePath();
    }
    else if (world.map[n] == 05) { // corner tile
      ctx.beginPath();
      ctx.moveTo(xPos + tileSize, yPos);
      ctx.lineTo(xPos, yPos);
      ctx.lineTo(xPos, yPos + tileSize);
      ctx.stroke();
      ctx.closePath();
    }
    else if (world.map[n] == 06) {
      ctx.beginPath();
      ctx.moveTo(xPos, yPos);
      ctx.lineTo(xPos, yPos + tileSize);
      ctx.lineTo(xPos + tileSize, yPos + tileSize);
      ctx.stroke();
      ctx.closePath();
    }
    else if (world.map[n] == 07) {
      ctx.beginPath();
      ctx.moveTo(xPos, yPos + tileSize);
      ctx.lineTo(xPos + tileSize, yPos + tileSize);
      ctx.lineTo(xPos + tileSize, yPos);
      ctx.stroke();
      ctx.closePath();
    }
    else if (world.map[n] == 08) {
      ctx.beginPath();
      ctx.moveTo(xPos, yPos);
      ctx.lineTo(xPos + tileSize, yPos);
      ctx.lineTo(xPos + tileSize, yPos + tileSize);
      ctx.stroke();
      ctx.closePath();
    }
    else if (world.map[n] == 09) { // full tile
      ctx.strokeRect(xPos, yPos, tileSize, tileSize);
    }
    else if (world.map[n] == 10) { // full background tile

    }
    else if (world.map[n] == 11) { // 3-sided tile
      ctx.beginPath();
      ctx.moveTo(xPos, yPos + tileSize);
      ctx.lineTo(xPos, yPos);
      ctx.lineTo(xPos + tileSize, yPos);
      ctx.lineTo(xPos + tileSize, yPos + tileSize);
      ctx.stroke();
      ctx.closePath();
    }
    else if (world.map[n] == 12) {
      ctx.beginPath();
      ctx.moveTo(xPos + tileSize, yPos + tileSize);
      ctx.lineTo(xPos, yPos + tileSize);
      ctx.lineTo(xPos, yPos);
      ctx.lineTo(xPos + tileSize, yPos);
      ctx.stroke();
      ctx.closePath();
    }
    else if (world.map[n] == 13) {
      ctx.beginPath();
      ctx.moveTo(xPos, yPos);
      ctx.lineTo(xPos, yPos + tileSize);
      ctx.lineTo(xPos + tileSize, yPos + tileSize);
      ctx.lineTo(xPos + tileSize, yPos);
      ctx.stroke();
      ctx.closePath();
    }
    else if (world.map[n] == 14) {
      ctx.beginPath();
      ctx.moveTo(xPos, yPos);
      ctx.lineTo(xPos + tileSize, yPos);
      ctx.lineTo(xPos + tileSize, yPos + tileSize);
      ctx.lineTo(xPos, yPos + tileSize);
      ctx.stroke();
      ctx.closePath();
    }
    // spesial tiles => converted into 30
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
    // enemies
    else if (world.map[n] == 99) {
      enemies.push(new enemy99(xPos, yPos));
      world.map.splice(n, 1, 00);
    }
    else if (world.map[n] == 98) {
      enemies.push(new enemy98(xPos, yPos));
      world.map.splice(n, 1, 00);
    }
  };

  //draw resources
  for (var i = 0; i < resources.length; i++){
    if (resources[i].type == "Wood"){
      /*ctx.fillStyle = "forestgreen";
      ctx.strokeStyle = "darkgreen";
      ctx.beginPath();
      ctx.arc(resources[i].xPos + tileSize/2, resources[i].yPos + 10, 10, 0, 2*Math.PI, false);
      ctx.arc(resources[i].xPos + tileSize - 10, resources[i].yPos + tileSize/2, 10, 0, 2*Math.PI, false);
      ctx.arc(resources[i].xPos + tileSize/2, resources[i].yPos + tileSize - 10, 10, 0, 2*Math.PI, false);
      ctx.arc(resources[i].xPos + 10, resources[i].yPos + tileSize/2, 10, 0, 2*Math.PI, false);
      ctx.arc(resources[i].xPos + tileSize/2 - 10, resources[i].yPos + tileSize/2 - 10, 10, 0, 2*Math.PI, false);
      ctx.arc(resources[i].xPos + tileSize/2 + 10, resources[i].yPos + tileSize/2 - 10, 10, 0, 2*Math.PI, false);
      ctx.arc(resources[i].xPos + tileSize/2 + 10, resources[i].yPos + tileSize/2 + 10, 10, 0, 2*Math.PI, false);
      ctx.arc(resources[i].xPos + tileSize/2 - 10, resources[i].yPos + tileSize/2 + 10, 10, 0, 2*Math.PI, false);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(resources[i].xPos + tileSize/2, resources[i].yPos + tileSize/2, 20.5, 0, 2*Math.PI, false);
      ctx.fill();
      ctx.closePath();*/
      ctx.drawImage(resources[i].img, resources[i].xPos, resources[i].yPos, tileSize, tileSize);
    }
    else if (resources[i].type == "Stone"){
      ctx.fillStyle = "grey";
      ctx.strokeStyle = "darkgrey";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(resources[i].xPos + 4, resources[i].yPos + 4);
      ctx.lineTo(resources[i].xPos + 38, resources[i].yPos);
      ctx.lineTo(resources[i].xPos + 47, resources[i].yPos + 30);
      ctx.lineTo(resources[i].xPos + 25, resources[i].yPos + 46);
      ctx.lineTo(resources[i].xPos + 1, resources[i].yPos + 35);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    else if (resources[i].type == "Bronze"){
      ctx.fillStyle = "grey";
      ctx.beginPath();
      ctx.moveTo(resources[i].xPos + 4, resources[i].yPos + 4);
      ctx.lineTo(resources[i].xPos + 38, resources[i].yPos);
      ctx.lineTo(resources[i].xPos + 47, resources[i].yPos + 30);
      ctx.lineTo(resources[i].xPos + 25, resources[i].yPos + 46);
      ctx.lineTo(resources[i].xPos + 1, resources[i].yPos + 35);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "darkgrey";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = "#cd7f32";
      ctx.fillRect(resources[i].xPos + 9, resources[i].yPos + 9, 10, 10);
      ctx.fillRect(resources[i].xPos + 30, resources[i].yPos + 14, 10, 10);
      ctx.fillRect(resources[i].xPos + 14, resources[i].yPos + 28, 10, 10);
    }
    else if (resources[i].type == "Silver"){
      ctx.fillStyle = "grey";
      ctx.beginPath();
      ctx.moveTo(resources[i].xPos + 4, resources[i].yPos + 4);
      ctx.lineTo(resources[i].xPos + 38, resources[i].yPos);
      ctx.lineTo(resources[i].xPos + 47, resources[i].yPos + 30);
      ctx.lineTo(resources[i].xPos + 25, resources[i].yPos + 46);
      ctx.lineTo(resources[i].xPos + 1, resources[i].yPos + 35);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "darkgrey";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = "silver";
      ctx.fillRect(resources[i].xPos + 9, resources[i].yPos + 9, 10, 10);
      ctx.fillRect(resources[i].xPos + 30, resources[i].yPos + 14, 10, 10);
      ctx.fillRect(resources[i].xPos + 14, resources[i].yPos + 28, 10, 10);
    }
    else if (resources[i].type == "Gold"){
      ctx.fillStyle = "grey";
      ctx.beginPath();
      ctx.moveTo(resources[i].xPos + 4, resources[i].yPos + 4);
      ctx.lineTo(resources[i].xPos + 38, resources[i].yPos);
      ctx.lineTo(resources[i].xPos + 47, resources[i].yPos + 30);
      ctx.lineTo(resources[i].xPos + 25, resources[i].yPos + 46);
      ctx.lineTo(resources[i].xPos + 1, resources[i].yPos + 35);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "darkgrey";
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.fillStyle = "gold";
      ctx.fillRect(resources[i].xPos + 9, resources[i].yPos + 9, 10, 10);
      ctx.fillRect(resources[i].xPos + 30, resources[i].yPos + 14, 10, 10);
      ctx.fillRect(resources[i].xPos + 14, resources[i].yPos + 28, 10, 10);
    }
  };

  //draw structures
  for (var i = 0; i < structures.length; i++){
    ctx.drawImage(structures[i].img, structures[i].xPos, structures[i].yPos, tileSize, tileSize);
  };

  //draw resources healthbar
  for (var i = 0; i < resources.length; i++){
    if (resources[i].health < resources[i].maxHealth) {
      ctx.fillStyle = "grey";
      ctx.fillRect(resources[i].xPos + 1, resources[i].yPos + tileSize - 10, tileSize - 2, 10);
      if (resources[i].health / resources[i].maxHealth <= 0.25) { ctx.fillStyle = "red";} else { ctx.fillStyle = "lime";};
      ctx.fillRect(resources[i].xPos + 1, resources[i].yPos + tileSize - 10, (tileSize - 2) * (resources[i].health / resources[i].maxHealth), 10);
    };
  };

  //draw structures healthbar
  for (var i = 0; i < structures.length; i++){
    if (structures[i].health < structures[i].maxHealth) {
      ctx.fillStyle = "grey";
      ctx.fillRect(structures[i].xPos + 1, structures[i].yPos + tileSize - 10, tileSize - 2, 10);
      if (structures[i].health / structures[i].maxHealth <= 0.25) { ctx.fillStyle = "red";} else { ctx.fillStyle = "lime";};
      ctx.fillRect(structures[i].xPos + 1, structures[i].yPos + tileSize - 10, (tileSize - 2) * (structures[i].health / structures[i].maxHealth), 10);
    };
  };

  //draw boundaries of screen
  ctx.save();
  ctx.setLineDash([tileSize/2, tileSize/3]); /* [line size, line space] */
  ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
  ctx.strokeRect(0, 0, world.length, world.height);
  ctx.restore();
  for (var i = 0; i < Math.ceil(world.length / cvsWidth)+2; i++) { // fog horizontal
    ctx.drawImage(fog180, -cvsWidth/2 + i*cvsWidth/1.2, -cvsHeight/2, cvsWidth, cvsHeight/2);
    ctx.drawImage(fog, -cvsWidth/2 + i*cvsWidth/1.2, world.height, cvsWidth, cvsHeight/2);
  };
  for (var i = 0; i < Math.ceil(world.height / cvsHeight*2)+2; i++) { // fog vertical
    ctx.drawImage(fog90, world.length, -cvsHeight/2 + i*cvsHeight/1.2, cvsWidth/2, cvsHeight*2);
    ctx.drawImage(fog270, -cvsWidth/2, -cvsHeight/2 + i*cvsHeight/1.2, cvsWidth/2, cvsHeight*2);
  };

  //draw player
  ctx.save();
  ctx.translate(player.xPos + player.width/2, player.yPos + player.height/2);
  ctx.rotate(angle * Math.PI / 180);
      // hands
  ctx.fillStyle = "lightblue";
  ctx.beginPath();
  ctx.arc(-player.width/2 - 4, -player.height/2 + player.height/2, 10, 0, 2*Math.PI, false);
  ctx.arc(-player.width/2 + player.width + 4, -player.height/2 + player.height/2, 10, 0, 2*Math.PI, false);
  ctx.fill();
      // body
  ctx.fillStyle = player.color;
  ctx.fillRect(-player.width/2, -player.height/2, player.width, player.height);
      // eyes
  ctx.fillStyle = "black";
  ctx.fillRect(-player.width/2 + 5, -player.height/2, 10, 10);
  ctx.fillRect(-player.width/2 + 31, -player.height/2, 10, 10);

  ctx.fillStyle = "rgba(255, 255, 255, .1)";
  ctx.beginPath();
  ctx.arc(-player.width/2 + player.width/2, -player.height/2 + player.height/2, player.range, 0, 2*Math.PI, false);
  ctx.fill();
  ctx.restore();
  //ctx.fillStyle = player.color;
  //ctx.fillRect(player.xPos, player.yPos, player.width, player.height);

  //draw enemies
  for (var i = 0; i < enemies.length; i++){
    ctx.fillStyle = enemies[i].color;
    ctx.fillRect(enemies[i].xPos, enemies[i].yPos, enemies[i].width, enemies[i].height);
    ctx.fillStyle = "rgba(255, 255, 255, .1)";
    ctx.beginPath();
    ctx.arc(enemies[i].xPos + enemies[i].width/2, enemies[i].yPos + enemies[i].height/2, enemies[i].range, 0, 2*Math.PI, false);
    ctx.fill();
  };

  //draw hovered tile
  camera.hoveredTile = Math.floor(cvsMouseX / tileSize) + (Math.floor(cvsMouseY / tileSize) * world.columns);
  camera.hoveredxPos = (camera.hoveredTile * tileSize) - (world.length * Math.floor((camera.hoveredTile * tileSize) / world.length));
  camera.hoveredyPos = Math.floor(camera.hoveredTile / world.columns) * tileSize;
  if (building.state == true){
    ctx.fillStyle = "rgba(255, 255, 255, .1)";
    ctx.fillRect(camera.hoveredxPos, camera.hoveredyPos, tileSize, tileSize);
    ctx.drawImage(placeBuildable, camera.hoveredxPos, camera.hoveredyPos, tileSize, tileSize)
  };

  //draw text
  for (var i = 0; i < texts.length; i++){
    ctx.font = "20px Comic Sans MS";
    ctx.fillStyle = texts[i].color + texts[i].opacity + ")";
    ctx.textAlign = "center";
    ctx.fillText(texts[i].text, texts[i].xPos + 20, texts[i].yPos);
    texts[i].yPos -= 1;
    texts[i].opacity -= 0.015;
    if (texts[i].opacity < 0) {
      texts.splice(i, 1);
    };
  };

  //item info box
  if (array != null){
    for (var i = 0; i < array.length; i++){
      if (currentPage == 3){
        gridSlots.querySelectorAll("div")[i].style.filter = "brightness(100%)";
      } else
      if (player.inventory.wood >= array[i].costWood &&
          player.inventory.stone >= array[i].costStone &&
          player.inventory.bronze >= array[i].costBronze &&
          player.inventory.silver >= array[i].costSilver &&
          player.inventory.gold >= array[i].costGold) {
        gridSlots.querySelectorAll("div")[i].style.filter = "brightness(100%)";
      } else {
        gridSlots.querySelectorAll("div")[i].style.filter = "brightness(50%)";
      };
    };
  };
  itemInfo.style.top = mouseY - 30 + "px";
  itemInfo.style.left = mouseX + 20 + "px";

  //resources display
  document.getElementById("resourcesDisplay").innerHTML =
    `<p style="color: #8D6142">Wood: ${player.inventory.wood} <p><br>
     <p style="color: grey">Stone: ${player.inventory.stone} <p><br>
     <p style="color: #cd7f32">Bronze: ${player.inventory.bronze} <p><br>
     <p style="color: silver">Silver: ${player.inventory.silver} <p><br>
     <p style="color: gold">Gold: ${player.inventory.gold} <p>`;
};
