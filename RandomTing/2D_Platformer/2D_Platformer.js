var context, controller, player, enemy, loop, enemyColor, enemyHealthbar, playerHealthbar, heartColor, heartColor2, rdmNum;

context = document.querySelector("canvas").getContext("2d");

context.canvas.height = 580;
context.canvas.width = 1250;

enemyColor = "#C03E3E";
heartColor = "#FFC0CB";
heartColor2 = "white";

player = {
  height:32,
  jumping:true,
  health: 0,
  width:32,
  x:200, // center of the canvas (width/2 - boxwidth/2)
  x_velocity:0,
  y:300,
  y_velocity:0
};

enemy = {
  height:32,
  jumping:true,
  health: 0,
  width: 32,
  x:800,
  x_velocity:0,
  y:300,
  y_velocity:0
};

heart = {
  height:32,
  width:32,
  x:1000,
  x_velocity:-2,
  y:370,
  y_velocity:-1,
  taken:false
};

controller = {
  left:false,
  right:false,
  up:false,
  keyListener:function(event) {

    var key_state = (event.type == "keydown")?true:false;

    switch(event.keyCode) {

      case 37:// left key
        controller.left = key_state;
      break;
      case 38:// up key
        controller.up = key_state;
      break;
      case 39:// right key
        controller.right = key_state;
      break;
    }
  }
};

