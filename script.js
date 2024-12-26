
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 1280;
canvas.height = 720;

const background = new Image();
background.src = 'background.png'; 


class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        this.topMargin = 150;
        this.mouse = { x: this.width / 2, y: this.height / 2, pressed: false };
        this.numberOfObstacles = 5;
        this.obstacles = [];
        this.player = new Player(this);
        this.init();
    }

    init() {
        let attempts = 0;
        while (this.obstacles.length < this.numberOfObstacles && attempts < 500) {
            let testObstacle = new Obstacle(this);
            let overlap = false;
            for (const obstacle of this.obstacles) {
                const dx = testObstacle.collisionX - obstacle.collisionX;
                const dy = testObstacle.collisionY - obstacle.collisionY;
                const distance = Math.hypot(dx, dy);
                const distanceBuffer = 100; // Adjusted buffer for easier placement
                const sumOfRadii =
                    testObstacle.collisionRadius +
                    obstacle.collisionRadius +
                    distanceBuffer;
                if (distance < sumOfRadii) {
                    overlap = true;
                    
                }
            }
            if (!overlap) {
                this.obstacles.push(testObstacle);
            }
            attempts++;
        }
        console.log(`${this.obstacles.length} obstacles created.`);
    }

    render(ctx) {
        ctx.drawImage(background, 0, 0, this.width, this.height); 
        this.player.draw(ctx);
        this.player.update();
        this.obstacles.forEach((obstacle) => obstacle.draw(ctx));
       
    }
}


class Player {
    constructor(game) {
        this.game = game;
        this.collisionX = this.game.width / 2;
        this.collisionY = this.game.height / 2;
        this.collisionRadius = 30;
        this.speedModifier = 3;
        this.dx = 0;
        this.dy = 0;
        this.image = document.getElementById('bull');
        this.width = 255;
        this.height = 256;
        this.spriteX = this.collisionX - this.width / 2;
        this.spriteY = this.collisionY - this.height / 2 - 100;
        this.frameX = 0;
        this.frameY = 0;
    }

    draw(ctx) {
        if (this.image && this.image.complete) {
            ctx.drawImage(
                this.image,
                this.frameX * this.width,
                this.frameY * this.height,
                this.width,
                this.height,
                this.spriteX,
                this.spriteY,
                this.width,
                this.height
            );
        } else {
            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    update() {
        this.dx = this.game.mouse.x - this.collisionX;
        this.dy = this.game.mouse.y - this.collisionY;

        const angle = Math.atan2(this.dy, this.dx);
        if (angle < -2.74 || angle > 2.74) this.frameY = 0; 
        else if (angle < -1.96) this.frameY = 1; 
        else if (angle < -1.17) this.frameY = 2; 
        else if (angle < -0.39) this.frameY = 3; 
        else if (angle < 0.39) this.frameY = 4; 
        else if (angle < 1.17) this.frameY = 5; 
        else if (angle < 1.96) this.frameY = 6; 
        else this.frameY = 7; 

        const distance = Math.hypot(this.dx, this.dy);
        if (distance > this.speedModifier) {
            const speedX = (this.dx / distance) * this.speedModifier;
            const speedY = (this.dy / distance) * this.speedModifier;
            this.collisionX += speedX;
            this.collisionY += speedY;
        }

        this.spriteX = this.collisionX - this.width / 2;
        this.spriteY = this.collisionY - this.height / 2 - 100;
    }
}

class Obstacle {
    constructor(game) {
        this.game = game;
        this.collisionRadius = 40;
        this.collisionX =
            Math.random() * (this.game.width - this.collisionRadius * 2) +
            this.collisionRadius;
        this.collisionY =
            Math.random() *
                (this.game.height - this.game.topMargin - this.collisionRadius * 2) +
            this.game.topMargin +
            this.collisionRadius;
        this.image = document.getElementById('obstacles');
        this.width = 120;
        this.height = 120;
        this.spriteX = this.collisionX - this.width / 2;
        this.spriteY = this.collisionY - this.height / 2 - 70;
        this.frameX = Math.floor(Math.random() * 4);
        this.frameY = Math.floor(Math.random() * 3);

        
        if (!this.image.complete) {
            this.image.onload = () => console.log('Obstacle image loaded');
            this.image.onerror = () => console.error('Failed to load obstacle image');
        }
    }

    draw(ctx) {
        if (this.image && this.image.complete) {
            ctx.drawImage(
                this.image,
                this.frameX * this.width,
                this.frameY * this.height,
                this.width,
                this.height,
                this.spriteX,
                this.spriteY,
                this.width,
                this.height
            );
        } else {
            ctx.fillStyle = 'green';
            ctx.beginPath();
            ctx.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
  


const game = new Game(canvas);

canvas.addEventListener('mousedown', (e) => {
    game.mouse.x = e.offsetX;
    game.mouse.y = e.offsetY;
    game.mouse.pressed = true;
});
canvas.addEventListener('mouseup', () => (game.mouse.pressed = false));
canvas.addEventListener('mousemove', (e) => {
    if (game.mouse.pressed) {
        game.mouse.x = e.offsetX;
        game.mouse.y = e.offsetY;
    }
});


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx);
    requestAnimationFrame(animate);
}

animate();
