/* ============================================================
   小快灵 H5 · 共享脚本（数据 / 状态 / 框架 / 工具）
   所有演示数据均为脱敏示例
   ============================================================ */

/* ---------- 静态字典 ---------- */
const LAW = {
  helmet:{code:'《建筑施工安全检查标准》JGJ 59-2011 第3.11.3条',text:'作业人员进入施工现场应正确佩戴安全帽（演示引据）。'},
  smoking:{code:'《建设工程施工现场消防安全技术规范》GB 50720',text:'施工现场易燃易爆区域严禁吸烟及明火作业（演示引据）。'},
  climb:{code:'《建筑施工高处作业安全技术规范》JGJ 80',text:'严禁攀爬脚手架、井架等结构上下，应走规定通道（演示引据）。'},
  edge:{code:'《建筑施工高处作业安全技术规范》JGJ 80',text:'临边、洞口应设置稳固的防护栏杆或盖板（演示引据）。'},
  fire:{code:'《建设工程施工现场消防安全技术规范》GB 50720',text:'发现烟雾/明火应立即处置并配置足够灭火器材（演示引据）。'}
};
const TYPE = {
  helmet:{name:'未佩戴安全帽', short:'安全帽', icon:'🪖', chain:'人形检测 → 大模型分析', cat:'ai'},
  smoking:{name:'吸烟行为', short:'吸烟', icon:'🚬', chain:'人形检测 → 大模型分析', cat:'ai'},
  climb:{name:'违规攀爬', short:'攀爬', icon:'🧗', chain:'人形检测 → 大模型分析', cat:'ai'},
  edge:{name:'临边作业危险', short:'临边', icon:'🚧', chain:'人形检测 → 大模型分析', cat:'ai'},
  fire:{name:'疑似烟火', short:'烟火', icon:'🔥', chain:'烟火检测（基础）', cat:'basic'}
};
const DEADLINE = {major:2, serious:5, general:10};
const LVNAME = {major:'重大', serious:'较大', general:'一般'};
const STNAME = {pending:'待确认', confirmed:'已确认', closed:'已闭环', rejected:'已驳回'};

/* ---------- 默认报警数据 ---------- */
const DEFAULT_ALARMS = [
  {id:1, type:'helmet', level:'serious', conf:96, status:'pending', note:'',
   device:'DH-IPC-门口枪机 (SN:7K2J8801)', org:'坂田街道 · 五和社区 · 沿街商铺装修工程', time:'09:32', box:{x:25,y:46,w:14,h:20}},
  {id:2, type:'edge', level:'major', conf:93, status:'pending', note:'',
   device:'HK-球机-3#楼东侧 (SN:7K2J8842)', org:'坂田街道 · 岗头社区 · 旧楼加固工程', time:'09:18', box:{x:46,y:62,w:22,h:26}},
  {id:3, type:'smoking', level:'serious', conf:88, status:'pending', note:'',
   device:'DH-IPC-料场 (SN:7K2J8815)', org:'布吉街道 · 甘坑社区 · 充电设施安装', time:'08:55', box:{x:30,y:42,w:13,h:18}},
  {id:4, type:'climb', level:'major', conf:84, status:'pending', note:'',
   device:'HK-球机-脚手架 (SN:7K2J8867)', org:'南湾街道 · 南岭社区 · 外墙清洗作业', time:'08:40', box:{x:64,y:14,w:11,h:44}},
  {id:5, type:'fire', level:'general', conf:79, status:'pending', note:'',
   device:'DH-IPC-角落 (SN:7K2J8820)', org:'坂田街道 · 五和社区 · 沿街商铺装修工程', time:'08:22', box:{x:74,y:78,w:22,h:18}},
  {id:6, type:'helmet', level:'serious', conf:91, status:'pending', note:'',
   device:'HK-枪机-2#门 (SN:7K2J8853)', org:'布吉街道 · 木棉湾社区 · 招牌安装作业', time:'08:05', box:{x:40,y:44,w:14,h:21}},
  {id:7, type:'edge', level:'major', conf:86, status:'pending', note:'',
   device:'DH-IPC-基坑 (SN:7K2J8809)', org:'南湾街道 · 丹竹头社区 · 基坑支护工程', time:'07:48', box:{x:48,y:64,w:24,h:24}},
  {id:101, type:'helmet', level:'serious', conf:95, status:'closed', note:'已现场整改', device:'DH-IPC (SN:7K2J8801)', org:'坂田街道 · 五和社区', time:'昨日', box:{x:30,y:46,w:14,h:20}},
  {id:102, type:'smoking', level:'serious', conf:90, status:'closed', note:'已劝离', device:'DH-IPC (SN:7K2J8815)', org:'布吉街道 · 甘坑社区', time:'昨日', box:{x:30,y:42,w:13,h:18}},
  {id:103, type:'edge', level:'major', conf:92, status:'closed', note:'已加防护', device:'HK-球机 (SN:7K2J8842)', org:'南湾街道 · 丹竹头社区', time:'昨日', box:{x:46,y:62,w:22,h:26}}
];

/* ---------- 状态持久化（localStorage，跨页面共享） ---------- */
const STORE_KEY = 'axt_alarms_v1';
function loadAlarms(){
  try{ const s = localStorage.getItem(STORE_KEY); if(s) return JSON.parse(s); }catch(e){}
  return JSON.parse(JSON.stringify(DEFAULT_ALARMS));
}
function saveAlarms(arr){ try{ localStorage.setItem(STORE_KEY, JSON.stringify(arr)); }catch(e){} }
function resetAlarms(){ localStorage.removeItem(STORE_KEY); }
let alarms = loadAlarms();
function getAlarm(id){ return alarms.find(a=>String(a.id)===String(id)); }

