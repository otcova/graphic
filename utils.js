export function pick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

export function vec(x, y) {
  return createVector(x, y)
}

/// padding is a proportion of size
/// gap is a proportion of size
export function create_layout({ size, items, padding, gap }) {
  padding = padding ?? (0.25 / (items + 1))
  gap = gap ?? (0.5 / (items + 1) / (items - 1))

  let item_size = size * (1 - padding * 2 - gap * (items - 1)) / items
  let padding_size = size * padding
  let gap_size = size * gap

  let items_positions = Array(items).fill(0)
    .map((_, index) => padding_size + index * (item_size + gap_size))

  return { items_positions, item_size }
}

export function rect_hover(x, y, width, height) {
  height ??= width
  return x <= mouseX && mouseX <= x + width &&
    y <= mouseY && mouseY <= y + height
}

export function rect_pressed(x, y, width, height) {
  return rect_hover(x, y, width, height) && mouseIsPressed;
}

export function innerStrokeRect(x, y, width, height, ...round) {
  let lineWidth = drawingContext.lineWidth
  rect(x + lineWidth / 2, y + lineWidth / 2, width - lineWidth, height - lineWidth, ...round)
}

export const shape = {
  lock(x, y, size) {
    let lineWidth = drawingContext.lineWidth
    ellipse(x, y, lineWidth)
    rect(x - size / 2, y - size / 2, size, size, 2)

    let s = size * 0.8
    arc(x, y - size / 2, s, s, PI, 0)
  },
  cross(x, y, size) {
    let r = size / 2
    line(x - r, y - r, x + r, y + r)
    line(x - r, y + r, x + r, y - r)
  }
}


function percistance_variable_id(app_id, variable_name) {
  return app_id + '/' + variable_name;
}
export const persistance = {
  loadVariable(app_id, variable_name, default_value) {
    let id = percistance_variable_id(app_id, variable_name)
    let stored = localStorage.getItem(id)
    if (stored) return JSON.parse(stored)
    return default_value
  },
  saveVariable(app_id, variable_name, value) {
    let id = percistance_variable_id(app_id, variable_name)
    let str = JSON.stringify(value)

    let value_changed = localStorage.getItem(id) !== str
    if (value_changed) localStorage.setItem(id, str)

    return value_changed
  }
}
