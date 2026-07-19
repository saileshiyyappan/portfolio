'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, ArrowUpRight, Linkedin, Github, Twitter } from 'lucide-react';
import { contactData } from '@/data/contact';
import { socialLinks } from '@/data/socials';
import { useInView } from '@/hooks/useInView';
import { staggerContainer, staggerItem } from '@/lib/animations';
import SectionHeader from '@/components/ui/SectionHeader';
import Container from '@/components/ui/Container';


const iconMap: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
  Linkedin,
  Github,
  Mail,
  Twitter,
};

const SocialLink = memo(function SocialLink({ social }: { social: typeof socialLinks[0] }) {
  const IconComponent = iconMap[social.icon] || Mail;
  return (
    <motion.a
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 p-4 glass rounded-xl hover:bg-white/[0.05] transition-all duration-300"
      variants={staggerItem}
      whileHover={{ x: 5 }}
    >
      <div className="w-10 h-10 rounded-lg bg-neon-blue/10 flex items-center justify-center group-hover:bg-neon-blue/20 transition-colors flex-shrink-0">
        <IconComponent size={18} className="text-neon-cyan" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-heading font-medium text-white text-sm">{social.name}</div>
        <div className="font-body text-xs text-void13 truncate">{social.url}</div>
      </div>
      <ArrowUpRight size={14} className="text-void12 group-hover:text-white transition-colors flex-shrink-0" />
    </motion.a>
  );
});

export default function Contact() {
  const { ref, isInView } = useInView({ rootMargin: '-50px' });

  return (
    <section id="contact" className="relative py-16 sm:py-20 overflow-hidden">
      <Container ref={ref}>
        <SectionHeader
          subtitle="Get in Touch"
          title={<>Let&apos;s Build <span className="text-gradient">Something</span></>}
          description="Open to research collaborations, product engineering partnerships, and advisory roles."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info */}
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
          >
            <div className="glass rounded-2xl p-6 lg:p-8">
              <h3 className="font-heading font-semibold text-xl text-white mb-6">Contact Information</h3>
              <div className="space-y-4">
                <motion.a
                  href={`mailto:${contactData.email}`}
                  className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.05] transition-colors"
                  variants={staggerItem}
                  whileHover={{ x: 5 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-neon-blue/10 flex items-center justify-center flex-shrink-0">
                    <Mail size={18} className="text-neon-cyan" />
                  </div>
                  <div>
                    <div className="font-body text-xs text-void13 mb-1">Email</div>
                    <div className="font-body text-white text-sm">{contactData.email}</div>
                  </div>
                </motion.a>
                <motion.div
                  className="flex items-center gap-4 p-4 rounded-xl"
                  variants={staggerItem}
                >
                  <div className="w-10 h-10 rounded-lg bg-neon-blue/10 flex items-center justify-center flex-shrink-0">
                    <MapPin size={18} className="text-neon-cyan" />
                  </div>
                  <div>
                    <div className="font-body text-xs text-void13 mb-1">Location</div>
                    <div className="font-body text-white text-sm">{contactData.location}</div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={staggerContainer}
          >
            <div className="glass rounded-2xl p-6 lg:p-8">
              <h3 className="font-heading font-semibold text-xl text-white mb-6">Connect</h3>
              <div className="space-y-3">
                {socialLinks.map((social) => (
                  <SocialLink key={social.id} social={social} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
