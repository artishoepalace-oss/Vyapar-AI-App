function playThemeRipple(x,y){const r=document.createElement('div');r.className='theme-ripple';r.style.left=x+'px';r.style.top=y+'px';document.body.appendChild(r);setTimeout(()=>r.remove(),240)}


let tabLoaderTimer=null;
function showTabLoader(){
  const l=document.getElementById('tabLoader');
  if(!l)return;
  l.classList.add('show');
  clearTimeout(tabLoaderTimer);
  tabLoaderTimer=setTimeout(()=>l.classList.remove('show'),400);
}


function hideLoader(){const l=document.getElementById('appLoader');if(l){setTimeout(()=>l.classList.add('hide-loader'),1000);setTimeout(()=>l.remove(),1200)}}
window.addEventListener('load',hideLoader);
setTimeout(hideLoader,1200);

const STORAGE_KEY='vyapar_ai_prod_v1';
const tabs=[['home','Dashboard'],['upload','AI Upload'],['sales','Sales'],['stock','Stock'],['analytics','Analytics'],['calculator','Calculator'],['subscription','Plans'],['settings','Settings']];
let currentTab='home';
let editSaleId='';
let editMonthlyId='';
let state=loadState();
function uid(){return Math.random().toString(36).slice(2)+Date.now().toString(36)}
function money(n){return '₹'+Number(n||0).toLocaleString('en-IN',{maximumFractionDigits:0})}
function pct(n){return Number(n||0).toFixed(1)+'%'}
function monthKey(d){const dt=new Date(d||Date.now());return dt.getFullYear()+'-'+String(dt.getMonth()+1).padStart(2,'0')}
function num(v){if(v===null||v===undefined)return 0;const n=Number(String(v).replace(/[₹,\s]/g,''));return Number.isFinite(n)?n:0}
function monthNameToNum(m){if(!m)return '';const a=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];const idx=a.findIndex(x=>String(m).toLowerCase().trim().startsWith(x));return idx>=0?String(idx+1).padStart(2,'0'):''}
function yearMonth(year,month,date){if(date&&/^\d{4}-\d{2}/.test(String(date)))return String(date).slice(0,7);if(/^\d{4}-\d{2}$/.test(String(month)))return String(month);const mm=monthNameToNum(month)||String(month||'').padStart(2,'0');return (year&&mm)?`${year}-${mm}`:monthKey()}
function defaultCodeMap(){return `A=1
B=2
C=3
D=4
E=5
F=6
G=7
H=8
I=9
J=0
BOX=350
PAIR=499
GST=18
DISC=50
SKU=699
PACK=12`}


function lowEndDevice(){const dm=navigator.deviceMemory||4;const cores=navigator.hardwareConcurrency||4;const ua=navigator.userAgent||'';const oldAndroid=/Android [4-7]\./.test(ua);return oldAndroid||dm<=2||cores<=4}
function performanceMode(){return (state.settings&&state.settings.performance)||'auto'}
function isLiteMode(){const m=performanceMode();return m==='lite'||(m==='auto'&&lowEndDevice())}
function applyPerformance(){document.documentElement.classList.toggle('perf-lite',isLiteMode());document.body.classList.toggle('perf-lite',isLiteMode())}
function setPerformanceMode(mode){state.settings=state.settings||{};state.settings.performance=['auto','smooth','lite'].includes(mode)?mode:'auto';save()}
function glassEnabled(){return !(state.settings&&state.settings.glassEnabled===false)}
function glassOpacity(){const raw=state.settings&&state.settings.glassOpacity!=null?Number(state.settings.glassOpacity):100;return Math.max(0,Math.min(100,Number.isFinite(raw)?raw:100))}
function applyGlassControl(){const light=activeTheme()==='light';const enabled=glassEnabled();const op=enabled?glassOpacity()/100:0;const topBase=light?.80:.18;const bottomBase=light?.22:.03;const doc=document.documentElement;const body=document.body;doc.classList.toggle('glass-off',!enabled);body.classList.toggle('glass-off',!enabled);doc.style.setProperty('--glass-top',`rgba(255,255,255,${(topBase*op).toFixed(3)})`);doc.style.setProperty('--glass-bottom',`rgba(255,255,255,${(bottomBase*op).toFixed(3)})`)}
function setGlassEnabled(flag){state.settings=state.settings||{};state.settings.glassEnabled=!!flag;save()}
function updateGlassOpacityLabel(val){const el=document.getElementById('glassOpacityValue');if(el)el.textContent=Math.round(Number(val)||0)+'%'}
function setGlassOpacity(val){state.settings=state.settings||{};state.settings.glassOpacity=Math.max(0,Math.min(100,Number(val)||0));save()}


function forceReadableFont(){document.documentElement.classList.add('readable-font');document.body.classList.add('readable-font')}


let devTapCount=0;
function devModeEnabled(){return !!(state.settings&&state.settings.devMode)}
function devTap(){devTapCount++; if(devTapCount>=7){state.settings=state.settings||{};state.settings.devMode=!state.settings.devMode;devTapCount=0;save();alert(state.settings.devMode?'Developer Mode unlocked':'Developer Mode hidden')}}
function setBackendUrl(){state.profile=state.profile||{};state.profile.backendUrl=v('devBackendUrl').trim();save()}
function setBillingMode(mode){state.settings=state.settings||{};state.settings.billingMode=mode;save()}
async function testBackend(){const el=document.getElementById('devBackendStatus');const url=(state.profile&&state.profile.backendUrl||'').trim();if(!url){el.textContent='Add endpoint first.';return}el.textContent='Testing...';try{const res=await fetch(url.replace(/\/extractBill$/,'')+'/health',{method:'GET'});el.textContent=res.ok?'Connected':'Endpoint found but health failed'}catch(e){el.textContent='Not connected. Check URL, CORS, deployment and internet.'}}

