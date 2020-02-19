class Boble {
  constructor() {
    this.x = 50;
    this.y = 50;
    this.r = 25;
  }
  flytt(){
    this.x += random(-5, 5);
    this.y += random(-5, 5);
  }
  tegn(){
    circle(this.x, this.y, this.r);
  }
}
let bobler = [];
let antall = 50;
for (let i = 0; i < antall; i++){
  bobler[i] = new Boble;
}

function setup() {
  // put setup code here
  createCanvas(400, 400);

}

function draw() {
  // put drawing code here
  background(220);
  for (let i = 0; i < bobler.length; i++){
    bobler[i].tegn();
    bobler[i].flytt();
  }
}
