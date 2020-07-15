// --------------------------------------------------------------------
// Data processing helper functions.
// --------------------------------------------------------------------
function sum(data) {
  var total = 0;

  // Ensure that data contains numbers and not strings.
  data = stringsToNumbers(data);

  for (let i = 0; i < data.length; i++) {
    total = total + data[i];
  }

  return total;
}

function mean(data) {
  var total = sum(data);

  return total / data.length;
}

function sliceRowNumbers (row, start=0, end) {
  var rowData = [];

  if (!end) {
    // Parse all values until the end of the row.
    end = row.arr.length;
  }

  for (i = start; i < end; i++) {
    rowData.push(row.getNum(i));
  }

  return rowData;
}

//find minimum value in the entire table, excluding the first column
function findTableMin (data) {
  var minA = min(data.getColumn(1));
  for(var i = 2; i < data.getColumnCount(); i++){
    //find min in given column
    var minB = min(data.getColumn(i));
    //save to table minimum if column minimum is lower
    if(minB < minA){
      minA = minB;
    }
  }
  return minA;
}

//find the maximum value in the entire table, excluding the first column
this.findTableMax = function (data) {
  var maxA = max(data.getColumn(1));
  for(var i = 2; i < data.getColumnCount(); i++){
    //find max in given column
    var maxB = max(data.getColumn(i));
    //save to table maximum if column maximum is higher
    if(maxB > maxA){
        maxA = maxB;
    }
  }
  return maxA;
}

// --------------------------------------------------------------------
// Formatting helper functions
// --------------------------------------------------------------------
//rounds to 1 dp and adds a % sign
function convertDecToPer (decimal) {
  return Math.round(decimal * 10)/10 + "%"
}

function stringsToNumbers (array) {
  return array.map(Number);
}

// --------------------------------------------------------------------
// Dom manipulation helper functions
// --------------------------------------------------------------------
function makeDataSourceEle(name, link) {
  //create P element
  var dlSection = document.createElement('P');
  dlSection.id = "download-section"
  dlSection.innerHTML = "Download this data source: ";
  document.getElementById("info-container").appendChild(dlSection);
  
  //create a element with link
  var dlLink = document.createElement('a'); //create a
  dlLink.href = link; //define link location
  dlLink.innerHTML = name; //define inner text
  dlSection.appendChild(dlLink); //append to P

  return dlSection
}

// --------------------------------------------------------------------
// Plotting helper functions
// --------------------------------------------------------------------

function drawTitle(layout){
  //Enlarges text size for title
  textSize(layout.textSize * 1.25);
  fill(0);
  noStroke();
  textAlign('center', 'center');

  text(layout.title, (plotWidth(layout) / 2) + layout.leftMargin,
      layout.topMargin - (layout.marginSize / 2));

  //Resets text to default size
  textSize(layout.textSize);
}

plotWidth = function(layout){
  return layout.rightMargin - layout.leftMargin;    
};

plotHeight = function(){
  return layout.bottomMargin - layout.topMargin;    
};

function drawAxis(layout, colour=0) {
  stroke(color(colour));

  // x-axis
  line(layout.leftMargin,
       layout.bottomMargin,
       layout.rightMargin,
       layout.bottomMargin);

  // y-axis
  line(layout.leftMargin,
       layout.topMargin,
       layout.leftMargin,
       layout.bottomMargin);
}

function drawAxisLabels(xLabel, yLabel, layout) {
  fill(0);
  noStroke();
  textAlign('center', 'center');

  // Draw x-axis label.
  text(xLabel,
       (plotWidth(layout) / 2) + layout.leftMargin,
       layout.bottomMargin + (layout.marginSize * 1.5));

  // Draw y-axis label.
  push();
  translate(layout.leftMargin - (layout.marginSize * 1.5),
            layout.bottomMargin / 2);
  rotate(- PI / 2);
  text(yLabel, 0, 0);
  pop();
}

function drawYAxisTickLabels(min, max, layout, mapFunction,
                             decimalPlaces) {
  // Map function must be passed with .bind(this).
  var range = max - min;
  var yTickStep = range / layout.numYTickLabels;

  fill(0);
  noStroke();
  textAlign('right', 'center');

  // Draw all axis tick labels and grid lines.
  for (i = 0; i <= layout.numYTickLabels; i++) {
    var value = min + (i * yTickStep);
    var y = mapFunction(value);

    // Add tick label.
    text(value.toFixed(decimalPlaces),
         layout.leftMargin - layout.pad,
         y);

    if (layout.grid) {
      // Add grid line.
      stroke(200);
      line(layout.leftMargin, y, layout.rightMargin, y);
    }
  }
}

function drawXAxisTickLabel(value, layout, mapFunction) {
  // Map function must be passed with .bind(this).
  var x = mapFunction(value);

  fill(0);
  noStroke();
  textAlign('center', 'center');

  // Add tick label.m
  text(value,
       x,
       layout.bottomMargin + layout.marginSize / 2);

  if (layout.grid) {
    // Add grid line.
    stroke(220);
    line(x,
         layout.topMargin,
         x,
         layout.bottomMargin);
  }
}
