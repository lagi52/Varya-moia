// ============ ГАЛАКТИКА НА CANVAS (МАЛЕНЬКАЯ, В УГЛУ) ============
(function(){
    var canvas = document.getElementById('galaxyCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    var W, H, CX, CY;
    var stars = [];
    var rotation = 0;
    var mouseX = 0, mouseY = 0;
    var targetX = 0, targetY = 0;
    var offsetX = 0, offsetY = 0;
    var isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth < 700;
    var NUM_STARS = isMobile ? 900 : 1600;
    var lastFrame = 0;
    var frameInterval = isMobile ? 1000/30 : 1000/60;
    var galaxyImg = null;

    function resize() {
        var dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
        W = canvas.width = window.innerWidth * dpr;
        H = canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';

        // Галактика в правом верхнем углу, маленькая
        if (isMobile) {
            CX = W * 0.78;
            CY = H * 0.18;
        } else {
            CX = W * 0.82;
            CY = H * 0.20;
        }

        buildStars();
        renderStatic();
    }

    function buildStars() {
        stars = [];
        var arms = 2;
        var armSpread = 0.6;
        var innerR = 4;
        var sizeBase = Math.min(W, H);
        // Галактика МАЛЕНЬКАЯ — 30% от меньшей стороны
        var outerR = isMobile ? sizeBase * 0.35 : sizeBase * 0.38;

        for (var i = 0; i < NUM_STARS; i++) {
            var t = Math.pow(Math.random(), 0.55);
            var radius = innerR + t * outerR;
            var armIndex = i % arms;
            var armAngle = (armIndex / arms) * Math.PI * 2;
            var spiralTightness = 2.8;
            var angle = armAngle + (radius / outerR) * spiralTightness * Math.PI;
            var spread = (Math.random() - 0.5) * armSpread * (0.4 + t * 1.6);
            angle += spread;
            radius += (Math.random() - 0.5) * 10 * (0.3 + t);

            var x = Math.cos(angle) * radius;
            var y = Math.sin(angle) * radius;

            var r, g, b, alpha;
            if (t < 0.12) {
                r = 255; g = 245; b = 220; alpha = 1;
            } else if (t < 0.35) {
                r = 255; g = 220; b = 245; alpha = 0.95;
            } else if (t < 0.65) {
                r = 130 + Math.random() * 100;
                g = 200 + Math.random() * 55;
                b = 255; alpha = 0.85;
            } else {
                r = 210 + Math.random() * 45;
                g = 130 + Math.random() * 80;
                b = 255; alpha = 0.7;
            }
            alpha *= 0.7 + Math.random() * 0.3;

            var size;
            if (t < 0.12) {
                size = Math.random() * 1.6 + 0.9;
            } else if (t < 0.4) {
                size = Math.random() * 1.2 + 0.5;
            } else {
                size = Math.random() * 1.0 + 0.3;
            }
            if (isMobile) size *= 1.2;

            stars.push({
                x: x, y: y,
                size: size,
                color: 'rgba(' + Math.floor(r) + ',' + Math.floor(g) + ',' + Math.floor(b) + ',' + alpha.toFixed(2) + ')',
                angle: Math.atan2(y, x),
                radius: Math.sqrt(x*x + y*y)
            });
        }
    }

    document.addEventListener('mousemove', function(e){
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    window.addEventListener('deviceorientation', function(e){
        if (e.gamma && e.beta) {
            mouseX = Math.max(-1, Math.min(1, e.gamma / 30));
            mouseY = Math.max(-1, Math.min(1, e.beta / 30));
        }
    }, true);

    function renderStatic() {
        galaxyImg = document.createElement('canvas');
        galaxyImg.width = W;
        galaxyImg.height = H;
        var gctx = galaxyImg.getContext('2d');

        // ===== ЯДРО БЕЗ ЧЁРНОГО ПЯТНА =====
        // Сначала яркое свечение
        var coreR = Math.min(W, H) * 0.15;
        var coreGrad = gctx.createRadialGradient(CX, CY, 0, CX, CY, coreR);
        coreGrad.addColorStop(0, 'rgba(255, 250, 240, 0.95)');
        coreGrad.addColorStop(0.1, 'rgba(255, 240, 250, 0.75)');
        coreGrad.addColorStop(0.3, 'rgba(255, 200, 240, 0.4)');
        coreGrad.addColorStop(0.6, 'rgba(180, 140, 255, 0.15)');
        coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        gctx.fillStyle = coreGrad;
        gctx.fillRect(0, 0, W, H);

        // ===== ЗВЁЗДЫ =====
        gctx.globalCompositeOperation = 'lighter';

        for (var i = 0; i < stars.length; i++) {
            var s = stars[i];
            var px = CX + Math.cos(s.angle) * s.radius;
            var py = CY + Math.sin(s.angle) * s.radius;
            if (px < -50 || px > W + 50 || py < -50 || py > H + 50) continue;

            if (s.size > 0.8) {
                gctx.shadowBlur = isMobile ? 6 : 9;
                gctx.shadowColor = s.color;
            } else {
                gctx.shadowBlur = 0;
            }

            gctx.fillStyle = s.color;
            gctx.beginPath();
            gctx.arc(px, py, s.size, 0, Math.PI * 2);
            gctx.fill();
        }
        gctx.shadowBlur = 0;
    }

    function draw(timestamp) {
        requestAnimationFrame(draw);
        if (timestamp - lastFrame < frameInterval) return;
        lastFrame = timestamp;

        ctx.clearRect(0, 0, W, H);

        rotation += isMobile ? 0.00015 : 0.0003;

        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;
        offsetX = targetX * 20;
        offsetY = targetY * 20;

        ctx.save();
        ctx.translate(CX + offsetX, CY + offsetY);
        ctx.rotate(rotation);
        ctx.translate(-CX, -CY);
        ctx.drawImage(galaxyImg, 0, 0);
        ctx.restore();
    }

    window.addEventListener('resize', function(){
        clearTimeout(window._resizeT);
        window._resizeT = setTimeout(resize, 200);
    });

    resize();
    requestAnimationFrame(draw);
})();

// ============ ПАРАЛЛАКС ============
(function(){
    var layers = document.querySelectorAll('.nebula, .stars, .bright-stars');
    var isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth < 700;
    var mouseX = 0, mouseY = 0;
    var targetX = 0, targetY = 0;
    document.addEventListener('mousemove', function(e){
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    window.addEventListener('deviceorientation', function(e){
        if (e.gamma && e.beta) {
            mouseX = Math.max(-1, Math.min(1, e.gamma / 30));
            mouseY = Math.max(-1, Math.min(1, e.beta / 30));
        }
    }, true);
    var lastFrame = 0;
    var frameInterval = isMobile ? 1000/30 : 1000/60;
    function animate(timestamp){
        requestAnimationFrame(animate);
        if (timestamp - lastFrame < frameInterval) return;
        lastFrame = timestamp;
        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;
        layers.forEach(function(layer, i){
            var speed = 0.015 + (i % 4) * 0.012;
            layer.style.transform = 'translate(' + (targetX * speed * 40) + 'px, ' + (targetY * speed * 40) + 'px)';
        });
    }
    animate(0);
})();

// ============ ЧАСТИЦЫ ============
(function(){
    var container = document.getElementById('particles');
    if (!container) return;
    var isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.innerWidth < 700;
    var colors = [
        'rgba(150, 200, 255, ',
        'rgba(255, 180, 220, ',
        'rgba(150, 240, 220, ',
        'rgba(220, 200, 255, '
    ];
    function createParticle(){
        var p = document.createElement('div');
        p.className = 'particle';
        var size = Math.random() * 3 + 1.5;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = '105%';
        var color = colors[Math.floor(Math.random() * colors.length)];
        p.style.background = color + (0.6 + Math.random() * 0.4) + ')';
        p.style.boxShadow = '0 0 10px 3px ' + color + '0.6)';
        p.style.animationDuration = (Math.random() * 14 + 12) + 's';
        container.appendChild(p);
        setTimeout(function(){ p.remove(); }, 27000);
    }
    setInterval(createParticle, isMobile ? 1500 : 700);
    var initial = isMobile ? 3 : 6;
    for (var i = 0; i < initial; i++) setTimeout(createParticle, i * 600);
})();

console.log('Галактика для Вари загружена 🌌');
