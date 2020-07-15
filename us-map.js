function USMap(){

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Housing vs. Income by State (US)';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'us-map';

  // location of data file to DL
  this.dataLoc = './data/us-map/housing-vs-income.csv'

  //element holding svg
  this.svgContainer = document.getElementById('svg-container')

  //settings related to the range of the graph - defined initially
  this.graph = {
  min: null,
  max: null,
  minNew: 50,
  maxNew: 225
  }

  //Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the first data set. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
    this.dataLoc, 'csv', 'header',
    // Callback function to set the value
    // this.loaded to true.
    function(table) {
      self.loaded = true;
    });
  };

  this.setup = function() {

    //Create Dom element for data download
    this.dataDL = makeDataSourceEle(this.name, this.dataLoc);

    //get the path elements for all the states
    var elements = Array.from(document.querySelectorAll('svg g path'));

    //Get an array of mapped values
    var mappedArray = this.mapValues(this.data);

    for(var i = 1; i < this.data.getColumnCount(); i++){
      
      //debugging step to check if states data matches 
      //the state ID's from elements. path ID's must match
      if(this.data.columns[i] != elements[i-1].id){
        console.log("array: " + this.data.columns[i] + " elements: " + elements[i-1].id)
      }

      //checks if event listener exists and if not,
      //adds them to each state and bind the showData function to them
      if(!elements[i-1].hasAttribute("click-event")) {
        elements[i-1].setAttribute("click-event", true);
        elements[i-1].addEventListener('click', this.showData.bind(null, this.data.columns[i], this.data.get(0,i)), false);
      }
    }

    //set element holding svg to visible
    this.svgContainer.style.visibility = 'visible';
    
    //Change the CSS for each state according to the mapped values
    this.changeCSS(mappedArray);
  
  };

  this.destroy = function() {

    //set element holding svg to hidden
    this.svgContainer.style.visibility = 'hidden';
    this.dataDL.remove();

  };

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    //draw title and legend
    this.drawLegend();
    this.drawTitle();
  };

  this.mapValues = function(data) {
    //initaliazed empty array to store mapped values in
    var mappedArr = [];
    
    // //find min and max values
    this.graph.min = findTableMin(data);
    this.graph.max = findTableMax(data);

    //new range - reverse so high is bright and low is dark
    this.graph.minNew = 255;
    this.graph.maxNew = 0;


    for(var i = 1; i < data.getColumnCount(); i++){
      //get data value and remove '%' from string and convert to number
      var dataValue = data.get(0,i)

      //remap each value according to the table min/max and the new range defined above
      var mappedValue = map(dataValue, this.graph.min, this.graph.max, this.graph.minNew, this.graph.maxNew);

      //push an object with state and value properties into the mapped array
      mappedArr.push({state: data.columns[i], value: mappedValue});
    }

    return mappedArr
  }

  this.changeCSS = function(mappedArr) {
    
    for(var i = 0; i < mappedArr.length; i++){
      
      //get state element
      var stateElement = document.getElementById(mappedArr[i].state);
      // var stateClassElements = document.getElementByClass('state');
      
      //change the style for that state element according to it's mapped value
      stateElement.style.fill = "rgb(0,"+ mappedArr[i].value +",0)" //green
    }
  }

  this.showData = function (state, value) {
    //transform the value to a percentage rounded to 1 dp and add % sign
    valueRounded = convertDecToPer(value * 100);
    alert("State: " + state + "\n" + "Value: " + valueRounded + "\n" + "In " + state + " the median mortgage payment is " + valueRounded + " of the median household income")
  }

  this.drawLegend = function () {

    //Set colors
    var c1 = color(0, this.graph.maxNew, 0);
    var c2 = color(0, this.graph.minNew, 0);

    //Set height, width, position
    var legHeight = 200;
    var legWidth = 50;
    var xPosStart = width - 50;
    var yPos = height - height/6;

    //save current state before changing stroke/fill
    push();
    noStroke();
    //Draw the gradient bar
    for(var i = 0; i < legHeight; i ++){
      stroke(lerpColor(c1, c2, i/legHeight));
      line(xPosStart, yPos - i, xPosStart + legWidth, yPos - i);
    }
    //Add text
    noStroke();
    fill(0);
    textAlign(CENTER, BOTTOM);
    textSize(20);
    //top
    text(this.graph.min * 100, xPosStart + legWidth/2, yPos - legHeight);
    //bottom
    textAlign(CENTER, CENTER);
    text(this.graph.max * 100, xPosStart + legWidth/2, yPos + textSize());
    //side
    textAlign(CENTER, BOTTOM);
    translate(xPosStart - legWidth/10, yPos - legHeight/2);
    rotate(3*PI/2);
    text("Median %", 0, 0);
    //revert to saved state
    pop();
  }

  this.drawTitle = function () {
    //save current state
    push();
    noStroke();
    fill(0);
    textAlign(CENTER);
    textSize(25);
    text("Median Mortgage payment as Percentage of Income", width/1.75, textSize());
    //revert to saved state
    pop();
  }
}