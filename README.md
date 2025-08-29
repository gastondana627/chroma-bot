# Chroma Bot Storyline

This repository contains the **Chroma Bot UI & Breaking Sequence Prototype**.  
It is currently developed **standalone** to allow for fast iteration, testing, and deployment.  
Later, this repo can be merged into the main game repository as a module.


## Repository Structure
bot-storyline/
│
├── README.md               # Documentation for repo
├── docs/                   # Notes, diagrams, planning
│   └── project-plan.md
│
├── src/                    # Core source code
│   ├── index.html          # Entry point
│   ├── main.js             # Your scripts
│   ├── styles.css          # Styling
│   └── scenes/             # VR/3D scenes
│       └── chroma-scene.js
│
├── assets/                 # All media assets
│   ├── images/
│   │   ├── chroma_break_1.png
│   │   ├── chroma_break_2.png
│   │   ├── chroma_break_3.png
│   │   ├── chroma_break_4.png
│   │   └── chroma_break_5.png
│   ├── audio/
│   │   └── glitch-sfx.wav
│   └── models/             # (Optional 3D models)
│
└── package.json            # Node dependencies (if using A-Frame/Three.js)




---

## Workflow

- Keep this repo **standalone** for now (UI/UX experiments).  
- Once the Chroma Bot sequences are stable → merge into main game repo under a `/modules/chroma-bot/` directory.  
- This keeps development modular and avoids blocking the larger game flow.  

---

## Localhost → Production Notes

- Localhost will be simple (static file server, e.g. `npm run dev` or `python3 -m http.server`).  
- Production on **Vercel** will auto-deploy this repo once connected.  
- When integrated into main repo → Vercel can be configured with separate build outputs for `game/` and `chroma-bot/`.

---

## Next Steps

- Add the 5 **Chroma breaking images** under `/assets/images/`.  
- Add glitch/horror audio under `/assets/audio/`.  
- Scaffold a simple A-Frame scene in `src/index.html`.  
- Test UI cracking logic in isolation before merging with main game.

