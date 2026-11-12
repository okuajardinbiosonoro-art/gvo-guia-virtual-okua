import { expect, test, type Page, type TestInfo, type Locator } from "@playwright/test";

const profiles = [
  { name: 'portrait', width: 390, height: 844 },
  { name: 'narrow', width: 320, height: 568 },
  { name: 'landscape', width: 568, height: 280 },
  { name: 'text200', width: 390, height: 844, text200: true },
];
async function fixture(page: Page, language: 'es'|'en') {
  await page.addInitScript(locale => {
    const orders = { cover: ['saludo','cinco_salas_y_proposito','orden_y_revisita','raiz'], 1:['intro','relacion','percepcion','mediacion'], 2:['planta','senal','captura','acondicionamiento','mapeo','musica'], 3:['INTRO','PASO A PASO','BENEFICIOS'], 4:['introduccion_mesa','presentacion_8','orden_resuelto','cierre'], 5:['plantas','sistema','espacio','visitante','resultado'] };
    const isI = location.pathname === '/estacion/1';
    const room = (id: keyof typeof orders, count: number) => ({ contentRevision:'OBS03.2', presentedStepIds:orders[id].slice(0,count),confirmedStepIds:orders[id].slice(0,count),assistedPresentedStepIds:[],activeStepId:orders[id][count]??null,interactionEvidence:[],outcome:null,closed:count===orders[id].length });
    localStorage.clear(); sessionStorage.clear(); localStorage.setItem('gvo.language.v1',locale);
    localStorage.setItem('gvo.progress.v1',JSON.stringify({schemaVersion:1,completedStations:[],updatedAt:null}));
    localStorage.setItem('gvo.journey.essential.v1',JSON.stringify({schemaVersion:1,contractRevision:'OBS03.2',revision:0,cover:room('cover',isI?4:0),stations:{1:room(1,isI?1:0),2:room(2,0),3:room(3,0),4:room(4,0),5:room(5,0)},legacyRouteCredit:0,migrationEvidence:{source:'captured_before_mount',globalStatus:'ok'},pendingTransition:null,finalReached:false}));
  }, language);
}
async function ready(page: Page, root: string) {
  await expect(page.locator(`.gvo-prepared-tree[data-journey-active="true"] ${root}`)).toBeVisible({timeout:25000});
  await expect(page.locator('.gvo-preparation-curtain')).toHaveCount(0);
}
async function measure(page: Page, button: Locator, textSelector: string) {
  await button.scrollIntoViewIfNeeded();
  return button.evaluate((element, selector) => {
    const rect = element.getBoundingClientRect();
    const points = [[.5,.5],[.25,.25],[.75,.25],[.25,.75],[.75,.75]].map(([x,y]) => {const px=rect.left+rect.width*x,py=rect.top+rect.height*y,hit=document.elementFromPoint(px,py);return {x:px,y:py,hit:hit===element||Boolean(hit&&element.contains(hit)),hitClass:hit?.className};});
    const text = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(n=>getComputedStyle(n).display!=='none'&&n.getBoundingClientRect().width>0).map(n=>{const r=n.getBoundingClientRect();return {text:n.textContent,rect:r.toJSON(),intersection:Math.max(0,Math.min(r.right,rect.right)-Math.max(r.left,rect.left))*Math.max(0,Math.min(r.bottom,rect.bottom)-Math.max(r.top,rect.top))};});
    return {button:rect.toJSON(),points,text,viewport:[innerWidth,innerHeight],documentWidth:document.documentElement.scrollWidth};
  },textSelector);
}
async function checkedClick(page: Page, button: Locator, selector: string, journal: unknown[]) {
  await expect(button).toBeEnabled(); const record=await measure(page,button,selector); journal.push(record);
  expect(record.documentWidth).toBeLessThanOrEqual(record.viewport[0]+1);
  expect(record.button.width).toBeGreaterThanOrEqual(44); expect(record.button.height).toBeGreaterThanOrEqual(44);
  expect(record.points.every(p=>p.hit)).toBe(true);
  expect(record.text.every(t=>t.intersection===0)).toBe(true);
  await button.click();
}
async function shot(page: Page, info: TestInfo, name: string) { await page.screenshot({path:info.outputPath(`${name}-viewport.png`),fullPage:false}); }
test.describe('OBS04 cover composition and Root reading · declared prior-access fixtures',()=>{
  for(const locale of ['es','en'] as const) for(const profile of profiles) test(`${locale}-${profile.name}`,async({page},info)=>{
    test.setTimeout(75000); await page.setViewportSize(profile); await fixture(page,locale);
    const journal:unknown[]=[];
    try {
      await page.goto('/portada'); await ready(page,'main.cover-intro');
      if(profile.text200) {await page.addStyleTag({content:'html{font-size:200%!important}'}); await ready(page,'main.cover-intro');}
      await expect(page.locator('main.cover-intro')).toHaveAttribute('data-cover-phase','portada_idle');
      expect(await page.locator('.cover-intro__header').evaluate(n=>getComputedStyle(n,'::before').content)).toBe('none');
      expect(await page.locator('.cover-intro__title').evaluate(n=>n.parentElement?.tagName)).toBe('FOOTER');
      const textGeometry=await page.locator('main.cover-intro').evaluate(main=>Array.from(main.querySelectorAll<HTMLElement>('.cover-intro__brand-name,.cover-intro__brand-subtitle,.cover-intro__title')).map(n=>{const r=n.getBoundingClientRect(),s=getComputedStyle(n);return {selector:n.className,text:n.textContent,color:s.color,fontSize:s.fontSize,fontWeight:s.fontWeight,rect:r.toJSON()};}));
      journal.push({phase:'cover-idle',textGeometry}); await shot(page,info,'01-cover-idle');
      const hiding=await page.addStyleTag({content:'.cover-intro__brand-name,.cover-intro__brand-subtitle,.cover-intro__title{visibility:hidden!important}'});
      await page.screenshot({path:info.outputPath('01-cover-underlay-contrast-only.png'),fullPage:false}); await hiding.evaluate(n=>n.remove());
      const start=page.getByRole('button',{name:locale==='es'?'Empieza aquí':'Start here',exact:true});
      await start.scrollIntoViewIfNeeded();
      const scrolledTextGeometry=await page.locator('main.cover-intro').evaluate(main=>Array.from(main.querySelectorAll<HTMLElement>('.cover-intro__brand-name,.cover-intro__brand-subtitle,.cover-intro__title')).map(n=>{const r=n.getBoundingClientRect(),s=getComputedStyle(n);return {selector:n.className,text:n.textContent,color:s.color,fontSize:s.fontSize,fontWeight:s.fontWeight,rect:r.toJSON()};}));
      journal.push({phase:'cover-idle-scrolled-to-action',textGeometry:scrolledTextGeometry});
      const hidingScrolled=await page.addStyleTag({content:'.cover-intro__brand-name,.cover-intro__brand-subtitle,.cover-intro__title{visibility:hidden!important}'});
      await page.screenshot({path:info.outputPath('01-cover-scrolled-underlay-contrast-only.png'),fullPage:false}); await hidingScrolled.evaluate(n=>n.remove());
      await checkedClick(page,start,'.cover-intro__brand-name,.cover-intro__brand-subtitle,.cover-intro__title',journal);
      for(let step=0;step<4;step++) {
        await expect(page.locator('[data-dialogue-id]')).toBeVisible();
        if(step===1)await shot(page,info,'02-cover-long-dialogue');
        await checkedClick(page,page.locator('.cover-intro__dialogue-actions button'),'.cover-intro__dialogue-text,.cover-intro__dialogue-meta',journal);
      }
      await expect(page.locator('main.cover-intro')).toHaveAttribute('data-cover-phase','portal_1_ready');
      const portalArt = await page.locator('main.cover-intro').evaluate(main => {
        const roman = main.querySelector<HTMLElement>('.cover-intro__portal--primary .cover-intro__portal-roman')!.getBoundingClientRect();
        const painted = Array.from(main.querySelectorAll<HTMLImageElement>('.cover-intro__lia-wrap [data-lia-rig-layer="body"],.cover-intro__lia-wrap [data-lia-rig-layer="head-clean"]')).map(img => {
          const canvas = document.createElement('canvas'); canvas.width=img.naturalWidth; canvas.height=img.naturalHeight;
          const context=canvas.getContext('2d')!; context.drawImage(img,0,0); const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;
          let left=canvas.width,top=canvas.height,right=0,bottom=0;
          for(let y=0;y<canvas.height;y++) for(let x=0;x<canvas.width;x++) if(pixels[(y*canvas.width+x)*4+3]>=220){left=Math.min(left,x);right=Math.max(right,x+1);top=Math.min(top,y);bottom=Math.max(bottom,y+1);}
          const r=img.getBoundingClientRect(); const paint={left:r.left+left/canvas.width*r.width,right:r.left+right/canvas.width*r.width,top:r.top+top/canvas.height*r.height,bottom:r.top+bottom/canvas.height*r.height};
          const intersection=Math.max(0,Math.min(roman.right,paint.right)-Math.max(roman.left,paint.left))*Math.max(0,Math.min(roman.bottom,paint.bottom)-Math.max(roman.top,paint.top));
          return {layer:img.dataset.liaRigLayer,paint,intersection};
        });
        return {roman:roman.toJSON(),painted,qualification:'Native alpha>=220 bounds of nonrotating body/head layers, compared with actual portal numeral; screenshot review also checks petals and frame.'};
      });
      journal.push({phase:'cover-portal-ready-art',portalArt}); await shot(page,info,'03-cover-portal-ready');
      expect(portalArt.painted.every(layer=>layer.intersection===0)).toBe(true);
      await page.goto('/estacion/1'); await ready(page,'main.world1-root-screen');
      if(profile.text200)await page.addStyleTag({content:'html{font-size:200%!important}'});
      const more=page.locator('.world1-reading-more-toggle'); await expect(more).toBeVisible();
      expect(await more.evaluate(n=>getComputedStyle(n).backgroundColor)).toBe('rgba(0, 0, 0, 0)');
      expect(await more.evaluate(n=>n.closest('.world1-root-narrative__viewport'))).toBeNull();
      await checkedClick(page,more,'.world1-root-narrative__viewport',journal);
      await expect(page.locator('.world1-reading-expanded')).toBeVisible();
      await shot(page,info,'04-root-expanded-actions');
      const reading=await page.locator('.world1-root-narrative').evaluate(n=>{const viewport=n.querySelector<HTMLElement>('.world1-root-narrative__viewport')!,actions=n.querySelector<HTMLElement>('.world1-reading-actions')!,expanded=n.querySelector<HTMLElement>('.world1-reading-expanded')!;return {viewport:viewport.getBoundingClientRect().toJSON(),actions:actions.getBoundingClientRect().toJSON(),scrollHeight:viewport.scrollHeight,clientHeight:viewport.clientHeight,color:getComputedStyle(expanded).color};});
      journal.push({phase:'root-expanded',reading}); expect(reading.actions.top).toBeGreaterThanOrEqual(reading.viewport.bottom-1);
      await checkedClick(page,page.locator('.world1-reading-close'),'.world1-root-narrative__viewport',journal);
    } finally {
      await info.attach('OBS04-cover-I-real-geometry',{body:JSON.stringify({qualification:'Declared prior-access fixtures; current cover and actual native controls. CSStext200 is a layout probe, not native zoom. Underlay hides three text nodes only for conservative pixel contrast analysis, never a product screenshot.',locale,profile,journal},null,2),contentType:'application/json'});
    }
  });
});
