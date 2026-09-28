'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  Building2,
  Factory,
  GlassWater,
  GraduationCap,
  HeartPulse,
  Home,
  ShoppingBag,
  Shield,
  Sparkles,
  Wrench,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { MotionWrap, StaggerContainer, StaggerItem } from '@/components/MotionWrap';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useSettings } from '@/lib/settings-context';
import { buildTelLink, buildWhatsAppLink, getImageUrl } from '@/lib/utils';

const capabilities = [
  { icon: GlassWater, title: 'Glass Solutions', description: 'Toughened, laminated, frosted and decorative glass for every application.' },
  { icon: Wrench, title: 'Aluminium Fabrication', description: 'Precision-crafted windows, doors, partitions and framework systems.' },
  { icon: Building2, title: 'ACP Cladding & Facade', description: 'Modern exterior cladding and facade systems for commercial buildings.' },
  { icon: Home, title: 'Interior Solutions', description: 'Complete interior fit-outs including partition walls and ceiling work.' },
  { icon: Factory, title: 'Industrial Projects', description: 'Large-scale industrial glass and aluminium works for factories and warehouses.' },
  { icon: Shield, title: 'Hardware & Accessories', description: 'Premium quality hardware, fittings and accessory installations.' },
];

const whyChooseUs = [
  { icon: Award, title: '25+ Years Experience', description: 'Over two decades of individual expertise in glass and aluminium, with 15+ years as KUN Glass & Aluminium.' },
  { icon: Sparkles, title: 'Customized Solutions', description: 'Every project is tailored to meet specific client requirements, space constraints and aesthetic goals.' },
  { icon: Shield, title: 'Quality Materials', description: 'We source and use only premium-grade glass, aluminium, hardware and accessories for lasting results.' },
  { icon: Factory, title: 'Industrial Expertise', description: 'Proven track record of delivering large-scale industrial projects on time and within budget.' },
  { icon: Wrench, title: 'Professional Installation', description: 'Expert workmanship from initial survey and design to final finishing and handover.' },
];

const industries = [
  { icon: Home, title: 'Residential', description: 'Homes, apartments, villas and housing societies.' },
  { icon: Building2, title: 'Commercial', description: 'Offices, showrooms, hotels and corporate spaces.' },
  { icon: Factory, title: 'Industrial', description: 'Factories, warehouses, plants and industrial facilities.' },
  { icon: Laptop, title: 'IT Parks', description: 'Technology parks, co-working spaces and data centres.' },
  { icon: ShoppingBag, title: 'Retail', description: 'Malls, retail outlets, brand stores and showrooms.' },
  { icon: GraduationCap, title: 'Education', description: 'Schools, colleges, universities and training centres.' },
  { icon: HeartPulse, title: 'Healthcare', description: 'Hospitals, clinics, diagnostic centres and labs.' },
];

function Laptop(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
    </svg>
  );
}

