const fs=require('node:fs');
const assert=require('node:assert/strict');
const titles=new Set();
for(const file of fs.readdirSync('dist').filter(f=>f.endsWith('.html'))){
 const html=fs.readFileSync('dist/'+file,'utf8');
 for(const [,url]of html.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(!/^(https?:|mailto:|tel:|sms:|#)/.test(url))assert.ok(fs.existsSync('dist/'+url.replace(/^\//,'')),file+': '+url);
 }
 const title=html.match(/<title>(.*?)<\/title>/)[1];assert.ok(!titles.has(title));titles.add(title);
 const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
 assert.ok(schema['@graph'].some(x=>x['@type']==='RealEstateAgent'));
 assert.ok(!schema['@graph'].some(x=>x.aggregateRating));
 assert.ok(html.includes('<main id="main-content">'));
 assert.ok(!html.includes('<div id="app"></div>'));
 if(file==='testimonials.html')assert.ok(html.includes('Rawan Nasir'));
 console.log(file+': links, assets, static content and structured data passed');
}
assert.equal((fs.readFileSync('dist/sitemap.xml','utf8').match(/<loc>/g)||[]).length,7);
