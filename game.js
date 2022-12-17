
const canvas = document.getElementById('canvas');

const c = canvas.getContext('2d');

canvas.width = window.innerWidth;

canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById('collision');

const collision = collisionCanvas.getContext('2d');

collisionCanvas.width = window.innerWidth;

collisionCanvas.height = window.innerHeight;

let timeBetweenAsteroids = 1;

let asteroidInterval = 500;

let lastTime = 0.85;

let asteroids = [];

let score =  0;

c.font = '50px Impact';

class Asteroids {
    constructor() {
        
        this.spriteWidth = 271;
       
        this.spriteHeight = 194;
        
        this.sizeModifier = Math.random() * 0.9 + 0.6;
        
        this.width = this.spriteWidth * this.sizeModifier;
        
        this.height = this.spriteHeight * this.sizeModifier;
        
        this.y = canvas.height;
        
        this.x = Math.random() * (canvas.width - this.width);
        
        this.directionX = Math.random() * 5 - 2.5;
        
        this.directionY = Math.random() * 5 + 3;
        
        this.markedForDeletion = false;
        
        this.image = new Image();
       
        this.image.src = 'asteroids.png';
       
        this.frame = 0;
        
        this.maxFrame = 4;
       
        this.randomColor = [Math.floor(Math.random() * 255),Math.floor(Math.random() * 255),Math.floor(Math.random() * 255)];
        
        this.color = 'rgb(' + this.randomColor[0] + ',' + this.randomColor[1] + ',' + this.randomColor[2] + ')';
    }
    update(deltaTime) {
        
        this.y -= this.directionY;

        this.x += this.directionX;
        
        if(this.y < 0 - this.height) this.markedForDeletion = true;
        
        if(this.frame > this.maxFrame) this.frame = 0;
        
        else this.frame++;
    }
    draw(gameBoard) {
        
        collision.fillStyle = this.color;
        
        collision.fillRect(this.x, this.y, this.width, this.height);
       
        c.drawImage(this.image, 0, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}

function drawScore() {
   
    c.fillStyle = 'black';
    
    c.fillText('Score: ' + score, 50, 75);
    
    c.fillStyle = 'white';
    
    c.fillText('Score: ' + score, 55, 80);
}

window.addEventListener('click', function(e) {
    
    const detectColor = collision.getImageData(e.x, e.y, 1, 1);
    
    console.log(detectColor);
    
    const Color = detectColor.data;
    
    asteroids.forEach(object => {
        if(object.randomColor[0] === Color[0] && object.randomColor[1] === Color[1] && object.randomColor[2] === Color[2]) {
            object.markedForDeletion = true;
            
            score++;
        }
    });
    Explosion();
});


const asteroid = new Asteroids();

function animate(timestamp) {
    
    c.clearRect(0, 0, canvas.width, canvas.height);
    
    collision.clearRect(0, 0, canvas.width, canvas.height);
    
    let deltaTime = timestamp - lastTime;
    
    lastTime = timestamp;
    
    timeBetweenAsteroids += deltaTime;
    
    if(timeBetweenAsteroids > asteroidInterval) {
        asteroids.push(new Asteroids());
        timeBetweenAsteroids = 0;
        asteroids.sort(function(a,b){
            return a.width - b.width;
        });
    }
    
    drawScore();
    
    [...asteroids].forEach(object => object.update(deltaTime));
    
    [...asteroids].forEach(object => object.draw());
    
    asteroids = asteroids.filter(object => !object.markedForDeletion);
    
    requestAnimationFrame(animate);
}

animate(0);