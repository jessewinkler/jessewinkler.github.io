function addHexColor(c1, c2) {
  var hexStr = (parseInt(c1, 16) + parseInt(c2, 16)).toString(16);
  while (hexStr.length < 6) { hexStr = '0' + hexStr; } // Zero pad.
  return hexStr;
}
function StaticImage(name,x,y,width,height,collides)
{
	var me = {};
	me.x = x || 0;
	me.y = y || 0;
	me.image = Sprite(name);
	me.width = width;
	me.height = height;
	me.collides = collides;
	me.update = function(delta){return true;};
	me.draw = function()
	{
		this.image.draw(this.x,this.y)
		/*canvas.fillStyle = "blue";
		canvas.globalAlpha = 0.5;
		canvas.fillRect(this.x,this.y,this.width,this.height);
		canvas.globalAlpha = 1.0;*/
		if (this.hovered)
		{
			canvas.fillStyle = "white";
			canvas.globalAlpha = 0.5;
			canvas.fillRect(this.x,this.y,this.width,this.height);
			canvas.globalAlpha = 1.0;
		}
	};
	return me;
}
function Text(value,x,y,color,font,alpha)
{
	x = x || 0;
	y = y || 0;
	color = color || "FFFFFF";
	if (!color.startsWith("#"))
	{
		color = "#" + color;
	}
	value = value || "<default text>";
	font = font || DEFAULT_FONT;
	alpha = alpha || 1;
	var delta = 1;
	return {
		update: function(delta){
				return true;
			},
		draw: function() {
			canvas.globalAlpha = alpha;
			canvas.fillStyle = color;
			canvas.font = font;			
			canvas.fillText(this.value,x,y);
			},
		x: x,
		y: y,
		color: color,
		font : font,
		value : value,
		delta : delta
	};
}
function UIText(value,x,y,color,onclick) //assumes the default font of 14pt consolas to calculate click/hover area
{
	hovered = false;
	var me = {};
	me.width = value.length * 10;
	me.height = 12;
	me.x = x;
	me.y = y;
	me.hovered = false;
	me.color = color;
	me.value = value;
	me.onclick = onclick;
	me.update = function(delta){
				return true;
			};
	me.draw = function() {
			canvas.fillStyle = "#555555";
			canvas.fillRect(this.x,this.y-this.height,this.width,this.height);
			canvas.fillStyle = "#" + this.color;	
			if(this.hovered) 
			{
				canvas.fillStyle = "#FFFFFF";
				}
			canvas.font = DEFAULT_FONT;
			canvas.fillText(value,x,y);
		};
	return me;
}
function QueueBox(x,y,name,quantityArray)
{
	var me = {};
	me.x = x;
	me.y = y;
	me.name = name;
	me.quantity = quantityArray[0];
	me.quantityArray = quantityArray;
	me.max = 1000000;
	me.width = 100;
	me.height = 100;
	me.borderWidth = 2;
	me.fillAlpha = 0.5;
	me.fillColor = "#FF0000";
	me.alphaStep = 0.005;
	me.quantityStep = 0;
	me.quantityIndex = 0;
	me.ratio = Math.floor(this.quantity / this.max * (this.height - this.borderWidth*2));;
	me.update = function(delta){
		this.fillAlpha += this.alphaStep;
		this.quantityStep += 1;
		if (this.fillAlpha >= 0.9){
			this.alphaStep = -0.005;
		}
		if (this.fillAlpha <= 0.5){
			this.alphaStep = 0.005;
		}
		if (this.quantityStep > 10){
			this.quantityStep = 0;
			this.quantityIndex++;
			if (this.quantityIndex >= this.quantityArray.length)
			{
				this.quantityIndex = 0;
			}
			this.quantity = this.quantityArray[this.quantityIndex];
			this.ratio = Math.floor(this.quantity / this.max * (this.height - this.borderWidth*2));
			//determine the fill color
			var percent = Math.floor(this.quantity / this.max * 100);
			var r = "00";
			var g = "ff";
			var b = "70";
			if (percent < 14){
				b = (112 - percent * 5).toString(16);
			}
			if (percent > 14){
				var total = percent * 5 - 70;
				b = "00";
				if (total <= 255){
					r = total.toString(16);
				}
				if (total >255){
					r = "ff";
					g = (255-(total - 255)).toString(16);
				}
			}
			if (r.length < 2) { r = "0" + r; }
			if (g.length < 2) { g = "0" + g; }
			if (b.length < 2) { b = "0" + b; }
			me.fillColor = "#" + r + g + b;
		}
		
		return true;
	};
	me.draw = function () {
		canvas.fillStyle = "#C0C0C0";
		canvas.fillRect(this.x,this.y,this.width,this.height);
		canvas.fillStyle = "#000000";
		canvas.fillRect(this.x+this.borderWidth, this.y+this.borderWidth, this.width - (this.borderWidth*2),this.height  - (this.borderWidth*2));
		if (this.quantity > this.max) {
			this.quantity = this.max;
		}
		if (this.quantity < 0)
		{
			this.quantity = 0;
		}
		canvas.fillStyle = this.fillColor;
		canvas.globalAlpha = this.fillAlpha;
		canvas.fillRect(this.x + this.borderWidth, this.y+this.height-this.borderWidth-this.ratio, this.width - (this.borderWidth*2), this.ratio);
		canvas.globalAlpha = 1;
		canvas.font = DEFAULT_FONT;
		canvas.fillText(name,x,y);
	}
	return me;
}
function Orb(x,y,xvel,yvel,diameter,color,alpha)
{
	x = x || 10;
	y = y || 10;
	xvel = xvel || 1;
	yvel = yvel || 1;
	diameter = diameter || 10;
	color = color || "FFFFFF";
	alpha = alpha || 1;
	var delta = 1;
	return {
		x: x,
		y: y,
		xvel: xvel,
		yvel: yvel,
		color: color,
		diameter : diameter,
		alpha : alpha,
		delta : delta,
		addVal : "010101",
		update: function(delta){
			x=x+delta*xvel;
			y=y+delta*yvel;
			if (x > CANVAS_WIDTH + diameter || 
			    y > CANVAS_HEIGHT + diameter ||
				x < 0 - diameter ||
				y < 0 - diameter)
			{
				return false; //let caller know I can be destroyed
			}
			var check = color.toUpperCase().split("");
			if ((check[0]=="F" && check[1]=="F") ||
				(check[2]=="F" && check[3]=="F") ||
				(check[4]=="F" && check[5]=="F"))
				{ 
				this.addVal="-010101";
				}
			else if((check[0]=="0" && check[1]=="0") ||
				(check[2]=="0" && check[3]=="0") ||
				(check[4]=="0" && check[5]=="0"))
				{
				this.addVal="010101";
				}
			color=addHexColor(color,this.addVal);
			return true;
			},
		draw: function() {
			canvas.fillStyle = "#" + color;
			canvas.globalAlpha = alpha;
			canvas.beginPath();
			canvas.arc(x,y,diameter,0,2*Math.PI);
			canvas.fill();
			canvas.globalAlpha = 1;
			}
	};
}
function TitleOrb()
{
	return new Orb(Math.floor(Math.random()*CANVAS_WIDTH),
							Math.floor(Math.random()*CANVAS_HEIGHT),
							Math.random()*.1 - .05,
							Math.random()*.1 - .05,
							Math.floor(Math.random()*30),
							"" + Math.floor(Math.random()*9) + "0" + Math.floor(Math.random()*9) + "0" + Math.floor(Math.random()*9) + "0",
							Math.random()*0.7);
}
function Star()
{
	return new Orb(			Math.floor(Math.random()*CANVAS_WIDTH),
							Math.floor(Math.random()*CANVAS_HEIGHT),
							Math.random()*.01 - .005,
							Math.random()*.01 - .005,
							1,
							"" + Math.floor(Math.random()*9) + "0" + Math.floor(Math.random()*9) + "0" + Math.floor(Math.random()*9) + "0",
							Math.random()*0.7,
							true);
}
function DamageArea(spritename,x,y,width,height,frameTime,oneCycle)
{
	var me = {};
	me.sprite = Sprite(spritename,width,height,frameTime);
	me.x = x;
	me.y = y;
	me.width = width;
	me.height = height;
	me.oneCycle = oneCycle;
	me.lifetime = 0;
	me.update = function(delta)
	{
		this.lifetime += delta;
		if (this.oneCycle && this.lifetime > frameTime * this.sprite.frameCount) return false;
		this.sprite.update(delta);
		return true;
	};
	me.draw = function()
	{
		this.sprite.draw(x,y);
	};
	return me;
}

