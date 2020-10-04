var PLAY = 1;
var END = 0;
var GameState = PLAY;

var lives = 5;
var life, lifeImage, lifeGroup;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud1, cloud2;
var cloudGroup;
var cloudImage;
var obstacleGroup;
var obstacle, obstacleImage1, obstacleImage2, obstacleImage3, obstacleImage4, obstacleImage5, obstacleImage6;
var createObstacle;
var gameOver, restart;
var gameOverimage, restartimage;
var number;
var topPlatform, invisibleTop, topGroup;

var floating_platforms, floatingplatformGroup;
var invisibleplatform, invisibleGroup;
var jumpplatform, jumpplatformGroup;

var lava, lavaGroup;
var top_blocker;

var coin, coinGroup;

var highscore, score;
var immune;

var jumpSound, checkpointSound, dieSound;


function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");
  
  obstacleImage1 = loadImage("obstacle1.png")
  obstacleImage2 = loadImage("obstacle2.png")
  obstacleImage3 = loadImage("obstacle3.png")
  obstacleImage4 = loadImage("obstacle4.png")
  obstacleImage5 = loadImage("obstacle5.png")
  obstacleImage6 = loadImage("obstacle6.png")
  
  gameOverimage = loadImage("gameOver.png")
  restartimage = loadImage("restart.png")
  
  jumpSound = loadSound("jump.mp3");
  checkpointSound = loadSound("checkPoint.mp3");
  dieSound = loadSound("die.mp3");
  
  lifeImage = loadImage("life.png");
}

