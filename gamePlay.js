///GLOBAL VARIABLES
//canvas variables
var c,cc;
//player variables
var px=py=50;
var pd=40;
//shooting variables
var reloadTime = 5;
var reloaded = reloadTime;
//bullet variables
var bulletList = [];
//buttonpress variables
var keys = [];

//background stars variables
var bigBGStars = [];
var smallBGStars = [];

///CLASSES
//BULLET
Bullet = function (){
	var myBullet = {
		x:px,
		y:py,
		spdX:17,
		img:"./rcket.png",
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

SmallStarsFunction = function(star, i){
	//position change
	if(star.x < 0)
	{
		smallBGStars.splice(i,1);
		Stars("small");
	}
	else
	{
		star.x -= star.speed;
		cc.fillRect(star.x,star.y,star.size,star.size);
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
		star.x -= star.speed;
		cc.fillRect(star.x,star.y,star.size,star.size);
	}
}

BulletFunction = function(bullet, i){
	//position change
	if(bullet.x < c.width+10)
	{
		bullet.x += bullet.spdX;
		cc.fillRect(bullet.x-5,bullet.y,20,7);
	}
	else
	  bulletList.splice(i,1);
}


//UPDATE
function update() {
	//Button Checks
	if (keys[87]){
			//Up
			if(py>(pd+1)) py-=15;
			console.log("fel");
		}
	if (keys[83]){
			//Down
			if(py<c.height-(pd+1)) py+=15;
			console.log("le");
		}
	if (keys[65]){
			//Left
			if(px>(pd+1)) px-=15;
			console.log("bal");
		}
	if (keys[68]){
			//Right
			if(px<c.width-(pd+1)) px+=15;
			console.log("jobb");
		}
	if (keys[32] && reloaded>=reloadTime){
			reloaded=0;
			Bullet();
			// itt kell készítsek új golyót
			// az hozzáadja magát a listába
			// lent a foreach meghívja a golyófunkcióit, tehát
			//az foglalkozik a golyó törlésével is
			console.log("pew");
		}

  //Reload
		if (reloaded<reloadTime) reloaded++;

	//Draw
  //background-main
	cc.fillStyle='black';
	cc.fillRect(0,0,c.width,c.height);

	//background-1(further)
	cc.fillStyle='rgb(25,50,50)';
	for(var i = 0; i < smallBGStars.length; i++){
		SmallStarsFunction(smallBGStars[i],i);
	}

	//background-2(closer)
	cc.fillStyle='rgb(100,150,150)';
	for(var i = 0; i < bigBGStars.length; i++){
		BigStarsFunction(bigBGStars[i],i);
	}

	//player
	cc.fillStyle='white';
	//don't go out of bounds then draw
	if (py<(pd+1)) py=pd+1;
	else if (py>c.height-(pd+1)) py=c.height-(pd+1);
	if (px<(pd+1)) px=pd+1;
	else if (px>c.width-(pd+1)) px=c.width-(pd+1);
	cc.fillRect(px-pd/2,py-pd/2,pd,pd);

	//enemies
	cc.fillStyle='rgb(230,20,20)';
	cc.fillRect(600,300,60,60);

	//bulletDraw
	cc.fillStyle='yellow';
	for(var i = 0; i < bulletList.length; i++){
		BulletFunction(bulletList[i],i);
	}
}