const projects_info = [
	{
		name: "Atom",
		description: "Graphical representations of sinosoudial waves.",
	},
	{
		name: "Ant simulator",
		description: "See how ants can organize using only two pheromones.",
	},
	{
		name: "Memory",
		description: "Test your memory with this game.",
	},
	{
		name: "Pi Collisions",
		description: "How many time do you think they will collide?",
	},
	{
		name: "Gravity",
		description: "Throw your meteors in a gravity simulator.",
	},
	{
		name: "Irrational",
		description: "You will never have two dots in the same angle.",
	},
	{
		name: "Handmade",
		description: "Drawing imperfect shapes with perfect calculations.",
	},
	{
		name: "Non euclidean",
		description: "How doen't like spherical space?",
	},
]

const container = document.getElementById("window-container")

for (project of projects_info) {
	const project_window = create_div("window", container)
	const project_url = "./" + project.name.toLowerCase().replaceAll(" ", "-")
	project_window.onclick = () => location.href = project_url
	project_window.style.backgroundImage = "url('" + project_url + "/capture.gif')"
	
	const header = create_div("header", project_window)
	header.innerText = project.name
	
	const text = create_div("text", project_window)
	text.innerText = project.description
}

function create_div(className, parent) {
	const div = document.createElement("div")
	div.className = className
	parent?.appendChild(div)
	return div
}