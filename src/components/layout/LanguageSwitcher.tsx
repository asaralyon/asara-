'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const languages = [
  {
    code: 'fr',
    name: 'Français',
    flag: (
      <svg className="w-5 h-5 rounded-sm" viewBox="0 0 640 480">
        <rect width="213.3" height="480" fill="#002654"/>
        <rect x="213.3" width="213.3" height="480" fill="#fff"/>
        <rect x="426.6" width="213.3" height="480" fill="#ce1126"/>
      </svg>
    ),
  },
  {
    code: 'ar',
    name: 'العربية',
    flag: (
      // Nouveau drapeau syrien (révolution) - vert, blanc, noir avec 3 étoiles rouges
      <svg className="w-5 h-5 rounded-sm" viewBox="0 0 640 480">
        <rect width="640" height="160" fill="#007a3d"/>
        <rect y="160" width="640" height="160" fill="#fff"/>
        <rect y="320" width="640" height="160" fill="#000"/>
        <g fill="#ce1126">
          <circle cx="213" cy="240" r="25"/>
          <circle cx="320" cy="240" r="25"/>
          <circle cx="427" cy="240" r="25"/>
        </g>
      </svg>
    ),
  },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  const switchLocale = (newLocale: string) => {
    // Remplacer le locale actuel dans le pathname
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-100 transition-colors"
      >
        {currentLang.flag}
        <span className="text-sm font-medium hidden sm:inline">{currentLang.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 min-w-[150px] z-50">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLocale(lang.code)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-neutral-50 transition-colors ${
                  locale === lang.code ? 'bg-primary-50 text-primary-600' : ''
                }`}
              >
                {lang.flag}
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default LanguageSwitcher;
