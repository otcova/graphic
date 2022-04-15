export function draw_window(parent) {
	const get_parent_size = () => {
		const rect = parent.getBoundingClientRect()
		return [Math.ceil(rect.width), Math.ceil(rect.height)]
	}

	new p5(g => {
		let pos = [130, 130]
		let vel = [-35, 0]
		let tail = []

		g.setup = () => {
			let canvas = g.createCanvas(...get_parent_size())
			canvas.parent(parent)
			parent.style.background = "none"
		}
		g.draw = () => {
			g.background(48)
			g.translate(g.width / 2, g.height / 2)

			g.noStroke()
			g.fill(200, 200, 255, 100)
			g.ellipse(0, 0, 120)

			g.strokeWeight(5)
			g.stroke(200, 130, 5)
			g.noFill()
			g.beginShape()
			for (const coord of tail) {
				g.vertex(...coord)
			}
			g.endShape()

			g.strokeWeight(1)
			g.stroke(0)
			g.fill(100, 255, 100)
			g.ellipse(0, 0, 50)

			g.fill(200, 130, 5)
			g.ellipse(...pos, 15)

			vel[0] -= pos[0] * 0.01
			vel[1] -= pos[1] * 0.01

			if (tail.length > 100) tail.shift()
			tail.push([...pos])

			pos[0] += vel[0] * 0.2
			pos[1] += vel[1] * 0.2
		}
		g.windowResized = () => {
			g.resizeCanvas(...get_parent_size())
		}
	})
}