// JavaScript Entry Point

const app = document.querySelector('#app');

// --- [State Management with Persistence] ---
let currentState = {
  screen: 'onboarding',
  user: {
    name: '',
    profilePic: 'https://i.pravatar.cc/150?u=sura',
    gender: 'Male',
    birthDate: '',
    height: '',
    weight: '',
    goal: 'Weight Loss',
    norigaeCount: 1,
    isPremium: false,
    dailyUploads: 0,
    lastUploadDate: new Date().toLocaleDateString(),
    totalUploads: 0,
    paymentHistory: [],
    mealHistory: [] // Moved inside user for persistence
  },
  waterProgress: 0.6
};

// Reset daily uploads if it's a new day
const today = new Date().toLocaleDateString();
const savedUser = localStorage.getItem('sura_user_data');
if (savedUser) {
  try {
    const parsed = JSON.parse(savedUser);
    if (parsed.lastUploadDate !== today) {
      parsed.dailyUploads = 0;
      parsed.lastUploadDate = today;
    }
    currentState.user = parsed;
    currentState.screen = 'home';
  } catch (e) { console.error("Load fail", e); }
}

const saveUserData = () => {
  localStorage.setItem('sura_user_data', JSON.stringify(currentState.user));
};

// --- [Utility Functions] ---
const inkWashEffect = () => {
  const overlay = document.createElement('div');
  overlay.className = 'ink-transition';
  const inner = document.createElement('div');
  inner.className = 'inner-ink';
  overlay.appendChild(inner);
  document.body.appendChild(overlay);
  document.body.appendChild(overlay);
  setTimeout(() => { if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay); }, 1800);
};

// --- [Sound & Interaction] ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const playSound = (type) => {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;
  if (type === 'click') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'coin') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.setValueAtTime(1600, now + 0.1);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'magic') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.linearRampToValueAtTime(1000, now + 0.5);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.5);
    osc.start(now);
    osc.stop(now + 0.5);
  } else if (type === 'shutter') {
    // Simple noise burst simulation
    osc.type = 'square';
    osc.frequency.setValueAtTime(100, now);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'chirp') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(2500, now);
    osc.frequency.linearRampToValueAtTime(1500, now + 0.1);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'water') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.15);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    osc.start(now);
    osc.stop(now + 0.15);
  }
};

window.triggerWater = () => {
  // Robust initialization
  if (!currentState.waterProgress || isNaN(currentState.waterProgress)) {
    currentState.waterProgress = 0;
  }

  if (currentState.waterProgress >= 1.0) {
    playSound('magic');
    alert("The Lotus is fully fully bloomed! 🌸");
    return;
  }

  // Increment
  currentState.waterProgress = Math.min(1.0, currentState.waterProgress + 0.125);

  // Feedback
  try { playSound('water'); } catch (e) { console.error(e); }

  // Persist & Render
  saveUserData();
  renderHome();
};

window.handleMagpieTap = () => {
  const magpie = document.getElementById('homeMagpieIcon');
  if (magpie) {
    playSound('chirp');
    setTimeout(() => playSound('chirp'), 200);

    magpie.style.transition = 'transform 0.2s';
    magpie.style.transform = 'translateY(-10px) rotate(-15deg) scale(1.1)';
    setTimeout(() => magpie.style.transform = 'translateY(0) rotate(0deg) scale(1)', 200);

    // Speech Bubble
    const bubble = document.createElement('div');
    bubble.innerText = 'Good News!';
    bubble.style.position = 'absolute';
    bubble.style.background = 'white';
    bubble.style.color = '#111';
    bubble.style.border = '1px solid #ddd';
    bubble.style.padding = '4px 8px';
    bubble.style.borderRadius = '8px';
    bubble.style.top = '-20px';
    bubble.style.left = '50%';
    bubble.style.transform = 'translateX(-50%)';
    bubble.style.fontSize = '10px';
    bubble.style.fontWeight = '800';
    bubble.style.whiteSpace = 'nowrap';
    bubble.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    bubble.style.zIndex = 100;
    magpie.appendChild(bubble);
    setTimeout(() => bubble.remove(), 1500);
  }
};

window.handleGoblinTap = () => {
  const club = document.querySelector('.goblin-club-group');
  if (club) {
    playSound('magic');
    club.style.transition = 'transform 0.2s';
    club.style.transform = 'translate(140px, 90px) rotate(-10deg)'; // Swing up
    setTimeout(() => {
      club.style.transform = 'translate(140px, 90px) rotate(45deg)'; // Strike down
      playSound('coin');
      // Spawn Particles
      for (let i = 0; i < 5; i++) {
        const p = document.createElement('div');
        p.innerHTML = '🪙';
        p.style.position = 'absolute';
        p.style.left = '50%';
        p.style.top = '25%';
        p.style.fontSize = '20px';
        p.style.transition = '1s';
        p.style.pointerEvents = 'none';
        document.getElementById('homeGoblin').appendChild(p);
        setTimeout(() => {
          p.style.transform = `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 + 50}px)`;
          p.style.opacity = 0;
        }, 50);
        setTimeout(() => p.remove(), 1000);
      }
      setTimeout(() => {
        club.style.transform = 'translate(140px, 90px) rotate(25deg)'; // Reset
      }, 300);
    }, 200);
  } else {
    playSound('click');
    const goblin = document.getElementById('homeGoblin');
    if (goblin) {
      goblin.style.transform = 'scale(1.1)';
      setTimeout(() => goblin.style.transform = 'scale(1)', 150);
    }
  }
};

// --- [Navigation & Core Logic] ---
function navigate(screen) {
  playSound('click');
  inkWashEffect();
  setTimeout(() => {
    if (screen === 'onboarding') renderOnboarding();
    else if (screen === 'home') renderHome();
    else if (screen === 'analysis') renderAnalysis();
    else if (screen === 'insights') renderInsights();
    else if (screen === 'settings') renderSettings();
    app.scrollTo({ top: 0, behavior: 'smooth' });
  }, 650);
}

const attach = (id, fn) => {
  const el = document.getElementById(id);
  if (el) el.onclick = (e) => { if (e) e.preventDefault(); fn(); };
};

window.globalNavigate = (screen) => navigate(screen);
window.globalGender = (gender, el) => {
  document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  currentState.user.gender = gender;
};

function updateMood() {
  const hour = new Date().getHours();
  app.classList.remove('mood-morning', 'mood-day', 'mood-night');
  if (hour >= 6 && hour < 10) app.classList.add('mood-morning');
  else if (hour >= 10 && hour < 17) app.classList.add('mood-day');
  else app.classList.add('mood-night');
}

// --- [SVG Assets] ---
const suraLogo = (isNight = false) => `
<svg viewBox="0 0 250 80" style="width:140px; height:auto;">
  <defs><linearGradient id="suraGold" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#FFD700" /><stop offset="100%" style="stop-color:#FFFACD" /></linearGradient></defs>
  <path d="M10 25 Q30 10 50 25 M10 30 Q30 15 50 30" fill="none" stroke="${isNight ? '#FFF' : 'var(--obang-blue)'}" stroke-width="2.5" stroke-linecap="round"/>
  <text x="60" y="43" font-family="'Noto Serif KR', serif" font-weight="900" font-size="34" fill="url(#suraGold)" letter-spacing="2">SURA</text>
  <text x="160" y="43" font-family="'Outfit', sans-serif" font-weight="400" font-size="20" fill="${isNight ? '#FFF' : 'var(--obang-blue)'}" letter-spacing="1">AI</text>
  <text x="60" y="65" font-family="'Outfit', sans-serif" font-weight="800" font-size="10" fill="var(--obang-yellow)" letter-spacing="1.5" opacity="0.9">SMART DIET GUIDE</text>
  <rect x="58" y="15" width="10" height="10" rx="2" fill="var(--obang-red)" opacity="0.9"/>
</svg>`;

