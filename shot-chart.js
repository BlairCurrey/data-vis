function ShotChart(){
  // Name of visualization that appears in menu bar
  this.name = 'Shot Chart';

  //Unique ID with no special characters
  this.id= 'shot-chart';

  //array of player objects
  this.players = [
    {name: "Stephen Curry",
    picture: loadImage('./assets/stephen-curry.png'),
    table: loadTable('./data/shot-chart/stephen-curry-14.csv', 'csv', 'header')},
    {name: "DeMar Derozan",
    picture: loadImage('./assets/demar-derozan.png'),
    table: loadTable('./data/shot-chart/demar-derozan-14.csv', 'csv', 'header')},
    {name: "DeAndre Jordan",
    picture: loadImage('./assets/deandre-jordan.png'),
    table: loadTable('./data/shot-chart/deandre-jordan-14.csv', 'csv', 'header')}
  ]

  //stores values related to the court SVG
  this.court = {
    xPos: 325,
    yPos: 50,
    filepath: "./assets/court.svg",
    altText: "Basketball Court SVG"
  }

  this.loaded = false;

  this.preload = function(){
    var self = this;

    //preload tables and pictures
    for(var i = 0; i < this.players.length; i ++){
      this.players[i].table;
      this.players[i].picture;
    }
    self.loaded = true;
  };

  this.setup = function(){
    if(!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    //construct new shotmap
    this.chart = new ShotMap(this.players[0])

    //loop through array of players objects and add stats to each player object
    for(var i = 0; i < this.players.length; i++){
      this.players[i].stats = this.getStats(this.players[i])
    }

    //Display's the court SVG
    this.img = createImg(this.court.filepath, this.court.altText);
    this.img.position(this.court.xPos,this.court.yPos);

    //create Dom element for data download
    this.dataDL = makeDataSourceEle(this.name, './data/shot-chart/source/shot-combined.csv');

    // Create a select DOM element
    this.select = createSelect();
    this.select.position(this.court.xPos, 560);

    //fill the select DOM element with players
    for(let i = 0; i < this.players.length; i++){
      this.select.option(this.players[i].name);
    }
  };

  this.destroy = function(){
    //remove DOM elements when changing visualizations
    this.img.remove();
    this.select.remove();
    this.dataDL.remove();
  }
  this.draw = function(){
    //draw shots
    for(var i = 0; i < this.players.length; i ++){
      if(this.select.value()==this.players[i].name){
        this.chart.draw(this.players[i]);
        image(this.players[i].picture, 720, 360);
      }
    }


    //draw legend
    this.legendDraw();

    //draw title
    this.drawTitle("Shot Chart", width/2, 0)
  };
  this.legendDraw = function(){
    var x = 750;
    var y = 17;
    var step = 100;
    var size = 15;

    textAlign(LEFT,CENTER);
    fill(0,255,0);
    ellipse(x,y,size);
    fill(255,0,0);
    ellipse(x + step,y,size);
    textSize(20);
    fill(0);
    text("Made", x + step / 8, y + size/6);
    text("Missed", x + step + step / 8, y + size/6);
  }
  this.getStats = function(player){
    //define stats
    total = player.table.getRowCount()-1;
    made = player.table.get(total, 'shot_made_flag');
    shootingPercentage = (made / total) * 100;
    distance = player.table.get(total, "shot_distance");

    //put into object
    stats = ["Total: " + total, 
      "Made: " + made,
      "Shooting %: " + shootingPercentage.toFixed(2),
      "Average Distance: " + distance + " ft"]
    return(stats)
  }
  this.drawTitle = function (title, x, y){
      //Enlarges text size for title
    push();
    textSize(18);
    fill(0);
    noStroke();
    textAlign('center', 'center');

    text(title, x, y+textSize());

    //Resets text to default size
    textSize(14);
    pop();
  }
}