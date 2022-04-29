(function() { //what is this for?
  function LoaderProxy(width,height,frameTime) {
    return {
      draw: $.noop,
      fill: $.noop,
      frame: $.noop,
      update: $.noop,
      width: width,
      height: height,
	  frameTime: frameTime
    };
  }
  
  function Sprite(image, sourceX, sourceY, width, height,frameTime) {
    sourceX = sourceX || 0; //where to start drawing from in the image
    sourceY = sourceY || 0;
    width = width || image.width; //the block of the image to draw
    height = height || image.height;
	frameTime = frameTime || 150;
	var frameCount = image.width / width; //if more than one frame, we need to animate
	var frameElapsed = 0;
	var currentFrame = 0;
    
    return {
	  flipmode: false,
	  frameCount: frameCount,
	  width: width,
	  height: height,
      draw: function(x, y) { //draw a block (or all) of the image, first w/h are the block to get, 2nd w/h is the space to draw
		var finalY = sourceY;
		if (this.flipmode)
		{
			finalY = sourceY + height;
		}
        canvas.drawImage(
          image,
          sourceX + (currentFrame*width),
          finalY,
          width,
          height,
          x,
          y,
          width,
          height
        );
      },
      
      fill: function(canvas, x, y, width, height, repeat) { //tile the image over an area
        repeat = repeat || "repeat";
        var pattern = canvas.createPattern(image, repeat);
        canvas.fillColor(pattern);
        canvas.fillRect(x, y, width, height);
      },
	  update: function(delta) {
		if (!this.preventAnimation)
		{
			frameElapsed += delta;
			if (frameElapsed > frameTime)
			{
				currentFrame++;
				frameElapsed = 0;
				if (currentFrame > frameCount-1) currentFrame = 0;
			}
		}
	  }
    };
  };
  
  Sprite.load = function(url,width, height, frameTime,loadedCallback) {
    var img = new Image();
    var proxy = LoaderProxy(width,height,frameTime);
    
    img.onload = function() {
      var tile = Sprite(this,null,null,width,height,frameTime);
      
      $.extend(proxy, tile);
      
      if(loadedCallback) {
        loadedCallback(proxy);
      }
    };
    
    img.src = url;
    
    return proxy;
  };
 
  var spriteImagePath = "images/";

  window.Sprite = function(name,width,height,frameTime,callback) {
    return Sprite.load(spriteImagePath + name + ".png",width,height,frameTime,callback);
  };
  window.Sprite.EMPTY = LoaderProxy();
  window.Sprite.load = Sprite.load;
}());
