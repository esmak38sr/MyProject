import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Haptics from 'expo-haptics';
import type { User } from 'firebase/auth';
import { browserLocalPersistence, browserSessionPersistence, createUserWithEmailAndPassword, deleteUser, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signOut, updatePassword } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import type { TextInput as RNTextInput } from 'react-native';
import { Image, ImageBackground, KeyboardAvoidingView, Linking, Modal, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { TAROT_CARDS } from '../components/TarotCardsData';
import { auth, db } from '../firebaseConfig';

// 1. translations objesi (güncellenmiş anahtarlar dahil)
const translations: Record<'tr' | 'en', Record<string, string>> = {
  tr: {
    welcome: "Hoş geldin",
    login: "Giriş Yap",
    register: "Üye Ol",
    enter_invite_code: "Davet Kodu Girişi",
    invite_code_placeholder: "Davet kodunu girin",
    invite_code_error: "Davet kodu yanlış!",
    what_is_invite_code: "Davet kodu nedir?",
    invite_code_info: "Davet kodu algoritması: {'\\n'}Ayın sayısal karşılığı ilk veya ilk iki haneyi verecek. Örnek: 3. aydaysak 3XXXX, 12. aydaysak 12XXXX {'\\n'}Gün son haneyi verecek. Örnek: 12. ayın 8. günündeysek 12XX8 {'\\n'}Ortadaki iki hane yılı versin. XX25XX {'\\n'}2025 yılının 12. ayının 8. günü için: 12258",
    submit: "Giriş Yap",
    close: "Kapat",
    categories: "Kategoriler",
    love: "Aşk",
    health: "Sağlık",
    career: "Kariyer",
    general: "Genel",
    settings: "Ayarlar",
    profile: "Profil",
    edit_profile: "Profili Düzenle",
    theme: "Tema",
    dark_mode: "Karanlık Mod",
    light_mode: "Aydınlık Mod",
    language: "Dil",
    turkish: "Türkçe",
    english: "English",
    uygulama_sesi: "Uygulama Sesi",
    notification_sound: "Bildirim Sesi",
    logout: "Çıkış Yap",
    delete_account: "Hesabımı Sil",
    home: "Ana Sayfa",
    category: "Kategori",
    settings_tab: "Ayarlar",
    horoscope: "Burç Yorumu",
    show_horoscope: "Burç Yorumu",
    show_compatibility: "Burç Uyumu",
    show_rising: "Yükselen Hesapla",
    todays_tarot: "Günün Tarotu",
    select: "Seç",
    name: "Ad",
    surname: "Soyad",
    email: "E-posta",
    password: "Şifre",
    password_repeat: "Şifre (Tekrar)",
    no_account: "Hesabınız yok mu? Üye Ol",
    have_account: "Zaten hesabınız var mı? Giriş Yap",
    save: "Kaydet",
    gender: "Cinsiyet",
    birth_date: "Doğum Tarihi",
    birth_time: "Doğum Saati",
    birth_place: "Doğum Yeri",
    zodiac: "Burç",
    job: "Meslek",
    relationship: "İlişki Durumu",
    error_password_match: "Şifreler eşleşmiyor",
    error_password_rule: "Şifrenizde en az bir tane büyük harf ve en az bir rakam kullanmalısınız",
    register_success: "Kayıt başarılı! Giriş yapabilirsiniz.",
    register_fail: "Kayıt başarısız:",
    login_fail: "Giriş başarısız:",
    show_compatibility_button: "Uyumu Göster",
    compatibility: "Burç Uyumu",
    select_first_sign: "1. Burç Seç",
    select_second_sign: "2. Burç Seç",
    select_day: "Gün Seç",
    select_month: "Ay Seç",
    select_year: "Yıl Seç",
    select_hour: "Saat Seç",
    select_minute: "Dakika Seç",
    select_city: "Şehir Seç",
    calculate: "Hesapla",
    rising_result: "Yükselen Burcunuz:",
    select_gender: "Cinsiyet Seç",
    select_job: "Meslek Seç",
    select_relationship: "İlişki Durumu Seç",
    loading_login: "Giriş Yapılıyor...",
    loading_register: "Kayıt Olunuyor...",
    genel: "Genel",
    ask: "Aşk",
    kariyer: "Kariyer",
    saglik: "Sağlık",
    tarot_meaning: "Kartın anlamını görmek için karta tıkla",
    select_cards: "3 Kart Seç",
    comment: "Yorum",
    reversed: "(Ters)",
    normal: "(Düz)",
    gender_1: "Cinsiyet 1",
    gender_2: "Cinsiyet 2",
    select_zodiac: "Burç Seç",
    select_hour_minute: "Saat ve Dakika Seç",
    // ... diğer metinler
  },
  en: {
    welcome: "Welcome",
    login: "Login",
    register: "Sign Up",
    enter_invite_code: "Enter Invite Code",
    invite_code_placeholder: "Enter invite code",
    invite_code_error: "Invite code is incorrect!",
    what_is_invite_code: "What is the invite code?",
    invite_code_info: "Invite code algorithm: {'\\n'}The month's number gives the first one or two digits. E.g., if it's March: 3XXXX, if December: 12XXXX {'\\n'}The day gives the last digit. E.g., December 8: 12XX8 {'\\n'}The middle two digits are the year. XX25XX {'\\n'}For December 8, 2025: 12258",
    submit: "Submit",
    close: "Close",
    categories: "Categories",
    love: "Love",
    health: "Health",
    career: "Career",
    general: "General",
    settings: "Settings",
    profile: "Profile",
    edit_profile: "Edit Profile",
    theme: "Theme",
    dark_mode: "Dark Mode",
    light_mode: "Light Mode",
    language: "Language",
    turkish: "Turkish",
    english: "English",
    uygulama_sesi: "App Sound",
    notification_sound: "Notification Sound",
    logout: "Logout",
    delete_account: "Delete Account",
    home: "Home",
    category: "Category",
    settings_tab: "Settings",
    horoscope: "Horoscope",
    show_horoscope: "Horoscope",
    show_compatibility: "Compatibility",
    show_rising: "Calculate Rising",
    todays_tarot: "Today's Tarot",
    select: "Select",
    name: "Name",
    surname: "Surname",
    email: "Email",
    password: "Password",
    password_repeat: "Password (Repeat)",
    no_account: "Don't have an account? Sign Up",
    have_account: "Already have an account? Login",
    save: "Save",
    gender: "Gender",
    birth_date: "Birth Date",
    birth_time: "Birth Time",
    birth_place: "Birth Place",
    zodiac: "Zodiac",
    job: "Job",
    relationship: "Relationship Status",
    error_password_match: "Passwords do not match",
    error_password_rule: "Your password must contain at least one uppercase letter and one number",
    register_success: "Registration successful! You can now log in.",
    register_fail: "Registration failed:",
    login_fail: "Login failed:",
    show_compatibility_button: "Show Compatibility",
    compatibility: "Compatibility",
    select_first_sign: "Select 1st Sign",
    select_second_sign: "Select 2nd Sign",
    select_day: "Select Day",
    select_month: "Select Month",
    select_year: "Select Year",
    select_hour: "Select Hour",
    select_minute: "Select Minute",
    select_city: "Select City",
    calculate: "Calculate",
    rising_result: "Your Rising Sign:",
    select_gender: "Select Gender",
    select_job: "Select Job",
    select_relationship: "Select Relationship Status",
    loading_login: "Logging in...",
    loading_register: "Registering...",
    genel: "General",
    ask: "Love",
    kariyer: "Career",
    saglik: "Health",
    tarot_meaning: "Tap the card to see its meaning",
    select_cards: "Select 3 Cards",
    comment: "Comment",
    reversed: "(Reversed)",
    normal: "(Upright)",
    gender_1: "Gender 1",
    gender_2: "Gender 2",
    select_zodiac: "Select Zodiac",
    select_hour_minute: "Select Hour and Minute",
    // ... diğer metinler
  }
};

function generateInviteCode(date = new Date()) {
  const month = date.getMonth() + 1;
  const year = date.getFullYear() % 100;
  const day = date.getDate();
  return `${month}${year}${day}`;
}

// Yardımcı fonksiyon: temaya göre renk döndür
const themed = (theme: 'light' | 'dark', light: string, dark: string) => theme === 'dark' ? dark : light;

// Gelişmiş temalı renkler
const themeColors = (theme: 'light' | 'dark') => ({
  bg: theme === 'dark' ? '#0A0A0A' : '#fff',
  card: theme === 'dark' ? '#1A1A1A' : '#f4f4f7',
  modal: theme === 'dark' ? '#1A1A1A' : '#fff',
  border: theme === 'dark' ? '#333333' : '#eee',
  text: theme === 'dark' ? '#FFFFFF' : '#222',
  subtext: theme === 'dark' ? '#CCCCCC' : '#666',
  accent: '#D4AF37',
  accentText: '#222',
  inputBg: theme === 'dark' ? '#1A1A1A' : '#fafafa',
  inputBorder: theme === 'dark' ? '#333333' : '#ccc',
  placeholder: theme === 'dark' ? '#888888' : '#aaa',
  error: '#e74c3c',
  warning: '#B8860B',
  success: '#B8860B',
  buttonBg: theme === 'dark' ? '#D4AF37' : '#D4AF37',
  buttonText: '#222',
  danger: theme === 'dark' ? '#c0392b' : '#e74c3c',
  dangerBorder: theme === 'dark' ? '#e74c3c' : '#e74c3c',
  switchTrack: '#C0C0C0',
  switchThumb: '#888888',
  bar: theme === 'dark' ? '#0A0A0A' : '#f8f8f8',
  barBorder: theme === 'dark' ? '#1A1A1A' : '#e0e0e0',
});

// Burç uyumu veri yapısı (RootLayout fonksiyonu DIŞINDA tanımlanmalı)
const burclar = [
  'Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'
];
const cinsiyetler = ['Kadın', 'Erkek', 'Diğer'];

// Her burç-burç-cinsiyet kombinasyonu için uzun ve detaylı açıklamalar
const burcUyumlari: Record<string, Record<string, Record<string, {
  genel: string;
  ask: string;
  saglik: string;
  kariyer: string;
}>>> = {};

// Koç-Koç
burcUyumlari['Koç'] = burcUyumlari['Koç'] || {};
burcUyumlari['Koç']['Koç'] = {
  Kadın: {
    genel: "İki Koç kadını bir araya geldiğinde, enerji ve tutku adeta patlama yaşar. Her ikisi de lider ruhlu, bağımsız ve cesurdur. Bu ilişkide rekabet ve heyecan hiç eksik olmaz. Zaman zaman inatçılık ve sabırsızlık yüzünden tartışmalar yaşanabilir, ancak birlikte hareket etmeyi öğrenirlerse, bu ilişki hem eğlenceli hem de ilham verici olur. Ortak hedefler için birlikte mücadele etmek, bu ilişkinin temel taşlarından biridir. Birlikte seyahat etmek, yeni hobiler keşfetmek ve sosyal ortamlarda bulunmak bu çiftin enerjisini yükseltir. Ancak, iki taraf da kendi alanına ve özgürlüğüne önem verdiği için, karşılıklı saygı ve anlayış şarttır. Zaman zaman yaşanan tartışmalar, ilişkinin dinamiğini artırabilir. Empati ve hoşgörü ile bu sorunlar kolayca aşılır. Birlikte yeni projelere başlamak, sosyal çevrelerinde aktif rol almak ve birbirlerine ilham vermek bu ilişkinin güçlü yanlarıdır.",
    ask: "Aşk hayatınızda tutku ve heyecan ön planda olacak. İlişkisi olan Koçlar partnerleriyle daha derin bağlar kuracak, yalnız olanlar ise sürpriz bir aşka yelken açabilir. Duygularınızı açıkça ifade etmekten çekinmeyin. Bu yıl, ilişkilerde dürüstlük ve açıklık size kazandıracak. Zaman zaman sabırsızlık gösterebilir, karşı tarafı zorlayabilirsiniz; empati kurmaya çalışın. Romantik sürprizler ve yeni başlangıçlar için harika bir dönem. Özellikle yaz aylarında aşk hayatınızda önemli gelişmeler yaşayabilirsiniz. Partnerinizle ortak aktiviteler yapmak, birlikte seyahat etmek ilişkinizi güçlendirecek. Eğer yalnızsanız, sosyal ortamlarda tanışacağınız kişilerle güçlü bağlar kurabilirsiniz. Ancak acele etmemeye ve karşı tarafı tanımaya zaman ayırmaya özen gösterin. Duygusal olgunluk kazanacak ve ilişkilerde daha dengeli davranacaksınız. Geçmişte yaşadığınız aşk acılarından ders alarak, yeni ilişkilerde daha bilinçli davranacaksınız.",
    saglik: "Yüksek enerji ve hareketlilik, bu çiftin sağlığını olumlu etkiler. Spor ve açık hava aktiviteleri birlikte yapılabilir. Ancak, stres ve baş ağrılarına dikkat edilmelidir. Koç kadını için fiziksel aktivite ve sağlıklı yaşam tarzı çok önemlidir. Birlikte yoga, pilates veya doğa yürüyüşleri yapmak hem bedensel hem de ruhsal dengeyi sağlar. Zaman zaman aşırıya kaçan tempoları nedeniyle dinlenmeye de özen göstermelidirler. Sağlıklı beslenme ve düzenli uyku, enerjilerini yüksek tutmalarına yardımcı olur. Ayrıca, birlikte yeni spor dallarını denemek ve motivasyonlarını artırmak için birbirlerine destek olabilirler.",
    kariyer: "İki Koç birlikte çalıştığında, yenilikçi projeler ve hızlı kararlar öne çıkar. Ancak, liderlik konusunda anlaşmazlık yaşanabilir. Takım çalışmasına önem vermeleri gerekir. Ortak bir hedef belirleyip, güçlerini birleştirirlerse büyük başarılar elde edebilirler. Ancak, rekabetin dozu kaçarsa, iş ortamında gerginlik yaşanabilir. Açık iletişim ve görev paylaşımı ile bu sorunlar kolayca aşılır. Birlikte yeni iş fikirleri geliştirmek, girişimcilik projelerine atılmak ve birbirlerini motive etmek bu ikilinin kariyer hayatında öne çıkan özelliklerdir. Sabırlı ve planlı hareket ettiklerinde, uzun vadeli başarılar elde edebilirler."
  },
  Erkek: {
    genel: "İki Koç erkeği bir araya geldiğinde, rekabet ve liderlik ön plandadır. Anlayış ve sabır bu ilişkinin anahtarıdır. Birlikte büyük işler başarabilirler. Her ikisi de bağımsızlığına düşkün olduğu için, ilişkide özgürlük ve bireysellik önemlidir. Ortak aktiviteler ve spor, bu ilişkinin enerjisini yükseltir. Zaman zaman yaşanan tartışmalar, ilişkinin dinamiğini artırabilir. Ancak, empati ve hoşgörü ile bu sorunlar kolayca aşılır. Birlikte yeni projelere başlamak, sosyal çevrelerinde aktif rol almak ve birbirlerine ilham vermek bu ilişkinin güçlü yanlarıdır.",
    ask: "Aşk hayatında kıskançlık ve tutku bir arada olabilir. Açık iletişimle sorunlar aşılır. Koç erkeği için aşk, heyecan ve özgürlükle iç içedir. Birlikte yeni deneyimler yaşamak, ilişkinin canlı kalmasını sağlar. Zaman zaman yaşanan tartışmalar, ilişkinin dinamiğini artırabilir. Ancak, empati ve hoşgörü ile bu sorunlar kolayca aşılır. Romantik sürprizler ve yeni başlangıçlar için harika bir dönemdir. Partnerinizle ortak aktiviteler yapmak, birlikte seyahat etmek ilişkinizi güçlendirecek. Eğer yalnızsanız, sosyal ortamlarda tanışacağınız kişilerle güçlü bağlar kurabilirsiniz.",
    saglik: "Enerji yüksek, ancak stres yönetimine dikkat edilmeli. Birlikte spor yapmak, sağlıklı yaşam alışkanlıkları geliştirmek için idealdir. Zaman zaman aşırıya kaçan tempoları nedeniyle dinlenmeye de özen göstermelidirler. Sağlıklı beslenme ve düzenli uyku, enerjilerini yüksek tutmalarına yardımcı olur. Ayrıca, birlikte yeni spor dallarını denemek ve motivasyonlarını artırmak için birbirlerine destek olabilirler.",
    kariyer: "İş ortamında hızlı kararlar ve yenilikçi projeler öne çıkar. Ancak, liderlik konusunda anlaşmazlık yaşanabilir. Takım çalışmasına önem vermeleri gerekir. Ortak bir hedef belirleyip, güçlerini birleştirirlerse büyük başarılar elde edebilirler. Açık iletişim ve görev paylaşımı ile bu sorunlar kolayca aşılır. Birlikte yeni iş fikirleri geliştirmek, girişimcilik projelerine atılmak ve birbirlerini motive etmek bu ikilinin kariyer hayatında öne çıkan özelliklerdir. Sabırlı ve planlı hareket ettiklerinde, uzun vadeli başarılar elde edebilirler."
  },
  Diğer: {
    genel: "İki Koç bireyi bir araya geldiğinde enerji ve motivasyon yüksektir. Ortak hedefler için birlikte hareket edebilirler. Sosyal çevrelerinde aktif rol alırlar ve yeni projelere öncülük ederler. Zaman zaman yaşanan tartışmalar, ilişkinin dinamiğini artırabilir. Ancak, empati ve hoşgörü ile bu sorunlar kolayca aşılır. Birlikte yeni projelere başlamak, sosyal çevrelerinde aktif rol almak ve birbirlerine ilham vermek bu ilişkinin güçlü yanlarıdır.",
    ask: "Aşk hayatında heyecan ve macera ön plandadır. Birlikte yeni deneyimler yaşamak, ilişkinin canlı kalmasını sağlar. Zaman zaman yaşanan tartışmalar, ilişkinin dinamiğini artırabilir. Ancak, empati ve hoşgörü ile bu sorunlar kolayca aşılır. Romantik sürprizler ve yeni başlangıçlar için harika bir dönemdir. Partnerinizle ortak aktiviteler yapmak, birlikte seyahat etmek ilişkinizi güçlendirecek. Eğer yalnızsanız, sosyal ortamlarda tanışacağınız kişilerle güçlü bağlar kurabilirsiniz.",
    saglik: "Birlikte hareketli aktiviteler yapmak faydalı olur. Spor ve açık hava aktiviteleri birlikte yapılabilir. Zaman zaman aşırıya kaçan tempoları nedeniyle dinlenmeye de özen göstermelidirler. Sağlıklı beslenme ve düzenli uyku, enerjilerini yüksek tutmalarına yardımcı olur. Ayrıca, birlikte yeni spor dallarını denemek ve motivasyonlarını artırmak için birbirlerine destek olabilirler.",
    kariyer: "Takım çalışmasında liderlik paylaşımı önemlidir. Ortak bir hedef belirleyip, güçlerini birleştirirlerse büyük başarılar elde edebilirler. Açık iletişim ve görev paylaşımı ile bu sorunlar kolayca aşılır. Birlikte yeni iş fikirleri geliştirmek, girişimcilik projelerine atılmak ve birbirlerini motive etmek bu ikilinin kariyer hayatında öne çıkan özelliklerdir. Sabırlı ve planlı hareket ettiklerinde, uzun vadeli başarılar elde edebilirler."
  }
};
// ... (Tüm diğer burç-burç-cinsiyet kombinasyonları için aynı şekilde uzun açıklamalar ekleyeceğim)

// Koç-Boğa
burcUyumlari['Koç']['Boğa'] = {
  Kadın: {
    genel: "Koç kadını ve Boğa kadını bir araya geldiğinde, Koç'un enerjisi ve atılganlığı Boğa'nın huzur ve istikrar arayışıyla buluşur. Bu ilişkide heyecan ve güven bir aradadır. Koç'un aceleciliği ile Boğa'nın temkinliliği zaman zaman çatışmalara yol açabilir. Ancak, doğru iletişim ve karşılıklı anlayış ile bu ilişki uzun ömürlü ve dengeli olabilir. Birlikte yeni deneyimler yaşamak, farklı bakış açıları kazanmak ve birbirlerine destek olmak bu ilişkinin güçlü yanlarıdır. Koç'un yenilikçi ruhu, Boğa'nın ise sabırlı ve kararlı yapısı sayesinde, birlikte büyük hedeflere ulaşabilirler.",
    ask: "Aşk hayatınızda Koç'un ataklığı ve Boğa'nın romantizmi güzel bir denge oluşturur. Boğa, Koç'a huzur ve güven sunarken, Koç ilişkiye heyecan katar. Zaman zaman inatçılık ve kıskançlık sorun yaratabilir, ancak açık iletişimle bu sorunlar aşılabilir. Romantik sürprizler, birlikte geçirilen kaliteli zaman ve karşılıklı anlayış, ilişkinin sağlam temeller üzerine kurulmasını sağlar. Özellikle özel günlerde yapılan jestler ve sürprizler, aşkı canlı tutar. Birlikte yeni yerler keşfetmek ve ortak hobiler edinmek, ilişkinin gelişimine katkı sağlar.",
    saglik: "Koç'un hareketliliği Boğa'yı da spora teşvik edebilir. Boğa ise Koç'a sağlıklı beslenme alışkanlıkları kazandırabilir. Birlikte doğa yürüyüşleri, yoga veya pilates gibi aktiviteler yapmak, hem bedensel hem de ruhsal dengeyi sağlar. Zaman zaman tembellik ve aşırı yorgunluk hissi yaşanabilir, bu nedenle dinlenmeye ve kaliteli uykuya özen göstermek önemlidir. Sağlıklı yaşam tarzı benimsemek, her iki burcun da enerjisini yüksek tutar.",
    kariyer: "Koç'un liderliği ve Boğa'nın çalışkanlığı, iş hayatında başarı getirebilir. Ancak, karar alma süreçlerinde sabırlı olmak ve birbirlerinin fikirlerine saygı göstermek gerekir. Koç'un hızlı karar alma yeteneği, Boğa'nın ise detaylara verdiği önem sayesinde, birlikte büyük projelerde başarılı olabilirler. Takım çalışmasına önem vermek, görev paylaşımını adil yapmak ve açık iletişim kurmak, iş ortamında huzur ve verimlilik sağlar. Uzun vadeli planlar yapmak ve hedeflere birlikte odaklanmak, kariyer yolculuğunda önemli avantajlar sunar."
  },
  Erkek: {
    genel: "Koç erkeği ve Boğa erkeği arasında zaman zaman çatışma yaşanabilir, ancak tamamlayıcıdırlar. Koç'un enerjisi ve girişimciliği, Boğa'nın sabrı ve kararlılığı ile dengelenir. Bu ilişkide, her iki taraf da kendi alanına ve özgürlüğüne önem verir. Birlikte yeni projelere başlamak, sosyal çevrelerinde aktif rol almak ve birbirlerine ilham vermek bu ilişkinin güçlü yanlarıdır. Zaman zaman yaşanan tartışmalar, ilişkinin dinamiğini artırabilir. Empati ve hoşgörü ile bu sorunlar kolayca aşılır.",
    ask: "Aşk hayatınızda Koç'un ataklığı Boğa'nın romantizmiyle dengelenir. Birlikte yeni deneyimler yaşamak, ilişkinin canlı kalmasını sağlar. Zaman zaman yaşanan tartışmalar, ilişkinin dinamiğini artırabilir. Ancak, empati ve hoşgörü ile bu sorunlar kolayca aşılır. Romantik sürprizler ve yeni başlangıçlar için harika bir dönemdir. Partnerinizle ortak aktiviteler yapmak, birlikte seyahat etmek ilişkinizi güçlendirecek. Eğer yalnızsanız, sosyal ortamlarda tanışacağınız kişilerle güçlü bağlar kurabilirsiniz.",
    saglik: "Birlikte sağlıklı yaşam alışkanlıkları geliştirebilirler. Koç'un enerjisi, Boğa'nın ise istikrarı sayesinde, düzenli spor yapmak ve sağlıklı beslenmek kolaylaşır. Zaman zaman aşırıya kaçan tempoları nedeniyle dinlenmeye de özen göstermelidirler. Sağlıklı beslenme ve düzenli uyku, enerjilerini yüksek tutmalarına yardımcı olur. Ayrıca, birlikte yeni spor dallarını denemek ve motivasyonlarını artırmak için birbirlerine destek olabilirler.",
    kariyer: "Koç'un liderliği ve Boğa'nın çalışkanlığı başarı getirir. Takım çalışmasına önem vermek, görev paylaşımını adil yapmak ve açık iletişim kurmak, iş ortamında huzur ve verimlilik sağlar. Uzun vadeli planlar yapmak ve hedeflere birlikte odaklanmak, kariyer yolculuğunda önemli avantajlar sunar. Birlikte yeni iş fikirleri geliştirmek, girişimcilik projelerine atılmak ve birbirlerini motive etmek bu ikilinin kariyer hayatında öne çıkan özelliklerdir. Sabırlı ve planlı hareket ettiklerinde, uzun vadeli başarılar elde edebilirler."
  },
  Diğer: {
    genel: "Koç ve Boğa bireyleri arasında enerji ve huzur dengesi kurmak önemlidir. Farklılıklar tamamlayıcı olabilir. Birlikte yeni deneyimler yaşamak, farklı bakış açıları kazanmak ve birbirlerine destek olmak bu ilişkinin güçlü yanlarıdır. Koç'un yenilikçi ruhu, Boğa'nın ise sabırlı ve kararlı yapısı sayesinde, birlikte büyük hedeflere ulaşabilirler.",
    ask: "Aşk hayatınızda karşılıklı anlayış ve sabır ön plandadır. Birlikte yeni deneyimler yaşamak, ilişkinin canlı kalmasını sağlar. Zaman zaman yaşanan tartışmalar, ilişkinin dinamiğini artırabilir. Ancak, empati ve hoşgörü ile bu sorunlar kolayca aşılır. Romantik sürprizler ve yeni başlangıçlar için harika bir dönemdir. Partnerinizle ortak aktiviteler yapmak, birlikte seyahat etmek ilişkinizi güçlendirecek. Eğer yalnızsanız, sosyal ortamlarda tanışacağınız kişilerle güçlü bağlar kurabilirsiniz.",
    saglik: "Birlikte doğa yürüyüşleri ve spor yapmak faydalı olur. Sağlıklı beslenme ve düzenli uyku, enerjilerini yüksek tutmalarına yardımcı olur. Ayrıca, birlikte yeni spor dallarını denemek ve motivasyonlarını artırmak için birbirlerine destek olabilirler. Zaman zaman tembellik ve aşırı yorgunluk hissi yaşanabilir, bu nedenle dinlenmeye ve kaliteli uykuya özen göstermek önemlidir.",
    kariyer: "İş ortamında yenilik ve istikrar bir arada sağlanabilir. Takım çalışmasına önem vermek, görev paylaşımını adil yapmak ve açık iletişim kurmak, iş ortamında huzur ve verimlilik sağlar. Uzun vadeli planlar yapmak ve hedeflere birlikte odaklanmak, kariyer yolculuğunda önemli avantajlar sunar. Birlikte yeni iş fikirleri geliştirmek, girişimcilik projelerine atılmak ve birbirlerini motive etmek bu ikilinin kariyer hayatında öne çıkan özelliklerdir. Sabırlı ve planlı hareket ettiklerinde, uzun vadeli başarılar elde edebilirler."
  }
};
// Koç-İkizler
burcUyumlari['Koç']['İkizler'] = {
  Kadın: {
    genel: "Koç kadını ve İkizler kadını arasında dinamik ve enerjik bir ilişki kurulur. Her ikisi de hareketli ve sosyal olduğu için birlikte çok eğlenceli vakit geçirirler. İkizler'in esnekliği ve Koç'un kararlılığı birbirini tamamlar. Yeni projeler ve aktiviteler konusunda birbirlerini desteklerler. İletişim konusunda her ikisi de başarılıdır, bu da ilişkinin güçlü yanlarından biridir.",
    ask: "Aşk hayatında heyecan ve çeşitlilik ön plandadır. İkizler'in romantik yanı Koç'un tutkusuyla birleşince güzel bir denge oluşur. Birlikte yeni yerler keşfetmek, yeni aktiviteler denemek ilişkinizi canlı tutar. İkizler'in değişken ruh hali Koç'un sabırsızlığıyla zaman zaman çatışabilir, ancak açık iletişimle bu sorunlar aşılır.",
    saglik: "Birlikte spor yapmak ve sağlıklı yaşam alışkanlıkları geliştirmek için idealdirler. İkizler'in esnekliği Koç'un enerjisini dengeler. Yoga, pilates gibi aktiviteler her ikisine de iyi gelir.",
    kariyer: "İş hayatında yenilikçi projeler ve iletişim odaklı işlerde başarılı olabilirler. İkizler'in yaratıcılığı Koç'un liderliğiyle birleşince güçlü bir ekip oluşturur."
  },
  Erkek: {
    genel: "Koç erkeği ve İkizler erkeği arasında arkadaşlık ve iş ortaklığı güçlü olabilir. Her ikisi de aktif ve sosyal olduğu için ortak ilgi alanları bulabilirler. İkizler'in esnekliği Koç'un kararlılığını dengeler.",
    ask: "Aşk hayatında dinamizm ve çeşitlilik önemlidir. Birlikte yeni deneyimler yaşamak ilişkinizi canlı tutar. İkizler'in değişken doğası Koç'un sabırsızlığıyla zaman zaman uyumsuzluk yaratabilir.",
    saglik: "Birlikte spor yapmak ve sağlıklı yaşam alışkanlıkları geliştirmek faydalı olur. İkizler'in esnekliği Koç'un enerjisini dengeler.",
    kariyer: "İş ortamında yenilikçi projeler ve iletişim odaklı işlerde başarılı olabilirler. Takım çalışmasında birbirlerini desteklerler."
  },
  Diğer: {
    genel: "Koç ve İkizler bireyleri arasında dinamik ve enerjik bir ilişki kurulur. Her ikisi de hareketli ve sosyal olduğu için ortak ilgi alanları bulabilirler.",
    ask: "Aşk hayatında heyecan ve çeşitlilik ön plandadır. Birlikte yeni deneyimler yaşamak ilişkinizi canlı tutar.",
    saglik: "Birlikte spor yapmak ve sağlıklı yaşam alışkanlıkları geliştirmek faydalı olur.",
    kariyer: "İş ortamında yenilikçi projeler ve iletişim odaklı işlerde başarılı olabilirler."
  }
};

// Boğa-Boğa
burcUyumlari['Boğa'] = burcUyumlari['Boğa'] || {};
burcUyumlari['Boğa']['Boğa'] = {
  Kadın: {
    genel: "İki Boğa kadını bir araya geldiğinde, huzur ve istikrar ön plandadır. Her ikisi de güvenilir, sabırlı ve kararlıdır. Bu ilişkide derin bir anlayış ve karşılıklı saygı vardır. Birlikte güzel bir ev hayatı kurarlar ve maddi konularda başarılı olurlar. Ancak, her ikisi de inatçı olduğu için zaman zaman anlaşmazlıklar yaşanabilir. Sabırlı ve anlayışlı davranmak önemlidir.",
    ask: "Aşk hayatında romantizm ve sadakat ön plandadır. Her ikisi de güvenilir ve sadık olduğu için uzun ömürlü ilişkiler kurarlar. Birlikte güzel anlar yaşar, ortak hedefler belirlerler. Ancak, her ikisi de inatçı olduğu için zaman zaman tartışmalar yaşanabilir. Açık iletişim ve karşılıklı anlayış önemlidir.",
    saglik: "Birlikte sağlıklı yaşam alışkanlıkları geliştirirler. Düzenli beslenme ve spor konusunda birbirlerini desteklerler. Doğa yürüyüşleri ve yoga gibi aktiviteler her ikisine de iyi gelir.",
    kariyer: "İş hayatında sabırlı ve disiplinli çalışmaları sayesinde başarılı olurlar. Maddi konularda şanslıdırlar ve uzun vadeli planlar yaparlar."
  },
  Erkek: {
    genel: "İki Boğa erkeği arasında güvenilir ve istikrarlı bir ilişki kurulur. Her ikisi de sabırlı ve kararlı olduğu için birlikte büyük hedeflere ulaşabilirler. Maddi konularda başarılı olurlar.",
    ask: "Aşk hayatında sadakat ve güven ön plandadır. Her ikisi de güvenilir olduğu için uzun ömürlü ilişkiler kurarlar. Ancak, her ikisi de inatçı olduğu için zaman zaman anlaşmazlıklar yaşanabilir.",
    saglik: "Birlikte sağlıklı yaşam alışkanlıkları geliştirirler. Düzenli beslenme ve spor konusunda birbirlerini desteklerler.",
    kariyer: "İş hayatında sabırlı ve disiplinli çalışmaları sayesinde başarılı olurlar. Maddi konularda şanslıdırlar."
  },
  Diğer: {
    genel: "İki Boğa bireyi arasında güvenilir ve istikrarlı bir ilişki kurulur. Her ikisi de sabırlı ve kararlı olduğu için birlikte büyük hedeflere ulaşabilirler.",
    ask: "Aşk hayatında sadakat ve güven ön plandadır. Her ikisi de güvenilir olduğu için uzun ömürlü ilişkiler kurarlar.",
    saglik: "Birlikte sağlıklı yaşam alışkanlıkları geliştirirler. Düzenli beslenme ve spor konusunda birbirlerini desteklerler.",
    kariyer: "İş hayatında sabırlı ve disiplinli çalışmaları sayesinde başarılı olurlar."
  }
};

// Boğa-İkizler
burcUyumlari['Boğa']['İkizler'] = {
  Kadın: {
    genel: "Boğa kadını ve İkizler kadını arasında denge ve uyum arayışı vardır. Boğa'nın istikrarı İkizler'in esnekliğiyle dengelenir. Boğa, İkizler'e güven ve huzur sunarken, İkizler Boğa'ya heyecan ve çeşitlilik katar. İletişim konusunda İkizler'in başarısı Boğa'nın sessizliğini dengeler.",
    ask: "Aşk hayatında romantizm ve çeşitlilik bir aradadır. Boğa'nın sadakati İkizler'in değişken doğasıyla dengelenir. Birlikte yeni deneyimler yaşamak ilişkinizi canlı tutar. Ancak, İkizler'in kararsızlığı Boğa'nın güvenlik ihtiyacıyla çatışabilir.",
    saglik: "Birlikte sağlıklı yaşam alışkanlıkları geliştirmek için idealdirler. Boğa'nın istikrarı İkizler'in esnekliğiyle dengelenir.",
    kariyer: "İş hayatında istikrar ve yenilik bir arada sağlanabilir. Boğa'nın sabırlı çalışması İkizler'in yaratıcılığıyla birleşince güçlü bir ekip oluşturur."
  },
  Erkek: {
    genel: "Boğa erkeği ve İkizler erkeği arasında denge ve uyum arayışı vardır. Boğa'nın istikrarı İkizler'in esnekliğiyle dengelenir.",
    ask: "Aşk hayatında romantizm ve çeşitlilik bir aradadır. Birlikte yeni deneyimler yaşamak ilişkinizi canlı tutar.",
    saglik: "Birlikte sağlıklı yaşam alışkanlıkları geliştirmek faydalı olur.",
    kariyer: "İş hayatında istikrar ve yenilik bir arada sağlanabilir."
  },
  Diğer: {
    genel: "Boğa ve İkizler bireyleri arasında denge ve uyum arayışı vardır. Boğa'nın istikrarı İkizler'in esnekliğiyle dengelenir.",
    ask: "Aşk hayatında romantizm ve çeşitlilik bir aradadır. Birlikte yeni deneyimler yaşamak ilişkinizi canlı tutar.",
    saglik: "Birlikte sağlıklı yaşam alışkanlıkları geliştirmek faydalı olur.",
    kariyer: "İş hayatında istikrar ve yenilik bir arada sağlanabilir."
  }
};

// İkizler-İkizler
burcUyumlari['İkizler'] = burcUyumlari['İkizler'] || {};
burcUyumlari['İkizler']['İkizler'] = {
  Kadın: {
    genel: "İki İkizler kadını bir araya geldiğinde, iletişim ve sosyallik ön plandadır. Her ikisi de esnek, yaratıcı ve sosyal olduğu için birlikte çok eğlenceli vakit geçirirler. Yeni projeler ve aktiviteler konusunda birbirlerini desteklerler. Ancak, her ikisi de kararsız olduğu için zaman zaman karar vermekte zorlanabilirler.",
    ask: "Aşk hayatında heyecan ve çeşitlilik ön plandadır. Her ikisi de romantik ve sosyal olduğu için birlikte güzel anlar yaşarlar. Ancak, her ikisi de kararsız olduğu için uzun vadeli planlar yapmakta zorlanabilirler.",
    saglik: "Birlikte spor yapmak ve sağlıklı yaşam alışkanlıkları geliştirmek için idealdirler. Her ikisi de esnek olduğu için yeni aktiviteler denemekten çekinmezler.",
    kariyer: "İş hayatında iletişim ve yaratıcılık ön plandadır. Her ikisi de yaratıcı olduğu için birlikte yenilikçi projeler geliştirebilirler."
  },
  Erkek: {
    genel: "İki İkizler erkeği arasında iletişim ve sosyallik ön plandadır. Her ikisi de esnek ve sosyal olduğu için birlikte çok eğlenceli vakit geçirirler.",
    ask: "Aşk hayatında heyecan ve çeşitlilik ön plandadır. Birlikte yeni deneyimler yaşamak ilişkinizi canlı tutar.",
    saglik: "Birlikte spor yapmak ve sağlıklı yaşam alışkanlıkları geliştirmek faydalı olur.",
    kariyer: "İş hayatında iletişim ve yaratıcılık ön plandadır."
  },
  Diğer: {
    genel: "İki İkizler bireyi arasında iletişim ve sosyallik ön plandadır. Her ikisi de esnek ve sosyal olduğu için birlikte çok eğlenceli vakit geçirirler.",
    ask: "Aşk hayatında heyecan ve çeşitlilik ön plandadır. Birlikte yeni deneyimler yaşamak ilişkinizi canlı tutar.",
    saglik: "Birlikte spor yapmak ve sağlıklı yaşam alışkanlıkları geliştirmek faydalı olur.",
    kariyer: "İş hayatında iletişim ve yaratıcılık ön plandadır."
  }
};

// Diğer burç kombinasyonları için placeholder'lar
const diğerBurclar = ['Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'];

diğerBurclar.forEach(burc1 => {
  diğerBurclar.forEach(burc2 => {
    if (!burcUyumlari[burc1]) burcUyumlari[burc1] = {};
    if (!burcUyumlari[burc1][burc2]) {
      burcUyumlari[burc1][burc2] = {
        Kadın: {
          genel: `${burc1} ve ${burc2} burçları arasında uyumlu bir ilişki kurulabilir. Her iki burç da kendi özelliklerini koruyarak birbirlerini tamamlayabilirler. Birlikte yeni deneyimler yaşamak ve ortak hedefler belirlemek ilişkinizi güçlendirecektir.`,
          ask: `${burc1} ve ${burc2} burçları arasında aşk uyumu gelişebilir. Karşılıklı anlayış ve sabır ile güzel bir ilişki kurabilirsiniz. Birlikte yeni deneyimler yaşamak ilişkinizi canlı tutacaktır.`,
          saglik: `${burc1} ve ${burc2} burçları birlikte sağlıklı yaşam alışkanlıkları geliştirebilirler. Spor ve beslenme konusunda birbirlerini destekleyebilirler.`,
          kariyer: `${burc1} ve ${burc2} burçları iş hayatında birbirlerini destekleyebilirler. Ortak projelerde başarılı olabilirler.`
        },
        Erkek: {
          genel: `${burc1} ve ${burc2} burçları arasında uyumlu bir ilişki kurulabilir. Her iki burç da kendi özelliklerini koruyarak birbirlerini tamamlayabilirler.`,
          ask: `${burc1} ve ${burc2} burçları arasında aşk uyumu gelişebilir. Karşılıklı anlayış ve sabır ile güzel bir ilişki kurabilirsiniz.`,
          saglik: `${burc1} ve ${burc2} burçları birlikte sağlıklı yaşam alışkanlıkları geliştirebilirler.`,
          kariyer: `${burc1} ve ${burc2} burçları iş hayatında birbirlerini destekleyebilirler.`
        },
        Diğer: {
          genel: `${burc1} ve ${burc2} burçları arasında uyumlu bir ilişki kurulabilir. Her iki burç da kendi özelliklerini koruyarak birbirlerini tamamlayabilirler.`,
          ask: `${burc1} ve ${burc2} burçları arasında aşk uyumu gelişebilir. Karşılıklı anlayış ve sabır ile güzel bir ilişki kurabilirsiniz.`,
          saglik: `${burc1} ve ${burc2} burçları birlikte sağlıklı yaşam alışkanlıkları geliştirebilirler.`,
          kariyer: `${burc1} ve ${burc2} burçları iş hayatında birbirlerini destekleyebilirler.`
        }
      };
    }
  });
});

export default function RootLayout() {
  // Tüm useState'ler en üstte, koşulsuz!
  const [isStartupSoundOn, setIsStartupSoundOn] = useState(true);
const [isNotificationSoundOn, setIsNotificationSoundOn] = useState(true);
const [appSoundEnabled, setAppSoundEnabled] = useState(true);
const [notificationSoundEnabled, setNotificationSoundEnabled] = useState(true);
  const [inviteModal, setInviteModal] = useState(true);
  const [inviteInput, setInviteInput] = useState('');
  const [inviteError, setInviteError] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [formType, setFormType] = useState<'login' | 'register' | null>(null);
  const [categoryModal, setCategoryModal] = useState(false);
  // Profil modalı seçim modalları için gerekli state'ler:
  const [profileBurcModal, setProfileBurcModal] = useState(false);
  const [profileMeslekModal, setProfileMeslekModal] = useState(false);
  const [profileIliskiModal, setProfileIliskiModal] = useState(false);
  // Tarot kartı seçim modalı için gerekli state'ler:
  const [tarotSelectModal, setTarotSelectModal] = useState(false);
  const [tarotSelectCategory, setTarotSelectCategory] = useState<'ask' | 'saglik' | 'kariyer' | 'genel' | null>(null);
  const [tarotSelectCards, setTarotSelectCards] = useState<{index: number, reversed: boolean}[]>([]);
  const [tarotSelectResults, setTarotSelectResults] = useState<{index: number, reversed: boolean}[]>([]);
  const [tarotDeck, setTarotDeck] = useState<{index: number, reversed: boolean}[]>([]);
  
  // Tek kart seçimi için yeni state'ler
  const [singleCardModal, setSingleCardModal] = useState(false);
  const [singleCardCategory, setSingleCardCategory] = useState<'ask' | 'saglik' | 'kariyer' | 'genel' | null>(null);
  const [singleCardResult, setSingleCardResult] = useState<{index: number, reversed: boolean} | null>(null);
  // Form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regName, setRegName] = useState('');
  const [regSurname, setRegSurname] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPassword2, setRegPassword2] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const [showInviteInfo, setShowInviteInfo] = useState(false);
  const [settingsModal, setSettingsModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentName, setCurrentName] = useState('');
  const [regGender, setRegGender] = useState('');
  const [regBirthDate, setRegBirthDate] = useState('');
  const [regBirthTime, setRegBirthTime] = useState('');
  const [regBirthPlace, setRegBirthPlace] = useState('');
  const [regZodiac, setRegZodiac] = useState('');
  const [regJob, setRegJob] = useState('');
  const [regRelationship, setRegRelationship] = useState('');
  const [genderModal, setGenderModal] = useState(false);
  // State'lere ekle:
  const [birthModal, setBirthModal] = useState(false);
  const [dayModal, setDayModal] = useState(false);

  const [yearModal, setYearModal] = useState(false);
  // State'lere ekle:
  const [birthTimeModal, setBirthTimeModal] = useState(false);
  const [birthDateModal, setBirthDateModal] = useState(false);
  const [birthHour, setBirthHour] = useState('');
  const [birthMinute, setBirthMinute] = useState('');
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');
  // Yeni state'ler ekle:
  const [birthDayModal, setBirthDayModal] = useState(false);
  const [birthMonthModal, setBirthMonthModal] = useState(false);
  const [birthYearModal, setBirthYearModal] = useState(false);
  const [birthHourModal, setBirthHourModal] = useState(false);
  const [birthMinuteModal, setBirthMinuteModal] = useState(false);
  const [regBirthDay, setRegBirthDay] = useState('');
  const [regBirthMonth, setRegBirthMonth] = useState('');
  const [regBirthYear, setRegBirthYear] = useState('');
  const [regBirthHour, setRegBirthHour] = useState('');
  const [regBirthMinute, setRegBirthMinute] = useState('');
  // State'lere ekle:
  const [birthPlaceModal, setBirthPlaceModal] = useState(false);
  const [birthPlaceSearch, setBirthPlaceSearch] = useState('');
  const iller = [
    'Adana','Adıyaman','Afyonkarahisar','Ağrı','Amasya','Ankara','Antalya','Artvin','Aydın','Balıkesir','Bilecik','Bingöl','Bitlis','Bolu','Burdur','Bursa','Çanakkale','Çankırı','Çorum','Denizli','Diyarbakır','Edirne','Elazığ','Erzincan','Erzurum','Eskişehir','Gaziantep','Giresun','Gümüşhane','Hakkari','Hatay','Isparta','Mersin','İstanbul','İzmir','Kars','Kastamonu','Kayseri','Kırklareli','Kırşehir','Kocaeli','Konya','Kütahya','Malatya','Manisa','Kahramanmaraş','Mardin','Muğla','Muş','Nevşehir','Niğde','Ordu','Rize','Sakarya','Samsun','Siirt','Sinop','Sivas','Tekirdağ','Tokat','Trabzon','Tunceli','Şanlıurfa','Uşak','Van','Yozgat','Zonguldak','Aksaray','Bayburt','Karaman','Kırıkkale','Batman','Şırnak','Bartın','Ardahan','Iğdır','Yalova','Karabük','Kilis','Osmaniye','Düzce'
  ];

  // State'lere ekle:
  const [zodiacModal, setZodiacModal] = useState(false);
  // State'lere ekle:
  const [jobModal, setJobModal] = useState(false);
  const meslekler = [
    'Ev Hanımı', 'Çalışmıyor', 'İş Arıyor', 'Öğrenci', 'Kamu Sektörü', 'Özel Sektör', 'Emekli'
  ];
  // State'lere ekle:
  const [relationshipModal, setRelationshipModal] = useState(false);
  const iliskiDurumlari = [
    'İlişkisi Yok', 'Platonik', 'Karmaşık', 'Flört Halinde', 'İlişkisi Var', 'Yeni Ayrılmış', 'Nişanlı', 'Evli', 'Boşanmış', 'Dul'
  ];
  // State'lere ekle:
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');

  // Değerlendirme için state
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [ratingSuccess, setRatingSuccess] = useState('');
  const [ratingError, setRatingError] = useState('');

  const [selectedLanguage, setSelectedLanguage] = useState<'tr' | 'en'>('tr');
  const [languageModal, setLanguageModal] = useState(false);
  const [deleteAccountModal, setDeleteAccountModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark'>('dark');
  const [risingModal, setRisingModal] = useState(false);
  const [risingDay, setRisingDay] = useState('');
  const [risingMonth, setRisingMonth] = useState('');
  const [risingYear, setRisingYear] = useState('');
  const [risingHour, setRisingHour] = useState('');
  const [risingMinute, setRisingMinute] = useState('');
  const [risingCity, setRisingCity] = useState('');
  const [risingResult, setRisingResult] = useState('');
  const [risingCityModal, setRisingCityModal] = useState(false);
  const [risingHourModal, setRisingHourModal] = useState(false);
  const [risingMinuteModal, setRisingMinuteModal] = useState(false);
  const [currentTab, setCurrentTab] = useState('home');
  const [gunlukBurcModal, setGunlukBurcModal] = useState(false);
  const [tarotModal, setTarotModal] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [showTarotMeaning, setShowTarotMeaning] = useState(false);
  const [monthModal, setMonthModal] = useState(false);
  const [burcModal, setBurcModal] = useState(false);
  const [burcDetayModal, setBurcDetayModal] = useState(false);
  const [selectedBurc, setSelectedBurc] = useState('');
  // Kategori seçimi için state
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  // State'lere ekle:
  const [burcSecimModal, setBurcSecimModal] = useState<'none' | 'burc1' | 'burc2'>('none');

  const [favorilerModal, setFavorilerModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [favoriBurclar, setFavoriBurclar] = useState<string[]>([]);
  const [favoriKartlar, setFavoriKartlar] = useState<number[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [meaningModal, setMeaningModal] = useState(false);
  
  // Eksik diziler
  const burclar = ['Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'];
  
  // 78 kartın görselini sırayla diziye ekle
  const tarotImages = [
    require('../assets/images/kart_1.jpg'),
    require('../assets/images/kart_2.jpg'),
    require('../assets/images/kart_3.jpg'),
    require('../assets/images/kart_4.jpg'),
    require('../assets/images/kart_5.jpg'),
    require('../assets/images/kart_6.jpg'),
    require('../assets/images/kart_7.jpg'),
    require('../assets/images/kart_8.jpg'),
    require('../assets/images/kart_9.jpg'),
    require('../assets/images/kart_10.jpg'),
    require('../assets/images/kart_11.jpg'),
    require('../assets/images/kart_12.jpg'),
    require('../assets/images/kart_13.jpg'),
    require('../assets/images/kart_14.jpg'),
    require('../assets/images/kart_15.jpg'),
    require('../assets/images/kart_16.jpg'),
    require('../assets/images/kart_17.jpg'),
    require('../assets/images/kart_18.jpg'),
    require('../assets/images/kart_19.jpg'),
    require('../assets/images/kart_20.jpg'),
    require('../assets/images/kart_21.jpg'),
    require('../assets/images/kart_22.jpg'),
    require('../assets/images/kart_23.jpg'),
    require('../assets/images/kart_24.jpg'),
    require('../assets/images/kart_25.jpg'),
    require('../assets/images/kart_26.jpg'),
    require('../assets/images/kart_27.jpg'),
    require('../assets/images/kart_28.jpg'),
    require('../assets/images/kart_29.jpg'),
    require('../assets/images/kart_30.jpg'),
    require('../assets/images/kart_31.jpg'),
    require('../assets/images/kart_32.jpg'),
    require('../assets/images/kart_33.jpg'),
    require('../assets/images/kart_34.jpg'),
    require('../assets/images/kart_35.jpg'),
    require('../assets/images/kart_36.jpg'),
    require('../assets/images/kart_37.jpg'),
    require('../assets/images/kart_38.jpg'),
    require('../assets/images/kart_39.jpg'),
    require('../assets/images/kart_40.jpg'),
    require('../assets/images/kart_41.jpg'),
    require('../assets/images/kart_42.jpg'),
    require('../assets/images/kart_43.jpg'),
    require('../assets/images/kart_44.jpg'),
    require('../assets/images/kart_45.jpg'),
    require('../assets/images/kart_46.jpg'),
    require('../assets/images/kart_47.jpg'),
    require('../assets/images/kart_48.jpg'),
    require('../assets/images/kart_49.jpg'),
    require('../assets/images/kart_50.jpg'),
    require('../assets/images/kart_51.jpg'),
    require('../assets/images/kart_52.jpg'),
    require('../assets/images/kart_53.jpg'),
    require('../assets/images/kart_54.jpg'),
    require('../assets/images/kart_55.jpg'),
    require('../assets/images/kart_56.jpg'),
    require('../assets/images/kart_57.jpg'),
    require('../assets/images/kart_58.jpg'),
    require('../assets/images/kart_59.jpg'),
    require('../assets/images/kart_60.jpg'),
    require('../assets/images/kart_61.jpg'),
    require('../assets/images/kart_62.jpg'),
    require('../assets/images/kart_63.jpg'),
    require('../assets/images/kart_64.jpg'),
    require('../assets/images/kart_65.jpg'),
    require('../assets/images/kart_66.jpg'),
    require('../assets/images/kart_67.jpg'),
    require('../assets/images/kart_68.jpg'),
    require('../assets/images/kart_69.jpg'),
    require('../assets/images/kart_70.jpg'),
    require('../assets/images/kart_71.jpg'),
    require('../assets/images/kart_72.jpg'),
    require('../assets/images/kart_73.jpg'),
    require('../assets/images/kart_74.jpg'),
    require('../assets/images/kart_75.jpg'),
    require('../assets/images/kart_76.jpg'),
    require('../assets/images/kart_77.jpg'),
    require('../assets/images/kart_78.jpg'),
  ];

  // Bugünün kartı için sabit index hesapla
  function getTodaysCardIndex() {
    const today = new Date();
    // Basit algoritma: gün + ay + yıl toplamı mod 78
    return (today.getDate() + today.getMonth() + 1 + today.getFullYear()) % 78;
  }


  // Basit yükselen burç algoritması (Türkiye için)
  function calculateRisingSign(hour: string, minute: string): string {
    const totalMinutes = parseInt(hour || '0') * 60 + parseInt(minute || '0');
    if (totalMinutes >= 360 && totalMinutes < 480) return 'Koç'; // 06:00-07:59
    if (totalMinutes >= 480 && totalMinutes < 600) return 'Boğa'; // 08:00-09:59
    if (totalMinutes >= 600 && totalMinutes < 720) return 'İkizler'; // 10:00-11:59
    if (totalMinutes >= 720 && totalMinutes < 840) return 'Yengeç'; // 12:00-13:59
    if (totalMinutes >= 840 && totalMinutes < 960) return 'Aslan'; // 14:00-15:59
    if (totalMinutes >= 960 && totalMinutes < 1080) return 'Başak'; // 16:00-17:59
    if (totalMinutes >= 1080 && totalMinutes < 1200) return 'Terazi'; // 18:00-19:59
    if (totalMinutes >= 1200 && totalMinutes < 1320) return 'Akrep'; // 20:00-21:59
    if (totalMinutes >= 1320 && totalMinutes < 1440) return 'Yay'; // 22:00-23:59
    if (totalMinutes >= 0 && totalMinutes < 120) return 'Oğlak'; // 00:00-01:59
    if (totalMinutes >= 120 && totalMinutes < 240) return 'Kova'; // 02:00-03:59
    if (totalMinutes >= 240 && totalMinutes < 360) return 'Balık'; // 04:00-05:59
    return 'Bilinmiyor';
  }

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      setCurrentUser(user);
      // Eğer yeni kayıt olduysa, isim bilgisini localStorage'da tut
      if (user && regName) {
        localStorage.setItem('tarot_user_name', regName);
        setCurrentName(regName);
      } else if (user) {
        // Daha önce kaydedilmiş isim varsa onu kullan
        const savedName = localStorage.getItem('tarot_user_name');
        if (savedName) setCurrentName(savedName);
      } else {
        setCurrentName('');
      }
      if (user) {
        try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setCurrentName(data.name || '');
          setRegSurname(data.surname || '');
          setRegEmail(data.email || '');
          setRegGender(data.gender || '');
          setRegBirthDate(data.birthDate || '');
          setRegBirthTime(data.birthTime || '');
          setRegBirthPlace(data.birthPlace || '');
          setRegZodiac(data.zodiac || '');
          setRegJob(data.job || '');
          setRegRelationship(data.relationship || '');
          // Doğum tarihi ve saati split et
          if (data.birthDate) {
            const [d, m, y] = data.birthDate.split('.');
            setBirthDay(d || ''); setBirthMonth(m || ''); setBirthYear(y || '');
          }
          if (data.birthTime) {
            const [h, min] = data.birthTime.split(':');
            setBirthHour(h || ''); setBirthMinute(min || '');
          }
          }
        } catch (error) {
          console.log('Firebase bağlantı hatası:', error);
          // Hata durumunda varsayılan değerleri kullan
          setCurrentName('');
          setRegSurname('');
          setRegEmail('');
          setRegGender('');
          setRegBirthDate('');
          setRegBirthTime('');
          setRegBirthPlace('');
          setRegZodiac('');
          setRegJob('');
          setRegRelationship('');
          setBirthDay('');
          setBirthMonth('');
          setBirthYear('');
          setBirthHour('');
          setBirthMinute('');
        }
      }
    });
    return () => unsubscribe();
  }, [regName]);

  // closeModal fonksiyonunu doğru yere alıyorum
  const closeModal = () => {
    setModalVisible(false);
    setFormType(null);
    setLoginEmail(''); setLoginPassword('');
    setRegEmail(''); setRegName(''); setRegSurname(''); setRegPassword(''); setRegPassword2('');
    setRegisterError('');
  };

  const handleRegister = async () => {
    if (regPassword !== regPassword2) {
      setRegisterError('Şifreler eşleşmiyor');
      return;
    }
    // Şifre kontrolü: en az bir büyük harf ve bir rakam
    if (!/(?=.*[A-Z])/.test(regPassword) || !/(?=.*\d)/.test(regPassword)) {
      setRegisterError('Şifrenizde en az bir tane büyük harf ve en az bir rakam kullanmalısınız');
      return;
    }
    setRegisterError('');
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, regEmail, regPassword);
      setRegisterSuccess('Kayıt başarılı! Giriş yapabilirsiniz.');
      setTimeout(() => {
        setRegisterSuccess('');
        closeModal();
      }, 1500);
    } catch (err) {
      console.log('Firebase kayıt hatası:', err);
      const errorMessage = (err as Error).message || (err as Error).toString();
      if (errorMessage.includes('network') || errorMessage.includes('offline')) {
        setRegisterError('İnternet bağlantınızı kontrol edin ve tekrar deneyin.');
      } else {
        setRegisterError('Kayıt başarısız: ' + errorMessage);
      }
    }
    setLoading(false);
  };

  const handleLogin = async () => {
    setLoginError('');
    setLoading(true);
    try {
      // Oturum kalıcılığını ayarla
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      setLoginError('');
      closeModal();
    } catch (err) {
      console.log('Firebase giriş hatası:', err);
      const errorMessage = (err as Error).message || (err as Error).toString();
      if (errorMessage.includes('network') || errorMessage.includes('offline')) {
        setLoginError('İnternet bağlantınızı kontrol edin ve tekrar deneyin.');
      } else {
        setLoginError('Giriş başarısız: ' + errorMessage);
      }
    }
    setLoading(false);
  };

  const handleInviteSubmit = () => {
    const correctCode = generateInviteCode();
    if (inviteInput === correctCode) {
      setInviteModal(false);
      setInviteError('');
    } else {
      setInviteError('Davet kodu yanlış!');
    }
  };

  const [showWelcome, setShowWelcome] = useState(true);

  React.useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => setShowWelcome(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  console.log('currentUser:', currentUser);
 
  // showWelcome false olunca ana ekranı göster
  const [closeAccountModal, setCloseAccountModal] = useState(false);

  // Gün, ay, yıl, saat, dakika seçimleri için diziler:
  const days = Array.from({length: 31}, (_, i) => String(i + 1).padStart(2, '0'));
  const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  const years = Array.from({length: 50}, (_, i) => String(2024 - i));
  const hours = Array.from({length: 24}, (_, i) => String(i).padStart(2, '0'));
  const minutes = Array.from({length: 60}, (_, i) => String(i).padStart(2, '0'));
  
  const [uyumModal, setUyumModal] = useState(false);
  const [uyumBurc1, setUyumBurc1] = useState('');
  const [uyumBurc2, setUyumBurc2] = useState('');
  const [uyumCinsiyet1, setUyumCinsiyet1] = useState('');
  const [uyumCinsiyet2, setUyumCinsiyet2] = useState('');
  const [uyumSonuc, setUyumSonuc] = useState<{ genel: string; ask: string; saglik: string; kariyer: string } | null>(null);

  // Ay fazları ve etkileri
  const ayFazlari = [
    { isim: 'Yeni Ay', etki: 'Yeni başlangıçlar, hedef belirleme, içe dönüş' },
    { isim: 'İlk Dördün', etki: 'Hareket, eylem, karar alma, ilerleme' },
    { isim: 'Dolunay', etki: 'Tamamlanma, aydınlanma, sonuç alma, kutlama' },
    { isim: 'Son Dördün', etki: 'Değerlendirme, temizlik, bırakma, dinlenme' }
  ];

  // Bugünün ay fazını hesapla (basit algoritma)
  function getTodaysMoonPhase() {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const phaseIndex = Math.floor((dayOfYear % 29.5) / 7.375); // 29.5 günlük ay döngüsü
    return ayFazlari[phaseIndex] || ayFazlari[0];
  }

  // Mevcut saatin anlamını getir
  function getCurrentTimeMeaning() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    const timeMeanings: { [key: string]: { title: string; meaning: string } } = {
      '00:00': { title: '00:00 Saat Anlamı', meaning: 'Yeni başlangıçların işaretidir. Evren, size hayatınızda temiz bir sayfa açma zamanı geldiğini söyler. Bu saat dilimi, özellikle değişim ve yenilik arayışında olan kişiler için güçlü bir rehber olabilir.' },
      '00:01': { title: '00:01 Saat Anlamı', meaning: 'Bireysel bir eylem ya da kararın önemini vurgular. Bu saat, kişisel iradenizin ve özgüveninizin gücüne işaret eder. Harekete geçmeniz gereken bir zamanı temsil eder.' },
      '00:02': { title: '00:02 Saat Anlamı', meaning: 'Denge ve uyumun simgesidir. Özellikle ilişkiler ve iş birliği konularında önemli mesajlar taşır. İçsel huzurunuzu bozan etkenleri belirlemek ve onları çözmek için mükemmel bir zaman.' },
      '01:01': { title: '01:01 Saat Anlamı', meaning: 'Evrenin size yalnız olmadığınızı hatırlattığı bir mesaj taşır. Özellikle sevgi ve dostluk konuları ön plana çıkar. Koruyucu meleklerinizin yanınızda olduğunu hatırlatır.' },
      '01:11': { title: '01:11 Saat Anlamı', meaning: 'Düşüncelerinizin büyük bir enerjiyle hayat bulduğunu gösterir. Bu saat, manifestasyonun güçlü bir göstergesidir. Pozitif düşünmek ve belirgin hedeflere odaklanmak bu saat diliminin ana mesajıdır.' },
      '02:02': { title: '02:02 Saat Anlamı', meaning: 'Sabır ve sürekliliğin önemini vurgular. Acele etmeden, sakin ve kararlı bir şekilde ilerlemenizin gerekli olduğunu ifade eder. Her şey zamanında olacak mesajını verir.' },
      '03:03': { title: '03:03 Saat Anlamı', meaning: 'Yaratıcılık ve kendini ifade etmenin gücünü simgeler. Yaratıcı projeler ve fikirler üzerinde çalışmanız için bir işaret olabilir. İlahi bir rehberlik mesajıdır.' },
      '04:04': { title: '04:04 Saat Anlamı', meaning: 'Disiplin ve düzenin hayatınızdaki önemini vurgular. Günlük rutinlerinize ve sorumluluklarınıza dikkat etmeniz gerektiğini ifade eder. Evrenin sizi desteklediğini işaret eder.' },
      '05:05': { title: '05:05 Saat Anlamı', meaning: 'Değişimin güçlü bir habercisidir. Hayatınızdaki köklü bir dönüşümün başlangıcını temsil edebilir. Değişime açık olmanız ve yeniliklere kucak açmanız gerektiği mesajını alırsınız.' },
      '06:06': { title: '06:06 Saat Anlamı', meaning: 'Sevgi ve aile bağlarının ön planda olduğunu işaret eder. Yakın çevrenizdeki insanlarla daha fazla zaman geçirmeniz gerektiğini ifade eder. Evrenin size şefkat ve sevgiyle yaklaştığını hissettirir.' },
      '07:07': { title: '07:07 Saat Anlamı', meaning: 'Evrensel bir uyanış ve ruhsal farkındalık mesajı taşır. Kişinin içsel olarak daha güçlü bir farkındalığa ulaşması gerektiğini vurgular. Sezgilerinize güvenmeniz gerektiğini ima eder.' },
      '08:08': { title: '08:08 Saat Anlamı', meaning: 'Bolluk, bereket ve maddi başarı mesajı taşır. Finansal durumunuzda pozitif bir değişim yaşanabileceğine işaret eder. Evrenin sizin için sonsuz fırsatlar sunduğunu gösterir.' },
      '09:09': { title: '09:09 Saat Anlamı', meaning: 'Bir döngünün tamamlanmak üzere olduğunu ve yeni bir başlangıcın yaklaştığını gösterir. Geçmişi bırakma ve geleceğe umutla bakma zamanının geldiğini belirtir.' },
      '10:10': { title: '10:10 Saat Anlamı', meaning: 'Hayatınızda pozitif bir değişimin eşiğinde olduğunuzu ifade eder. Evrenin size sunduğu yeni kapıları ve fırsatları işaret eder. Evrensel enerjilerle uyum içinde olduğunuzu gösterir.' },
      '11:11': { title: '11:11 Saat Anlamı', meaning: 'En güçlü spiritüel işaretlerden biri olarak kabul edilir ve dileklerinizi evrene göndermek için eşsiz bir fırsat sunar. Evrensel enerjilerle güçlü bir bağ kurduğunuzu gösterir.' },
      '12:12': { title: '12:12 Saat Anlamı', meaning: 'Hayatınızdaki her şeyin dengeye kavuştuğunu ve doğru yolda olduğunuzu ifade eder. İçsel huzuru ve evrensel destek mesajını taşır. Büyük bir fırsatın yaklaştığını belirtir.' },
      '13:00': { title: '13:00 Saat Anlamı', meaning: 'Kişisel dönüşüm ve liderlik enerjisi taşır. Hayatınızdaki güç ve irade unsurlarını harekete geçirmenizi önerir. Kendi hayatınızda söz sahibi olmanız gerektiğini vurgular.' },
      '13:13': { title: '13:13 Saat Anlamı', meaning: 'Kendine güven ve kararlılık temalarıyla ilişkilendirilir. Evren size cesaretinizi toplamanız gerektiğini hatırlatıyor olabilir. Kişisel hedeflerinize ulaşmak için gerekli enerjiyi kazandırır.' },
      '14:00': { title: '14:00 Saat Anlamı', meaning: 'Tam bir dönüşüm saatidir. Yaşamınızdaki geçiş süreçlerine işaret eder. İçsel dengenizi koruyarak bu değişimden en iyi şekilde faydalanabilirsiniz.' },
      '14:14': { title: '14:14 Saat Anlamı', meaning: 'Aşk ve ilişkilerle güçlü bir şekilde ilişkilendirilir. Duygusal bağlantılarınızın güçleneceği bir döneme girdiğinizin habercisi olabilir. Hayatınıza daha fazla denge getirecek olayların kapıda olduğunu işaret eder.' },
      '14:41': { title: '14:41 Saat Anlamı', meaning: 'Karmanın güçlü bir göstergesidir. Geçmişte yaptığınız bir eylemin sonuçlarını deneyimleyeceğiniz bir döneme işaret eder. İçsel bir hesaplaşmanın habercisi olabilir.' },
      '15:15': { title: '15:15 Saat Anlamı', meaning: 'Olumlu değişimlerin işaretidir. Hayatınızda durağanlıkların sona ereceği bir döneme girdiğinizi gösterebilir. Yeni kapıların açılacağını ifade eder.' },
      '16:00': { title: '16:00 Saat Anlamı', meaning: 'Hayatınızdaki temelleri güçlendirme mesajı taşır. Sorumluluklarınız ve uzun vadeli hedeflerinizle ilgili farkındalık kazandırır. Geçmişteki emeklerinizin karşılığını alacağınızı gösterir.' },
      '16:16': { title: '16:16 Saat Anlamı', meaning: 'Spiritüel büyüme ve kendini tanıma temalarıyla ilişkilendirilir. Ruhsal enerjinizin yükseldiği ve kendinizi daha iyi tanıyabileceğiniz bir sürece girdiğinizi ifade eder.' },
      '17:00': { title: '17:00 Saat Anlamı', meaning: 'Başarı ve bolluk mesajı taşır. Hayatınızda bereketli bir dönemin başladığını ve çabalarınızın karşılığını alacağınızı gösterir. Doğru yolda olduğunuza dair bir onay işareti olarak yorumlanabilir.' },
      '17:17': { title: '17:17 Saat Anlamı', meaning: 'Kaderinizin değiştiği önemli bir noktaya işaret eder. Hayatınızdaki önemli olayların hız kazanacağını ve bu değişimlerin sizi daha iyi bir yere taşıyacağını ifade eder.' },
      '18:00': { title: '18:00 Saat Anlamı', meaning: 'Günün sonlarına doğru hem fiziksel hem de ruhsal enerjinin yeniden şekillendiği bir zamanı işaret eder. Kendine dönme ve hayatını değerlendirme zamanı olduğunu hatırlatır.' },
      '18:18': { title: '18:18 Saat Anlamı', meaning: 'Başarı ve yenilik anlamlarına gelir. Çabalarınızın meyvesini almak üzere olduğuna işarettir. İçsel güçle ilişkilidir ve yeni başlangıçlar için doğru zamanda olduğunuzun göstergesidir.' },
      '19:19': { title: '19:19 Saat Anlamı', meaning: 'Sevgi, şefkat ve aile bağlarını temsil eder. Çevrenizdeki insanlara daha fazla dikkat etmeniz gerektiğini hatırlatır. Bir ilişkinin ya da projenin önemli bir aşamaya geldiğine işarettir.' },
      '20:20': { title: '20:20 Saat Anlamı', meaning: 'Hedeflerinize odaklanması gereken bir zamanı işaret eder. Evrenin size sabırlı olmanız ve kararlılıkla ilerlemeniz gerektiğini hatırlatması olarak yorumlanabilir. Kariyerle ilgili mesajlar taşır.' },
      '21:21': { title: '21:21 Saat Anlamı', meaning: 'Aşk ve ilişkilerle doğrudan bağlantılı bir zaman dilimidir. Yeni bir ilişkinin başlangıcına ya da mevcut ilişkide önemli bir gelişmeye işaret edebilir. Kalbinizi dinlemeniz gerektiğini vurgular.' },
      '22:22': { title: '22:22 Saat Anlamı', meaning: 'Spiritüel dünyada güçlü bir mesaj taşıyan saatlerden biridir. Evrenle uyum içinde olduğunuzu ve ruhsal bir farkındalık içinde olduğunuzu gösterir. Hayatınızın tüm alanlarında dengeye ulaşmanız gerektiğini vurgular.' },
      '23:00': { title: '23:00 Saat Anlamı', meaning: 'Gece yarısına yaklaşırken, günün enerjisinin yavaşça sona erdiği bir zamanı işaret eder. İçsel huzurunu bulması ve kendini yeniden merkezlemesi gerektiğini söyler. Ruhsal bir çağrışımla "kendine dön" mesajını taşır.' },
      '23:23': { title: '23:23 Saat Anlamı', meaning: 'Enerjinizin zirveye ulaştığı ve yaratıcı potansiyelinizin arttığı bir dönemi ifade eder. Hayatınızdaki bir fırsatı değerlendirmeniz gerektiğini gösterir. İlham alması ve yaratıcı fikirlerini hayata geçirmesi için ideal bir zamanı işaret eder.' },
      '23:32': { title: '23:32 Saat Anlamı', meaning: 'Karmaşık duyguların bir araya geldiği ve kişinin kendini daha iyi anlamaya çalıştığı bir zaman dilimini temsil eder. Duygusal zorlukların üstesinden gelmek için bir çağrı olarak yorumlanır. İçsel barışı ve uyumu simgeler.' }
    };
    
    return timeMeanings[timeString] || { title: 'Saat Anlamı', meaning: 'Bu saat için özel bir anlam bulunmuyor. Kendi sezgilerinizi dinleyin ve iç sesinize güvenin.' };
  }

  // Haftalık burç yorumları - Her gün farklı yorum
  const haftalikBurcYorumlari: Record<string, Record<string, string>> = {
    'Koç': {
      'Pazartesi': "Haftanın başında enerjiniz yüksek ve motivasyonunuz dorukta. Yeni projelere başlamak için mükemmel bir gün. Cesaretinizi toplayın ve hedeflerinize odaklanın. Öğleden sonra beklenmedik bir fırsat kapınızı çalabilir.",
      'Salı': "İkinci günde yeni projeler ve fırsatlar gündeme gelebilir. İletişim becerileriniz ön planda. Yeni insanlarla tanışmak ve farklı bakış açıları kazanmak için harika bir gün.",
      'Çarşamba': "Haftanın ortasında denge arayışında olacaksınız. Aile ve ev hayatınızla ilgili güzel gelişmeler yaşayacaksınız. Sevdiklerinizle daha fazla vakit geçirin.",
      'Perşembe': "Yaratıcılığınız ve özgüveninizle çevrenizi etkileyeceksiniz. Sahnede parlayacaksınız. Yeni projeler için ilham alacaksınız. Öğleden sonra takdir göreceğiniz bir durum yaşayabilirsiniz.",
      'Cuma': "Haftanın sonunda detaylara verdiğiniz önemle öne çıkacaksınız. Planlı ve düzenli çalışmanız sayesinde hedeflerinize ulaşacaksınız. Sağlık konularına özen gösterin.",
      'Cumartesi': "Hafta sonunda sosyal ilişkilerinizde barış ve huzur ön planda. Yeni dostluklar kurabilirsiniz. Estetik konulara ilginiz artacak. Romantik bir sürpriz olabilir.",
      'Pazar': "Dinlenme gününde sezgileriniz çok güçlü olacak. Gizli kalmış konular açığa çıkabilir. Dönüşüm ve yenilenme yaşayacaksınız. Akşam derin düşüncelere dalabilirsiniz."
    },
    'Boğa': {
      'Pazartesi': "Haftanın başında maddi konularda şanslısınız. Yatırımlarınızla ilgili olumlu gelişmeler yaşayabilirsiniz. Sabırlı ve kararlı tavrınız size kazandıracak.",
      'Salı': "İkinci günde iletişim becerileriniz ön planda. Yeni insanlarla tanışmak ve farklı bakış açıları kazanmak için harika bir gün. Seyahat planları yapabilirsiniz.",
      'Çarşamba': "Haftanın ortasında aile ve ev hayatınızla ilgili güzel gelişmeler yaşayacaksınız. Sevdiklerinizle daha fazla vakit geçirin. Duygusal anlamda kendinizi güvende hissedeceksiniz.",
      'Perşembe': "Yaratıcılığınız ve özgüveninizle çevrenizi etkileyeceksiniz. Yeni projeler için ilham alacaksınız. Öğleden sonra takdir göreceğiniz bir durum yaşayabilirsiniz.",
      'Cuma': "Haftanın sonunda detaylara verdiğiniz önemle öne çıkacaksınız. Planlı ve düzenli çalışmanız sayesinde hedeflerinize ulaşacaksınız. Sağlık konularına özen gösterin.",
      'Cumartesi': "Hafta sonunda sosyal ilişkilerinizde barış ve huzur ön planda. Yeni dostluklar kurabilirsiniz. Estetik konulara ilginiz artacak. Akşam sevdiklerinizle güzel bir vakit geçirin.",
      'Pazar': "Dinlenme gününde sezgileriniz çok güçlü olacak. Gizli kalmış konular açığa çıkabilir. Dönüşüm ve yenilenme yaşayacaksınız. Akşam romantik bir sürpriz olabilir."
    },
    'İkizler': {
      'Pazartesi': "Haftanın başında enerjiniz yüksek ve motivasyonunuz dorukta. Yeni projelere başlamak için mükemmel bir gün. Cesaretinizi toplayın ve hedeflerinize odaklanın.",
      'Salı': "İkinci günde iletişim becerileriniz ön planda. Yeni insanlarla tanışmak ve farklı bakış açıları kazanmak için harika bir gün. Seyahat planları yapabilirsiniz. Öğleden sonra sürpriz bir haber alabilirsiniz.",
      'Çarşamba': "Haftanın ortasında aile ve ev hayatınızla ilgili güzel gelişmeler yaşayacaksınız. Sevdiklerinizle daha fazla vakit geçirin. Duygusal anlamda kendinizi güvende hissedeceksiniz.",
      'Perşembe': "Yaratıcılığınız ve özgüveninizle çevrenizi etkileyeceksiniz. Yeni projeler için ilham alacaksınız. Öğleden sonra takdir göreceğiniz bir durum yaşayabilirsiniz.",
      'Cuma': "Haftanın sonunda detaylara verdiğiniz önemle öne çıkacaksınız. Planlı ve düzenli çalışmanız sayesinde hedeflerinize ulaşacaksınız. Sağlık konularına özen gösterin.",
      'Cumartesi': "Hafta sonunda sosyal ilişkilerinizde barış ve huzur ön planda. Yeni dostluklar kurabilirsiniz. Estetik konulara ilginiz artacak. Romantik bir sürpriz olabilir.",
      'Pazar': "Dinlenme gününde sezgileriniz çok güçlü olacak. Gizli kalmış konular açığa çıkabilir. Dönüşüm ve yenilenme yaşayacaksınız. Akşam derin düşüncelere dalabilirsiniz."
    },
    'Yengeç': {
      'Pazartesi': "Haftanın başında enerjiniz yüksek ve motivasyonunuz dorukta. Yeni projelere başlamak için mükemmel bir gün. Cesaretinizi toplayın ve hedeflerinize odaklanın.",
      'Salı': "İkinci günde iletişim becerileriniz ön planda. Yeni insanlarla tanışmak ve farklı bakış açıları kazanmak için harika bir gün. Seyahat planları yapabilirsiniz.",
      'Çarşamba': "Haftanın ortasında aile ve ev hayatınızla ilgili güzel gelişmeler yaşayacaksınız. Sevdiklerinizle daha fazla vakit geçirin. Duygusal anlamda kendinizi güvende hissedeceksiniz. Akşam romantik bir sürpriz olabilir.",
      'Perşembe': "Yaratıcılığınız ve özgüveninizle çevrenizi etkileyeceksiniz. Yeni projeler için ilham alacaksınız. Öğleden sonra takdir göreceğiniz bir durum yaşayabilirsiniz.",
      'Cuma': "Haftanın sonunda detaylara verdiğiniz önemle öne çıkacaksınız. Planlı ve düzenli çalışmanız sayesinde hedeflerinize ulaşacaksınız. Sağlık konularına özen gösterin.",
      'Cumartesi': "Hafta sonunda sosyal ilişkilerinizde barış ve huzur ön planda. Yeni dostluklar kurabilirsiniz. Estetik konulara ilginiz artacak. Akşam huzurlu bir vakit geçireceksiniz.",
      'Pazar': "Dinlenme gününde sezgileriniz çok güçlü olacak. Gizli kalmış konular açığa çıkabilir. Dönüşüm ve yenilenme yaşayacaksınız. Akşam derin düşüncelere dalabilirsiniz."
    },
    'Aslan': {
      'Pazartesi': "Haftanın başında enerjiniz yüksek ve motivasyonunuz dorukta. Yeni projelere başlamak için mükemmel bir gün. Cesaretinizi toplayın ve hedeflerinize odaklanın.",
      'Salı': "İkinci günde iletişim becerileriniz ön planda. Yeni insanlarla tanışmak ve farklı bakış açıları kazanmak için harika bir gün. Seyahat planları yapabilirsiniz.",
      'Çarşamba': "Haftanın ortasında aile ve ev hayatınızla ilgili güzel gelişmeler yaşayacaksınız. Sevdiklerinizle daha fazla vakit geçirin. Duygusal anlamda kendinizi güvende hissedeceksiniz.",
      'Perşembe': "Yaratıcılığınız ve özgüveninizle çevrenizi etkileyeceksiniz. Sahnede parlayacaksınız. Yeni projeler için ilham alacaksınız. Öğleden sonra takdir göreceğiniz bir durum yaşayabilirsiniz.",
      'Cuma': "Haftanın sonunda detaylara verdiğiniz önemle öne çıkacaksınız. Planlı ve düzenli çalışmanız sayesinde hedeflerinize ulaşacaksınız. Sağlık konularına özen gösterin.",
      'Cumartesi': "Hafta sonunda sosyal ilişkilerinizde barış ve huzur ön planda. Yeni dostluklar kurabilirsiniz. Estetik konulara ilginiz artacak. Romantik bir sürpriz olabilir.",
      'Pazar': "Dinlenme gününde sezgileriniz çok güçlü olacak. Gizli kalmış konular açığa çıkabilir. Dönüşüm ve yenilenme yaşayacaksınız. Akşam derin düşüncelere dalabilirsiniz."
    },
    'Başak': {
      'Pazartesi': "Haftanın başında enerjiniz yüksek ve motivasyonunuz dorukta. Yeni projelere başlamak için mükemmel bir gün. Cesaretinizi toplayın ve hedeflerinize odaklanın.",
      'Salı': "İkinci günde iletişim becerileriniz ön planda. Yeni insanlarla tanışmak ve farklı bakış açıları kazanmak için harika bir gün. Seyahat planları yapabilirsiniz.",
      'Çarşamba': "Haftanın ortasında aile ve ev hayatınızla ilgili güzel gelişmeler yaşayacaksınız. Sevdiklerinizle daha fazla vakit geçirin. Duygusal anlamda kendinizi güvende hissedeceksiniz.",
      'Perşembe': "Yaratıcılığınız ve özgüveninizle çevrenizi etkileyeceksiniz. Yeni projeler için ilham alacaksınız. Öğleden sonra takdir göreceğiniz bir durum yaşayabilirsiniz.",
      'Cuma': "Haftanın sonunda detaylara verdiğiniz önemle öne çıkacaksınız. Planlı ve düzenli çalışmanız sayesinde hedeflerinize ulaşacaksınız. Sağlık konularına özen gösterin. Akşam huzurlu bir vakit geçireceksiniz.",
      'Cumartesi': "Hafta sonunda sosyal ilişkilerinizde barış ve huzur ön planda. Yeni dostluklar kurabilirsiniz. Estetik konulara ilginiz artacak. Romantik bir sürpriz olabilir.",
      'Pazar': "Dinlenme gününde sezgileriniz çok güçlü olacak. Gizli kalmış konular açığa çıkabilir. Dönüşüm ve yenilenme yaşayacaksınız. Akşam derin düşüncelere dalabilirsiniz."
    },
    'Terazi': {
      'Pazartesi': "Haftanın başında enerjiniz yüksek ve motivasyonunuz dorukta. Yeni projelere başlamak için mükemmel bir gün. Cesaretinizi toplayın ve hedeflerinize odaklanın.",
      'Salı': "İkinci günde iletişim becerileriniz ön planda. Yeni insanlarla tanışmak ve farklı bakış açıları kazanmak için harika bir gün. Seyahat planları yapabilirsiniz.",
      'Çarşamba': "Haftanın ortasında aile ve ev hayatınızla ilgili güzel gelişmeler yaşayacaksınız. Sevdiklerinizle daha fazla vakit geçirin. Duygusal anlamda kendinizi güvende hissedeceksiniz.",
      'Perşembe': "Yaratıcılığınız ve özgüveninizle çevrenizi etkileyeceksiniz. Yeni projeler için ilham alacaksınız. Öğleden sonra takdir göreceğiniz bir durum yaşayabilirsiniz.",
      'Cuma': "Haftanın sonunda detaylara verdiğiniz önemle öne çıkacaksınız. Planlı ve düzenli çalışmanız sayesinde hedeflerinize ulaşacaksınız. Sağlık konularına özen gösterin.",
      'Cumartesi': "Hafta sonunda sosyal ilişkilerinizde barış ve huzur ön planda. Yeni dostluklar kurabilirsiniz. Estetik konulara ilginiz artacak. Romantik bir sürpriz olabilir.",
      'Pazar': "Dinlenme gününde sezgileriniz çok güçlü olacak. Gizli kalmış konular açığa çıkabilir. Dönüşüm ve yenilenme yaşayacaksınız. Akşam derin düşüncelere dalabilirsiniz."
    },
    'Akrep': {
      'Pazartesi': "Haftanın başında enerjiniz yüksek ve motivasyonunuz dorukta. Yeni projelere başlamak için mükemmel bir gün. Cesaretinizi toplayın ve hedeflerinize odaklanın.",
      'Salı': "İkinci günde iletişim becerileriniz ön planda. Yeni insanlarla tanışmak ve farklı bakış açıları kazanmak için harika bir gün. Seyahat planları yapabilirsiniz.",
      'Çarşamba': "Haftanın ortasında aile ve ev hayatınızla ilgili güzel gelişmeler yaşayacaksınız. Sevdiklerinizle daha fazla vakit geçirin. Duygusal anlamda kendinizi güvende hissedeceksiniz.",
      'Perşembe': "Yaratıcılığınız ve özgüveninizle çevrenizi etkileyeceksiniz. Yeni projeler için ilham alacaksınız. Öğleden sonra takdir göreceğiniz bir durum yaşayabilirsiniz.",
      'Cuma': "Haftanın sonunda detaylara verdiğiniz önemle öne çıkacaksınız. Planlı ve düzenli çalışmanız sayesinde hedeflerinize ulaşacaksınız. Sağlık konularına özen gösterin.",
      'Cumartesi': "Hafta sonunda sosyal ilişkilerinizde barış ve huzur ön planda. Yeni dostluklar kurabilirsiniz. Estetik konulara ilginiz artacak. Romantik bir sürpriz olabilir.",
      'Pazar': "Dinlenme gününde sezgileriniz çok güçlü olacak. Gizli kalmış konular açığa çıkabilir. Dönüşüm ve yenilenme yaşayacaksınız. Akşam derin düşüncelere dalabilirsiniz."
    },
    'Yay': {
      'Pazartesi': "Haftanın başında enerjiniz yüksek ve motivasyonunuz dorukta. Yeni projelere başlamak için mükemmel bir gün. Cesaretinizi toplayın ve hedeflerinize odaklanın.",
      'Salı': "İkinci günde iletişim becerileriniz ön planda. Yeni insanlarla tanışmak ve farklı bakış açıları kazanmak için harika bir gün. Seyahat planları yapabilirsiniz.",
      'Çarşamba': "Haftanın ortasında aile ve ev hayatınızla ilgili güzel gelişmeler yaşayacaksınız. Sevdiklerinizle daha fazla vakit geçirin. Duygusal anlamda kendinizi güvende hissedeceksiniz.",
      'Perşembe': "Yaratıcılığınız ve özgüveninizle çevrenizi etkileyeceksiniz. Yeni projeler için ilham alacaksınız. Öğleden sonra takdir göreceğiniz bir durum yaşayabilirsiniz.",
      'Cuma': "Haftanın sonunda detaylara verdiğiniz önemle öne çıkacaksınız. Planlı ve düzenli çalışmanız sayesinde hedeflerinize ulaşacaksınız. Sağlık konularına özen gösterin.",
      'Cumartesi': "Hafta sonunda sosyal ilişkilerinizde barış ve huzur ön planda. Yeni dostluklar kurabilirsiniz. Estetik konulara ilginiz artacak. Romantik bir sürpriz olabilir.",
      'Pazar': "Dinlenme gününde sezgileriniz çok güçlü olacak. Gizli kalmış konular açığa çıkabilir. Dönüşüm ve yenilenme yaşayacaksınız. Akşam derin düşüncelere dalabilirsiniz."
    },
    'Oğlak': {
      'Pazartesi': "Haftanın başında enerjiniz yüksek ve motivasyonunuz dorukta. Yeni projelere başlamak için mükemmel bir gün. Cesaretinizi toplayın ve hedeflerinize odaklanın.",
      'Salı': "İkinci günde iletişim becerileriniz ön planda. Yeni insanlarla tanışmak ve farklı bakış açıları kazanmak için harika bir gün. Seyahat planları yapabilirsiniz.",
      'Çarşamba': "Haftanın ortasında aile ve ev hayatınızla ilgili güzel gelişmeler yaşayacaksınız. Sevdiklerinizle daha fazla vakit geçirin. Duygusal anlamda kendinizi güvende hissedeceksiniz.",
      'Perşembe': "Yaratıcılığınız ve özgüveninizle çevrenizi etkileyeceksiniz. Yeni projeler için ilham alacaksınız. Öğleden sonra takdir göreceğiniz bir durum yaşayabilirsiniz.",
      'Cuma': "Haftanın sonunda detaylara verdiğiniz önemle öne çıkacaksınız. Planlı ve düzenli çalışmanız sayesinde hedeflerinize ulaşacaksınız. Sağlık konularına özen gösterin.",
      'Cumartesi': "Hafta sonunda sosyal ilişkilerinizde barış ve huzur ön planda. Yeni dostluklar kurabilirsiniz. Estetik konulara ilginiz artacak. Romantik bir sürpriz olabilir.",
      'Pazar': "Dinlenme gününde sezgileriniz çok güçlü olacak. Gizli kalmış konular açığa çıkabilir. Dönüşüm ve yenilenme yaşayacaksınız. Akşam derin düşüncelere dalabilirsiniz."
    },
    'Kova': {
      'Pazartesi': "Haftanın başında enerjiniz yüksek ve motivasyonunuz dorukta. Yeni projelere başlamak için mükemmel bir gün. Cesaretinizi toplayın ve hedeflerinize odaklanın.",
      'Salı': "İkinci günde iletişim becerileriniz ön planda. Yeni insanlarla tanışmak ve farklı bakış açıları kazanmak için harika bir gün. Seyahat planları yapabilirsiniz.",
      'Çarşamba': "Haftanın ortasında aile ve ev hayatınızla ilgili güzel gelişmeler yaşayacaksınız. Sevdiklerinizle daha fazla vakit geçirin. Duygusal anlamda kendinizi güvende hissedeceksiniz.",
      'Perşembe': "Yaratıcılığınız ve özgüveninizle çevrenizi etkileyeceksiniz. Yeni projeler için ilham alacaksınız. Öğleden sonra takdir göreceğiniz bir durum yaşayabilirsiniz.",
      'Cuma': "Haftanın sonunda detaylara verdiğiniz önemle öne çıkacaksınız. Planlı ve düzenli çalışmanız sayesinde hedeflerinize ulaşacaksınız. Sağlık konularına özen gösterin.",
      'Cumartesi': "Hafta sonunda sosyal ilişkilerinizde barış ve huzur ön planda. Yeni dostluklar kurabilirsiniz. Estetik konulara ilginiz artacak. Romantik bir sürpriz olabilir.",
      'Pazar': "Dinlenme gününde sezgileriniz çok güçlü olacak. Gizli kalmış konular açığa çıkabilir. Dönüşüm ve yenilenme yaşayacaksınız. Akşam derin düşüncelere dalabilirsiniz."
    },
    'Balık': {
      'Pazartesi': "Haftanın başında enerjiniz yüksek ve motivasyonunuz dorukta. Yeni projelere başlamak için mükemmel bir gün. Cesaretinizi toplayın ve hedeflerinize odaklanın.",
      'Salı': "İkinci günde iletişim becerileriniz ön planda. Yeni insanlarla tanışmak ve farklı bakış açıları kazanmak için harika bir gün. Seyahat planları yapabilirsiniz.",
      'Çarşamba': "Haftanın ortasında aile ve ev hayatınızla ilgili güzel gelişmeler yaşayacaksınız. Sevdiklerinizle daha fazla vakit geçirin. Duygusal anlamda kendinizi güvende hissedeceksiniz.",
      'Perşembe': "Yaratıcılığınız ve özgüveninizle çevrenizi etkileyeceksiniz. Yeni projeler için ilham alacaksınız. Öğleden sonra takdir göreceğiniz bir durum yaşayabilirsiniz.",
      'Cuma': "Haftanın sonunda detaylara verdiğiniz önemle öne çıkacaksınız. Planlı ve düzenli çalışmanız sayesinde hedeflerinize ulaşacaksınız. Sağlık konularına özen gösterin.",
      'Cumartesi': "Hafta sonunda sosyal ilişkilerinizde barış ve huzur ön planda. Yeni dostluklar kurabilirsiniz. Estetik konulara ilginiz artacak. Romantik bir sürpriz olabilir.",
      'Pazar': "Dinlenme gününde sezgileriniz çok güçlü olacak. Gizli kalmış konular açığa çıkabilir. Dönüşüm ve yenilenme yaşayacaksınız. Akşam derin düşüncelere dalabilirsiniz."
    }
  };

  // Günlük burç yorumu alma fonksiyonu
  function getGunlukBurcYorumu(burc: string): string {
    const gunler = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const bugun = gunler[new Date().getDay()];
    return haftalikBurcYorumlari[burc]?.[bugun] || "Bugün için yorum bulunamadı.";
  }



  // Burç detay açıklamaları
  const burcYorumlari: Record<string, { genel: string; ask: string; kariyer: string; saglik: string }> = {
    'Koç': {
      genel: `Koç burcu bu yıl enerjisiyle çevresini etkilemeye devam edecek. Liderlik vasıflarınız ve girişimci ruhunuz sayesinde yeni projelere adım atmak için harika bir dönemdesiniz. Özellikle ilkbahar aylarında hayatınızda önemli değişiklikler ve yeni başlangıçlar olabilir. Cesaretiniz ve kararlılığınız, karşılaştığınız zorlukları aşmanızda size büyük destek olacak. Aile ilişkilerinizde daha koruyucu ve destekleyici bir rol üstlenebilirsiniz. Sosyal çevreniz genişleyecek, yeni dostluklar ve fırsatlar kapınızı çalacak. Bu yıl, geçmişte yaşadığınız bazı hayal kırıklıklarından ders alarak, geleceğe daha güçlü bir şekilde yön vereceksiniz. Yaratıcı projelerde yer almak ve yenilikçi fikirler geliştirmek size büyük başarılar getirecek. Özellikle yaz aylarında seyahat etmek ve yeni yerler keşfetmek size ilham verecek. Kendi potansiyelinizi keşfetmek için cesur adımlar atabilirsiniz.`,
      ask: `Aşk hayatınızda tutku ve heyecan ön planda olacak. İlişkisi olan Koçlar partnerleriyle daha derin bağlar kuracak, yalnız olanlar ise sürpriz bir aşka yelken açabilir. Duygularınızı açıkça ifade etmekten çekinmeyin. Bu yıl, ilişkilerde dürüstlük ve açıklık size kazandıracak. Zaman zaman sabırsızlık gösterebilir, karşı tarafı zorlayabilirsiniz; empati kurmaya çalışın. Romantik sürprizler ve yeni başlangıçlar için harika bir dönem. Özellikle yaz aylarında aşk hayatınızda önemli gelişmeler yaşayabilirsiniz. Partnerinizle ortak aktiviteler yapmak, birlikte seyahat etmek ilişkinizi güçlendirecek. Eğer yalnızsanız, sosyal ortamlarda tanışacağınız kişilerle güçlü bağlar kurabilirsiniz. Ancak acele etmemeye ve karşı tarafı tanımaya zaman ayırmaya özen gösterin. Duygusal olgunluk kazanacak ve ilişkilerde daha dengeli davranacaksınız. Geçmişte yaşadığınız aşk acılarından ders alarak, yeni ilişkilerde daha bilinçli davranacaksınız.`,
      kariyer: `İş hayatınızda liderlik vasıflarınız sayesinde önemli projelerde yer alacaksınız. Cesur adımlarınız takdir görecek. Yeni iş teklifleri ve terfi fırsatları gündeme gelebilir. Risk almaktan korkmayın, başarı sizinle olacak. Ancak, iş arkadaşlarınızla iletişime ve ekip çalışmasına önem vermelisiniz. Kendi işinizi kurmak veya mevcut işinizde yenilikçi projelere imza atmak için uygun bir yıl. Finansal konularda ise harcamalarınıza dikkat edin. Özellikle ilkbahar ve yaz aylarında kariyerinizde önemli gelişmeler yaşayabilirsiniz. Yeni eğitimler almak, sertifikalar edinmek size çok faydalı olacak. Yabancı dil öğrenmek veya mevcut dilinizi geliştirmek de kariyerinizde size avantaj sağlayacak. İş ortamında daha aktif bir rol üstlenmek, yeni fikirler sunmak sizi öne çıkaracak. Ancak, bazen sabırsızlığınız iş arkadaşlarınızla aranızda gerginlik yaratabilir, bu konuda dikkatli olmalısınız. Uzun vadeli kariyer planları yapmak ve hedeflerinizi netleştirmek için ideal bir dönem. Özellikle teknoloji ve yenilikçi sektörlerde başarılı olabilirsiniz.`,
      saglik: `Enerjiniz yüksek olacak ancak zaman zaman stres ve baş ağrılarına dikkat etmelisiniz. Spor ve açık hava aktiviteleri size iyi gelecek. Sağlıklı beslenmeye özen gösterin. Özellikle kas ve eklem sağlığınıza dikkat etmeniz gereken bir dönem. Uyku düzeninizi korumak ve dinlenmeye zaman ayırmak, yıl boyunca enerjinizi yüksek tutmanıza yardımcı olacak. Gerektiğinde profesyonel destek almaktan çekinmeyin. Koşu, yüzme, bisiklet gibi kardiyovasküler egzersizler size çok iyi gelecek. Ayrıca yoga ve meditasyon gibi rahatlatıcı aktiviteler stres seviyenizi kontrol altında tutmanıza yardımcı olacak. Baş ve boyun bölgesindeki gerginlikler için düzenli masaj yaptırmak faydalı olacak. Beslenme konusunda protein ağırlıklı bir diyet ve bol su tüketimi enerjinizi artıracak. Düzenli sağlık kontrolleri yaptırmayı ihmal etmeyin. Stres yönetimi konusunda profesyonel destek almak da faydalı olabilir. Özellikle göz sağlığınıza da dikkat etmelisiniz.`,
    },
    'Boğa': {
      genel: `Boğa burcu bu yıl istikrar ve güven arayışında olacak. Maddi konularda şansınız açık, yatırımlarınızdan güzel sonuçlar alabilirsiniz. Aile ve ev hayatınızda huzur ön planda olacak. Sabırlı ve kararlı tavrınız çevreniz tarafından takdir edilecek. Bu yıl, uzun vadeli planlar yapmak ve geleceğe yatırım yapmak için çok uygun. Sevdiklerinizle daha fazla vakit geçirecek, evinizde yenilikler yapacaksınız. Duygusal anlamda ise kendinizi daha güvende hissedeceksiniz.`,
      ask: `Aşk hayatınızda romantizm ve sadakat ön planda. Partnerinizle aranızdaki bağ güçlenecek. Yalnız Boğalar ise güven veren bir ilişkiye adım atabilir. Duygularınızı paylaşmaktan çekinmeyin. Bu yıl, ilişkilerde karşılıklı anlayış ve sabır çok önemli olacak. Geçmişte yaşanan kırgınlıklar son bulabilir, yeni bir sayfa açabilirsiniz. Evlilik ve uzun vadeli birliktelikler için de uygun bir dönem.`,
      kariyer: `İş hayatınızda sabırlı ve disiplinli çalışmanız sayesinde önemli başarılar elde edeceksiniz. Maddi kazançlarınız artacak, yeni iş fırsatları gündeme gelebilir. Uzun vadeli planlar yapmanız faydalı olacak. İş ortamında güvenilirliğiniz ve çalışkanlığınızla öne çıkacaksınız. Yatırımlar ve birikimler konusunda şanslı bir yıl. Ancak, riskli işlerden uzak durmakta fayda var.`,
      saglik: `Sağlığınız genel olarak iyi olacak. Ancak boğaz ve boyun bölgesine dikkat etmelisiniz. Düzenli egzersiz ve sağlıklı beslenme size iyi gelecek. Özellikle kilo kontrolü ve metabolizma sağlığına özen göstermelisiniz. Stresli dönemlerde doğa yürüyüşleri ve meditasyon size iyi gelecek. Uyku düzeninizi korumak da önemli.`,
    },
    'İkizler': {
      genel: `İkizler burcu bu yıl iletişim, öğrenme ve sosyal çevre açısından oldukça hareketli bir dönemden geçecek. Zihinsel enerjinizin yüksekliği sayesinde yeni projelere ve eğitimlere açık olacaksınız. Özellikle yılın ilk yarısında yeni insanlarla tanışmak, farklı bakış açıları kazanmak ve kendinizi geliştirmek için birçok fırsat yakalayacaksınız. Seyahatler, kısa yolculuklar ve yeni deneyimler hayatınıza renk katacak. Esnekliğiniz ve uyum yeteneğiniz sayesinde değişen koşullara kolayca adapte olacaksınız. Aile içinde bazı iletişim sorunları yaşanabilir, ancak sabırlı ve anlayışlı davranırsanız her şey yoluna girecek. Yılın ikinci yarısında ise daha fazla içe dönüp, kendinizi ve hedeflerinizi sorgulayabilirsiniz.`,
      ask: `Aşk hayatınızda hareketlilik ve değişim ön planda olacak. İlişkisi olan İkizler burçları partnerleriyle daha fazla iletişim kuracak, yalnız olanlar ise yeni bir aşka yelken açabilir. Flörtler ve kısa süreli ilişkiler gündeme gelebilir. Bu yıl, duygularınızı açıkça ifade etmekten çekinmeyin. Partnerinizle birlikte yeni aktiviteler yapmak ilişkinizi güçlendirecek. Yalnız İkizler için sosyal ortamlarda tanışmalar ve sürpriz aşklar mümkün. Ancak, kararsızlık ve yüzeysellikten kaçınmaya özen gösterin. Duygusal derinlik arayışınız artabilir.`,
      kariyer: `İş hayatınızda iletişim becerileriniz sayesinde önemli fırsatlar yakalayacaksınız. Yeni projeler, sunumlar ve toplantılar sizi bekliyor. Yaratıcı fikirlerinizle dikkat çekeceksiniz. Eğitim, medya, yazarlık ve satış gibi alanlarda başarılarınız artacak. Yılın ortasında iş değişikliği veya yeni bir pozisyon gündeme gelebilir. Takım çalışmasına önem verin ve iş arkadaşlarınızla ilişkilerinizi güçlendirin. Finansal konularda ise harcamalarınıza dikkat edin.`,
      saglik: `Zihinsel yorgunluk ve uykusuzluk sorunlarına dikkat etmelisiniz. Meditasyon ve dinlenmeye zaman ayırmak size iyi gelecek. Özellikle solunum yolları ve sinir sistemi hassasiyetlerine karşı önlem alın. Düzenli egzersiz ve sağlıklı beslenme ile enerjinizi yüksek tutabilirsiniz.`,
    },
    'Yengeç': {
      genel: `Yengeç burcu bu yıl aile, ev ve duygusal güvenlik konularında önemli gelişmeler yaşayacak. Sevdiklerinizle daha fazla vakit geçirecek, duygusal bağlarınızı güçlendireceksiniz. Geçmişten gelen bazı konular gündeme gelebilir, affetmek ve bırakmak size iyi gelecek. Ev değişikliği, taşınma veya evde yenilikler yapmak için uygun bir dönem. İçsel huzur ve denge arayışınız artacak. Yılın ikinci yarısında ise kariyer ve toplumsal statü ön plana çıkabilir.`,
      ask: `Aşk hayatınızda duygusallık ve şefkat ön planda olacak. Partnerinizle romantik anlar yaşayacaksınız. Yalnız Yengeçler ise duygusal bir ilişkiye adım atabilir. Aile kurma ve uzun vadeli ilişkiler için uygun bir yıl. Geçmişte yaşanan kırgınlıklar son bulabilir, yeni bir sayfa açabilirsiniz. Partnerinizle iletişime ve empatiye önem verin.`,
      kariyer: `İş hayatınızda sezgileriniz çok güçlü olacak. Takım çalışmalarında başarılı olacaksınız. Evden çalışma veya aile şirketiyle ilgili fırsatlar gündeme gelebilir. Yılın ikinci yarısında ise kariyerinizde önemli bir yükseliş yaşayabilirsiniz. Üstlerinizden destek görecek, yeni sorumluluklar alacaksınız.`,
      saglik: `Mide ve sindirim sistemi hassasiyetlerine dikkat etmelisiniz. Duygusal stres sağlığınızı etkileyebilir, rahatlatıcı aktiviteler faydalı olacak. Su tüketimine ve beslenme düzeninize özen gösterin.`,
    },
    'Aslan': {
      genel: `Aslan burcu bu yıl sahnede parlayacak. Yaratıcılığınız ve özgüveninizle çevrenizi etkileyeceksiniz. Yeni hobiler, projeler ve sosyal aktiviteler gündeme gelebilir. Liderlik vasıflarınız ön plana çıkacak. Özellikle yaz aylarında kendinizi daha enerjik ve motive hissedeceksiniz. Aile içinde bazı sorumluluklar artabilir, ancak sevgiyle üstesinden geleceksiniz.`,
      ask: `Aşk hayatınızda tutku ve eğlence ön planda olacak. Partnerinizle keyifli zamanlar geçireceksiniz. Yalnız Aslanlar ise dikkat çekici bir aşka yelken açabilir. Romantik sürprizler ve yeni başlangıçlar için harika bir dönem. İlişkilerde gurur ve inatçılıktan kaçının.`,
      kariyer: `İş hayatınızda yaratıcılığınız ve liderliğiniz sayesinde önemli başarılar elde edeceksiniz. Yeni projeler ve terfi fırsatları gündeme gelebilir. Sanat, sahne, medya ve yönetim alanlarında öne çıkacaksınız. Finansal konularda ise harcamalarınıza dikkat edin.`,
      saglik: `Kalp ve sırt bölgesine dikkat etmelisiniz. Düzenli egzersiz ve sağlıklı yaşam tarzı size iyi gelecek. Özellikle yaz aylarında güneşten korunmaya özen gösterin.`,
    },
    'Başak': {
      genel: `Başak burcu bu yıl detaylara verdiği önemle öne çıkacak. Planlı ve düzenli çalışmanız sayesinde hedeflerinize ulaşacaksınız. Sağlık ve günlük rutinlerinizde iyileşmeler olacak. Ev ve iş hayatında düzen kurmak için uygun bir dönem. Özellikle yılın ilk yarısında, hayatınızda uzun süredir ertelediğiniz konuları ele alacak ve bunları sistemli bir şekilde çözmeye başlayacaksınız. Aile içi ilişkilerde daha yapıcı ve destekleyici bir rol üstlenebilirsiniz. Arkadaş çevrenizden beklenmedik destekler görebilir, yeni dostluklar kurabilirsiniz. Yılın ikinci yarısında ise, kişisel gelişim ve eğitim konularında önemli fırsatlar karşınıza çıkacak. Kendi potansiyelinizi keşfetmek ve yeni beceriler edinmek için harika bir dönem olacak. Öz disiplininiz ve analitik düşünme yeteneğiniz sayesinde, karşılaştığınız zorlukları kolayca aşacaksınız. Özellikle sonbahar aylarında, iş ve özel hayatınızda dengeyi sağlamak için çaba göstereceksiniz. Bu yıl, geçmişte yaşadığınız bazı hayal kırıklıklarından ders alarak, geleceğe daha güçlü bir şekilde yön vereceksiniz.`,
      ask: `Aşk hayatınızda sadakat ve güven ön planda olacak. Partnerinizle aranızdaki iletişim güçlenecek. Yalnız Başaklar ise mantıklı bir ilişkiye adım atabilir. İlişkilerde eleştirel olmamaya özen gösterin. Bu yıl, duygularınızı daha açık ifade etmeye başlayacaksınız. Partnerinizle birlikte ortak hedefler belirleyebilir, ilişkinizi bir üst seviyeye taşıyabilirsiniz. Yalnız olan Başaklar için ise, sosyal çevrelerinde tanışacakları biriyle uzun vadeli ve güvene dayalı bir ilişki başlama ihtimali yüksek. Geçmişte yaşanan kırgınlıkları geride bırakmak ve yeni bir sayfa açmak için uygun bir dönem. Romantik sürprizler ve anlamlı sohbetler ilişkinizi güçlendirecek.`,
      kariyer: `İş hayatınızda titizliğiniz ve çalışkanlığınız sayesinde takdir göreceksiniz. Yeni iş teklifleri ve projeler gündeme gelebilir. Eğitim, sağlık, hizmet ve analiz gerektiren alanlarda başarılarınız artacak. Özellikle yılın ortasında, kariyerinizde önemli bir dönüm noktası yaşayabilirsiniz. Yöneticilerinizden takdir görecek, yeni sorumluluklar üstleneceksiniz. Kendi işinizi kurmak veya mevcut işinizde yenilikçi projelere imza atmak için uygun bir yıl. Finansal konularda ise harcamalarınıza dikkat edin. Uzun vadeli planlar yapmak ve hedeflerinizi netleştirmek için ideal bir dönem.`,
      saglik: `Bağırsak ve sinir sistemi hassasiyetlerine dikkat etmelisiniz. Düzenli uyku ve sağlıklı beslenme önemli. Stres yönetimi için meditasyon ve doğa yürüyüşleri önerilir. Özellikle yılın ilk aylarında, sağlığınıza daha fazla özen göstermeniz gerekebilir. Düzenli egzersiz yapmak, beslenme alışkanlıklarınızı gözden geçirmek ve zararlı alışkanlıklardan uzak durmak sağlığınızı olumlu yönde etkileyecek. Ayrıca, ruhsal dengeyi korumak için hobilerinize zaman ayırmayı ihmal etmeyin.`,
    },
    'Terazi': {
      genel: `Terazi burcu bu yıl denge ve uyum arayışında olacak. Sosyal ilişkilerinizde barış ve huzur ön planda. Yeni dostluklar ve iş birlikleri gündeme gelebilir. Estetik ve sanatsal konulara ilginiz artacak. Yılın başından itibaren, çevrenizdeki insanlarla daha uyumlu ilişkiler kurmak için çaba göstereceksiniz. Özellikle ilkbahar aylarında, sosyal hayatınızda hareketlilik artacak ve yeni arkadaşlıklar kuracaksınız. Aile içinde yaşanabilecek küçük anlaşmazlıkları diplomatik tavrınızla kolayca çözebileceksiniz. Yılın ikinci yarısında ise, kişisel gelişim ve kendinizi ifade etme konularında önemli adımlar atacaksınız. Sanatsal projelerde yer almak, yeni hobiler edinmek ve kendinizi geliştirmek için harika bir dönem olacak.`,
      ask: `Aşk hayatınızda romantizm ve uyum ön planda olacak. Partnerinizle aranızdaki dengeyi korumak önemli. Yalnız Teraziler ise yeni bir ilişkiye başlayabilir. İlişkilerde adalet ve karşılıklı anlayışa önem verin. Bu yıl, duygularınızı daha açık ifade etmeye başlayacaksınız. Partnerinizle birlikte ortak hedefler belirleyebilir, ilişkinizi bir üst seviyeye taşıyabilirsiniz. Yalnız olan Teraziler için ise, sosyal çevrelerinde tanışacakları biriyle uzun vadeli ve güvene dayalı bir ilişki başlama ihtimali yüksek. Geçmişte yaşanan kırgınlıkları geride bırakmak ve yeni bir sayfa açmak için uygun bir dönem. Romantik sürprizler ve anlamlı sohbetler ilişkinizi güçlendirecek.`,
      kariyer: `İş hayatınızda iş birlikleri ve ortaklıklar ön planda olacak. Diplomasi ve adalet duygunuz sayesinde başarılı olacaksınız. Hukuk, sanat, danışmanlık ve insan ilişkileri alanlarında öne çıkacaksınız. Özellikle yılın ortasında, kariyerinizde önemli bir dönüm noktası yaşayabilirsiniz. Yöneticilerinizden takdir görecek, yeni sorumluluklar üstleneceksiniz. Kendi işinizi kurmak veya mevcut işinizde yenilikçi projelere imza atmak için uygun bir yıl. Finansal konularda ise harcamalarınıza dikkat edin. Uzun vadeli planlar yapmak ve hedeflerinizi netleştirmek için ideal bir dönem.`,
      saglik: `Böbrek ve bel bölgesine dikkat etmelisiniz. Dengeli beslenme ve su tüketimi önemli. Özellikle yılın ilk aylarında, sağlığınıza daha fazla özen göstermeniz gerekebilir. Düzenli egzersiz yapmak, beslenme alışkanlıklarınızı gözden geçirmek ve zararlı alışkanlıklardan uzak durmak sağlığınızı olumlu yönde etkileyecek. Ayrıca, ruhsal dengeyi korumak için hobilerinize zaman ayırmayı ihmal etmeyin.`,
    },
    'Akrep': {
      genel: `Akrep burcu bu yıl dönüşüm ve yenilenme yaşayacak. Hayatınızda köklü değişiklikler olabilir. Sezgileriniz çok güçlü olacak. Gizli kalmış konular açığa çıkabilir. Yılın başından itibaren, geçmişte yaşadığınız bazı olayların etkisinden kurtulacak ve kendinizi yeniden keşfetmeye başlayacaksınız. Özellikle ilkbahar aylarında, içsel gücünüzü ve kararlılığınızı ortaya koyarak önemli adımlar atacaksınız. Aile içinde yaşanabilecek küçük anlaşmazlıkları diplomatik tavrınızla kolayca çözebileceksiniz. Yılın ikinci yarısında ise, kişisel gelişim ve kendinizi ifade etme konularında önemli adımlar atacaksınız. Sanatsal projelerde yer almak, yeni hobiler edinmek ve kendinizi geliştirmek için harika bir dönem olacak.`,
      ask: `Aşk hayatınızda tutku ve derinlik ön planda olacak. Partnerinizle aranızdaki bağ güçlenecek. Yalnız Akrepler ise gizemli bir aşka yelken açabilir. İlişkilerde kıskançlık ve kontrol duygusuna dikkat edin. Bu yıl, duygularınızı daha açık ifade etmeye başlayacaksınız. Partnerinizle birlikte ortak hedefler belirleyebilir, ilişkinizi bir üst seviyeye taşıyabilirsiniz. Yalnız olan Akrepler için ise, sosyal çevrelerinde tanışacakları biriyle uzun vadeli ve güvene dayalı bir ilişki başlama ihtimali yüksek. Geçmişte yaşanan kırgınlıkları geride bırakmak ve yeni bir sayfa açmak için uygun bir dönem. Romantik sürprizler ve anlamlı sohbetler ilişkinizi güçlendirecek.`,
      kariyer: `İş hayatınızda stratejik kararlar alacaksınız. Gizli fırsatlar ve yeni projeler gündeme gelebilir. Araştırma, psikoloji, finans ve kriz yönetimi alanlarında başarılı olacaksınız. Özellikle yılın ortasında, kariyerinizde önemli bir dönüm noktası yaşayabilirsiniz. Yöneticilerinizden takdir görecek, yeni sorumluluklar üstleneceksiniz. Kendi işinizi kurmak veya mevcut işinizde yenilikçi projelere imza atmak için uygun bir yıl. Finansal konularda ise harcamalarınıza dikkat edin. Uzun vadeli planlar yapmak ve hedeflerinizi netleştirmek için ideal bir dönem.`,
      saglik: `Üreme organları ve hormonal dengeye dikkat etmelisiniz. Ruhsal dengeyi korumak önemli. Özellikle yılın ilk aylarında, sağlığınıza daha fazla özen göstermeniz gerekebilir. Düzenli egzersiz yapmak, beslenme alışkanlıklarınızı gözden geçirmek ve zararlı alışkanlıklardan uzak durmak sağlığınızı olumlu yönde etkileyecek. Ayrıca, ruhsal dengeyi korumak için hobilerinize zaman ayırmayı ihmal etmeyin.`,
    },
    'Yay': {
      genel: `Yay burcu bu yıl özgürlük ve keşif arayışında olacak. Seyahatler, eğitimler ve yeni deneyimler gündeme gelebilir. Hayata pozitif bakacaksınız. Yılın başından itibaren, yeni yerler keşfetmek ve farklı kültürlerle tanışmak için büyük bir istek duyacaksınız. Özellikle ilkbahar ve yaz aylarında, uzun zamandır hayalini kurduğunuz bir seyahate çıkabilir veya yeni bir eğitim programına başlayabilirsiniz. Sosyal çevreniz genişleyecek, yeni dostluklar kuracaksınız. Yılın ikinci yarısında ise, kişisel gelişim ve kendinizi ifade etme konularında önemli adımlar atacaksınız. Sanatsal projelerde yer almak, yeni hobiler edinmek ve kendinizi geliştirmek için harika bir dönem olacak.`,
      ask: `Aşk hayatınızda macera ve heyecan ön planda olacak. Partnerinizle yeni aktiviteler deneyebilirsiniz. Yalnız Yaylar ise sürpriz bir aşka yelken açabilir. İlişkilerde özgürlük ihtiyacınızı dengelemeye çalışın. Bu yıl, duygularınızı daha açık ifade etmeye başlayacaksınız. Partnerinizle birlikte ortak hedefler belirleyebilir, ilişkinizi bir üst seviyeye taşıyabilirsiniz. Yalnız olan Yaylar için ise, sosyal çevrelerinde tanışacakları biriyle uzun vadeli ve güvene dayalı bir ilişki başlama ihtimali yüksek. Geçmişte yaşanan kırgınlıkları geride bırakmak ve yeni bir sayfa açmak için uygun bir dönem. Romantik sürprizler ve anlamlı sohbetler ilişkinizi güçlendirecek.`,
      kariyer: `İş hayatınızda yeni fırsatlar ve projeler gündeme gelebilir. Yabancılarla iş birlikleri ve eğitimler ön planda olacak. Akademik, medya, seyahat ve hukuk alanlarında başarılarınız artacak. Özellikle yılın ortasında, kariyerinizde önemli bir dönüm noktası yaşayabilirsiniz. Yöneticilerinizden takdir görecek, yeni sorumluluklar üstleneceksiniz. Kendi işinizi kurmak veya mevcut işinizde yenilikçi projelere imza atmak için uygun bir yıl. Finansal konularda ise harcamalarınıza dikkat edin. Uzun vadeli planlar yapmak ve hedeflerinizi netleştirmek için ideal bir dönem.`,
      saglik: `Karaciğer ve uyluk bölgesine dikkat etmelisiniz. Açık hava aktiviteleri size iyi gelecek. Özellikle yılın ilk aylarında, sağlığınıza daha fazla özen göstermeniz gerekebilir. Düzenli egzersiz yapmak, beslenme alışkanlıklarınızı gözden geçirmek ve zararlı alışkanlıklardan uzak durmak sağlığınızı olumlu yönde etkileyecek. Ayrıca, ruhsal dengeyi korumak için hobilerinize zaman ayırmayı ihmal etmeyin.`,
    },
    'Oğlak': {
      genel: `Oğlak burcu bu yıl hedeflerine odaklanacak. Disiplinli ve kararlı tavrınız sayesinde büyük başarılar elde edeceksiniz. Maddi konularda şansınız açık. Yılın başından itibaren, uzun vadeli planlar yapmak ve geleceğe yatırım yapmak için çok uygun bir dönem olacak. Özellikle ilkbahar aylarında, iş hayatınızda önemli gelişmeler yaşayabilir ve yeni projelere adım atabilirsiniz. Aile içinde yaşanabilecek küçük anlaşmazlıkları diplomatik tavrınızla kolayca çözebileceksiniz. Yılın ikinci yarısında ise, kişisel gelişim ve kendinizi ifade etme konularında önemli adımlar atacaksınız. Sanatsal projelerde yer almak, yeni hobiler edinmek ve kendinizi geliştirmek için harika bir dönem olacak.`,
      ask: `Aşk hayatınızda ciddiyet ve güven ön planda olacak. Partnerinizle uzun vadeli planlar yapabilirsiniz. Yalnız Oğlaklar ise kalıcı bir ilişkiye adım atabilir. Bu yıl, duygularınızı daha açık ifade etmeye başlayacaksınız. Partnerinizle birlikte ortak hedefler belirleyebilir, ilişkinizi bir üst seviyeye taşıyabilirsiniz. Yalnız olan Oğlaklar için ise, sosyal çevrelerinde tanışacakları biriyle uzun vadeli ve güvene dayalı bir ilişki başlama ihtimali yüksek. Geçmişte yaşanan kırgınlıkları geride bırakmak ve yeni bir sayfa açmak için uygun bir dönem. Romantik sürprizler ve anlamlı sohbetler ilişkinizi güçlendirecek.`,
      kariyer: `İş hayatınızda azminiz ve çalışkanlığınız sayesinde terfi ve ödüller gündeme gelebilir. Yeni sorumluluklar alabilirsiniz. Yönetim, finans, inşaat ve mühendislik alanlarında öne çıkacaksınız. Özellikle yılın ortasında, kariyerinizde önemli bir dönüm noktası yaşayabilirsiniz. Yöneticilerinizden takdir görecek, yeni sorumluluklar üstleneceksiniz. Kendi işinizi kurmak veya mevcut işinizde yenilikçi projelere imza atmak için uygun bir yıl. Finansal konularda ise harcamalarınıza dikkat edin. Uzun vadeli planlar yapmak ve hedeflerinizi netleştirmek için ideal bir dönem.`,
      saglik: `Diz ve kemik sağlığına dikkat etmelisiniz. Düzenli egzersiz ve dinlenme önemli. Özellikle yılın ilk aylarında, sağlığınıza daha fazla özen göstermeniz gerekebilir. Düzenli egzersiz yapmak, beslenme alışkanlıklarınızı gözden geçirmek ve zararlı alışkanlıklardan uzak durmak sağlığınızı olumlu yönde etkileyecek. Ayrıca, ruhsal dengeyi korumak için hobilerinize zaman ayırmayı ihmal etmeyin.`,
    },
    'Kova': {
      genel: `Kova burcu bu yıl yenilikçi ve özgür ruhlu olacak. Farklı projeler ve sosyal aktiviteler gündeme gelebilir. Arkadaş çevreniz genişleyecek. Yılın başından itibaren, yeni fikirler üretmek ve bunları hayata geçirmek için büyük bir istek duyacaksınız. Özellikle ilkbahar ve yaz aylarında, uzun zamandır hayalini kurduğunuz bir projeye başlayabilir veya yeni bir sosyal gruba katılabilirsiniz. Sosyal çevreniz genişleyecek, yeni dostluklar kuracaksınız. Yılın ikinci yarısında ise, kişisel gelişim ve kendinizi ifade etme konularında önemli adımlar atacaksınız. Sanatsal projelerde yer almak, yeni hobiler edinmek ve kendinizi geliştirmek için harika bir dönem olacak.`,
      ask: `Aşk hayatınızda özgürlük ve bireysellik ön planda olacak. Partnerinizle aranızdaki iletişim güçlenecek. Yalnız Kovalar ise sıra dışı bir aşka yelken açabilir. İlişkilerde bağımsızlık ihtiyacınızı dengelemeye çalışın. Bu yıl, duygularınızı daha açık ifade etmeye başlayacaksınız. Partnerinizle birlikte ortak hedefler belirleyebilir, ilişkinizi bir üst seviyeye taşıyabilirsiniz. Yalnız olan Kovalar için ise, sosyal çevrelerinde tanışacakları biriyle uzun vadeli ve güvene dayalı bir ilişki başlama ihtimali yüksek. Geçmişte yaşanan kırgınlıkları geride bırakmak ve yeni bir sayfa açmak için uygun bir dönem. Romantik sürprizler ve anlamlı sohbetler ilişkinizi güçlendirecek.`,
      kariyer: `İş hayatınızda yenilikçi fikirlerinizle dikkat çekeceksiniz. Takım çalışmalarında başarılı olacaksınız. Teknoloji, bilim, sosyal sorumluluk ve insan hakları alanlarında öne çıkacaksınız. Özellikle yılın ortasında, kariyerinizde önemli bir dönüm noktası yaşayabilirsiniz. Yöneticilerinizden takdir görecek, yeni sorumluluklar üstleneceksiniz. Kendi işinizi kurmak veya mevcut işinizde yenilikçi projelere imza atmak için uygun bir yıl. Finansal konularda ise harcamalarınıza dikkat edin. Uzun vadeli planlar yapmak ve hedeflerinizi netleştirmek için ideal bir dönem.`,
      saglik: `Dolaşım sistemi ve ayak bileklerine dikkat etmelisiniz. Egzersiz ve sağlıklı yaşam önemli. Özellikle yılın ilk aylarında, sağlığınıza daha fazla özen göstermeniz gerekebilir. Düzenli egzersiz yapmak, beslenme alışkanlıklarınızı gözden geçirmek ve zararlı alışkanlıklardan uzak durmak sağlığınızı olumlu yönde etkileyecek. Ayrıca, ruhsal dengeyi korumak için hobilerinize zaman ayırmayı ihmal etmeyin.`,
    },
    'Balık': {
      genel: `Balık burcu bu yıl hayal gücü ve sezgileriyle öne çıkacak. Sanatsal ve ruhsal konular gündemde olacak. Yardımseverliğinizle çevrenizde takdir göreceksiniz. Yılın başından itibaren, içsel dünyanıza daha fazla yönelecek ve kendinizi keşfetmek için yeni yollar arayacaksınız. Özellikle ilkbahar ve yaz aylarında, uzun zamandır hayalini kurduğunuz bir sanatsal projeye başlayabilir veya yeni bir ruhsal yolculuğa çıkabilirsiniz. Sosyal çevreniz genişleyecek, yeni dostluklar kuracaksınız. Yılın ikinci yarısında ise, kişisel gelişim ve kendinizi ifade etme konularında önemli adımlar atacaksınız. Sanatsal projelerde yer almak, yeni hobiler edinmek ve kendinizi geliştirmek için harika bir dönem olacak.`,
      ask: `Aşk hayatınızda romantizm ve fedakarlık ön planda olacak. Partnerinizle duygusal bağlarınız güçlenecek. Yalnız Balıklar ise duygusal bir ilişkiye adım atabilir. Bu yıl, duygularınızı daha açık ifade etmeye başlayacaksınız. Partnerinizle birlikte ortak hedefler belirleyebilir, ilişkinizi bir üst seviyeye taşıyabilirsiniz. Yalnız olan Balıklar için ise, sosyal çevrelerinde tanışacakları biriyle uzun vadeli ve güvene dayalı bir ilişki başlama ihtimali yüksek. Geçmişte yaşanan kırgınlıkları geride bırakmak ve yeni bir sayfa açmak için uygun bir dönem. Romantik sürprizler ve anlamlı sohbetler ilişkinizi güçlendirecek.`,
      kariyer: `İş hayatınızda yaratıcılığınız ve sezgilerinizle başarılı olacaksınız. Sanatsal projeler ve yardım kuruluşları gündeme gelebilir. Özellikle yılın ortasında, kariyerinizde önemli bir dönüm noktası yaşayabilirsiniz. Yöneticilerinizden takdir görecek, yeni sorumluluklar üstleneceksiniz. Kendi işinizi kurmak veya mevcut işinizde yenilikçi projelere imza atmak için uygun bir yıl. Finansal konularda ise harcamalarınıza dikkat edin. Uzun vadeli planlar yapmak ve hedeflerinizi netleştirmek için ideal bir dönem.`,
      saglik: `Ayak ve bağışıklık sistemine dikkat etmelisiniz. Ruhsal dengeyi korumak önemli. Özellikle yılın ilk aylarında, sağlığınıza daha fazla özen göstermeniz gerekebilir. Düzenli egzersiz yapmak, beslenme alışkanlıklarınızı gözden geçirmek ve zararlı alışkanlıklardan uzak durmak sağlığınızı olumlu yönde etkileyecek. Ayrıca, ruhsal dengeyi korumak için hobilerinize zaman ayırmayı ihmal etmeyin.`,
    },
  };

  // Davet kodu modalı için input referansı
  const inviteInputRef = useRef<RNTextInput | null>(null);
  useEffect(() => {
    if (inviteModal && inviteInputRef.current) {
      setTimeout(() => {
        if (inviteInputRef.current) {
          inviteInputRef.current.focus();
        }
      }, 300);
    }
  }, [inviteModal]);

  // 156 kartlık deste oluşturucu (78 düz + 78 ters)
  function getFullTarotDeck() {
    const deck = [];
    for (let i = 0; i < 78; i++) {
      deck.push({ index: i, reversed: false });
      deck.push({ index: i, reversed: true });
    }
    // Karıştır
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  // Kategori modalında butonlara tıklama
  const handleCategorySelect = (cat: 'ask'|'saglik'|'kariyer'|'genel') => {
    setTarotSelectCategory(cat);
    setTarotSelectCards([]);
    setTarotSelectResults([]);
    setTarotDeck(getFullTarotDeck());
    setTarotSelectModal(true);
    setCategoryModal(false);
  };

  // Tek kart seçimi için fonksiyon
  const handleSingleCardSelect = (cat: 'ask'|'saglik'|'kariyer'|'genel') => {
    setSingleCardCategory(cat);
    setSingleCardResult(null);
    setSingleCardModal(true);
    setCategoryModal(false);
  };

  // t fonksiyonunu burada tanımla ki selectedLanguage erişilebilsin
  function t(key: keyof typeof translations['tr']): string {
    return translations[selectedLanguage][key as string] || (key as string);
  }

  // Colors ve backgroundImage tanımla
  const colors = themeColors(selectedTheme);
  const backgroundImage = selectedTheme === 'dark' 
    ? require('../assets/images/arka-plan-karanlik.jpg')
    : require('../assets/images/arka-plan-aydinlik.jpg');

  // Açılışta sesi çal
  useEffect(() => {
    async function playStartupSound() {
      if (Platform.OS !== 'web' && isStartupSoundOn) {
        try {
          const { sound } = await Audio.Sound.createAsync(
            require('../assets/sounds/uygulama-sesi.mp3')
          );
          await sound.playAsync();
          sound.setOnPlaybackStatusUpdate((status: any) => {
            if (status.isLoaded && status.didJustFinish) {
              sound.unloadAsync();
            }
          });
        } catch (e) {
          console.log('Açılış sesi çalınamadı:', e);
        }
      }
    }
    playStartupSound();

    // Saati her dakika güncelle
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // 60 saniye

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Bildirim sesi fonksiyonu
  async function playNotificationSound() {
    if (Platform.OS !== 'web' && isNotificationSoundOn) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/notification.mp3')
        );
        await sound.playAsync();
        sound.setOnPlaybackStatusUpdate((status: any) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync();
          }
        });
      } catch (e) {
        console.log('Bildirim sesi çalınamadı:', e);
      }
    }
  }

  // Günün kartı indexini fonksiyonla al
  const todaysCardIndex = getTodaysCardIndex();

  // Profil yönetimi state'leri
  const [profileModal, setProfileModal] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editSurname, setEditSurname] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editGender, setEditGender] = useState('');
  const [editBirthDate, setEditBirthDate] = useState('');
  const [editBirthTime, setEditBirthTime] = useState('');
  const [editBirthPlace, setEditBirthPlace] = useState('');
  const [editZodiac, setEditZodiac] = useState('');
  const [editJob, setEditJob] = useState('');
  const [editRelationship, setEditRelationship] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Bildirim sistemi state'leri
  const [notificationModal, setNotificationModal] = useState(false);
  const [dailyHoroscopeNotification, setDailyHoroscopeNotification] = useState(true);
  const [dailyTarotNotification, setDailyTarotNotification] = useState(true);
  const [compatibilityNotification, setCompatibilityNotification] = useState(false);
  const [risingSignNotification, setRisingSignNotification] = useState(false);
  const [notificationTime, setNotificationTime] = useState('09:00');
  const [notificationLoading, setNotificationLoading] = useState(false);
  const [notificationError, setNotificationError] = useState('');
  const [notificationSuccess, setNotificationSuccess] = useState('');

  // Profil güncelleme fonksiyonu
  const handleProfileUpdate = async () => {
    if (!currentUser) return;
    
    setProfileLoading(true);
    setProfileError('');
    setProfileSuccess('');

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        name: editName || currentName,
        surname: editSurname || regSurname,
        email: editEmail || currentUser.email,
        gender: editGender || regGender,
        birthDate: editBirthDate || regBirthDate,
        birthTime: editBirthTime || regBirthTime,
        birthPlace: editBirthPlace || regBirthPlace,
        zodiac: editZodiac || regZodiac,
        job: editJob || regJob,
        relationship: editRelationship || regRelationship,
        updatedAt: new Date(),
      });

      setProfileSuccess('Profil başarıyla güncellendi!');
      setCurrentName(editName || currentName);
      
      setTimeout(() => {
        setProfileModal(false);
        setProfileSuccess('');
      }, 2000);
    } catch (error: any) {
      setProfileError('Profil güncellenirken hata: ' + error.message);
    } finally {
      setProfileLoading(false);
    }
  };

  // Şifre değiştirme fonksiyonu
  const handlePasswordChange = async () => {
    if (!currentUser) return;
    
    if (newPassword !== newPassword2) {
      setProfileError('Yeni şifreler eşleşmiyor');
      return;
    }

    if (!/(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      setProfileError('Şifrenizde en az bir büyük harf ve bir rakam olmalı');
      return;
    }

    setProfileLoading(true);
    setProfileError('');

    try {
      // Firebase Auth ile şifre değiştirme
      await updatePassword(currentUser, newPassword);
      
      setProfileSuccess('Şifre başarıyla değiştirildi!');
      setCurrentPassword('');
      setNewPassword('');
      setNewPassword2('');
      
      setTimeout(() => {
        setProfileSuccess('');
      }, 2000);
    } catch (error: any) {
      setProfileError('Şifre değiştirilirken hata: ' + error.message);
    } finally {
      setProfileLoading(false);
    }
  };

  // Bildirim ayarları güncelleme fonksiyonu
  const handleNotificationUpdate = async () => {
    if (!currentUser) return;
    
    setNotificationLoading(true);
    setNotificationError('');
    setNotificationSuccess('');

    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        notificationSettings: {
          dailyHoroscope: dailyHoroscopeNotification,
          dailyTarot: dailyTarotNotification,
          compatibility: compatibilityNotification,
          risingSign: risingSignNotification,
          notificationTime: notificationTime,
        },
        updatedAt: new Date(),
      });

      setNotificationSuccess('Bildirim ayarları güncellendi!');
      
      setTimeout(() => {
        setNotificationModal(false);
        setNotificationSuccess('');
      }, 2000);
    } catch (error: any) {
      setNotificationError('Bildirim ayarları güncellenirken hata: ' + error.message);
    } finally {
      setNotificationLoading(false);
    }
  };

  // Profil fotoğrafı seçme fonksiyonu (placeholder)
  const handlePhotoSelect = () => {
    // Burada gerçek fotoğraf seçme işlemi yapılacak
    setProfileSuccess('Fotoğraf seçme özelliği yakında eklenecek!');
  };

  // Günlük bildirim gönderme fonksiyonu (placeholder)
  const sendDailyNotification = async () => {
    if (!currentUser) return;
    
    try {
      // Burada gerçek push notification gönderme işlemi yapılacak
      console.log('Günlük bildirim gönderildi');
    } catch (error) {
      console.error('Bildirim gönderilirken hata:', error);
    }
  };

  // Bildirim zamanı kontrolü
  useEffect(() => {
    const checkNotificationTime = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      if (currentTime === notificationTime) {
        if (dailyHoroscopeNotification) {
          sendDailyNotification();
        }
      }
    };

    const interval = setInterval(checkNotificationTime, 60000); // Her dakika kontrol et
    return () => clearInterval(interval);
  }, [notificationTime, dailyHoroscopeNotification, currentUser]);

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      //behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      //keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ImageBackground
        source={backgroundImage}
        style={{ flex: 1, width: '100%', height: '100%' }}
        resizeMode="cover"
      >
        {/* Üst bar: Sol logo, sağ tema */}
        <View style={[styles.topBar, { backgroundColor: 'rgba(0,0,0,0.8)', borderColor: colors.barBorder, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}> 
          {/* Sol üst: Logo ve Uygulama Adı */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Sol üst: Logo */}
            <View style={styles.logoBox}>
              <Image
                source={require('../assets/images/tarot-logo-gece.jpg')}
                style={{ width: 40, height: 40, resizeMode: 'contain', borderRadius: 20 }}
              />
            </View>
            {/* Uygulama Adı */}
            <Text style={{ 
              color: colors.accent, 
              fontSize: 32, 
              fontWeight: 'bold', 
              marginLeft: 12,
              fontFamily: 'monospace',
              letterSpacing: 3,
              textShadowColor: colors.accent,
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: 4,
              textAlign: 'center'
            }}>
              MISTICA
            </Text>
          </View>
          {/* Sağ üst: Profil kutusu/ikonu */}
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', padding: 4, borderRadius: 20, backgroundColor: 'transparent' }}
            onPress={() => { setModalVisible(true); setFormType(null); }}
          >
            {currentUser ? (
              <>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
                  <Text style={{ color: colors.accentText, fontSize: 16, fontWeight: 'bold' }}>{currentName ? currentName[0] : ''}{regSurname ? regSurname[0] : ''}</Text>
                </View>
                <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 15, marginRight: 4 }}>{currentName}</Text>
              </>
            ) : (
              <Ionicons name="person-circle-outline" size={36} color={colors.accent} />
            )}
          </TouchableOpacity>
        </View>
        <ScrollView 
          style={{ flex: 1, width: '100%', height: '100%', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 100 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {currentTab === 'home' && (
            <>

              
              {currentUser && (
    <View style={[styles.welcomeBox, { backgroundColor: colors.card, width: '90%', marginBottom: 0, marginTop: 0 }]}> 
      <Text style={[styles.welcomeText, { color: colors.accent }]}>
        {t('welcome')}{currentName ? `, ${currentName}` : ''}!
      </Text>
    </View>
              )}

      {/* Saat Anlamı - Sadece özel saatlerde göster */}
      {getCurrentTimeMeaning().title !== 'Saat Anlamı' && (
        <View style={[styles.welcomeBox, { backgroundColor: colors.card, width: '90%', marginBottom: 8, marginTop: 0 }]}> 
          <Text style={[styles.welcomeText, { color: colors.accent, fontSize: 16 }]}>
            🕐 {getCurrentTimeMeaning().title}
          </Text>
          <Text style={{ color: colors.subtext, fontSize: 12, textAlign: 'center', marginTop: 4 }}>
            {getCurrentTimeMeaning().meaning}
          </Text>
        </View>
      )}



      <View style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'space-evenly', alignItems: 'center' }}>
    <TouchableOpacity
      style={[styles.card, { 
        backgroundColor: selectedTheme === 'dark' ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)', 
        borderColor: colors.accent, 
        borderWidth: 2, 
        marginVertical: 0,
        shadowColor: colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
        elevation: 8,
      }]}
      onPress={() => {
        setSelectedCardIndex(todaysCardIndex);
        setShowTarotMeaning(false);
        setTarotModal(true);
      }}
    >
      <Text style={[styles.cardText, { color: colors.accent, fontWeight: 'bold' }]}>
        {t('todays_tarot')}
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.card, { 
        backgroundColor: selectedTheme === 'dark' ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)', 
        borderColor: colors.accent, 
        borderWidth: 2, 
        marginVertical: 0,
        shadowColor: colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
        elevation: 8,
      }]}
      onPress={() => setBurcModal(true)}
    >
      <Text style={[styles.cardText, { color: colors.accent, fontWeight: 'bold' }]}>
        {t('horoscope')}
      </Text>
    </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { 
            backgroundColor: selectedTheme === 'dark' ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)', 
            borderColor: colors.accent, 
            borderWidth: 2, 
            marginVertical: 0,
            shadowColor: colors.accent,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.6,
            shadowRadius: 8,
            elevation: 8,
          }]}
          onPress={() => setGunlukBurcModal(true)}
        >
          <Text style={[styles.cardText, { color: colors.accent, fontWeight: 'bold' }]}>
            Günlük Burç
          </Text>
        </TouchableOpacity>

    <TouchableOpacity
      style={[styles.card, { 
        backgroundColor: selectedTheme === 'dark' ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)', 
        borderColor: colors.accent, 
        borderWidth: 2, 
        marginVertical: 0,
        shadowColor: colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
        elevation: 8,
      }]}
      onPress={() => setUyumModal(true)}
    >
      <Text style={[styles.cardText, { color: colors.accent, fontWeight: 'bold' }]}>
        {t('show_compatibility')}
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.card, { 
        backgroundColor: selectedTheme === 'dark' ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)', 
        borderColor: colors.accent, 
        borderWidth: 2, 
        marginVertical: 0,
        shadowColor: colors.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
        elevation: 8,
      }]}
      onPress={() => setRisingModal(true)}
    >
      <Text style={[styles.cardText, { color: colors.accent, fontWeight: 'bold' }]}>
            Yükselen Burç Hesapla
      </Text>
    </TouchableOpacity>
  </View>
    </>
  )}

  {currentTab === 'category' && (
    <View style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', padding: 20, paddingTop: 50, paddingBottom: 100, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Başlık */}
      <Text style={{ 
        color: colors.accent, 
        fontSize: 28, 
        fontWeight: 'bold', 
        marginBottom: 30,
        textAlign: 'center',
        fontFamily: 'serif'
      }}>
        Tarot Kategorileri
      </Text>
      
      {/* 2x2 Grid Container - Kare Butonlar */}
      <View style={{ 
        width: '100%', 
        height: '70%', 
        flexDirection: 'row', 
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 15
      }}>
        {/* Sol Üst Kart - Aşk */}
        <TouchableOpacity
          style={{
            width: '47%',
            aspectRatio: 1,
            backgroundColor: selectedTheme === 'dark' ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            borderColor: colors.accent,
            borderWidth: 3,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 12,
            shadowColor: colors.accent,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.8,
            shadowRadius: 12,
          }}
          onPress={() => handleCategorySelect('ask')}
        >
          <Text style={{ 
            fontSize: 18, 
            fontWeight: 'bold', 
            color: colors.accent, 
            textAlign: 'center', 
            lineHeight: 24,
            fontFamily: 'serif'
          }}>
            💕{'\n'}Aşk & İlişkiler
          </Text>
        </TouchableOpacity>
        
        {/* Sağ Üst Kart - Sağlık */}
        <TouchableOpacity
          style={{
            width: '47%',
            aspectRatio: 1,
            backgroundColor: selectedTheme === 'dark' ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            borderColor: colors.accent,
            borderWidth: 3,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 12,
            shadowColor: colors.accent,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.8,
            shadowRadius: 12,
          }}
          onPress={() => handleCategorySelect('saglik')}
        >
          <Text style={{ 
            fontSize: 18, 
            fontWeight: 'bold', 
            color: colors.accent, 
            textAlign: 'center', 
            lineHeight: 24,
            fontFamily: 'serif'
          }}>
            🌟{'\n'}Sağlık & Enerji
          </Text>
        </TouchableOpacity>
        
        {/* Sol Alt Kart - Kariyer */}
        <TouchableOpacity
          style={{
            width: '47%',
            aspectRatio: 1,
            backgroundColor: selectedTheme === 'dark' ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            borderColor: colors.accent,
            borderWidth: 3,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 12,
            shadowColor: colors.accent,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.8,
            shadowRadius: 12,
          }}
          onPress={() => handleCategorySelect('kariyer')}
        >
          <Text style={{ 
            fontSize: 18, 
            fontWeight: 'bold', 
            color: colors.accent, 
            textAlign: 'center', 
            lineHeight: 24,
            fontFamily: 'serif'
          }}>
            💰{'\n'}Kariyer & Para
          </Text>
        </TouchableOpacity>
        
        {/* Sağ Alt Kart - Genel */}
        <TouchableOpacity
          style={{
            width: '47%',
            aspectRatio: 1,
            backgroundColor: selectedTheme === 'dark' ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            borderColor: colors.accent,
            borderWidth: 3,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 12,
            shadowColor: colors.accent,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.8,
            shadowRadius: 12,
          }}
          onPress={() => handleCategorySelect('genel')}
        >
          <Text style={{ 
            fontSize: 18, 
            fontWeight: 'bold', 
            color: colors.accent, 
            textAlign: 'center', 
            lineHeight: 24,
            fontFamily: 'serif'
          }}>
            🔮{'\n'}Genel Yorum
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Alt Açıklama */}
      <Text style={{ 
        color: colors.subtext, 
        fontSize: 14, 
        textAlign: 'center', 
        marginTop: 20,
        fontStyle: 'italic'
      }}>
        Kategori seçin ve tarot kartlarınızı çekin
      </Text>
    </View>
  )}

    {currentTab === 'settings' && (
    <View style={{ flex: 1, width: '100%', height: '100%', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: selectedTheme === 'dark' ? 'rgba(26, 26, 26, 0.95)' : 'rgba(255, 255, 255, 0.95)' }}>
      <View style={{ flex: 1, paddingTop: 40, paddingHorizontal: 20, paddingBottom: 100, justifyContent: 'space-between' }}>
        <Text style={{ color: colors.accent, textAlign: 'center', marginBottom: 20, fontSize: 24, fontWeight: 'bold' }}>🎯 AYARLAR</Text>
        
        {/* Profil Kutusu */}
          {currentUser && (
            <View style={{ width: '100%', alignItems: 'center', marginBottom: 12, backgroundColor: selectedTheme === 'dark' ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)', borderRadius: 12, padding: 12, borderWidth: 2, borderColor: colors.accent, shadowColor: colors.accent, shadowOpacity: 0.2, shadowRadius: 10, elevation: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <Text style={{ color: colors.accentText, fontSize: 22, fontWeight: 'bold' }}>{currentName ? currentName[0] : ''}{regSurname ? regSurname[0] : ''}</Text>
                </View>
                <View>
                  <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 16 }}>{currentName} {regSurname}</Text>
                  <Text style={{ color: colors.subtext, fontSize: 14 }}>{currentUser?.email}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={{ backgroundColor: colors.accent, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 24, marginTop: 4, borderWidth: 2, borderColor: colors.accent, shadowColor: colors.accent, shadowOpacity: 0.3, shadowRadius: 6, elevation: 4 }}
                onPress={() => { setModalVisible(true); setFormType(null); }}
              >
                <Text style={{ color: colors.accentText, fontWeight: 'bold', fontSize: 15 }}>{t('edit_profile')}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Dil Seçimi */}
          <View style={{ width: '100%', alignItems: 'center', marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: colors.accent }}>{t('language')} ({selectedLanguage === 'en' ? t('english') : t('turkish')})</Text>
            <Switch
              value={selectedLanguage === 'en'}
              onValueChange={(v: boolean) => setSelectedLanguage(v ? 'en' : 'tr')}
              trackColor={{ false: '#C0C0C0', true: '#BFA14A' }}
              thumbColor="#888888"
            />
          </View>

          {/* Aydınlık Mod */}
          <View style={{ width: '100%', alignItems: 'center', marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: colors.accent }}>Aydınlık Mod</Text>
            <Switch
                value={selectedTheme === 'light'}
              onValueChange={(v: boolean) => {
                  setSelectedTheme(v ? 'light' : 'dark');
              }}
              trackColor={{ false: '#C0C0C0', true: '#BFA14A' }}
              thumbColor="#888888"
            />
          </View>

          {/* Açılış Sesi */}
          <View style={{ width: '100%', alignItems: 'center', marginBottom: 18, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: colors.accent }}>{t('uygulama_sesi')}</Text>
            <Switch
              value={isStartupSoundOn}
              onValueChange={setIsStartupSoundOn}
              trackColor={{ false: '#C0C0C0', true: '#BFA14A' }}
              thumbColor="#888888"
            />
          </View>

          {/* Bildirim Sesi */}
          <View style={{ width: '100%', alignItems: 'center', marginBottom: 18, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: colors.accent }}>{t('notification_sound')}</Text>
            <Switch
              value={isNotificationSoundOn}
              onValueChange={setIsNotificationSoundOn}
              trackColor={{ false: '#C0C0C0', true: '#BFA14A' }}
              thumbColor="#888888"
            />
          </View>

          {/* Değerlendir (Puanla/Yorumla) Alanı - Ayarlar */}
          <View style={{ width: '100%', backgroundColor: selectedTheme === 'dark' ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)', borderRadius: 14, borderWidth: 2, borderColor: colors.accent, padding: 12, marginTop: 8, alignItems: 'center', shadowColor: colors.accent, shadowOpacity: 0.2, shadowRadius: 10, elevation: 6 }}>
            <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 16, marginBottom: 6 }}>Uygulamayı Değerlendir</Text>
            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
              {[1,2,3,4,5].map((star) => (
                <TouchableOpacity key={star} onPress={() => {
                  setRating(star);
                  setRatingSuccess('Teşekkürler!');
                  setTimeout(() => setRatingSuccess(''), 2000);
                }}>
                  <Ionicons
                    name={rating >= star ? 'star' : 'star-outline'}
                    size={24}
                    color={rating >= star ? '#D4AF37' : '#8C7853'}
                    style={{ marginHorizontal: 2 }}
                  />
                </TouchableOpacity>
              ))}
            </View>
            {ratingSuccess ? <Text style={{ color: '#D4AF37', marginTop: 2 }}>{ratingSuccess}</Text> : null}
          </View>

          {/* Sosyal Medya İkonları */}
          <View style={{ width: '100%', backgroundColor: selectedTheme === 'dark' ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)', borderRadius: 14, borderWidth: 2, borderColor: colors.accent, padding: 12, marginTop: 8, alignItems: 'center', shadowColor: colors.accent, shadowOpacity: 0.2, shadowRadius: 10, elevation: 6 }}>
            <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 16, marginBottom: 8 }}>Bizi Takip Edin</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <TouchableOpacity onPress={() => Linking.openURL('https://instagram.com')} style={{ marginHorizontal: 8 }}>
                <FontAwesome name="instagram" size={24} color="#C13584" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com')} style={{ marginHorizontal: 8 }}>
                <FontAwesome name="twitter" size={24} color="#1DA1F2" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL('https://facebook.com')} style={{ marginHorizontal: 8 }}>
                <FontAwesome name="facebook" size={24} color="#1877F2" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Çıkış Yap ve Hesabımı Sil (Minimalist, yan yana) */}
          {currentUser && (
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 0, gap: 12, backgroundColor: selectedTheme === 'dark' ? 'rgba(26, 26, 26, 0.9)' : 'rgba(255, 255, 255, 0.9)', borderRadius: 12, padding: 12, borderWidth: 2, borderColor: colors.accent, shadowColor: colors.accent, shadowOpacity: 0.2, shadowRadius: 10, elevation: 6 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: colors.danger,
                  borderRadius: 10,
                  paddingVertical: 14,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: colors.dangerBorder,
                  shadowColor: colors.danger,
                  shadowOpacity: 0.4,
                  shadowRadius: 6,
                  elevation: 6,
                }}
                onPress={() => {
                  signOut(auth);
                  localStorage.removeItem('tarot_user_name');
                }}
              >
                <Ionicons name="log-out-outline" size={20} color={colors.accentText} />
                <Text style={{ color: colors.accentText, fontWeight: 'bold', fontSize: 15, marginLeft: 8 }}>{t('logout')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: colors.danger,
                  borderRadius: 10,
                  paddingVertical: 14,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: colors.dangerBorder,
                  shadowColor: colors.danger,
                  shadowOpacity: 0.4,
                  shadowRadius: 6,
                  elevation: 6,
                }}
                onPress={() => setDeleteAccountModal(true)}
              >
                <Ionicons name="trash-outline" size={20} color={colors.accentText} />
                <Text style={{ color: colors.accentText, fontWeight: 'bold', fontSize: 15, marginLeft: 8 }}>{t('delete_account')}</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>
      </View>
  )}

        {/* Hesap Silme Modalı */}
        <Modal
          visible={deleteAccountModal}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setDeleteAccountModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: colors.modal, borderColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.accent }]}>Hesabı Sil</Text>
              <Text style={[styles.modalText, { color: colors.text }]}>
                Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve tüm verileriniz kalıcı olarak silinecektir.
              </Text>
              <View style={styles.modalButtonRow}>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.border }]}
                  onPress={() => setDeleteAccountModal(false)}
                >
                  <Text style={[styles.modalButtonText, { color: colors.text }]}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: colors.danger }]}
                  onPress={async () => {
                    try {
                      if (currentUser) {
                        await deleteUser(currentUser);
                        setDeleteAccountModal(false);
                      }
                    } catch (error) {
                      console.error('Hesap silme hatası:', error);
                    }
                  }}
                >
                  <Text style={[styles.modalButtonText, { color: colors.accentText }]}>Hesabı Sil</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Tüm modallar (davet kodu, kategori, profil, ayarlar, burç, uyum, yükselen, vs.) */}
        {/* Davet kodu modalı */}
        <Modal
          visible={inviteModal}
          animationType="fade"
          transparent={false}
          presentationStyle="pageSheet"
          onRequestClose={() => setInviteModal(false)}
        >
          <ImageBackground
            source={backgroundImage}
            style={{ flex: 1, width: '100%', height: '100%' }}
            resizeMode="cover"
          >
            <KeyboardAvoidingView
              style={{ flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
            >
            <View style={{ width: 340, backgroundColor: selectedTheme === 'dark' ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)', borderRadius: 16, alignItems: 'center', padding: 24, borderWidth: 1, borderColor: colors.border }}>
              {/* MISTICA Yazısı - Davet Modalı Üstü */}
              <Text style={{ 
                color: '#D4AF37', 
                fontSize: 36, 
                fontWeight: 'bold', 
                marginBottom: 16,
                fontFamily: 'monospace',
                letterSpacing: 3,
                textShadowColor: '#D4AF37',
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 4,
                textAlign: 'center'
              }}>
                MISTICA
              </Text>
              <Text style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 16, color: colors.text }}>{t('enter_invite_code')}</Text>
              <TextInput
                ref={inviteInputRef}
                style={{ borderWidth: 1, borderColor: colors.inputBorder, borderRadius: 8, padding: 10, marginBottom: 10, width: '100%', fontSize: 18, backgroundColor: selectedTheme === 'dark' ? 'rgba(26, 26, 26, 0.6)' : 'rgba(255, 255, 255, 0.6)', color: colors.text }}
                placeholder={t('invite_code_placeholder')}
                placeholderTextColor={colors.placeholder}
                value={inviteInput}
                onChangeText={setInviteInput}
                keyboardType="number-pad"
                autoFocus={false}
                returnKeyType="done"
                blurOnSubmit={true}
                onFocus={() => console.log('TextInput focused')}
                onPressIn={() => console.log('TextInput pressed')}
              />
              {inviteError ? <Text style={{ color: colors.error, marginBottom: 8 }}>{inviteError}</Text> : null}

              <Pressable style={{ backgroundColor: selectedTheme === 'dark' ? 'rgba(26, 26, 26, 0.8)' : 'rgba(255, 255, 255, 0.8)', borderColor: colors.accent, borderWidth: 2, borderRadius: 8, padding: 12, alignItems: 'center', marginTop: 8, width: '100%' }} onPress={handleInviteSubmit}>
                <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 16 }}>{t('submit')}</Text>
              </Pressable>
              <Pressable onPress={() => setShowInviteInfo((v: boolean) => !v)} style={{ marginTop: 10 }}>
                <Text style={{ color: colors.accent, textDecorationLine: 'underline' }}>{t('what_is_invite_code')}</Text>
              </Pressable>
              {showInviteInfo && (
                <View style={{ marginTop: 8 }}>
                    <Text style={{ color: colors.subtext, fontSize: 12, textAlign: 'center' }}>
                    {t('invite_code_info')}
                  </Text>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
          </ImageBackground>
        </Modal>
        {/* Kategori modalı */}
        <Modal
          visible={categoryModal}
          animationType="slide"
          transparent
          onRequestClose={() => setCategoryModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.categoryContent, { backgroundColor: colors.modal }]}> 
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('categories')}</Text>
              <View style={styles.categoryGrid}>
                <Pressable style={[styles.categorySquare, { backgroundColor: colors.accent }]} onPress={() => handleCategorySelect('ask')}>
                <Text style={[styles.categoryButtonText, { color: colors.accentText }]}>{t('love')}</Text>
                </Pressable>
                <Pressable style={[styles.categorySquare, { backgroundColor: colors.accent }]} onPress={() => handleCategorySelect('saglik')}>
                <Text style={[styles.categoryButtonText, { color: colors.accentText }]}>{t('health')}</Text>
                </Pressable>
              </View>
              <View style={styles.categoryGrid}>
                <Pressable style={[styles.categorySquare, { backgroundColor: colors.accent }]} onPress={() => handleCategorySelect('kariyer')}>
                <Text style={[styles.categoryButtonText, { color: colors.accentText }]}>{t('career')}</Text>
                </Pressable>
                <Pressable style={[styles.categorySquare, { backgroundColor: colors.accent }]} onPress={() => handleCategorySelect('genel')}>
                <Text style={[styles.categoryButtonText, { color: colors.accentText }]}>{t('general')}</Text>
                </Pressable>
              </View>
              <Pressable style={styles.closeButton} onPress={() => setCategoryModal(false)}>
        <Text style={[styles.closeButtonText, { color: colors.accent }]}>{t('close')}</Text>
      </Pressable>
    </View>
  </View>
