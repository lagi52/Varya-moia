* { margin:0; padding:0; box-sizing:border-box; }

body {
    width:100%; height:100vh; height:100dvh;
    overflow:hidden;
    background:#000105;
    color:white;
    font-family:"Raleway",sans-serif;
    font-weight:300;
    -webkit-tap-highlight-color:transparent;
    user-select:none;
    -webkit-user-select:none;
    touch-action:manipulation;
}

h1 { font-family:"Cormorant Garamond",serif; font-weight:300; letter-spacing:3px; }

/* ============ CANVAS ГАЛАКТИКА ============ */
#galaxyCanvas {
    position:fixed;
    top:0; left:0;
    width:100%; height:100%;
    pointer-events:none;
    z-index:0;
    will-change:transform;
    transition:transform 0.3s ease-out;
}

/* ============ ТУМАННОСТИ ============ */
.nebula {
    position:fixed;
    top:-15%; left:-15%;
    width:130%; height:130%;
    pointer-events:none;
    z-index:0;
    will-change:transform;
    transition:transform 0.2s ease-out;
    filter:blur(50px);
    opacity:0.7;
}
.nebula-blue {
    background:
        radial-gradient(ellipse 40% 30% at 20% 22%, rgba(60, 90, 180, 0.4) 0%, transparent 70%);
    animation:nebulaFloat1 50s ease-in-out infinite;
}
.nebula-pink {
    background:
        radial-gradient(ellipse 45% 32% at 82% 72%, rgba(150, 50, 120, 0.32) 0%, transparent 70%);
    animation:nebulaFloat2 60s ease-in-out infinite;
}
.nebula-teal {
    background:
        radial-gradient(ellipse 55% 38% at 48% 48%, rgba(40, 100, 130, 0.22) 0%, transparent 75%);
    animation:nebulaFloat3 70s ease-in-out infinite;
}
@keyframes nebulaFloat1 {
    0%,100% { transform:translate(0,0) scale(1); }
    50% { transform:translate(2%, 1%) scale(1.1); }
}
@keyframes nebulaFloat2 {
    0%,100% { transform:translate(0,0) scale(1); }
    50% { transform:translate(-2%, -1.5%) scale(1.12); }
}
@keyframes nebulaFloat3 {
    0%,100% { transform:translate(0,0) scale(1); }
    50% { transform:translate(-1%, 2%) scale(1.08); }
}

/* ============ ЗВЁЗДЫ ============ */
.stars {
    position:fixed;
    top:-5%; left:-5%;
    width:110%; height:110%;
    pointer-events:none;
    z-index:1;
    will-change:transform;
    transition:transform 0.12s ease-out;
}
.stars-far {
    background-image:
        radial-gradient(1px 1px at 4% 12%, rgba(255,255,255,0.9), transparent),
        radial-gradient(1px 1px at 15% 28%, rgba(220,230,255,0.8), transparent),
        radial-gradient(1px 1px at 24% 6%, rgba(255,255,255,1), transparent),
        radial-gradient(1px 1px at 38% 42%, rgba(200,220,255,0.7), transparent),
        radial-gradient(1px 1px at 47% 18%, rgba(255,255,255,0.95), transparent),
        radial-gradient(1px 1px at 58% 55%, rgba(230,240,255,0.8), transparent),
        radial-gradient(1px 1px at 68% 32%, rgba(255,255,255,1), transparent),
        radial-gradient(1px 1px at 79% 8%, rgba(200,220,255,0.8), transparent),
        radial-gradient(1px 1px at 88% 48%, rgba(255,255,255,0.95), transparent),
        radial-gradient(1px 1px at 94% 22%, rgba(220,230,255,0.7), transparent),
        radial-gradient(1px 1px at 6% 62%, rgba(255,255,255,0.9), transparent),
        radial-gradient(1px 1px at 22% 78%, rgba(210,230,255,0.7), transparent),
        radial-gradient(1px 1px at 45% 88%, rgba(255,255,255,0.95), transparent),
        radial-gradient(1px 1px at 65% 72%, rgba(220,240,255,0.8), transparent),
        radial-gradient(1px 1px at 82% 90%, rgba(255,255,255,0.9), transparent),
        radial-gradient(1px 1px at 12% 45%, rgba(200,220,255,0.75), transparent),
        radial-gradient(1px 1px at 34% 65%, rgba(255,255,255,1), transparent),
        radial-gradient(1px 1px at 55% 38%, rgba(220,230,255,0.7), transparent),
        radial-gradient(1px 1px at 72% 58%, rgba(255,255,255,0.95), transparent),
        radial-gradient(1px 1px at 92% 72%, rgba(210,230,255,0.8), transparent);
    background-size:1200px 800px;
    animation:starsDrift 180s linear infinite;
    opacity:0.9;
}
.stars-mid {
    background-image:
        radial-gradient(1.6px 1.6px at 8% 22%, rgba(220,235,255,0.95), transparent),
        radial-gradient(1.6px 1.6px at 28% 48%, rgba(255,255,255,0.95), transparent),
        radial-gradient(1.8px 1.8px at 42% 15%, rgba(190,230,255,1), transparent),
        radial-gradient(1.6px 1.6px at 62% 35%, rgba(255,220,240,0.95), transparent),
        radial-gradient(1.8px 1.8px at 78% 68%, rgba(255,255,255,1), transparent),
        radial-gradient(1.6px 1.6px at 92% 25%, rgba(220,240,255,0.95), transparent),
        radial-gradient(1.8px 1.8px at 18% 82%, rgba(255,220,240,0.95), transparent),
        radial-gradient(1.6px 1.6px at 52% 72%, rgba(255,255,255,1), transparent),
        radial-gradient(1.8px 1.8px at 72% 12%, rgba(200,230,255,1), transparent),
        radial-gradient(1.6px 1.6px at 36% 92%, rgba(255,255,255,0.95), transparent);
    background-size:1000px 700px;
    animation:starsDrift 220s linear infinite reverse;
    opacity:0.8;
}
.stars-near {
    background-image:
        radial-gradient(2.2px 2.2px at 14% 32%, rgba(255,255,255,1), transparent),
        radial-gradient(2.4px 2.4px at 55% 55%, rgba(200,230,255,1), transparent),
        radial-gradient(2.2px 2.2px at 82% 18%, rgba(255,240,220,1), transparent),
        radial-gradient(2.4px 2.4px at 35% 75%, rgba(255,255,255,1), transparent),
        radial-gradient(2.2px 2.2px at 68% 88%, rgba(220,240,255,1), transparent);
    background-size:900px 600px;
    animation:starsDrift 260s linear infinite;
    opacity:1;
    filter:drop-shadow(0 0 4px rgba(255,255,255,0.7));
}
@keyframes starsDrift {
    from { transform:translateY(0); }
    to { transform:translateY(-800px); }
}

