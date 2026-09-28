'use client';

import { useCallback, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, MapPin, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MotionWrap, StaggerContainer, StaggerItem } from '@/components/MotionWrap';
import { FullPageLoader } from '@/components/ui/Spinner';
import { LoadError } from '@/components/ui/LoadState';
import { projectsApi } from '@/services';
import type { Project } from '@/types';
import { getImageUrl } from '@/lib/utils';
import { useSettings } from '@/lib/settings-context';

export default function ProjectsPage() {
  const { settings } = useSettings();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const heroImage = getImageUrl(settings?.heroImages?.projects);

  const loadProjects = useCallback(() => {
    setLoading(true);
    setError(false);
    projectsApi.getAll()
      .then((res) => setProjects(res.data ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadProjects(); }, [loadProjects]);

  const categories = useMemo(() => {
    const cats = new Set(projects.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(cats)];
  }, [projects]);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchCategory = category === 'All' || p.category === category;
      const q = search.toLowerCase();
      const matchSearch = !q || p.title.toLowerCase().includes(q) || p.clientName.toLowerCase().includes(q) || p.location.toLowerCase().includes(q);
      return matchCategory && matchSearch;
    });
  }, [projects, category, search]);

  return (
    <>
      <section className="relative min-h-[40vh] flex items-center gradient-navy overflow-hidden">
        {heroImage && <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" aria-hidden />}
        {heroImage && <div className="absolute inset-0 bg-navy-950/80" />}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
        <Container className="relative z-10 py-32 sm:py-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block rounded-full bg-brand-orange/20 border border-brand-orange/30 px-4 py-1.5 text-xs font-bold text-brand-light tracking-widest uppercase mb-6"
          >
            Our Work
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl lg:leading-[1.1] mb-6 max-w-3xl"
          >
            Completed{' '}
            <span className="text-brand-orange">Projects</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-navy-100/80 max-w-2xl leading-relaxed"
          >
            A showcase of our projects delivered across Nashik and Maharashtra.
          </motion.p>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          {loading ? (
            <FullPageLoader label="Loading projects..." />
          ) : error ? (
            <LoadError message="Our projects could not be loaded. Please check your connection and try again." onRetry={loadProjects} />
          ) : (
            <>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-navy-200 bg-white text-sm text-navy-900 placeholder:text-navy-400 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all"
                  />
                </div>
                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-11 pl-4 pr-10 rounded-lg border border-navy-200 bg-white text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all appearance-none cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-navy-400"><path d="m6 9 6 6 6-6"/></svg>
                  </div>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <Building2 className="h-16 w-16 text-navy-200 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-navy-950 mb-2">No Projects Found</h3>
                  <p className="text-navy-500">
                    {projects.length === 0 ? 'We are currently updating our portfolio. Please check back soon.' : 'No projects match your current filters.'}
                  </p>
                  {projects.length > 0 && (
                    <Button variant="outline" size="md" className="mt-4" onClick={() => { setCategory('All'); setSearch(''); }}>
                      Clear Filters
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <p className="text-sm text-navy-500 mb-6">{filtered.length} project{filtered.length !== 1 ? 's' : ''} found</p>
                  <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((project) => (
                      <StaggerItem key={project._id}>
                        <Link href={`/projects/${project.slug}`} className="group block h-full">
                          <div className="h-full bg-white rounded-md shadow-card hover:shadow-card-hover transition-all duration-300 border border-navy-100/70 overflow-hidden group-hover:-translate-y-1">
                            <div className="h-52 bg-gradient-to-br from-navy-900 to-navy-700 flex items-center justify-center relative overflow-hidden">
                              {project.images?.[0] ? (
                                <img
                                  src={getImageUrl(project.images[0])}
                                  alt={project.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              ) : (
                                <div className="text-center px-6">
                                  <Building2 className="h-12 w-12 text-white/30 mx-auto mb-3" />
                                  <span className="text-sm text-white/50">{project.title}</span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 to-transparent" />
                              {project.category && (
                                <span className="absolute top-3 left-3 inline-block rounded-full bg-brand-orange/90 text-white text-xs font-semibold px-3 py-1">
                                  {project.category}
                                </span>
                              )}
                            </div>
                            <div className="p-5">
                              <div className="flex items-center gap-2 text-xs text-navy-400 mb-2">
                                <span>{project.clientName}</span>
                                {project.location && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-navy-300" />
                                    <span className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      {project.location}
                                    </span>
                                  </>
                                )}
                              </div>
                              <h3 className="text-base font-bold text-navy-950 group-hover:text-brand-orange transition-colors">
                                {project.title}
                              </h3>
                              <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-brand-orange">
                                View Details <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </>
              )}
            </>
          )}
        </Container>
      </section>
    </>
  );
}
