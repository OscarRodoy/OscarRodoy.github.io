
var array = [];

for (var i = 0; i < 7; i++){
  array.push(tilfeldig());
};

function tilfeldig() {
  return Math.floor(Math.random()*101) + 50;
};

function setup() {
  // put setup code here
  createCanvas(400, 400);

}

function draw() {
  // put drawing code here
  background(220);

}
