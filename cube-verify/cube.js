const EMPTY_color = null

const FACES = 6

const EDGES_INDEXES = [
  [{ color: 0, sticker_index: 1 }, { color: 1, sticker_index: 3 }],
  [{ color: 0, sticker_index: 5 }, { color: 2, sticker_index: 3 }],
  [{ color: 0, sticker_index: 7 }, { color: 3, sticker_index: 3 }],
  [{ color: 0, sticker_index: 3 }, { color: 5, sticker_index: 5 }],

  [{ color: 4, sticker_index: 1 }, { color: 1, sticker_index: 5 }],
  [{ color: 4, sticker_index: 3 }, { color: 2, sticker_index: 5 }],
  [{ color: 4, sticker_index: 7 }, { color: 3, sticker_index: 5 }],
  [{ color: 4, sticker_index: 5 }, { color: 5, sticker_index: 3 }],

  [{ color: 1, sticker_index: 7 }, { color: 2, sticker_index: 1 }],
  [{ color: 2, sticker_index: 7 }, { color: 3, sticker_index: 1 }],
  [{ color: 3, sticker_index: 7 }, { color: 5, sticker_index: 7 }],
  [{ color: 5, sticker_index: 1 }, { color: 1, sticker_index: 1 }],
]
const CORNERS_INDEXES = [
  [{ color: 0, sticker_index: 2 }, { color: 1, sticker_index: 6 }, { color: 2, sticker_index: 0 }],
  [{ color: 0, sticker_index: 8 }, { color: 2, sticker_index: 6 }, { color: 3, sticker_index: 0 }],
  [{ color: 0, sticker_index: 6 }, { color: 3, sticker_index: 6 }, { color: 5, sticker_index: 8 }],
  [{ color: 0, sticker_index: 0 }, { color: 5, sticker_index: 2 }, { color: 1, sticker_index: 0 }],

  [{ color: 4, sticker_index: 0 }, { color: 2, sticker_index: 2 }, { color: 1, sticker_index: 8 }],
  [{ color: 4, sticker_index: 6 }, { color: 3, sticker_index: 2 }, { color: 2, sticker_index: 8 }],
  [{ color: 4, sticker_index: 8 }, { color: 5, sticker_index: 6 }, { color: 3, sticker_index: 8 }],
  [{ color: 4, sticker_index: 2 }, { color: 1, sticker_index: 2 }, { color: 5, sticker_index: 0 }],
]

const POSIBLE_EDGES =
  EDGES_INDEXES.map(([a, b]) => a.color + '' + b.color)

const POSIBLE_CORNERS =
  CORNERS_INDEXES.map(([a, b, c]) => a.color + '' + b.color + '' + c.color)

export class Cube {
  constructor(state) {
    this.faces = state

    if (!this.faces) {
      this.faces = Array(FACES).fill()
        .map(() => Array(9).fill().map(() => { return { color: null, locked: false } }))

      // Set Centers
      for (let color = 0; color < FACES; ++color)
        this.set_color(color, 4, color)
    }
  }

  lock(face_index, sticker_index) {
    let sticker = this.faces[face_index][sticker_index]
    if (sticker.color !== null) this.faces[face_index][sticker_index].locked = true
  }

  is_locked(face_index, sticker_index) {
    return this.faces[face_index][sticker_index].locked
  }

  set_color(face_index, sticker_index, color) {
    let sticker = this.faces[face_index][sticker_index]
    if (color === null) sticker.locked = false
    if (!sticker.locked) sticker.color = color
  }

  get_color(face_index, sticker_index) {
    return this.faces[face_index][sticker_index].color
  }

  check_errors() {
    let errors = Array(FACES).fill().map(() => Array(9).fill().map(() => { return {} }))
    let error_count = 0
    let set_error = (color, sticker_index, type) => {
      errors[color][sticker_index][type] = true
      ++error_count
    }

    this.#check_sticker_count(set_error, EDGES_INDEXES)
    this.#check_sticker_count(set_error, CORNERS_INDEXES)
    this.#check_cube_pices(set_error, EDGES_INDEXES)
    this.#check_cube_pices(set_error, CORNERS_INDEXES)
    this.#check_incomplete_pices(set_error)

    return [errors, error_count]
  }

  #check_incomplete_pices(set_error) {
    // Can this incomplete corner pice exit?
    for (const [a, b, c] of CORNERS_INDEXES) {
      let a_has_color = this.get_color(a.color, a.sticker_index) != EMPTY_color
      let b_has_color = this.get_color(b.color, b.sticker_index) != EMPTY_color
      let c_has_color = this.get_color(c.color, c.sticker_index) != EMPTY_color
      if (a_has_color + b_has_color + c_has_color != 2)
        continue

      let pice_exists = false;

      for (let color = 0; color < FACES; ++color) {
        let colors = this.#pice_colors([a ?? color, b ?? color, c ?? color])
        if (this.#pice_index(colors) != null) pice_exists = true
      }

      if (!pice_exists) {
        for (let sticker of [a, b, c])
          set_error(sticker.color, sticker.sticker_index, "pice")
      }
    }
  }

  #check_cube_pices(set_error, set) {
    let edge_count = Array(set.length).fill(0)

    // Do pices exists?
    for (const pice of set) {
      if (pice.find(sticker => this.get_color(sticker.color, sticker.sticker_index) == EMPTY_color))
        continue

      let edge_index = this.#pice_index(this.#pice_colors(pice))

      if (edge_index == null) {
        for (let sticker of pice)
          set_error(sticker.color, sticker.sticker_index, "pice")
      } else {
        ++edge_count[edge_index]
      }
    }

    // Are the pices repeated?
    for (const pice of set) {
      let edge_index = this.#pice_index(this.#pice_colors(pice))

      if (edge_count[edge_index] > 1) {
        for (let sticker of pice)
          set_error(sticker.color, sticker.sticker_index, "pice")
      }
    }
  }

  #check_sticker_count(set_error, set) {
    let count = Array(FACES).fill(0)
    for (let pice of set) {
      for (let { color, sticker_index } of pice)
        ++count[this.get_color(color, sticker_index)]
    }

    for (let pice of set) {
      for (let { color, sticker_index } of pice) {
        if (count[this.get_color(color, sticker_index)] > 4)
          set_error(color, sticker_index, "sticker")
      }
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
    return pice.map(sticker => this.get_color(sticker.color, sticker.sticker_index)).join("")
  }
}
