var objekter = {
  width: 80,
  height: 30,
  rows: 6,
  columns: 12,
  get objektCount() {return this.rows * this.columns},
  get length()      {return (this.columns * this.width) + (this.mellomrom * (this.columns-1))},
  get marginLeft()  {return (ctx.canvas.width - this.length)/2},
  marginTop: 80,
  mellomrom: 10
};

var objektArray = [];

function lagObjektArray(){
  for (var i = 0; i < objekter.objektCount; i++){
    objektArray[i] = new Object();
    objektArray[i].width = objekter.width;
    objektArray[i].height = objekter.height;
    objektArray[i].xPos = (objekter.marginLeft + (i * objekter.width) + (i * objekter.mellomrom)) - ((objekter.length + objekter.mellomrom) * Math.floor(i / objekter.columns));
    objektArray[i].yPos = objekter.marginTop + (Math.floor(i / objekter.columns) * objekter.height) + (Math.floor(i / objekter.columns) * objekter.mellomrom);
    objektArray[i].color = getRandomColor();
    objektArray[i].top = objektArray[i].yPos;
    objektArray[i].left = objektArray[i].xPos;
    objektArray[i].right = objektArray[i].xPos + objektArray[i].width;
    objektArray[i].bottom = objektArray[i].yPos + objektArray[i].height;
  };
}; lagObjektArray();

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  };
  return color;
};
