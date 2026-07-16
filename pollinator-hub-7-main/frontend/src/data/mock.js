// Mock data for BEPCoR website

export const BRAND_LOGO = 'https://customer-assets.emergentagent.com/job_pollinator-hub-7/artifacts/dced78qt_Bebcor%20-%20Gradient.png';

export const siteInfo = {
  name: 'BEPCoR',
  fullName: 'Be-Ecoliteracy Pollinator Conservation and Research Foundation',
  tagline: 'Conservation of the Living Planet',
  location: '82/1, Rendal, Kolhapur, Maharashtra, India',
  email: 'contact@bepcor.org',
  phone: '+91 96234 27008',
  regions: ['Maharashtra', 'Karnataka', 'Tamil Nadu'],
  socials: {
    instagram: 'https://www.instagram.com/bepcor/profilecard/?igsh=NXZsM3pnaWM2bzU3',
    linkedin: 'https://www.linkedin.com/company/bepcor-be-ecoliteracy-and-pollinator-conservation-research/',
    facebook: 'https://facebook.com/bepcor',
    youtube: 'https://youtube.com/@bepcor',
  },
};

export const heroSlides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1589526261866-ab0d34f8dc19?crop=entropy&cs=srgb&fm=jpg&q=85',
    eyebrow: 'Every third bite you take is thanks to a pollinator',
    title: 'Protecting Pollinators. Sustaining Life.',
    subtitle: 'From bees and butterflies to sunbirds and bats — BEPCoR works across Maharashtra, Karnataka and Tamil Nadu to conserve the many pollinators that keep our forests, farms and food alive.',
    cta: { label: 'Explore Our Work', link: '/programs' },
    secondaryCta: { label: 'Support Us', link: '/get-involved' },
  },
  {
    id: 2,
    image: 'https://images.pexels.com/photos/2260933/pexels-photo-2260933.jpeg',
    eyebrow: 'Beekeeping · Biodiversity · Livelihoods',
    title: 'Where Nature Meets Community',
    subtitle: 'Empowering 2,000+ farmers, women and youth through native bee-based enterprises in tribal and rural India.',
    cta: { label: 'Join a Program', link: '/programs' },
    secondaryCta: { label: 'Volunteer', link: '/get-involved' },
  },
  {
    id: 3,
    image: 'https://images.pexels.com/photos/3845092/pexels-photo-3845092.jpeg',
    eyebrow: 'Ecoliteracy for a Regenerative Future',
    title: 'Learn. Restore. Belong.',
    subtitle: 'From classroom to canopy — nurturing a generation that reads, understands and repairs the living world.',
    cta: { label: 'Our Impact', link: '/about' },
    secondaryCta: { label: 'Read Stories', link: '/resources' },
  },
];

export const stats = [
  { value: '2,000+', label: 'Farmers & Youth Trained' },
  { value: '60+', label: 'Training Programs' },
  { value: '70+', label: 'Pollinator Gardens' },
  { value: '3', label: 'States: Maharashtra · Karnataka · Tamil Nadu' },
];

export const missionPillars = [
  { icon: 'Sprout', title: 'Conservation', desc: 'Protecting native bees, butterflies, moths, sunbirds, bats and other pollinators through habitat restoration and community-led stewardship.' },
  { icon: 'BookOpen', title: 'Ecoliteracy', desc: 'Building ecological understanding in schools, colleges and villages — connecting people to the systems that sustain them.' },
  { icon: 'Users', title: 'Livelihoods', desc: 'Creating dignified rural incomes through beekeeping, honey enterprises and biodiversity-linked micro-ventures.' },
  { icon: 'Microscope', title: 'Research', desc: 'Documenting native pollinator diversity, threats and traditional knowledge with citizen scientists and universities.' },
];

