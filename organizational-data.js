import{entityRecords}from'./managed-entity-page.jsx';
import{getAudienceContext,getOperationalContext}from'./audience-context.js';

export const organizations={
  Partners:{id:'ORG-PARTNER-001',name:'Thryv Solutions Partner',type:'Partner'},
  Agency:{id:'ORG-AGENCY-001',name:'Northstar Digital Agency',type:'Agency'},
  Franchise:{id:'ORG-FRANCHISE-001',name:'Acme Franchising',type:'Franchise'},
  Enterprise:{id:'ORG-ENTERPRISE-001',name:'Acme Services Group',type:'Enterprise'}
};
export const reportingScope={period:{start:'2026-07-27',end:'2026-08-25',comparisonStart:'2026-06-27',comparisonEnd:'2026-07-26'},timezone:'America/Chicago',currency:'USD',freshness:'Demo data · Updated Aug 25, 2026 at 6:00 AM CT',attribution:'Multi-touch',deduplication:'Person and conversion ID across enabled products'};
export const getEntities=audience=>entityRecords[audience]||entityRecords.Partners;
export const getEntity=(audience,id)=>getEntities(audience).find(item=>item.id===id);
export const entityName=(audience,id)=>getEntity(audience,id)?.name||'Unknown entity';

const performanceByAudience={
  Partners:{kpis:[['Healthy customers',5,'of 8'],['Onboarding complete',6,'75%'],['Average adoption',73,'%'],['Renewals at risk',2,'customers']],metrics:{'Adoption trend':[72,74,73,76,78,79],'Active users':[83,91,96,104,111,119],'Support issues':[14,12,11,9,8,7]},exceptions:['CUS-1005','CUS-1008'],comparison:'Segment'},
  Agency:{kpis:[['Managed spend',323250,'currency'],['Portfolio leads',2322,'leads'],['Average ROAS',3.7,'×'],['Reports current',5,'of 8']],metrics:{'Leads trend':[318,342,355,371,386,401],'Spend trend':[42,45,48,51,54,57],'ROAS trend':[3.2,3.4,3.3,3.6,3.7,3.9]},exceptions:['CLI-2103','CLI-2106'],comparison:'Portfolio'},
  Franchise:{kpis:[['Healthy locations',4,'of 8'],['Marketing adoption',71,'%'],['Brand compliance',89,'%'],['Coaching actions',10,'open']],metrics:{'Performance trend':[70,72,73,75,78,81],'Adoption trend':[62,65,67,68,70,71],'Compliance trend':[85,86,87,88,88,89]},exceptions:['LOC-0003','LOC-0004'],comparison:'Region'},
  Enterprise:{kpis:[['Healthy business units',4,'of 8'],['Average adoption',77,'%'],['Compliance',91,'%'],['Operational issues',22,'open']],metrics:{'Performance trend':[68,70,72,74,75,78],'Adoption trend':[70,71,73,74,76,77],'Compliance trend':[87,88,89,89,90,91]},exceptions:['BU-3105','BU-3108'],comparison:'Division'}
};
export const getPerformance=audience=>performanceByAudience[audience]||performanceByAudience.Partners;

const homeDimensions={
  Partners:{Visibility:82,Reputation:88,Engagement:71,Conversion:76},
  Agency:{Visibility:85,Reputation:87,Engagement:74,Conversion:79},
  Franchise:{Visibility:84,Reputation:91,Engagement:68,Conversion:72},
  Enterprise:{Visibility:80,Reputation:89,Engagement:73,Conversion:78}
};
const healthyStates=new Set(['Healthy','Performing well','Strong','Active','On track','Current']);
export function getHomeOverview(audience){
  const context=getAudienceContext(audience),entities=getEntities(audience),performance=getPerformance(audience),alerts=buildAlerts(audience).filter(item=>item.status!=='archived'),healthKey=audience==='Partners'?'accountHealth':audience==='Agency'?'clientHealth':audience==='Franchise'?'performanceHealth':'performance';
  const improving=entities.filter(item=>healthyStates.has(item[healthKey])).length||Math.max(1,entities.length-alerts.filter(item=>item.severity==='critical').length);
  const dimensions=homeDimensions[audience]||homeDimensions.Partners,score=Math.round(Object.values(dimensions).reduce((sum,value)=>sum+value,0)/4),severityOrder={critical:0,warning:1,activity:2},topPriorities=[...alerts].sort((a,b)=>severityOrder[a.severity]-severityOrder[b.severity]).slice(0,3);
  const leadChange=audience==='Agency'?'9.1%':audience==='Partners'?'7.6%':audience==='Enterprise'?'6.8%':'8.4%',valueChange=audience==='Agency'?'12.6%':audience==='Partners'?'10.2%':audience==='Enterprise'?'14.1%':'18.4%';
  return{context,entities,entityCount:entities.length,improving,score,status:score>=80?'Strong':score>=70?'Steady':'Needs attention',change:4,dimensions,performance,priorities:topPriorities,leadChange,valueChange,interpretation:`${context.organizationName} improved this period, with demand up ${leadChange} and business value up ${valueChange}. Gains are strongest among the best-performing ${context.managedEntityPlural}, while ${topPriorities.length} priority signals need attention. ${Object.entries(dimensions).sort((a,b)=>a[1]-b[1])[0][0]} is the broadest correctable constraint.`};
}