function loadState(){try{return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY))||{})}catch(e){return defaults()}}
function normalizeState(raw){const d=defaults();return{...d,...raw,profile:{...d.profile,...(raw.profile||{})},settings:{...d.settings,...(raw.settings||{})},sales:Array.isArray(raw.sales)?raw.sales:[],stocks:Array.isArray(raw.stocks)?raw.stocks:[],monthly:Array.isArray(raw.monthly)?raw.monthly:[]}}
function defaults(){return{profile:{businessName:'My Shop',locationType:'Tier 3 City',category:'Footwear',monthlyGoal:50000,backendUrl:'https://vypar-backend.onrender.com'},plan:'free',sales:[],stocks:[],monthly:[],settings:{currency:'INR',theme:'dark',performance:'lite',glassEnabled:false,glassOpacity:0,devMode:false,billingMode:'razorpay',codeMap:defaultCodeMap()}}}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));render()}
function activeTheme(){return state.settings&&state.settings.theme==='light'?'light':'dark'}
function applyTheme(){const th=activeTheme();document.body.classList.toggle('theme-light',th==='light');document.querySelector('meta[name=\"theme-color\"]').setAttribute('content',th==='light'?'#f6f8fb':'#071427');const b=document.getElementById('themeToggle');if(b)b.textContent=th==='light'?'☀️ Light':'🌙 Dark'}
function toggleTheme(ev){const x=ev&&ev.clientX?ev.clientX:window.innerWidth-48;const y=ev&&ev.clientY?ev.clientY:38;playThemeRipple(x,y);state.settings=state.settings||{};state.settings.theme=activeTheme()==='light'?'dark':'light';setTimeout(save,60)}
function setTheme(th){playThemeRipple(window.innerWidth/2,window.innerHeight/2);state.settings=state.settings||{};state.settings.theme=th==='light'?'light':'dark';setTimeout(save,60)}
function setTab(tab,withLoader=false){if(tab==='upload'&&!requirePlan('pro'))return;if(tab==='analytics'&&!requirePlan('pro'))return;if(tab==='stock'&&!requirePlan('business'))return;if(withLoader)showTabLoader();currentTab=tab;document.querySelectorAll('.screen').forEach(s=>s.classList.add('hide'));const screen=document.getElementById('screen-'+tab);if(screen)screen.classList.remove('hide');document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab)); if(tab==='analytics') setTimeout(drawAnalyticsCharts,0);}
function renderNav(){document.getElementById('nav').innerHTML=tabs.map(([id,name])=>`<button data-tab="${id}" class="${id===currentTab?'active':''}" onclick="setTab('${id}',true)">${name}</button>`).join('');}
function totals(){const saleTotal=state.sales.reduce((a,x)=>a+(+x.sellingPrice||0)*(+x.qty||0),0);const profit=state.sales.reduce((a,x)=>a+((+x.sellingPrice||0)-(+x.purchasePrice||0))*(+x.qty||0),0)+state.monthly.reduce((a,x)=>a+(+x.profit||0),0);const qty=state.sales.reduce((a,x)=>a+(+x.qty||0),0);const margin=saleTotal?profit/saleTotal*100:0;return{saleTotal,profit,qty,margin}}
function render(){forceReadableFont();applyTheme();applyGlassControl();applyPerformance();document.getElementById('planBadge').textContent=(state.plan||'free').toUpperCase()+' Plan'; renderNav(); renderHome(); renderUpload(); renderSales(); renderStock(); renderAnalytics(); renderCalculator(); renderSubscription(); renderSettings(); setTab(currentTab);}
function renderHome(){const t=totals();const ms=monthlyStats();document.getElementById('screen-home').innerHTML=`<div class="stats"><div class="stat"><span class="muted">Sales</span><b>${money(t.saleTotal)}</b></div><div class="stat"><span class="muted">Profit</span><b>${money(t.profit)}</b></div><div class="stat"><span class="muted">Avg Monthly</span><b>${money(ms.avg)}</b></div><div class="stat"><span class="muted">Margin</span><b>${pct(t.margin)}</b></div><div class="stat"><span class="muted">Goal Progress</span><b>${pct((t.profit/(state.profile.monthlyGoal||1))*100)}</b></div></div><div class="hero" style="margin-top:14px"><div class="card"><p class="pill">Offline-first business manager</p><h2 class="hero-title">AI business manager for small retailers.</h2><p class="muted">Upload bills, track profit, manage stock, view analytics and keep your data backed up.</p><div class="row"><button class="btn primary" onclick="setTab('upload')">Analyze Bill / PDF</button><button class="btn gold" onclick="setTab('analytics')">HD Profit Graph</button></div></div><div class="card"><label>Business Name</label><input value="${esc(state.profile.businessName)}" onchange="state.profile.businessName=this.value;save()"><label>Location Type</label><select onchange="state.profile.locationType=this.value;save()">${['Rural','Tier 3 City','Tier 2 City','Metro'].map(x=>`<option ${x===state.profile.locationType?'selected':''}>${x}</option>`).join('')}</select><label>Monthly Goal</label><input type="number" value="${state.profile.monthlyGoal}" onchange="state.profile.monthlyGoal=+this.value;save()"></div></div><div class="card" style="margin-top:14px"><h3>Next Best Action</h3><p>${nextAction(t)}</p></div>`}
function nextAction(t){if(t.profit<state.profile.monthlyGoal*.4)return 'Focus on daily data entry, fast moving products and add-on sales. Upload old monthly profit files to improve recommendations.'; if(t.margin<20)return 'Profit margin is low. Review purchase price, selling price and avoid low-margin stock.'; return 'Your profit tracking is improving. Next focus: stock rotation, reorder alerts and subscription-ready cloud backup.'}
function esc(s){return String(s||'').replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]))}
function renderUpload(){const aiReady=!!(state.profile&&state.profile.backendUrl);document.getElementById('screen-upload').innerHTML=`<div class="card"><h2>AI Upload</h2><p class="muted">Bill, photo, PDF document, Excel, CSV, TXT ya JSON upload karo. Structured profit file ab Monthly Profit me add hogi; CSV ke random numbers Sales me galat add nahi honge.</p><label>Upload bill, photo, PDF document, Excel, CSV, TXT or JSON</label><input id="uploadFile" type="file" accept="image/*,.pdf,.csv,.txt,.json,.xlsx,.xls,.xlsm"><div class="actions"><button class="btn primary" onclick="analyzeFile()">Analyze and Import</button><button class="btn" onclick="downloadSampleJson()">Sample JSON</button><button class="btn" onclick="downloadSampleCsv()">Sample CSV</button></div><div id="uploadStatus" class="notice" style="margin-top:12px">${aiReady?'Smart reader ready. File choose karo aur analyze dabao.':'File choose karo aur Analyze and Import dabao.'}</div><div class="calc-hint" style="margin-top:12px"><span class="pill">JSON arrays/objects supported</span><span class="pill">CSV header supported</span><span class="pill">Duplicate month update</span><span class="pill">Profit → Monthly Profit</span></div></div>`}
async function analyzeFile(){const input=document.getElementById('uploadFile');const f=input&&input.files&&input.files[0];const box=document.getElementById('uploadStatus');if(!f){box.textContent='File choose karo aur Analyze and Import dabao.';box.className='notice bad';return}const name=(f.name||'').toLowerCase();try{box.textContent='Reading file...';box.className='notice';if(name.endsWith('.json')){const txt=(await f.text()).replace(/^\uFEFF/,'').trim();const data=JSON.parse(txt);const r=importExtracted(data,{source:'json-import'});statusResult(r,'JSON');return}if(name.endsWith('.csv')||name.endsWith('.txt')){const txt=(await f.text()).replace(/^\uFEFF/,'').trim();const r=importCsvOrText(txt,{source:name.endsWith('.csv')?'csv-import':'txt-import'});statusResult(r,name.endsWith('.csv')?'CSV':'TXT');return}const endpoint=(state.profile&&state.profile.backendUrl||'').trim();if(!endpoint){box.textContent='Photo/PDF smart reading ke liye backend endpoint required hai. CSV/TXT/JSON offline import fixed hai.';box.className='notice';return}const fd=new FormData();fd.append('file',f);const res=await fetch(endpoint,{method:'POST',body:fd});if(!res.ok)throw new Error('Upload failed');const data=await res.json();const r=importExtracted(data,{source:'ai-import'});statusResult(r,'AI/PDF');}catch(e){box.textContent='Import failed: '+(e&&e.message?e.message:'Unknown error');box.className='notice bad'}}
function statusResult(r,type){const box=document.getElementById('uploadStatus');const ok=(r.profit+r.sales+r.stock+r.updated)>0;box.className='notice '+(ok?'success':'bad');box.innerHTML=`${type} import complete.<br><b>${r.profit}</b> profit record added, <b>${r.updated}</b> profit month updated, <b>${r.sales}</b> sales added, <b>${r.stock}</b> stock added, <b>${r.skipped}</b> skipped.`;localStorage.setItem(STORAGE_KEY,JSON.stringify(state));renderHome();renderSales();renderStock();renderAnalytics();if(currentTab==='analytics')setTimeout(drawAnalyticsCharts,0)}
function normalizeRows(data){let rows=[]; if(Array.isArray(data)) rows=data; else if(data&&typeof data==='object'){['profit','profits','monthlyProfits','monthly','records','data','items'].forEach(k=>{if(Array.isArray(data[k])) rows=rows.concat(data[k])}); if(!rows.length && (data.year||data.month||data.profit||data.amount||data.income)) rows=[data];} return rows.filter(x=>x&&typeof x==='object')}
function importExtracted(data,opt={}){const result={profit:0,updated:0,sales:0,stock:0,skipped:0}; const source=opt.source||'import';
  if(data&&Array.isArray(data.sales)){data.sales.forEach(x=>{ if(addSaleFromRow(x,source)) result.sales++; else result.skipped++; });}
  if(data&&(Array.isArray(data.stock)||Array.isArray(data.stocks))){(data.stock||data.stocks).forEach(x=>{ if(addStockFromRow(x,source)) result.stock++; else result.skipped++; });}
  const rows=normalizeRows(data);
  rows.forEach(row=>{const type=String(row.type||row.category||row.dataType||'').toLowerCase(); const looksProfit=type.includes('profit') || row.profit!==undefined || row.netProfit!==undefined || row.monthlyProfit!==undefined || (row.year!==undefined && row.month!==undefined && (row.amount!==undefined||row.income!==undefined)); const looksSale=type==='sale'||type==='sales'||row.sellingPrice!==undefined||row.salePrice!==undefined||row.sell!==undefined; const looksStock=type==='stock'||type==='stocks'||row.qtyInStock!==undefined||row.stockQty!==undefined||row.stockqty!==undefined;
    if(looksProfit && !looksSale){ const added=addMonthlyFromRow(row,source); if(added==='updated')result.updated++; else if(added)result.profit++; else result.skipped++; return;}
    if(looksSale){ if(addSaleFromRow(row,source))result.sales++; else result.skipped++; return;}
    if(looksStock){ if(addStockFromRow(row,source))result.stock++; else result.skipped++; return;}
    result.skipped++;
  }); return result;}
