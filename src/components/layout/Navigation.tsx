'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useModal } from '@/context/ModalContext';
import { NavLink } from '@/types';

const navLinks: NavLink[] = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Timeline', href: '#timeline' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

const pageNavLinks: NavLink[] = [
  { label: 'About', href: '/#about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Gallery', href: '/#gallery' },
  { label: 'Timeline', href: '/#timeline' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Contact', href: '/#contact' },
];

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { isModalOpen } = useModal();

  const links = isHome ? navLinks : pageNavLinks;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const scrollTo = useCallback((href: string) => {
    setIsMobileOpen(false);
    if (href.startsWith('/#')) {
      const target = href.slice(1);
      const el = document.querySelector(target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
      window.location.href = href;
      return;
    }

    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    if (href.startsWith('/')) {
      window.location.href = href;
    }
  }, []);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isModalOpen ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100'
        } ${
          isScrolled ? 'bg-void/80 backdrop-blur-2xl border-b border-white/5 py-3' : 'bg-transparent py-6'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="font-heading font-bold text-xl text-white tracking-tight z-50">
            SI<span className="text-neon-cyan">.</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <NavItem key={link.label} link={link} onClick={() => scrollTo(link.href)} />
            ))}
          </div>

          <button
            className="md:hidden text-white z-50 w-10 h-10 flex items-center justify-center"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {isMobileOpen && !isModalOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-void/95 backdrop-blur-xl flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex flex-col items-center gap-6">
              {links.map((link, i) => (
                <motion.button
                  key={link.label}
                  onClick={() => scrollTo(link.href)}
                  className="font-heading text-2xl sm:text-3xl text-white hover:text-neon-cyan transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: i * 0.08 }}
                >
                  {link.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavItem({ link, onClick }: { link: NavLink; onClick: () => void }) {
  if (link.href.startsWith('/')) {
    return (
      <Link
        href={link.href}
        className="relative font-body text-sm text-void14 hover:text-white transition-colors group"
      >
        {link.label}
        <span className="absolute -bottom-1 left-0 h-[1px] bg-neon-cyan w-0 group-hover:w-full transition-all duration-300" />
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className="relative font-body text-sm text-void14 hover:text-white transition-colors group"
    >
      {link.label}
      <span className="absolute -bottom-1 left-0 h-[1px] bg-neon-cyan w-0 group-hover:w-full transition-all duration-300" />
    </button>
  );
}
