const EMPTY_COLOR = null

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
        .map(() => Array(9).fill().map(() => { return { color: null, locked: false, posibles: null } }))

      // Set Centers
      for (let face = 0; face < FACES; ++face)
        this.faces[face][4].color = face
    }

    this.#update();
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
    if (!sticker.locked) {
      sticker.color = color
      this.#update();
    }
  }

  get_color(face_index, sticker_index) {
    return this.faces[face_index][sticker_index].color
  }

  get_posibles(face_index, sticker_index) {
    return this.faces[face_index][sticker_index].posibles
  }

  pice_has_error(face_index, sticker_index) {
    return this.faces[face_index][sticker_index].pice_error
  }

  #set_posibles(face_index, sticker_index, posibles) {
    this.faces[face_index][sticker_index].posibles = posibles
  }

  #set_pice_error(face_index, sticker_index, error = true) {
    this.faces[face_index][sticker_index].pice_error = error
    if (error) ++this.error_count
  }

  #update() {
    // Reset
    this.error_count = 0
    for (let face_index = 0; face_index < FACES; ++face_index) {
      for (let sticker_index = 0; sticker_index < 9; ++sticker_index) {
        this.#set_posibles(face_index, sticker_index, null)
        this.#set_pice_error(face_index, sticker_index, false)
      }
    }

    this.edge_colors = this.#count_colors(EDGES_INDEXES)
    this.corner_colors = this.#count_colors(CORNERS_INDEXES)

    this.#check_cube_pices(EDGES_INDEXES)
    this.#check_cube_pices(CORNERS_INDEXES)
  }

  #count_colors(set) {
    let count = Array(FACES).fill(0)
    for (const pice of set) {
      for (const { color: face, sticker_index } of pice) {
        let color = this.get_color(face, sticker_index)
        if (color !== null) ++count[color]
      }
    }
    return count
  }

  #check_cube_pices(set) {
    let pice_count = Array(set.length).fill(0)

    // Do pices exists?
    for (const pice of set) {
      if (pice.find(sticker => this.get_color(sticker.color, sticker.sticker_index) == EMPTY_COLOR))
        continue

      let pice_index = this.#pice_index(this.#pice_colors(pice))

      if (pice_index == null) {
        for (let sticker of pice)
          this.#set_pice_error(sticker.color, sticker.sticker_index)
      } else {
        ++pice_count[pice_index]
      }
    }

    // Are the pices repeated?
    for (const pice of set) {
      let edge_index = this.#pice_index(this.#pice_colors(pice))

      if (pice_count[edge_index] > 1) {
        for (let sticker of pice)
          this.#set_pice_error(sticker.color, sticker.sticker_index)
      }
    }

    // Check posibles
    for (const pice of set) {
      let pice_index = this.#pice_index(this.#pice_colors(pice))
      if (pice_index !== null)
        --pice_count[pice_index]

      for (let i = 0; i < pice.length; ++i) {
        let sticker_color = this.get_color(pice[i].color, pice[i].sticker_index)
        if (sticker_color !== EMPTY_COLOR)
          --this.#get_color_count(set)[sticker_color]

        let posibles = []
        for (let color = 0; color < FACES; ++color) {
          if (this.#get_color_count(set)[color] >= 4)
            continue

          let colors = this.#pice_colors(pice, { [i]: color });
          if (this.#posible_pice_indexes(set, colors).some(pice_index => pice_count[pice_index] == 0))
            posibles.push(color)
        }

        this.#set_posibles(pice[i].color, pice[i].sticker_index, posibles)

        if (sticker_color !== EMPTY_COLOR)
          ++this.#get_color_count(set)[sticker_color]
      }

      if (pice_index !== null)
        ++pice_count[pice_index]
    }
  }

  #get_color_count(set) {
    if (set === EDGES_INDEXES) return this.edge_colors
    if (set === CORNERS_INDEXES) return this.corner_colors
    throw "WTF!"
  }

  #pice_rotations(pice) {
    let rotations = Array(pice.length).fill()
    rotations[0] = pice
    for (let i = 1; i < pice.length; ++i)
      rotations[i] = rotations[i - 1].at(-1) + rotations[i - 1].slice(0, -1)
    return rotations
  }

  #posible_pice_indexes(set, pice_colors) {
    if (pice_colors.includes("?")) {
      let posible_indexes = []
      for (let color = 0; color < FACES; ++color) {
        if (this.#get_color_count(set)[color] >= 4)
          continue

        posible_indexes.push(...this.#posible_pice_indexes(set, pice_colors.replace("?", color)));
      }
      return posible_indexes
    }

    let index = this.#pice_index(pice_colors);
    if (index === null) return []
    return [index]
  }

  #pice_index(pice_colors) {
    let set = pice_colors.length == 2 ? POSIBLE_EDGES : POSIBLE_CORNERS
    for (let edge_index = 0; edge_index < set.length; ++edge_index) {
      if (this.#pice_rotations(set[edge_index]).includes(pice_colors))
        return edge_index
    }
    return null
  }
  #pice_colors(pice, exceptions = []) {
    return pice.map((sticker, index) =>
      exceptions[index] ?? this.get_color(sticker.color, sticker.sticker_index) ?? "?").join("")
  }
}
