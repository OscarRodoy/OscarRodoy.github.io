var d = 20;

function setup() {
  // put setup code here
  createCanvas(400, 400);
  background(200);
}

function draw() {
  // put drawing code here
  stroke(255,0,0);
  while (d < height) {
    line(0, d, 400, d);
    d += 20;
  };
  //function draw() {
    // put drawing code here
    //stroke(255,0,0);
    //while (d <= width) {
    //  noFill()
    //  circle(width/2, height/2, d); // circle(x, y, r) bruker diameter ikke radius!
    //  d += 20;
    //};
  //}
//}
