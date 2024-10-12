const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const { Readable } = require('stream');

// Site haritasına eklemek istediğiniz rotalar
const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/login', changefreq: 'monthly', priority: 0.8 },
  { url: '/reset-password', changefreq: 'monthly', priority: 0.8 },
  { url: '/admin', changefreq: 'monthly', priority: 0.8 },
];

// Sitemap oluşturma
const stream = new SitemapStream({ hostname: 'http://halimasliyuksek.com' });

streamToPromise(Readable.from(links).pipe(stream)).then(data => {
  createWriteStream('./sitemap.xml').write(data);
}).catch(console.error);
