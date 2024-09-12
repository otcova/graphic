const hand = {
	straightMin: 2,
	straightMax: 5
}

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
			hand.straightMax = 2 + (Math.sin(performance.now() / 1000) + 1) * 20
			
			g.background(255)
			for (let x = 10; x < g.width - 30; x += 45) {
				g.noiseSeed(3);
				let y = g.noise(x / 200) * 600 - 330;
				if (y > 0) g.fill(200, 40, 30);
				else g.fill(30, 40, 200);
				handRect(x, g.height / 2 + 5, 40, y);
			}
		}
		g.windowResized = () => {
			g.resizeCanvas(...get_parent_size())
		}
		function handRect(tx, ty, w, h) {

			g.strokeWeight(1);
			handLine(tx, ty, tx, ty + h);
			handLine(tx, ty, tx + w, ty);
			handLine(tx + w, ty, tx + w, ty + h);
			handLine(tx, ty + h, tx + w, ty + h);

			if (g._renderer._doFill) {
				let strokeColor = g.color(g._renderer._cachedStrokeStyle);
				g.stroke(g.color(g._renderer._cachedFillStyle));
				g.strokeWeight(2.5);

				if (w > 0 && h > 0)
					for (let i = 4; i < h + w; i += g.random(5, 10))
						handLine(tx + ifPositive(i - h), ty + g.min(h, i), tx + g.min(w, i), ty + ifPositive(i - w));
				else if (w > 0 && h < 0)
					for (let i = 4; i < -h + w; i += g.random(5, 10))
						handLine(tx + ifPositive(i + h), ty + -g.min(-h, i), tx + g.min(w, i), ty + -ifPositive(i - w));

				g.stroke(strokeColor);
			}
		}

		function ifPositive(n) {
			if (n > 0) return n;
			return 0;
		}

		function handLine(sx, sy, ex, ey) {
			let vx = ex - sx;
			let vy = ey - sy;
			let len = Math.sqrt(vx * vx + vy * vy);
			vx /= len;
			vy /= len;

			let step = g.random(15, 30);
			
			let pastX = sx;
			let pastY = sy;
			g.noiseSeed(g.random(0, 1000));
			for (let i = step; i < len; i += step) {
				let x = pastX + vx * step;
				let y = pastY + vy * step;
				handSegment(pastX, pastY, x, y, step, g.noise((i - step) / 30) * 2 - 1, g.noise(i / 30) * 2 - 1);
				pastX = x;
				pastY = y;
				step = g.random(15, 30);
			}
		}

		function handSegment(sx, sy, ex, ey, len, na, nb) {
			let px = sy - ey;
			let py = ex - sx;
			px /= len;
			py /= len;

			nb *= g.random(hand.straightMin, hand.straightMax);
			na *= g.random(hand.straightMin, hand.straightMax);

			g.line(sx + px * na, sy + py * na,
				ex + px * nb, ey + py * nb);
		}

	})
}

