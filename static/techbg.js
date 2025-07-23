// Hiệu ứng background công nghệ (network/tech)
const canvas = document.getElementById('tech-bg-canvas');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

const POINTS = 40;
const DIST = 140;
const SPEED = 0.3;
const dots = [];

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener('resize', resize);

for (let i = 0; i < POINTS; i++) {
    dots.push({
        x: random(0, width),
        y: random(0, height),
        vx: random(-SPEED, SPEED),
        vy: random(-SPEED, SPEED)
    });
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    // Draw lines
    for (let i = 0; i < POINTS; i++) {
        for (let j = i + 1; j < POINTS; j++) {
            const dx = dots[i].x - dots[j].x;
            const dy = dots[i].y - dots[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < DIST) {
                ctx.strokeStyle = `rgba(200,220,255,${1 - dist / DIST})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(dots[i].x, dots[i].y);
                ctx.lineTo(dots[j].x, dots[j].y);
                ctx.stroke();
            }
        }
    }
    // Draw dots
    for (let i = 0; i < POINTS; i++) {
        ctx.beginPath();
        ctx.arc(dots[i].x, dots[i].y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = '#b2e0ff';
        ctx.shadowColor = '#b2e0ff';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function update() {
    for (let i = 0; i < POINTS; i++) {
        dots[i].x += dots[i].vx;
        dots[i].y += dots[i].vy;
        if (dots[i].x < 0 || dots[i].x > width) dots[i].vx *= -1;
        if (dots[i].y < 0 || dots[i].y > height) dots[i].vy *= -1;
    }
}

function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
}
animate(); 