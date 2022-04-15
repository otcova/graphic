import { projects_info } from "./project_info.js"

const container = document.getElementById("window-container")

for (const project of projects_info) {
	const project_path = "./" + project.name.toLowerCase().replaceAll(" ", "-")

	const link = create_element("a", "", container)
	link.href = project_path
	const window_root = create_element("div", "window", link)
	// window_root.onclick = () => location.href = project_path
	
	const text_continer = create_element("div", "text_continer" + project.text_class, window_root)
	
	const header = create_element("div", "header", text_continer)
	header.innerText = project.name

	const description = create_element("div", "text", text_continer)
	description.innerText = project.description
	
	const canvas_container = create_element("div", "canvas-container", window_root)
	import(project_path + "/window.js")
		.then(({ draw_window }) => draw_window(canvas_container))
}

function create_element(type, className, parent) {
	const div = document.createElement(type)
	div.className = className
	parent?.appendChild(div)
	return div
}