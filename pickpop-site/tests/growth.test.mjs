import test from 'node:test';
import assert from 'node:assert/strict';
import { metricDetail, searchTopic, track, subscribeApprovedAnalytics } from '../assets/js/metrics.js';
import { createGA4Adapter } from '../assets/js/analytics-adapter.js';
globalThis.window = new EventTarget();
globalThis.CustomEvent ??= class extends Event { constructor(name, options) { super(name); this.detail=options.detail; } };
test('search topics are finite buckets and do not preserve raw queries', () => {
 assert.equal(searchTopic('coffee maker'), 'coffee'); assert.equal(searchTopic('OXO brush'), 'kitchen');
 assert.equal(searchTopic('personal@example.com'), 'other'); assert.equal(searchTopic(''), 'browse');
 assert.deepEqual(metricDetail('search', {query:'personal@example.com',queryTopic:'coffee',country:'US',queryLength:12}), {name:'search',values:{queryTopic:'coffee',queryLength:12}});
 assert.equal(metricDetail('unknown-event', {}), null);
 assert.deepEqual(metricDetail('search',{count:Infinity,id:'<script>',slug:'https://example.com',queryLength:-5}),{name:'search',values:{}});
});
test('external adapter requires both approvals, receives no pre-consent queue, and can unsubscribe', () => {
 let calls=[]; const adapter={send:event=>calls.push(event)};
 for(const options of [{},{ownerApproved:true},{visitorConsent:true}]) {
  const stop=subscribeApprovedAnalytics(adapter,options); track('retailer_click',{id:'chemex-six-cup'}); stop();
 }
 assert.equal(calls.length,0);
 const stop=subscribeApprovedAnalytics(adapter,{ownerApproved:true,visitorConsent:true});
 track('retailer_click',{id:'chemex-six-cup',sponsored:true,query:'private text'}); assert.equal(calls.length,1);
 assert.deepEqual(calls[0].values,{id:'chemex-six-cup',sponsored:true});
 stop();track('retailer_click',{});assert.equal(calls.length,1);
});
test('adapter failures do not interrupt shopping; invalid GA4 IDs fail closed', async () => {
 const stop=subscribeApprovedAnalytics({send(){throw Error('fixture');}},{ownerApproved:true,visitorConsent:true});
 assert.doesNotThrow(()=>track('search',{}));stop();
 assert.throws(()=>createGA4Adapter(()=>{},'not-a-measurement'));
 let mapped; createGA4Adapter((...args)=>{mapped=args;},'G-TEST123').send({name:'search',values:{queryTopic:'coffee'}});
 assert.deepEqual(mapped,['event','search',{queryTopic:'coffee',send_to:'G-TEST123'}]);
});
