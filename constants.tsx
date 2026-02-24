import { Section, Language } from './types';

const t = {
  en: {
    strategic: "PERFORMANCE UNIT",
    archived: "SERVICE RESTRICTED",
    standard: "DRIVE PROTOCOL",
    shield: "FACTORY ENCRYPTION",
    opCore: "ENGINE CORE",
    deep: "V12 BI-TURBO / 980HP / 100% CALIBRATED",
    os: "MAIN DASHBOARD",
    product: "CHASSIS",
    production: "POWERTRAIN",
    plan: "DRIVE MAPS",
    pos: "DEALER NETWORK",
    market: "TRACK DOMINANCE",
    financial: "REVENUE FLOW",
    funding: "CAPITAL GEARS",
    central: "CENTRAL",
    topic: "UNIT",
    system: "MOTORS",
    status: "STATUS",
    operational: "IGNITION READY",
    version: "DRIVE_VER",
    coordX: "THR_POS",
    coordY: "RPM_LVL"
  },
  ar: {
    strategic: "وحدة الأداء",
    archived: "الخدمة مقيدة",
    standard: "بروتوكول القيادة",
    shield: "تشفير المصنع",
    opCore: "نواة المحرك",
    deep: "V12 تربو مزدوج / 980 حصان / معاير بنسبة 100%",
    os: "لوحة القيادة الرئيسية",
    product: "الهيكل",
    production: "ناقل الحركة",
    plan: "خرائط القيادة",
    pos: "شبكة الوكلاء",
    market: "الهيمنة على الحلبة",
    financial: "التدفق المالي",
    funding: "تروس رأس المال",
    central: "مركزي",
    topic: "وحدة",
    system: "المحركات",
    status: "الحالة",
    operational: "جاهز للتشغيل",
    version: "إصدار_القيادة",
    coordX: "موقع_الخنق",
    coordY: "مستوى_الدوران"
  }
};

const generateTopics = (sectionPrefix: string, lang: Language): any[] => {
  const topics = [];
  const trans = t[lang];
  for (let i = 1; i <= 8; i++) {
    const isLocked = i > 3;
    const topicNum = i.toString().padStart(2, '0');
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