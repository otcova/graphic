let hand = {
    straightMin: 3,
    straightMax: 5
}

let planellIndex = 0;
let mX = 0,
    mY = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(15);
}

function draw() {
    background(255);
    if (windowWidth < windowHeight) {
        height = windowWidth;
        width = windowHeight;
        mX = mouseY;
        mY = mouseX;
        translate(windowWidth, 0);
        rotate(HALF_PI);
    } else {
        mX = mouseX;
        mY = mouseY;
    }
    translate(0, height / 2);
    randomSeed(parseInt(frameCount / 2));
    
    hand.straightMin = 15*mX/width;
    hand.straightMax = 15*mX/width + 3;
    
    if (planellIndex === 0) {
        fill(30, 40, 200);
        handRect(150, -50, width - 300, 100);
        fill(200, 40, 30);
        handEllipse(min(width - 150, max(150, mX)), 0, 70);
    } else {
        stroke(0);
        translate(0, 70);
        for (let x = 10; x < width - 10; x += 45) {
            noiseSeed(5);
            let y = noise(x / 200) * 600 - 350;
            if (y > 0) fill(200, 40, 30);
            else fill(30, 40, 200);
            handRect(x, 0, 40, y);
        }
    }
}

let touchStartedFrame = 0;

function touchStarted() {
    touchStartedTime = frameCount;
    return false;
}

function touchEnded() {
    if (frameCount - touchStartedTime < 3) {
        mouseButton = LEFT;
        planellIndex = (planellIndex + 1) % 2;
    }
}

// HAND FUNCTIONS -------

function handRect(tx, ty, w, h) {

    strokeWeight(1);
    handLine(tx, ty, tx, ty + h);
    handLine(tx, ty, tx + w, ty);
    handLine(tx + w, ty, tx + w, ty + h);
    handLine(tx, ty + h, tx + w, ty + h);

    if (_renderer._doFill) {
        let strokeColor = color(_renderer._cachedStrokeStyle);
        stroke(color(_renderer._cachedFillStyle));
        strokeWeight(2.5);

        if (w > 0 && h > 0)
            for (let i = 4; i < h + w; i += random(5, 10))
                handLine(tx + ifPositive(i - h), ty + min(h, i), tx + min(w, i), ty + ifPositive(i - w));
        else if (w > 0 && h < 0)
            for (let i = 4; i < -h + w; i += random(5, 10))
                handLine(tx + ifPositive(i + h), ty + -min(-h, i), tx + min(w, i), ty + -ifPositive(i - w));

        stroke(strokeColor);
    }
}

function ifPositive(n) {
    if (n > 0) return n;
    return 0;
}

function handEllipse(tx, ty, dx, dy) {
    strokeWeight(1);
    if (dy === undefined) dy = dx;
    dx += random(0, 4);
    dy += random(0, 4);

    let step = random(0.1, 0.3);
    for (let a = step; a < PI * 6; a += step) {
        handSegment(
            tx + cos(a - step) * dx, ty + sin(a - step) * dy,
            tx + cos(a) * dx, ty + sin(a) * dy, step * sqrt(abs(dx + dy) * 20),
            noise((a - step) * 4) * 2 - 1, noise(a * 4) * 2 - 1);
        step = random(0.1, 0.3);
    }

    if (_renderer._doFill) {
        let strokeColor = color(_renderer._cachedStrokeStyle);
        stroke(color(_renderer._cachedFillStyle));
        strokeWeight(2.5);

        let radius = abs(dx + dy);

        let step = random(0.1, 0.3);
        for (let a = step; a < TWO_PI; a += step) {
            handLine(
                tx + cos(PI - a) * dx, ty + sin(PI - a) * dy,
                tx + cos(a) * dx, ty + sin(a) * dy, step * sqrt(radius * 20),
                noise((a - step) * 4) * 2 - 1, noise(a * 4) * 2 - 1);
            step = (random(10, 19) * (abs(PI - a) + 1)) / radius;
        }

        stroke(strokeColor);
    }
}

function handLine(sx, sy, ex, ey) {

    let vx = ex - sx;
    let vy = ey - sy;
    let len = sqrt(vx * vx + vy * vy);
    vx /= len;
    vy /= len;

    let step = random(15, 30);
    for (let lineN = 0; lineN < 2; lineN++) {
        let pastX = sx;
        let pastY = sy;
        noiseSeed(random(0, 1000));
        for (let i = step; i < len; i += step) {
            let x = pastX + vx * step;
            let y = pastY + vy * step;
            handSegment(pastX, pastY, x, y, step, noise((i - step) / 30) * 2 - 1, noise(i / 30) * 2 - 1);
            pastX = x;
            pastY = y;
            step = random(15, 30);
        }
    }
}

function handSegment(sx, sy, ex, ey, len, na, nb) {
    let px = sy - ey;
    let py = ex - sx;
    px /= len;
    py /= len;

    nb *= random(hand.straightMin, hand.straightMax);
    na *= random(hand.straightMin, hand.straightMax);

    line(sx + px * na, sy + py * na,
        ex + px * nb, ey + py * nb);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
document.oncontextmenu = function () {
    return false;
}