import React,{useEffect,useMemo,useState}from'react';
import{ExternalLink,LoaderCircle,LockKeyhole,RefreshCw}from'lucide-react';

const defaultUberallUrl='https://uberall.com/en/app/thryv/locations';
const rawEmbedUrl=(import.meta.env.VITE_UBERALL_LISTINGS_URL||defaultUberallUrl).trim();
const rawLaunchUrl=(import.meta.env.VITE_UBERALL_LAUNCH_URL||rawEmbedUrl).trim();
const safeHttpsUrl=value=>{try{let url=new URL(value);return url.protocol==='https:'?url.toString():''}catch{return''}};

export default function ListingsIntegration(){
  const embedUrl=useMemo(()=>safeHttpsUrl(rawEmbedUrl),[]),launchUrl=useMemo(()=>safeHttpsUrl(rawLaunchUrl),[]),knownFrameRestricted=useMemo(()=>{try{return new URL(embedUrl).hostname==='uberall.com'}catch{return false}},[embedUrl]),[status,setStatus]=useState(embedUrl?'loading':'unconfigured'),[frameKey,setFrameKey]=useState(0);
  useEffect(()=>{if(!embedUrl)return;setStatus('loading');let timer=setTimeout(()=>setStatus(current=>current==='loading'?'timeout':current),10000);return()=>clearTimeout(timer)},[embedUrl,frameKey]);
  const retry=()=>{setStatus('loading');setFrameKey(value=>value+1)};
  return <main className="listingsIntegration" aria-labelledby="listingsIntegrationTitle">
    <h1 id="listingsIntegrationTitle" className="srOnly">Listings</h1>
    {embedUrl?<section className="uberallSurface" aria-label="Uberall Listings integration">
      {status==='loading'&&<div className="integrationState loading" role="status"><LoaderCircle/><strong>Loading Listings…</strong><span>Connecting to Uberall. Sign-in may be required.</span></div>}
      {(status==='timeout'||status==='restricted')&&<div className="integrationState overlay" role="alert"><LockKeyhole/><strong>{status==='restricted'?'Uberall requires a secure launch':'Uberall did not finish loading'}</strong><span>{status==='restricted'?'Uberall prevents this page from being displayed inside another website. Open it securely in Uberall to continue.':'Your session may require authentication, or this environment may not permit embedding.'}</span><div>{status==='timeout'&&<button onClick={retry}><RefreshCw/> Try again</button>}{launchUrl&&<a href={launchUrl} target="_blank" rel="noreferrer">Open in Uberall <ExternalLink/></a>}</div></div>}
      <iframe key={frameKey} className={status==='ready'?'ready':''} src={embedUrl} title="Uberall Listings platform" onLoad={()=>setStatus(knownFrameRestricted?'restricted':'ready')} allow="clipboard-read; clipboard-write" sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-downloads" referrerPolicy="strict-origin-when-cross-origin"/>
    </section>:<section className="integrationState unconfigured" aria-label="Uberall Listings integration unavailable"><LockKeyhole/><strong>Listings integration is not configured</strong><p>This Partner Hub environment is ready for Uberall, but no approved embeddable Listings URL has been configured.</p><span>The standard Uberall login currently blocks cross-origin framing. An Uberall-supported embed or SSO launch URL is required.</span>{launchUrl&&<a href={launchUrl} target="_blank" rel="noreferrer">Open in Uberall <ExternalLink/></a>}</section>}
  </main>
}
