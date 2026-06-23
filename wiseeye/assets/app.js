/* ============================================================
   慧眼建安 WiseEye-JA · 原型共享脚本（框架 / 数据 / 工具）
   龙岗区建筑工地 AI 智能监管平台 · 演示数据均为脱敏示例
   ============================================================ */

/* ---------- 报警类型字典（对齐神眸工地 AlarmType 集合） ---------- */
const TYPES = {
  20001:{name:'未佩戴安全帽', short:'安全帽', icon:'🪖', level:'serious'},
  20002:{name:'明火/烟火',    short:'烟火',   icon:'🔥', level:'major'},
  20003:{name:'未穿反光衣',   short:'反光衣', icon:'🦺', level:'general'},
  13001:{name:'危险区域闯入', short:'闯入',   icon:'⛔', level:'major'},
  10010:{name:'离岗脱岗',     short:'离岗',   icon:'💤', level:'general'},
  11005:{name:'违规高处攀爬', short:'攀爬',   icon:'🧗', level:'serious'}
};
const LVNAME = {major:'重大', serious:'较大', general:'一般'};
const DEADLINE = {major:2, serious:5, general:10};
const ST = {PENDING:'待确认', CONFIRMED:'已确认', MISJUDGE:'误报'};

/* ---------- 默认报警数据 ---------- */
const DEFAULT_ALARMS = [
  {id:1, type:20001, conf:96, status:'PENDING', sn:'7K2J8801', dev:'DH-IPC-门口枪机', site:'五和社区·沿街商铺装修', street:'坂田街道', time:'09:32', box:{x:25,y:46,w:14,h:20}},
  {id:2, type:13001, conf:93, status:'PENDING', sn:'7K2J8842', dev:'HK-球机-3#楼东侧', site:'岗头社区·旧楼加固工程', street:'坂田街道', time:'09:18', box:{x:46,y:60,w:22,h:26}},
  {id:3, type:20002, conf:88, status:'PENDING', sn:'7K2J8815', dev:'DH-IPC-料场', site:'甘坑社区·充电设施安装', street:'布吉街道', time:'08:55', box:{x:62,y:64,w:20,h:18}},
  {id:4, type:11005, conf:84, status:'PENDING', sn:'7K2J8867', dev:'HK-球机-脚手架', site:'南岭社区·外墙清洗作业', street:'南湾街道', time:'08:40', box:{x:64,y:14,w:11,h:44}},
  {id:5, type:20003, conf:79, status:'PENDING', sn:'7K2J8820', dev:'DH-IPC-通道口', site:'五和社区·沿街商铺装修', street:'坂田街道', time:'08:22', box:{x:30,y:44,w:13,h:24}},
  {id:6, type:10010, conf:82, status:'PENDING', sn:'7K2J8853', dev:'HK-枪机-门岗', site:'木棉湾社区·招牌安装', street:'布吉街道', time:'08:05', box:{x:40,y:42,w:14,h:24}},
  {id:101, type:20001, conf:95, status:'CONFIRMED', sn:'7K2J8801', dev:'DH-IPC', site:'五和社区', street:'坂田街道', time:'昨日', box:{x:30,y:46,w:14,h:20}},
  {id:102, type:20002, conf:90, status:'MISJUDGE', sn:'7K2J8815', dev:'DH-IPC', site:'甘坑社区', street:'布吉街道', time:'昨日', box:{x:62,y:64,w:18,h:18}}
];

const STORE='we_alarms_v1';
function loadAlarms(){ try{const s=localStorage.getItem(STORE); if(s)return JSON.parse(s);}catch(e){} return JSON.parse(JSON.stringify(DEFAULT_ALARMS)); }
function saveAlarms(a){ try{localStorage.setItem(STORE, JSON.stringify(a));}catch(e){} }
function resetAlarms(){ localStorage.removeItem(STORE); }
let alarms = loadAlarms();
function getAlarm(id){ return alarms.find(a=>String(a.id)===String(id)); }

