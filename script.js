// ===== НАСТРОЙКИ TELEGRAM =====
var TELEGRAM_BOT_TOKEN = '8830323702:AAG6wQxE9mqqWzJP63GeFbO2yHHyBCfVZ1Y';
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

// ============ КРОЛИК ============
var BUNNY_PX_X = 0, BUNNY_PX_Y = 0, BUNNY_RADIUS = 65;

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
    text.style.top = (y + 10) + '%';
    BUNNY_PX_X = x / 100 * window.innerWidth;
    BUNNY_PX_Y = y / 100 * window.innerHeight;
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
    checkCanvas.width = 60;
    checkCanvas.height = 60;
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
        ctx.lineWidth = 80;

        if (lastX === null) {
            ctx.beginPath();
            ctx.arc(x, y, 40, 0, Math.PI * 2);
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

    function checkAroundBunny() {
        if (revealedMax) return;
        try {
            var r = BUNNY_RADIUS + 40;
            var scaleX = canvas.width / window.innerWidth;
            var scaleY = canvas.height / window.innerHeight;
            var sx = (BUNNY_PX_X - r) * scaleX;
            var sy = (BUNNY_PX_Y - r) * scaleY;
            var sw = r * 2 * scaleX;
            var sh = r * 2 * scaleY;
            if (sx < 0) { sw += sx; sx = 0; }
            if (sy < 0) { sh += sy; sy = 0; }
            if (sx + sw > canvas.width) sw = canvas.width - sx;
            if (sy + sh > canvas.height) sh = canvas.height - sy;

            checkCtx.clearRect(0, 0, 60, 60);
            checkCtx.drawImage(canvas, sx, sy, sw, sh, 0, 0, 60, 60);
            var img = checkCtx.getImageData(0, 0, 60, 60);
            var total = 60 * 60;
            var clear = 0;
            for (var i = 3; i < img.data.length; i += 4) {
                if (img.data[i] < 50) clear++;
            }
            if (clear / total > 0.65) {
                revealedMax = true;
                if (hint) hint.classList.add('hide');
                canvas.classList.add('fade-away');
                setTimeout(function(){
                    canvas.style.display = 'none';
                }, 2400);
            }
        } catch(e) {}
    }

    canvas.addEventListener('mousedown', function(e){ scratching = true; lastX = null; lastY = null; var p = getPos(e); scratchTo(p.x, p.y); checkAroundBunny(); });
    canvas.addEventListener('mousemove', function(e){ if (!scratching) return; var p = getPos(e); scratchTo(p.x, p.y); checkAroundBunny(); });
    canvas.addEventListener('mouseup', function(){ scratching = false; lastX = null; lastY = null; });
    canvas.addEventListener('mouseleave', function(){ scratching = false; lastX = null; lastY = null; });

    canvas.addEventListener('touchstart', function(e){ e.preventDefault(); scratching = true; lastX = null; lastY = null; var p = getPos(e); scratchTo(p.x, p.y); checkAroundBunny(); }, { passive: false });
    canvas.addEventListener('touchmove', function(e){ e.preventDefault(); if (!scratching) return; var p = getPos(e); scratchTo(p.x, p.y); checkAroundBunny(); }, { passive: false });
    canvas.addEventListener('touchend', function(){ scratching = false; lastX = null; lastY = null; });

    window.addEventListener('resize', resize);
    resize();
})();

// ============ КЛИК НА КРОЛИКА ============
document.getElementById('bunny').addEventListener('click', function(e){
    e.stopPropagation();
    e.preventDefault();

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
            }, 1600);
        }, 1600);
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

// ============ ВЫБОР СЛУЧАЙНОГО ============
function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ============ БАЗА СООБЩЕНИЙ ============
// Q1 — «Какая ты, когда никто не видит?»
var messagesQ1 = {
    '🥺 Ранимая': [
        'Я это запомню. И буду с тобой аккуратен.',
        'Твоя ранимость — не слабость. Это то, что делает тебя настоящей.',
        'Спасибо, что показала это. Я не подведу.'
    ],
    '😈 Дерзкая': [
        'Ха, люблю эту сторону. Пусть она тоже будет со мной.',
        'Дерзкая Варя — это отдельный вид искусства.',
        'С такой не соскучишься. И я не хочу скучать.'
    ],
    '🌸 Нежная': [
        'Это твоя суть. Не прячь её от меня.',
        'Ты нежная. И это редкий, ценный дар.',
        'В твоей нежности столько силы. Я это вижу.'
    ],
    '🖤 Настоящая': [
        'Вот эту тебя я и хочу знать.',
        'Настоящая — самая красивая версия тебя.',
        'Без масок. Спасибо, что такая.'
    ],
    '✨ Мечтательная': [
        'Расскажи мне, о чём ты мечтаешь.',
        'Мечтательные люди — это те, кто меняет мир.',
        'Твои мечты. Я хочу их знать.'
    ],
    '😂 Смешная': [
        'Смех — лучшее, что в тебе есть. И это о многом.',
        'С тобой весело даже в тишине. Это дар.',
        'Люблю, когда ты смеёшься. Это мой любимый звук.'
    ]
};

