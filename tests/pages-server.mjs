import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const root=normalize(join(process.cwd(),'dist'));
const types={'.css':'text/css','.html':'text/html','.js':'text/javascript','.json':'application/json','.png':'image/png','.svg':'image/svg+xml'};

createServer((request,response)=>{
  const pathname=decodeURIComponent(new URL(request.url,'http://127.0.0.1').pathname);
  const relative=pathname.replace(/^\/thryvhub\/?/,'');
  const candidate=normalize(join(root,relative||'index.html'));
  const isAsset=candidate.startsWith(root)&&existsSync(candidate)&&statSync(candidate).isFile();
  const file=isAsset?candidate:join(root,'404.html');
  response.statusCode=isAsset?200:404;
  response.setHeader('Content-Type',types[extname(file)]||'application/octet-stream');
  response.end(readFileSync(file));
}).listen(4173,'127.0.0.1');
