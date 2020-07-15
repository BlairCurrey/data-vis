function SalesMetrics(){
  
  // Name of visualization that appears in menu bar
  this.name = 'Sales Metrics';

  //Unique ID with no special characters
  this.id= 'sales-metrics';

  //Set file location for data
  this.dataLoc = './data/sales-metrics/sales-metrics.csv';
  
  var marginSize = 50;

  //layout object for common plot layout parameters and methods
  this.layout = {
    
    //Sets default margin size, title, and defaul font size
    marginSize: marginSize,
    title: "Sales Metrics Since September 2019",
    textSize: 14,

    //sets position of heat map
    leftMargin: marginSize,
    rightMargin: width - marginSize,
    topMargin: marginSize,
    bottomMargin: height - marginSize,
    pad: 20,
  };

  //cell object for properties related to the heat map's cells
  this.cell = {

    width: 90,
    height: 40,
    xStart: marginSize * 2,
    yStart: marginSize * 1.5
  };

  //Indicates whether or not data has been loaded
  this.loaded = false;

  //Preload the data - called automatically by gallery 
  //when visualisation is added
  this.preload = function () {
    var self = this;
    this.data = loadTable(
      this.dataLoc, 'csv', 'header',
      //Set loaded to true
      function(table){
        self.loaded = true;
      });
  };

  this.setup = function() {
    //create Dom element for data download
    this.dataDL = makeDataSourceEle(this.name, this.dataLoc);
    //Default Font size
    textSize(this.layout.textSize);

  };

  this.destroy = function(){
    this.dataDL.remove();
  };

  this.draw = function() {
    if (!this.loaded){
      console.log('Data not yet loaded');
      return;
    }
    
    //Draws the heatmap title
    drawTitle(this.layout);
    
    //Draw heatmap cells
    fill(255,255,255,100);
    noStroke();
    for (var i = 0; i < this.data.getRowCount(); i++){
      for (var j = 1; j < this.data.getColumnCount(); j++){
        
        //Stores the target row as an array
        var targetValues = this.data.findRow('TARGET', 0).arr;
        
        //Stores given category's max value and the target
        var aboveTargMax = max(this.data.getColumn(j));
        var belowTargMin = min(this.data.getColumn(j));
        
        //Calls function to set the different gradients
        this.setGradient(this.data.get(i,j), belowTargMin, targetValues[j], aboveTargMax);
        
        //draw cells
        rect((this.cell.xStart) + (this.cell.width * (j-1)), 
            this.cell.yStart + (this.cell.height * i), 
            this.cell.width, this.cell.height);
        fill(0,255,0,0);
      }    
    }

    //Draws the data and categories    
    this.drawText(this.data);
    
    //Draws the Legend
    this.drawLegend();

  };

  this.drawLegend = function(){

    legend = []
    
    // fill legend array - 1 incrementing up until it matches the number of columns in the table
    for (var i = 1; i < this.data.getColumnCount(); i ++){
      legend.push(i);
    }

    //set legend gradient and draw
    for (var i = 0; i < legend.length; i++){
      
      p = min(legend);
      q = max(legend);
      legendMedian = ((p+q)/2)
      
      this.setGradient(legend[i],p,legendMedian,q);

      //draw legend
      noStroke(0);
      rect(this.cell.xStart + this.cell.width * i, 
        (this.cell.yStart + this.layout.pad + this.cell.height * this.data.getRowCount()), 
        this.cell.width, 
        this.cell.height);
      
      stroke(1);
      noFill();
      
      rect(this.cell.xStart,
        (this.cell.yStart + this.layout.pad + this.cell.height * this.data.getRowCount()),
        this.cell.width * legend.length, this.cell.height);
      
      text('BELOW TARGET',
        this.cell.xStart + this.cell.width/2 + this.layout.pad, 
        this.cell.yStart + this.layout.pad + (this.cell.height/2) + this.cell.height * this.data.getRowCount());

      text('ON TARGET',
        this.cell.xStart + this.cell.width/2 + this.cell.width * legendMedian - this.cell.width, 
        this.cell.yStart + this.layout.pad + (this.cell.height/2) + this.cell.height * this.data.getRowCount());

      text('ABOVE TARGET',
        this.layout.rightMargin - marginSize * 2 - this.layout.pad, 
        this.cell.yStart + this.layout.pad + (this.cell.height/2) + this.cell.height * this.data.getRowCount());   
    }
  };


  //Sets a gradient for values above target (green) and below target (red)
  this.setGradient = function(valueToMap, min, target, max) {
    
    //Green if value is above target
    if(valueToMap >= target){

      //Remaps max and min values above target to 0 - 255
      aboveGradient = map(valueToMap, 
                target, max, 
                0, 255);

      return(fill(0,255,0,aboveGradient));
    }
    //if given value is lower than target
    else if(valueToMap < target){
      fill(255,0,0,255);
      
      //Remaps max and min values below target to 0 - 255
      belowGradient = map(valueToMap, 
                min, target, 
                255, 0);

      return(fill(255,0,0,belowGradient));
    }
  };

  this.drawText = function(table) {

    stroke(1);

    //iterate over rows and columns to draw data
    for (var i = 0; i < table.getRowCount(); i ++){
      for (var j = 0; j < table.getColumnCount(); j++){
        fill(0);
        text(table.get(i,j), 
          ((this.cell.xStart - this.cell.width / 2) + j * this.cell.width),
          ((this.cell.yStart + this.cell.height / 2) + i * this.cell.height))
      }
    }

    var categories = table.columns;
    //draws category labels
    for (let i = 0; i < categories.length; i++) {
      text(categories[i], ((this.cell.xStart - this.cell.width / 2) + i * this.cell.width),
        (this.cell.yStart - this.cell.height / 2));
      }

  };
}