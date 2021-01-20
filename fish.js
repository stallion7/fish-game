// Canvas setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 950;
canvas.height= 650;

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';
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
canvas.addEventListener('mousedown', function(){
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
    }
    draw(){
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
        ctx.fillRect(this.x,this.y,this.radius,10);

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
        this.spriteWidth2 = 550;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
        this.food = Math.random() <= 0.5 ? 'food1' : 'food2';

    }
    update(){
        this.y += this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx*dx + dy*dy);
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
    }
    for(let i = 0; i < bubbleArray.length; i++){
        if(bubbleArray[i].distance < bubbleArray[i].radius + player.radius){
            if(!bubbleArray[i].counted){
                if (bubbleArray[i].sound == 'sound1'){
                    bubblePop1.play();
                } else {
                    bubblePop2.play();
                }
                score++;
                bubbleArray[i].counted = true;
                bubbleArray.splice(i, 1);
            }
        }
    }

}

// Animation Loop
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBubbles();
    player.update();
    player.draw();
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 15, 45);
    gameFrame++;
    requestAnimationFrame(animate);
}
animate();

    