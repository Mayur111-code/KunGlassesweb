import './config/env';
import mongoose from 'mongoose';
import User from './models/User';
import Service from './models/Service';
import Project from './models/Project';
import Client from './models/Client';
import ContactMethod from './models/ContactMethod';
import SiteSettings from './models/SiteSettings';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const DB_URI = process.env.MONGODB_URI ?? (IS_PRODUCTION
  ? (() => {
      throw new Error('MONGODB_URI must be configured to run the seeder in production.');
    })()
  : 'mongodb://127.0.0.1:27017/kun_glass');

// const SERVICES = [
//   {
//     title: 'Aluminium Sliding Windows',
//     shortDescription:
//       'Smooth, modern and durable aluminium sliding windows with premium profiles for residential and commercial spaces.',
//     description:
//       'KUN Glass & Aluminium designs and installs high-performance aluminium sliding windows using premium profiles and precision hardware. Our sliding windows deliver smooth operation, superior weather resistance, excellent ventilation and clean sightlines. Every unit is custom-fabricated to your opening size and finished to a flawless standard for homes, offices, shops and industrial buildings.',
//     features: [
//       'Smooth glide premium rollers',
//       'Custom fabrication to any size',
//       'Weather & dust resistant',
//       'Powder-coated finishes',
//       'Optional mosquito mesh & safety locks',
//       'Single/double glass options',
//     ],
//     specifications: [
//       { label: 'Frame', value: 'Aluminium 1.4mm–2.0mm profiles' },
//       { label: 'Glass', value: 'Toughened / plain / tinted (custom)' },
//       { label: 'Finish', value: 'Powder-coated & anodised' },
//       { label: 'Operation', value: 'Sliding (2/3/4 track options)' },
//     ],
//     displayOrder: 1,
//     isFeatured: true,
//   },
//   {
//     title: 'Aluminium Partition Framework',
//     shortDescription:
//       'Partition frameworks and interior aluminium frames that shape modern office and commercial spaces.',
//     description:
//       'Our aluminium partition framework systems divide and define spaces with precision engineering and a clean architectural look. Ideal for offices, showrooms, hospitals, retail and industrial premises, these frameworks combine strength with light weight and pair perfectly with glass panels for a premium modern finish.',
//     features: [
//       'Space-efficient partitioning',
//       'Modular & reconfigurable layouts',
//       'Clean industrial-aesthetic finish',
//       'High strength-to-weight ratio',
//       'Easy serviceability',
//     ],
//     specifications: [
//       { label: 'Material', value: 'Aluminium profiles (6063 grade)' },
//       { label: 'Panel option', value: 'Glass, ACP, ply or combination' },
//       { label: 'Finish', value: 'Mill / anodised / powder coated' },
//     ],
//     displayOrder: 2,
//   },
//   {
//     title: 'Toughened Glass Interior & Exterior',
//     shortDescription:
//       'Toughened glass solutions for doors, windows, facades and interiors — safe, strong and crystal clear.',
//     description:
//       'We supply and install toughened (tempered) glass for interiors and exteriors, offering superior safety, impact resistance and clarity. Applications include glass doors, windows, partitions, balustrades, shop fronts and more — always installed with professional detailing for a crisp, premium finish.',
//     features: [
//       'Heat-strengthened safety glass',
//       'Impact and thermal resistance',
//       'Crystal-clear sightlines',
//       'Custom sizes and thicknesses',
//       'Edge polishing and detailing',
//     ],
//     specifications: [
//       { label: 'Thickness', value: '5mm to 19mm (custom)' },
//       { label: 'Types', value: 'Clear, tinted, frosted, reflective' },
//       { label: 'Standards', value: 'As per safety glass norms' },
//     ],
//     displayOrder: 3,
//     isFeatured: true,
//   },
//   {
//     title: 'ACP Cladding & Facade Work',
//     shortDescription:
//       'Modern ACP cladding and facade systems that give buildings a striking, contemporary identity.',
//     description:
//       'KUN delivers complete ACP (Aluminium Composite Panel) cladding and facade solutions that transform building exteriors into striking modern facades. From design layout and panel cutting to framework and installation, we manage the entire facade process with precision, durability and visual impact.',
//     features: [
//       'Complete design-to-install service',
//       'Wide range of panel colours & textures',
//       'Weather-resistant assemblies',
//       'Clean modern building lines',
//       'Durable long-life finishes',
//     ],
//     specifications: [
//       { label: 'Panel', value: 'ACP 3mm / 4mm (Grade A1 / fire retardant)' },
//       { label: 'Sub-frame', value: 'Galvanised / aluminium' },
//       { label: 'Applications', value: 'Facades, columns, signage, interiors' },
//     ],
//     displayOrder: 4,
//   },
//   {
//     title: 'Modern Profile Openable & Sliding Works',
//     shortDescription:
//       'Contemporary window and door profiles with openable and sliding systems for a refined finish.',
//     description:
//       'Our modern profile systems cover openable windows, sliding doors and combination systems using contemporary aluminium profiles. Designed for smooth operation, excellent sealing and a premium look, these systems are perfect for residences, offices and commercial projects of every scale.',
//     features: [
//       'European-style modern profiles',
//       'Multi-point locking options',
//       'Excellent air & water sealing',
//       'Slim sightline premium look',
//       'Wide ventilation options',
//     ],
//     specifications: [
//       { label: 'System', value: 'Sliding / casement / tilt-and-turn' },
//       { label: 'Profile', value: '63 / 65 / 70 series modern profiles' },
//       { label: 'Hardware', value: 'Premium multi-point locking' },
//     ],
//     displayOrder: 5,
//   },
//   {
//     title: 'Mirror & Shelves',
//     shortDescription:
//       'High-quality mirrors and shelves crafted and fitted for homes, offices, gyms and retail spaces.',
//     description:
//       'We supply and install premium mirrors and shelves for residential, commercial and industrial use — from wall mirrors and wardrobe mirrors to glass shelves and display units. Every piece is cut, polished and fitted with precision to give your space a clean, premium look.',
//     features: [
//       'Custom sizes and shapes',
//       'Premium mirror finishes',
//       'Tempered shelf glass option',
//       'Polished edges',
//       'Professional installation',
//     ],
//     specifications: [
//       { label: 'Glass', value: '4mm–12mm premium mirrors' },
//       { label: 'Shelf option', value: 'Plain / toughened glass shelves' },
//     ],
//     displayOrder: 6,
//   },
//   {
//     title: 'Industrial Electronics Panel Glass Installation',
//     shortDescription:
//       'Precision glass systems for industrial control panels, gauges and electronic equipment enclosures.',
//     description:
//       'We specialise in precision glass installation for industrial electronics panels, control cabinets, gauges and display enclosures. Using toughened and laminated glass cut to exact specifications, we deliver protective and see-through solutions for factories, plants and equipment manufacturers.',
//     features: [
//       'Precision cutting & sizing',
//       'Toughened / laminated control-panel glass',
//       'Anti-glare options',
//       'FRP / GFRP panel compatibility',
//       'Bulk & repeat order capability',
//     ],
//     specifications: [
//       { label: 'Glass', value: 'Toughened / laminated, custom sizes' },
//       { label: 'Application', value: 'Control panels, gauges, enclosures' },
//     ],
//     displayOrder: 7,
//   },
//   {
//     title: 'Flooring & Ceiling Solutions',
//     shortDescription:
//       'Premium interiors from the ground up — glass flooring accents and ceiling solutions by KUN.',
//     description:
//       'KUN brings premium flooring and ceiling solutions to modern interiors, combining aluminium frameworks with glass and other materials. From feature glass flooring and stair glass accents to ceiling frameworks and panels, we build polished interiors that are safe, stylish and long-lasting.',
//     features: [
//       'Feature glass flooring accents',
//       'Ceiling framework systems',
//       'Precision installation',
//       'Combined with interiors seamlessly',
//     ],
//     specifications: [
//       { label: 'Material', value: 'Toughened glass, aluminium, ACP' },
//       { label: 'Application', value: 'Interiors, showrooms, offices' },
//     ],
//     displayOrder: 8,
//   },
//   {
//     title: 'Glass Railing & Canopy Solutions',
//     shortDescription:
//       'Sleek glass railings and canopies that add safety, style and a modern edge to any building.',
//     description:
//       'We design and install glass railings and canopies for balconies, staircases, terraces, shop fronts and entrances. Combining toughened glass with precision aluminium or SS fittings, our systems deliver safety, durability and a contemporary architectural look.',
//     features: [
//       'Floor-mounted / spigot / framed systems',
//       'SS & aluminium hardware',
//       'Toughened safety glass',
//       'Weatherproof assemblies',
//       'Modern premium appearance',
//     ],
//     specifications: [
//       { label: 'Glass', value: 'Toughened 10mm / 12mm' },
//       { label: 'Hardware', value: 'Stainless steel / aluminium' },
//       { label: 'Applications', value: 'Balconies, staircases, shop fronts' },
//     ],
//     displayOrder: 9,
//   },
// ];