const realisticGoblin = (status = 'happy') => {
  const hasHat = currentState.user.equippedSkin === 'hat';
  const hasClub = currentState.user.equippedItem === 'club';
  return `
<svg viewBox="0 0 200 200" style="width:100%; height:100%; filter: drop-shadow(0 15px 30px rgba(0,0,0,0.35));">
  <defs><radialGradient id="faceGrad" cx="50%" cy="40%" r="60%"><stop offset="0%" style="stop-color:#FFEFD5" /><stop offset="100%" style="stop-color:#DEB887" /></radialGradient><linearGradient id="robeGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#2E5A88" /><stop offset="100%" style="stop-color:#1A3A5A" /></linearGradient></defs>
  <!-- Club (Behind) -->
  ${hasClub ? `
    <g transform="translate(140, 60) rotate(15)">
       <path d="M10 0 L25 80 Q17 90 10 80 Q3 90 -5 80 Z" fill="#654321" stroke="#333" stroke-width="2"/>
       <path d="M10 10 L12 15 M5 25 L8 30 M20 20 L17 25 M15 45 L18 50 M2 40 L5 45" stroke="#D2B48c" stroke-width="2" stroke-linecap="round"/>
       <circle cx="10" cy="5" r="4" fill="gold" opacity="0.6"><animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite"/></circle>
    </g>
  ` : ''}
  <path d="M50 140 Q100 165 150 140 L170 200 L30 200 Z" fill="url(#robeGrad)"/>
  <ellipse cx="100" cy="105" rx="58" ry="62" fill="url(#faceGrad)" stroke="#8B4513" stroke-width="0.3"/>
  <ellipse cx="100" cy="75" rx="90" ry="14" fill="rgba(0,0,0,0.9)" stroke="#1A1A1A" stroke-width="0.5"/>
  <path d="M60 75 L68 30 Q100 15 132 30 L140 75 Z" fill="#000"/>
  <path d="M92 25 L108 25 L100 5 Z" fill="#E5B200" stroke="#000" stroke-width="1"/><circle cx="100" cy="25" r="7" fill="#E5B200" stroke="#000" stroke-width="1"/>
  ${status === 'happy' ? `
    <path d="M67 105 Q75 97 83 105" fill="none" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round"/>
    <path d="M117 105 Q125 97 133 105" fill="none" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round"/>
    <path d="M85 130 Q100 145 115 130" fill="none" stroke="#B22222" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M88 132 L92 142 L97 134 Z" fill="white" stroke="#000" stroke-width="0.3"/>
    <path d="M112 132 L108 142 L103 134 Z" fill="white" stroke="#000" stroke-width="0.3"/>
  ` : `<circle cx="75" cy="105" r="5" fill="#1A1A1A"/><circle cx="125" cy="105" r="5" fill="#1A1A1A"/><circle cx="100" cy="135" r="6" fill="none" stroke="#B22222" stroke-width="2.5"/>`}
  
  ${hasClub ? `
    <!-- Club (In Front/Hand) -->
    <g class="goblin-club-group" transform="translate(140, 90) rotate(25)" style="transform-origin: 10px 80px;">
       <path d="M10 0 L25 80 Q17 90 10 80 Q3 90 -5 80 Z" fill="#5D4037" stroke="#333" stroke-width="2"/>
       <path d="M10 10 L12 15 M5 25 L8 30 M20 20 L17 25 M15 45 L18 50 M2 40 L5 45" stroke="#D7CCC8" stroke-width="2" stroke-linecap="round"/>
       <circle cx="10" cy="5" r="4" fill="gold" opacity="0.8"><animate attributeName="opacity" values="0.4;1;0.4" dur="1s" repeatCount="indefinite"/></circle>
    </g>
  ` : ''}

  ${hasHat ? `
    <g transform="translate(0, -15)">
        <ellipse cx="100" cy="55" rx="70" ry="10" fill="black" opacity="0.8"/>
        <rect x="75" y="10" width="50" height="45" fill="black" opacity="0.9"/>
        <rect x="75" y="45" width="50" height="5" fill="#333"/>
        <path d="M75 50 Q100 60 125 50" fill="none" stroke="#555" stroke-width="1"/>
    </g>
  ` : ''}
</svg>`;
};

