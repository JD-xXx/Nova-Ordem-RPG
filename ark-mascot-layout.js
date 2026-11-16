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
    '.ark-scene-bubble{position:relative;flex:1;min-width:0;padding:12px 15px;border:1px solid rgba(92,172,224,.3);border-radius:10px;background:rgba(8,20,32,.82);color:#c8dced;font-size:13px;line-height:1.65}',
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
    '.ark-demo-holo-window{z-index:2}',
    '.ark-demo-transmitter{position:absolute!important;left:0;bottom:0;margin:0!important;width:104px;min-height:102px;align-items:flex-start;justify-content:flex-end;z-index:1!important}',
    '.ark-demo-presenter-label{margin-left:3px!important;text-align:left!important}',
    '.ark-demo-projector{width:82px!important;height:76px!important;justify-content:flex-start!important;margin-left:5px}',
    '.ark-demo-presenter-robot{width:64px!important;height:68px!important;transform:rotate(8deg);animation:ark-demo-presenter-face-right 3.4s ease-in-out infinite!important}',
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
    '@keyframes ark-demo-presenter-face-right{0%,100%{transform:rotate(8deg) translateY(0)}50%{transform:rotate(8deg) translateY(-3px)}}',
    '@media(max-width:700px){.ark-demo-composition{min-height:252px;padding-bottom:0}.ark-demo-transmitter{width:78px;min-height:80px}.ark-demo-projector{width:66px!important;height:62px!important}.ark-demo-presenter-robot{width:52px!important;height:56px!important}.ark-demo-projection-beam{left:35px!important;top:-174px!important;width:calc(100vw - 64px)!important;height:190px!important}.ark-demo-robot .ark-demo-katana{left:-35px!important;top:47px!important;width:68px!important;height:17px!important}}'
  ].join('\n');
  var style = document.createElement('style');
  style.id = 'ark-scene-layout-styles';
  style.textContent = css;
  document.head.appendChild(style);

  var robotSvg = '<svg viewBox="0 0 160 180" role="img" aria-label="A.R.K., androide branco flutuante com visor escuro e olhos azuis">' +
    '<defs><linearGradient id="ark-shell-eve" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff"/><stop offset=".52" stop-color="#f3faff"/><stop offset="1" stop-color="#b8d1df"/></linearGradient><linearGradient id="ark-face-eve" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#163a54"/><stop offset="1" stop-color="#020c17"/></linearGradient><radialGradient id="ark-eye-eve"><stop stop-color="#fff"/><stop offset=".4" stop-color="#8ceaff"/><stop offset="1" stop-color="#168bd3"/></radialGradient><filter id="ark-glow-eve"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>' +
    '<ellipse cx="80" cy="168" rx="31" ry="5" fill="#39b9f4" opacity=".2"/><ellipse cx="80" cy="166" rx="19" ry="2" fill="#b7efff" opacity=".65"/>' +
    '<path d="M57 105Q42 109 35 126L28 143Q26 150 33 153Q40 155 45 148L58 133M103 105Q118 109 125 126L132 143Q134 150 127 153Q120 155 115 148L102 133" fill="url(#ark-shell-eve)" stroke="#a9c4d3" stroke-width="2" stroke-linejoin="round"/>' +
    '<circle cx="43" cy="125" r="5" fill="#dff5ff" stroke="#94b9cd"/><circle cx="117" cy="125" r="5" fill="#dff5ff" stroke="#94b9cd"/>' +
    '<path d="M80 82C60 82 51 96 51 116L51 137Q51 151 80 155Q109 151 109 137L109 116C109 96 100 82 80 82Z" fill="url(#ark-shell-eve)" stroke="#a9c4d3" stroke-width="2"/>' +
    '<path d="M62 105Q80 96 98 105" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".9"/><path d="M68 139Q80 145 92 139" fill="none" stroke="#7fc5e4" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M80 10C53 10 39 26 39 51C39 78 55 94 80 94C105 94 121 78 121 51C121 26 107 10 80 10Z" fill="url(#ark-shell-eve)" stroke="#a9c4d3" stroke-width="2"/>' +
    '<path d="M49 34Q59 15 80 15Q101 15 111 34" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>' +
    '<rect x="45" y="39" width="70" height="37" rx="17" fill="url(#ark-face-eve)" stroke="#6594ae" stroke-width="1.5"/>' +
    '<ellipse class="ark-eye ark-eye--left" cx="65" cy="57" rx="6.5" ry="9" fill="url(#ark-eye-eve)" filter="url(#ark-glow-eve)"/><ellipse class="ark-eye ark-eye--right" cx="95" cy="57" rx="6.5" ry="9" fill="url(#ark-eye-eve)" filter="url(#ark-glow-eve)"/>' +
    '<path d="M72 83Q80 87 88 83" fill="none" stroke="#79d8fa" stroke-width="1.8" stroke-linecap="round" opacity=".85"/>' +
    '<path d="M80 10V4" stroke="#8bdcff" stroke-width="2" stroke-linecap="round"/><circle cx="80" cy="4" r="3" fill="#8be7ff" filter="url(#ark-glow-eve)"/>' +
    '<path d="M68 157L80 162L92 157" fill="none" stroke="#8ddcff" stroke-width="2" stroke-linecap="round" opacity=".8"/></svg>';

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
    '.ark-rank-title--commander{color:#d8f1ff;text-shadow:0 0 6px #8ddcff,0 0 15px #58baff;animation:ark-commander-glint 2.4s ease-in-out infinite}',
    '.ark-rank-title--pillar:after,.ark-rank-title--lord:after,.ark-rank-title--commander:after{content:"";position:absolute;inset:-7px -12px;z-index:-1;pointer-events:none}',
    '.ark-rank-title--pillar:after{background:radial-gradient(ellipse,rgba(255,76,25,.25),transparent 70%);filter:blur(5px);animation:ark-flame-halo .9s ease-in-out infinite alternate}',
    '.ark-rank-title--lord:after{background:linear-gradient(115deg,transparent 15%,rgba(255,245,185,.0) 38%,rgba(255,245,185,.9) 50%,transparent 62%);background-size:220% 100%;animation:ark-lightning 2.2s linear infinite}',
    '.ark-rank-title--commander:after{background:linear-gradient(115deg,transparent 20%,rgba(180,235,255,.75) 50%,transparent 80%);background-size:220% 100%;animation:ark-lightning 3.2s linear infinite}',
    '.ark-rank-robot{width:min(100%,132px);height:142px;display:grid;place-items:center;filter:drop-shadow(0 7px 15px rgba(78,190,244,.24));animation:ark-rank-float 3.5s ease-in-out infinite}',
    '.ark-rank-card--first .ark-rank-robot{width:min(100%,154px);height:164px;filter:drop-shadow(0 0 15px rgba(255,83,52,.25))}',
    '.ark-rank-robot svg{width:100%;height:100%;overflow:visible}',
    '.ark-rank-plinth{position:relative;display:flex;align-items:center;justify-content:center;width:100%;height:72px;margin-top:3px;border:1px solid rgba(112,181,215,.3);border-bottom:0;border-radius:8px 8px 0 0;background:linear-gradient(150deg,rgba(40,87,116,.82),rgba(11,32,49,.96));box-shadow:inset 0 1px rgba(220,247,255,.14),0 -8px 22px rgba(40,154,212,.08)}',
    '.ark-rank-card--first .ark-rank-plinth{height:112px;border-color:rgba(255,116,84,.48);background:linear-gradient(150deg,rgba(112,46,44,.9),rgba(35,18,25,.98));box-shadow:inset 0 1px rgba(255,213,190,.2),0 -8px 25px rgba(255,72,38,.13)}',
    '.ark-rank-card--second .ark-rank-plinth{height:88px;border-color:rgba(229,203,135,.42);background:linear-gradient(150deg,rgba(104,84,44,.82),rgba(31,28,24,.98))}',
    '.ark-rank-card--third .ark-rank-plinth{height:66px;border-color:rgba(164,216,238,.38);background:linear-gradient(150deg,rgba(65,100,119,.82),rgba(17,30,41,.98))}',
    '.ark-rank-plinth b{color:#e7f6ff;font:800 23px var(--display,Arial);text-shadow:0 2px 8px #0008}',
    '.ark-rank-card--first .ark-rank-plinth b{font-size:30px;color:#ffd0b8}.ark-rank-card--second .ark-rank-plinth b{color:#f6e5b5}.ark-rank-card--third .ark-rank-plinth b{color:#d8f1ff}',
    '.ark-rank-caption{margin-top:8px;color:#91b4ca;font:700 8px var(--mono,monospace);letter-spacing:1px}',
    '@keyframes ark-podium-sheen{0%{background-position:120% 0}100%{background-position:-120% 0}}',
    '@keyframes ark-rank-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}',
    '@keyframes ark-pillar-fire{0%{text-shadow:0 0 4px #ff6a35,0 0 10px #ff351d,0 3px 16px #f30}100%{text-shadow:0 -2px 7px #ffd06a,0 0 17px #ff351d,0 4px 24px #e20}}',
    '@keyframes ark-flame-halo{from{opacity:.45;transform:scale(.9)}to{opacity:1;transform:scale(1.12)}}',
    '@keyframes ark-lord-electric{0%,18%,22%,65%,70%,100%{filter:brightness(1);text-shadow:0 0 5px #ffe39a,0 0 14px #d99a24}20%,68%{filter:brightness(1.7);text-shadow:0 0 8px #fff6c7,0 0 22px #ffbf36,2px 0 3px #fff}}',
    '@keyframes ark-lightning{0%{background-position:120% 0;opacity:0}18%{opacity:.8}38%{opacity:0}100%{background-position:-120% 0;opacity:0}}',
    '@keyframes ark-commander-glint{0%,100%{filter:brightness(1);text-shadow:0 0 6px #8ddcff,0 0 15px #58baff}50%{filter:brightness(1.5);text-shadow:0 0 10px #e4f8ff,0 0 23px #69cfff}}',
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
      '<article class="ark-rank-card ark-rank-card--third"><h3 class="ark-rank-title ark-rank-title--commander">COMANDANTE-GERAL</h3><div class="ark-rank-robot" aria-hidden="true">' + robotSvg + '</div><div class="ark-rank-plinth"><b>3º</b></div><div class="ark-rank-caption">TERCEIRO LUGAR</div></article>' +
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
  function addFeatureGuide(content, heading, key, message, peek) {
    var feature = Array.prototype.find.call(content.querySelectorAll('.feature'), function (node) {
      var h = node.querySelector('h3');
      return h && h.textContent.trim() === heading;
    });
    if (!feature || content.querySelector('[data-ark-key="' + key + '"]')) return;
    var holder = document.createElement('div');
    holder.className = 'ark-feature-guide' + (peek ? ' ark-feature-guide--peek' : '');
    holder.innerHTML = scene(key, message, 'comic');
    feature.parentNode.insertBefore(holder, feature.nextSibling);
    var trail = document.createElement('div');
    trail.className = 'ark-dust-trail';
    trail.setAttribute('aria-hidden', 'true');
    trail.innerHTML = '<i></i><i></i><i></i><i></i><i></i>';
    holder.parentNode.insertBefore(trail, holder.nextSibling);
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
    var presenter = '<div class="ark-demo-transmitter" aria-label="A.R.K. atual projetando o holograma"><span class="ark-demo-presenter-label">A.R.K. / PROJETANDO</span><div class="ark-demo-projector"><i class="ark-demo-projection-beam" aria-hidden="true"></i><div class="ark-demo-presenter-robot">' + robotSvg + '</div></div></div>';
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
    if (id === 'chi') { addChiGuide(content); return; }
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
      var welcome = content.querySelector('.welcome-marketing');
      if (welcome) {
        addAfter(welcome.querySelector('.welcome-copy'), 'home-intro', 'Olá! Eu sou o A.R.K., um dos programas de defesa e assistência da Agência. Vou acompanhar sua exploração pela Nova Ordem e explicar os registros conforme você avança.');
        addAfter(welcome.querySelector('.innovation-copy'), 'home-tools', 'Nesta área ficam as ferramentas interativas. Os treinamentos registram atividades de desenvolvimento; a Forja recebe projetos; e o Trabalho registra jornadas profissionais.', 'compact');
        addAfter(welcome.querySelector('.innovation-grid'), 'home-tools-detail', 'Se alguma ferramenta ainda estiver em desenvolvimento, eu aviso. Não vou apresentar funções incompletas como se já estivessem disponíveis.', 'compact');
      }
      var oldIntro = content.querySelector('.intro-lead');
      if (oldIntro) addAfter(oldIntro, 'home-intro-fallback', 'Olá! Eu sou o A.R.K., guia virtual da Agência. Explore os registros e encontre minhas orientações ao longo da página.', 'compact');
      return;
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
    if (id === 'chi') {
      addAfter(content.querySelector('.panel'), 'chi-intro-example', 'Ter Chi não significa saber utilizá-lo. Todos os seres vivos possuem Chi, mas pessoas comuns podem ter essa energia inativa. Percepção, controle e treinamento são etapas diferentes.', 'compact');
      addAfterIndex(content, '.rows', 0, 'chi-emission-example', 'Na prática, uma técnica simples e breve tende a exigir menos Chi do que uma manifestação complexa, potente ou mantida por muito tempo. O custo considera esses três fatores, não uma tarifa fixa para toda habilidade.', 'compact');
      addAfterIndex(content, '.rows', 1, 'chi-recovery-example', 'Se um personagem gastar energia demais, descansar e meditar são formas de recuperação. Continuar tentando executar técnicas durante a exaustão pode comprometer o controle e deixá-lo vulnerável.', 'compact');
      return;
    }
    if (id === 'talents') {
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
    if (id !== 'overview' && id !== 'ark' && !content.querySelector('[data-ark-scene="true"]')) {
      var anchor = content.querySelector('.panel') || content.querySelector('.intro-lead') || content.firstElementChild;
      addBefore(anchor, 'page-guide-' + id, 'Oi! Passei por este arquivo para ajudar na leitura. Observe os títulos, exemplos e tabelas com calma; se alguma regra não estiver explicada aqui, não vou inventar uma resposta. Pode me chamar pela Central do A.R.K. quando precisar!', 'compact');
    }
  }
  function initialize() {
    var content = document.getElementById('content');
    enhance();
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
        var result = previousGo.apply(this, arguments);
        window.setTimeout(enhance, 0);
        return result;
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