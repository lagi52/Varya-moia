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
        'Значит, ты умеешь чувствовать глубоко. Не прячь это от меня. Я хочу знать все твои стороны, даже самые хрупкие.',
        'Мне хочется, чтобы рядом со мной тебе не приходилось быть сильной 24/7. Я хочу быть тем местом, где ты можешь просто быть слабой.',
        'Ранимая Варя — это самая настоящая Варя! Спасибо, что не боишься такой быть. Я ценю это в тебе.'
    ],
    '😈 Дерзкая': [
        'Люблю эту твою сторону. В ней столько огня, что я улыбаюсь, просто представляя твой взгляд!',
        'С тобой не бывает скучно. Даже когда ты вредничаешь — это безумно мило!',
        'Твоя дерзость — это твоя свобода. Не позволяй никому её гасить. Особенно мне~...'
    ],
    '🌸 Нежная': [
        'В твоей нежности столько силы, что я порой теряюсь... Не прячь её от меня.',
        'Ты как тёплый свет. Рядом с тобой хочется просто дышать, молчать, наслаждаться и никуда не спешить.',
        'От твоей нежности и меня текут слюнки и это то, что делает тебя — тобой. Я желаю беречь это в тебе.'
    ],
    '🖤 Настоящая': [
        'Вот эту тебя — без масок, без игры — я и хочу знать. Целиком. Спасибо, что пускаешь.',
        'Настоящая ты — самая неземная. Всё остальное — лучшее дополнение, которое мне хотелось бы видеть!',
        'Мне не нужна «удобная» ты. Мне нужна ты. И сейчас передо мной именно она.'
    ],
    '✨ Мечтательная': [
        'В твоих глазах есть что-то далёкое. И я хочу туда. Вместе с тобой.',
        'Расскажи мне, о чём ты мечтаешь. Мне нравится слышать, куда летят твои мысли.',
        'Не переставай мечтать. Это одна из самых красивых твоих черт~...'
    ],
    '😂 Смешная': [
        'Твой смех — это мой любимый звук. Я готов слушать его бесконечно и готов под него засыпать~...',
        'С тобой весело даже в тишине. Это редкий дар, Варя! И ты даже не представляешь, как это обворожительно притягивает.',
        'Не переставай смеяться. С твоим смехом мир становится добрее.'
    ]
};

// Q2 — «Что ты делаешь, когда тебе хорошо?»
var messagesQ2 = {
    '😴 Сплю': [
        'Спи, моя хорошая. Пусть сны будут тёплыми. Я хочу быть тем, с кем ты будешь просыпаешься с улыбкой.',
        'Сон — это святое. Отдыхай, моя хорошенькая. Ты заслуживаешь самого сладкого сна.',
        'Будучи во сне я всегда буду защищать твои покои...'
    ],
    '🛋 Лежу': [
        'Уметь просто лежать и ничего не делать — это тоже отдых для души. И я люблю тебя даже в этой тишине.',
        'Никуда не спешить рядом с тобой — мой любимый вид времени.',
        'Если бы я был сейчас рядом — просто лёг бы с тобой. И мы бы молчали. И это было бы лучшим вечером.'
    ],
    '🎮 Играю': [
        'Люблю, когда у тебя горят глаза — даже от игры. В тебе столько азарта, это заводит.',
        'Буду откровенным. Азартная ты — это отдельный вид искушения, за которым ты становишься настоящей.',
        'Играй, моя хорошая. А я буду рядом болеть за тебя и любоваться тем, как горят твои глаза~...'
    ],
    '🍷 Веселюсь': [
        'Ха. Весёлая Варя — это отдельный вид счастья. Хочу однажды увидеть это настроение рядом.',
        'Веселись от души, но аккуратно. Я хочу, чтобы утром ты улыбалась, а не страдала.',
        'Если будешь веселиться, то обязательно со мной. Я обещаю быть самой лучшей компанией~...'
    ],
    '🎵 Слушаю музыку': [
        'Что сейчас играет у тебя в наушниках? Скинь мне, я хочу почувствовать твоё настроение через эту музыку~...',
        'Музыка — это твой язык. И я хочу его учить, чтобы понимать тебя ещё глубже.',
        'Скинь мне однажды свой плейлист. Я хочу знать, что тебя трогает.'
    ],
    '🍕 Кушаю': [
        'Приятного аппетита, моя сладость! Вкусная еда — маленькое счастье.',
        'Я бы хотел однажды готовить для тебя и смотреть, как ты кушаешь. И улыбаться от того, что тебе хорошо.',
        'Ешь, моя радость. Ты — та, кого хочется баловать~...'
    ],
    '🚶 Гуляю': [
        'Люблю представлять тебя идущей куда-то — красивая, задумчивая, своя.',
        'Гуляй. Дыши. Наслаждайся. Ты этого достойна.',
        'Если бы я был рядом — пошёл бы с тобой молча. И мне было бы хорошо.'
    ],
    '🎨 Рисую': [
        'Ты творишь. Это красиво, даже если ты сама не замечаешь.',
        'В твоих рисунках — часть тебя. И я хочу однажды увидеть их все.',
        'Не бросай рисовать. Это твоя суперсила, Варя.'
    ],
    '💪 Тренируюсь': [
        'Ты вкладываешь в себя. Это уважение — к себе и к жизни.',
        'Сильная и красивая. Сочетание, от которого у меня сносит крышу~...',
        'Каждая тренировка — это победа. Я тобой горжусь.'
    ],
    '🤗 Обнимаюсь': [
        'Обнимашки — язык, который я понимаю без слов. И я говорю на нём свободно.',
        'Если бы я был рядом — обнял бы тебя прямо сейчас. И не отпускал бы очень долго.',
        'Обнимать тебя — это то, что я хочу делать каждый день. Не только сегодня.'
    ]
};

