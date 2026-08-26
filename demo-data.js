export const demoTenant={
  organization:{name:'Acme Franchising',tenantId:'TEN-ACME-001',currency:'USD',timezone:'America/Los_Angeles',timezoneLabel:'Pacific Time (UTC−07:00)'},
  reporting:{start:'2026-07-27',end:'2026-08-25',comparisonStart:'2026-06-27',comparisonEnd:'2026-07-26',label:'Jul 27–Aug 25, 2026',comparisonLabel:'Jun 27–Jul 26, 2026',freshnessAt:'2026-08-25T06:00:00-07:00',freshnessLabel:'Demo data · Updated Aug 25, 2026 at 6:00 AM PT'},
  locations:[
    ['LOC-0001','Baldwin Park','4888 E. Garvey Ave','Baldwin Park, CA','West','Active','Maria Gonzalez','2018-03-12'],
    ['LOC-0002','Hollywood','7009 Sunset Blvd','Los Angeles, CA','West','Active','Carlos Rivera','2019-06-14'],
    ['LOC-0003','West Hollywood','8560 Santa Monica Blvd','West Hollywood, CA','West','Active','Jessica Torres','2020-03-08'],
    ['LOC-0004','Westwood','922 Gayley Ave','Los Angeles, CA','West','Active','David Morales','2020-11-15'],
    ['LOC-0005','Santa Monica','1315 3rd Street Promenade','Santa Monica, CA','West','Active','Sophia Reyes','2021-07-20'],
    ['LOC-0006','Mission Valley','1640 Camino del Rio N','San Diego, CA','West','Active','Marcus Lee','2019-04-12'],
    ['LOC-0007','Gaslamp Quarter','789 W Harbor Dr','San Diego, CA','West','Active','Angela Vega','2021-09-30'],
    ['LOC-0008','Pasadena','245 S Lake Ave','Pasadena, CA','West','Active','Kevin Park','2022-05-17'],
    ['LOC-0009','Fisherman’s Wharf','333 Jefferson St','San Francisco, CA','West','Temporarily closed','Priya Sharma','2018-11-01'],
    ['LOC-0010','Marina District','2147 Chestnut St','San Francisco, CA','West','Active','Luis Castro','2022-04-28'],
    ['LOC-0011','Dallas Uptown','2500 McKinney Ave','Dallas, TX','Southwest','Active','Nina Patel','2020-02-10'],
    ['LOC-0012','Austin South Congress','1603 S Congress Ave','Austin, TX','Southwest','Active','Andre Lewis','2021-05-22'],
    ['LOC-0013','Houston Midtown','3201 Louisiana St','Houston, TX','Southwest','Active','Camila Ortiz','2019-08-05'],
    ['LOC-0014','San Antonio Alamo Heights','5150 Broadway','San Antonio, TX','Southwest','Active','Evan Brooks','2022-01-18'],
    ['LOC-0015','Phoenix Scottsdale','7014 E Camelback Rd','Scottsdale, AZ','Southwest','Active','Maya Chen','2020-10-09'],
    ['LOC-0016','Denver Cherry Creek','3000 E 1st Ave','Denver, CO','Mountain','Active','Owen Wright','2021-03-16'],
    ['LOC-0017','Chicago Loop','55 E Monroe St','Chicago, IL','Central','Active','Ava Johnson','2018-07-24'],
    ['LOC-0018','Minneapolis North Loop','212 N 3rd Ave','Minneapolis, MN','Central','Active','Noah Davis','2020-12-02'],
    ['LOC-0019','Nashville Midtown','1808 West End Ave','Nashville, TN','Central','Active','Emma Wilson','2022-06-13'],
    ['LOC-0020','Atlanta Buckhead','3393 Peachtree Rd NE','Atlanta, GA','East','Active','Liam Brown','2019-09-27'],
    ['LOC-0021','Charlotte Uptown','201 S Tryon St','Charlotte, NC','East','Active','Olivia Martin','2021-01-11'],
    ['LOC-0022','Miami Brickell','701 Brickell Ave','Miami, FL','East','Active','Mateo Garcia','2020-04-19'],
    ['LOC-0023','Washington Dupont','1500 Connecticut Ave NW','Washington, DC','East','Inactive','Isabella Moore','2018-10-30'],
    ['LOC-0024','Philadelphia Center City','1700 Market St','Philadelphia, PA','East','Active','Lucas Taylor','2019-12-06'],
    ['LOC-0025','Boston Back Bay','800 Boylston St','Boston, MA','East','Temporarily closed','Mia Anderson','2021-08-14']
  ],
  subsets:{listingsConnected:9,locationTablePreview:10,productLocationPreview:5,performancePreview:6,reviewSamples:6},
  totals:{locations:25,activeLocations:22,inactiveLocations:1,temporarilyClosedLocations:2,listingsConnected:9,reviews:236,reviewResponses:215,reviewRating:4.3,revenue:284770,paymentsCollected:241680,outstandingInvoices:43090,appointments:1284,newCustomers:386},
  leads:{total:4820,coreGrowthPlatform:2300,leadsBoost:900,socialAds:620,seo:1000,previousTotal:4446,rule:'De-duplicated by lead ID and assigned to one primary acquisition source. Product source values are mutually exclusive and sum to Total leads.'},
  productAdoption:{'Thryv Growth Platform':22,'Business Center':22,'Keap':24,'SEO':18,'Social Ads':20,'Leads':17,'Listings':9},
  statusVocabulary:['Active','Inactive','Temporarily closed','Performing well','Stable','Needs attention'],
  businessIdentifiers:{locationPrefix:'LOC-',invoicePrefix:'INV-',campaignPrefix:'CMP-'}
};

