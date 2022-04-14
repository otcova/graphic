let boxA = {
    vel: 0,
    pos: 0.2,
    mass: 1,
};

let boxB = {
    vel: -1,
    pos: 0.6,
    mass: 1,
};

let collisionCounter = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    boxA.size = Math.pow(boxA.mass, 1 / 12) / 25;
    boxB.size = Math.pow(boxB.mass, 1 / 12) / 25;
}

function draw() {
    background(48);

    noStroke();
    fill(255);
    textSize(24);
    textAlign(CENTER, BOTTOM);
    drawBox(boxA);
    drawBox(boxB);

    const quality = boxB.pos > .25 ? 1 : 100000;

    for (let i = 0; i < 5 * quality; i++) {
        boxA.pos += boxA.vel / (2000 * quality);
        boxB.pos += boxB.vel / (2000 * quality);

        if (boxA.pos < .05) {
            collisionCounter++;
            boxA.pos = .05;
            boxA.vel = -boxA.vel;
        }
        if (boxA.pos + boxA.size > boxB.pos) {
            collisionCounter++;
            let v1 = boxA.vel;
            let v2 = boxB.vel;
            boxA.vel = collision(v1, boxA.mass, v2, boxB.mass);
            boxB.vel = collision(v2, boxB.mass, v1, boxA.mass);
        }
    }
    textSize(24);
    textAlign(RIGHT, TOP);
    fill(255);
    text("Collisions: " + collisionCounter, width - 20, 20)

    fill(170, 120, 100);
    rect(0, height * 0.8 - 1, width, height);
    rect(0, 0, width * 0.05, height);
}

function touchStarted() {
    mouseButton = LEFT;
    mousePressed();
    return false;
}

function mousePressed() {
    boxA.pos = 0.2;
    boxA.vel = 0;
    boxA.mass = 1;
    boxA.size = Math.pow(boxA.mass, 1 / 12) / 25;

    boxB.pos = 0.6;
    boxB.vel = -1;
    if (mouseButton == LEFT) boxB.mass = boxB.mass * 100;
    if (boxB.mass > 1000000000000) boxB.mass = 1;
    boxB.size = Math.pow(boxB.mass, 1 / 12) / 25;

    collisionCounter = 0;
}

function drawBox(b) {
    text(b.mass, b.pos * width + b.size * width / 2, height * .8 - b.size * width);
    rect(b.pos * width, height * .8, b.size * width, -b.size * width);
}

function collision(v1, m1, v2, m2) {
    return ((m1 - m2) / (m1 + m2)) * v1 + ((2 * m2) / (m1 + m2)) * v2;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
document.oncontextmenu = function () {
    return false;
}