import { create_layout, shape, persistance, rect_pressed, vec, innerStrokeRect } from "../utils.js"
import { Cube } from "./cube.js"

const APP_ID = "cube verify"

const LOCK_TOOL = "lock"
const EMPTY_COLOR = [255, 100, 200]
const COLORS = [
  [255, 165, 0], [255, 255, 255], [0, 255, 0], [255, 255, 0], [255, 0, 0], [0, 0, 255],
]
const ROUND = 3

let cube = new Cube(persistance.loadVariable(APP_ID, "cube state"))
let past_error_count = cube.error_count
let selected_tool = null

globalThis.setup = function () {
  createCanvas(windowWidth, windowHeight)
  frameRate(20)
}

globalThis.draw = function () {
  background(20)

  if (width >= height) {
    let size = Math.min(height, width / 3)
    drawPalette(vec(width - size, (height - size) / 2), size)

    drawCube(Math.min(height * 1.3333, width - size))
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
        selected_tool = index

      if (selected_tool == index) stroke(inverse_color(COLORS[index]))
      else noStroke()

      fill(COLORS[index++])
      rect(x, y, column_width, column_width, ROUND)
    }
  }

  // X Button
  {
    let x = pos.x + columns_pos[0]
    let y = pos.y + columns_pos[2]
    let width = column_width + columns_pos[1] - columns_pos[0]

    if (rect_pressed(x, y, width, column_width))
      selected_tool = null

    stroke(EMPTY_COLOR)
    noFill()
    strokeWeight(selected_tool == null ? 10 : 4)
    rect(x, y, width, column_width, ROUND)
    strokeWeight(4)
    shape.cross(x + width / 2, y + column_width / 2, column_width * 0.3)
  }

  // Lock Button
  {
    let x = pos.x + columns_pos[2]
    let y = pos.y + columns_pos[2]

    if (rect_pressed(x, y, column_width, column_width))
      selected_tool = LOCK_TOOL

    stroke(200)
    noFill()
    strokeWeight(selected_tool == LOCK_TOOL ? 10 : 4)
    rect(x, y, column_width, column_width, ROUND)
    strokeWeight(column_width * 0.05)
    shape.lock(x + column_width / 2, y + column_width / 2, column_width * 0.3)
  }
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

      let sticker_color_index = cube.get_color(face_index, index)

      if (rect_pressed(x, y, sticker_size) && index != 4) {
        if (selected_tool == LOCK_TOOL) {
          cube.lock(face_index, index)
          updateCube()
        } else {
          cube.set_color(face_index, index, selected_tool)
          updateCube()
        }
      }

      if (sticker_color_index != null) {
        noStroke()
        fill(COLORS[sticker_color_index])

        rect(x, y, sticker_size, sticker_size, ROUND)
      } else {
        let strokeW = 1

        noFill()
        stroke(EMPTY_COLOR)
        strokeWeight(strokeW)

        let size = sticker_size - strokeW
        rect(x + strokeW / 2, y + strokeW / 2, size, size, ROUND)
      }

      /*if (cube.ge[face_index][index].sticker) {
        stroke(EMPTY_COLOR)
        strokeWeight(sticker_size * 0.1)
        shape.cross(x + sticker_size / 2, y + sticker_size / 2, sticker_size * 0.3)
      }*/
      if (cube.pice_has_error(face_index, index)) {
        noStroke()
        fill(EMPTY_COLOR)
        let px = x + sticker_size / 2 + (index_x - 1) * sticker_size * 0.3
        let py = y + sticker_size / 2 + (index_y - 1) * sticker_size * 0.3
        let size = sticker_size * 0.4
        push()
        rectMode(CENTER);
        rect(px, py, size, size, ROUND)
        pop()
      }

      let posibles = cube.get_posibles(face_index, index)
      if (posibles) {
        if (posibles.length == 0) {
          stroke(EMPTY_COLOR)
          strokeWeight(sticker_size * 0.1)
          shape.cross(x + sticker_size / 2, y + sticker_size / 2, sticker_size * 0.3)
        } else if (posibles.length < COLORS.length) {
          if (sticker_color_index !== null && !posibles.includes(sticker_color_index)) {
            stroke(EMPTY_COLOR)
            strokeWeight(sticker_size * 0.1)
          } else {
            noStroke()
          }

          let arc_colors = posibles.filter(c => c !== sticker_color_index)
          let size = sticker_size * 0.5
          let angle = 0
          let step = PI * 2 / arc_colors.length

          for (let color of arc_colors) {
            fill(COLORS[color])
            arc(x + sticker_size / 2, y + sticker_size / 2, size, size, angle, angle + step)
            angle += step
          }
        }
      }

      if (cube.is_locked(face_index, index)) {
        let weight = sticker_size * 0.15
        stroke(150)
        strokeWeight(weight)
        noFill()
        innerStrokeRect(x - 1, y - 1, sticker_size + 2, sticker_size + 2, ROUND / weight)
      }

      ++index
    }
  }
}

function inverse_color(color) {
  return color.map(c => 255 - c / 2)
}

function updateCube() {
  let state_changed = persistance.saveVariable(APP_ID, "cube state", cube.as_string())

  if (state_changed)
    window.navigator?.vibrate?.(past_error_count < cube.error_count ? 50 : 10)
  past_error_count = cube.error_count
}
