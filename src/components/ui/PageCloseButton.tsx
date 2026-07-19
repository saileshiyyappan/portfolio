'use client';

import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageCloseButtonProps {
  href: string;
  label?: string;
}

export default function PageCloseButton({ href, label = 'Back' }: PageCloseButtonProps) {
  return (
    <motion.div
      className="fixed top-4 left-4 z-[70]"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Link
        href={href}
        className="group flex items-center gap-2 px-4 py-2.5 rounded-full glass hover:bg-white/10 transition-all border border-white/10 backdrop-blur-xl"
      >
        <ArrowLeft size={16} className="text-white group-hover:-translate-x-0.5 transition-transform" />
        <span className="font-body text-sm text-white">{label}</span>
      </Link>
    </motion.div>
  );
}
