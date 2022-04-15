export function draw_window(parent) {
	const get_parent_size = () => {
		const rect = parent.getBoundingClientRect()
		return [Math.ceil(rect.width), Math.ceil(rect.height)]
	}

	new p5(g => {
		g.draw = () => {
			g.background(48, 48, 100)
			g.randomSeed(performance.now() / 1000)
			g.noStroke()
			const size = 40;
			const margin = 10;

			g.translate(g.width / 2, g.height / 2)
			g.translate(-size * 2 - margin * 1.5, -size * 2 - margin * 1.5)
			for (let x = 0; x < 4; ++x) {
				for (let y = 0; y < 4; ++y) {
					if (g.random() < 0.5) g.fill(100, 100, 120);
					else g.fill(255);
					g.rect(x * (size + margin), y * (size + margin), size, size, 10)
				}
			}
		}
		g.setup = () => {
			let canvas = g.createCanvas(...get_parent_size())
			canvas.parent(parent)
			g.frameRate(1)
			g.draw()
			parent.style.background = "none"
		}

		g.windowResized = () => {
			g.resizeCanvas(...get_parent_size())
		}
	})
}