const products=['Growth Platform','Reputation','Listings','Social','Business Center','Keap'];
export function buildAlerts(audience){
  const entities=getEntities(audience),ops=getOperationalContext(audience),context=getAudienceContext(audience);
  return ops.alerts.map((title,index)=>{const entity=entities[index%entities.length],product=products[index%products.length],severity=index<2?'critical':index<5?'warning':'activity';return{id:`ALT-${audience.slice(0,3).toUpperCase()}-${String(index+1).padStart(3,'0')}`,entityId:entity.id,entityType:context.managedEntitySingular,group:entity.segment||entity.portfolio||entity.region||entity.division,product,signal:title,currentValue:index%2?`${62+index}%`:`${index+2} open`,threshold:index%2?'Target 75%':'Maximum 2 open',comparison:index%2?'Down 8%':'Up 2',severity,triggeredAt:`2026-08-${String(25-index).padStart(2,'0')}T${String(9+index).padStart(2,'0')}:00:00-05:00`,owner:entity.accountOwner||entity.accountManager||entity.operator||entity.manager,status:index===6?'archived':index===5?'monitoring':'open',source:index%2?'Performance':'Product monitoring',recommendedAction:ops.alertActions[index%ops.alertActions.length],destination:product==='Listings'?'listings':product==='Reputation'?'reputation':product==='Growth Platform'?'advanced-reporting':'tasks',workflowTemplate:`${title.toLowerCase().replaceAll(/[^a-z0-9]+/g,'-')}-plan`}});
}

export function initialWorkflows(audience){const alerts=buildAlerts(audience).filter(item=>item.status!=='archived').slice(0,4),context=getAudienceContext(audience);return alerts.map((alert,index)=>({id:`WF-${audience.slice(0,3).toUpperCase()}-${index+1}`,title:alert.recommendedAction,alertId:alert.id,entityId:alert.entityId,owner:alert.owner,dueDate:`2026-09-${String(3+index*3).padStart(2,'0')}`,status:index?'In progress':'Ready',group:alert.group,source:alert.source,successMeasure:`Restore ${alert.signal.toLowerCase()} to the configured ${context.organizationType.toLowerCase()} target.`,notes:'Evidence and changes remain in temporary prototype storage.',steps:[{id:'scope',label:'Confirm scope and evidence',done:true},{id:'owner',label:'Confirm owner and due date',done:index>1},{id:'act',label:'Complete recommended action',done:false},{id:'verify',label:'Verify success measure',done:false}]}))}

export const knowledgeBase=[
  {id:'KB-001',audiences:['Partners'],title:'Guide customer onboarding and adoption',product:'Platform',summary:'Provision customers, invite users, and monitor adoption milestones.'},
  {id:'KB-002',audiences:['Agency'],title:'Prepare a client performance report',product:'Reporting',summary:'Configure client scope, campaign evidence, and delivery status.'},
  {id:'KB-003',audiences:['Franchise'],title:'Coach locations with reputation risk',product:'Reputation',summary:'Use response plays and regional coaching for overdue reviews.'},
  {id:'KB-004',audiences:['Enterprise'],title:'Review business-unit access and compliance',product:'Administration',summary:'Audit permissions, policy controls, and operational exceptions.'},
  {id:'KB-005',audiences:['Partners','Agency','Franchise','Enterprise'],title:'Resolve a Listings connection issue',product:'Listings',summary:'Diagnose publisher connections and launch the secure Uberall workflow.'},
  {id:'KB-006',audiences:['Partners','Agency','Franchise','Enterprise'],title:'Understand reporting freshness and attribution',product:'Reporting',summary:'Review source timing, attribution models, deduplication, and completeness.'}
];
