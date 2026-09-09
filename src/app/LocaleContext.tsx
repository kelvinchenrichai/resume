import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { ProjectItem } from '../types';

export type Locale = 'en' | 'zh-TW';
const messages = {
  en: {
    home:'Home', projects:'Projects', gallery:'Certificates / Gallery', contact:'Contact', workWithMe:'Work With Me', viewMyWork:'View My Work', about:'ABOUT', selectedWork:'SELECTED WORK', viewAll:'View all projects', featuredGallery:'CERTIFICATES / GALLERY', featuredGalleryTitle:'Featured certificates and milestones.', viewAllGallery:'View all certificates & gallery', haveIdea:'HAVE AN IDEA?', makeConcrete:"Let's make it concrete.", discuss:'Discuss a Project', independent:'INDEPENDENT BUILDER', aboutTitle:'I turn curiosity into useful systems.', aboutBody:'Part trader, part builder, always experimenting. My work sits between quantitative research, AI-native workflows and rapid product prototyping.', selectedTitle:'Projects built to learn, test and improve.', trader:'Trader', builder:'Builder', experimenter:'AI-native Experimenter', thinker:'System Thinker', prototyper:'Rapid Prototyper', research:'Quant / Trading Research', projectTypes:'TradingView indicator · Trading / Quant tool · AI agent · Automation · Website · Dashboard · Prototype', projectArchive:'PROJECT ARCHIVE', projectHeadline:'Selected work and ongoing experiments.', publicProjects:'public projects', searchProjects:'Search projects...', all:'All', curated:'Curated order', newest:'Newest', title:'Title', noProjects:'No projects match these filters.', viewCase:'View case study', allProjects:'All projects', caseStudy:'CASE STUDY', stack:'STACK / TOPICS', buildSimilar:'Build something in this direction?', discussSimilar:'Discuss Similar Project', notFound:'Project not found.', backProjects:'Back to projects', liveDemo:'Live Demo', github:'GitHub', visitProject:'Visit Project', letsTalk:"LET'S TALK", contactHeadline:'Have a project, problem or idea?', contactBody:"If you have a project, collaboration, TradingView indicator, AI tool, automation, website or another idea, leave the context here. I'll review it and suggest a practical way forward.", directContact:'Direct contact', inquiry:'PROJECT INQUIRY / REQUEST A QUOTE', inspired:'Inspired by / Regarding:', name:'Name', email:'Email', projectName:'Project name', projectType:'Project type', selectOne:'Select one', budget:'Budget', timeline:'Timeline', requirements:'Requirements', preferredContact:'Preferred contact', referenceUrl:'Reference URL', notes:'Additional notes', send:'Send Inquiry', sending:'Sending...', required:'Please complete all required fields.', invalidEmail:'Please enter a valid email address.', thankYou:'THANK YOU.', received:'Your inquiry has been received.', receivedBody:"I'll review the details and get back to you through the contact information you provided.", backHome:'Back Home', viewProjects:'View Projects', pageMissing:"That page isn't here.", admin:'Admin', viewPublic:'View public site', overview:'Overview', inquiries:'Inquiries', settings:'Settings', localMode:'LOCAL MODE'
  },
  'zh-TW': {
    home:'首頁', projects:'作品', gallery:'證照／相簿', contact:'聯絡', workWithMe:'與我合作', viewMyWork:'瀏覽作品', about:'關於我', selectedWork:'精選作品', viewAll:'查看所有作品', featuredGallery:'證照／相簿', featuredGalleryTitle:'精選證照與重要紀錄。', viewAllGallery:'查看所有證照與相簿', haveIdea:'有想法嗎？', makeConcrete:'一起把想法做成作品。', discuss:'討論專案', independent:'獨立創作者', aboutTitle:'把好奇心轉化成真正有用的系統。', aboutBody:'我是交易者，也是創作者，持續透過實驗學習。我的工作橫跨量化研究、AI 原生工作流程與快速產品原型。', selectedTitle:'為了學習、驗證與持續改進而打造。', trader:'交易者', builder:'創作者', experimenter:'AI 原生實驗者', thinker:'系統思考者', prototyper:'快速原型實作者', research:'量化／交易研究', projectTypes:'TradingView 指標 · 交易／量化工具 · AI Agent · 自動化 · 網站 · 儀表板 · 產品原型', projectArchive:'作品總覽', projectHeadline:'精選作品與持續進行中的實驗。', publicProjects:'個公開作品', searchProjects:'搜尋作品…', all:'全部', curated:'精選排序', newest:'最新優先', title:'名稱排序', noProjects:'沒有符合篩選條件的作品。', viewCase:'查看案例', allProjects:'所有作品', caseStudy:'專案案例', stack:'技術／主題', buildSimilar:'想打造類似方向的專案？', discussSimilar:'討論類似專案', notFound:'找不到這個作品。', backProjects:'返回作品列表', liveDemo:'線上展示', github:'GitHub', visitProject:'前往專案', letsTalk:'聊聊你的想法', contactHeadline:'有專案、問題或想法嗎？', contactBody:'如果你有專案、合作、TradingView 指標、AI 工具、自動化、網站或其他想法，歡迎留下需求。我會閱讀內容，並提出實際可行的合作方式。', directContact:'直接聯絡', inquiry:'專案詢價／合作需求', inspired:'參考／關於作品：', name:'姓名', email:'Email', projectName:'專案名稱', projectType:'專案類型', selectOne:'請選擇', budget:'預算', timeline:'時程', requirements:'需求說明', preferredContact:'偏好聯絡方式', referenceUrl:'參考網址', notes:'其他補充', send:'送出詢價', sending:'送出中…', required:'請填寫所有必填欄位。', invalidEmail:'請輸入有效的 Email。', thankYou:'謝謝你。', received:'我們已收到你的需求。', receivedBody:'我會閱讀你提供的內容，並透過留下的聯絡方式回覆。', backHome:'返回首頁', viewProjects:'瀏覽作品', pageMissing:'這個頁面不存在。', admin:'後台', viewPublic:'查看公開網站', overview:'總覽', inquiries:'詢價管理', settings:'設定', localMode:'本機模式'
  }
} as const;

type MessageKey = keyof typeof messages.en;
type Value = { locale:Locale; setLocale(locale:Locale):void; toggleLocale():void; t(key:MessageKey):string; projectText(project:ProjectItem):{title:string;shortDescription:string;detailedDescription:string;category:string;status:string} };
const LocaleContext = createContext<Value | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => localStorage.getItem('ck_locale') === 'en' ? 'en' : 'zh-TW');
  const setLocale = (next: Locale) => { setLocaleState(next); localStorage.setItem('ck_locale', next); };
  const toggleLocale = () => setLocale(locale === 'en' ? 'zh-TW' : 'en');
  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = locale === 'zh-TW' ? 'CK｜交易、AI、系統與實驗' : 'CK — Trading, AI, Systems & Experiments';
  }, [locale]);
  const t = (key: MessageKey) => messages[locale][key];
  const projectText = (p: ProjectItem) => locale === 'zh-TW'
    ? { title:p.titleZh||p.title, shortDescription:p.shortDescriptionZh||p.shortDescription, detailedDescription:p.detailedDescriptionZh||p.detailedDescription, category:p.categoryZh||p.category, status:p.statusZh||p.status }
    : { title:p.title, shortDescription:p.shortDescription, detailedDescription:p.detailedDescription, category:p.category, status:p.status };
  return <LocaleContext.Provider value={{ locale, setLocale, toggleLocale, t, projectText }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error('useLocale must be inside LocaleProvider');
  return value;
}
