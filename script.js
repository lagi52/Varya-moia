// ============ ПАРАЛЛАКС ============
(function(){
    var layers = document.querySelectorAll('.nebula, .milky-way, .stars');
    var mouseX = 0, mouseY = 0;
    var targetX = 0, targetY = 0;

    document.addEventListener('mousemove', function(e){
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    window.addEventListener('deviceorientation', function(e){
        if(e.gamma && e.beta){
            mouseX = Math.max(-1, Math.min(1, e.gamma / 30));
            mouseY = Math.max(-1, Math.min(1, e.beta / 30));
        }
    }, true);

    function animate(){
        targetX += (mouseX - targetX) * 0.04;
        targetY += (mouseY - targetY) * 0.04;

        layers.forEach(function(layer, i){
            var speed = 0.02 + (i % 4) * 0.02;
            layer.style.transform = 'translate(' + (targetX * speed * 40) + 'px, ' + (targetY * speed * 40) + 'px)';
        });

        requestAnimationFrame(animate);
    }
    animate();
})();

// ============ СВЕТЯЩИЕСЯ ЧАСТИЦЫ ============
(function(){
    var container = document.getElementById('particles');
    if (!container) return;

    function createParticle(){
        var p = document.createElement('div');
        p.className = 'particle';
        var size = Math.random() * 4 + 2;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = '105%';
        p.style.background = 'rgba(' + (180 + Math.random() * 75) + ',' + (100 + Math.random() * 80) + ',' + (220 + Math.random() * 35) + ',' + (0.6 + Math.random() * 0.4) + ')';
        p.style.animationDuration = (Math.random() * 12 + 10) + 's';
        container.appendChild(p);
        setTimeout(function(){ p.remove(); }, 23000);
    }

    setInterval(createParticle, 700);
    for (var i = 0; i < 6; i++) setTimeout(createParticle, i * 400);
})();

console.log('Космос для Вари загружен 🖤');
