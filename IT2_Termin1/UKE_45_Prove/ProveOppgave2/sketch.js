tilfeldig();
var tilfeldigTall = Number();
function tilfeldig(){
  tilfeldigTall = Math.floor(Math.random() * 101) + 50;
};

var array = [];
while (array.length < 7){
  tilfeldig();
  var nyttTall = tilfeldigTall;
  if (array.indexOf(nyttTall) == -1){
    array.push(nyttTall);
  } else {
    slettTall(nyttTall);
  };
};

function slettTall(index){
  for (var i = 0; i < array.length; i++){
    if (array[i] == index){
      array.splice(i, 1);
    };
  };
}; 

var storst = Number(0);
for (var i = 0; i<array.length; i++){
  if (storst < array[i]){
    storst = array[i];
  };
};

console.log(array);
console.log(storst);

function setup() {
  // put setup code here
  createCanvas(400, 400);

}

function draw() {
  // put drawing code here
  background(220);
  circle(200,200,storst);
}
