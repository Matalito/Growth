const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let lastPressedX = '';
let lastPressedY = '';
//ctx.textAlign = "center";
//ctx.textBaseline = "middle";
ctx.font = "50px Trebuchet MS";
let isPunching;
let badGuy;
let clickXY;
let punchIntervalID;
let immunity;
let kills = 0;

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

function moveAtoB(x1, y1, x2, y2, distance) {
    const pointA = [x1, y1];
    const pointB = [x2, y2];
    const vectorAB = [pointB[0] - pointA[0], pointB[1] - pointA[1]];
    const magnitudeAB = Math.sqrt(vectorAB[0] ** 2 + vectorAB[1] ** 2);
    const directionVector = [vectorAB[0] * (distance / magnitudeAB), vectorAB[1] * (distance / magnitudeAB)];
    newXY = [pointA[0] + directionVector[0], pointA[1] + directionVector[1]];
    return newXY;
}

class Player {
    constructor() {
        this.size = { x: 30, y: 30 };
        this.color = 'white';
        this.position = { x: 640, y: 360 };
        this.velocity = 10;
        this.healthMax = 100;
        this.healthCurrent = 100;
        this.damageCurrent = this.healthMax - this.healthCurrent;
        this.damageSquareMax = 15;
        this.damageSquareCurrent = this.damageSquareMax * (this.damageCurrent / this.healthMax);
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;
        this.newXY = [];
        this.punchBox = {
            left: this.newXY[0] - 10,
            right: this.newXY[0] + 10,
            top: this.newXY[1] - 10,
            bottom: this.newXY[1] + 10
        };

    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.size.y, this.size.x);
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x + 15 - this.damageSquareCurrent, this.position.y + 15 - this.damageSquareCurrent, this.damageSquareCurrent * 2, this.damageSquareCurrent *2);
        
        if (damagePlayer()) {
            this.healthCurrent -= badGuy.strength;
            this.damageCurrent = this.healthMax - this.healthCurrent;
            this.damageSquareCurrent = this.damageSquareMax * (this.damageCurrent / this.healthMax);
            setTimeout(() => {
                immunity = false;
            }, 350)
        }
    }

    punch() {
        if (isPunching) {
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.moveTo(this.position.x + 10, this.position.y + 10);
            ctx.lineTo(this.position.x + 20, this.position.y + 10);
            ctx.lineTo(this.position.x + 20, this.position.y + 20);
            ctx.lineTo(this.position.x + 10, this.position.y + 20);
            ctx.fill();
            ctx.moveTo(this.newXY[0] - 5, this.newXY[1] - 5);
            ctx.lineTo(this.newXY[0] + 5, this.newXY[1] - 5);
            ctx.lineTo(this.newXY[0] + 5, this.newXY[1] + 5);
            ctx.lineTo(this.newXY[0] - 5, this.newXY[1] + 5);
            ctx.fill();
            ctx.moveTo(this.position.x + 10, this.position.y + 10);
            ctx.lineTo(this.newXY[0] - 5, this.newXY[1] + 5);
            ctx.lineTo(this.newXY[0] + 5, this.newXY[1] + 5);
            ctx.lineTo(this.position.x + 20, this.position.y + 10);
            ctx.fill();
            ctx.moveTo(this.position.x + 20, this.position.y + 10);
            ctx.lineTo(this.newXY[0] - 5, this.newXY[1] - 5);
            ctx.lineTo(this.newXY[0] - 5, this.newXY[1] + 5);
            ctx.lineTo(this.position.x + 20, this.position.y + 20);
            ctx.fill();
            ctx.moveTo(this.position.x + 20, this.position.y + 20);
            ctx.lineTo(this.newXY[0] + 5, this.newXY[1] - 5);
            ctx.moveTo(this.newXY[0] - 5, this.newXY[1] - 5);
            ctx.lineTo(this.position.x + 10, this.position.y + 20);
            ctx.fill();
            ctx.moveTo(this.position.x + 10, this.position.y + 20);
            ctx.lineTo(this.newXY[0] + 5, this.newXY[1] + 5);
            ctx.lineTo(this.newXY[0] + 5, this.newXY[1] - 5);
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
        this.punchBox = {
            left: this.newXY[0] - 5,
            right: this.newXY[0] + 5,
            top: this.newXY[1] - 5,
            bottom: this.newXY[1] + 5
        }
        pOne.punch();
        pOne.moveX();
        pOne.moveY();
    }
}
const pOne = new Player();

