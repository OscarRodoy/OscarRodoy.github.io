var mainMenu = document.getElementById("mainMenu");
var selectLevel = document.getElementById("selectLevel");
var btnSelectLevel = document.getElementById("btnSelectLevel");
var btnLevel_1 = document.getElementById("btnLevel_1");

btnSelectLevel.onclick = function(){
  mainMenu.style.display = "none";
  selectLevel.style.display = "block";
};

btnLevel_1.onclick = function(){
  selectLevel.style.display = "none";
  gamePaused = false;
  window.requestAnimationFrame(loop);
};
