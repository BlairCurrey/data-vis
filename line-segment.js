function LineSegment(startPoint, endPoint, speed){
  this.xStart = startPoint.x;
  this.xStop = endPoint.x;
  this.yStart = startPoint.y;
  this.yStop = endPoint.y;
  this.xPos = startPoint.x;
  this.yPos = startPoint.y;
  this.xSpeed = (this.xStop - this.xStart)/speed;
  this.ySpeed = (this.yStop - this.yStart)/speed;
  this.complete = false;
  this.active = false;
  this.lastSegment = false;
  this.weight = 10;
  this.textSize = 18;
  this.circleSize = this.textSize * 1.75
  this.color = startPoint.color //random
  this.name = startPoint.name;

  this.draw = function (){
    //check if line segment is active
    if(this.active == true){
      strokeWeight(this.weight);
      stroke(this.color);
      line(this.xStart, this.yStart, this.xPos, this.yPos);
      //draws label at end of line
      if(this.complete == false || this.lastSegment == true){
        fill(this.color);
        ellipse(this.xPos, this.yPos, this.circleSize);
        strokeWeight(2);
        fill(255)
        textSize(this.textSize);
        textAlign(CENTER);
        text(this.name, this.xPos, this.yPos);
        strokeWeight(this.weight);
      }
      strokeWeight(1);
    }
  }

  this.updatePos = function (){
    //increment until stopping point
    if(this.xPos < this.xStop){
      this.xPos += this.xSpeed;
      this.yPos += this.ySpeed;
      //if segement increments beyond stopping point, reset to stopping point
      if(this.xPos > this.xStop){
        this.xPos = this.xStop;
        this.yPos = this.yStop;
      }
    }
    //flag segment as complete
    else{
      this.complete = true;
    }
  }

  this.checkActive = function (value){
    //checks if segment is active (being drawn)
    if(this.yPos != value){
      this.active = true;
    }
  }
}