function setup() {
  background(220)
  createCanvas(windowWidth, windowHeight)
  
  highscore = 0;
  
  //create a trex sprite
  trex = createSprite(50,0,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  //create a ground sprite
  ground = createSprite(width/2,height,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  //creating invisible ground
  invisibleGround = createSprite(width/2,height,width,10);
  invisibleGround.visible = false;
  
  cloudGroup = new Group();
  obstacleGroup = new Group();
  floatingplatformGroup = new Group();
  invisibleGroup = new Group();
  topGroup = new Group();
  lavaGroup = new Group();
  jumpplatformGroup = new Group();
  coinGroup = new Group();
  lifeGroup = new Group();
  
  score = 0;
  
  trex.setCollider("circle", 0, 0, 42)
  
  gameOver = createSprite(width/2, height/2 - 50);
  restart = createSprite(width/2, height/2);
  
  gameOver.addImage(gameOverimage);
  restart.addImage(restartimage);
}

function draw() {
  //set background color
  background(180);
  
    if(touches.length > 0 || (keyDown("space") && trex.isTouching(ground))) {
      jump();  
    }
    
    if(touches.length > 0 || (keyDown("space") && trex.isTouching(floatingplatformGroup))) {
      jump();  
    }
    
    if(touches.length > 0 || (keyDown("space") && trex.isTouching(topGroup))) {
      jump(); 
    }    
  
  if (GameState === PLAY){
  
    trex.velocityX = 0; 
    trex.veloctiyY = 0;
    
    if(trex.isTouching(jumpplatformGroup)) {
        trex.velocityY = -12 - (height / 44);
      }
    
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    ground.velocityX = -4;
    
    //stop trex from falling down
    trex.collide(invisibleGround);
    trex.collide(invisibleGroup);
    
    trex.x = 50
    
    score = score + Math.round(getFrameRate() / 60);
    
    showClouds();
    showObstacles();
    showPlatforms();
    showtop();
    showLava();
    showCoins();
    showLives();
    
    number = Math.round(random(1, 200))
    
    if (number / 4 === Math.round(random(1, 25))){
      createObstacle = 1;
    }
    else {
      createObstacle = 0;
    }
    
    gameOver.visible = false;
    restart.visible = false;
  
    if (trex.isTouching(coinGroup)) {
        score = score + 25;
    }
    
    if (trex.isTouching(obstacleGroup)){
      lose_a_life();
      immunity();
    }
    else if (trex.isTouching(lavaGroup)){
      lose_a_life();
      immunity();
    }
    else if (trex.isTouching(lifeGroup)){
      add_a_life();
      immunity();
    }
    else if(trex.isTouching(obstacleGroup) === false && trex.isTouching(lavaGroup) === false && trex.isTouching(lifeGroup) === false) {
      immune = 0;
    }
    
    
  }
  else if (GameState === END) {
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    
    ground.velocityX = 0;
    cloudGroup.setVelocityXEach(0);
    obstacleGroup.setVelocityXEach(0);
    floatingplatformGroup.setVelocityXEach(0);
    topGroup.setVelocityXEach(0);
    lavaGroup.setVelocityXEach(0);
    jumpplatformGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    trex.velocityY = 4;
    trex.changeAnimation("collided" ,trex_collided);
    
    gameOver.visible = true;
    restart.visible = true;
    
    trex.x = 50
    
    if (touches.length > 0) {
        reset();
    }
    
    if (mousePressedOver(restart)) {
        reset();
    }
    
  }
  
  trex.collide(invisibleGround);
  
  text("Score: " + score, 50, 50)
  
  text("Highscore: " + highscore, 50, 100)
  
  text("Lives: " + lives, 50, 150)
  
  if (keyDown("r")) {
        reset();
    }
  drawSprites();
}

//function to spawn the clouds
function showClouds(){
  if (frameCount % Math.round(random(75, 150)) === 0) {
    cloud1 = createSprite(width, 50, 10, 10);
    cloud1.addImage(cloudImage);
    cloud1.scale = (random(0.25, 1.25))
    cloud1.y = Math.round(random(10, ground.y - 80))
    cloud1.velocityX = -3;
    trex.depth = cloud1.depth + 1;
    
    cloud1.lifetime = width + 250;
    
     cloudGroup.add(cloud1);
  } 
    
  if (frameCount % Math.round(random(75, 150)) === 0) {
    cloud2 = createSprite(width, 50, 10, 10);
    cloud2.addImage(cloudImage);
    cloud2.scale = (random(0.25, 1.25))
    cloud2.y = Math.round(random(10, ground.y - 130))
    cloud2.velocityX = -3;
    trex.depth = cloud2.depth + 1;
    
    cloud2.lifetime = width + 250;
    
    cloudGroup.add(cloud2);
  }
  
}

function showObstacles() {
  if (createObstacle === 1) {
    obstacle = createSprite(width, ground.y - 6 , 10, 10);
    obstacle.scale = 0.4;
    var rand = Math.round(random(1, 6));
    switch(rand){
      case 1: obstacle.addImage(obstacleImage1);
      break;
      case 2: obstacle.addImage(obstacleImage2);
      break;      
      case 3: obstacle.addImage(obstacleImage3);
      break;
      case 4: obstacle.addImage(obstacleImage4);
      break;
      case 5: obstacle.addImage(obstacleImage5);
      break;
      case 6: obstacle.addImage(obstacleImage6);
      break;
      default: break;
    }
    obstacle.velocityX = -4;
    
    obstacle.lifetime = width + 250;
    
    obstacleGroup.add(obstacle);
    
    }
}

function showPlatforms() {
  if (frameCount % 50 === 0) {
    floating_platforms = createSprite(width, 0, 60, 10);
    floating_platforms.y = Math.round(random(50, ground.y - 125))
    invisibleplatform = createSprite(floating_platforms.x, floating_platforms.y, 60, 4);
    invisibleplatform.visible = false;
    floating_platforms.velocityX = -4
    floating_platforms.lifetime = width + 250;
    invisibleplatform.velocityX = -4
    invisibleplatform.lifetime = width + 250;
    
    floatingplatformGroup.add(floating_platforms);
    invisibleGroup.add(invisibleplatform);
  }
  
  if (frameCount % 285 === 0) {
    jumpplatform = createSprite(width, 0, 30, 10);
    jumpplatform.y = Math.round(random(50, ground.y - 125))
    jumpplatform.shapeColor = ("orange")
    invisibleplatform = createSprite(jumpplatform.x, jumpplatform.y, 30, 4);
    invisibleplatform.visible = false;
    jumpplatform.velocityX = -4
    jumpplatform.lifetime = width + 250;
    invisibleplatform.velocityX = -4
    invisibleplatform.lifetime = width + 250;
    
    jumpplatformGroup.add(jumpplatform);
    invisibleGroup.add(invisibleplatform);
  }
}

function showtop() {
  if (frameCount % 50 === 0) {
    topPlatform = createSprite(width, 0, 400, 15);
    topPlatform.velocityX = -4
    topPlatform.lifetime = width + 250;
    
    invisibleTop = createSprite(width, 0, 400, 10);
    invisibleTop.velocityX = -4
    invisibleTop.lifetime = width + 250;
    
    topGroup.add(topPlatform);
    invisibleGroup.add(invisibleTop);
  }
}

function showLava() {
  if (frameCount % 60 === 0) {
    lava = createSprite(width, 0, 10, 5);
    lava.y =  Math.round(random(10, ground.y - 90))
    lava.shapeColor = ("red")
    lava.velocityX = -8;
    lava.lifetime = width + 250;
    
    lavaGroup.add(lava);
  }
  
  if (frameCount % 500 === 0) {
    top_blocker = createSprite(width, 20, 20, 50);
    top_blocker.shapeColor = ("red")
    top_blocker.velocityX = -4;
    top_blocker.lifetime = width + 250;
    
    lavaGroup.add(top_blocker);
  }
}

function showCoins() {
  if (frameCount % 75 === 0) {
    coin = createSprite(width, 0, 5, 5);
    coin.y = Math.round(random(10, ground.y - 20));
    coin.shapeColor = ("yellow");
    coin.velocityX = -4
    coin.lifetime = width + 250;
    
    coinGroup.add(coin);
    
  }
}

function jump() {
  trex.velocityY = -16 - (height / 44);
  
  touches = [];
}

function reset() {
  if (highscore < score) {
    highscore = score;
  }
  
  score = 0
  lives = 5;
  
  cloudGroup.destroyEach();
  obstacleGroup.destroyEach();
  floatingplatformGroup.destroyEach();
  jumpplatformGroup.destroyEach();
  invisibleGroup.destroyEach();
  topGroup.destroyEach();
  lavaGroup.destroyEach();
  coinGroup.destroyEach();
  
  gameOver.visible = false;
  restart.visible = false;
  
  trex.changeAnimation("running" ,trex_running);
  trex.y = 0;
  
  GameState = PLAY
  
  touches = [];
}

function lose_a_life() {
  if (immune === 0) {
    lives = lives - 1
    
    if (lives === 0) {
      GameState = END; 
    }
  }
}

function add_a_life() {
  if (immune === 0) {
    lives = lives + 1
  }
}

function immunity() {
  immune = 1;
}

function showLives() {
  if (frameCount % 4500 === 0) {
    life = createSprite(width, 0);
    life.y = Math.round(random(30, ground.y - 30));
    life.addImage(lifeImage);
    life.scale = 0.1
    life.velocityX = -4
    life.lifetime = width + 250;
    
    lifeGroup.add(life);
    
  }
}
