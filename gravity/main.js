// types: sol, planeta, lluna
let objs = [];
let objsMemory = [

    [{
        x: 0,
        y: 0,
        planet: true,
        r: 50
    }],
    [{
            x: -200,
            y: 0,
            move: false,
            planet: true,
            r: 20
        },
        {
            x: 200,
            y: 0,
            move: false,
            planet: true,
            r: 20
        }
    ],
    [{
            x: -200,
            y: 0,
            vy: -5,
            move: true,
            planet: true,
            r: 20
        },
        {
            x: 200,
            y: 0,
            vy: 5,
            move: true,
            planet: true,
            r: 20
        }
    ],

    [{
            x: -200,
            y: 200,
            vy: -5,
            move: true,
            planet: true,
            r: 20,
            tail: []
        },
        {
            x: 0,
            y: -200,
            vx: 5,
            vy: 2,
            move: true,
            planet: true,
            r: 20,
            tail: []
        },
        {
            x: 200,
            y: 200,
            vx: -5,
            vy: 3,
            move: true,
            planet: true,
            r: 20,
            tail: []
        }
    ],
    [{
            x: 0,
            y: 0,
            move: true,
            sol: true,
            r: 60
        },
        {
            x: 400,
            y: 0,
            vy: 11.05,
            move: true,
            planet: true,
            r: 12,
            tail: []
        },
        {
            x: -400,
            y: 0,
            vy: -11.05,
            move: true,
            planet: true,
            r: 12,
            tail: []
        }
    ],
    [{
            x: 0,
            y: 0,
            move: true,
            sol: true,
            r: 60
        },
        {
            x: -400,
            y: 0,
            vy: -10.49,
            move: true,
            planet: true,
            r: 15
        },
        {
            x: 400,
            y: 0,
            vy: 10.49,
            move: true,
            planet: true,
            r: 15
        },
        {
            x: 0,
            y: 400,
            vx: -10.49,
            move: true,
            planet: true,
            r: 15
        },
        {
            x: 0,
            y: -400,
            vx: 10.49,
            move: true,
            planet: true,
            r: 15
        }
    ]
];
let objsMemoryIndex = 0;

function LoadObjMemory() {
    objs = [...objsMemory[objsMemoryIndex]];
    for (const obj of objs) {
        if (obj.move) {
            if (obj.vx == undefined) obj.vx = 0;
            if (obj.vy == undefined) obj.vy = 0;
            if (obj.ax == undefined) obj.ax = 0;
            if (obj.ay == undefined) obj.ay = 0;
            if (obj.friccio == undefined) obj.friccio = 0;
        }
    }
    objsMemoryIndex = parseInt(objsMemoryIndex + 1) % objsMemory.length;
}


let newAst;
let mX = 0;
let mY = 0;
let mousePower = 30;

function setup() {
    createCanvas(windowWidth, windowHeight);

    LoadObjMemory();

}

