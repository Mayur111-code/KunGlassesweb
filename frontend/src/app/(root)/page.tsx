'use client';

import { useEffect, useState } from 'react';
import { servicesApi, projectsApi, clientsApi } from '@/services';
import { useSettings } from '@/lib/settings-context';
import { getSectionImage } from '@/lib/section-images';
import type { Service, Project, Client } from '@/types';
import { HeroSection } from '@/components/home/HeroSection';
import { TrustStrip } from '@/components/home/TrustStrip';
import { AboutSection } from '@/components/home/AboutSection';
import { ServicesSection } from '@/components/home/ServicesSection';
import { ProjectsSection } from '@/components/home/ProjectsSection';
import { ClientsSection } from '@/components/home/ClientsSection';
import { WhySection } from '@/components/home/WhySection';
import { ProcessSection } from '@/components/home/ProcessSection';
import { CtaSection } from '@/components/home/CtaSection';
import { ContactSection } from '@/components/home/ContactSection';

export default function HomePage() {
  const { settings } = useSettings();
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projectTotal, setProjectTotal] = useState(0);
  const [clientTotal, setClientTotal] = useState(0);

  /**
   * Section imagery comes ONLY from the CMS site settings:
   *   settings.heroImages.home  → hero
   *   settings.heroImages.about → home About section
   *
   * The previous implementation derived the About image from the first service
   * with a featured image (`list.find(...).featuredImage`). Any service upload
   * therefore leaked into the About block. See `lib/section-images.ts` for the
   * ownership rules that now apply to every section image.
   */
  const heroImage = getSectionImage(settings, 'home');
  const aboutImage = getSectionImage(settings, 'about');

  useEffect(() => {
    servicesApi
      .getAll()
      .then((response) => setServices((response.data ?? []).slice(0, 6)))
      .catch(() => {});

    projectsApi
      .getAll()
      .then((response) => {
        const list = response.data ?? [];
        setProjectTotal(list.length);
        setProjects(list.slice(0, 3));
      })
      .catch(() => {});

    clientsApi
      .getAll()
      .then((response) => {
        const list = response.data ?? [];
        setClientTotal(list.length);
        setClients(list.slice(0, 12));
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <HeroSection heroImage={heroImage} />
      <TrustStrip projectCount={projectTotal} clientCount={clientTotal} />
      <AboutSection image={aboutImage} />
      <ServicesSection services={services} />
      <ProjectsSection projects={projects} />
      <ClientsSection clients={clients} />
      <WhySection />
      <ProcessSection />
      <CtaSection />
      <ContactSection />
    </>
  );
}