/* ---------- 工地 / 街道 / 风险 演示数据 ---------- */
const SITES = [
  {id:1, name:'五和社区·沿街商铺装修', street:'坂田街道', ent:'深圳市建越建设', risk:87, lvl:'red', dev:6, online:6},
  {id:2, name:'丹竹头·基坑支护工程', street:'南湾街道', ent:'鹏程基础工程', risk:81, lvl:'red', dev:8, online:7},
  {id:3, name:'岗头·旧楼加固工程', street:'坂田街道', ent:'中建龙岗加固', risk:74, lvl:'yellow', dev:5, online:5},
  {id:4, name:'甘坑·充电设施安装', street:'布吉街道', ent:'南网电力建设', risk:68, lvl:'yellow', dev:4, online:3},
  {id:5, name:'南岭·外墙清洗作业', street:'南湾街道', ent:'高空建筑服务', risk:61, lvl:'yellow', dev:5, online:5},
  {id:6, name:'木棉湾·招牌安装', street:'布吉街道', ent:'城市广告工程', risk:43, lvl:'green', dev:3, online:3}
];

const AI_ADVICES = [
  {t:'五和社区装修工程持续高发', u:'紧急', uc:'var(--major)', c:'近 7 日未佩戴安全帽报警 18 起、整改率仅 52%，连续 2 日未召开班前会。建议责令企业落实班前交底、增派复核、纳入本周重点督办。'},
  {t:'临边/基坑类违规上升', u:'中', uc:'var(--info)', c:'基坑支护工程危险区域闯入报警环比上升 23%。建议下发专项提示并约谈相关企业。'}
];

/* ---------- 运营参数配置（P1-6） ---------- */
const CFG_DEFAULTS = {
  'cooldown.default_ttl':300, 'cooldown.misjudge_ttl':1800, 'notify.aggregate_window':600,
  'silent.start':22, 'silent.end':6, 'sla.normal':1800, 'sla.critical':600, 'gps.threshold_m':50
};
function loadCfg(){ try{return {...CFG_DEFAULTS,...(JSON.parse(localStorage.getItem('we_cfg'))||{})};}catch(e){return {...CFG_DEFAULTS};} }
function saveCfg(c){ localStorage.setItem('we_cfg', JSON.stringify(c)); }

/* ---------- 登录态 / 角色 ---------- */
const ROLES = {insp:'巡查员', site:'工地负责人', admin:'监管管理端'};
function requireLogin(){ if(!localStorage.getItem('we_user')) location.href='login.html'; }
function currentUser(){ return localStorage.getItem('we_user')||'王师傅'; }
function currentRole(){ return localStorage.getItem('we_role')||'insp'; }
function logout(){ localStorage.removeItem('we_user'); localStorage.removeItem('we_role'); location.href='login.html'; }
function confirmLogout(){ if(confirm('确定退出登录？')) logout(); }

/* ---------- 施工场景 SVG（报警缩略图/大图） ---------- */
function sceneSVG(){
  return `<svg viewBox="0 0 320 240" width="100%" style="display:block" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b7a86"/><stop offset="1" stop-color="#3c5560"/></linearGradient></defs>
    <rect width="320" height="240" fill="url(#sky)"/>
    <rect x="0" y="60" width="200" height="180" fill="#6b7b80"/><rect x="0" y="60" width="200" height="180" fill="#000" opacity="0.06"/>
    <rect x="120" y="150" width="200" height="90" fill="#8a8175"/><rect x="120" y="150" width="200" height="8" fill="#6e6557"/>
    <rect x="210" y="20" width="6" height="160" fill="#c9952f"/><rect x="280" y="20" width="6" height="160" fill="#c9952f"/>
    <rect x="205" y="70" width="86" height="5" fill="#c9952f"/><rect x="205" y="120" width="86" height="5" fill="#c9952f"/>
    <g transform="translate(96,120)"><circle cx="0" cy="-6" r="8" fill="#e8b894"/><rect x="-9" y="4" width="18" height="30" rx="5" fill="#d98032"/><rect x="-8" y="34" width="6" height="22" fill="#33424a"/><rect x="2" y="34" width="6" height="22" fill="#33424a"/></g>
  </svg>`;
}
/* 伪二维码 13×13 */
function qrSVG(seed){
  let s=0; for(const c of String(seed)) s=(s*31+c.charCodeAt(0))>>>0;
  const n=13, cell=100/n; let r='';
  const rnd=()=>{ s=(s*1103515245+12345)&0x7fffffff; return s/0x7fffffff; };
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){
    const corner=(x<3&&y<3)||(x>=n-3&&y<3)||(x<3&&y>=n-3);
    if(corner||rnd()>0.5) r+=`<rect x="${(x*cell).toFixed(2)}" y="${(y*cell).toFixed(2)}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}" fill="#16202B"/>`;
  }
  return `<svg viewBox="0 0 100 100">${r}</svg>`;
}

