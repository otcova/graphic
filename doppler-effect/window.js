const hand = {
	straightMin: 2,
	straightMax: 5
}

export function draw_window(parent) {
	const get_parent_size = () => {
		const rect = parent.getBoundingClientRect()
		return [Math.ceil(rect.width), Math.ceil(rect.height)]
	}

	new p5(g => {
		g.setup = () => {
			let canvas = g.createCanvas(...get_parent_size())
			canvas.parent(parent)
			// g.frameRate(8)
			parent.style.background = "none"
		}
		g.draw = () => {
			hand.straightMax = 2 + (Math.sin(performance.now() / 1000) + 1) * 20

			g.background(40)
			g.translate(10, g.height / 2)
			g.stroke(255)
			g.noFill()

			let t = (performance.now() % 9000) / 10;

			for (let i = 0; i < Math.min(t, 500) / 30; ++i) {
				g.ellipse(i * 25 - 10, 0, 3 * (t - i * 30))
			}
			g.fill(255)
			if (t < 600) g.ellipse(t * 25 / 30 - 10, 0, 10)
		}
		g.windowResized = () => {
			g.resizeCanvas(...get_parent_size())
		}
	})
}

