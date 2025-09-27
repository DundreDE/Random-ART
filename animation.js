const canvas = document.getElementById('animationCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
let animationId;
let shapes = [];
let particles = []; // Für Partikel-Effekte
let animationSettings = {
    maxShapes: 200,
    speed: 1,
    glowEnabled: true,
    trailsEnabled: true,
    bounceEnabled: true,
    backgroundAnimation: true,
    shapeTypes: 5, // Erweitert für mehr Formen
    colorMode: 'rainbow' // rainbow, neon, pastel, fire, ice
};

let backgroundGradientOffset = 0;
let time = 0;

// Canvas-Größe anpassen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Farbpaletten für verschiedene Modi
function getColorByMode(mode) {
    switch(mode) {
        case 'neon':
            const neonColors = ['#ff00ff', '#00ffff', '#ffff00', '#00ff00', '#ff0080'];
            return neonColors[Math.floor(Math.random() * neonColors.length)];
        case 'pastel':
            return `hsl(${Math.random() * 360}, 50%, 80%)`;
        case 'fire':
            const fireHue = Math.random() * 60; // Rot bis Gelb
            return `hsl(${fireHue}, 100%, 60%)`;
        case 'ice':
            const iceHue = 180 + Math.random() * 60; // Cyan bis Blau
            return `hsl(${iceHue}, 80%, 70%)`;
        default: // rainbow
            return `hsl(${Math.random() * 360}, 100%, 50%)`;
    }
}

// Erweiterte Formenerstellung mit mehr Optionen
function createShape() {
    if (shapes.length < animationSettings.maxShapes) {
        const shape = {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 30 + 10,
            color: getColorByMode(animationSettings.colorMode),
            type: Math.floor(Math.random() * animationSettings.shapeTypes),
            dx: (Math.random() - 0.5) * 3 * animationSettings.speed,
            dy: (Math.random() - 0.5) * 3 * animationSettings.speed,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            opacity: 0.8 + Math.random() * 0.2,
            pulsePhase: Math.random() * Math.PI * 2,
            trail: [] // Für Schweif-Effekt
        };
        shapes.push(shape);
    }
}

// Erweiterte Formen zeichnen
function drawShape(shape) {
    ctx.save();
    
    // Glow-Effekt
    if (animationSettings.glowEnabled) {
        const gradient = ctx.createRadialGradient(shape.x, shape.y, 0, shape.x, shape.y, shape.size + 20);
        gradient.addColorStop(0, shape.color);
        gradient.addColorStop(1, 'transparent');
        ctx.shadowColor = shape.color;
        ctx.shadowBlur = 20;
        ctx.fillStyle = gradient;
    } else {
        ctx.fillStyle = shape.color;
    }
    
    ctx.globalAlpha = shape.opacity;
    ctx.translate(shape.x, shape.y);
    ctx.rotate(shape.rotation);
    
    // Pulsierende Größe
    const pulseSize = shape.size + Math.sin(shape.pulsePhase) * 5;
    
    switch (shape.type) {
        case 0: // Kreis
            ctx.beginPath();
            ctx.arc(0, 0, pulseSize, 0, Math.PI * 2);
            ctx.fill();
            break;
        case 1: // Quadrat
            ctx.fillRect(-pulseSize/2, -pulseSize/2, pulseSize, pulseSize);
            break;
        case 2: // Dreieck
            ctx.beginPath();
            ctx.moveTo(0, -pulseSize);
            ctx.lineTo(pulseSize, pulseSize);
            ctx.lineTo(-pulseSize, pulseSize);
            ctx.closePath();
            ctx.fill();
            break;
        case 3: // Stern
            drawStar(0, 0, 5, pulseSize, pulseSize/2);
            break;
        case 4: // Pentagon
            drawPolygon(0, 0, 5, pulseSize);
            break;
    }
    
    ctx.restore();
}

// Stern zeichnen
function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    
    for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
}