function StarBase(name, x, y, unit, color, maxBases, baseComplete)
{
	var me = {};
	me.name = name;
	me.x = x;
	me.y = y;
	me.font = DEFAULT_FONT;
	me.unit = unit || 1; //draw size
	me.lifetime = 0; //how long it has existed
	me.alpha = 1.0; //transparency
	me.color = color;
	me.baseTimer = 0; //counting up to build next base
	me.builtBases = 0; //how many bases have I built
	me.maxBases = maxBases || 4;
	me.baseComplete = baseComplete || 2000; //how high to count to build a base
	me.maxLifetime = me.maxBases * me.baseComplete + 2000; //how long base lives
	me.myBases = [];
	me.update = function(delta)
	{
		this.lifetime += delta;
		this.unit = 2 * this.lifetime;
		if (this.unit > this.maxLifetime) //make draw unit peak at mid-life
			this.unit -= 4*(this.lifetime - this.maxLifetime/2)
		this.unit /= 1200;
		if (this.unit < 1) this.unit = 1;
		if (this.builtBases < this.maxBases)
			this.baseTimer += delta;
		if (this.baseTimer > this.baseComplete)
		{
			//randomize placement of next base within a distance of current base
			var maxdist = 40;
			var newx = Math.random()*maxdist+10;
			if (Math.random() > 0.5) newx = -newx;
			var newy = Math.random()*maxdist+10;
			if (Math.random() > 0.5) newy = -newy;
			newx = this.x+newx;
			newy = this.y+newy; 
			// todo bound coords within CANVAS_WIDTH, CANVAS_HEIGHT
			// todo bound coords to prevent overlap or too high density?
			var newBase = new StarBase(this.name + "a", newx, newy, this.unit, this.color, Math.random()*3, Math.random()*4000+1000);
			//alert(this.name + " builds " + newBase.name);
			UpdateList.push(newBase);
			this.myBases.push(newBase);
			this.baseTimer = 0;
			this.builtBases++;
		}
		if (this.lifetime > this.maxLifetime) return false; //base is destroyed due to age
		return true;
	}
	me.draw = function()
	{
		canvas.fillStyle = this.color;
		canvas.globalAlpha = this.alpha;
		canvas.lineWidth = 1;
		canvas.strokeStyle = this.color;

		for (let i = 0; i < this.myBases.length; i++)
		{
			canvas.beginPath();
			canvas.moveTo(this.x, this.y);
			canvas.lineTo(this.myBases[i].x, this.myBases[i].y);
			canvas.stroke();
		}
		
		//rectangle base
		//canvas.fillRect(this.x, this.y, this.unit, this.unit);
		//circle base
		canvas.beginPath();
		canvas.arc(this.x, this.y, 1, 0, 2 * Math.PI, false);
		canvas.fill();
		canvas.globalAlpha = 0.7;
		canvas.beginPath();
		canvas.arc(this.x, this.y, this.unit, 0, 2 * Math.PI, false);
		canvas.fill();
		//canvas.lineWidth = 5; //use this to draw a border on the circle.
		//canvas.strokeStyle = '#003300';
		//canvas.stroke();
		
		//put any labels out for this base:
		//var t = new Text(this.maxLifetime,this.x,this.y,"#FF0000",this.font,this.alpha);
		//t.draw();
	}
	return me;
}

