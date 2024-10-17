const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
let animationId;
let shapes = [];
const MAX_SHAPES = 400; // Maximale Anzahl der Formen

// Canvas-Größe anpassen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Funktion um Formen zu erstellen
function createShape() {
    // Nur neue Formen hinzufügen, wenn die maximale Anzahl noch nicht erreicht ist
    if (shapes.length < MAX_SHAPES) {
        const shape = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 20 + 10, // Größe zwischen 10 und 30
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            type: Math.floor(Math.random() * 3), // 0: Kreis, 1: Quadrat, 2: Dreieck
            dx: (Math.random() - 0.5) * 1, // Geschwindigkeit in x-Richtung
            dy: (Math.random() - 0.5) * 1 // Geschwindigkeit in y-Richtung
        };
        shapes.push(shape);
    }
}

// Animationsfunktion
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Vorherige Formen löschen

    shapes.forEach((shape, index) => {
        ctx.fillStyle = shape.color;

        // Position der Form aktualisieren
        shape.x += shape.dx;
        shape.y += shape.dy;

        // Wenn die Form den Rand des Canvas erreicht, die Richtung ändern
        if (shape.x < 0 || shape.x > canvas.width || shape.y < 0 || shape.y > canvas.height) {
            // Wenn die Form aus dem Sichtfeld fliegt, wird sie aus dem Array entfernt
            shapes.splice(index, 1);
        } else {
            switch (shape.type) {
                case 0: // Kreis
                    ctx.beginPath();
                    ctx.arc(shape.x, shape.y, shape.size, 0, Math.PI * 2);
                    ctx.fill();
                    break;
                case 1: // Quadrat
                    ctx.fillRect(shape.x, shape.y, shape.size, shape.size);
                    break;
                case 2: // Dreieck
                    ctx.beginPath();
                    ctx.moveTo(shape.x, shape.y);
                    ctx.lineTo(shape.x + shape.size, shape.y);
                    ctx.lineTo(shape.x + shape.size / 2, shape.y - shape.size);
                    ctx.closePath();
                    ctx.fill();
                    break;
            }
        }
    });

    // Neue Formen hinzufügen
    createShape();
    
    animationId = requestAnimationFrame(animate);
}

// Vollbild aktivieren
function enterFullscreen() {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.mozRequestFullScreen) { // Firefox
        canvas.mozRequestFullScreen();
    } else if (canvas.webkitRequestFullscreen) { // Chrome, Safari & Opera
        canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) { // IE/Edge
        canvas.msRequestFullscreen();
    }
}

// Start-Button-Event
startButton.addEventListener('click', () => {
    canvas.style.display = 'block'; // Canvas anzeige n
    shapes = []; // Formen zurücksetzen
    enterFullscreen(); // Vollbild aktivieren
    animate(); // Animation starten
});

// Stop-Button-Event
stopButton.addEventListener('click', () => {
    cancelAnimationFrame(animationId); // Animation stoppen
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvas leeren
    canvas.style.display = 'none'; // Canvas verstecken
});
