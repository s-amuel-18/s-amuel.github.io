import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  description: { en: string; es: string };
  tech: string[];
  image?: string;
  type?: string;
  featured?: boolean;
  content?: { en: string; es: string };
  language?: string;
}

interface Labels {
  eyebrow: string;
  title: string;
  subtitle: string;
  viewProject: string;
  matchSingular: string;
  matchPlural: string;
  personalBadge: string;
  exploreAll: string;
  exploreAllSubtitle: string;
  projectsCount: string;
}

interface Props {
  projects: Project[];
  currentId: string;
  currentTech: string[];
  lang: 'en' | 'es';
  labels: Labels;
  allProjectsUrl: string;
  detailUrlPrefix: string;
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export function RelatedProjects({
  projects,
  currentId,
  currentTech,
  lang,
  labels,
  allProjectsUrl,
  detailUrlPrefix,
}: Props) {
  const related = useMemo(() => {
    const candidates = projects.filter(
      p => p.id !== currentId && p.featured !== false && p.content,
    );
    const scored = candidates.map(p => {
      const shared = p.tech.filter(t => currentTech.includes(t));
      const personalBoost = p.type === 'personal' ? 0.15 : 0;
      return { project: p, shared, score: shared.length + personalBoost };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 3);
  }, [projects, currentId, currentTech]);

  if (related.length === 0) return null;

  return (
    <section className="mt-24 mb-4 relative">
      {/* Ambient decorative glow */}
      <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-[70%] h-44 bg-accent-indigo/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-14 relative z-10"
      >
        <div className="inline-flex items-center gap-3 mb-5">
          <div className="w-10 h-px bg-gradient-to-r from-transparent to-accent-cyan" />
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent-cyan font-bold">
            {labels.eyebrow}
          </span>
          <div className="w-10 h-px bg-gradient-to-l from-transparent to-accent-cyan" />
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground tracking-tight mb-4 leading-tight">
          {labels.title}
        </h2>
        <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          {labels.subtitle}
        </p>
      </motion.header>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {related.map(({ project, shared }, index) => {
          const detailUrl = `${detailUrlPrefix}${project.id}`;
          const matchLabel =
            shared.length === 1 ? labels.matchSingular : labels.matchPlural;

          return (
            <motion.a
              key={project.id}
              href={detailUrl}
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              variants={cardVariants}
              whileHover={{ y: -8 }}
              className="group relative flex flex-col rounded-[2rem] overflow-hidden glass border border-border hover:border-border-accent transition-all duration-500 shadow-xl hover:shadow-glow-cyan"
            >
              {/* Image panel */}
              <div className="relative h-52 overflow-hidden bg-bg-secondary">
                {project.image && (
                  <>
                    {/* Blurred ambient backdrop */}
                    <img
                      src={project.image}
                      alt=""
                      aria-hidden
                      className="absolute inset-0 w-full h-full object-cover scale-[1.4] blur-2xl opacity-55 transition-transform duration-[1500ms] ease-out group-hover:scale-[1.6]"
                    />
                    {/* Brand tint */}
                    <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/[0.06] via-transparent to-accent-indigo/[0.06] z-[2] pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/45 via-transparent to-transparent z-[3] pointer-events-none" />
                    {/* Foreground image (contained, not cropped) */}
                    <div className="relative w-full h-full flex items-center justify-center p-4 z-[10]">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="max-w-full max-h-full object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.55)] rounded-xl transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    </div>
                  </>
                )}

                {/* Top-left badges (stacked) */}
                <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
                  {project.type === 'personal' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-accent-violet/90 backdrop-blur-sm text-primary-foreground text-[9px] font-black font-mono rounded-md uppercase tracking-wider shadow-lg w-fit">
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      {labels.personalBadge}
                    </span>
                  )}
                  {shared.length > 0 && (
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-background/80 backdrop-blur-md text-accent-cyan text-[9px] font-black font-mono rounded-md uppercase tracking-wider border border-accent-cyan/30 shadow-lg w-fit">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-accent-cyan opacity-60 animate-ping" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-cyan" />
                      </span>
                      +{shared.length} {matchLabel}
                    </span>
                  )}
                </div>

                {/* Hover tint */}
                <div className="absolute inset-0 bg-accent-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity z-[15] pointer-events-none" />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col p-6 relative">
                <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-border-accent/40 to-transparent" />

                <h3 className="text-xl font-black text-foreground group-hover:text-accent-cyan transition-colors tracking-tight mb-2 leading-snug">
                  {project.title}
                </h3>

                <p className="text-muted-foreground text-sm leading-relaxed mb-5 line-clamp-3 flex-grow">
                  {project.description[lang]}
                </p>

                {/* Tech badges (shared ones highlighted) */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.tech.slice(0, 4).map(tech => {
                    const isShared = currentTech.includes(tech);
                    return (
                      <span
                        key={tech}
                        className={
                          isShared
                            ? 'px-2 py-0.5 text-[9px] font-bold rounded-md border uppercase tracking-widest bg-accent-cyan/10 text-accent-cyan border-accent-cyan/30'
                            : 'px-2 py-0.5 text-[9px] font-bold rounded-md border uppercase tracking-widest bg-white/5 text-muted-foreground border-white/5'
                        }
                      >
                        {tech}
                      </span>
                    );
                  })}
                  {project.tech.length > 4 && (
                    <span className="px-2 py-0.5 bg-white/5 text-muted-foreground text-[9px] font-bold rounded-md border border-white/5">
                      +{project.tech.length - 4}
                    </span>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-auto inline-flex items-center gap-1.5 text-xs font-black text-accent-cyan w-fit">
                  <span className="border-b border-accent-cyan/60 pb-0.5 group-hover:border-white group-hover:text-white transition-colors">
                    {labels.viewProject}
                  </span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:translate-x-1 group-hover:text-white transition-all"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </div>
              </div>
            </motion.a>
          );
        })}
      </div>

      {/* "View all" CTA banner */}
      <motion.a
        href={allProjectsUrl}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="group mt-8 relative block overflow-hidden rounded-[2rem] glass border border-border hover:border-border-accent transition-all duration-500 p-7 md:p-10 shadow-xl hover:shadow-glow-cyan"
      >
        {/* Decorative glows */}
        <div className="absolute -top-12 -right-12 w-72 h-72 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none group-hover:bg-accent-cyan/20 transition-colors duration-700" />
        <div className="absolute -bottom-12 -left-12 w-72 h-72 bg-accent-violet/10 rounded-full blur-3xl pointer-events-none group-hover:bg-accent-violet/20 transition-colors duration-700" />
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-accent-indigo/[0.04] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-block font-mono text-[10px] uppercase tracking-[0.3em] text-accent-cyan font-bold">
              {labels.eyebrow}
            </span>
            <h3 className="text-2xl md:text-3xl font-black text-foreground group-hover:text-gradient transition-colors tracking-tight leading-tight">
              {labels.exploreAll}
            </h3>
            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              {labels.exploreAllSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <div className="font-mono text-3xl font-black text-accent-cyan leading-none">
                {projects.length}
              </div>
              <div className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em] mt-1">
                {labels.projectsCount}
              </div>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/30 flex items-center justify-center group-hover:bg-accent-cyan group-hover:border-accent-cyan transition-all duration-300 shadow-lg group-hover:shadow-glow-cyan">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-accent-cyan group-hover:text-primary-foreground transition-all duration-300 group-hover:translate-x-0.5"
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </motion.a>
    </section>
  );
}
