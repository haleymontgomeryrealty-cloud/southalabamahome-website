const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const base=(process.env.SITE_URL||'https://southalabamahome.com').replace(/\/$/,'');
const faqs=JSON.parse(fs.readFileSync('seo-faqs.json','utf8'));
const pages={
 register:['Your Home Search Registration | Haley Montgomery','Tell Haley your budget, preferred areas, home features and timing so Montgomery & Co. can help with your South Alabama home search.','Your Home Search'],
 stewart:['Stewart | Montgomery & Co. Assistant Workspace','Stewart assistant setup and communication workflow for Haley Montgomery and Montgomery & Co.','Stewart Assistant'],
 index:['South Alabama Real Estate | Haley Montgomery | Montgomery & Co.','Buy or sell a home in South Alabama with broker Haley Montgomery. Explore Fairhope, Daphne, Spanish Fort, Loxley and the Gulf Coast with Montgomery & Co.','South Alabama Real Estate'],
 homes:['Baldwin County Homes for Sale | Montgomery & Co.','Search Baldwin REALTORS® homes for sale and connect with Haley Montgomery for guidance in Fairhope, Daphne, Spanish Fort, Loxley, Foley and the Gulf Coast.','Find a Home'],
 broker:['Haley Montgomery, South Alabama Real Estate Broker | Montgomery & Co.','Meet Haley Montgomery, broker at Montgomery & Co. With 11 years in real estate, Haley helps South Alabama buyers, sellers, investors, veterans and retirees.','Meet the Broker'],
 agents:['Meet the Montgomery & Co. Real Estate Agents | South Alabama','Meet broker Haley Montgomery and the Montgomery & Co. team. Connect with local real estate agents serving South Alabama and the Eastern Shore.','Meet the Agents'],
 about:['About Montgomery & Co. | South Alabama Real Estate','Learn about Montgomery & Co., led by broker Haley Montgomery. Personal real estate guidance for buying and selling across South Alabama.','About Us'],
 testimonials:['Haley Montgomery Reviews & Testimonials | Montgomery & Co.','Read a client review excerpt and visit Haley Montgomery’s Zillow and Facebook profiles for more client stories about real estate in South Alabama.','Client Testimonials']
};
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const organization={ '@type':'RealEstateAgent','@id':base+'/#business',name:'Montgomery & Co., LLC',url:base+'/',logo:base+'/assets/montgomery-co-logo.png',image:base+'/assets/montgomery-co-logo.png',telephone:'+1-251-308-0016',email:'haleymontgomery.realty@gmail.com',areaServed:['Fairhope','Daphne','Spanish Fort','Loxley','Foley','Gulf Shores','Orange Beach'].map(name=>({'@type':'City',name,address:{'@type':'PostalAddress',addressRegion:'AL',addressCountry:'US'}})),sameAs:['https://www.facebook.com/haleymontgomeryrealtor','https://www.zillow.com/profile/haleymontgomeryrealty','https://baldwinrealtors.com/offices/2773643']};
const person={'@type':'Person','@id':base+'/#haley',name:'Haley Montgomery',jobTitle:'Real Estate Broker',worksFor:{'@id':base+'/#business'},url:base+'/broker.html',telephone:'+1-251-308-0016',email:'haleymontgomery.realty@gmail.com'};
for(const [slug,[title,description,name]]of Object.entries(pages)){
 let html='';let review='';
 const app={innerHTML:'',hasChildNodes:()=>false};
 const panel={setAttribute(){},set innerHTML(value){review=value}};
 const doc={getElementById:id=>id==='app'?app:panel,querySelector:()=>({}),querySelectorAll:()=>[]};
 vm.runInNewContext(fs.readFileSync('dist/app.js','utf8'),{location:{pathname:'/'+slug+'.html'},document:doc,fetch:()=>Promise.reject(),URL,Intl,Date});
 html=app.innerHTML;
 if(slug==='testimonials')html=html.replace('<div id="reviews" role="tabpanel" aria-labelledby="tab-zillow"></div>',`<div id="reviews" role="tabpanel" aria-labelledby="tab-zillow">${review}</div>`);
 html=html.replace('<main>','<main id="main-content">');
 const url=slug==='index'?base+'/':base+'/'+slug+'.html';
 const graph=[organization,person,{'@type':'WebSite','@id':base+'/#website',url:base+'/',name:'Montgomery & Co.',publisher:{'@id':base+'/#business'},inLanguage:'en-US'},{'@type':slug==='broker'?'AboutPage':'WebPage','@id':url+'#page',url,name,description,isPartOf:{'@id':base+'/#website'},about:{'@id':slug==='broker'?base+'/#haley':base+'/#business'},inLanguage:'en-US'}, {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:base+'/'},...(slug==='index'?[]:[{'@type':'ListItem',position:2,name,item:url}])]}];
 if(['index','homes'].includes(slug))graph.push({'@type':'FAQPage','@id':url+'#faq',mainEntity:faqs.map(([name,text])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}}))});
 const schema=JSON.stringify({'@context':'https://schema.org','@graph':graph}).replaceAll('<','\\u003c');
 const output=`<!doctype html><html lang="en-US"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="${slug==='stewart'?'noindex,nofollow':'index,follow,max-image-preview:large'}"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:site_name" content="Montgomery &amp; Co."><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${base}/assets/montgomery-co-logo.png"><meta property="og:image:alt" content="Montgomery &amp; Co. Real Estate logo"><meta property="og:locale" content="en_US"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${base}/assets/montgomery-co-logo.png"><link rel="icon" type="image/png" href="/assets/montgomery-co-logo.png"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="/styles.css"><script type="application/ld+json">${schema}</script><script src="/app.js" defer></script><script src="/stewart.js" defer></script></head><body><a class="skip-link" href="#main-content">Skip to content</a><div id="app">${html}</div></body></html>`;
 assert.equal((output.match(/<h1[ >]/g)||[]).length,1,slug+' needs one h1');
 assert.ok(output.includes('tel:+12513080016'));
 assert.ok(output.includes('application/ld+json'));
 JSON.parse(schema);
 fs.writeFileSync(`dist/${slug}.html`,output);
 console.log(slug+': static content, title, canonical, schema verified');
}
const urls=Object.keys(pages).filter(s=>s!=='stewart').map(s=>s==='index'?base+'/':base+'/'+s+'.html');
fs.writeFileSync('dist/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+urls.map(url=>`<url><loc>${url}</loc></url>`).join('')+'</urlset>');
fs.writeFileSync('dist/robots.txt',`User-agent: *\nAllow: /\n\nSitemap: ${base}/sitemap.xml\n`);
console.log('Sitemap and robots.txt generated. Build complete.');