/* ---------- 登录态 ---------- */
function requireLogin(){
  if(!localStorage.getItem('axt_user')){ location.href='login.html'; }
}
function currentUser(){ return localStorage.getItem('axt_user') || '王师傅'; }

/* ---------- 施工场景 SVG ---------- */
function sceneSVG(){
  return `<svg viewBox="0 0 320 240" width="100%" style="display:block" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5b7a86"/><stop offset="1" stop-color="#3c5560"/></linearGradient></defs>
    <rect width="320" height="240" fill="url(#sky)"/>
    <rect x="0" y="60" width="200" height="180" fill="#6b7b80"/><rect x="0" y="60" width="200" height="180" fill="#000" opacity="0.06"/>
    <rect x="120" y="150" width="200" height="90" fill="#8a8175"/><rect x="120" y="150" width="200" height="8" fill="#6e6557"/>
    <rect x="150" y="158" width="70" height="60" fill="#33424a"/>
    <rect x="210" y="20" width="6" height="160" fill="#c9952f"/><rect x="280" y="20" width="6" height="160" fill="#c9952f"/>
    <rect x="205" y="70" width="86" height="5" fill="#c9952f"/><rect x="205" y="120" width="86" height="5" fill="#c9952f"/>
    <rect x="28" y="120" width="40" height="52" rx="3" fill="#3f5560"/><rect x="34" y="128" width="28" height="20" fill="#5e7681"/><circle cx="48" cy="160" r="3" fill="#ffd23f"/>
    <g transform="translate(96,120)"><circle cx="0" cy="-6" r="8" fill="#e8b894"/><rect x="-9" y="4" width="18" height="30" rx="5" fill="#d98032"/><rect x="-8" y="34" width="6" height="22" fill="#33424a"/><rect x="2" y="34" width="6" height="22" fill="#33424a"/></g>
  </svg>`;
}

/* ---------- 框架渲染：状态栏 / 顶栏 / 底栏 ---------- */
function tabbarHTML(active){
  const pend = alarms.filter(a=>a.status==='pending').length;
  const badge = pend>0 ? `<span class="nbadge">${pend}</span>` : '';
  const tab=(id,href,icon,label,extra='')=>`<button class="${active===id?'on':''}" onclick="go('${href}')"><span class="ti">${icon}</span>${label}${extra}</button>`;
  return `<div class="tabbar">
    ${tab('home','home.html','🏠','工作台')}
    ${tab('alarms','alarms.html','🔔','报警',badge)}
    ${tab('stats','stats.html','📊','统计')}
    ${tab('me','me.html','👤','我的')}
  </div>`;
}

/**
 * 渲染整页外框
 * @param {object} o {title, sub, back, tab, body}
 */
function renderApp(o){
  const back = o.back ? `<div class="back" onclick="goBack()">‹</div>` : '';
  const bell = o.tab!==undefined ? `<div class="bell" onclick="go('drafts.html')">🔔<span class="dot"></span></div>` : '';
  const sub = o.sub ? `<span class="who">${o.sub}</span>` : '';
  const tabbar = o.tab ? tabbarHTML(o.tab) : '';
  const padCls = o.tab ? 'page' : 'page no-tab';
  document.getElementById('app').innerHTML = `
  <div class="phone">
    <div class="notch"></div>
    <div class="statusbar">
      <span id="clock">9:41</span>
      <span class="r">●●●  5G  <span style="border:1px solid var(--ink);border-radius:3px;padding:0 3px;font-size:9px">82</span></span>
    </div>
    <div class="appbar">
      ${back}
      <div class="brand-dot">小</div>
      <h1>${o.title}${sub}</h1>
      ${bell}
    </div>
    <div class="body"><div class="${padCls}">${o.body}</div></div>
    ${tabbar}
    <div class="toast" id="toast"></div>
  </div>`;
  startClock();
}

/* ---------- 导航 ---------- */
function go(href){ location.href = href; }
function goBack(){ if(history.length>1) history.back(); else go('home.html'); }

/* ---------- 报警卡片（首页 / 列表共用） ---------- */
function alarmCardHTML(a){
  const t=TYPE[a.type];
  return `<div class="alarm ${a.level}" onclick="openAlarm(${a.id})">
    <div class="top">
      <div class="thumb">${sceneSVG()}
        <div class="tbox" style="left:${a.box.x}%;top:${a.box.y}%;width:${a.box.w}%;height:${a.box.h}%"></div>
        <div class="ttag">${t.icon} AI</div>
      </div>
      <div class="info">
        <div class="nm">${t.name}<span class="badge ${a.level}">${LVNAME[a.level]}</span></div>
        <div class="meta">
          <span class="dv">📷 ${a.device}</span>
          <span class="dv">📍 ${a.org}</span>
        </div>
      </div>
    </div>
    <div class="foot">
      <span class="conf">AI ${a.conf}% <span class="bar"><i style="width:${a.conf}%"></i></span></span>
      <span style="color:var(--ink-3)">· ${a.time}</span>
      <span class="status-pill ${a.status}">${STNAME[a.status]}</span>
    </div>
  </div>`;
}
function openAlarm(id){
  const a=getAlarm(id); if(!a) return;
  if(a.status==='pending') go('detail.html?id='+id);
  else go('track.html?id='+id);
}

/* ---------- 工具 ---------- */
let toastTimer;
function toast(msg){
  const t=document.getElementById('toast'); if(!t) return;
  t.textContent=msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>t.classList.remove('show'),1900);
}
function startClock(){
  const set=()=>{const d=new Date();const el=document.getElementById('clock');
    if(el) el.textContent=`${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;};
  set(); clearInterval(window.__clk); window.__clk=setInterval(set,30000);
}
function getParam(k){ return new URLSearchParams(location.search).get(k); }