</Modal>
       



        {/* Burç Yorumu Modalı */}
        <Modal
          visible={burcModal}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setBurcModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: colors.bg, padding: 24 }}>
          <Text style={[styles.modalTitle, { color: colors.text, textAlign: 'center' }]}>{t('horoscope')}</Text>
            <ScrollView contentContainerStyle={{ paddingVertical: 12 }}>
              {burclar.map((burc: string) => (
                <Pressable
                  key={burc}
                  style={{ backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.border, marginVertical: 8, padding: 18, alignItems: 'center' }}
                  onPress={() => { setSelectedBurc(burc); setBurcDetayModal(true); }}
                >
                  <Text style={{ color: colors.text, fontSize: 22, fontWeight: 'bold' }}>{burc}</Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable style={styles.closeButton} onPress={() => setBurcModal(false)}>
            <Text style={styles.closeButtonText}>{t('close')}</Text>
            </Pressable>
          </View>
        </Modal>
        {/* Burç Detay Modalı */}
        <Modal
          visible={burcDetayModal}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setBurcDetayModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: colors.bg, padding: 24 }}>
          <Text style={[styles.modalTitle, { color: colors.text, textAlign: 'center' }]}>{selectedBurc} {t('horoscope')}</Text>
            <ScrollView>
            <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 18, marginTop: 12 }}>{t('genel')}</Text>
              <Text style={{ color: colors.text, marginBottom: 10 }}>{selectedBurc && burcYorumlari[selectedBurc]?.genel}</Text>
            <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 18, marginTop: 12 }}>{t('ask')}</Text>
              <Text style={{ color: colors.text, marginBottom: 10 }}>{selectedBurc && burcYorumlari[selectedBurc]?.ask}</Text>
            <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 18, marginTop: 12 }}>{t('kariyer')}</Text>
              <Text style={{ color: colors.text, marginBottom: 10 }}>{selectedBurc && burcYorumlari[selectedBurc]?.kariyer}</Text>
            <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 18, marginTop: 12 }}>{t('saglik')}</Text>
              <Text style={{ color: colors.text, marginBottom: 10 }}>{selectedBurc && burcYorumlari[selectedBurc]?.saglik}</Text>
            </ScrollView>
            <Pressable style={styles.closeButton} onPress={() => setBurcDetayModal(false)}>
            <Text style={styles.closeButtonText}>{t('close')}</Text>
            </Pressable>
          </View>
        </Modal>
        {/* Yükselen Hesapla Modalı */}
        <Modal
          visible={risingModal}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setRisingModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: colors.bg }}>
            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding: 24, width: '100%' }}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('show_rising')}</Text>
              {/* Şehir Seçimi */}
              <Pressable
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, width: '100%', minWidth: 200, maxWidth: 350, alignSelf: 'center' }]}
                onPress={() => setRisingCityModal(true)}
              >
                <Text style={{ color: risingCity ? colors.text : colors.placeholder, textAlign: 'center' }}>
                {risingCity ? risingCity : t('select_city')}
                </Text>
              </Pressable>
              {/* Doğum Günü Seçimi */}
              <Pressable
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, width: '100%', minWidth: 200, maxWidth: 350, alignSelf: 'center' }]}
                onPress={() => setDayModal(true)}
              >
                <Text style={{ color: risingDay ? colors.text : colors.placeholder, textAlign: 'center' }}>
                {risingDay ? `${risingDay} Gün` : t('select_day')}
                </Text>
              </Pressable>
              {/* Doğum Ayı Seçimi */}
              <Pressable
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, width: '100%', minWidth: 200, maxWidth: 350, alignSelf: 'center' }]}
                onPress={() => setMonthModal(true)}
              >
                <Text style={{ color: risingMonth ? colors.text : colors.placeholder, textAlign: 'center' }}>
                {risingMonth ? `${risingMonth} Ay` : t('select_month')}
                </Text>
              </Pressable>
              {/* Doğum Yılı Seçimi */}
              <Pressable
                style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, width: '100%', minWidth: 200, maxWidth: 350, alignSelf: 'center' }]}
                onPress={() => setYearModal(true)}
              >
                <Text style={{ color: risingYear ? colors.text : colors.placeholder, textAlign: 'center' }}>
                {risingYear ? `${risingYear} Yıl` : t('select_year')}
                </Text>
              </Pressable>
              {/* Saat ve Dakika Seçimi */}
              <View style={{ flexDirection: 'row', width: '100%', maxWidth: 350, alignSelf: 'center', gap: 8, marginBottom: 10 }}>
                <Pressable
                  style={[styles.input, { flex: 1, backgroundColor: colors.inputBg, borderColor: colors.inputBorder, marginBottom: 0 }]}
                  onPress={() => setRisingHourModal(true)}
                >
                  <Text style={{ color: risingHour ? colors.text : colors.placeholder, textAlign: 'center' }}>
                  {risingHour ? `${risingHour} Saat` : t('select_hour')}
                  </Text>
                </Pressable>
                <Pressable
                  style={[styles.input, { flex: 1, backgroundColor: colors.inputBg, borderColor: colors.inputBorder, marginBottom: 0 }]}
                  onPress={() => setRisingMinuteModal(true)}
                >
                  <Text style={{ color: risingMinute ? colors.text : colors.placeholder, textAlign: 'center' }}>
                  {risingMinute ? `${risingMinute} Dakika` : t('select_minute')}
                  </Text>
                </Pressable>
              </View>
            </View>
            {/* Sonuç ve Hesapla butonu en altta sabit */}
            <View style={{ width: '100%', padding: 16, backgroundColor: colors.modal, borderTopWidth: 1, borderColor: colors.border }}>
              {risingResult ? (
                <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 18, textAlign: 'center', marginBottom: 8 }}>
                {t('rising_result')} {risingResult}
                </Text>
              ) : null}
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.accent, marginBottom: 8 }]}
                onPress={() => {
                  const result = calculateRisingSign(risingHour, risingMinute);
                  setRisingResult(result);
                }}
              >
              <Text style={[styles.modalButtonText, { color: colors.accentText }]}>{t('calculate')}</Text>
              </TouchableOpacity>
              <Pressable style={styles.closeButton} onPress={() => setRisingModal(false)}>
              <Text style={styles.closeButtonText}>{t('close')}</Text>
              </Pressable>
            </View>
            {/* Gün Seçim Modalı */}
            <Modal visible={dayModal} transparent animationType="fade" onRequestClose={() => setDayModal(false)}>
              <View style={styles.modalOverlay}>
                <View style={[styles.categoryContent, { backgroundColor: colors.modal }]}> 
                <Text style={[styles.modalTitle, { color: colors.text }]}>{t('select_day')}</Text>
                  <ScrollView style={{ maxHeight: 300, width: 200 }}>
                    {days.map((d: string) => (
                      <Pressable key={d} style={{ padding: 12 }} onPress={() => { setRisingDay(d); setDayModal(false); }}>
                        <Text style={{ color: colors.text, fontSize: 18 }}>{d}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                  <Pressable style={styles.closeButton} onPress={() => setDayModal(false)}>
                  <Text style={styles.closeButtonText}>{t('close')}</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            {/* Ay Seçim Modalı */}
            <Modal visible={monthModal} transparent animationType="fade" onRequestClose={() => setMonthModal(false)}>
              <View style={styles.modalOverlay}>
                <View style={[styles.categoryContent, { backgroundColor: colors.modal }]}> 
                <Text style={[styles.modalTitle, { color: colors.text }]}>{t('select_month')}</Text>
                  <ScrollView style={{ maxHeight: 300, width: 200 }}>
                    {months.map((m: string) => (
                      <Pressable key={m} style={{ padding: 12 }} onPress={() => { setRisingMonth(m); setMonthModal(false); }}>
                        <Text style={{ color: colors.text, fontSize: 18 }}>{m}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                  <Pressable style={styles.closeButton} onPress={() => setMonthModal(false)}>
                  <Text style={styles.closeButtonText}>{t('close')}</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            {/* Yıl Seçim Modalı */}
            <Modal visible={yearModal} transparent animationType="fade" onRequestClose={() => setYearModal(false)}>
              <View style={styles.modalOverlay}>
                <View style={[styles.categoryContent, { backgroundColor: colors.modal }]}> 
                <Text style={[styles.modalTitle, { color: colors.text }]}>{t('select_year')}</Text>
                  <ScrollView style={{ maxHeight: 300, width: 200 }}>
                    {years.map((y: string) => (
                      <Pressable key={y} style={{ padding: 12 }} onPress={() => { setRisingYear(y); setYearModal(false); }}>
                        <Text style={{ color: colors.text, fontSize: 18 }}>{y}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                  <Pressable style={styles.closeButton} onPress={() => setYearModal(false)}>
                  <Text style={styles.closeButtonText}>{t('close')}</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            {/* Doğum Tarihi Seçim Modalı */}
            <Modal visible={birthDateModal} transparent animationType="fade" onRequestClose={() => setBirthDateModal(false)}>
              <View style={styles.modalOverlay}>
                <View style={[styles.categoryContent, { backgroundColor: colors.modal, width: 300 }]}> 
                <Text style={[styles.modalTitle, { color: colors.text }]}>{t('select_birth_date')}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 250 }}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <Text style={{ color: colors.accent, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>Yıl</Text>
                      <ScrollView style={{ maxHeight: 200 }}>
                        {years.map((y: string) => (
                          <Pressable key={y} style={{ padding: 10, borderBottomWidth: 1, borderColor: colors.border }} onPress={() => { setRegBirthDate(y); setBirthDateModal(false); }}>
                            <Text style={{ color: colors.text, fontSize: 18, textAlign: 'center' }}>{y}</Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={{ color: colors.accent, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>Ay</Text>
                      <ScrollView style={{ maxHeight: 200 }}>
                        {months.map((m: string) => (
                          <Pressable key={m} style={{ padding: 10, borderBottomWidth: 1, borderColor: colors.border }} onPress={() => { setRegBirthDate(m); setBirthDateModal(false); }}>
                            <Text style={{ color: colors.text, fontSize: 18, textAlign: 'center' }}>{m}</Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                  <Pressable style={styles.closeButton} onPress={() => setBirthDateModal(false)}>
                  <Text style={styles.closeButtonText}>{t('close')}</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            {/* Saat/Dakika Seçim Modalı */}
            <Modal visible={birthTimeModal} transparent animationType="fade" onRequestClose={() => setBirthTimeModal(false)}>
              <View style={styles.modalOverlay}>
                <View style={[styles.categoryContent, { backgroundColor: colors.modal, width: 300 }]}> 
                <Text style={[styles.modalTitle, { color: colors.text }]}>{t('select_hour_minute')}</Text>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: 250 }}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                      <Text style={{ color: colors.accent, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>Saat</Text>
                      <ScrollView style={{ maxHeight: 200 }}>
                        {hours.map((h: string) => (
                          <Pressable key={h} style={{ padding: 10, borderBottomWidth: 1, borderColor: colors.border }} onPress={() => { setRegBirthTime(h); setBirthTimeModal(false); }}>
                            <Text style={{ color: colors.text, fontSize: 18, textAlign: 'center' }}>{h}</Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={{ color: colors.accent, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>Dakika</Text>
                      <ScrollView style={{ maxHeight: 200 }}>
                        {minutes.map((m: string) => (
                          <Pressable key={m} style={{ padding: 10, borderBottomWidth: 1, borderColor: colors.border }} onPress={() => { setRegBirthTime(m); setBirthTimeModal(false); }}>
                            <Text style={{ color: colors.text, fontSize: 18, textAlign: 'center' }}>{m}</Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                  </View>
                  <Pressable style={styles.closeButton} onPress={() => setBirthTimeModal(false)}>
                  <Text style={styles.closeButtonText}>{t('close')}</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            {/* Şehir Seçim Modalı */}
            <Modal visible={birthPlaceModal} transparent animationType="fade" onRequestClose={() => setBirthPlaceModal(false)}>
              <View style={styles.modalOverlay}>
                <View style={[styles.categoryContent, { backgroundColor: colors.modal, width: 300 }]}> 
                <Text style={[styles.modalTitle, { color: colors.text }]}>{t('select_city')}</Text>
                  <ScrollView style={{ maxHeight: 300, width: 250 }}>
                    {iller.map((il: string) => (
                      <Pressable key={il} style={{ padding: 12, borderBottomWidth: 1, borderColor: colors.border }} onPress={() => { setRegBirthPlace(il); setBirthPlaceModal(false); }}>
                        <Text style={{ color: colors.text, fontSize: 18, textAlign: 'center' }}>{il}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                  <Pressable style={styles.closeButton} onPress={() => setBirthPlaceModal(false)}>
                  <Text style={styles.closeButtonText}>{t('close')}</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            {/* Yükselen Burç Şehir Seçim Modalı */}
            <Modal visible={risingCityModal} transparent animationType="fade" onRequestClose={() => setRisingCityModal(false)}>
              <View style={styles.modalOverlay}>
                <View style={[styles.categoryContent, { backgroundColor: colors.modal, width: 300 }]}> 
                <Text style={[styles.modalTitle, { color: colors.text }]}>{t('select_city')}</Text>
                  <ScrollView style={{ maxHeight: 300, width: 250 }}>
                    {iller.map((il: string) => (
                      <Pressable key={il} style={{ padding: 12, borderBottomWidth: 1, borderColor: colors.border }} onPress={() => { setRisingCity(il); setRisingCityModal(false); }}>
                        <Text style={{ color: colors.text, fontSize: 18, textAlign: 'center' }}>{il}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                  <Pressable style={styles.closeButton} onPress={() => setRisingCityModal(false)}>
                  <Text style={styles.closeButtonText}>{t('close')}</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            {/* Yükselen Burç Saat Seçim Modalı */}
            <Modal visible={risingHourModal} transparent animationType="fade" onRequestClose={() => setRisingHourModal(false)}>
              <View style={styles.modalOverlay}>
                <View style={[styles.categoryContent, { backgroundColor: colors.modal, width: 300 }]}> 
                <Text style={[styles.modalTitle, { color: colors.text }]}>{t('select_hour')}</Text>
                  <ScrollView style={{ maxHeight: 300, width: 250 }}>
                    {hours.map((h: string) => (
                      <Pressable key={h} style={{ padding: 12, borderBottomWidth: 1, borderColor: colors.border }} onPress={() => { setRisingHour(h); setRisingHourModal(false); }}>
                        <Text style={{ color: colors.text, fontSize: 18, textAlign: 'center' }}>{h}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                  <Pressable style={styles.closeButton} onPress={() => setRisingHourModal(false)}>
                  <Text style={styles.closeButtonText}>{t('close')}</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            {/* Yükselen Burç Dakika Seçim Modalı */}
            <Modal visible={risingMinuteModal} transparent animationType="fade" onRequestClose={() => setRisingMinuteModal(false)}>
              <View style={styles.modalOverlay}>
                <View style={[styles.categoryContent, { backgroundColor: colors.modal, width: 300 }]}> 
                <Text style={[styles.modalTitle, { color: colors.text }]}>{t('select_minute')}</Text>
                  <ScrollView style={{ maxHeight: 300, width: 250 }}>
                    {minutes.map((m: string) => (
                      <Pressable key={m} style={{ padding: 12, borderBottomWidth: 1, borderColor: colors.border }} onPress={() => { setRisingMinute(m); setRisingMinuteModal(false); }}>
                        <Text style={{ color: colors.text, fontSize: 18, textAlign: 'center' }}>{m}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                  <Pressable style={styles.closeButton} onPress={() => setRisingMinuteModal(false)}>
                  <Text style={styles.closeButtonText}>{t('close')}</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>
        </Modal>
        {/* Profil Modalı - Tam Ekran */}
        <Modal
          visible={modalVisible}
          animationType="slide"
          transparent={false}
          onRequestClose={closeModal}
        >
          <View style={{ flex: 1, backgroundColor: colors.bg }}>
            {/* Üst Bar */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20, backgroundColor: colors.modal, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <Text style={{ color: colors.accent, fontSize: 24, fontWeight: 'bold' }}>{t('profile')}</Text>
              <TouchableOpacity onPress={closeModal} style={{ padding: 8 }}>
                <Ionicons name="close" size={24} color={colors.accent} />
              </TouchableOpacity>
            </View>
            
            {/* Ana İçerik */}
            <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
            <View style={{ flex: 1, justifyContent: 'space-between' }}>
              {/* Profil başlığı - Kaldırıldı çünkü üstte zaten var */}
              {/* Kullanıcı giriş yapmamışsa giriş/üye ol butonları */}
              {!currentUser && !formType && (
                <>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: colors.accent, marginBottom: 8 }]}
                    onPress={() => setFormType('login')}
                  >
                  <Text style={[styles.modalButtonText, { color: colors.accentText }]}>{t('login')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: colors.accent }]}
                    onPress={() => setFormType('register')}
                  >
                  <Text style={[styles.modalButtonText, { color: colors.accentText }]}>{t('register')}</Text>
                  </TouchableOpacity>
                </>
              )}
              {/* Giriş formu */}
              {!currentUser && formType === 'login' && (
                <>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }]}
                  placeholder={t('email')}
                    placeholderTextColor={colors.placeholder}
                    value={loginEmail}
                    onChangeText={setLoginEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    autoFocus={false}
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }]}
                  placeholder={t('password')}
                    placeholderTextColor={colors.placeholder}
                    value={loginPassword}
                    onChangeText={setLoginPassword}
                    secureTextEntry
                    returnKeyType="done"
                    blurOnSubmit={true}
                  />
                  {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: colors.accent, marginBottom: 8 }]}
                    onPress={handleLogin}
                    disabled={loading}
                  >
                  <Text style={[styles.modalButtonText, { color: colors.accentText }]}>{loading ? t('loading_login') : t('login')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setFormType('register')} style={{ marginBottom: 8 }}>
                  <Text style={{ color: colors.accent, textAlign: 'center' }}>{t('no_account')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>{t('close')}</Text>
                  </TouchableOpacity>
                </>
              )}
              {/* Üye ol formu */}
              {!currentUser && formType === 'register' && (
                <>
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }]}
                  placeholder={t('name')}
                    placeholderTextColor={colors.placeholder}
                    value={regName}
                    onChangeText={setRegName}
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }]}
                  placeholder={t('surname')}
                    placeholderTextColor={colors.placeholder}
                    value={regSurname}
                    onChangeText={setRegSurname}
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }]}
                  placeholder={t('email')}
                    placeholderTextColor={colors.placeholder}
                    value={regEmail}
                    onChangeText={setRegEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }]}
                  placeholder={t('password')}
                    placeholderTextColor={colors.placeholder}
                    value={regPassword}
                    onChangeText={setRegPassword}
                    secureTextEntry
                    returnKeyType="next"
                    blurOnSubmit={false}
                  />
                  <TextInput
                    style={[styles.input, { backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }]}
                  placeholder={t('password_repeat')}
                    placeholderTextColor={colors.placeholder}
                    value={regPassword2}
                    onChangeText={setRegPassword2}
                    secureTextEntry
                    returnKeyType="done"
                    blurOnSubmit={true}
                  />
                  {registerError ? <Text style={styles.errorText}>{registerError}</Text> : null}
                  {registerSuccess ? <Text style={styles.successText}>{registerSuccess}</Text> : null}
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: colors.accent, marginBottom: 8 }]}
                    onPress={handleRegister}
                    disabled={loading}
                  >
                  <Text style={[styles.modalButtonText, { color: colors.accentText }]}>{loading ? t('loading_register') : t('register')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setFormType('login')} style={{ marginBottom: 8 }}>
                  <Text style={{ color: colors.accent, textAlign: 'center' }}>{t('have_account')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>{t('close')}</Text>
                  </TouchableOpacity>
                </>
              )}
              {/* Kullanıcı giriş yaptıysa profil bilgileri ve çıkış */}
              {currentUser && (
                <>
                  <View style={{ alignItems: 'center', marginBottom: 16 }}>
                    <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                      <Text style={{ color: colors.accentText, fontSize: 22, fontWeight: 'bold' }}>{currentName ? currentName[0] : ''}{regSurname ? regSurname[0] : ''}</Text>
                    </View>
                    <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 16 }}>{currentName} {regSurname}</Text>
                    <Text style={{ color: colors.subtext, fontSize: 14 }}>{currentUser?.email}</Text>
                  </View>
                  {/* Düzenlenebilir kullanıcı bilgileri */}
                  <View style={{ width: '100%', marginBottom: 16, backgroundColor: colors.card, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: colors.border }}>
                  <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 15, marginBottom: 2 }}>{t('name')}:</Text>
                    <TextInput style={[styles.input, { color: colors.text, borderColor: colors.inputBorder }]} value={currentName} onChangeText={setCurrentName} returnKeyType="next" blurOnSubmit={false} />
                  <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 15, marginBottom: 2 }}>{t('surname')}:</Text>
                    <TextInput style={[styles.input, { color: colors.text, borderColor: colors.inputBorder }]} value={regSurname} onChangeText={setRegSurname} returnKeyType="next" blurOnSubmit={false} />
                  <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 15, marginBottom: 2 }}>{t('email')}:</Text>
                    <TextInput style={[styles.input, { color: colors.text, borderColor: colors.inputBorder }]} value={regEmail} onChangeText={setRegEmail} autoCapitalize="none" keyboardType="email-address" returnKeyType="done" blurOnSubmit={true} />
                  <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 15, marginBottom: 2 }}>{t('gender')}:</Text>
                    <View style={{ flexDirection: 'row', marginBottom: 8 }}>
                      {cinsiyetler.map((c: string) => (
                        <Pressable key={c} style={{ backgroundColor: regGender === c ? colors.accent : colors.inputBg, borderRadius: 8, borderWidth: 1, borderColor: colors.inputBorder, marginRight: 8, padding: 8 }} onPress={() => setRegGender(c)}>
                          <Text style={{ color: regGender === c ? colors.accentText : colors.text }}>{c}</Text>
                        </Pressable>
                      ))}
                    </View>
                  <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 15, marginBottom: 2 }}>{t('birth_place')}:</Text>
                    <TouchableOpacity style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder, justifyContent: 'center' }]} onPress={() => setBirthPlaceModal(true)}>
                      <Text style={{ color: regBirthPlace ? colors.text : colors.placeholder }}>{regBirthPlace || "Seç"}</Text>
                    </TouchableOpacity>
                    <Modal visible={birthPlaceModal} transparent={false} onRequestClose={() => setBirthPlaceModal(false)}>
                      <View style={{ flex: 1, backgroundColor: colors.bg }}>
                        {/* Üst Bar */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20, backgroundColor: colors.modal, borderBottomWidth: 1, borderBottomColor: colors.border }}>
                          <Text style={{ color: colors.accent, fontSize: 24, fontWeight: 'bold' }}>Şehir Seç</Text>
                          <TouchableOpacity onPress={() => setBirthPlaceModal(false)} style={{ padding: 8 }}>
                            <Ionicons name="close" size={24} color={colors.accent} />
                          </TouchableOpacity>
                        </View>
                        {/* Şehir Listesi */}
                        <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}>
                          {iller.map((il: string) => (
                            <Pressable key={il} style={{ padding: 16, borderBottomWidth: 1, borderColor: colors.border, backgroundColor: colors.card, marginBottom: 8, borderRadius: 8 }} onPress={() => { setRegBirthPlace(il); setBirthPlaceModal(false); }}>
                              <Text style={{ color: colors.text, fontSize: 18, textAlign: 'center' }}>{il}</Text>
                            </Pressable>
                          ))}
                        </ScrollView>
                      </View>
                    </Modal>
                  <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 15, marginBottom: 2 }}>{t('birth_date')}:</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TouchableOpacity style={[styles.input, { flex: 1, backgroundColor: colors.inputBg, borderColor: colors.inputBorder, justifyContent: 'center' }]} onPress={() => setBirthDayModal(true)}>
                        <Text style={{ color: regBirthDay ? colors.text : colors.placeholder }}>{regBirthDay || "Gün"}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.input, { flex: 1, backgroundColor: colors.inputBg, borderColor: colors.inputBorder, justifyContent: 'center' }]} onPress={() => setBirthMonthModal(true)}>
                        <Text style={{ color: regBirthMonth ? colors.text : colors.placeholder }}>{regBirthMonth || "Ay"}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.input, { flex: 1, backgroundColor: colors.inputBg, borderColor: colors.inputBorder, justifyContent: 'center' }]} onPress={() => setBirthYearModal(true)}>
                        <Text style={{ color: regBirthYear ? colors.text : colors.placeholder }}>{regBirthYear || "Yıl"}</Text>
                      </TouchableOpacity>
                    </View>
                  <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 15, marginBottom: 2 }}>{t('birth_time')}:</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TouchableOpacity style={[styles.input, { flex: 1, backgroundColor: colors.inputBg, borderColor: colors.inputBorder, justifyContent: 'center' }]} onPress={() => setBirthHourModal(true)}>
                        <Text style={{ color: regBirthHour ? colors.text : colors.placeholder }}>{regBirthHour || "Saat"}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.input, { flex: 1, backgroundColor: colors.inputBg, borderColor: colors.inputBorder, justifyContent: 'center' }]} onPress={() => setBirthMinuteModal(true)}>
                        <Text style={{ color: regBirthMinute ? colors.text : colors.placeholder }}>{regBirthMinute || "Dakika"}</Text>
                      </TouchableOpacity>
                    </View>
                  <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 15, marginBottom: 2 }}>{t('zodiac')}:</Text>
                    <Pressable style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]} onPress={() => setProfileBurcModal(true)}>
                    <Text style={{ color: regZodiac ? colors.text : colors.placeholder }}>{regZodiac || t('select')}</Text>
                    </Pressable>
                    <Modal visible={profileBurcModal} transparent animationType="fade" onRequestClose={() => setProfileBurcModal(false)}>
                      <View style={styles.modalOverlay}>
                        <View style={[styles.categoryContent, { backgroundColor: colors.modal }]}> 
                        <Text style={[styles.modalTitle, { color: colors.text }]}>{t('select_zodiac')}</Text>
                          <ScrollView style={{ maxHeight: 300, width: 200 }}>
                            {burclar.map((b: string) => (
                              <Pressable key={b} style={{ padding: 12 }} onPress={() => { setRegZodiac(b); setProfileBurcModal(false); }}>
                                <Text style={{ color: colors.text, fontSize: 18 }}>{b}</Text>
                              </Pressable>
                            ))}
                          </ScrollView>
                          <Pressable style={styles.closeButton} onPress={() => setProfileBurcModal(false)}>
                          <Text style={styles.closeButtonText}>{t('close')}</Text>
                          </Pressable>
                        </View>
                      </View>
                    </Modal>
                  <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 15, marginBottom: 2 }}>{t('job')}:</Text>
                    <Pressable style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]} onPress={() => setProfileMeslekModal(true)}>
                    <Text style={{ color: regJob ? colors.text : colors.placeholder }}>{regJob || t('select')}</Text>
                    </Pressable>
                    <Modal visible={profileMeslekModal} transparent animationType="fade" onRequestClose={() => setProfileMeslekModal(false)}>
                      <View style={styles.modalOverlay}>
                        <View style={[styles.categoryContent, { backgroundColor: colors.modal }]}> 
                        <Text style={[styles.modalTitle, { color: colors.text }]}>{t('select_job')}</Text>
                          <ScrollView style={{ maxHeight: 300, width: 200 }}>
                            {meslekler.map((m: string) => (
                              <Pressable key={m} style={{ padding: 12 }} onPress={() => { setRegJob(m); setProfileMeslekModal(false); }}>
                                <Text style={{ color: colors.text, fontSize: 18 }}>{m}</Text>
                              </Pressable>
                            ))}
                          </ScrollView>
                          <Pressable style={styles.closeButton} onPress={() => setProfileMeslekModal(false)}>
                          <Text style={styles.closeButtonText}>{t('close')}</Text>
                          </Pressable>
                        </View>
                      </View>
                    </Modal>
                  <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 15, marginBottom: 2 }}>{t('relationship')}:</Text>
                    <Pressable style={[styles.input, { backgroundColor: colors.inputBg, borderColor: colors.inputBorder }]} onPress={() => setProfileIliskiModal(true)}>
                    <Text style={{ color: regRelationship ? colors.text : colors.placeholder }}>{regRelationship || t('select')}</Text>
                    </Pressable>
                    <Modal visible={profileIliskiModal} transparent animationType="fade" onRequestClose={() => setProfileIliskiModal(false)}>
                      <View style={styles.modalOverlay}>
                        <View style={[styles.categoryContent, { backgroundColor: colors.modal }]}> 
                        <Text style={[styles.modalTitle, { color: colors.text }]}>{t('select_relationship')}</Text>
                          <ScrollView style={{ maxHeight: 300, width: 200 }}>
                            {iliskiDurumlari.map((i: string) => (
                              <Pressable key={i} style={{ padding: 12 }} onPress={() => { setRegRelationship(i); setProfileIliskiModal(false); }}>
                                <Text style={{ color: colors.text, fontSize: 18 }}>{i}</Text>
                              </Pressable>
                            ))}
                          </ScrollView>
                          <Pressable style={styles.closeButton} onPress={() => setProfileIliskiModal(false)}>
                          <Text style={styles.closeButtonText}>{t('close')}</Text>
                          </Pressable>
                        </View>
                      </View>
                    </Modal>
                    <TouchableOpacity 
                      style={[styles.modalButton, { backgroundColor: colors.accent, marginTop: 8 }]} 
                      onPress={async () => {
                        if (currentUser) {
                          try {
                            // Doğum tarihi ve saati birleştir
                            const combinedBirthDate = regBirthDay && regBirthMonth && regBirthYear ? `${regBirthDay}.${regBirthMonth}.${regBirthYear}` : regBirthDate;
                            const combinedBirthTime = regBirthHour && regBirthMinute ? `${regBirthHour}:${regBirthMinute}` : regBirthTime;
                            
                            await updateDoc(doc(db, 'users', currentUser.uid), {
                              name: currentName,
                              surname: regSurname,
                              email: regEmail,
                              gender: regGender,
                              birthDate: combinedBirthDate,
                              birthTime: combinedBirthTime,
                              birthPlace: regBirthPlace,
                              zodiac: regZodiac,
                              job: regJob,
                              relationship: regRelationship
                            });
                            setProfileSuccess('Profil başarıyla güncellendi!');
                            setTimeout(() => setProfileSuccess(''), 2000);
                          } catch (error) {
                            console.log('Firebase güncelleme hatası:', error);
                            setProfileError('Profil güncellenirken hata oluştu. İnternet bağlantınızı kontrol edin.');
                            setTimeout(() => setProfileError(''), 3000);
                          }
                        }
                      }}
                    >
                    <Text style={[styles.modalButtonText, { color: colors.accentText }]}>{t('save')}</Text>
                    </TouchableOpacity>
                    {profileSuccess ? <Text style={styles.successText}>{profileSuccess}</Text> : null}
                    {profileError ? <Text style={styles.errorText}>{profileError}</Text> : null}
                  </View>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: colors.danger, borderColor: colors.dangerBorder, borderWidth: 2, marginBottom: 8 }]}
                    onPress={() => { signOut(auth); localStorage.removeItem('tarot_user_name'); closeModal(); }}
                  >
                  <Text style={[styles.modalButtonText, { color: colors.accentText }]}>{t('logout')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                  <Text style={styles.closeButtonText}>{t('close')}</Text>
                  </TouchableOpacity>
                </>
              )}
              </View>
            </ScrollView>
          </View>
        </Modal>
        {/* Gün Seçim Modalı */}
        <Modal visible={birthDayModal} transparent animationType="fade" onRequestClose={() => setBirthDayModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.categoryContent, { backgroundColor: colors.modal }]}> 
              <Text style={[styles.modalTitle, { color: colors.text }]}>Gün Seç</Text>
              <ScrollView style={{ maxHeight: 300, width: 200 }}>
                {days.map((d: string) => (
                  <Pressable key={d} style={{ padding: 12 }} onPress={() => { setRegBirthDay(d); setBirthDayModal(false); }}>
                    <Text style={{ color: colors.text, fontSize: 18 }}>{d}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <Pressable style={styles.closeButton} onPress={() => setBirthDayModal(false)}>
                <Text style={styles.closeButtonText}>{t('close')}</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        {/* Ay Seçim Modalı */}
        <Modal visible={birthMonthModal} transparent animationType="fade" onRequestClose={() => setBirthMonthModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.categoryContent, { backgroundColor: colors.modal }]}> 
              <Text style={[styles.modalTitle, { color: colors.text }]}>Ay Seç</Text>
              <ScrollView style={{ maxHeight: 300, width: 200 }}>
                {months.map((m: string) => (
                  <Pressable key={m} style={{ padding: 12 }} onPress={() => { setRegBirthMonth(m); setBirthMonthModal(false); }}>
                    <Text style={{ color: colors.text, fontSize: 18 }}>{m}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <Pressable style={styles.closeButton} onPress={() => setBirthMonthModal(false)}>
                <Text style={styles.closeButtonText}>{t('close')}</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        {/* Yıl Seçim Modalı */}
        <Modal visible={birthYearModal} transparent animationType="fade" onRequestClose={() => setBirthYearModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.categoryContent, { backgroundColor: colors.modal }]}> 
              <Text style={[styles.modalTitle, { color: colors.text }]}>Yıl Seç</Text>
              <ScrollView style={{ maxHeight: 300, width: 200 }}>
                {years.map((y: string) => (
                  <Pressable key={y} style={{ padding: 12 }} onPress={() => { setRegBirthYear(y); setBirthYearModal(false); }}>
                    <Text style={{ color: colors.text, fontSize: 18 }}>{y}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <Pressable style={styles.closeButton} onPress={() => setBirthYearModal(false)}>
                <Text style={styles.closeButtonText}>{t('close')}</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        {/* Saat Seçim Modalı */}
        <Modal visible={birthHourModal} transparent animationType="fade" onRequestClose={() => setBirthHourModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.categoryContent, { backgroundColor: colors.modal }]}> 
              <Text style={[styles.modalTitle, { color: colors.text }]}>Saat Seç</Text>
              <ScrollView style={{ maxHeight: 300, width: 200 }}>
                {hours.map((h: string) => (
                  <Pressable key={h} style={{ padding: 12 }} onPress={() => { setRegBirthHour(h); setBirthHourModal(false); }}>
                    <Text style={{ color: colors.text, fontSize: 18 }}>{h}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <Pressable style={styles.closeButton} onPress={() => setBirthHourModal(false)}>
                <Text style={styles.closeButtonText}>{t('close')}</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        {/* Dakika Seçim Modalı */}
        <Modal visible={birthMinuteModal} transparent animationType="fade" onRequestClose={() => setBirthMinuteModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={[styles.categoryContent, { backgroundColor: colors.modal }]}> 
              <Text style={[styles.modalTitle, { color: colors.text }]}>Dakika Seç</Text>
              <ScrollView style={{ maxHeight: 300, width: 200 }}>
                {minutes.map((m: string) => (
                  <Pressable key={m} style={{ padding: 12 }} onPress={() => { setRegBirthMinute(m); setBirthMinuteModal(false); }}>
                    <Text style={{ color: colors.text, fontSize: 18 }}>{m}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <Pressable style={styles.closeButton} onPress={() => setBirthMinuteModal(false)}>
                <Text style={styles.closeButtonText}>{t('close')}</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        {/* Burç Uyumu Modalı */}
        <Modal
          visible={uyumModal}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setUyumModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: colors.bg, padding: 24, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[styles.modalTitle, { color: colors.text, textAlign: 'center', marginBottom: 24 }]}>{t('compatibility')}</Text>
            {/* Yan yana burç ve cinsiyet seçimleri */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', marginBottom: 16, gap: 16 }}>
              {/* 1. Burç ve cinsiyet */}
              <View style={{ alignItems: 'center', minWidth: 120 }}>
                <TouchableOpacity
                  style={{ backgroundColor: colors.card, borderColor: colors.accent, borderWidth: 2, borderRadius: 16, paddingVertical: 18, paddingHorizontal: 28, alignItems: 'center', minWidth: 120 }}
                  onPress={() => setBurcSecimModal('burc1')}
                >
                <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 20 }}>{uyumBurc1 || t('select_first_sign')}</Text>
                </TouchableOpacity>
              <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 14, marginTop: 8 }}>{t('gender_1')}</Text>
                {cinsiyetler.map((c: string) => (
                  <Pressable
                    key={c}
                    style={{
                      backgroundColor: uyumCinsiyet1 === c ? colors.accent : colors.card,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: colors.border,
                      marginVertical: 2,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      alignItems: 'center',
                      width: 90,
                    }}
                    onPress={() => setUyumCinsiyet1(c)}
                  >
                    <Text style={{ color: uyumCinsiyet1 === c ? colors.accentText : colors.text, fontWeight: 'bold' }}>{c}</Text>
                  </Pressable>
                ))}
              </View>
              {/* 2. Burç ve cinsiyet */}
              <View style={{ alignItems: 'center', minWidth: 120 }}>
                <TouchableOpacity
                  style={{ backgroundColor: colors.card, borderColor: colors.accent, borderWidth: 2, borderRadius: 16, paddingVertical: 18, paddingHorizontal: 28, alignItems: 'center', minWidth: 120 }}
                  onPress={() => setBurcSecimModal('burc2')}
                >
                <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 20 }}>{uyumBurc2 || t('select_second_sign')}</Text>
                </TouchableOpacity>
              <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 14, marginTop: 8 }}>{t('gender_2')}</Text>
                {cinsiyetler.map((c: string) => (
                  <Pressable
                    key={c}
                    style={{
                      backgroundColor: uyumCinsiyet2 === c ? colors.accent : colors.card,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: colors.border,
                      marginVertical: 2,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      alignItems: 'center',
                      width: 90,
                    }}
                    onPress={() => setUyumCinsiyet2(c)}
                  >
                    <Text style={{ color: uyumCinsiyet2 === c ? colors.accentText : colors.text, fontWeight: 'bold' }}>{c}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
            {/* Uyumu Göster butonu */}
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: colors.accent, marginTop: 8, marginBottom: 16, width: 220, alignSelf: 'center' }]}
              onPress={() => {
                if (
                  uyumBurc1 &&
                  uyumBurc2 &&
                  uyumCinsiyet1 &&
                  burcUyumlari[uyumBurc1] &&
                  burcUyumlari[uyumBurc1][uyumBurc2] &&
                  burcUyumlari[uyumBurc1][uyumBurc2][uyumCinsiyet1]
                ) {
                  setUyumSonuc(burcUyumlari[uyumBurc1][uyumBurc2][uyumCinsiyet1]);
                } else {
                  setUyumSonuc({
                    genel: `${uyumBurc1} ile ${uyumBurc2} (${uyumCinsiyet1}) için detaylı uyum verisi yakında eklenecek.`,
                    ask: `${uyumBurc1} ile ${uyumBurc2} (${uyumCinsiyet1}) aşk uyumu: Bilgi yakında eklenecek.`,
                    saglik: `${uyumBurc1} ile ${uyumBurc2} (${uyumCinsiyet1}) sağlık uyumu: Bilgi yakında eklenecek.`,
                    kariyer: `${uyumBurc1} ile ${uyumBurc2} (${uyumCinsiyet1}) kariyer uyumu: Bilgi yakında eklenecek.`
                  });
                }
              }}
              disabled={!uyumBurc1 || !uyumBurc2 || !uyumCinsiyet1 || !uyumCinsiyet2}
            >
            <Text style={[styles.modalButtonText, { color: colors.accentText, fontSize: 18 }]}>{t('show_compatibility_button')}</Text>
            </TouchableOpacity>
            {/* Sonuç alanı tam ekran */}
            {uyumSonuc && (
              <ScrollView style={{ flex: 1, width: '100%', marginTop: 12, backgroundColor: colors.card, borderRadius: 18, padding: 18 }}>
              <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 22, marginBottom: 10, textAlign: 'center' }}>{uyumBurc1} & {uyumBurc2} {t('compatibility')}</Text>
              <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 18, marginBottom: 6 }}>{t('genel')}</Text>
                {uyumSonuc && <Text style={{ color: colors.text, marginBottom: 10 }}>{uyumSonuc.genel}</Text>}
              <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 18, marginBottom: 6 }}>{t('ask')}</Text>
                {uyumSonuc && <Text style={{ color: colors.text, marginBottom: 10 }}>{uyumSonuc.ask}</Text>}
              <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 18, marginBottom: 6 }}>{t('saglik')}</Text>
                {uyumSonuc && <Text style={{ color: colors.text, marginBottom: 10 }}>{uyumSonuc.saglik}</Text>}
              <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 18, marginBottom: 6 }}>{t('kariyer')}</Text>
                {uyumSonuc && <Text style={{ color: colors.text, marginBottom: 10 }}>{uyumSonuc.kariyer}</Text>}
              </ScrollView>
            )}
            <Pressable style={styles.closeButton} onPress={() => setUyumModal(false)}>
            <Text style={styles.closeButtonText}>{t('close')}</Text>
            </Pressable>
            {/* 1. Burç seçimi için modal */}
            <Modal visible={burcSecimModal === 'burc1'} transparent animationType="fade" onRequestClose={() => setBurcSecimModal('none')}>
              <View style={styles.modalOverlay}>
                <View style={[styles.categoryContent, { backgroundColor: colors.modal }]}> 
                <Text style={[styles.modalTitle, { color: colors.text }]}>{t('select_first_sign')}</Text>
                  <ScrollView style={{ maxHeight: 300, width: 200 }}>
                    {burclar.map((burc: string) => (
                      <Pressable key={burc} style={{ padding: 12 }} onPress={() => { setUyumBurc1(burc); setBurcSecimModal('none'); }}>
                        <Text style={{ color: colors.text, fontSize: 18 }}>{burc}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                  <Pressable style={styles.closeButton} onPress={() => setBurcSecimModal('none')}>
                  <Text style={styles.closeButtonText}>{t('close')}</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            {/* 2. Burç seçimi için modal */}
            <Modal visible={burcSecimModal === 'burc2'} transparent animationType="fade" onRequestClose={() => setBurcSecimModal('none')}>
              <View style={styles.modalOverlay}>
                <View style={[styles.categoryContent, { backgroundColor: colors.modal }]}> 
                <Text style={[styles.modalTitle, { color: colors.text }]}>{t('select_second_sign')}</Text>
                  <ScrollView style={{ maxHeight: 300, width: 200 }}>
                    {burclar.map((burc: string) => (
                      <Pressable key={burc} style={{ padding: 12 }} onPress={() => { setUyumBurc2(burc); setBurcSecimModal('none'); }}>
                        <Text style={{ color: colors.text, fontSize: 18 }}>{burc}</Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                  <Pressable style={styles.closeButton} onPress={() => setBurcSecimModal('none')}>
                  <Text style={styles.closeButtonText}>{t('close')}</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>
        </Modal>
        {/* Günlük Burç Modalı */}
        <Modal
          visible={gunlukBurcModal}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setGunlukBurcModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: colors.bg, padding: 24 }}>
            <Text style={[styles.modalTitle, { color: colors.text, textAlign: 'center' }]}>Günlük Burç Yorumları</Text>
            <ScrollView contentContainerStyle={{ paddingVertical: 12 }}>
              {burclar.map((burc: string) => (
                <Pressable
                  key={burc}
                  style={{ backgroundColor: colors.card, borderRadius: 14, borderWidth: 1, borderColor: colors.border, marginVertical: 8, padding: 18, alignItems: 'center' }}
                  onPress={() => {
                    setSelectedBurc(burc);
                    setBurcDetayModal(true);
                  }}
                >
                  <Text style={{ color: colors.text, fontSize: 22, fontWeight: 'bold' }}>{burc}</Text>
                  <Text style={{ color: colors.subtext, fontSize: 14, marginTop: 8, textAlign: 'center' }}>
                    {getGunlukBurcYorumu(burc)}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            <Pressable style={styles.closeButton} onPress={() => setGunlukBurcModal(false)}>
              <Text style={styles.closeButtonText}>{t('close')}</Text>
            </Pressable>
          </View>
        </Modal>

        {/* Favoriler Modalı */}
        <Modal
          visible={favorilerModal}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setFavorilerModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: colors.bg, padding: 24 }}>
            <Text style={[styles.modalTitle, { color: colors.text, textAlign: 'center' }]}>⭐ Favorilerim</Text>
            
            {/* Favori Burçlar */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Favori Burçlar</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                {favoriBurclar.map((burc, index) => (
                  <View key={index} style={{ backgroundColor: colors.card, borderRadius: 12, padding: 12, marginRight: 8, borderWidth: 1, borderColor: colors.border }}>
                    <Text style={{ color: colors.text, fontWeight: 'bold' }}>{burc}</Text>
                    <TouchableOpacity onPress={() => setFavoriBurclar(favoriBurclar.filter((_, i) => i !== index))}>
                      <Text style={{ color: colors.error, fontSize: 12, marginTop: 4 }}>Kaldır</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={{ backgroundColor: colors.accent, borderRadius: 8, padding: 8, alignItems: 'center' }}
                onPress={() => setBurcModal(true)}
              >
                <Text style={{ color: colors.accentText, fontWeight: 'bold' }}>Burç Ekle</Text>
              </TouchableOpacity>
            </View>

            {/* Favori Tarot Kartları */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>Favori Tarot Kartları</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                {favoriKartlar.map((kartIndex, index) => (
                  <View key={index} style={{ backgroundColor: colors.card, borderRadius: 12, padding: 12, marginRight: 8, borderWidth: 1, borderColor: colors.border, alignItems: 'center' }}>
                    <Image source={tarotImages[kartIndex]} style={{ width: 60, height: 100, borderRadius: 8, marginBottom: 8 }} />
                    <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 12, textAlign: 'center' }}>{TAROT_CARDS[kartIndex].name}</Text>
                    <TouchableOpacity onPress={() => setFavoriKartlar(favoriKartlar.filter((_, i) => i !== index))}>
                      <Text style={{ color: colors.error, fontSize: 12, marginTop: 4 }}>Kaldır</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={{ backgroundColor: colors.accent, borderRadius: 8, padding: 8, alignItems: 'center' }}
                onPress={() => setCategoryModal(true)}
              >
                <Text style={{ color: colors.accentText, fontWeight: 'bold' }}>Kart Ekle</Text>
              </TouchableOpacity>
            </View>

            <Pressable style={styles.closeButton} onPress={() => setFavorilerModal(false)}>
              <Text style={styles.closeButtonText}>{t('close')}</Text>
            </Pressable>
          </View>
        </Modal>
        {/* Tarot Kartı Modalı */}
        <Modal visible={tarotModal} transparent={false} onRequestClose={() => setTarotModal(false)}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
            {selectedCardIndex != null && (
              <TouchableOpacity
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}
                onPress={() => { setTarotModal(false); setMeaningModal(true); }}
                activeOpacity={0.9}
              >
                <Image
                  source={tarotImages[selectedCardIndex]}
                  style={{ width: 220, height: 360, borderRadius: 18, marginBottom: 24, marginTop: 32 }}
                />
                <Text style={{ fontWeight: 'bold', fontSize: 28, marginBottom: 8, color: colors.accent, textAlign: 'center' }}>
                  {TAROT_CARDS[selectedCardIndex].name}
                </Text>
              <Text style={{ color: colors.subtext, fontStyle: 'italic', marginBottom: 8, fontSize: 16 }}>{t('tarot_meaning')}</Text>
                <TouchableOpacity onPress={() => setTarotModal(false)} style={{ marginTop: 24, backgroundColor: colors.accent, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 32 }}>
                <Text style={{ color: colors.accentText, fontWeight: 'bold', fontSize: 18 }}>{t('close')}</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
      </View>
        </Modal>
        {/* Kart Anlamı Modalı */}
        <Modal visible={meaningModal} transparent={false} onRequestClose={() => setMeaningModal(false)}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg, padding: 24 }}>
            {selectedCardIndex != null && (
              <>
                <Text style={{ fontWeight: 'bold', fontSize: 28, marginBottom: 18, color: colors.accent, textAlign: 'center' }}>
                  {TAROT_CARDS[selectedCardIndex].name}
                </Text>
                <ScrollView style={{ width: '100%' }} contentContainerStyle={{ alignItems: 'center', paddingBottom: 32 }}>
                  <Text style={{ marginBottom: 16, color: colors.text, fontSize: 18 }}><Text style={{ fontWeight: 'bold', color: colors.accent }}>{t('general')}: </Text>{TAROT_CARDS[selectedCardIndex].meanings.general}</Text>
                  <Text style={{ marginBottom: 16, color: colors.text, fontSize: 18 }}><Text style={{ fontWeight: 'bold', color: colors.accent }}>{t('love')}: </Text>{TAROT_CARDS[selectedCardIndex].meanings.love}</Text>
                  <Text style={{ marginBottom: 16, color: colors.text, fontSize: 18 }}><Text style={{ fontWeight: 'bold', color: colors.accent }}>{t('health')}: </Text>{TAROT_CARDS[selectedCardIndex].meanings.health}</Text>
                  <Text style={{ marginBottom: 16, color: colors.text, fontSize: 18 }}><Text style={{ fontWeight: 'bold', color: colors.accent }}>{t('career')}: </Text>{TAROT_CARDS[selectedCardIndex].meanings.career}</Text>
                </ScrollView>
                <TouchableOpacity onPress={() => setMeaningModal(false)} style={{ marginTop: 12, backgroundColor: colors.accent, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 32 }}>
                  <Text style={{ color: colors.accentText, fontWeight: 'bold', fontSize: 18 }}>{t('close')}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Modal>
        {/* Tarot Kartı Seçim Modalı */}
        <Modal visible={tarotSelectModal} transparent={false} onRequestClose={() => setTarotSelectModal(false)}>
          <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 12 }}>
            {/* Kart seçimi tamamlanmadıysa fan/yay şeklinde göster */}
            {tarotSelectCards.length < 3 ? (
              <>
                {/* En üstte başlık */}
                <Text style={{ 
                  color: colors.accent, 
                  fontWeight: 'bold', 
                  fontSize: 24, 
                  marginBottom: 20,
                  textAlign: 'center',
                  marginTop: 20
                }}>
                  3 kart seçiniz
                </Text>

                {/* Ortada seçilen kartlar */}
                {tarotSelectCards.length > 0 && (
                  <View style={{
                    flexDirection: 'row', 
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 15,
                    marginBottom: 30,
                    marginTop: 20
                  }}>
                    {tarotSelectCards.map((card: {index: number, reversed: boolean}, i: number) => (
                      <View
                        key={i}
                        style={{
                          transform: [{ scale: 1.2 }],
                    shadowColor: colors.accent,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.6,
                    shadowRadius: 8,
                    elevation: 8,
                        }}
                      >
                        <Image
                          source={require('../assets/images/tarot-arka-kapak.jpg')}
                          style={{ 
                            width: 80, 
                            height: 120, 
                            borderRadius: 12, 
                            borderWidth: 3, 
                            borderColor: colors.accent,
                            transform: [{ rotate: '180deg' }]
                          }}
                        />
                  </View>
                    ))}
                  </View>
                )}

                {/* 78 kart tam ekran */}
                <View style={{ 
                  width: '100%', 
                  height: 300, 
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative'
                }}>
                  
                  {/* 78 kart 13x6 grid şeklinde */}
                  {tarotDeck.slice(0, 78).map((card: {index: number, reversed: boolean}, i: number) => {
                    const isSelected = tarotSelectCards.some((sel: {index: number, reversed: boolean}) => sel.index === card.index && sel.reversed === card.reversed);
                    const isDisabled = tarotSelectCards.length >= 3 || isSelected;
                    
                    // Kartları 13x6 grid şeklinde dizelim (13 sütun, 6 satır)
                    const cardsPerRow = 13;
                    const row = Math.floor(i / cardsPerRow);
                    const col = i % cardsPerRow;
                    
                    // 78 kartı ekrana tam yerleştirme
                    const screenWidth = 390; // Ekran genişliği
                    const screenHeight = 280; // Ekran yüksekliği (kapat butonu için yer bırakıyoruz)
                    const cardWidth = Math.floor((screenWidth - 26) / 13); // 13 sütun için
                    const cardHeight = Math.floor((screenHeight - 12) / 6); // 6 satır için
                    const cardSpacing = 2;
                    
                    // Sağa ve sola eşit boşluk için merkezleme
                    const totalCardsWidth = cardsPerRow * cardWidth + (cardsPerRow - 1) * cardSpacing;
                    const startX = (screenWidth - totalCardsWidth) / 2;
                    const x = startX + col * (cardWidth + cardSpacing);
                    const y = row * (cardHeight + cardSpacing) + 5;
                    
                    return (
                      <Pressable
                        key={`card-${i}`}
                        style={{
                          position: 'absolute',
                          left: x,
                          top: y,
                          zIndex: isSelected ? 100 : i,
                          opacity: isSelected ? 0.8 : 1,
                          transform: [
                            { scale: isSelected ? 1.1 : 1 },
                          ],
                          shadowColor: colors.accent,
                          shadowOffset: { width: 0, height: isSelected ? 8 : 4 },
                          shadowOpacity: isSelected ? 0.8 : 0.5,
                          shadowRadius: isSelected ? 15 : 8,
                          elevation: isSelected ? 15 : 8,
                        }}
                        disabled={isDisabled}
                        onPress={() => {
                          if (Platform.OS !== 'web') {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                          }
                          
                          // Rastgele ters çevirme ihtimali (%30)
                          const shouldReverse = Math.random() < 0.3;
                          const finalCard = {
                            ...card,
                            reversed: shouldReverse
                          };
                          
                          setTarotSelectCards([...tarotSelectCards, finalCard]);
                          setTarotSelectResults([...tarotSelectResults, finalCard]);
                        }}
                      >
                        <Image 
                          source={require('../assets/images/tarot-arka-kapak.jpg')} 
                          style={{ 
                            width: cardWidth, 
                            height: cardHeight, 
                            borderRadius: 4,
                            borderWidth: isSelected ? 2 : 1,
                            borderColor: isSelected ? colors.accent : colors.border,
                            transform: [{ rotate: '180deg' }],
                          }} 
                        />
                        {isSelected && (
                          <View style={{
                            position: 'absolute',
                            top: -2,
                            right: -2,
                            backgroundColor: colors.accent,
                            borderRadius: 4,
                            width: 12,
                            height: 12,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                            <Text style={{ color: '#fff', fontSize: 8, fontWeight: 'bold' }}>✓</Text>
                          </View>
                        )}
                      </Pressable>
                    );
                  })}
                </View>

                <Pressable style={styles.closeButton} onPress={() => setTarotSelectModal(false)}>
                  <Text style={styles.closeButtonText}>{t('close')}</Text>
                </Pressable>
              </>
            ) : (
              // Kartlar seçildiyse sonuçları göster
              <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 32 }} style={{ width: '100%' }}>
                {/* Seçilen kartlar yukarıda oval şekilde göster */}
                <View style={{ 
                  height: 140, 
                  width: '100%', 
                  alignSelf: 'center', 
                  marginBottom: 20, 
                  position: 'relative', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  backgroundColor: colors.card,
                  borderRadius: 20,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                  shadowColor: colors.accent,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}>
                  <Text style={{ 
                    color: colors.accent, 
                    fontWeight: 'bold', 
                    fontSize: 16, 
                    marginBottom: 12,
                    textAlign: 'center' 
                  }}>
                    Seçilen Kartlarınız
                  </Text>
                  <View style={{ 
                    flexDirection: 'row', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: 12 
                  }}>
                    {tarotSelectResults.map((card: {index: number, reversed: boolean}, i: number) => (
                      <View
                        key={i}
                        style={{
                          transform: [
                            { rotate: card.reversed ? '180deg' : '0deg' },
                            { scale: 1.1 }
                          ],
                          shadowColor: colors.accent,
                          shadowOffset: { width: 0, height: 3 },
                          shadowOpacity: 0.4,
                          shadowRadius: 6,
                          elevation: 6,
                        }}
                      >
                        <Image
                          source={tarotImages[card.index]}
                          style={{ 
                            width: 85, 
                            height: 125, 
                            borderRadius: 12, 
                            borderWidth: 3, 
                            borderColor: colors.accent, 
                            backgroundColor: '#fff' 
                          }}
                        />

                      </View>
                    ))}
                </View>
                </View>
                {/* 3 kartın birleşik anlamı */}
                <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: colors.border, marginBottom: 18, width: '95%' }}>
                  <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 18, marginBottom: 12, textAlign: 'center' }}>Kartların Birleşik Yorumu</Text>
                  <Text style={{ color: colors.text, fontSize: 16, lineHeight: 24, textAlign: 'justify' }}>
                    {(() => {
                      const cardNames = tarotSelectResults.map(card => 
                        `${TAROT_CARDS[card.index].name}${card.reversed ? ' (Ters)' : ''}`
                      ).join(', ');
                      
                      const meanings = tarotSelectResults.map(card => {
                        if (tarotSelectCategory === 'ask') return TAROT_CARDS[card.index].meanings.love;
                        if (tarotSelectCategory === 'saglik') return TAROT_CARDS[card.index].meanings.health;
                        if (tarotSelectCategory === 'kariyer') return TAROT_CARDS[card.index].meanings.career;
                        return TAROT_CARDS[card.index].meanings.general;
                      });
                      
                      const categoryText = tarotSelectCategory === 'ask' ? 'aşk hayatında' : tarotSelectCategory === 'saglik' ? 'sağlık konusunda' : tarotSelectCategory === 'kariyer' ? 'kariyer yolculuğunda' : 'genel yaşamında';
                      
                      return `Seçtiğin kartlar: ${cardNames}. Bu üç kartın birleşik enerjisi, ${categoryText} önemli mesajlar taşıyor. ${meanings.join(' ')} 

Bu kartların birlikte oluşturduğu enerji, senin için özel bir rehberlik sunuyor. Kartların verdiği mesajları dikkatlice değerlendir ve içgüdülerine güven. Bu dönemde sabırlı ol ve kendine inan. 

${tarotSelectCategory === 'ask' ? 'Aşk hayatında kalbinin sesini dinle ve gerçek duygularına odaklan. İlişkilerinde açık iletişim kur ve karşındakini anlamaya çalış. Sevgi dolu bir yaklaşım benimse ve kendini de sev.' : 
tarotSelectCategory === 'saglik' ? 'Sağlığın için düzenli egzersiz yap ve sağlıklı beslenmeye özen göster. Ruhsal sağlığın da bedensel sağlığın kadar önemli. Stresten uzak dur ve kendine zaman ayır.' : 
tarotSelectCategory === 'kariyer' ? 'Kariyer yolculuğunda hedeflerine odaklan ve sabırlı ol. Yeni fırsatları değerlendir ve yeteneklerini geliştirmeye devam et. İş hayatında dürüstlük ve çalışkanlık seni başarıya götürecek.' : 
'Genel yaşamında pozitif düşün ve olumlu enerji yay. Çevrendeki insanlarla iyi ilişkiler kur ve yardımsever ol. Kendine güven ve hedeflerine ulaşmak için çaba göster.'}

Bu kartların enerjisi seninle birlikte. Onların rehberliğinde doğru yolu bulacaksın. İçindeki sesi dinle ve kalbinin yönlendirmesine güven.`;
                    })()}
                    </Text>
                </View>
                <Pressable style={styles.closeButton} onPress={() => setTarotSelectModal(false)}>
                  <Text style={styles.closeButtonText}>{t('close')}</Text>
                </Pressable>
              </ScrollView>
            )}
          </View>
        </Modal>
        
        {/* Ayarlar Modalı */}
        <Modal
          visible={settingsModal}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setSettingsModal(false)}
        >
          <View style={{ flex: 1, backgroundColor: colors.bg, padding: 24 }}>
            <Text style={{ color: colors.text, fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 }}>
              Ayarlar
            </Text>
            
            <ScrollView style={{ flex: 1 }}>
              {/* Tema Seçimi */}
              <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 18, marginBottom: 15 }}>
                Tema
              </Text>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
                <TouchableOpacity
                  onPress={() => setSelectedTheme('light')}
                  style={{
                    backgroundColor: selectedTheme === 'light' ? colors.accent : 'transparent',
                    borderWidth: 1,
                    borderColor: colors.accent,
                    borderRadius: 8,
                    padding: 12,
                    minWidth: 100,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ 
                    color: selectedTheme === 'light' ? '#FFFFFF' : colors.accent,
                    fontWeight: 'bold'
                  }}>
                    Aydınlık
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => setSelectedTheme('dark')}
                  style={{
                    backgroundColor: selectedTheme === 'dark' ? colors.accent : 'transparent',
                    borderWidth: 1,
                    borderColor: colors.accent,
                    borderRadius: 8,
                    padding: 12,
                    minWidth: 100,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ 
                    color: selectedTheme === 'dark' ? '#FFFFFF' : colors.accent,
                    fontWeight: 'bold'
                  }}>
                    Karanlık
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Dil Seçimi */}
              <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 18, marginBottom: 15 }}>
                Dil
              </Text>
              
              <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
                <TouchableOpacity
                  onPress={() => setSelectedLanguage('tr')}
                  style={{
                    backgroundColor: selectedLanguage === 'tr' ? colors.accent : 'transparent',
                    borderWidth: 1,
                    borderColor: colors.accent,
                    borderRadius: 8,
                    padding: 12,
                    minWidth: 100,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ 
                    color: selectedLanguage === 'tr' ? '#FFFFFF' : colors.accent,
                    fontWeight: 'bold'
                  }}>
                    Türkçe
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => setSelectedLanguage('en')}
                  style={{
                    backgroundColor: selectedLanguage === 'en' ? colors.accent : 'transparent',
                    borderWidth: 1,
                    borderColor: colors.accent,
                    borderRadius: 8,
                    padding: 12,
                    minWidth: 100,
                    alignItems: 'center'
                  }}
                >
                  <Text style={{ 
                    color: selectedLanguage === 'en' ? '#FFFFFF' : colors.accent,
                    fontWeight: 'bold'
                  }}>
                    English
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Ses Ayarları */}
              <Text style={{ color: colors.accent, fontWeight: 'bold', fontSize: 18, marginBottom: 15 }}>
                Ses Ayarları
              </Text>
              
              <View style={{ marginBottom: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                  <View>
                    <Text style={{ color: colors.text, fontSize: 16, fontWeight: 'bold' }}>Uygulama Sesi</Text>
                    <Text style={{ color: colors.subtext, fontSize: 12 }}>Açılış ve geçiş sesleri</Text>
                  </View>
                  <Switch
                    value={appSoundEnabled}
                    onValueChange={setAppSoundEnabled}
                    trackColor={{ false: colors.switchTrack, true: colors.accent }}
                    thumbColor={appSoundEnabled ? colors.accentText : colors.switchThumb}
                  />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
                  <View>
                    <Text style={{ color: colors.text, fontSize: 16, fontWeight: 'bold' }}>Bildirim Sesi</Text>
                    <Text style={{ color: colors.subtext, fontSize: 12 }}>Bildirim ve uyarı sesleri</Text>
                  </View>
                  <Switch
                    value={notificationSoundEnabled}
                    onValueChange={setNotificationSoundEnabled}
                    trackColor={{ false: colors.switchTrack, true: colors.accent }}
                    thumbColor={notificationSoundEnabled ? colors.accentText : colors.switchThumb}
                  />
                </View>
              </View>

              {/* Ses Ayarlarını Kaydet */}
              <TouchableOpacity
                onPress={async () => {
                  if (currentUser) {
                    try {
                      const userRef = doc(db, 'users', currentUser.uid);
                      await updateDoc(userRef, {
                        soundSettings: {
                          appSound: appSoundEnabled,
                          notificationSound: notificationSoundEnabled,
                        },
                        updatedAt: new Date(),
                      });
                      
                      // Başarı mesajı göster
                      setProfileSuccess('Ses ayarları kaydedildi!');
                      setTimeout(() => {
                        setProfileSuccess('');
                      }, 2000);
                    } catch (error) {
                      console.error('Ses ayarları kaydedilirken hata:', error);
                    }
                  }
                }}
                style={{
                  backgroundColor: colors.accent,
                  borderRadius: 8,
                  padding: 15,
                  alignItems: 'center',
                  marginBottom: 20
                }}
              >
                <Text style={{ color: colors.accentText, fontWeight: 'bold', fontSize: 16 }}>
                  Ses Ayarlarını Kaydet
                </Text>
              </TouchableOpacity>

              {profileSuccess && (
                <Text style={{ color: colors.success, fontSize: 14, marginBottom: 15, textAlign: 'center' }}>
                  {profileSuccess}
                </Text>
              )}

              {/* Çıkış Yap */}
              {currentUser && (
                <TouchableOpacity
                  onPress={async () => {
                    try {
                      await signOut(auth);
                      setSettingsModal(false);
                    } catch (error) {
                      console.error('Çıkış yapılırken hata:', error);
                    }
                  }}
                  style={{
                    backgroundColor: colors.danger,
                    borderRadius: 8,
                    padding: 15,
                    alignItems: 'center',
                    marginBottom: 15
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }}>
                    Çıkış Yap
                  </Text>
                </TouchableOpacity>
              )}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setSettingsModal(false)}
              style={{
                backgroundColor: colors.border,
                borderRadius: 8,
                padding: 12,
                alignItems: 'center'
              }}
            >
              <Text style={{ color: colors.text, fontWeight: 'bold', fontSize: 16 }}>
                Kapat
              </Text>
            </TouchableOpacity>
          </View>
        </Modal>
        
        {/* Loading Overlay */}
        {isLoading && (
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}>
            <View style={{
              backgroundColor: colors.modal,
              borderRadius: 16,
              padding: 24,
              alignItems: 'center',
              shadowColor: colors.accent,
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 8
            }}>
              <Text style={{ color: colors.accent, fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
                Yükleniyor...
              </Text>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                borderWidth: 3,
                borderColor: colors.accent,
                borderTopColor: 'transparent'
              }} />
            </View>
          </View>
        )}
        
        {/* Bottom Tab Bar - Sabit */}
        <View style={[styles.bottomTabBar, { 
          backgroundColor: selectedTheme === 'dark' ? '#1a1a1a' : 'rgba(255,255,255,0.9)',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000
        }]}>
          <TouchableOpacity 
            style={[styles.tabItem, { backgroundColor: currentTab === 'home' ? colors.accent : 'transparent' }]} 
            onPress={() => setCurrentTab('home')}
          >
            <Ionicons 
              name="home" 
              size={24} 
              color={currentTab === 'home' ? colors.accentText : colors.accent} 
            />
            <Text style={[styles.tabText, { color: currentTab === 'home' ? colors.accentText : colors.accent }]}>
              Ana Sayfa
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabItem, { backgroundColor: currentTab === 'category' ? colors.accent : 'transparent' }]} 
            onPress={() => setCurrentTab('category')}
          >
            <Ionicons 
              name="grid" 
              size={24} 
              color={currentTab === 'category' ? colors.accentText : colors.accent} 
            />
            <Text style={[styles.tabText, { color: currentTab === 'category' ? colors.accentText : colors.accent }]}>
              Kategoriler
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabItem, { backgroundColor: currentTab === 'settings' ? colors.accent : 'transparent' }]} 
            onPress={() => setCurrentTab('settings')}
          >
            <Ionicons 
              name="settings" 
              size={24} 
              color={currentTab === 'settings' ? colors.accentText : colors.accent} 
            />
            <Text style={[styles.tabText, { color: currentTab === 'settings' ? colors.accentText : colors.accent }]}>
              Ayarlar
            </Text>
          </TouchableOpacity>
        </View>
        </ScrollView>
        </ImageBackground>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bottomTabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 12,
    backgroundColor: '#1a1a1a',
    borderTopWidth: 2,
    borderColor: '#D4AF37',
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
    shadowColor: '#D4AF37',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    paddingTop: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#D4AF37', // gold
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 70,
  },
  tabItem: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  tabText: {
    fontSize: 12,
    color: '#8C7853', // bronze
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#8C7853', // bronze
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    justifyContent: 'flex-start',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#D4AF37', // gold
  },
  modalButton: {
    backgroundColor: '#D4AF37', // gold
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
    color: '#8C7853', // bronze
  },
  modalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  closeButton: {
    marginTop: 8,
    padding: 8,
  },
  closeButtonText: {
    color: '#8C7853', // bronze
    fontSize: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D4AF37', // gold
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  errorText: {
    color: '#e74c3c',
    marginBottom: 8,
    textAlign: 'center',
  },
  successText: {
    color: '#D4AF37', // gold
    marginBottom: 8,
    textAlign: 'center',
  },
  inviteOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inviteContent: {
    width: '100%',
    minHeight: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#8C7853', // bronze
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    justifyContent: 'center',
  },
  categoryContent: {
    width: '100%',
    minHeight: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#8C7853', // bronze
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    justifyContent: 'center',
  },
  categoryGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categorySquare: {
    backgroundColor: '#D4AF37', // gold
    borderRadius: 12,
    width: 110,
    height: 110,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  categoryButtonText: {
    color: '#8C7853', // bronze
    fontSize: 20,
    fontWeight: 'bold',
  },
  inviteInfoContainer: {
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  inviteInfoBox: {
    marginTop: 8,
    alignItems: 'center',
    width: '100%',
  },
  inviteInfoTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#D4AF37', // gold
    marginBottom: 2,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  inviteInfoText: {
    fontSize: 12,
    color: '#8C7853', // bronze
    lineHeight: 16,
  },
  homeContainer: {
    flex: 1,
    width: '100%',
    minHeight: '100%',
    paddingHorizontal: 0,
    paddingBottom: 70,
    paddingTop: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    borderRadius: 14,
    width: '98%',
    height: 80,
    marginVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    shadowColor: '#8C7853', // bronze
    shadowOpacity: 0.04,
    shadowRadius: 3,
    alignSelf: 'center',
  },
  cardText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8C7853', // bronze
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 16,
    marginBottom: 16,
    minHeight: 60,
  },
  profileIcon: {
    padding: 2,
  },
  settingsSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37', // gold
    marginTop: 8,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  themeButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 18,
    gap: 12,
  },
  themeButtonLarge: {
    flex: 1,
    backgroundColor: '#D4AF37', // gold
    borderRadius: 10,
    paddingVertical: 18,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  themeButtonTextLarge: {
    color: '#8C7853', // bronze
    fontWeight: 'bold',
    fontSize: 16,
  },
  themeButtonActive: {
    backgroundColor: '#8C7853', // bronze
  },
  themeButtonTextActive: {
    color: '#D4AF37', // gold
  },
  blurOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30,30,30,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#D4AF37', // gold
    backgroundColor: '#fff',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },




  
  checkboxBoxChecked: {
    backgroundColor: '#8C7853', // bronze
    borderColor: '#8C7853', // bronze
  },
  rememberMeText: {
    fontSize: 14,
    color: '#8C7853', // bronze
  },
  welcomeBox: {
    backgroundColor: '#fff8e1', // very light gold
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  welcomeText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#D4AF37', // gold
    marginRight: 12,
  },
  logoutBtn: {
    backgroundColor: '#D4AF37', // gold
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  logoutBtnText: {
    color: '#8C7853', // bronze
    fontWeight: 'bold',
    fontSize: 14,
  },
  profileAvatarBox: {
    alignItems: 'center',
    marginBottom: 18,
  },
  profileAvatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff8e1', // very light gold
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginRight: 8,
  },
  fullScreen: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});