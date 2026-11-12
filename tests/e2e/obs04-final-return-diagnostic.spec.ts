import {createHash} from "node:crypto";
import {readFileSync} from "node:fs";
import {createRequire} from "node:module";
import {expect,test} from "@playwright/test";

const fixturePath="docs/narrative/integracion_autonoma_2026-10-23/revision-observaciones-03/r4-delta/e05-build12-source/fresh06--OBS03-production-journey-evidence.json";
const fixtureBytes=readFileSync(fixturePath), fixture=JSON.parse(fixtureBytes.toString("utf8")).endEarned;
const require=createRequire(import.meta.url);
const QRCode=require("qrcode") as {toDataURL:(payload:string,options:object)=>Promise<string>};
type NativeRow={event:string;at:number;path:string;image?:unknown;detail?:unknown};
declare global{interface Window{__obs04FinalReturnDiagnostic?:NativeRow[];__obs04FinalReturnCamera?:{mode:"blank"|"wrong";stopped:boolean}}}
test.use({viewport:{width:568,height:280},reducedMotion:"reduce",serviceWorkers:"block"});
test("scrolled readonly II returns through the real dock to the actual prepared landscape Mirador",async({page},info)=>{
  test.setTimeout(45_000);
  const indexBefore=createHash("sha256").update(await(await page.request.get("/")).body()).digest("hex");
  const errors:string[]=[],httpErrors:unknown[]=[];
  page.on("pageerror",e=>errors.push(e.message));page.on("response",r=>{if(r.status()>=400)httpErrors.push({url:r.url(),status:r.status()})});
  const wrongFrame=await QRCode.toDataURL("/qr/w5",{width:512,margin:4});
  await page.addInitScript(({fixture,wrongFrame})=>{
    if(!/^https?:$/.test(location.protocol))return;
    localStorage.clear();sessionStorage.clear();localStorage.setItem("gvo.language.v1","es");
    for(const[key,value]of [["gvo.journey.essential.v1",fixture.essential],["gvo.progress.v1",fixture.progress],["gvo.station4.ordering.v1",fixture.ordering],["gvo.station5.quiz.v1",fixture.quiz]])if(value!==null)localStorage.setItem(key,JSON.stringify(value));
    const rows=window.__obs04FinalReturnDiagnostic=[] as NativeRow[];
    const image=(img:HTMLImageElement)=>({src:img.src,currentSrc:img.currentSrc,complete:img.complete,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,connected:img.isConnected});
    const record=(event:string,img?:HTMLImageElement,detail?:unknown)=>{if(rows.length<2000)rows.push({event,at:performance.now(),path:location.pathname,...(img?{image:image(img)}:{}),...(detail?{detail}:{})})};
    const camera=window.__obs04FinalReturnCamera={mode:"blank",stopped:false};
    const devices=navigator.mediaDevices??{};
    Object.defineProperty(navigator,"mediaDevices",{configurable:true,value:devices});
    Object.defineProperty(devices,"getUserMedia",{configurable:true,value:async(constraints:MediaStreamConstraints)=>{
      if(constraints.audio!==false)throw Error("Diagnostic camera requires audio:false");
      const canvas=document.createElement("canvas");canvas.width=canvas.height=640;const draw=canvas.getContext("2d")!;
      const qr=new Image();qr.src=wrongFrame;await qr.decode();
      const paint=()=>{draw.fillStyle="white";draw.fillRect(0,0,640,640);if(camera.mode==="wrong")draw.drawImage(qr,64,64,512,512)};
      paint();const stream=canvas.captureStream(12),timer=setInterval(paint,80);
      for(const track of stream.getTracks()){const stop=track.stop.bind(track);track.stop=()=>{camera.stopped=true;clearInterval(timer);stop()}}
      return stream;
    }});
    // Native delegation only: record the exact DOM IMG state when the mounted
    // proof subscribes/decodes. No listener/result/source/clock is replaced.
    const add=HTMLImageElement.prototype.addEventListener;
    HTMLImageElement.prototype.addEventListener=function(this:HTMLImageElement,...args:Parameters<typeof add>){if(this.isConnected&&this.src.includes("/final-root/")&&["load","error"].includes(args[0]))record("listener:"+args[0],this);return add.apply(this,args)};
    const decode=HTMLImageElement.prototype.decode;
    HTMLImageElement.prototype.decode=function(this:HTMLImageElement){const matching=this.src.includes("/final-root/");if(matching)record("decode:call",this);const result=decode.call(this);if(matching)void result.then(()=>record("decode:resolved",this),error=>record("decode:rejected",this,String(error)));return result};
    document.addEventListener("load",event=>{if(event.target instanceof HTMLImageElement&&event.target.src.includes("/final-root/"))record("native:load",event.target)},true);
    document.addEventListener("error",event=>{if(event.target instanceof HTMLImageElement&&event.target.src.includes("/final-root/"))record("native:error",event.target)},true);
    const observer=new MutationObserver(()=>{if(location.pathname!=="/final")return;const tree=document.querySelector(".gvo-prepared-tree");record("mutation",undefined,{active:tree?.getAttribute("data-journey-active"),inert:tree?.hasAttribute("inert"),images:Array.from(tree?.querySelectorAll("img")??[]).map(image),renderError:!!tree?.querySelector("[data-preparation-render-error]")})});
    observer.observe(document,{subtree:true,childList:true,attributes:true,attributeFilter:["src","srcset","data-journey-active","aria-hidden","inert"]});
  },{fixture,wrongFrame});
  let phase="initial-final";
  const before=await page.evaluate(()=>({url:location.href}));
  try{
    await page.goto("/final");
    await expect(page.locator('.gvo-prepared-tree[data-journey-active="true"] main.final-root-shell')).toBeVisible();
    await page.locator('a[data-final-access-id="ii"]').click();phase="review-II";
    await expect(page.locator('.gvo-prepared-tree[data-journey-active="true"] main.world2-root-screen')).toBeVisible();
    const rawBefore=await page.evaluate(()=>({essential:localStorage.getItem("gvo.journey.essential.v1"),progress:localStorage.getItem("gvo.progress.v1")}));
    for(const layer of ["planta_viva","senal","captura","acondicionamiento","mapeo","resultado_mediado"]){
      await page.locator(`.world2-layer-button[data-world2-layer="${layer}"]`).click();
      if(layer==="planta_viva")await page.locator("[data-plant-contact-hotspot]").click();
      if(layer==="senal")await page.locator("[data-world2-signal-reveal-control]").click();
      if(layer==="captura")for(let index=0;index<3;index++)await page.locator(".world2-capture-timeline__step-control").nth(index).click();
      if(layer==="mapeo")for(let index=1;index<=3;index++)await page.locator(`[data-mapping-progress-step="${index}"]`).click();
      await page.locator("main.world2-root-screen .world2-dialogue").scrollIntoViewIfNeeded();
    }
    await page.locator("main.world2-root-screen .world2-reading-advance").click();
    await expect(page.locator("main.world2-root-screen")).toHaveAttribute("data-world2-state","ready_to_continue");
    await page.locator('[data-interstation-qr-action="open"]').click();
    const overlay=page.locator('[data-interstation-qr-gate="active"][role="dialog"]');
    await expect(overlay.locator("video")).toBeVisible();
    await page.evaluate(()=>{window.__obs04FinalReturnCamera!.mode="wrong"});
    await expect(overlay).toContainText("otra estación");
    await overlay.locator('[data-interstation-qr-action="close"]').click();
    await expect(overlay).toHaveCount(0);
    expect(await page.evaluate(()=>({essential:localStorage.getItem("gvo.journey.essential.v1"),progress:localStorage.getItem("gvo.progress.v1")}))).toEqual(rawBefore);
    await page.locator(".world2-layer-nav").scrollIntoViewIfNeeded();
    const dock=page.locator(".final-review-return-control");
    await expect(dock).toBeEnabled();
    const pointer=await dock.evaluate(button=>{const r=button.getBoundingClientRect();return{scrollY,rect:r.toJSON(),points:[[.5,.5],[.25,.25],[.75,.25],[.25,.75],[.75,.75]].map(([x,y])=>{const hit=document.elementFromPoint(r.x+r.width*x,r.y+r.height*y);return{hit:hit===button||!!hit&&button.contains(hit),class:hit?.className}})}});
    await info.attach("before-real-return",{body:JSON.stringify(pointer,null,2),contentType:"application/json"});
    expect(pointer.scrollY).toBeGreaterThan(0);expect(pointer.points.every(p=>p.hit)).toBe(true);
    await dock.click();phase="return-final";
    await expect(page).toHaveURL(/\/final$/);
    await expect(page.locator('.gvo-prepared-tree[data-journey-active="true"] main.final-root-shell')).toBeVisible({timeout:18_000});
    phase="returned-active";
  }finally{
    const state=await page.evaluate(()=>({path:location.pathname,scrollY,viewport:{width:innerWidth,height:innerHeight},documentHeight:document.documentElement.scrollHeight,tree:Array.from(document.querySelectorAll(".gvo-prepared-tree")).map(tree=>({active:tree.getAttribute("data-journey-active"),inert:tree.hasAttribute("inert"),rect:tree.getBoundingClientRect().toJSON()})),main:Array.from(document.querySelectorAll("main")).map(main=>({class:main.className,rect:main.getBoundingClientRect().toJSON()})),curtain:document.querySelector(".gvo-preparation-curtain")?.textContent,fonts:{status:document.fonts.status,faces:Array.from(document.fonts).map(f=>({family:f.family,status:f.status}))},images:Array.from(document.querySelectorAll<HTMLImageElement>("main.final-root-shell img")).map(img=>({src:img.src,currentSrc:img.currentSrc,complete:img.complete,naturalWidth:img.naturalWidth,naturalHeight:img.naturalHeight,rect:img.getBoundingClientRect().toJSON()})),essentialRaw:localStorage.getItem("gvo.journey.essential.v1"),progressRaw:localStorage.getItem("gvo.progress.v1"),reviewSession:sessionStorage.getItem("gvo.final.reviewContext.v1"),navigationState:history.state,journal:window.__obs04FinalReturnDiagnostic??[]}));
    await page.screenshot({path:info.outputPath("final-return-diagnostic.png"),fullPage:false});
    const indexAfter=createHash("sha256").update(await(await page.request.get("/")).body()).digest("hex");
    await info.attach("OBS04-final-return-native-diagnostic",{body:JSON.stringify({qualification:"One declared prior complete-state fixture; actual Mirador→II link, six readonly selections/actions, real ZXing wrong-QR canvas/close, document scroll and dock click. Native listener/decode instrumentation delegates unchanged arguments and original Promise, recording source/complete state without layout reads until terminal snapshot. No internal runtime API, fake clock, readiness/source/progress override or new earned-journey claim.",fixturePath,fixtureSha256:createHash("sha256").update(fixtureBytes).digest("hex"),indexBefore,indexAfter,phase,before,state,errors,httpErrors},null,2),contentType:"application/json"});
    expect(indexAfter).toBe(indexBefore);
  }
});
