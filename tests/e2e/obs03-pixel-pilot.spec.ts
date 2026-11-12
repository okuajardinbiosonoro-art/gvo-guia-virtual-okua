import { expect, test } from '@playwright/test';

// Declared layout/motion fixture: not evidence of an earned visitor journey.
test('OBS03 pixel INTRO pilot in real notebook scene', async ({ page }, info) => {
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.addInitScript(() => {
    const steps={cover:['saludo','cinco_salas_y_proposito','orden_y_revisita','raiz'],1:['intro','relacion','percepcion','mediacion'],2:['planta','senal','captura','acondicionamiento','mapeo','musica'],3:['INTRO','PASO A PASO','BENEFICIOS'],4:['introduccion_mesa','presentacion_8','orden_resuelto','cierre'],5:['plantas','sistema','espacio','visitante','resultado']};
    const room=(id:keyof typeof steps,closed:boolean)=>({contentRevision:'OBS03.2',presentedStepIds:closed?steps[id]:[],confirmedStepIds:closed?steps[id]:[],assistedPresentedStepIds:[],activeStepId:closed?null:steps[id][0],interactionEvidence:[],outcome:null,closed});
    localStorage.clear();sessionStorage.clear();localStorage.setItem('gvo.language.v1','es');
    localStorage.setItem('gvo.journey.essential.v1',JSON.stringify({schemaVersion:1,contractRevision:'OBS03.2',revision:0,cover:room('cover',true),stations:{1:room(1,true),2:room(2,true),3:room(3,false),4:room(4,false),5:room(5,false)},legacyRouteCredit:2,migrationEvidence:{source:'captured_before_mount',globalStatus:'ok'},pendingTransition:null,finalReached:false}));
    localStorage.setItem('gvo.progress.v1',JSON.stringify({schemaVersion:1,completedStations:[1,2],updatedAt:'2026-10-23T12:00:00.000Z'}));
  });
  const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto('/estacion/3');
  await expect(page.locator('.gvo-prepared-tree[data-journey-active="true"] main.s3-practice-screen')).toBeVisible();
  await page.getByRole('button',{name:/^Página 1 de 3/}).click();
  const actor=page.locator('[data-station3-lia="pixel-registered-clip"][data-lia-target="planta"]');
  await expect(actor).toHaveAttribute('data-lia-clip-status','ready');
  const samples=await actor.evaluate(async element=>{
    const frame=element.querySelector('.s3-lia-clip__frame')!;
    const samples:{ms:number;position:string;opacity:string;rect:{x:number;y:number;width:number;height:number}}[]=[];
    const start=performance.now();
    while(performance.now()-start<850){
      const r=element.getBoundingClientRect();const style=getComputedStyle(frame);
      samples.push({ms:performance.now()-start,position:style.backgroundPosition,opacity:style.opacity,rect:{x:r.x,y:r.y,width:r.width,height:r.height}});
      await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));
    }
    return samples;
  });
  const positions=[...new Set(samples.map(sample=>sample.position))];
  expect(positions.length).toBeGreaterThanOrEqual(4);
  expect(samples.at(-1)?.position).toBe('100% 100%');
  await page.screenshot({path:info.outputPath('INTRO-real-scene-after-motion.png'),fullPage:true});
  const geometry=await actor.evaluate(element=>{
    const r=element.getBoundingClientRect();return {width:r.width,height:r.height,x:r.x,y:r.y,viewport:[innerWidth,innerHeight],scrollWidth:document.documentElement.scrollWidth,pointerEvents:getComputedStyle(element).pointerEvents};
  });
  expect(geometry.pointerEvents).toBe('none');expect(geometry.scrollWidth).toBeLessThanOrEqual(391);
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(actor).toHaveAttribute('data-lia-clip-mode','stable');
  await expect(actor).toHaveAttribute('data-lia-clip-stable-frame','3');
  await page.screenshot({path:info.outputPath('INTRO-real-scene-reduced-motion.png'),fullPage:true});
  expect(errors).toEqual([]);
  await info.attach('OBS03-pixel-pilot-evidence',{body:JSON.stringify({qualification:'Synthetic persisted fixture, real notebook consumer and natural animation; no earned closure or physical practice claim',positions,geometry,samples,errors},null,2),contentType:'application/json'});
});

