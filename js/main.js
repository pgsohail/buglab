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

    /* ── Ring ladybug: blink now and then ─────────────── */
    const rb = $('#ringBug');
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

    /* ── Intro tagline: type / erase loop ─────────────── */
    const typeEl = $('#typeTag');
    if (typeEl && !reduceMotion) {
        const phrases = ['Debug better. Build better.', 'Blockchain. AI. Data.', 'Smart contracts. Clean data.'];
        let pi = 0, ci = phrases[0].length, deleting = true;
        const loop = () => {
            const full = phrases[pi];
            if (deleting) {
                ci--;
                typeEl.textContent = full.slice(0, ci);
                if (ci <= 0) { deleting = false; pi = (pi + 1) % phrases.length; return setTimeout(loop, 350); }
                return setTimeout(loop, 28);
            }
            ci++;
            typeEl.textContent = phrases[pi].slice(0, ci);
            if (ci >= phrases[pi].length) { deleting = true; return setTimeout(loop, 2200); }
            setTimeout(loop, 60);
        };
        setTimeout(loop, 3200);
    }

    /* ── Intro particles: torus → DEBUG → BUILD → SHIP (auto loop) ── */
    const canvas = $('#particles');
    const story = $('.intro');
    if (canvas && story) {
        const ctx = canvas.getContext('2d');
        const labelEl = $('#artLabel');
        const captions = ['01 · Ideas', '02 · Debug', '03 · Build', '04 · Ship'];
        let W = 0, H = 0, DPR = 1, N = 0, NU = 0, NV = 0;
        let px, py, vx, vy, pu, pv, delay, shapes = [];
        let running = false, time = 0, lastStage = -1;
        const mouse = { x: -9999, y: -9999, active: false };
        const pet = { x: 0, y: 0, rot: 0, init: false };
        let logoImg = null;

        const sample = (draw, cnt = N) => {
            const off = document.createElement('canvas');
            off.width = Math.max(1, Math.floor(W)); off.height = Math.max(1, Math.floor(H));
            const o = off.getContext('2d');
            draw(o, off.width, off.height);
            const data = o.getImageData(0, 0, off.width, off.height).data;
            const step = W < 700 ? 2 : 3;
            const pts = [];
            for (let y = 0; y < off.height; y += step) {
                for (let x = 0; x < off.width; x += step) {
                    if (data[(y * off.width + x) * 4 + 3] > 120) pts.push(x, y);
                }
            }
            const count = pts.length / 2;
            const out = new Float32Array(cnt * 2);
            if (!count) return out;
            // shuffle order so particles spread evenly over the glyphs
            const idx = Array.from({ length: count }, (_, i) => i);
            for (let i = count - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [idx[i], idx[j]] = [idx[j], idx[i]]; }
            for (let i = 0; i < cnt; i++) {
                const k = idx[i % count];
                out[i * 2] = pts[k * 2] + (Math.random() - 0.5) * step * 0.8;
                out[i * 2 + 1] = pts[k * 2 + 1] + (Math.random() - 0.5) * step * 0.8;
            }
            return out;
        };

        // shapes sit on the right half on wide screens, centred on small ones
        const centerX = () => (W >= 900 ? W * 0.7 : W / 2);
        const centerY = () => (W >= 900 ? H * 0.48 : H * 0.62);
        const wordShape = (word) => sample((o, w, h) => {
            const box = w >= 900 ? w * 0.42 : w * 0.9;
            let fs = Math.min(h * 0.26, box * 0.34);
            o.font = `700 ${fs}px Georgia, "Times New Roman", serif`;
            const m = o.measureText(word).width;
            if (m > box) { fs *= box / m; o.font = `700 ${fs}px Georgia, "Times New Roman", serif`; }
            o.textAlign = 'center'; o.textBaseline = 'middle';
            o.fillText(word, centerX(), centerY());
        });

        // word repeated around a circle (+ a small inner ring), stored relative to the centre
        const ringR = () => (W >= 900 ? Math.min(W * 0.17, H * 0.3) : Math.min(W, H) * 0.34);
        const ringShape = (word) => {
            const cx = centerX(), cy = centerY();
            const arr = sample((o) => {
                const drawRing = (text, r, fs, weight) => {
                    o.font = `${weight} ${fs}px "Bricolage Grotesque", "Arial Black", Arial, sans-serif`;
                    const unit = text + ' • ';
                    const unitW = o.measureText(unit).width;
                    const reps = Math.max(1, Math.round((Math.PI * 2 * r) / unitW));
                    const full = unit.repeat(reps);
                    const total = o.measureText(full).width;
                    let acc = 0;
                    o.textAlign = 'center'; o.textBaseline = 'middle';
                    for (const ch of full) {
                        const cw = o.measureText(ch).width;
                        const ang = ((acc + cw / 2) / total) * Math.PI * 2 - Math.PI / 2;
                        o.save();
                        o.translate(cx + Math.cos(ang) * r, cy + Math.sin(ang) * r);
                        o.rotate(ang + Math.PI / 2);
                        o.fillText(ch, 0, 0);
                        o.restore();
                        acc += cw;
                    }
                };
                const r = ringR();
                drawRing(word, r, r * 0.34, 800);
            });
            for (let i = 0; i < arr.length; i += 2) { arr[i] -= cx; arr[i + 1] -= cy; }
            return arr;
        };

        const logoShape = () => {
            if (!logoImg || !logoImg.complete || !logoImg.naturalWidth) return wordShape('bugslab');
            return sample((o, w, h) => {
                const lw = Math.min(w * (w < 700 ? 0.94 : 0.82), 980);
                const lh = lw * (169 / 571);
                o.drawImage(logoImg, (w - lw) / 2, h * 0.46 - lh / 2, lw, lh);
            });
        };

        const ringBug = $('#ringBug');
        // ladybug "b" from the logo (x 225–352 of the 571-wide viewBox), drawn in dots in the ring centre
        const bugH = () => ringR() * 0.72;
        const bugW = () => bugH() * (113 / 169);
        let M = 0, qx, qy, qvx, qvy, bugPts = null;
        const bugShape = () => sample((o) => {
            if (!logoImg || !logoImg.naturalWidth) return;
            const h = bugH(), w = bugW();
            o.drawImage(logoImg, 0, 0, 226, 338, centerX() - w / 2, centerY() - h / 2, w, h);
        }, M);
        const placeBug = () => {
            if (!ringBug) return;
            ringBug.style.left = centerX() + 'px';
            ringBug.style.top = centerY() + 'px';
            ringBug.style.width = bugW() + 'px';
            ringBug.style.height = bugH() + 'px';
        };
        const build = () => {
            const r = canvas.getBoundingClientRect();
            W = r.width; H = r.height;
            DPR = Math.min(2, devicePixelRatio || 1);
            canvas.width = W * DPR; canvas.height = H * DPR;
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
            const small = W < 700;
            NU = small ? 100 : 150; NV = small ? 30 : 44;
            const newN = NU * NV;
            if (newN !== N) {
                N = newN;
                px = new Float32Array(N); py = new Float32Array(N);
                vx = new Float32Array(N); vy = new Float32Array(N);
                pu = new Float32Array(N); pv = new Float32Array(N); delay = new Float32Array(N);
                for (let i = 0; i < N; i++) {
                    pu[i] = ((i % NU) / NU) * Math.PI * 2;
                    pv[i] = (Math.floor(i / NU) / NV) * Math.PI * 2;
                    delay[i] = Math.random();
                    px[i] = W / 2; py[i] = H / 2;
                }
            }
            shapes = [null, ringShape('DEBUG'), ringShape('BUILD'), ringShape('SHIP')];
            const newM = small ? 900 : 1600;
            if (newM !== M) {
                M = newM;
                qx = new Float32Array(M); qy = new Float32Array(M); qvx = new Float32Array(M); qvy = new Float32Array(M);
                for (let i = 0; i < M; i++) { qx[i] = W / 2; qy[i] = H / 2; }
            }
            bugPts = bugShape();
            placeBug();
        };

        // torus point i → screen xy + size (shape 0 is live, it rotates)
        const tor = { x: 0, y: 0, s: 1 };
        const torus = (i) => {
            const R = W >= 900 ? Math.min(W * 0.17, H * 0.28) : Math.min(W, H) * 0.3;
            const u = pu[i], v = pv[i];
            const Rr = R * (1 + 0.05 * Math.sin(3 * u + time * 0.9));
            const rr = R * 0.46 * (1 + 0.12 * Math.sin(2 * v + 4 * u + time * 1.3));
            let x = (Rr + rr * Math.cos(v)) * Math.cos(u);
            let y = (Rr + rr * Math.cos(v)) * Math.sin(u);
            let z = rr * Math.sin(v);
            // spin around own axis
            const a = time * 0.18;
            const ca = Math.cos(a), sa = Math.sin(a);
            let x1 = x * ca - y * sa, y1 = x * sa + y * ca;
            // tilt (x-axis) + mouse sway (y-axis)
            const mx = mouse.active ? (mouse.x / W - 0.5) : 0;
            const my = mouse.active ? (mouse.y / H - 0.5) : 0;
            const tilt = 0.55 + my * 0.5;
            const ct = Math.cos(tilt), st = Math.sin(tilt);
            let y2 = y1 * ct - z * st, z2 = y1 * st + z * ct;
            const yaw = mx * 0.7;
            const cy = Math.cos(yaw), sy = Math.sin(yaw);
            let x3 = x1 * cy + z2 * sy, z3 = -x1 * sy + z2 * cy;
            const cam = R * 4;
            const f = cam / (cam - z3);
            tor.x = centerX() + x3 * f;
            tor.y = centerY() + y2 * f;
            tor.s = Math.max(0.35, 0.5 + ((z3 / (R * 1.5)) + 0.5) * 1.5);
            return tor;
        };

        const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        // timeline: hold torus, then each word, looping back to the torus
        const HOLD = [4.2, 2.6, 2.6, 2.6], MORPH = 1.6;
        const CYCLE = HOLD.reduce((a, b) => a + b, 0) + MORPH * 4;
        const stageAt = (tm) => {
            let x = tm % CYCLE;
            for (let k = 0; k < 4; k++) {
                if (x < HOLD[k]) return { from: k, to: k, t: 0 };
                x -= HOLD[k];
                if (x < MORPH) return { from: k, to: (k + 1) % 4, t: x / MORPH };
                x -= MORPH;
            }
            return { from: 0, to: 0, t: 0 };
        };
        const setCaption = (k) => {
            if (k === lastStage || !labelEl) return;
            lastStage = k;
            labelEl.textContent = captions[k];
        };

        const drawPet = () => {
            // little swirl-armed bug that drifts after the cursor
            const tx = mouse.active ? mouse.x + 60 : W * (W >= 900 ? 0.86 : 0.8) + Math.cos(time * 0.6) * 30;
            const ty = mouse.active ? mouse.y - 60 : H * 0.16 + Math.sin(time * 0.8) * 16;
            if (!pet.init) { pet.x = tx; pet.y = ty; pet.init = true; }
            const dx = tx - pet.x, dy = ty - pet.y;
            pet.x += dx * 0.05; pet.y += dy * 0.05;
            const speed = Math.min(1, Math.hypot(dx, dy) / 200);
            pet.rot += 0.03 + speed * 0.15;
            ctx.fillStyle = 'rgba(18,20,16,.55)';
            ctx.beginPath();
            for (let arm = 0; arm < 2; arm++) {
                for (let j = 0; j < 24; j++) {
                    const ang = pet.rot + arm * Math.PI + j * 0.17;
                    const rad = 16 + j * 2.3;
                    const s = 1.9 - j * 0.06;
                    const x = pet.x + Math.cos(ang) * rad, y = pet.y + Math.sin(ang) * rad;
                    ctx.moveTo(x + s, y); ctx.arc(x, y, s, 0, Math.PI * 2);
                }
            }
            ctx.fill();
            ctx.fillStyle = '#121410';
            ctx.beginPath(); ctx.arc(pet.x, pet.y + 3, 10, 0, Math.PI * 2); ctx.fill();
            const look = Math.atan2(dy || 1, dx || 1);
            for (const ex of [-9, 9]) {
                ctx.fillStyle = '#fff';
                ctx.beginPath(); ctx.arc(pet.x + ex, pet.y - 5, 7, 0, Math.PI * 2); ctx.fill();
                ctx.fillStyle = '#121410';
                ctx.beginPath(); ctx.arc(pet.x + ex + Math.cos(look) * 2.6, pet.y - 5 + Math.sin(look) * 2.6, 3.2, 0, Math.PI * 2); ctx.fill();
            }
        };

        const frame = () => {
            if (!running) return;
            time += 1 / 60;
            const stg = reduceMotion ? { from: 0, to: 0, t: 0 } : stageAt(time);
            const from = stg.from, to = stg.to, t = stg.t;
            setCaption(t > 0.5 ? to : from);
            const A = shapes[from], B = shapes[to];
            const rot = reduceMotion ? 0 : time * 0.12;
            const rc = Math.cos(rot), rs = Math.sin(rot), cxN = centerX(), cyN = centerY();
            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = '#121410';
            ctx.beginPath();
            const rep = W < 700 ? 60 : 100, rep2 = rep * rep;
            for (let i = 0; i < N; i++) {
                // staggered morph per particle
                const ti = ease(Math.min(1, Math.max(0, t * 1.5 - delay[i] * 0.5)));
                let ax, ay, as, bx, by, bs;
                if (from === 0) { const q = torus(i); ax = q.x; ay = q.y; as = q.s; }
                else { const rx = A[i * 2], ry = A[i * 2 + 1]; ax = cxN + rx * rc - ry * rs; ay = cyN + rx * rs + ry * rc; as = 1.05; }
                if (to === 0) { const q = torus(i); bx = q.x; by = q.y; bs = q.s; }
                else { const rx = B[i * 2], ry = B[i * 2 + 1]; bx = cxN + rx * rc - ry * rs; by = cyN + rx * rs + ry * rc; bs = 1.05; }
                const tx = ax + (bx - ax) * ti, ty = ay + (by - ay) * ti, size = as + (bs - as) * ti;
                if (reduceMotion) { px[i] = tx; py[i] = ty; }
                else {
                    vx[i] += (tx - px[i]) * 0.075;
                    vy[i] += (ty - py[i]) * 0.075;
                    if (mouse.active) {
                        const dx = px[i] - mouse.x, dy = py[i] - mouse.y, d2 = dx * dx + dy * dy;
                        if (d2 < rep2 && d2 > 0.01) {
                            const d = Math.sqrt(d2), f = (1 - d / rep) * 5;
                            vx[i] += (dx / d) * f; vy[i] += (dy / d) * f;
                        }
                    }
                    vx[i] *= 0.8; vy[i] *= 0.8;
                    px[i] += vx[i]; py[i] += vy[i];
                }
                ctx.moveTo(px[i] + size, py[i]);
                ctx.arc(px[i], py[i], size, 0, 6.283);
            }
            // dotted ladybug in the middle, gently bobbing
            const bob = reduceMotion ? 0 : Math.sin(time * 1.8) * 5;
            if (ringBug) ringBug.style.transform = `translate(-50%, calc(-50% + ${bob}px))`;
            for (let i = 0; bugPts && i < M; i++) {
                const tx = bugPts[i * 2], ty = bugPts[i * 2 + 1] + bob;
                if (reduceMotion) { qx[i] = tx; qy[i] = ty; }
                else {
                    qvx[i] += (tx - qx[i]) * 0.09; qvy[i] += (ty - qy[i]) * 0.09;
                    if (mouse.active) {
                        const dx = qx[i] - mouse.x, dy = qy[i] - mouse.y, d2 = dx * dx + dy * dy;
                        if (d2 < rep2 && d2 > 0.01) {
                            const d = Math.sqrt(d2), f = (1 - d / rep) * 2.5;
                            qvx[i] += (dx / d) * f; qvy[i] += (dy / d) * f;
                        }
                    }
                    qvx[i] *= 0.78; qvy[i] *= 0.78; qx[i] += qvx[i]; qy[i] += qvy[i];
                }
                ctx.moveTo(qx[i] + 1.05, qy[i]);
                ctx.arc(qx[i], qy[i], 1.05, 0, 6.283);
            }
            ctx.fill();
            requestAnimationFrame(frame);
        };

        ($('.intro') || canvas.parentElement).addEventListener('pointermove', e => {
            const r = canvas.getBoundingClientRect();
            mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; mouse.active = true;
        }, { passive: true });
        ($('.intro') || canvas.parentElement).addEventListener('pointerleave', () => { mouse.active = false; mouse.x = mouse.y = -9999; });

        const start = () => {
            build();
            new IntersectionObserver(([e]) => {
                const was = running; running = e.isIntersecting;
                if (running && !was) requestAnimationFrame(frame);
            }).observe(story);
            let rt;
            addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 200); });
        };
        // rasterise the inline logo (explicit size + solid fill) to sample its shape
        const inline = $('.logo-svg');
        if (inline) {
            const paths = $$('path', inline).map(el => `<path d="${el.getAttribute('d')}" fill="#000"/>`).join('');
            const src = `<svg xmlns="http://www.w3.org/2000/svg" width="1142" height="338" viewBox="225 430 571 169">${paths}</svg>`;
            logoImg = new Image();
            const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
            logoImg.onload = logoImg.onerror = () => ready.then(start);
            logoImg.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(src);
        } else start();
    }
})();
