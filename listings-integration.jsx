import React,{useEffect,useMemo,useState}from'react';
import{ExternalLink,LoaderCircle,LockKeyhole,RefreshCw}from'lucide-react';
import{getAudienceContext}from'./audience-context.js';

export const defaultListingsUrl='https://listings.hub.thryv.com/';
export const defaultAdvancedReportingUrl='https://reports.hub.thryv.com/';
const safeHttpsUrl=value=>{try{let parsed=new URL(value);return parsed.protocol==='https:'?parsed.toString():''}catch{return''}};

export function PartnerIntegration({name,provider='Partner platform',url,launchUrl=url,audience='Partners'}){
  const context=getAudienceContext(audience),embedUrl=useMemo(()=>safeHttpsUrl(url),[url]),safeLaunchUrl=useMemo(()=>safeHttpsUrl(launchUrl),[launchUrl]),mode=embedUrl?'embed':safeLaunchUrl?'launch':'unconfigured',[status,setStatus]=useState(embedUrl?'loading':'unconfigured'),[frameKey,setFrameKey]=useState(0),slug=name.toLowerCase().replaceAll(' ','-');
  useEffect(()=>{if(!embedUrl)return;setStatus('loading');let timer=setTimeout(()=>setStatus(current=>current==='loading'?'timeout':current),10000);return()=>clearTimeout(timer)},[embedUrl,frameKey]);
  const retry=()=>{setStatus('loading');setFrameKey(value=>value+1)};
  return <main className={`listingsIntegration partnerIntegration ${slug}Integration`} aria-labelledby={`${slug}IntegrationTitle`}>
    <h1 id={`${slug}IntegrationTitle`} className="srOnly">{name}</h1>
    {embedUrl?<section className="uberallSurface partnerSurface" aria-label={`${name} integration`}>
      <div className="integrationToolbar"><span>{name}</span>{safeLaunchUrl&&<div className="integrationFallback"><small>Having trouble loading?</small><a href={safeLaunchUrl} target="_blank" rel="noreferrer" aria-label={`Open ${name} in a new tab`}>Open {name} in new tab <ExternalLink/></a></div>}</div>
      <div className="integrationFrame">
      {status==='loading'&&<div className="integrationState loading" role="status"><LoaderCircle/><strong>Loading {name}…</strong><span>Connecting to {provider}. Sign-in may be required.</span></div>}
      {(status==='timeout'||status==='restricted')&&<div className="integrationState overlay" role="alert"><LockKeyhole/><strong>{status==='restricted'?`${provider} requires a secure launch`:`${name} did not finish loading`}</strong><span>{status==='restricted'?`${provider} prevents this page from being displayed inside another website. Open it in a new tab to continue.`:'Your session may require authentication, or this environment may not permit embedding.'}</span><div>{status==='timeout'&&<button onClick={retry}><RefreshCw/> Try again</button>}{safeLaunchUrl&&<a href={safeLaunchUrl} target="_blank" rel="noreferrer">Open in new tab <ExternalLink/></a>}</div></div>}
      <iframe key={frameKey} className={status==='ready'?'ready':''} src={embedUrl} title={`${name} platform`} onLoad={()=>setStatus('ready')} allow="clipboard-read; clipboard-write; fullscreen" sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-downloads allow-top-navigation-by-user-activation" referrerPolicy="strict-origin-when-cross-origin"/>
      </div>
    </section>:mode==='launch'?<section className="integrationState secureLaunch" aria-label={`Launch ${provider} ${name}`}><LockKeyhole/><small>EXTERNAL LAUNCH</small><strong>Continue to {provider} {name}</strong><p>{name} opens in {provider} for <b>{context.organizationName}</b>.</p><dl><div><dt>Scope</dt><dd>{context.collectionLabel}</dd></div><div><dt>Sign-in</dt><dd>Your authorized {provider} session may be required.</dd></div><div><dt>Return path</dt><dd>Use this ThryvHub tab to return to your organizational workspace.</dd></div></dl><a href={safeLaunchUrl} target="_blank" rel="noreferrer">Continue to {provider} {name} <ExternalLink/></a><span>No credentials, tenant identifiers, or reusable SSO tokens are included in this page.</span></section>:<section className="integrationState unconfigured" aria-label={`${provider} ${name} integration unavailable`}><LockKeyhole/><small>UNAVAILABLE</small><strong>{name} integration is not configured</strong><p>No approved embed URL or secure launch URL has been configured for this environment.</p><span>Contact an administrator to configure this product connection.</span></section>}
  </main>
}

export function UberallIntegration(props){return <PartnerIntegration provider="Uberall" {...props}/>}

export default function ListingsIntegration({audience}){
  const embedUrl=(import.meta.env.VITE_LISTINGS_EMBED_URL||import.meta.env.VITE_UBERALL_LISTINGS_EMBED_URL||defaultListingsUrl).trim(),launchUrl=(import.meta.env.VITE_LISTINGS_LAUNCH_URL||import.meta.env.VITE_UBERALL_LISTINGS_LAUNCH_URL||defaultListingsUrl).trim();
  return <PartnerIntegration name="Listings" provider="Thryv Listings" audience={audience} url={embedUrl} launchUrl={launchUrl}/>;
}

export function AdvancedReportingIntegration({audience}){
  const embedUrl=(import.meta.env.VITE_REPORTS_EMBED_URL||defaultAdvancedReportingUrl).trim(),launchUrl=(import.meta.env.VITE_REPORTS_LAUNCH_URL||defaultAdvancedReportingUrl).trim();
  return <PartnerIntegration name="Advanced Reporting" provider="Thryv Reports" audience={audience} url={embedUrl} launchUrl={launchUrl}/>;
}
