export const INDUSTRIES = [
  { name: 'Beverages', icon: '🥤', description: 'Bottling, fermentation, filtration equipment', count: 28 },
  { name: 'Brewery', icon: '🍺', description: 'Brewing kettles, fermenters, cooling systems', count: 19 },
  { name: 'Dairy', icon: '🐄', description: 'Pasteurizers, separators, filling machinery', count: 22 },
  { name: 'Steel', icon: '⚙️', description: 'Rolling mills, furnace parts, cranes', count: 47 },
  { name: 'Hydro / Power', icon: '⚡', description: 'Turbines, generators, gate actuators', count: 35 },
  { name: 'Plywood', icon: '🪵', description: 'Veneer presses, sorters, stackers', count: 16 },
  { name: 'Hospitality', icon: '🏨', description: 'Kitchen equipment, HVAC, laundry machinery', count: 12 },
  { name: 'Construction', icon: '🏗️', description: 'Concrete mixers, excavators, cranes', count: 41 },
  { name: 'Agro-Processing', icon: '🌾', description: 'Threshers, mills, seed cleaners', count: 24 },
  { name: 'Printing & Packaging', icon: '📦', description: 'Printing presses, die-cutters, sealers', count: 18 },
  { name: 'Chemicals & Pharma', icon: '💊', description: 'Reactors, filters, precision sensors', count: 31 },
  { name: 'Logistics', icon: '📦', description: 'Conveyor systems, sorting machines, forklifts', count: 29 },
];

export const TESTIMONIALS = [
  {
    quote: 'WareXhub saved our production line. We got a matched SKF bearing within 24 hours without revealing which plant needed it. Pure magic.',
    company: 'Verified Member',
    role: 'Maintenance Manager',
    initials: 'WX',
  },
  {
    quote: 'As a seller, I get real inquiries without worrying about competitors knowing my inventory. The platform is built for serious industrial folks.',
    company: 'Verified Member',
    role: 'Business Director',
    initials: 'WX',
  },
  {
    quote: 'The admin review process gives us confidence that every part listed is genuine. This is what Nepal\'s industry needed.',
    company: 'Verified Member',
    role: 'Procurement Head',
    initials: 'WX',
  },
];

export const MEMBERSHIP_PLANS = [
  {
    name: 'Free',
    monthly: 0,
    quarterly: 0,
    yearly: 0,
    description: 'Basic access for new members',
    features: [
      { text: 'Up to 5 active listings', included: true },
      { text: 'Buyer search access', included: true },
      { text: 'Unlimited quote requests', included: true },
      { text: 'Self-service help', included: true },
      { text: 'Bulk upload', included: false },
      { text: 'Priority matching', included: false },
      { text: 'Analytics dashboard', included: false },
    ],
    badge: 'Starter',
  },
  {
    name: 'Standard',
    monthly: 4999,
    quarterly: 13499,
    yearly: 47990,
    description: 'For growing businesses',
    features: [
      { text: 'Up to 50 active listings', included: true },
      { text: 'Buyer search access', included: true },
      { text: 'Unlimited quote requests', included: true },
      { text: 'Email support', included: true },
      { text: 'Bulk upload', included: true },
      { text: 'Priority matching', included: false },
      { text: 'Analytics dashboard', included: false },
      { text: 'Dedicated account manager', included: false },
    ],
    badge: null,
  },
  {
    name: 'Professional',
    monthly: 12499,
    quarterly: 33749,
    yearly: 119990,
    description: 'Best for active traders and SMEs',
    features: [
      { text: 'Up to 200 active listings', included: true },
      { text: 'Buyer search access', included: true },
      { text: 'Unlimited quote requests', included: true },
      { text: 'Priority support', included: true },
      { text: 'Bulk upload (CSV)', included: true },
      { text: 'Priority matching', included: true },
      { text: 'Basic analytics', included: true },
      { text: 'Dedicated account manager', included: false },
    ],
    badge: 'Most Popular',
  },
  {
    name: 'Enterprise',
    monthly: null,
    quarterly: null,
    yearly: null,
    custom: true,
    description: 'For large companies & trade groups',
    features: [
      { text: 'Unlimited active listings', included: true },
      { text: 'Buyer search access', included: true },
      { text: 'Unlimited quote requests', included: true },
      { text: '24/7 priority support', included: true },
      { text: 'Bulk upload (CSV)', included: true },
      { text: 'Priority matching', included: true },
      { text: 'Full analytics dashboard', included: true },
      { text: 'Dedicated account manager', included: true },
    ],
    badge: 'Contact Sales',
  },
];

