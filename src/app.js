import React, { useState, useEffect, useMemo } from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client?external=react";
const e=React.createElement;
const APP_VERSION="0.1.0";
const RISK=[
["Microbial contamination","Sterile sealed path, lot testing, expiration checks","Not validated"],
["Cross-contamination","Single-use needle/fluid/waste paths, barrier workflow","Not validated"],
["Wrong depth / blowout","Depth ceiling, force feedback, pause-on-anomaly","Research only"],
["Client movement","Motion tracking, retract-on-pause interlock","Simulated"],
["Wrong placement","Exact design hash, preview, dual confirmation","Prototype"],
["Ink sensitivity","Ingredient disclosure and adverse-event reporting","Review required"],
["Mechanical impact","Guarded axes, travel limits and stop controls","Research only"],
["Power / firmware faults","Fail-retract architecture, watchdog, fault tests","Simulated"],
["Data exposure","Local-first storage, client-controlled export","Prototype"]
];
const ROADMAP=[
["00","Discovery","Requirements, artist interviews, hazard register","Current"],
["01","SafeInk Kit","Manual lot tracking and aftercare receipt","Next"],
["02","Bench Robot","Synthetic-skin-only dot / interlock tests","Future"],
["03","Guided Pen","Artist-held feedback under controlled validation","Future"],
["04","Flat-Zone Pilot","Only after independent safety and regulatory review","Gated"]
];
const PRESETS=[
{id:"orbital",name:"Orbital Bloom",kind:"Radial geometry",caption:"Symmetric dotwork study"},
{id:"wave",name:"Mercy Wave",kind:"Linear microdot",caption:"Flowing wave motion study"},
{id:"lattice",name:"Quiet Lattice",kind:"Geometric test",caption:"Repeatability test pattern"}
];
const ZONES=["Outer forearm","Calf","Outer bicep"];
const NAV=[
["overview","Overview","◈"],
["design","Design studio","✧"],
["session","Session simulator","◎"],
["materials","Material ledger","▦"],
["safety","Safety architecture","⬡"],
["roadmap","Roadmap & ethics","↗"]
];
function icon(name,size=18){
const paths={
arrow:e("path",{d:"M5 12h14m-6-6 6 6-6 6"}),
download:e("path",{d:"M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4"}),
check:e("path",{d:"m4 12 5 5L20 6"}),
pause:e("path",{d:"M8 5v14m8-14v14"}),
play:e("path",{d:"m7 5 12 7-12 7z"}),
refresh:e("path",{d:"M20 7v5h-5M4 17v-5h5M6.5 8a7 7 0 0 1 11.6-2L20 8M4 16l2.4 2a7 7 0 0 0 11.4-2"}),
shield:e("path",{d:"M12 2 4 6v5c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V6zM9 12l2 2 4-4"}),
alert:e("path",{d:"M12 3 2 21h20L12 3zm0 6v5m0 3v.1"}),
lock:e("path",{d:"M5 10h14v11H5zM8 10V7a4 4 0 0 1 8 0v3"}),
heart:e("path",{d:"M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8"}),
};
return e("svg",{width:size,height:size,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:1.8,strokeLinecap:"round",strokeLinejoin:"round","aria-hidden":true},paths[name]||paths.shield);
}
function saveFile(file,content,type="application/json"){
const blob=new Blob([content],{type}),url=URL.createObjectURL(blob),a=document.createElement("a");
a.href=url;a.download=file;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function stamp(){return new Date().toISOString();}
function randId(){return "DP-"+Math.random().toString(36).slice(2,10).toUpperCase();}
function clamp(n,a,b){return Math.min(b,Math.max(a,n));}
function dotsFor(preset,density){
let dots=[],count=Math.round(155*density/65);
if(preset==="orbital"){
  for(let i=0;i<count;i++){
    let t=i/count*Math.PI*12,r=14+(i/count)*118;
    dots.push([175+Math.cos(t)*r,175+Math.sin(t)*r,1.15+(i%7===0?0.8:0)]);
  }
  for(let a=0;a<8;a++){for(let j=0;j<18;j++){let q=a*Math.PI/4+j*0.05,r=123+j*1.2; dots.push([175+Math.cos(q)*r,175+Math.sin(q)*r,1.05]);}}
}else if(preset==="wave"){
  for(let i=0;i<count*2;i++){let x=20+310*i/(count*2-1),t=x/310*Math.PI*3;
    for(let l=0;l<3;l++)dots.push([x,175+Math.sin(t+l*.11)*62+(l-1)*15,1.15+(i%9===0?.6:0)]);
  }
}else{
  for(let row=0;row<17;row++){for(let col=0;col<17;col++){
    if((row+col)%3===0 || (row-col)%5===0)dots.push([30+col*18,30+row*18,1.3+(row+col)%4*.25]);
  }}
}
return dots;
}
function Panel({className="",children,style}){return e("section",{className:"panel "+className,style},children);}
function Tag({children,tone="neutral"}){return e("span",{className:"tag tag-"+tone},children);}
function Button({children,onClick,variant="primary",disabled=false,small=false,title}){return e("button",{type:"button",title,disabled,onClick,className:"button "+variant+(small?" small":"")},children);}
function Stat({label,value,desc,accent}){return e("div",{className:"stat"},e("div",{className:"stat-top"},e("span",null,label),e("span",{className:"stat-pip "+(accent||"")})),e("strong",null,value),e("small",null,desc));}
function H2({eyebrow,title,description,action}){return e("div",{className:"section-heading"},e("div",null,e("div",{className:"eyebrow"},eyebrow),e("h2",null,title),description&&e("p",null,description)),action&&e("div",{className:"section-action"},action));}
function Check({checked,onChange,label,detail}){return e("label",{className:"checkline"},e("input",{type:"checkbox",checked,onChange:x=>onChange(x.target.checked)}),e("span",{className:"checkbox-faux"},checked?"✓":""),e("span",null,e("strong",null,label),detail&&e("small",null,detail)));}
function DotPreview({preset="orbital",density=65,scale=100,previewOnly=false}){
 const dots=useMemo(()=>dotsFor(preset,density),[preset,density]);
 return e("div",{className:"artboard "+(previewOnly?"preview-small":"")},
   e("div",{className:"artboard-axis x"}),e("div",{className:"artboard-axis y"}),
   e("svg",{viewBox:"0 0 350 350",role:"img","aria-label":"Synthetic design preview: "+preset},
     e("circle",{cx:175,cy:175,r:155,fill:"none",stroke:"#244454",strokeDasharray:"3 8",strokeWidth:1}),
     e("circle",{cx:175,cy:175,r:115,fill:"none",stroke:"#244454",strokeDasharray:"2 9",strokeWidth:.7}),
     e("g",{transform:"translate(175 175) scale("+(scale/100)+") translate(-175 -175)"},dots.map((d,i)=>e("circle",{key:i,cx:d[0],cy:d[1],r:d[2],fill:i%13===0?"#f4ba80":"#d6ede7",opacity:.88}))),
     e("path",{d:"M170 175h10M175 170v10",stroke:"#65bbaf",strokeWidth:1.2})
   ),
   e("span",{className:"artboard-tl"},"OPTICAL SURFACE / SYNTHETIC"),
   e("span",{className:"artboard-br"},"350 × 350 VIRTUAL GRID"),
   !previewOnly&&e("div",{className:"artboard-rail"},e("span",null,"● PLAN PREVIEW"),e("span",null,dots.length+" DOTS"))
 );
}
function App(){
 const [page,setPage]=useState("overview");
 const [preset,setPreset]=useState("orbital");
 const [density,setDensity]=useState(65);
 const [scale,setScale]=useState(100);
 const [zone,setZone]=useState("Outer forearm");
 const [verified,setVerified]=useState(false);
 const [intake,setIntake]=useState(false);
 const [artist,setArtist]=useState(false);
 const [client,setClient]=useState(false);
 const [dryRun,setDryRun]=useState(false);
 const [status,setStatus]=useState("IDLE");
 const [progress,setProgress]=useState(0);
 const [sessionId,setSessionId]=useState(randId());
 const [events,setEvents]=useState([{time:stamp(),message:"Session initialized in no-contact simulation mode",type:"info"}]);
 const [toast,setToast]=useState("");
 const [receipt,setReceipt]=useState(null);
 const active=PRESETS.find(x=>x.id===preset)||PRESETS[0];
 const dotCount=dotsFor(preset,density).length;
 const gates=intake&&artist&&client&&verified&&dryRun;
 const addEvent=(message,type="info")=>setEvents(xs=>[{time:stamp(),message,type},...xs].slice(0,30));
 const message=t=>{setToast(t);setTimeout(()=>setToast(""),3600);};
 const resetApproval=()=>{
   setArtist(false);setClient(false);setVerified(false);setDryRun(false);setStatus("IDLE");setProgress(0);setReceipt(null);
 };
 function changeDesign(update){if(status==="RUNNING")return;update();resetApproval();}
 function exportDesign(){
  const manifest={
    schema:"dermalprint369.design.v0.1",design_id:randId(),simulation_only:true,
    design_name:active.name,artist_id:"demo-artist",style:"microdot_grayscale",
    allowed_body_zones:["outer_forearm","calf","outer_bicep"],selected_body_zone:zone,
    ink_profiles:["InkA-ConservativeBlack-v0"],density_setting:density,scale_percent:scale,
    estimated_dot_count:dotCount,max_passes:1,requires_client_final_approval:true,
    requires_artist_final_approval:true,safety_layers:{no_go_zones:[],contact_disabled:true},
    generated_at:stamp(),validation_status:"NOT_VALIDATED_SIMULATION"
  };
  saveFile("mercyink-"+preset+".dermal",JSON.stringify(manifest,null,2));
  addEvent("Exported simulation-only .dermal manifest");message("Design package exported");
 }
 function dry(){
  if(!intake){message("Complete intake gate first");return;}
  if(!verified){message("Verify the demo cartridge first");return;}
  setDryRun(true);addEvent("No-contact path preview accepted");message("Synthetic dry run passed");
 }
 function verify(){
  setVerified(true);addEvent("DEMO-INkA-0426 lot verified (fictional fixture)");message("Demo cartridge verified");
 }
 function run(){
  if(!gates){message("All five safeguards must be acknowledged");return;}
  setReceipt(null);setStatus("RUNNING");setProgress(0);addEvent("Started simulated dot execution","success");message("Simulated execution started");
 }
 function pause(reason="Operator pause"){
   if(status!=="RUNNING")return;
   setStatus("PAUSED");addEvent(reason+"; virtual applicator retracted","warn");
 }
 function abort(){
   if(status!=="RUNNING"&&status!=="PAUSED")return;
   setStatus("ABORTED");addEvent("Session aborted; simulated applicator retracted","warn");message("Session aborted safely");
 }
 function resume(){
   if(status!=="PAUSED")return;
   if(!gates){message("Approval gates no longer satisfied");return;}
   setStatus("RUNNING");addEvent("Operator resumed simulated execution");
 }
 function reset(){
   setStatus("IDLE");setProgress(0);setReceipt(null);setVerified(false);
   setIntake(false);setArtist(false);setClient(false);setDryRun(false);setSessionId(randId());
   setEvents([{time:stamp(),message:"New demo session initialized",type:"info"}]);message("New demo session initialized");
 }
 useEffect(()=>{if(status==="RUNNING"&&!gates){setStatus("PAUSED");addEvent("Approval gate revoked; virtual applicator retracted","warn");}},[gates,status]);
 useEffect(()=>{
  if(status!=="RUNNING")return;
  const t=setInterval(()=>setProgress(n=>Math.min(100,n+2)),115);
  return ()=>clearInterval(t);
 },[status]);
 useEffect(()=>{
  if(status!=="RUNNING"||progress<100)return;
  const r={
   schema:"dermalprint369.session_receipt.v0.1",session_id:sessionId,date:stamp(),simulated:true,
   studio_id:"mercyink-demo",operator_id:"simulated-operator",design_name:active.name,
   design_id:preset,placement_zone:zone,design_scale_percent:scale,density_setting:density,
   ink_lot:"DEMO-INKA-0426",needle_cartridge_id:"DEMO-CRT-0001",cartridge_verified:verified,
   dot_count:dotCount,depth_ceiling_mm:"NOT_APPLICABLE_VIRTUAL_ONLY",
   outcome:"SIMULATED_COMPLETE",consent_gates:{intake,artist_approved:artist,client_approved:client,dry_run_approved:dryRun},
   event_log:[...events].reverse(),aftercare_packet:"NO_PHYSICAL_PROCEDURE_PERFORMED",
   export_permission:"local-user-controlled",limitations:"Simulation output is not a medical or mechanical safety certification."
  };
  setReceipt(r);setStatus("COMPLETE");addEvent("Simulation completed; demo receipt ready","success");
 },[progress,status]);
 const pageName=NAV.find(n=>n[0]===page)?.[1]||"Overview";
 const navBtn=(id,title,glyph)=>e("button",{key:id,className:"nav-item "+(page===id?"active":""),onClick:()=>setPage(id)},e("span",{className:"nav-glyph"},glyph),e("span",null,title),id==="session"&&status==="RUNNING"&&e("i",{className:"nav-live"}));
 function overview(){return e(React.Fragment,null,
 H2({eyebrow:"PROJECT CONTROL ROOM / 001",title:"Safer process. Visible decisions.",description:"A human-centered research interface for traceable tattoo workflows. Explore the complete process without touching skin.",
 action:Button({children:["Open simulator ",icon("arrow",16)],onClick:()=>setPage("session")})}),
 e("div",{className:"hero-panel"},
  e("div",{className:"hero-copy"},e("div",{className:"hero-meta"},"DERMALPRINT369 / MERCYINK STUDIO",e("span",null,"CONCEPT v0.1")),
   e("h3",null,"The future of tattooing needs ",e("em",null,"better safeguards.")),
   e("p",null,"Not a tattoo vending machine. A transparent environment where artists remain artists, clients remain in control, and every material and decision has a record."),
   e("div",{className:"hero-actions"},Button({children:["Explore design studio ",icon("arrow",16)],onClick:()=>setPage("design")}),Button({children:"Review safety laws",variant:"outline-light",onClick:()=>setPage("safety")}))),
  e("div",{className:"hero-art"},e(DotPreview,{preset:"orbital",density:70,scale:95,previewOnly:true}))
 ),
 e("div",{className:"stat-grid"},e(Stat,{label:"DESIGN LAWS",value:"10",desc:"Human-first operating principles",accent:"teal"}),e(Stat,{label:"RESEARCH TIERS",value:"0 → X",desc:"Graduated, evidence-led roadmap",accent:"orange"}),e(Stat,{label:"CONTACT MODE",value:"OFF",desc:"No physical control supported",accent:"teal"}),e(Stat,{label:"VALIDATION",value:"0%",desc:"Concept, not clinical evidence",accent:"orange"})),
 e("div",{className:"two-col"},
  e(Panel,null,e("div",{className:"panel-heading"},e("h3",null,"Explore the platform"),Tag({children:"INTERACTIVE",tone:"teal"})),
   ...[["design","01","Design-to-dermal compiler","Adjust a virtual dot pattern and export a .dermal file."],["session","02","Safety-gated session","Walk through consent, verification, dry run and execution."],["materials","03","Material traceability","Inspect fictional consumable lots and the receipt schema."]].map(([id,num,name,desc])=>e("button",{className:"feature-link",key:id,onClick:()=>setPage(id)},e("span",{className:"feature-num"},num),e("span",null,e("strong",null,name),e("small",null,desc)),icon("arrow",17)))),
  e(Panel,{className:"principles"},e("div",{className:"panel-heading"},e("h3",null,"The non-negotiables"),Tag({children:"SAFETY FIRST"})),
   ...[["01","Consent above automation"],["02","Sterile path or no path"],["03","Artist remains the artist"],["04","Fail safe, not fail pretty"]].map(([n,t])=>e("div",{className:"principle",key:n},e("span",null,n),e("strong",null,t))),
   e("p",{className:"note"},"These are product-design commitments, not claims of completed validation.")
  )
 ));
 }
 function design(){return e(React.Fragment,null,
 H2({eyebrow:"DESIGN COMPILER / EXPERIMENTAL",title:"Design studio",description:"Create a virtual micro-dot composition, preview a synthetic placement grid, and export a structured .dermal manifest.",
 action:Button({children:[icon("download",16)," Export .dermal"],onClick:exportDesign,variant:"secondary"})}),
 e("div",{className:"design-layout"},
 e(Panel,{className:"art-panel"},
  e("div",{className:"panel-heading"},e("div",null,e("div",{className:"eyebrow"},"SYNTHETIC DESIGN SURFACE"),e("h3",null,active.name)),Tag({children:"NO-CONTACT PREVIEW",tone:"teal"})),
  e(DotPreview,{preset,density,scale}),
  e("div",{className:"art-footer"},e("span",null,"ARTIST APPROVAL REQUIRED BEFORE ANY REAL PROCESS"),e("span",null,dotCount+" virtual dots"))
 ),
 e("div",{className:"settings-stack"},
 e(Panel,null,e("div",{className:"eyebrow"},"01 / SELECT PATTERN"),e("h3",{className:"setting-title"},"Design library"),
 ...PRESETS.map(p=>e("button",{className:"preset "+(preset===p.id?"selected":""),key:p.id,onClick:()=>changeDesign(()=>setPreset(p.id))},e("span",{className:"preset-icon"},p.id==="wave"?"〰":p.id==="lattice"?"▦":"◎"),e("span",null,e("strong",null,p.name),e("small",null,p.kind)),preset===p.id&&e("span",{className:"selected-check"},"✓")))),
 e(Panel,null,e("div",{className:"eyebrow"},"02 / ADJUST PARAMETERS"),e("h3",{className:"setting-title"},"Geometry controls"),
 e("div",{className:"control-row"},e("label",{htmlFor:"density"},"Dot density"),e("strong",null,density+"%")),
 e("input",{id:"density",type:"range",min:30,max:100,value:density,onChange:x=>changeDesign(()=>setDensity(Number(x.target.value)))}),
 e("div",{className:"control-row"},e("label",{htmlFor:"scale"},"Preview scale"),e("strong",null,scale+"%")),
 e("input",{id:"scale",type:"range",min:60,max:115,value:scale,onChange:x=>changeDesign(()=>setScale(Number(x.target.value)))}),
 e("div",{className:"control-row"},e("label",{htmlFor:"zone"},"Proposed flat body zone")),
 e("select",{id:"zone",value:zone,onChange:x=>changeDesign(()=>setZone(x.target.value))},...ZONES.map(z=>e("option",{key:z,value:z},z))),
 e("div",{className:"notice"},icon("alert",18),e("span",null,"This grid is artistic geometry only. No skin-depth, tissue or placement safety is inferred."))),
 e(Panel,{className:"mini-info"},e("div",{className:"eyebrow"},"OUTPUT FORMAT"),e("strong",null,".dermal / v0.1"),e("p",null,"Exports a JSON manifest with art parameters, zone restrictions, consent requirements and explicit simulation flags.")))
 ));
 }
 function session(){return e(React.Fragment,null,
 H2({eyebrow:"SESSION CONTROL / SIMULATION ONLY",title:"Safety-gated session",description:"Run a fictional studio session through independent confirmation, a synthetic dry run, and fault injection.",
 action:Button({children:[icon("refresh",15)," New session"],variant:"secondary",onClick:reset,small:true})}),
 e("div",{className:"session-header"},
 e("div",null,e("span",{className:"mono muted"},"SESSION ID"),e("strong",{className:"mono"},sessionId)),
 e("div",null,e("span",{className:"mono muted"},"EXECUTION STATE"),Tag({children:status,tone:status==="RUNNING"?"teal":status==="PAUSED"||status==="ABORTED"?"orange":"neutral"})),
 e("div",null,e("span",{className:"mono muted"},"CONTACT"),e("strong",null,"DISABLED / DEMO"))),
 e("div",{className:"stage-strip"},...["INTAKE","DESIGN","SCAN","VERIFY","DRY RUN","ARM","EXECUTE"].map((s,i)=>e("div",{key:s,className:"stage "+(i===0&&intake||i===1&&artist||i===2&&intake||i===3&&verified||i===4&&dryRun||i===5&&gates||i===6&&status==="COMPLETE"?"done":"")},e("span",null,("0"+(i+1)).slice(-2)),e("b",null,s)))),
 e("div",{className:"session-layout"},
 e("div",{className:"session-left"},
 e(Panel,null,e("div",{className:"panel-heading"},e("h3",null,"Preflight confirmations"),Tag({children:(Number(intake)+Number(artist)+Number(client)+Number(verified)+Number(dryRun))+"/5 GATES",tone:gates?"teal":"orange"})),
 e(Check,{checked:intake,onChange:v=>{setIntake(v);setDryRun(false);setClient(false);addEvent(v?"Demo intake checklist acknowledged":"Intake gate revoked");},label:"01 / Intake checklist complete",detail:"Demo only: no personal or medical information collected."}),
 e(Check,{checked:artist,onChange:v=>{setArtist(v);setDryRun(false);addEvent(v?"Artist design approval acknowledged":"Artist approval revoked");},label:"02 / Artist approved exact design",detail:active.name+" / "+zone+" / "+scale+"% scale"}),
 e(Check,{checked:client,onChange:v=>{setClient(v);addEvent(v?"Client consent demo gate acknowledged":"Client consent revoked");},label:"03 / Client approved exact placement",detail:"Separate final confirmation; no real person is involved."}),
 e("div",{className:"verification-box"},e("span",null,icon("shield",20),e("strong",null,"04 / Cartridge identity check")),e("small",null,"Fixture: DEMO-INKA-0426 / DEMO-CRT-0001"),Button({children:verified?[icon("check",15)," Demo lot verified"]:"Verify fictional lot",variant:verified?"secondary":"primary",disabled:verified||status==="RUNNING",onClick:verify,small:true})),
 e("div",{className:"verification-box"},e("span",null,icon("play",18),e("strong",null,"05 / No-contact dry run")),e("small",null,"Virtual motion-path rehearsal, not a machine test"),Button({children:dryRun?[icon("check",15)," Dry run acknowledged"]:"Run virtual dry check",variant:dryRun?"secondary":"primary",disabled:dryRun||status==="RUNNING",onClick:dry,small:true}))),
 e(Panel,null,e("div",{className:"panel-heading"},e("h3",null,"Simulated control rail"),Tag({children:"HARDWARE DISCONNECTED"})),
 e("div",{className:"simulation-info"},e("div",{className:"progress-track"},e("div",{style:{width:progress+"%"}})),e("strong",null,progress+"%"),e("span",null,"Virtual dot placement")),
 e("div",{className:"control-buttons"},
 status==="PAUSED"?Button({children:[icon("play",16)," Resume"],onClick:resume}):Button({children:[icon("play",16),status==="COMPLETE"?" Completed":" Start simulation"],disabled:!gates||status==="RUNNING"||status==="COMPLETE"||status==="ABORTED",onClick:run}),
 Button({children:[icon("pause",16)," Pause"],variant:"secondary",disabled:status!=="RUNNING",onClick:()=>pause()}),
 Button({children:"Inject motion fault",variant:"outline",disabled:status!=="RUNNING",onClick:()=>pause("Motion anomaly injected (test fixture)")}),
 Button({children:"Abort",variant:"danger",disabled:status!=="RUNNING"&&status!=="PAUSED",onClick:abort})),
 e("p",{className:"tiny caution"},"This performs zero real-world needle, motor, depth, fluid or actuator commands."),
 receipt&&e("div",{className:"complete-banner"},icon("check",20),e("div",null,e("strong",null,"Virtual session completed"),e("small",null,"A demonstration-only receipt is ready for inspection.")),Button({children:[icon("download",16)," Receipt JSON"],variant:"secondary",onClick:()=>saveFile("receipt-"+sessionId+".json",JSON.stringify(receipt,null,2)),small:true}))),
 e("div",{className:"session-right"},
 e(Panel,null,e("div",{className:"panel-heading"},e("h3",null,"Approved geometry"),Tag({children:"VIRTUAL",tone:"teal"})),e(DotPreview,{preset,density,scale,previewOnly:true}),e("div",{className:"session-design-name"},e("strong",null,active.name),e("small",null,zone+" / "+dotCount+" dots")),Button({children:"Edit design",variant:"secondary",small:true,disabled:status==="RUNNING",onClick:()=>setPage("design")})),
 e(Panel,null,e("div",{className:"panel-heading"},e("h3",null,"Audit trail"),e("span",{className:"muted tiny"},events.length+" events")),e("div",{className:"event-list"},...events.slice(0,9).map((ev,i)=>e("div",{className:"event",key:i},e("span",{className:"event-dot "+ev.type}),e("div",null,e("strong",null,ev.message),e("small",null,new Date(ev.time).toLocaleTimeString()))))))
 ))));
 }
 function materials(){return e(React.Fragment,null,
 H2({eyebrow:"MATERIAL TRACEABILITY / DEMO DATA",title:"Material ledger",description:"Every material should be attributable to a known lot. This release uses invented identifiers and contains no supplier or sterilization certification."}),
 e("div",{className:"materials-overview"},
 e(Panel,null,e("div",{className:"eyebrow"},"DEMO CARTRIDGE"),e("h3",null,"Ink A / Conservative Black"),e("div",{className:"cartridge-visual"},e("div",{className:"cartridge-body"},e("span",null,"MERCYINK"),e("strong",null,"A / 01"),e("small",null,"SIMULATION ONLY"))),Tag({children:"FICTIONAL FIXTURE",tone:"orange"})),
 e(Panel,null,e("div",{className:"eyebrow"},"MATERIAL IDENTITY"),e("table",{className:"ledger-table"},e("tbody",null,...[["Ink lot","DEMO-INKA-0426"],["Needle cartridge","DEMO-CRT-0001"],["Material family","Black / gray concept"],["Sterility record","NOT PROVIDED"],["Certificate of analysis","NOT PROVIDED"],["Expiration / recall check","NOT CONNECTED"],["Supplier status","FICTIONAL"]].map(([a,b])=>e("tr",{key:a},e("th",null,a),e("td",null,b))))),
 e("div",{className:"notice"},icon("alert",18),e("span",null,"Passing the simulator's demo check does not verify actual sterility, chemistry, supplier trust or regulatory compliance."))),
 e(Panel,null,e("div",{className:"panel-heading"},e("h3",null,"Required evidence before physical use"),Tag({children:"NOT YET AVAILABLE",tone:"orange"})),
 e("div",{className:"three-col"},...[
 ["01","Identity","Ingredients, CAS/CI numbers, lot, carrier and preservative disclosure."],
 ["02","Microbiology","Independent method, criteria, lab identity, manufacturing controls."],
 ["03","Chemistry","Metals, PAHs, aromatic amines, relevant allergens and restrictions."],
 ["04","Stability","Shelf life, viscosity, aggregation and container compatibility."],
 ["05","Degradation","Photochemical breakdown and removal byproducts where relevant."],
 ["06","Chain of custody","Tamper evidence, packaging history and recall traceability."]
 ].map(([n,title,detail])=>e("div",{className:"evidence",key:n},e("span",{className:"evidence-num"},n),e("strong",null,title),e("p",null,detail))))
 )));
 }
 function safety(){return e(React.Fragment,null,
 H2({eyebrow:"HAZARD MODEL / NOT VALIDATED",title:"Safety architecture",description:"The system is not safe because it is automated. Hazards must be reduced, verified, documented, and independently reviewed."}),
 e(Panel,{className:"safety-banner"},icon("shield",28),e("div",null,e("strong",null,"The highest-priority output is a safe refusal."),e("p",null,"If consent, identity, sensing, motion or integrity cannot be established, the proposed physical system must not proceed."))),
 e("div",{className:"safety-laws"},...[
 ["01","Consent above automation"],["02","Sterile path or no path"],["03","Healthier process, not health promise"],
 ["04","Artist remains the artist"],["05","Trace every material"],["06","Depth is a controlled parameter"],
 ["07","Fail safe, not fail pretty"],["08","Local-first privacy"],["09","Counterfeit resistance"],["10","Receipt-based aftercare"]
 ].map(([n,t])=>e("div",{className:"law",key:n},e("span",null,n),e("strong",null,t)))),
 e(Panel,null,e("div",{className:"panel-heading"},e("h3",null,"Hazard register"),Tag({children:"EARLY DESIGN"})),
 e("div",{className:"table-scroll"},e("table",{className:"risk-table"},e("thead",null,e("tr",null,e("th",null,"Hazard"),e("th",null,"Proposed control"),e("th",null,"Current evidence"))),e("tbody",null,...RISK.map(([h,c,s])=>e("tr",{key:h},e("td",null,h),e("td",null,c),e("td",null,Tag({children:s,tone:s==="Simulated"||s==="Prototype"?"teal":"orange"})))))))),
 e("div",{className:"notice block-notice"},icon("alert",19),e("span",null,"No clinical, engineering, sterility, biocompatibility or safety certification is implied by this website. No human experiments should be performed based on this application.")));
 }
 function roadmap(){return e(React.Fragment,null,
 H2({eyebrow:"RESEARCH ROADMAP / PHI369 LABS",title:"Build cautiously. Prove everything.",description:"The original June 4, 2026 master spec prioritized traceability before robotics, and qualified bench evidence before any human application."}),
 e(Panel,null,e("div",{className:"panel-heading"},e("h3",null,"Phased product path"),Tag({children:"CONCEPT PLAN"})),
 e("div",{className:"timeline"},...ROADMAP.map(([n,title,sub,phase])=>e("div",{className:"timeline-row",key:n},e("span",{className:"timeline-node"},n),e("div",null,e("strong",null,title),e("p",null,sub)),Tag({children:phase,tone:phase==="Current"?"teal":"neutral"})))),
 e("div",{className:"two-col"},
 e(Panel,null,e("div",{className:"eyebrow"},"ARTIST-CENTERED"),e("h3",null,"The artist remains the artist."),e("p",null,"The machine never owns the aesthetic decision. Artist judgment, attribution, licensing and the client's relationship with the artist are central to the concept."),e("p",null,"The client must approve the exact size, orientation, design, placement and materials, and must be able to stop.")),
 e(Panel,null,e("div",{className:"eyebrow"},"BOUNDARIES"),e("h3",null,"Not a home tattoo appliance."),e("p",null,"This prototype does not interact with robotic hardware, control needles or measure skin. Further development must involve licensed artists, independent laboratory partners, product safety experts and jurisdiction-specific counsel."),e("p",null,"No healthy ink, hypoallergenic, less painful or safer-to-remove claims without appropriate evidence."))),
 e("div",{className:"source-line"},"Based on DermalPrint369 / MercyInk Studio Master Product + Safety Architecture Spec v0.1, June 4, 2026 · PHI369 Labs.")));
 }
 return e("div",{className:"app"},
 e("aside",{className:"sidebar"},
 e("div",{className:"brand"},e("div",{className:"brand-symbol"},"Φ"),e("div",null,e("strong",null,"DERMALPRINT",e("span",null,"369")),e("small",null,"MERCYINK STUDIO"))),
 e("div",{className:"sidebar-section"},e("small",null,"WORKSPACE"),...NAV.map(([id,title,glyph])=>navBtn(id,title,glyph))),
 e("div",{className:"sidebar-bottom"},e("div",{className:"side-card"},e("div",{className:"side-dot"}),e("strong",null,"Research prototype"),e("p",null,"No physical tattooing. No hardware connection. No clinical claims.")),e("div",{className:"sidebar-footer"},"PHI369 LABS",e("span",null,"OPEN RESEARCH / "+APP_VERSION))),
 e("div",{className:"main"},
 e("header",{className:"topbar"},e("div",{className:"breadcrumb"},"WORKSPACE ",e("span",null,"/"),e("strong",null,pageName)),e("div",{className:"top-right"},Tag({children:"SIMULATION ONLY",tone:"teal"}),e("a",{href:"https://github.com/MichaelWave369/DermalPrint369",target:"_blank",rel:"noopener noreferrer",className:"github-link"},"VIEW SOURCE ↗"))),
 e("main",{className:"content"},page==="overview"?overview():page==="design"?design():page==="session"?session():page==="materials"?materials():page==="safety"?safety():roadmap()),
 e("footer",{className:"app-footer"},e("span",null,"DERMALPRINT369 · MERCYINK STUDIO · PHI369 LABS"),e("span",null,"Concept interface · No live body-contact controls · v"+APP_VERSION))),
 toast&&e("div",{className:"toast",role:"status"},icon("check",17),toast)));
}
createRoot(document.getElementById("root")).render(e(App));