// const CLIENTS = [
//   { name: 'Ashoka Universal School', category: 'Education', location: 'Nashik, Maharashtra' },
//   { name: 'Trent Ltd - Tata Group', category: 'Retail', location: 'Nashik, Maharashtra' },
//   { name: 'City Centre Mall, Nashik', category: 'Commercial / Mall', location: 'Nashik, Maharashtra' },
//   { name: 'Westside', category: 'Retail', location: 'Nashik, Maharashtra' },
//   { name: 'Reliance Trends', category: 'Retail', location: 'Nashik, Maharashtra' },
//   { name: 'Lifestyle Stores', category: 'Retail', location: 'Nashik, Maharashtra' },
//   { name: 'Vishal Mega Mart', category: 'Retail', location: 'Nashik, Maharashtra' },
//   { name: 'Pratibha Foundation', category: 'Institutional' },
//   { name: 'Gangapur Police Station', category: 'Institutional' },
//   { name: 'Rajiv Gandhi IT Park, Hinjawadi', category: 'IT Park', location: 'Hinjawadi, Pune' },
//   { name: 'Shri Chhatrapati Shahu Co-operative Sugar Mill', category: 'Industrial', location: 'Nashik, Maharashtra' },
// ];

// const CONTACT_METHODS = [
//   { type: 'phone', value: '9823097867', label: 'Phone 1', isPrimary: true, displayOrder: 1 },
//   { type: 'phone', value: '9595343528', label: 'Phone 2', isPrimary: false, displayOrder: 2 },
//   { type: 'whatsapp', value: '9823097867', label: 'WhatsApp', isPrimary: true, displayOrder: 1 },
//   { type: 'email', value: 'kunglass@gmail.com', label: 'Email', isPrimary: true, displayOrder: 1 },
// ];

