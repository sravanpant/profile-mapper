import Link from 'next/link';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  MapPin 
} from 'lucide-react';

const SOCIAL_LINKS = [
  { 
    href: 'https://github.com', 
    icon: Github,
    label: 'GitHub' 
  },
  { 
    href: 'https://linkedin.com', 
    icon: Linkedin,
    label: 'LinkedIn' 
  },
  { 
    href: 'https://twitter.com', 
    icon: Twitter,
    label: 'Twitter' 
  }
];

const FOOTER_LINKS = [
  {
    title: 'Explore',
    links: [
      { label: 'Profiles', href: '/profiles' },
      { label: 'Global Map', href: '/map' },
      { label: 'Search', href: '/search' }
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Privacy', href: '/privacy' }
    ]
  }
];

export function Footer() {
  return (
    <footer 
      className="
        bg-background/70 backdrop-blur-md 
        border-t border-primary/10 
        py-12
      "
    >
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
        {/* Brand Section */}
        <div>
          <div className="flex items-center mb-4">
            <MapPin className="mr-2 text-primary" />
            <h2 className="text-2xl font-bold">Profile Mapper</h2>
          </div>
          <p className="text-muted-foreground">
            Discover and connect with professionals worldwide through 
            our interactive geographical visualization platform.
          </p>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-2 gap-4">
          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="
                        text-muted-foreground 
                        hover:text-foreground 
                        transition-colors
                      "
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div>
          <h3 className="font-semibold mb-4">Connect</h3>
          <div className="flex space-x-4">
            {SOCIAL_LINKS.map((social) => (
              <Link
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  text-muted-foreground 
                  hover:text-foreground 
                  transition-colors
                "
                aria-label={social.label}
              >
                <social.icon className="h-6 w-6" />
              </Link>
            ))}
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            © {new Date().getFullYear()} Profile Mapper. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}