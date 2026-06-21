import { useEffect, useRef } from "react";

function HandTracker() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Core game mechanics tracking states
  const trailRef = useRef([]);
  const fruitsRef = useRef([]);
  const slicesRef = useRef([]);
  const particlesRef = useRef([]);
  const scoreRef = useRef(0);
  const timeLeftRef = useRef(60);
  const gameOverRef = useRef(false);
  const sliceSoundRef = useRef(null);

  // Advanced feature animation buffers
  const splattersRef = useRef([]);
  const floatingTextsRef = useRef([]);
  const flashActiveRef = useRef(0);

  useEffect(() => {
    // Audio asset initialization
    sliceSoundRef.current = new Audio("/Slash.mp3");

    const fruitTypes = ["apple", "banana", "grapes", "cherry", "pineapple", "orange", "watermelon"];
    const rand = (a, b) => a + Math.random() * (b - a);

    // ==========================================
    // VECTOR GRAPHICS REFERENCE ENGINE
    // ==========================================
    const drawWholeFruit = (ctx, r, type) => {
      ctx.save();
      if (type === 'bomb') {
        const bg = ctx.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.1, 0, 0, r);
        bg.addColorStop(0, '#6b7280'); bg.addColorStop(0.5, '#374151'); bg.addColorStop(1, '#111827');
        ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();

        ctx.fillStyle = '#9ca3af';
        for (let i = 0; i < 6; i++) {
          const ang = i * (Math.PI / 3);
          ctx.beginPath(); ctx.arc(Math.cos(ang) * r * 0.6, Math.sin(ang) * r * 0.6, 2.5, 0, Math.PI * 2); ctx.fill();
        }

        ctx.strokeStyle = '#d97706'; ctx.lineWidth = 3; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(0, -r + 2); ctx.quadraticCurveTo(r * 0.4, -r * 1.3, r * 0.2, -r * 1.6); ctx.stroke();

        ctx.fillStyle = Math.random() > 0.5 ? '#fbbf24' : '#ef4444';
        ctx.beginPath(); ctx.arc(r * 0.2, -r * 1.6, 5 + Math.random() * 5, 0, Math.PI * 2); ctx.fill();
      }
      else if (type === 'apple') {
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.45);
        ctx.bezierCurveTo(r * 0.5, -r * 0.95, r * 1.1, -r * 0.5, r * 1.0, r * 0.1);
        ctx.bezierCurveTo(r * 0.9, r * 0.7, r * 0.55, r * 0.85, r * 0.25, r * 0.85);
        ctx.quadraticCurveTo(0, r * 0.9, -r * 0.25, r * 0.85);
        ctx.bezierCurveTo(-r * 0.55, r * 0.85, -r * 0.9, r * 0.7, -r * 1.0, r * 0.1);
        ctx.bezierCurveTo(-r * 1.1, -r * 0.5, -r * 0.6, -r * 0.95, 0, -r * 0.45);
        ctx.closePath();

        const g = ctx.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.1, 0, 0, r);
        g.addColorStop(0, '#ff6b6b'); 
        g.addColorStop(0.4, '#dc2626'); 
        g.addColorStop(1, '#7f1d1d');
        ctx.fillStyle = g; ctx.fill();

        ctx.strokeStyle = '#451a03'; ctx.lineWidth = r * 0.06; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(0, -r * 0.4); ctx.quadraticCurveTo(-r * 0.1, -r * 0.75, -r * 0.2, -r * 0.9); ctx.stroke();

        ctx.save(); ctx.translate(-r * 0.1, -r * 0.65); ctx.rotate(-0.4);
        ctx.fillStyle = '#16a34a'; ctx.beginPath(); ctx.ellipse(0, 0, r * 0.3, r * 0.12, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.beginPath(); ctx.ellipse(-r * 0.4, -r * 0.3, r * 0.22, r * 0.12, -0.6, 0, Math.PI * 2); ctx.fill();
      } 
      else if (type === 'banana') {
        ctx.rotate(Math.PI / 2);
        ctx.beginPath(); 
        ctx.moveTo(-r * 1.1, -r * 0.15);
        ctx.quadraticCurveTo(0, -r * 0.85, r * 1.1, -r * 0.2);
        ctx.quadraticCurveTo(0, r * 0.35, -r * 1.1, -r * 0.15);
        ctx.closePath();
        
        const g = ctx.createLinearGradient(-r, r, r, -r);
        g.addColorStop(0, '#fef08a'); g.addColorStop(0.6, '#facc15'); g.addColorStop(1, '#f57f17');
        ctx.fillStyle = g; ctx.fill();

        ctx.strokeStyle = 'rgba(202, 138, 4, 0.4)'; ctx.lineWidth = 2; ctx.beginPath();
        ctx.moveTo(-r * 0.9, -r * 0.12); ctx.quadraticCurveTo(0, -r * 0.3, r * 0.95, -r * 0.18); ctx.stroke();

        ctx.fillStyle = '#451a03';
        ctx.beginPath(); ctx.ellipse(r * 1.1, -r * 0.2, r * 0.05, r * 0.04, 0.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.ellipse(-r * 1.1, -r * 0.15, r * 0.05, r * 0.04, -0.2, 0, Math.PI * 2); ctx.fill();
      } 
      else if (type === 'watermelon') {
        ctx.fillStyle = '#15803d'; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f0fdf4'; ctx.beginPath(); ctx.arc(0, 0, r * 0.88, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2); ctx.fill();
        
        ctx.fillStyle = '#171717';
        const angles = [0, 1.1, 2.3, 3.5, 4.8, 5.7];
        angles.forEach((ang, idx) => {
          const radiusDist = r * (0.35 + (idx % 2) * 0.12);
          const sx = Math.cos(ang) * radiusDist; const sy = Math.sin(ang) * radiusDist;
          ctx.beginPath(); ctx.ellipse(sx, sy, r * 0.05, r * 0.08, ang, 0, Math.PI * 2); ctx.fill();
        });
      }
      else if (type === 'orange') {
        const og = ctx.createRadialGradient(-r * 0.2, -r * 0.2, r * 0.05, 0, 0, r);
        og.addColorStop(0, '#ffedd5'); og.addColorStop(0.5, '#f97316'); og.addColorStop(1, '#c2410c');
        ctx.fillStyle = og; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)'; ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.3, r * 0.22, 0, Math.PI * 2); ctx.fill();

        ctx.save(); ctx.translate(r * 0.15, -r * 0.9); ctx.rotate(0.35);
        ctx.fillStyle = '#15803d'; ctx.beginPath(); ctx.ellipse(0, 0, r * 0.35, r * 0.14, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      } 
      else if (type === 'grapes') {
        const grapeMap = [
          {x:0, y:-r*0.4}, {x:-r*0.28, y:-r*0.25}, {x:r*0.28, y:-r*0.25},
          {x:-r*0.42, y:0.05}, {x:0, y:0.02}, {x:r*0.42, y:0.05},
          {x:-r*0.22, y:r*0.35}, {x:r*0.22, y:r*0.35}, {x:0, y:r*0.65}
        ];
        grapeMap.forEach(p => {
          const gg = ctx.createRadialGradient(p.x, p.y, 1, p.x, p.y, r * 0.34);
          gg.addColorStop(0, '#a855f7'); 
          gg.addColorStop(1, '#4c1d95');
          ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(p.x, p.y, r * 0.34, 0, Math.PI * 2); ctx.fill();
        });
        ctx.fillStyle = '#78350f'; ctx.fillRect(-2, -r * 0.95, 4, r * 0.6);
      } 
      else if (type === 'cherry') {
        const drawCherryNode = (cx, cy) => {
          ctx.beginPath(); ctx.arc(cx, cy, r * 0.46, 0, Math.PI * 2);
          const gx = ctx.createRadialGradient(cx - r*0.12, cy - r*0.15, 2, cx, cy, r * 0.46);
          gx.addColorStop(0, '#fca5a5'); gx.addColorStop(0.4, '#ef4444'); gx.addColorStop(1, '#7f1d1d');
          ctx.fillStyle = gx; ctx.fill();
          ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.beginPath(); ctx.arc(cx - r*0.14, cy - r*0.12, r * 0.12, 0, Math.PI * 2); ctx.fill();
        };
        drawCherryNode(-r * 0.32, r * 0.18); drawCherryNode(r * 0.32, r * 0.18);
        ctx.strokeStyle = '#78350f'; ctx.lineWidth = 2.5; ctx.beginPath();
        ctx.moveTo(-r * 0.32, -r * 0.18); ctx.quadraticCurveTo(-r * 0.1, -r * 0.55, 0, -r * 0.8);
        ctx.moveTo(r * 0.32, -r * 0.18); ctx.quadraticCurveTo(r * 0.1, -r * 0.55, 0, -r * 0.8); ctx.stroke();
      } 
      else if (type === 'pineapple') {
        ctx.beginPath(); ctx.ellipse(0, 0, r * 0.72, r * 1.02, 0, 0, Math.PI * 2);
        const bg = ctx.createLinearGradient(-r * 0.6, -r, r * 0.6, r);
        bg.addColorStop(0, '#fde047'); bg.addColorStop(0.5, '#eab308'); bg.addColorStop(1, '#9a3412');
        ctx.fillStyle = bg; ctx.fill();

        ctx.save(); ctx.clip();
        ctx.strokeStyle = '#78350f'; ctx.lineWidth = 1.2;
        for (let j = -5; j <= 5; j++) {
          for (let i = -4; i <= 4; i++) {
            const px = i * r * 0.32 + (Math.abs(j) % 2 === 0 ? 0 : r * 0.16); const py = j * r * 0.22;
            ctx.save(); ctx.translate(px, py); ctx.beginPath();
            ctx.moveTo(0, -r * 0.13); ctx.lineTo(r * 0.17, 0); ctx.lineTo(0, r * 0.13); ctx.lineTo(-r * 0.17, 0);
            ctx.closePath(); ctx.stroke();
            ctx.fillStyle = '#ea580c'; ctx.beginPath(); ctx.moveTo(0, -2); ctx.lineTo(2, 2); ctx.lineTo(-2, 2); ctx.closePath(); ctx.fill();
            ctx.restore();
          }
        }
        ctx.restore();

        ctx.fillStyle = '#16a34a';
        for (let layer = 2; layer >= 0; layer--) {
          const sY = 1.0 - layer * 0.15; const offY = -r * 0.92 - (layer * r * 0.12);
          for (let i = -3; i <= 3; i++) {
            ctx.beginPath(); ctx.ellipse(i * r * 0.12, offY, r * 0.09, r * 0.48 * sY, i * 0.16, 0, Math.PI * 2); ctx.fill();
          }
        }
      }
      ctx.restore();
    };

    const drawFruitHalf = (ctx, r, type, side) => {
      ctx.save();

      if (type.startsWith('chunk_')) {
        const parentFruit = type.split('_')[1];
        const chunkColors = { apple: '#ef4444', banana: '#facc15', grapes: '#a855f7', cherry: '#ef4444', pineapple: '#eab308', orange: '#f97316', watermelon: '#f87171' };
        ctx.fillStyle = chunkColors[parentFruit] || '#a855f7';
        ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.arc(0, 0, r * 0.6, -0.5, 0.5);
        ctx.closePath(); ctx.fill();
        ctx.restore();
        return;
      }

      if (type === 'single_grape') {
        const gg = ctx.createRadialGradient(0, 0, 1, 0, 0, r);
        gg.addColorStop(0, '#a855f7'); 
        gg.addColorStop(1, '#4c1d95');
        ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        return;
      }

      ctx.beginPath();
      if (side === 'left') ctx.rect(-r * 2, -r * 2, r * 2, r * 4);
      else ctx.rect(0, -r * 2, r * 2, r * 4);
      ctx.clip();

      drawWholeFruit(ctx, r, type);

      ctx.beginPath();
      if (type === 'watermelon') {
        ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#f87171'; ctx.beginPath(); ctx.arc(0, 0, r * 0.74, 0, Math.PI * 2); ctx.fill();
      } 
      else if (type === 'apple') {
        ctx.fillStyle = '#fef9c3'; ctx.beginPath(); ctx.arc(0, 0, r * 0.84, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#78350f'; ctx.beginPath(); ctx.ellipse(side === 'left' ? -5 : 5, 2, 2, 4, 0.2, 0, Math.PI * 2); ctx.fill();
      } 
      else if (type === 'orange') {
        ctx.fillStyle = '#ffedd5'; ctx.beginPath(); ctx.arc(0, 0, r * 0.88, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#fb923c'; ctx.beginPath(); ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#ffedd5'; ctx.lineWidth = 1.5;
        for (let i = 0; i < 8; i++) {
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(i * 0.785) * r * 0.82, Math.sin(i * 0.785) * r * 0.82); ctx.stroke();
        }
      }
      else if (type === 'pineapple') {
        ctx.fillStyle = '#fef08a'; ctx.beginPath(); ctx.ellipse(0, 0, r * 0.65, r * 0.92, 0, 0, Math.PI * 2); ctx.fill();
      }
      else if (type === 'banana') {
        ctx.fillStyle = '#fffdfa'; ctx.beginPath(); ctx.ellipse(0, 0, r * 0.75, r * 0.2, 0, 0, Math.PI * 2); ctx.fill();
      }

      const matchingGlows = { apple: 'rgba(239,68,68,0.4)', banana: 'rgba(254,240,138,0.4)', orange: 'rgba(249,115,22,0.4)', pineapple: 'rgba(234,179,8,0.4)', watermelon: 'rgba(248,113,113,0.4)' };
      ctx.strokeStyle = matchingGlows[type] || 'rgba(168,85,247,0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, 0, r * 0.82, 0, Math.PI * 2); ctx.stroke();
      ctx.restore();
    };

    const spawnParticles = (x, y, color, count = 12) => {
      for (let i = 0; i < count; i++) {
        particlesRef.current.push({
          x, y, vx: rand(-5, 5), vy: rand(-7, -2),
          life: rand(20, 45), size: rand(2.5, 5.5), color
        });
      }
    };

    const loadScript = (src) => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src; script.onload = resolve;
        document.body.appendChild(script);
      });
    };

    const setupHandTracking = async () => {
      await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js");
      await loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js");

      const hands = new window.Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
      });

      hands.setOptions({
        maxNumHands: 1, modelComplexity: 1,
        minDetectionConfidence: 0.7, minTrackingConfidence: 0.7,
      });

      const spawnInterval = setInterval(() => {
        if (gameOverRef.current) return;

        const isBomb = Math.random() < 0.05;
        const chosenType = isBomb ? 'bomb' : fruitTypes[Math.floor(Math.random() * fruitTypes.length)];
        
        const baseRMap = { apple: 36, banana: 40, grapes: 36, cherry: 24, pineapple: 45, orange: 34, watermelon: 42, bomb: 32 };
        const baseR = baseRMap[chosenType] || 32;

        const pushFruit = (ox = 0, vxOffset = 0, oy = 0) => {
          fruitsRef.current.push({
            x: Math.min(580, Math.max(60, Math.random() * 520 + 60 + ox)),
            y: 510 + oy,
            radius: baseR * rand(0.95, 1.1),
            type: chosenType,
            sliced: false,
            velocityY: -rand(14, 17.5),
            velocityX: rand(-2, 2) + vxOffset,
            gravity: 0.34,
          });
        };

        if (chosenType === 'banana') {
          for (let i = 0; i < 2; i++) pushFruit(i * 18, (i === 0 ? -0.4 : 0.4), i * -15);
        } else {
          pushFruit();
        }
      }, 1100);

      hands.onResults((results) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (results.image) ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        // Render juice splatters background
        splattersRef.current.forEach((s) => {
          s.y += 0.25; 
          ctx.save();
          ctx.globalAlpha = s.alpha;
          ctx.fillStyle = s.color;
          ctx.beginPath(); ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
          s.alpha -= 0.012;
        });
        splattersRef.current = splattersRef.current.filter(s => s.alpha > 0);

        let sliceAngle = 0;
        
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0 && !gameOverRef.current) {
          results.multiHandLandmarks.forEach((landmarks) => {
            const indexFinger = landmarks[8];
            const x = indexFinger.x * canvas.width;
            const y = indexFinger.y * canvas.height;

            trailRef.current.push({ x, y });
            if (trailRef.current.length > 8) trailRef.current.shift();

            if (trailRef.current.length > 2) {
              const p1 = trailRef.current[trailRef.current.length - 3];
              sliceAngle = Math.atan2(y - p1.y, x - p1.x);
            }

            ctx.save(); ctx.translate(x, y);
            ctx.fillStyle = '#cfd8dc'; ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(46, 0); ctx.lineTo(0, 8); ctx.closePath(); ctx.fill();
            ctx.fillStyle = '#5d4037'; ctx.fillRect(-15, -8, 15, 16);
            ctx.restore();
          });
        } else {
          trailRef.current = []; 
        }

        if (trailRef.current.length > 1) {
          ctx.beginPath(); ctx.moveTo(trailRef.current[0].x, trailRef.current[0].y);
          for (let i = 1; i < trailRef.current.length; i++) ctx.lineTo(trailRef.current[i].x, trailRef.current[i].y);
          ctx.strokeStyle = "rgba(0, 229, 255, 0.95)"; ctx.lineWidth = 5;
          ctx.shadowBlur = 10; ctx.shadowColor = "#00e5ff";
          ctx.stroke(); ctx.shadowBlur = 0;
        }

        ctx.font = "bold 30px Arial"; ctx.fillStyle = "white";
        ctx.fillText(`Score: ${scoreRef.current}`, 25, 45);
        ctx.fillText(`Time: ${timeLeftRef.current}`, 490, 45);

        if (gameOverRef.current) {
          ctx.fillStyle = "rgba(0,0,0,0.7)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.font = "bold 50px Arial"; ctx.fillStyle = "#ffd54f"; ctx.fillText("GAME OVER", 185, 220);
          ctx.font = "28px Arial"; ctx.fillStyle = "white"; ctx.fillText(`Final Score: ${scoreRef.current}`, 240, 275);
          return;
        }

        let frameCutsCount = 0;
        let lastCutX = 320, lastCutY = 240;

        fruitsRef.current.forEach((fruit) => {
          fruit.velocityY += fruit.gravity;
          fruit.x += fruit.velocityX; fruit.y += fruit.velocityY;

          trailRef.current.forEach((point) => {
            const dx = point.x - fruit.x; const dy = point.y - fruit.y;
            if (Math.sqrt(dx * dx + dy * dy) < fruit.radius && !fruit.sliced) {
              fruit.sliced = true;
              lastCutX = fruit.x; lastCutY = fruit.y;

              if (fruit.type === 'bomb') {
                scoreRef.current = Math.max(0, scoreRef.current - 5);
                timeLeftRef.current = Math.max(0, timeLeftRef.current - 10);
                flashActiveRef.current = 15; 
                spawnParticles(fruit.x, fruit.y, '#374151', 22); 

                // Bomb text penalty addition
                floatingTextsRef.current.push({
                  x: fruit.x - 40,
                  y: fruit.y - 15,
                  text: "BOMB! -5 pts",
                  color: "#ef4444",
                  scale: 1.1,
                  alpha: 1.0
                });
              } else {
                scoreRef.current += 1;
                frameCutsCount++;

                const outwardX = Math.cos(sliceAngle + Math.PI / 2) * 2.5;
                const outwardY = Math.sin(sliceAngle + Math.PI / 2) * 2.5;

                const juiceColors = { apple: 'rgba(220,38,38,0.5)', banana: 'rgba(234,179,8,0.4)', grapes: 'rgba(147,51,234,0.5)', cherry: 'rgba(220,38,38,0.5)', pineapple: 'rgba(234,179,8,0.4)', orange: 'rgba(249,115,22,0.4)', watermelon: 'rgba(239,68,68,0.5)' };
                for (let k = 0; k < 4; k++) {
                  splattersRef.current.push({
                    x: fruit.x + rand(-20, 20), y: fruit.y + rand(-20, 20),
                    radius: rand(8, fruit.radius * 0.5), color: juiceColors[fruit.type], alpha: rand(0.6, 0.8)
                  });
                }

                if (fruit.type === 'grapes') {
                  for (let i = 0; i < 6; i++) {
                    slicesRef.current.push({
                      x: fruit.x + rand(-12, 12), y: fruit.y + rand(-12, 12),
                      radius: fruit.radius * 0.3, type: 'single_grape', side: 'left',
                      velocityX: fruit.velocityX + rand(-4, 4), velocityY: fruit.velocityY + rand(-5, 1),
                      gravity: 0.35, rot: rand(0, Math.PI * 2), vRot: rand(-0.1, 0.1)
                    });
                  }
                } else {
                  slicesRef.current.push({
                    x: fruit.x, y: fruit.y, radius: fruit.radius, type: fruit.type, side: 'left',
                    velocityX: fruit.velocityX - outwardX, velocityY: fruit.velocityY - outwardY,
                    gravity: 0.35, rot: sliceAngle, vRot: -0.06
                  });

                  slicesRef.current.push({
                    x: fruit.x, y: fruit.y, radius: fruit.radius, type: fruit.type, side: 'right',
                    velocityX: fruit.velocityX + outwardX, velocityY: fruit.velocityY + outwardY,
                    gravity: 0.35, rot: sliceAngle, vRot: 0.06
                  });
                }
              }

              const colors = { apple: '#ef4444', banana: '#facc15', grapes: '#a855f7', cherry: '#ef4444', pineapple: '#eab308', orange: '#f97316', watermelon: '#ef4444', bomb: '#374151' };
              spawnParticles(fruit.x, fruit.y, colors[fruit.type] || '#fff', 14);

              if (sliceSoundRef.current) {
                sliceSoundRef.current.currentTime = 0; sliceSoundRef.current.play().catch(() => {});
              }
            }
          });

          ctx.save(); ctx.translate(fruit.x, fruit.y);
          drawWholeFruit(ctx, fruit.radius, fruit.type);
          ctx.restore();
        });

        if (frameCutsCount > 1) {
          floatingTextsRef.current.push({
            x: lastCutX, y: lastCutY - 15, text: `+${frameCutsCount} COMBO!`, color: '#fbbf24', scale: 1.2, alpha: 1.0
          });
        }

        slicesRef.current.forEach((slice) => {
          slice.velocityY += slice.gravity;
          slice.x += slice.velocityX; slice.y += slice.velocityY;
          slice.rot += slice.vRot;

          if (!slice.type.startsWith('chunk_') && slice.type !== 'single_grape' && !slice.secondarySliced) {
            trailRef.current.forEach((point) => {
              const dx = point.x - slice.x; const dy = point.y - slice.y;
              if (Math.sqrt(dx * dx + dy * dy) < slice.radius * 0.75) {
                slice.secondarySliced = true;
                scoreRef.current += 1;

                const outX = Math.cos(sliceAngle + Math.PI / 2) * 3;
                const outY = Math.sin(sliceAngle + Math.PI / 2) * 3;

                floatingTextsRef.current.push({
                  x: slice.x, y: slice.y - 10, text: 'DOUBLE CUT!', color: '#00e5ff', scale: 0.9, alpha: 1.0
                });

                slicesRef.current.push({
                  x: slice.x, y: slice.y, radius: slice.radius * 0.9, type: 'chunk_' + slice.type, side: 'left',
                  velocityX: slice.velocityX - outX, velocityY: slice.velocityY - outY,
                  gravity: 0.38, rot: sliceAngle, vRot: rand(-0.15, 0.15)
                });
                slicesRef.current.push({
                  x: slice.x, y: slice.y, radius: slice.radius * 0.9, type: 'chunk_' + slice.type, side: 'right',
                  velocityX: slice.velocityX + outX, velocityY: slice.velocityY + outY,
                  gravity: 0.38, rot: sliceAngle, vRot: rand(-0.15, 0.15)
                });

                const baseKey = slice.type.includes('_') ? slice.type.split('_')[1] : slice.type;
                const chunkColors = { apple: '#dc2626', banana: '#eab308', grapes: '#6b21a8', cherry: '#ef4444', pineapple: '#ca8a04', orange: '#c2410c', watermelon: '#ef4444' };
                spawnParticles(slice.x, slice.y, chunkColors[baseKey] || '#fff', 6);

                if (sliceSoundRef.current) {
                  sliceSoundRef.current.currentTime = 0; sliceSoundRef.current.play().catch(() => {});
                }
              }
            });
          }

          ctx.save();
          ctx.translate(slice.x, slice.y);
          ctx.rotate(slice.rot);
          drawFruitHalf(ctx, slice.radius, slice.type, slice.side);
          ctx.restore();
        });

        floatingTextsRef.current.forEach((t) => {
          t.y -= 1.4; 
          ctx.save();
          ctx.globalAlpha = t.alpha;
          ctx.font = `bold ${Math.floor(22 * t.scale)}px Arial`;
          ctx.fillStyle = t.text.includes('COMBO') ? '#fbbf24' : t.color;
          ctx.shadowBlur = 6; ctx.shadowColor = ctx.fillStyle;
          ctx.fillText(t.text, t.x, t.y);
          ctx.restore();
          t.alpha -= 0.03; 
        });
        floatingTextsRef.current = floatingTextsRef.current.filter(t => t.alpha > 0);

        particlesRef.current.forEach((p) => {
          p.vy += 0.16; p.x += p.vx; p.y += p.vy; p.life--;
          ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0.2, p.size * (p.life / 45)), 0, Math.PI * 2);
          ctx.fillStyle = p.color; ctx.fill();
        });

        if (flashActiveRef.current > 0) {
          ctx.save();
          ctx.fillStyle = `rgba(239, 68, 68, ${(flashActiveRef.current / 15) * 0.45})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.restore();
          flashActiveRef.current--;
        }

        particlesRef.current = particlesRef.current.filter(p => p.life > 0);
        fruitsRef.current = fruitsRef.current.filter(f => f.y < canvas.height + 50 && !f.sliced);
        slicesRef.current = slicesRef.current.filter(s => s.y < canvas.height + 50 && !s.secondarySliced);
      });

      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => { 
          if (videoRef.current) {
            try {
              await hands.send({ image: videoRef.current }); 
            } catch (err) {
              // Gracefully bypass rendering frames until WebAsm finishes asset downloading pipelines
            }
          }
        },
        width: 640, height: 480,
      });
      camera.start();
      return () => clearInterval(spawnInterval);
    };

    let cleanupTrack;
    setupHandTracking().then(res => { cleanupTrack = res; });

    const gameTimer = setInterval(() => {
      if (timeLeftRef.current > 0) timeLeftRef.current -= 1;
      else gameOverRef.current = true;
    }, 1000);

    return () => {
      clearInterval(gameTimer);
      if (cleanupTrack) cleanupTrack();
    };
  }, []);

  const restartGame = () => {
    scoreRef.current = 0; timeLeftRef.current = 60; gameOverRef.current = false;
    fruitsRef.current = []; slicesRef.current = []; trailRef.current = []; particlesRef.current = [];
    splattersRef.current = []; floatingTextsRef.current = []; flashActiveRef.current = 0;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "20px", fontFamily: "Arial" }}>
      <video ref={videoRef} style={{ display: "none" }} playInline muted />
      <canvas ref={canvasRef} width={640} height={480} style={{ border: "4px solid #333", borderRadius: "12px", boxShadow: "0 6px 20px rgba(0,0,0,0.4)" }} />
      <button onClick={restartGame} style={{ marginTop: "20px", padding: "12px 32px", fontSize: "18px", fontWeight: "bold", background: "#2e7d32", color: "white", border: "none", borderRadius: "25px", cursor: "pointer", boxShadow: "0 4px 8px rgba(0,0,0,0.3)" }}>
        Restart Match
      </button>
    </div>
  );
}

export default HandTracker;