function addMonthlyFromRow(row,source){const amount=num(row.profit??row.netProfit??row.monthlyProfit??row.amount??row.income??row.value); const ym=yearMonth(row.year,row.month,row.date); if(!amount||!/^\d{4}-\d{2}$/.test(ym))return false; const existing=state.monthly.find(x=>x.month===ym); if(existing){existing.profit=amount;existing.source=source;existing.entries=row.entries??existing.entries;existing.remark=row.remark||row.note||existing.remark||'';return 'updated'} state.monthly.push({id:uid(),month:ym,profit:amount,entries:row.entries??null,remark:row.remark||row.note||'',source}); return true}
function addSaleFromRow(row,source){const sell=num(row.sellingPrice??row.sell??row.salePrice??row.amount); const buy=num(row.purchasePrice??row.buy??row.cost); if(!sell && !buy)return false; state.sales.push({id:uid(),date:row.date||new Date().toISOString().slice(0,10),product:row.product||row.item||row.name||'Imported item',category:row.category||'General',purchasePrice:buy,sellingPrice:sell,qty:num(row.qty??row.quantity??1)||1,source}); return true}
function addStockFromRow(row,source){const qty=num(row.qty??row.quantity??row.stockQty??row.qtyInStock??row.stockqty); const name=row.product||row.item||row.name; if(!name && !qty)return false; state.stocks.push({id:uid(),item:name||'Imported stock',product:name||'Imported stock',category:row.category||'General',qty,lowStock:num(row.lowStock??row.reorder??5)||5,min:num(row.lowStock??row.reorder??5)||5,source}); return true}
function parseCsv(txt){const rows=[];let row=[],cur='',q=false;for(let i=0;i<txt.length;i++){const c=txt[i],n=txt[i+1];if(c==='"'&&q&&n==='"'){cur+='"';i++;continue}if(c==='"'){q=!q;continue}if(c===','&&!q){row.push(cur);cur='';continue}if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&n==='\n')i++;row.push(cur);if(row.some(v=>String(v).trim()!==''))rows.push(row);row=[];cur='';continue}cur+=c}row.push(cur);if(row.some(v=>String(v).trim()!==''))rows.push(row);return rows}
function importCsvOrText(txt,opt={}){const result={profit:0,updated:0,sales:0,stock:0,skipped:0}; const arr=parseCsv(txt); if(arr.length>=2){let headers=arr[0].map(h=>String(h).trim().toLowerCase().replace(/[.\s/_-]+/g,'')); const hasHeader=headers.some(h=>['type','year','month','profit','amount','date','sellingprice','purchaseprice','product','item','name','qty','quantity','entries','remark'].includes(h)); if(hasHeader){arr.slice(1).forEach(vals=>{const row={};headers.forEach((h,i)=>row[h]=vals[i]); const normalized={type:row.type,category:row.category,date:row.date,year:row.year,month:row.month,amount:row.amount,profit:row.profit||row.netprofit||row.monthlyprofit,income:row.income,entries:row.entries,remark:row.remark||row.note,product:row.product||row.item||row.name,purchasePrice:row.purchaseprice||row.buy||row.cost,sellingPrice:row.sellingprice||row.sell||row.saleprice,qty:row.qty||row.quantity,stockQty:row.stockqty||row.qtyinstock}; const type=String(normalized.type||'').toLowerCase(); if(type.includes('profit')||normalized.profit||((normalized.year&&normalized.month)&&normalized.amount)){const a=addMonthlyFromRow(normalized,opt.source||'csv-import'); if(a==='updated')result.updated++; else if(a)result.profit++; else result.skipped++;} else if(type.includes('sale')||normalized.sellingPrice){if(addSaleFromRow(normalized,opt.source||'csv-import'))result.sales++;else result.skipped++;} else if(type.includes('stock')||normalized.stockQty){if(addStockFromRow(normalized,opt.source||'csv-import'))result.stock++;else result.skipped++;} else result.skipped++;}); return result;}}
  txt.split(/\n+/).forEach(line=>{const m=line.match(/(20\d{2}).{0,12}(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|january|february|march|april|june|july|august|september|october|november|december).{0,30}([0-9][0-9,]{2,})/i); if(m){const a=addMonthlyFromRow({year:m[1],month:m[2],profit:m[3]},opt.source||'txt-import'); if(a==='updated')result.updated++; else if(a)result.profit++; else result.skipped++;}}); return result;}
