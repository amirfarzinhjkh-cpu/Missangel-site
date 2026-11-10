export type Language = "fa" | "en";

export const messages = {
  fa: {
    navHome: "آغاز", navChat: "دستِ خدا", navArchive: "آرشیو", navAbout: "درباره",
    eyebrow: "در آستانه‌ی یک دگرگونی", titleA: "از دلِ", titleB: "تاریکی", titleC: "متولد شو.",
    description: "هر پایان، دروازه‌ای‌ست برای آغاز. این‌جا قدرت، از سکوت شکل می‌گیرد.",
    enter: "ورود به قلمرو", explore: "کشف جهان", status: "سامانه در حال بیدار شدن",
    chapter: "فصل نخست", chapterTitle: "ماه، دوباره طلوع می‌کند",
    chapterText: "GODHAND یک فضای زنده برای اندیشه، گفت‌وگو و ساختن است؛ جهانی که قدم‌به‌قدم گسترش پیدا می‌کند.",
    featureAI: "هم‌صحبت هوشمند", featureAIText: "گفت‌وگویی که از این‌جا آغاز می‌شود.",
    featureArchive: "آرشیو", featureArchiveText: "ردپاها، ایده‌ها و آنچه ارزش نگه‌داشتن دارد.",
    featureWorld: "جهانی قابل گسترش", featureWorldText: "ساختاری ماژولار برای قابلیت‌های آینده.",
    footer: "ساخته‌شده برای آن‌سویِ معمولی بودن.", language: "English"
  },
  en: {
    navHome: "Home", navChat: "The Hand", navArchive: "Archive", navAbout: "About",
    eyebrow: "On the edge of transformation", titleA: "Be born", titleB: "from the", titleC: "darkness.",
    description: "Every ending is a doorway. Here, power takes shape in silence.",
    enter: "Enter the realm", explore: "Explore", status: "SYSTEM AWAKENING",
    chapter: "CHAPTER I", chapterTitle: "The moon rises again",
    chapterText: "GODHAND is a living space for thought, conversation, and creation — a world designed to grow, one step at a time.",
    featureAI: "Intelligent companion", featureAIText: "A conversation that begins here.",
    featureArchive: "The Archive", featureArchiveText: "Traces, ideas, and things worth keeping.",
    featureWorld: "An expandable world", featureWorldText: "A modular foundation for what comes next.",
    footer: "Made for the other side of ordinary.", language: "فارسی"
  }
} as const;
