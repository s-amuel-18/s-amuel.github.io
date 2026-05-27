import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  description: { en: string; es: string };
  tech: string[];
  image?: string;
  github?: string;
  projectUrl?: string;
  stars?: number;
  forks?: number;
  language: string;
  content?: { en: string; es: string };
}

interface Props {
  projects: Project[];
  lang: 'en' | 'es';
  labels: {
    viewDetails: string;
    featuredBadge: string;
    remainingCount: number;
  };
  allProjectsUrl: string;
}

const INTERVAL = 5000;

const slideVariants = {
  enter: (dir: number) => ({
    x: dir >= 0 ? 60 : -60,
    opacity: 0,
    scale: 0.99,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (dir: number) => ({
    x: dir >= 0 ? -60 : 60,
    opacity: 0,
    scale: 0.99,
  }),
};

export function ProjectsCarousel({ projects, lang, labels, allProjectsUrl }: Props) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent(i => (i + 1) % projects.length);
  }, [projects.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent(i => (i - 1 + projects.length) % projects.length);
  }, [projects.length]);

  const goTo = useCallback(
    (index: number) => {
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current],
  );

  useEffect(() => {
    if (paused || projects.length <= 1) return;
    intervalRef.current = setInterval(next, INTERVAL);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, next, projects.length, current]);

  const project = projects[current];
  const detailUrl = lang === 'es' ? `/es/projects/${project.id}` : `/projects/${project.id}`;

  return (
    <div
      className="relative select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── Card ── */}
      <div className="relative rounded-3xl overflow-hidden shadow-2xl glass">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={project.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* ── Image panel ── */}
              <div className="relative h-64 lg:h-[440px] overflow-hidden">
                {/* Right-edge fade so content blends on desktop */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[rgba(15,23,42,0.6)] z-[5] pointer-events-none lg:block hidden" />

                {/* Featured badge */}
                <div className="absolute top-4 left-4 z-20">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-cyan/90 backdrop-blur-sm text-primary-foreground text-[10px] font-black font-mono rounded-lg uppercase tracking-wider shadow-glow-cyan">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    {labels.featuredBadge}
                  </span>
                </div>

                {/* Language badge */}
                <div className="absolute bottom-4 left-4 z-20">
                  <span className="px-2.5 py-1 bg-background/70 backdrop-blur-xl border border-border/40 text-accent-cyan text-[10px] font-bold font-mono rounded-lg uppercase tracking-wider">
                    {project.language}
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-accent-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity z-[6] pointer-events-none" />

                {project.image && (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>

              {/* ── Content panel ── */}
              <div className="flex flex-col justify-center gap-0 p-8 lg:p-12 relative">
                {/* Subtle glow behind content */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-accent-cyan/[0.03] rounded-full blur-3xl pointer-events-none" />

                {/* Counter badge */}
                <div className="flex items-center gap-2 mb-5">
                  <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-[0.2em]">
                    {current + 1} / {projects.length}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-3xl lg:text-4xl font-black text-foreground tracking-tight leading-tight mb-4">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed mb-7 text-[15px]">
                  {project.description[lang]}
                </p>

                {/* Tech badges */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tech.slice(0, 5).map(tech => (
                    <span
                      key={tech}
                      className="px-2.5 py-1 bg-accent-cyan/5 text-accent-cyan text-[10px] font-bold rounded-lg border border-accent-cyan/10 uppercase tracking-widest"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech.length > 5 && (
                    <span className="px-2.5 py-1 bg-white/5 text-muted-foreground text-[10px] font-bold rounded-lg border border-white/5">
                      +{project.tech.length - 5}
                    </span>
                  )}
                </div>

                {/* Action links */}
                <div className="flex items-center gap-6 flex-wrap">
                  {project.content && (
                    <a
                      href={detailUrl}
                      className="group/lnk inline-flex items-center gap-2 text-sm font-black text-accent-cyan hover:text-white transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover/lnk:translate-x-1 transition-transform"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                      <span className="border-b-2 border-accent-cyan group-hover/lnk:border-white transition-colors">
                        {labels.viewDetails}
                      </span>
                    </a>
                  )}
                  {project.projectUrl && (
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-muted-foreground hover:text-accent-violet transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></svg>
                      Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── Progress bar ── */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-border/30 z-30">
          {!paused && (
            <motion.div
              key={`${current}-bar`}
              className="h-full bg-gradient-main"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: INTERVAL / 1000, ease: 'linear' }}
            />
          )}
        </div>

        {/* ── Prev / Next arrows ── */}
        {projects.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous project"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-background/80 backdrop-blur border border-border/50 text-foreground hover:border-border-accent hover:text-accent-cyan transition-all hover:scale-105 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button
              onClick={next}
              aria-label="Next project"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-background/80 backdrop-blur border border-border/50 text-foreground hover:border-border-accent hover:text-accent-cyan transition-all hover:scale-105 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </>
        )}
      </div>

      {/* ── Bottom bar: dots + view-all ── */}
      <div className="flex items-center justify-between mt-6 px-1">
        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to project ${i + 1}`}
              className="transition-all duration-300 rounded-full border-none cursor-pointer p-0"
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                background:
                  i === current
                    ? 'var(--accent-cyan)'
                    : 'rgba(148,163,184,0.25)',
              }}
            />
          ))}
        </div>

        {/* View all button */}
        {labels.remainingCount > 0 && (
          <a
            href={allProjectsUrl}
            className="group inline-flex items-center gap-3 px-5 py-2.5 glass rounded-xl glass-hover text-sm font-bold text-foreground hover:text-accent-cyan border border-border hover:border-border-accent transition-all"
          >
            <span className="font-mono text-[10px] bg-accent-cyan/10 text-accent-cyan px-2 py-0.5 rounded-md border border-accent-cyan/20">
              +{labels.remainingCount}
            </span>
            <span>
              {lang === 'es'
                ? `Ver ${labels.remainingCount} proyecto${labels.remainingCount !== 1 ? 's' : ''} más`
                : `View ${labels.remainingCount} more project${labels.remainingCount !== 1 ? 's' : ''}`}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="group-hover:translate-x-0.5 transition-transform"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
