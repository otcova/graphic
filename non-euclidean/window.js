export function draw_window(parent) {
	const get_parent_size = () => {
		const rect = parent.getBoundingClientRect()
		return [Math.ceil(rect.width), Math.ceil(rect.height)]
	}
	
	new p5(g => {
		g.setup = () => {
			let canvas = g.createCanvas(...get_parent_size())
			canvas.parent(parent)
			parent.style.background = "none"
			g.noLoop()
		}
		g.draw = () => {
			g.background(40)
			g.translate(Math.round(g.width / 2) + 0.5, Math.round(g.height / 2) + 0.5)
			g.stroke(255)
			
			g.noFill()
			g.ellipse(0, 0, 200)
			g.line(100, 0, -100, 0)
			g.line(0, 100, 0, -100)
			
		}
		g.windowResized = () => {
			g.resizeCanvas(...get_parent_size())
		}
	})
}