export default function AboutPage() {
  const { settings, primaryPhone, primaryWhatsApp, whatsappLink } = useSettings();
  const phoneLink = primaryPhone ? buildTelLink(primaryPhone.value) : null;
  const heroImage = getImageUrl(settings?.heroImages?.about);

  return (
    <>
      <section className="relative min-h-[50vh] flex items-center gradient-navy overflow-hidden">
        {heroImage && <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden />}
        {heroImage && <div className="absolute inset-0 bg-navy-950/80" />}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <Container className="relative z-10 py-32 sm:py-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block rounded-full bg-brand-orange/20 border border-brand-orange/30 px-4 py-1.5 text-xs font-bold text-brand-light tracking-widest uppercase mb-6"
          >
            About Us
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.1] mb-6 max-w-3xl"
          >
            Our Story of{' '}
            <span className="text-brand-orange">Craftsmanship</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-navy-100/80 max-w-2xl leading-relaxed"
          >
            From humble beginnings in wholesale glass trading to becoming Nashik's trusted name for complete glass and aluminium solutions — this is the KUN story.
          </motion.p>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <MotionWrap>
              <div className="relative">
                <div className="absolute -inset-4 bg-brand-orange/10 rounded-3xl -rotate-3" />
                <div className="relative bg-navy-950 rounded-2xl p-8 sm:p-10 text-white overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="relative z-10">
                    <p className="text-5xl sm:text-6xl font-bold text-brand-orange mb-2">15+</p>
                    <p className="text-lg font-semibold mb-4">Years in Business</p>
                    <p className="text-sm text-navy-200 leading-relaxed">
                      Established in 2010, KUN Glass & Aluminium brings together over 25 years of individual industry experience to deliver world-class glass and aluminium solutions.
                    </p>
                  </div>
                </div>
              </div>
            </MotionWrap>

            <MotionWrap delay={0.15}>
              <p className="text-sm font-bold tracking-widest uppercase text-brand-orange mb-3">Our Journey</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-navy-950 tracking-tight mb-5">
                From Glass Trading to Complete Solutions
              </h2>
              <div className="space-y-4 text-navy-600 leading-relaxed">
                <p>
                  KUN started in 2010 with the individual experience of more than 25 years in the glass and aluminium industry. Initially, we worked in wholesale and bulk trading of different types of glass — building deep relationships with suppliers and gaining extensive knowledge of materials.
                </p>
                <p>
                  Over time, we shifted our focus to aluminium and glass work along with interior and exterior materials. This transition allowed us to offer complete solutions rather than just raw materials — from design and fabrication to installation.
                </p>
                <p>
                  Gradually, we started undertaking industrial projects, individual client projects, and hardware and accessory-related work. Today, KUN Glass & Aluminium is a one-stop solution for glass and aluminium works across Nashik and Maharashtra.
                </p>
              </div>
            </MotionWrap>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28 bg-navy-50/50">
        <Container>
          <MotionWrap className="mb-14">
            <SectionHeading
              eyebrow="What We Do"
              title="Our Capabilities"
              description="Comprehensive glass and aluminium solutions — from concept to completion."
            />
          </MotionWrap>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((cap) => (
              <StaggerItem key={cap.title}>
                <div className="h-full bg-white rounded-2xl p-6 shadow-card border border-navy-100/50 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                  <div className="h-12 w-12 rounded-xl bg-brand-orange/10 flex items-center justify-center mb-5">
                    <cap.icon className="h-5 w-5 text-brand-orange" />
                  </div>
                  <h3 className="text-base font-bold text-navy-950 mb-2">{cap.title}</h3>
                  <p className="text-sm text-navy-500 leading-relaxed">{cap.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <MotionWrap className="mb-14">
            <SectionHeading
              eyebrow="Why Choose Us"
              title="Why KUN Glass & Aluminium"
              description="Experience, quality and commitment — the pillars of our service."
            />
          </MotionWrap>

          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item) => (
              <StaggerItem key={item.title}>
                <div className="h-full bg-white rounded-2xl p-6 shadow-card border border-navy-100/50 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
                  <div className="h-12 w-12 rounded-xl bg-brand-orange/10 flex items-center justify-center mb-5">
                    <item.icon className="h-5 w-5 text-brand-orange" />
                  </div>
                  <h3 className="text-base font-bold text-navy-950 mb-2">{item.title}</h3>
                  <p className="text-sm text-navy-500 leading-relaxed">{item.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      <section className="py-20 sm:py-28 bg-navy-50/50">
        <Container>
          <MotionWrap className="mb-14">
            <SectionHeading
              eyebrow="Industries We Serve"
              title="Trusted Across Sectors"
              description="Our solutions cater to a wide range of industries and applications."
            />
          </MotionWrap>

          <StaggerContainer className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {industries.map((industry) => (
              <StaggerItem key={industry.title}>
                <div className="h-full bg-white rounded-2xl p-5 shadow-card border border-navy-100/50 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 text-center">
                  <div className="h-12 w-12 rounded-xl bg-brand-orange/10 flex items-center justify-center mx-auto mb-4">
                    <industry.icon className="h-5 w-5 text-brand-orange" />
                  </div>
                  <h3 className="text-sm font-bold text-navy-950 mb-1">{industry.title}</h3>
                  <p className="text-xs text-navy-500 leading-relaxed">{industry.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      <section className="py-20 sm:py-28 gradient-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Cpath d=\'M0 40L40 0H20L0 20M40 40V20L20 40\'/%3E%3C/g%3E%3C/svg%3E")' }} />
        <Container className="relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <MotionWrap>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
                Ready to Start Your Project?
              </h2>
              <p className="text-navy-100/80 mb-8 text-lg">
                Contact us today for a free consultation and quote. Our team is ready to help you with any glass or aluminium project.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" variant="primary" className="sm:w-auto w-full">
                    Get a Quote <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                {phoneLink && (
                  <a href={phoneLink} className="sm:w-auto w-full">
                    <Button size="lg" variant="white" className="w-full">
                      Call Now
                    </Button>
                  </a>
                )}
                {whatsappLink && (
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="sm:w-auto w-full">
                    <Button size="lg" variant="outline-light" className="w-full bg-emerald-600/20 border-emerald-400/60 text-emerald-300 hover:bg-emerald-500 hover:text-white">
                      WhatsApp Us
                    </Button>
                  </a>
                )}
              </div>
            </MotionWrap>
          </div>
        </Container>
      </section>
    </>
  );
}
