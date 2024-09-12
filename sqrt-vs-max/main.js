import {vec, create_layout} from "../utils.js"

let samples_count = 0;
let samples = Array(100).fill(0)
let sqrt_samples = Array(100).fill(0)
let max_samples = Array(100).fill(0)

setInterval(() => {
  for (let i = 0; i < 20; ++i) {
    let [a, b] = [Math.random(), Math.random()]
    samples_count += 2;

    insert_sample(samples, a)
    insert_sample(samples, b)
    insert_sample(sqrt_samples, Math.sqrt(a))
    insert_sample(sqrt_samples, Math.sqrt(b))
    insert_sample(max_samples, Math.max(a, b))
  }
}, 10);

window.setup = function () {
  createCanvas(windowWidth, windowHeight)
}

window.draw = function () {
  background(255)

  textAlign(LEFT, TOP)
  noStroke()
  fill(0)
  textSize(18)
  text("Samples: " + samples_count, 10, 10)

  translate(0, height);
  // translate(0.5, 0.5) // Pixel perfect rectangles
  scale(1, -1)

  let { items_positions, item_size } = create_layout({size: Math.max(width, height), items: 3});

  if (width >= height) items_positions = items_positions.map(value => vec(value, (height - item_size) / 2))
  else items_positions = items_positions.map(value => vec((width - item_size) / 2, value))

  graph(samples, items_positions[0], item_size)
  graph(sqrt_samples, items_positions[1], item_size)
  graph(max_samples, items_positions[2], item_size)
}

function graph(values, position, size) {
  let max = Math.max(...values)
  let width = size / values.length;

  noStroke()
  fill(255, 0, 0)
  for (let i = 0; i < values.length; ++i) {
    let x = size * i / values.length;
    let height = size * values[i] / max;
    rect(position.x + x, position.y, width, height);
  }
  stroke(0)

  line(position.x, position.y, position.x + size, position.y)
  line(position.x, position.y, position.x, position.y + size)
}

function insert_sample(list, sample) {
  list[Math.floor(sample * list.length)] += 1;
}