// Q2 — «Что ты делаешь, когда тебе хорошо?»
var messagesQ2 = {
    '😴 Сплю': [
        'Сон — это святое. Пусть снятся только тёплые сны.',
        'Спи, моя хорошая. Пусть утро будет добрым.',
        'Пусть сны будут такими же красивыми, как ты.'
    ],
    '🛋 Лежу': [
        'Тоже умеешь просто быть. Это редкий талант.',
        'Иногда просто лежать — это тоже отдых для души.',
        'Люблю, когда ты никуда не спешишь.'
    ],
    '🎮 Играю': [
        'Люблю, когда у тебя горят глаза. Даже от игры.',
        'Азартная Варя — интересно посмотреть.',
        'Пусть побеждаешь. Хотя ты и так победитель.'
    ],
    '🍷 Бухаю': [
        'Ха, значит весёлая ты. Хочу увидеть это настроение.',
        'Осторожнее там. Но веселись от души.',
        'Пьяная Варя — это отдельный жанр. Уверен, крутой.'
    ],
    '🎵 Слушаю музыку': [
        'Интересно, что играет у тебя в наушниках сейчас...',
        'Музыка — это язык, который ты понимаешь. И я хочу его учить.',
        'Поделишься плейлистом? Хочу знать, что тебя трогает.'
    ],
    '🍕 Кушаю': [
        'Вкусная еда — маленькое счастье. Ты его заслуживаешь.',
        'Приятного аппетита, моя хорошая.',
        'Надеюсь, вкусно. Ты заслуживаешь вкусного.'
    ],
    '🚶 Гуляю': [
        'Люблю представлять тебя на улице, куда-то идущую...',
        'Прогулки — это твоё. Пусть погода будет тёплой.',
        'Гуляй. Дыши. Наслаждайся. Ты этого достойна.'
    ],
    '🎨 Рисую': [
        'Ты творишь. Это красиво, даже если ты сама не замечаешь.',
        'Твои рисунки — часть тебя. Хочу однажды увидеть.',
        'Творчество — это твоя суперсила. Не бросай.'
    ],
    '💪 Тренируюсь': [
        'Сильная и красивая. Сочетание, от которого я в восторге.',
        'Ты вкладываешь в себя. Это уважение.',
        'Каждая тренировка — это победа. Я это вижу.'
    ],
    '🤗 Обнимаюсь': [
        'Обнимашки — язык, который я понимаю без слов.',
        'Если бы я был рядом — обнял бы тебя сейчас.',
        'Обнимать тебя — это то, что я хочу делать каждый день.'
    ]
};

// Q3 — «Как ты понимаешь, что человек — твой?»
var messagesQ3 = {
    '👀 По взгляду': [
        'Взгляд не соврёт. Я хочу, чтобы мой был для тебя тёплым.',
        'По глазам можно многое понять. Это дар — видеть.',
        'Значит, ты чувствуешь глубже, чем многие. Это редкость.'
    ],
    '🌙 По молчанию': [
        'Молчание рядом — это высшая форма близости.',
        'Уметь молчать вместе — это тоже умение. Ты умеешь.',
        'Тишина с тобой — уже разговор.'
    ],
    '🤍 По заботе': [
        'Значит, ты чувствуешь, когда кто-то нужен. Это ценное.',
        'Забота — это язык любви. И ты его знаешь.',
        'Я хочу быть тем, о ком ты тоже будешь заботиться.'
    ],
    '😂 По смеху': [
        'Смех — это искра. Если она есть — всё настоящее.',
        'Когда смеёшься вместе — это уже своё.',
        'Хороший признак. Смех не соврёт.'
    ],
    '🛡 По надёжности': [
        'Надёжность — это редкость. Уважаю, что ты её чувствуешь.',
        'Значит, тебе важно, чтобы человек был опорой. Я это понимаю.',
        'Хочу быть для тебя тем, на кого можно опереться.'
    ],
    '🔥 По искре': [
        'Искра — это то, что не объяснишь. И её не подделать.',
        'Значит, ты веришь в химию. И правильно.',
        'Между нами есть эта искра. Я это чувствую.'
    ]
};

