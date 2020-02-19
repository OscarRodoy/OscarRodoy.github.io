var xPos = 100;
var yPos = 200;
var bredde = 200;
var hoyde = 200;
var trekantHoyde = 100;
var dorBredde = 40;
var dorHoyde = 80;

function setup() {
  // put setup code here
  createCanvas(1000, 500);
  background(220);
}

function draw() {
  // put drawing code here
  //while (xPos < width-bredde) {
  for (var i = 0; i < 400; i+=200) {
    fill("red");
    rect(xPos, yPos, bredde, hoyde);
    fill("grey");
    triangle(xPos, yPos, xPos+bredde, yPos, xPos+bredde/2, yPos - trekantHoyde);
    rect(xPos + bredde/2 - dorBredde/2, yPos+hoyde-dorHoyde, dorBredde, dorHoyde);
    xPos += bredde;
  }
}
