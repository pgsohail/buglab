/* bugslab — site interactions */
(() => {
    'use strict';
    document.documentElement.classList.add('js');

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

    /* ── Year ─────────────────────────────────────────── */
    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();

    /* ── Scroll: progress bar + header state ─────────── */
    const progress = $('#progress');
    const header = $('#header');
    let ticking = false;
    const onScroll = () => {
        const max = document.documentElement.scrollHeight - innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
        if (header) header.classList.toggle('scrolled', scrollY > 20);
        ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
    onScroll();

    /* ── Reveal on scroll ─────────────────────────────── */
    const revealEls = $$('.reveal');
    if ('IntersectionObserver' in window && !reduceMotion) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                // stagger siblings that enter together
                const idx = Number(el.dataset.stagger || 0);
                setTimeout(() => el.classList.add('in'), idx * 90);
                io.unobserve(el);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
        // simple stagger index within the same parent
        revealEls.forEach(el => {
            const sibs = $$(':scope > .reveal', el.parentElement);
            el.dataset.stagger = Math.min(sibs.indexOf(el), 5);
            io.observe(el);
        });
    } else {
        revealEls.forEach(el => el.classList.add('in'));
    }
    // safety net: never leave on-screen content hidden
    setTimeout(() => revealEls.forEach(el => {
        if (el.getBoundingClientRect().top < innerHeight) el.classList.add('in');
    }), 1500);

    /* ── Section dots ─────────────────────────────────── */
    const dots = $('#dots');
    const dotLinks = $$('a', dots);
    const targets = dotLinks.map(a => {
        const id = a.getAttribute('href').slice(1);
        return id === 'top' ? $('.intro') : document.getElementById(id);
    });
    const darkSections = $$('.dark, .marquee');
    const updateDots = () => {
        const mid = innerHeight * 0.45;
        let active = 0;
        targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top <= mid) active = i; });
        dotLinks.forEach((a, i) => a.classList.toggle('active', i === active));
        const dy = dots.getBoundingClientRect();
        const cy = dy.top + dy.height / 2;
        dots.classList.toggle('on-dark', darkSections.some(s => {
            const r = s.getBoundingClientRect();
            return r.top < cy && r.bottom > cy;
        }));
    };
    addEventListener('scroll', () => requestAnimationFrame(updateDots), { passive: true });
    updateDots();

    /* ── Eyes follow the cursor ───────────────────────── */
    const eyes = $$('.eye');
    let pointer = { x: innerWidth / 2, y: innerHeight / 3 };
    const lookAt = () => {
        eyes.forEach(eye => {
            const r = eye.getBoundingClientRect();
            if (r.bottom < 0 || r.top > innerHeight) return;
            const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
            const ang = Math.atan2(pointer.y - cy, pointer.x - cx);
            const dist = Math.min(r.width * 0.24, Math.hypot(pointer.x - cx, pointer.y - cy) / 12);
            eye.firstElementChild.style.transform = `translate(${Math.cos(ang) * dist}px, ${Math.sin(ang) * dist}px)`;
        });
    };
    if (!reduceMotion) {
        addEventListener('pointermove', e => { pointer = { x: e.clientX, y: e.clientY }; requestAnimationFrame(lookAt); }, { passive: true });
        addEventListener('scroll', () => requestAnimationFrame(lookAt), { passive: true });
    }

    /* ── Mascot: blink + speech bubble ────────────────── */
    const mascot = $('#mascot');
    const bubble = $('#bubble');
    const lines = [
        'Hi. I eat bugs.',
        'Ship it. Then ship it again.',
        'Smart contracts, audited.',
        'Your data, but clean.',
        'Tap me for another one.',
        'Zero bugs is a lifestyle.'
    ];
    let line = 0;
    const nextLine = () => {
        bubble.classList.add('swap');
        setTimeout(() => {
            line = (line + 1) % lines.length;
            bubble.textContent = lines[line];
            bubble.classList.remove('swap');
        }, 250);
    };
    const blink = () => {
        mascot.classList.add('blink');
        setTimeout(() => mascot.classList.remove('blink'), 140);
    };
    if (mascot) {
        mascot.addEventListener('click', () => { blink(); nextLine(); });
        if (!reduceMotion) {
            setInterval(blink, 3800);
            setInterval(nextLine, 5200);
        }
    }

    /* ── Logo: letters change colour one by one, new effect + palette every round ── */
    const logoLayers = $$('.lgw');
    if (logoLayers.length) {
        const palettes = [
            ['#3F550A', '#3F550A', '#3F550A', '#3F550A', '#3F550A', '#3F550A', '#3F550A'],          // brand green
            ['#2F4A06', '#3F5F0B', '#4F7410', '#608A15', '#719F1A', '#82B41F', '#93C924'],          // green gradient
            ['#3F550A', '#1F6FEB', '#F2A900', '#7B2CBF', '#0E9F6E', '#E0457B', '#121410'],          // multicolour
            ['#121410', '#121410', '#121410', '#121410', '#121410', '#121410', '#121410'],          // ink
            ['#0E9F6E', '#128C68', '#167962', '#1A665C', '#1E5356', '#224050', '#3F550A']           // teal → green
        ];
        const bounds = logoLayers.map(w => ({ l: parseFloat(w.dataset.l), r: parseFloat(w.dataset.r) }));
        const full = 'inset(-15% -15% -15% -15%)';
        const effects = [
            // bottom-up fill
            (b) => [{ clipPath: 'inset(100% -15% -15% -15%)' }, { clipPath: full }],
            // top-down pour
            (b) => [{ clipPath: 'inset(-15% -15% 100% -15%)' }, { clipPath: full }],
            // left-to-right sweep inside each letter
            (b) => [{ clipPath: `inset(-15% ${100 - b.l}% -15% ${b.l}%)` }, { clipPath: `inset(-15% ${b.r}% -15% ${b.l}%)` }],
            // circle bloom from the letter centre
            (b) => { const cx = (b.l + (100 - b.r)) / 2; return [{ clipPath: `circle(0% at ${cx}% 55%)` }, { clipPath: `circle(80% at ${cx}% 55%)` }]; },
            // soft blur fade-in
            () => [{ clipPath: full, opacity: 0, filter: 'blur(8px)' }, { clipPath: full, opacity: 1, filter: 'blur(0px)' }]
        ];
        const svgs = logoLayers.map(w => w.firstElementChild);
        if (reduceMotion) {
            svgs.forEach(s => { s.style.setProperty('--fill', '#3F550A'); s.style.clipPath = full; });
        } else {
            let round = 0;
            const FILL = 1700, STAGGER = 520, HOLD = 4200;
            const cycle = () => {
                const pal = palettes[round % palettes.length];
                const fx = effects[round % effects.length];
                round++;
                const anims = svgs.map((s, i) => {
                    s.style.setProperty('--fill', pal[i]);
                    const k = fx(bounds[i]);
                    return s.animate(k, { duration: FILL, delay: i * STAGGER, easing: 'cubic-bezier(.55,0,.35,1)', fill: 'both' });
                });
                const filled = FILL + STAGGER * (svgs.length - 1);
                setTimeout(() => {
                    // un-fill in the same order by playing each animation backwards
                    anims.forEach((a, i) => setTimeout(() => { a.playbackRate = -1; a.play(); }, i * STAGGER * 0.8));
                    setTimeout(cycle, FILL + STAGGER * 0.8 * svgs.length + 900);
                }, filled + HOLD);
            };
            cycle();
        }
    }

    /* ── Ring ladybug: blink now and then ─────────────── */
    const rb = $('#logoEyes');
    if (rb && !reduceMotion) {
        setInterval(() => { rb.classList.add('blink'); setTimeout(() => rb.classList.remove('blink'), 150); }, 3400);
    }

    /* ── Count-up stats ───────────────────────────────── */
    const counters = $$('[data-count]');
    if ('IntersectionObserver' in window && !reduceMotion) {
        const cio = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const end = Number(el.dataset.count);
                const t0 = performance.now();
                const dur = 1400;
                const step = (t) => {
                    const p = Math.min(1, (t - t0) / dur);
                    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
                    if (p < 1) requestAnimationFrame(step);
                };
                el.textContent = '0';
                requestAnimationFrame(step);
                cio.unobserve(el);
            });
        }, { threshold: 0.6 });
        counters.forEach(c => cio.observe(c));
    }

    /* ── Only one service row open at a time (per group) ─ */
    $$('.svc-group').forEach(group => {
        const items = $$('details', group);
        items.forEach(d => d.addEventListener('toggle', () => {
            if (d.open) items.forEach(o => { if (o !== d) o.open = false; });
        }));
    });

    /* ── Contact form → opens email draft ─────────────── */
    const form = $('#contactForm');
    const note = $('#formNote');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = new FormData(form);
            const subject = `New project: ${data.get('service')} (from ${data.get('name')})`;
            const body = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nService: ${data.get('service')}\n\n${data.get('message')}`;
            window.location.href = `mailto:support@bugslab.tech?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            note.textContent = 'Opening your email app… or reach us on WhatsApp.';
        });
    }

    /* ── Toolkit: drag & throw physics ────────────────── */
    const pit = $('#pit');
    const tags = $$('#pitTags li');
    let started = false;

    const staticPit = () => pit.classList.add('static');

    const startPhysics = () => {
        if (started) return;
        started = true;
        const M = window.Matter;
        if (!M || reduceMotion) { staticPit(); return; }

        const { Engine, Runner, Bodies, Body, Composite, Mouse, MouseConstraint, Events } = M;
        const engine = Engine.create({ gravity: { y: 1 } });
        const world = engine.world;
        let W = pit.clientWidth, H = pit.clientHeight;
        const T = 200; // wall thickness

        let walls = [];
        const buildWalls = () => {
            if (walls.length) Composite.remove(world, walls);
            walls = [
                Bodies.rectangle(W / 2, H + T / 2, W + T * 2, T, { isStatic: true }),
                Bodies.rectangle(-T / 2, H / 2, T, H * 4, { isStatic: true }),
                Bodies.rectangle(W + T / 2, H / 2, T, H * 4, { isStatic: true }),
                Bodies.rectangle(W / 2, -H * 1.5 - T / 2, W + T * 2, T, { isStatic: true })
            ];
            Composite.add(world, walls);
        };
        buildWalls();

        const bodies = tags.map((el, i) => {
            const w = el.offsetWidth, h = el.offsetHeight;
            const x = w / 2 + Math.random() * Math.max(1, W - w);
            const y = -h - i * 60 - Math.random() * 80;
            const b = Bodies.rectangle(x, y, w, h, {
                chamfer: { radius: h / 2 - 1 },
                restitution: 0.45, friction: 0.08, frictionAir: 0.012, density: 0.002
            });
            Body.setAngle(b, (Math.random() - 0.5) * 0.8);
            b.el = el; b.w = w; b.h = h;
            return b;
        });
        Composite.add(world, bodies);

        const coarse = window.matchMedia('(pointer: coarse)').matches;
        if (!coarse) {
            const mouse = Mouse.create(pit);
            // let the page scroll normally over the pit
            mouse.element.removeEventListener('wheel', mouse.mousewheel);
            mouse.element.removeEventListener('mousewheel', mouse.mousewheel);
            mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel);
            const mc = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.18, damping: 0.1 } });
            Composite.add(world, mc);
        } else {
            const hint = $('#toolkit .section-head .mono');
            if (hint) hint.textContent = 'Tap to shake things up. Every tag here runs in systems we\'ve shipped.';
            // touch: tap to toss everything up instead of dragging (keeps page scroll working)
            pit.addEventListener('click', () => {
                bodies.forEach(b => Body.applyForce(b, b.position, {
                    x: (Math.random() - 0.5) * 0.06 * b.mass * 10,
                    y: -0.12 * b.mass * 10
                }));
            });
        }

        const runner = Runner.create();
        Runner.run(runner, engine);

        // sparks canvas
        const sc = $('#pitSparks');
        const sctx = sc ? sc.getContext('2d') : null;
        const sparks = [];
        const sizeSparks = () => { if (!sc) return; const d = Math.min(2, devicePixelRatio || 1); sc.width = W * d; sc.height = H * d; sctx.setTransform(d, 0, 0, d, 0, 0); };
        sizeSparks();
        const burst = (x, y, n, power) => {
            for (let k = 0; k < n; k++) {
                const a = Math.random() * Math.PI * 2, v = (0.5 + Math.random()) * power;
                sparks.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - power * 0.4, life: 1 });
            }
        };
        const drawSparks = () => {
            if (!sctx) return;
            sctx.clearRect(0, 0, W, H);
            for (let k = sparks.length - 1; k >= 0; k--) {
                const s = sparks[k];
                s.x += s.vx; s.y += s.vy; s.vy += 0.12; s.vx *= 0.97; s.life -= 0.025;
                if (s.life <= 0) { sparks.splice(k, 1); continue; }
                sctx.fillStyle = `rgba(200, 242, 90, ${s.life})`;
                sctx.beginPath(); sctx.arc(s.x, s.y, 1.2 + s.life * 1.6, 0, 6.283); sctx.fill();
            }
        };
        // flash + spark when tags collide hard
        Events.on(engine, 'collisionStart', ev => {
            ev.pairs.forEach(p => {
                const sp = Math.max(p.bodyA.speed || 0, p.bodyB.speed || 0);
                if (sp < 2.5) return;
                const pt = p.collision && p.collision.supports && p.collision.supports[0];
                if (pt) burst(pt.x, pt.y, Math.min(14, 4 + sp * 1.5), Math.min(4, 1 + sp * 0.35));
                [p.bodyA, p.bodyB].forEach(b => {
                    if (!b.el) return;
                    b.el.classList.add('hit');
                    clearTimeout(b.hitT);
                    b.hitT = setTimeout(() => b.el.classList.remove('hit'), 220);
                });
            });
        });
        Events.on(engine, 'afterUpdate', drawSparks);
        // cursor spotlight
        pit.addEventListener('pointermove', e => {
            const r = pit.getBoundingClientRect();
            pit.style.setProperty('--mx', (e.clientX - r.left) + 'px');
            pit.style.setProperty('--my', (e.clientY - r.top) + 'px');
        }, { passive: true });
        // every few seconds a random tag hops, so the pit never sits still
        const statusEl = $('#pitStatus');
        const logEl = $('#pitLog');
        const logLines = ['> npm run test ✓', '> slither ./contracts ✓', '> airflow dags trigger etl', '> deploy --prod', '> pytest -q  42 passed', '> hardhat compile ✓', '> agent.run() → done', '> git push origin main'];
        let li = 0;
        const found = ['bug found in Solidity', 'patched: data pipeline', 'LLM agent online', 'tests passing', 'deploying to AWS', 'scanning stack…'];
        let si = 0;
        setInterval(() => {
            if (!runner.enabled) return;
            const b = bodies[(Math.random() * bodies.length) | 0];
            Body.setVelocity(b, { x: (Math.random() - 0.5) * 10, y: -10 - Math.random() * 6 });
            Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.35);
            if (statusEl) { si = (si + 1) % found.length; statusEl.textContent = found[si]; }
            if (logEl) {
                const item = document.createElement('li');
                item.textContent = logLines[li++ % logLines.length];
                logEl.appendChild(item);
                while (logEl.children.length > 4) logEl.firstElementChild.remove();
            }
            burst(b.position.x, b.position.y + b.h / 2, 10, 2.4);
        }, 2600);

        Events.on(engine, 'afterUpdate', () => {
            bodies.forEach(b => {
                // rescue anything that escapes
                if (b.position.y > H + 200 || b.position.x < -200 || b.position.x > W + 200) {
                    Body.setPosition(b, { x: W / 2, y: -50 });
                    Body.setVelocity(b, { x: 0, y: 0 });
                }
                b.el.style.transform = `translate(${b.position.x - b.w / 2}px, ${b.position.y - b.h / 2}px) rotate(${b.angle}rad)`;
            });
        });

        // pause when off-screen
        const vis = new IntersectionObserver(([e]) => { runner.enabled = e.isIntersecting; }, { threshold: 0 });
        vis.observe(pit);

        let rt;
        addEventListener('resize', () => {
            clearTimeout(rt);
            rt = setTimeout(() => { W = pit.clientWidth; H = pit.clientHeight; buildWalls(); sizeSparks(); }, 150);
        });
    };

    if (pit) {
        if ('IntersectionObserver' in window) {
            const pio = new IntersectionObserver(([e]) => {
                if (e.isIntersecting) { pio.disconnect(); startPhysics(); }
            }, { threshold: 0.35 });
            // Matter loads with defer; wait for window load so it's available
            addEventListener('load', () => pio.observe(pit));
        } else {
            staticPit();
        }
    }

    /* ── Custom cursor dot ────────────────────────────── */
    const cursor = $('#cursor');
    if (cursor && matchMedia('(hover: hover) and (pointer: fine)').matches) {
        let cx = -100, cy = -100, tx = -100, ty = -100;
        addEventListener('pointermove', e => {
            tx = e.clientX; ty = e.clientY; cursor.classList.add('on');
            cursor.classList.toggle('big', !!e.target.closest('a, button, summary, .card, .pit-tags li, select, input, textarea'));
        }, { passive: true });
        document.addEventListener('pointerleave', () => cursor.classList.remove('on'));
        const tick = () => {
            cx += (tx - cx) * (reduceMotion ? 1 : 0.22);
            cy += (ty - cy) * (reduceMotion ? 1 : 0.22);
            cursor.style.transform = `translate(${cx}px, ${cy}px)`;
            requestAnimationFrame(tick);
        };
        tick();
    }

    /* ── Intro tagline: letters fill with colour one by one, like the logo ── */
    const tagEl = $('#tagFx');
    if (tagEl) {
        const phrases = ['Debug better. Build better.', 'Blockchain. AI. Data.', 'Smart contracts. Clean data.'];
        const tagPalettes = [
            ['#3F550A'],
            ['#2F4A06', '#4F7410', '#719F1A', '#93C924'],
            ['#3F550A', '#1F6FEB', '#F2A900', '#7B2CBF', '#0E9F6E', '#E0457B'],
            ['#121410'],
            ['#0E9F6E', '#167962', '#1E5356', '#3F550A']
        ];
        // effect = gradient direction + which background-position moves
        const tagFx = [
            { dir: 'to bottom', size: '100% 200%', from: '0 0%', to: '0 100%' },   // colour rises from below
            { dir: 'to top', size: '100% 200%', from: '0 100%', to: '0 0%' },     // colour pours from above
            { dir: 'to left', size: '200% 100%', from: '100% 0', to: '0% 0' },    // sweep left → right
            { dir: 'to right', size: '200% 100%', from: '0% 0', to: '100% 0' }    // sweep right → left
        ];
        let round = 0;
        const render = (text, pal, fx) => {
            tagEl.textContent = '';
            return [...text].map((ch, i) => {
                const s = document.createElement('span');
                s.className = 'tf-ch';
                s.textContent = ch === ' ' ? '\u00a0' : ch;
                const c = pal[i % pal.length];
                s.style.backgroundImage = `linear-gradient(${fx.dir}, #E71809 50%, ${c} 50%)`;
                s.style.backgroundSize = fx.size;
                s.style.backgroundPosition = fx.from;
                tagEl.appendChild(s);
                return s;
            });
        };
        const run = () => {
            const text = phrases[round % phrases.length];
            const pal = tagPalettes[round % tagPalettes.length];
            const fx = tagFx[round % tagFx.length];
            round++;
            const chars = render(text, pal, fx);
            if (reduceMotion) { chars.forEach(s => { s.style.backgroundPosition = fx.to; }); return setTimeout(run, 6000); }
            tagEl.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 500, fill: 'both' });
            const STEP = 90, DUR = 700;
            chars.forEach((s, i) => s.animate([{ backgroundPosition: fx.from }, { backgroundPosition: fx.to }],
                { duration: DUR, delay: 600 + i * STEP, easing: 'cubic-bezier(.55,0,.35,1)', fill: 'both' }));
            const total = 600 + chars.length * STEP + DUR;
            setTimeout(() => {
                tagEl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'both' });
                setTimeout(run, 550);
            }, total + 3000);
        };
        run();
    }

    /* ── Intro particles: full-page flowing dot field that gathers into DEBUG / BUILD / SHIP ── */
    const canvas = $('#particles');
    const intro = $('.intro');
    if (canvas && intro) {
        const ctx = canvas.getContext('2d');
        let W = 0, H = 0, DPR = 1, N = 0, COLS = 0, ROWS = 0, GAP = 20;
        let px, py, vx, vy, gx, gy, delay, words = {};
        let running = false, time = 0;
        const mouse = { x: -9999, y: -9999, active: false };

        // sample the pixels of a big word and hand one target point to every particle
        // rasterised copy of the logo (solid fill) used as the dot target
        let logoImg = null;
        const logoRect = () => {
            const s = $('.intro-logo .logo-stack'), c = canvas.getBoundingClientRect();
            if (!s) return null;
            const r = s.getBoundingClientRect();
            return { x: r.left - c.left, y: r.top - c.top, w: r.width, h: r.height };
        };
        const logoShape = () => {
            const off = document.createElement('canvas');
            off.width = Math.max(1, Math.floor(W)); off.height = Math.max(1, Math.floor(H));
            const o = off.getContext('2d');
            const lr = logoRect();
            if (logoImg && logoImg.naturalWidth && lr) o.drawImage(logoImg, lr.x, lr.y, lr.w, lr.h);
            const data = o.getImageData(0, 0, off.width, off.height).data;
            const step = 2, pts = [];
            for (let y = 0; y < off.height; y += step)
                for (let x = 0; x < off.width; x += step)
                    if (data[(y * off.width + x) * 4 + 3] > 120) pts.push(x, y);
            const count = pts.length / 2, out = new Float32Array(N * 2);
            if (!count) return out;
            const idx = Array.from({ length: count }, (_, i) => i);
            for (let i = count - 1; i > 0; i--) { const k = (Math.random() * (i + 1)) | 0; [idx[i], idx[k]] = [idx[k], idx[i]]; }
            for (let i = 0; i < N; i++) {
                const k = idx[i % count];
                out[i * 2] = pts[k * 2] + (Math.random() - 0.5) * step * 0.5;
                out[i * 2 + 1] = pts[k * 2 + 1] + (Math.random() - 0.5) * step * 0.5;
            }
            return out;
        };

        // tiny bug sprites (ink / red ladybug / olive), drawn once and stamped for every particle
        const makeBug = (body, spots) => {
            const c = document.createElement('canvas'); c.width = c.height = 40;
            const g = c.getContext('2d');
            g.translate(20, 21);
            g.strokeStyle = '#121410'; g.lineWidth = 1.6; g.lineCap = 'round';
            for (const s of [-1, 1]) for (const yy of [-4, 2, 8]) {           // legs
                g.beginPath(); g.moveTo(s * 6, yy); g.lineTo(s * 12, yy - 3 + (yy > 0 ? 4 : 0)); g.stroke();
            }
            g.beginPath(); g.moveTo(-2, -12); g.lineTo(-6, -18); g.moveTo(2, -12); g.lineTo(6, -18); g.stroke(); // antennae
            g.fillStyle = '#121410'; g.beginPath(); g.arc(0, -10, 4.6, 0, 7); g.fill();                       // head
            g.fillStyle = body; g.beginPath(); g.ellipse(0, 2, 8.5, 10.5, 0, 0, 7); g.fill();               // body
            g.strokeStyle = 'rgba(0,0,0,.45)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(0, -7); g.lineTo(0, 12); g.stroke();
            if (spots) { g.fillStyle = spots; for (const [sx, sy] of [[-4, -1], [4, -1], [-4, 6], [4, 6]]) { g.beginPath(); g.arc(sx, sy, 1.8, 0, 7); g.fill(); } }
            return c;
        };
        const SPRITES = [makeBug('#121410', null), makeBug('#E71809', '#121410'), makeBug('#3F550A', '#E4EDC8')];
        let kind, heading, lx, ly, vis;

        // torus that frames the centred content
        const ring = { cx: 0, cy: 0 };
        let NU = 0, NV = 0, pu, pv;
        const measureRing = () => {
            const c = canvas.getBoundingClientRect();
            const box = $('.intro-center');
            const r = box ? box.getBoundingClientRect() : { left: c.left + W * 0.25, top: c.top + H * 0.2, width: W * 0.5, height: H * 0.6 };
            ring.cx = r.left - c.left + r.width / 2;
            ring.cy = r.top - c.top + r.height / 2;
        };

        const build = () => {
            const r = canvas.getBoundingClientRect();
            W = r.width; H = r.height;
            DPR = Math.min(2, devicePixelRatio || 1);
            canvas.width = W * DPR; canvas.height = H * DPR;
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
            measureRing();
            const small = W < 700;
            NU = small ? 96 : 160; NV = small ? 20 : 30;
            N = NU * NV;
            px = new Float32Array(N); py = new Float32Array(N);
            vx = new Float32Array(N); vy = new Float32Array(N);
            pu = new Float32Array(N); pv = new Float32Array(N); delay = new Float32Array(N);
            kind = new Uint8Array(N); heading = new Float32Array(N); lx = new Float32Array(N); ly = new Float32Array(N);
            gx = new Float32Array(N); gy = new Float32Array(N);
            vis = new Uint8Array(N);
            for (let i = 0; i < N; i++) {
                // swarm params: orbit radius (0.2–1), start angle, angular speed (±), wander phase
                gx[i] = 0.2 + Math.sqrt(Math.random()) * 0.8;
                gy[i] = Math.random() * Math.PI * 2;
                pu[i] = (0.12 + Math.random() * 0.28) * (Math.random() < 0.5 ? -1 : 1);
                pv[i] = Math.random() * Math.PI * 2;
                vis[i] = (i % (small ? 5 : 6)) === 0 ? 1 : 0;   // only a light swarm is visible while hovering
                px[i] = ring.cx; py[i] = ring.cy;
                delay[i] = Math.random();
                const rnd = Math.random();
                kind[i] = rnd < 0.16 ? 1 : rnd < 0.28 ? 2 : 0;
                heading[i] = Math.random() * 6.28;
            }
            words = { logo: logoShape() };
        };

        // the resting state: a big, gently tilted 3D donut of bugs around the content
        const fp = { x: 0, y: 0, s: 1 };
        const field = (i) => {
            // a loose swarm of bugs hovering and circling over the whole hero
            const t = time;
            const rx = W < 700 ? W * 0.48 : Math.min(W * 0.42, 640), ry = H * 0.44;
            const ang = gy[i] + t * pu[i];
            const k = gx[i] + Math.sin(t * 0.7 + pv[i]) * 0.08;
            fp.x = ring.cx + Math.cos(ang) * rx * k + Math.sin(t * 1.3 + pv[i] * 2) * 14;
            fp.y = ring.cy + Math.sin(ang) * ry * k + Math.cos(t * 1.1 + pv[i] * 3) * 14;
            fp.s = 1.25;
            return fp;
        };

        // timeline: field → dots gather into the logo (solid logo dissolves) → back to field
        const seq = ['field', 'logo'];
        const HOLD = { field: 6, word: 4.5 }, MORPH = 2.8;
        const stack = $('.intro-logo .logo-stack');
        let dotted = false;
        const holdOf = k => (seq[k] === 'field' ? HOLD.field : HOLD.word);
        const CYCLE = seq.reduce((s, _, k) => s + holdOf(k) + MORPH, 0);
        const stageAt = (tm) => {
            let x = tm % CYCLE;
            for (let k = 0; k < seq.length; k++) {
                if (x < holdOf(k)) return { a: seq[k], b: seq[k], t: 0 };
                x -= holdOf(k);
                if (x < MORPH) return { a: seq[k], b: seq[(k + 1) % seq.length], t: x / MORPH };
                x -= MORPH;
            }
            return { a: 'field', b: 'field', t: 0 };
        };
        const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const frame = () => {
            if (!running) return;
            time += 1 / 60;
            const st = reduceMotion ? { a: 'field', b: 'field', t: 0 } : stageAt(time);
            const A = st.a === 'field' ? null : words[st.a];
            const B = st.b === 'field' ? null : words[st.b];
            // hide the solid logo while the dotted one is assembled, bring it back as the dots leave
            const wantDots = (st.a === 'logo' && st.b === 'logo') || (st.b === 'logo' && st.t > 0.55) || (st.a === 'logo' && st.b !== 'logo' && st.t < 0.3);
            if (stack && wantDots !== dotted) { dotted = wantDots; stack.classList.toggle('dotted', dotted); intro.classList.toggle('dotting', dotted); }
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
            ctx.clearRect(0, 0, W, H);
            const rep = W < 700 ? 70 : 120, rep2 = rep * rep;
            const BUG = W < 700 ? 5.5 : 7;          // bug size in px at scale 1
            const LOGO_S = 0.4;                     // bugs shrink while they form the logo
            for (let i = 0; i < N; i++) {
                const ti = ease(Math.min(1, Math.max(0, st.t * 1.6 - delay[i] * 0.6)));
                let ax, ay, as, bx, by, bs;
                if (!A) { const q = field(i); ax = q.x; ay = q.y; as = q.s; } else { ax = A[i * 2]; ay = A[i * 2 + 1]; as = LOGO_S; }
                if (!B) { const q = field(i); bx = q.x; by = q.y; bs = q.s; } else { bx = B[i * 2]; by = B[i * 2 + 1]; bs = LOGO_S; }
                const tx = ax + (bx - ax) * ti, ty = ay + (by - ay) * ti, size = as + (bs - as) * ti;
                if (reduceMotion) { px[i] = tx; py[i] = ty; }
                else {
                    vx[i] += (tx - px[i]) * 0.06; vy[i] += (ty - py[i]) * 0.06;
                    if (mouse.active) {
                        const dx = px[i] - mouse.x, dy = py[i] - mouse.y, d2 = dx * dx + dy * dy;
                        if (d2 < rep2 && d2 > 0.01) {
                            const d = Math.sqrt(d2), f = (1 - d / rep) * 4;
                            vx[i] += (dx / d) * f; vy[i] += (dy / d) * f;
                        }
                    }
                    vx[i] *= 0.82; vy[i] *= 0.82;
                    px[i] += vx[i]; py[i] += vy[i];
                }
                // face the direction of travel (smoothed), so the bugs look like they're crawling
                const mdx = px[i] - lx[i], mdy = py[i] - ly[i];
                if (mdx * mdx + mdy * mdy > 0.02) {
                    const want = Math.atan2(mdy, mdx) + Math.PI / 2;
                    let d = want - heading[i];
                    d = Math.atan2(Math.sin(d), Math.cos(d));
                    heading[i] += d * 0.15;
                }
                lx[i] = px[i]; ly[i] = py[i];
                const s = BUG * size, ch = Math.cos(heading[i]) * s / 40, sh = Math.sin(heading[i]) * s / 40;
                ctx.setTransform(ch * DPR, sh * DPR, -sh * DPR, ch * DPR, px[i] * DPR, py[i] * DPR);
                const alpha = vis[i] ? 1 : ((st.a === 'logo' ? 1 - ti : 0) + (st.b === 'logo' ? ti : 0));
                if (alpha < 0.02) continue;
                ctx.globalAlpha = Math.min(1, alpha);
                ctx.drawImage(SPRITES[kind[i]], -20, -21);
            }
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
            ctx.globalAlpha = 1;
            requestAnimationFrame(frame);
        };

        intro.addEventListener('pointermove', e => {
            const r = canvas.getBoundingClientRect();
            mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
        }, { passive: true });
        intro.addEventListener('pointerleave', () => { mouse.active = false; });

        const start = () => {
            build();
            new IntersectionObserver(([e]) => {
                const was = running; running = e.isIntersecting;
                if (running && !was) requestAnimationFrame(frame);
            }).observe(intro);
            let rt;
            addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 200); });
        };
        const inline = $('.logo-red');
        const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
        if (inline) {
            const paths = $$('path', inline).map(el => `<path d="${el.getAttribute('d')}" fill="#000"/>`).join('');
            logoImg = new Image();
            const imgReady = new Promise(res => { logoImg.onload = logoImg.onerror = res; });
            logoImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1713" height="507" viewBox="225 430 571 169">${paths}</svg>`);
            Promise.all([fontsReady, imgReady]).then(start);
        } else fontsReady.then(start);
    }
})();
