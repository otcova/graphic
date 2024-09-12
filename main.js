// import { projects_info } from "./project_list.js"

let container = document.getElementById("thumbnail-container")

for (let project of projects_info) {
	let project_path = "./" + project.name.toLowerCase().replaceAll(" ", "-") + "/"

  // Create Container
	let link = create_element("a", "", container)
	link.href = project_path
	let thumbnail = create_element("div", "thumbnail", link)
	
  // Create Text
	let text_continer = create_element("div", "text_continer " + project.text_class, thumbnail)
	create_element("div", "header", text_continer).innerText = project.name
	create_element("div", "text", text_continer).innerText = project.description
	
  // Create Canvas
	let canvas_container = create_element("div", "canvas-container", thumbnail)
	import(project_path + "thumbnail.js").then(thumbnail => thumbnail.draw(canvas_container))
}

function create_element(type, className, parent) {
	let div = document.createElement(type)
	div.className = className
	parent?.appendChild(div)
	return div
}
