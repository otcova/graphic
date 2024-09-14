import { create_layout, cross, loadVariable, rect_pressed, saveVariable, vec } from "../utils.js"
import { Cube } from "./cube.js"

const APP_ID = "cube verify"

const COLORS = [
  [255, 165, 0], [0, 0, 255], [255, 255, 255], [0, 255, 0], [255, 0, 0], [255, 255, 0], [255, 100, 200],
]

let flat_cube = new Cube(loadVariable(APP_ID, "cube state"))
let [cube_errors, cube_errors_count] = flat_cube.check_errors()
let selected_color = COLORS.length - 1

window.setup = function () {
  createCanvas(windowWidth, windowHeight)
}

window.draw = function () {
  background(20)

  if (width >= height) {
    let size = Math.min(height, width / 3)
    drawPalette(vec(width - size, (height - size) / 2), size)

    drawCube(Math.min(height*1.3, width - size))
  } else if (height >= width) {
    let size = Math.min(width, height / 3)
    drawPalette(vec((width - size) / 2, height - size), size)

    drawCube(width)
  }
}

window.mousePressed = function () {
  fullscreen(true)
}

window.windowResized = () => {
  createCanvas(windowWidth, windowHeight)
}


function drawPalette(pos, size) {
  let { items_positions: columns_pos, item_size: column_width }
    = create_layout({ size, items: 3, padding: 0.1, gap: 0.03 })

  strokeWeight(6)

  let index = 0
  for (let index_y = 0; index_y < 2; ++index_y) {
    for (let index_x = 0; index_x < 3; ++index_x) {
      let x = pos.x + columns_pos[index_x]
      let y = pos.y + columns_pos[index_y]
      if (rect_pressed(x, y, column_width))
        selected_color = index

      if (selected_color == index) stroke(inverse_color(COLORS[index]))
      else noStroke()

      fill(COLORS[index++])
      rect(x, y, column_width, column_width, 2)
    }
  }

  let x = pos.x + columns_pos[0]
  let y = pos.y + columns_pos[1] + (columns_pos[1] - columns_pos[0])
  let width = columns_pos[1] * 2 + column_width - columns_pos[0] * 2
  if (rect_pressed(x, y, width, column_width))
    selected_color = index

  if (selected_color == index) {
    strokeWeight(10)
    stroke(inverse_color(COLORS[index]))
    noFill()
    rect(x, y, width, column_width, 2)
  }

  stroke(COLORS[index])
  strokeWeight(4)
  noFill()
  rect(x, y, width, column_width, 2)
  cross(x + width / 2, y + column_width / 2, column_width / 3)
}

function drawCube(size) {
  let { items_positions: columns_pos, item_size: column_width }
    = create_layout({ size, items: 4, padding: 0, gap: 0 })

  drawCubeFace(vec(columns_pos[0], columns_pos[1]), column_width, 0)
  drawCubeFace(vec(columns_pos[1], columns_pos[0]), column_width, 1)
  drawCubeFace(vec(columns_pos[1], columns_pos[1]), column_width, 2)
  drawCubeFace(vec(columns_pos[1], columns_pos[2]), column_width, 3)
  drawCubeFace(vec(columns_pos[2], columns_pos[1]), column_width, 4)
  drawCubeFace(vec(columns_pos[3], columns_pos[1]), column_width, 5)
}

function drawCubeFace(pos, size, face_index) {
  let { items_positions: stickers_positions, item_size: sticker_size }
    = create_layout({ size, items: 3, padding: 0.05, gap: 0.02 })

  let index = 0
  for (let index_y = 0; index_y < 3; ++index_y) {
    for (let index_x = 0; index_x < 3; ++index_x) {
      let x = pos.x + stickers_positions[index_x]
      let y = pos.y + stickers_positions[index_y]

      if (rect_pressed(x, y, sticker_size) && index != 4) {
        if (flat_cube.state[face_index][index] != selected_color) {
          flat_cube.state[face_index][index] = selected_color
          updateCube()
        }
      }

      if (flat_cube.state[face_index][index] != COLORS.length - 1) {
        noStroke()
        fill(COLORS[flat_cube.state[face_index][index]])

        rect(x, y, sticker_size, sticker_size, 2)
      } else {
        let strokeW = 1

        noFill()
        stroke(COLORS[flat_cube.state[face_index][index]])
        strokeWeight(strokeW)

        let size = sticker_size - strokeW
        rect(x+strokeW/2, y+strokeW/2, size, size, 2)
      }

      if (cube_errors[face_index][index].sticker) {
        noStroke()
        fill(COLORS[COLORS.length - 1])
        ellipse(x + sticker_size / 2, y + sticker_size / 2, sticker_size * 0.4)
      }
      if (cube_errors[face_index][index].edge) {
        noStroke()
        fill(COLORS[COLORS.length - 1])
        let px = x + sticker_size / 2 + (index_x - 1) * sticker_size * 0.3
        let py = y + sticker_size / 2 + (index_y - 1) * sticker_size * 0.3
        let size = sticker_size * 0.4
        push()
        rectMode(CENTER);
        rect(px, py, size, size, 2)
        pop()
      }

      ++index
    }
  }
}

function inverse_color(color) {
  return color.map(c => 255 - c / 2)
}

function updateCube() {
  let [new_cube_errors, new_errors_count] = flat_cube.check_errors()

  window.navigator?.vibrate?.(cube_errors_count < new_errors_count? 50 : 20)

  cube_errors = new_cube_errors
  cube_errors_count = new_errors_count

  saveVariable(APP_ID, "cube state", flat_cube.state)
}