// Polygon zeichnen
function drawPolygon(cx, cy, sides, radius) {
    ctx.beginPath();
    ctx.moveTo(cx + radius, cy);
    
    for (let i = 1; i < sides; i++) {
        const angle = (i * 2 * Math.PI) / sides;
        ctx.lineTo(cx + radius * Math.cos(angle), cy + radius * Math.sin(angle));
    }
    
    ctx.closePath();
    ctx.fill();
}

// Hintergrund mit Gradienten-Animation
function drawAnimatedBackground() {
    if (!animationSettings.backgroundAnimation) return;
    
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    
    // Animierte Gradient-Farben
    const hue1 = (backgroundGradientOffset) % 360;
    const hue2 = (backgroundGradientOffset + 180) % 360;
    
    gradient.addColorStop(0, `hsla(${hue1}, 50%, 10%, 0.1)`);
    gradient.addColorStop(0.5, `hsla(${hue2}, 50%, 15%, 0.05)`);
    gradient.addColorStop(1, `hsla(${hue1 + 90}, 50%, 20%, 0.1)`);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    backgroundGradientOffset += 0.5;
}

// Schweif-Effekt
function updateTrails() {
    if (!animationSettings.trailsEnabled) return;
    
    shapes.forEach(shape => {
        shape.trail.push({x: shape.x, y: shape.y});
        if (shape.trail.length > 10) {
            shape.trail.shift();
        }
    });
}

function drawTrails() {
    if (!animationSettings.trailsEnabled) return;
    
    shapes.forEach(shape => {
        if (shape.trail.length > 1) {
            ctx.save();
            for (let i = 0; i < shape.trail.length - 1; i++) {
                const alpha = (i / shape.trail.length) * 0.3;
                ctx.globalAlpha = alpha;
                ctx.strokeStyle = shape.color;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(shape.trail[i].x, shape.trail[i].y);
                ctx.lineTo(shape.trail[i + 1].x, shape.trail[i + 1].y);
                ctx.stroke();
            }
            ctx.restore();
        }
    });
}

