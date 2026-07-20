export interface NavigationLink {
  label: string;
  href: string;
}

export function getHomeNavigationLinks(): NavigationLink[] {
  return [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Projects', href: '#projects' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Timeline', href: '#timeline' },
    { label: 'Skills', href: '#skills' },
    { label: 'Contact', href: '#contact' },
  ];
}

export function getPageNavigationLinks(): NavigationLink[] {
  return [
    { label: 'Home', href: '/#hero' },
    { label: 'About', href: '/#about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Gallery', href: '/#gallery' },
    { label: 'Timeline', href: '/#timeline' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Contact', href: '/#contact' },
  ];
}

export function getFooterNavigationLinks(): NavigationLink[] {
  return [
    { label: 'Home', href: '/#hero' },
    { label: 'About', href: '/#about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Skills', href: '/#skills' },
    { label: 'Contact', href: '/#contact' },
  ];
}

export function scrollToHref(href: string) {
  if (href.startsWith('/#')) {
    const target = href.slice(1);
    const el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    window.location.assign(href);
    return;
  }

  if (href.startsWith('#')) {
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return;
  }

  if (href.startsWith('/')) {
    window.location.assign(href);
  }
}
