// ============ ГАЛАКТИКА НА CANVAS (АДАПТИВНАЯ) ============
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
    var NUM_STARS = isMobile ? 900 : 1800;
    var lastFrame = 0;
    var frameInterval = isMobile ? 1000/30 : 1000/60;
    var galaxyImg = null;

    function resize() {
        var dpr = isMobile ? 1 : Math.min(window.devicePixelRatio || 1, 1.5);
        W = canvas.width = window.innerWidth * dpr;
        H = canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + 'px';
        canvas.style.height = window.innerHeight + 'px';

        // На телефоне — центр ближе и НЕ за краем
        if (isMobile) {
            CX = W * 0.65;
            CY = H * 0.30;
        } else {
            CX = W * 0.78;
            CY = H * 0.22;
        }

        buildStars();
        renderStatic();
    }

    function buildStars() {
        stars = [];
        var arms = 2;
        var armSpread = 0.55;
        var innerR = 8;
        // На телефоне галактика меньше по радиусу
        var sizeBase = Math.min(W, H);
        var outerR = isMobile ? sizeBase * 0.85 : sizeBase * 0.75;

        for (var i = 0; i < NUM_STARS; i++) {
            var t = Math.pow(Math.random(), 0.65);
            var radius = innerR + t * outerR;
            var armIndex = i % arms;
            var armAngle = (armIndex / arms) * Math.PI * 2;
            var spiralTightness = 3.2;
            var angle = armAngle + (radius / outerR) * spiralTightness * Math.PI;
            var spread = (Math.random() - 0.5) * armSpread * (0.4 + t * 1.5);
            angle += spread;
            radius += (Math.random() - 0.5) * 20 * (0.3 + t);

            var x = Math.cos(angle) * radius;
            var y = Math.sin(angle) * radius;

            var r, g, b, alpha;
            if (t < 0.15) {
                r = 255; g = 240; b = 220; alpha = 0.95;
            } else if (t < 0.4) {
                r = 220; g = 230; b = 255; alpha = 0.85;
            } else if (t < 0.7) {
                r = 150 + Math.random() * 80;
                g = 180 + Math.random() * 60;
                b = 255; alpha = 0.7;
            } else {
                r = 200 + Math.random() * 55;
                g = 140 + Math.random() * 60;
                b = 240; alpha = 0.5;
            }
            alpha *= 0.6 + Math.random() * 0.4;
            // На телефоне звёзды крупнее, чтобы их было видно
            var size = Math.random() * (isMobile ? 1.8 : 1.2) + (isMobile ? 0.6 : 0.3);
            if (t < 0.15) size = Math.random() * 2.2 + 1;

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
        gctx.globalCompositeOperation = 'lighter';

        for (var i = 0; i < stars.length; i++) {
            var s = stars[i];
            var px = CX + Math.cos(s.angle) * s.radius;
            var py = CY + Math.sin(s.angle) * s.radius;
            if (px < -50 || px > W + 50 || py < -50 || py > H + 50) continue;

            if (s.size > 1.2 && !isMobile) {
                gctx.shadowBlur = 6;
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

        rotation += isMobile ? 0.0002 : 0.0004;

        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;
        offsetX = targetX * 15;
        offsetY = targetY * 15;

        ctx.save();
        ctx.translate(CX + offsetX, CY + offsetY);
        ctx.rotate(rotation);
        ctx.translate(-CX, -CY);
        ctx.globalCompositeOperation = 'lighter';
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
        p.style.background = color + (0.5 + Math.random() * 0.4) + ')';
        p.style.boxShadow = '0 0 8px 2px ' + color + '0.5)';
        p.style.animationDuration = (Math.random() * 14 + 12) + 's';
        container.appendChild(p);
        setTimeout(function(){ p.remove(); }, 27000);
    }
    setInterval(createParticle, isMobile ? 2000 : 900);
    var initial = isMobile ? 2 : 5;
    for (var i = 0; i < initial; i++) setTimeout(createParticle, i * 700);
})();

console.log('Галактика для Вари загружена 🌌');
