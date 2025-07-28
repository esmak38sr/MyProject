export type TarotCategory =
  | 'Major Arcana'
  | 'Wands'
  | 'Swords'
  | 'Cups'
  | 'Pentacles';

export interface TarotCard {
  name: string;
  category: TarotCategory;
  meanings: {
    general: string;
    love: string;
    career: string;
    health: string;
  };
}

export const TAROT_CARDS: TarotCard[] = [
  // Major Arcana (22 kart)
  {
    name: 'The Fool',
    category: 'Major Arcana',
    meanings: {
      general: 'Yeni başlangıçlar, macera, saflık, spontanlık.',
      love: 'Aşkta yeni bir başlangıç, heyecan, masumiyet.',
      career: 'Yeni bir iş veya proje, risk alma.',
      health: 'Sağlıkta yenilenme, enerji, iyimserlik.',
    },
  },
  {
    name: 'The Magician',
    category: 'Major Arcana',
    meanings: {
      general: 'Güç, irade, yaratıcılık, beceri.',
      love: 'Aşkta çekicilik ve iletişim, büyüleme.',
      career: 'Başarı ve fırsatlar, yeteneklerini kullanma.',
      health: 'İyileşme gücü, enerji yönetimi.',
    },
  },
  {
    name: 'The High Priestess',
    category: 'Major Arcana',
    meanings: {
      general: 'Sezgi, gizem, içsel bilgelik, sessizlik.',
      love: 'Aşkta sezgisel kararlar, gizli duygular.',
      career: 'Sezgisel kararlar, araştırma, gizli bilgiler.',
      health: 'Sezgisel iyileşme, ruhsal sağlık.',
    },
  },
  {
    name: 'The Empress',
    category: 'Major Arcana',
    meanings: {
      general: 'Bereket, yaratıcılık, doğurganlık, bolluk.',
      love: 'Aşkta bereket, romantizm, doğurganlık.',
      career: 'Yaratıcı projeler, büyüme, bereket.',
      health: 'Doğurganlık, sağlıklı yaşam, bolluk.',
    },
  },
  {
    name: 'The Emperor',
    category: 'Major Arcana',
    meanings: {
      general: 'Güç, otorite, liderlik, istikrar.',
      love: 'Aşkta güçlü liderlik, koruma, istikrar.',
      career: 'Liderlik, otorite, başarı, güç.',
      health: 'Güçlü sağlık, dayanıklılık, istikrar.',
    },
  },
  {
    name: 'The Hierophant',
    category: 'Major Arcana',
    meanings: {
      general: 'Geleneksel değerler, eğitim, maneviyat.',
      love: 'Aşkta geleneksel değerler, evlilik, uyum.',
      career: 'Eğitim, mentorluk, geleneksel yollar.',
      health: 'Geleneksel tedavi, manevi sağlık.',
    },
  },
  {
    name: 'The Lovers',
    category: 'Major Arcana',
    meanings: {
      general: 'Aşk, uyum, seçim, birlik.',
      love: 'Aşkta uyum, seçim, romantik birlik.',
      career: 'İş ortaklığı, uyumlu çalışma.',
      health: 'Aşkın iyileştirici gücü, uyum.',
    },
  },
  {
    name: 'The Chariot',
    category: 'Major Arcana',
    meanings: {
      general: 'Zafer, ilerleme, kararlılık, kontrol.',
      love: 'Aşkta zafer, ilerleme, kararlılık.',
      career: 'Başarı, ilerleme, hedefe ulaşma.',
      health: 'Güçlü irade, iyileşme, kontrol.',
    },
  },
  {
    name: 'Strength',
    category: 'Major Arcana',
    meanings: {
      general: 'Güç, cesaret, sabır, içsel güç.',
      love: 'Aşkta güç, cesaret, sabır.',
      career: 'Güçlü irade, sabır, başarı.',
      health: 'Güçlü sağlık, dayanıklılık, iyileşme.',
    },
  },
  {
    name: 'The Hermit',
    category: 'Major Arcana',
    meanings: {
      general: 'Yalnızlık, içsel yolculuk, rehberlik.',
      love: 'Aşkta yalnızlık, içsel yolculuk.',
      career: 'Tek başına çalışma, rehberlik.',
      health: 'İçsel iyileşme, yalnız zaman.',
    },
  },
  {
    name: 'Wheel of Fortune',
    category: 'Major Arcana',
    meanings: {
      general: 'Değişim, şans, döngüler, kader.',
      love: 'Aşkta değişim, şans, yeni döngüler.',
      career: 'Değişim, şans, yeni fırsatlar.',
      health: 'Değişen sağlık durumu, şans.',
    },
  },
  {
    name: 'Justice',
    category: 'Major Arcana',
    meanings: {
      general: 'Adalet, denge, hakikat, kararlar.',
      love: 'Aşkta adalet, denge, hakikat.',
      career: 'Adalet, denge, doğru kararlar.',
      health: 'Dengeli sağlık, adalet.',
    },
  },
  {
    name: 'The Hanged Man',
    category: 'Major Arcana',
    meanings: {
      general: 'Fedakarlık, bekleme, yeni bakış açısı.',
      love: 'Aşkta fedakarlık, bekleme, sabır.',
      career: 'Fedakarlık, bekleme, yeni bakış.',
      health: 'Tedavi için bekleme, sabır.',
    },
  },
  {
    name: 'Death',
    category: 'Major Arcana',
    meanings: {
      general: 'Dönüşüm, son, yeni başlangıç.',
      love: 'Aşkta dönüşüm, eskinin sonu.',
      career: 'Kariyer değişimi, dönüşüm.',
      health: 'Sağlıkta dönüşüm, yenilenme.',
    },
  },
  {
    name: 'Temperance',
    category: 'Major Arcana',
    meanings: {
      general: 'Denge, ılımlılık, sabır, uyum.',
      love: 'Aşkta denge, ılımlılık, uyum.',
      career: 'Dengeli çalışma, ılımlılık.',
      health: 'Dengeli sağlık, ılımlılık.',
    },
  },
  {
    name: 'The Devil',
    category: 'Major Arcana',
    meanings: {
      general: 'Bağımlılık, karanlık, materyalizm.',
      love: 'Aşkta bağımlılık, karanlık yönler.',
      career: 'İş bağımlılığı, karanlık yönler.',
      health: 'Sağlık bağımlılıkları, karanlık.',
    },
  },
  {
    name: 'The Tower',
    category: 'Major Arcana',
    meanings: {
      general: 'Ani değişim, yıkım, aydınlanma.',
      love: 'Aşkta ani değişim, yıkım.',
      career: 'Ani kariyer değişimi, yıkım.',
      health: 'Ani sağlık değişimi, yıkım.',
    },
  },
  {
    name: 'The Star',
    category: 'Major Arcana',
    meanings: {
      general: 'Umut, ilham, maneviyat, iyileşme.',
      love: 'Aşkta umut, ilham, iyileşme.',
      career: 'Umut, ilham, yeni fırsatlar.',
      health: 'Umut, iyileşme, manevi sağlık.',
    },
  },
  {
    name: 'The Moon',
    category: 'Major Arcana',
    meanings: {
      general: 'Sezgi, yanılsama, gizem, korkular.',
      love: 'Aşkta sezgi, yanılsama, gizem.',
      career: 'Sezgisel kararlar, gizem.',
      health: 'Sezgisel iyileşme, gizem.',
    },
  },
  {
    name: 'The Sun',
    category: 'Major Arcana',
    meanings: {
      general: 'Mutluluk, başarı, enerji, aydınlanma.',
      love: 'Aşkta mutluluk, başarı, enerji.',
      career: 'Başarı, mutluluk, enerji.',
      health: 'Sağlık, mutluluk, enerji.',
    },
  },
  {
    name: 'Judgement',
    category: 'Major Arcana',
    meanings: {
      general: 'Yeniden doğuş, aydınlanma, çağrı.',
      love: 'Aşkta yeniden doğuş, aydınlanma.',
      career: 'Kariyerde yeniden doğuş.',
      health: 'Sağlıkta yeniden doğuş.',
    },
  },
  {
    name: 'The World',
    category: 'Major Arcana',
    meanings: {
      general: 'Tamamlanma, başarı, bütünlük.',
      love: 'Aşkta tamamlanma, başarı.',
      career: 'Kariyerde tamamlanma, başarı.',
      health: 'Sağlıkta tamamlanma, bütünlük.',
    },
  },

  // Wands (14 kart)
  {
    name: 'Ace of Wands',
    category: 'Wands',
    meanings: {
      general: 'Yeni başlangıç, ilham, yaratıcılık.',
      love: 'Aşkta yeni başlangıç, ilham.',
      career: 'Yeni proje, yaratıcılık.',
      health: 'Yeni enerji, yaratıcı iyileşme.',
    },
  },
  {
    name: 'Two of Wands',
    category: 'Wands',
    meanings: {
      general: 'Planlama, karar verme, gelecek.',
      love: 'Aşkta planlama, karar verme.',
      career: 'Kariyer planlaması, kararlar.',
      health: 'Sağlık planlaması, kararlar.',
    },
  },
  {
    name: 'Three of Wands',
    category: 'Wands',
    meanings: {
      general: 'Genişleme, keşif, büyüme.',
      love: 'Aşkta genişleme, yeni deneyimler.',
      career: 'İş genişlemesi, yeni fırsatlar.',
      health: 'Sağlıkta genişleme, yeni yöntemler.',
    },
  },
  {
    name: 'Four of Wands',
    category: 'Wands',
    meanings: {
      general: 'Kutlama, uyum, başarı.',
      love: 'Aşkta kutlama, uyum, başarı.',
      career: 'İş başarısı, kutlama.',
      health: 'Sağlık başarısı, kutlama.',
    },
  },
  {
    name: 'Five of Wands',
    category: 'Wands',
    meanings: {
      general: 'Rekabet, çatışma, meydan okuma.',
      love: 'Aşkta rekabet, çatışma.',
      career: 'İş rekabeti, çatışma.',
      health: 'Sağlık mücadelesi, rekabet.',
    },
  },
  {
    name: 'Six of Wands',
    category: 'Wands',
    meanings: {
      general: 'Zafer, başarı, ilerleme.',
      love: 'Aşkta zafer, başarı.',
      career: 'İş zaferi, başarı.',
      health: 'Sağlık zaferi, iyileşme.',
    },
  },
  {
    name: 'Seven of Wands',
    category: 'Wands',
    meanings: {
      general: 'Savunma, meydan okuma, kararlılık.',
      love: 'Aşkta savunma, kararlılık.',
      career: 'İş savunması, kararlılık.',
      health: 'Sağlık savunması, kararlılık.',
    },
  },
  {
    name: 'Eight of Wands',
    category: 'Wands',
    meanings: {
      general: 'Hızlı hareket, haberler, ilerleme.',
      love: 'Aşkta hızlı gelişme, haberler.',
      career: 'Hızlı iş gelişmesi, haberler.',
      health: 'Hızlı iyileşme, haberler.',
    },
  },
  {
    name: 'Nine of Wands',
    category: 'Wands',
    meanings: {
      general: 'Dayanıklılık, savunma, hazırlık.',
      love: 'Aşkta dayanıklılık, savunma.',
      career: 'İş dayanıklılığı, savunma.',
      health: 'Sağlık dayanıklılığı, savunma.',
    },
  },
  {
    name: 'Ten of Wands',
    category: 'Wands',
    meanings: {
      general: 'Yük, sorumluluk, baskı.',
      love: 'Aşkta yük, sorumluluk.',
      career: 'İş yükü, sorumluluk.',
      health: 'Sağlık yükü, sorumluluk.',
    },
  },
  {
    name: 'Page of Wands',
    category: 'Wands',
    meanings: {
      general: 'Yeni haberler, öğrenme, keşif.',
      love: 'Aşkta yeni haberler, keşif.',
      career: 'Yeni iş haberleri, öğrenme.',
      health: 'Yeni sağlık haberleri, öğrenme.',
    },
  },
  {
    name: 'Knight of Wands',
    category: 'Wands',
    meanings: {
      general: 'Aksiyon, macera, enerji.',
      love: 'Aşkta aksiyon, macera.',
      career: 'İş aksiyonu, macera.',
      health: 'Sağlık aksiyonu, enerji.',
    },
  },
  {
    name: 'Queen of Wands',
    category: 'Wands',
    meanings: {
      general: 'Güçlü kadın, yaratıcılık, bağımsızlık.',
      love: 'Aşkta güçlü kadın, bağımsızlık.',
      career: 'Güçlü kadın lideri, yaratıcılık.',
      health: 'Güçlü kadın sağlığı, bağımsızlık.',
    },
  },
  {
    name: 'King of Wands',
    category: 'Wands',
    meanings: {
      general: 'Güçlü erkek, liderlik, yaratıcılık.',
      love: 'Aşkta güçlü erkek, liderlik.',
      career: 'Güçlü erkek lideri, yaratıcılık.',
      health: 'Güçlü erkek sağlığı, liderlik.',
    },
  },

  // Swords (14 kart)
  {
    name: 'Ace of Swords',
    category: 'Swords',
    meanings: {
      general: 'Keskin zeka, zafer, hakikat.',
      love: 'Aşkta keskin zeka, hakikat.',
      career: 'İş zekası, zafer, hakikat.',
      health: 'Sağlık zekası, zafer.',
    },
  },
  {
    name: 'Two of Swords',
    category: 'Swords',
    meanings: {
      general: 'Kararsızlık, denge, seçim.',
      love: 'Aşkta kararsızlık, seçim.',
      career: 'İş kararsızlığı, seçim.',
      health: 'Sağlık kararsızlığı, seçim.',
    },
  },
  {
    name: 'Three of Swords',
    category: 'Swords',
    meanings: {
      general: 'Kalp kırıklığı, acı, ihanet.',
      love: 'Aşkta kalp kırıklığı, acı.',
      career: 'İş hayal kırıklığı, acı.',
      health: 'Sağlık acısı, ihanet.',
    },
  },
  {
    name: 'Four of Swords',
    category: 'Swords',
    meanings: {
      general: 'Dinlenme, iyileşme, meditasyon.',
      love: 'Aşkta dinlenme, iyileşme.',
      career: 'İş dinlenmesi, iyileşme.',
      health: 'Sağlık dinlenmesi, iyileşme.',
    },
  },
  {
    name: 'Five of Swords',
    category: 'Swords',
    meanings: {
      general: 'Yenilgi, çatışma, kayıp.',
      love: 'Aşkta yenilgi, çatışma.',
      career: 'İş yenilgisi, çatışma.',
      health: 'Sağlık yenilgisi, kayıp.',
    },
  },
  {
    name: 'Six of Swords',
    category: 'Swords',
    meanings: {
      general: 'Geçiş, yolculuk, iyileşme.',
      love: 'Aşkta geçiş, yolculuk.',
      career: 'İş geçişi, yolculuk.',
      health: 'Sağlık geçişi, iyileşme.',
    },
  },
  {
    name: 'Seven of Swords',
    category: 'Swords',
    meanings: {
      general: 'Gizlilik, kaçış, strateji.',
      love: 'Aşkta gizlilik, kaçış.',
      career: 'İş gizliliği, strateji.',
      health: 'Sağlık gizliliği, kaçış.',
    },
  },
  {
    name: 'Eight of Swords',
    category: 'Swords',
    meanings: {
      general: 'Tuzağa düşme, kısıtlama, korku.',
      love: 'Aşkta tuzağa düşme, korku.',
      career: 'İş tuzağı, kısıtlama.',
      health: 'Sağlık tuzağı, korku.',
    },
  },
  {
    name: 'Nine of Swords',
    category: 'Swords',
    meanings: {
      general: 'Endişe, korku, kabuslar.',
      love: 'Aşkta endişe, korku.',
      career: 'İş endişesi, korku.',
      health: 'Sağlık endişesi, kabuslar.',
    },
  },
  {
    name: 'Ten of Swords',
    category: 'Swords',
    meanings: {
      general: 'Son, yenilgi, acı.',
      love: 'Aşkta son, yenilgi.',
      career: 'İş sonu, yenilgi.',
      health: 'Sağlık sonu, acı.',
    },
  },
  {
    name: 'Page of Swords',
    category: 'Swords',
    meanings: {
      general: 'Yeni fikirler, haberler, öğrenme.',
      love: 'Aşkta yeni fikirler, haberler.',
      career: 'Yeni iş fikirleri, öğrenme.',
      health: 'Yeni sağlık fikirleri, haberler.',
    },
  },
  {
    name: 'Knight of Swords',
    category: 'Swords',
    meanings: {
      general: 'Hızlı aksiyon, cesaret, çatışma.',
      love: 'Aşkta hızlı aksiyon, cesaret.',
      career: 'Hızlı iş aksiyonu, cesaret.',
      health: 'Hızlı sağlık aksiyonu, cesaret.',
    },
  },
  {
    name: 'Queen of Swords',
    category: 'Swords',
    meanings: {
      general: 'Keskin zeka, bağımsızlık, adalet.',
      love: 'Aşkta keskin zeka, bağımsızlık.',
      career: 'Keskin iş zekası, adalet.',
      health: 'Keskin sağlık zekası, bağımsızlık.',
    },
  },
  {
    name: 'King of Swords',
    category: 'Swords',
    meanings: {
      general: 'Güçlü zeka, liderlik, adalet.',
      love: 'Aşkta güçlü zeka, liderlik.',
      career: 'Güçlü iş zekası, liderlik.',
      health: 'Güçlü sağlık zekası, adalet.',
    },
  },

  // Cups (14 kart)
  {
    name: 'Ace of Cups',
    category: 'Cups',
    meanings: {
      general: 'Aşk, duygular, yaratıcılık.',
      love: 'Aşkta yeni başlangıç, duygular.',
      career: 'Yaratıcı iş, duygusal başarı.',
      health: 'Duygusal sağlık, yaratıcılık.',
    },
  },
  {
    name: 'Two of Cups',
    category: 'Cups',
    meanings: {
      general: 'Aşk, uyum, ortaklık.',
      love: 'Aşkta uyum, ortaklık.',
      career: 'İş ortaklığı, uyum.',
      health: 'Sağlık ortaklığı, uyum.',
    },
  },
  {
    name: 'Three of Cups',
    category: 'Cups',
    meanings: {
      general: 'Kutlama, arkadaşlık, neşe.',
      love: 'Aşkta kutlama, arkadaşlık.',
      career: 'İş kutlaması, arkadaşlık.',
      health: 'Sağlık kutlaması, neşe.',
    },
  },
  {
    name: 'Four of Cups',
    category: 'Cups',
    meanings: {
      general: 'Can sıkıntısı, kaçırılan fırsatlar.',
      love: 'Aşkta can sıkıntısı, kaçırılan fırsatlar.',
      career: 'İş can sıkıntısı, kaçırılan fırsatlar.',
      health: 'Sağlık can sıkıntısı, kaçırılan fırsatlar.',
    },
  },
  {
    name: 'Five of Cups',
    category: 'Cups',
    meanings: {
      general: 'Hayal kırıklığı, kayıp, üzüntü.',
      love: 'Aşkta hayal kırıklığı, kayıp.',
      career: 'İş hayal kırıklığı, kayıp.',
      health: 'Sağlık hayal kırıklığı, üzüntü.',
    },
  },
  {
    name: 'Six of Cups',
    category: 'Cups',
    meanings: {
      general: 'Nostalji, çocukluk, masumiyet.',
      love: 'Aşkta nostalji, masumiyet.',
      career: 'İş nostaljisi, çocukluk.',
      health: 'Sağlık nostaljisi, masumiyet.',
    },
  },
  {
    name: 'Seven of Cups',
    category: 'Cups',
    meanings: {
      general: 'Seçenekler, hayaller, kararsızlık.',
      love: 'Aşkta seçenekler, hayaller.',
      career: 'İş seçenekleri, hayaller.',
      health: 'Sağlık seçenekleri, kararsızlık.',
    },
  },
  {
    name: 'Eight of Cups',
    category: 'Cups',
    meanings: {
      general: 'Ayrılış, arayış, değişim.',
      love: 'Aşkta ayrılış, arayış.',
      career: 'İş ayrılışı, arayış.',
      health: 'Sağlık ayrılışı, değişim.',
    },
  },
  {
    name: 'Nine of Cups',
    category: 'Cups',
    meanings: {
      general: 'Memnuniyet, arzular, başarı.',
      love: 'Aşkta memnuniyet, arzular.',
      career: 'İş memnuniyeti, başarı.',
      health: 'Sağlık memnuniyeti, arzular.',
    },
  },
  {
    name: 'Ten of Cups',
    category: 'Cups',
    meanings: {
      general: 'Aile mutluluğu, uyum, tamamlanma.',
      love: 'Aşkta aile mutluluğu, uyum.',
      career: 'İş aile mutluluğu, tamamlanma.',
      health: 'Aile sağlığı, uyum.',
    },
  },
  {
    name: 'Page of Cups',
    category: 'Cups',
    meanings: {
      general: 'Yaratıcı haberler, duygular, öğrenme.',
      love: 'Aşkta yaratıcı haberler, duygular.',
      career: 'Yaratıcı iş haberleri, öğrenme.',
      health: 'Yaratıcı sağlık haberleri, duygular.',
    },
  },
  {
    name: 'Knight of Cups',
    category: 'Cups',
    meanings: {
      general: 'Romantik aksiyon, duygular, aşk.',
      love: 'Aşkta romantik aksiyon, duygular.',
      career: 'Romantik iş aksiyonu, duygular.',
      health: 'Romantik sağlık aksiyonu, aşk.',
    },
  },
  {
    name: 'Queen of Cups',
    category: 'Cups',
    meanings: {
      general: 'Duygusal kadın, sezgi, şefkat.',
      love: 'Aşkta duygusal kadın, sezgi.',
      career: 'Duygusal iş kadını, şefkat.',
      health: 'Duygusal sağlık kadını, sezgi.',
    },
  },
  {
    name: 'King of Cups',
    category: 'Cups',
    meanings: {
      general: 'Duygusal erkek, liderlik, şefkat.',
      love: 'Aşkta duygusal erkek, liderlik.',
      career: 'Duygusal iş erkeği, şefkat.',
      health: 'Duygusal sağlık erkeği, liderlik.',
    },
  },

  // Pentacles (14 kart)
  {
    name: 'Ace of Pentacles',
    category: 'Pentacles',
    meanings: {
      general: 'Maddi fırsat, bolluk, başarı.',
      love: 'Aşkta maddi fırsat, bolluk.',
      career: 'Maddi iş fırsatı, başarı.',
      health: 'Maddi sağlık fırsatı, bolluk.',
    },
  },
  {
    name: 'Two of Pentacles',
    category: 'Pentacles',
    meanings: {
      general: 'Denge, uyum, esneklik.',
      love: 'Aşkta denge, uyum.',
      career: 'İş dengesi, esneklik.',
      health: 'Sağlık dengesi, uyum.',
    },
  },
  {
    name: 'Three of Pentacles',
    category: 'Pentacles',
    meanings: {
      general: 'Takım çalışması, beceri, işbirliği.',
      love: 'Aşkta takım çalışması, işbirliği.',
      career: 'İş takım çalışması, beceri.',
      health: 'Sağlık takım çalışması, işbirliği.',
    },
  },
  {
    name: 'Four of Pentacles',
    category: 'Pentacles',
    meanings: {
      general: 'Maddi güvenlik, koruma, cimrilik.',
      love: 'Aşkta maddi güvenlik, koruma.',
      career: 'İş maddi güvenliği, koruma.',
      health: 'Sağlık maddi güvenliği, cimrilik.',
    },
  },
  {
    name: 'Five of Pentacles',
    category: 'Pentacles',
    meanings: {
      general: 'Maddi zorluk, yoksulluk, izolasyon.',
      love: 'Aşkta maddi zorluk, izolasyon.',
      career: 'İş maddi zorluğu, yoksulluk.',
      health: 'Sağlık maddi zorluğu, izolasyon.',
    },
  },
  {
    name: 'Six of Pentacles',
    category: 'Pentacles',
    meanings: {
      general: 'Cömertlik, yardım, paylaşım.',
      love: 'Aşkta cömertlik, yardım.',
      career: 'İş cömertliği, paylaşım.',
      health: 'Sağlık cömertliği, yardım.',
    },
  },
  {
    name: 'Seven of Pentacles',
    category: 'Pentacles',
    meanings: {
      general: 'Sabır, yatırım, bekleme.',
      love: 'Aşkta sabır, yatırım.',
      career: 'İş sabrı, yatırım.',
      health: 'Sağlık sabrı, bekleme.',
    },
  },
  {
    name: 'Eight of Pentacles',
    category: 'Pentacles',
    meanings: {
      general: 'Çalışma, beceri geliştirme, öğrenme.',
      love: 'Aşkta çalışma, beceri geliştirme.',
      career: 'İş çalışması, öğrenme.',
      health: 'Sağlık çalışması, beceri geliştirme.',
    },
  },
  {
    name: 'Nine of Pentacles',
    category: 'Pentacles',
    meanings: {
      general: 'Bağımsızlık, lüks, başarı.',
      love: 'Aşkta bağımsızlık, lüks.',
      career: 'İş bağımsızlığı, başarı.',
      health: 'Sağlık bağımsızlığı, lüks.',
    },
  },
  {
    name: 'Ten of Pentacles',
    category: 'Pentacles',
    meanings: {
      general: 'Aile zenginliği, miras, güvenlik.',
      love: 'Aşkta aile zenginliği, güvenlik.',
      career: 'İş aile zenginliği, miras.',
      health: 'Aile sağlık zenginliği, güvenlik.',
    },
  },
  {
    name: 'Page of Pentacles',
    category: 'Pentacles',
    meanings: {
      general: 'Maddi haberler, öğrenme, fırsat.',
      love: 'Aşkta maddi haberler, fırsat.',
      career: 'Maddi iş haberleri, öğrenme.',
      health: 'Maddi sağlık haberleri, fırsat.',
    },
  },
  {
    name: 'Knight of Pentacles',
    category: 'Pentacles',
    meanings: {
      general: 'Çalışkan aksiyon, güvenilirlik, sabır.',
      love: 'Aşkta çalışkan aksiyon, güvenilirlik.',
      career: 'Çalışkan iş aksiyonu, sabır.',
      health: 'Çalışkan sağlık aksiyonu, güvenilirlik.',
    },
  },
  {
    name: 'Queen of Pentacles',
    category: 'Pentacles',
    meanings: {
      general: 'Maddi kadın, bereket, pratiklik.',
      love: 'Aşkta maddi kadın, bereket.',
      career: 'Maddi iş kadını, pratiklik.',
      health: 'Maddi sağlık kadını, bereket.',
    },
  },
  {
    name: 'King of Pentacles',
    category: 'Pentacles',
    meanings: {
      general: 'Maddi erkek, liderlik, güvenilirlik.',
      love: 'Aşkta maddi erkek, liderlik.',
      career: 'Maddi iş erkeği, güvenilirlik.',
      health: 'Maddi sağlık erkeği, liderlik.',
    },
  },
]; 