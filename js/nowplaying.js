/* bugslab — Spotify "now playing" bar.
   Free, no API keys: reads your Discord presence through Lanyard (https://github.com/Phineas/lanyard).
   Setup (one time):
     1. Connect Spotify to your Discord account (Discord → Settings → Connections) and keep
        "Display Spotify as your status" on.
     2. Join the Lanyard Discord server: https://discord.gg/lanyard
     3. Put your numeric Discord user ID below (Discord → Settings → Advanced → Developer Mode,
        then right-click your name → Copy User ID).
   Until an ID is set, the bar shows "Not playing right now". */
(() => {
    'use strict';
    const DISCORD_ID = '';            // ← paste your Discord user ID here, e.g. '123456789012345678'
    const POLL_MS = 15000;

    const bar = document.getElementById('nowPlaying');
    if (!bar) return;
    const label = document.getElementById('npLabel');
    const track = document.getElementById('npTrack');
    const profile = bar.getAttribute('href');

    const idle = () => {
        bar.dataset.idle = 'true';
        label.textContent = 'Spotify';
        track.textContent = 'Not playing right now';
        bar.setAttribute('href', profile);
        bar.setAttribute('aria-label', 'Spotify: not playing right now');
    };
    const playing = (s) => {
        bar.dataset.idle = 'false';
        label.textContent = 'Now playing';
        track.textContent = `${s.song} — ${s.artist.split(';')[0]}`;
        if (s.track_id) bar.setAttribute('href', 'https://open.spotify.com/track/' + s.track_id);
        bar.setAttribute('aria-label', `Now playing on Spotify: ${s.song} by ${s.artist}`);
    };

    if (!DISCORD_ID) { idle(); return; }

    const check = async () => {
        try {
            const res = await fetch('https://api.lanyard.rest/v1/users/' + DISCORD_ID, { cache: 'no-store' });
            const json = await res.json();
            const d = json && json.data;
            if (d && d.listening_to_spotify && d.spotify) playing(d.spotify); else idle();
        } catch (e) { idle(); }
    };
    check();
    setInterval(() => { if (!document.hidden) check(); }, POLL_MS);
})();
