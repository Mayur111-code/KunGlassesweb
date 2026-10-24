'use client';

import {
  Award,
  Building2,
  Check,
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
import { PageHero } from '@/components/ui/PageHero';
import { MotionWrap, StaggerContainer, StaggerItem } from '@/components/MotionWrap';
import { ParallaxImage } from '@/components/motion/ParallaxImage';
import { CtaSection } from '@/components/home/CtaSection';
import { useSettings } from '@/lib/settings-context';
import { getSectionImage } from '@/lib/section-images';

const CAPABILITIES = [
  {
    icon: GlassWater,
    title: 'Glass Solutions',
    description: 'Toughened, laminated, frosted and decorative glass for every application.',
  },
  {
    icon: Wrench,
    title: 'Aluminium Fabrication',
    description: 'Precision-crafted windows, doors, partitions and framework systems.',
  },
  {
    icon: Building2,
    title: 'ACP Cladding & Facade',
    description: 'Modern exterior cladding and facade systems for commercial buildings.',
  },
  {
    icon: Home,
    title: 'Interior Solutions',
    description: 'Complete interior fit-outs including partition walls and ceiling work.',
  },
  {
    icon: Factory,
    title: 'Industrial Projects',
    description: 'Large-scale industrial glass and aluminium works for factories and warehouses.',
  },
  {
    icon: Shield,
    title: 'Hardware & Accessories',
    description: 'Premium quality hardware, fittings and accessory installations.',
  },
];

const WHY_KUN = [
  {
    icon: Award,
    title: '25+ Years Experience',
    description:
      'Over two decades of individual expertise in glass and aluminium, with 15+ years as KUN Glass & Aluminium.',
  },
  {
    icon: Sparkles,
    title: 'Customised Solutions',
    description:
      'Every project is tailored to specific client requirements, space constraints and aesthetic goals.',
  },
  {
    icon: Shield,
    title: 'Quality Materials',
    description:
      'Only premium-grade glass, aluminium, hardware and accessories for lasting results.',
  },
  {
    icon: Factory,
    title: 'Industrial Expertise',
    description:
      'A proven track record of delivering large-scale industrial projects on time and within budget.',
  },
  {
    icon: Wrench,
    title: 'Professional Installation',
    description:
      'Expert workmanship from initial survey and design to final finishing and handover.',
  },
];

function LaptopIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
    </svg>
  );
}

const INDUSTRIES = [
  { icon: Home, title: 'Residential', description: 'Homes, apartments, villas and housing societies.' },
  { icon: Building2, title: 'Commercial', description: 'Offices, showrooms, hotels and corporate spaces.' },
  { icon: Factory, title: 'Industrial', description: 'Factories, warehouses, plants and industrial facilities.' },
  { icon: LaptopIcon, title: 'IT Parks', description: 'Technology parks, co-working spaces and data centres.' },
  { icon: ShoppingBag, title: 'Retail', description: 'Malls, retail outlets, brand stores and showrooms.' },
  { icon: GraduationCap, title: 'Education', description: 'Schools, colleges, universities and training centres.' },
  { icon: HeartPulse, title: 'Healthcare', description: 'Hospitals, clinics, diagnostic centres and labs.' },
];

const HIGHLIGHTS = [
  'One-stop glass, aluminium and ACP delivery',
  'Direct fabrication — no third-party hand-offs',
  'Survey-led planning before any material is cut',
];

