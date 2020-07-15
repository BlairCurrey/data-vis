function LineGraphRace() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Line Graph Race';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'line-graph-race';

  var marginSize = 35;

  this.layout = {  
    //Sets default margin size, title, and defaul font size
    marginSize: marginSize,
    title: "Population of Major US Cities over Time",
    textSize: 14,

    //sets position of chart
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize,
    bottomMargin: height - marginSize * 2,
    pad: 5,

    // Boolean to enable/disable background grid
    grid: true,

    //number of axis labels to draw (controls crowding of labels)
    numXTickLabels: 20,
    numYTickLabels: 8,
  };
 
  //Name for each axis
  this.xAxisLabel = 'Year';
  this.yAxisLabel = 'Population (Millions)';

  //Property to represent whether data has been loaded.
  this.loaded = false;

  //Dom element details
  this.domXPos = 325

  //Set the drawing speed
  this.speed = {
    min: 10, //higher is slower
    max: 50,   //lower is faster
    start: this.min + this.max / 2
  }

  //Create data objects
  this.dataPool = [
      
    {name: "US City Population",
    table: loadTable('/data/line-graph-race/us-city-pop.csv', 'csv', 'header'),
    active: false,
    title: "Population of Major US Cities Over Time",
    xLabel: "Year",
    yLabel: "Population (Millions)"
    },

    {name: "Hours Per Class", 
    table: loadTable('/data/line-graph-race/times.csv', 'csv', 'header'),
    active: false,
    title: "Hours Spent on Each Class Over Time",
    xLabel: "Weeks",
    yLabel: "Hours"
    },

    {name: "Grocery Prices, US Avg", 
    table: loadTable('/data/line-graph-race/grocery-cost.csv', 'csv', 'header'),
    active: false,
    title: "Cost of Groceries in Average US City Over Time",
    xLabel: "Year",
    yLabel: "Cost in USD"
    }
  ]

  // Preload the first data set. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      '/data/line-graph-race/us-city-pop.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });
  };

  this.setup = function() {

    //Create Dom element for data download
    this.dataDL = makeDataSourceEle(this.name, "/data/line-graph-race/source/line-combined.xlsx");
    
    //set a random color
    this.randColor = this.getRandColor(20);

    //Create slider to control speed
    this.slider = createSlider(this.speed.min, this.speed.max, this.speed.start, 1);
    this.slider.position(this.domXPos, height)

    //Create a select DOM element
    this.select = createSelect();
    this.select.position(this.domXPos, 15);

    //Fill select element with data options
    for (let i = 0; i < this.dataPool.length; i++){
        this.select.option(this.dataPool[i].name)
    }

  };

  this.destroy = function() {
    //resets graph when switching from this visualization
    for(let i = 0; i < this.dataPool.length; i++){
      this.dataPool[i].active = false;
    }
    //removes select DOM element when switching from this visualization
    this.select.remove();
    this.slider.remove();
    this.dataDL.remove();
  };

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    //Draw text instructions above slider
    // stroke(0);
    push();
    fill(0)
    noStroke();
    textSize(12);
    text("Next Graph Speed", 80, height - 20);
    textSize(18);
    pop();

    //Detects which dataset is selected
    for(let i = 0; i < this.dataPool.length; i++){  
      if(this.select.value() == this.dataPool[i].name && this.dataPool[i].active == false){

        //Sets layout according to data selected
          this.data = this.dataPool[i]
          this.layout.title = this.dataPool[i].title
          this.dataPool[i].active = true;
          this.dataProcess(this.data.table)
      }
      else if(this.select.value() != this.dataPool[i].name && this.dataPool[i].active == true){
        this.dataPool[i].active = false;
      }
    }

    //Draw title
    drawTitle(this.layout);

    //Draw Y axis labels
    drawYAxisTickLabels(this.minY, 
                    this.maxY, 
                    this.layout, 
                    this.mapCatToHeight.bind(this), 
                    1);

    //Draw x and y axis
    drawAxis(this.layout);

    //Draw x and y axis labels
    drawAxisLabels(this.data.xLabel,
                   this.data.yLabel,
                   this.layout);

    //Draw x axis labels
    var previous;
    var range = this.data.table.getRowCount();

    for(var i = 0; i < this.data.table.getRowCount(); i ++){
        var current = this.data.table.getNum(i, 0);

        if(previous != null) {
            var xlabelSkip = ceil(range / this.layout.numXTickLabels);

            if (i % xlabelSkip == 0) {
                drawXAxisTickLabel(previous, this.layout, 
                                   this.mapCatToWidth.bind(this));
            }
        }
        previous = current;
    }

    //draw each line from their respective arr of line segments
    for(var i = 0; i < this.groupSegments.length; i++){
        this.drawLine(this.groupSegments[i]);
    }
  };

  //Process a given data set
  this.dataProcess = function(dataSet) {
    this.startX = dataSet.getNum(0, 0);
    this.endX = dataSet.getNum(dataSet.getRowCount() - 1, 0);
    // this.minY = this.tableMin(dataSet);
    this.minY = findTableMin(dataSet);
    // this.maxY = this.tableMax(dataSet);
    this.maxY = findTableMax(dataSet);
    this.groupSegments = this.makeSegmentsArr(dataSet);
  }

  //draw a complete line from a series of segments
  this.drawLine = function (lineArr) {
    for(var i = 0; i < lineArr.length; i ++){

      var zeroMapped = this.mapCatToHeight(0);

      //draw the first line segment
      if(i == 0){
          lineArr[i].checkActive(zeroMapped);
          lineArr[i].draw();
          lineArr[i].updatePos();
      }

      //for the remaining line segments, check if the previous segment is complete before drawing
      if(i > 0){
          if(lineArr[i-1].complete == true){
              lineArr[i].checkActive(zeroMapped);
              lineArr[i].draw();
              lineArr[i].updatePos();
          }
      }
      
      //detect if the current segment is the last segment
      if(i == lineArr.length - 1){
          lineArr[i].lastSegment = true;
      }
    }
  }

  //get an array of the categories (excluding the first column)
  this.makeSegmentsArr = function (dataSet) {
    let categoryArr = [];
    let groupCoordsArr = [];
    let groupSegmentArr = [];

    for(let i = 1; i < dataSet.getColumnCount(); i ++){
      categoryArr.push(dataSet.columns[i]);
    }
    for(let i = 0; i < categoryArr.length; i++){
      groupCoordsArr.push(this.makeCoords(categoryArr[i], dataSet));
    }
    for(let i = 0; i < groupCoordsArr.length; i ++){
        //create a new array inside arr for each category
        groupSegmentArr.push([]);

        for(let j = 0; j < groupCoordsArr[i].length - 1; j++){
            //make line segment objects in each category array
            groupSegmentArr[i].push(new LineSegment(groupCoordsArr[i][j], groupCoordsArr[i][j+1], this.slider.value()));
        }
    }
    return(groupSegmentArr);
  }

  //get coordinates for a given category
  this.makeCoords = function (category, dataSet) {
    var coords = [];
    var randColor = color(random(200),random(200),random(200), 150)
    for(var i=0; i < dataSet.getRowCount(); i ++){
        coords.push({name: category, 
                    color: randColor,
                    x: this.mapCatToWidth(dataSet.getNum(i, 0)), 
                    y: this.mapCatToHeight(dataSet.getNum(i,category))});
    }
    return(coords)
  }

  //get random color
  this.getRandColor = function (value) {
      return(color(random(255 - value),random(255 - value),random(255 - value)));
  }

  this.mapCatToWidth = function(value) {
      return map(value,
                this.startX,
                this.endX,
                this.layout.leftMargin,
                this.layout.rightMargin);
  }
  
  this.mapCatToHeight = function(value) {
    return map(value,
               this.minY,
               this.maxY * 1.1,
               this.layout.bottomMargin,  //lower values at bottom
               this.layout.topMargin);    //higher values at the top
  };
}