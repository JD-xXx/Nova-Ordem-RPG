/* NOVA ORDEM — A.R.K. em cena, com navegação inferior */
(function () {
  'use strict';
  if (window.NovaOrdemARKScenes) return;

  var css = [
    '.ark-scene{display:flex;align-items:center;gap:15px;position:relative;margin:22px 0;padding:14px 17px;border:1px solid rgba(91,177,232,.34);border-radius:12px;background:linear-gradient(112deg,rgba(17,42,63,.9),rgba(7,17,28,.96));box-shadow:0 8px 26px rgba(0,0,0,.18);overflow:hidden;isolation:isolate}',
    '.ark-scene:before{content:"";position:absolute;inset:0 auto 0 0;width:3px;background:linear-gradient(#b8eaff,#318fd0)}',
    '.ark-scene-robot{width:112px;height:122px;flex:0 0 112px;display:grid;place-items:center;filter:drop-shadow(0 8px 13px rgba(65,174,235,.22));animation:ark-hover 3.6s ease-in-out infinite}',
    '.ark-scene-robot svg{width:100%;height:100%;overflow:visible}',
    '.ark-scene-robot .ark-eye{transform-box:fill-box;transform-origin:center;animation:ark-eye-blink 5.8s ease-in-out infinite}.ark-scene-robot .ark-eye--right{animation-delay:.08s}@keyframes ark-eye-blink{0%,91%,94%,100%{transform:scaleY(1)}92%,93%{transform:scaleY(.12)}}',
    '.ark-scene-bubble{position:relative;flex:1;min-width:0;padding:12px 15px;border:1px solid rgba(92,172,224,.3);border-radius:14px 14px 14px 5px;background:rgba(8,20,32,.88);color:#c8dced;font-size:13px;line-height:1.65;box-shadow:0 5px 15px rgba(0,0,0,.14)}',
    '.ark-scene-bubble:after{content:"";position:absolute;left:-8px;bottom:14px;width:13px;height:13px;background:rgba(8,20,32,.94);border-left:1px solid rgba(92,172,224,.3);border-bottom:1px solid rgba(92,172,224,.3);transform:rotate(45deg);pointer-events:none}',
    '.ark-scene--peek .ark-scene-bubble:after{left:auto;right:-8px;background:rgba(12,10,16,.9);border-color:rgba(151,99,116,.36);transform:rotate(-45deg)}',
    '.ark-scene-bubble:before{content:"A.R.K.  /  GUIA DA AGÊNCIA";display:block;margin-bottom:5px;color:#8dd4ff;font:700 9px var(--mono,monospace);letter-spacing:1.1px}',
    '.ark-scene-bubble p{margin:0;color:inherit;font-size:inherit;line-height:inherit}',
    '.ark-scene--compact{padding:10px 13px;gap:10px;margin:15px 0}.ark-scene--compact .ark-scene-robot{width:82px;height:92px;flex-basis:82px}.ark-scene--compact .ark-scene-bubble{font-size:12px;padding:10px 12px}',
    '.ark-scene--peek{margin:12px 0 22px auto;max-width:620px;transform:translateX(10px);border-color:rgba(125,93,111,.42);background:linear-gradient(110deg,rgba(35,22,31,.94),rgba(10,12,19,.97))}.ark-scene--peek .ark-scene-robot{width:94px;height:104px;flex-basis:94px;transform:translateX(8px)}.ark-scene--peek .ark-scene-bubble{border-color:rgba(151,99,116,.36);background:rgba(12,10,16,.86);color:#d4c5ce}.ark-scene--peek .ark-scene-bubble:before{color:#d59cac}',
    '.ark-scene-trio{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:17px 0}',
    '.ark-table-explainer{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(230px,.85fr);gap:12px;align-items:center;margin:14px 0}.ark-table-explainer>.ark-scene{margin:0;height:100%;align-self:stretch}.ark-table-explainer>.tablebox{min-width:0}',
    '.ark-feature-has-guide{display:grid;grid-template-columns:30px minmax(0,1fr);align-items:start}.ark-feature-has-guide>.glyph{grid-column:1;grid-row:1}.ark-feature-has-guide>div:not(.glyph){grid-column:2;grid-row:1}.ark-feature-has-guide>.ark-feature-guide{grid-column:1/-1;grid-row:auto;width:100%;min-width:0;margin:12px 0 16px;padding:0 8px;position:relative;z-index:1}.ark-feature-guide .ark-scene{margin:0;padding:8px 10px;border:0;background:transparent;box-shadow:none;overflow:visible;flex-direction:row-reverse;align-items:center;gap:15px}.ark-feature-guide .ark-scene:before{display:none}.ark-feature-guide .ark-scene-robot{position:relative;width:76px;height:92px;flex:0 0 76px}.ark-feature-guide .ark-scene-bubble{background:#eaf7ff;border:2px solid #56b9ed;border-radius:18px 18px 18px 5px;color:#102c40;box-shadow:3px 4px 0 rgba(38,130,180,.2);font-size:11px;line-height:1.5;padding:10px 12px}.ark-feature-guide .ark-scene-bubble:before{content:"A.R.K.  /  GUIA DA AGÊNCIA";color:#1679ae;font-size:8px}.ark-feature-guide .ark-scene-bubble:after{content:"";position:absolute;right:-9px;bottom:13px;width:14px;height:14px;background:#eaf7ff;border-right:2px solid #56b9ed;border-bottom:2px solid #56b9ed;transform:rotate(-45deg)}.ark-feature-guide--peek .ark-scene{gap:5px}.ark-feature-guide--peek .ark-scene-robot{width:82px;height:74px;flex-basis:82px;overflow:hidden;align-self:flex-end}.ark-feature-guide--peek .ark-scene-robot svg{width:82px;height:150px;max-width:none}.ark-feature-guide--peek .ark-scene-bubble{border-radius:18px 18px 18px 5px}.ark-feature-guide--peek .ark-scene-bubble:after{right:-9px;left:auto;bottom:18px;transform:rotate(-45deg)}',
    '.ark-scene--comic{padding:15px 17px;border:1px solid rgba(95,190,238,.5);background:linear-gradient(120deg,rgba(9,33,51,.95),rgba(5,17,28,.97));border-radius:17px 17px 17px 5px}.ark-scene--comic .ark-scene-bubble{background:#eaf7ff;border:2px solid #56b9ed;border-radius:18px 18px 18px 5px;color:#102c40;box-shadow:3px 4px 0 rgba(38,130,180,.2);font-size:13px}.ark-scene--comic .ark-scene-bubble:before{color:#1679ae}.ark-scene--comic .ark-scene-bubble:after{content:"";position:absolute;left:-10px;bottom:18px;width:15px;height:15px;background:#eaf7ff;border-left:2px solid #56b9ed;border-bottom:2px solid #56b9ed;transform:rotate(45deg)}',
    '.ark-chi-projection{position:relative;overflow:hidden}.ark-holo-screen:before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(to bottom,rgba(130,224,255,.09) 0 1px,transparent 1px 5px);opacity:.55;pointer-events:none;animation:ark-holo-scanlines 5s linear infinite}.ark-holo-screen:after{content:"";position:absolute;inset:12% 4%;border:1px solid rgba(112,218,255,.15);border-radius:50%;box-shadow:0 0 26px rgba(66,187,255,.12);pointer-events:none;animation:ark-holo-ring 3.8s ease-in-out infinite}.ark-holo-scan{position:absolute;left:0;right:0;top:-20%;height:18%;background:linear-gradient(transparent,rgba(137,230,255,.22),transparent);filter:blur(4px);animation:ark-holo-sweep 4.2s linear infinite;pointer-events:none}.ark-holo-particles{position:absolute;inset:0;background-image:radial-gradient(circle,rgba(165,239,255,.9) 0 1px,transparent 2px),radial-gradient(circle,rgba(69,183,255,.75) 0 1px,transparent 2px);background-size:37px 43px,53px 61px;background-position:8px 9px,24px 31px;opacity:.4;animation:ark-holo-particles 8s linear infinite;pointer-events:none}.ark-holo-step{position:relative;z-index:1;animation:ark-holo-object 3.2s ease-in-out infinite}.ark-holo-step--chi{animation-delay:.35s}.ark-holo-step--talent{animation-delay:.7s}.ark-chi-holo-ark{width:74px;height:79px;display:grid;place-items:center;filter:drop-shadow(0 0 10px rgba(89,208,255,.9));opacity:.86;animation:ark-holo-flicker 2.8s steps(2,end) infinite}.ark-chi-holo-ark svg{width:100%;height:100%;overflow:visible;filter:sepia(.08) saturate(1.5) hue-rotate(155deg)}.ark-chi-projection figure{min-width:66px}.ark-chi-projection figcaption{font-size:8px;max-width:100px}.ark-chi-robot{z-index:3}.ark-chi-robot:before{height:78px;top:-78px;width:3px;background:linear-gradient(to top,rgba(112,224,255,.9),rgba(76,185,255,.55),transparent);box-shadow:0 0 10px rgba(87,204,255,.5)}.ark-chi-robot:after{top:-83px;width:13px;height:13px;box-shadow:0 0 18px #59caff,0 0 32px rgba(89,202,255,.7)}@keyframes ark-holo-scanlines{0%,100%{opacity:.28}50%{opacity:.72}}@keyframes ark-holo-ring{0%,100%{transform:scale(.96);opacity:.28}50%{transform:scale(1.04);opacity:.7}}@keyframes ark-holo-sweep{0%{top:-20%;opacity:0}15%{opacity:.8}85%{opacity:.7}100%{top:110%;opacity:0}}@keyframes ark-holo-particles{from{background-position:8px 9px,24px 31px}to{background-position:8px -90px,24px -130px}}@keyframes ark-holo-object{0%,100%{transform:translateY(1px);filter:drop-shadow(0 0 6px rgba(90,201,255,.32))}50%{transform:translateY(-5px);filter:drop-shadow(0 0 14px rgba(90,220,255,.82))}}@keyframes ark-holo-flicker{0%,100%{opacity:.72}48%{opacity:.92}50%{opacity:.58}52%{opacity:.9}}',
    '.ark-chi-stage{position:relative;display:flex;flex-direction:column;align-items:center;gap:12px;margin:24px auto 30px;padding:22px 16px 18px;max-width:920px;min-height:430px;border:1px solid rgba(91,190,239,.35);border-radius:22px;background:radial-gradient(ellipse at 50% 38%,rgba(20,112,164,.2),transparent 55%),linear-gradient(150deg,rgba(9,31,48,.96),rgba(4,14,24,.98));overflow:hidden;isolation:isolate}.ark-chi-stage:before{content:"";position:absolute;inset:0;background:linear-gradient(rgba(104,196,239,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(104,196,239,.035) 1px,transparent 1px);background-size:26px 26px;mask-image:linear-gradient(to bottom,black,transparent 85%);pointer-events:none}.ark-chi-stage-title{position:relative;z-index:1;color:#a9e5ff;font:700 10px var(--mono,monospace);letter-spacing:2px;text-align:center}.ark-chi-orbit{position:relative;z-index:1;width:100%;display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,1.35fr) minmax(0,1fr);gap:13px;align-items:center}.ark-chi-note{padding:12px 13px;border:1px solid rgba(91,190,239,.3);border-radius:13px;background:rgba(7,25,39,.83);color:#c5e2f2;font-size:12px;line-height:1.6;box-shadow:0 8px 22px rgba(0,0,0,.16)}.ark-chi-note b{display:block;margin-bottom:5px;color:#8bdcff;font:700 10px var(--mono,monospace);letter-spacing:.8px}.ark-chi-projection{display:flex;align-items:center;justify-content:center;gap:12px;min-height:150px;padding:14px 8px;border:1px solid rgba(98,205,255,.25);border-radius:17px;background:radial-gradient(ellipse,rgba(41,159,220,.16),rgba(5,23,37,.22) 68%);box-shadow:inset 0 0 28px rgba(60,180,238,.08),0 0 24px rgba(35,154,216,.08)}.ark-chi-projection figure{display:flex;flex-direction:column;align-items:center;gap:7px;margin:0;min-width:0}.ark-chi-projection svg{width:75px;height:75px;filter:drop-shadow(0 0 9px rgba(81,190,255,.4));animation:ark-holo-float 3.4s ease-in-out infinite}.ark-chi-projection figcaption{color:#a6e3ff;font:700 9px var(--mono,monospace);letter-spacing:.7px;text-align:center}.ark-chi-projection .ark-chi-arrow{font-size:26px;color:#8de0ff;text-shadow:0 0 12px #32b8ff;animation:ark-arrow-pulse 1.8s ease-in-out infinite}.ark-chi-robot{position:relative;z-index:2;width:142px;height:150px;display:grid;place-items:center;margin:-2px auto -3px;filter:drop-shadow(0 0 18px rgba(68,183,239,.28));animation:ark-hover 3.8s ease-in-out infinite}.ark-chi-robot:before{content:"";position:absolute;left:50%;top:-62px;width:2px;height:62px;transform:translateX(-50%);background:linear-gradient(to top,rgba(104,217,255,.65),transparent)}.ark-chi-robot:after{content:"";position:absolute;left:50%;top:-67px;width:9px;height:9px;border:1px solid #8de5ff;border-radius:50%;background:#bdf5ff;box-shadow:0 0 14px #59caff;transform:translateX(-50%);animation:ark-beam-pulse 1.7s ease-in-out infinite}.ark-chi-robot svg{width:100%;height:100%;overflow:visible}.ark-chi-caption{position:relative;z-index:1;max-width:680px;text-align:center;color:#a9c8dc;font-size:12px;line-height:1.65}.ark-chi-caption strong{color:#8bdcff}@keyframes ark-holo-float{0%,100%{transform:translateY(0);opacity:.88}50%{transform:translateY(-6px);opacity:1}}@keyframes ark-arrow-pulse{0%,100%{opacity:.55;transform:scale(.92)}50%{opacity:1;transform:scale(1.12)}}@keyframes ark-beam-pulse{0%,100%{opacity:.5;box-shadow:0 0 7px #59caff}50%{opacity:1;box-shadow:0 0 18px #59caff}}',
    '.ark-chi-diagram{display:flex;align-items:center;justify-content:center;gap:13px;margin-top:13px;padding:12px 10px;border:1px solid rgba(53,142,194,.25);border-radius:12px;background:rgba(10,42,64,.07)}.ark-chi-diagram figure{display:flex;flex-direction:column;align-items:center;gap:5px;margin:0;min-width:0}.ark-chi-diagram svg{width:72px;height:72px;display:block}.ark-chi-diagram figcaption{font:700 9px var(--mono,monospace);letter-spacing:.8px;color:#1679ae;text-align:center}.ark-chi-arrow{font-size:25px;color:#168ac7;font-weight:700}.ark-scene--chi{align-items:flex-start}.ark-scene--chi .ark-scene-robot{align-self:flex-end;width:104px;height:120px;flex-basis:104px}.ark-scene--chi .ark-scene-bubble{padding:15px 17px;font-size:13px}.ark-bamboo-sword{position:absolute;right:-2px;top:-10px;width:12px;height:110px;transform:rotate(38deg);transform-origin:50% 90%;z-index:2}.ark-bamboo-sword .blade{position:absolute;left:4px;top:0;width:5px;height:79px;border-radius:4px 4px 1px 1px;background:repeating-linear-gradient(to bottom,#c6b17a 0 11px,#a58d59 12px 14px);border:1px solid #8c754b;box-shadow:0 0 5px #e7d7a766}.ark-bamboo-sword .guard{position:absolute;left:-3px;top:78px;width:18px;height:4px;border-radius:4px;background:#d9c38d;border:1px solid #8c754b}.ark-bamboo-sword .handle{position:absolute;left:4px;top:82px;width:5px;height:24px;border-radius:3px;background:repeating-linear-gradient(135deg,#73553a 0 3px,#d2bd91 3px 5px)}.ark-scene--fencer .ark-scene-robot{position:relative;overflow:visible}.ark-scene--fencer .ark-scene-bubble{background:#eaf7ff;border:2px solid #56b9ed;border-radius:18px 18px 18px 5px;color:#102c40;box-shadow:3px 4px 0 rgba(38,130,180,.2);font-size:13px}.ark-scene--fencer .ark-scene-bubble:before{color:#1679ae}.ark-scene--fencer .ark-scene-bubble:after{content:"";position:absolute;left:-10px;bottom:18px;width:15px;height:15px;background:#eaf7ff;border-left:2px solid #56b9ed;border-bottom:2px solid #56b9ed;transform:rotate(45deg)}.ark-scene--peek-comic .ark-scene{flex-direction:row-reverse;align-items:flex-end}.ark-scene--peek-comic .ark-scene-robot{width:86px;height:78px;flex:0 0 86px;overflow:hidden;align-self:flex-end}.ark-scene--peek-comic .ark-scene-robot svg{width:86px;height:150px;max-width:none}.ark-scene--peek-comic .ark-scene-bubble{background:#eaf7ff;border:2px solid #56b9ed;border-radius:18px 18px 5px 18px;color:#102c40;box-shadow:3px 4px 0 rgba(38,130,180,.2)}.ark-scene--peek-comic .ark-scene-bubble:before{color:#1679ae}.ark-scene--peek-comic .ark-scene-bubble:after{content:"";position:absolute;right:-9px;bottom:12px;width:14px;height:14px;background:#eaf7ff;border-right:2px solid #56b9ed;border-bottom:2px solid #56b9ed;transform:rotate(-45deg)}',
    '.ark-scene-trio .ark-scene{display:block;margin:0;padding:11px;text-align:center}.ark-scene-trio .ark-scene-robot{width:84px;height:92px;margin:0 auto 4px}.ark-scene-trio .ark-scene-bubble{text-align:left;font-size:11px;padding:9px}.ark-scene-trio .ark-scene-bubble:before{font-size:8px}.ark-scene-trio .ark-scene-bubble p{font-size:11px;line-height:1.55}',
    '#backFloat{position:fixed;right:20px;bottom:20px;z-index:8;display:none;align-items:center;justify-content:center;gap:8px;width:auto;height:auto;min-height:44px;padding:10px 16px;border:1px solid #62bce9;border-radius:8px;background:linear-gradient(120deg,#123653,#091725);color:#e8f6ff;font:600 10px var(--mono,monospace);letter-spacing:.8px;box-shadow:0 8px 24px #0009;cursor:pointer}',
    '#backFloat:hover{background:#174567;border-color:#a0ddff;transform:translateY(-2px)}#backFloat:focus-visible{outline:2px solid #83d1ff;outline-offset:3px}',
    '.ark-feature-guide{grid-column:1/-1;width:100%;margin:2px 0 10px;padding:0 8px;position:relative;z-index:1}.ark-feature-guide .ark-scene{margin:0;padding:8px 10px;flex-direction:row-reverse;align-items:center;gap:15px;overflow:visible}.ark-feature-guide .ark-scene-robot{width:82px;height:96px;flex:0 0 82px}.ark-feature-guide .ark-scene-bubble{position:relative;overflow:visible;border-radius:18px 18px 18px 5px}.ark-feature-guide .ark-scene-bubble:after{right:-9px;left:auto;bottom:18px;transform:rotate(-45deg)}.ark-feature-guide--peek .ark-scene-robot{width:82px;height:74px;flex-basis:82px;overflow:hidden}.ark-feature-guide--peek .ark-scene-robot svg{width:82px;height:150px;max-width:none}.ark-feature-guide--peek .ark-scene-bubble:after{right:-9px;left:auto;transform:rotate(-45deg)}',
    '.ark-dust-trail{grid-column:1/-1;position:relative;height:27px;margin:-3px 0 7px;overflow:hidden;pointer-events:none}.ark-dust-trail:before{content:"";position:absolute;left:13%;right:12%;top:11px;height:3px;border-radius:50%;background:linear-gradient(90deg,transparent,#8edfff88,#45b8f4aa,#b5edff88,transparent);filter:blur(2px);animation:ark-dust-flow 1.8s ease-in-out infinite}.ark-dust-trail i{position:absolute;top:7px;left:var(--x);width:6px;height:6px;border-radius:50%;background:#a8eaff;opacity:0;filter:blur(1px);animation:ark-dust-puff 1.8s ease-out infinite}.ark-dust-trail i:nth-child(1){--x:24%;animation-delay:0s}.ark-dust-trail i:nth-child(2){--x:39%;animation-delay:.2s}.ark-dust-trail i:nth-child(3){--x:55%;animation-delay:.4s}.ark-dust-trail i:nth-child(4){--x:70%;animation-delay:.6s}.ark-dust-trail i:nth-child(5){--x:84%;animation-delay:.8s}',
    '.ark-combat-demo{margin:17px 0 5px;padding:13px 15px;border:1px solid rgba(83,177,226,.3);border-radius:13px;background:linear-gradient(145deg,rgba(10,37,57,.72),rgba(5,17,28,.9));overflow:hidden}.ark-combat-demo>p{margin:8px 0 0;text-align:center;color:#a9cce0;font-size:11px;line-height:1.55}.ark-demo-stage{height:148px;max-width:440px;margin:auto;position:relative;display:flex;align-items:flex-end;justify-content:space-around}.ark-demo-fighter{position:relative;width:110px;height:132px;display:flex;align-items:flex-end;justify-content:center}.ark-demo-robot{width:104px;height:116px;animation:ark-hover 2.6s ease-in-out infinite}.ark-demo-robot svg{width:100%;height:100%}.ark-demo-sword{position:absolute;right:2px;top:5px;font-size:34px;color:#d7e9f5;transform:rotate(-38deg);filter:drop-shadow(0 0 5px #71cfff)}.ark-demo-shield{position:absolute;left:-1px;top:40px;width:43px;height:50px;display:grid;place-items:center;color:#9de5ff;font-size:50px;line-height:1;text-shadow:0 0 9px #48bfff;transform:rotate(90deg)}.ark-demo-impact{position:absolute;left:50%;top:30px;color:#b9efff;font-size:29px;animation:ark-impact-pulse .8s ease-in-out infinite alternate}.ark-combat-demo--attack .ark-demo-target{animation:ark-target-recoil 1.7s ease-in-out infinite}.ark-combat-demo--attack .ark-demo-striker{animation:ark-strike 1.7s ease-in-out infinite}.ark-demo-hit{position:absolute;left:-2px;top:27px;color:#b9efff;font-size:27px;opacity:0;animation:ark-hit-flash 1.7s ease-in-out infinite}.ark-combat-demo--parry .ark-demo-attacker{animation:ark-parry-strike 1.8s ease-in-out infinite}.ark-combat-demo--parry .ark-demo-defender{animation:ark-parry-brace 1.8s ease-in-out infinite}.ark-combat-demo--parry .ark-demo-impact{animation:ark-impact-pulse .45s ease-in-out infinite alternate}.ark-demo-movement{justify-content:center}.ark-demo-watcher{z-index:2;width:125px}.ark-demo-watcher .ark-demo-robot{animation:ark-look-side 2.6s ease-in-out infinite}.ark-demo-question{position:absolute;top:0;left:45%;font-size:25px;font-weight:800;color:#9ee7ff;animation:ark-question 1.2s ease-in-out infinite}.ark-demo-runner{position:absolute;left:8%;bottom:0;width:104px;height:116px;animation:ark-run-across 2.6s ease-in-out infinite}.ark-demo-runner .ark-demo-robot{width:100%;height:100%}.ark-demo-direction{position:absolute;bottom:7px;color:#80d9ff;font-size:20px;opacity:.7}.ark-demo-left{left:4%}.ark-demo-right{right:4%}',
    ".ark-combat-demo--attack{position:relative;width:min(100%,480px);margin:18px 0 8px auto;padding:10px;border:1px solid rgba(94,211,255,.48);border-radius:15px;background:linear-gradient(145deg,rgba(7,33,52,.88),rgba(3,14,25,.96));box-shadow:0 0 24px rgba(42,178,235,.13),inset 0 0 22px rgba(71,194,255,.07)}",
    ".ark-demo-holo-window{position:relative;padding:22px 8px 8px;border:1px solid rgba(108,220,255,.35);border-radius:10px;background:linear-gradient(150deg,rgba(16,76,105,.2),rgba(3,20,34,.62));box-shadow:inset 0 0 24px rgba(63,194,255,.12);overflow:hidden;isolation:isolate}",
    ".ark-demo-transmission{position:absolute;z-index:5;top:7px;right:10px;color:#9beaff;font:700 8px var(--mono,monospace);letter-spacing:1px;text-shadow:0 0 8px #38bfff}.ark-demo-transmission:before{content:\"●\";margin-right:5px;color:#8dffdb;text-shadow:0 0 7px #53ffd0;animation:ark-transmission-pulse 1.4s ease-in-out infinite}",
    ".ark-demo-holo-window:before{content:\"\";position:absolute;z-index:4;inset:0;background:repeating-linear-gradient(to bottom,rgba(132,231,255,.09) 0 1px,transparent 1px 4px);pointer-events:none;opacity:.62}.ark-demo-holo-window:after{content:\"\";position:absolute;z-index:3;inset:0;background:linear-gradient(110deg,transparent 15%,rgba(124,229,255,.09) 48%,transparent 75%);transform:translateX(-100%);animation:ark-demo-holo-sweep 4.8s linear infinite;pointer-events:none}",
    ".ark-demo-stage--sword-pass{height:178px;max-width:none;width:100%;display:block;position:relative;overflow:hidden;background:radial-gradient(ellipse at 50% 88%,rgba(50,196,222,.17),transparent 58%)}",
    ".ark-demo-stage--sword-pass .ark-demo-target{position:absolute;z-index:2;left:50%;bottom:25px;width:104px;height:116px;transform:translateX(-50%);transform-origin:50% 100%;animation:ark-target-fall 4.8s ease-in-out infinite}.ark-demo-stage--sword-pass .ark-demo-target .ark-demo-robot{animation:none;transform:scaleX(-1)}",
    ".ark-demo-stage--sword-pass .ark-demo-striker{position:absolute;z-index:3;left:69%;bottom:25px;width:104px;height:116px;animation:ark-sword-pass 4.8s cubic-bezier(.35,.02,.22,1) infinite}.ark-demo-stage--sword-pass .ark-demo-striker .ark-demo-robot{width:100%;height:100%;animation:none}.ark-demo-stage--sword-pass .ark-demo-striker .ark-demo-robot>svg:first-child{transform:scaleX(-1)}",
    ".ark-demo-single-sword{position:absolute;z-index:4;right:-4px;bottom:14px;width:78px;height:27px;overflow:visible;transform:rotate(-7deg);filter:drop-shadow(0 0 5px rgba(104,218,255,.95))}",
    ".ark-demo-circuit-grass{position:absolute;z-index:1;left:0;right:0;bottom:0;height:39px;border-top:1px solid rgba(105,255,223,.5);background:linear-gradient(to top,rgba(17,111,107,.35),rgba(22,170,167,.08) 60%,transparent);box-shadow:0 -5px 18px rgba(42,238,206,.12)}",
    ".ark-demo-circuit-grass:before{content:\"\";position:absolute;inset:8px 0 0;background:repeating-linear-gradient(90deg,transparent 0 17px,rgba(85,255,219,.58) 18px 19px,transparent 20px 37px),linear-gradient(0deg,transparent 48%,rgba(85,255,219,.6) 49% 51%,transparent 52%);opacity:.55;clip-path:polygon(0 35%,8% 35%,8% 70%,20% 70%,20% 20%,34% 20%,34% 60%,48% 60%,48% 30%,64% 30%,64% 72%,78% 72%,78% 22%,91% 22%,91% 55%,100% 55%,100% 100%,0 100%)}",
    ".ark-demo-circuit-grass i{position:absolute;bottom:10px;width:2px;height:var(--h,13px);background:linear-gradient(to top,#4dffd4,rgba(91,255,226,.08));box-shadow:0 0 6px #42f5d0;transform-origin:bottom;animation:ark-circuit-grass 1.7s ease-in-out infinite alternate}",
    ".ark-demo-circuit-grass i:nth-child(1){left:8%;--h:15px}.ark-demo-circuit-grass i:nth-child(2){left:18%;--h:21px;animation-delay:.3s}.ark-demo-circuit-grass i:nth-child(3){left:29%;--h:12px;animation-delay:.6s}.ark-demo-circuit-grass i:nth-child(4){left:42%;--h:19px;animation-delay:.2s}.ark-demo-circuit-grass i:nth-child(5){left:57%;--h:14px;animation-delay:.5s}.ark-demo-circuit-grass i:nth-child(6){left:71%;--h:22px;animation-delay:.1s}.ark-demo-circuit-grass i:nth-child(7){left:85%;--h:16px;animation-delay:.4s}.ark-demo-circuit-grass i:nth-child(8){left:95%;--h:12px;animation-delay:.7s}",
    ".ark-combat-demo--attack>p{margin:8px 2px 1px;text-align:right;color:#9bcfe3;font-size:10px}.ark-combat-demo--attack .ark-demo-robot{position:relative}",
    "@keyframes ark-sword-pass{0%,18%{left:69%;transform:translateX(0)}43%{left:48%;transform:translateX(0)}62%,72%{left:3%;transform:translateX(0)}100%{left:3%;transform:translateX(0)}}",
    "@keyframes ark-target-fall{0%,58%{transform:translateX(-50%) rotateX(0);opacity:1}69%{transform:translateX(-50%) translateY(17px) rotateX(82deg);opacity:.95}82%,100%{transform:translateX(-50%) translateY(17px) rotateX(82deg);opacity:.95}}",
    "@keyframes ark-circuit-grass{from{transform:scaleY(.65);opacity:.55}to{transform:scaleY(1.12);opacity:1}}",
    "@keyframes ark-demo-holo-sweep{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}",
    "@keyframes ark-transmission-pulse{0%,100%{opacity:.55}50%{opacity:1}}",
    '@keyframes ark-dust-flow{0%,100%{transform:translateX(-8%) scaleX(.75);opacity:.45}50%{transform:translateX(8%) scaleX(1.08);opacity:1}}',
    '@keyframes ark-dust-puff{0%{transform:translateY(8px) scale(.4);opacity:0}30%{opacity:.85}100%{transform:translateY(-9px) scale(1.6);opacity:0}}',
    '@keyframes ark-strike{0%,18%,100%{transform:translateX(0) rotate(0)}42%,55%{transform:translateX(-24px) rotate(-8deg)}70%{transform:translateX(-4px)}}',
    '@keyframes ark-target-recoil{0%,38%,100%{transform:translateX(0)}52%,66%{transform:translateX(-9px)}}',
    '@keyframes ark-hit-flash{0%,42%,100%{opacity:0;transform:scale(.4)}54%,65%{opacity:1;transform:scale(1.35)}}',
    '@keyframes ark-parry-strike{0%,20%,100%{transform:translateX(0)}43%,58%{transform:translateX(-23px) rotate(-7deg)}70%{transform:translateX(-5px)}}',
    '@keyframes ark-parry-brace{0%,38%,100%{transform:translateX(0)}52%,68%{transform:translateX(4px)}}',
    '@keyframes ark-impact-pulse{from{opacity:.35;transform:scale(.7)}to{opacity:1;transform:scale(1.25)}}',
    '@keyframes ark-question{0%,100%{transform:translateY(0) rotate(-8deg)}50%{transform:translateY(-5px) rotate(8deg)}}',
    '@keyframes ark-look-side{0%,42%{transform:rotate(0)}50%,92%{transform:rotate(5deg)}}',
    '@keyframes ark-run-across{0%,8%{left:4%;transform:scaleX(1)}42%,50%{left:70%;transform:scaleX(1)}54%{left:70%;transform:scaleX(-1)}88%,96%{left:4%;transform:scaleX(-1)}100%{left:4%;transform:scaleX(1)}}',
    '@keyframes ark-hover{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}',
    '@media(max-width:700px){.ark-feature-guide{padding:0 2px;margin:5px 0 9px}.ark-feature-guide .ark-scene{gap:7px}.ark-feature-guide .ark-scene-robot{width:66px;height:78px;flex-basis:66px}.ark-feature-guide .ark-scene-bubble{font-size:11px;padding:9px 10px}.ark-feature-guide--peek .ark-scene-robot{width:68px;height:64px;flex-basis:68px}.ark-feature-guide--peek .ark-scene-robot svg{width:68px;height:135px}.ark-chi-diagram{gap:7px}.ark-chi-diagram svg{width:58px;height:58px}.ark-scene--chi .ark-scene-robot{width:76px;height:90px;flex-basis:76px}.ark-table-explainer{grid-template-columns:1fr}.ark-scene{gap:9px;padding:11px}.ark-scene-robot{width:82px;height:92px;flex-basis:82px}.ark-scene-bubble{font-size:12px;padding:10px}.ark-scene-trio{grid-template-columns:1fr}.ark-scene-trio .ark-scene{display:flex;align-items:center;text-align:left}.ark-scene-trio .ark-scene-robot{width:72px;height:80px;flex-basis:72px;margin:0}.ark-scene-trio .ark-scene-bubble{flex:1}.ark-scene--peek{transform:none;margin-left:0}.ark-scene--peek .ark-scene-robot{width:75px;height:84px;flex-basis:75px}.ark-combat-demo{padding:10px 8px}.ark-demo-stage{height:126px}.ark-demo-fighter{width:88px;height:116px}.ark-demo-robot{width:86px;height:100px}.ark-demo-runner{width:86px;height:100px}.ark-demo-runner .ark-demo-robot{width:100%;height:100%}#backFloat{right:14px;bottom:14px;min-height:42px;padding:9px 13px}}',
    '@media(max-width:700px){.ark-chi-stage{padding:17px 10px;gap:10px;min-height:0;margin:18px 0 24px}.ark-chi-orbit{grid-template-columns:1fr;gap:9px}.ark-chi-projection{grid-row:1;min-height:125px;gap:10px}.ark-chi-projection svg{width:62px;height:62px}.ark-chi-note{font-size:11px;padding:10px 12px}.ark-chi-robot{width:118px;height:128px;margin:0 auto}.ark-chi-robot:before{top:-40px;height:40px}.ark-chi-robot:after{top:-45px}.ark-chi-caption{font-size:11px;padding:0 5px}}',
    "@media(max-width:700px){.ark-combat-demo--attack{width:100%;padding:8px;margin-left:0}.ark-demo-stage--sword-pass{height:158px}.ark-demo-stage--sword-pass .ark-demo-target,.ark-demo-stage--sword-pass .ark-demo-striker{width:86px;height:100px}.ark-demo-single-sword{width:66px;right:-4px;bottom:12px}.ark-demo-transmission{font-size:7px;letter-spacing:.6px}}",
    '@media(prefers-reduced-motion:reduce){.ark-scene-robot,.ark-dust-trail:before,.ark-dust-trail i,.ark-demo-robot,.ark-demo-striker,.ark-demo-target,.ark-demo-attacker,.ark-demo-defender,.ark-demo-impact,.ark-demo-hit,.ark-demo-question,.ark-demo-runner,.ark-demo-transmitter,.ark-demo-presenter-robot,.ark-demo-stage--sword-pass .ark-demo-striker,.ark-demo-stage--sword-pass .ark-demo-target,.ark-demo-circuit-grass i,.ark-demo-holo-window:after,.ark-demo-transmission:before,.ark-chi-projection svg,.ark-chi-projection .ark-chi-arrow,.ark-chi-robot,.ark-chi-robot:after,.ark-scene-robot .ark-eye,.ark-holo-screen:before,.ark-holo-screen:after,.ark-holo-scan,.ark-holo-particles,.ark-holo-step,.ark-chi-holo-ark{animation:none!important}#backFloat{transition:none}}',
    '.ark-combat-demo{position:relative;isolation:isolate;margin:18px 0 8px;padding:12px;border:1px solid rgba(94,211,255,.38);border-radius:15px;background:linear-gradient(145deg,rgba(7,33,52,.88),rgba(3,14,25,.96));box-shadow:0 0 24px rgba(42,178,235,.11),inset 0 0 22px rgba(71,194,255,.05);overflow:hidden}',
    '.ark-demo-holo-window{position:relative;min-height:190px;padding:24px 7px 8px;border:1px solid rgba(108,220,255,.38);border-radius:11px;background:radial-gradient(ellipse at 45% 78%,rgba(39,154,190,.15),transparent 60%),linear-gradient(150deg,rgba(16,76,105,.22),rgba(3,20,34,.7));box-shadow:inset 0 0 26px rgba(63,194,255,.12);overflow:hidden;isolation:isolate}',
    '.ark-demo-holo-window:before{content:"";position:absolute;z-index:8;inset:0;background:repeating-linear-gradient(to bottom,rgba(132,231,255,.075) 0 1px,transparent 1px 5px);pointer-events:none}.ark-demo-holo-window:after{content:"";position:absolute;z-index:7;inset:0;background:linear-gradient(110deg,transparent 15%,rgba(124,229,255,.1) 48%,transparent 75%);transform:translateX(-100%);animation:ark-demo-holo-sweep 4.8s linear infinite;pointer-events:none}',
    '.ark-demo-transmission{position:absolute;z-index:10;top:8px;left:11px;color:#9beaff;font:700 8px var(--mono,monospace);letter-spacing:1px;text-shadow:0 0 8px #38bfff}.ark-demo-transmission:before{content:"●";margin-right:5px;color:#8dffdb;text-shadow:0 0 7px #53ffd0;animation:ark-transmission-pulse 1.4s ease-in-out infinite}',
    '.ark-demo-stage{position:relative;z-index:2;height:166px;width:100%;margin:0 auto;overflow:hidden;perspective:700px}',
    '.ark-demo-fighter{position:absolute;width:84px;height:92px;display:grid;place-items:center;filter:drop-shadow(0 0 8px rgba(101,218,255,.65));opacity:.9}',
    '.ark-demo-robot{position:relative;width:100%;height:100%;display:grid;place-items:center;animation:ark-demo-old-float 2.7s ease-in-out infinite}.ark-demo-robot svg{width:100%;height:100%;overflow:visible;filter:sepia(.08) saturate(1.6) hue-rotate(155deg)}',
    '.ark-demo-transmitter{position:relative;z-index:9;min-height:94px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;margin:-1px auto 0;pointer-events:none;filter:drop-shadow(0 0 9px rgba(93,210,255,.55))}.ark-demo-presenter-label{position:relative;z-index:2;margin-bottom:2px;font:700 6px var(--mono,monospace);letter-spacing:.7px;color:#b9efff;text-align:center;white-space:nowrap;text-shadow:0 0 7px #38bfff}.ark-demo-projector{position:relative;width:66px;height:72px;display:flex;align-items:flex-end;justify-content:center}.ark-demo-presenter-robot{position:relative;z-index:2;width:58px;height:65px;animation:ark-demo-presenter-watch 3.4s ease-in-out infinite}.ark-demo-presenter-robot svg{width:100%;height:100%;overflow:visible;filter:drop-shadow(0 0 8px #54caff)}.ark-demo-projection-beam{position:absolute;z-index:1;left:50%;top:-48px;width:3px;height:52px;transform:translateX(-50%);background:linear-gradient(to top,rgba(127,232,255,.96),rgba(85,199,255,.62),rgba(85,199,255,.08));box-shadow:0 0 9px #65d7ff,0 0 19px rgba(65,185,255,.7)}.ark-demo-projection-beam:before{content:"";position:absolute;left:50%;top:-4px;width:13px;height:13px;border:1px solid rgba(174,244,255,.85);border-radius:50%;background:rgba(106,220,255,.25);transform:translateX(-50%);box-shadow:0 0 13px #5bcfff,0 0 27px rgba(89,202,255,.7)}',
    '.ark-demo-grass{position:absolute;z-index:1;left:0;right:0;bottom:0;height:34px;border-bottom:1px solid rgba(111,224,211,.28);background:linear-gradient(to top,rgba(31,119,91,.2),rgba(25,112,96,.055) 60%,transparent)}.ark-demo-grass:before{content:"";position:absolute;left:0;right:0;bottom:0;height:9px;background:linear-gradient(90deg,transparent,rgba(111,223,179,.28),transparent);filter:blur(4px)}.ark-demo-grass i{position:absolute;bottom:5px;width:5px;height:var(--h,12px);border-left:1.5px solid rgba(142,238,190,.8);border-radius:100% 0 0 0;transform:rotate(var(--r,-18deg));transform-origin:bottom;opacity:.7;animation:ark-demo-grass-sway 2.8s ease-in-out infinite alternate}.ark-demo-grass i:nth-child(1){left:4%;--h:11px;--r:-24deg}.ark-demo-grass i:nth-child(2){left:12%;--h:17px;--r:17deg}.ark-demo-grass i:nth-child(3){left:22%;--h:9px;--r:-12deg}.ark-demo-grass i:nth-child(4){left:33%;--h:14px;--r:22deg}.ark-demo-grass i:nth-child(5){left:45%;--h:10px;--r:-20deg}.ark-demo-grass i:nth-child(6){left:57%;--h:16px;--r:16deg}.ark-demo-grass i:nth-child(7){left:68%;--h:11px;--r:-18deg}.ark-demo-grass i:nth-child(8){left:78%;--h:15px;--r:19deg}.ark-demo-grass i:nth-child(9){left:89%;--h:10px;--r:-14deg}.ark-demo-grass i:nth-child(10){left:96%;--h:13px;--r:20deg}',
    '.ark-demo-stage--sword-pass{height:166px;background:radial-gradient(ellipse at 48% 92%,rgba(50,196,166,.12),transparent 62%)}.ark-demo-stage--sword-pass .ark-demo-target{z-index:2;left:50%;bottom:20px;transform:translateX(-50%)}.ark-demo-stage--sword-pass .ark-demo-striker{z-index:3;left:72%;bottom:20px;animation:ark-demo-katana-pass 4.6s cubic-bezier(.35,.02,.22,1) infinite}.ark-demo-stage--sword-pass .ark-demo-striker .ark-demo-robot{transform:none}.ark-demo-stage--sword-pass .ark-demo-striker .ark-demo-robot>svg:first-child{transform:scaleX(-1)}',
    '.ark-demo-robot--armed{overflow:visible}.ark-demo-katana{position:absolute;z-index:6;left:-63px;top:54px;width:76px;height:19px;overflow:visible;filter:drop-shadow(0 0 6px rgba(126,229,255,.98));transform:rotate(-8deg);transform-origin:96% 55%;pointer-events:none}',
    '.ark-demo-stage--parry{height:166px;background:radial-gradient(ellipse at 28% 88%,rgba(61,190,219,.12),transparent 46%)}.ark-demo-stage--parry .ark-demo-defender{z-index:3;left:17%;bottom:20px}.ark-demo-stage--parry .ark-demo-attacker{z-index:4;left:72%;bottom:20px;animation:ark-demo-parry-lunge 3.2s ease-in-out infinite}.ark-demo-stage--parry .ark-demo-attacker .ark-demo-robot{transform:none}.ark-demo-stage--parry .ark-demo-attacker .ark-demo-robot>svg:first-child{transform:scaleX(-1)}.ark-demo-shield-gear{position:absolute;z-index:5;left:8px;top:5px;width:30px;height:35px;opacity:.8;filter:drop-shadow(0 0 5px #4dcaff);transform:rotate(-20deg);animation:ark-demo-shield-raise 3.2s ease-in-out infinite}.ark-demo-barrier{position:absolute;z-index:4;left:50%;top:48%;width:116px;height:116px;border:2px solid rgba(155,239,255,.95);border-radius:50%;background:radial-gradient(circle,rgba(104,220,255,.16),rgba(70,182,255,.04) 62%,transparent 70%);box-shadow:0 0 12px #57caff,inset 0 0 16px rgba(130,231,255,.3);opacity:0;transform:translate(-50%,-50%) scale(.2);animation:ark-demo-barrier-burst 3.2s ease-out infinite;pointer-events:none}.ark-demo-barrier:before,.ark-demo-barrier:after{content:"";position:absolute;inset:9px;border:1px solid rgba(180,245,255,.72);border-radius:50%;transform:rotateX(65deg)}.ark-demo-barrier:after{inset:18px;transform:rotateY(65deg)}.ark-demo-stage--parry .ark-demo-impact{position:absolute;z-index:6;left:34%;top:40%;color:#d8faff;font-size:25px;opacity:0;animation:ark-demo-parry-flash 3.2s ease-out infinite}',
    '.ark-demo-stage--movement{height:178px;overflow:hidden;background:radial-gradient(ellipse at 48% 56%,rgba(43,175,213,.1),transparent 64%);transform-style:preserve-3d}.ark-demo-stage--movement .ark-demo-grass{height:38px}.ark-demo-orbit-track{position:absolute;left:50%;top:50%;border:1px solid rgba(117,222,255,.24);border-radius:50%;transform:translate(-50%,-50%) rotateX(58deg)}.ark-demo-orbit-track--outer{width:76%;height:132px}.ark-demo-orbit-track--inner{width:46%;height:82px;border-style:dashed;opacity:.55}.ark-demo-stage--movement .ark-demo-fighter{width:58px;height:63px;transform:rotateX(48deg);transform-style:preserve-3d}.ark-demo-stage--movement .ark-demo-center{z-index:3;left:calc(50% - 29px);top:calc(50% - 34px);filter:drop-shadow(0 0 10px #7de6ff)}.ark-demo-stage--movement .ark-demo-center .ark-demo-robot{animation:ark-demo-center-hover 2.5s ease-in-out infinite}.ark-demo-question{position:absolute;z-index:8;left:50%;top:-24px;color:#b8f1ff;font:900 24px/1 var(--mono,monospace);text-shadow:0 0 7px #5ccfff,0 0 15px #238bc6;transform:translateX(-50%);animation:ark-question 1.2s ease-in-out infinite}.ark-demo-runner{z-index:4;left:50%;top:50%;margin:-31px 0 0 -29px;animation:ark-demo-fixed-points 2.8s steps(1,end) infinite}.ark-demo-runner .ark-demo-robot{animation:none}.ark-demo-runner--echo{z-index:2;opacity:.35;filter:blur(1px) drop-shadow(0 0 10px #56caff)}.ark-demo-runner--echo-one{animation-delay:-.7s;opacity:.28}.ark-demo-runner--echo-two{animation-delay:-1.4s;opacity:.2;filter:blur(2px) drop-shadow(0 0 10px #56caff)}.ark-demo-runner--echo-three{animation-delay:-2.1s;opacity:.13;filter:blur(3px) drop-shadow(0 0 10px #56caff)}.ark-demo-runner--real{animation-delay:0s}',
    '.ark-combat-demo>p{margin:8px 2px 1px;text-align:center;color:#9bcfe3;font-size:10px;line-height:1.55}',
    '@keyframes ark-demo-old-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes ark-demo-holo-sweep{0%{transform:translateX(-100%)}100%{transform:translateX(100%)}}@keyframes ark-transmission-pulse{0%,100%{opacity:.55}50%{opacity:1}}@keyframes ark-demo-grass-sway{from{transform:rotate(var(--r)) scaleY(.78)}to{transform:rotate(calc(var(--r) + 9deg)) scaleY(1.08)}}@keyframes ark-demo-presenter-watch{0%,100%{transform:scaleX(-1) translateY(0)}50%{transform:scaleX(-1) translateY(-4px)}}',
    '@keyframes ark-demo-katana-pass{0%,15%{left:72%;transform:translateX(0)}38%{left:49%;transform:translateX(0)}57%,68%{left:4%;transform:translateX(0)}100%{left:4%;transform:translateX(0)}}',
    '@keyframes ark-demo-parry-lunge{0%,20%,100%{left:72%;transform:translateX(0) rotate(0)}36%{left:40%;transform:translateX(0) rotate(-5deg)}47%,55%{left:40%;transform:translateX(44px) rotate(7deg)}72%{left:72%;transform:translateX(0) rotate(0)}}',
    '@keyframes ark-demo-shield-raise{0%,25%,100%{left:8px;top:5px;transform:rotate(-20deg) scale(.8);opacity:.72}34%,60%{left:-8px;top:43px;transform:rotate(0) scale(1.1);opacity:1}70%{left:8px;top:5px;transform:rotate(-20deg) scale(.8);opacity:.72}}',
    '@keyframes ark-demo-barrier-burst{0%,32%,100%{opacity:0;transform:translate(-50%,-50%) scale(.2)}40%{opacity:1;transform:translate(-50%,-50%) scale(1.12)}54%{opacity:.85;transform:translate(-50%,-50%) scale(1)}68%{opacity:0;transform:translate(-50%,-50%) scale(1.3)}}',
    '@keyframes ark-demo-parry-flash{0%,35%,100%{opacity:0;transform:scale(.3)}42%,54%{opacity:1;transform:scale(1.5)}64%{opacity:0;transform:scale(.5)}}',
    '@keyframes ark-demo-center-hover{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}@keyframes ark-demo-fixed-points{0%,100%{transform:translate(-88px,-35px) rotateX(48deg)}25%{transform:translate(0,-58px) rotateX(48deg)}50%{transform:translate(88px,-35px) rotateX(48deg)}75%{transform:translate(0,28px) rotateX(48deg)}}',
    '@media(max-width:700px){.ark-combat-demo{padding:8px}.ark-demo-holo-window{min-height:174px;padding-top:22px}.ark-demo-stage{height:150px;width:100%}.ark-demo-fighter{width:70px;height:78px}.ark-demo-transmitter{min-height:82px}.ark-demo-projector{width:58px;height:62px}.ark-demo-presenter-robot{width:52px;height:58px}.ark-demo-projection-beam{top:-42px;height:46px}.ark-demo-katana{left:-53px;top:47px;width:68px}.ark-demo-stage--sword-pass,.ark-demo-stage--parry{height:150px}.ark-demo-stage--parry .ark-demo-defender{left:13%}.ark-demo-stage--parry .ark-demo-attacker{left:72%}.ark-demo-barrier{width:94px;height:94px}.ark-demo-stage--movement{height:160px}.ark-demo-stage--movement .ark-demo-fighter{width:48px;height:52px}.ark-demo-stage--movement .ark-demo-center{left:calc(50% - 24px);top:calc(50% - 28px)}.ark-demo-runner{margin:-26px 0 0 -24px}.ark-demo-stage--movement .ark-demo-fighter{width:48px;height:52px}.ark-demo-orbit-track--outer{height:112px}.ark-demo-orbit-track--inner{height:70px}.ark-demo-transmission{font-size:7px;letter-spacing:.55px}}',
    '@media(prefers-reduced-motion:reduce){.ark-demo-holo-window:after,.ark-demo-transmission:before,.ark-demo-grass i,.ark-demo-presenter-robot,.ark-demo-robot,.ark-demo-shield-gear,.ark-demo-barrier,.ark-demo-impact,.ark-demo-runner,.ark-demo-center .ark-demo-robot{animation:none!important}}',
    '.ark-demo-composition{position:relative;display:block;min-height:280px;padding-bottom:0;overflow:visible}',
    '.ark-demo-transmitter:before{content:"";position:absolute;left:7px;bottom:5px;width:70px;height:13px;border-radius:50%;background:rgba(0,0,0,.58);filter:blur(7px);transform:skewX(-24deg);z-index:0}',
    '.ark-demo-presenter-robot{transform:perspective(420px) rotateY(-30deg) rotate(7deg) translateZ(-8px)!important;filter:drop-shadow(10px 8px 0 rgba(1,8,18,.55)) drop-shadow(0 0 9px rgba(84,202,255,.62))}',
    '.ark-demo-composition .ark-demo-transmitter .ark-demo-projector .ark-demo-projection-beam{left:-11px!important}',
    '.ark-feature-guide .ark-scene{align-items:flex-start!important}',
    '.ark-feature-guide .ark-scene-bubble{align-self:flex-start!important;margin-top:0!important}',
    '.ark-feature-guide .ark-scene-bubble:after{top:22px!important;bottom:auto!important}',
    '.ark-feature-guide--peek .ark-scene-bubble:after{top:22px!important;bottom:auto!important}',
    '.ark-dust-trail{height:34px!important;margin:-1px 0 7px!important;overflow:visible!important}',
    '.ark-dust-trail:before{display:none!important}',
    '.ark-dust-trail svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}',
    '.ark-dust-route{fill:none;stroke:rgba(125,220,255,.7);stroke-width:2.2;stroke-linecap:round;stroke-dasharray:5 5;filter:drop-shadow(0 0 3px rgba(88,199,255,.75));animation:ark-dust-route-flow 2.8s linear infinite}',
    '@keyframes ark-dust-route-flow{to{stroke-dashoffset:-40}}',
    '.ark-demo-holo-window{z-index:2}',
    '.ark-demo-transmitter{position:absolute!important;left:0;bottom:0;margin:0!important;width:104px;min-height:102px;align-items:flex-start;justify-content:flex-end;z-index:3!important}',
    '.ark-demo-presenter-label{margin-left:3px!important;text-align:left!important}',
    '.ark-demo-projector{width:82px!important;height:76px!important;justify-content:flex-start!important;margin-left:5px}',
    '.ark-demo-presenter-robot{width:64px!important;height:68px!important;transform:perspective(180px) rotateY(-22deg) rotate(8deg);animation:ark-demo-presenter-face-right 3.4s ease-in-out infinite!important}',
    '.ark-demo-projection-beam{position:absolute!important;z-index:1;left:43px!important;top:-206px!important;width:min(82vw,470px)!important;height:224px!important;transform:none!important;clip-path:polygon(0 100%,0 0,100% 0)!important;border:0!important;border-radius:0!important;background:linear-gradient(90deg,rgba(62,181,255,.04),rgba(72,194,255,.12) 35%,rgba(90,212,255,.2));box-shadow:inset 0 0 28px rgba(73,190,255,.18),0 0 18px rgba(71,190,255,.2);filter:blur(.5px);opacity:.8}',
    '.ark-demo-projection-beam:before{content:"";position:absolute;inset:0;background:linear-gradient(125deg,rgba(128,230,255,.0) 0 20%,rgba(122,224,255,.18) 21%,rgba(122,224,255,.04) 22% 48%,rgba(122,224,255,.18) 49%,rgba(122,224,255,.02) 50%);box-shadow:inset 0 0 25px rgba(93,205,255,.25)}',
    '.ark-demo-projection-beam:after{content:"";position:absolute;left:0;bottom:0;width:12px;height:12px;border-radius:50%;background:#c7f7ff;box-shadow:0 0 10px #8be4ff,0 0 24px #3ebcff,0 0 38px rgba(65,182,255,.8)}',
    '.ark-demo-robot .ark-demo-katana{position:absolute!important;z-index:12!important;left:-44px!important;top:54px!important;width:76px!important;height:19px!important;max-width:none!important;transform:rotate(-8deg)!important;transform-origin:96% 55%!important;overflow:visible!important;filter:drop-shadow(0 0 7px rgba(126,229,255,.98))!important}',
    '@keyframes ark-demo-target-fall-left{0%,58%{transform:translateX(-50%) rotate(0);opacity:1}69%{transform:translateX(calc(-50% - 20px)) translateY(18px) rotate(-78deg);opacity:.95}82%,100%{transform:translateX(calc(-50% - 20px)) translateY(18px) rotate(-78deg);opacity:.95}}',
    '.ark-demo-stage--sword-pass .ark-demo-target{animation:ark-demo-target-fall-left 4.6s ease-in-out infinite!important}',
    '@keyframes ark-demo-shield-face-front{0%,25%,100%{left:8px;right:auto;top:5px;transform:rotate(-20deg) scale(.8);opacity:.72}34%,60%{left:auto;right:-10px;top:42px;transform:rotate(90deg) scale(1.1);opacity:1}70%{left:8px;right:auto;top:5px;transform:rotate(-20deg) scale(.8);opacity:.72}}',
    '.ark-demo-stage--parry .ark-demo-shield-gear{animation:ark-demo-shield-face-front 3.2s ease-in-out infinite!important}',
    '.ark-demo-stage--movement .ark-demo-runner{animation-duration:1.25s!important}',
    '.ark-demo-stage--movement .ark-demo-runner--echo-one{animation-delay:-.3125s!important}',
    '.ark-demo-stage--movement .ark-demo-runner--echo-two{animation-delay:-.625s!important}',
    '.ark-demo-stage--movement .ark-demo-runner--echo-three{animation-delay:-.9375s!important}',
    '.ark-demo-stage--movement .ark-demo-center .ark-demo-robot svg{transform-origin:50% 42%;animation:ark-demo-search-echoes 1.25s steps(1,end) infinite}',
    '@keyframes ark-demo-search-echoes{0%,20%{transform:rotate(-24deg)}25%,45%{transform:rotate(18deg)}50%,70%{transform:rotate(-12deg)}75%,95%{transform:rotate(25deg)}100%{transform:rotate(-24deg)}}',
    '@keyframes ark-demo-presenter-face-right{0%,100%{transform:perspective(180px) rotateY(-22deg) rotate(8deg) translateY(0)}50%{transform:perspective(180px) rotateY(-22deg) rotate(8deg) translateY(-3px)}}',
    '@media(max-width:700px){.ark-demo-composition{min-height:252px;padding-bottom:0}.ark-demo-transmitter{width:78px;min-height:80px}.ark-demo-projector{width:66px!important;height:62px!important}.ark-demo-presenter-robot{width:52px!important;height:56px!important}.ark-demo-projection-beam{left:35px!important;top:-174px!important;width:calc(100vw - 64px)!important;height:190px!important}.ark-demo-robot .ark-demo-katana{left:-35px!important;top:47px!important;width:68px!important;height:17px!important}}',
    '.ark-demo-projection-beam{position:absolute!important;z-index:1;left:43px!important;top:-206px!important;width:min(82vw,470px)!important;height:224px!important;transform:none!important;clip-path:none!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;filter:none!important;opacity:.9;overflow:visible!important}',
    '.ark-demo-projection-beam svg{display:block;width:100%;height:100%;overflow:visible;filter:drop-shadow(0 0 5px rgba(71,190,255,.32))}',
    '.ark-demo-projection-beam:before{display:none!important}.ark-demo-projection-beam:after{left:37px!important;bottom:-1px!important;width:13px!important;height:13px!important;background:#c7f7ff!important;box-shadow:0 0 10px #8be4ff,0 0 24px #3ebcff,0 0 38px rgba(65,182,255,.8)!important}',
    '.ark-talent-demos{display:grid;gap:18px;margin:22px 0 26px}.ark-talent-demo{position:relative;padding:12px 13px 13px;border:1px solid rgba(82,181,232,.34);border-radius:15px;background:linear-gradient(145deg,rgba(8,34,53,.82),rgba(4,15,26,.96));overflow:hidden}.ark-talent-demo h3{margin:0 0 9px;color:#a8e8ff;font:800 10px var(--mono,monospace);letter-spacing:1.2px}.ark-talent-demo>p{margin:8px 2px 0;color:#a9cce0;font-size:11px;line-height:1.6;text-align:center}.ark-talent-demo .ark-demo-composition{min-height:252px}.ark-talent-demo .ark-demo-holo-window{min-height:202px;padding:20px 8px 8px}.ark-talent-demo .ark-demo-transmission{right:8px;top:6px}.ark-talent-demo .ark-demo-transmitter{width:98px;min-height:96px}.ark-talent-demo .ark-demo-projector{width:78px;height:70px}.ark-talent-demo .ark-demo-presenter-robot{width:60px;height:62px;transform:perspective(180px) rotateY(-22deg) rotate(8deg)}.ark-talent-demo .ark-demo-projection-beam{top:-190px!important;height:204px!important;width:min(82vw,470px)!important}',
    '.ark-talent-stage{position:relative;min-height:174px;width:100%;overflow:hidden;display:flex;align-items:center;justify-content:center;background:radial-gradient(ellipse at 50% 76%,rgba(46,172,232,.13),transparent 64%)}.ark-talent-robot{position:relative;width:112px;height:120px;z-index:2;flex:0 0 auto;filter:drop-shadow(0 0 10px rgba(80,198,255,.52))}.ark-talent-robot-svg,.ark-talent-robot-svg svg{width:100%;height:100%;display:block;overflow:visible}.ark-talent-chi-mark{position:absolute;z-index:5;left:50%;top:59%;width:34px;height:37px;transform:translate(-50%,-50%);overflow:visible;filter:drop-shadow(0 0 7px #31baff)}.ark-talent-chi-mark svg{width:100%;height:100%;display:block;overflow:visible}',
    '.ark-talent-stage--reserve .ark-talent-robot{animation:ark-talent-reserve-float 2.7s ease-in-out infinite}.ark-talent-reserve-aura{position:absolute;z-index:1;left:50%;top:50%;width:150px;height:150px;transform:translate(-50%,-48%);border-radius:50%;background:radial-gradient(ellipse,rgba(36,170,255,.25) 0,rgba(27,134,224,.13) 38%,rgba(38,177,255,.04) 63%,transparent 72%);filter:blur(7px);animation:ark-talent-x-aura 2.1s ease-in-out infinite}.ark-talent-reserve-ring{position:absolute;z-index:3;left:50%;top:59%;width:42px;height:42px;transform:translate(-50%,-50%);border:1.5px solid rgba(117,224,255,.9);border-radius:50%;box-shadow:0 0 8px rgba(65,188,255,.75),inset 0 0 8px rgba(65,188,255,.3);pointer-events:none}.ark-talent-reserve-legend{position:absolute;z-index:4;left:50%;bottom:5px;transform:translateX(-50%);color:#9fe7ff;font:700 8px var(--mono,monospace);letter-spacing:1px;text-shadow:0 0 8px #36baff;white-space:nowrap}',
    '.ark-talent-stage--influence{justify-content:flex-start}.ark-talent-influence-actor{position:absolute;left:8%;bottom:10px;width:112px;height:120px;z-index:3}.ark-talent-influence-robot{width:100%;height:100%;animation:ark-talent-influence-ready 4.8s ease-in-out infinite}.ark-talent-raised-arm{position:absolute;inset:0;width:100%;height:100%;z-index:4;overflow:visible;opacity:0;transform-origin:66% 52%;animation:ark-talent-raise-arm 4.8s ease-in-out infinite}.ark-talent-raised-arm path{fill:none;stroke:#e5f6ff;stroke-width:8;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 5px #59caff)}.ark-talent-raised-arm circle{fill:#eafaff;stroke:#71d4ff;stroke-width:2;filter:drop-shadow(0 0 6px #4fc4ff)}.ark-talent-energy-orb{position:absolute;z-index:5;left:22%;top:54%;width:15px;height:15px;border-radius:50%;background:radial-gradient(circle,#f2fdff 0 15%,#7be2ff 38%,#1689ed 72%,transparent 74%);box-shadow:0 0 9px #74ddff,0 0 20px #239dff;opacity:0;animation:ark-talent-influence-orb 4.8s ease-in-out infinite}.ark-talent-floating-sword{position:absolute;z-index:4;right:8%;top:47%;width:78px;height:24px;overflow:visible;filter:drop-shadow(0 0 7px #6ed8ff);transform:rotate(-15deg);animation:ark-talent-sword-pull 4.8s cubic-bezier(.35,.05,.2,1) infinite}.ark-talent-floating-sword svg{width:100%;height:100%;overflow:visible}.ark-talent-stage--influence .ark-talent-chi-mark{top:59%}',
    '.ark-talent-stage--existence{min-height:184px;display:block;perspective:500px}.ark-talent-existence-actor,.ark-talent-existence-observer{position:absolute;bottom:12px;width:94px;height:104px;z-index:3}.ark-talent-existence-actor{left:5%;animation:ark-talent-existence-cross 7.2s ease-in-out infinite}.ark-talent-existence-actor .ark-talent-robot{width:100%;height:100%}.ark-talent-existence-observer .ark-talent-robot-svg{width:100%;height:100%}.ark-talent-existence-actor .ark-talent-robot-svg{position:relative;z-index:2}.ark-talent-existence-actor:after{content:"";position:absolute;z-index:3;left:34%;top:47%;width:32%;height:28%;border-radius:50%;background:radial-gradient(ellipse,#e5fbff 0 8%,#66d5ff 24%,rgba(27,143,255,.7) 52%,transparent 75%);filter:blur(4px);animation:ark-talent-existence-core 7.2s ease-in-out infinite}.ark-talent-existence-actor .ark-talent-chi-mark{z-index:4;width:26px;height:29px;top:59%}.ark-talent-existence-observer{left:43%;z-index:4;transform-origin:50% 90%;animation:ark-talent-existence-fall 7.2s ease-in-out infinite}.ark-talent-existence-observer .ark-talent-robot-svg{animation:ark-talent-existence-look 7.2s ease-in-out infinite;transform-origin:50% 48%}.ark-talent-existence-question{position:absolute;z-index:6;top:-12px;left:50%;color:#a9eaff;font:900 23px var(--mono,monospace);text-shadow:0 0 8px #48c4ff;opacity:0;animation:ark-talent-existence-confusion 7.2s ease-in-out infinite}.ark-talent-existence-wave{position:absolute;z-index:5;left:95%;top:12%;width:12px;height:76%;border-radius:50%;border:2px solid rgba(126,229,255,.9);background:linear-gradient(90deg,transparent,rgba(95,208,255,.28),transparent);box-shadow:0 0 20px rgba(64,189,255,.75),inset 0 0 15px rgba(80,202,255,.4);opacity:0;filter:blur(1px);animation:ark-talent-existence-wave 7.2s ease-in-out infinite}',
    '@keyframes ark-talent-reserve-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}@keyframes ark-talent-x-aura{0%,100%{opacity:.45;transform:translate(-50%,-48%) scale(.88)}50%{opacity:1;transform:translate(-50%,-48%) scale(1.08)}}@keyframes ark-talent-influence-ready{0%,100%{transform:translateY(0)}20%,55%{transform:translateY(-2px)}}@keyframes ark-talent-raise-arm{0%,12%{opacity:0;transform:rotate(0)}22%,62%{opacity:1;transform:rotate(-4deg)}75%,100%{opacity:0;transform:rotate(0)}}@keyframes ark-talent-influence-orb{0%,18%{left:22%;top:54%;opacity:0;transform:scale(.4)}27%{left:27%;top:35%;opacity:1;transform:scale(1)}37%{left:33%;top:13%;opacity:1;transform:scale(1.25)}47%{left:55%;top:22%;opacity:1;transform:scale(1.2)}59%{left:78%;top:40%;opacity:1;transform:scale(1.4)}70%,100%{left:32%;top:55%;opacity:0;transform:scale(.4)}}@keyframes ark-talent-sword-pull{0%,48%{right:8%;top:47%;transform:rotate(-15deg) scale(1)}60%{right:26%;top:42%;transform:rotate(-8deg) scale(1.05)}76%,100%{right:68%;top:43%;transform:rotate(2deg) scale(.92)}}@keyframes ark-talent-existence-core{0%,24%{opacity:1;transform:scale(1)}27%,43%{opacity:0;transform:scale(.2)}48%,100%{opacity:0}}@keyframes ark-talent-existence-cross{0%,24%{left:5%;opacity:1;filter:drop-shadow(0 0 14px #5acaff)}30%,42%{left:5%;opacity:.2;filter:blur(1px)}64%{left:78%;opacity:.24;filter:blur(1px)}70%,100%{left:78%;opacity:1;filter:drop-shadow(0 0 13px #5acaff)}}@keyframes ark-talent-existence-look{0%,24%{transform:rotate(-13deg)}28%,42%{transform:rotate(0)}47%{transform:rotate(-22deg)}53%{transform:rotate(20deg)}59%{transform:rotate(-9deg)}68%,74%{transform:rotate(18deg)}80%,100%{transform:rotate(18deg)}}@keyframes ark-talent-existence-confusion{0%,25%{opacity:0;transform:translate(-50%,8px) scale(.5)}30%,65%{opacity:1;transform:translate(-50%,0) scale(1)}70%,100%{opacity:0}}@keyframes ark-talent-existence-wave{0%,70%{left:95%;opacity:0;transform:scaleX(.4)}75%{left:83%;opacity:1;transform:scaleX(1)}84%{left:46%;opacity:.9;transform:scaleX(1.4)}91%{left:18%;opacity:.4;transform:scaleX(1.8)}100%{left:18%;opacity:0}}@keyframes ark-talent-existence-fall{0%,24%,79%{transform:rotate(0) translateY(0)}30%{transform:rotate(0) translateY(-9px)}36%,75%{transform:rotate(0) translateY(0)}86%,100%{transform:rotateX(82deg) translateY(18px)}}',
    '@media(max-width:700px){.ark-talent-demo .ark-demo-composition{min-height:236px}.ark-talent-demo .ark-demo-holo-window{min-height:184px}.ark-talent-demo .ark-demo-transmitter{width:76px;min-height:78px}.ark-talent-demo .ark-demo-projector{width:62px;height:58px}.ark-talent-demo .ark-demo-presenter-robot{width:50px;height:52px}.ark-talent-demo .ark-demo-projection-beam{left:35px!important;top:-169px!important;width:calc(100vw - 64px)!important;height:180px!important}.ark-talent-stage{min-height:156px}.ark-talent-robot{width:94px;height:102px}.ark-talent-influence-actor{left:4%;width:94px;height:102px}.ark-talent-floating-sword{width:62px;right:4%}.ark-talent-existence-actor,.ark-talent-existence-observer{width:78px;height:86px}.ark-talent-existence-actor{left:2%}.ark-talent-existence-observer{left:39%}.ark-talent-existence-cross{animation-name:ark-talent-existence-cross-mobile}}@keyframes ark-talent-existence-cross-mobile{0%,24%{left:2%;opacity:1;filter:drop-shadow(0 0 14px #5acaff)}30%,42%{left:2%;opacity:.2;filter:blur(1px)}64%{left:74%;opacity:.24;filter:blur(1px)}70%,100%{left:74%;opacity:1;filter:drop-shadow(0 0 13px #5acaff)}}',
    '@media(prefers-reduced-motion:reduce){.ark-talent-demo *,.ark-talent-demo *:before,.ark-talent-demo *:after{animation:none!important}}',
    '.ark-home-drawer{position:relative!important;min-height:168px!important;padding-bottom:26px!important;overflow:visible!important;isolation:isolate}',
    '.ark-home-drawer--right{padding-right:102px!important;padding-left:18px!important}',
    '.ark-home-drawer--left{padding-left:102px!important;padding-right:18px!important}',
    '.ark-home-message{grid-column:1/-1;position:relative;min-height:116px;margin:-2px 0 12px;padding:4px 8px 30px;overflow:visible;isolation:isolate}',
    '.ark-home-message-bubble{position:relative;z-index:2;width:min(100%,700px);margin:0 auto 0 0;padding:13px 16px 14px;border:1px solid rgba(84,184,235,.56);border-radius:13px 13px 13px 4px;background:linear-gradient(120deg,rgba(225,246,255,.98),rgba(202,235,251,.96));box-shadow:0 7px 19px rgba(0,0,0,.24),inset 0 1px 0 rgba(255,255,255,.85);color:#102c40}',
    '.ark-home-message-label{display:block;margin-bottom:5px;color:#1679ae;font:700 8px var(--mono,monospace);letter-spacing:1.1px}',
    '.ark-home-message-bubble p{margin:0;color:#17364b;font-size:12px;line-height:1.65}',
    '.ark-home-message-divider{height:0;border:0;border-top:1px solid rgba(22,121,174,.32);margin:10px 0}',
    '.ark-chi-stage:not(.ark-holo-active) .ark-chi-projection,.ark-talent-demo:not(.ark-holo-active) .ark-demo-holo-window,.ark-chi-reserve-demo:not(.ark-holo-active) .ark-demo-holo-window,.ark-combat-demo:not(.ark-holo-active) .ark-demo-holo-window{display:none!important}',
    '.ark-talent-demo:not(.ark-holo-active) .ark-demo-transmitter,.ark-combat-demo:not(.ark-holo-active) .ark-demo-transmitter{visibility:hidden!important;opacity:0!important}',
    '.ark-talent-demo.ark-holo-active .ark-demo-transmitter,.ark-combat-demo.ark-holo-active .ark-demo-transmitter{visibility:visible!important;opacity:1!important;animation:ark-projector-arrive .55s ease-out both}',
    '.ark-talent-demo.ark-holo-active .ark-demo-projection-beam,.ark-combat-demo.ark-holo-active .ark-demo-projection-beam{animation:ark-beam-form .72s .42s ease-out both}',
    '.ark-talent-demo.ark-holo-active .ark-demo-holo-window,.ark-combat-demo.ark-holo-active .ark-demo-holo-window{animation:ark-holo-materialize .85s 1.02s cubic-bezier(.18,.72,.25,1) both}',
    '.ark-chi-stage.ark-holo-active .ark-chi-projection{animation:ark-holo-materialize .85s 1.02s cubic-bezier(.18,.72,.25,1) both}',
    '.ark-demo-composition{perspective:900px;isolation:isolate}',
    '.ark-demo-holo-window{position:relative;z-index:3!important;transform:translateZ(12px)}',
    '.ark-demo-transmitter{z-index:1!important;transform:perspective(700px) translateZ(-55px) scale(.88);filter:drop-shadow(0 12px 10px rgba(0,0,0,.55)) drop-shadow(0 0 9px rgba(93,210,255,.55))}',
    '.ark-demo-presenter-robot{visibility:hidden!important;opacity:0!important}',
    '.ark-chi-stage.ark-holo-active .ark-chi-robot,.ark-talent-demo.ark-holo-active .ark-demo-presenter-robot,.ark-combat-demo.ark-holo-active .ark-demo-presenter-robot{visibility:visible!important;opacity:1!important}',
    '.ark-home-follow-robot.ark-route-docked{opacity:0!important;transition:opacity .28s ease!important}',
    '.ark-home-follow-robot{opacity:1;transition:opacity .28s ease!important}',
    '.ark-demo-projection-beam{transform-origin:0 100%;clip-path:polygon(0 100%,0 100%,100% 100%,100% 100%)!important}',
    '.ark-home-message{height:0!important;min-height:0!important;max-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;opacity:0!important;visibility:hidden!important;transition:max-height .72s cubic-bezier(.2,.7,.2,1),padding .55s ease,margin .55s ease,opacity .3s ease}',
    '.ark-home-message.ark-is-speaking{height:auto!important;min-height:0!important;max-height:900px!important;margin:0 0 12px!important;padding:4px 8px 30px!important;overflow:visible!important;opacity:1!important;visibility:visible!important}',
    '#content{overflow-anchor:none!important}',
    '.ark-home-message,.ark-chi-stage,.ark-talent-demo,.ark-chi-reserve-demo,.ark-combat-demo{overflow-anchor:none!important}',
    '@keyframes ark-projector-arrive{from{opacity:0;transform:perspective(700px) translate3d(-10px,8px,-90px) scale(.72)}to{opacity:1;transform:perspective(700px) translateZ(-55px) scale(.88)}}',
    '@keyframes ark-beam-form{0%{clip-path:polygon(0 100%,0 100%,100% 100%,100% 100%);opacity:0}100%{clip-path:polygon(0 100%,0 0,100% 0,100% 100%);opacity:.8}}',
    '.ark-chi-stage.ark-holo-active .ark-chi-projection{display:flex;animation:ark-holo-materialize .78s cubic-bezier(.18,.72,.25,1) both}',
    '.ark-talent-demo.ark-holo-active .ark-demo-holo-window,.ark-chi-reserve-demo.ark-holo-active .ark-demo-holo-window,.ark-combat-demo.ark-holo-active .ark-demo-holo-window{display:block;animation:ark-holo-materialize .78s cubic-bezier(.18,.72,.25,1) both}',
    '.ark-chi-stage .ark-chi-robot,.ark-demo-presenter-robot{visibility:hidden!important}',
    '.ark-holo-active .ark-demo-holo-window:before,.ark-holo-active .ark-demo-holo-window:after{animation-duration:1.8s}',
    '@keyframes ark-holo-materialize{0%{opacity:0;clip-path:inset(48% 0 48% 0);filter:brightness(2.5) blur(5px);transform:perspective(700px) rotateX(12deg) scale(.94)}55%{opacity:.8;clip-path:inset(8% 0 8% 0);filter:brightness(1.6) blur(1px)}100%{opacity:1;clip-path:inset(0);filter:brightness(1) blur(0);transform:perspective(700px) rotateX(0) scale(1)}}',
    '.ark-home-message:before{content:"";position:absolute;z-index:3;top:-78px;right:43px;width:2px;height:84px;border-radius:3px;background:linear-gradient(to top,rgba(76,185,235,.95),rgba(76,185,235,.35));transform:rotate(5deg);transform-origin:bottom;box-shadow:0 0 6px rgba(74,190,255,.55)}',
    '.ark-home-message:after{content:"";position:absolute;z-index:4;top:-83px;right:39px;width:8px;height:8px;border-radius:50%;background:#9deaff;box-shadow:0 0 9px #54caff}',
    '.ark-home-message--left:before{left:43px;right:auto;transform:rotate(-5deg)}.ark-home-message--left:after{left:39px;right:auto}',
    '.ark-home-message--left .ark-home-message-bubble{margin-left:auto;margin-right:0;border-radius:13px 13px 4px 13px}',
    '.ark-scene[data-ark-scene="true"] .ark-scene-robot{visibility:hidden!important}.ark-scene[data-ark-scene="true"] .ark-scene-bubble{visibility:hidden!important;opacity:0;transition:opacity .28s ease}.ark-scene[data-ark-scene="true"].ark-is-speaking .ark-scene-bubble{visibility:visible!important;opacity:1}',
    '.ark-home-message{visibility:hidden!important;opacity:0!important;transition:opacity .28s ease}.ark-home-message.ark-is-speaking{visibility:visible!important;opacity:1!important}',
    '.ark-home-follow-robot{transition:none!important;transform-origin:50% 50%;will-change:transform;filter:drop-shadow(0 9px 9px rgba(0,0,0,.5)) drop-shadow(0 0 12px rgba(80,190,245,.55))}',
    '.ark-home-follow-robot>svg{animation:ark-home-levitate 2.8s ease-in-out infinite}',
    '.ark-home-follow-robot.ark-route-moving>svg{animation:ark-route-flight .42s ease-in-out infinite alternate}',
    '.ark-home-follow-smoke{opacity:.45;filter:blur(10px);animation:ark-home-follow-puff .75s ease-in-out infinite}',
    '.ark-route-trail{position:fixed;inset:0;z-index:79;width:100vw;height:100vh;pointer-events:none;opacity:0;overflow:visible;transition:opacity .25s ease}.ark-route-trail--active{opacity:1}.ark-route-trail path{fill:none;stroke:rgba(102,211,255,.68);stroke-width:5;stroke-linecap:round;stroke-dasharray:18 14;filter:blur(2px) drop-shadow(0 0 8px #49bfff);opacity:.9}.ark-route-trail:after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse,rgba(91,201,255,.12),transparent 65%);filter:blur(10px)}',
    '@keyframes ark-route-flight{from{transform:rotate(-7deg) translateY(1px)}to{transform:rotate(7deg) translateY(-5px)}}@keyframes ark-route-dash{0%{stroke-dashoffset:160;opacity:0}18%{opacity:1}100%{stroke-dashoffset:0;opacity:.35}}',
    '@media(prefers-reduced-motion:reduce){.ark-home-follow-robot>svg,.ark-home-follow-smoke,.ark-route-trail path{animation:none!important;transition:none!important}}',
    '.ark-home-follow-robot{position:fixed;left:0;top:0;z-index:80;display:none;place-items:center;pointer-events:none;will-change:transform;transition:transform .32s cubic-bezier(.2,.75,.25,1);filter:drop-shadow(0 9px 9px rgba(0,0,0,.5)) drop-shadow(0 0 12px rgba(80,190,245,.48))}',
    '.ark-home-follow-robot>svg{position:relative;z-index:2;width:100%;height:100%;overflow:visible;animation:ark-home-levitate 3.4s ease-in-out infinite}',
    '.ark-home-follow-smoke{position:absolute;z-index:1;left:50%;top:72%;width:46px;height:35px;border-radius:50%;background:radial-gradient(ellipse,rgba(101,211,255,.48),rgba(49,160,235,.2) 48%,transparent 75%);filter:blur(8px);animation:ark-home-follow-puff 1.8s ease-in-out infinite}',
    '.ark-home-follow-smoke--one{transform:translate(-90%,-20%) scale(1.1)}.ark-home-follow-smoke--two{transform:translate(0,10%) scale(.75);animation-delay:-.9s}',
    '.ark-route-trail{position:fixed;inset:0;z-index:79;pointer-events:none;overflow:visible;opacity:1!important}',
    '.ark-smoke-puff{position:absolute;width:15px;height:10px;border-radius:50%;background:radial-gradient(ellipse at 45% 45%,rgba(222,249,255,.96),rgba(103,211,255,.78) 42%,rgba(44,153,226,.22) 76%,transparent 100%);filter:blur(1.5px) drop-shadow(0 0 5px rgba(82,193,255,.48));opacity:0;transform:translate(-50%,-50%) scale(.48);animation:ark-cartoon-smoke .58s ease-out forwards}',
    '.ark-smoke-puff:before,.ark-smoke-puff:after{content:"";position:absolute;border-radius:50%;background:inherit;filter:blur(1px)}.ark-smoke-puff:before{width:9px;height:8px;left:-3px;top:-3px}.ark-smoke-puff:after{width:9px;height:8px;right:-3px;top:-2px}',
    '.ark-home-follow-robot.ark-route-disintegrating{animation:ark-robot-data-break .68s ease-in forwards!important;pointer-events:none!important}@keyframes ark-robot-data-break{0%{opacity:1;filter:brightness(1) drop-shadow(0 0 12px #55caff);transform:scale(1)}35%{opacity:.9;filter:brightness(2.8) blur(1px) drop-shadow(0 0 18px #55caff)}100%{opacity:0;filter:brightness(3) blur(7px);scale:.18}}',
    '.ark-data-snowfall{position:fixed;inset:0;z-index:78;overflow:hidden;pointer-events:none;contain:strict}.ark-data-snowflake{position:absolute;top:var(--snow-y);left:var(--snow-x);width:var(--snow-size);height:var(--snow-size);border-radius:1px;background:linear-gradient(135deg,#e5fbff,#65d4ff 58%,#258fe0);box-shadow:0 0 7px rgba(92,207,255,.8),0 0 15px rgba(48,158,255,.38);opacity:0;transform:translate3d(0,-15px,0) rotate(0deg);animation:ark-data-snow-fall var(--snow-duration) linear var(--snow-delay) forwards}.ark-data-snowflake:nth-child(3n){border-radius:50%;width:calc(var(--snow-size)*.72);height:calc(var(--snow-size)*.72);filter:blur(.35px)}.ark-data-snowflake:nth-child(4n){width:2px;height:12px;border-radius:2px;opacity:.8}.ark-data-snowfall:after{content:"";position:absolute;left:var(--snow-origin-x,50%);top:var(--snow-origin-y,50%);width:100px;height:100px;border-radius:50%;background:radial-gradient(circle,rgba(103,216,255,.28),rgba(61,170,255,.1) 38%,transparent 72%);transform:translate(-50%,-50%);animation:ark-data-snow-flash .8s ease-out forwards}',
    '@keyframes ark-data-snow-fall{0%{opacity:0;transform:translate3d(0,-18px,0) rotate(0deg)}8%{opacity:.95}70%{opacity:.82}100%{opacity:0;transform:translate3d(var(--snow-drift),110vh,0) rotate(var(--snow-spin))}}@keyframes ark-data-snow-flash{0%{opacity:1;scale:.15}100%{opacity:0;scale:2.8}}',
    '@keyframes ark-cartoon-smoke{0%{opacity:0;transform:translate(-50%,-50%) scale(.42)}22%{opacity:.82}62%{opacity:.58}100%{opacity:0;transform:translate(-50%,-62%) scale(.9)}}',
    '.ark-page-scroll-locked{overflow:hidden!important;overscroll-behavior:none!important;touch-action:none!important}.ark-transfer-box--bottom{margin:32px auto 24px;clear:both}.ark-transfer-snow{position:absolute;inset:auto 0 0;height:30px;pointer-events:none;animation:ark-transfer-snow-gather .9s ease-in forwards}.ark-transfer-snow i{position:absolute;bottom:0;display:block;width:36px;height:10px;border-radius:50%;background:radial-gradient(ellipse,#e9fbff 0 20%,#8ddfff 58%,transparent 100%);filter:drop-shadow(0 0 5px #6dcfff);animation:ark-transfer-snow-gather .9s ease-in forwards}@keyframes ark-transfer-snow-gather{to{opacity:0;transform:translate3d(0,-25px,0) scale(.15)}}.ark-transfer-box{position:relative;z-index:12;top:auto;left:auto;width:154px;margin:20px auto 14px;transform:none;padding:8px 9px 9px;transform:translateX(-50%);border:1px solid rgba(104,210,255,.5);border-radius:78px 78px 13px 13px;background:linear-gradient(155deg,rgba(8,32,50,.96),rgba(3,13,24,.98));box-shadow:0 10px 34px rgba(0,0,0,.38),0 0 20px rgba(64,177,235,.15);text-align:center;pointer-events:none;overflow:hidden;transition:box-shadow .25s ease,border-color .25s ease}',
    '.ark-home-intro{display:grid;grid-template-columns:92px minmax(0,1fr);align-items:center;gap:13px;min-height:142px;max-width:760px;margin:0 auto 24px;padding:12px 18px;border:1px solid rgba(84,178,226,.25);border-radius:13px;background:linear-gradient(112deg,rgba(11,30,46,.88),rgba(7,17,28,.94));overflow:visible}.ark-home-intro[hidden]{display:none!important}.ark-home-intro-copy{min-width:0;padding:12px 15px;border:1px solid rgba(91,177,232,.32);border-radius:12px;background:rgba(7,20,32,.82);color:#c8dced;font-size:12px;line-height:1.65;opacity:0;transform:translateY(8px);transition:opacity .38s ease,transform .42s ease}.ark-home-intro-copy:before{content:"A.R.K. / ASSISTENTE DA AGÊNCIA";display:block;margin-bottom:6px;color:#8dd4ff;font:700 9px var(--mono,monospace);letter-spacing:1px}.ark-home-intro-copy p{margin:0 0 6px}.ark-home-intro-copy p:last-child{margin-bottom:0}.ark-home-intro.ark-is-speaking .ark-home-intro-copy{opacity:1;transform:translateY(0)}.ark-home-intro .ark-home-intro-mark{width:100%;height:100%;min-height:100px;display:block;pointer-events:none}@media(max-width:650px){.ark-home-intro{grid-template-columns:70px minmax(0,1fr);gap:8px;min-height:130px;padding:9px;margin-bottom:19px}.ark-home-intro-copy{padding:10px;font-size:10px;line-height:1.55}.ark-home-intro-copy:before{font-size:8px;letter-spacing:.6px}}',
    '.ark-transfer-frame{position:relative;height:94px;margin:0 auto 5px;border:1px solid rgba(110,213,255,.32);border-radius:58px 58px 8px 8px;background:radial-gradient(ellipse at 50% 68%,rgba(62,174,230,.24),rgba(6,22,36,.28) 72%);box-shadow:inset 0 0 22px rgba(76,190,244,.12);overflow:hidden}.ark-transfer-door-core{position:absolute;inset:8px 13px 0;border:1px solid rgba(123,218,255,.2);border-bottom:0;border-radius:48px 48px 0 0;background:linear-gradient(180deg,rgba(83,190,238,.12),rgba(12,47,69,.08));box-shadow:0 0 18px rgba(69,184,240,.13),inset 0 0 18px rgba(76,190,244,.12)}.ark-transfer-door-core:before{content:"";position:absolute;left:50%;top:19px;width:31px;height:31px;transform:translateX(-50%);border:1px solid rgba(139,225,255,.5);border-radius:50%;box-shadow:0 0 13px rgba(83,194,255,.34),inset 0 0 12px rgba(83,194,255,.2)}.ark-transfer-door-core:after{content:"A.R.K.";position:absolute;left:0;right:0;bottom:12px;color:rgba(155,226,255,.6);font:700 7px var(--mono,monospace);letter-spacing:1.5px}',
    '.ark-transfer-robot{position:absolute;inset:7px 39px;width:76px;height:80px;display:grid;place-items:center;filter:drop-shadow(0 0 12px rgba(86,204,255,.72));opacity:0}.ark-transfer-robot svg{width:100%;height:100%;overflow:visible}.ark-transfer-box--idle .ark-transfer-robot{opacity:0}.ark-transfer-box--idle .ark-transfer-door-core{opacity:1}.ark-transfer-box--leaving .ark-transfer-door-core,.ark-transfer-box--arriving .ark-transfer-door-core{opacity:.18}.ark-transfer-box--leaving,.ark-transfer-box--arriving{border-color:rgba(128,222,255,.82);box-shadow:0 12px 38px rgba(0,0,0,.45),0 0 30px rgba(64,177,235,.34)}.ark-transfer-box--idle .ark-transfer-status{color:#8dc8e5}.ark-route-entering-door{transition:transform .48s cubic-bezier(.2,.7,.2,1)!important}.ark-route-exiting-door{animation:ark-door-exit .42s cubic-bezier(.2,.7,.2,1) both}@keyframes ark-door-exit{from{opacity:0;translate:0 -13px}to{opacity:1;translate:0 22px}}',
    '.ark-transfer-pixel{position:absolute;left:50%;top:50%;width:5px;height:5px;border-radius:1px;background:#9beaff;box-shadow:0 0 7px #50bfff;opacity:0;transform:translate(-50%,-50%)}',
    '.ark-transfer-status{color:#a8e6ff;font:700 8px var(--mono,monospace);letter-spacing:.75px;white-space:nowrap}.ark-transfer-substatus{margin-top:3px;color:#6f9db9;font:600 7px var(--mono,monospace);letter-spacing:.55px}',
    '.ark-transfer-box--leaving .ark-transfer-robot{animation:ark-transfer-disintegrate .78s ease-in forwards}.ark-transfer-box--leaving .ark-transfer-pixel{animation:ark-transfer-pixel-out .72s ease-out forwards;animation-delay:var(--out-delay);animation-fill-mode:both}',
    '.ark-transfer-box--arriving .ark-transfer-robot{opacity:0;animation:ark-transfer-rebuild .82s cubic-bezier(.16,.72,.25,1) .08s both}.ark-transfer-box--arriving .ark-transfer-pixel{opacity:0;animation:ark-transfer-pixel-in .72s cubic-bezier(.16,.72,.25,1) var(--in-delay) both}',
    '.ark-transfer-box--departing{animation:ark-transfer-box-out .3s ease-in forwards}',
    '@keyframes ark-transfer-disintegrate{0%{opacity:1;filter:brightness(1)}35%{filter:brightness(2.8) saturate(1.7)}100%{opacity:0;filter:brightness(3) blur(5px);transform:scale(.82)}}',
    '@keyframes ark-transfer-rebuild{0%{opacity:0;filter:brightness(3) blur(7px);transform:scale(.78)}55%{opacity:.72;filter:brightness(1.8) blur(2px)}100%{opacity:1;filter:brightness(1);transform:scale(1)}}',
    '@keyframes ark-transfer-pixel-out{0%{opacity:0;transform:translate(-50%,-50%) scale(.4)}20%{opacity:1}100%{opacity:0;transform:translate(calc(-50% + var(--px)),calc(-50% + var(--py))) scale(.2)}}',
    '@keyframes ark-transfer-pixel-in{0%{opacity:0;transform:translate(calc(-50% + var(--px)),calc(-50% + var(--py))) scale(.2)}35%{opacity:1}100%{opacity:0;transform:translate(-50%,-50%) scale(.35)}}',
    '@keyframes ark-transfer-box-out{to{opacity:0;transform:translate(-50%,-18px) scale(.94)}}',
    '@media(max-width:650px){.ark-transfer-box{top:auto;width:146px;margin:16px auto 12px}.ark-transfer-frame{height:86px}.ark-transfer-robot{inset:5px 35px;width:70px;height:74px}}',

    '@keyframes ark-home-levitate{0%,100%{margin-top:0}50%{margin-top:-7px}}@keyframes ark-home-follow-puff{0%,100%{opacity:.25;scale:.75}50%{opacity:.9;scale:1.25}}',
    '@media(max-width:650px){.ark-home-drawer{min-height:158px!important;padding-bottom:20px!important}.ark-home-drawer--right{padding-right:84px!important}.ark-home-drawer--left{padding-left:84px!important}.ark-home-message{min-height:102px;padding:3px 2px 24px}.ark-home-message-bubble{padding:11px 12px}.ark-home-message-bubble p{font-size:11px}.ark-home-message:before{top:-70px;height:76px;right:35px}.ark-home-message:after{top:-75px;right:31px}.ark-home-message--left:before{left:35px;right:auto}.ark-home-message--left:after{left:31px;right:auto}}',
    '@media(prefers-reduced-motion:reduce){.ark-home-follow-robot,.ark-home-follow-robot>svg,.ark-home-follow-smoke{animation:none!important;transition:none!important}}',
  ].join('\n');
  var style = document.createElement('style');
  style.id = 'ark-scene-layout-styles';
  style.textContent = css;
  document.head.appendChild(style);

  var arkCharacterStyle = document.createElement('style');
  arkCharacterStyle.id = 'ark-character-animation-styles';
  arkCharacterStyle.textContent = [
    '.ark-arm{transform-box:fill-box;transform-origin:50% 50%;animation:ark-arm-drift 4.8s ease-in-out infinite}',
    '.ark-arm--right{animation-delay:-2.4s}',
    '.ark-visor-glint{animation:ark-visor-shine 5.6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}',
    '.ark-eye{transform-box:fill-box;transform-origin:center;animation:ark-eye-blink 5.8s ease-in-out infinite}',
    '.ark-eye--right{animation-delay:.08s}',
    '.ark-core-light{transform-box:fill-box;transform-origin:center;animation:ark-core-breathe 3.2s ease-in-out infinite}',
    '@keyframes ark-arm-drift{0%,100%{transform:translateY(0) rotate(0)}50%{transform:translateY(-2px) rotate(2deg)}}',
    '@keyframes ark-visor-shine{0%,72%,100%{opacity:.3;transform:translateX(-3px)}38%{opacity:.9;transform:translateX(3px)}}',
    '@keyframes ark-eye-blink{0%,91%,94%,100%{transform:scaleY(1)}92%,93%{transform:scaleY(.12)}}',
    '@keyframes ark-core-breathe{0%,100%{opacity:.78;filter:brightness(1)}50%{opacity:1;filter:brightness(1.35)}}',
    '@media(prefers-reduced-motion:reduce){.ark-arm,.ark-visor-glint,.ark-eye,.ark-core-light{animation:none!important}}'
  ].join('\\n');
  document.head.appendChild(arkCharacterStyle);

  var robotSvg = '<svg viewBox="0 0 180 190" role="img" aria-label="A.R.K., androide branco flutuante de silhueta humanoide, visor escuro e olhos azuis expressivos">' +
    '<defs><linearGradient id="ark-shell-v6" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff"/><stop offset=".48" stop-color="#f2f9fd"/><stop offset="1" stop-color="#b6cfdd"/></linearGradient><linearGradient id="ark-shell-edge-v6" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#bcd5e2"/></linearGradient><linearGradient id="ark-visor-v6" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#173b55"/><stop offset=".5" stop-color="#061a2a"/><stop offset="1" stop-color="#020b15"/></linearGradient><radialGradient id="ark-eye-v6"><stop stop-color="#fff"/><stop offset=".32" stop-color="#b7f5ff"/><stop offset="1" stop-color="#168bd3"/></radialGradient><linearGradient id="ark-core-v6" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#e9ffff"/><stop offset=".48" stop-color="#78e8ff"/><stop offset="1" stop-color="#168bc4"/></linearGradient><filter id="ark-glow-v6"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
    '<ellipse cx="90" cy="180" rx="31" ry="4.5" fill="#39b9f4" opacity=".18"/><ellipse cx="90" cy="178" rx="17" ry="2" fill="#b7efff" opacity=".72"/>' +
    '<g class="ark-arm ark-arm--left"><path d="M64 101Q54 100 49 111L39 133Q36 141 42 145Q49 149 54 140L68 115Z" fill="url(#ark-shell-v6)" stroke="#9ebaca" stroke-width="1.8" stroke-linejoin="round"/><circle cx="56" cy="108" r="7" fill="url(#ark-shell-edge-v6)" stroke="#91afc1" stroke-width="1.4"/><path d="M40 134L37 141" stroke="#79dfff" stroke-width="2.5" stroke-linecap="round"/></g>' +
    '<g class="ark-arm ark-arm--right"><path d="M116 101Q126 100 131 111L141 133Q144 141 138 145Q131 149 126 140L112 115Z" fill="url(#ark-shell-v6)" stroke="#9ebaca" stroke-width="1.8" stroke-linejoin="round"/><circle cx="124" cy="108" r="7" fill="url(#ark-shell-edge-v6)" stroke="#91afc1" stroke-width="1.4"/><path d="M140 134L143 141" stroke="#79dfff" stroke-width="2.5" stroke-linecap="round"/></g>' +
    '<path d="M69 94Q59 98 57 113L52 148Q51 159 65 166Q90 178 115 166Q129 159 128 148L123 113Q121 98 111 94Q90 102 69 94Z" fill="url(#ark-shell-v6)" stroke="#9ebaca" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M68 103Q90 112 112 103" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".94"/><path d="M61 147Q90 160 119 147" fill="none" stroke="#8bb9cd" stroke-width="1.7" stroke-linecap="round" opacity=".85"/>' +
    '<path d="M78 113Q90 118 102 113L101 145Q90 151 79 145Z" fill="#dceef5" stroke="#9fc8d9" stroke-width="1.2"/><rect class="ark-core-light" x="85" y="119" width="10" height="23" rx="5" fill="url(#ark-core-v6)" filter="url(#ark-glow-v6)"/><path d="M88 124H92M88 131H92M88 138H92" stroke="#f1ffff" stroke-width="1.5" stroke-linecap="round"/>' +
    '<path d="M72 157Q90 165 108 157" fill="none" stroke="#77dfff" stroke-width="2" stroke-linecap="round" opacity=".8"/><path d="M78 169Q90 173 102 169" fill="none" stroke="#8ce7ff" stroke-width="2" stroke-linecap="round" opacity=".9"/>' +
    '<path d="M90 12C66 12 50 26 49 48L49 70C49 88 64 99 90 101C116 99 131 88 131 70L131 48C130 26 114 12 90 12Z" fill="url(#ark-shell-edge-v6)" stroke="#9ebaca" stroke-width="2"/>' +
    '<path d="M58 34Q70 17 90 17Q110 17 122 34" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" opacity=".96"/>' +
    '<path d="M51 47Q90 35 129 47L127 76Q90 90 53 76Z" fill="url(#ark-visor-v6)" stroke="#5e8da7" stroke-width="1.6"/>' +
    '<path class="ark-visor-glint" d="M59 49Q90 40 121 49" fill="none" stroke="#c0f4ff" stroke-width="1.6" stroke-linecap="round" opacity=".72"/>' +
    '<ellipse class="ark-eye ark-eye--left" cx="71" cy="63" rx="8" ry="11.5" fill="url(#ark-eye-v6)" filter="url(#ark-glow-v6)"/><ellipse class="ark-eye ark-eye--right" cx="109" cy="63" rx="8" ry="11.5" fill="url(#ark-eye-v6)" filter="url(#ark-glow-v6)"/>' +
    '<circle cx="68.5" cy="59" r="2.4" fill="#fff" opacity=".96"/><circle cx="106.5" cy="59" r="2.4" fill="#fff" opacity=".96"/>' +
    '<path d="M81 84Q90 89 99 84" fill="none" stroke="#7fe2ff" stroke-width="1.8" stroke-linecap="round" opacity=".9"/>' +
    '<path d="M90 12V7" stroke="#8bdcff" stroke-width="2" stroke-linecap="round"/><circle cx="90" cy="6" r="3.5" fill="#8be7ff" filter="url(#ark-glow-v6)"/>' +
    '<path d="M66 91L72 97M114 91L108 97" stroke="#8bdcff" stroke-width="2" stroke-linecap="round" opacity=".9"/></svg>';

  var arkHologramSvg = '<svg viewBox="0 0 140 150" role="img" aria-label="Modelo antigo do A.R.K. usado como representação holográfica">' +
    '<defs><linearGradient id="ark-shell-v2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".58" stop-color="#e6f3fa"/><stop offset="1" stop-color="#a9c7d9"/></linearGradient><linearGradient id="ark-screen-v2" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#123e60"/><stop offset="1" stop-color="#061827"/></linearGradient><filter id="ark-glow-v2"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
    '<ellipse cx="70" cy="137" rx="35" ry="6" fill="#49b9f5" opacity=".25"/><ellipse cx="70" cy="134" rx="25" ry="3.5" fill="#80d8ff" opacity=".65"/>' +
    '<path d="M70 7V17" stroke="#bdeeff" stroke-width="3" stroke-linecap="round"/><circle cx="70" cy="6" r="4" fill="#64caff" filter="url(#ark-glow-v2)"/>' +
    '<path d="M48 77L31 83L22 100M92 77L109 83L118 100" fill="none" stroke="#d9e9f2" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><circle cx="31" cy="84" r="6" fill="#f7fcff" stroke="#8eafc2" stroke-width="2"/><circle cx="109" cy="84" r="6" fill="#f7fcff" stroke="#8eafc2" stroke-width="2"/><path d="M17 99l5 7 6-6M112 100l6 6 5-7" fill="none" stroke="#dff4ff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<rect x="43" y="65" width="54" height="55" rx="19" fill="url(#ark-shell-v2)" stroke="#91b4c9" stroke-width="2"/><path d="M52 86Q70 76 88 86" fill="none" stroke="#fff" stroke-width="4" opacity=".8"/><rect x="60" y="91" width="20" height="15" rx="5" fill="#d5efff" stroke="#78b9df"/><path d="M65 98h10" stroke="#2699d6" stroke-width="2.5" stroke-linecap="round"/>' +
    '<rect x="35" y="18" width="70" height="57" rx="25" fill="url(#ark-shell-v2)" stroke="#8eafc2" stroke-width="2"/><path d="M46 31Q70 18 94 31" fill="none" stroke="#fff" stroke-width="5" opacity=".9"/><rect x="44" y="36" width="52" height="25" rx="10" fill="url(#ark-screen-v2)" stroke="#4d91b7" stroke-width="1.5"/><circle cx="58" cy="48.5" r="4" fill="#7de0ff" filter="url(#ark-glow-v2)"/><circle cx="82" cy="48.5" r="4" fill="#7de0ff" filter="url(#ark-glow-v2)"/><path d="M64 57h12" stroke="#55b8ed" stroke-width="1.5" stroke-linecap="round" opacity=".8"/>' +
    '<path d="M35 47h-5M105 47h5" stroke="#9fdcf8" stroke-width="3" stroke-linecap="round"/><circle cx="70" cy="76" r="3" fill="#5dbff1"/><path d="M57 120v5M83 120v5" stroke="#7ec9ed" stroke-width="3" stroke-linecap="round"/></svg>';


  var rankStyle = document.createElement('style');
  rankStyle.id = 'ark-rank-podium-styles';
  rankStyle.textContent = [
    '.ark-rank-podium{position:relative;isolation:isolate;display:grid;grid-template-columns:1fr 1.16fr 1fr;align-items:end;gap:12px;margin:24px 0 30px;padding:28px 18px 18px;border:1px solid rgba(94,180,226,.32);border-radius:18px;background:radial-gradient(ellipse at 50% 32%,rgba(31,119,169,.2),transparent 56%),linear-gradient(145deg,#0b2031,#06111d);overflow:hidden}',
    '.ark-rank-podium:before{content:"RANKING  /  HIERARQUIA SUPERIOR";position:absolute;top:13px;left:0;right:0;text-align:center;color:#8dbbd5;font:700 9px var(--mono,monospace);letter-spacing:2px}',
    '.ark-rank-podium:after{content:"";position:absolute;inset:0;background:linear-gradient(115deg,transparent 25%,rgba(130,218,255,.045) 50%,transparent 75%);background-size:220% 100%;animation:ark-podium-sheen 8s linear infinite;pointer-events:none}',
    '.ark-rank-card{position:relative;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;min-width:0;text-align:center}',
    '.ark-rank-card--first{transform:translateY(-15px)}',
    '.ark-rank-title{position:relative;display:block;margin:0 0 8px;font:900 clamp(15px,2.5vw,22px)/1.1 var(--display,Arial),sans-serif;letter-spacing:1.5px;text-transform:uppercase}',
    '.ark-rank-title--pillar{color:#ff594f;text-shadow:0 0 5px #ff392b,0 0 13px #ff351d,0 0 24px #f30;animation:ark-pillar-fire 1.35s ease-in-out infinite alternate}',
    '.ark-rank-title--lord{color:#ffe39a;text-shadow:0 0 5px #ffd15b,0 0 14px #d99a24;animation:ark-lord-electric 1.8s steps(2,end) infinite}',
    '.ark-rank-title--sentinel{color:#a6f5d9;text-shadow:0 0 6px #52d9b2,0 0 15px #178b78;animation:ark-sentinel-aura 2.6s ease-in-out infinite}',
    '.ark-rank-title--pillar:after,.ark-rank-title--lord:after,.ark-rank-title--sentinel:after{content:"";position:absolute;inset:-7px -12px;z-index:-1;pointer-events:none}',
    '.ark-rank-title--pillar:after{background:radial-gradient(ellipse,rgba(255,76,25,.25),transparent 70%);filter:blur(5px);animation:ark-flame-halo .9s ease-in-out infinite alternate}',
    '.ark-rank-title--lord:after{background:linear-gradient(115deg,transparent 15%,rgba(255,245,185,.0) 38%,rgba(255,245,185,.9) 50%,transparent 62%);background-size:220% 100%;animation:ark-lightning 2.2s linear infinite}',
    '.ark-rank-title--sentinel:after{background:linear-gradient(115deg,transparent 20%,rgba(174,255,225,.78) 50%,transparent 80%);background-size:220% 100%;animation:ark-sentinel-shimmer 3s linear infinite}',
    '.ark-rank-robot{width:min(100%,132px);height:142px;display:grid;place-items:center;filter:drop-shadow(0 7px 15px rgba(78,190,244,.24));animation:ark-rank-float 3.5s ease-in-out infinite}',
    '.ark-rank-card--first .ark-rank-robot{width:min(100%,154px);height:164px;filter:drop-shadow(0 0 15px rgba(255,83,52,.25))}',
    '.ark-rank-robot svg{width:100%;height:100%;overflow:visible}',
    '.ark-rank-plinth{position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:72px;margin-top:3px;border:1px solid rgba(112,181,215,.3);border-bottom:0;border-radius:8px 8px 0 0;background:linear-gradient(150deg,rgba(40,87,116,.82),rgba(11,32,49,.96));box-shadow:inset 0 1px rgba(220,247,255,.14),0 -8px 22px rgba(40,154,212,.08)}',
    '.ark-rank-card--first .ark-rank-plinth{height:112px;border-color:rgba(255,220,126,.72);background:linear-gradient(150deg,rgba(150,111,36,.96),rgba(48,34,12,.99));box-shadow:inset 0 1px rgba(255,245,202,.28),0 -8px 25px rgba(255,194,62,.16)}',
    '.ark-rank-card--second .ark-rank-plinth{height:88px;border-color:rgba(210,225,235,.58);background:linear-gradient(150deg,rgba(112,132,145,.92),rgba(29,40,49,.99))}',
    '.ark-rank-card--third .ark-rank-plinth{height:66px;border-color:rgba(206,139,102,.56);background:linear-gradient(150deg,rgba(125,75,48,.92),rgba(39,24,20,.99))}',
    '.ark-rank-plinth b{width:44px;height:44px;display:grid;place-items:center;border:2px solid rgba(255,255,255,.48);border-radius:50%;background:radial-gradient(circle at 34% 25%,#fff,#91a8b8 56%,#425563);color:#f5fbff;font:800 19px var(--display,Arial);text-shadow:0 2px 8px #0008;box-shadow:inset 0 1px 3px #fff9,0 4px 12px #0006}',
    '.ark-rank-card--first .ark-rank-plinth b{width:52px;height:52px;font-size:22px;border-color:#ffe6a0;background:radial-gradient(circle at 34% 25%,#fff4c7,#d6a83f 56%,#775018);color:#fff5cf}.ark-rank-card--second .ark-rank-plinth b{border-color:#e7f2f8;background:radial-gradient(circle at 34% 25%,#fff,#b7c5ce 56%,#637784);color:#fff}.ark-rank-card--third .ark-rank-plinth b{border-color:#e9b18d;background:radial-gradient(circle at 34% 25%,#ffe1c9,#b97850 56%,#633c2a);color:#fff0e4}',
    '.ark-rank-caption{margin-top:8px;color:#91b4ca;font:700 8px var(--mono,monospace);letter-spacing:1px}',
    '@keyframes ark-podium-sheen{0%{background-position:120% 0}100%{background-position:-120% 0}}',
    '@keyframes ark-rank-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}',
    '@keyframes ark-pillar-fire{0%{text-shadow:0 0 4px #ff6a35,0 0 10px #ff351d,0 3px 16px #f30}100%{text-shadow:0 -2px 7px #ffd06a,0 0 17px #ff351d,0 4px 24px #e20}}',
    '@keyframes ark-flame-halo{from{opacity:.45;transform:scale(.9)}to{opacity:1;transform:scale(1.12)}}',
    '@keyframes ark-lord-electric{0%,18%,22%,65%,70%,100%{filter:brightness(1);text-shadow:0 0 5px #ffe39a,0 0 14px #d99a24}20%,68%{filter:brightness(1.7);text-shadow:0 0 8px #fff6c7,0 0 22px #ffbf36,2px 0 3px #fff}}',
    '@keyframes ark-lightning{0%{background-position:120% 0;opacity:0}18%{opacity:.8}38%{opacity:0}100%{background-position:-120% 0;opacity:0}}',
    '@keyframes ark-sentinel-aura{0%,100%{filter:brightness(1);text-shadow:0 0 6px #52d9b2,0 0 15px #178b78}50%{filter:brightness(1.5);text-shadow:0 0 10px #d9fff1,0 0 23px #32d8aa}}',
    '@keyframes ark-sentinel-shimmer{0%{background-position:120% 0;opacity:0}20%{opacity:.8}42%{opacity:0}100%{background-position:-120% 0;opacity:0}}',
    '@media(max-width:560px){.ark-rank-podium{gap:5px;padding:28px 8px 12px;margin:18px -2px 24px}.ark-rank-card--first{transform:translateY(-9px)}.ark-rank-title{font-size:clamp(10px,3.1vw,15px);letter-spacing:.6px;margin-bottom:5px}.ark-rank-robot{height:105px}.ark-rank-card--first .ark-rank-robot{height:124px}.ark-rank-plinth{height:54px}.ark-rank-card--first .ark-rank-plinth{height:82px}.ark-rank-card--second .ark-rank-plinth{height:67px}.ark-rank-card--third .ark-rank-plinth{height:48px}.ark-rank-plinth b{font-size:17px}.ark-rank-card--first .ark-rank-plinth b{font-size:22px}.ark-rank-caption{font-size:6px;letter-spacing:.3px}}',
    '@media(prefers-reduced-motion:reduce){.ark-rank-podium:after,.ark-rank-title,.ark-rank-title:after,.ark-rank-robot{animation:none!important}}'
  ].join('\n');
  document.head.appendChild(rankStyle);

  function addRankPodium(content) {
    if (!content || content.querySelector('[data-ark-key="rank-podium"]')) return;
    var holder = document.createElement('div');
    holder.innerHTML = '<section class="ark-rank-podium" data-ark-scene="true" data-ark-key="rank-podium" aria-label="Pódio dos três maiores ranks">' +
      '<article class="ark-rank-card ark-rank-card--second"><h3 class="ark-rank-title ark-rank-title--lord">LORD</h3><div class="ark-rank-robot" aria-hidden="true">' + robotSvg + '</div><div class="ark-rank-plinth"><b>2º</b></div><div class="ark-rank-caption">SEGUNDO LUGAR</div></article>' +
      '<article class="ark-rank-card ark-rank-card--first"><h3 class="ark-rank-title ark-rank-title--pillar">PILAR</h3><div class="ark-rank-robot" aria-hidden="true">' + robotSvg + '</div><div class="ark-rank-plinth"><b>1º</b></div><div class="ark-rank-caption">PRIMEIRO LUGAR</div></article>' +
      '<article class="ark-rank-card ark-rank-card--third"><h3 class="ark-rank-title ark-rank-title--sentinel">SENTINELA</h3><div class="ark-rank-robot" aria-hidden="true">' + robotSvg + '</div><div class="ark-rank-plinth"><b>3º</b></div><div class="ark-rank-caption">TERCEIRO LUGAR</div></article>' +
      '</section>';
    var anchor = content.querySelector('.panel') || content.querySelector('.rows') || content.firstElementChild;
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(holder.firstElementChild, anchor);
    else content.appendChild(holder.firstElementChild);
  }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function scene(key, message, variant) {
    var cls = 'ark-scene' + (variant ? ' ark-scene--' + variant : '');
    return '<aside class="' + cls + '" data-ark-scene="true" data-ark-key="' + esc(key) + '">' +
      '<div class="ark-scene-robot" aria-hidden="true">' + robotSvg + (variant === 'fencer' ? '<span class="ark-bamboo-sword"><i class="blade"></i><i class="guard"></i><i class="handle"></i></span>' : '') + '</div>' +
      '<div class="ark-scene-bubble"><p>' + esc(message) + '</p></div></aside>';
  }
  function addAfter(target, key, message, variant) {
    if (!target || !target.parentNode) return;
    var content = document.getElementById('content');
    if (!content || content.querySelector('[data-ark-key="' + key + '"]')) return;
    var holder = document.createElement('div');
    holder.innerHTML = scene(key, message, variant);
    target.parentNode.insertBefore(holder.firstElementChild, target.nextSibling);
  }
  function addBefore(target, key, message, variant) {
    if (!target || !target.parentNode) return;
    var content = document.getElementById('content');
    if (!content || content.querySelector('[data-ark-key="' + key + '"]')) return;
    var holder = document.createElement('div');
    holder.innerHTML = scene(key, message, variant);
    target.parentNode.insertBefore(holder.firstElementChild, target);
  }
  function activeId() {
    try { if (typeof current !== 'undefined' && current) return current; } catch (_) {}
    var title = document.getElementById('title');
    var value = title ? title.textContent.trim() : '';
    try {
      if (typeof pages !== 'undefined') {
        var keys = Object.keys(pages);
        for (var i = 0; i < keys.length; i++) if (pages[keys[i]] && pages[keys[i]].title === value) return keys[i];
      }
    } catch (_) {}
    return 'overview';
  }
  function updateBackButton(id) {
    var button = document.getElementById('backFloat');
    if (!button) return;
    if (id === 'overview') {
      button.style.display = 'none';
      return;
    }
    button.textContent = '← VOLTAR';
    button.setAttribute('aria-label', 'Voltar à página anterior');
    button.title = 'Voltar à página anterior';
    button.style.display = 'inline-flex';
  }
  function addTalentTrio(content) {
    var rows = content.querySelector('.rows');
    if (!rows || content.querySelector('[data-ark-key="talent-classes"]')) return;
    var holder = document.createElement('div');
    holder.innerHTML = '<div class="ark-scene-trio">' +
      scene('talent-corporal','Corporal: esta classe se manifesta no próprio corpo. O Chi pode aprimorar capacidades e alterar características corporais, sempre respeitando os limites do personagem.','compact') +
      scene('talent-influencia','Influência: o efeito alcança algo além do corpo do usuário. O controle adequado é importante para preservar a eficiência da manifestação.','compact') +
      scene('talent-existencia','Existência: envolve manifestações que afetam a própria existência. Consulte as especializações e os limites registrados antes de definir um efeito.','compact') +
      '</div>';
    rows.parentNode.insertBefore(holder.firstElementChild, rows.nextSibling);
  }


  function addChiReserveHoloDemo(content) {
    if (!content || content.querySelector('[data-ark-chi-reserve-demo="true"]')) return;
    var stage = document.createElement('section');
    stage.className = 'ark-talent-demo ark-chi-reserve-demo';
    stage.setAttribute('data-ark-chi-reserve-demo', 'true');
    stage.innerHTML =
      '<h3>RESERVA E EMISSÃO DE CHI</h3>' +
      '<div class="ark-demo-composition"><div class="ark-demo-holo-window">' +
      '<span class="ark-demo-transmission">A.R.K. / RESERVA E EMISSÃO</span>' +
      '<div class="ark-talent-stage ark-talent-stage--reserve">' +
      '<div class="ark-talent-reserve-aura" aria-hidden="true"></div>' +
      '<div class="ark-talent-robot ark-talent-reserve-robot"><div class="ark-talent-robot-svg">' + arkHologramSvg + '</div>' +
      '<span class="ark-talent-chi-mark" aria-label="Núcleo de Chi azul"><svg viewBox="0 0 44 48" role="img" aria-label="Fogo azul com núcleo"><path d="M22 4C27 14 37 18 35 30C33 40 27 45 21 45C12 45 7 38 9 29C10 22 16 18 16 10C20 13 21 17 21 20C25 16 24 10 22 4Z" fill="#35baff" stroke="#a7ecff" stroke-width="1.5"/><circle cx="22" cy="30" r="5.2" fill="#dffaff" stroke="#71d9ff" stroke-width="1.5"/><circle cx="22" cy="30" r="2.2" fill="#168be5"/></svg></span>' +
      '<span class="ark-talent-reserve-ring" aria-hidden="true"></span></div>' +
      '<div class="ark-talent-reserve-legend">RESERVA NO NÚCLEO / EMISSÃO EM AURA</div>' +
      '</div></div>' +
      '<div class="ark-demo-transmitter" aria-label="A.R.K. atual projetando o holograma"><span class="ark-demo-presenter-label">A.R.K. / PROJETANDO</span><div class="ark-demo-projector"><i class="ark-demo-projection-beam" aria-hidden="true"><svg viewBox="0 0 470 224" preserveAspectRatio="none" aria-hidden="true"><path d="M43 224L0 0L470 0Z" fill="rgba(65,180,255,.055)"/><path d="M43 224L470 0L470 180Z" fill="rgba(65,180,255,.085)"/><path d="M43 224L470 180L0 180Z" fill="rgba(65,180,255,.045)"/><path d="M43 224L0 180L0 0Z" fill="rgba(65,180,255,.07)"/><path d="M43 224L0 0M43 224L470 0M43 224L470 180M43 224L0 180" fill="none" stroke="rgba(129,225,255,.42)" stroke-width="1.5"/><path d="M0 0H470V180H0Z" fill="none" stroke="rgba(129,225,255,.16)" stroke-width="1"/></svg></i><div class="ark-demo-presenter-robot">' + robotSvg + '</div></div></div>' +
      '</div><p>O núcleo azul representa a reserva de Chi; o círculo delimita essa reserva. A aura azul ao redor do A.R.K. representa a emissão do Chi para fora do corpo.</p>';
    var reserveHeading = Array.prototype.find.call(content.querySelectorAll('h3.section'), function (node) { return /RESERVA E EMISSÃO DE CHI/i.test(node.textContent); });
    var reserveRows = reserveHeading && reserveHeading.nextElementSibling && reserveHeading.nextElementSibling.classList.contains('rows') ? reserveHeading.nextElementSibling : null;
    var anchor = reserveRows || (reserveHeading && reserveHeading.parentNode) || null;
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(stage, anchor.nextSibling);
  }

  function addTalentHoloDemos(content) {
    if (!content) return;
    var talentPanel = Array.prototype.find.call(content.querySelectorAll('.panel'), function (node) {
      var heading = node.querySelector('h3');
      return heading && /FORMAS DE UTILIZAÇÃO/i.test(heading.textContent);
    });
    var classHeading = Array.prototype.find.call(content.querySelectorAll('h3.section'), function (node) {
      if (!/^CLASSES(?:\s|$)/i.test(node.textContent.trim())) return false;
      return !talentPanel || !!(talentPanel.compareDocumentPosition(node) & 4);
    });
    var classRows = classHeading && classHeading.nextElementSibling && classHeading.nextElementSibling.classList.contains('rows') ? classHeading.nextElementSibling : null;
    if (!classRows) return;

    if (!document.getElementById('ark-talent-arm-holo-styles')) {
      var armStyle = document.createElement('style');
      armStyle.id = 'ark-talent-arm-holo-styles';
      armStyle.textContent = [
        '.ark-talent-demo{grid-column:1/-1;width:100%;min-width:0}',
        '.ark-talent-stage--corporal{min-height:190px;display:flex;align-items:center;justify-content:center;padding:8px 12px;overflow:hidden}',
        '.ark-talent-arm-xray{display:block;width:min(100%,560px);height:160px;overflow:visible;filter:drop-shadow(0 0 9px rgba(65,190,255,.35))}',
        '.ark-talent-arm-xray .arm-shell{fill:url(#ark-arm-metal-gradient);stroke:#a6eaff;stroke-width:2}',
        '.ark-talent-arm-xray .arm-muscle{fill:rgba(90,170,205,.22);stroke:#b6eaff;stroke-width:1.7;filter:drop-shadow(0 0 3px rgba(79,190,255,.45));animation:ark-arm-muscle-glow 2.8s ease-in-out infinite}',
        '.ark-talent-arm-xray .arm-muscle--fore{animation-delay:.55s}',
        '.ark-talent-arm-xray .arm-joint{fill:#102f49;stroke:#8be3ff;stroke-width:2}',
        '.ark-talent-arm-xray .arm-rib{fill:none;stroke:rgba(194,239,255,.72);stroke-width:1.4;stroke-linecap:round}',
        '.ark-talent-arm-xray .arm-vein{fill:none;stroke:#43c8ff;stroke-width:2.3;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:10 6;filter:drop-shadow(0 0 4px #29aaff);animation:ark-arm-vein-flow 1.25s linear infinite}',
        '.ark-talent-arm-xray .arm-vein--branch{stroke-width:1.6;animation-duration:1.65s}',
        '.ark-talent-arm-xray .arm-hand-palm{fill:url(#ark-arm-metal-gradient);stroke:#b4efff;stroke-width:1.8}',
        '.ark-talent-arm-xray .arm-fingers{fill:none;stroke:#d5f6ff;stroke-width:4.2;stroke-linecap:round;stroke-linejoin:round;transform-box:view-box;transform-origin:116px 54px;animation:ark-arm-grip 2.8s ease-in-out infinite}',
        '@keyframes ark-arm-vein-flow{to{stroke-dashoffset:-32}}',
        '@keyframes ark-arm-muscle-glow{0%,25%,100%{fill:rgba(75,155,190,.18);filter:drop-shadow(0 0 2px rgba(79,190,255,.25))}48%,72%{fill:rgba(49,169,245,.5);filter:drop-shadow(0 0 9px rgba(59,190,255,.95))}}',
        '@keyframes ark-arm-grip{0%,18%,68%,100%{transform:rotate(0)}34%,52%{transform:rotate(13deg)}}',
        '.ark-talent-stage--influence .ark-talent-floating-sword{right:8%;left:auto;top:47%;width:78px;height:24px;transform-origin:12% 50%;animation:ark-talent-sword-pull 4.8s cubic-bezier(.25,.7,.2,1) infinite}',
        '.ark-talent-stage--influence .ark-talent-floating-sword svg{transform:scaleX(-1)}',
        '@keyframes ark-talent-sword-pull{0%,58%{right:8%;top:47%;opacity:1;transform:rotate(0) scale(1)}72%{right:27%;top:43%;opacity:1;transform:rotate(0) scale(1.02)}88%,100%{right:68%;top:43%;opacity:1;transform:rotate(0) scale(.96)}}',
        '.ark-talent-stage--influence .ark-talent-energy-orb{animation-name:ark-talent-influence-orb}',
        '@keyframes ark-talent-influence-orb{0%,18%{left:22%;top:54%;opacity:0;transform:scale(.4)}30%{left:38%;top:45%;opacity:1;transform:scale(1)}42%{left:55%;top:40%;opacity:1;transform:scale(1.15)}54%,59%{left:78%;top:40%;opacity:1;transform:scale(1.25)}64%,100%{left:78%;top:40%;opacity:0;transform:scale(.4)}}',
        '.ark-talent-stage--influence .ark-talent-raised-arm{animation-name:ark-talent-raise-arm-held}',
        '@keyframes ark-talent-raise-arm-held{0%,12%{opacity:0;transform:rotate(0)}22%,82%{opacity:1;transform:rotate(-4deg)}100%{opacity:0;transform:rotate(0)}}',
        '@media(max-width:700px){.ark-talent-arm-xray{height:132px}.ark-talent-influence-robot .ark-talent-floating-sword{left:9px;top:23px;width:62px;height:20px}}'
      ].join('');
      document.head.appendChild(armStyle);
    }

    function chiMark() {
      return '<span class="ark-talent-chi-mark" aria-label="Reserva de Chi"><svg viewBox="0 0 44 48" role="img" aria-label="Símbolo de Chi azul"><path d="M22 4C27 14 37 18 35 30C33 40 27 45 21 45C12 45 7 38 9 29C10 22 16 18 16 10C20 13 21 17 21 20C25 16 24 10 22 4Z" fill="#35baff" stroke="#a7ecff" stroke-width="1.5"/><circle cx="22" cy="30" r="5.2" fill="#dffaff" stroke="#71d9ff" stroke-width="1.5"/><circle cx="22" cy="30" r="2.2" fill="#168be5"/></svg></span><span class="ark-talent-reserve-ring" aria-hidden="true"></span>';
    }
    function robot(extraClass, extras) {
      return '<div class="ark-talent-robot ' + extraClass + '"><div class="ark-talent-robot-svg">' + arkHologramSvg + '</div>' + chiMark() + (extras || '') + '</div>';
    }
    function demo(key, heading, mode, stage, caption) {
      return '<section class="ark-talent-demo" data-ark-talent-demo="' + key + '">' +
        '<h3>' + heading + '</h3>' +
        '<div class="ark-demo-composition"><div class="ark-demo-holo-window">' +
        '<span class="ark-demo-transmission">A.R.K. / ' + heading + '</span>' +
        '<div class="ark-talent-stage ark-talent-stage--' + mode + '">' + stage + '</div>' +
        '</div>' +
        '<div class="ark-demo-transmitter" aria-label="A.R.K. atual projetando o holograma"><span class="ark-demo-presenter-label">A.R.K. / PROJETANDO</span><div class="ark-demo-projector"><i class="ark-demo-projection-beam" aria-hidden="true"><svg viewBox="0 0 470 224" preserveAspectRatio="none" aria-hidden="true"><path d="M43 224L0 0L470 0Z" fill="rgba(65,180,255,.055)"/><path d="M43 224L470 0L470 180Z" fill="rgba(65,180,255,.085)"/><path d="M43 224L470 180L0 180Z" fill="rgba(65,180,255,.045)"/><path d="M43 224L0 180L0 0Z" fill="rgba(65,180,255,.07)"/><path d="M43 224L0 0M43 224L470 0M43 224L470 180M43 224L0 180" fill="none" stroke="rgba(129,225,255,.42)" stroke-width="1.5"/><path d="M0 0H470V180H0Z" fill="none" stroke="rgba(129,225,255,.16)" stroke-width="1"/></svg></i><div class="ark-demo-presenter-robot">' + robotSvg + '</div></div></div>' +
        '</div><p>' + caption + '</p></section>';
    }

    var corporalStage = '<svg class="ark-talent-arm-xray" viewBox="0 0 170 100" role="img" aria-label="Holograma de um braço robótico anatômico visto como raio X, com veias de Chi azuis e mão articulada">' +
      '<defs><linearGradient id="ark-arm-metal-gradient" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#d9f7ff" stop-opacity=".9"/><stop offset=".45" stop-color="#4d91b4" stop-opacity=".62"/><stop offset="1" stop-color="#153e5e" stop-opacity=".86"/></linearGradient></defs>' +
      '<path class="arm-shell" d="M8 38C17 25 31 23 45 29L77 31C88 30 101 34 109 42L116 45L115 64L106 67C96 73 85 74 75 70L44 72C29 79 14 69 8 57Z"/>' +
      '<path class="arm-muscle" d="M19 38C27 30 38 31 48 36L62 42L55 62L40 67C28 67 19 59 17 50Z"/>' +
      '<path class="arm-muscle arm-muscle--fore" d="M57 39L80 37C92 36 101 41 108 47L105 61C96 67 85 66 75 64L55 60Z"/>' +
      '<path class="arm-rib" d="M23 40L42 62M32 34L51 64M65 42L84 61M77 39L95 61M91 41L103 57"/>' +
      '<circle class="arm-joint" cx="56" cy="51" r="7"/><circle class="arm-joint" cx="108" cy="55" r="6"/>' +
      '<path class="arm-vein" d="M10 52C24 52 30 46 41 48S54 55 63 51S77 45 86 50S99 53 111 53"/>' +
      '<path class="arm-vein arm-vein--branch" d="M37 48C35 40 31 37 27 33M42 49C44 58 48 63 54 68M64 51C65 43 70 39 76 35M82 49C83 58 88 63 94 67M99 52C102 45 106 41 112 38"/>' +
      '<path class="arm-vein arm-vein--branch" d="M26 51L20 61M74 49L71 31M91 51L97 35"/>' +
      '<g class="arm-hand"><path class="arm-hand-palm" d="M108 44L119 43L125 51L122 65L112 66L106 59Z"/><g class="arm-fingers">' +
      '<path d="M119 46L128 34L143 31"/><path d="M122 50L139 45L150 46"/><path d="M122 56L140 57L150 62"/><path d="M119 62L132 72L144 77"/><path d="M111 49L115 39L123 35"/>' +
      '</g></g></svg>';

    var influenceArm = '<svg class="ark-talent-raised-arm" viewBox="0 0 140 150" aria-hidden="true"><path d="M92 77L105 63L111 43"/><circle cx="111" cy="43" r="5"/></svg>';
    var sword = '<svg viewBox="0 0 90 24" role="img" aria-label="Espada holográfica, com a ponta da lâmina voltada para a esquerda"><path d="M5 15L70 5L84 8L70 11L7 19Z" fill="#d9f6ff" stroke="#72d8ff" stroke-width="1.4"/><path d="M12 15L71 8" stroke="#fff" stroke-width="1.5"/><path d="M68 4L72 13" stroke="#c6f2ff" stroke-width="3"/><path d="M72 8L88 8L88 13L72 13Z" fill="#7baac5" stroke="#d5f5ff" stroke-width="1"/><path d="M76 8L84 13M76 13L84 8" stroke="#345e7b" stroke-width="1"/></svg>';
    var influenceStage = '<div class="ark-talent-influence-actor">' +
      robot('ark-talent-influence-robot', influenceArm) +
      '</div><div class="ark-talent-floating-sword">' + sword + '</div><span class="ark-talent-energy-orb" aria-hidden="true"></span>';
    var existenceStage = '<div class="ark-talent-existence-actor">' + robot('ark-talent-existence-robot') + '</div>' +
      '<div class="ark-talent-existence-observer"><div class="ark-talent-robot-svg">' + arkHologramSvg + '</div><span class="ark-talent-existence-question">?</span></div>' +
      '<div class="ark-talent-existence-wave" aria-hidden="true"></div>';

    var demos = [
      {key:'corporal',row:'Corporal',html:demo('corporal','01 / CORPORAL','corporal',corporalStage,
        'O holograma apresenta somente um braço mecânico em posição horizontal, como um raio X. Veias azuis de Chi percorrem a estrutura e, ao alcançar os músculos mecânicos, fazem essas partes brilharem; a mão abre e fecha para demonstrar o reforço.')},
      {key:'influence',row:'Influência',html:demo('influence','02 / INFLUÊNCIA','influence',influenceStage,
        'O A.R.K. concentra o Chi, ergue a mão e direciona a emissão. A espada é atraída até a mão, com o cabo junto aos dedos e a lâmina apontada para a esquerda: uma demonstração de influência sobre algo externo ao próprio corpo.')},
      {key:'existence',row:'Existência',html:demo('existence','03 / EXISTÊNCIA','existence',existenceStage,
        'O primeiro A.R.K. oculta sua presença e atravessa o espaço sem ser percebido. Depois, ao reaparecer, impõe sua existência por meio de uma onda de pressão que derruba o observador.')}
    ];
    demos.forEach(function (item) {
      var row = Array.prototype.find.call(classRows.querySelectorAll('.row'), function (node) {
        var label = node.querySelector('b');
        return label && label.textContent.trim().toLowerCase() === item.row.toLowerCase();
      });
      if (!row || !row.parentNode) return;
      var demoNode = content.querySelector('[data-ark-talent-demo="' + item.key + '"]');
      if (!demoNode) {
        var holder = document.createElement('div');
        holder.innerHTML = item.html;
        demoNode = holder.firstElementChild;
      }
      // Keep each projection directly beneath its own class explanation.
      if (demoNode) row.parentNode.insertBefore(demoNode, row.nextSibling);
    });
  }

function addFeatureGuide(content, heading, key, message, peek) {
    var feature = Array.prototype.find.call(content.querySelectorAll('.feature'), function (node) {
      var h = node.querySelector('h3');
      return h && h.textContent.trim() === heading;
    });
    if (!feature || content.querySelector('[data-ark-key="' + key + '"]')) return;
    if (key === 'home-chi-guide') {
      var firstGuide = content.querySelector('[data-ark-key="home-cosmology-guide"]');
      var firstBubble = firstGuide && firstGuide.querySelector('.ark-home-message-bubble');
      if (firstBubble) {
        var divider = document.createElement('hr');
        divider.className = 'ark-home-message-divider';
        firstBubble.appendChild(divider);
        var secondText = document.createElement('p');
        secondText.setAttribute('data-ark-key', key);
        secondText.textContent = message;
        firstBubble.appendChild(secondText);
        feature.classList.remove('ark-home-drawer', 'ark-home-drawer--left', 'ark-home-drawer--right');
        return;
      }
    }
    var step = content.querySelectorAll('.ark-home-drawer').length;
    var side = step % 2 ? 'left' : 'right';
    feature.classList.add('ark-home-drawer', 'ark-home-drawer--' + side);

    var holder = document.createElement('div');
    holder.className = 'ark-home-message ark-home-message--' + side + (peek ? ' ark-home-message--peek' : '');
    holder.setAttribute('data-ark-key', key);
    holder.innerHTML = '<div class="ark-home-message-bubble"><span class="ark-home-message-label">A.R.K. / GUIA DA AGÊNCIA</span><p>' + esc(message) + '</p></div>';
    feature.parentNode.insertBefore(holder, feature.nextSibling);
  }

  var arkRoute = { target:null, index:-1, desiredIndex:-1, animation:null, frame:0, position:null, follower:null, trail:null, speaking:null, timer:0, smokeCount:0, lastSmoke:null, finished:false, snow:null, initialIntroShown:false, lastScrollY:window.scrollY||0 };
  function routeTargets(content) {
    var targets = [];
    var intro = document.querySelector('.ark-home-intro');
    if (intro && !intro.hidden) targets.push({anchor:intro,message:intro,robot:null,kind:'intro'});
    var nodes = content.querySelectorAll(
      '.ark-home-drawer, .ark-scene[data-ark-scene="true"], .ark-chi-stage, .ark-chi-reserve-demo, .ark-talent-demo, .ark-combat-demo'
    );
    Array.prototype.forEach.call(nodes, function (node) {
      if (node.hidden || (window.getComputedStyle && window.getComputedStyle(node).display === 'none')) return;
      if (node.classList.contains('ark-home-drawer')) {
        var message = node.nextElementSibling;
        if (message && message.classList.contains('ark-home-message')) targets.push({anchor:node, message:message, robot:null, kind:'home'});
        return;
      }
      if (node.matches('.ark-scene[data-ark-scene="true"]')) {
        targets.push({anchor:node, message:node, robot:node.querySelector('.ark-scene-robot'), kind:'scene'});
        return;
      }
      var robot = node.querySelector('.ark-chi-robot, .ark-demo-presenter-robot');
      targets.push({anchor:node, message:node, robot:robot, kind:'holo'});
    });
    return targets;
  }
function setArkSpeaking(target) {
    if (arkRoute.speaking === (target || null)) return;
    if (arkRoute.speaking && arkRoute.speaking.message) {
      arkRoute.speaking.message.classList.remove('ark-is-speaking', 'ark-holo-active');
    }
    var follower=arkRoute.follower || document.querySelector('.ark-home-follow-robot');
    if(follower) follower.classList.toggle('ark-route-docked',!!(target&&target.kind==='holo'));
    arkRoute.speaking = target || null;
    if (target && target.message) {
      if (target.kind === 'holo') target.message.classList.add('ark-holo-active');
      else target.message.classList.add('ark-is-speaking');
    }
  }
  function routePoint(target, vw, vh) {
    var rect = target.robot ? target.robot.getBoundingClientRect() : target.anchor.getBoundingClientRect();
    var width = vw <= 650 ? 66 : 78, height = vw <= 650 ? 76 : 88;
    var x, y;
    if (target.kind === 'home') {
      var left = target.anchor.classList.contains('ark-home-drawer--left');
      x = left ? rect.left + 7 : rect.right - width - 7;
      y = rect.bottom - height + 5;
    } else if (target.kind === 'intro') {
      x = rect.left + 7;
      y = rect.top + (rect.height - height) / 2;
    } else if (target.kind === 'holo') {
      x = rect.left + (rect.width - width) / 2;
      y = rect.top + (rect.height - height) / 2;
    } else {
      x = rect.left + (rect.width - width) / 2;
      y = rect.top + (rect.height - height) / 2;
    }
    return {x:Math.max(4,Math.min(vw-width-4,x)),y:Math.max(4,Math.min(vh-height-4,y)),width:width,height:height};
  }
  function emitArkSmoke(x, y) {
    if (!arkRoute.trail) return;
    var puff=document.createElement('span');
    puff.className='ark-smoke-puff';
    puff.style.left=x+'px';
    puff.style.top=y+'px';
    puff.style.width=(13+(arkRoute.smokeCount%4)*3)+'px';
    puff.style.height=(10+(arkRoute.smokeCount%3)*2)+'px';
    arkRoute.trail.appendChild(puff);
    arkRoute.smokeCount++;
    window.setTimeout(function(){if(puff.parentNode)puff.parentNode.removeChild(puff);},900);
  }
  function ensureArkSnowStyles() {
    if (document.getElementById('ark-data-snow-styles')) return;
    var style=document.createElement('style');
    style.id='ark-data-snow-styles';
    style.textContent=[
      '.ark-route-trail{opacity:1!important}',
      '.ark-data-snowfall{position:fixed;inset:0;z-index:78;overflow:hidden;pointer-events:none;contain:strict}',
      '.ark-data-snowfall .ark-data-snowflake{top:-28px!important;animation:ark-data-snow-loop var(--snow-duration) linear var(--snow-delay) infinite!important}',
      '.ark-data-snowbank{position:absolute;left:0;right:0;bottom:0;height:26px;z-index:2;pointer-events:none;background:linear-gradient(180deg,rgba(196,239,255,0) 0%,rgba(167,224,255,.18) 38%,rgba(225,249,255,.78) 100%);box-shadow:0 -3px 12px rgba(91,190,255,.16)}',
      '.ark-data-snowbank:before{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 0%,rgba(234,250,255,.35) 65%,rgba(241,252,255,.9) 100%);clip-path:polygon(0 48%,5% 35%,11% 54%,18% 29%,24% 49%,31% 34%,39% 52%,47% 30%,54% 48%,62% 33%,70% 51%,78% 28%,86% 49%,93% 34%,100% 48%,100% 100%,0 100%)}',
      '.ark-data-snowbank i{position:absolute;bottom:0;display:block;border-radius:55% 55% 0 0;background:radial-gradient(ellipse at 50% 100%,rgba(231,250,255,.96) 0 23%,rgba(139,218,255,.72) 50%,rgba(54,151,220,.16) 76%,transparent 100%);filter:drop-shadow(0 -2px 5px rgba(94,200,255,.45));transform:scaleY(0);transform-origin:bottom;animation:ark-data-snowbank-grow 2.6s ease-out forwards}',
      '.ark-data-snowbank i:nth-child(1){left:0;width:25%;height:20px;animation-delay:.15s}',
      '.ark-data-snowbank i:nth-child(2){left:24%;width:27%;height:16px;animation-delay:.55s}',
      '.ark-data-snowbank i:nth-child(3){left:49%;width:28%;height:22px;animation-delay:.9s}',
      '.ark-data-snowbank i:nth-child(4){left:75%;width:25%;height:18px;animation-delay:1.2s}',
      '@keyframes ark-data-snow-loop{0%{opacity:0;transform:translate3d(0,0,0) rotate(0)}9%{opacity:.96}82%{opacity:.82}100%{opacity:0;transform:translate3d(var(--snow-drift),calc(100vh + 45px),0) rotate(var(--snow-spin))}}',
      '@keyframes ark-data-snowbank-grow{to{transform:scaleY(1)}}'
    ].join('');
    document.head.appendChild(style);
  }
  function stopArkSnowfall() {
    if (arkRoute.snow && arkRoute.snow.parentNode) arkRoute.snow.parentNode.removeChild(arkRoute.snow);
    arkRoute.snow=null;
  }
  function disintegrateArkIntoSnow(follower) {
    if (arkRoute.finished) return;
    arkRoute.finished=true;
    setArkSpeaking(null);
    ensureArkSnowStyles();
    var rect=follower.getBoundingClientRect();
    var layer=document.createElement('div');
    layer.className='ark-data-snowfall';
    layer.setAttribute('aria-hidden','true');
    layer.style.setProperty('--snow-origin-x',(rect.left+rect.width/2)+'px');
    layer.style.setProperty('--snow-origin-y',(rect.top+rect.height/2)+'px');
    var viewportWidth=window.innerWidth||document.documentElement.clientWidth;
    for(var i=0;i<42;i++){
      var flake=document.createElement('i');
      flake.className='ark-data-snowflake';
      flake.style.left=(Math.random()*viewportWidth)+'px';
      flake.style.top='-28px';
      flake.style.setProperty('--snow-size',(2+Math.random()*4)+'px');
      flake.style.setProperty('--snow-duration',(5.2+Math.random()*4.2)+'s');
      flake.style.setProperty('--snow-delay',(-Math.random()*8)+'s');
      flake.style.setProperty('--snow-drift',((Math.random()-.5)*125)+'px');
      flake.style.setProperty('--snow-spin',((Math.random()-.5)*720)+'deg');
      layer.appendChild(flake);
    }
    var bank=document.createElement('div');
    bank.className='ark-data-snowbank';
    bank.innerHTML='<i></i><i></i><i></i><i></i>';
    layer.appendChild(bank);
    document.body.appendChild(layer);
    arkRoute.snow=layer;
    follower.classList.remove('ark-route-moving','ark-route-docked');
    follower.classList.add('ark-route-disintegrating');
    window.setTimeout(function(){
      if(arkRoute.finished) follower.style.display='none';
      follower.classList.remove('ark-route-disintegrating');
    },700);
    arkRoute.target=null;
    arkRoute.position=null;
  }
  function updateHomeArk() {
    var content=document.getElementById('content'), follower=arkRoute.follower || document.querySelector('.ark-home-follow-robot');
    if (!content || !follower || !arkRoute.trail) return;
    if (window.__arkPageTransition) { follower.style.display='none'; return; }
    if (activeId()==='ark') { follower.style.display='none'; setArkSpeaking(null); arkRoute.position=null; return; }
    var targets=routeTargets(content);
    if (!targets.length) {
      follower.style.display='none';
      setArkSpeaking(null);
      arkRoute.index=-1;
      arkRoute.target=null;
      arkRoute.position=null;
      return;
    }

    var vh=window.innerHeight||document.documentElement.clientHeight;
    var vw=window.innerWidth||document.documentElement.clientWidth;

    if(arkRoute.finished){
      var visibleIndex=-1, visibleDistance=Infinity;
      targets.forEach(function(target,index){
        var rect=target.anchor.getBoundingClientRect();
        if(rect.bottom<=0 || rect.top>=vh) return;
        var distance=Math.abs((rect.top+rect.bottom)/2-vh*.48);
        if(distance<visibleDistance){visibleDistance=distance;visibleIndex=index;}
      });
      if(visibleIndex<0){follower.style.display='none';return;}
      stopArkSnowfall();
      arkRoute.finished=false;
      follower.classList.remove('ark-route-disintegrating');
      follower.style.opacity='';
      follower.style.display='grid';
      arkRoute.position=null;
      arkRoute.target=null;
    }

    // O último ponto já passou e nenhum ponto está visível: A.R.K. vira neve digital.
    var finalRect=targets[targets.length-1].anchor.getBoundingClientRect();
    if(finalRect.bottom < -8){
      disintegrateArkIntoSnow(follower);
      return;
    }

    var aimY=vh*.48, nearest=0, nearestDistance=Infinity;
    targets.forEach(function(target,index){
      var rect=target.anchor.getBoundingClientRect();
      var distance=Math.abs((rect.top+rect.bottom)/2-aimY);
      if(distance<nearestDistance){nearestDistance=distance;nearest=index;}
    });
    // A mensagem inicial precisa ser vista antes de o A.R.K. avançar para a próxima.
    if(targets[0].kind==='intro' && !arkRoute.initialIntroShown) nearest=0;
    if(targets[0].kind==='intro' && arkRoute.initialIntroShown){
      var introRect=targets[0].anchor.getBoundingClientRect();
      if(introRect.bottom>Math.min(150,vh*.22)) nearest=0;
    }

    var previousTarget=arkRoute.target;
    arkRoute.desiredIndex=nearest;
    arkRoute.index=nearest;
    var target=targets[nearest], point=routePoint(target,vw,vh);
    follower.style.width=point.width+'px';
    follower.style.height=point.height+'px';
    follower.style.display='grid';

    if(!arkRoute.position){
      var initial=follower.getBoundingClientRect();
      arkRoute.position=initial.width?{x:initial.left,y:initial.top}:{x:point.x,y:point.y};
      if(!initial.width) follower.style.transform='translate3d('+point.x+'px,'+point.y+'px,0)';
    }

    if(!previousTarget || previousTarget.anchor!==target.anchor){
      arkRoute.target=target;
      arkRoute.lastScrollY=window.scrollY||0;
      setArkSpeaking(null);
    }

    var dx=point.x-arkRoute.position.x, dy=point.y-arkRoute.position.y;
    var distance=Math.hypot(dx,dy);
    if(distance>3 && !arkRoute.suppressSmoke){
      var smokeX=arkRoute.position.x+point.width*.5-(dx/distance)*10;
      var smokeY=arkRoute.position.y+point.height*.86-(dy/distance)*4;
      if(!arkRoute.lastSmoke || Math.hypot(smokeX-arkRoute.lastSmoke.x,smokeY-arkRoute.lastSmoke.y)>=12){
        emitArkSmoke(smokeX,smokeY);
        arkRoute.lastSmoke={x:smokeX,y:smokeY};
      }
    }
    if(distance<1.15){
      arkRoute.position.x=point.x;
      arkRoute.position.y=point.y;
      follower.style.transform='translate3d('+point.x+'px,'+point.y+'px,0)';
      follower.classList.remove('ark-route-moving');
      if(target.kind==='intro') arkRoute.initialIntroShown=true;
      setArkSpeaking(target);
      return;
    }

    // Movimento contínuo: o destino é recalculado pela posição real do elemento na tela.
    var factor=distance>180?.34:distance>60?.42:.5;
    var step=Math.min(distance,Math.max(1.8,Math.min(38,distance*factor)));
    var ratio=step/distance;
    arkRoute.position.x+=dx*ratio;
    arkRoute.position.y+=dy*ratio;
    var tilt=Math.max(-7,Math.min(7,dx*.055));
    follower.style.transform='translate3d('+arkRoute.position.x+'px,'+arkRoute.position.y+'px,0) rotate('+tilt+'deg)';
    follower.classList.add('ark-route-moving');
    if(!arkRoute.frame){
      arkRoute.frame=window.requestAnimationFrame(function(){
        arkRoute.frame=0;
        updateHomeArk();
      });
    }
  }
  function ensureArkHomeLayout() {
    var box=document.querySelector('.ark-transfer-box[data-ark-door="top"]');
    if(!box) box=createArkTransferBox('idle','top');
    var wrap=document.querySelector('.main .wrap') || document.querySelector('.wrap');
    var heading=wrap && wrap.querySelector('.heading');
    if(wrap && heading && box.parentNode!==wrap) wrap.insertBefore(box,heading);
    var bottomBox=document.querySelector('.ark-transfer-box[data-ark-door="bottom"]');
    if(!bottomBox) bottomBox=createArkTransferBox('idle','bottom');
    var pageContent=document.getElementById('content');
    if(pageContent && bottomBox.parentNode!==pageContent) pageContent.appendChild(bottomBox);
    var intro=wrap && wrap.querySelector('.ark-home-intro');
    if(wrap && heading && !intro){
      intro=document.createElement('section');
      intro.className='ark-home-intro';
      intro.setAttribute('aria-label','Apresentação do assistente A.R.K.');
      intro.innerHTML='<span class="ark-home-intro-mark" aria-hidden="true"></span><div class="ark-home-intro-copy"><p>Olá! Eu sou o A.R.K., assistente virtual e sistema de segurança da Agência Interdimensional A Ordem.</p><p>Estou aqui para orientar sua navegação, apresentar os registros e ajudar você a conhecer a Nova Ordem — um RPG de interpretação com múltiplas realidades, personagens, organizações e histórias próprias. Pode explorar os arquivos; eu acompanho tudo por aqui.</p></div>';
      wrap.insertBefore(intro,heading);
    }
    if(intro) intro.hidden=activeId()!=='overview';
    return {box:box,intro:intro};
  }
  function startArkWelcomeArrival() {
    if(window.__arkWelcomePlayed || activeId()!=='overview') return false;
    var box=document.querySelector('.ark-transfer-box');
    var frame=box && box.querySelector('.ark-transfer-frame');
    var follower=arkRoute.follower || document.querySelector('.ark-home-follow-robot');
    if(!box || !frame || !follower) return false;
    var rect=frame.getBoundingClientRect();
    var width=window.innerWidth<=650?66:78, height=window.innerWidth<=650?76:88;
    var x=rect.left+(rect.width-width)/2, y=rect.top+(rect.height-height)/2;
    window.__arkWelcomePlayed=true;
    arkRoute.initialIntroShown=false;
    arkRoute.position={x:x,y:y};arkRoute.target=null;
    follower.style.width=width+'px';follower.style.height=height+'px';
    follower.style.display='none';follower.style.transform='translate3d('+x+'px,'+y+'px,0)';
    box.className='ark-transfer-box ark-transfer-box--arriving';
    var status=box.querySelector('.ark-transfer-status'), sub=box.querySelector('.ark-transfer-substatus');
    if(status) status.textContent='A.R.K. / INICIALIZANDO';
    if(sub) sub.textContent='RECONSTRUINDO UNIDADE';
    window.setTimeout(function(){
      box.className='ark-transfer-box ark-transfer-box--idle';
      if(status) status.textContent='A.R.K. / ACESSO PRIVADO';
      if(sub) sub.textContent='PORTAL DE SISTEMA';
      follower.style.display='grid';
      follower.classList.add('ark-route-exiting-door');
      updateHomeArk();
      window.setTimeout(function(){follower.classList.remove('ark-route-exiting-door');},480);
    },900);
    return true;
  }
  function ensureHomeArk() {
    var follower=document.querySelector('.ark-home-follow-robot');
    if(!follower){
      follower=document.createElement('div');follower.className='ark-home-follow-robot';follower.setAttribute('aria-hidden','true');
      follower.innerHTML=robotSvg;
      document.body.appendChild(follower);
    }
    var trail=document.querySelector('.ark-route-trail');
    if(!trail){trail=document.createElement('div');trail.className='ark-route-trail';trail.setAttribute('aria-hidden','true');document.body.appendChild(trail);}
    arkRoute.follower=follower;arkRoute.trail=trail;trail.style.opacity='1';
    ensureArkHomeLayout();
    if(!startArkWelcomeArrival()) updateHomeArk();
  }

  function syncArkToScroll() {
    if(window.__arkPageTransition && window.__arkPageTransition!=='leaving') return;
    var follower=arkRoute.follower || document.querySelector('.ark-home-follow-robot');
    if(!follower || !arkRoute.target || follower.style.display==='none') { arkRoute.lastScrollY=window.scrollY||0; return; }
    var current=window.scrollY||0, delta=current-(arkRoute.lastScrollY||0);
    if(!delta) return;
    var x=arkRoute.position ? arkRoute.position.x : follower.getBoundingClientRect().left;
    var y=(arkRoute.position ? arkRoute.position.y : follower.getBoundingClientRect().top)-delta;
    arkRoute.position={x:x,y:y}; arkRoute.lastScrollY=current;
    follower.classList.remove('ark-route-moving');
    follower.style.transform='translate3d('+x+'px,'+y+'px,0)';
  }
  function scheduleHomeArkUpdate() {
    if (window.__arkHomeFollowFrame) return;
    window.__arkHomeFollowFrame = window.requestAnimationFrame(function () {
      window.__arkHomeFollowFrame = 0;
      updateHomeArk();
    });
  }
  function addChiGuide(content) {
    if (content.querySelector('[data-ark-key="chi-system-guide"]')) return;
    var stage = document.createElement('section');
    stage.className = 'ark-chi-stage';
    stage.setAttribute('data-ark-key', 'chi-system-guide');
    stage.setAttribute('aria-label', 'A.R.K. transmite uma demonstração holográfica sobre DNA congênito, Chi e Talentos');
    stage.innerHTML =
      '<div class="ark-chi-stage-title">A.R.K. / TRANSMISSÃO HOLOGRÁFICA DA AGÊNCIA</div>' +
      '<div class="ark-chi-orbit">' +
        '<div class="ark-chi-note"><b>01 / ORIGEM CONGÊNITA</b>Os Talentos são habilidades congênitas relacionadas a alterações no DNA. Cada pessoa manifesta uma capacidade própria, com possibilidades e limites específicos.</div>' +
        '<div class="ark-chi-projection ark-holo-screen">' +
          '<span class="ark-holo-scan" aria-hidden="true"></span><span class="ark-holo-particles" aria-hidden="true"></span>' +
          '<figure class="ark-holo-step ark-holo-step--dna"><svg viewBox="0 0 80 80" role="img" aria-label="DNA holográfico"><path d="M20 7C65 22 15 58 60 73M60 7C15 22 65 58 20 73" fill="none" stroke="#75cfff" stroke-width="5" stroke-linecap="round"/><path d="M27 13L53 13M24 23L56 23M26 35L54 35M26 46L54 46M24 58L56 58M27 68L53 68" stroke="#9de4ff" stroke-width="3" stroke-linecap="round"/></svg><figcaption>DNA CONGÊNITO</figcaption></figure>' +
          '<span class="ark-chi-arrow" aria-hidden="true">➜</span>' +
          '<figure class="ark-holo-step ark-holo-step--chi"><svg viewBox="0 0 80 80" role="img" aria-label="Energia Chi projetada"><defs><linearGradient id="ark-chi-flame-v4" x1="0" y1="1" x2="1" y2="0"><stop stop-color="#0757a5"/><stop offset=".48" stop-color="#168fe0"/><stop offset="1" stop-color="#8beaff"/></linearGradient><radialGradient id="ark-chi-core-v4"><stop stop-color="#e8fcff"/><stop offset=".55" stop-color="#54c7ff"/><stop offset="1" stop-color="#0873c7"/></radialGradient></defs><path d="M40 5C48 21 66 27 62 49C59 66 49 75 39 75C23 75 13 63 16 47C18 35 28 28 28 15C34 20 36 26 36 31C43 24 43 15 40 5Z" fill="url(#ark-chi-flame-v4)" stroke="#7bdcff" stroke-width="2"/><circle cx="40" cy="48" r="11" fill="url(#ark-chi-core-v4)" stroke="#b8f0ff" stroke-width="2"/><circle cx="40" cy="48" r="4" fill="#effcff"/></svg><figcaption>CHI / ENERGIA</figcaption></figure>' +
          '<span class="ark-chi-arrow" aria-hidden="true">➜</span>' +
          '<figure class="ark-holo-step ark-holo-step--talent"><div class="ark-chi-holo-ark">' + arkHologramSvg + '</div><figcaption>TALENTO / MANIFESTAÇÃO</figcaption></figure>' +
        '</div>' +
        '<div class="ark-chi-note"><b>02 / ENERGIA E MANIFESTAÇÃO</b>O Chi está presente nos seres vivos e pode alimentar a manifestação dos Talentos. Ele não é criado pelo DNA: a origem congênita do Talento e a energia que o alimenta são conceitos diferentes.</div>' +
      '</div>' +
      '<div class="ark-chi-robot" aria-hidden="true">' + robotSvg + '</div>' +
      '<div class="ark-chi-caption"><strong>DNA congênito → Talento; Chi → energia para sua manifestação.</strong><br>O esquema aproxima os conceitos para fins didáticos: nem todo Chi vem do DNA e nem todos os seres vivos possuem Talentos.</div>';
    var anchor = content.querySelector('.panel');
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(stage, anchor.nextSibling);
    else content.insertBefore(stage, content.firstChild);
  }
  function addCombatIllustration(content, headingPrefix, key, mode, caption) {
    var section = Array.prototype.find.call(content.querySelectorAll('.no87-section'), function (node) {
      var h = node.querySelector('h3');
      return h && h.textContent.trim().indexOf(headingPrefix) === 0;
    });
    if (!section || section.querySelector('[data-ark-demo="' + key + '"]')) return;
    var demo = document.createElement('div');
    demo.className = 'ark-combat-demo ark-combat-demo--' + mode;
    demo.setAttribute('data-ark-demo', key);
    var oldArk = '<div class="ark-demo-robot">' + arkHologramSvg + '</div>';
    var armedArk = '<div class="ark-demo-robot ark-demo-robot--armed">' + arkHologramSvg +
      '<svg class="ark-demo-katana" viewBox="0 0 120 28" role="img" aria-label="Katana holográfica empunhada"><defs><linearGradient id="ark-katana-steel" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f8ffff"/><stop offset=".42" stop-color="#9deaff"/><stop offset="1" stop-color="#3d9bc9"/></linearGradient></defs><path d="M5 15Q49 3 94 8L111 12Q62 10 7 19Z" fill="url(#ark-katana-steel)" stroke="#e3fbff" stroke-width="1.2"/><path d="M13 16Q57 7 100 10" fill="none" stroke="#fff" stroke-width="1" opacity=".9"/><path d="M94 5L94 19" stroke="#d6f7ff" stroke-width="3.5" stroke-linecap="round"/><path d="M99 12L117 12L117 16L99 16Z" fill="#b9dce9" stroke="#528aa8" stroke-width="1"/><path d="M104 12L114 16M104 16L114 12" stroke="#456e86" stroke-width="1.2"/></svg></div>';
    var presenter = '<div class="ark-demo-transmitter" aria-label="A.R.K. atual projetando o holograma"><span class="ark-demo-presenter-label">A.R.K. / PROJETANDO</span><div class="ark-demo-projector"><i class="ark-demo-projection-beam" aria-hidden="true"><svg viewBox="0 0 470 224" preserveAspectRatio="none"><path d="M43 224L0 0L470 0Z" fill="rgba(65,180,255,.055)"/><path d="M43 224L470 0L470 224Z" fill="rgba(65,180,255,.085)"/><path d="M43 224L470 180L0 180Z" fill="rgba(65,180,255,.045)"/><path d="M43 224L0 180L0 0Z" fill="rgba(65,180,255,.07)"/><path d="M43 224L0 0M43 224L470 0M43 224L470 180M43 224L0 180" fill="none" stroke="rgba(129,225,255,.42)" stroke-width="1.5"/><path d="M0 0H470V180H0Z" fill="none" stroke="rgba(129,225,255,.16)" stroke-width="1"/></svg></i><div class="ark-demo-presenter-robot">' + robotSvg + '</div></div></div>';
    var grass = '<div class="ark-demo-grass" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>';
    var windowStart = '<div class="ark-demo-composition"><div class="ark-demo-holo-window"><span class="ark-demo-transmission">A.R.K. / ' +
      (mode === 'attack' ? 'ATAQUE PERFEITO' : mode === 'parry' ? 'DEFESA PERFEITA' : 'MOVIMENTO PERFEITO') +
      '</span><div class="ark-demo-stage';
    var windowEnd = '</div></div>' + presenter + '</div><p>' + esc(caption) + '</p>';
    if (mode === 'parry') {
      var shield = '<svg class="ark-demo-shield-gear" viewBox="0 0 54 62" role="img" aria-label="Escudo holográfico"><path d="M27 3L48 11V28Q46 45 27 57Q8 45 6 28V11Z" fill="rgba(91,211,255,.28)" stroke="#a9efff" stroke-width="3"/><path d="M27 10V48M14 18L40 18" stroke="#d9faff" stroke-width="2" opacity=".9"/></svg>';
      demo.innerHTML = windowStart + ' ark-demo-stage--parry">' + grass +
        '<div class="ark-demo-fighter ark-demo-defender">' + oldArk + shield + '<span class="ark-demo-barrier" aria-hidden="true"></span></div>' +
        '<div class="ark-demo-impact" aria-hidden="true">✦</div><div class="ark-demo-fighter ark-demo-attacker">' + armedArk + '</div>' + windowEnd;
    } else if (mode === 'attack') {
      demo.innerHTML = windowStart + ' ark-demo-stage--sword-pass">' + grass +
        '<div class="ark-demo-fighter ark-demo-target">' + oldArk + '</div><div class="ark-demo-fighter ark-demo-striker">' + armedArk + '</div>' + windowEnd;
    } else {
      demo.innerHTML = windowStart + ' ark-demo-stage--movement">' + grass +
        '<div class="ark-demo-orbit-track ark-demo-orbit-track--outer" aria-hidden="true"></div><div class="ark-demo-orbit-track ark-demo-orbit-track--inner" aria-hidden="true"></div>' +
        '<div class="ark-demo-fighter ark-demo-center">' + oldArk + '<span class="ark-demo-question" aria-label="Confuso">?</span></div>' +
        '<div class="ark-demo-fighter ark-demo-runner ark-demo-runner--echo ark-demo-runner--echo-one">' + oldArk + '</div>' +
        '<div class="ark-demo-fighter ark-demo-runner ark-demo-runner--echo ark-demo-runner--echo-two">' + oldArk + '</div>' +
        '<div class="ark-demo-fighter ark-demo-runner ark-demo-runner--echo ark-demo-runner--echo-three">' + oldArk + '</div>' +
        '<div class="ark-demo-fighter ark-demo-runner ark-demo-runner--real">' + oldArk + '</div>' + windowEnd;
    }
    section.appendChild(demo);
  }

  function addAfterIndex(content, selector, index, key, message, variant) {
    var nodes = content.querySelectorAll(selector);
    if (nodes[index]) addAfter(nodes[index], key, message, variant || 'compact');
  }
  function wrapWithScene(target, key, message) {
    if (!target || !target.parentNode) return;
    var content = document.getElementById('content');
    if (!content || content.querySelector('[data-ark-key="' + key + '"]')) return;
    if (target.parentNode.classList && target.parentNode.classList.contains('ark-table-explainer')) return;
    var wrapper = document.createElement('div');
    wrapper.className = 'ark-table-explainer';
    target.parentNode.insertBefore(wrapper, target);
    wrapper.appendChild(target);
    var holder = document.createElement('div');
    holder.innerHTML = scene(key, message, 'compact');
    wrapper.appendChild(holder.firstElementChild);
  }
  function placeScenes(content, id) {
    if (!content) return;
    if (id === 'ranks') addRankPodium(content);
    if (id === 'overview') {
      addFeatureGuide(content, 'Cosmologia e histórias', 'home-cosmology-guide',
        'Eba, chegou à parte dos grandes mistérios! Por aqui você encontra referências a panteões nórdicos, gregos, egípcios, japoneses, chineses, hindus e celtas — cada tradição com suas próprias divindades e histórias. Também é possível propor um panteão original, criando deuses, símbolos, costumes e relações entre eles para avaliação e integração à Lore. E ainda existem seres que vão muito além do que a gente consegue explicar... confesso que alguns arquivos me deixam com um friozinho nos circuitos! Hehe.',
        false);
      addFeatureGuide(content, 'Poderes e Chi', 'home-chi-guide',
        'Opa! Aqui começa a parte energética da coisa! O Chi está ligado às capacidades dos seres vivos, enquanto os Talentos definem manifestações congênitas. Vou te acompanhar pelos registros para separar cada conceito sem misturar as regras. ⚡',
        false);
      addFeatureGuide(content, 'Personagens e evolução', 'home-character-guide',
        'A melhor parte é criar alguém com uma história só sua! Você tem liberdade para imaginar origem, personalidade e objetivos — mas lembre de equilibrar as capacidades e limitações. Uma ficha justa deixa as aventuras mais interessantes para todo mundo! Ah, um aviso importante: a regra prevê até dois rascunhos ativos por jogador. Com os dois espaços ocupados, um novo rascunho só poderá ser iniciado depois que um deles for aprovado. Não é bug, viu? Eu só estou evitando uma fila infinita de fichas! 😅',
        true);
      addFeatureGuide(content, 'Combates e desafios', 'home-combat-guide',
        'Hora de estratégia! Em combate, não basta escolher um golpe bonito: é preciso observar a situação, entender a intenção do adversário e respeitar as capacidades e limites de cada personagem. Eu fico aqui na torcida — de preferência atrás de uma proteção! 😅',
        false);
      addFeatureGuide(content, 'Organizações e influência', 'home-organizations-guide',
        'As organizações têm objetivos, histórias e interesses próprios. Você pode descobrir como elas influenciam o mundo, construir relações ou seguir um caminho independente. Só não confunda a visão de um grupo com a verdade absoluta da Lore, combinado?',
        false);
      addFeatureGuide(content, 'Criação e possibilidades', 'home-creation-guide',
        'Criatividade liberada! Treinamentos, projetos e ferramentas abrem caminhos diferentes, mas cada proposta precisa respeitar os recursos, os limites e a avaliação prevista no sistema. Se algo ainda estiver em desenvolvimento, eu te aviso!',
        false);
    }
    if (id === 'chi') { addChiGuide(content); addChiReserveHoloDemo(content); return; }
    if (id === 'combat') {
      addAfter(content.querySelector('.panel'), 'combat-fencer-guide',
        'Preparado para o duelo? Pense na luta como uma troca de leitura e estratégia: enquanto um personagem procura uma abertura, o outro observa, reage e escolhe como se proteger. Atacar sem pensar pode deixar uma brecha; esperar o momento certo pode mudar tudo! As rolagens ajudam a resolver o confronto, mas as decisões começam antes do dado cair. Vamos ver como isso funciona nas regras!',
        'fencer');
      addCombatIllustration(content, '7. Ataque Perfeito', 'combat-perfect-attack-demo', 'attack',
        'Ataque Perfeito: o A.R.K. atual fica abaixo da projeção e transmite a cena a partir do rosto. Acima, o A.R.K. antigo atravessa o alvo com a katana empunhada.');
      addCombatIllustration(content, '8. Parry', 'combat-perfect-parry-demo', 'parry',
        'Defesa Perfeita: o A.R.K. atual projeta a cena para cima. No holograma, o defensor ergue o escudo, cria uma barreira circular e repele o atacante.');
      addCombatIllustration(content, '9. Movimento Perfeito', 'combat-perfect-movement-demo', 'movement',
        'Movimento Perfeito: o A.R.K. atual projeta a cena para cima. No holograma visto de cima, um A.R.K. confuso fica parado no centro enquanto outro alterna entre quatro posições definidas ao redor dele, deixando três vultos de velocidade.');
      return;
    }
    if (id === 'characters') {
      addAfter(content.querySelector('.panel'), 'characters-draft-guide',
        'Criar personagem é dar vida a uma ideia — então aproveite a liberdade para construir uma origem e uma personalidade próprias! Só não esqueça do equilíbrio: pense no que ele consegue fazer, no que isso custa e também no que ainda não consegue. Assim todo mundo tem espaço para brilhar. E atenção a um detalhe importante: a regra prevê até dois rascunhos de ficha por jogador. Quando os dois espaços estiverem ocupados, será preciso aguardar a aprovação de um deles antes de iniciar outro. Se isso acontecer, não se assuste: é o limite funcionando direitinho!',
        'peek-comic');
      return;
    }
    if (id === 'lore-pantheons') {
      addAfter(content.querySelector('.panel'), 'pantheons-create-guide',
        'Quer trazer uma tradição original para a Nova Ordem? Você pode desenvolver um panteão próprio: pense nas divindades, nos símbolos, nos costumes, nas histórias e na maneira como esse conjunto se relaciona com o mundo. A proposta precisa ser coerente com a Lore e passar pela avaliação antes de integrar os registros. E não precisa criar tudo de uma vez — até os grandes mitos começam com uma boa ideia!',
        'compact');
      return;
    }
    if (id === 'overview') {
      // A página inicial usa somente o A.R.K. flutuante; não inserir cópias nas mensagens de abertura.\n      return;
    }
    if (id === 'systems') {
      var cards = content.querySelector('.cards') || content.firstElementChild;
      addBefore(cards, 'systems-guide', 'Oláá! Antes de abrir os arquivos, deixa eu te mostrar como esta área funciona! Cada cartão leva a um sistema próprio. Alguns se complementam, mas cada um explica uma parte diferente das regras. Assim você sabe onde procurar quando surgir uma dúvida!', 'compact');
      var firstGuide = content.querySelector('[data-ark-key="systems-guide"]');
      addAfter(firstGuide, 'systems-howto', 'Um exemplo rápido: Chi explica a energia; Talentos explica as habilidades congênitas; e Combate mostra como as ações são resolvidas. Às vezes, entender uma situação exige consultar dois ou mais sistemas. Pronto! Agora pode explorar os arquivos sem se perder. 🤖', 'compact');
      return;
    }
    if (id === 'combat') {
      addAfter(content.querySelector('.panel'), 'combat-intro-example', 'Exemplo prático: A tenta acertar B. B escolhe esquivar. Se o ataque tirar 9 e a esquiva 5, a diferença é 4: 40% do ataque ainda alcança B e 60% é evitado. É uma aplicação da tabela abaixo, não uma regra nova.', 'compact');
      wrapWithScene(content.querySelector('.no87-table'), 'combat-dodge-table', 'Leia esta tabela como uma comparação entre dois resultados: quanto maior a diferença a favor da esquiva, menor a parcela do ataque que acerta. Se a esquiva igualar ou superar o ataque, o ataque é evitado por completo.');
      addAfterIndex(content, '.no87-section', 1, 'combat-damage-example', 'Imagine que uma técnica tenha força de impacto e também uma propriedade especial. O dano bruto representa o impacto; o efeito é o que a técnica faz além de atingir. A defesa pode reduzir o impacto sem necessariamente apagar a propriedade.', 'compact');
      addAfterIndex(content, '.no87-section', 5, 'combat-perfect-example', 'Um resultado natural 10 no ataque ativa o Ataque Perfeito conforme o registro. Já o bônus de Técnica Máxima não transforma um resultado em 10: o resultado final continua limitado a 9.', 'compact');
      return;
    }
    if (id === 'power') {
      addChiGuide(content);
      addChiReserveHoloDemo(content);
      addTalentHoloDemos(content);
      addAfter(content.querySelector('.special-grid'), 'talents-specialization-guide', 'Cada especialização representa um campo de manifestação do Talento. Escolha a que corresponde ao funcionamento da habilidade e mantenha as limitações e a classe do personagem em consideração.', 'compact');
      addAfter(content.querySelector('.panel'), 'chi-intro-example', 'Ter Chi não significa saber utilizá-lo. Todos os seres vivos possuem Chi, mas pessoas comuns podem ter essa energia inativa. Percepção, controle e treinamento são etapas diferentes.', 'compact');
      addAfterIndex(content, '.rows', 0, 'chi-emission-example', 'Na prática, uma técnica simples e breve tende a exigir menos Chi do que uma manifestação complexa, potente ou mantida por muito tempo. O custo considera esses três fatores, não uma tarifa fixa para toda habilidade.', 'compact');
      addAfterIndex(content, '.rows', 1, 'chi-recovery-example', 'Se um personagem gastar energia demais, descansar e meditar são formas de recuperação. Continuar tentando executar técnicas durante a exaustão pode comprometer o controle e deixá-lo vulnerável.', 'compact');
      return;
    }
    if (id === 'chi') {
      addChiReserveHoloDemo(content);
      return;
    }
    if (id === 'talents') {
      addTalentHoloDemos(content);
      addAfter(content.querySelector('.special-grid'), 'talents-specialization-guide', 'Cada especialização representa um campo de manifestação do Talento. Escolha a que corresponde ao funcionamento da habilidade e mantenha as limitações e a classe do personagem em consideração.', 'compact');
      return;
    }
    if (id === 'progression') {
      addAfter(content.querySelector('.panel'), 'progression-intro-example', 'Um personagem pode se desenvolver por caminhos diferentes: participar de uma missão, treinar ou contribuir em um evento são atividades distintas. A progressão não precisa ser uma sequência exclusiva de combates.', 'compact');
      addAfterIndex(content, '.rows', 0, 'progression-paths-example', 'Exemplo: um herói que participa de uma missão de proteção pode avançar por esse caminho; outro personagem pode optar por treinamento individual. A atividade precisa cumprir os critérios do registro e ser avaliada conforme as regras.', 'compact');
      addAfterIndex(content, '.rows', 1, 'progression-level-example', 'Não confunda nível com Rank. Nível representa progressão do personagem; Rank é uma classificação hierárquica com critérios próprios.', 'compact');
      return;
    }
    if (id === 'races') {
      addAfter(content.querySelector('.cards'), 'races-overview-example', 'As categorias não são apenas aparências diferentes. Elas têm características biológicas e limites próprios. A escolha deve combinar com a história e com as capacidades descritas na ficha.', 'compact');
      addAfterIndex(content, '.rows', 0, 'races-comparison-example', 'Como referência física do sistema, um Químio equivale aproximadamente a dez humanos e um Híbrido a cinco. Essa comparação não significa que toda característica seja multiplicada automaticamente.', 'compact');
      return;
    }
    if (id === 'honor') {
      addAfter(content.querySelector('.panel'), 'honor-karma-example', 'Honra e Karma não são duas escalas da mesma coisa. Uma registra ações positivas e reconhecimento; a outra registra condutas negativas relevantes e consequências. Uma pontuação não é convertida na outra.', 'compact');
      var honorTables = content.querySelectorAll('.tablebox');
      if (honorTables[0]) wrapWithScene(honorTables[0], 'honor-stars-table', 'As estrelas representam o grau de procura associado ao Karma. Consulte a tabela como classificação, não como uma recompensa por completar missões.');
      if (honorTables[1]) wrapWithScene(honorTables[1], 'honor-suits-table', 'Esta segunda tabela é diferente: mostra os requisitos de Honra para os trajes da Agência. Por isso, uma ficha pode ter Honra relevante para os trajes sem que isso reduza seu Karma.');
      return;
    }
    if (id === 'karma') {
      addAfter(content.querySelector('.panel'), 'karma-intro-example', 'Exemplo: uma ação criminosa de grande impacto pode ser avaliada pela Administração considerando gravidade, consequências e importância narrativa. Não é uma soma automática por repetir delitos pequenos.', 'compact');
      var karmaTable = content.querySelector('table');
      if (karmaTable) wrapWithScene(karmaTable, 'karma-stars-table', 'As estrelas dependem dos requisitos de nível e Karma indicados na tabela. Ter muitos pontos sem cumprir o nível mínimo não basta para alcançar a faixa seguinte.');
      addAfterIndex(content, '.rows', 0, 'karma-consequences-example', 'A classificação de procurado pode aparecer em notícias e registros da Lore. Ela representa notoriedade e investigação, não um bônus de poder para o personagem.', 'compact');
      return;
    }
    if (id === 'equipment') {
      addAfter(content.querySelector('.panel'), 'equipment-intro-example', 'Um equipamento não ganha uma capacidade só porque a descrição diz que ele é muito avançado. Materiais, mecanismos, funcionamento, Rank e condição precisam ser explicados e avaliados.', 'compact');
      addAfterIndex(content, '.rows', 0, 'equipment-condition-example', 'Rank e condição são critérios separados. Um item pode ter Rank alto e estar danificado, ou Rank baixo e estar em perfeito estado.', 'compact');
      return;
    }
    if (id === 'crafting') {
      addAfter(content.querySelector('.panel'), 'crafting-intro-example', 'Exemplo: um jogador pode propor uma ferramenta ou proteção, mas precisa explicar materiais, funcionamento, recursos e processo de fabricação. A proposta ainda passa pela avaliação prevista no sistema.', 'compact');
      addAfterIndex(content, '.rows', 0, 'crafting-materials-example', 'A escolha de materiais deve considerar propriedades e disponibilidade. Um material raro ou resistente não torna o projeto automaticamente aprovado nem elimina custos de produção.', 'compact');
      return;
    }
    if (id === 'economy') {
      addAfter(content.querySelector('.panel'), 'economy-intro-example', 'Os valores de referência ajudam a manter uma economia coerente. Eles não significam que todo personagem recebe automaticamente um salário: trabalho, atividade e registro precisam ser considerados.', 'compact');
      wrapWithScene(content.querySelector('.tablebox'), 'economy-reference-table', 'Use esta tabela para comparar valores de referência. Antes de comprar ou vender algo, considere o item concreto e as condições registradas, sem presumir um preço universal.');
      return;
    }
    if (id === 'organizations') {
      addAfter(content.querySelector('.panel'), 'organizations-intro-example', 'Uma organização não é apenas um nome ou uma bandeira. Observe sua origem, seus objetivos, sua escala de atuação e a forma como recruta ou se relaciona com os personagens.', 'compact');
      addAfterIndex(content, '.no87-section', 0, 'organization-order-example', 'A Ordem tem uma atuação institucional ampla e uma história ligada à resistência e à proteção. Um personagem pode se relacionar com a Agência sem que todo personagem do RPG seja obrigado a fazer parte dela.', 'compact');
      addAfterIndex(content, '.no87-section', 1, 'organization-lua-example', 'A Lua Sangrenta possui uma visão própria sobre a realidade e objetivos diferentes dos da Ordem. Ao interpretar um grupo, diferencie o que seus membros acreditam daquilo que a narrativa confirma como verdade.', 'compact');
      return;
    }
    if (id === 'missions') {
      addAfter(content.querySelector('.cards'), 'missions-types-example', 'Exemplo: uma missão de Salvação pode ter como objetivo proteger uma cidade; uma de Destruição pode ter como objetivo destruí-la. O tipo indica o objetivo narrativo, não garante o sucesso de quem participa.', 'compact');
      addAfter(content.querySelector('.callout'), 'missions-outcome-example', 'A conclusão depende das ações, da situação e da avaliação da missão. Participar não significa receber automaticamente o resultado desejado.', 'compact');
      return;
    }
    if (id === 'ranks') {
      addAfter(content.querySelector('.panel'), 'ranks-intro-example', 'Um personagem pode ter nível elevado sem ocupar automaticamente um Rank superior. Nível, patente e função respondem a critérios diferentes.', 'compact');
      addAfterIndex(content, '.rows', 0, 'ranks-hierarchy-example', 'Uma promoção não deve ser tratada como consequência automática de força. O registro considera requisitos e avaliação administrativa, além de vagas quando aplicável.', 'compact');
      return;
    }
    if (id === 'characters') {
      addAfter(content.querySelector('.panel'), 'characters-creation-example', 'O jogador define a origem, a história e a apresentação do personagem. A Administração não exige uma origem padronizada: avalia coerência com a Lore e equilíbrio da ficha.', 'compact');
      addAfterIndex(content, '.rows', 0, 'characters-review-example', 'Se uma ficha precisar de ajustes, a devolução deve explicar o que precisa ser revisto. Aprovação não significa que todos os personagens precisem seguir o mesmo caminho narrativo.', 'compact');
      return;
    }
    if (id === 'protocol') {
      addAfter(content.querySelector('.panel'), 'protocol-intro-example', 'O protocolo orienta a convivência e os procedimentos do RPG. Ele não substitui a leitura dos sistemas: uma regra de combate, por exemplo, continua sendo consultada no arquivo de Combate.', 'compact');
      addAfterIndex(content, '.rows', 0, 'protocol-question-example', 'Se surgir uma dúvida, indique o sistema e a situação concreta. Isso ajuda a Administração a distinguir uma dúvida de regra de uma decisão narrativa.', 'compact');
      return;
    }
    if (id === 'lore-thanatos') {
      addAfter(content.querySelector('.panel'), 'thanatos-peek', 'Este registro é delicado. Posso apresentar o que está documentado publicamente, mas certos dados permanecem reservados. Recomendo cautela ao explorar este arquivo.', 'peek');
      return;
    }
    if (id === 'lore') {
      addAfter(content.querySelector('.panel'), 'lore-archive-guide', 'Os arquivos públicos apresentam a história, as culturas e os registros conhecidos. Nem toda informação de bastidores é conhecimento que os personagens possuem dentro da narrativa.', 'compact');
      addAfter(content.querySelector('.cards'), 'lore-reading-example', 'Ao ler um acontecimento histórico, separe o fato registrado das interpretações de povos, organizações e personagens. Nem toda crença apresentada no mundo é necessariamente verdadeira.', 'compact');
      return;
    }
    var messages = {
      agency:'A Agência possui estrutura, procedimentos e responsabilidades próprias. A participação de um personagem não é obrigatória.',
      'lore-history':'Este arquivo reúne acontecimentos históricos conhecidos. Alguns eventos ajudam a compreender a formação da ordem atual.',
      'lore-pantheons':'As culturas e tradições possuem seus próprios registros. Não confunda referências mitológicas com as entidades originais da cosmologia da Nova Ordem.',
      'lore-progenitor':'Este registro possui caráter reservado. Nem toda informação deve ser interpretada como conhecimento público dos personagens.',
      'character-creation':'Revise cada etapa antes de enviar a ficha. As escolhas devem ser coerentes com o conceito do personagem e com as regras documentadas.',
      functions:'As ferramentas interativas apoiam atividades do jogador. Verifique o que cada função registra e se ela já está conectada ao banco de dados.',
      training:'Um registro de treinamento deve descrever a atividade realizada e o objetivo de desenvolvimento, sem presumir aprovação automática.',
      forge:'Uma proposta de Forja precisa explicar o projeto, os recursos e o funcionamento pretendido.',
      work:'O registro de Trabalho deve corresponder à ocupação e às condições previstas no sistema monetário.',
      admin:'Olá, administrador. Este painel reúne a avaliação de fichas e os registros necessários para analisar propostas dos jogadores.'
    };
    if (messages[id]) {
      var anchor = content.querySelector('.panel') || content.querySelector('.intro-lead') || content.firstElementChild;
      addAfter(anchor, 'page-' + id, messages[id], 'compact');
      var sections = content.querySelectorAll('.rows,.tablebox,.no87-section');
      if (sections.length > 1) addAfter(sections[1], 'page-' + id + '-detail', 'Consulte esta parte junto com a explicação anterior. Se algum detalhe não estiver definido no registro, não presuma um valor ou uma exceção: encaminhe a dúvida para a Administração.', 'compact');
    }
  }
  function enhance() {
    var content = document.getElementById('content');
    if (!content) return;
    var id = activeId();
    updateBackButton(id);
    placeScenes(content, id);
    ensureHomeArk();
    if (id !== 'overview' && id !== 'ark' && !content.querySelector('[data-ark-scene="true"]')) {
      var anchor = content.querySelector('.panel') || content.querySelector('.intro-lead') || content.firstElementChild;
      addBefore(anchor, 'page-guide-' + id, 'Oi! Passei por este arquivo para ajudar na leitura. Observe os títulos, exemplos e tabelas com calma; se alguma regra não estiver explicada aqui, não vou inventar uma resposta. Pode me chamar pela Central do A.R.K. quando precisar!', 'compact');
    }
  }
  function createArkTransferBox(mode, position) {
    position=position||'top';
    var box=document.querySelector('.ark-transfer-box[data-ark-door="'+position+'"]');
    if(!box){
      box=document.createElement('div');
      box.setAttribute('role','status');
      box.setAttribute('aria-live','polite');
      box.setAttribute('data-ark-door',position);
    }
    box.setAttribute('data-ark-door',position);
    box.className='ark-transfer-box ark-transfer-box--'+mode+' ark-transfer-box--'+position;
    var pixels='';
    var vectors=[[-49,-27],[-24,-38],[8,-42],[39,-28],[53,-5],[45,25],[18,39],[-18,39],[-47,22],[-58,0],[0,-18],[28,10]];
    vectors.forEach(function(v,i){
      pixels+='<i class="ark-transfer-pixel" style="--i:'+i+';--px:'+v[0]+'px;--py:'+v[1]+'px;--out-delay:'+(i*18)+'ms;--in-delay:'+((11-i)*22)+'ms"></i>';
    });
    if(!box.querySelector('.ark-transfer-frame')){
      box.innerHTML='<div class="ark-transfer-frame"><div class="ark-transfer-door-core"></div><div class="ark-transfer-robot">'+robotSvg+'</div>'+pixels+'</div>'+
        '<div class="ark-transfer-status">A.R.K. / ACESSO PRIVADO</div>'+
        '<div class="ark-transfer-substatus">PORTAL DE SISTEMA</div>';
      document.body.appendChild(box);
    }
    var status=box.querySelector('.ark-transfer-status'), sub=box.querySelector('.ark-transfer-substatus');
    if(status) status.textContent=mode==='leaving'?'A.R.K. / CARREGANDO SISTEMA':mode==='arriving'?'A.R.K. / RECONSTRUINDO':'A.R.K. / ACESSO PRIVADO';
    if(sub) sub.textContent=mode==='leaving'?'TRANSFERINDO DADOS':mode==='arriving'?'REAGRUPANDO DADOS':'PORTAL DE SISTEMA';
    return box;
  }
  function lockArkPageScroll() {
    document.documentElement.classList.add('ark-page-scroll-locked');
    document.body.classList.add('ark-page-scroll-locked');
  }
  function unlockArkPageScroll() {
    document.documentElement.classList.remove('ark-page-scroll-locked');
    document.body.classList.remove('ark-page-scroll-locked');
  }
  function runArkPageTransition(navigate) {
    var bottomDoor=createArkTransferBox('idle','bottom');
    var follower=arkRoute.follower || document.querySelector('.ark-home-follow-robot');
    if(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      window.__arkPageTransition='arriving';
      lockArkPageScroll();
      navigate();
      window.scrollTo(0,0);
      enhance();
      var reducedTop=createArkTransferBox('arriving','top');
      window.setTimeout(function(){finishArkPageTransition(reducedTop);},80);
      return;
    }
    window.__arkPageTransition='leaving';
    window.scrollTo({top:document.documentElement.scrollHeight,behavior:'smooth'});
    window.setTimeout(function(){
      lockArkPageScroll();
      var frame=bottomDoor.querySelector('.ark-transfer-frame');
      var doorRect=frame.getBoundingClientRect();
      if(follower){
        follower.classList.add('ark-route-entering-door');
        follower.style.display='grid';
        var followerRect=follower.getBoundingClientRect();
        var fw=followerRect.width||78, fh=followerRect.height||88;
        var doorX=doorRect.left+(doorRect.width-fw)/2;
        var doorY=doorRect.top+(doorRect.height-fh)/2;
        window.requestAnimationFrame(function(){follower.style.transform='translate3d('+doorX+'px,'+doorY+'px,0)';});
      }
      window.setTimeout(function(){
        if(follower){follower.style.display='none';follower.classList.remove('ark-route-entering-door');}
        bottomDoor.classList.remove('ark-transfer-box--idle');
        bottomDoor.classList.add('ark-transfer-box--leaving');
        var leavingStatus=bottomDoor.querySelector('.ark-transfer-status');
        var leavingSub=bottomDoor.querySelector('.ark-transfer-substatus');
        if(leavingStatus) leavingStatus.textContent='A.R.K. / CARREGANDO SISTEMA';
        if(leavingSub) leavingSub.textContent='TRANSFERINDO DADOS';
        window.setTimeout(function(){
          navigate();
          window.scrollTo(0,0);
          window.__arkPageTransition='arriving';
          enhance();
          var arrivalDoor=createArkTransferBox('arriving','top');
          var status=arrivalDoor.querySelector('.ark-transfer-status');
          var sub=arrivalDoor.querySelector('.ark-transfer-substatus');
          if(status) status.textContent='A.R.K. / SISTEMA CARREGADO';
          if(sub) sub.textContent='RECONSTRUINDO UNIDADE';
          if(arkRoute.snow){
            var bank=arkRoute.snow.querySelector('.ark-data-snowbank');
            if(bank){
              var snow=bank.cloneNode(true);
              snow.className='ark-transfer-snow';
              arrivalDoor.querySelector('.ark-transfer-frame').appendChild(snow);
            }
            stopArkSnowfall();
          }
          window.setTimeout(function(){finishArkPageTransition(arrivalDoor);},1050);
        },790);
      },520);
    },620);
  }
  function finishArkPageTransition(box) {
    var transfer=box || document.querySelector('.ark-transfer-box[data-ark-door="top"]');
    var frame=transfer && transfer.querySelector('.ark-transfer-frame');
    var rect=frame ? frame.getBoundingClientRect() : null;
    var follower=arkRoute.follower || document.querySelector('.ark-home-follow-robot');
    window.__arkPageTransition='arriving';
    if(follower && rect && activeId()!=='ark'){
      var width=window.innerWidth<=650?66:78, height=window.innerWidth<=650?76:88;
      arkRoute.position={x:rect.left+(rect.width-width)/2,y:rect.top+(rect.height-height)/2};
      arkRoute.target=null;
      follower.style.width=width+'px';
      follower.style.height=height+'px';
      follower.style.display='grid';
      follower.style.transform='translate3d('+arkRoute.position.x+'px,'+arkRoute.position.y+'px,0)';
    } else {
      arkRoute.position=null;
    }
    if(transfer){
      transfer.className='ark-transfer-box ark-transfer-box--idle ark-transfer-box--top';
      transfer.setAttribute('data-ark-door','top');
      var status=transfer.querySelector('.ark-transfer-status');
      var sub=transfer.querySelector('.ark-transfer-substatus');
      if(status) status.textContent='A.R.K. / ACESSO PRIVADO';
      if(sub) sub.textContent='PORTAL DE SISTEMA';
    }
    if(follower && rect && activeId()!=='ark'){
      follower.classList.remove('ark-route-entering-door');
      follower.classList.add('ark-route-exiting-door');
      window.setTimeout(function(){
        follower.classList.remove('ark-route-exiting-door');
        window.__arkPageTransition=false;
        unlockArkPageScroll();
        arkRoute.lastScrollY=window.scrollY||0;
        updateHomeArk();
      },430);
    } else {
      window.__arkPageTransition=false;
      unlockArkPageScroll();
      updateHomeArk();
    }
  }
  function initialize() {
    var content = document.getElementById('content');
    enhance();
    if (!window.__arkHomeFollowBound) {
      window.__arkHomeFollowBound = true;
      window.addEventListener('scroll', syncArkToScroll, {passive:true});
      window.addEventListener('resize', scheduleHomeArkUpdate, {passive:true});
      window.addEventListener('scrollend', scheduleHomeArkUpdate, {passive:true});
    }
    if (content && window.MutationObserver) {
      var observer = new MutationObserver(function () {
        window.clearTimeout(observer._arkTimer);
        observer._arkTimer = window.setTimeout(enhance, 30);
      });
      observer.observe(content, {childList:true,subtree:true});
    }
    if (window.go && !window.go.__arkSceneWrapped) {
      var previousGo = window.go;
      var wrappedGo = function () {
        var context=this, args=Array.prototype.slice.call(arguments);
        // Chi and Talentos are legacy routes; both now open the unified Power System page.
        if (args[0] === 'chi' || args[0] === 'talents') args[0] = 'power';
        if(window.__arkGoPending) return;
        window.__arkGoPending=true;
        runArkPageTransition(function(){
          window.__arkGoPending=false;
          var result=previousGo.apply(context,args);
          window.setTimeout(enhance,0);
          return result;
        });
      };
      wrappedGo.__arkSceneWrapped = true;
      window.go = wrappedGo;
    }
    document.addEventListener('click', function (event) {
      var target = event.target && event.target.closest ? event.target.closest('[data-go]') : null;
      if (!target) return;
      var destination = target.getAttribute('data-go');
      if (!destination) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (typeof window.go === 'function') window.go(destination);
      else if (typeof go === 'function') go(destination);
    }, true);
  }
  window.NovaOrdemARKScenes = {refresh:enhance};
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, {once:true});
  else initialize();
})();