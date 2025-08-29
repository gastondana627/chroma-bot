/* script.js
   Modular Chroma Bot logic:
   - Uses images from ./assets/Chroma_Logo_With_Background/img/
   - Keeps state in localStorage
   - Keyword-driven responses, with hooks for remote LLM
   - crack levels 0..5 (update the overlay image accordingly)
*/

(() => {
    // CONFIG: relative path to your Chroma images folder (update if you move them)
    const IMG_FOLDER = './assets/Chroma_Logo_With_Background/img';
    const CRACK_FILES = [
      `${IMG_FOLDER}/Chroma_1.png`,
      `${IMG_FOLDER}/Chroma_2.png`,
      `${IMG_FOLDER}/Chroma_3.png`,
      `${IMG_FOLDER}/Chroma_4.png`,
      `${IMG_FOLDER}/Chroma_5.png`,
      // if you have more versions name them 6,7... adjust setCracks maximum
    ];
    const MAX_CRACKS = CRACK_FILES.length - 1; // 0..N
  
    // ELEMENTS
    const htmlEl = document.documentElement;
    const $messages = document.getElementById('messages');
    const $input = document.getElementById('userInput');
    const $sendBtn = document.getElementById('sendBtn');
    const $statusProfile = document.getElementById('statusProfile');
    const $statusCracks = document.getElementById('statusCracks');
    const $toggleSfx = document.getElementById('toggleSfx');
    const $crackImage = document.getElementById('crackImage');
    const $glitchAudio = document.getElementById('glitchSfx');
  
    // LOCAL STATE (persisted)
    const STORAGE_KEY = 'chroma_state_v1';
    const defaultState = { theme: 'maya', cracks: 0, sfx: true };
    let state = loadState() || defaultState;
  
    // Knowledge & Keywords (expandable / easily moved to JSON)
    const knowledge = {
      general: [
        "Always verify identity through an in-app video or trusted third-party.",
        "Never send money or gift cards to someone you just met online.",
        "If they pressure you to move the conversation off-platform, that's a red flag."
      ],
      maya: [
        "On dating apps: ask for a live short video check before trusting someone.",
        "Check for inconsistencies in their profile content and timing of messages.",
        "Never share location or private images until you've verified them."
      ],
      stanley: [
        "Older adults are targeted with emotional scams — verify before sending money.",
        "Use trusted family/friend verification when a new person claims to love you.",
        "Report suspicious profiles to the platform; it helps protect others."
      ],
      eli: [
        "When selling/buying consoles: use police 'safe exchange' zones.",
        "Don't meet buyers at your home — insist on public, well-lit locations.",
        "Lock accounts with 2FA and never share verification codes."
      ]
    };
  
    // ---------- Utilities ----------
    function saveState() {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
    }
    function loadState() {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) { return null; }
    }
  
    function appendMessage(text, who = 'bot') {
      const el = document.createElement('div');
      el.className = `msg ${who === 'user' ? 'user' : 'bot'}`;
      const b = document.createElement('div');
      b.className = 'bubble';
      b.textContent = text;
      el.appendChild(b);
      $messages.appendChild(el);
      $messages.scrollTop = $messages.scrollHeight;
    }
  
    function setTheme(theme) {
      state.theme = theme;
      htmlEl.setAttribute('data-theme', theme);
      $statusProfile.textContent = theme[0].toUpperCase() + theme.slice(1);
      saveState();
      // small intro
      const intro = {
        maya: "Dating-app mode: ask about verification & meet safety.",
        stanley: "FriendSpace mode: romance fraud & companionship scams.",
        eli: "Console mode: marketplace & trade safety."
      };
      appendMessage(intro[theme] || intro.maya, 'bot');
    }
  
    function setCracks(n) {
      state.cracks = Math.max(0, Math.min(MAX_CRACKS, Math.round(n)));
      htmlEl.setAttribute('data-crack', String(state.cracks));
      $statusCracks.textContent = `${state.cracks} / ${MAX_CRACKS}`;
      // update overlay image
      const idx = Math.min(MAX_CRACKS, Math.max(0, state.cracks));
      $crackImage.src = CRACK_FILES[idx] || CRACK_FILES[0];
      saveState();
      if (state.sfx && idx > 0 && $glitchAudio) {
        $glitchAudio.currentTime = 0;
        $glitchAudio.play().catch(()=>{});
      }
    }
  
    // Basic keyword matching with scaling behavior
    function getBotResponseAndEffect(userText) {
      const t = userText.trim().toLowerCase();
  
      // Hard-coded commands for quick testing
      if (t === 'bad') return { reply: "Simulating risky action — logo cracks.", crackDelta: +1 };
      if (t === 'heal' || t === 'repair') return { reply: "Repairing state — logo stabilizes.", crackDelta: -1 };
      if (t === 'tips' || t === 'help') {
        const deck = [...knowledge.general, ...(knowledge[state.theme] || [])];
        return { reply: deck[Math.floor(Math.random()*deck.length)], crackDelta: 0 };
      }
      if (t.includes('stats') || t.includes('numbers')) {
        return { reply: "Data: Romance scams cost billions annually. Check FTC/IC3 for details.", crackDelta: 0 };
      }
  
      // heuristics: certain words imply risk
      const riskWords = ['money', 'transfer', 'gift', 'meeting', 'home', 'private', 'address', 'paypal', 'venmo', 'meet', 'ship'];
      const safeWords = ['verify', 'video', 'report', 'block', 'police', 'public'];
  
      for (let w of riskWords) if (t.includes(w)) return { reply: "That sounds risky. Consider verifying and do not send money.", crackDelta: +1 };
      for (let w of safeWords) if (t.includes(w)) return { reply: "Good move — verify and keep interactions in-platform.", crackDelta: -1 };
  
      // default: themed small-talk
      const deck = knowledge.general.concat(knowledge[state.theme] || []);
      return { reply: deck[Math.floor(Math.random()*deck.length)], crackDelta: 0 };
    }
  
    // Hook for remote LLM (commented placeholder)
    async function remoteLLMReply(userText) {
      // Example: later replace with fetch('/api/chat', { method:'POST', body: JSON.stringify({text:userText}) })
      // return "Remote LLM reply..."
      return null;
    }
  
    // ---------- Events ----------
    // send
    async function handleSend() {
      const text = $input.value.trim();
      if (!text) return;
      appendMessage(text, 'user');
      $input.value = '';
      // try remote LLM (optional): if configured, remoteLLMReply returns a string
      const remote = await remoteLLMReply(text).catch(()=>null);
      if (remote) {
        appendMessage(remote, 'bot');
        return;
      }
      // local logic
      const { reply, crackDelta } = getBotResponseAndEffect(text);
      if (crackDelta && crackDelta !== 0) setCracks(state.cracks + crackDelta);
      // small delay for realism
      setTimeout(()=> appendMessage(reply || "I don't know that yet."), 250);
    }
  
    $sendBtn.addEventListener('click', handleSend);
    $input.addEventListener('keydown', (e) => { if (e.key === 'Enter') handleSend(); });
  
    // mode buttons (if using same markup)
    document.querySelectorAll('.mode').forEach(btn => {
      btn.addEventListener('click', () => {
        const theme = btn.dataset.theme;
        setTheme(theme);
      });
    });
  
    $toggleSfx.addEventListener('click', () => {
      state.sfx = !state.sfx;
      $toggleSfx.textContent = state.sfx ? 'SFX: On' : 'SFX: Off';
      saveState();
    });
  
    // ---------- Init ----------
    setTheme(state.theme || 'maya');
    setCracks(state.cracks || 0);
    appendMessage("Hello — I'm Chroma. Try: 'tips', 'bad', 'heal', or ask about meeting safety.", 'bot');
  
    // Expose small API for console debugging
    window.Chroma = {
      state,
      setTheme,
      setCracks,
      appendMessage
    };
  
  })();