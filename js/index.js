/* ============================================================
   FITSYNC — index.js
   Todo el JavaScript del index.html en un solo archivo.
   Contiene:
     1. AOS (Animate On Scroll) — init
     2. Hero Motion Background — Canvas animation con
        equipamiento de gym flotando (mancuernas, barbells,
        kettlebells y discos) en acentos neón amarillo.
============================================================ */

/* ── 1. AOS INIT ── */
AOS.init();

/* ── 2. HERO MOTION BACKGROUND ── */
(function () {
    const canvas = document.getElementById('heroCanvas');
    const ctx    = canvas.getContext('2d');

    function resize() {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    window.addEventListener('resize', () => { resize(); spawnEquipment(); });
    resize();

    function rand(min, max) { return Math.random() * (max - min) + min; }

    /* =============================================
       FUNCIONES DE DIBUJO — Equipamiento de Gym
    ============================================= */

    /* Mancuerna (dumbbell) centrada en (0,0) horizontal */
    function drawDumbbell(ctx, size, color) {
        const barLen   = size * 1.1;
        const plateW   = size * 0.32;
        const plateH   = size * 0.52;
        const barThick = size * 0.12;
        const knurl    = size * 0.14; // grip center strip

        // barra central
        ctx.fillStyle = color;
        ctx.fillRect(-barLen/2, -barThick/2, barLen, barThick);

        // grip (zona central más gruesa)
        ctx.fillRect(-knurl/2, -barThick * 0.9, knurl, barThick * 1.8);

        // discos izquierda
        ctx.beginPath();
        ctx.roundRect(-barLen/2 - plateW, -plateH/2, plateW, plateH, 3);
        ctx.fill();
        // borde interior izquierda
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.roundRect(-barLen/2 - plateW + 4, -plateH/2 + 4, plateW - 8, plateH - 8, 2);
        ctx.fill();

        // discos derecha
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(barLen/2, -plateH/2, plateW, plateH, 3);
        ctx.fill();
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.roundRect(barLen/2 + 4, -plateH/2 + 4, plateW - 8, plateH - 8, 2);
        ctx.fill();
    }

    /* Barbell (barra larga de gym) centrada en (0,0) */
    function drawBarbell(ctx, size, color) {
        const barLen   = size * 2.8;
        const barThick = size * 0.1;
        const plateW   = size * 0.28;
        const p1H      = size * 0.70; // disco grande
        const p2H      = size * 0.55; // disco pequeño

        // barra
        ctx.fillStyle = color;
        ctx.fillRect(-barLen/2, -barThick/2, barLen, barThick);

        const sides = [-1, 1];
        sides.forEach(s => {
            const base = s * (barLen/2 - plateW);

            // disco grande exterior
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.roundRect(base + s * plateW * 0.05, -p1H/2, plateW * 0.95, p1H, 3);
            ctx.fill();
            ctx.fillStyle = 'rgba(0,0,0,0.25)';
            ctx.beginPath();
            ctx.roundRect(base + s * plateW * 0.05 + 4, -p1H/2 + 5, plateW * 0.95 - 8, p1H - 10, 2);
            ctx.fill();

            // disco pequeño interior
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.roundRect(base - s * plateW * 1.1, -p2H/2, plateW * 0.8, p2H, 3);
            ctx.fill();
        });
    }

    /* Kettlebell centrado en (0,0) */
    function drawKettlebell(ctx, size, color) {
        const r  = size * 0.42;  // radio del cuerpo
        const hW = size * 0.32;  // ancho del asa
        const hT = size * 0.1;   // grosor del asa

        // cuerpo (esfera achatada)
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(0, r * 0.3, r, r * 0.88, 0, 0, Math.PI * 2);
        ctx.fill();

        // sombra interior
        ctx.fillStyle = 'rgba(0,0,0,0.22)';
        ctx.beginPath();
        ctx.ellipse(r * 0.2, r * 0.55, r * 0.55, r * 0.5, 0.4, 0, Math.PI * 2);
        ctx.fill();

        // asa (handle) — arco
        ctx.strokeStyle = color;
        ctx.lineWidth   = hT;
        ctx.lineCap     = 'round';
        ctx.beginPath();
        ctx.arc(0, 0, hW / 2, Math.PI, 0, false); // semicírculo superior
        ctx.stroke();

        // travesaño del asa (base plana)
        ctx.beginPath();
        ctx.moveTo(-hW/2, 0);
        ctx.lineTo( hW/2, 0);
        ctx.stroke();

        // agujero pequeño en el cuerpo
        ctx.fillStyle = 'rgba(0,0,0,0.35)';
        ctx.beginPath();
        ctx.arc(0, r * 0.35, r * 0.18, 0, Math.PI * 2);
        ctx.fill();
    }

    /* Disco de peso solo */
    function drawPlate(ctx, size, color) {
        const outer = size * 0.5;
        const inner = size * 0.32;
        const hole  = size * 0.1;

        // aro exterior
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0, 0, outer, 0, Math.PI * 2);
        ctx.fill();

        // aro interior (contraste)
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.arc(0, 0, inner, 0, Math.PI * 2);
        ctx.fill();

        // aro relleno color más claro
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0, 0, inner * 0.7, 0, Math.PI * 2);
        ctx.fill();

        // agujero central
        ctx.fillStyle = 'rgba(10,10,10,0.9)';
        ctx.beginPath();
        ctx.arc(0, 0, hole, 0, Math.PI * 2);
        ctx.fill();
    }

    /* =============================================
       CLASE OBJETO FLOTANTE
    ============================================= */
    const TYPES = ['dumbbell', 'barbell', 'kettlebell', 'plate'];

    class GymObject {
        constructor(init) { this.respawn(init); }

        respawn(init) {
            this.type   = TYPES[Math.floor(Math.random() * TYPES.length)];
            this.size   = rand(28, 70);
            this.x      = rand(-100, canvas.width + 100);
            this.y      = init ? rand(-50, canvas.height + 50) : canvas.height + 80;

            this.vx     = rand(-0.25, 0.25);
            this.vy     = rand(-0.55, -0.15);
            this.angle  = rand(0, Math.PI * 2);
            this.vAngle = rand(-0.008, 0.008);

            // opacity & pulsing
            this.alpha      = rand(0.06, 0.22);
            this.pulse      = rand(0, Math.PI * 2);
            this.pulseSpeed = rand(0.012, 0.03);

            // color: 70% amarillo neón, 30% blanco
            this.isYellow = Math.random() < 0.70;
        }

        update() {
            this.x      += this.vx;
            this.y      += this.vy;
            this.angle  += this.vAngle;
            this.pulse  += this.pulseSpeed;

            // Wrap horizontal
            if (this.x < -150) this.x = canvas.width + 150;
            if (this.x > canvas.width + 150) this.x = -150;

            // Reaparece desde abajo si sale por arriba
            if (this.y < -150) this.respawn(false);
        }

        draw() {
            const breathe = 0.85 + 0.15 * Math.sin(this.pulse);
            const alpha   = this.alpha * breathe;
            const color   = this.isYellow
                ? `rgba(215,255,0,${alpha})`
                : `rgba(220,220,220,${alpha})`;

            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);

            // glow sutil
            ctx.shadowColor = this.isYellow ? '#d7ff00' : '#ffffff';
            ctx.shadowBlur  = 10 * breathe;

            switch (this.type) {
                case 'dumbbell':   drawDumbbell(ctx, this.size, color);   break;
                case 'barbell':    drawBarbell(ctx, this.size, color);    break;
                case 'kettlebell': drawKettlebell(ctx, this.size, color); break;
                case 'plate':      drawPlate(ctx, this.size, color);      break;
            }

            ctx.restore();
        }
    }

    /* =============================================
       FONDO
    ============================================= */
    let bgPhase = 0;
    function drawBackground() {
        bgPhase += 0.002;
        const ox   = canvas.width  * (0.5 + Math.sin(bgPhase) * 0.06);
        const oy   = canvas.height * (0.5 + Math.cos(bgPhase * 0.7) * 0.05);
        const grad = ctx.createRadialGradient(ox, oy, 0, canvas.width/2, canvas.height/2, canvas.width * 0.85);
        grad.addColorStop(0,   '#111409');
        grad.addColorStop(0.5, '#0c0d06');
        grad.addColorStop(1,   '#0a0a0a');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    /* =============================================
       INICIALIZAR OBJETOS
    ============================================= */
    let objects = [];
    function spawnEquipment() {
        objects = [];
        const count = Math.floor((canvas.width * canvas.height) / 22000);
        const total = Math.max(10, Math.min(28, count));
        for (let i = 0; i < total; i++) objects.push(new GymObject(true));
    }
    spawnEquipment();

    /* =============================================
       LOOP PRINCIPAL
    ============================================= */
    function animate() {
        requestAnimationFrame(animate);
        drawBackground();
        objects.forEach(o => { o.update(); o.draw(); });
    }
    animate();
})();
