/**
 * Arabic dictionary. Keys are the original French source strings used in the
 * templates (see I18nService) — this file only needs to cover strings that are
 * actually wrapped with the `t` pipe somewhere in the client-facing app.
 */
export const ar: Record<string, string> = {
  // Navbar / sidebar
  Flotte: 'الأسطول',
  Tarifs: 'الأسعار',
  'Comment ça marche': 'كيف يعمل الموقع',
  Contact: 'اتصل بنا',
  Admin: 'الإدارة',
  'Ouvrir le menu': 'فتح القائمة',
  'Fermer le menu': 'إغلاق القائمة',
  Langue: 'اللغة',
  'Espace admin': 'فضاء الإدارة',

  // Hero
  'Réservation simple. Sans paperasse.': 'حجز بسيط. بدون إجراءات معقدة.',
  'Louez votre voiture, confirmez sur WhatsApp, prenez la route.':
    'استأجر سيارتك، أكّد الحجز عبر واتساب، وانطلق في الطريق.',
  "Choisissez votre véhicule, échangez avec notre équipe sur WhatsApp, et récupérez les clés à l'agence d'Aouina ou à l'aéroport Tunis-Carthage.":
    'اختر سيارتك، تواصل مع فريقنا عبر واتساب، واستلم المفاتيح من وكالتنا في أوينة أو من مطار تونس قرطاج.',
  Réserver: 'احجز',
  'Sans frais cachés': 'بدون رسوم خفية',
  'Annulation gratuite': 'إلغاء مجاني',
  'Assistance 7j/7 sur WhatsApp': 'مساعدة على واتساب طوال أيام الأسبوع',
  'Agence Dada Rent Car': 'وكالة دادا لتأجير السيارات',

  // Fleet
  'Toute la flotte, véhicule par véhicule': 'كامل الأسطول، سيارة سيارة',
  'Recherchez un modèle précis, ou laissez défiler pour découvrir toute la gamme.':
    'ابحث عن طراز محدد، أو تصفّح القائمة لاكتشاف كل التشكيلة.',
  'Rechercher un véhicule (ex : Clio, BMW, SUV...)': 'ابحث عن سيارة (مثال: كليو، BMW، SUV...)',
  disponibles: 'متوفرة',
  'Aucun véhicule ne correspond à': 'لا توجد سيارة مطابقة لـ',
  places: 'مقاعد',
  dès: 'ابتداءً من',
  '/ jour': '/ اليوم',
  'Choisissez votre catégorie': 'اختر فئتك',
  'De la citadine économique au véhicule de luxe, toute la flotte assurée.':
    'من السيارات الاقتصادية الصغيرة إلى سيارات الفخامة، كل الأسطول مؤمَّن.',

  // Fleet categories (static data — used as display labels, not identifiers)
  'Petite voiture': 'سيارة صغيرة',
  'Voiture standard': 'سيارة عادية',
  '7 Places': '7 مقاعد',
  'Pickup 4x4': 'بيك آب 4x4',
  Luxe: 'فخامة',
  '2ème Parc': 'الأسطول الثاني',
  Économique: 'اقتصادية',
  'Le plus choisi': 'الأكثر طلبًا',
  Confort: 'راحة',
  Familial: 'عائلية',
  'Petit budget': 'ميزانية صغيرة',
  Manuelle: 'يدوي',
  Automatique: 'أوتوماتيكي',
  'dès 79 DT': 'ابتداءً من 79 دينار',
  'dès 75 DT': 'ابتداءً من 75 دينار',
  'dès 220 DT': 'ابتداءً من 220 دينار',
  'dès 308 DT': 'ابتداءً من 308 دينار',
  'nous consulter': 'اتصل بنا للسعر',

  // How it works
  'Trois étapes vous séparent de la route.': 'ثلاث خطوات فقط تفصلك عن الطريق.',
  'Choisissez votre véhicule': 'اختر سيارتك',
  'Confirmez sur WhatsApp': 'أكّد عبر واتساب',
  'Récupérez les clés': 'استلم المفاتيح',
  'Parcourez la flotte et filtrez par catégorie, transmission ou budget.':
    'تصفّح الأسطول وصفِّ النتائج حسب الفئة أو ناقل الحركة أو الميزانية.',
  'Échangez avec notre équipe, indiquez vos dates, confirmation immédiate.':
    'تواصل مع فريقنا، حدّد تواريخك، واحصل على تأكيد فوري.',
  "Retrait à l'agence d'Aouina ou livraison à l'aéroport Tunis-Carthage.":
    'الاستلام من وكالتنا في أوينة أو التوصيل إلى مطار تونس قرطاج.',

  // Pricing
  'Un tarif dégressif selon la durée': 'سعر تنازلي حسب مدة الحجز',
  'Le prix par jour dépend de la catégorie choisie (voir la flotte ci-dessus) et diminue avec la durée de location.':
    'يعتمد السعر اليومي على الفئة المختارة (انظر الأسطول أعلاه) وينخفض مع طول مدة الإيجار.',
  '1 à 6 jours': '1 إلى 6 أيام',
  '7 jours': '7 أيام',
  '30 jours': '30 يومًا',
  'Idéal pour un court séjour ou un besoin ponctuel.': 'مثالي لإقامة قصيرة أو حاجة عابرة.',
  'Le palier le plus réservé par nos clients.': 'الفئة الأكثر حجزًا من قبل عملائنا.',
  'Idéal pour un long séjour ou un besoin professionnel.': 'مثالي لإقامة طويلة أو حاجة مهنية.',
  'Tarif réduit': 'سعر مخفّض',
  '-12 %': '-12%',
  'Tarif journalier standard': 'السعر اليومي العادي',
  "Retrait à l'agence ou à l'aéroport": 'الاستلام من الوكالة أو من المطار',
  'Tarif dégressif appliqué automatiquement': 'سعر تنازلي يُطبَّق تلقائيًا',
  'Option chauffeur disponible': 'خيار السائق متوفر',
  'Caution remboursable en fin de location': 'تأمين قابل للاسترجاع في نهاية الإيجار',
  'Acompte de 30 % à la réservation': 'دفعة أولى 30% عند الحجز',
  '-12 % par rapport au tarif standard': 'خصم 12% مقارنة بالسعر العادي',
  'Le meilleur tarif journalier': 'أفضل سعر يومي',
  'Voir les véhicules': 'عرض السيارات',

  // Airport transfer
  'Aéroport Tunis-Carthage': 'مطار تونس قرطاج',
  'Vous arrivez en avion ? On vous attend avec les clés.': 'قادم عبر الطائرة؟ نحن في انتظارك بالمفاتيح.',
  'Indiquez votre vol, on livère votre voiture directement au terminal — sans détour par l\'agence.':
    'أرسل لنا تفاصيل رحلتك، ونوصّل سيارتك مباشرة إلى صالة المطار — دون المرور بالوكالة.',
  'Réserver un transfert': 'احجز خدمة النقل',
  "Livraison à l'aéroport Tunis-Carthage": 'التوصيل إلى مطار تونس قرطاج',

  // Why us
  'Une agence réelle, pas juste une appli': 'وكالة حقيقية، وليست مجرد تطبيق',
  'À Aouina, Tunis —': 'في أوينة، تونس —',
  'Agence à Aouina, Tunis': 'وكالة في أوينة، تونس',
  'Disponible 7j/7': 'متوفرون طوال أيام الأسبوع',
  'Réponse rapide sur WhatsApp': 'رد سريع عبر واتساب',
  "Retrait ou restitution directement à notre agence, ou livraison à votre hôtel et à l'aéroport.":
    'الاستلام أو الإرجاع مباشرة في وكالتنا، أو التوصيل إلى فندقك أو المطار.',
  'Notre équipe répond de 8h00 à 22h00, tous les jours de la semaine.':
    'يرد فريقنا من الساعة 8:00 صباحًا إلى 22:00 مساءً، طوال أيام الأسبوع.',
  "Un conseiller vous répond directement pour confirmer votre réservation, pas de robot.":
    'يرد عليك مستشار حقيقي مباشرة لتأكيد حجزك، بدون روبوت.',
  'Agence Dada Rent Car à Aouina, Tunis': 'وكالة دادا لتأجير السيارات في أوينة، تونس',

  // CTA banner
  'Prêt à prendre la route ?': 'مستعد لتنطلق في الطريق؟',
  'Envoyez-nous vos dates sur WhatsApp et recevez une confirmation en quelques minutes.':
    'أرسل لنا تواريخك عبر واتساب واحصل على تأكيد خلال دقائق.',
  'Réserver sur WhatsApp': 'احجز عبر واتساب',
  'Voir la flotte': 'عرض الأسطول',

  // Location / contact
  'Où nous trouver': 'أين تجدنا',
  "Notre agence est ouverte 7j/7, en plein cœur d'Aouina.": 'وكالتنا مفتوحة طوال أيام الأسبوع، في قلب أوينة.',
  Adresse: 'العنوان',
  Horaires: 'ساعات العمل',
  Téléphone: 'الهاتف',
  Itinéraire: 'احصل على الاتجاهات',
  'Localisation Dada Rent Car — Aouina, Tunis': 'موقع وكالة دادا لتأجير السيارات — أوينة، تونس',

  // Footer
  'Location de voitures à Tunis. Réservez votre véhicule sur WhatsApp et prenez la route.':
    'تأجير سيارات في تونس. احجز سيارتك عبر واتساب وانطلق في الطريق.',
  Entreprise: 'الشركة',
  Accueil: 'الرئيسية',
  'Dada Rent Car — une marque FaceMoney.': 'دادا لتأجير السيارات — علامة تابعة لـ FaceMoney.',
  Confidentialité: 'الخصوصية',
  Conditions: 'الشروط',

  // Booking modal
  Fermer: 'إغلاق',
  'Réservation rapide': 'حجز سريع',
  'Réservez votre voiture': 'احجز سيارتك',
  'Choisissez votre véhicule et vos dates, on confirme le reste avec vous sur WhatsApp.':
    'اختر سيارتك وتواريخك، ونتكفّل بالباقي معك عبر واتساب.',
  Véhicule: 'السيارة',
  Changer: 'تغيير',
  'Nom complet *': 'الاسم الكامل *',
  'Votre nom': 'اسمك',
  'Téléphone *': 'الهاتف *',
  'Date de départ': 'تاريخ الانطلاق',
  'Date de retour': 'تاريخ الإرجاع',
  'Code promo': 'رمز ترويجي',
  optionnel: 'اختياري',
  'Envoi en cours...': 'جارٍ الإرسال...',
};
