let map = new Map();

map.set("drawLines", true);
map.set("drawEllipse", true);
map.set("drawPolygon", false);

map.set("drawDots", true);
map.set("drawDotsCenter", true);
map.set("drawOrvit", true);

map.set("drawDotsCua", false && map.get("drawDots"));
map.set("drawDotsCenterCua", false && map.get("drawDotsCenter"));
map.set("drawOrvitCua", false && map.get("drawOrvit"));

map.set("drawResultDot", false);

map.set("alphaClear", 1);
map.set("costats", 0);
map.set("speed", 110);

let modes = [
	[0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 90],
	[0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 90],
	[1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 90],
	[0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 90],
	[0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 90],
	[0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 90],
	[1, 0, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 90],
	[1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 150],
	[1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 0, 90],
	[1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 90],
	[1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 90],
	[1, 1, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 90],
	[1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 90],
	[1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 90],
	[0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 90],
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 90],
	[1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 2, 90],
	[1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 3, 90],
	[1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 4, 90],
	[1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 5, 90],
	[1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 6, 90],
	[1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 6, 90],
	[1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 6, 90],
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 6, 90],
	[1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 70],
	[1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 10, 1, 50],
	[0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 2, 1, 5],
	[1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 90, 1],
	[1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 90, 2],
	[1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 90, 3],
	[1, 1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 90, 4],
];

let mode = 0;
let figuresIndex = 0;

function SetupMode() {
	figuresIndex = 0;
	let modesIndex = 0;

	for (const [key, value] of map) {
		if (modesIndex < 10) map.set(key, modes[mode][modesIndex] == 1);
		else map.set(key, modes[mode][modesIndex]);
		modesIndex++;
	}

	if (modes[mode].length > 13)
		figuresIndex = modes[mode][13];
}

function figura(ta, tb) {
	switch (figuresIndex) {
		case 1: return abs(ta) < 0.65;
		case 2: return abs(ta) < 0.5;
		case 3: return abs(ta) > 0.35;
		case 4: return abs(ta + tb) < .85;
	}
	return true;
}

let speed;
let costats;
let pgBack;
let pgMove;
let r;
let step;
let pgMoveFrame = 0;

let rvX = 0;
let rvY = 0;

function updateBackground() {
	pgBack.push();
	pgBack.clear();
	pgBack.stroke(60);
	pgBack.translate(width / 2, height / 2);
	pgBack.noFill();
	if (map.get("drawEllipse")) pgBack.ellipse(0, 0, r * 2);

	step = TWO_PI / costats;
	let a = 0;

	for (let i = 0; i < costats; i++) {
		let vx = cos(a) * r;
		let vy = sin(a) * r;
		let pvx = cos(a - step) * r;
		let pvy = sin(a - step) * r;

		if (map.get("drawPolygon")) pgBack.line(vx, vy, pvx, pvy);
		if (map.get("drawLines")) pgBack.line(0, 0, vx, vy);

		a += step;
	}
	pgBack.pop();
}

function setColor(grphics, n) {
	n *= TWO_PI;
	let r = sin(n + QUARTER_PI);
	let g = sin(n + HALF_PI);
	let b = sin(n + PI);
	grphics.fill(abs(255 * r), abs(255 * g), abs(255 * b), 255);
}

function updatePgMove() {
	rvX = 0;
	rvY = 0;

	pgMove.push();
	pgMove.fill(255, map.get("alphaClear"));
	pgMove.rect(-10, -10, width + 20, height + 20);
	pgMove.translate(width / 2, height / 2);


	let a = 0;
	for (let i = 0; i < costats; i += 2) {
		let vx = cos(a) * r;
		let vy = sin(a) * r;
		setColor(pgMove, i / costats);

		pgMove.noStroke();
		let t = sin(pgMoveFrame / speed + a);
		let pt = sin(pgMoveFrame / speed + a - step);
		rvX += vx * t;
		rvY += vy * t;

		if (map.get("drawDotsCua")) pgMove.ellipse(vx * t, vy * t, 15);
		if (map.get("drawOrvitCua")) {
			pgMove.stroke(0, 200);
			pgMove.line(vx * t, vy * t, cos(a - step) * r * pt, sin(a - step) * r * pt);
		}
		if (map.get("drawDotsCenterCua") && figura(t, pt)) { // abs(t) < 0.65 // abs(t) < 0.5 // abs(t) > 0.35 // abs(t+pt) < .85
			pgMove.fill(100, 100, 160);
			pgMove.ellipse((vx * t + cos(a - step) * r * pt) / 2, (vy * t + sin(a - step) * r * pt) / 2, 15);
		}
		a += step;
	}
	pgMove.pop();
}

function setupEnviroment() {
	costats = map.get("costats");
	r = min(height, width) / (2.3 + (map.get("drawResultDot") ? costats : 0));
	costats = costats * 2 + 4;
	speed = map.get("speed");

	pgMove.background(255);
	updateBackground();
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	pgBack = createGraphics(width, height);
	pgMove = createGraphics(width, height);
	SetupMode();
	setupEnviroment();
}

function draw() {
	for (let i = 0; i < 2; i++) pgMoveFrame++; updatePgMove();
	image(pgMove, 0, 0);
	image(pgBack, 0, 0);

	translate(width / 2, height / 2);
	stroke(0);

	const points = [];

	for (let i = 0, a = 0; i < costats; i += 2, a += step) {
		const vx = cos(a) * r;
		const vy = sin(a) * r;
		const t = sin(pgMoveFrame / speed + a);
		const pt = sin(pgMoveFrame / speed + a + step);

		points.push({ vx, vy, t, pt, a, i });
	}

	if (map.get("drawOrvit")) {
		stroke(0, 200);
		strokeWeight(1);
		for (const { vx, vy, t, pt, a } of points)
			line(vx * t, vy * t, cos(a + step) * r * pt, sin(a + step) * r * pt);
	}
	if (map.get("drawDotsCenter")) {
		fill(100, 100, 160);
		for (const { vx, vy, t, pt, a } of points)
			ellipse((vx * t + cos(a + step) * r * pt) / 2, (vy * t + sin(a + step) * r * pt) / 2, 15);
	}
	if (map.get("drawDots")) {
		for (const { vx, vy, t, i } of points) {
			setColor(this, i / costats);
			ellipse(vx * t, vy * t, 15);
		}
	}
	if (map.get("drawResultDot")) {
		fill(200, 100, 100);
		ellipse(rvX, rvY, 20, 20);
	}
}

function touchEnded() {
	mode = min(modes.length, max(0, mode + (mouseY < height / 2 ? 1 : -1)));
	SetupMode();
	setupEnviroment();
	return false;
}

function mouseReleased() {
	mode = min(modes.length, max(0, mode + (mouseButton == LEFT ? 1 : -1)));
	SetupMode();
	setupEnviroment();
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
	pgBack = createGraphics(width, height);
	pgMove = createGraphics(width, height);

	SetupMode();
	setupEnviroment();
}
document.oncontextmenu = function () {
	return false;
}