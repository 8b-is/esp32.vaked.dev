import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const renderCode=html.slice(html.indexOf('  function escapeHtml('),html.indexOf('\n  renderSpectrumAndTable();'));
test('radio-provided text cannot become HTML in the beacon table',()=>{
 const attack='<img src=x onerror=alert(1)>';
 const apTbody={innerHTML:''};
 const context={beacons:new Map([['synthetic',{node:attack,bssid:attack,ssid:attack,auth:attack,band:attack,ch:1,rssi:-50}]]),apTbody,apTotalBadge:{},chBars:{appendChild(){}},document:{createElement(){return {};}}};
 runInNewContext(renderCode+'\nrenderSpectrumAndTable();',context);
 assert.ok(!apTbody.innerHTML.includes('<img'));
 assert.equal((apTbody.innerHTML.match(/&lt;img/g)||[]).length,5);
});
