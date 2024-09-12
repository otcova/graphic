import { pick, create_layout } from "../utils.js"

const COLORS = [
  [255, 165, 0], [0, 0, 255], [255, 255, 255], [0, 255, 0], [255, 0, 0], [255, 255, 0],
]

export function draw(parent) {
	const get_parent_size = () => {
		const rect = parent.getBoundingClientRect()
		return [Math.ceil(rect.width), Math.ceil(rect.height)]
	}

	new p5(g => {
		g.setup = () => {
			let canvas = g.createCanvas(...get_parent_size())
			canvas.parent(parent)
			g.frameRate(4)
			parent.style.background = "none"
		}
		g.draw = () => {
      g.background(20)

      g.noStroke()

      let { items_positions, item_size } = create_layout({ size: g.width, items: 3, padding: 0.3, gap: 0.01 })

      for (let x = 0; x < 3; ++x) {
        for (let y = 0; y < 3; ++y) {
          g.fill(...pick(COLORS));
          g.rect(items_positions[x], items_positions[y], item_size, item_size, 2)
        }
      }
		}
		g.windowResized = () => {
			g.resizeCanvas(...get_parent_size())
		}
	})
}

