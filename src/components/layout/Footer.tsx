'use client';

import { motion } from 'framer-motion';
import { ArrowUp, Heart } from 'lucide-react';
import Link from 'next/link';
import Container from '@/components/ui/Container';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { label: 'About', href: '/#about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <footer className="relative py-16 border-t border-white/5">
      <Container>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo & Tagline */}
          <div className="text-center md:text-left">
            <Link href="/" className="font-heading font-bold text-2xl text-white mb-2 block">
              SI<span className="text-neon-cyan">.</span>
            </Link>
            <p className="font-body text-sm text-void12">
              Systems Product Engineer & Technical Founder
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-6">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-body text-sm text-void12 hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-[1px] bg-neon-cyan w-0 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Back to Top */}
          <motion.button
            onClick={scrollToTop}
            className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors focus-ring"
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Back to top"
          >
            <ArrowUp size={18} className="text-white" />
          </motion.button>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-void10">
            &copy; {new Date().getFullYear()} Sailesh Iyyappan Jr. All rights reserved.
          </p>
          <p className="font-body text-xs text-void10 flex items-center gap-1">
            Built with <Heart size={12} className="text-neon-red" /> and engineering precision
          </p>
        </div>
      </Container>
    </footer>
  );
}
