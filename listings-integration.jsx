import React,{useEffect,useMemo,useState}from'react';
import{ExternalLink,LoaderCircle,LockKeyhole,RefreshCw}from'lucide-react';

const defaultListingsUrl='https://uberall.com/en/app/thryv/locations';
const safeHttpsUrl=value=>{try{let parsed=new URL(value);return parsed.protocol==='https:'?parsed.toString():''}catch{return''}};

export function UberallIntegration({name,url,launchUrl=url}){
  const embedUrl=useMemo(()=>safeHttpsUrl(url),[url]),safeLaunchUrl=useMemo(()=>safeHttpsUrl(launchUrl),[launchUrl]),knownFrameRestricted=useMemo(()=>{try{return new URL(embedUrl).hostname==='uberall.com'}catch{return false}},[embedUrl]),[status,setStatus]=useState(embedUrl?'loading':'unconfigured'),[frameKey,setFrameKey]=useState(0),slug=name.toLowerCase().replaceAll(' ','-');
  useEffect(()=>{if(!embedUrl)return;setStatus('loading');let timer=setTimeout(()=>setStatus(current=>current==='loading'?'timeout':current),10000);return()=>clearTimeout(timer)},[embedUrl,frameKey]);
  const retry=()=>{setStatus('loading');setFrameKey(value=>value+1)};
  return <main className={`listingsIntegration uberallIntegration ${slug}Integration`} aria-labelledby={`${slug}IntegrationTitle`}>
    <h1 id={`${slug}IntegrationTitle`} className="srOnly">{name}</h1>
    {embedUrl?<section className="uberallSurface" aria-label={`Uberall ${name} integration`}>
      {status==='loading'&&<div className="integrationState loading" role="status"><LoaderCircle/><strong>Loading {name}…</strong><span>Connecting to Uberall. Sign-in may be required.</span></div>}
      {(status==='timeout'||status==='restricted')&&<div className="integrationState overlay" role="alert"><LockKeyhole/><strong>{status==='restricted'?'Uberall requires a secure launch':'Uberall did not finish loading'}</strong><span>{status==='restricted'?'Uberall prevents this page from being displayed inside another website. Open it securely in Uberall to continue.':'Your session may require authentication, or this environment may not permit embedding.'}</span><div>{status==='timeout'&&<button onClick={retry}><RefreshCw/> Try again</button>}{safeLaunchUrl&&<a href={safeLaunchUrl} target="_blank" rel="noreferrer">Open in Uberall <ExternalLink/></a>}</div></div>}
      <iframe key={frameKey} className={status==='ready'?'ready':''} src={embedUrl} title={`Uberall ${name} platform`} onLoad={()=>setStatus(knownFrameRestricted?'restricted':'ready')} allow="clipboard-read; clipboard-write" sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-downloads" referrerPolicy="strict-origin-when-cross-origin"/>
    </section>:<section className="integrationState unconfigured" aria-label={`Uberall ${name} integration unavailable`}><LockKeyhole/><strong>{name} integration is not configured</strong><p>This Partner Hub environment is ready for Uberall, but no approved embeddable URL has been configured.</p><span>The standard Uberall login currently blocks cross-origin framing. An Uberall-supported embed or SSO launch URL is required.</span>{safeLaunchUrl&&<a href={safeLaunchUrl} target="_blank" rel="noreferrer">Open in Uberall <ExternalLink/></a>}</section>}
  </main>
}

export default function ListingsIntegration(){
  const embedUrl=(import.meta.env.VITE_UBERALL_LISTINGS_URL||defaultListingsUrl).trim(),launchUrl=(import.meta.env.VITE_UBERALL_LAUNCH_URL||embedUrl).trim();
  return <UberallIntegration name="Listings" url={embedUrl} launchUrl={launchUrl}/>;
}
