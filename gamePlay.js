﻿///GLOBAL VARIABLES macskafüle
//canvas variables
var c,cc;

//buttonpress variables
var keys = [];

//player variables
var px=100;
var py=350;
var pd=40;
var ps=16;
var alive=true;
var restartTimer=60;
var lives=10;
var hearts="♥♥♥♥♥♥♥♥♥♥";

//shooting variables
var reloadTime = 10;
var reloaded = reloadTime;
var shoots = 0;

//bullet variables
var bulletList = [];

//background stars variables
var bigBGStars = [];
var smallBGStars = [];
var boomParticles = [];

//enemy variables
var spawnTimer = 10;
var enemies = [];
var goneTexts = [];
var killed = 0;
var accuracy = 0;

//background rgb lol
var red=0;
var blue=0;
var green=0;
var redToggle=true;
var greenToggle=false;
var blueToggle=false;


///CLASSES
//BULLET
Bullet = function (){
	var myBullet = {
		x:px,
		y:py,
		spdX:17,
		img:"./rcket.png"
	};
	bulletList.unshift(myBullet);
}
Stars = function(which){
	var myStar = {
		x:800,
		y:Math.random()*600,
		size:0,
		speed:0
	};
	if(which=="big")
	{
		myStar.size = Math.random()*6+6;
		myStar.speed = 5;
		bigBGStars.push(myStar);
	}
	else if(which=="small")
	{
		myStar.size = Math.random()*6+1;
		myStar.speed = 2;
		smallBGStars.push(myStar);
	}
}
Boom = function (posX,posY){
	var myBoom = [];
	for(var i = 0; i < 10; i++){
		var myBoomPart = {
			x:posX,
			y:posY,
			size:40,
			angle:Math.random()*360
		};
		myBoom.push(myBoomPart);
	}
	boomParticles.unshift(myBoom);
}
Enemy = function (){
	var myEnemy = {
		x:825,
		y:Math.random()*500+50,
		size:50,
		dir:Math.random()*140,
		speed:Math.random()*10+2,
		timeToChange:20
	};
	myEnemy.ChangeDirection = function(){
		this.dir = Math.random()*140;
		this.speed = Math.random()*10+2;
		this.timeToChange = 20
	};
	enemies.unshift(myEnemy);
}
EnemyGoneText = function(whereY){
	var newGoner = {
		x:5,
		y:whereY,
		timeToShow:10
	};
	goneTexts.unshift(newGoner);
}


///EVENT LISTENERS
//Read Buttons
document.addEventListener('keydown', function(e) {
	keys[e.keyCode] = true;
	//console.log(e.keyCode);  //what am I pressing?
});
//Turn off Buttons
document.addEventListener('keyup', function(e) {
	keys[e.keyCode] = false;
});


///METHODS
//ONLOAD
window.onload=function() {
	c=document.getElementById('gameScreen');
	cc=c.getContext('2d');
	cc.font = "22px OCR A";
	cc.textAlign='center';
	//generate stars
	var i = 0
	while(i < 40){
		Stars("big");
		Stars("small");
		bigBGStars[i].x -= bigBGStars[i].speed*i*4;
		smallBGStars[i].x -= smallBGStars[i].speed*i*10;
		i++;
	}
	//start update loop for 30fps
	setInterval(update,1000/30);
}

PlayerFunction = function(){
	if(alive){
		if (py<(pd+1)) py=pd;
		else if (py>c.height-(pd+1)) py=c.height-(pd);
		if (px<(pd+1)) px=pd;
		else if (px>c.width-(pd+1)) px=c.width-(pd);
		//checkForCollision
		for(var i = 0; i < enemies.length; i++){
			//xy-méret/2 ellenfélle
			if (Math.abs(px-enemies[i].x) <= (pd/2)+(enemies[i].size/2)
			 && Math.abs(py-enemies[i].y) <= (pd/2)+(enemies[i].size/2))
			 {
				 alive=false;
				 Boom(px,py);
				 pd = 0;
			 }
		}
	}
	cc.fillRect(px-pd/2,py-pd/2,pd,pd);
}

