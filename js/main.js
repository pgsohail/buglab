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
        header.classList.toggle('scrolled', scrollY > 20);
        ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
    onScroll();

    /* ── Mobile menu ──────────────────────────────────── */
    const menuBtn = $('#menuBtn');
    const menu = $('#menu');
    const setMenu = (open) => {
        menuBtn.setAttribute('aria-expanded', String(open));
        menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        menu.hidden = !open;
        document.body.style.overflow = open ? 'hidden' : '';
    };
    menuBtn.addEventListener('click', () => setMenu(menu.hidden));
    $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) setMenu(false); });

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

    /* ── Section dots ─────────────────────────────────── */
    const dots = $('#dots');
    const dotLinks = $$('a', dots);
    const targets = dotLinks.map(a => {
        const id = a.getAttribute('href').slice(1);
        return id === 'top' ? $('.hero') : document.getElementById(id);
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
            rt = setTimeout(() => { W = pit.clientWidth; H = pit.clientHeight; buildWalls(); }, 150);
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
})();
