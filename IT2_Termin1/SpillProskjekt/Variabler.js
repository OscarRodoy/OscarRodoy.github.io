var ctx = document.querySelector("canvas").getContext("2d");
var cvsWidth = ctx.canvas.width = 1248;
var cvsHeight = ctx.canvas.height = 576;

var startSpill = false;
var timerInterval;
var minutter = sekunder = 0;
var tid = 0;
var objekterFjernet = 0;
var score = 0;
var rekordArray = [];
var navn;

var displayGrid = document.getElementById("displayGrid");
var timer = document.getElementById("timer");
var visObjekterFjernet = document.getElementById("visObjekterFjernet");
var visScore = document.getElementById("visScore");
var startSide = document.getElementById("startSide");
var rekorder = document.getElementById("rekorder");
var startKnapp = document.getElementById("startKnapp");
var gameoverSide = document.getElementById("gameoverSide");
var statistikk = document.getElementById("statistikk");
var fortsettKnapp = document.getElementById("fortsettKnapp");

var controller = {
  left:false,
  right:false,
  keyUpDown:function(event) {
    var key_state = (event.type == "keydown")?true:false;
    switch(event.keyCode) {
      case 65: controller.a = key_state; break; // a key
      case 68: controller.d = key_state; break; // d key
      case 37: controller.leftArrow = key_state; break; // venstre pil
      case 39: controller.rightArrow = key_state; break; // høyre pil
    }
  }
};