// Q4 — «Что бы ты хотела, чтобы я знал о тебе?»
var messagesQ4 = {
    '😴 Что я устаю': [
        'Хочу быть тем, с кем ты можешь просто выдохнуть.',
        'Усталость — не слабость. Отдыхай, когда нужно.',
        'Если когда-нибудь захочешь — я рядом. Просто быть рядом.'
    ],
    '🌧 Что я грущу': [
        'Грусть — это часть тебя. Не прячь её.',
        'Хочу, чтобы в грустные моменты ты знала — я есть.',
        'Если будет плохо — ты не одна. Запомни это.'
    ],
    '🌸 Что я нежная': [
        'Твоя нежность — моё любимое в тебе.',
        'Нежная Варя — это то, что я хочу беречь.',
        'Спасибо, что такая. Не теряй это.'
    ],
    '⚔ Что я сильная': [
        'Сила в тебе — это то, что восхищает.',
        'Ты справишься со всем. Я это знаю.',
        'Сильная — но не значит одинокая. Я рядом.'
    ],
    '🤍 Что я нуждаюсь в тебе': [
        'Значит, ты тоже умеешь просить. Это смелость.',
        'Я хочу быть нужным тебе. Правда.',
        'Это честно. И это ценно. Спасибо.'
    ],
    '🖤 Что я боюсь': [
        'Страхи есть у всех. Ты не одна в них.',
        'Спасибо, что доверила это. Я аккуратно.',
        'С тобой — мне тоже иногда страшно. Но я хочу идти вперёд.'
    ]
};

// Финальные подписи (для самого конца)
var finaleSignatures = [
    'Я тебя ценю. Правда.',
    'Люблю тебя. И буду рядом.',
    'Спасибо, что ты есть. Каждый день.',
    'Ты — моё. И это моё любимое.',
    'Ты стала моим favourite человеком.'
];

// Персональная строка финала (зависит от выбора в Q4)
var finalePersonalMap = {
    '🌸 Что я нежная': 'Ты нежная. И это то, что я особенно ценю.',
    '🤍 Что я нуждаюсь в тебе': 'Ты можешь на меня положиться. Всегда.',
    '🖤 Что я боюсь': 'Твои страхи — наши страхи. Я рядом.',
    '⚔ Что я сильная': 'Твоя сила вдохновляет. И я хочу быть рядом.',
    '😴 Что я устаю': 'Отдыхай со мной. Я хочу быть твоим покоем.',
    '🌧 Что я грущу': 'Твоя грусть — не одна. Я буду рядом.'
};

// ============ СТРЕЛКА ============
function addArrowToPanel(panel, callback) {
    var old = panel.querySelector('.continue-arrow');
    if (old) old.remove();
    var arrow = document.createElement('span');
    arrow.className = 'continue-arrow';
    arrow.innerHTML = '→';
    panel.appendChild(arrow);
    setTimeout(function(){ arrow.classList.add('show'); }, 300);
    arrow.onclick = callback;
}

// ============ ОТВЕТЫ ============
var answers = {};

document.querySelectorAll('.options').forEach(function(opt){
    var qid = opt.getAttribute('data-question');
    answers[qid] = [];
    opt.querySelectorAll('.option-btn').forEach(function(btn){
        btn.addEventListener('click', function(){
            btn.classList.toggle('selected');
            var a = btn.textContent.trim();
            if (btn.classList.contains('selected')) {
                if (answers[qid].indexOf(a) === -1) answers[qid].push(a);
            } else {
                answers[qid] = answers[qid].filter(function(x){ return x !== a; });
            }
        });
    });
});

// ============ НАВИГАЦИЯ ВОПРОСОВ ============
function bindQuestion(qId, qKey, nextAction) {
    var q = document.getElementById(qId);
    var panel = q.querySelector('.glass-panel');
    var options = q.querySelector('.options');
    var qid = options.getAttribute('data-question');

    var arrow = document.createElement('span');
    arrow.className = 'continue-arrow';
    arrow.innerHTML = '→';
    panel.appendChild(arrow);

    function checkSelected() {
        if (answers[qid] && answers[qid].length > 0) {
            arrow.classList.add('show');
        } else {
            arrow.classList.remove('show');
        }
    }

    options.querySelectorAll('.option-btn').forEach(function(btn){
        btn.addEventListener('click', function(){
            setTimeout(checkSelected, 30);
        });
    });

    arrow.onclick = function(){
        if (answers[qid].length === 0) return;
        nextAction();
    };
}

