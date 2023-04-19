const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let lastPressedX = '';
let lastPressedY = '';
let isPunching = false;
let punchXY = '';
let badGuy = '';

window.addEventListener('resize', resizeCanvas);
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();

function initialDraw() {
    ctx.fillStyle = 'grey';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

class Player {
    constructor() {
        this.size = { x: 30, y: 30 }
        this.color = getRandomColor();//'green';
        this.position = { x: 640, y: 360 };
        this.velocity = 10
        this.moveLeft = false
        this.moveRight = false
        this.moveUp = false
        this.moveDown = false
        this.punchBox = {
            left: punchXY[0] - 5,
            right: punchXY[0] + 5,
            top: punchXY[1] - 5,
            bottom: punchXY[1] + 5
        }
        
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.size.y, this.size.x);
    }

    punch() {
        if (isPunching === true) {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.moveTo(this.position.x + 10, this.position.y + 10);
            ctx.lineTo(this.position.x + 20, this.position.y + 10);
            ctx.lineTo(this.position.x + 20, this.position.y + 20);
            ctx.lineTo(this.position.x + 10, this.position.y + 20);
            ctx.fill();
            ctx.moveTo(punchXY[0] - 5, punchXY[1] - 5);
            ctx.lineTo(punchXY[0] + 5, punchXY[1] - 5);
            ctx.lineTo(punchXY[0] + 5, punchXY[1] + 5);
            ctx.lineTo(punchXY[0] - 5, punchXY[1] + 5);
            ctx.fill();
            ctx.moveTo(this.position.x + 10, this.position.y + 10);
            ctx.lineTo(punchXY[0] - 5, punchXY[1] + 5);
            ctx.lineTo(punchXY[0] + 5, punchXY[1] + 5);
            ctx.lineTo(this.position.x + 20, this.position.y + 10);
            ctx.fill();
            ctx.moveTo(this.position.x + 20, this.position.y + 10);
            ctx.lineTo(punchXY[0] - 5, punchXY[1] - 5);
            ctx.lineTo(punchXY[0] - 5, punchXY[1] + 5);
            ctx.lineTo(this.position.x + 20, this.position.y + 20);
            ctx.fill();
            ctx.moveTo(this.position.x + 20, this.position.y + 20);
            ctx.lineTo(punchXY[0] + 5, punchXY[1] - 5);
            ctx.moveTo(punchXY[0] - 5, punchXY[1] - 5);
            ctx.lineTo(this.position.x + 10, this.position.y + 20);
            ctx.fill();
            ctx.moveTo(this.position.x + 10, this.position.y + 20);
            ctx.lineTo(punchXY[0] + 5, punchXY[1] + 5);
            ctx.lineTo(punchXY[0] + 5, punchXY[1] - 5);
            ctx.lineTo(this.position.x + 10, this.position.y + 10);
            ctx.fill();
        }
    }


    moveX() {
        if (this.moveLeft === true && this.position.x > 0 && lastPressedX === 'a') {
            this.position.x -= this.velocity;
        } else if (this.moveRight === true && this.position.x + this.size.y < canvas.width && lastPressedX === 'd') {
            this.position.x += this.velocity;
        }
    }

    moveY() {
        if (this.moveUp === true && this.position.y > 0 && lastPressedY === 'w') {
            this.position.y -= this.velocity;
        } else if (this.moveDown === true && this.position.y + this.size.x < canvas.height && lastPressedY === 's') {
            this.position.y += this.velocity;
        }
    }

    update() {
        pOne.draw();
        this.punchBox.left = punchXY[0] - 5;
        this.punchBox.right = punchXY[0] + 5;
        this.punchBox.top = punchXY[1] - 5;
        this.punchBox.bottom = punchXY[1] + 5;

        pOne.moveX();
        pOne.moveY();
        pOne.punch();
    }
}
const pOne = new Player();

class Baddie {
    constructor({ size, health, color, velocity }) {
        this.size = size
        this.health = health
        this.color = color
        this.position = { x: Math.random() * canvas.width, y: Math.random() * canvas.height }
        this.velocity = velocity
    }

    draw() {
        ctx.fillStyle = this.color
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y)
    }

    move() {
        this.position
    }

    update() {
            badGuy.draw()
    }
}

function genBaddies() {
    badGuy = new Baddie({
        size: { x: 1 + Math.random() * 40, y: 1 + Math.random() * 40 },
        health: 20 + Math.random() * 80,
        color: getRandomColor(),
        velocity: 1 + Math.random() * 8
    })
    return badGuy
}
genBaddies()


document.onkeydown = function (pressed) {
    if (pressed.key === 'a') {
        pOne.moveLeft = true;
        lastPressedX = 'a';
    }
    if (pressed.key === 'd') {
        pOne.moveRight = true;
        lastPressedX = 'd';
    }
    if (pressed.key === 'w') {
        pOne.moveUp = true;
        lastPressedY = 'w';
    }
    if (pressed.key === 's') {
        pOne.moveDown = true;
        lastPressedY = 's';
    }
}

document.onkeyup = function (pressed) {
    if (pressed.key === 'a') {
        pOne.moveLeft = false;
        lastPressedX = 'd';
    }
    if (pressed.key === 'd') {
        pOne.moveRight = false;
        lastPressedX = 'a';
    }
    if (pressed.key === 'w') {
        pOne.moveUp = false;
        lastPressedY = 's';
    }
    if (pressed.key === 's') {
        pOne.moveDown = false;
        lastPressedY = 'w';
    }
}

function checkPunch() {
    if (isPunching && badGuy) {
        return (
            pOne.punchBox.right >= badGuy.position.x &&
            pOne.punchBox.left <= badGuy.position.x + badGuy.size.x &&
            pOne.punchBox.bottom >= badGuy.position.y &&
            pOne.punchBox.top <= badGuy.position.y + badGuy.size.y
        )
    }
}

function damageBadGuy() {
    if (checkPunch()) {
        badGuy.health -= 5
    }
    if (badGuy.health <= 0) {
        badGuy = '';
    }
}

document.onmousedown = function (click) {
    isPunching = true;
    const pointB = [click.clientX, click.clientY];
    const pointA = [pOne.position.x + 15, pOne.position.y + 15];
    const vectorAB = [pointB[0] - pointA[0], pointB[1] - pointA[1]];
    const magnitudeAB = Math.sqrt(vectorAB[0] ** 2 + vectorAB[1] ** 2);
    const directionVector = [vectorAB[0] * (30 / magnitudeAB), vectorAB[1] * (30 / magnitudeAB)];
    punchXY = [pointA[0] + directionVector[0], pointA[1] + directionVector[1]];
    checkPunch();
    damageBadGuy();
    console.log(badGuy.health);
    setTimeout(() => {
        isPunching = false;
    }, 25)
}

function animate() {
    initialDraw();
    pOne.update();
    if (badGuy) {
    badGuy.update();    
    }
    window.requestAnimationFrame(animate);
}

animate();