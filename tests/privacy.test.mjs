import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../deploy/worker.js',import.meta.url),'utf8');
const {default:worker}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
globalThis.fetch=async()=>{throw new Error('Unexpected external request')};
const request=(path,options)=>new Request('https://synthetic.invalid'+path,options);
test('observation routes require explicit configuration and authentication',async()=>{
 for(const path of ['/api/wigle.csv','/wigle.csv','/api/upload','/api/v2/file/upload']) {
  assert.equal((await worker.fetch(request(path))).status,503);
  assert.equal((await worker.fetch(request(path),{TELEMETRY_TOKEN:'synthetic-secret'})).status,401);
 }
});
test('authenticated export starts empty and relay requests are rejected',async()=>{
 const env={TELEMETRY_TOKEN:'synthetic-secret'},headers={authorization:'Bearer synthetic-secret'};
 const response=await worker.fetch(request('/api/wigle.csv',{headers}),env);
 assert.equal(response.status,200);
 assert.equal((await response.text()).trim().split(/\r?\n/).length,2);
 assert.equal((await worker.fetch(request('/api/upload?mirror=wigle',{method:'POST',headers,body:'SYNTHETIC'}),env)).status,403);
});
test('oversized authenticated bodies are rejected without changing export',async()=>{
 const env={TELEMETRY_TOKEN:'synthetic-secret'},headers={authorization:'Bearer synthetic-secret'};
 const before=await (await worker.fetch(request('/api/wigle.csv',{headers}),env)).text();
 const response=await worker.fetch(request('/api/upload',{method:'POST',headers,body:'x'.repeat(65537)}),env);
 assert.equal(response.status,413);
 assert.equal(await (await worker.fetch(request('/api/wigle.csv',{headers}),env)).text(),before);
});

test('row capacity is transactional and existing rows can be replaced',async()=>{
 const {default:isolated}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64')+'#row-capacity');
 const env={TELEMETRY_TOKEN:'synthetic-secret'},headers={authorization:'Bearer synthetic-secret'};
 const row=i=>`02:00:00:00:${Math.floor(i/256).toString(16).padStart(2,'0')}:${(i%256).toString(16).padStart(2,'0')},SYNTHETIC`;
 const upload=body=>isolated.fetch(request('/api/upload',{method:'POST',headers,body}),env);
 const snapshot=async()=>await (await isolated.fetch(request('/api/wigle.csv',{headers}),env)).text();
 assert.equal((await upload(Array.from({length:1000},(_,i)=>row(i)).join('\n'))).status,200);
 const full=await snapshot();
 assert.equal(full.trim().split(/\r?\n/).length,1002);
 assert.equal((await upload(row(0)+'-CHANGED\n'+row(1000))).status,413);
 assert.equal(await snapshot(),full);
 assert.equal((await upload(row(0)+'-REPLACED')).status,200);
 assert.match(await snapshot(),/SYNTHETIC-REPLACED/);
 assert.equal((await snapshot()).trim().split(/\r?\n/).length,1002);
});

test('streamed body limit counts bytes across chunks and cancels overflow',async()=>{
 const env={TELEMETRY_TOKEN:'synthetic-secret'},headers={authorization:'Bearer synthetic-secret'};
 let cancelled=false;
 const body=new ReadableStream({start(controller){controller.enqueue(new Uint8Array(32768));controller.enqueue(new Uint8Array(32769));},cancel(){cancelled=true;}});
 const before=await (await worker.fetch(request('/api/wigle.csv',{headers}),env)).text();
 const response=await worker.fetch(request('/api/upload',{method:'POST',headers,body,duplex:'half'}),env);
 assert.equal(response.status,413);
 assert.equal(cancelled,true);
 assert.equal(await (await worker.fetch(request('/api/wigle.csv',{headers}),env)).text(),before);
});

test('public HTML and triad response contain no captured device addresses',async()=>{
 for(const path of ['/', '/api/triad.json']) {
  const response=await worker.fetch(request(path));
  assert.equal(response.status,200);
  assert.doesNotMatch(await response.text(),/\b(?:[0-9a-f]{2}:){5}[0-9a-f]{2}\b/i);
 }
});
