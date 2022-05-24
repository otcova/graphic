let waves = []
let pastSpawn = 0

function setup() {
    createCanvas(windowWidth, windowHeight)
}

function draw() {
    const dt = deltaTime / 1000
    const now = performance.now()
    
    background(40)
    stroke(255)
    fill(255)
    ellipse(mouseX, mouseY, 10)
    
    noFill()
            
    // Spawn
    if (mouseIsPressed && pastSpawn + 300 < now) {
        waves.push({ x: mouseX, y: mouseY })
        pastSpawn = now
    }
    
    // Render and Move
    for (let circle of waves) {
        circle.r = (circle.r + dt * 200) || 0.1
        ellipse(circle.x, circle.y, circle.r * 2)
    }
    
    // Clear out of screen circles
    while (waves[0] && waves[0].r > Math.max(windowWidth, windowHeight) * 2)
        waves.shift()
}