// Pollinators BEPCoR conserves
export const pollinatorGroups = [
  {
    id: 'insects',
    title: 'Insects',
    lead: 'The vast majority of pollination in nature and agriculture is carried out by insects.',
    image: 'https://images.unsplash.com/photo-1504392022767-a8fc0771f239?crop=entropy&cs=srgb&fm=jpg&q=85',
    items: [
      { name: 'Bees', desc: 'The most important pollinators — honeybees, stingless bees and carpenter bees serving wild and agricultural flowers alike.' },
      { name: 'Butterflies', desc: 'Pollinate brightly coloured flowers that open during the day.' },
      { name: 'Moths', desc: 'Pollinate night-blooming, strongly fragrant flowers such as night-blooming jasmine.' },
      { name: 'Beetles', desc: 'Among the most ancient pollinating insects on Earth.' },
      { name: 'Flies (Hoverflies)', desc: 'Hoverflies visit flowers for nectar and are significant pollinators.' },
      { name: 'Wasps & Ants', desc: 'While foraging for nectar, they also unintentionally aid pollination.' },
    ],
  },
  {
    id: 'birds',
    title: 'Birds',
    lead: 'Birds carry pollen on beaks and feathers as they move flower to flower.',
    image: '/images/birds.jpg',
    items: [
      { name: 'Sunbirds', desc: 'Small local nectar-feeders whose beaks pick up and transfer pollen between flowers.' },
      { name: 'Hummingbirds', desc: 'Not native to India, but globally important bird pollinators.' },
    ],
  },
  {
    id: 'mammals',
    title: 'Mammals',
    lead: 'Furry mammals move pollen while foraging on flowers and fruit.',
    image: '/images/mamals.jpg',
    items: [
      { name: 'Bats', desc: 'Crucial for night-blooming flowers — bananas, guavas and mangoes among them.' },
      { name: 'Squirrels & Monkeys', desc: 'Pollen sticks to fur as they forage between flowers and fruit trees.' },
    ],
  },
  {
    id: 'abiotic',
    title: 'Abiotic (Non-living)',
    lead: 'Some plants do not need animals — the elements themselves carry pollen.',
    image: 'https://images.pexels.com/photos/32633821/pexels-photo-32633821.jpeg',
    items: [
      { name: 'Wind', desc: 'Sugarcane, maize, wheat, rice and many grasses are wind-pollinated.' },
      { name: 'Water', desc: 'Aquatic plants such as seagrasses are pollinated by water currents.' },
    ],
  },
];

export const programs = [
  {
    id: 'wmppc',
    title: 'WMPPC — Western Maharashtra Pollinator Protection Campaign',
    tag: 'Conservation',
    image: '/images/bamboonesting.jpg',
    summary: 'A flagship landscape campaign to map, protect and revive pollinator populations across Western Maharashtra — bees, butterflies, moths, sunbirds and bats.',
    outcomes: ['12 districts under active mapping', 'Village-level pollinator councils', 'Chemical-free zones with farmers'],
  },
  {
    id: 'beekeeping',
    title: 'Native Beekeeping & Livelihoods',
    tag: 'Livelihoods',
    image: '/images/beekeeping.jpg',
    summary: 'Training tribal and rural communities in stingless-bee and Apis cerana husbandry to produce ethical, forest-safe honey.',
    outcomes: ['2,000+ people trained', '350+ active beekeepers', 'Women-led producer collectives'],
  },
  {
    id: 'estem',
    title: 'E-STEM Programme for Schools',
    tag: 'Education',
    image: '/images/estem.jpg',
    summary: 'An Ecology-STEM curriculum bringing pollinators, food systems and climate literacy into classrooms across Maharashtra, Karnataka and Tamil Nadu.',
    outcomes: ['45 partner schools', '12,000+ students engaged', 'Teacher training modules'],
  },
  {
    id: 'gardens',
    title: 'Pollinator Gardens & Habitat',
    tag: 'Conservation',
    image: '/images/gardens.jpg',
    summary: 'Designing native flowering habitats in campuses, farms and public spaces to bring pollinators back to our neighbourhoods.',
    outcomes: ['120+ gardens created', '80+ native plant species', 'Community garden guilds'],
  },
  {
    id: 'research',
    title: 'Field Research & Citizen Science',
    tag: 'Research',
    image: '/images/research.jpg',
    summary: 'Collaborative baseline studies on native pollinators of the Western Ghats with universities and forest departments across three states.',
    outcomes: ['4 peer-reviewed studies', 'Open pollinator dataset', 'Citizen scientist network'],
  },
  {
    id: 'women',
    title: 'Madhu Shakti — Women in Beekeeping',
    tag: 'Livelihoods',
    image: '/images/sbigrant.jpg',
    summary: 'A women-led enterprise programme building honey-based micro-businesses across MH, KA and TN.',
    outcomes: ['12 women collectives', '₹11 lakh SBI Foundation grant', 'Ethical honey brand'],
  },
  {
    id: 'restoration',
    title: 'Landscape Restoration',
    tag: 'Conservation',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09',
    summary: 'Restoring degraded common lands with native flora that supports pollinators, water and rural economies.',
    outcomes: ['65 hectares under restoration', '15,000+ native saplings', 'Village restoration plans'],
  },
];

export const impactStories = [
  { id: 1, name: 'Rani Tai, Gaganbawada, Garivade', role: 'Beekeeper & Trainer', quote: 'Before BEPCoR I sold vegetables at a loss. Today my honey travels to Pune and Mumbai — and my daughter is studying to be an ecologist.', image: 'https://images.pexels.com/photos/2260933/pexels-photo-2260933.jpeg' },
  { id: 2, name: 'Aarav, Std 8, Ankali, Karnatka', role: 'E-STEM Student', quote: 'I never noticed bees. Now our school garden has 22 pollinator species — I counted them myself.', image: 'https://images.unsplash.com/photo-1504392022767-a8fc0771f239?crop=entropy&cs=srgb&fm=jpg&q=85' },
  { id: 3, name: 'Dr. Sidanand V Kambhar', role: 'Research Partner', quote: 'BEPCoR bridges what universities cannot — trust with communities, and honest field data at a landscape scale.', image: 'https://images.unsplash.com/photo-1593069567131-53a0614dde1d' },
];