function downloadBlob(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
function downloadSampleJson(){const sample={app:'Vyapar AI',dataType:'profit',profit:[{type:'profit',date:'2026-04-01',year:2026,month:'April',profit:50400,entries:0,remark:'Visible/readable entries'}]};downloadBlob(new Blob([JSON.stringify(sample,null,2)],{type:'application/json'}),'vyapar-ai-profit-sample.json')}
function downloadSampleCsv(){const sample='type,date,year,month,profit,entries,remark\nprofit,2026-04-01,2026,April,50400,0,Visible/readable entries\n';downloadBlob(new Blob([sample],{type:'text/csv'}),'vyapar-ai-profit-sample.csv')}
function removeBadImportedSales(){const before=state.sales.length;state.sales=state.sales.filter(x=>{const src=String(x.source||'').toLowerCase();const junkSource=src.includes('csv')||src.includes('json')||src.includes('import');const junkName=/imported|profit|month|undefined/i.test(String(x.product||''));const tiny=num(x.sellingPrice)<100&&num(x.purchasePrice)===0;return !(junkSource||junkName||tiny)});const removed=before-state.sales.length;save();setTimeout(()=>{const el=document.getElementById('settingsStatus');if(el){el.textContent=removed+' bad imported sales removed.';el.className='notice success'}},50)}
function renderSales(){const e=state.sales.find(x=>x.id===editSaleId);const m=state.monthly.find(x=>x.id===editMonthlyId);document.getElementById('screen-sales').innerHTML=`<div class="grid"><div class="card"><h2>${e?'Edit Sale':'Add Sale'}</h2><label>Date</label><input id="sdate" type="date" value="${e?esc(e.date):new Date().toISOString().slice(0,10)}"><label>Product</label><input id="sproduct" placeholder="School shoes" value="${e?esc(e.product):''}"><div class="row"><div><label>Category</label><input id="scategory" placeholder="Footwear" value="${e?esc(e.category):''}"></div><div><label>Quantity</label><input id="sqty" type="number" value="${e?e.qty:1}"></div></div><div class="row"><div><label>Purchase Price</label><input id="sbuy" type="number" value="${e?e.purchasePrice:''}"></div><div><label>Selling Price</label><input id="ssell" type="number" value="${e?e.sellingPrice:''}"></div></div><div class="actions">${e?`<button class="btn primary" onclick="updateSale()">Update Sale</button><button class="btn" onclick="cancelSaleEdit()">Cancel</button>`:`<button class="btn primary" onclick="addSale()">Save Sale</button>`}</div></div><div class="card"><h2>${m?'Edit Monthly Profit':'Monthly Profit Entry'}</h2><label>Month</label><input id="mmonth" type="month" value="${m?esc(m.month):monthKey()}"><label>Net Profit</label><input id="mprofit" type="number" value="${m?m.profit:''}"><div class="actions">${m?`<button class="btn gold" onclick="updateMonthly()">Update Profit</button><button class="btn" onclick="cancelMonthlyEdit()">Cancel</button>`:`<button class="btn gold" onclick="addMonthly()">Save Monthly Profit</button>`}</div></div></div><div class="card" style="margin-top:14px"><h2>Sales Records</h2><div class="scroll"><table class="table"><thead><tr><th>Date</th><th>Product</th><th>Qty</th><th>Buy</th><th>Sell</th><th>Profit</th><th>Action</th></tr></thead><tbody>${state.sales.slice().reverse().map(x=>`<tr><td>${esc(x.date)}</td><td>${esc(x.product)}</td><td>${x.qty}</td><td>${money(x.purchasePrice)}</td><td>${money(x.sellingPrice)}</td><td>${money((x.sellingPrice-x.purchasePrice)*x.qty)}</td><td><div class="actions"><button class="btn mini" onclick="editSale('${x.id}')">Edit</button><button class="btn mini danger" onclick="delSale('${x.id}')">Delete</button></div></td></tr>`).join('')||`<tr><td colspan="7" class="muted">No sale records yet.</td></tr>`}</tbody></table></div></div><div class="card" style="margin-top:14px"><h2>Monthly Profit Records</h2><div class="scroll"><table class="table"><thead><tr><th>Month</th><th>Net Profit</th><th>Source</th><th>Action</th></tr></thead><tbody>${state.monthly.slice().sort((a,b)=>String(b.month).localeCompare(String(a.month))).map(x=>`<tr><td>${monthLabel(x.month)}</td><td>${money(x.profit)}</td><td>${esc(x.source||'manual')}</td><td><div class="actions"><button class="btn mini" onclick="editMonthly('${x.id}')">Edit</button><button class="btn mini danger" onclick="delMonthly('${x.id}')">Delete</button></div></td></tr>`).join('')||`<tr><td colspan="4" class="muted">No monthly profit records yet.</td></tr>`}</tbody></table></div></div>`}
function saleFormData(){return{id:editSaleId||uid(),date:v('sdate'),product:v('sproduct')||'Sale item',category:v('scategory')||'General',purchasePrice:+v('sbuy')||0,sellingPrice:+v('ssell')||0,qty:+v('sqty')||1}}
function addSale(){state.sales.push(saleFormData());save()} 
function editSale(id){editSaleId=id;currentTab='sales';render()}
function updateSale(){const i=state.sales.findIndex(x=>x.id===editSaleId);if(i>=0)state.sales[i]=saleFormData();editSaleId='';save()}
function cancelSaleEdit(){editSaleId='';render()}
function delSale(id){if(confirm('Delete this sale record?')){state.sales=state.sales.filter(x=>x.id!==id);if(editSaleId===id)editSaleId='';save()}}
function addMonthly(){state.monthly.push({id:uid(),month:v('mmonth'),profit:+v('mprofit')||0,source:'manual'});save()}
function editMonthly(id){editMonthlyId=id;currentTab='sales';render()}
function updateMonthly(){const i=state.monthly.findIndex(x=>x.id===editMonthlyId);if(i>=0)state.monthly[i]={...state.monthly[i],month:v('mmonth'),profit:+v('mprofit')||0,source:state.monthly[i].source||'manual'};editMonthlyId='';save()}
function cancelMonthlyEdit(){editMonthlyId='';render()}
function delMonthly(id){if(confirm('Delete this monthly profit entry?')){state.monthly=state.monthly.filter(x=>x.id!==id);if(editMonthlyId===id)editMonthlyId='';save()}}
function v(id){return document.getElementById(id).value}
function monthLabel(m){if(!m)return'-';const [y,mo]=String(m).split('-');const names=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];return `${names[(+mo||1)-1]} ${y||''}`}
function renderStock(){document.getElementById('screen-stock').innerHTML=`<div class="card"><h2>Stock Manager</h2><div class="grid3"><div><label>Item</label><input id="stockItem"></div><div><label>Available Qty</label><input id="stockQty" type="number"></div><div><label>Min Alert Qty</label><input id="stockMin" type="number" value="5"></div></div><button class="btn primary" onclick="addStock()">Save Stock</button></div><div class="card" style="margin-top:14px"><h3>Stock Alerts</h3>${state.stocks.map(s=>`<p class="pill">${esc(s.item)}: ${s.qty} left ${s.qty<=s.min?'<b class="danger-text">Reorder</b>':''}</p>`).join(' ')||'<p class="muted">No stock data yet.</p>'}</div>`}
function addStock(){state.stocks.push({id:uid(),item:v('stockItem'),qty:+v('stockQty'),min:+v('stockMin')});save()}
// Base Valuation Formula: Average Monthly Profit × 12 × 2
function renderAnalytics(){const t=totals();const ms=monthlyStats();const years=availableYears();const valuationMultiple=2;const value=Math.max(ms.avg*12*valuationMultiple,0);document.getElementById('screen-analytics').innerHTML=`<div class="stats"><div class="stat"><span>Net Profit</span><b>${money(t.profit)}</b></div><div class="stat"><span>Average Monthly</span><b>${money(ms.avg)}</b></div><div class="stat"><span>Highest Month</span><b>${money(ms.high)}</b></div><div class="stat"><span>Base Valuation</span><b>${money(value)}</b></div><div class="stat"><span>Total Years</span><b>${years.length}</b></div></div><div class="card chart-wrap" style="margin-top:14px"><div class="chart-head"><div><h2 style="margin-bottom:4px">Year Wise Profit Graph</h2><p class="muted" style="margin-top:0">Har bar ek saal ka total net profit dikhata hai.</p></div><div class="chart-meta"><span class="pill">Years: ${years.length}</span><span class="pill">Months: ${ms.count}</span><span class="pill">High Month: ${money(ms.high)}</span></div></div><canvas id="yearlyProfitCanvas"></canvas></div><div class="card chart-wrap" style="margin-top:14px"><div class="chart-head"><div><h2 style="margin-bottom:4px">Monthly Comparison Graph</h2><p class="muted" style="margin-top:0">Same month ko different years ke profit se compare karta hai.</p></div><div class="chart-meta"><span class="pill">Jan-Dec</span><span class="pill">Year compare</span><span class="pill">Profit bars</span></div></div><canvas id="monthlyComparisonCanvas"></canvas></div>${years.length?years.map(y=>{const ys=seriesStats(monthlySeriesForYear(y));return `<div class="card chart-wrap" style="margin-top:14px"><div class="chart-head"><div><h2 style="margin-bottom:4px">${y} Monthly Profit Graph</h2><p class="muted" style="margin-top:0">${y} ke har month ka alag graph.</p></div><div class="chart-meta"><span class="pill">Total: ${money(ys.total)}</span><span class="pill">Avg: ${money(ys.avg)}</span><span class="pill">High: ${money(ys.high)}</span></div></div><canvas id="monthlyProfitCanvas-${y}"></canvas></div>`}).join(''):`<div class="notice bad" style="margin-top:14px">Abhi analytics data nahi hai. Pehle monthly profit ya sales add/import karo.</div>`}<div class="card" style="margin-top:14px"><h2>10 Year Plan</h2><ol>${plan10(t).map(x=>`<li>${x}</li>`).join('')}</ol></div>`}
function monthlySeries(){return monthlySeriesAll().slice(-12)}
function monthlySeriesAll(){const map={};state.monthly.forEach(x=>map[x.month]=(map[x.month]||0)+(+x.profit||0));state.sales.forEach(x=>{const k=monthKey(x.date);map[k]=(map[k]||0)+((+x.sellingPrice||0)-(+x.purchasePrice||0))*(+x.qty||0)});return Object.entries(map).filter(x=>x[0]).sort()}
function availableYears(){return [...new Set(monthlySeriesAll().map(x=>String(x[0]).slice(0,4)).filter(Boolean))].sort()}
function yearlySeries(){const out={};monthlySeriesAll().forEach(([k,v])=>{const y=String(k).slice(0,4);out[y]=(out[y]||0)+(+v||0)});return Object.entries(out).sort()}
function monthlySeriesForYear(year){const yearStr=String(year);const base=Object.fromEntries(monthlySeriesAll().filter(([k])=>String(k).startsWith(yearStr+'-')));return Array.from({length:12},(_,i)=>{const mm=String(i+1).padStart(2,'0');const key=`${yearStr}-${mm}`;return [key,+base[key]||0]})}
function seriesStats(series){const vals=series.map(x=>+x[1]||0);const total=vals.reduce((a,b)=>a+b,0);return{count:vals.length,avg:vals.length?total/vals.length:0,high:vals.length?Math.max(...vals):0,low:vals.length?Math.min(...vals):0,total}}
function monthlyStats(){const s=monthlySeriesAll();const vals=s.map(x=>+x[1]||0);const sum=vals.reduce((a,b)=>a+b,0);return{count:vals.length,avg:vals.length?sum/vals.length:0,high:vals.length?Math.max(...vals):0,low:vals.length?Math.min(...vals):0}}
function drawProfitChart(){drawAnalyticsCharts()}
function drawAnalyticsCharts(){drawYearlyProfitChart();drawMonthlyComparisonChart();availableYears().forEach(y=>drawMonthlyYearChart(y))}
function chartTheme(){const css=getComputedStyle(document.body);return{text:css.getPropertyValue('--text').trim()||'#eef7ff',muted:css.getPropertyValue('--muted').trim()||'#9fb4ca',line:css.getPropertyValue('--line').trim()||'#1f3b59',teal:css.getPropertyValue('--teal').trim()||'#19c2bf',gold:css.getPropertyValue('--gold').trim()||'#f4bd38'}}
function setupCanvas(c,height){if(!c)return null;const ctx=c.getContext('2d');const lite=isLiteMode();const dpr=lite?1:Math.min(window.devicePixelRatio||1,1.5);const w=Math.max(c.offsetWidth||320,320),h=height||(window.innerWidth<800?260:300);c.width=Math.floor(w*dpr);c.height=Math.floor(h*dpr);c.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);return{ctx,w,h,lite,dpr}}
function drawEmptyChart(c,msg){const setup=setupCanvas(c,260);if(!setup)return;const {ctx}=setup;const theme=chartTheme();ctx.fillStyle=theme.muted;ctx.font='13px system-ui, sans-serif';ctx.fillText(msg||'No data available.',18,42)}
function drawMonthlyComparisonChart(){const c=document.getElementById('monthlyComparisonCanvas');if(!c)return;const allYears=availableYears();const years=allYears.slice(-5);if(!years.length){drawEmptyChart(c,'No monthly comparison data available.');return}const series=monthlySeriesAll();const map=Object.fromEntries(series);const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];const values=[];months.forEach((m,mi)=>years.forEach(y=>values.push(+map[y+'-'+String(mi+1).padStart(2,'0')]||0)));const active=values.some(v=>v!==0);if(!active){drawEmptyChart(c,'No monthly comparison data available.');return}const setup=setupCanvas(c,window.innerWidth<800?320:330);if(!setup)return;const {ctx,w,h,lite}=setup;const theme=chartTheme();const text=theme.text,muted=theme.muted,line=theme.line;const palette=['rgba(25,194,191,.90)','rgba(244,189,56,.85)','rgba(53,211,153,.82)','rgba(255,82,114,.78)','rgba(156,125,255,.78)'];const max=Math.max(...values,1);const padL=54,padR=14,padT=48,padB=48,plotW=w-padL-padR,plotH=h-padT-padB;ctx.lineWidth=1;ctx.strokeStyle=line;ctx.fillStyle=muted;ctx.font='11px system-ui, sans-serif';for(let i=0;i<=4;i++){const gy=padT+i*plotH/4;ctx.beginPath();ctx.moveTo(padL,gy);ctx.lineTo(w-padR,gy);ctx.stroke();ctx.fillText(shortMoney(max-(max*i/4)),4,gy+4)}const legendY=18;years.forEach((yr,i)=>{const lx=padL+i*62;ctx.fillStyle=palette[i%palette.length];ctx.fillRect(lx,legendY,10,10);ctx.fillStyle=muted;ctx.fillText(String(yr),lx+14,legendY+10)});const groupW=plotW/12;const innerGap=2;const totalBarW=groupW-8;const barW=Math.max(3,(totalBarW-innerGap*(years.length-1))/years.length);months.forEach((m,mi)=>{const groupX=padL+mi*groupW+4;years.forEach((yr,yi)=>{const val=+map[yr+'-'+String(mi+1).padStart(2,'0')]||0;const bh=Math.max(val?2:0,(val/max)*plotH);const x=groupX+yi*(barW+innerGap);const y=padT+plotH-bh;ctx.fillStyle=palette[yi%palette.length];ctx.fillRect(x,y,barW,bh);});ctx.fillStyle=muted;ctx.font='10px system-ui, sans-serif';ctx.fillText(m,groupX, h-18)});const best=Math.max(...values);if(best>0){let bestKey='';years.forEach(yr=>months.forEach((m,mi)=>{const v=+map[yr+'-'+String(mi+1).padStart(2,'0')]||0;if(v===best)bestKey=m+' '+yr}));ctx.fillStyle=text;ctx.font='12px system-ui, sans-serif';ctx.fillText('Best: '+bestKey+' '+money(best),padL,padT-10)}if(allYears.length>5){ctx.fillStyle=muted;ctx.font='10px system-ui, sans-serif';ctx.fillText('Showing latest 5 years',w-124,padT-10)}}
function drawYearlyProfitChart(){const c=document.getElementById('yearlyProfitCanvas');if(!c)return;const series=yearlySeries();if(!series.length){drawEmptyChart(c,'No year-wise profit data available.');return}const setup=setupCanvas(c,window.innerWidth<800?250:280);if(!setup)return;const {ctx,w,h}=setup;const {text,muted,line}=chartTheme();const vals=series.map(x=>+x[1]||0);const max=Math.max(...vals,1);const padL=50,padR=16,padT=20,padB=42,plotW=w-padL-padR,plotH=h-padT-padB;ctx.lineWidth=1;ctx.strokeStyle=line;ctx.fillStyle=muted;ctx.font='11px system-ui, sans-serif';for(let i=0;i<=4;i++){const gy=padT+i*plotH/4;ctx.beginPath();ctx.moveTo(padL,gy);ctx.lineTo(w-padR,gy);ctx.stroke();const val=max-(max*i/4);ctx.fillText(money(val),4,gy+4)}const barGap=12;const barW=Math.max(24,(plotW-barGap*(series.length-1))/Math.max(1,series.length));series.forEach((p,i)=>{const val=+p[1]||0;const bh=max?Math.max(2,(val/max)*plotH):0;const x=padL+i*(barW+barGap);const y=padT+plotH-bh;const grad=ctx.createLinearGradient(0,y,0,padT+plotH);grad.addColorStop(0,'rgba(25,194,191,.95)');grad.addColorStop(1,'rgba(244,189,56,.70)');ctx.fillStyle=grad;ctx.fillRect(x,y,barW,bh);ctx.strokeStyle='rgba(255,255,255,.18)';ctx.strokeRect(x,y,barW,bh);ctx.fillStyle=muted;ctx.fillText(String(p[0]),x+Math.max(0,barW/2-14),h-16);ctx.fillStyle=text;ctx.font='10px system-ui, sans-serif';ctx.fillText(shortMoney(val),x+Math.max(0,barW/2-16),Math.max(14,y-6));ctx.font='11px system-ui, sans-serif'})}
function drawMonthlyYearChart(year){const c=document.getElementById('monthlyProfitCanvas-'+year);if(!c)return;const s=monthlySeriesForYear(year);const active=s.some(x=>(+x[1]||0)!==0);if(!active){drawEmptyChart(c,'No monthly data for '+year+'.');return}const setup=setupCanvas(c,window.innerWidth<800?260:300);if(!setup)return;const {ctx,w,h,lite}=setup;const {text,muted,line,teal,gold}=chartTheme();const vals=s.map(x=>+x[1]||0);let max=Math.max(...vals,0),min=Math.min(...vals,0);if(max===min){max+=1;min=Math.min(0,min-1)}const padL=54,padR=16,padT=22,padB=46,plotW=w-padL-padR,plotH=h-padT-padB;const y=v=>padT+plotH-((v-min)/(max-min))*plotH;const x=i=>padL+(s.length===1?plotW/2:(i/(s.length-1))*plotW);ctx.lineWidth=1;ctx.strokeStyle=line;ctx.fillStyle=muted;ctx.font='11px system-ui, sans-serif';for(let i=0;i<=4;i++){const gy=padT+i*plotH/4;ctx.beginPath();ctx.moveTo(padL,gy);ctx.lineTo(w-padR,gy);ctx.stroke();const val=max-(max-min)*i/4;ctx.fillText(shortMoney(val),4,gy+4)}const avg=vals.reduce((a,b)=>a+b,0)/vals.length;ctx.setLineDash([5,5]);ctx.strokeStyle=gold;ctx.beginPath();ctx.moveTo(padL,y(avg));ctx.lineTo(w-padR,y(avg));ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=gold;ctx.fillText('Avg '+shortMoney(avg),padL+6,y(avg)-6);const grad=ctx.createLinearGradient(0,padT,0,h-padB);grad.addColorStop(0,'rgba(25,194,191,.32)');grad.addColorStop(1,'rgba(25,194,191,0)');ctx.beginPath();s.forEach((p,i)=>{const px=x(i),py=y(+p[1]||0);if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py)});ctx.lineTo(x(s.length-1),h-padB);ctx.lineTo(x(0),h-padB);ctx.closePath();ctx.fillStyle=grad;ctx.fill();ctx.shadowColor='rgba(25,194,191,.45)';ctx.shadowBlur=lite?0:8;ctx.lineWidth=lite?2:3;ctx.strokeStyle=teal;ctx.beginPath();s.forEach((p,i)=>{const px=x(i),py=y(+p[1]||0);if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py)});ctx.stroke();ctx.shadowBlur=0;s.forEach((p,i)=>{const px=x(i),py=y(+p[1]||0);ctx.beginPath();ctx.arc(px,py,3.5,0,Math.PI*2);ctx.fillStyle=teal;ctx.fill();ctx.fillStyle=muted;ctx.fillText(monthLabel(p[0]).split(' ')[0],Math.max(2,px-12),h-18)});const last=s.filter(x=>+x[1]||0).slice(-1)[0]||s[s.length-1];if(last){const li=s.findIndex(x=>x[0]===last[0]);const lx=x(li),ly=y(+last[1]||0);ctx.fillStyle=text;ctx.font='12px system-ui, sans-serif';ctx.fillText(money(last[1]),Math.min(w-96,lx-24),ly-12)}}
function shortMoney(v){const n=Number(v)||0;const abs=Math.abs(n);if(abs>=10000000)return '₹'+(n/10000000).toFixed(1)+'Cr';if(abs>=100000)return '₹'+(n/100000).toFixed(1)+'L';if(abs>=1000)return '₹'+(n/1000).toFixed(0)+'k';return money(n)}
function plan10(t){let base=Math.max(t.profit,state.profile.monthlyGoal||50000);return Array.from({length:10},(_,i)=>`Year ${i+1}: target monthly net profit ${money(base*Math.pow(1.18,i))}; focus on ${i<2?'data discipline and fast-moving stock':i<5?'stock rotation, staff process and repeat customers':'multi-shop, brand and distribution growth'}.`)}
function renderCalculator(){document.getElementById('screen-calculator').innerHTML=`<div class="code-layout"><div class="card"><div class="code-card-head"><h2>Normal Calculator</h2><span class="glass-chip">Fast math</span></div><label>Expression / numbers</label><textarea id="normalCalc" rows="4" placeholder="50+80+120 or 50,80,120 or 15*12-100"></textarea><div class="actions"><button class="btn primary" onclick="calcNormal()">Calculate</button></div><h3 id="normalResult">Total: ₹0</h3><div class="small muted">Supports +, -, *, /, brackets and comma-separated values.</div><div class="calc-hint"><span class="pill">50+80+120</span><span class="pill">700-150+30</span><span class="pill">15*12-100</span></div></div><div class="card"><div class="code-card-head"><h2>Liquid Glass Code Calculator</h2><span class="glass-chip">Adjustable</span></div><p class="muted">Ab fixed code copy karne ki need nahi. Koi bhi custom code mapping aur command use kar sakte ho.</p><div class="code-shell"><div><label>Code Mapping</label><textarea id="codeMap" rows="9" spellcheck="false" placeholder="A=1&#10;B=2&#10;BOX=350&#10;PAIR=499&#10;SKU=699">${esc((state.settings&&state.settings.codeMap)||defaultCodeMap())}</textarea><div class="actions"><button class="btn mini primary" onclick="saveCodeMap()">Save Mapping</button><button class="btn mini" onclick="resetCodeMap()">Reset Default</button></div><div class="code-note small muted">Rule format: <b>NAME=VALUE</b> or <b>NAME:VALUE</b>. Example: <b>BOX=350</b>, <b>SKU=699</b>, <b>GST=18</b>.</div></div><div><label>Code / Command</label><textarea id="codeCalc" rows="9" spellcheck="false" placeholder="ABC + BOX*2 + GST - 50"></textarea><div class="calc-hint"><span class="pill">ABC + 250</span><span class="pill">BOX*12 + GST</span><span class="pill">PAIR*2 - DISC</span><span class="pill">(SKU + GST) * 2</span></div><button class="btn gold" onclick="calcCode()">Calculate Code</button><div class="code-preview" id="codeResolved"><strong>Resolved expression</strong><span class="small muted">Your converted math expression will appear here.</span></div><h3 id="codeResult" style="margin:12px 0 0">Total: ₹0</h3></div></div></div></div>`}
function calcNormal(){const raw=v('normalCalc').trim();if(!raw){document.getElementById('normalResult').textContent='Total: ₹0';return}const expr=raw.replace(/,/g,'+').replace(/×/g,'*').replace(/x/gi,'*').replace(/÷/g,'/').replace(/[–—]/g,'-');if(/[^0-9+\-*/().\s]/.test(expr)){document.getElementById('normalResult').textContent='Invalid expression';return}try{const total=Function('"use strict"; return ('+expr+')')();document.getElementById('normalResult').textContent='Total: '+money(Number(total)||0)}catch(e){document.getElementById('normalResult').textContent='Invalid expression'}}
function saveCodeMap(){state.settings=state.settings||{};state.settings.codeMap=v('codeMap')||defaultCodeMap();save()}
function resetCodeMap(){state.settings=state.settings||{};state.settings.codeMap=defaultCodeMap();save()}
function parseCodeMap(text){const map={};String(text||'').split(/\n|,|;/).forEach(line=>{const t=line.trim();if(!t)return;const m=t.match(/^([A-Z0-9_]+)\s*(?:=|:)\s*(-?\d+(?:\.\d+)?)$/i);if(m)map[m[1].toUpperCase()]=Number(m[2])});return map}
function escapeRegExp(s){return String(s).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}
function alphaDigits(token){const map={A:'1',B:'2',C:'3',D:'4',E:'5',F:'6',G:'7',H:'8',I:'9',J:'0'};return /^[A-J]+$/.test(token)?Number([...token].map(ch=>map[ch]).join('')):null}
function resolveCodeExpression(expr,customMap){let out=String(expr||'').toUpperCase().trim();Object.keys(customMap).sort((a,b)=>b.length-a.length).forEach(key=>{out=out.replace(new RegExp('\\b'+escapeRegExp(key)+'\\b','g'),String(customMap[key]))});out=out.replace(/\b[A-J]+\b/g,m=>String(alphaDigits(m)));out=out.replace(/,/g,'+').replace(/×/g,'*').replace(/\bx\b/gi,'*').replace(/÷/g,'/').replace(/[–—]/g,'-').replace(/₹/g,'');if(/[^0-9+\-*/().\s]/.test(out))throw new Error('Unknown code or invalid command');const value=Function('"use strict"; return ('+out+')')();if(!Number.isFinite(value))throw new Error('Invalid result');return{resolved:out,value:Number(value)}}
function calcCode(){state.settings=state.settings||{};state.settings.codeMap=v('codeMap')||defaultCodeMap();const expr=v('codeCalc');try{const result=resolveCodeExpression(expr,parseCodeMap(state.settings.codeMap));document.getElementById('codeResult').textContent='Total: '+money(result.value);document.getElementById('codeResolved').innerHTML='<strong>Resolved expression</strong><span class="small muted">'+esc(result.resolved)+'</span>';localStorage.setItem(STORAGE_KEY,JSON.stringify(state))}catch(e){document.getElementById('codeResult').textContent='Invalid code / command';document.getElementById('codeResolved').innerHTML='<strong>Tip</strong><span class="small muted">Pehle mapping me BOX=350, GST=18, SKU=699 jaisa define karo. Fir command likho jaise BOX*2 + GST.</span>'}}
function renderSubscription(){const currentPlan=state.plan||'free';document.getElementById('screen-subscription').innerHTML=`<div class="grid3">${[['Free','₹0','Manual sale entry, basic profit report','free'],['Pro','₹199/month','AI upload, analytics, business valuation','pro'],['Business','₹499/month','All Pro features, stock manager, multi-shop support','business']].map(p=>`<div class="card ${currentPlan===p[3]?'active-plan':''}"><h2>${p[0]}</h2><h3>${p[1]}</h3><p class="muted">${p[2]}</p><button class="btn primary" onclick="${p[3]==='free'?`selectPlan('free')`:`startPayment('${p[3]}')`}">${currentPlan===p[3]?'Active Plan':'Select '+p[0]}</button></div>`).join('')}</div><div class="notice success" style="margin-top:14px">Current Plan: <b>${currentPlan.toUpperCase()}</b>. Payment mode: Razorpay Test/Live backend.</div>`}

