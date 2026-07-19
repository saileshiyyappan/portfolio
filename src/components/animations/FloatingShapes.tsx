'use client';

import { motion } from 'framer-motion';

const shapes = [
  { type: 'circle', size: 300, x: '10%', y: '20%', delay: 0, duration: 20 },
  { type: 'circle', size: 200, x: '80%', y: '60%', delay: 2, duration: 25 },
  { type: 'square', size: 150, x: '70%', y: '15%', delay: 4, duration: 18 },
  { type: 'circle', size: 120, x: '20%', y: '75%', delay: 1, duration: 22 },
  { type: 'square', size: 80, x: '50%', y: '40%', delay: 3, duration: 28 },
];

export default function FloatingShapes() {
  return (
    <div className="fixed inset-0 z-[2] pointer-events-none overflow-hidden">
      {shapes.map((shape, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: shape.x,
            top: shape.y,
            width: shape.size,
            height: shape.size,
          }}
          animate={{
            y: [0, -30, 0, 30, 0],
            x: [0, 20, 0, -20, 0],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            delay: shape.delay,
            ease: 'easeInOut',
          }}
        >
          <div
            className={`w-full h-full border border-white/[0.03] ${
              shape.type === 'circle' ? 'rounded-full' : 'rounded-lg rotate-45'
            }`}
            style={{
              background: `linear-gradient(135deg, rgba(59,130,246,0.02), transparent)`,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
