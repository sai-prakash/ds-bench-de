// P1 / FR-01, FR-02, FR-03, FR-04: engineering feasibility only.
// This is NOT a generated-agent benchmark. No model provider or credentials.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { mkdir, writeFile, readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve, relative, extname, sep } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const out = resolve(process.argv[2] || join(tmpdir(), 'ds-bench-p1-evidence'));
const work = join(out, 'work');
await mkdir(work, { recursive: true });
const evidence = { kind: 'engineering_feasibility_not_benchmark', protocol: 'P1', node: process.version, environment: { os: process.platform, arch: process.arch }, systems: [], registry: [], status: 'NOT_PASSED' };
const common = { react: '19.1.1', 'react-dom': '19.1.1' };
const dev = { '@types/react': '19.1.16', '@types/react-dom': '19.1.9', typescript: '5.9.3', vite: '7.2.2', playwright: '1.56.1', 'axe-core': '4.10.3' };
const ui5 = Object.fromEntries(['@ui5/webcomponents-react','@ui5/webcomponents','@ui5/webcomponents-base','@ui5/webcomponents-fiori','@ui5/webcomponents-icons'].map(name => [name,'2.26.0']));
const sha = s => createHash('sha256').update(s).digest('hex');
const json = (path, value) => writeFile(path, JSON.stringify(value, null, 2) + '\n');
const env = { PATH: process.env.PATH, HOME: process.env.HOME, CI: 'true', ...(process.env.PLAYWRIGHT_BROWSERS_PATH ? { PLAYWRIGHT_BROWSERS_PATH: process.env.PLAYWRIGHT_BROWSERS_PATH } : {}) };
function command(cwd, cmd, args, limit = 180000) {
  const p = spawnSync(cmd, args, { cwd, encoding: 'utf8', env, timeout: limit, maxBuffer: 12 * 1024 * 1024 });
  const result = { command: [cmd,...args], exit: p.status, error: p.error?.code ?? null, stdout: p.stdout || '', stderr: p.stderr || '' };
  console.log(JSON.stringify({command:result.command,exit:result.exit,error:result.error}));
  return result;
}
function passed(result) {
  if (result.exit !== 0 || result.error) throw new Error(result.command.join(' ') + ' failed: ' + result.stderr.slice(-2500));
  return result;
}
async function metadata(dir, name) {
  const pkgDir = join(dir,'node_modules',name);
  const pkg = JSON.parse(await readFile(join(pkgDir,'package.json'),'utf8'));
  const paths = [];
  async function walk(d, depth=0) {
    if(depth>4) return;
    for(const e of await readdir(d,{withFileTypes:true})) {
      if(e.name==='node_modules') continue;
      const p=join(d,e.name);
      if(e.isDirectory()) await walk(p,depth+1);
      else if (/^(custom-elements\.json|vscode\.html-custom-data\.json|LICENSE(?:\..*)?|README(?:\.md)?)$/i.test(e.name) || /(?:Button|ThemeProvider)[/\\]index\.d\.ts$/.test(p)) {
        const body=await readFile(p); paths.push({path:relative(pkgDir,p),sha256:sha(body),bytes:body.length});
      }
    }
  }
  await walk(pkgDir);
  return {package:name,version:pkg.version,license:pkg.license,buttonExport:pkg.exports?.['./Button']??null,themeProviderExport:pkg.exports?.['./ThemeProvider']??null,files:paths.sort((a,b)=>a.path.localeCompare(b.path))};
}
async function serve(dist) {
  const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.woff2':'font/woff2','.svg':'image/svg+xml'};
  const server=createServer(async(req,res)=>{
    try {
      const url=new URL(req.url,'http://127.0.0.1');
      const path=resolve(dist,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));
      if(!path.startsWith(dist+sep)) {res.writeHead(403).end();return;}
      const data=await readFile(path); res.writeHead(200,{'Content-Type':types[extname(path)]||'application/octet-stream'}).end(data);
    }catch{res.writeHead(404).end();}
  });
  await new Promise((ok,fail)=>{server.once('error',fail);server.listen(0,'127.0.0.1',ok);});
  return {server,url:'http://127.0.0.1:'+server.address().port};
}
// P1 local assets: replay the exact font declarations of the pinned UI5 package.
// The tagged FontFace.ts checks data-ui5-font-face; do not change the agent's task.
async function prepareLocalFonts(dir,row) {
  const base=join(dir,'node_modules','@ui5/webcomponents-base');
  const theme=join(dir,'node_modules','@sap-theming/theming-base-content');
  const pkg=JSON.parse(await readFile(join(theme,'package.json'),'utf8'));
  assert.equal(pkg.version,'11.36.4','Unexpected font dependency version');
  const source=join(base,'dist','generated','css','FontFace.css.js');
  const original=(await import(pathToFileURL(source).href)).default;
  assert.equal(typeof original,'string');
  const prefix='https://cdn.jsdelivr.net/npm/@sap-theming/theming-base-content@'+pkg.version+'/content/Base/baseLib/baseTheme/fonts/';
  const matches=[...original.matchAll(/https:\/\/cdn\.jsdelivr\.net\/npm\/@sap-theming\/theming-base-content@[^/'"\s)]+\/content\/Base\/baseLib\/baseTheme\/fonts\/([A-Za-z0-9_.-]+\.woff2)/g)];
  assert.ok(matches.length>0,'No expected font definitions in shipped CSS');
  const files=[...new Set(matches.map(m=>m[1]))].sort();
  await mkdir(join(dir,'public','vendor-fonts'),{recursive:true});
  const assets=[];
  for(const name of files){
    const bytes=await readFile(join(theme,'content','Base','baseLib','baseTheme','fonts',name));
    await writeFile(join(dir,'public','vendor-fonts',name),bytes);
    assets.push({name,bytes:bytes.length,sha256:sha(bytes)});
  }
  for(const m of matches) assert.ok(m[0].startsWith(prefix),'Unexpected CDN package version');
  const css=original.replaceAll(prefix,'/vendor-fonts/');
  assert.ok(!/https?:\/\//.test(css),'Unexpected network URLs in font CSS');
  const htmlPath=join(dir,'index.html');
  const html=await readFile(htmlPath,'utf8');
  await writeFile(htmlPath,html.replace('</head>','<style data-ui5-font-face>'+css+'</style></head>'));
  row.localFonts={package:pkg.name,version:pkg.version,license:pkg.license,source:'@ui5/webcomponents-base/dist/generated/css/FontFace.css.js',cssSha256:sha(original),rewrittenCssSha256:sha(css),assets};
}
let browserInstalled=false;
async function buildAndCheck(slug, ds) {
  const row={slug,status:'NOT_PASSED',commands:[],checks:[],metadata:[]};
  evidence.systems.push(row);
  const dir=join(work,slug);
  await mkdir(join(dir,'src'),{recursive:true});
  await json(join(dir,'package.json'),{name:'p1-'+slug,private:true,type:'module',scripts:{build:'tsc --noEmit && vite build'},dependencies:{...common,...(ds?ui5:{})},devDependencies:dev});
  await json(join(dir,'tsconfig.json'),{compilerOptions:{target:'ES2022',lib:['ES2022','DOM','DOM.Iterable'],module:'ESNext',moduleResolution:'Bundler',jsx:'react-jsx',strict:true,skipLibCheck:false,noEmit:true},include:['src']});
  await writeFile(join(dir,'index.html'),'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Feasibility probe</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n');
  const source = [
    "import { useState } from 'react';",
    "import { createRoot } from 'react-dom/client';",
    ...(ds?["import { Button } from '@ui5/webcomponents-react/Button';","import { ThemeProvider } from '@ui5/webcomponents-react/ThemeProvider';","import '@ui5/webcomponents-react/dist/Assets.js';"]:[]),
    'function App() { const [n,setN] = useState(0); return <main><h1>Feasibility probe</h1><p aria-live="polite">Count: {n}</p>'+ (ds?'<Button onClick={() => setN(n+1)}>Increment</Button>':'<button type="button" onClick={() => setN(n+1)}>Increment</button>')+'</main>; }',
    'createRoot(document.getElementById("root")!).render('+(ds?'<ThemeProvider><App /></ThemeProvider>':'<App />')+');'
  ].join('\n')+'\n';
  await writeFile(join(dir,'src','main.tsx'),source);
  row.sourceSha256=sha(source);
  const run=(cmd,args,limit)=>{const r=command(dir,cmd,args,limit);row.commands.push(r);return passed(r);};
  try {
    run('npm',['install','--package-lock-only','--ignore-scripts','--no-audit','--no-fund']);
    const lock=await readFile(join(dir,'package-lock.json'));
    row.lockSha256=sha(lock);
    await writeFile(join(out,slug+'.package-lock.json'),lock);
    await writeFile(join(out,slug+'.package.json'),await readFile(join(dir,'package.json')));
    run('npm',['ci','--ignore-scripts','--no-audit','--no-fund']);
    run('npm',['ls','--all','--json']);
    if(ds) {
      row.metadata=await Promise.all(Object.keys(ui5).map(name=>metadata(dir,name)));
      await prepareLocalFonts(dir,row);
      const wrapper=row.metadata.find(m=>m.package==='@ui5/webcomponents-react');
      assert.equal(wrapper.version,ui5[wrapper.package]);
      assert.ok(wrapper.buttonExport && wrapper.themeProviderExport,'Missing shipped component exports');
      assert.ok(row.metadata.some(m=>m.files.some(f=>f.path.endsWith('.d.ts')||f.path.endsWith('custom-elements.json')||f.path.endsWith('html-custom-data.json'))),'No shipped metadata found');
    }
    run('npm',['run','build']);
    if(!browserInstalled) {run('node',['node_modules/playwright/cli.js','install','--with-deps','chromium'],240000);browserInstalled=true;}
    const req=createRequire(join(dir,'package.json'));
    const {chromium}=req('playwright');
    const {server,url}=await serve(join(dir,'dist'));
    let browser;
    try {
      browser=await chromium.launch({headless:true});
      row.browserVersion=browser.version();
      const page=await browser.newPage({viewport:{width:1280,height:800}});
      const pageErrors=[], external=[], failed=[], localFontRequests=[];
      page.on('pageerror',e=>pageErrors.push(e.message));
      page.on('requestfinished',req=>{if(req.resourceType()==='font'&&req.url().startsWith(url+'/vendor-fonts/'))localFontRequests.push(new URL(req.url()).pathname);});
      page.on('requestfailed',r=>failed.push({url:r.url(),error:r.failure()?.errorText}));
      await page.route('**/*',route=>{const u=new URL(route.request().url());if(u.origin===url||u.protocol==='data:'||u.protocol==='blob:')return route.continue();external.push(u.origin);return route.abort();});
      await page.goto(url,{waitUntil:'networkidle',timeout:15000});
      const button=page.getByRole('button',{name:'Increment',exact:true});
      await button.waitFor({state:'visible',timeout:10000});
      if(ds){assert.equal(await page.locator('ui5-button').count(),1);assert.equal(await page.evaluate(()=>!!customElements.get('ui5-button')),true);}
      await button.click();
      await page.getByText('Count: 1',{exact:true}).waitFor();
      row.checks.push('role_and_pointer_activation');
      await page.reload({waitUntil:'networkidle'});
      await button.waitFor({state:'visible'});
      await page.keyboard.press('Tab');
      assert.ok(await button.evaluate(el=>el===document.activeElement||el.matches(':focus-within')||!!el.shadowRoot?.activeElement),'Button not reachable by Tab');
      await page.keyboard.press('Enter');
      await page.getByText('Count: 1',{exact:true}).waitFor();
      row.checks.push('keyboard_activation');
      await page.addScriptTag({path:req.resolve('axe-core/axe.min.js')});
      const axe=await page.evaluate(async()=>{const r=await window.axe.run({runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}});return {violations:r.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.length})),incomplete:r.incomplete.map(v=>v.id),passes:r.passes.map(v=>v.id)};});
      row.axe=axe;
      row.checks.push('axe_executed');
      await page.screenshot({path:join(out,slug+'.png')});
      await page.evaluate(async()=>{await document.fonts.ready;});
      row.localFontRequests=[...new Set(localFontRequests)].sort();
      row.loadedFontFamilies=await page.evaluate(()=>[...document.fonts].filter(f=>f.status==='loaded').map(f=>f.family).sort());
      if(ds){assert.ok(row.localFontRequests.length>0,'No bundled UI5 fonts loaded');assert.ok(row.loadedFontFamilies.some(f=>f.includes('72')),'No loaded SAP 72 font');row.checks.push('local_font_loading');}
      row.pageErrors=pageErrors;row.externalRequests=external;row.failedRequests=failed;
      assert.deepEqual(pageErrors,[]);assert.deepEqual(external,[]);assert.deepEqual(failed,[]);
      assert.ok(!axe.violations.some(v=>v.impact==='critical'||v.impact==='serious'),'Serious/critical axe violations');
      row.status='BUILD_RENDER_PROBE_PASS';
    }finally{if(browser)await browser.close();await new Promise(ok=>server.close(ok));}
  }catch(e){row.error=String(e);console.error(row.error);}
}
try {
  // Candidate infrastructure pins are accepted only after exact registry responses.
  for(const [name,version] of Object.entries({...common,...dev,...ui5})){
    const result=command(work,'npm',['view',name+'@'+version,'version','license','dist.integrity','--json','--fetch-retries=0','--fetch-timeout=15000'],25000);
    const entry={name,requestedVersion:version,exit:result.exit,stderr:result.stderr};
    evidence.registry.push(entry);
    passed(result); entry.response=JSON.parse(result.stdout);
    assert.equal(entry.response.version,version);
    assert.ok(entry.response['dist.integrity']);
  }
  await buildAndCheck('raw-html',false);
  await buildAndCheck('sap-ui5',true);
  evidence.status=evidence.systems.length===2&&evidence.systems.every(s=>s.status==='BUILD_RENDER_PROBE_PASS')?'BUILD_RENDER_PROBES_PASS':'NOT_PASSED';
}catch(e){evidence.error=String(e);console.error(evidence.error);}
finally {
  await json(join(out,'evidence.json'),evidence);
  const summary={...evidence,systems:evidence.systems.map(s=>({...s,commands:s.commands.map(c=>({command:c.command,exit:c.exit,error:c.error,stderr:c.exit===0?'':c.stderr.slice(-2500)}))}))};
  console.log('P1_SUMMARY '+JSON.stringify(summary));
}
process.exitCode=evidence.status==='BUILD_RENDER_PROBES_PASS'?0:1;