// Q3 — «Как ты понимаешь, что человек — твой?»
var messagesQ3 = {
    '👀 По взгляду': [
        'Значит, ты умеешь видеть сквозь. Это редкий дар. И я хочу, чтобы мой взгляд был для тебя тёплым.',
        'По глазам можно понять всё. И это, наверное, самое честное, что есть между людьми.',
        'Взгляд не соврёт. Если он твой — я хочу, чтобы ты в моём чувствовала что-то похожее.'
    ],
    '🤷‍♀️ По умолчанию': [
        'Уметь просто молчать вместе — это тоже искусство. И с тобой это получается идеально~...',
        'Тишина с тобой — уже разговор. И самый приятный.',
        'Молчание рядом — это высшая форма близости. Ты умеешь это — и это бесценно.'
    ],
    '🤍 По заботе': [
        'Значит, ты чувствуешь, когда кто-то нужен. Это очень глубокое и ценное качество в тебе~...',
        'Забота — это язык любви. И ты говоришь на нём без акцента.',
        'Я хочу быть тем, о ком ты тоже будешь заботиться. И тем, кто ответит тем же.'
    ],
    '😂 По смеху': [
        'Смех — это искра. Если она есть — всё остальное настоящее.',
        'Когда смеёшься вместе — это уже своё. Свой человек, свой мир.',
        'Хороший признак, Варя. Смех не соврёт никогда.'
    ],
    '🛡 По надёжности': [
        'Надёжность — это редкость. Уважаю, что ты её чувствуешь.',
        'Значит, тебе важно, чтобы человек был опорой. Я это понимаю. И хочу быть таким.',
        'Хочу быть тем, на кого ты сможешь опереться. И тем, кто не подведёт.'
    ],
    '🔥 По искре': [
        'Искра — это то, что не объяснишь. И не подделаешь. И у нас она, кажется, есть.',
        'Значит, ты веришь в химию. И правильно. Всё настоящее — из неё.',
        'Между нами что-то есть. Я это чувствую. И это мне очень нравится~...'
    ]
};

// Q4 — «Что бы ты хотела, чтобы я знал о тебе?»
var messagesQ4 = {
    '😴 Что я устаю': [
        'Я хочу быть тем, с кем ты можешь просто выдохнуть. Без объяснений, без вопросов.',
        'Усталость — не слабость. Отдыхай, когда нужно. Я буду рядом в этом.',
        'Если захочешь просто помолчать и ничего не делать — знай, я есть.'
    ],
    '🌧 Что я грущу': [
        'Грусть — это часть тебя. Не прячь её. Я хочу знать все твои стороны.',
        'Хочу, чтобы в грустные моменты ты знала — я есть. Не решаю, но рядом.',
        'Если будет плохо — ты не одна. Запомни это, даже если не веришь сейчас.'
    ],
    '🌸 Что я нежная': [
        'Твоя нежность — моё любимое в тебе. И я это не на словах.',
        'Нежная Варя — это то, что я хочу беречь. Всё остальное — вторично.',
        'Не теряй эту часть себя. Она делает тебя той, кого я выбрал.'
    ],
    '⚔ Что я сильная': [
        'Сила в тебе — то, что восхищает. И я хочу быть рядом с этой силой.',
        'Ты справишься со всем. Я это знаю. Но если что — я здесь.',
        'Сильная — не значит, что нельзя уставать или просить. Я рядом. Всегда.'
    ],
    '🤍 Что я нуждаюсь в тебе': [
        'Значит, ты умеешь просить. Это смелость. И я это очень ценю.',
        'Я хочу быть нужным тебе. Правда. Это не громкие слова — это просто правда.',
        'Спасибо, что сказала. Это честно. И это ценно.'
    ],
    '🖤 Что я боюсь': [
        'Страхи есть у всех. Ты не одна в них. Я тоже иногда боюсь — но не тебя.',
        'Спасибо, что доверила это. Я буду аккуратен. Обещаю.',
        'С тобой — мне тоже иногда страшно. Но я хочу идти вперёд именно с тобой.'
    ]
};

