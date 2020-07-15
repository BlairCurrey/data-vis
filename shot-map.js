function ShotMap(player){
  // this.table = player.table
  
  this.draw = function(player){
    noStroke();
    //set color based off make or miss
    for(var i = 0; i < player.table.getRowCount(); i++){
      if(player.table.get(i,'shot_made_flag') == 1){
          fill(0,255,0,100);
      }
      else{
          fill(255,0,0,100)
      }
      //transform data to fit court
      push();
      translate(75,300);
      rotate((3*PI)/2)

      //draw shots
      ellipse(player.table.get(i,'x'),player.table.get(i,'y'),10);
      pop();

      //stat text
      statText = {
        x: 160,
        y: 562,
        step:120
      }
      textAlign(LEFT,CENTER);
      fill(0);
      textSize(15);
      text(player.stats[0], statText.x, statText.y);
      text(player.stats[1], statText.x + statText.step, statText.y);
      text(player.stats[2], statText.x + statText.step * 2, statText.y);
      text(player.stats[3], statText.x + statText.step * 3.5, statText.y);
      fill(255);
    }
  }
}