export default function AboutPage() {
  const { settings } = useSettings();
  const aboutImage = getSectionImage(settings, 'about');

  return (
    <>
      <PageHero
        eyebrow="About"
        title={
          <>
            Craftsmanship measured
            <br className="hidden sm:block" /> in <span className="text-bronze-300">millimetres.</span>
          </>
        }
        description="KUN Glass & Aluminium is a Nashik-based glass, aluminium and ACP fabrication company — bringing architectural precision to residential, commercial and industrial spaces since 2010."
        imageUrl={aboutImage}
        meta={<span>Est. 2010 · Nashik</span>}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href="/projects" size="lg" variant="primary">
            Explore Our Work
          </Button>
          <Button href="/contact" size="lg" variant="outline-light">
            Discuss Your Project
          </Button>
        </div>
      </PageHero>

      {/* Story */}
      <section className="section bg-surface" aria-label="Our story">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <MotionWrap className="lg:col-span-5" amount={0.2}>
              <div className="corner-frame relative z-10">
                <div className="media-frame aspect-[4/5]">
                  {aboutImage ? (
                    <>
                      <ParallaxImage
                        src={aboutImage}
                        alt="KUN Glass & Aluminium craftsmanship and installed architectural works"
                        className="absolute inset-0 h-full w-full"
                        strength={22}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
                    </>
                  ) : (
                    <div className="flex h-full flex-col justify-between bg-ink-950 p-8 text-stone-50">
                      <p className="type-eyebrow text-bronze-300/80">KUN · Est. 2010</p>
                      <div>
                        <p className="font-display text-6xl font-medium text-bronze-300">15+</p>
                        <p className="mt-2 font-display text-xl font-medium">Years in business</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="relative z-10 mt-6 grid grid-cols-2 gap-px border border-line bg-line">
                {[
                  ['25+', 'Years industry experience'],
                  ['15+', 'Years as KUN'],
                  ['2010', 'Established'],
                  ['360°', 'Design to installation'],
                ].map(([value, label]) => (
                  <div key={label} className="bg-surface px-5 py-4">
                    <p className="font-display text-2xl font-medium tracking-[-0.02em] text-ink-950">
                      {value}
                    </p>
                    <p className="mt-1 text-[0.625rem] uppercase tracking-[0.16em] text-steel-500">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </MotionWrap>

            <MotionWrap className="lg:col-span-7" delay={0.1} amount={0.2}>
              <p className="type-eyebrow text-bronze-700">Our Journey</p>
              <h2 className="type-h2 mt-5 max-w-xl text-ink-950">
                From glass trading to complete architectural solutions.
              </h2>

              <div className="mt-7 max-w-2xl space-y-5 text-[1rem] leading-[1.8] text-steel-500">
                <p>
                  KUN started in 2010 with the individual experience of more than 25 years in the
                  glass and aluminium industry. We began in wholesale and bulk trading of different
                  types of glass — building deep supplier relationships and an intimate knowledge of
                  materials.
                </p>
                <p>
                  Over time, we shifted our focus to aluminium and glass work alongside interior and
                  exterior materials. That transition allowed us to offer complete solutions rather
                  than raw materials — from design and fabrication to installation.
                </p>
                <p>
                  Gradually, we began undertaking industrial projects, individual client commissions
                  and hardware and accessory work. Today, KUN Glass &amp; Aluminium is a one-stop
                  solution for glass and aluminium works across Nashik and Maharashtra.
                </p>
              </div>

              <ul className="mt-9 space-y-3 border-t border-line pt-6">
                {HIGHLIGHTS.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[0.875rem] text-ink-700">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-bronze-500/35 text-bronze-700">
                      <Check className="h-3 w-3" aria-hidden />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </MotionWrap>
          </div>
        </Container>
      </section>

      {/* Capabilities */}
      <section className="section surface-stone border-y border-line" aria-label="Our capabilities">
        <Container>
          <div className="flex flex-col gap-6 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="type-eyebrow text-bronze-700">What We Do</p>
              <h2 className="type-h2 mt-5 text-ink-950">Capabilities across the build.</h2>
            </div>
            <Button href="/services" variant="outline" size="md" className="self-start sm:self-auto">
              All services
            </Button>
          </div>

          <StaggerContainer className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((capability, index) => (
              <StaggerItem key={capability.title}>
                <div className="group h-full border-b border-line py-8">
                  <div className="flex items-start justify-between gap-4">
                    <span className="type-eyebrow text-steel-500">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <capability.icon className="h-5 w-5 text-bronze-700" aria-hidden />
                  </div>
                  <h3 className="mt-9 font-display text-xl font-medium tracking-[-0.02em] text-ink-950">
                    {capability.title}
                  </h3>
                  <p className="mt-3 text-[0.875rem] leading-relaxed text-steel-500">
                    {capability.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      {/* Why KUN — dark, high impact */}
      <section className="section relative overflow-hidden bg-ink-950 text-stone-50" aria-label="Why choose KUN">
        <div className="absolute inset-0 blueprint-dark opacity-50" aria-hidden />
        <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-bronze-500/[0.08] blur-3xl" aria-hidden />

        <Container className="relative">
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <MotionWrap className="lg:col-span-5" amount={0.2}>
              <p className="type-eyebrow inline-flex items-center gap-3 text-bronze-300">
                <span className="h-px w-7 bg-bronze-300/70" aria-hidden />
                Why KUN
              </p>
              <h2 className="type-h2 mt-5 max-w-md text-stone-50">
                Experience, quality and commitment.
              </h2>
              <p className="mt-5 max-w-md text-[0.975rem] leading-relaxed text-white/55">
                The pillars of our service — and the reason clients return to us for the next phase
                of their building.
              </p>
            </MotionWrap>

            <StaggerContainer className="grid gap-x-10 sm:grid-cols-2 lg:col-span-7">
              {WHY_KUN.map((item, index) => (
                <StaggerItem key={item.title}>
                  <div className="group relative h-full border-t border-white/10 py-7">
                    <span className="absolute left-0 top-0 h-px w-0 bg-bronze-500 transition-all duration-500 ease-arch group-hover:w-full" aria-hidden />
                    <div className="flex items-start justify-between gap-4">
                      <span className="type-eyebrow text-white/55">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <item.icon className="h-5 w-5 text-bronze-400" aria-hidden />
                    </div>
                    <h3 className="mt-7 font-display text-xl font-medium tracking-[-0.02em] text-stone-50">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[0.875rem] leading-relaxed text-white/50">
                      {item.description}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </Container>
      </section>

      {/* Industries */}
      <section className="section bg-surface" aria-label="Industries we serve">
        <Container>
          <div className="max-w-2xl">
            <p className="type-eyebrow text-bronze-700">Industries</p>
            <h2 className="type-h2 mt-5 text-ink-950">Trusted across sectors.</h2>
            <p className="type-lede mt-5">
              Our solutions are specified across a wide range of building types and applications.
            </p>
          </div>

          <StaggerContainer className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {INDUSTRIES.map((industry) => (
              <StaggerItem key={industry.title}>
                <div className="group h-full bg-surface p-6 transition-colors duration-300 hover:bg-stone-50">
                  <industry.icon className="h-5 w-5 text-bronze-700" aria-hidden />
                  <h3 className="mt-7 font-display text-lg font-medium tracking-[-0.015em] text-ink-950">
                    {industry.title}
                  </h3>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-steel-500">
                    {industry.description}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