loop = function() {

  if (controller.up && player.jumping == false) {
    player.y_velocity -= 25;
    player.jumping = true;
  }
  if (controller.left) {
    player.x_velocity -= 1.5;
  }
  if (controller.right) {
    player.x_velocity += 1.5;
  }

  player.y_velocity += 1.5;// gravity
  player.x += player.x_velocity;
  player.y += player.y_velocity;
  player.x_velocity *= 0.8;// friction
  player.y_velocity *= 0.9;// friction

  heart.x += heart.x_velocity;
  heart.y += heart.y_velocity;

  if (heart.x_velocity > 0 && heart.x > 1100) {
    heart.x_velocity *= -1;
  }
  if (heart.x_velocity < 0 && heart.x < 100) {
    heart.x_velocity *= -1;
  }
  if (heart.y_velocity > 0 && heart.y > 370) {
    heart.y_velocity *= -1;
  }
  if (heart.y_velocity < 0 && heart.y < 320) {
    heart.y_velocity *= -1;
  }
  if (heart.x - player.x < 32 && heart.x - player.x > -32 && heart.y - player.y < 32 && heart.y - player.y > -32 && player.health > 0 && heart.taken == false) {
    player.health -= 1;
    heart.taken = true;
  }
  if (heart.taken == true) {
    heartColor = "#202020";
    heartColor2 = "#202020";
  }

  // if player is falling below floor line
  if (player.y > 500 - 32) {
    player.jumping = false;
    player.y = 500 - 32;
    player.y_velocity = 0;
  }

  // if player is going off the left of the screen
  if (player.x < -32) {
    player.x = 1250;

  } else if (player.x > 1250) {// if player goes past right boundary
    player.x = -32;
  }

  enemy.y_velocity += 1.5;// gravity
  enemy.x += enemy.x_velocity;
  enemy.y += enemy.y_velocity;
  enemy.x_velocity *= 0.8;// friction
  enemy.y_velocity *= 0.9;// friction

  // if player is falling below floor line
  if (enemy.y > 500 - 32) {
    enemy.jumping = false;
    enemy.y = 500 - 32;
    enemy.y_velocity = 0;
  }

if (enemy.x - player.x < 300 && enemy.x - player.x > -300){ // starts attacking when 300 units close
  if (enemy.x > player.x){
    enemy.x_velocity -= 0.5;
  }
  else if (enemy.x < player.x){
    enemy.x_velocity += 0.5;
  }
  enemyColor = "#FF0000"
}
else {
  enemyColor = "#C03E3E"
}

if (enemy.x - player.x < 32 && enemy.x - player.x > -32 && enemy.y - player.y < 32){ // when you get hit
  player.health += 1;
  if (enemy.x > player.x){
    player.x_velocity = -50;
  }
  else if (enemy.x < player.x){
    player.x_velocity = 50;
  }
}

function randomNum(){
  rdmNum = Math.round(Math.random());
  if (rdmNum == 1){
    rdmNum = 20;
  }
  else if (rdmNum == 0){
    rdmNum = -20;
  }
};

if (enemy.x - player.x < 30 && enemy.x - player.x > -30 && enemy.y - player.y < 40 && enemy.y - player.y > 30){ // when enemy gets hit
  enemy.health += 1;
  enemy.y_velocity -= 10;
  randomNum();
  enemy.x_velocity = rdmNum;
  player.y_velocity -= 30;
  enemyColor = "#8A8A8A";
}

if (enemy.health == 0){
  document.getElementById("E_Health_1").style.backgroundColor= "green";
  document.getElementById("E_Health_2").style.backgroundColor= "green";
  document.getElementById("E_Health_3").style.backgroundColor= "green";
}
if (enemy.health == 1){
  document.getElementById("E_Health_1").style.backgroundColor= "#202020";
  document.getElementById("E_Health_2").style.backgroundColor= "green";
  document.getElementById("E_Health_3").style.backgroundColor= "green";
}
if (enemy.health == 2){
  document.getElementById("E_Health_1").style.backgroundColor= "#202020";
  document.getElementById("E_Health_2").style.backgroundColor= "#202020";
  document.getElementById("E_Health_3").style.backgroundColor= "green";
}
if (enemy.health == 3){ // enemy death
  enemy.x = -400;
  document.getElementById("E_Health_1").style.backgroundColor= "#202020";
  document.getElementById("E_Health_2").style.backgroundColor= "#202020";
  document.getElementById("E_Health_3").style.backgroundColor= "#202020";
}
if (player.health == 0){
  document.getElementById("P_Health_1").style.backgroundColor= "green";
  document.getElementById("P_Health_2").style.backgroundColor= "green";
  document.getElementById("P_Health_3").style.backgroundColor= "green";
}
if (player.health == 1){
  document.getElementById("P_Health_1").style.backgroundColor= "#202020";
  document.getElementById("P_Health_2").style.backgroundColor= "green";
  document.getElementById("P_Health_3").style.backgroundColor= "green";
}
if (player.health == 2){
  document.getElementById("P_Health_1").style.backgroundColor= "#202020";
  document.getElementById("P_Health_2").style.backgroundColor= "#202020";
  document.getElementById("P_Health_3").style.backgroundColor= "green";
}
if (player.health == 3){ // player death
  document.getElementById("E_Health_1").style.backgroundColor= "#202020";
  document.getElementById("E_Health_2").style.backgroundColor= "#202020";
  document.getElementById("E_Health_3").style.backgroundColor= "#202020";
  player.x = 250;
  player.y = 300;
  player.x_velocity = 0;
  player.health = 0;
  enemy.health = 0;
  enemy.x = 800;
  enemy.y = 300;
  enemy.x_velocity = 0;
  document.getElementById("Deathnote").style.transition = "0s";
  document.getElementById("Deathnote").style.opacity = "1";
  heart.x = 1000;
  heart.y = 370;
  heart.taken = false;
  heartColor = "#FFC0CB";
  heartColor2 = "white";
}
if (enemy.health == 3){ // enemy death
  player.x = 250;
  player.y = 300;
  player.x_velocity = 0;
  player.health = 0;
  enemy.health = 0;
  enemy.x = 800;
  enemy.y = 300;
  enemy.x_velocity = 0;
  document.getElementById("Victorynote").style.transition = "0s";
  document.getElementById("Victorynote").style.opacity = "1";
  heart.x = 1000;
  heart.y = 370;
  heart.taken = false;
  heartColor = "#FFC0CB";
  heartColor2 = "white";
}
if (enemy.y > 300){
  document.getElementById("Deathnote").style.transition = "2s";
  document.getElementById("Deathnote").style.opacity = "0";
  document.getElementById("Victorynote").style.transition = "2s";
  document.getElementById("Victorynote").style.opacity = "0";
}

  context.fillStyle = "#202020";
  context.fillRect(0, 0, 1250, 580);// x, y, width, height

  context.fillStyle = heartColor;
  context.beginPath();
  context.rect(heart.x, heart.y, heart.width, heart. height);
  context.fill();
  context.fillStyle = heartColor2;
  context.beginPath();
  context.rect(heart.x + 5, heart.y + 13, 22, 6);
  context.fill();
  context.beginPath();
  context.rect(heart.x + 13, heart.y + 5, 6, 22);
  context.fill();

  context.fillStyle = "#66A4FF"; // player
  context.beginPath();
  context.rect(player.x, player.y, player.width, player.height);
  context.fill();

  context.fillStyle = "white"; // player designw
  context.beginPath();
  context.rect(player.x + 5, player.y + 5, 6, 6);
  context.fill();
  context.beginPath();
  context.rect(player.x + player.width - 11, player.y + 5, 6, 6);
  context.fill();
  context.beginPath();
  context.rect(player.x + 5, player.y + 18, 22, 6);
  context.fill();

  context.fillStyle = enemyColor; // enemy
  context.beginPath();
  context.rect(enemy.x, enemy.y, enemy.width, enemy.height);
  context.fill();

  context.fillStyle = "black"; // enemy designw
  context.beginPath();
  context.rect(enemy.x + 5, enemy.y + 5, 6, 6);
  context.fill();
  context.beginPath();
  context.rect(enemy.x + enemy.width - 11, enemy.y + 5, 6, 6);
  context.fill();
  context.beginPath();
  context.rect(enemy.x + 5, enemy.y + 18, 22, 6);
  context.fill();

  context.strokeStyle = "#202830";
  context.lineWidth = 4;
  context.beginPath();
  context.moveTo(0, 500);
  context.lineTo(1250, 500);
  context.stroke();

  // call update when the browser is ready to draw again
  window.requestAnimationFrame(loop);

};

window.addEventListener("keydown", controller.keyListener)
window.addEventListener("keyup", controller.keyListener);
window.requestAnimationFrame(loop);