// Hauptanimationsschleife
function animate() {
    // Hintergrund leeren oder animierten Hintergrund zeichnen
    if (animationSettings.backgroundAnimation) {
        ctx.fillStyle = 'rgba(26, 32, 44, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawAnimatedBackground();
    } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    
    time += 0.016; // ~60fps
    
    // Schweif-Effekte aktualisieren
    updateTrails();
    drawTrails();
    
    shapes.forEach((shape, index) => {
        // Position aktualisieren
        shape.x += shape.dx;
        shape.y += shape.dy;
        shape.rotation += shape.rotationSpeed;
        shape.pulsePhase += 0.05;
        
        // Bounce-Mechanik statt Verschwinden
        if (animationSettings.bounceEnabled) {
            if (shape.x <= shape.size || shape.x >= canvas.width - shape.size) {
                shape.dx = -shape.dx;
                shape.x = Math.max(shape.size, Math.min(canvas.width - shape.size, shape.x));
            }
            if (shape.y <= shape.size || shape.y >= canvas.height - shape.size) {
                shape.dy = -shape.dy;
                shape.y = Math.max(shape.size, Math.min(canvas.height - shape.size, shape.y));
            }
        } else {
            // Alte Mechanik: Form verschwindet
            if (shape.x < 0 || shape.x > canvas.width || shape.y < 0 || shape.y > canvas.height) {
                shapes.splice(index, 1);
                return;
            }
        }
        
        // Form zeichnen
        drawShape(shape);
    });
    
    // Neue Formen hinzufügen (langsamer)
    if (Math.random() < 0.02) {
        createShape();
    }
    
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

// Steuerungselemente
const shapeCountSlider = document.getElementById('shapeCount');
const shapeCountValue = document.getElementById('shapeCountValue');
const speedSlider = document.getElementById('speed');
const speedValue = document.getElementById('speedValue');
const colorModeSelect = document.getElementById('colorMode');
const glowCheckbox = document.getElementById('glowEffect');
const trailCheckbox = document.getElementById('trailEffect');
const bounceCheckbox = document.getElementById('bounceEffect');
const backgroundCheckbox = document.getElementById('backgroundAnimation');
const resetButton = document.getElementById('resetButton');
const presetNeonButton = document.getElementById('presetNeon');
const presetCalmButton = document.getElementById('presetCalm');
const fullscreenHint = document.getElementById('fullscreenHint');

// Event Listeners für Steuerungselemente
shapeCountSlider.addEventListener('input', (e) => {
    animationSettings.maxShapes = parseInt(e.target.value);
    shapeCountValue.textContent = e.target.value;
});

speedSlider.addEventListener('input', (e) => {
    animationSettings.speed = parseFloat(e.target.value);
    speedValue.textContent = e.target.value;
});

colorModeSelect.addEventListener('change', (e) => {
    animationSettings.colorMode = e.target.value;
});

glowCheckbox.addEventListener('change', (e) => {
    animationSettings.glowEnabled = e.target.checked;
});

trailCheckbox.addEventListener('change', (e) => {
    animationSettings.trailsEnabled = e.target.checked;
});

bounceCheckbox.addEventListener('change', (e) => {
    animationSettings.bounceEnabled = e.target.checked;
});

backgroundCheckbox.addEventListener('change', (e) => {
    animationSettings.backgroundAnimation = e.target.checked;
});

// Preset-Funktionen
resetButton.addEventListener('click', () => {
    shapes = [];
    particles = [];
    backgroundGradientOffset = 0;
    time = 0;
});

presetNeonButton.addEventListener('click', () => {
    animationSettings.colorMode = 'neon';
    animationSettings.glowEnabled = true;
    animationSettings.trailsEnabled = true;
    animationSettings.speed = 2;
    animationSettings.backgroundAnimation = true;
    
    // UI aktualisieren
    colorModeSelect.value = 'neon';
    glowCheckbox.checked = true;
    trailCheckbox.checked = true;
    speedSlider.value = 2;
    speedValue.textContent = '2';
    backgroundCheckbox.checked = true;
    
    // Bestehende Formen mit neuen Farben aktualisieren
    shapes.forEach(shape => {
        shape.color = getColorByMode('neon');
        shape.dx = shape.dx * 2 / animationSettings.speed;
        shape.dy = shape.dy * 2 / animationSettings.speed;
    });
});

presetCalmButton.addEventListener('click', () => {
    animationSettings.colorMode = 'pastel';
    animationSettings.glowEnabled = false;
    animationSettings.trailsEnabled = false;
    animationSettings.speed = 0.5;
    animationSettings.backgroundAnimation = false;
    
    // UI aktualisieren
    colorModeSelect.value = 'pastel';
    glowCheckbox.checked = false;
    trailCheckbox.checked = false;
    speedSlider.value = 0.5;
    speedValue.textContent = '0.5';
    backgroundCheckbox.checked = false;
    
    // Bestehende Formen mit neuen Farben aktualisieren
    shapes.forEach(shape => {
        shape.color = getColorByMode('pastel');
        shape.dx = shape.dx * 0.5 / animationSettings.speed;
        shape.dy = shape.dy * 0.5 / animationSettings.speed;
        shape.trail = []; // Trails löschen
    });
});

// Start-Button-Event
startButton.addEventListener('click', () => {
    canvas.style.display = 'block';
    fullscreenHint.style.display = 'block';
    shapes = [];
    particles = [];
    enterFullscreen();
    animate();
});

// Stop-Button-Event
stopButton.addEventListener('click', () => {
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.display = 'none';
    fullscreenHint.style.display = 'none';
});

// ESC-Taste zum Beenden
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && canvas.style.display === 'block') {
        cancelAnimationFrame(animationId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.display = 'none';
        fullscreenHint.style.display = 'none';
    }
});

// Fenstergröße-Anpassung
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
