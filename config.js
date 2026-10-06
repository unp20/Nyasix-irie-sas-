/**
 * ==========================================
 * UNP TOURS - CONFIG.JS (Ziada na Kamili)
 * ==========================================
 */

// Kuongezea kwenye object ya CONFIG iliyopo au kuunganisha:
Object.assign(CONFIG, {
  // 1. SOCIAL MEDIA LINKS
  social: {
    facebook: "https://facebook.com/unptours",
    instagram: "https://instagram.com/unptours",
    twitter: "https://twitter.com/unptours",
    tiktok: "https://tiktok.com/@unptours",
    youtube: "https://youtube.com/@unptours",
    whatsapp: "https://wa.me/255700000000"
  },

  // 2. BUSINESS HOURS
  businessHours: {
    days: "Monday - Sunday",
    hours: "07:00 AM - 10:00 PM (EAT)",
    emergencySupport: "24/7 Available for Bookings & Transfers"
  },

  // 3. API ENDPOINTS
  api: {
    baseUrl: "https://api.unp.tours/v1",
    endpoints: {
      bookings: "/bookings",
      tours: "/tours",
      contact: "/contact",
      newsletter: "/newsletter"
    }
  },

  // 4. LANGUAGES (Lugha 10 zinazotumika kwenye tovuti)
  languages: [
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "sw", name: "Kiswahili", flag: "🇹🇿" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "it", name: "Italiano", flag: "🇮🇹" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
    { code: "pl", name: "Polski", flag: "🇵🇱" }
  ]
});