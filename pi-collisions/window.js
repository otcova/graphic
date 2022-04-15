export function draw_window(parent) {

	const get_parent_size = () => {
		const rect = parent.getBoundingClientRect()
		return [Math.ceil(rect.width), Math.ceil(rect.height)]
	}

	new p5(g => {
		g.setup = () => {
			let canvas = g.createCanvas(...get_parent_size())
			canvas.parent(parent)
			g.noLoop()
			parent.style.background = "none"
		}
		g.draw = () => {
			g.background(170, 120, 100)
			g.translate(g.width / 8, g.height / 1.7)

			g.noStroke()
			g.fill(48)
			g.rect(0, 0, 1000, -1000)

			g.textAlign(g.CENTER, g.MIDDLE)
			g.textSize(16)
			g.fill(255)

			g.rect(30, 0, 30, -30)
			g.text(1, 30, -50, 30, 30)

			g.rect(g.width / 2, 0, 100, -100)
			g.text("100 000 000", g.width / 2, -120, 100, 100)
		}
		g.windowResized = () => {
			g.resizeCanvas(...get_parent_size())
		}
	})
}