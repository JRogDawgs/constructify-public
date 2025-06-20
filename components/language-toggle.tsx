'use client';

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Globe, ChevronDown } from 'lucide-react';

const languages = [
  {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    nativeName: 'English'
  },
  {
    code: 'es', 
    name: 'Spanish',
    flag: '🇪🇸',
    nativeName: 'Español'
  }
];

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="lg"
          className="h-14 px-6 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 border border-white/20 hover:border-white/40 rounded-xl backdrop-blur-sm"
        >
          <Globe className="h-4 w-4 mr-2" />
          <span className="text-lg mr-1">{currentLanguage.flag}</span>
          <span className="font-medium">{currentLanguage.code.toUpperCase()}</span>
          <ChevronDown className="h-3 w-3 ml-1 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48 bg-white border border-slate-200 shadow-lg mt-2">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-slate-50 transition-colors ${
              i18n.language === language.code ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
            }`}
          >
            <span className="text-lg">{language.flag}</span>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{language.nativeName}</span>
              <span className="text-xs text-slate-500">{language.name}</span>
            </div>
            {i18n.language === language.code && (
              <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 