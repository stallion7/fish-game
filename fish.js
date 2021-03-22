// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 950;
canvas.height= 650;

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';
let gameSpeed = 1;
let gameOver = false;
// Mouse Interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width/2,
    y: canvas.height/2,
    click: false
}
canvas.addEventListener('mousemove', function(event){
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left ;
    mouse.y = event.y - canvasPosition.top ;
});
canvas.addEventListener('mouseup', function(){
    mouse.click = false;
});
// Player
const playerLeft = new Image();
playerLeft.src = 'img/fish.png';
const playerRight = new Image();
playerRight.src = 'img/fish2.png';
class Player {
    constructor(){
        this.x = 0;
        this.y = canvas.height/2;
        this.radius = 25;
        this.angle = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteHeight = 327;
        this.spriteWidth = 498;
    }
    update(){

        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        let theta = Math.atan2(dy, dx);
        this.angle = theta;
        if (mouse.x != this.x) {
            this.x -= dx/50;
        }
        if (mouse.y != this.y) {
            this.y -= dy/50;
        }
       if(gameFrame % 5 == 0){
            this.frame++;
            if(this.frame >= 12) this.frame = 0;
            if(this.frame == 3 || this.frame == 7 || this.frame == 11){
                this.frameX = 0;
            } else {
                this.frameX++;
            }
            if (this.frame < 3) this.frameY = 0;
            else if (this.frame < 7) this.frameY = 1;
            else if (this.frame < 11) this.frameY = 2;
            else this.frameY = 0;
        }
    }
    draw(){

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        if (this.x >= mouse.x){
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth,
            this.frameY * this.spriteHeight,
            this.spriteWidth, this.spriteHeight,
            0-50, 0-35, this.spriteWidth/5, this.spriteHeight/5);
        } else {
        ctx.drawImage(playerRight, this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth, this.spriteHeight,
        0-50, 0-35, this.spriteWidth/5, this.spriteHeight/5);
        }
        ctx.restore();
    }
}
const player = new Player();

// Bubbles
const bubbleArray = [];
const foodMix = new Image();
foodMix.src = 'img/food1.png';
const foodMix2 = new Image();
foodMix2.src = 'img/food2.png';
class Bubble {
    constructor(){
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * 0;
        this.radius = 15;
        this.frameX = 0;
        this.frameY = 0;
        this.frame = 0;
        this.spriteHeight = 327;
        this.spriteWidth = 520;
        this.spriteWidth2 = 580;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
        this.food = Math.random() <= 0.5 ? 'food1' : 'food2';

    }
    draw(){
        if(this.food == 'food1'){
        ctx.drawImage(foodMix, this.frameX * this.spriteWidth,
            this.frameY * this.spriteHeight,
            this.spriteWidth, this.spriteHeight,
            this.x-35, this.y-20, this.spriteWidth/7, this.spriteHeight/7);
        }else{
        ctx.drawImage(foodMix2, this.frameX * this.spriteWidth2,
            this.frameY * this.spriteHeight,
            this.spriteWidth2, this.spriteHeight,
            this.x-35, this.y-20, this.spriteWidth/7, this.spriteHeight/6);
        }
    }
update(){
    this.y += this.speed;
    const dx = this.x - player.x;
    const dy = this.y - player.y;
    this.distance = Math.sqrt(dx*dx + dy*dy);
}
}
const bubblePop1 = document.createElement('audio');
bubblePop1.src = 'audio/eat2.mp3';
const bubblePop2 = document.createElement('audio');
bubblePop2.src = 'audio/eat.mp3';

function handleBubbles(){
    if (gameFrame % 75 == 0){
        bubbleArray.push(new Bubble());
    }
    for(let i = 0; i < bubbleArray.length; i++){
        bubbleArray[i].update();
        bubbleArray[i].draw();
        if (bubbleArray[i].y < 0 - bubbleArray[i].radius * 2){
            bubbleArray.splice(i, 1);
        i--;
        } else if(bubbleArray[i].distance < bubbleArray[i].radius + player.radius){
            if(!bubbleArray[i].counted){
                if (bubbleArray[i].sound == 'sound1'){
                    bubblePop1.play();
                } else {
                    bubblePop2.play();
                }
                score++;
                bubbleArray[i].counted = true;
                bubbleArray.splice(i, 1);
                i--;
            }
        }
    }
    for (let i =0; i < bubbleArray.length; i++){

    }
}