export const partners = ['SBI Foundation', 'Youth for India', 'Forest Dept. Maharashtra', 'Karnataka Forest Dept.', 'Tamil Nadu Agri. Univ.', 'Western Ghats Alliance', 'Dhan Foundation', 'KVIC', 'Krishi Vigyan Kendra'];

export const blogPosts = [
  { id: 'p1', slug: 'why-native-bees-matter', title: 'Why native bees matter more than you think', category: 'Pollinators', date: 'Jun 12, 2025', readTime: '6 min read', excerpt: 'India has over 700 species of native bees. Most of them are not the honeybee you imagine. Here is why every one of them counts for our food and forests.', image: '/images/beehotels.jpg', author: 'Teja Ghorpade' },
  { id: 'p2', slug: 'madhu-shakti-women', title: 'Madhu Shakti: How 12 women re-wrote the honey economy', category: 'Livelihoods', date: 'May 22, 2025', readTime: '8 min read', excerpt: 'From tribal hamlets in the Sahyadris, a quiet enterprise is reshaping conservation-linked income for rural women.', image: '/images/madhushakti.jpg', author: 'Field Team' },
  { id: 'p3', slug: 'pollinator-garden-guide', title: 'A monsoon guide to your first pollinator garden', category: 'How-To', date: 'May 05, 2025', readTime: '5 min read', excerpt: 'Ten native plants, four simple design rules and one honest promise — you will hear more birds within a season.', image: '/images/pollinatorgarden.jpg', author: 'Habitat Team' },
  { id: 'p4', slug: 'ecoliteracy-schools', title: 'What ecoliteracy actually looks like in a Std 6 classroom', category: 'Education', date: 'Apr 18, 2025', readTime: '7 min read', excerpt: 'Notes from a term of teaching pollinators, food webs and empathy in a Zilla Parishad school.', image: '/images/ecoliteracy.jpg', author: 'Anushka Patil' },
  { id: 'p5', slug: 'western-ghats-baseline', title: 'Baseline notes from a Western Ghats pollinator survey', category: 'Research', date: 'Mar 30, 2025', readTime: '9 min read', excerpt: 'The first year of our long-term monitoring plots yielded surprises — including a species we did not expect this far south.', image: '/images/westernghats.jpg', author: 'Research Team' },
  { id: 'p6', slug: 'sbi-foundation-grant', title: 'We received an ₹11 lakh grant. Here is our plan.', category: 'News', date: 'Apr 04, 2025', readTime: '4 min read', excerpt: 'Selected at the SBI Youth for India Conclave, we are scaling women-led beekeeping across three new districts.', image: '/images/sbipitch.jpg', author: 'BEPCoR Team' },
];

export const team = [
  { name: 'Teja Ghorpade', role: 'Co-Founder & Director', image: '/images/tejaghorpade.jpg', bio: 'Ecologist, beekeeper, and social entrepreneur working at the crossroads of biodiversity and rural livelihoods.' },
  { name: 'Sanjay Ghorpade', role: 'Co-Founder & Director', image: '/images/sanjayghorpade.jpg', bio: 'Pollinator consultancy expert with 10+ years of field experience across the Western Ghats.' },
  { name: 'Pravin Dongave', role: 'Educational Expert', image: '/images/pravin.jpg', bio: 'Designs BEPCoR\u2019s community and school interventions across MH, KA & TN.' },
  { name: 'Kunal Pardesi', role: 'Thematic Expert water resources and management', image: '/images/kunal.jpg', bio: 'Trains collectives and runs the Madhu Shakti enterprise programme.' },
];

export const faqs = [
  { q: 'Where does BEPCoR work?', a: 'We work across Maharashtra, Karnataka and Tamil Nadu, with our field base in Kolhapur and programs concentrated along the Western Ghats.' },
  { q: 'Is BEPCoR a registered organisation?', a: 'Yes — BEPCoR is a Registered Section 8 Company under the Companies Act, 2013.' },
  { q: 'Can I volunteer if I am not from Maharashtra?', a: 'Absolutely. We host research volunteers, remote content contributors and short field residencies year-round.' },
  { q: 'Do you sell honey?', a: 'Our partner producer collectives sell forest honey. 100% of profits return to producer communities.' },
  { q: 'How can my school join the E-STEM Programme?', a: 'Write to us via the contact form. We on-board 6–10 schools each academic year based on region and readiness.' },
];

export const donationTiers = [
  { amount: 1000, label: 'Sapling', desc: 'Plants 10 native pollinator-friendly saplings in a village common.' },
  { amount: 2500, label: 'Hive', desc: 'Sponsors one beehive and starter kit for a woman beekeeper.' },
  { amount: 5000, label: 'Classroom', desc: 'Funds an E-STEM module for 40 students including field kits.' },
  { amount: 25000, label: 'Guardian', desc: 'Underwrites a full pollinator garden and 6 months of monitoring.' },
];
