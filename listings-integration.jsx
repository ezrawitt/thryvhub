import React,{useEffect,useMemo,useState}from'react';
import{ExternalLink,LoaderCircle,LockKeyhole,RefreshCw}from'lucide-react';
import{getAudienceContext}from'./audience-context.js';

const defaultListingsUrl='https://uberall.com/en/app/thryv/locations';
const safeHttpsUrl=value=>{try{let parsed=new URL(value);return parsed.protocol==='https:'?parsed.toString():''}catch{return''}};

export function UberallIntegration({name,url,launchUrl=url,audience='Partners'}){
  const context=getAudienceContext(audience),embedUrl=useMemo(()=>safeHttpsUrl(url),[url]),safeLaunchUrl=useMemo(()=>safeHttpsUrl(launchUrl),[launchUrl]),mode=embedUrl?'embed':safeLaunchUrl?'launch':'unconfigured',[status,setStatus]=useState(embedUrl?'loading':'unconfigured'),[frameKey,setFrameKey]=useState(0),slug=name.toLowerCase().replaceAll(' ','-');
  useEffect(()=>{if(!embedUrl)return;setStatus('loading');let timer=setTimeout(()=>setStatus(current=>current==='loading'?'timeout':current),10000);return()=>clearTimeout(timer)},[embedUrl,frameKey]);
  const retry=()=>{setStatus('loading');setFrameKey(value=>value+1)};
  return <main className={`listingsIntegration uberallIntegration ${slug}Integration`} aria-labelledby={`${slug}IntegrationTitle`}>
    <h1 id={`${slug}IntegrationTitle`} className="srOnly">{name}</h1>
    {embedUrl?<section className="uberallSurface" aria-label={`Uberall ${name} integration`}>
      {status==='loading'&&<div className="integrationState loading" role="status"><LoaderCircle/><strong>Loading {name}…</strong><span>Connecting to Uberall. Sign-in may be required.</span></div>}
      {(status==='timeout'||status==='restricted')&&<div className="integrationState overlay" role="alert"><LockKeyhole/><strong>{status==='restricted'?'Uberall requires a secure launch':'Uberall did not finish loading'}</strong><span>{status==='restricted'?'Uberall prevents this page from being displayed inside another website. Open it securely in Uberall to continue.':'Your session may require authentication, or this environment may not permit embedding.'}</span><div>{status==='timeout'&&<button onClick={retry}><RefreshCw/> Try again</button>}{safeLaunchUrl&&<a href={safeLaunchUrl} target="_blank" rel="noreferrer">Open in Uberall <ExternalLink/></a>}</div></div>}
      <iframe key={frameKey} className={status==='ready'?'ready':''} src={embedUrl} title={`Uberall ${name} platform`} onLoad={()=>setStatus('ready')} allow="clipboard-read; clipboard-write" sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-downloads" referrerPolicy="strict-origin-when-cross-origin"/>
    </section>:mode==='launch'?<section className="integrationState secureLaunch" aria-label={`Launch Uberall ${name}`}><LockKeyhole/><small>EXTERNAL LAUNCH</small><strong>Continue to Uberall {name}</strong><p>{name} opens in Uberall for <b>{context.organizationName}</b>.</p><dl><div><dt>Scope</dt><dd>{context.collectionLabel}</dd></div><div><dt>Sign-in</dt><dd>Your authorized Uberall session may be required.</dd></div><div><dt>Return path</dt><dd>Use this ThryvHub tab to return to your organizational workspace.</dd></div></dl><a href={safeLaunchUrl} target="_blank" rel="noreferrer">Continue to Uberall {name} <ExternalLink/></a><span>No credentials, tenant identifiers, or reusable SSO tokens are included in this page.</span></section>:<section className="integrationState unconfigured" aria-label={`Uberall ${name} integration unavailable`}><LockKeyhole/><small>UNAVAILABLE</small><strong>{name} integration is not configured</strong><p>No approved embed URL or secure launch URL has been configured for this environment.</p><span>Contact an administrator to configure this product connection.</span></section>}
  </main>
}

export default function ListingsIntegration({audience}){
  const embedUrl=(import.meta.env.VITE_UBERALL_LISTINGS_EMBED_URL||'').trim(),launchUrl=(import.meta.env.VITE_UBERALL_LISTINGS_LAUNCH_URL||defaultListingsUrl).trim();
  return <UberallIntegration name="Listings" audience={audience} url={embedUrl} launchUrl={launchUrl}/>;
}
