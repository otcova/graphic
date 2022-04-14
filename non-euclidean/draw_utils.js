let s = 200; // scale
let is = 1 / s; // invert scale

function default_scale(scale) {
	s = scale;
	is = 1 / scale;
}

function set_transform(coord, scope) {
	push();
	translate_vec(coord.mult(screen));
	scale(s);
	scale(1, -1);
	translate(is / 2, is / 2);

	strokeWeight(is);
	stroke(255);
	//noStroke();
	fill(20);

	ellipse(0, 0, 2);
	stroke(255);
	line(-1, 0, 1, 0);
	line(0, -1, 0, 1);

	noStroke();
	fill(255);

	dot_size(7);
	set_dot_scale(1);
	scope();

	pop();
}


function dot(p, color) {
	if (color) fill("#" + color);
	ellipse(p.x, p.y, dot_scale * ds / (p.z + 2));
}

function precalculate_offset_angles(offset_pos, offset_dir, delta_angle = -HALF_PI) {
	let az = -atan2(offset_pos.y, offset_pos.x);
	let pz = offset_pos.orbit_z(az);
	let ay = HALF_PI + atan2(pz.z, pz.x);
	
	let offset_angles = nvec(0, ay, az);

	let dir_p = move_offset(offset_angles, offset_dir);
	offset_angles.x = atan2(dir_p.y, dir_p.x) + delta_angle;
	
	return offset_angles;
}

function move_offset(offset_angles, v) {
	return v.orbit_z(offset_angles.z).orbit_y(offset_angles.y);
}

function move_rotate_offset(offset_angles, v) {
	let moved_v = move_offset(offset_angles, v);
	return orbit_vec(nvec(0, 0, -1), moved_v, offset_angles.x);
}

function big_dot(cam, p, color, resolution = 10) {
	const radius = dot_scale * ds;
	const delta_angle = TWO_PI / resolution;
	noStroke();
	fill("#" + color);
	
	//make an offset
	let v = nvec(radius, 0, 1).norm();
	v = to_cart(to_pol(p).add(to_pol(v)));
	
	beginShape();
	for (let a = 0; a < TWO_PI; a += delta_angle) {
		let s = orbit_vec(p, v, a);
		s = cam(s);
		//dot(s);
		vertex(s.x, s.y);
	}
	//dot(cam(p));
	endShape(CLOSE);
}

let ds = 7 * is; // dot size
let dot_scale = 1;
function dot_size(size) {
	ds = size * is;
}
function set_dot_scale(scale) {
	dot_scale = scale;
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

document.oncontextmenu = function () {
	return false;
}