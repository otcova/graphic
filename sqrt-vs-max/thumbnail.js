import { vec } from "../utils.js"

export function draw(parent) {
	const get_parent_size = () => {
		const rect = parent.getBoundingClientRect()
		return [Math.ceil(rect.width), Math.ceil(rect.height)]
	}

  let list = Array(10).fill(0);

	new p5(g => {
		g.setup = () => {
			let canvas = g.createCanvas(...get_parent_size())
			canvas.parent(parent)
			g.frameRate(4)
			parent.style.background = "none"
		}
		g.draw = () => {
			g.background(40)
      g.translate(0, g.height)
      g.scale(1, -1)
      graph(list, g.createVector(g.width*0.1, g.width*0.1), g.width * 0.8)

      insert_sample(list, Math.sqrt(Math.random()))
		}
		g.windowResized = () => {
			g.resizeCanvas(...get_parent_size())
		}

    function graph(values, position, size) {
      let max = Math.max(...values)
      let width = size / values.length;

      g.noStroke()
      g.fill(255, 0, 0)
      for (let i = 0; i < values.length; ++i) {
        let x = size * i / values.length;
        let height = size * values[i] / max;
        g.rect(position.x + x, position.y, width, height);
      }
      g.stroke(150)

      g.line(position.x, position.y, position.x + size, position.y)
      g.line(position.x, position.y, position.x, position.y + size)
    }

    function insert_sample(list, sample) {
      list[Math.floor(sample * list.length)] += 1;
    }
	})
}


