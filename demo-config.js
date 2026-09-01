import{audienceKeys,getAudienceContext}from'./audience-context.js';

export const packages=['Base','Analytics +','Manage +','All'];
export const products=['Keap','Thryv Growth Platform','SEO','Social Ads','Leads','Business Center'];
export const defaultDemoConfig={audience:'Partners',package:'All',products:[...products],organizationId:'ORG-PARTNER-001',role:'Partner Manager'};
const organizationIds={Partners:'ORG-PARTNER-001',Agency:'ORG-AGENCY-001',Franchise:'ORG-FRANCHISE-001',Enterprise:'ORG-ENTERPRISE-001'};

export function validateDemoConfig(value={}){
  const audience=audienceKeys.includes(value.audience)?value.audience:defaultDemoConfig.audience;
  const pkg=packages.includes(value.package)?value.package:defaultDemoConfig.package;
  let enabled=Array.isArray(value.products)?value.products.filter(item=>products.includes(item)):[...products];
  if(enabled.some(item=>['SEO','Social Ads','Leads'].includes(item))&&!enabled.includes('Thryv Growth Platform'))enabled=['Thryv Growth Platform',...enabled];
  return{audience,package:pkg,products:[...new Set(enabled)],organizationId:organizationIds[audience],role:value.role||getAudienceContext(audience).profileRole};
}
export function loadDemoConfig(){try{return validateDemoConfig(JSON.parse(localStorage.getItem('thryvhub-demo-config'))||{audience:localStorage.getItem('thryvhub-demo-audience')})}catch{return validateDemoConfig()}}
export function saveDemoConfig(config){const valid=validateDemoConfig(config);localStorage.setItem('thryvhub-demo-config',JSON.stringify(valid));localStorage.setItem('thryvhub-demo-audience',valid.audience);return valid}

export function routeEntitlement(route,config){
  const manage=['Manage +','All'].includes(config.package),analytics=['Analytics +','All'].includes(config.package);
  if(['listings','reputation','social'].includes(route)&&!manage)return{allowed:false,reason:'Brand Presence is included with Manage + or All.'};
  if(route==='advanced-reporting'&&!analytics)return{allowed:false,reason:'Advanced Reporting is included with Analytics + or All.'};
  return{allowed:true};
}
