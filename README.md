---
https://oot3d.66ghz.com by GOOGLE GEMINI presented by XBCX based off the work by
--
TTEMMA; MeltyPlayer; folxxsreal; Alvare; scurest; Starkium;
--
xdanieldzd; NishaWolfe; FinModelUtility; JamesO2x; 
--
- devkitpro and luma3ds teams also big thanks
the world at large
--
game by nintendo originally
-
3ds port by grezzo
-----
-- requires npm to compile
--
to compile the standalone html js and css file(s) [1 html 1 css 1 js] from this source
- `git clone https://github.com/layeraudioai/oot3d.66ghz.com`
- `cd oo3d.66ghz.com`
- `npm run build`
-
- out is in dist/ (only need the 3 files, can delete aistudio dir within the dist dir np)
---
node.js is us ed with vite, esm, three.js, etc
"dependencies": {
    "@breezystack/lamejs": "^1.2.7",
    "@google/genai": "^2.4.0",
    "@tailwindcss/vite": "^4.1.14",
    "@tonejs/midi": "^2.0.28",
    "@vitejs/plugin-react": "^5.0.4",
    "canvas-confetti": "^1.9.4",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "jest": "^30.5.1",
    "jszip": "^3.10.1",
    "lamejs": "^1.2.1",
    "lucide-react": "^0.546.0",
    "mocha": "^12.0.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "spessasynth_core": "^4.3.20"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^22.14.0",
    "autoprefixer": "^10.4.21",
    "esbuild": "^0.25.0",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2",
    "vite": "^6.4.3"
  }
