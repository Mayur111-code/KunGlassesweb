import './config/env';
import mongoose from 'mongoose';

import User from './models/User';
import Service from './models/Service';
import Project from './models/Project';
import Client from './models/Client';
import ContactMethod from './models/ContactMethod';
import SiteSettings from './models/SiteSettings';

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const DB_URI =
  process.env.MONGODB_URI ??
  (IS_PRODUCTION
    ? (() => {
        throw new Error(
          'MONGODB_URI must be configured to run the seeder in production.'
        );
      })()
    : 'mongodb://127.0.0.1:27017/kun_glass');

/*
|--------------------------------------------------------------------------
| Optional Seed Data
|--------------------------------------------------------------------------
| Keep these commented if you don't want the seeder to modify
| services, clients, projects, contact methods or site settings.
*/

// const SERVICES = [
//   {
//     title: 'Aluminium Sliding Windows',
//     shortDescription:
//       'Smooth, modern and durable aluminium sliding windows with premium profiles for residential and commercial spaces.',
//     description:
//       'KUN Glass & Aluminium designs and installs high-performance aluminium sliding windows using premium profiles and precision hardware.',
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
// ];

// const CLIENTS = [
//   {
//     name: 'Ashoka Universal School',
//     category: 'Education',
//     location: 'Nashik, Maharashtra',
//   },
// ];

// const CONTACT_METHODS = [
//   {
//     type: 'phone',
//     value: '9823097867',
//     label: 'Phone 1',
//     isPrimary: true,
//     displayOrder: 1,
//   },
//   {
//     type: 'phone',
//     value: '9595343528',
//     label: 'Phone 2',
//     isPrimary: false,
//     displayOrder: 2,
//   },
//   {
//     type: 'whatsapp',
//     value: '9823097867',
//     label: 'WhatsApp',
//     isPrimary: true,
//     displayOrder: 1,
//   },
//   {
//     type: 'email',
//     value: 'kunglass@gmail.com',
//     label: 'Email',
//     isPrimary: true,
//     displayOrder: 1,
//   },
// ];

/*
|--------------------------------------------------------------------------
| Admin Credentials
|--------------------------------------------------------------------------
*/

const SEED_ADMIN_EMAIL = (
  process.env.SEED_ADMIN_EMAIL ?? 'admin@kunglass.com'
).toLowerCase();

const SEED_ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD;

/*
|--------------------------------------------------------------------------
| Seeder
|--------------------------------------------------------------------------
*/

const seed = async (): Promise<void> => {
  try {
    /*
    |--------------------------------------------------------------------------
    | Validate admin password
    |--------------------------------------------------------------------------
    */

    if (!SEED_ADMIN_PASSWORD) {
      throw new Error(
        'SEED_ADMIN_PASSWORD must be set before running the seeder. No default password is used.'
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Connect MongoDB
    |--------------------------------------------------------------------------
    */

    await mongoose.connect(DB_URI);

    console.log('Connected to MongoDB');

    /*
    |--------------------------------------------------------------------------
    | Create / Update Super Admin
    |--------------------------------------------------------------------------
    */

    const existingAdmin = await User.findOne({
      email: SEED_ADMIN_EMAIL,
    }).select('+password');

    if (existingAdmin) {
      /*
      |--------------------------------------------------------------------------
      | Existing admin found
      |--------------------------------------------------------------------------
      | IMPORTANT:
      | We update the password here so the production admin password
      | can be reset through SEED_ADMIN_PASSWORD.
      */

      existingAdmin.password = SEED_ADMIN_PASSWORD;
      existingAdmin.role = 'SUPER_ADMIN';
      existingAdmin.isActive = true;

      await existingAdmin.save();

      console.log(
        `Super admin "${SEED_ADMIN_EMAIL}" already exists — password and account status updated.`
      );
    } else {
      /*
      |--------------------------------------------------------------------------
      | Create new admin
      |--------------------------------------------------------------------------
      */

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
    }

    /*
    |--------------------------------------------------------------------------
    | Optional Services Seed
    |--------------------------------------------------------------------------
    |
    | Keep disabled unless you specifically want to reset/recreate services.
    |
    */

    // await Service.deleteMany({});
    // await Service.create(SERVICES);
    // console.log(`Seeded ${SERVICES.length} services`);

    /*
    |--------------------------------------------------------------------------
    | Optional Clients Seed
    |--------------------------------------------------------------------------
    */

    // await Client.deleteMany({});

    // const seededClients = await Client.create(
    //   CLIENTS.map((client) => ({
    //     ...client,
    //     slug: client.name
    //       .toLowerCase()
    //       .replace(/[^a-z0-9]+/g, '-')
    //       .replace(/(^-|-$)/g, ''),
    //     isActive: true,
    //     displayOrder: 0,
    //   }))
    // );

    // console.log(`Seeded ${seededClients.length} clients`);

    /*
    |--------------------------------------------------------------------------
    | Optional Projects Seed
    |--------------------------------------------------------------------------
    */

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
    //   sampleProjects.map((project) => ({
    //     ...project,
    //     slug: project.title
    //       .toLowerCase()
    //       .replace(/[^a-z0-9]+/g, '-')
    //       .replace(/(^-|-$)/g, ''),
    //   }))
    // );

    // console.log(`Seeded ${seededProjects.length} projects`);

    /*
    |--------------------------------------------------------------------------
    | Optional Contact Methods Seed
    |--------------------------------------------------------------------------
    */

    // await ContactMethod.deleteMany({});
    // await ContactMethod.create(CONTACT_METHODS);
    // console.log('Seeded contact methods');

    /*
    |--------------------------------------------------------------------------
    | Optional Site Settings Seed
    |--------------------------------------------------------------------------
    */

    // await SiteSettings.deleteMany({});

    // await SiteSettings.create({
    //   companyName: 'KUN Glass & Aluminium',
    //   tagline: 'One Stop Solution For Glass & Aluminium Works',
    //   seoTitle:
    //     'KUN Glass & Aluminium — Premium Glass & Aluminium Solutions in Nashik',
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

    /*
    |--------------------------------------------------------------------------
    | Disconnect
    |--------------------------------------------------------------------------
    */

    await mongoose.disconnect();

    console.log('Seeding complete');
  } catch (error) {
    console.error('Seeding failed:', error);

    try {
      await mongoose.disconnect();
    } catch {
      // Ignore disconnect errors
    }

    process.exit(1);
  }
};

/*
|--------------------------------------------------------------------------
| Run Seeder
|--------------------------------------------------------------------------
*/

void seed();