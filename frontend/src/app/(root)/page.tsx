'use client';

import { useEffect, useState } from 'react';
import { servicesApi, projectsApi, clientsApi, settingsApi } from '@/services';
import type { Service, Project, Client } from '@/types';
import { getImageUrl } from '@/lib/utils';
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
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projectTotal, setProjectTotal] = useState(0);
  const [clientTotal, setClientTotal] = useState(0);
  const [heroImage, setHeroImage] = useState<string | undefined>();
  const [aboutImage, setAboutImage] = useState<string | undefined>();

  useEffect(() => {
    servicesApi
      .getAll()
      .then((r) => {
        const list = r.data ?? [];
        setServices(list.slice(0, 6));
        const featured = list.find((s) => s.isFeatured && s.featuredImage) ?? list.find((s) => s.featuredImage);
        if (featured?.featuredImage) setAboutImage(getImageUrl(featured.featuredImage));
      })
      .catch(() => {});

    settingsApi
      .getPublic()
      .then((r) => setHeroImage(getImageUrl(r.data.settings.heroImages?.home)))
      .catch(() => {});

    projectsApi
      .getAll()
      .then((r) => {
        const list = r.data ?? [];
        setProjectTotal(list.length);
        setProjects(list.slice(0, 4));
      })
      .catch(() => {});

    clientsApi
      .getAll()
      .then((r) => {
        const list = r.data ?? [];
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
