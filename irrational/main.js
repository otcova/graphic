let constD = false;


let t = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() 
{
    background(40);
    translate(width/2, height/2);

    let r = min(height, width) / 2.2;
    if (constD)  t += (mouseX) / width;
    else t += (mouseX * (t / 100+1)) / width;
    let d = r;
    let scale = r/(t+1);

    stroke(255, 250, 50);
    noFill();
    ellipse(0, 0, r*2);

    if (t < 100000) {
        for (let a = 0; a < t; a++)
        {
            if (!constD) d = (1+a)*scale;
            stroke(0, 200, 255-90*abs(a-t));
            line(0, 0, d*cos(a), d*sin(a));
        }
    }
    
    if (t < 100000) {
        noStroke();
        for (let a = 0; a < t; a++)
        {
            if (!constD) d = (1+a)*scale;
            let powA = a*a;
            
            if (mouseY < height/3) fill(sin(powA)*155+100, cos(powA)*155+100, 255-sin(powA)*100);
            else if (mouseY > height*.67) fill(a % 256, (a % 516)/ 2, (a % 1024)/4);
            else fill(200, (a % 44)*(256/44), 10);
            ellipse(d*cos(a), d*sin(a), 4 + d / 30);
        }
    }
    else {
        for (let a = 0; a < t; a++)
        {
            if (!constD) d = (1+a)*scale;
            if (mouseY < height/3) { let powA = a*a; stroke(sin(powA)*155+100, cos(powA)*155+100, 255-sin(powA)*100); }
            else if (mouseY > height*.67) stroke(a % 256, (a % 516)/ 2, (a % 1024)/4);
            else stroke(200, (a % 44)*(256/44), 10);
            point(d*cos(a), d*sin(a));
        }
    }

    if (t < 160 || constD) {
        stroke(0, 200, 255);
        line(0, 0, r*cos(t), r*sin(t));
    }
}

let touchStartedTime = 0;
function touchStarted() {
    touchStartedTime = millis();
}
function touchEnded() {
    if (millis() - touchStartedTime < 150) {
        mouseButton = LEFT;
        mouseReleased();
    }
    return false;
}

function mouseReleased()
{
    if (mouseButton == LEFT) constD = !constD;
    t = 0;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    setupGraphics();
}
document.oncontextmenu = function() {
    return false;
}