function renderSettings(){const pm=performanceMode();const glassOn=glassEnabled();const gop=glassOpacity();const dev=devModeEnabled();const backendUrl=state.profile&&state.profile.backendUrl?state.profile.backendUrl:'';const billing=state.settings&&state.settings.billingMode?state.settings.billingMode:'play';document.getElementById('screen-settings').innerHTML=`<div class="grid"><div class="card"><h2>Appearance</h2><p class="muted">Manual light/dark mode switch. Current: <b>${activeTheme()==='light'?'Light':'Dark'}</b></p><div class="row"><button class="btn primary" onclick="setTheme('light')">Light Mode</button><button class="btn gold" onclick="setTheme('dark')">Dark Mode</button></div></div><div class="card"><h2>Liquid Glass</h2><p class="muted">Liquid glass effect ko on/off kar sakte ho aur opacity ko kam-jyada bhi kar sakte ho. Current: <b>${glassOn?'On':'Off'}</b></p><div class="actions"><button class="btn ${glassOn?'primary':''}" onclick="setGlassEnabled(true)">Glass On</button><button class="btn ${!glassOn?'primary':''}" onclick="setGlassEnabled(false)">Glass Off</button></div><label style="margin-top:12px;display:block">Glass Opacity</label><div class="range-row"><input type="range" min="0" max="100" step="5" value="${gop}" oninput="updateGlassOpacityLabel(this.value)" onchange="setGlassOpacity(this.value)"><div class="pill range-value" id="glassOpacityValue">${gop}%</div></div></div><div class="card"><h2>Performance</h2><p class="muted">Low version Android ke liye Lite mode blur, heavy shadow aur animation ko reduce karta hai. Current: <b>${pm==='lite'?'Lite':pm==='smooth'?'Smooth':'Auto'}</b></p><div class="grid3"><button class="btn ${pm==='auto'?'primary':''}" onclick="setPerformanceMode('auto')">Auto</button><button class="btn ${pm==='smooth'?'primary':''}" onclick="setPerformanceMode('smooth')">Smooth UI</button><button class="btn ${pm==='lite'?'primary':''}" onclick="setPerformanceMode('lite')">Lite Mode</button></div></div><div class="card"><h2>Data Safety</h2><p class="muted"><span class="status-dot"></span>Auto-save is active on this device. Export backup regularly to avoid data loss.</p><button class="btn primary" onclick="downloadBackup()">Download JSON Backup</button><label>Restore JSON</label><input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,.txt,.csv,.json,.xlsx,.xls,.xlsm" onchange="restoreBackup(this.files[0])"><div class="actions" style="margin-top:10px"><button class="btn gold" onclick="removeBadImportedSales()">Remove Bad Imported Sales</button></div><div id="settingsStatus" class="notice" style="margin-top:10px">Backup rakhna safe hai.</div></div>${dev?`<div class="card dev-card"><h2>Developer Mode</h2><p class="muted">Hidden setup. Normal customers will not see this section.</p><label>AI Extract Endpoint</label><input id="devBackendUrl" placeholder="https://your-domain.com/extractBill" value="${esc(backendUrl)}"><div class="actions"><button class="btn primary" onclick="setBackendUrl()">Save Endpoint</button><button class="btn" onclick="testBackend()">Test</button></div><div id="devBackendStatus" class="small muted" style="margin-top:8px">Endpoint status will appear here.</div><label style="margin-top:12px;display:block">Billing Mode</label><select onchange="setBillingMode(this.value)"><option value="play" ${billing==='play'?'selected':''}>Google Play Billing</option><option value="razorpay" ${billing==='razorpay'?'selected':''}>Razorpay / website payment</option><option value="manual" ${billing==='manual'?'selected':''}>Manual activation</option></select><div class="kv"><b>AI flow</b><span class="muted">Upload → hidden endpoint → JSON → app import</span><b>Data flow</b><span class="muted">Auto-save locally + export/restore backup</span><b>Unlock</b><span class="muted">Tap logo 7 times to hide this mode.</span></div></div>`:''}</div>`}