function MapRegion(name, x, y, width, height, color, textColor, alpha, font)
{
	var me = {};
	me.name = name;
	me.x = x;
	me.y = y;
	me.width = width;
	me.height = height;
	me.color = color;
	me.textColor = textColor;
	me.alpha = alpha;
	me.font = font || DEFAULT_FONT;
	me.Text = Text(name,x + 4,y + (.5 * height),textColor,font,alpha);
	me.hoverAlpha = 0.5;
	me.hoverAlphaStep = 0.05;
	me.deleted = false;
	me.update = function(delta)
	{
		if (this.deleted){
			return false;
		}
		return true;
		
	}
	me.draw = function()
	{
		canvas.fillStyle = this.color;
		canvas.globalAlpha = this.alpha;
		if (this.hovered)
		{
			this.hoverAlpha +=  this.hoverAlphaStep;
			if (this.hoverAlpha >= 1)
			{
				this.hoverAlphaStep = -0.05;
			}
			if (this.hoverAlpha <= 0.5)
			{
				this.hoverAlphaStep = 0.05;
			}
			canvas.globalAlpha = this.hoverAlpha;
		}
		
		canvas.fillRect(this.x, this.y, this.width, this.height);
		this.Text.draw();
	}
	me.onclick = function()
	{
		this.hoverFollow = !this.hoverFollow;
		Player.lockHovered = !Player.lockHovered;
	}
	me.cursorUpdate = function(x,y)
	{
		if (this.hoverFollow)
		{
			this.x = x;
			this.y = y;
			this.Text = Text(this.name,x + 4,y + (.5 * this.height),this.textColor,this.font,this.alpha);
		}
	}
	me.updateName = function (letter)
	{
		if (!letter)
		{
			this.name = this.name.slice(0,-1);
			this.Text = Text(this.name,this.x + 4,this.y + (.5 * this.height),this.textColor,this.font,this.alpha);
		}
		else
		{
			this.name = this.name + letter;
			this.Text = Text(this.name,this.x + 4,this.y + (.5 * this.height),this.textColor,this.font,this.alpha);
		}
	}
	me.resize = function (command)
	{
		switch(command)
		{
			case 37: //left arrow
				this.width--;
				break;
			case 38: //up arrow
				this.height--;
				break;
			case 39: //right arrow
				this.width++;
				break;
			case 40: //down arrow
				this.height++;
				break;
		}
	}
	me.serialize = function ()
	{
		return this.name + "," +
			this.x + "," +
			this.y + "," +
			this.width + "," +
			this.height + "," +
			this.color + "," +
			this.textColor + "," +
			this.alpha + "," +
			this.font + ";";
			
	}
	me.randomizeColor = function ()
	{
		this.color = "#" + Math.floor(Math.random()*9) + "0" + Math.floor(Math.random()*9) + "0" + Math.floor(Math.random()*9) + "0";
	}
	return me;
}
function InvaderWord(x,y,xvel,yvel,color,alpha,contents)
{
	var me = {};
	me.contents = contents;
	me.x = x;
	me.y = y;
	me.xvel = xvel;
	me.yvel = yvel;
	me.color = color;
	me.alpha = alpha;
	me.font = DEFAULT_FONT; //font || DEFAULT_FONT;
	me.letters = [];
	for(i = 0; i < contents.length; i++)
	{
		var glyph = contents[i];
		var il = new InvaderLetter(x+i*12,y,xvel,yvel,color,alpha,glyph)
		me.letters.push(il);
	}
	me.nextLetter = me.letters[0];
	me.letterIndex = 0;
	me.deleted = false;
	me.completed = false;
	me.inProgress = false;
	me.moveNextLetter = function()
	{
		this.inProgress = true;
		this.nextLetter.hovered = true;
		this.letterIndex++;
		if (this.letterIndex >= this.letters.length)
		{
			this.completed = true;
			this.nextLetter = {};
			return;
		}
		this.nextLetter = this.letters[this.letterIndex];
	}
	me.moveFirstLetter = function()
	{
		this.inProgress = false;
		this.letterIndex = 0;
		this.nextLetter = this.letters[0];
		for(i = 0; i < this.letters.length; i++)
		{
			this.letters[i].hovered = false;
		}
		Sound.Play("coin"); //fail
	}
	me.update = function(delta)
	{
		//did I hit the bottom boundary?
		// remember to set delete on each letter object
		if (this.completed)
		{
			this.deleted = true;
			Sound.Play("coin2"); //success
		}
		for(i = 0; i < this.letters.length; i++)
		{
			this.letters[i].update(delta);
		}
		if (this.deleted){
			return false;
		}
		return true;
	}
	me.draw = function()
	{
		for(i = 0; i < this.letters.length; i++)
		{
			this.letters[i].draw();
		}
	}
	return me;
	
}
function InvaderLetter(x,y,xvel,yvel,color,alpha,glyph)
{
	var me = {};
	me.glyph = glyph;
	me.x = x;
	me.y = y;
	me.xvel = xvel;
	me.yvel = yvel;
	me.color = color;
	me.alpha = alpha;
	me.font = DEFAULT_FONT; //font || DEFAULT_FONT;
	me.Text = new Text(glyph,x,y,color,me.font,alpha);
	me.hoverAlpha = 0.5;
	me.hoverAlphaStep = 0.05;
	me.deleted = false;
	me.update = function(delta)
	{
		this.x=this.x+delta*this.xvel;
		this.y=this.y+delta*this.yvel;
		this.Text = new Text(this.glyph,this.x,this.y,this.color,this.font,this.alpha);
		//check for cleanup
		if (this.deleted){
			return false;
		}
		return true;
		
	}
	me.draw = function()
	{
		if (this.hovered)
		{
			this.hoverAlpha +=  this.hoverAlphaStep;
			if (this.hoverAlpha >= 1)
			{
				this.hoverAlphaStep = -0.05;
			}
			if (this.hoverAlpha <= 0.5)
			{
				this.hoverAlphaStep = 0.05;
			}
			this.Text = new Text(this.glyph,this.x,this.y,this.color,this.font,this.hoverAlpha);
		}
		this.Text.draw();
	}
	return me;
}