TimedEnemyFunction = function(){
	if(alive){
		if (spawnTimer >= 20) spawnTimer=0;
		if (spawnTimer == 0) Enemy();
		spawnTimer++;
	}
}
SmallStarsFunction = function(star, i){
	//position change
	if(star.x < 0)
	{
		smallBGStars.splice(i,1);
		Stars("small");
	}
	else
	{
		if (alive && lives > 0) star.x -= star.speed;
		cc.fillRect(star.x-(star.size/2),star.y-(star.size/2),star.size,star.size);
	}
}
BigStarsFunction = function(star, i){
	//position change
	if(star.x < 0)
	{
		bigBGStars.splice(i,1);
		Stars("big");
	}
	else
	{
		if (alive && lives > 0) star.x -= star.speed;
		cc.fillRect(star.x-(star.size/2),star.y-(star.size/2),star.size,star.size);
	}
}
BulletFunction = function(bullet, i){
	//position change
	for(var j = 0; j < enemies.length; j++){
		//xy-méret/2 ellenfélle
		if (Math.abs(bullet.x-enemies[j].x) <= (20/2)+(enemies[j].size/2)
		 && Math.abs(bullet.y-enemies[j].y) <= (10/2)+(enemies[j].size/2))
		 {
			 Boom(enemies[j].x,enemies[j].y);
			 enemies.splice(j,1);
			 bulletList.splice(i,1);
			 killed++;
		 }
	}
	if(bullet.x < c.width+10)
	{
		if (alive && lives > 0) bullet.x += bullet.spdX;
		cc.fillRect(bullet.x-5,bullet.y-5,20,10);
	}
	else
	  bulletList.splice(i,1);
}
BoomFunction = function(boom, i){
	//j particle-je menjen angle felé és
	//[j].size-=0.1
	if (boom[0].size > 0)	{
		for (var j = 0; j < boom.length; j++){
			cc.fillRect(boom[j].x-(boom[j].size/4),boom[j].y-(boom[j].size/4),boom[j].size,boom[j].size);
			boom[j].x += Math.cos(boom[j].angle)*1.5;
			boom[j].y += Math.sin(boom[j].angle)*1.5;
			boom[j].size -= 1.5;
		}
	}
	else
		boomParticles.splice(i,1);
}
EnemyFunction = function(enemy, i){
	if(alive && lives>0){
		enemy.timeToChange--;
	  //don't go out of bounds (y axis), changeDirections
		if (enemy.y<(enemy.size)){
			enemy.y=enemy.size;
			enemy.ChangeDirection();
		}
		else if (enemy.y>c.height-(enemy.size)){
			enemy.y=c.height-(enemy.size);
			enemy.ChangeDirection();
		}
		if (enemy.timeToChange<=0)
		{
			enemy.ChangeDirection();
		}
		//do the moving part
		enemy.x -= Math.abs(Math.cos(enemy.dir)*enemy.speed);
		enemy.y += Math.sin(enemy.dir)*enemy.speed;

		//kimegy a képernyőről balra
		if (enemy.x<(0-enemy.size/2)){
			EnemyGoneText(enemy.y);
			enemies.splice(i,1);
			lives--;
			hearts = hearts.substr(0,hearts.length-1);
		}
	}
	//draw
	cc.fillRect(enemy.x-(enemy.size/2),enemy.y-(enemy.size/2),enemy.size,enemy.size);
}
GonerTextFunction = function(text, i){
	if(text.timeToShow>=0){
		cc.fillText("ELBASZTAD!",80,text.y);
		text.timeToShow--;
	}
	else goneTexts.splice(i,1);
}
StartTextFunction = function(){
	spawnTimer=15;
	cc.fillText("Use 'WASD' to move and SPACE to shoot.", 400, 200);
	cc.fillText("Try to shoot all enemies coming towards you.", 400, 300);
}
BlewUpTextFunction = function(){
	cc.fillText("Szép vót'", 400, 200);
}

