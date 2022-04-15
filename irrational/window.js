export function draw_window(parent) {
	const get_parent_size = () => [parent.offsetWidth, parent.offsetHeight]

	new p5(g => {
		const r = 100

		g.setup = () => {
			let canvas = g.createCanvas(...get_parent_size())
			canvas.parent(parent)
		}
		g.draw = () => {
			g.background(40)
			g.translate(g.width / 2, g.height / 2)
			const t = (g.frameCount % 500) / 20

			g.stroke(255, 250, 50);
			g.noFill();
			g.ellipse(0, 0, r * 2);
			let d = r

			for (let a = 0; a < t; a++) {
				if (g.frameCount % 1000 > 500) d = (1 + a * 0.5) * r / (t * 0.5 + 1);
				g.stroke(0, 200, 255 - 90 * Math.abs(a - t));
				const coord = [d * Math.cos(a), d * Math.sin(a)]
				g.line(0, 0, ...coord)
				let sqA = a * a;
				g.noStroke()
				g.fill(Math.sin(sqA) * 155 + 100, Math.cos(sqA) * 155 + 100, 255 - Math.sin(sqA) * 100);
				g.ellipse(...coord, 8)
			}

			g.stroke(0, 200, 255);
			g.line(0, 0, r * Math.cos(t), r * Math.sin(t));
		}
		g.windowResized = () => {
			g.resizeCanvas(...get_parent_size())
		}
	})
}