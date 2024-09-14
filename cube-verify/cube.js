const EMPTY_FACE_INDEX = 6

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

const POSIBLE_EDGES =
  EDGES_INDEXES.map(([a, b]) => a.face_index + '' + b.face_index)

const POSIBLE_CORNERS =
  CORNERS_INDEXES.map(([a, b, c]) => a.face_index + '' + b.face_index + '' + c.face_index)

export class Cube {
  constructor(state) {
    this.state = state ?? [
      [6,6,6,6,0,6,6,6,6],
      [6,6,6,6,1,6,6,6,6],
      [6,6,6,6,2,6,6,6,6],
      [6,6,6,6,3,6,6,6,6],
      [6,6,6,6,4,6,6,6,6],
      [6,6,6,6,5,6,6,6,6],
    ]
  }

  check_errors() {
    let errors = Array(this.state.length).fill().map(() => Array(9).fill().map(() => {return{}}))
    let error_count = 0
    let set_error = (face_index, sticker_index, type) => {
      errors[face_index][sticker_index][type] = true
      ++error_count
    }

    this.#check_cube_count(set_error)
    this.#check_cube_pices(set_error, EDGES_INDEXES)
    this.#check_cube_pices(set_error, CORNERS_INDEXES)
    this.#check_incomplete_pices(set_error)

    return [errors, error_count]
  }

  #check_incomplete_pices(set_error) {
    // Can this incomplete corner pice exit?
    for (const [a, b, c] of CORNERS_INDEXES) {
      let a_has_color = this.state[a.face_index][a.sticker_index] != EMPTY_FACE_INDEX
      let b_has_color = this.state[b.face_index][b.sticker_index] != EMPTY_FACE_INDEX
      let c_has_color = this.state[c.face_index][c.sticker_index] != EMPTY_FACE_INDEX
      if (a_has_color + b_has_color + c_has_color != 2)
        continue

      let colors = this.#pice_colors([a, b, c])
      let pice_exists = false;

      for (let color = 0; color < EMPTY_FACE_INDEX; ++color) {
        let posible_colors = colors.replace(EMPTY_FACE_INDEX, color)
        if (this.#pice_index(posible_colors) != null) pice_exists = true
      }

      if (!pice_exists) {
        for (let sticker of [a, b, c])
          set_error(sticker.face_index, sticker.sticker_index, "edge")
      }
    }
  }

  #check_cube_pices(set_error, set) {
    let edge_count = Array(set.length).fill(0)

    // Do pices exists?
    for (const pice of set) {
      if (pice.find(sticker => this.state[sticker.face_index][sticker.sticker_index] == EMPTY_FACE_INDEX))
        continue

      let edge_index = this.#pice_index(this.#pice_colors(pice))

      if (edge_index == null) {
        for (let sticker of pice)
          set_error(sticker.face_index, sticker.sticker_index, "edge")
      } else {
          ++edge_count[edge_index]
      }
    }

    // Are the pices repeated?
    for (const pice of set) {
      let edge_index = this.#pice_index(this.#pice_colors(pice))
      
      if (edge_count[edge_index] > 1) {
        for (let sticker of pice)
          set_error(sticker.face_index, sticker.sticker_index, "edge")
      }
    }
  }

  #check_cube_count(set_error) {
    let corner_count = Array(EMPTY_FACE_INDEX + 1).fill(0)
    let edge_count = Array(EMPTY_FACE_INDEX + 1).fill(0)

    for (let face_index = 0; face_index < this.state.length; ++face_index) {
      ++corner_count[this.state[face_index][0]]
      ++corner_count[this.state[face_index][2]]
      ++corner_count[this.state[face_index][6]]
      ++corner_count[this.state[face_index][8]]

      ++edge_count[this.state[face_index][1]]
      ++edge_count[this.state[face_index][3]]
      ++edge_count[this.state[face_index][5]]
      ++edge_count[this.state[face_index][7]]
    }

    corner_count[EMPTY_FACE_INDEX] = 0
    edge_count[EMPTY_FACE_INDEX] = 0

    for (let face_index = 0; face_index < this.state.length; ++face_index) {
      let check_count_error = (count, sticker_index) => {
        if (count[this.state[face_index][sticker_index]] > 4)
          set_error(face_index, sticker_index, "sticker")
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

  #pice_rotations(pice) {
    let rotations = Array(pice.length).fill()
    rotations[0] = pice
    for (let i = 1; i < pice.length; ++i)
      rotations[i] = rotations[i - 1].at(-1) + rotations[i - 1].slice(0, -1)
    return rotations
  }

  #pice_index(pice_colors) {
    let set = pice_colors.length == 2 ? POSIBLE_EDGES : POSIBLE_CORNERS
    for (let edge_index = 0; edge_index < set.length; ++edge_index) {
      if (this.#pice_rotations(set[edge_index]).includes(pice_colors))
        return edge_index
    }
    return null
  }
  #pice_colors(pice) {
    return pice.map(sticker => this.state[sticker.face_index][sticker.sticker_index]).join("")
  }
}