// ЗАКРЕПЛЁННЫЕ ФРАЗЫ (в конце каждого экрана)
var pinnedQ1 = 'Какой бы ты ни была — я выбираю именно тебя. Целиком.';
var pinnedQ2 = 'Твоё счастье — это то, что я хочу беречь. Даже если оно выглядит как просто тишина дома~...';
var pinnedQ3 = 'Я хочу быть тем человеком, которого ты чувствуешь без слов. И тем, кто не подведёт.';
var pinnedQ4 = 'Ты можешь быть слабой. Ты можешь бояться. Я всё равно буду рядом. Всегда.';

// Финальные подписи
var finaleSignatures = [
    'Ты — моё. И это моё любимое.',
    'Люблю тебя. И буду рядом, пока ты позволяешь. И дольше.',
    'Спасибо, что ты есть. Каждый день — заново.',
    'Ты стала моим favourite человеком. Без вариантов.',
    'Я тебя ценю. Правда. Каждый день.',
    'Ты — та, ради кого я хочу становиться лучше.',
    'Люблю. Просто люблю. И этого достаточно.'
];

// Персональная строка финала (зависит от Q4)
var finalePersonalMap = {
    '🌸 Что я нежная': 'Ты нежная. И это то, что я особенно ценю в тебе.',
    '🤍 Что я нуждаюсь в тебе': 'Ты можешь на меня положиться. Всегда. Без условий.',
    '🖤 Что я боюсь': 'Твои страхи — наши страхи. Я не оставлю тебя с ними одну.',
    '⚔ Что я сильная': 'Твоя сила вдохновляет. И я хочу быть рядом с этой силой.',
    '😴 Что я устаю': 'Отдыхай со мной. Я хочу быть твоим покоем.',
    '🌧 Что я грущу': 'Твоя грусть — не твоя одна. Я рядом. Даже в молчании.'
};

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
function bindQuestion(qId, nextAction) {
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

bindQuestion('q1', function(){
    hideScreen('q1');
    setTimeout(function(){ showMessageScreen('msg1', 'msg1Content', answers['Настоящая'], messagesQ1, pinnedQ1, 'q2'); }, 700);
});
bindQuestion('q2', function(){
    hideScreen('q2');
    setTimeout(function(){ showMessageScreen('msg2', 'msg2Content', answers['Хорошо'], messagesQ2, pinnedQ2, 'q3'); }, 700);
});
bindQuestion('q3', function(){
    hideScreen('q3');
    setTimeout(function(){ showMessageScreen('msg3', 'msg3Content', answers['Свой'], messagesQ3, pinnedQ3, 'q4'); }, 700);
});
bindQuestion('q4', function(){
    hideScreen('q4');
    setTimeout(function(){ showMessageScreen('msg4', 'msg4Content', answers['О тебе'], messagesQ4, pinnedQ4, 'finale'); }, 700);
});

// ============ ПОКАЗ СООБЩЕНИЙ ============
function showMessageScreen(screenId, contentId, selectedAnswers, messageMap, pinnedText, nextId) {
    var screen = document.getElementById(screenId);
    var container = document.getElementById(contentId);
    container.innerHTML = '';

    var delay = 0;
    
    // Индивидуальные фразы
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

    // Закрепленная фраза
    if (pinnedText) {
        var pPinned = document.createElement('p');
        pPinned.className = 'message-text';
        pPinned.style.marginTop = '20px';
        pPinned.style.color = '#ffc0c0';
        pPinned.textContent = pinnedText;
        container.appendChild(pPinned);
        (function(el, d){
            setTimeout(function(){ el.classList.add('show'); }, d);
        })(pPinned, delay);
        delay += 2000; // Чуть больше задержки после закрепленной
    }

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