function downloadBackup(){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='vyapar-ai-backup.json';a.click()}async function restoreBackup(file){if(!file)return;state=JSON.parse(await file.text());save()}

function selectPlan(planName){
  state.plan = planName;
  save();
}

function planLevel(plan){
  if(plan === 'free') return 1;
  if(plan === 'pro') return 2;
  if(plan === 'business') return 3;
  return 1;
}

function requirePlan(requiredPlan){
  const currentPlan = state.plan || 'free';
  if(planLevel(currentPlan) >= planLevel(requiredPlan)) return true;
  alert('This feature needs ' + requiredPlan.toUpperCase() + ' plan');
  currentTab = 'subscription';
  render();
  return false;
}

function showPaymentLoader(message){
  let loader = document.getElementById('paymentLoader');
  if(!loader){
    loader = document.createElement('div');
    loader.id = 'paymentLoader';
    loader.innerHTML = `
      <div style="background:#101827;border:1px solid #22d3ee;border-radius:18px;padding:22px;min-width:240px;text-align:center;box-shadow:0 0 35px rgba(34,211,238,0.35);">
        <div style="width:42px;height:42px;border:4px solid rgba(255,255,255,0.2);border-top-color:#22d3ee;border-radius:50%;margin:0 auto 14px;animation:spinPay 0.8s linear infinite;"></div>
        <b id="paymentLoaderText">Opening payment...</b>
      </div>`;
    loader.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.65);display:flex;align-items:center;justify-content:center;z-index:999999;color:white;font-family:Arial,sans-serif;';
    document.body.appendChild(loader);
    const style = document.createElement('style');
    style.innerHTML = '@keyframes spinPay{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}';
    document.head.appendChild(style);
  }
  document.getElementById('paymentLoaderText').textContent = message || 'Opening payment...';
  loader.style.display = 'flex';
}

