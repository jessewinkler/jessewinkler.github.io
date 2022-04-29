StateEnum = {
	Title : 0,
	SelectPlayer: 1,
	NewPlayer: 2,
	Main : 3,
	Queue : 4,
	Map : 5,
	StarBase : 6,
	LetterInvaders : 7,
	Stars : 8
}
// state pattern to manage what is shown
// basically there is a state initialize that clears all game objects and makes new ones
// and an update function to do whatever a given state needs
// this particular state object contains ALL state handlers!
function StateManager(startState) {
	startState = startState || StateEnum.Title;
	return {
		CurrentState : startState,
		ElapsedTime : 0,
		TitleTrigger : 0,
		ApplyState : function(state)
		{
				DrawList = []; //clear it
				UpdateList = [];
				UIList = [];
				if (Player)
				{
					if (Player.cursor)
					{
						Player.cursor.hovered = null;
					}
				}
				ElapsedTime = 0;
				this.CurrentState = state;
				Sound.StopAll();
				if (state == StateEnum.Title)
				{
					TitleTrigger = 0;
					var title = new Text("Canvas Sandbox",100,100,"FF0000","40pt Consolas");
					UpdateList.push(title);
					var option = new UIText("New Game",150,150,"FF0000",function(){ StateManager.ApplyState(StateEnum.Main); });
					UIList.push(option);
					option = new UIText("Queue Monitor",150,200,"FF0000",function(){ StateManager.ApplyState(StateEnum.Queue); });
					UIList.push(option);
					option = new UIText("Office Map", 150, 250, "0000FF", function() {StateManager.ApplyState(StateEnum.Map); });
					UIList.push(option);
					option = new UIText("starbase", 150, 300, "0000FF", function() {StateManager.ApplyState(StateEnum.StarBase); });
					UIList.push(option);
					option = new UIText("letter invaders", 150, 350, "00FFFF", function() {StateManager.ApplyState(StateEnum.LetterInvaders); });
					UIList.push(option);
					option = new UIText("Creation of Universe", 150, 400, "00FFFF", function() {StateManager.ApplyState(StateEnum.Stars); });
					UIList.push(option);
					for(var i =0;i<50;i++)
					{
						var orb = TitleOrb();
						UpdateList.push(orb);
					}
					//Sound.Play("titleMusic");
					if (Player)
					{
						Player.hideCursor = false;
						Player.hidePlayer = true;
					}
				}
				if (state == StateEnum.Main)
				{
					Sound.Play("coin"); ///loading sound
					Sound.Play("mario");
					Player.hidePlayer = false;
					Player.hideCursor = false;
					UpdateList.push(new StaticImage("backgroundfield"));
					UpdateList.push(new StaticImage("rock",200,200,55,52,true));
					for (i=300,j=0; i < 500; i+=32,j++)
					{
						UpdateList.push(new StaticImage("brickwall",300,i,32,32,true));
						UpdateList.push(new StaticImage("brickwall",i,300,32,32,true));
						if (j!=5) //doorway lol
							UpdateList.push(new StaticImage("brickwall",492,i,32,32,true));
						UpdateList.push(new StaticImage("brickwall",i,492,32,32,true));
					}
					var skillbar = new StaticImage("skillbar",CANVAS_WIDTH/2-100,CANVAS_HEIGHT-40,40,40);
					skillbar.onclick = function(){ Player.cursor.targeting = !Player.cursor.targeting; };
					UIList.push(skillbar);
				}
				if (state == StateEnum.Queue)
				{
					Player.hidePlayer = true;
					Player.hideCursor = false;
					// set up rest of scene
					UpdateList.push(new QueueBox(40,40,"Conversion Agent 1", 
					[50000, 150000,	150000,	150000,	150000,	150000,	150000,	150000,	100000,	500000,	550000,	600000,	650000,	700000,	750000,	800000,	850000,	900000,	950000,	1000000,950000,950000,1000000, 950000, 950000, 950000, 1000000, 950000, 950000, 950000,	950000,	1000000,950000,950000,1000000, 950000, 950000, 950000, 1000000, 950000, 950000, 950000]));
					UpdateList.push(new QueueBox(70,70,"Conversion Agent 2", 
					[500000, 450000,	475000,	425000,	410000,	400000,	425000,	450000,	475000,	500000,	550000]));
					UpdateList.push(new QueueBox(100,100,"Conversion Agent 3", 
					[100, 1000,	10000,	50000,	40000,	30000,	20000,	30000,	20000,	10000]));
					
					UpdateList.push(new QueueBox(300,40,"ARM Agent 1", 
					[500000, 450000,	475000,	425000,	410000,	400000,	425000,	450000,	475000,	500000,	550000]));
					UpdateList.push(new QueueBox(330,70,"ARM Agent 2", 
					[425000, 450000,	475000,	425000,	500000,	500000,	425000,	450000,	475000,	500000,	410000]));
					UpdateList.push(new QueueBox(360,100,"ARM Agent 3", 
					[500000, 450000,	475000,	425000,	410000,	400000,	425000,	450000,	475000,	500000,	550000]));
					UpdateList.push(new QueueBox(390,130,"ARM Agent 4", 
					[500000, 450000,	475000,	425000,	410000,	400000,	425000,	450000,	475000,	500000,	550000]));
					//[50000, 100000,	150000,	200000,	250000,	300000,	350000,	400000,	450000,	500000,	550000,	600000,	650000,	700000,	750000,	800000,	850000,	900000,	950000,	1000000]));
				}
				if (state == StateEnum.Map)
				{
					var loadString = "10th Floor,153,219,391,103,#d3d3d3,#000000,1,14pt Consolas;Moonwalkers,377,49,189,88,#0000FF,#FFFFFF,1,14pt Consolas;Jesse,417,112,34,20,#00FF00,#FFFFFF,0.6,8pt Consolas;A Team,393,142,147,69,#503020,#FFFFFF,1,14pt Consolas;Duderino,300,141,87,69,#800000,#FFFFFF,1,14pt Consolas;Data Grid,112,139,182,69,#408050,#FFFFFF,1,14pt Consolas;Hogwash,134,62,140,69,#507080,#FFFFFF,1,14pt Consolas;OutsideIn,272,64,99,69,#102010,#FFFFFF,1,14pt Consolas;Carbide,595,120,105,91,#805030,#FFFFFF,1,14pt Consolas;Aqua Tower,702,120,105,91,#805030,#FFFFFF,1,14pt Consolas;Shaun,515,112,34,20,#00FF00,#FFFFFF,0.6,8pt Consolas;Kapuza,454,113,34,20,#00FF00,#FFFFFF,0.6,8pt Consolas;Ken,498,89,34,20,#00FF00,#FFFFFF,0.6,8pt Consolas;Dennis,371,66,34,20,#00FF00,#FFFFFF,0.6,8pt Consolas;Nadia,498,69,34,20,#00FF00,#FFFFFF,0.6,8pt Consolas;Cayto,532,88,34,20,#00FF00,#FFFFFF,0.6,8pt Consolas;Iona,532,69,34,20,#00FF00,#FFFFFF,0.6,8pt Consolas;Alex,454,69,34,20,#00FF00,#FFFFFF,0.6,8pt Consolas;Max,452,93,34,20,#00FF00,#FFFFFF,0.6,8pt Consolas;Yimin,418,93,34,20,#00FF00,#FFFFFF,0.6,8pt Consolas;Eric,453,50,34,20,#00FF00,#FFFFFF,0.6,8pt Consolas;Kristina,419,69,34,20,#00FF00,#FFFFFF,0.6,8pt Consolas;Karam,419,49,34,20,#00FF00,#FFFFFF,0.6,8pt Consolas;Theo,373,96,34,20,#00FF00,#FFFFFF,0.6,8pt Consolas;Levi,371,48,34,20,#00FF00,#FFFFFF,0.6,8pt Consolas;Tony,506,190,34,20,#607000,#FFFFFF,0.6,8pt Consolas;Trish,507,172,34,20,#607000,#FFFFFF,0.6,8pt Consolas;Elise,507,150,34,20,#607000,#FFFFFF,0.6,8pt Consolas;Alan,472,150,34,20,#607000,#FFFFFF,0.6,8pt Consolas;"
					var loadArray = loadString.split(';');
					for (i = 0; i < loadArray.length; i++)
					{
						var loadLine = loadArray[i].split(',');
						if (loadLine[0])
						{
							UIList.push( new MapRegion(loadLine[0],parseInt(loadLine[1]),parseInt(loadLine[2]),parseInt(loadLine[3]),parseInt(loadLine[4]),loadLine[5],loadLine[6],loadLine[7],loadLine[8]));
						}
					}
					
					//UIList.push(new MapRegion("10th Floor", 200, 200, 150, 50, "#d3d3d3", "#000000", 1, DEFAULT_FONT));
					//UIList.push(new MapRegion("Moonwalkers", 300, 150, 50, 50, "#0000FF", "#FFFFFF", 1, DEFAULT_FONT));
					//UIList.push(new MapRegion("Jesse", 400, 400, 20, 20, "#00FF00", "#FFFFFF", 0.6, "8pt Consolas"));
				}
				if (state == StateEnum.StarBase)
				{
					var base = new StarBase("karnak",300,400,10, "#0000FF");
					var base2 = new StarBase("tanagra",700,400,10, "#FF0000");
					UpdateList.push(base);
					UpdateList.push(base2);
				}
				if (state == StateEnum.LetterInvaders)
				{
					
					//create the view - destructible land at bottom
					// hud - score counter
					var wordlist = 		"ability,accepting,accomplishment,accountability,acknowledge,active,admiration,advice,advise,advocacy,aid,altruism,appeal,appease,appreciation,arrangement,articulate,aspiration,asset,assumption,attentive,attitude,audience,authority,awe,behavior,belief,bold,bond,brave,bridge,career,cause,celebration,challenge,chance,change,chaos,character,charismatic,charm,citizen,civility,clout,coherent,commitment,commonground,common-sense,communicative,community,compassion,complication,comprehension,compromising,confidence,conflict,congress,conscientious,consideration,constant,contradiction,control,cooperation,cordiality,counsel,country,courage,critical,criticism,curiosity,daring,decent,decisive,deed,defeat,definition,demonstrate,determination,devote,devotion,difference,dignity,diligent,diplomatic,discipline,discouragement,discreet,disregard,dream,dynamic,dynamism,earnest,efficiency,effort,encouragement,energetic,ensure,enthusiastic,equality,essential,esteemed,estimable,ethical,evaluation,eventual,expectant,expectation,experience,fairness,faith,famous,flexible,focus,foresight,forte,fortitude,freedom,galvanize,generation,generosity,genius,genteel,genuine,gift,grace,gratitude,greatness,guidance,hardwork,harmony,helpful,hero,history,holiday,homage,honesty,honor,honorable,hopeful,humble,humility,idealistic,ideology,illuminate,impact,improvements,industrious,influential,information,initiate,innovative,insightful,inspirational,instinctive,instructive,integrity,intense,intention,interest,intricate,intuitive,investigative,ire,irrefutable,issues,judgment,justice,kindred,kinship,legendary,legitimacy,listener,loyalty,mastery,measure,merit,meritorious,moderate,modesty,morale,motivation,mutual,national,natural,needs,noble,observance,open-minded,optimism,orator,order,outspoken,patient,patriot,patriotism,peacemaker,perceptive,peril,perseverance,persistence,personable,personal,persuasive,popular,potent,potential,powerful,praise,precedent,pressure,principled,principles,priorities,privilege,profile,proper,proposal,provide,provocative,public,purposeful,qualifications,quality,quest,quick,quiescent,rational,rationale,reality,reasonable,recognition,reconcile,record,reflective,reform,regard,relationship,reliant,relief,relief,rescue,resilience,resolute,resourcefulness,respect,respectful,respectful,responsibility,responsible,responsive,restoration,restraint,revelation,reverent,rights,rigorous,role,sagacious,sage,security,sensible,sensitive,service,setback,sharing,sincerity,skill,solemn,solitary,soul,special,speculation,spirit,spotlight,staunchness,strive,subdue,success,successful,supportive,sympathetic,tactful,talent,teamwork,temperament,tenacious,tendency,thankful,tolerance,tolerant,tone,tradition,trait,trustworthy,truthful,ultimate,understanding,understatement,unification,unique,united,unity,unprecedented,unpretentious,upright,upstanding,useful,aliant,values,veracity,versatile,victory,vigilant,vigorous,virtuous,visible,vision,vocal,voice,vulnerable,war,watchful,willingness,wisdom,wise,woes,worthwhile,worthy,yearning,yielding,zeal,zealous";
					//"a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,1,2,3,4,5,6,7,8,9,0,cat,dog,lion,frog,dolphin";
					//"cat,dog,rat,bison,hound,fox,zebra,lion,giraffe,monkey,rhino,tiger,vulture";
					var words = wordlist.split(",");
					Player.ActiveGlyphs = [];
					Player.Queue = new Queue();
					for (i=0; i<words.length;i++)
					{
						Player.Queue.enqueue(words[i]);
					}
					for (i = 0; i < 5; i) //initial only 5, rest later
					{
						var word = Player.Queue.dequeue();
						var hasFirst = false;
						for (j = 0; j < UpdateList.length; j++)
						{
							if (word[0] == UpdateList[j].nextLetter.glyph)
							{
								hasFirst = true;
								break;
							}
						}
						if (hasFirst)
						{
							Player.Queue.enqueue(word);
							continue;
						}
						i++;
						var x = Math.random()*(CANVAS_WIDTH - word.length*12); 
						var yvel = Math.random()*.01;
						var iw = InvaderWord(x,0,0,yvel,"#FFFFFF",1,word);
						UpdateList.push(iw);
					}
					
					Player.hidePlayer = true;
					Player.hideCursor = true;
					
				}
				if (state == StateEnum.Stars)
				{
					Player.hidePlayer = true;
					Player.hideCursor = true;
					//set up star objects.
					UIList.push(new Text("Stars: 0",10,10,"#FFFFFF","8pt Consolas",0.7));
					//UpdateList.push(UIList[0]);
					UIList.push(new Text("Age: 0",10,20,"#FFFFFF","8pt Consolas",0.7));
					//UpdateList.push(UIList[1]);
					UIList.push(new Text("Collisions: 0",10,30,"#FFFFFF","8pt Consolas",0.7));
					//UpdateList.push(UIList[2]);
					UIList[2].collisions = 0;
					for(var i =0;i<10000;i++)
					{
						var orb = Star();
										
						UpdateList.push(orb);
					}
					/* debug code
					var orb1 = new Orb(			100,
							100,
							0.01,
							0.000000001,
							10,
							"" + Math.floor(Math.random()*9) + "0" + Math.floor(Math.random()*9) + "0" + Math.floor(Math.random()*9) + "0",
							1,
							true);
					UpdateList.push(orb1);
					var orb2 = new Orb(			120,
							100,
							-0.01,
							0.000000001,
							10,
							"" + Math.floor(Math.random()*9) + "0" + Math.floor(Math.random()*9) + "0" + Math.floor(Math.random()*9) + "0",
							1,
							true);
					UpdateList.push(orb2);
					*/
				}
			},
		update : function(delta)
			{
				ElapsedTime += delta;
				if (this.CurrentState == StateEnum.Title)
				{
					TitleTrigger += delta;
					if (TitleTrigger > 30)
					{
						TitleTrigger = 0;
						var orb = TitleOrb();
						UpdateList.push(orb);
					}
				}
				if (this.CurrentState == StateEnum.StarBase)
				{
					TitleTrigger += delta;
					if (TitleTrigger > 60000)
					{
						TitleTrigger = 0;
						StateManager.ApplyState(StateEnum.StarBase);
					}
				}
				if (this.CurrentState == StateEnum.LetterInvaders)
				{
					if (UpdateList.length < 10 && !Player.Queue.isEmpty)
					{
						var word = Player.Queue.dequeue();
						var hasFirst = false;
						for (j = 0; j < UpdateList.length; j++)
						{
							if (word[0] == UpdateList[j].nextLetter.glyph)
							{
								hasFirst = true;
								break;
							}
						}
						if (hasFirst)
						{
							Player.Queue.enqueue(word);
							return;
						}
						var x = Math.random()*(CANVAS_WIDTH - word.length*12); 
						var yvel = Math.random()*.01;
						var iw = InvaderWord(x,0,0,yvel,"#FFFFFF",1,word);
						UpdateList.push(iw);
					}
					if (UpdateList.length == 0) //game over - win
					{
						StateManager.ApplyState(StateEnum.Title);
					}
				}
				if (this.CurrentState == StateEnum.Stars)
				{
					TitleTrigger += delta;
					UIList[1].value = "Age: " + TitleTrigger;
					UIList[0].value = "Stars: " + UpdateList.length;
					UIList[2].value = "Collisions: " + UIList[2].collisions;
				}
			}
		};
}