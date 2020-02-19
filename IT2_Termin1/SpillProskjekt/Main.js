window.onload = function(){
  setTimeout(function(){
    alert("Bruk pil tastene eller a og d for å bevege spilleren!\nPass på at ballen ikke passerer spilleren!\nØderlegg alle objektene for å vinne spillet!");
  }, 100);
};

startKnapp.onclick = function(){
  controller.a = controller.d = controller.leftArrow = controller.rightArrow = false;
  startSpill = true;
  startSide.style.display = "none";
  displayGrid.style.opacity = "1";
  ctx.canvas.style.filter = "brightness(100%)";
  window.requestAnimationFrame(loop);
};

var loop = function(){

  tegnSpill();

  oppdaterSpill();

  if (startSpill == false){
    ctx.canvas.style.filter = "brightness(30%)";
    return;
  };

  window.requestAnimationFrame(loop);
};
window.requestAnimationFrame(loop);
window.addEventListener("keydown", controller.keyUpDown);
window.addEventListener("keyup", controller.keyUpDown);
