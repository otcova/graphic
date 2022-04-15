export function draw_window(parent) {
	const get_parent_size = () => [parent.offsetWidth, parent.offsetHeight]

	new p5(g => {
		g.setup = () => {
			let canvas = g.createCanvas(...get_parent_size())
			canvas.parent(parent)
			parent.style.background = "none"
		}
		g.draw = () => {
			g.background(255)
			g.translate(g.round(g.width / 2), g.round(g.height / 2))
			g.stroke(2)
			let t = performance.now() / 400
			
			if (g.frameCount % 600 < 200) {}
			else if (g.frameCount % 600 < 400) {
				g.line(-100, 0, 100, 0)
				g.line(0, -100, 0, 100)
			}
			else {
				g.line(g.sin(t) * 100, 0, 0, g.cos(t) * 100)
			}
				
			g.fill(180, 255, 3);
			g.ellipse(g.sin(t) * 100, 0, 10)
			g.ellipse(0, g.cos(t) * 100, 10)
			
		}
		g.windowResized = () => {
			g.resizeCanvas(...get_parent_size())
		}
	})
}