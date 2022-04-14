let screen;
let player;
let paint_dots = [];
let figures = [[], [], [], [], []];

let proj_scale = 2;
const HPI = Math.acos(0);
const TPI = 4 * Math.acos(0);

let figure_index = -1;
let show_sphere = true;

class Player {
	constructor(vel) {
		this.pos = nvec(0, 0, -1);
		this.dir = nvec(0, vel, -1).norm();
	}
	move(angle) {
		let dir_pos = this.dir.new();
		if (angle != 0) dir_pos = orbit_vec(this.pos, this.dir, angle);

		this.dir = this.pos.new();
		this.pos = dir_pos;
		this.dir = orbit_vec(this.pos, this.dir, PI - angle);
	}
	rotate_dir(angle) {
		this.dir = orbit_vec(this.pos, this.dir, angle);
	}
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	screen = new Vec(windowWidth, windowHeight);

	let proj_scale_slider = createSlider(0.7, 5, 2, 0);
	proj_scale_slider.position(10, 50);
	proj_scale_slider.style('width', '100px');
	proj_scale_slider.input(() => { proj_scale = proj_scale_slider.value(); });

	let figure_slider = createSlider(-1, figures.length - 1, -1);
	figure_slider.position(10, 30);
	figure_slider.style('width', '100px');
	figure_slider.input(() => { figure_index = figure_slider.value(); });

	let tools_slider = createSlider(0, 3, 0);
	tools_slider.position(10, 10);
	tools_slider.style('width', '100px');
	let change_tools = () => {
		let tool_level = tools_slider.value();
		
		if (tool_level >= 1) figure_slider.show();
		else { figure_slider.hide(); figure_slider.value(-1); figure_index = -1; }
		if (tool_level >= 2) proj_scale_slider.show();
		else { proj_scale_slider.hide(); proj_scale_slider.value(2); proj_scale = 2; }

		show_sphere = tool_level >= 3;
	};
	tools_slider.input(change_tools);
	change_tools();

	let color = "FFF";
	let point = (pos, col) => {
		figures[figure_index].push({ pos, color: (col ? col : color) });
	};
	let line = (len, angle, col) => {
		for (let i = 0; i < len; i++) {
			if (col != "inv") figures[figure_index].push({ pos: player.pos, color: (col ? col : color) });
			player.move(angle);
		}
	};

	let square = (size, c) => {
		line(size, 0, "inv");
		line(size, HPI, c);
		line(size, PI, c);
		line(size, -HPI, "inv");
	}

	{
		figure_index = 0;
		color = "753";
		const res = 0.5;
		let len = 156 * res;

		player = new Player(0.01 / res);
		square(len / 15.6, "F00");
		line(len, 0, "inv");
		player.rotate_dir(HPI);
		square(len / 15.6, "0F0");
		line(len, 0, "inv");
		player.rotate_dir(HPI);
		square(len / 15.6, "00F");
		line(len, 0, "inv");
		player.rotate_dir(HPI);

		player = new Player(0.01 / res);
		line(len, 0);
		square(len / 15.6, "inv");
		player.rotate_dir(HPI);
		line(len, 0);
		square(len / 15.6, "inv");
		player.rotate_dir(HPI);
		line(len, 0);
		square(len / 15.6, "inv");
		player.rotate_dir(HPI);
	}
	{
		figure_index = 1;
		for (let i = -PI; i < PI; i += 0.03) {
			point(to_cart(nvec(0, i)), "F0F");
			point(to_cart(nvec(HPI, i)), "FFF");
		}
	}
	{
		figure_index = 2;
		for (let i = -PI; i < PI; i += 0.03) {
			point(to_cart(nvec(0, i)), "F0F");
			point(to_cart(nvec(HPI, i)), "FFF");
			point(to_cart(nvec(i, HPI)), "00F");
		}
	}
	{
		figure_index = 3;
		color = "FFF";
		for (let i = 0; i < 100; i++) {
			point(nvec(random(-1, 1), random(-1, 1), random(-1, 1)).norm());
		}
	}
	{
		figure_index = 4;
		color = "FDA";
		const phi = PI * (3. - sqrt(5.));
		const samples = 500;

		for (let i = 0; i < samples; i++) {
			let y = 1 - (i / float(samples - 1)) * 2;
			let radius = sqrt(1 - y * y);
			let theta = phi * i;
			let x = cos(theta) * radius;
			let z = sin(theta) * radius;
			point(nvec(x, y, z));
		}
	}
	figure_index = -1;
	player = new Player(0.02 / proj_scale);
}


let mouse; // mouse pos

function draw() {
	background(20);
	screen = nvec(windowWidth, windowHeight);
	mouse = nvec((mouseX - (width * 0.25)) / s, -(mouseY - (height * 0.5)) / s);

	set_transform(nvec(show_sphere ? 0.75 : 0.5, 0.5), () => {
		set_dot_scale(1 / proj_scale);

		const offset = precalculate_offset_angles(player.pos, player.dir);
		let pol_cam_pos = to_pol(player.pos);

		let cam = (v) => {
			v = get_sphere(move_rotate_offset(offset, v));
			return v.scale(proj_scale);
		}

		let cam_dot = (v, color, res) => {
			let c = cam(v);
			if (sqrt(sq(c.x) + sq(c.y)) < 1) big_dot(cam, v, color, res);
		}

		for (const paint_dot of paint_dots)
			cam_dot(paint_dot.pos, paint_dot.color);
		if (figure_index != -1) {
			for (const paint_dot of figures[figure_index])
				cam_dot(paint_dot.pos, paint_dot.color);
		}
		dot_size(17);
		cam_dot(player.pos, "0F0", 12);
		dot_size(14);
		cam_dot(player.dir, "00F", 11);
	});

	if (show_sphere) {
		set_transform(nvec(0.25, 0.5), () => {
			for (const paint_dot of paint_dots) {
				dot(paint_dot.pos, paint_dot.color);
			}
			if (figure_index != -1) {
				for (const paint_dot of figures[figure_index])
					dot(paint_dot.pos, paint_dot.color);
			}

			dot_size(17);
			dot(player.pos, "0F0");
			dot_size(14);
			dot(player.dir, "00F");
		});
	}

	if (keyIsPressed) {
		if (keys["w"]) player.move(0);
		if (keys["s"]) player.move(PI);
		if (keys["q"]) player.move(PI / -2);
		if (keys["e"]) player.move(PI / 2);
		if (keys["a"]) player.rotate_dir(-0.03);
		if (keys["d"]) player.rotate_dir(0.03);
		if (keys[" "] && frameCount % 20 == 0) paint_dots.push({ pos: player.pos.new(), color: "F00" });
	}
	if (mouseX > width / 10 && mouseIsPressed && frameCount % 5 == 0) paint_dots.push({ pos: player.pos.new(), color: "0FF" });
}

let keys = {};
function keyPressed() {
	keys[key] = true;
	if (key === " ") paint_dots.push({ pos: player.pos.new(), color: "F00" });
	if (key === "1") paint_dots.push({ pos: player.pos.new(), color: "FF5" });
	if (key === "2") paint_dots.push({ pos: player.pos.new(), color: "F8F" });
	if (key === "3") paint_dots.push({ pos: player.pos.new(), color: "00F" });
	if (key === "4") paint_dots.push({ pos: player.pos.new(), color: "5F5" });
}
function keyReleased() {
	keys[key] = false;
}