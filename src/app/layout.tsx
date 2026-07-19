import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { ModalProvider } from '@/context/ModalContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sailesh Iyyappan Jr. — Systems Product Engineer & Technical Founder',
  description:
    'Building intelligent products through embedded systems, IoT, AI-assisted software, and applied research. Systems Product Engineer and Technical Founder.',
  keywords: [
    'Sailesh Iyyappan Jr',
    'Systems Product Engineer',
    'Technical Founder',
    'embedded systems',
    'IoT',
    'AI',
    'product engineering',
    'patents',
    'health-tech',
    'wearable',
    'research engineering',
    'firmware',
    'hardware',
    'full stack',
  ],
  authors: [{ name: 'Sailesh Iyyappan Jr.' }],
  creator: 'Sailesh Iyyappan Jr.',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: 'Sailesh Iyyappan Jr. — Systems Product Engineer & Technical Founder',
    description:
      'Building intelligent products through embedded systems, IoT, AI-assisted software, and applied research.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Sailesh Iyyappan Jr.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Sailesh Iyyappan Jr. — Systems Product Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sailesh Iyyappan Jr. — Systems Product Engineer & Technical Founder',
    description:
      'Building intelligent products through embedded systems, IoT, AI-assisted software, and applied research.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://sailesh.dev',
  },
  metadataBase: new URL('https://sailesh.dev'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Sailesh Iyyappan Jr.',
              jobTitle: 'Systems Product Engineer & Technical Founder',
              url: 'https://sailesh.dev',
              sameAs: [
                'https://linkedin.com',
                'https://github.com',
              ],
              worksFor: {
                '@type': 'Organization',
                name: 'Independent',
              },
              knowsAbout: [
                'Embedded Systems',
                'Internet of Things',
                'AI-Assisted Systems',
                'Product Engineering',
                'System Architecture',
                'Patent Development',
                'Research Engineering',
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} bg-void text-void18 antialiased`}
      >
        <ModalProvider>
          {children}
        </ModalProvider>
      </body>
    </html>
  );
}
