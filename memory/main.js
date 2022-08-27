
let level = 0;

let state = "pauseclick"

let board_width = 3;
let board_height = 3;

let boardSquares;
let goodSquaresCount;
let clickedGoodSquaresCount;

let errorCount = 0;

const size = () => {
    let w = board_width, h = board_height;
    if (width > height) {
        w = board_height;
        h = board_width;
    }
    return min(width / w, height / (h + 1.3)) - 10
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    newLevel();
}

function draw() {
    background(48, 48, 100);

    noStroke();
    fill(255);

    drawScore();

    for (let x = 0; x < board_width; x++) {
        for (let y = 0; y < board_height; y++) {
            const square = boardSquares[x][y];
            if (square.error) fill(255, 100, 100);
            else if (square.clicked) fill(255);
            else if (square.good && state == "mostrar") fill(255);
            else if (square.good && state == "gameover") fill(100, 230, 100);
            else fill(100, 100, 120);
            rect(...squareRect(x, y, .1, .2));
        }
    }

}

function drawScore() {
    textSize(0.8 * size());
    textAlign(CENTER, CENTER);
    text(
        level,
        width / 2,
        height * 0.6 - (0.6 + (width < height ? board_height / 2 : board_width / 2)) * size()
    );
}

function newLevel() {
    errorCount = 0;
    goodSquaresCount = 0;
    clickedGoodSquaresCount = 0;
    level += 1;

    if (level % 5 == 0) board_width++;
    else if (level % 2 == 0) board_height++;

    boardSquares = [];
    for (let x = 0; x < board_width; x++) {
        boardSquares.push(Array(board_height).fill(0).map(() => ({})));
    }

    for (let i = 0; i < random(level + 2, 1.3 * level + 3); i++) {
        const x = floor(random(0, board_width)), y = floor(random(0, board_height));
        if (!boardSquares[x][y].good) {
            boardSquares[x][y] = { good: true };
            goodSquaresCount++;
        }
    }

    if (level == 1) {
        state = "pauseclick";
    }
    else {
        state = "pause";
        setTimeout(() => state = "mostrar", 1000);
        setTimeout(() => state = "recordar", 2500);
    }
}

function mouseDragged() {
    if (state != "gameover")
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

    let w = board_width, h = board_height;

    if (state == "gameover") {
        level = 0;
        board_width = 3;
        board_height = 3;
        newLevel();
    }
    else if (state == "pauseclick") {
        setTimeout(() => state = "mostrar", 300);
        setTimeout(() => state = "recordar", 1800);
    }
    else if (state == "recordar") {

        for (let x = 0; x < w; x++) {
            for (let y = 0; y < h; y++) {
                if (overRect(...squareRect(x, y, .3))) {
                    if (boardSquares[x][y].good) {
                        if (!boardSquares[x][y].clicked) {
                            boardSquares[x][y].clicked = true;
                            clickedGoodSquaresCount++;
                            if (clickedGoodSquaresCount == goodSquaresCount) {
                                state = "win"
                                setTimeout(newLevel, 1000);
                            }
                        }
                    } else if (!boardSquares[x][y].error) {
                        boardSquares[x][y].error = true;
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
document.oncontextmenu = () => false;

function squareRect(x, y, margin, round) {
    let w = board_width, h = board_height;
    if (width > height) {
        w = board_height;
        h = board_width;
        let temp_x = x;
        x = y;
        y = temp_x;
    }

    const offset_x = width / 2;
    const offset_y = height * 0.6;
    
    const rect = [
        offset_x + size() * (x + margin / 2 - w / 2),
        offset_y + size() * (y + margin / 2 - h / 2),
        size() * (1 - margin),
        size() * (1 - margin)
    ];

    if (round) return [...rect, size() * round];
    return rect;
}