// reapeating background
const background = new Image();
background.src = 'img/vlny2.png';

const BG = {
    x1: 0,
    x2: canvas.width,
    y: 0,
    width: canvas.width,
    height: canvas.height
}

function handleBackground(){
    BG.x1-= gameSpeed;
    if (BG.x1 < -BG.width) BG.x1 = BG.width;
    ctx.drawImage(background, BG.x1, BG.y, BG.width, BG.height);
    BG.x2-= gameSpeed;
    if (BG.x2 < -BG.width) BG.x2 = BG.width;
    ctx.drawImage(background, BG.x2, BG.y, BG.width, BG.height);
}
// create enemy
const enemyImage = new Image();
enemyImage.src = 'img/enemyfish.png';
class Enemy{
    constructor(){
        this.x = canvas.width + 200;
        this.y = Math.random() * (canvas.height - 150) + 90;
        this.radius = 52;
        this.speed = Math.random() * 2 + 2;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 418;
        this.spriteHeight = 397;
    }
    draw(){
        /*ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y,this.radius, 0, Math.PI * 2);
        ctx.fill();*/
        ctx.drawImage(enemyImage, this.frameX * this.spriteWidth,this.frameY * this.spriteHeight,
        this.spriteWidth, this.spriteHeight,  this.x-50, this.y-52, this.spriteWidth/4, this.spriteHeight/4);
    }
    update(){
        this.x -= this.speed;
        if(this.x < 0 - this.radius * 2){
            this.x = canvas.width + 200;
            this.y = Math.random() * (canvas.height - 150) + 90;
            this.speed = Math.random() * 2 + 2;
        }
        if(gameFrame % 5 == 0){
            this.frame++;
            if(this.frame >= 12) this.frame = 0;
            if(this.frame == 3 || this.frame == 7 || this.frame == 11){
            this.frameX = 0;
            } else {
                this.frameX++;
            }
            if(this.frame < 3) this.frameY = 0;
            else if (this.frame < 7) this.frameY = 1;
            else if (this.frame < 11) this.frameY = 2;
            else this.frameY = 0;
        }
        // collision with player
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy* dy);
        if (distance < this.radius + player.radius){
            handleGameOver();
        }
    }
}

const enemyfish = new Enemy();
function handleEnemy(){
    enemyfish.draw();
    enemyfish.update();
}

function handleGameOver(){
    ctx.fillStyle = 'lightblue';
    ctx.fillText('Game Over - dosáhl jsi skore: ' + score, 130, 320);
    gameOver = true;

}
// create enemy n.2
const enemyImage2 = new Image();
enemyImage2.src = 'img/enemyfish2.png'

class Enemy2 {
    constructor (){
        this.x = canvas.width - 1500;
        this.y = Math.random() * (canvas.height - 150) + 90;
        this.radius = 52;
        this.speed = Math.random() * 2 + 2;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 418;
        this.spriteHeight = 397;
    }
    draw(){
        /*ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();*/
        ctx.drawImage(enemyImage2, this.frameX * this.spriteWidth,this.frameY * this.spriteHeight,
            this.spriteWidth, this.spriteHeight,  this.x-60, this.y-52, this.spriteWidth/4, this.spriteHeight/4);
        
    }
    update(){
        this.x += this.speed;
        if(this.x > canvas.width + this.radius *2){
            this.x = canvas.width - 1150;
            this.y = Math.random() * (canvas.height - 150) + 90;
            this.speed = Math.random() * 2 + 2;
        }
        if (gameFrame % 5 == 0){
            this.frame++;
            if (this.frame >= 12) this.frame = 4;
            if (this.frame == 0 || this.frame == 4 || this.frame == 8){
                this.frameX = 0;
            } else{
                this.frameX++;
            }
            if (this.frame < 3) this.frameY = 0;
            else if (this.frame < 7) this.frameY = 1;
            else if (this.frame < 11) this.frameY = 2;
            else this.frameY = 0;
        }
    }
}
const enemyfish2 = new Enemy2();
function handleEnemy2(){
    enemyfish2.draw();
    enemyfish2.update();
}

// Animation Loop
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBackground();
    handleBubbles();
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 15, 45);
    player.update();
    player.draw();
    handleEnemy();
    handleEnemy2();
    gameFrame++;
    if (!gameOver)requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
});
