/* bugslab blog — renders cards and articles from js/posts.js.
   Posts appear automatically once their publish date has arrived (one per week). */
(() => {
    'use strict';
    const $ = (s, r = document) => r.querySelector(s);
    const ALL = (window.BLOG_POSTS || []).slice().sort((a, b) => b.date.localeCompare(a.date));

    const TAG_COLOURS = {
        'AI & machine learning': '#3F550A',
        'Blockchain & Web3': '#E71809',
        'Data engineering': '#1F6F8B',
        'Debugging & QA': '#121410'
    };
    const dayOf = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d); };
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const LIVE = ALL.filter(p => dayOf(p.date) <= today);
    const UPCOMING = ALL.filter(p => dayOf(p.date) > today).reverse();

    const fmt = (iso) => dayOf(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    const words = (html) => html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
    const readTime = (p) => Math.max(2, Math.round(words(p.body) / 200)) + ' min read';
    const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const url = (p) => 'post.html?p=' + encodeURIComponent(p.slug);

    const card = (p, featured = false) => {
        const tag = TAG_COLOURS[p.tag] || '#3F550A';
        const meta = `<div class="post-meta"><span class="post-tag">${esc(p.tag)}</span><span>${fmt(p.date)}</span><span>${readTime(p)}</span></div>`;
        const learn = `<ul class="post-learn">${p.takeaways.map(t => `<li>${esc(t)}</li>`).join('')}</ul>`;
        const foot = `<div class="post-foot"><span>Read article</span><span class="arrow" aria-hidden="true">→</span></div>`;
        if (featured) {
            return `<a class="post-card featured" href="${url(p)}" style="--tag:${tag}">
                <div class="main"><span class="latest-badge">● Latest post</span>${meta}<h2>${esc(p.title)}</h2><p>${esc(p.excerpt)}</p></div>
                <div class="side">${learn}${foot}</div></a>`;
        }
        return `<a class="post-card" href="${url(p)}" style="--tag:${tag}">${meta}<h3>${esc(p.title)}</h3><p>${esc(p.excerpt)}</p>${learn}${foot}</a>`;
    };

    const nextDropText = () => {
        const n = UPCOMING[0];
        if (!n) return null;
        return 'Next post drops ' + dayOf(n.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
    };

    /* ── Blog listing ────────────────────────────────── */
    const grid = $('#postGrid');
    if (grid) {
        const filters = $('#filters');
        const nd = $('#nextDrop');
        const ndText = nextDropText();
        if (nd && ndText) { nd.querySelector('span:last-child').textContent = ndText; nd.hidden = false; }
        let active = 'All';
        const render = () => {
            const list = active === 'All' ? LIVE : LIVE.filter(p => p.tag === active);
            if (!list.length) { grid.innerHTML = '<p class="empty">No posts in this topic yet.</p>'; return; }
            grid.innerHTML = list.map((p, i) => card(p, i === 0 && active === 'All')).join('');
        };
        const tags = ['All', ...Object.keys(TAG_COLOURS)];
        filters.innerHTML = tags.map(t => `<button type="button" aria-pressed="${t === active}" data-tag="${esc(t)}">${esc(t)}</button>`).join('');
        filters.addEventListener('click', e => {
            const b = e.target.closest('button'); if (!b) return;
            active = b.dataset.tag;
            filters.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
            render();
        });
        render();

    }

    /* ── Single article ──────────────────────────────── */
    const art = $('#article');
    if (art) {
        const slug = new URLSearchParams(location.search).get('p');
        const post = LIVE.find(p => p.slug === slug);
        if (!post) {
            art.innerHTML = `<a class="back-link" href="blog.html">← All posts</a><h1>Post not found.</h1>
                <p class="dek">This link may be wrong or the post has moved.</p>
                <p style="margin-top:28px"><a class="pill pill-dark pill-lg" href="blog.html">Browse the blog <span aria-hidden="true">→</span></a></p>`;
            document.title = 'Post not found | bugslab blog';
        } else {
            const tag = TAG_COLOURS[post.tag] || '#3F550A';
            document.title = post.title + ' | bugslab blog';
            const md = document.querySelector('meta[name="description"]');
            if (md) md.setAttribute('content', post.excerpt);
            const more = LIVE.filter(p => p.slug !== post.slug).slice(0, 2);
            art.style.setProperty('--tag', tag);
            art.innerHTML = `
                <a class="back-link" href="blog.html">← All posts</a>
                <div class="post-meta"><span class="post-tag" style="--tag:${tag}">${esc(post.tag)}</span><span>${fmt(post.date)}</span><span>${readTime(post)}</span><span>bugslab team</span></div>
                <h1>${esc(post.title)}</h1>
                <p class="dek">${esc(post.excerpt)}</p>
                <div class="takeaway-box"><p class="mono">Key takeaways</p><ul>${post.takeaways.map(t => `<li>${esc(t)}</li>`).join('')}</ul></div>
                <div class="prose">${post.body}</div>
                <div class="article-cta"><h3>Need a hand with this?</h3><a class="pill pill-dark pill-lg" href="index.html#contact">Talk to bugslab <span aria-hidden="true">→</span></a></div>
                ${more.length ? `<div class="more-posts"><h3>More from the blog</h3><div class="post-grid">${more.map(p => card(p)).join('')}</div></div>` : ''}`;
        }
    }

    /* ── Homepage teaser: latest three ───────────────── */
    const teaser = $('#blogTeaser');
    if (teaser) teaser.innerHTML = LIVE.slice(0, 3).map(p => card(p)).join('');

    const yr = $('#year');
    if (yr) yr.textContent = new Date().getFullYear();
})();
