// ===== НАСТРОЙКИ TELEGRAM =====
var TELEGRAM_BOT_TOKEN = '8830323702:AAG6wQxE9mqwJzPJ63GeFb02yHHbYBCfVZ1Y';
var TELEGRAM_CHAT_ID = '5262922399';

// ============ ГАЛАКТИКА ============
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
        if (isMobile) { CX = W * 0.78; CY = H * 0.18; }
        else { CX = W * 0.82; CY = H * 0.20; }
        buildStars();
        renderStatic();
    }

    function buildStars() {
        stars = [];
        var arms = 2, armSpread = 0.6, innerR = 4;
        var sizeBase = Math.min(W, H);
        var outerR = isMobile ? sizeBase * 0.35 : sizeBase * 0.38;
        for (var i = 0; i < NUM_STARS; i++) {
            var t = Math.pow(Math.random(), 0.55);
            var radius = innerR + t * outerR;
            var armIndex = i % arms;
            var armAngle = (armIndex / arms) * Math.PI * 2;
            var angle = armAngle + (radius / outerR) * 2.8 * Math.PI;
            angle += (Math.random() - 0.5) * armSpread * (0.4 + t * 1.6);
            radius += (Math.random() - 0.5) * 10 * (0.3 + t);
            var x = Math.cos(angle) * radius;
            var y = Math.sin(angle) * radius;
            var r, g, b, alpha;
            if (t < 0.12) { r=255; g=245; b=220; alpha=1; }
            else if (t < 0.35) { r=255; g=200; b=220; alpha=0.95; }
            else if (t < 0.65) { r=220+Math.random()*35; g=130+Math.random()*80; b=180+Math.random()*60; alpha=0.85; }
            else { r=255; g=100+Math.random()*80; b=120+Math.random()*80; alpha=0.7; }
            alpha *= 0.7 + Math.random() * 0.3;
            var size = t < 0.12 ? Math.random()*1.6+0.9 : t < 0.4 ? Math.random()*1.2+0.5 : Math.random()*1.0+0.3;
            if (isMobile) size *= 1.2;
            stars.push({
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
        var coreR = Math.min(W, H) * 0.15;
        var coreGrad = gctx.createRadialGradient(CX, CY, 0, CX, CY, coreR);
        coreGrad.addColorStop(0, 'rgba(255, 250, 240, 0.95)');
        coreGrad.addColorStop(0.1, 'rgba(255, 220, 230, 0.75)');
        coreGrad.addColorStop(0.3, 'rgba(255, 150, 180, 0.4)');
        coreGrad.addColorStop(0.6, 'rgba(180, 80, 120, 0.15)');
        coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        gctx.fillStyle = coreGrad;
        gctx.fillRect(0, 0, W, H);
        gctx.globalCompositeOperation = 'lighter';
        for (var i = 0; i < stars.length; i++) {
            var s = stars[i];
            var px = CX + Math.cos(s.angle) * s.radius;
            var py = CY + Math.sin(s.angle) * s.radius;
            if (px < -50 || px > W + 50 || py < -50 || py > H + 50) continue;
            if (s.size > 0.8) { gctx.shadowBlur = isMobile ? 6 : 9; gctx.shadowColor = s.color; }
            else gctx.shadowBlur = 0;
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
    var mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
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
    var colors = ['rgba(255, 180, 190, ', 'rgba(255, 120, 140, ', 'rgba(255, 200, 200, ', 'rgba(220, 100, 130, '];
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

// ============ ЗАЙЧИК ============
function placeBunnyRandomly() {
    var bunny = document.getElementById('bunny');
    var text = document.getElementById('bunnyText');
    var minX = 25, maxX = 75;
    var minY = 30, maxY = 55;
    var x = minX + Math.random() * (maxX - minX);
    var y = minY + Math.random() * (maxY - minY);
    bunny.style.left = x + '%';
    bunny.style.top = y + '%';
    text.style.left = x + '%';
    text.style.top = (y + 13) + '%';
}
placeBunnyRandomly();

// ============ СТИРАНИЕ ============
(function(){
    var canvas = document.getElementById('scratchCanvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var scratching = false;
    var revealedMax = false;
    var lastX = null, lastY = null;
    var hint = document.getElementById('scratchHint');

    var checkCanvas = document.createElement('canvas');
    checkCanvas.width = 100;
    checkCanvas.height = 100;
    var checkCtx = checkCanvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawCover();
    }

    function drawCover() {
        ctx.globalCompositeOperation = 'source-over';
        var grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        grad.addColorStop(0, '#1a0a18');
        grad.addColorStop(0.5, '#3a1428');
        grad.addColorStop(1, '#1a0818');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (var i = 0; i < 800; i++) {
            ctx.fillStyle = 'rgba(255, 200, 220, ' + (Math.random()*0.06) + ')';
            ctx.fillRect(Math.random()*canvas.width, Math.random()*canvas.height, 1, 1);
        }
    }

    function getPos(e) {
        var rect = canvas.getBoundingClientRect();
        if (e.touches && e.touches[0]) return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function scratchTo(x, y) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 150;

        if (lastX === null) {
            ctx.beginPath();
            ctx.arc(x, y, 75, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.stroke();
        }
        lastX = x;
        lastY = y;
    }

    function checkPercent() {
        if (revealedMax) return;
        try {
            checkCtx.clearRect(0, 0, 100, 100);
            checkCtx.drawImage(canvas, 0, 0, 100, 100);
            var img = checkCtx.getImageData(0, 0, 100, 100);
            var total = 100 * 100;
            var clear = 0;
            for (var i = 3; i < img.data.length; i += 4) {
                if (img.data[i] < 50) clear++;
            }
            if (clear / total > 0.4) {
                revealedMax = true;
                if (hint) hint.classList.add('hide');
                canvas.classList.add('fade-away');
                setTimeout(function(){
                    canvas.style.display = 'none';
                }, 2000);
            }
        } catch(e) {}
    }

    canvas.addEventListener('mousedown', function(e){ scratching = true; lastX = null; lastY = null; var p = getPos(e); scratchTo(p.x, p.y); checkPercent(); });
    canvas.addEventListener('mousemove', function(e){ if (!scratching) return; var p = getPos(e); scratchTo(p.x, p.y); checkPercent(); });
    canvas.addEventListener('mouseup', function(){ scratching = false; lastX = null; lastY = null; });
    canvas.addEventListener('mouseleave', function(){ scratching = false; lastX = null; lastY = null; });

    canvas.addEventListener('touchstart', function(e){ e.preventDefault(); scratching = true; lastX = null; lastY = null; var p = getPos(e); scratchTo(p.x, p.y); checkPercent(); }, { passive: false });
    canvas.addEventListener('touchmove', function(e){ e.preventDefault(); if (!scratching) return; var p = getPos(e); scratchTo(p.x, p.y); checkPercent(); }, { passive: false });
    canvas.addEventListener('touchend', function(){ scratching = false; lastX = null; lastY = null; });

    window.addEventListener('resize', resize);
    resize();
})();

// ============ КЛИК НА ЗАЙЧИКА ============
document.getElementById('bunny').addEventListener('click', function(e){
    e.stopPropagation();

    var canvas = document.getElementById('scratchCanvas');
    if (canvas && canvas.style.display !== 'none' && !canvas.classList.contains('fade-away')) {
        return;
    }

    var bunny = document.getElementById('bunny');
    var iris = document.getElementById('irisCircle');

    var bunnyRect = bunny.getBoundingClientRect();
    var bunnyX = bunnyRect.left + bunnyRect.width / 2;
    var bunnyY = bunnyRect.top + bunnyRect.height / 2;
    iris.style.left = bunnyX + 'px';
    iris.style.top = bunnyY + 'px';

    document.getElementById('scratchScreen').classList.add('fade-out');

    setTimeout(function(){
        iris.classList.remove('collapse');
        iris.classList.add('expand');

        setTimeout(function(){
            document.getElementById('scratchScreen').classList.remove('active');
            setTimeout(function(){
                document.getElementById('scratchScreen').style.display = 'none';
                var q1 = document.getElementById('q1');
                q1.style.display = 'flex';
                setTimeout(function(){ q1.classList.add('active'); }, 50);
            }, 300);

            iris.classList.remove('expand');
            iris.classList.add('collapse');

            setTimeout(function(){
                iris.classList.remove('collapse');
                iris.style.left = '50%';
                iris.style.top = '50%';
            }, 1400);
        }, 1400);
    }, 800);
});

// ============ ЭКРАНЫ ============
function showScreen(id) {
    var s = document.getElementById(id);
    s.style.display = 'flex';
    setTimeout(function(){ s.classList.add('active'); }, 50);
}
function hideScreen(id) {
    var s = document.getElementById(id);
    s.classList.remove('active');
    setTimeout(function(){ s.style.display = 'none'; }, 800);
}

// ============ ОТВЕТЫ ============
var answers = {};
document.querySelectorAll('.options').forEach(function(opt){
    var qid = opt.getAttribute('data-question');
    answers[qid] = [];
    var next = opt.parentElement.querySelector('.next-btn');
    opt.querySelectorAll('.option-btn').forEach(function(btn){
        btn.addEventListener('click', function(){
            btn.classList.toggle('selected');
            var a = btn.textContent.trim();
            if (btn.classList.contains('selected')) {
                if (answers[qid].indexOf(a) === -1) answers[qid].push(a);
            } else {
                answers[qid] = answers[qid].filter(function(x){ return x !== a; });
            }
            if (answers[qid].length > 0) next.classList.add('active');
            else next.classList.remove('active');
        });
    });
});

// ============ НАВИГАЦИЯ ============
document.getElementById('next1').addEventListener('click', function(){
    hideScreen('q1');
    setTimeout(function(){ showMessages('msg1', 'q2'); }, 800);
});
document.getElementById('next2').addEventListener('click', function(){
    hideScreen('q2');
    setTimeout(function(){ showMessages('msg2', 'q3'); }, 800);
});
document.getElementById('next3').addEventListener('click', function(){
    hideScreen('q3');
    setTimeout(function(){ showMessages('msg3', 'q4'); }, 800);
});
document.getElementById('next4').addEventListener('click', function(){
    hideScreen('q4');
    setTimeout(function(){ showFinale(); }, 800);
});

// ============ СООБЩЕНИЯ ============
function showMessages(msgId, nextId) {
    var screen = document.getElementById(msgId);
    showScreen(msgId);
    var msgs = screen.querySelectorAll('.message-text');
    var panel = screen.querySelector('.glass-panel');
    var oldArrow = panel.querySelector('.arrow-wrapper');
    if (oldArrow) oldArrow.remove();
    var wrap = document.createElement('div');
    wrap.className = 'arrow-wrapper';
    var arrow = document.createElement('span');
    arrow.className = 'continue-arrow';
    arrow.innerHTML = '→';
    arrow.style.display = 'none';
    wrap.appendChild(arrow);
    panel.appendChild(wrap);
    msgs.forEach(function(m, i){
        setTimeout(function(){ m.classList.add('show'); }, i * 1800);
    });
    var total = msgs.length * 1800 + 1800;
    setTimeout(function(){
        arrow.style.display = 'inline-block';
        arrow.onclick = function(){
            hideScreen(msgId);
            setTimeout(function(){ showScreen(nextId); }, 800);
        };
    }, total);
}

// ============ ФИНАЛ ============
function showFinale() {
    sendAnswersToTelegram();
    var screen = document.getElementById('finale');
    showScreen('finale');
    var lines = screen.querySelectorAll('.finale-line');
    lines.forEach(function(line, i){
        setTimeout(function(){ line.classList.add('show'); }, i * 2000 + 500);
    });
}

// ============ ОТПРАВКА В TELEGRAM ============
function sendAnswersToTelegram() {
    if (TELEGRAM_BOT_TOKEN === 'ВСТАВЬ_СЮДА_ТОКЕН') return;
    var msg = '<b>🌌 Ответы Вари:</b>\n\n';
    for (var key in answers) {
        if (answers[key].length > 0) {
            msg += '<b>' + key + ':</b> ' + answers[key].join(', ') + '\n';
        }
    }
    msg += '\n<i>Время: ' + new Date().toLocaleString('ru-RU') + '</i>';

    var url = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage';
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: msg,
            parse_mode: 'HTML'
        })
    }).catch(function(){});
}

console.log('Сайт для Вари загружен 🌌');