function hidePaymentLoader(){
  const loader = document.getElementById('paymentLoader');
  if(loader) loader.style.display = 'none';
}

async function startPayment(planName){
  if(planName === 'free'){
    selectPlan('free');
    return;
  }

  showPaymentLoader('Opening Razorpay payment...');

  const backendUrl = 'https://vypar-backend.onrender.com';

  try {
    const orderRes = await fetch(backendUrl + '/payment/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planName })
    });

    const orderData = await orderRes.json();

    if(!orderData.success){
      hidePaymentLoader();
      alert(orderData.message || 'Order create failed');
      return;
    }

    const options = {
      key: orderData.keyId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'Vyapar AI',
      description: planName.toUpperCase() + ' Plan',
      order_id: orderData.orderId,

      handler: async function(response){
        const verifyRes = await fetch(backendUrl + '/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            plan: planName
          })
        });

        const verifyData = await verifyRes.json();

        if(verifyData.success){
          selectPlan(planName);
          alert(planName.toUpperCase() + ' plan activated');
        } else {
          alert('Payment verify failed');
        }
      },

      modal: {
        ondismiss: function(){
          hidePaymentLoader();
          alert('Payment cancelled');
        }
      },

      theme: { color: '#22d3ee' }
    };

    const rzp = new Razorpay(options);
    hidePaymentLoader();
    rzp.open();

  } catch(error) {
    hidePaymentLoader();
    alert('Payment error: ' + error.message);
  }
}

render();