function draw() {
    background(48);
    if (frameCount < 30) return;
    translate(width / 2, height / 2);
    let s = min(width, height) / 1000;
    scale(s);
    mX = (mouseX - width / 2) / s;
    mY = (mouseY - height / 2) / s;


    //Draw objs ------

    //planet atmosfera
    fill(200, 200, 255, 100);
    for (const obj of objs) {
        if (obj.planet && obj.r > 15) ellipse(obj.x, obj.y, obj.r * 2 * 2.5);
    }

    //tail
    strokeWeight(3);
    stroke(180, 120, 5);
    for (const obj of objs) {
        if (obj.tail != undefined) {
            for (let i = 1; i < obj.tail.length; i++) {
                line(obj.tail[i - 1][0], obj.tail[i - 1][1], obj.tail[i][0], obj.tail[i][1]);
            }
        }
    }
    strokeWeight(1);
    stroke(0);

    //objs body
    for (const obj of objs) {
        if (obj.planet) fill(100, 255, 100);
        else if (obj.sol) fill(240, 50, 0);
        else fill(200, 130, 5);
        ellipse(obj.x, obj.y, obj.r * 2);
    }

    //Move ----------

    for (let i = 0; i < objs.length; i++) {
        const obj = objs[i];
        if (obj.move && !obj.terra) {
            for (const orv of objs) {
                if (!orv.lluna)
                    if (obj != orv)
                        applyForces(obj, orv);
            }
        }
    }

    for (let i = 0; i < objs.length; i++) {
        const obj = objs[i];
        if (obj.terra) {
            if (obj.r <= 0) objs.splice(i, 1);
            obj.r -= 4;
        } else if (obj.move) {
            if (!obj.terra) moveObj(obj);
        }
        if (obj.tail != undefined) {
            if (obj.tail.length > (obj.lluna ? 200 : 50)) obj.tail.shift();
            obj.tail.push([obj.x, obj.y]);
        }
    }

    //preview -----
    if (newAst != undefined) {

        if (touchStartedTime == 0 || (millis() - touchStartedTime > 140)) {
            let newAstCopy = {
                ...newAst
            };
            newAstCopy.vx = (newAstCopy.x - mX) / mousePower;
            newAstCopy.vy = (newAstCopy.y - mY) / mousePower;

            fill(110, 100, 50);
            noStroke();
            for (let i = 0; i < 1100; i++) {
                for (const orv of objs)
                    if (!orv.lluna) applyForces(newAstCopy, orv, true);
                if (newAstCopy.terra) break;
                moveObj(newAstCopy);
                ellipse(newAstCopy.x, newAstCopy.y, newAstCopy.r);
            }
            strokeWeight(5);
            stroke(100, 50, 40);
            line(mX, mY, newAst.x, newAst.y);

            stroke(10);
            strokeWeight(1);
            fill(200, 130, 5);
            ellipse(newAst.x, newAst.y, newAst.r * 2);
        } else {
            newAst.x = mX;
            newAst.y = mY;
        }
    }
}

function applyForces(ast, planet, preview) {
    let tdist = dist(planet.x, planet.y, ast.x, ast.y);
    if (tdist <= planet.r + ast.r) {
        if (preview) ast.terra = true;
        else if (!planet.move) ast.terra = true;
        else if (ast.lluna) ast.terra = true;
        else if (ast.r == planet.r) {
            ast.terra = true;
            planet.terra = true;
        } else if (ast.r > planet.r) planet.terra = true;
        else ast.terra = true;
    }
    ast.friccio += (planet.sol ? .2 : 2) / pow(tdist / planet.r, 10);
    tdist = pow(tdist, 2) / 100;
    let planetR = planet.r / 60;
    ast.ax += (planetR * (planet.x - ast.x)) / tdist;
    ast.ay += (planetR * (planet.y - ast.y)) / tdist;
}

function moveObj(ast) {
    ast.vx = (ast.vx + ast.ax) / (ast.friccio + 1);
    ast.vy = (ast.vy + ast.ay) / (ast.friccio + 1);
    ast.x += ast.vx / pow(ast.r / 10, 1 / 1.5);
    ast.y += ast.vy / pow(ast.r / 10, 1 / 1.5);
    ast.ax = 0;
    ast.ay = 0;
    ast.friccio = 0;
}

let touchStartedTime = 0;

function touchStarted() {
    touchStartedTime = millis();
    mousePressed();
    return false;
}

function touchEnded() {
    if (millis() - touchStartedTime < 140) {
        mouseButton = RIGHT;
        mouseReleased();
    } else {
        mouseButton = LEFT;
        mouseReleased();
    }
    touchStartedTime = 0;
    return false;
}

function mousePressed() {
    newAst = {
        x: mX,
        y: mY,
        vx: 0,
        vy: 0,
        ax: 0,
        ay: 0,
        friccio: 0,
        r: 10,
        move: true,
        lluna: true,
        tail: []
    };
}

function mouseReleased() {
    if (mouseButton == LEFT) {
        newAst.vx = (newAst.x - mX) / mousePower;
        newAst.vy = (newAst.y - mY) / mousePower;
        objs.push(newAst);
    } else {
        LoadObjMemory();
    }
    newAst = undefined;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

document.oncontextmenu = function () {
    return false;
}