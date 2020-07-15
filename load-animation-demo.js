function LoadDemo(){

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Load Animation Demo';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'load-demo';

  //Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the first data set. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
  };

  this.setup = function() {
    //create new SinWave object
    this.sinWave = new SinWave();
  };

  this.destroy = function() {
  };

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      //draw/update sinwave while data is loading
    this.sinWave.draw();
    this.sinWave.update();
    return
    }
  };
}