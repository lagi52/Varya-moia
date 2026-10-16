// ============ ГАЛАКТИКА НА CANVAS ============
(function(){
    var canvas = document.getElementById('galaxyCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');

    var W, H, CX, CY;
    var stars = [];
    var NUM_STARS = 2500;
    var rotation = 0;
    var mouseX = 0, mouseY = 0;
    var targetX = 0, targetY = 0;
    var offsetX = 0, offsetY = 0;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        // Центр галактики — верхний правый угол экрана (частично за краем)
        CX = W * 0.78;
        CY = H * 0.22;
        buildStars();
    }

    function buildStars() {
        stars = [];
        var arms = 2;              // 2 спиральных рукава
        var armSpread = 0.55;      // разброс рукавов
        var innerR = 10;           // внутренний радиус
        var outerR = Math.min(W, H) * 0.75; // внешний радиус

        for (var i = 0; i < NUM_STARS; i++) {
            // Расстояние от центра (квадратично — плотнее к центру)
            var t = Math.pow(Math.random(), 0.65);
            var radius = innerR + t * outerR;

            // Угол — спиральные рукава
            var armIndex = i % arms;
            var armAngle = (armIndex / arms) * Math.PI * 2;

            // Спираль
            var spiralTightness = 3.2; // плотность навивки
            var angle = armAngle + (radius / outerR) * spiralTightness * Math.PI;

            // Случайный разброс
            var spread = (Math.random() - 0.5) * armSpread * (0.4 + t * 1.5);
            angle += spread;

            // Небольшое радиальное смещение
            radius += (Math.random() - 0.5) * 20 * (0.3 + t);

            var x = Math.cos(angle) * radius;
            var y = Math.sin(angle) * radius;

            // Цвет в зависимости от расстояния от центра
            var color;
            var r, g, b, alpha;

            if (t < 0.15) {
                // Ядро — тёплое, яркое
                r = 255; g = 240; b = 220;
                alpha = 0.9;
            } else if (t < 0.4) {
                // Средняя зона — бело-голубые
                r = 220; g = 230; b = 255;
                alpha = 0.75;
            } else if (t < 0.7) {
                // Рукава — голубые
                r = 150 + Math.random() * 80;
                g = 180 + Math.random() * 60;
                b = 255;
                alpha = 0.55;
            } else {
                // Края — фиолетово-розовые, тонкие
                r = 200 + Math.random() * 55;
                g = 140 + Math.random() * 60;
                b = 240;
                alpha = 0.35;
            }

            alpha *= 0.5 + Math.random() * 0.5;

            var size = Math.random() * 1.2 + 0.3;
            if (t < 0.15) size = Math.random() * 1.8 + 0.8; // ядро крупнее

            stars.push({
                x: x, y: y,
                size: size,
                color: 'rgba(' + Math.floor(r) + ',' + Math.floor(g) + ',' + Math.floor(b) + ',' + alpha.toFixed(2) + ')',
                angle: Math.atan2(y, x),
                radius: Math.sqrt(x*x + y*y)
            });
        }
    }

    // Параллакс
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

    function draw() {
        ctx.clearRect(0, 0, W, H);

        // Медленное вращение
        rotation += 0.0004;

        // Параллакс
        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;
        offsetX = targetX * 15;
        offsetY = targetY * 15;

        // Первый проход — свечение (для ярких)
        ctx.globalCompositeOperation = 'lighter';

        for (var i = 0; i < stars.length; i++) {
            var s = stars[i];
            var a = s.angle + rotation;
            var px = CX + Math.cos(a) * s.radius + offsetX;
            var py = CY + Math.sin(a) * s.radius + offsetY;

            // Отсекаем за пределами
            if (px < -50 || px > W + 50 || py < -50 || py > H + 50) continue;

            // Свечение для крупных
            if (s.size > 1) {
                ctx.shadowBlur = 6;
                ctx.shadowColor = s.color;
            } else {
                ctx.shadowBlur = 0;
            }

            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.arc(px, py, s.size, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.shadowBlur = 0;
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
})();

// ============ ПАРАЛЛАКС ОСТАЛЬНЫХ СЛОЁВ ============
(function(){
    var layers = document.querySelectorAll('.nebula, .stars, .bright-stars');
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
    function animate(){
        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;
        layers.forEach(function(layer, i){
            var speed = 0.015 + (i % 4) * 0.012;
            layer.style.transform = 'translate(' + (targetX * speed * 40) + 'px, ' + (targetY * speed * 40) + 'px)';
        });
        requestAnimationFrame(animate);
    }
    animate();
})();

// ============ ЧАСТИЦЫ ============
(function(){
    var container = document.getElementById('particles');
    if (!container) return;
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
    setInterval(createParticle, 900);
    for (var i = 0; i < 5; i++) setTimeout(createParticle, i * 500);
})();

console.log('Галактика для Вари загружена 🌌');