//UPDATE ##Main##
function update() {
	if(alive && lives > 0){
		//Button Checks
		if (keys[87]){
				//Up
				if(py>(pd+1)) py-=ps;
			}
		if (keys[83]){
				//Down
				if(py<c.height-(pd+1)) py+=ps;
			}
		if (keys[65]){
				//Left
				if(px>(pd+1)) px-=ps;
			}
		if (keys[68]){
				//Right
				if(px<c.width-(pd+1)) px+=ps;
			}
		if (keys[32] && reloaded>=reloadTime){
				reloaded=0;
				Bullet();
				shoots++;
				// itt kell készítsek új golyót
				// az hozzáadja magát a listába
				// lent a foreach meghívja a golyófunkcióit, tehát
				//az foglalkozik a golyó törlésével is
			}
		if (keys[66] && reloaded>=reloadTime){
				reloaded=-10;
				// test boom_effect, kb mint a golyó?
				Boom(px-8,py-8);
		}

	  //Reload
		if (reloaded<reloadTime) reloaded++;
	}
	//Draw
  //background-main
	cc.fillStyle='black';
	cc.fillRect(0,0,c.width,c.height);

	//background-1(further)
	cc.fillStyle="rgb(25,50,50)";
	for(var i = 0; i < smallBGStars.length; i++){
		SmallStarsFunction(smallBGStars[i],i);
	}

	//background-2(closer)
	cc.fillStyle="rgb(100,150,150)";
	for(var i = 0; i < bigBGStars.length; i++){
		BigStarsFunction(bigBGStars[i],i);
	}

	//player
	cc.fillStyle="rgb(100,210,210)";
	PlayerFunction();

	//enemy spawning
	TimedEnemyFunction();
	//enemy Color
	cc.fillStyle="rgb(255,0,60)";
	//enemy function
	for(var i = 0; i < enemies.length; i++){
		EnemyFunction(enemies[i],i);
	}

	//boom
	for(var i = 0; i < boomParticles.length; i++){
		cc.fillStyle="rgba(255," + (200-(boomParticles[i][0].size*2.5)) + ",0,0.6)";
		BoomFunction(boomParticles[i],i);
	}

	//bulletDraw
	cc.fillStyle="rgb(255,60,255)";
	for(var i = 0; i < bulletList.length; i++){
		BulletFunction(bulletList[i],i);
	}

	//'missed'Texts
	cc.fillStyle="rgb(255,180,255)";
	for(var i = 0; i < goneTexts.length; i++){
		GonerTextFunction(goneTexts[i], i);		
	}	

  //starting text
	cc.fillStyle = 'white';
	if (performance.now()<2500){
		StartTextFunction();
	}
	
	if (alive==false || lives <= 0){
		restartTimer--;
		BlewUpTextFunction();
	}	
	
	if (restartTimer<=0){
		location.reload();
	}
	
	if (killed>=1 && shoots>=1){
		accuracy=Math.round((killed/shoots)*100);
	}	

	cc.fillText(parseInt(performance.now()/1000)+" sec",400,20);
	cc.fillText("Kills: "+killed,100,20);
	cc.fillText("Accuracy: " +accuracy+ "%",700,20);

	cc.fillText("Lives: "+hearts,400,590)


	if (redToggle == true && red<255)
		 red++;
	else if (red>0)
		 red--;
	if (red==255) {
		 greenToggle=true;
		 blueToggle=false;
		  }
	
	if (greenToggle == true && green<255)
		 green++;
	else if (green>0)
		 green--;
	if (green==255) {
		 blueToggle=true;
		 redToggle=false;
		  }
	
	if (blueToggle == true && blue<255)
		blue++;
	else if (blue>0)
		 blue--;
	if (blue==255) {
		redToggle=true; 
		greenToggle=false;
		 }

	//filter
	cc.fillStyle="rgba("+red+","+green+","+blue+",0.10)";
	cc.fillRect(0,0,c.width,c.height);

}
