function SinWave() {
  this.start = 0;
  this.curl = 80; //"curliness" of wave
  this.pad = 8; //space between lines
  this.length = this.pad * 3
  this.add = TWO_PI / this.curl;

  this.draw = function() {
    var indent = 100;

    //Title
    push();
    fill(0);
    noStroke();
    textSize(40);
    textFont('consolas');
    textAlign(LEFT, BOTTOM);
    text("Loading", indent, height/2 - textSize())
    pop();

    //sinWave
    push();
    stroke(0);
    strokeWeight(3);
    for (var i = 0; i < this.curl; i++) {
      line(i * this.pad + indent, height/2, i * this.pad + indent, height/2 + sin(this.start) * this.length);
      this.start = this.start + this.add;
    }
    pop();
  }

  this.update = function() {
    if(this.start < 1){}
      this.start -= this.add
  }
}