/* ============ ЯРКИЕ ЗВЁЗДЫ ============ */
.bright-stars {
    position:fixed;
    top:0; left:0;
    width:100%; height:100%;
    pointer-events:none;
    z-index:2;
}
.bright-star {
    position:absolute;
    width:3px; height:3px;
    border-radius:50%;
    background:white;
    box-shadow:0 0 10px 3px rgba(255,255,255,0.9), 0 0 30px 10px rgba(180,200,255,0.4);
    animation:brightTwinkle 5s ease-in-out infinite;
}
.bright-star-cyan {
    box-shadow:0 0 12px 4px rgba(150,240,255,1), 0 0 35px 12px rgba(80,200,255,0.5);
    background:#c8f4ff;
}
.bright-star-pink {
    box-shadow:0 0 12px 4px rgba(255,180,220,1), 0 0 35px 12px rgba(255,100,180,0.45);
    background:#ffd0e8;
}
@keyframes brightTwinkle {
    0%,100% { opacity:0.4; transform:scale(1); }
    50% { opacity:1; transform:scale(2); }
}

/* ============ КОМЕТЫ ============ */
.comet {
    position:fixed;
    width:3px; height:3px;
    background:white;
    border-radius:50%;
    pointer-events:none;
    z-index:2;
    opacity:0;
    box-shadow:0 0 10px 4px rgba(220,235,255,0.9), 0 0 30px 10px rgba(150,200,255,0.4);
}
.comet::after {
    content:'';
    position:absolute;
    height:2px;
    border-radius:2px;
}
.comet-1 {
    top:8%; left:-5%;
    animation:cometRight 13s linear infinite;
}
.comet-1::after {
    top:50%; right:4px;
    width:130px;
    background:linear-gradient(to left, rgba(230,240,255,0.95), rgba(140,180,255,0.3), transparent);
    transform:translateY(-50%) rotate(22deg);
    transform-origin:right center;
}
@keyframes cometRight {
    0% { transform:translate(0,0); opacity:0; }
    10% { opacity:1; }
    22% { opacity:0.8; }
    100% { transform:translate(115vw,50vh); opacity:0; }
}
.comet-2 {
    top:30%; right:-5%;
    animation:cometLeft 17s linear infinite;
    animation-delay:8s;
}
.comet-2::after {
    top:50%; left:4px;
    width:100px;
    background:linear-gradient(to right, rgba(230,240,255,0.95), rgba(140,180,255,0.3), transparent);
    transform:translateY(-50%) rotate(-22deg);
    transform-origin:left center;
}
@keyframes cometLeft {
    0% { transform:translate(0,0); opacity:0; }
    10% { opacity:1; }
    22% { opacity:0.8; }
    100% { transform:translate(-115vw,50vh); opacity:0; }
}

/* ============ ЧАСТИЦЫ ============ */
.particles {
    position:fixed;
    top:0; left:0;
    width:100%; height:100%;
    pointer-events:none;
    z-index:3;
}
.particle {
    position:absolute;
    border-radius:50%;
    pointer-events:none;
    animation:particleFloat linear forwards;
}
@keyframes particleFloat {
    0% { transform:translateY(0) translateX(0) scale(0); opacity:0; }
    10% { opacity:0.9; transform:scale(1); }
    90% { opacity:0.5; }
    100% { transform:translateY(-110vh) translateX(60px) scale(0.2); opacity:0; }
}

/* ============ ЦЕНТРАЛЬНЫЙ ТЕКСТ ============ */
.intro {
    position:relative;
    z-index:10;
    text-align:center;
    padding:20px;
    animation:introAppear 3s ease;
}
@keyframes introAppear {
    from { opacity:0; transform:translateY(20px); }
    to { opacity:1; transform:translateY(0); }
}
h1 {
    font-size:56px;
    font-weight:300;
    background:linear-gradient(135deg, #ffffff 0%, #c8d8ff 50%, #a0b8e8 100%);
    -webkit-background-clip:text;
    -webkit-text-fill-color:transparent;
    background-clip:text;
    margin-bottom:18px;
    line-height:1.2;
    text-shadow:0 0 60px rgba(150,180,255,0.4);
}
p {
    font-size:17px;
    color:#a8b0c8;
    letter-spacing:1px;
}

/* ============ МОБИЛЬНАЯ ============ */
@media (max-width:600px) {
    h1 { font-size:38px; }
    p { font-size:15px; }
    .comet-1::after { width:80px; }
    .comet-2::after { width:70px; }
        }
