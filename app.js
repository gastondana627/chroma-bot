// ---------- STATE ----------
const state = {
    theme: 'maya',        // 'stanley' | 'maya' | 'eli'
    cracks: 0,            // 0..5
    sfx: true,
    crackImages: [
      './assets/images/chroma_logo.png',
      './assets/images/chroma_break_1.png',
      './assets/images/chroma_break_2.png',
      './assets/images/chroma_break_3.png',
      './assets/images/chroma_break_4.png',
      './assets/images/chroma_break_5.png'
    ],
    knowledge: {
      general: [
        "I’m your safety companion. Ask me about reporting, blocking, or verifying profiles.",
        "Never move to private payments or share verification codes.",
        "If something feels rushed, it’s usually a red flag."
      ],
      maya: [
        "On FriendBleed-like dating apps: verify with an in-app video call before meeting.",
        "Refuse to send private photos; scammers stockpile them for coercion.",
        "Meet only in public places. Tell a friend your plan."
      ],
      stanley: [
        "Romance scams often mirror your posts. Verify identities out-of-band before trusting.",
        "Never send money or gift cards—no legit friend will ask.",
        "Use platform reporting. It helps others, too."
      ],
      eli: [
        "Only trade devices at police exchange zones. Don’t meet at homes.",
        "Keep DMs in-platform; avoid sending personal contacts or addresses.",
        "Use 2FA on your gaming accounts."
      ]
    }
  };
  
  // ---------- ELEMENTS ----------
  const $html = document.documentElement;
  const $messages = document.getElementById('messages');
  const $input = document.getElementById('userInput');
  const $send = document.getElementById('sendBtn');
  const $statusProfile = document.getElementById('statusProfile');
  const $statusCracks = document.getElementById('statusCracks');
  const $toggleSfx = document.getElementById('toggleSfx');
  const $glitchSfx = document.getElementById('glitchSfx');
  const $crackImg = document.getElementById('crackImage');
  
  // ---------- UTIL ----------
  function addMsg(text, who='bot'){
    const wrap = document.createElement('div');
    wrap.className = `msg ${who}`;
    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.textContent = text;
    wrap.appendChild(bubble);
    $messages.appendChild(wrap);
    $messages.scrollTop = $messages.scrollHeight;
  }
  
  function setTheme(theme){
    state.theme = theme;
    $html.setAttribute('data-theme', theme);
    $statusProfile.textContent = theme[0].toUpperCase() + theme.slice(1);
    // intro line per theme
    const intros = {
      stanley: "CRT mode ready. Ask me about romance fraud safety.",
      maya:    "Dating app mode ready. Ask about verification & meeting safely.",
      eli:     "Console mode ready. Ask about trades, lobbies, and account safety."
    };
    addMsg(intros[theme], 'bot');
  }
  
  function setCracks(n){
    state.cracks = Math.max(0, Math.min(5, n));
    $html.setAttribute('data-crack', String(state.cracks));
    $statusCracks.textContent = `${state.cracks} / 5`;
    $crackImg.src = state.crackImages[state.cracks];
    if (state.sfx && state.cracks>0) {
      $glitchSfx.currentTime = 0;
      $glitchSfx.play().catch(()=>{});
    }
  }
  
  function replyTo(text){
    const t = text.trim().toLowerCase();
  
    // simulate bad choices / healing for demo
    if (t === 'bad' || t.includes('unsafe')) {
      setCracks(state.cracks + 1);
      addMsg("⚠️ That action felt risky. Consider reporting or verifying first.", 'bot');
      return;
    }
    if (t === 'heal' || t === 'repair') {
      setCracks(state.cracks - 1);
      addMsg("✅ Stabilized. Keep choices in-app and verify identities.", 'bot');
      return;
    }
  
    // themed safety snippets
    const deck = [
      ...state.knowledge.general,
      ...(state.knowledge[state.theme] || [])
    ];
    const tip = deck[Math.floor(Math.random()*deck.length)];
    addMsg(tip, 'bot');
  }
  
  // ---------- EVENTS ----------
  document.querySelectorAll('.mode').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.mode').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      setTheme(btn.dataset.theme);
    });
  });
  
  $send.addEventListener('click', ()=>{
    const v = $input.value;
    if (!v.trim()) return;
    addMsg(v, 'user'); $input.value='';
    setTimeout(()=>replyTo(v), 250);
  });
  $input.addEventListener('keydown', (e)=>{
    if (e.key === 'Enter') $send.click();
  });
  
  $toggleSfx.addEventListener('click', ()=>{
    state.sfx = !state.sfx;
    $toggleSfx.textContent = state.sfx ? 'On' : 'Off';
  });
  
  // ---------- INIT ----------
  setTheme('maya');
  setCracks(0);
  addMsg("Hello. I can crack when the narrative gets risky. Type “bad” to simulate, or ask for safety tips.", 'bot');