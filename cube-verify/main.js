import { create_layout, cross, rect_pressed, vec } from "../utils.js"

const COLORS = [
  [255, 165, 0], [0, 0, 255], [255, 255, 255], [0, 255, 0], [255, 0, 0], [255, 255, 0], [255, 100, 200],
]
const EDGES_INDEXES = [
  [{face_index: 0, sticker_index: 1}, {face_index: 1, sticker_index: 3}],
  [{face_index: 0, sticker_index: 5}, {face_index: 2, sticker_index: 3}],
  [{face_index: 0, sticker_index: 7}, {face_index: 3, sticker_index: 3}],
  [{face_index: 0, sticker_index: 3}, {face_index: 5, sticker_index: 5}],

  [{face_index: 4, sticker_index: 1}, {face_index: 1, sticker_index: 5}],
  [{face_index: 4, sticker_index: 3}, {face_index: 2, sticker_index: 5}],
  [{face_index: 4, sticker_index: 7}, {face_index: 3, sticker_index: 5}],
  [{face_index: 4, sticker_index: 5}, {face_index: 5, sticker_index: 3}],

  [{face_index: 1, sticker_index: 7}, {face_index: 2, sticker_index: 1}],
  [{face_index: 2, sticker_index: 7}, {face_index: 3, sticker_index: 1}],
  [{face_index: 3, sticker_index: 7}, {face_index: 5, sticker_index: 7}],
  [{face_index: 5, sticker_index: 1}, {face_index: 1, sticker_index: 1}],
]
const CORNERS_INDEXES = [
  [{face_index: 0, sticker_index: 2}, {face_index: 1, sticker_index: 6}, {face_index: 2, sticker_index: 0}],
  [{face_index: 0, sticker_index: 8}, {face_index: 2, sticker_index: 6}, {face_index: 3, sticker_index: 0}],
  [{face_index: 0, sticker_index: 6}, {face_index: 3, sticker_index: 6}, {face_index: 5, sticker_index: 8}],
  [{face_index: 0, sticker_index: 0}, {face_index: 5, sticker_index: 2}, {face_index: 1, sticker_index: 0}],

  [{face_index: 4, sticker_index: 0}, {face_index: 2, sticker_index: 2}, {face_index: 1, sticker_index: 8}],
  [{face_index: 4, sticker_index: 6}, {face_index: 3, sticker_index: 2}, {face_index: 2, sticker_index: 8}],
  [{face_index: 4, sticker_index: 8}, {face_index: 5, sticker_index: 6}, {face_index: 3, sticker_index: 8}],
  [{face_index: 4, sticker_index: 2}, {face_index: 1, sticker_index: 2}, {face_index: 5, sticker_index: 0}],
]
const POSIBLE_EDGES = [
  "01", "02", "03", "05",
  "41", "42", "43", "45",
  "12", "23", "35", "51",
]
const POSIBLE_CORNERS = [
  "012", "023", "035", "051",
  "421", "432", "453", "415",
]

let selected_color = COLORS.length - 1

let cube = [
  [6,6,6,6,0,6,6,6,6],
  [6,6,6,6,1,6,6,6,6],
  [6,6,6,6,2,6,6,6,6],
  [6,6,6,6,3,6,6,6,6],
  [6,6,6,6,4,6,6,6,6],
  [6,6,6,6,5,6,6,6,6],
]
window.cube = cube