export const CATEGORIES = [
  'Pumps', 'Heat Exchangers', 'Air Compressors', 'Air Dryers', 'Boilers',
  'Instrumentation', 'VFD', 'Switch Gears', 'Valves', 'Steam Fittings',
  'Water Fittings', 'Hydraulic Fittings', 'Water Treatment Plant', 'Bearings',
  'PLC Modules', 'Electric Motors', 'Gearboxes', 'Hydraulic Kits',
  'Industrial Sensors', 'Spares', 'Chemicals', 'Lubricants', 'Fans', 'Filter Bags',
];

export const APPLICATION_TYPES = [
  'Steam', 'Water', 'Oil', 'Compressed Air', 'Hydraulic', 'Pneumatic',
  'Thermic Fluid', 'Level Measurement', 'Flow Measurement', 'Pressure Measurement',
  'Temperature Measurement', 'Pollution Control', 'Control Valves', 'Gauges',
];

export const CONDITIONS = [
  'Brand New/Unused',
  'Excellent',
  'Good',
  'Fair',
  'Poor',
  'For Parts Only'
];

export const ETA_OPTIONS = ['Same Day', '24 Hours', '48 Hours', '3–5 Days'];

export const REASON_CODES = [
  { code: 'CR-01', label: 'OEM Number Missing or Incorrect' },
  { code: 'CR-02', label: 'Image Quality Insufficient' },
  { code: 'CR-03', label: 'Description Too Vague' },
  { code: 'CR-04', label: 'Price Out of Market Range' },
  { code: 'CR-05', label: 'Condition Mismatch' },
  { code: 'CR-06', label: 'Duplicate Listing Detected' },
  { code: 'CR-07', label: 'Category Mismatch' },
  { code: 'CR-08', label: 'Incomplete Mandatory Fields' },
];

export const REVENUE_DATA = [
  { month: 'Aug', revenue: 980000, commission: 98000, membership: 155000, deals: 28 },
  { month: 'Sep', revenue: 1240000, commission: 124000, membership: 178000, deals: 34 },
  { month: 'Oct', revenue: 1480000, commission: 148000, membership: 210000, deals: 41 },
  { month: 'Nov', revenue: 1840000, commission: 184000, membership: 248000, deals: 53 },
  { month: 'Dec', revenue: 2250000, commission: 225000, membership: 290000, deals: 67 },
  { month: 'Jan', revenue: 2680000, commission: 268000, membership: 320000, deals: 82 },
];

export const CATEGORY_COMMISSION = [
  { category: 'Pumps', commission: 71000 },
  { category: 'Heat Exchangers', commission: 95000 },
  { category: 'Air Compressors', commission: 112000 },
  { category: 'PLC & Drives', commission: 87000 },
  { category: 'Electric Motors', commission: 56000 },
  { category: 'Instrumentation', commission: 64000 },
  { category: 'Valves', commission: 43000 },
  { category: 'Bearings', commission: 38000 },
  { category: 'VFD', commission: 79000 },
  { category: 'Steam Systems', commission: 52000 },
];

export const BRAND_OPTIONS = Array.from(new Set([
  'Thermax','Alfa Laval','Grundfos','Endress+Hauser','Hitachi',
  'Trident','Cheema','IBL','Alfa Entech','Hitech','Thermodyne',
  'Isotex','Raj','GEA','Kelvion','Tanter','Wilo','Lowara',
  'Sulzer','CNP','CRI','KSB','Kirloskar','Armstrong','Xylem',
  'Unitec','Uniklinger','Zoloto','Sant','Levcon','Tyco',
  'Darling','Museco','Malhotra','Ion Exchange','Forbes Marshall',
  'Atlas Copco','Chicago Pneumatics','Ingersoll Rand','Elgi',
  'Siemens','Baumer','Rosemount/Emerson','Honeywell','Krone',
  'ABB','Flowserve','Allen Bradley','Danfoss','Delta',
  'SKF','FAG','Parker','Schneider','Bosch Rexroth','WEG',
  'Caterpillar','SEW-Eurodrive','Omron','SICK','Pepperl+Fuchs',
  'Eaton Vickers','Rexnord',
])).sort();