for(const profile of [
  {name:'mobile',width:390,height:844,reduced:false},
  {name:'narrow',width:280,height:640,reduced:false},
  {name:'short-landscape',width:568,height:280,reduced:false},
  {name:'reduced',width:390,height:844,reduced:true},
]) test(`OBS03 three final pixel clips · ${profile.name}`,async({page},info)=>{
  await page.setViewportSize({width:profile.width,height:profile.height});
  await page.emulateMedia({reducedMotion:profile.reduced?'reduce':'no-preference'});
  await page.addInitScript(()=>{
    const steps={cover:['saludo','cinco_salas_y_proposito','orden_y_revisita','raiz'],1:['intro','relacion','percepcion','mediacion'],2:['planta','senal','captura','acondicionamiento','mapeo','musica'],3:['INTRO','PASO A PASO','BENEFICIOS'],4:['introduccion_mesa','presentacion_8','orden_resuelto','cierre'],5:['plantas','sistema','espacio','visitante','resultado']};
    const room=(id:keyof typeof steps,closed:boolean)=>({contentRevision:'OBS03.2',presentedStepIds:closed?steps[id]:[],confirmedStepIds:closed?steps[id]:[],assistedPresentedStepIds:[],activeStepId:closed?null:steps[id][0],interactionEvidence:[],outcome:null,closed});
    localStorage.clear();sessionStorage.clear();localStorage.setItem('gvo.language.v1','es');
    localStorage.setItem('gvo.journey.essential.v1',JSON.stringify({schemaVersion:1,contractRevision:'OBS03.2',revision:0,cover:room('cover',true),stations:{1:room(1,true),2:room(2,true),3:room(3,false),4:room(4,false),5:room(5,false)},legacyRouteCredit:2,migrationEvidence:{source:'captured_before_mount',globalStatus:'ok'},pendingTransition:null,finalReached:false}));
    localStorage.setItem('gvo.progress.v1',JSON.stringify({schemaVersion:1,completedStations:[1,2],updatedAt:'2026-10-23T12:00:00.000Z'}));
  });
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  const request=await page.request.get('/');const indexBytes=await request.body();
  await page.goto('/estacion/3');
  const room=page.locator('.gvo-prepared-tree[data-journey-active="true"] main.s3-practice-screen');
  await expect(room).toBeVisible();
  const indexActor=room.locator('[data-lia-clip="intro"]');
  await expect(indexActor).toHaveAttribute('data-lia-clip-stable-frame','1');
  const reports=[];
  const profiles=[{id:'intro',target:'planta',duration:650,button:/^Página 1 de 3/},{id:'listening',target:'prototipo',duration:1100,button:'PASO A PASO →'},{id:'accompanying',target:'senal',duration:850,button:'BENEFICIOS →'}];
  for(const clip of profiles){
    await room.getByRole('button',{name:clip.button,exact:typeof clip.button==='string'}).click();
    const actor=room.locator(`[data-lia-clip="${clip.id}"][data-lia-target="${clip.target}"]`);
    await expect(actor).toHaveAttribute('data-lia-clip-status','ready');
    await expect(actor).toHaveAttribute('data-lia-active','true');
    const sample=await actor.evaluate(async(element,{duration,reduced})=>{
      const frame=element.querySelector('.s3-lia-clip__frame')!;
      const positions:string[]=[];const start=performance.now();
      while(performance.now()-start<(reduced?50:duration+180)){
        positions.push(getComputedStyle(frame).backgroundPosition);
        await new Promise<void>(resolve=>requestAnimationFrame(()=>resolve()));
      }
      const rect=element.getBoundingClientRect();return {positions:[...new Set(positions)],last:positions.at(-1),animation:getComputedStyle(frame).animationName,source:getComputedStyle(frame).backgroundImage,rect:{x:rect.x,y:rect.y,width:rect.width,height:rect.height},scrollWidth:document.documentElement.scrollWidth};
    },{duration:clip.duration,reduced:profile.reduced});
    if(profile.reduced){expect(sample.animation).toBe('none');await expect(actor).toHaveAttribute('data-lia-clip-stable-frame','3');}
    else{expect(sample.positions.length).toBeGreaterThanOrEqual(4);expect(sample.last).toBe('100% 100%');}
    expect(sample.source).toContain(`lia_world3_${clip.id}_6f_v03.webp`);
    expect(sample.scrollWidth).toBeLessThanOrEqual(profile.width+1);
    expect(sample.rect.x).toBeGreaterThanOrEqual(-1);expect(sample.rect.x+sample.rect.width).toBeLessThanOrEqual(profile.width+1);
    await expect(room.locator('[data-station3-page-turn]')).toHaveCount(0);
    await page.screenshot({path:info.outputPath(`${clip.id}-${profile.name}-scene.png`),fullPage:true});
    reports.push({clip:clip.id,...sample});
  }
  const state=await page.evaluate(()=>({essential:JSON.parse(localStorage.getItem('gvo.journey.essential.v1')??'null'),progress:JSON.parse(localStorage.getItem('gvo.progress.v1')??'null'),practiceRaw:localStorage.getItem('gvo.station3.practice.v2')}));
  expect(state.essential.stations[3].closed).toBe(false);expect(state.progress.completedStations).toEqual([1,2]);expect(state.practiceRaw).toBeNull();expect(errors).toEqual([]);
  await info.attach('OBS03-three-clips-scene-evidence',{body:JSON.stringify({qualification:'Declared prior progress, real ordered notebook UI; animation grants no closure or physical practice. Normal and reduced motion, original page turn.',profile,indexBytes:indexBytes.length,reports,state,errors},null,2),contentType:'application/json'});
});