const SEED_ADMIN_EMAIL = (process.env.SEED_ADMIN_EMAIL ?? 'admin@kunglass.com').toLowerCase();
const SEED_ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD;

const seed = async (): Promise<void> => {
  try {
    if (!SEED_ADMIN_PASSWORD) {
      throw new Error(
        'SEED_ADMIN_PASSWORD must be set before running the seeder. No default password is used.'
      );
    }

    await mongoose.connect(DB_URI);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: SEED_ADMIN_EMAIL });
    if (existingAdmin) {
      console.log(
        `Super admin "${SEED_ADMIN_EMAIL}" already exists — leaving the existing account untouched.`
      );
      await mongoose.disconnect();
      return;
    }

    await User.create({
      name: 'KUN Administrator',
      email: SEED_ADMIN_EMAIL,
      password: SEED_ADMIN_PASSWORD,
      role: 'SUPER_ADMIN',
      isActive: true,
    });
    console.log(
      `Seeded super admin: ${SEED_ADMIN_EMAIL}. Sign in and change this password immediately.`
    );

    // await Service.deleteMany({});
    // await Service.create(SERVICES);
    // console.log(`Seeded ${SERVICES.length} services`);

    // await Client.deleteMany({});
    // const seededClients = await Client.create(
    //   CLIENTS.map((c) => ({
    //     ...c,
    //     slug: c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    //     isActive: true,
    //     displayOrder: 0,
    //   }))
    // );
    // console.log(`Seeded ${seededClients.length} clients`);

    // await Project.deleteMany({});
    // const sampleProjects = [
    //   {
    //     title: 'Guardian Clinic — Aluminium Partition & Glass Works',
    //     clientName: 'Guardian Clinic',
    //     location: 'Nashik',
    //     category: 'Commercial Interiors',
    //     serviceName: 'Aluminium Partition Framework',
    //     description:
    //       'Complete aluminium partition framework with toughened glass panels for a modern healthcare interior.',
    //     images: [],
    //     completionYear: 2024,
    //     featured: true,
    //     isActive: true,
    //     displayOrder: 1,
    //   },
    //   {
    //     title: 'Residential Sliding Windows Package',
    //     clientName: 'Private Residences',
    //     location: 'Nashik',
    //     category: 'Residential',
    //     serviceName: 'Aluminium Sliding Windows',
    //     description:
    //       'Series of premium aluminium sliding windows with powder-coated finishes for multiple residences.',
    //     images: [],
    //     completionYear: 2024,
    //     featured: false,
    //     isActive: true,
    //     displayOrder: 2,
    //   },
    // ];
    // const seededProjects = await Project.create(
    //   sampleProjects.map((p) => ({
    //     ...p,
    //     slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    //   }))
    // );
    // console.log(`Seeded ${seededProjects.length} projects (illustrative)`);

    // await ContactMethod.deleteMany({});
    // await ContactMethod.create(CONTACT_METHODS);
    // console.log('Seeded contact methods');

    // await SiteSettings.deleteMany({});
    // await SiteSettings.create({
    //   companyName: 'KUN Glass & Aluminium',
    //   tagline: 'One Stop Solution For Glass & Aluminium Works',
    //   seoTitle: 'KUN Glass & Aluminium — Premium Glass & Aluminium Solutions in Nashik',
    //   seoDescription:
    //     'KUN Glass & Aluminium has delivered premium glass, aluminium, ACP cladding and interior solutions across Nashik, Maharashtra since 2010. Get a quote today.',
    //   seoKeywords: [
    //     'glass and aluminium nashik',
    //     'aluminium sliding windows',
    //     'ACP cladding',
    //     'toughened glass',
    //     'glass partition',
    //     'KUN Glass and Aluminium',
    //   ],
    //   whatsappEnabled: true,
    //   whatsappDefaultMessage:
    //     'Hello KUN Glass & Aluminium, I am interested in your glass/aluminium services. I would like to discuss my requirement.',
    //   address:
    //     'KUN Glass & Aluminium\nS. No. 349/2/3, Lohkare Mala,\nNear Golden Universal School,\nOpposite Ceramic House Showroom,\nBehind Tuljai Hotel,\nAurangabad-Takli Link Road,\nNashik - 422003, Maharashtra, India',
    //   googleMapsUrl:
    //     'https://www.google.com/maps/search/?api=1&query=KUN+Glass+Aluminium+Vishwas+Paygonda+Patil+Nagar+Nashik',
    //   footerDescription:
    //     'KUN Glass & Aluminium — one stop solution for glass & aluminium works since 2010. Residential, commercial and industrial glass, aluminium, ACP and interior solutions in Nashik, Maharashtra.',
    //   copyrightText: `© ${new Date().getFullYear()} KUN Glass & Aluminium. All rights reserved.`,
    // });
    // console.log('Seeded site settings');

    await mongoose.disconnect();
    console.log('Seeding complete');
  } catch (error) {
    console.error('Seeding failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

try {
  void seed();
} catch (error) {
  console.error('Unexpected seeding error:', error);
}