const realisticTiger = `<svg viewBox="0 0 200 200" style="width:100%; height:100%;"><defs><radialGradient id="tigerFace" cx="50%" cy="50%" r="50%"><stop offset="0%" style="stop-color:#FFA500" /><stop offset="100%" style="stop-color:#FF8C00" /></radialGradient></defs><circle cx="50" cy="50" r="15" fill="#FF8C00" stroke="#1A1A1A" stroke-width="1.5"/><circle cx="150" cy="50" r="15" fill="#FF8C00" stroke="#1A1A1A" stroke-width="1.5"/><ellipse cx="100" cy="100" rx="70" ry="65" fill="url(#tigerFace)" stroke="#1A1A1A" stroke-width="1.5"/><path d="M75 50 L85 70 M125 50 L115 70 M100 45 L100 65" stroke="#1A1A1A" stroke-width="5" stroke-linecap="round"/><path d="M35 100 L55 100 M165 100 L145 100" stroke="#1A1A1A" stroke-width="4" stroke-linecap="round"/><path d="M40 120 L55 115 M160 120 L145 115" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round"/><ellipse cx="70" cy="95" rx="12" ry="8" fill="white"/><circle cx="70" cy="95" r="5" fill="#1A1A1A"/><ellipse cx="130" cy="95" rx="12" ry="8" fill="white"/><circle cx="130" cy="95" r="5" fill="#1A1A1A"/><path d="M75 135 Q100 160 125 135" fill="none" stroke="#1A1A1A" stroke-width="4" stroke-linecap="round"/></svg>`;
const realisticMagpie = `<svg viewBox="0 0 200 200" style="width:100%; height:100%;"><defs><linearGradient id="magpieBlue" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#1A1A1A" /><stop offset="50%" style="stop-color:#2E5A88" /><stop offset="100%" style="stop-color:#1A1A1A" /></linearGradient></defs><path d="M40 100 L10 160 Q0 170 20 175 L60 120 Z" fill="url(#magpieBlue)" stroke="#000" stroke-width="0.5"/><path d="M120 120 Q90 140 60 130 Q40 100 60 70 Q90 60 120 80 Z" fill="#1A1A1A"/><path d="M75 125 Q60 115 65 90 Q80 80 95 95 Z" fill="white"/><circle cx="135" cy="85" r="25" fill="#1A1A1A"/><path d="M155 80 L185 85 L155 95 Z" fill="#333" stroke="#000" stroke-width="0.5"/><circle cx="145" cy="80" r="4" fill="#000"/><circle cx="146.5" cy="78.5" r="1.5" fill="white" opacity="0.9"/><g transform="translate(130, 55) scale(0.6) rotate(-5)"><ellipse cx="0" cy="15" rx="55" ry="12" fill="#333"/><path d="M-20 15 L-15 -15 Q0 -25 15 -15 L20 15 Z" fill="#333"/><circle cx="0" cy="-22" r="3" fill="#E5B200"/></g><path d="M90 135 L85 155 M110 130 L115 150" stroke="#333" stroke-width="2.5" stroke-linecap="round"/></svg>`;
const norigaeSVG = (color) => `<svg viewBox="0 0 100 150" style="width:100%; height:100%;"><circle cx="50" cy="30" r="15" fill="${color}" opacity="0.8"/><path d="M50 45 L50 70" stroke="${color}" stroke-width="4"/><rect x="35" y="70" width="30" height="40" fill="${color}" rx="5"/><circle cx="50" cy="30" r="5" fill="white" opacity="0.5"/></svg>`;
const bloomingLotus = (progress) => {
  const isFull = progress >= 1.0;
  // Start smaller (0.35) and grow to 1.5
  const scale = 0.35 + progress * 1.15;
  const petalColor = isFull ? "#FF1493" : "#FF69B4";
  // Angle: 0 (Closed Vertical) -> 35 (Open)
  const angle = progress * 35;

  return `<svg viewBox="0 0 100 100" style="width:70px; height:auto; filter:drop-shadow(0 4px 8px rgba(255,105,180,0.4)); overflow:visible;">
    <defs>
      <radialGradient id="lotusGold" cx="50%" cy="50%" r="50%"><stop offset="0%" style="stop-color:#FFD700" /><stop offset="100%" style="stop-color:#DAA520" /></radialGradient>
      <linearGradient id="budGrad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" style="stop-color:#FFF0F5" /><stop offset="100%" style="stop-color:#FF69B4" /></linearGradient>
    </defs>
    <g transform="translate(50, 75) scale(${scale})" style="transition: transform 1s ease-out;">
       <!-- Sepals (Green leaves) only visible at start mostly -->
       <path d="M0 0 Q-8 -15 -15 -10 Q-10 5 0 0" fill="#90EE90" transform="rotate(-40) scale(${1 - progress * 0.5})" />
       <path d="M0 0 Q8 -15 15 -10 Q10 5 0 0" fill="#90EE90" transform="rotate(40) scale(${1 - progress * 0.5})" />

       <!-- Main Petals: Start closed (Rot 0), Open out -->
       <path d="M0 0 Q-20 -40 0 -60 Q20 -40 0 0" fill="${petalColor}" transform="rotate(${-angle})" opacity="0.9"/>
       <path d="M0 0 Q-20 -40 0 -60 Q20 -40 0 0" fill="${petalColor}" transform="rotate(${angle})" opacity="0.9"/>
       
       <!-- Central Cute Bud Shape -->
       <path d="M0 0 Q-10 -35 0 -50 Q10 -35 0 0" fill="url(#budGrad)" opacity="0.95" />
       
       ${isFull ? `<circle cx="0" cy="-10" r="8" fill="url(#lotusGold)"><animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite"/></circle><g stroke="gold" stroke-width="1" opacity="0.6"><line x1="0" y1="-10" x2="0" y2="-80"/><line x1="0" y1="-10" x2="60" y2="-60"/><line x1="0" y1="-10" x2="-60" y2="-60"/></g>` : ''}
    </g>
  </svg>`;
};

const royalSuraVisual = `
  <div style="width:100%; height:80px; border-radius:20px; overflow:hidden; position:relative; box-shadow: 0 10px 20px rgba(0,0,0,0.1); margin-bottom:15px;">
    <img src="https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&q=80&w=1000" style="width:100%; height:100%; object-fit:cover; filter: brightness(0.85);">
    <div style="position:absolute; bottom:0; left:0; width:100%; padding:10px 20px; background:linear-gradient(transparent, rgba(0,0,0,1)); color:white; display:flex; justify-content:space-between; align-items:center;">
      <h4 class="serif" style="font-size:14px; margin:0;">The King's Balance</h4>
      <span style="font-size:8px; font-weight:800; letter-spacing:1px; opacity:0.8; color:var(--obang-yellow);">THE ROYAL TABLE</span>
    </div>
  </div>
`;

const cameraButtonComponent = (remaining) => `
  <section class="middle-action" style="margin: 5px 0 15px;">
    <div class="camera-btn-large" id="mainSnapBtn" style="padding: 45px 25px; gap: 20px; flex-direction: column;">
      <div style="width:36px; height:36px; filter:invert(1); opacity:0.9;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg></div>
      <div class="snap-text" style="text-align:center;">
        <span class="snap-label" style="font-size:11px; letter-spacing:3px;">SMART CAPTURE ${!currentState.user.isPremium ? `(${Math.max(0, remaining)}/3)` : ''}</span>
        <span class="snap-title serif" style="font-size:24px; margin-top:5px; font-weight:800;">Snap My Meal</span>
      </div>
    </div>
  </section>
`;

// --- [Onboarding Screen] ---
function renderOnboarding() {
  app.innerHTML = `
        <div class="onboarding-screen fade-in">
            <div style="width:220px; height:220px; margin-bottom:20px; animation: float 4s infinite;">${realisticGoblin('happy')}</div>
            <div class="onboarding-card">
                <h2 class="serif" style="margin-bottom:10px;">Welcome to SURA</h2>
                <p style="font-size:13px; opacity:0.6; margin-bottom:25px;">Enter your details to let the guardians guide your wellness journey.</p>
                <div class="input-group"><label>YOUR NAME</label><input type="text" id="inName" placeholder="How shall we call you?"></div>
                <div class="input-group">
                    <label>GENDER</label>
                    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
                        <button class="gender-btn ${currentState.user.gender === 'Male' ? 'active' : ''}" onclick="globalGender('Male', this)">Male</button>
                        <button class="gender-btn ${currentState.user.gender === 'Female' ? 'active' : ''}" onclick="globalGender('Female', this)">Female</button>
                    </div>
                </div>
                <div class="input-group"><label>DATE OF BIRTH</label><input type="date" id="inBirth" style="width:100%; padding:15px; border-radius:12px; border:1px solid #eee; background:#f9f9f9; font-family:inherit;"></div>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                    <div class="input-group"><label>HEIGHT (CM)</label><input type="number" id="inHeight" placeholder="175"></div>
                    <div class="input-group"><label>WEIGHT (KG)</label><input type="number" id="inWeight" placeholder="70"></div>
                </div>
                <button class="primary-btn" id="onboardSubmitBtn">Enter the Garden</button>
            </div>
        </div>
    `;
  attach('onboardSubmitBtn', () => {
    const name = document.getElementById('inName').value;
    const birth = document.getElementById('inBirth').value;
    const height = document.getElementById('inHeight').value;
    const weight = document.getElementById('inWeight').value;
    if (!name || !birth || !height || !weight) return alert("Please fill in all details, traveler!");
    currentState.user.name = name;
    currentState.user.birthDate = birth;
    currentState.user.height = height;
    currentState.user.weight = weight;
    saveUserData();
    navigate('home');
  });
}

// --- [Home Screen] ---
function renderHome() {
  updateMood();
  const isNight = app.classList.contains('mood-night');
  const remainingUploads = 3 - currentState.user.dailyUploads;
  app.innerHTML = `
    <div class="screen-wrapper fade-in">
      <header class="home-header">
        <div id="navHomeLogo" style="cursor:pointer;">${suraLogo(isNight)}</div>
        <div style="display:flex; align-items:center; gap:10px;">
            <div style="display:${currentState.user.isPremium ? 'flex' : 'none'}; background:var(--obang-yellow); color:var(--obang-black); font-size:9px; font-weight:800; padding:4px 10px; border-radius:10px;">ROYAL</div>
            <div class="user-badge" id="navHomeBadge" style="padding:4px; cursor:pointer;"><div class="avatar-ring" style="width:30px; height:30px;"><img src="${currentState.user.profilePic}" style="width:100%;height:100%;object-fit:cover;"></div></div>
        </div>
      </header>

      <div style="padding: 0 25px;">
        <div id="homeGoblin" onclick="handleGoblinTap()" style="background:var(--obang-black); color:white; border-radius:20px; padding:20px; display:flex; align-items:center; gap:20px; margin-bottom:15px; box-shadow:0 10px 20px rgba(0,0,0,0.1); cursor:pointer; position:relative; overflow:hidden;">
            <div style="width:70px; height:80px; pointer-events:none;">${realisticGoblin('happy')}</div>
            <div>
              <div style="font-size:10px; opacity:0.6; letter-spacing:1px; color:var(--obang-yellow);">ROYAL GUARDIAN</div>
              <h4 class="serif" style="margin:5px 0 0; font-size:18px;">${currentState.user.name}'s Journey</h4>
            </div>
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Dolsot-bibimbap.jpg/240px-Dolsot-bibimbap.jpg" alt="Bibimbap" style="width:100px; height:100px; border-radius:15px; object-fit:cover; margin-left:auto; border:2px solid var(--obang-yellow); z-index:5; display:block;">
        </div>
      </div>

      <div style="padding: 0 25px;">
        ${cameraButtonComponent(remainingUploads)}
      </div>

      <div class="seasonal-card" style="margin-bottom:0px; padding: 10px 15px; gap: 10px;">
        <div id="homeMagpieIcon" onclick="handleMagpieTap()" style="width:60px; height:60px; margin-left:-10px; cursor:pointer; position:relative;">${realisticMagpie}</div>
        <div style="flex:1;"><span class="seasonal-label" style="font-size:8px;">SOLAR TERM: IPCHUN</span><h3 class="serif seasonal-title" style="font-size:15px; margin-top:2px;">Spring is Awakening</h3></div>
      </div>
      <section class="dashboard-stats" style="margin-top:-10px;">
        ${(() => {
      const todayStr = new Date().toLocaleDateString();
      const todayMeals = currentState.user.mealHistory ? currentState.user.mealHistory.filter(m => m.date === todayStr) : [];
      const consumed = todayMeals.reduce((acc, cur) => acc + cur.calories, 0);
      const budget = 2000;
      const remaining = Math.max(0, budget - consumed);
      return `<div class="main-gauge"><span class="remaining-label">DAILY DIET BUDGET</span><span class="kcal-num">${remaining}</span><span class="unit" style="font-weight:800; font-size:12px;">kcal left</span></div>`;
    })()}
        <div style="display:flex; justify-content:center; gap:15px; margin-top:12px;">
            <div style="background:rgba(255,255,255,0.1); padding:8px 15px; border-radius:15px; border:1px solid rgba(255,255,255,0.1);"><span style="font-size:10px; opacity:0.6; display:block;">WEIGHT GOAL</span><span style="font-size:14px; font-weight:800; color:var(--obang-yellow);">${currentState.user.weight}kg → 65kg</span></div>
            <div style="background:rgba(255,255,255,0.1); padding:8px 15px; border-radius:15px; border:1px solid rgba(255,255,255,0.1);"><span style="font-size:10px; opacity:0.6; display:block;">DIET MODE</span><span style="font-size:14px; font-weight:800; color:var(--obang-blue);">Weight Loss</span></div>
        </div>
        ${!currentState.user.isPremium ? `<div style="font-size:10px; opacity:0.5; margin-top:10px; font-weight:600;">DAILY LIMIT: ${Math.max(0, remainingUploads)} LIVES LEFT</div>` : ''}
      </section>
      <section style="display:grid; grid-template-columns: 1fr 1fr; gap:15px; padding: 0 25px; margin-top:5px;">
        <div id="waterCard" class="meal-list-item" onclick="triggerWater()" style="flex-direction:column; padding:15px; border-left:4px solid var(--obang-blue); margin-bottom:0; position:relative; z-index:999; cursor:pointer; active:scale(0.98);">
                               <div style="font-size:10px; font-weight:800; opacity:0.6;">💧 HYDRATION</div>
                               <div style="font-size:20px; font-weight:800;">
                                 ${(() => {
      const val = currentState.waterProgress;
      if (!val || isNaN(val)) return '0.0';
      return (val * 2).toFixed(1);
    })()} 
                                 <span style="font-size:10px; opacity:0.4;">/ 2L</span>
                               </div>
                               <div style="position:absolute; right:-5px; bottom:-10px; pointer-events:none; transition: all 1s;">${bloomingLotus(currentState.waterProgress || 0)}</div>
        </div>
        </div>
        <div class="meal-list-item" onclick="handleTigerTap()" style="flex-direction:column; padding:15px; border-left:4px solid var(--obang-yellow); margin-bottom:0; position:relative; cursor:pointer; active:scale(0.98); overflow:visible;"><div id="tigerIconContainer" style="position:absolute; right:-5px; bottom:-5px; width:70px; height:70px; opacity:1.0; transition:transform 0.2s;">${realisticTiger}</div><div style="font-size:10px; font-weight:800; opacity:0.6;">🐯 MOVEMENT</div><div style="font-size:20px; font-weight:800;">6,420 <span style="font-size:10px; opacity:0.4;">Steps</span></div></div>
      </section>
      </section>
      <nav class="nav-bar">
        <div class="nav-link active">🏠<span>Home</span></div>
        <div class="nav-link" id="navHomeToInsights">📊<span>Insights</span></div>
        <div class="nav-link">📖<span>Recipes</span></div>
        <div class="nav-link" id="navHomeToProf">👤<span>Profile</span></div>
      </nav>
    </div>
  `;
  attach('mainSnapBtn', handlePhotoUpload);
  attach('navHomeLogo', () => navigate('settings'));
  attach('navHomeBadge', () => navigate('settings'));
  attach('navHomeToProf', () => navigate('settings'));
  attach('navHomeToInsights', () => navigate('insights')); // fixed duplicate Attach

  if (currentState.pendingReward) {
    setTimeout(() => {
      showRewardModal(currentState.pendingReward);
      playSound('coin');
      currentState.user.norigaeCount = Math.max(currentState.user.norigaeCount, currentState.pendingReward.level);
      delete currentState.pendingReward;
      saveUserData();
    }, 500);
  }
}

window.handleTigerTap = () => {
  // 1. Animate
  const icon = document.getElementById('tigerIconContainer');
  if (icon) {
    icon.style.transform = "scale(1.4) rotate(-10deg)";
    setTimeout(() => icon.style.transform = "scale(1) rotate(0deg)", 300);

    // Visual Speech Bubble
    const bubble = document.createElement('div');
    bubble.innerText = "Hello! 🐯";
    bubble.style.position = 'absolute';
    bubble.style.top = '-30px';
    bubble.style.right = '0';
    bubble.style.background = 'white';
    bubble.style.color = 'black';
    bubble.style.padding = '5px 10px';
    bubble.style.borderRadius = '15px';
    bubble.style.fontSize = '12px';
    bubble.style.fontWeight = '800';
    bubble.style.boxShadow = '0 5px 10px rgba(0,0,0,0.2)';
    bubble.style.zIndex = '100';
    bubble.style.whiteSpace = 'nowrap';
    bubble.className = 'fade-in';
    icon.appendChild(bubble);
    setTimeout(() => bubble.remove(), 2000);
  }

  // 2. Sound (Attempt)
  if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance("Hello!");
    u.lang = 'en-US';
    u.volume = 1.0;
    u.pitch = 1.2;
    u.rate = 1.0;

    window.speechSynthesis.speak(u);
  }
};

window.handleGoblinTap = () => {
  const card = document.getElementById('homeGoblin');
  if (card) {
    // Animate
    card.style.transform = "scale(0.95)";
    setTimeout(() => card.style.transform = "scale(1)", 150);

    // Speech Bubble
    // Check if bubble exists
    if (card.querySelector('.goblin-bubble')) return;

    const bubble = document.createElement('div');
    bubble.className = 'goblin-bubble fade-in';
    bubble.innerText = "Kkaebi! 👹";
    bubble.style.position = 'absolute';
    bubble.style.top = '10px';
    bubble.style.left = '80px'; // Next to face
    bubble.style.background = 'var(--obang-black)';
    bubble.style.color = 'var(--obang-yellow)';
    bubble.style.padding = '5px 10px';
    bubble.style.borderRadius = '15px';
    bubble.style.fontSize = '12px';
    bubble.style.fontWeight = '800';
    bubble.style.zIndex = '100';
    bubble.style.border = '1px solid var(--obang-yellow)';
    card.appendChild(bubble);
    setTimeout(() => bubble.remove(), 2000);
  }

  // Sound
  if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance("Kebbi! Kebbi!"); // Phonetic for English
    u.lang = 'en-US';
    u.pitch = 1.4; // Synthy/Mischievous
    u.rate = 1.2;

    window.speechSynthesis.speak(u);
  }
};

function handlePhotoUpload() {
  if (!currentState.user.isPremium && currentState.user.dailyUploads >= 3) {
    showUpgradeModal();
    return;
  }

  // Create hidden file input for real image capture
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.capture = 'environment'; // Prefer rear camera on mobile

  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Prevent huge files from crashing the browser (Limit: 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("The file is too large for the Royal Archives! Please choose a smaller photo (under 5MB).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      currentState.tempImage = event.target.result; // Store for analysis view

      // Generate Deterministic Data based on file (so same photo = same result)
      const seed = file.size + file.lastModified;
      const pseudoRandom = (offset) => {
        const x = Math.sin(seed + offset) * 10000;
        return x - Math.floor(x);
      };

      const kcal = Math.floor(pseudoRandom(1) * (700 - 300) + 300);
      const protein = Math.floor(pseudoRandom(2) * (40 - 10) + 10);
      const fat = Math.floor(pseudoRandom(3) * (30 - 5) + 5);
      const carbs = Math.floor(pseudoRandom(4) * (80 - 20) + 20);

      const newMeal = {
        date: new Date().toLocaleDateString(),
        timestamp: Date.now(),
        calories: kcal,
        protein: protein,
        fat: fat,
        carbs: carbs,
        image: currentState.tempImage
      };
      // Add to History
      if (!currentState.user.mealHistory) currentState.user.mealHistory = [];
      currentState.user.mealHistory.push(newMeal);

      // Attempt save (Handle quota exceeded for images)
      try {
        saveUserData();
      } catch (e) {
        // If update fails (likely image too big), remove image from history save but keep stats
        newMeal.image = null;
        currentState.tempImage = null; // Clear temp image too to prevent rendering freeze
        saveUserData();
        console.warn("Image too large to save persistently, saving stats only.");
      }

      // Credit deduction logic moved here (only after successful selection)
      if (!currentState.user.isPremium) {
        currentState.user.dailyUploads++;
        currentState.user.totalUploads = (currentState.user.totalUploads || 0) + 1;
        if (currentState.user.totalUploads === 3 && currentState.user.norigaeCount < 2) {
          currentState.pendingReward = { name: 'Passion', color: 'var(--obang-red)', level: 2 };
        }
        saveUserData();
      }
      showScanningEffect();
    };
    reader.readAsDataURL(file);
  };

  input.click();
}

function showUpgradeModal() {
  const existing = document.getElementById('upgradeModal');
  if (existing) existing.remove();
  const okOverlay = document.createElement('div');
  okOverlay.id = 'upgradeModal';
  okOverlay.className = 'premium-modal-overlay fade-in';
  okOverlay.innerHTML = `
        <div class="premium-card">
            <div style="width:100px; height:100px; margin:0 auto 20px;">${realisticGoblin('sad')}</div>
            <h2 class="serif" style="font-size:20px;">Out of Royal Glances<br>for today!</h2>
            <p style="font-size:13px; opacity:0.7; margin:15px 0 25px;">Become a <b>'Royal Special Management'</b> member<br>to enjoy unlimited AI wisdom.</p>
            <button class="primary-btn" id="modalUpgradeBtn" style="background:var(--obang-yellow); color:var(--obang-black); margin-bottom:12px;">👑 Royal Upgrade ($4.99/mo)</button>
            <button class="primary-btn" id="modalCloseBtn" style="background:#eee; color:#666; padding:15px; font-size:14px;">Maybe tomorrow</button>
        </div>
    `;
  document.body.appendChild(okOverlay);
  // Auto close removed to enforce choice? or keep timer? Keep timer for UX
  const autoTimer = setTimeout(() => { if (okOverlay && okOverlay.parentNode) okOverlay.remove(); }, 6000);

  document.getElementById('modalUpgradeBtn').onclick = (e) => {
    clearTimeout(autoTimer);
    // Open external link as requested
    window.open('https://link.inpock.co.kr/leegoheun', '_blank');
    okOverlay.remove();
  };
  document.getElementById('modalCloseBtn').onclick = () => {
    clearTimeout(autoTimer);
    okOverlay.remove();
  };
}

function showPaymentProcessing() {
  const processing = document.createElement('div');
  processing.className = 'premium-modal-overlay fade-in';
  processing.style.background = 'radial-gradient(circle at center, #1A1A1A 0%, #000 100%)';
  processing.innerHTML = `
        <div style="text-align:center; color:white;">
            <div class="loading-royal" style="width:80px; height:80px; margin:0 auto 30px; border:3px solid var(--obang-yellow); border-top-color:transparent; border-radius:50%; animation: spin 1s linear infinite;"></div>
            <h2 class="serif" style="letter-spacing:1px; margin-bottom:10px;">Contacting Royal Treasury...</h2>
            <p style="font-size:12px; opacity:0.6;">Please wait...</p>
        </div>
    `;
  document.body.appendChild(processing);
  setTimeout(() => finalizeUpgrade(processing), 3000);
}

function finalizeUpgrade(overlay) {
  overlay.innerHTML = `
        <div style="text-align:center; color:white;" class="fade-in">
             <div style="font-size:60px; margin-bottom:20px;">👑</div>
             <h2 class="serif">Membership Approved!</h2>
             <p style="opacity:0.8; margin-top:10px;">Welcome to the Royal Family.<br>Unlimited access granted.</p>
        </div>
    `;
  playSound('magic');

  currentState.user.isPremium = true;
  currentState.user.dailyUploads = 0;
  saveUserData();

  setTimeout(() => {
    overlay.remove();
    renderHome();
  }, 2500);
}



function showScanningEffect() {
  inkWashEffect();
  app.innerHTML = `
    <div class="analysis-page fade-in" style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#141E30;">
      <div style="width:120px; height:120px; border-radius:50%; border:3px solid var(--obang-yellow); position:relative; animation: pulse 2s infinite;">
         <img src="${currentState.tempImage || 'https://images.unsplash.com/photo-1541014741259-df529411bc4a?auto=format&fit=crop&q=80&w=800'}" style="width:100%; height:100%; border-radius:50%; object-fit:cover; opacity:0.7;">
         <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:100%; height:2px; background:var(--obang-red); box-shadow:0 0 10px var(--obang-red); animation: scan 1.5s infinite;"></div>
      </div>
      <h2 class="serif" style="color:white; margin-top:30px; letter-spacing:2px;">Analyzing...</h2>
      <p style="color:rgba(255,255,255,0.6); font-size:12px; margin-top:10px;">The Dokkaebi is counting calories...</p>
    </div>
  `;

  // Directly navigate safely after animation
  setTimeout(() => {
    navigate('analysis');
  }, 1500);
}

function showAdScreen() {
  app.innerHTML = `
        <div class="ad-screen fade-in" style="height:100%; background:#000; display:flex; flex-direction:column; align-items:center; justify-content:center; color:white; padding:40px; text-align:center;">
            <div style="font-size:10px; opacity:0.5; position:absolute; top:40px;">SPONSORED</div>
            <div style="width:100px; height:100px; border-radius:20px; background:var(--obang-red); display:flex; align-items:center; justify-content:center; font-size:40px; margin-bottom:20px;">🍵</div>
            <h3 class="serif" style="font-size:24px;">Traditional Omija Tea</h3>
            <p style="font-size:14px; margin:10px 0 30px; line-height:1.6;">"Refresh your soul with the 5 tastes of nature."</p>
            <div id="adTimer" style="font-size:12px; font-weight:800; border:1px solid white; padding:10px 20px; border-radius:30px;">Wait 1s...</div>
        </div>
    `;
  let timeLeft = 1;
  const interval = setInterval(() => {
    timeLeft--;
    const timer = document.getElementById('adTimer');
    if (timer) timer.innerText = `Wait ${timeLeft}s...`;
    if (timeLeft <= 0) {
      clearInterval(interval);
      navigate('analysis');
    }
  }, 1000);
}

function renderAnalysis() {
  const history = currentState.user.mealHistory || [];
  const lastMeal = history.length > 0 ? history[history.length - 1] : { calories: 500, protein: 20, fat: 15, carbs: 60 };
  const imageSrc = currentState.tempImage || lastMeal.image || 'https://images.unsplash.com/photo-1541014741259-df529411bc4a?auto=format&fit=crop&q=80&w=800';

  app.innerHTML = `<div class="analysis-page fade-in" style="height:100%; background:#141E30; overflow-y:auto; padding-bottom:100px;"><header class="home-header" style="color:white;"><button id="anBackBtn" style="color:white; background:none; border:none; font-size:32px; cursor:pointer;">←</button><span class="serif">Analysis Result</span><div style="width:32px;"></div></header>
       <div style="padding: 20px;"><div class="food-photo-container"><img src="${imageSrc}" style="width:100%; border-radius:30px; border:3px solid var(--obang-yellow); object-fit: cover;"></div>
         <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:20px;">
           <div style="background:white; border-radius:15px; padding:18px; text-align:center;"><span style="font-size:24px; font-weight:800; display:block; color:var(--obang-black);">${lastMeal.calories}</span><span style="font-size:8px; opacity:0.4; color:var(--obang-black);">KCAL</span></div>
           <div style="background:rgba(255,255,255,0.1); border-radius:15px; padding:18px; text-align:center; border:1px solid var(--obang-red); color:white;"><span style="font-size:24px; font-weight:800; display:block;">${lastMeal.protein}g</span><span style="font-size:8px; opacity:0.6;">PROTEIN</span></div>
           <div style="background:rgba(255,255,255,0.1); border-radius:15px; padding:18px; text-align:center; border:1px solid var(--obang-yellow); color:white;"><span style="font-size:24px; font-weight:800; display:block;">${lastMeal.fat}g</span><span style="font-size:8px; opacity:0.6;">FAT</span></div>
           <div style="background:rgba(255,255,255,0.1); border-radius:15px; padding:18px; text-align:center; border:1px solid var(--obang-blue); color:white;"><span style="font-size:24px; font-weight:800; display:block;">${lastMeal.carbs}g</span><span style="font-size:8px; opacity:0.6;">CARBS</span></div>
         </div>
         
         <div class="meal-list-item" style="margin-top:70px; padding: 60px 25px 30px; flex-direction:column; position:relative; background:white;"><div style="position:absolute; top:-70px; left:50%; transform:translateX(-50%); width:140px; height:140px;">${realisticGoblin('happy')}</div>
            ${(() => {
      let title = "Balance in Nature";
      let desc = "Your meal blooms with five colors. Balance in nature brings balance to your spirit.";
      let tip = "Since this meal is balanced, enjoy a peaceful walk.";

      if (lastMeal.carbs > lastMeal.protein * 2.5) {
        title = "Earth Energy Overload";
        desc = "The yellow energy (Carbs) is overwhelming properly. To maintain royal dignity, summon more green vegetables (Wood).";
        tip = "Try reducing rice or noodles by 3 spoons next time.";
      } else if (lastMeal.fat > lastMeal.protein && lastMeal.fat > lastMeal.carbs * 0.5) {
        title = "Heavy Clouds Gathering";
        desc = "Rich flavors (Fat) are delightful, but too much oil clouds the mind. Cleanse your palate.";
        tip = "A cup of warm Omija tea is recommended to cut the grease.";
      } else if (lastMeal.protein > lastMeal.carbs * 0.8) {
        title = "Warrior's Strength";
        desc = "Strong fire energy (Protein) detected! Excellent for building the royal guard (Muscles).";
        tip = "Don't forget hydration to cool down your inner heat.";
      }

      return `
            <h3 class="serif" style="text-align:center; color:var(--obang-black);">${title}</h3><div class="serif" style="text-align:center; font-style:italic; margin:10px 0; color:var(--obang-black);">"${desc}"</div>
            <div style="margin-top:20px; background: #fdf5e6; border: 1px dashed #d2b48c; padding: 15px; border-radius: 5px; position:relative;">
               <div style="position:absolute; left:-5px; top:50%; transform:translateY(-50%); width:10px; height:80%; border-radius:10px; background:#8b4513;"></div>
               <div style="position:absolute; right:-5px; top:50%; transform:translateY(-50%); width:10px; height:80%; border-radius:10px; background:#8b4513;"></div>
               <div style="font-size:10px; font-weight:800; color:#8b4513; margin-bottom:5px; text-align:center;">📜 SECRET SCROLL</div>
               <div style="font-size:12px; color:var(--obang-black); line-height:1.5; text-align:center; font-style:italic;">"${tip}"</div>
            </div>`;
    })()}
         </div>
         
         <!-- Curated Commerce Section (Separate Card) -->
         <div class="meal-list-item" style="flex-direction:column; padding:20px 25px; margin-top:10px; background:white;">
            <div style="font-size:10px; opacity:0.5; margin-bottom:12px; letter-spacing:1px; text-align:center; font-weight:800; color:var(--obang-black);">ROYAL PANTRY SELECTION</div>
            ${(() => {
      let product = { name: "Organic Omija Tea", desc: "Balance your palate", icon: "🍵", link: "https://link.inpock.co.kr/leegoheun" };
      if (lastMeal.carbs > lastMeal.protein * 2) {
        product = { name: "Konjac Jelly Pouch", desc: "Lightness for the body", icon: "🧊", link: "https://link.inpock.co.kr/leegoheun" };
      } else if (lastMeal.fat > lastMeal.protein) {
        product = { name: "Premium Green Tea", desc: "Cleanses the oil", icon: "🌱", link: "https://link.inpock.co.kr/leegoheun" };
      } else if (lastMeal.protein > lastMeal.carbs) {
        product = { name: "Sparkling Water", desc: "Cooling hydration", icon: "💧", link: "https://link.inpock.co.kr/leegoheun" };
      }

      return `
                <a href="${product.link}" target="_blank" style="text-decoration:none; color:inherit; display:flex; align-items:center; background:#f9f9f9; padding:15px; border-radius:18px; border:1px solid #eee; gap:15px; transition:0.3s; box-shadow:0 5px 15px rgba(0,0,0,0.03);">
                    <div style="font-size:28px; background:white; width:54px; height:54px; display:flex; align-items:center; justify-content:center; border-radius:14px; border:1px solid #eee;">${product.icon}</div>
                    <div style="text-align:left; flex:1;">
                        <div style="font-size:15px; font-weight:800; color:var(--obang-black); margin-bottom:3px;">${product.name} ↗</div>
                        <div style="font-size:12px; opacity:0.75; color:#555;">${product.desc}</div>
                    </div>
                </a>
            `;
    })()}
         </div>

         <button id="anHomeBtn" class="primary-btn" style="background:var(--obang-yellow); color:var(--obang-black); margin-top:10px;">↻ Another Snapshot</button>
       </div></div>`;
  attach('anBackBtn', () => navigate('home'));
  attach('anHomeBtn', () => navigate('home'));
}

function renderInsights() {
  // Calculate Today's Real Data
  const todayStr = new Date().toLocaleDateString();
  const todayMeals = currentState.user.mealHistory ? currentState.user.mealHistory.filter(m => m.date === todayStr) : [];

  let totalC = 0, totalP = 0, totalF = 0;
  todayMeals.forEach(m => { totalC += m.carbs; totalP += m.protein; totalF += m.fat; });
  const totalMass = totalC + totalP + totalF || 1; // Avoid divide by zero

  const pctC = Math.round((totalC / totalMass) * 100);
  const pctP = Math.round((totalP / totalMass) * 100);
  const pctF = Math.round((totalF / totalMass) * 100);

  // Mock Weekly Data for graph (mostly mock, but last index is today if valid)
  const weeklyData = [650, 800, 720, 500, 950, 680, todayMeals.reduce((acc, m) => acc + m.calories, 0) || 540];
  const maxVal = Math.max(...weeklyData);

  app.innerHTML = `
    <div class="screen-wrapper fade-in" style="background:#fcfaf2; height:100%;">
      <header class="home-header">
        <button id="insBackBtn" style="background:none; border:none; font-size:32px; cursor:pointer;">←</button>
        <span class="serif" style="font-weight:800; color:var(--obang-black);">Royal Ledger</span>
        <div style="width:32px;"></div>
      </header>
      
      <div style="padding: 20px;">
        <h4 class="serif" style="margin-bottom:15px; color:var(--obang-black);">📅 7-Day Energy Flow</h4>
        <div class="meal-list-item" style="padding:25px; flex-direction:column; align-items:flex-start; margin-bottom:25px;">
            <div style="display:flex; align-items:flex-end; justify-content:space-between; width:100%; height:150px; margin-top:10px;">
                ${weeklyData.map((val, idx) => {
    const height = (val / maxVal) * 100;
    const isToday = idx === 6;
    return `
                      <div style="display:flex; flex-direction:column; align-items:center; gap:8px; flex:1;">
                          <div style="width:12px; height:${height}%; background:${isToday ? 'var(--obang-red)' : 'var(--obang-blue)'}; border-radius:10px; opacity:${isToday ? 1 : 0.3}; transition: height 1s ease;"></div>
                          <div style="font-size:10px; color:${isToday ? 'var(--obang-red)' : '#aaa'}; font-weight:800;">${['S', 'M', 'T', 'W', 'T', 'F', 'S'][idx]}</div>
                      </div>
                    `;
  }).join('')}
            </div>
            <div style="margin-top:20px; text-align:center; width:100%; font-size:12px; opacity:0.6;">You consumed <b>${weeklyData[6]} kcal</b> today.</div>
        </div>

        <h4 class="serif" style="margin-bottom:15px; color:var(--obang-black);">☯️ Today's Balance (Five Elements)</h4>
        <div class="meal-list-item" style="padding:25px; flex-direction:column; margin-bottom:25px; gap:15px;">
            <div style="display:flex; align-items:center; justify-content:space-between;">
                <span style="font-size:12px; font-weight:800; width:50px;">Carbs</span>
                <div style="flex:1; height:8px; background:#eee; border-radius:4px; margin:0 15px; overflow:hidden;"><div style="width:${pctC}%; height:100%; background:var(--obang-yellow);"></div></div>
                <span style="font-size:12px; opacity:0.6;">${pctC}%</span>
            </div>
            <div style="display:flex; align-items:center; justify-content:space-between;">
                <span style="font-size:12px; font-weight:800; width:50px;">Protein</span>
                <div style="flex:1; height:8px; background:#eee; border-radius:4px; margin:0 15px; overflow:hidden;"><div style="width:${pctP}%; height:100%; background:var(--obang-red);"></div></div>
                <span style="font-size:12px; opacity:0.6;">${pctP}%</span>
            </div>
            <div style="display:flex; align-items:center; justify-content:space-between;">
                <span style="font-size:12px; font-weight:800; width:50px;">Fat</span>
                <div style="flex:1; height:8px; background:#eee; border-radius:4px; margin:0 15px; overflow:hidden;"><div style="width:${pctF}%; height:100%; background:var(--obang-blue);"></div></div>
                <span style="font-size:12px; opacity:0.6;">${pctF}%</span>
            </div>
            <p style="font-size:11px; margin-top:15px; text-align:center; opacity:0.5; font-style:italic;">"${pctC > 50 ? 'Earth energy is dominant today.' : pctP > 40 ? 'Fire energy is strong within you.' : 'Your elements are flowing nicely.'}"</p>
        </div>

        <div style="background:var(--obang-black); color:white; padding:20px; border-radius:20px; text-align:center;">
             <h3 class="serif" style="color:var(--obang-yellow); margin-bottom:5px;">Weekly Report</h3>
             <p style="font-size:12px; opacity:0.7; margin-bottom:15px;">Ready to receive the Royal Physician's diagnosis?</p>
             <button class="primary-btn" style="background:white; color:var(--obang-black); padding:12px; font-size:13px;">Generate Report</button>
        </div>
      </div>
      <nav class="nav-bar">
        <div class="nav-link" id="navInsToHome">🏠<span>Home</span></div>
        <div class="nav-link active">📊<span>Insights</span></div>
        <div class="nav-link">📖<span>Recipes</span></div>
        <div class="nav-link" id="navInsToProf">👤<span>Profile</span></div>
      </nav>
    </div>
  `;
  attach('insBackBtn', () => navigate('home'));
  attach('navInsToHome', () => navigate('home'));
  attach('navInsToProf', () => navigate('settings'));
  attach('navInsToRecipes', () => alert("The Royal Kitchen is preparing recipes!"));
}

window.purchaseSkin = (skin) => {
  if (skin === 'hat') {
    if (confirm("Go to store to get 'Scholar's Gat'?")) {
      window.open('https://link.inpock.co.kr/leegoheun', '_blank');
    }
  }
};

window.purchaseItem = (item) => {
  if (item === 'club') {
    if (confirm("Go to store to get 'Magic Club'?")) {
      window.open('https://link.inpock.co.kr/leegoheun', '_blank');
    }
  }
}

window.equipItem = (item) => {
  currentState.user.equippedItem = currentState.user.equippedItem === item ? null : item;
  saveUserData();
  renderSettings();
}
window.equipSkin = (skin) => {
  currentState.user.equippedSkin = currentState.user.equippedSkin === skin ? null : skin;
  saveUserData();
  renderSettings();
};

function renderSettings() {
  const historyHtml = currentState.user.paymentHistory && currentState.user.paymentHistory.length > 0
    ? currentState.user.paymentHistory.slice(0, 2).map(item => `
        <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #f0f0f0;">
            <div>
                <div style="font-size:12px; font-weight:800; color:var(--obang-black);">${item.item}</div>
                <div style="font-size:9px; opacity:0.5; color:var(--obang-black);">${item.date}</div>
            </div>
            <div style="text-align:right;">
                <div style="font-size:12px; font-weight:800; color:var(--obang-red);">${item.amount}</div>
            </div>
        </div>
    `).join('')
    : `<div style="padding:10px; text-align:center; opacity:0.4; font-size:11px;">No records found.</div>`;

  app.innerHTML = `
    <div class="screen-wrapper fade-in" style="background:var(--obang-white); height:100%;"><header class="home-header" style="padding:15px 25px 0;"><button id="setBackBtn" style="background:none; border:none; font-size:28px; color:var(--obang-black); cursor:pointer;">←</button><span class="serif" style="font-weight:800; color:var(--obang-black); font-size:16px;">My Profile</span><div style="width:28px;"></div></header>
      
      <div style="text-align:center; padding: 10px 20px 5px; display:flex; align-items:center; justify-content:center; gap:15px;">
        <img src="${currentState.user.profilePic}" style="width:70px; height:70px; border-radius:50%; border:3px solid white; box-shadow:var(--shadow-soft);">
        <div style="text-align:left;">
            <h2 class="serif" style="margin:0; font-size:20px; color:var(--obang-black) !important;">${currentState.user.name}</h2>
            <div style="font-size:11px; opacity:0.6; color:var(--obang-black);">Royal Traveler</div>
        </div>
      </div>

      <div style="padding: 0 20px 80px;">
        <!-- Membership Compact -->
        <div class="meal-list-item" style="background:var(--obang-black); color:var(--obang-white); padding:12px 18px; margin-bottom:15px; border:1px solid var(--obang-yellow); align-items:center;">
            <div style="flex:1;">
                <div style="font-size:9px; color:var(--obang-yellow); font-weight:800; letter-spacing:1px;">MEMBERSHIP</div>
                <div style="font-size:14px; font-weight:800; margin:2px 0 0; color:var(--obang-yellow);">${currentState.user.isPremium ? 'Royal Special Management' : 'Free Traveler'}</div>
            </div>
            ${!currentState.user.isPremium ? `<button id="setUpgradeBtn" style="background:var(--obang-yellow); color:var(--obang-black); border:none; padding:6px 12px; border-radius:8px; font-weight:800; font-size:11px; cursor:pointer;">Upgrade</button>` : ''}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <h4 class="serif" style="font-size:14px; color:var(--obang-black);">🏅 Norigae</h4>
            <span style="font-size:10px; opacity:0.5;">Collection</span>
        </div>
        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:10px; margin-bottom:20px;">
          ${[
      { name: 'Hope', color: 'var(--obang-blue)', req: 1 },
      { name: 'Passion', color: 'var(--obang-red)', req: 2 },
      { name: 'Balance', color: 'var(--obang-yellow)', req: 3 }
    ].map(n => {
      const isUnlocked = currentState.user.norigaeCount >= n.req;
      return `<div class="norigae-item" style="padding:10px; ${isUnlocked ? '' : 'opacity:0.3; filter:grayscale(1);'}">
                <div style="width:25px; height:40px; margin:0 auto 5px;">${norigaeSVG(n.color)}</div>
                <div style="font-size:9px; font-weight:800; color:var(--obang-black); text-align:center;">${n.name}</div>
              </div>`;
    }).join('')}
        </div>
        
        <h4 class="serif" style="margin-bottom:8px; font-size:14px; color:var(--obang-red);">🛍️ Royal Boutique</h4>
        <!-- Grid Layout for Boutique -->
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:20px;">
            <!-- Hat -->
            <div class="meal-list-item" style="padding:12px; background:white; margin:0; flex-direction:column; gap:8px; text-align:center;">
                 <div style="font-size:24px;">🎩</div>
                 <div>
                     <div style="font-size:12px; font-weight:800; color:var(--obang-black);">Scholar's Gat</div>
                 </div>
                 ${(currentState.user.unlockedSkins && currentState.user.unlockedSkins.includes('hat'))
      ? `<button onclick="equipSkin('hat')" style="background:${currentState.user.equippedSkin === 'hat' ? 'var(--obang-black)' : 'white'}; color:${currentState.user.equippedSkin === 'hat' ? 'white' : 'var(--obang-black)'}; border:1px solid var(--obang-black); padding:5px 10px; border-radius:8px; font-weight:800; font-size:10px; cursor:pointer; width:100%;">${currentState.user.equippedSkin === 'hat' ? 'Unequip' : 'Equip'}</button>`
      : `<button onclick="purchaseSkin('hat')" style="background:var(--obang-red); color:white; border:none; padding:5px 10px; border-radius:8px; font-weight:800; font-size:10px; cursor:pointer; width:100%;">$0.99</button>`}
            </div>
            
            <!-- Club -->
            <div class="meal-list-item" style="padding:12px; background:white; margin:0; flex-direction:column; gap:8px; text-align:center;">
                 <div style="font-size:24px;">🪵</div>
                 <div>
                     <div style="font-size:12px; font-weight:800; color:var(--obang-black);">Magic Club</div>
                 </div>
                 ${(currentState.user.unlockedItems && currentState.user.unlockedItems.includes('club'))
      ? `<button onclick="equipItem('club')" style="background:${currentState.user.equippedItem === 'club' ? 'var(--obang-black)' : 'white'}; color:${currentState.user.equippedItem === 'club' ? 'white' : 'var(--obang-black)'}; border:1px solid var(--obang-black); padding:5px 10px; border-radius:8px; font-weight:800; font-size:10px; cursor:pointer; width:100%;">${currentState.user.equippedItem === 'club' ? 'Unequip' : 'Equip'}</button>`
      : `<button onclick="purchaseItem('club')" style="background:var(--obang-red); color:white; border:none; padding:5px 10px; border-radius:8px; font-weight:800; font-size:10px; cursor:pointer; width:100%;">$1.99</button>`}
            </div>
        </div>
        
        <h4 class="serif" style="margin-bottom:8px; font-size:14px; color:var(--obang-blue);">📏 Physical Profile</h4>
        <div class="meal-list-item" style="padding:15px; border-left: 4px solid var(--obang-blue); background:white; display:flex; justify-content:space-between; margin-bottom:15px; align-items:center;">
            <div style="text-align:center;"><div style="font-size:9px; opacity:0.5;">GENDER</div><div style="font-size:13px; font-weight:800;">${currentState.user.gender}</div></div>
            <div style="width:1px; height:20px; background:#f0f0f0;"></div>
            <div style="text-align:center;"><div style="font-size:9px; opacity:0.5;">HEIGHT</div><div style="font-size:13px; font-weight:800;">${currentState.user.height}</div></div>
            <div style="width:1px; height:20px; background:#f0f0f0;"></div>
            <div style="text-align:center;"><div style="font-size:9px; opacity:0.5;">WEIGHT</div><div style="font-size:13px; font-weight:800;">${currentState.user.weight}</div></div>
        </div>

        <button id="setResetBtn" style="width:100%; border:none; background:none; color:#aaa; padding:10px; font-size:11px; cursor:pointer; text-decoration:underline;">Reset Data</button>
      </div >
    </div >
  `;
  attach('setBackBtn', () => navigate('home'));
  attach('setUpgradeBtn', showUpgradeModal);
  attach('setResetBtn', () => {
    if (confirm("Clear all data?")) {
      localStorage.removeItem('sura_user_data');
      window.location.reload();
    }
  });
}

function showRewardModal(reward) {
  const modal = document.createElement('div');
  modal.className = 'premium-modal-overlay fade-in';
  modal.style.zIndex = "30000";
  modal.innerHTML = `
  <div class="premium-card">
            <div style="width:80px; height:120px; margin:0 auto 20px; animation: float 3s infinite;">${norigaeSVG(reward.color)}</div>
            <h2 class="serif" style="color:var(--obang-black);">New Norigae Found!</h2>
            <p style="font-size:14px; opacity:0.7; margin:15px 0 25px;">Your consistency has been rewarded with <b>'${reward.name}'</b>.</p>
            <button class="primary-btn" id="rewCloseBtn" style="background:var(--obang-black);">Collect Reward</button>
        </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('rewCloseBtn').onclick = () => modal.remove();
}

