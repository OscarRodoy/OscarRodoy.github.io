class Spiller{
  constructor(x, y){
    this.x = x;
    this.y = y;
    this.storrelse = 25;
    this.farge = `rgb(${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)},${Math.floor(Math.random()*255)})`;
  }
  tegn(){
    fill(this.farge);
    circle(this.x, this.y, this.storrelse);
  }
  flytt(){
    this.x += (mouseX - this.x)*(0.5 / this.storrelse);
    this.y += (mouseY - this.y)*(0.5 / this.storrelse);
  }
  spis(){
    this.storrelse += 2;
  }
}
