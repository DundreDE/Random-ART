const canvas = document.getElementById("art-canvas");
const ctx = canvas.getContext("2d");
document.getElementById("generate").addEventListener("click", generateRandomArt);
document.getElementById("download").addEventListener("click", downloadArt);

function generateRandomArt() {
    const numberOfShapes = 20 + Math.floor(Math.random() * 30); // Random number of shapes (between 20 and 50)
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numberOfShapes; i++) {
        // Randomize shape type
        const shapeType = Math.floor(Math.random() * 3); // 0: Circle, 1: Rectangle, 2: Triangle

        // Random position within canvas
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;

        // Random size
        const size = 30 + Math.random() * 150;

        // Random color
        const color = `hsl(${Math.random() * 360}, 100%, 50%)`;

        // Set color and opacity
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.7;

        // Draw shapes
        if (shapeType === 0) {
            // Circle
            drawCircle(x, y, size / 2);
        } else if (shapeType === 1) {
            // Rectangle
            drawRectangle(x, y, size, size / 2);
        } else if (shapeType === 2) {
            // Triangle
            drawTriangle(x, y, size);
        }
    }
}

function drawCircle(x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawRectangle(x, y, width, height) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fill();
}

function drawTriangle(x, y, size) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size / 2, y + size);
    ctx.lineTo(x - size / 2, y + size);
    ctx.closePath();
    ctx.fill();
}

function downloadArt() {
    const link = document.createElement("a");
    link.download = "random-art.png";
    link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    link.click();
}
