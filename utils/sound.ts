// utils/sound.ts
export const playClickSound = () => {
  try {
    // إنشاء AudioContext
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // إنشاء مصدر الصوت (موجة جيبية بسيطة)
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // توصيل المكونات
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // إعدادات الصوت - صوت نقر لطيف
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    // التحكم في مستوى الصوت
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    // تشغيل الصوت
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (error) {
    // تجاهل الأخطاء (إذا كان المتصفح لا يدعم الصوت)
    console.log('Audio not supported');
  }
};

// صوت مختلف للرجوع
export const playBackSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // صوت مختلف للرجوع - نغمة هابطة
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (error) {
    // تجاهل الأخطاء
  }
};

// صوت للاتصال
export const playConnectSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // صوتين متتاليين للاتصال
    const osc1 = audioContext.createOscillator();
    const osc2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    osc1.type = 'sine';
    osc2.type = 'sine';
    
    // النغمة الأولى
    osc1.frequency.setValueAtTime(400, audioContext.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.1);
    
    // النغمة الثانية بعد قليل
    osc2.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    osc2.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    osc1.start();
    osc2.start(audioContext.currentTime + 0.1);
    
    osc1.stop(audioContext.currentTime + 0.2);
    osc2.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    // تجاهل الأخطاء
  }
};