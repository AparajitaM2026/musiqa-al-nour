import React, { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    appName: 'Naghma',
    tagline: 'Stream the sounds of the diaspora',
    'nav.home': 'Home',
    'nav.search': 'Search',
    'nav.library': 'Library',
    'nav.profile': 'Profile',
    'home.welcome': 'Welcome back',
    'home.featuredPlaylists': 'Featured Playlists',
    'home.topArtists': 'Top Artists',
    'home.popularTracks': 'Popular Tracks',
    'home.albums': 'New Albums',
    'home.browseGenre': 'Browse by Genre',
    'search.placeholder': 'Search songs, artists, albums…',
    'search.title': 'Search',
    'search.all': 'All',
    'search.tracks': 'Tracks',
    'search.artists': 'Artists',
    'search.albums': 'Albums',
    'search.playlists': 'Playlists',
    'search.noResults': 'No results found',
    'search.results': 'results',
    'library.title': 'Your Library',
    'library.playlists': 'Playlists',
    'library.byGenre': 'Playlists by Genre',
    'library.empty': 'No playlists yet',
    'library.recentlyPlayed': 'Recently Played',
    'profile.title': 'Profile',
    'profile.member': 'Member',
    'profile.subscription': 'Subscription',
    'profile.plan': 'Current Plan',
    'profile.since': 'Member since',
    'profile.upgrade': 'Upgrade your plan',
    'profile.choosePlan': 'Choose a plan',
    'profile.logout': 'Log out',
    'profile.language': 'Language',
    'profile.free.desc': 'Ad-supported streaming with limited skips.',
    'profile.premium.desc': 'Ad-free, unlimited skips and offline downloads.',
    'profile.family.desc': 'Premium for up to six accounts in one household.',
    'profile.perMonth': '/ month',
    'profile.current': 'Current plan',
    'profile.subscribe': 'Subscribe',
    'profile.active': 'Active',
    'tier.free': 'Free',
    'tier.premium': 'Premium',
    'tier.family': 'Family',
    'genre.khaliji': 'Khaliji',
    'genre.swahili': 'Swahili',
    'genre.egyptian': 'Egyptian',
    'genre.other': 'Other',
    'player.play': 'Play',
    'player.pause': 'Pause',
    'player.next': 'Next',
    'player.previous': 'Previous',
    'player.nowPlaying': 'Now Playing',
    'player.queueEmpty': 'Nothing playing',
    'common.loading': 'Loading…',
    'common.tracks': 'tracks',
    'common.follow': 'Follow',
    'common.listeners': 'monthly listeners',
    'common.play': 'Play',
  },
  ar: {
    appName: 'نغمة',
    tagline: 'بث أصوات الشتات',
    'nav.home': 'الرئيسية',
    'nav.search': 'بحث',
    'nav.library': 'مكتبتي',
    'nav.profile': 'الملف',
    'home.welcome': 'مرحباً بعودتك',
    'home.featuredPlaylists': 'قوائم مميزة',
    'home.topArtists': 'أبرز الفنانين',
    'home.popularTracks': 'الأغاني الرائجة',
    'home.albums': 'ألبومات جديدة',
    'home.browseGenre': 'تصفح حسب النوع',
    'search.placeholder': 'ابحث عن أغاني، فنانين، ألبومات…',
    'search.title': 'بحث',
    'search.all': 'الكل',
    'search.tracks': 'الأغاني',
    'search.artists': 'الفنانون',
    'search.albums': 'الألبومات',
    'search.playlists': 'القوائم',
    'search.noResults': 'لا توجد نتائج',
    'search.results': 'نتيجة',
    'library.title': 'مكتبتك',
    'library.playlists': 'القوائم',
    'library.byGenre': 'قوائم حسب النوع',
    'library.empty': 'لا توجد قوائم بعد',
    'library.recentlyPlayed': 'تم تشغيله مؤخراً',
    'profile.title': 'الملف الشخصي',
    'profile.member': 'عضو',
    'profile.subscription': 'الاشتراك',
    'profile.plan': 'الباقة الحالية',
    'profile.since': 'عضو منذ',
    'profile.upgrade': 'ترقية باقتك',
    'profile.choosePlan': 'اختر باقة',
    'profile.logout': 'تسجيل الخروج',
    'profile.language': 'اللغة',
    'profile.free.desc': 'بث مع إعلانات وتخطٍّ محدود.',
    'profile.premium.desc': 'بدون إعلانات، تخطٍّ غير محدود وتنزيل دون اتصال.',
    'profile.family.desc': 'بريميوم لستة حسابات في منزل واحد.',
    'profile.perMonth': '/ شهرياً',
    'profile.current': 'الباقة الحالية',
    'profile.subscribe': 'اشترك',
    'profile.active': 'نشط',
    'tier.free': 'مجاني',
    'tier.premium': 'بريميوم',
    'tier.family': 'عائلية',
    'genre.khaliji': 'خليجي',
    'genre.swahili': 'سواحلي',
    'genre.egyptian': 'مصري',
    'genre.other': 'أخرى',
    'player.play': 'تشغيل',
    'player.pause': 'إيقاف',
    'player.next': 'التالي',
    'player.previous': 'السابق',
    'player.nowPlaying': 'قيد التشغيل',
    'player.queueEmpty': 'لا شيء قيد التشغيل',
    'common.loading': 'جارٍ التحميل…',
    'common.tracks': 'أغاني',
    'common.follow': 'متابعة',
    'common.listeners': 'مستمع شهرياً',
    'common.play': 'تشغيل',
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('naghma-lang') || 'en');

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('naghma-lang', lang);
  }, [lang]);

  const setLang = (l) => setLangState(l);
  const t = (key) => translations[lang]?.[key] ?? translations.en[key] ?? key;

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir: lang === 'ar' ? 'rtl' : 'ltr' }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}

export const localize = (lang, obj, key) => {
  if (!obj) return '';
  return lang === 'ar' ? obj[key + '_ar'] || obj[key] : obj[key];
};