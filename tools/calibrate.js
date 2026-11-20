// Calibration harness: plays hundreds of funds with three bot strategies and compares the
// results to the benchmarks in index.html. Usage: node tools/calibrate.js [index.html] [nSeeds]
// Override tuning knobs without editing the game: CAL='{stepBase:0.05}' node tools/calibrate.js
const fs=require('fs'), vm=require('vm');
const file=process.argv[2]||require('path').join(__dirname,'..','index.html'), N=+process.argv[3]||300;
const html=fs.readFileSync(file,'utf8');
const src=html.slice(html.indexOf('// ENGINE START'),html.indexOf('// ENGINE END'));
const ctx={Math,console,Object,JSON,String,Number,Array,Infinity,isFinite}; vm.createContext(ctx);
vm.runInContext(src+(process.env.CAL?`\n;Object.assign(CAL,${process.env.CAL});`:"")+'\n;this.api={newGame,byId,checkOptions,invest,decide,endQuarter,doSupport,runCall,valueOf,settle,get G(){return G}};',ctx);
const A=ctx.api;
let rngS=1; const rnd=()=>{rngS=(rngS*16807)%2147483647;return rngS/2147483647};
const STRATS={
  random:{pick:c=>rnd()<0.5, size:1, fol:()=>'full', bridge:()=>rnd()<0.5, support:false},
  pitch:{pick:c=>(c.R.team+c.R.market+c.R.traction)/3>5.8, size:0, fol:()=>'full', bridge:()=>true, support:false},
  skilled:{pick:c=>c.s+0.6*gauss()>0.35, size:1, fol:c=>c.m>0?'full':'pass', bridge:c=>c.m>-0.8, support:true},
};
function gauss(){return Math.sqrt(-2*Math.log(Math.max(rnd(),1e-9)))*Math.cos(2*Math.PI*rnd())}
const q=(a,p)=>{const s=[...a].sort((x,y)=>x-y);return s[Math.min(s.length-1,Math.floor(p*s.length))]};
const out={};
for(const [name,S] of Object.entries(STRATS)){
  const irrs=[],tvpis=[],mix=[0,0,0,0],idx=[0,0,0,0],status={},top={share:0},nOwned=[];
  for(let s=1;s<=N;s++){
    rngS=s*7919+13;
    A.newGame({fund:'F',diff:'normal',thesis:'Generalist',gp:0.01,seed:String(s)});
    const G=A.G;
    while(!G.over){
      for(const id of [...G.deals]){const c=A.byId(id); if(!S.pick(c)) continue; const o=A.checkOptions(c).filter(o=>o.ok); if(o.length) A.invest(id,o[Math.min(S.size,o.length-1)].amt);}
      for(const p of [...G.pending]){const c=A.byId(p.cid); A.decide(p.pid,p.type==='prorata'?S.fol(c):(S.bridge(c)?'accept':'decline'));}
      if(S.support) for(const c of G.companies) if(c.owned&&c.status==='alive'&&c.crisis) A.doSupport(c.id,c.crisis.fix);
      A.endQuarter();
    }
    const R=G.result; irrs.push(R.netIrr==null?-0.2:R.netIrr); tvpis.push(R.tvpi);
    const own=G.companies.filter(c=>c.owned); nOwned.push(own.length);
    const bucket=m=>m<0.05?0:m<1?1:m<3?2:3;
    let vals=own.map(c=>A.valueOf(c)), tot=vals.reduce((a,b)=>a+b,0)||1, mx=Math.max(...vals);
    top.share+=mx/tot;
    own.forEach(c=>mix[bucket(A.valueOf(c)/c.invested)]++);
    G.companies.forEach(c=>{status[c.status]=(status[c.status]||0)+1; const hv=c.status==='exited'?c.hReturned:(c.status==='alive'||c.status==='bridge')?c.hOwn*c.post:0; idx[bucket(hv/1e6)]++;});
  }
  const pc=a=>{const t=a.reduce((x,y)=>x+y,0);return a.map(x=>Math.round(100*x/t)).join('/')};
  const st=Object.values(status).reduce((a,b)=>a+b,0);
  out[name]={irr:`p25 ${(q(irrs,.25)*100).toFixed(1)} | p50 ${(q(irrs,.5)*100).toFixed(1)} | p75 ${(q(irrs,.75)*100).toFixed(1)} | p90 ${(q(irrs,.9)*100).toFixed(1)}`,
    tvpi50:q(tvpis,.5).toFixed(2), mix:pc(mix), allDeals:pc(idx), owned:Math.round(nOwned.reduce((a,b)=>a+b,0)/N),
    topShare:Math.round(100*top.share/N)+'%', status:Object.fromEntries(Object.entries(status).map(([k,v])=>[k,Math.round(100*v/st)+'%']))};
}
console.log('target: irr p25 5.0 | p50 11.5 | p75 18.7 | p90 28.3   mix 35/29/22/14   top company 50-80%');
for(const [k,v] of Object.entries(out)) console.log(k.padEnd(8),JSON.stringify(v));