class Baddie {
    constructor({ size, health, color, velocity, strength }) {
        this.size = size;
        this.healthMax = health;
        this.healthCurrent = health;
        this.healthbarMax = 30;
        this.healthbarCurrent = 30 * (this.healthCurrent / this.healthMax);
        this.color = color;
        this.position = { x: Math.random() * canvas.width, y: Math.random() * canvas.height };
        this.velocity = velocity;
        this.newXY = [];
        this.strength = strength;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y - 6, this.healthbarCurrent, 3);
        if (checkPunch()) {
            this.healthbarCurrent = 30 * (this.healthCurrent / this.healthMax);
        }
    }

    move() {
        if (!checkPunch()) {
            this.newXY = moveAtoB(this.position.x, this.position.y, pOne.position.x, pOne.position.y, this.velocity);
            this.position.x = this.newXY[0];
            this.position.y = this.newXY[1];
        } else {
            this.newXY = moveAtoB(this.position.x, this.position.y, clickXY[0], clickXY[1], 30);
            this.position.x = this.newXY[0];
            this.position.y = this.newXY[1];
        }
    }

    update() {
        badGuy.draw();
        badGuy.move();
    }
}

function genBaddies() {
    badGuy = new Baddie({
        size: { x: 10 + Math.random() * 40, y: 10 + Math.random() * 40 },
        health: 20 + Math.random() * 80,
        color: getRandomColor(),
        velocity: 1 + Math.random() * 5,
        strength: 1 + Math.random() * 8
    })
    return badGuy
}
genBaddies()

function checkBaddies() {
    if (badGuy) {
        badGuy.update();
    } else {
        genBaddies();
    }
}

document.onkeydown = function (e) {
    if (e.key === 'a') {
        pOne.moveLeft = true;
        lastPressedX = 'a';
    }
    if (e.key === 'd') {
        pOne.moveRight = true;
        lastPressedX = 'd';
    }
    if (e.key === 'w') {
        pOne.moveUp = true;
        lastPressedY = 'w';
    }
    if (e.key === 's') {
        pOne.moveDown = true;
        lastPressedY = 's';
    }
}

document.onkeyup = function (e) {
    if (e.key === 'a') {
        pOne.moveLeft = false;
        lastPressedX = 'd';
    }
    if (e.key === 'd') {
        pOne.moveRight = false;
        lastPressedX = 'a';
    }
    if (e.key === 'w') {
        pOne.moveUp = false;
        lastPressedY = 's';
    }
    if (e.key === 's') {
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
        badGuy.healthCurrent -= 5;
    }
    if (badGuy.healthCurrent <= 0) {
        badGuy = '';
        kills ++;
    }
}

function damagePlayer() {
    if(badGuy && !immunity){
    if (badGuy.position.x <= pOne.position.x + pOne.size.x &&
        badGuy.position.x + badGuy.size.x >= pOne.position.x &&
        badGuy.position.y <= pOne.position.y + pOne.size.y &&
        badGuy.position.y + badGuy.size.y >= pOne.position.y) {
            immunity = true;
            return true;
        }
    }
}

function checkPunching() {
    isPunching = true;  
    pOne.newXY = moveAtoB(pOne.position.x + 15, pOne.position.y + 15, clickXY[0], clickXY[1], 30)
    checkPunch();
    damageBadGuy();
    setTimeout(() => {
        isPunching = false;
    }, 40)
}

document.onmousedown = function (e) {
    clickXY = [e.clientX, e.clientY];
    checkPunching();
    punchIntervalID = setInterval(() => { 
        document.onmousemove = function (f) {
        clickXY = [f.clientX, f.clientY];}    
        checkPunching()}, 150)
}

document.onmouseup = function() {
    clearInterval(punchIntervalID);
}

document.oncontextmenu = function(e) {
    e.preventDefault();
}

function animate() {
    if (pOne.healthCurrent > 0) {
    initialDraw();
    pOne.update();
    checkBaddies();
    window.requestAnimationFrame(animate);
    } else {
        ctx.fillStyle = 'black';
        ctx.fillRect (canvas.width/4, canvas.height/4, canvas.width/2, canvas.height/2);
        ctx.fillStyle = 'limegreen';        
        ctx.font = "80px Trebuchet MS";
        ctx.fillText('You Died Sucka!',canvas.width/4 + 50, canvas.height/2);
        ctx.fillStyle = 'red';
        ctx.fillText(`Kills: ${kills}`, canvas.width/2 - 100, canvas.height/2 + 90)
    }
}

animate();