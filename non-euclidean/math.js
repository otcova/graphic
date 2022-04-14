let p1 = new Vec(0, 0, 1);

function project(p2) {
	let pv = p2.sub(p1);
	let a = pv.x;
	let b = pv.y;
	let c = pv.z;
	let x = p1.x;
	let y = p1.y;
	let z = p1.z;
	let u = (-sqrt(sq(-2 * a * x - 2 * b * y - 2 * c * z) - 4 * (-sq(a) - sq(b) - sq(c)) * (-sq(x) - sq(y) - sq(z) + 1)) + 2 * a * x + 2 * b * y + 2 * c * z) / (2 * (-sq(a) - sq(b) - sq(c)));

	return p1.add(pv.scale(u));
}

function get_sphere(p) {
	let pv = p.sub(p1);
	let n = pv.x / pv.z;
	let m = pv.y / pv.z;
	return nvec(
		n * (-p1.z),
		m * (-p1.z),
		0,
	);
}