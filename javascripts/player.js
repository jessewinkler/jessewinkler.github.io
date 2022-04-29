//players
function Player()
{
	x = 100;
	y = 100;
	color = "FFFFFF";
	var delta = 1;
	var cursor = {
			cursorImage : Sprite("mouse"),
			x: MousePos.x,
			y: MousePos.y,
			width: 8,
			height: 7,
			hovered: {}
		};
	var playerObject = {};
	playerObject.playerImage = Sprite("player",16,32);
	playerObject.x = x;
	playerObject.y = y;
	playerObject.lastx = x;
	playerObject.lasty = y;
	playerObject.width = 16; //collidable width!
	playerObject.height = 16;
	playerObject.delta = delta;
	playerObject.cursor = cursor;
	playerObject.hidePlayer = true;
	playerObject.hideCursor = false;
	playerObject.speed = 3.0;
	playerObject.autoFollow = false;
	playerObject.moveTarget = null;
	playerObject.meleeStep = 0;
	playerObject.meleeActive = false;
	playerObject.mouseMove = function(){
				if (this.autoFollow)
				{
					this.moveTarget = {x: this.cursor.x - 8, y: this.cursor.y-16 }; //bottom center of avatar
				}
			}
	playerObject.update = function(delta){
			this.cursor.x = MousePos.x;
			this.cursor.y = MousePos.y;
			if (this.cursor.hovered)
			{
				if (this.cursor.hovered.cursorUpdate)
				{
					this.cursor.hovered.cursorUpdate(MousePos.x, MousePos.y);
				}
			}
			if (!this.lockHovered) 
			{
				this.cursor.hovered = null;
			}
			this.playerImage.update(delta);
			if (!this.moveTarget)
			{
				this.playerImage.preventAnimation = true;
			}
			else
			{
				this.playerImage.preventAnimation = false;
				if (this.moveTarget.x > this.x)
				{
					this.playerImage.flipmode = false;
				}
				else if (this.moveTarget.x < this.x)
				{
					this.playerImage.flipmode = true;
				}
			}
			if (this.moveTarget != null && !this.hidePlayer)
			{
				this.lastx = this.x;
				this.lasty = this.y;
				if (this.x==this.moveTarget.x && this.y==this.moveTarget.y)
				{
					this.moveTarget = null;
				}
				else
				{
					//apply speed to direction components via proportion speed*(xdiff/(xdiff+ydiff))
					var xdiff = this.moveTarget.x - this.x;
					var ydiff = this.moveTarget.y - this.y;
					var xspeed = Math.abs(this.speed * xdiff / (Math.abs(xdiff) + Math.abs(ydiff)));
					var yspeed = this.speed - xspeed;
					if (xdiff < 0) { xspeed = -xspeed;}
					if (ydiff < 0) { yspeed = -yspeed;}
					if (Math.abs(xdiff) < Math.abs(xspeed))
					{
						xspeed = xdiff;
					}
					if (Math.abs(ydiff) < Math.abs(yspeed))
					{
						yspeed = ydiff;
					}
					this.x += xspeed;
					this.y += yspeed;
				}
			}
			var lastHit = -1;
			for(var i=0;i<UIList.length;i++)
			{
				if (!this.lockHovered) 
				{
					if (RectangleCollide(this.cursor,UIList[i]))
					{
						this.cursor.hovered = UIList[i];
						UIList[i].hovered = true;
						if (lastHit > -1) {
							UIList[lastHit].hovered = false;
						}
						lastHit = i;
					}
					else
					{
						UIList[i].hovered = false;
					}
				}
			}
			if (this.meleeActive)
			{
				this.meleeStep += 0.1;
				if (this.meleeStep > 0.5 * Math.PI - 0.5) 
				{
					this.meleeActive = false;
				}
			}
			for (var i=0;i<UpdateList.length;i++)
			{
				if (UpdateList[i].collides && RectangleCollide(this,UpdateList[i]))
				{ //player ran into a barrier
					if (!RectangleCollide({x:this.x,y:this.lasty,width:this.width,height:this.height},UpdateList[i]))
					{
						this.y = this.lasty;
					}else if (!RectangleCollide({x:this.lastx,y:this.y,width:this.width,height:this.height},UpdateList[i]))
					{
						this.x = this.lastx;
					}else {
						this.x = this.lastx;
						this.y = this.lasty;
					}
				}
			}
			};
	playerObject.drawPlayer = function() {
			if (!this.hidePlayer)
			{
				/*canvas.fillStyle = "blue";
				canvas.globalAlpha = 0.5;
				canvas.fillRect(this.x,this.y,this.width,this.height);
				canvas.globalAlpha = 1.0;*/
				this.playerImage.draw(this.x,this.y-16);
				if (this.meleeActive)
				{
					var gradient = canvas.createLinearGradient(this.x,this.y-30,this.x,this.y+30);
					gradient.addColorStop("0", "white");
					gradient.addColorStop("0.5", "red");
					gradient.addColorStop("1", "white");
					canvas.fillStyle = gradient;
					canvas.globalAlpha = 0.8;
					canvas.beginPath();
					//canvas.arc(this.x,this.y - 8,30,1.5 * Math.PI * (1.1-this.meleestep),0.5*Math.PI * this.meleeStep,this.playerImage.flipmode);
					if (this.playerImage.flipmode)
					{
						canvas.arc(this.x,this.y - 8,30,(0.5+this.meleeStep) * Math.PI,(1+this.meleeStep)*Math.PI);
					}else{
						canvas.arc(this.x,this.y - 8,30,(1.5+this.meleeStep) * Math.PI,(0+this.meleeStep)*Math.PI);
					}
					canvas.fill();
					canvas.globalAlpha = 1;
				}
			}
		};
	playerObject.drawCursor = function () {
			if (!this.hideCursor)
			{
				if (this.cursor.targeting)
				{
					canvas.fillStyle = "FF0000";
					if (!this.targetAlpha) {this.targetAlpha = 0.5; this.targetAlphaIncrement = 0.1;}
					else {
						this.targetAlpha += this.targetAlphaIncrement; 
						if (this.targetAlpha > .8){
							this.targetAlpha = .8;
							this.targetAlphaIncrement=-0.1;
						}else if(this.targetAlpha < 0.2){
							this.targetAlphaIncrement=0.1;}
					}
					canvas.globalAlpha = this.targetAlpha;
					canvas.fillRect(this.cursor.x-30,this.cursor.y-30,60,60)
					canvas.globalAlpha = 1;
				}
				this.cursor.cursorImage.draw(this.cursor.x,this.cursor.y);
			}
		};
	playerObject.draw = function() {
			this.drawPlayer();
			this.drawCursor();
		};
	playerObject.click = function(evt) {
			if (this.cursor.hovered)
			{
				//this.cursor.targeting = false;
				this.cursor.hovered.onclick();
			}
			else
			{
				if (this.cursor.targeting)
				{
					//launch zee missiles
					var bomb = DamageArea("explosion2",this.cursor.x-32,this.cursor.y-32,64,64,30,true);
					UpdateList.push(bomb);
					Sound.Play("boom");
					this.cursor.targeting = false;
					this.moveTarget = null; //using skill causes stop
				}
				else
				{
					this.moveTarget = {x: this.cursor.x - 8, y: this.cursor.y-16 }; //bottom center of avatar
				}
			}
			};
	playerObject.inputHandler = function(evt) {
				var keyup = false;
				if (evt.type == "keyup"){
					keyup = true;
				}
				if (StateManager.CurrentState == StateEnum.Main)
				{
					switch(evt.keyCode)
					{
						case 49: //1
							this.cursor.targeting = !this.cursor.targeting;
							break;
						case 50: //2
							this.meleeActive = true;
							this.meleeStep = 0;
							break;
					}
				}
				if (StateManager.CurrentState == StateEnum.LetterInvaders && !keyup)
				{
					//each key press is intended to fill a descending word
					// match the key press to an eligible character, or dump it w bad sound
					// if key press finishes an elgibile descending word, play good sound
					// if key press progresses an eligible word, play tactile/neutral sound.
					//Prereq - what do we need to know to do this?
					// active words and active next characters. Active chars needs to map to the word
					// active word no map needed. Active word is composed of active chars
					// each char needs to be a displayobject.
					
					var k = evt.key;
					
					//inProgress
					
					for (i=0; i<UpdateList.length; i++)
					{
						var element = UpdateList[i];
						if (element.inProgress)
						{
							if (element.nextLetter.glyph == k)
							{
								element.moveNextLetter();
								return;
							}
							else
							{
								element.moveFirstLetter();
								return;
							}
						}
					}
					
					for (i=0; i<UpdateList.length; i++)
					{
						
						var element = UpdateList[i];
						if (element.nextLetter && element.nextLetter.glyph == k)
						{
							element.moveNextLetter();
							return;; 
						}
						
					}
				}
				if (StateManager.CurrentState == StateEnum.Map)
				{
					if (this.findMode)
					{
						if (evt.keyCode == 13) // enter
						{
							var found = false;
							//try to find it!
							for(i = 0; i < UIList.length; i++)
							{
								if (UIList[i].name.includes(this.searchTerm))
								{
									found = true;
									MousePos.x = UIList[i].x;
									MousePos.y = UIList[i].y;
									break;
								}
							}
							if (!found) {
								alert("Could not find search term: " + this.searchTerm);
							}
							this.findMode = false;
						}else if (evt.key != "Shift")
						{
							this.searchTerm += evt.key;
						}
					}
					else if (this.cursor.hovered)
					{
						//alert(evt.keyCode);
						if (evt.keyCode == 8) //backspace
						{
							this.cursor.hovered.updateName();
						}
						if ((evt.keyCode >=65 && evt.keyCode <=122 && evt.keyCode != 106) || evt.keyCode == 32) //add to name
						{
							this.cursor.hovered.updateName(evt.key);
						}
						if (evt.keyCode == 46) //delete
						{
							this.cursor.hovered.deleted = true;
						}
						if (evt.keyCode == 106) //* duplicate
						{
							UIList.push(new MapRegion(this.cursor.hovered.name, 40, 40, this.cursor.hovered.width, this.cursor.hovered.height, 
								this.cursor.hovered.color, this.cursor.hovered.textColor, this.cursor.hovered.alpha, this.cursor.hovered.font));
						}
						//add resize here later 37 left 38 up 39 right 40 down
						if (evt.keyCode >=37 && evt.keyCode <=40)
						{
							this.cursor.hovered.resize(evt.keyCode);
						}
						
						//add color here later
						if (evt.keyCode == 191)
						{
							this.cursor.hovered.randomizeColor();
						}
					}else
					{
						if (evt.keyCode == 106) //* new
						{
							UIList.push(new MapRegion("default", 10, 10, 40, 40, "#AAAAAA", "#FFFFFF", 0.8, "8pt Consolas"));
						}
						if (evt.keyCode == 36) //home key
						{
							var serialize = "";
							for (var i=0;i<UIList.length;i++)
							{
								serialize += UIList[i].serialize();
							}
							$('#serialize').text(serialize);
							document.getElementById("debug").innerText = serialize;
							
						}
						if (evt.keyCode == 35)
						{
							this.findMode = true;
							this.searchTerm = "";
						}
					}
				}
			};
	return playerObject;
}