bindQuestion('q1', null, function(){
    hideScreen('q1');
    setTimeout(function(){ showMessageScreen('msg1', 'msg1Content', answers['Настоящая'], messagesQ1, 'q2'); }, 700);
});
bindQuestion('q2', null, function(){
    hideScreen('q2');
    setTimeout(function(){ showMessageScreen('msg2', 'msg2Content', answers['Хорошо'], messagesQ2, 'q3'); }, 700);
});
bindQuestion('q3', null, function(){
    hideScreen('q3');
    setTimeout(function(){ showMessageScreen('msg3', 'msg3Content', answers['Свой'], messagesQ3, 'q4'); }, 700);
});
bindQuestion('q4', null, function(){
    hideScreen('q4');
    setTimeout(function(){ showMessageScreen('msg4', 'msg4Content', answers['О тебе'], messagesQ4, 'finale'); }, 700);
});

// ============ ПОКАЗ СООБЩЕНИЙ ============
function showMessageScreen(screenId, contentId, selectedAnswers, messageMap, nextId) {
    var screen = document.getElementById(screenId);
    var container = document.getElementById(contentId);
    container.innerHTML = '';

    var delay = 0;
    selectedAnswers.forEach(function(ans){
        if (messageMap[ans]) {
            var phrase = pickRandom(messageMap[ans]);
            var p = document.createElement('p');
            p.className = 'message-text';
            p.textContent = phrase;
            container.appendChild(p);
            (function(el, d){
                setTimeout(function(){ el.classList.add('show'); }, d);
            })(p, delay);
            delay += 1700;
        }
    });

    showScreen(screenId);

    var panel = screen.querySelector('.glass-panel');
    var old = panel.querySelector('.continue-arrow');
    if (old) old.remove();

    setTimeout(function(){
        var arrow = document.createElement('span');
        arrow.className = 'continue-arrow';
        arrow.innerHTML = '→';
        panel.appendChild(arrow);
        setTimeout(function(){ arrow.classList.add('show'); }, 300);
        arrow.onclick = function(){
            hideScreen(screenId);
            setTimeout(function(){
                if (nextId === 'finale') {
                    showFinale();
                } else {
                    showScreen(nextId);
                }
            }, 700);
        };
    }, delay + 800);
}

// ============ ФИНАЛ ============
function showFinale() {
    sendAnswersToTelegram();

    var screen = document.getElementById('finale');
    showScreen('finale');

    // Персональная строка
    var personalText = '';
    var selectedQ4 = answers['О тебе'] || [];
    for (var i = 0; i < selectedQ4.length; i++) {
        if (finalePersonalMap[selectedQ4[i]]) {
            personalText = finalePersonalMap[selectedQ4[i]];
            break;
        }
    }
    if (!personalText) {
        personalText = 'Ты — та, ради кого я хочу становиться лучше.';
    }
    document.getElementById('finalePersonal').textContent = personalText;
    document.getElementById('finaleSignature').textContent = pickRandom(finaleSignatures);

    // Анимация появления
    var lines = screen.querySelectorAll('.finale-line');
    lines.forEach(function(l){ l.classList.remove('show'); });
    lines.forEach(function(line, i){
        setTimeout(function(){ line.classList.add('show'); }, i * 1800 + 400);
    });
}

// ============ ОТПРАВКА В TELEGRAM ============
function sendAnswersToTelegram() {
    var msg = '🌌 Ответы Вари:\n\n';
    for (var key in answers) {
        if (answers[key].length > 0) {
            msg += key + ': ' + answers[key].join(', ') + '\n';
        }
    }
    msg += '\nВремя: ' + new Date().toLocaleString('ru-RU');

    var url = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage' +
              '?chat_id=' + TELEGRAM_CHAT_ID +
              '&text=' + encodeURIComponent(msg);

    fetch(url)
        .then(function(r){ return r.json(); })
        .then(function(d){
            console.log('Telegram ответ:', d);
            if (!d.ok) {
                console.error('Ошибка Telegram:', d.description);
            }
        })
        .catch(function(e){
            console.error('Ошибка fetch:', e);
        });
}

console.log('Сайт для Вари загружен 🌌');