let cube_errors
check_cube_errors()


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
        if (cube[face_index][index] != selected_color) {
          cube[face_index][index] = selected_color
          check_cube_errors()
          window.navigator?.vibrate(10)
        }
      }

      if (cube[face_index][index] != COLORS.length - 1) {
        noStroke()
        fill(COLORS[cube[face_index][index]])

        rect(x, y, sticker_size, sticker_size, 2)
      } else {
        let strokeW = 1

        noFill()
        stroke(COLORS[cube[face_index][index]])
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

function check_cube_errors() {
  cube_errors = Array(cube.length).fill().map(() => Array(9).fill().map(() => {return{}}))
  check_cube_count()
  check_cube_pices(EDGES_INDEXES)
  check_cube_pices(CORNERS_INDEXES)
  check_incomplete_pices()
}

function check_incomplete_pices() {
  // Can this incomplete corner pice exit?
  for (const [a, b, c] of CORNERS_INDEXES) {
    let a_has_color = cube[a.face_index][a.sticker_index] != COLORS.length - 1
    let b_has_color = cube[b.face_index][b.sticker_index] != COLORS.length - 1
    let c_has_color = cube[c.face_index][c.sticker_index] != COLORS.length - 1
    if (a_has_color + b_has_color + c_has_color != 2)
      continue

    let colors = pice_colors([a, b, c])
    let pice_exists = false;

    for (let color = 0; color < COLORS.length - 1; ++color) {
      let posible_colors = colors.replace(COLORS.length - 1, color)
      if (pice_index(posible_colors) != null) pice_exists = true
    }

    if (!pice_exists)
      [a, b, c].forEach(sticker => cube_errors[sticker.face_index][sticker.sticker_index].edge = true)
  }
}

function check_cube_pices(set) {
  let edge_count = Array(set.length).fill(0)

  // Do pices exists?
  for (const pice of set) {
    if (pice.find(sticker => cube[sticker.face_index][sticker.sticker_index] == COLORS.length - 1))
      continue

    let edge_index = pice_index(pice_colors(pice))

    if (edge_index == null) {
      pice.forEach(sticker => cube_errors[sticker.face_index][sticker.sticker_index].edge = true)
    } else {
        ++edge_count[edge_index]
    }
  }

  // Are the pices repeated?
  for (const pice of set) {
    let edge_index = pice_index(pice_colors(pice))
    
    if (edge_count[edge_index] > 1) {
      pice.forEach(sticker => cube_errors[sticker.face_index][sticker.sticker_index].edge = true)
    }
  }
}

function check_cube_count() {
  let corner_count = Array(COLORS.length).fill(0)
  let edge_count = Array(COLORS.length).fill(0)

  for (let face_index = 0; face_index < cube.length; ++face_index) {
    ++corner_count[cube[face_index][0]]
    ++corner_count[cube[face_index][2]]
    ++corner_count[cube[face_index][6]]
    ++corner_count[cube[face_index][8]]

    ++edge_count[cube[face_index][1]]
    ++edge_count[cube[face_index][3]]
    ++edge_count[cube[face_index][5]]
    ++edge_count[cube[face_index][7]]
  }

  corner_count[COLORS.length - 1] = 0
  edge_count[COLORS.length - 1] = 0

  for (let face_index = 0; face_index < cube.length; ++face_index) {
    let check_count_error = (count, sticker_index) => {
      if (count[cube[face_index][sticker_index]] > 4)
        cube_errors[face_index][sticker_index].sticker = true
    }

    check_count_error(corner_count, 0)
    check_count_error(corner_count, 2)
    check_count_error(corner_count, 6)
    check_count_error(corner_count, 8)

    check_count_error(edge_count, 1)
    check_count_error(edge_count, 3)
    check_count_error(edge_count, 5)
    check_count_error(edge_count, 7)
  }
}


function inverse_color(color) {
  return color.map(c => 255 - c / 2)
}

function pice_rotations(pice) {
  let rotations = Array(pice.length).fill()
  rotations[0] = pice
  for (let i = 1; i < pice.length; ++i)
    rotations[i] = rotations[i - 1].at(-1) + rotations[i - 1].slice(0, -1)
  return rotations
}

function pice_colors(pice) {
  return pice.map(sticker => cube[sticker.face_index][sticker.sticker_index]).join("")
}

function pice_index(pice_colors) {
  let set = pice_colors.length == 2 ? POSIBLE_EDGES : POSIBLE_CORNERS
  for (let edge_index = 0; edge_index < set.length; ++edge_index) {
    if (pice_rotations(set[edge_index]).includes(pice_colors))
      return edge_index
  }
  return null
}