export const canonicalLocationNames=demoTenant.locations.map(([,name])=>name);
export const listingLocations=demoTenant.locations.slice(0,demoTenant.subsets.listingsConnected);
export const locationPreview=demoTenant.locations.slice(0,demoTenant.subsets.locationTablePreview);

export const demoReviews=[
  ['BJ','Bella Johnson','Aug 5, 2026','Hollywood','Service was slower than expected, but the team was courteous.','★★★☆☆','google'],
  ['VM','Virginia Moore','Aug 8, 2026','Dallas Uptown','The appointment started late and communication could improve.','★★☆☆☆','google'],
  ['ML','Marcus Lee','Aug 11, 2026','Baldwin Park','Friendly staff and an excellent experience from start to finish.','★★★★★','google'],
  ['ST','Sophie Turner','Aug 14, 2026','Santa Monica','Great experience overall. I would gladly return.','★★★★★','yelp'],
  ['DC','Derek Cheng','Aug 18, 2026','Westwood','My order needed correction, but the manager resolved it quickly.','★★★☆☆','google'],
  ['AO','Amara Osei','Aug 22, 2026','Mission Valley','Consistently helpful team and fast service.','★★★★★','yelp']
];

export const demoTransactions=[
  ['INV-4821','Hollywood','Aug 23, 2026','Premium service','$1,280','Credit card','Paid'],
  ['INV-4818','Baldwin Park','Aug 21, 2026','Consultation','$640','ACH','Paid'],
  ['INV-4804','Dallas Uptown','Aug 18, 2026','Service package','$2,100','Invoice','31–60 days'],
  ['INV-4796','Mission Valley','Aug 14, 2026','Membership','$890','Digital wallet','Paid']
];

export const networkPerformanceRows=[
  ['Hollywood','West','312','$18,420','4.0','−31%','Below by 24%','Needs attention'],
  ['Baldwin Park','West','648','$48,210','4.2','+11%','Above by 8%','Performing well'],
  ['Dallas Uptown','Southwest','521','$38,770','3.5','−8%','Below by 6%','Needs attention'],
  ['Mission Valley','West','604','$44,190','4.5','+6%','Above by 4%','Performing well'],
  ['Westwood','West','487','$35,600','4.3','+1%','Near average','Stable'],
  ['Santa Monica','West','711','$53,900','4.6','+14%','Above by 12%','Performing well']
];

export const leadChannelRows=[
  ['Paid search',1420,'−4%',102500,'Spend decreased 4%'],
  ['Organic search',1000,'+10%',54700,'Visibility improved'],
  ['Social Ads',620,'+12%',42800,'Efficiency improving'],
  ['Email',980,'+8%',49770,'Stable contribution'],
  ['Referral',800,'+5%',35000,'Partner traffic increased']
];

export const leadSourceRows=[
  ['Google Ads','Brand Search',1420,'38%','18 min',486,'$17.33','$102,500','4.19×'],
  ['Organic search','Local pages',1000,'44%','22 min',382,'—','$54,700','—'],
  ['Social Ads','Prospecting',620,'31%','29 min',184,'$40.00','$42,800','1.73×'],
  ['Referral','Partner program',800,'52%','14 min',196,'$12.60','$35,000','5.98×'],
  ['Email','Nurture sequence',980,'47%','11 min',312,'$8.20','$49,770','7.32×']
];

export function formatCurrency(value){return new Intl.NumberFormat('en-US',{style:'currency',currency:demoTenant.organization.currency,maximumFractionDigits:0}).format(value)}
export function formatDate(value){return new Intl.DateTimeFormat('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:demoTenant.organization.timezone}).format(new Date(`${value}T12:00:00Z`))}
export function reviewResponseRate(){return `${(demoTenant.totals.reviewResponses/demoTenant.totals.reviews*100).toFixed(1)}%`}
export function validateDemoData(){
  const ids=demoTenant.locations.map(([id])=>id),names=canonicalLocationNames;
  const leadParts=demoTenant.leads.coreGrowthPlatform+demoTenant.leads.leadsBoost+demoTenant.leads.socialAds+demoTenant.leads.seo;
  return {uniqueIds:new Set(ids).size===ids.length,uniqueNames:new Set(names).size===names.length,locationCount:names.length===demoTenant.totals.locations,statusCounts:demoTenant.totals.activeLocations+demoTenant.totals.inactiveLocations+demoTenant.totals.temporarilyClosedLocations===demoTenant.totals.locations,leadTotal:leadParts===demoTenant.leads.total,knownReviews:demoReviews.every(review=>names.includes(review[3])),knownPerformanceRows:networkPerformanceRows.every(row=>names.includes(row[0]))};
}