// Start
// Start
if (currentState.screen === 'onboarding') renderOnboarding();
else renderHome();
setInterval(updateMood, 60000);

// --- [Visual Effects: Floating Hangul] ---
function startFloatingHangul() {
  const app = document.getElementById('app');
  if (!app) return;

  // Inject Styles for layering
  const style = document.createElement('style');
  style.innerHTML = `
        #app {
            position: relative;
            overflow: hidden !important; 
            /* Ensure background color is set on app or body, floaters will sit above it */
        }
        .screen-wrapper {
            position: relative;
            z-index: 10; /* Content sits firmly above floaters */
        }
        .hangul-floater {
            position: absolute; /* Relative to #app */
            bottom: -50px;
            color: rgba(120, 120, 120, 0.2); /* Slightly visible gray */
            font-family: 'Noto Serif KR', serif;
            font-weight: 800;
            user-select: none;
            pointer-events: none;
            z-index: 1; /* Above app background, below content */
            animation: floatUp linear forwards;
            white-space: nowrap;
        }
        @keyframes floatUp {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 0.8; }
            100% { transform: translateY(-110vh) rotate(5deg); opacity: 0; }
        }
    `;
  document.head.appendChild(style);

  // Words focused on nature and wellness
  const words = ['건강', '기운', '복', '수라', '바람', '물', '불', '흙', '쌀', '나무', '하늘', '달', '별', '해', '산', '강', '꿈', '삶', '멋', '흥'];

  // Spawner
  if (window.hangulInterval) clearInterval(window.hangulInterval);
  window.hangulInterval = setInterval(() => {
    const span = document.createElement('span');
    span.className = 'hangul-floater';
    span.innerText = words[Math.floor(Math.random() * words.length)];

    // Random Properties
    const size = Math.random() * 20 + 14 + 'px'; // 14px - 34px
    const left = Math.random() * 90 + 5 + '%'; // Keep away from extreme edges
    const duration = Math.random() * 15 + 15 + 's'; // 15s - 30s (Slow)

    span.style.fontSize = size;
    span.style.left = left;
    span.style.animationDuration = duration;

    app.appendChild(span); // Append to APP, not body

    // Clean up
    setTimeout(() => {
      if (span.parentNode) span.parentNode.removeChild(span);
    }, 30000);
  }, 800); // New word every 0.8s
}

// --- Data Persistence ---
window.saveUserData = () => {
  localStorage.setItem('suraState', JSON.stringify(currentState));
};

function loadUserData() {
  const saved = localStorage.getItem('suraState');
  if (saved) {
    try {
      Object.assign(currentState, JSON.parse(saved));
    } catch (e) { console.error('Data error', e); }
  } else {
    // Default State if fresh install
    if (!currentState.waterProgress) currentState.waterProgress = 0;
    if (!currentState.user) currentState.user = { name: "SURA User", profilePic: "dokkaebi-icon.svg", theme: "default" };
  }
}

// --- Application Boot ---
function init() {
  // 1. Load Data
  loadUserData();

  // 2. Render Home Screen
  renderHome();

  // 3. Start Effects
  startFloatingHangul();

  // 4. Reveal App (Fade In)
  const appEl = document.getElementById('app');
  if (appEl) {
    appEl.style.opacity = '1';
    appEl.style.transition = 'opacity 1s ease-in';
  }
}

// Attach Init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