/* ---------- 角色底部导航 ---------- */
function tabbarHTML(role, active){
  const pend = alarms.filter(a=>a.status==='PENDING').length;
  const badge = pend>0?`<span class="nbadge">${pend}</span>`:'';
  const TABS = {
    insp:[['home','insp-home.html','🏠','首页',''],['alarms','insp-alarms.html','🔔','报警',badge],['me','insp-me.html','👤','我的','']],
    site:[['home','site-home.html','🏠','首页',''],['meeting','site-meeting.html','📋','班前会',''],['alarms','site-alarms.html','🔔','报警','']],
    admin:[['ov','admin-overview.html','📊','总览',''],['risk','admin-risk.html','⚠️','风险',''],['report','admin-report.html','📈','报表',''],['cfg','admin-config.html','⚙️','配置','']]
  };
  const btn=([id,href,icon,label,extra])=>`<button class="${active===id?'on':''}" onclick="go('${href}')"><span class="ti">${icon}</span>${label}${extra}</button>`;
  return `<div class="tabbar">${TABS[role].map(btn).join('')}</div>`;
}

/* ---------- 整页渲染 ---------- */
function renderApp(o){
  const back = o.back?`<div class="back" onclick="goBack()">‹</div>`:'';
  const sub = o.sub?`<span class="who">${o.sub}</span>`:'';
  const tabbar = o.tab?tabbarHTML(o.role||currentRole(), o.tab):'';
  const padCls = o.tab?'page':'page no-tab';
  document.getElementById('app').innerHTML = `
  <div class="phone">
    <div class="notch"></div>
    <div class="statusbar"><span id="clock">9:41</span><span class="r">●●●  5G  <span class="bat">82</span></span></div>
    <div class="appbar">${back}<div class="brand">慧</div><h1>${o.title}${sub}</h1>${o.tab?'<div class="bell" onclick="toast(\'演示：消息通知\')">🔔<span class="dot"></span></div>':''}<div class="logout" onclick="confirmLogout()" title="退出登录">⏻</div></div>
    <div class="body"><div class="${padCls}">${o.body}</div></div>
    ${tabbar}
    <div class="toast" id="toast"></div>
  </div>`;
  startClock();
}
function go(href){ location.href=href; }
function goBack(){ if(history.length>1) history.back(); else go('insp-home.html'); }

/* ---------- 工具 ---------- */
let _tt;
function toast(m){ const t=document.getElementById('toast'); if(!t)return; t.textContent=m; t.classList.add('show'); clearTimeout(_tt); _tt=setTimeout(()=>t.classList.remove('show'),1900); }
function startClock(){ const set=()=>{const d=new Date();const el=document.getElementById('clock'); if(el)el.textContent=`${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;}; set(); clearInterval(window.__clk); window.__clk=setInterval(set,30000); }
function getParam(k){ return new URLSearchParams(location.search).get(k); }
function alarmThumb(a){ const t=TYPES[a.type]; return `<div class="thumb">${sceneSVG()}<div class="tbox ${t.level}" style="left:${a.box.x}%;top:${a.box.y}%;width:${a.box.w}%;height:${a.box.h}%"></div><div class="ttag">${t.icon} AI</div></div>`; }
