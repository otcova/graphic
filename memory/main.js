
let level = 0;

let state = "pauseclick"

let w = 3;
let h = 3;

let matrixReal;
let matrixRealCount;
let matrix;
let matrixCount;

let errorCount = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    newLevel();
}

function draw() {
    background(48, 48, 100);

    translate(width / 2, height * 0.6);
    scale(min(width / w, height / (h + 1.3)) - 10);
    noStroke();
    fill(255);

    textSize(0.8);
    textAlign(CENTER, CENTER);
    text(level, 0, -h / 2 - 0.65);

    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            if (state == "mostrar") {
                if (matrixReal[x][y]) fill(255);
                else fill(100, 100, 120);
            } else if (state == "recordar" || state == "win") {
                if (matrix[x][y] == "error") fill(255, 100, 100);
                else if (matrix[x][y]) fill(255);
                else fill(100, 100, 120);
            } else if (state == "gameover") {
                if (matrix[x][y] == "error") fill(255, 100, 100);
                else if (matrix[x][y]) fill(255);
                else if (matrixReal[x][y]) fill(100, 230, 100);
                else fill(100, 100, 120);
            } else if (state == "pause" || state == "pauseclick") {
                fill(100, 100, 120);
            }
            rect(x + 0.05 - w / 2, y + 0.1 - h / 2, 0.9, 0.9, 0.2);
        }
    }
}

function newLevel() {
    errorCount = 0;
    matrixRealCount = 0;
    matrixCount = 0;
    level += 1;

    if (level % 5 == 0) w++;
    else if ((level - 3) % 4 == 0) h++;

    matrixReal = [];
    matrix = [];
    for (let x = 0; x < w; x++) {
        matrixReal.push([]);
        matrix.push([]);
        for (let y = 0; y < h; y++) {
            matrixReal[x].push(false);
            matrix[x].push(false);
        }
    }

    for (let i = 0; i < random(level + 2, 1.3 * level + 3); i++) {
        matrixReal[parseInt(random(0, w))][parseInt(random(0, h))] = true;
    }

    for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
            if (matrixReal[x][y]) matrixRealCount++;
        }
    }
    if (level == 1) {
        state = "pauseclick"
    }
    else {
        state = "pause";
        setTimeout(function () {
            state = "mostrar";
        }, 1000);
        setTimeout(function () {
            state = "recordar";
        }, 2500);
    }
}

function mouseDragged() {
    mousePressed();
}

function touchStarted() {
    if (!fullscreen()) {
        fullscreen(true);
        setTimeout(function () {
            fullscreen(true);
        }, 100);
    } else {
        mouseX = touches[touches.length - 1].x;
        mouseY = touches[touches.length - 1].y;
        mousePressed();
    }
    return false;
}


function mousePressed() {

    if (state == "gameover") {
        level = 0;
        w = 3;
        h = 3;
        newLevel();
    }
    else if (state == "pauseclick") {
        setTimeout(function () {
            state = "mostrar";
        }, 300);
        setTimeout(function () {
            state = "recordar";
        }, 1800);
    }
    else if (state == "recordar") {

        let tx = width / 2;
        let ty = height * 0.6;
        let s = min(width / w, height / (h + 1)) - 10;

        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                if (overRect(tx + s * (x + 0.05 - w / 2), ty + s * (y + 0.1 - h / 2), s * 0.9, s * 0.9)) {
                    if (matrixReal[x][y]) {
                        if (matrix[x][y] != true) {
                            matrix[x][y] = true;
                            matrixCount++;
                            if (matrixCount == matrixRealCount) {
                                state = "win"
                                setTimeout(newLevel, 1000);
                            }
                        }
                    } else if (matrix[X][y] != "error") {
                        matrix[x][y] = "error";
                        errorCount++;
                        if (errorCount >= 2) {
                            state = "gameover"
                        }
                    }
                }
            }
        }
    }
}

function overRect(x, y, width, height) {
    if (mouseX >= x && mouseX <= x + width &&
        mouseY >= y && mouseY <= y + height) {
        return true;
    } else {
        return false;
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
document.oncontextmenu = function () {
    return false;
}
