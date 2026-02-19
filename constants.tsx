
import { Section, Language } from './types';

const t = {
  en: {
    strategic: "STRATEGIC ELEMENT",
    archived: "ARCHIVED CORE",
    standard: "SYSTEM STANDARD",
    shield: "PROPRIETARY SHIELD",
    opCore: "OPERATIONAL CORE",
    deep: "v2.4 / LEVEL-A COMPLIANT / 98.2% EFFICIENCY RATE",
    os: "OPERATING SYSTEM",
    product: "PRODUCT",
    production: "PRODUCTION CORE",
    plan: "OPERATING PLAN",
    pos: "POINT OF SALE",
    market: "MARKET TAKEOVER",
    financial: "FINANCIAL STRUCTURE",
    funding: "SELF-FUNDING",
    central: "CENTRAL",
    topic: "TOPIC",
    system: "SYSTEM",
    status: "STATUS",
    operational: "OPERATIONAL",
    version: "SYSTEM_VER",
    coordX: "X_COORD",
    coordY: "Y_COORD"
  },
  ar: {
    strategic: "عنصر استراتيجي",
    archived: "جوهر مؤرشف",
    standard: "معيار النظام",
    shield: "درع الملكية",
    opCore: "النواة التشغيلية",
    deep: "الإصدار 2.4 / متوافق مع المستوى أ / معدل كفاءة 98.2%",
    os: "نظام التشغيل",
    product: "المنتج",
    production: "جوهر الإنتاج",
    plan: "خطة التشغيل",
    pos: "نقاط البيع",
    market: "الاستحواذ على السوق",
    financial: "الهيكل المالي",
    funding: "التمويل الذاتي",
    central: "مركزي",
    topic: "موضوع",
    system: "النظام",
    status: "الحالة",
    operational: "يعمل",
    version: "إصدار_النظام",
    coordX: "إحداثي_س",
    coordY: "إحداثي_ص"
  }
};

const generateTopics = (sectionPrefix: string, lang: Language): any[] => {
  const topics = [];
  const trans = t[lang];
  for (let i = 1; i <= 8; i++) {
    const isLocked = i > 3;
    const topicNum = i.toString().padStart(2, '0');
    // For Arabic, we use the localized word for topic
    const topicTitle = `${trans.topic} ${topicNum}: ${isLocked ? trans.archived : trans.strategic}`;
    
    topics.push({
      id: `${sectionPrefix}-T${i}`,
      title: topicTitle,
      isLocked: isLocked,
      options: isLocked ? undefined : [
        {
          id: `${sectionPrefix}-T${i}-O1`,
          title: trans.standard,
          isLocked: false,
          deepInfo: { content: trans.deep }
        },
        {
          id: `${sectionPrefix}-T${i}-O2`,
          title: trans.shield,
          isLocked: true
        },
        {
          id: `${sectionPrefix}-T${i}-O3`,
          title: trans.opCore,
          isLocked: true
        }
      ]
    });
  }
  return topics;
};

export const getSections = (lang: Language): Section[] => {
  const trans = t[lang];
  return [
    { id: 'os', number: '00', title: trans.os, topics: generateTopics('OS', lang) },
    { id: 'product', number: '01', title: trans.product, topics: generateTopics('PROD', lang) },
    { id: 'production', number: '02', title: trans.production, topics: generateTopics('CORE', lang) },
    { id: 'plan', number: '03', title: trans.plan, topics: generateTopics('PLAN', lang) },
    { id: 'pos', number: '04', title: trans.pos, topics: generateTopics('POS', lang) },
    { id: 'market', number: '05', title: trans.market, topics: generateTopics('MARKET', lang) },
    { id: 'financial', number: '06', title: trans.financial, topics: generateTopics('FIN', lang) },
    { id: 'funding', number: '07', title: trans.funding, topics: generateTopics('FUND', lang) }
  ];
};

export const UI_STRINGS = t;
