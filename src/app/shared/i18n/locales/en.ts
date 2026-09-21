/**
 * English dictionary. Keys are the original French source strings used in the
 * templates (see I18nService) — this file only needs to cover strings that are
 * actually wrapped with the `t` pipe somewhere in the client-facing app.
 */
export const en: Record<string, string> = {
  // Navbar / sidebar
  Flotte: 'Fleet',
  Tarifs: 'Pricing',
  'Comment ça marche': 'How it works',
  Contact: 'Contact',
  Admin: 'Admin',
  'Ouvrir le menu': 'Open menu',
  'Fermer le menu': 'Close menu',
  Langue: 'Language',
  'Espace admin': 'Admin area',

  // Hero
  'Réservation simple. Sans paperasse.': 'Simple booking. No paperwork.',
  'Louez votre voiture, confirmez sur WhatsApp, prenez la route.':
    'Rent your car, confirm on WhatsApp, hit the road.',
  "Choisissez votre véhicule, échangez avec notre équipe sur WhatsApp, et récupérez les clés à l'agence d'Aouina ou à l'aéroport Tunis-Carthage.":
    'Choose your vehicle, chat with our team on WhatsApp, and pick up the keys at our Aouina agency or at Tunis-Carthage airport.',
  Réserver: 'Book',
  'Sans frais cachés': 'No hidden fees',
  'Annulation gratuite': 'Free cancellation',
  'Assistance 7j/7 sur WhatsApp': 'Support 7 days a week on WhatsApp',
  'Agence Dada Rent Car': 'Dada Rent Car agency',

  // Fleet
  'Toute la flotte, véhicule par véhicule': 'Our whole fleet, vehicle by vehicle',
  'Recherchez un modèle précis, ou laissez défiler pour découvrir toute la gamme.':
    'Search for a specific model, or scroll to browse the whole range.',
  'Rechercher un véhicule (ex : Clio, BMW, SUV...)': 'Search for a vehicle (e.g. Clio, BMW, SUV...)',
  disponibles: 'available',
  'Aucun véhicule ne correspond à': 'No vehicle matches',
  places: 'seats',
  dès: 'from',
  '/ jour': '/ day',
  'Choisissez votre catégorie': 'Choose your category',
  'De la citadine économique au véhicule de luxe, toute la flotte assurée.':
    'From economy hatchbacks to luxury cars, the whole fleet is insured.',

  // Fleet categories (static data — used as display labels, not identifiers)
  'Petite voiture': 'Small car',
  'Voiture standard': 'Standard car',
  '7 Places': '7 Seats',
  'Pickup 4x4': '4x4 Pickup',
  Luxe: 'Luxury',
  '2ème Parc': '2nd fleet',
  Économique: 'Economy',
  'Le plus choisi': 'Most popular',
  Confort: 'Comfort',
  Familial: 'Family',
  'Petit budget': 'Small budget',
  Manuelle: 'Manual',
  Automatique: 'Automatic',
  'dès 79 DT': 'from 79 DT',
  'dès 75 DT': 'from 75 DT',
  'dès 220 DT': 'from 220 DT',
  'dès 308 DT': 'from 308 DT',
  'nous consulter': 'contact us',

  // How it works
  'Trois étapes vous séparent de la route.': "You're three steps away from the road.",
  'Choisissez votre véhicule': 'Choose your vehicle',
  'Confirmez sur WhatsApp': 'Confirm on WhatsApp',
  'Récupérez les clés': 'Pick up the keys',
  'Parcourez la flotte et filtrez par catégorie, transmission ou budget.':
    'Browse the fleet and filter by category, transmission or budget.',
  'Échangez avec notre équipe, indiquez vos dates, confirmation immédiate.':
    'Chat with our team, share your dates, get instant confirmation.',
  "Retrait à l'agence d'Aouina ou livraison à l'aéroport Tunis-Carthage.":
    'Pick-up at our Aouina agency or delivery at Tunis-Carthage airport.',

  // Pricing
  'Un tarif dégressif selon la durée': 'Rates that drop the longer you rent',
  'Le prix par jour dépend de la catégorie choisie (voir la flotte ci-dessus) et diminue avec la durée de location.':
    'The daily rate depends on the category you choose (see the fleet above) and decreases with the rental duration.',
  '1 à 6 jours': '1 to 6 days',
  '7 jours': '7 days',
  '30 jours': '30 days',
  'Idéal pour un court séjour ou un besoin ponctuel.': 'Ideal for a short stay or a one-off need.',
  'Le palier le plus réservé par nos clients.': "Our clients' most booked tier.",
  'Idéal pour un long séjour ou un besoin professionnel.': 'Ideal for a long stay or a professional need.',
  'Tarif réduit': 'Reduced rate',
  '-12 %': '-12%',
  'Tarif journalier standard': 'Standard daily rate',
  "Retrait à l'agence ou à l'aéroport": 'Pick-up at the agency or at the airport',
  'Tarif dégressif appliqué automatiquement': 'Tapered rate applied automatically',
  'Option chauffeur disponible': 'Driver option available',
  'Caution remboursable en fin de location': 'Refundable deposit at the end of the rental',
  'Acompte de 30 % à la réservation': '30% deposit on booking',
  '-12 % par rapport au tarif standard': '-12% compared to the standard rate',
  'Le meilleur tarif journalier': 'The best daily rate',
  'Voir les véhicules': 'View the vehicles',

  // Airport transfer
  'Aéroport Tunis-Carthage': 'Tunis-Carthage Airport',
  'Vous arrivez en avion ? On vous attend avec les clés.': "Flying in? We'll be waiting with the keys.",
  'Indiquez votre vol, on livère votre voiture directement au terminal — sans détour par l\'agence.':
    "Give us your flight details and we'll deliver your car straight to the terminal — no detour via the agency.",
  'Réserver un transfert': 'Book a transfer',
  "Livraison à l'aéroport Tunis-Carthage": 'Delivery at Tunis-Carthage airport',

  // Why us
  'Une agence réelle, pas juste une appli': 'A real agency, not just an app',
  'À Aouina, Tunis —': 'In Aouina, Tunis —',
  'Agence à Aouina, Tunis': 'Agency in Aouina, Tunis',
  'Disponible 7j/7': 'Open 7 days a week',
  'Réponse rapide sur WhatsApp': 'Fast response on WhatsApp',
  "Retrait ou restitution directement à notre agence, ou livraison à votre hôtel et à l'aéroport.":
    'Pick-up or drop-off directly at our agency, or delivery to your hotel or the airport.',
  'Notre équipe répond de 8h00 à 22h00, tous les jours de la semaine.':
    'Our team answers from 8am to 10pm, every day of the week.',
  "Un conseiller vous répond directement pour confirmer votre réservation, pas de robot.":
    'An agent replies directly to confirm your booking — no bots.',
  'Agence Dada Rent Car à Aouina, Tunis': 'Dada Rent Car agency in Aouina, Tunis',

  // CTA banner
  'Prêt à prendre la route ?': 'Ready to hit the road?',
  'Envoyez-nous vos dates sur WhatsApp et recevez une confirmation en quelques minutes.':
    'Send us your dates on WhatsApp and get a confirmation within minutes.',
  'Réserver sur WhatsApp': 'Book on WhatsApp',
  'Voir la flotte': 'View the fleet',

  // Location / contact
  'Où nous trouver': 'Find us',
  "Notre agence est ouverte 7j/7, en plein cœur d'Aouina.": 'Our agency is open 7 days a week, right in the heart of Aouina.',
  Adresse: 'Address',
  Horaires: 'Hours',
  Téléphone: 'Phone',
  Itinéraire: 'Get directions',
  'Localisation Dada Rent Car — Aouina, Tunis': 'Dada Rent Car location — Aouina, Tunis',

  // Footer
  'Location de voitures à Tunis. Réservez votre véhicule sur WhatsApp et prenez la route.':
    'Car rental in Tunis. Book your vehicle on WhatsApp and hit the road.',
  Entreprise: 'Company',
  Accueil: 'Home',
  'Dada Rent Car — une marque FaceMoney.': 'Dada Rent Car — a FaceMoney brand.',
  Confidentialité: 'Privacy',
  Conditions: 'Terms',

  // Promo banner
  "À découvrir : le tableau des tarifs d'aujourd'hui": "Check it out: today's price table",
  'Réductions dégressives jusqu\'à -12 % selon la durée': 'Tapered discounts of up to -12% depending on duration',
  Découvrir: 'Discover',

  // Tarifs du jour page
  "Retour à l'accueil": 'Back to home',
  'Tarifs de toute la flotte': 'Prices for the whole fleet',
  "Aujourd'hui": 'Today',
  'Le prix par jour diminue automatiquement selon la durée choisie — sans code promo à demander.':
    'The daily rate drops automatically based on the duration you choose — no promo code needed.',
  'Luxe, 4x4 & 7 places': 'Luxury, 4x4 & 7 seats',
  'Standard, 4x4 & 7 places': 'Standard, 4x4 & 7 seats',
  'Aucun véhicule disponible pour le moment.': 'No vehicle available right now.',
  '3 jours': '3 days',
  '10 jours': '10 days',
  '15 jours': '15 days',
  'Assurance tous risques incluse': 'Full insurance included',
  'Livraison aéroport 24h/24': 'Airport delivery 24/7',
  'Assistance 7j/7': 'Support 7 days a week',
  'Carburant selon le niveau au retrait': 'Fuel as per pick-up level',
  'Voir tous les véhicules': 'View all vehicles',

  // Booking modal
  Fermer: 'Close',
  'Réservation rapide': 'Quick booking',
  'Réservez votre voiture': 'Book your car',
  'Choisissez votre véhicule et vos dates, on confirme le reste avec vous sur WhatsApp.':
    "Choose your vehicle and dates, we'll confirm the rest with you on WhatsApp.",
  Véhicule: 'Vehicle',
  Changer: 'Change',
  'Nom complet *': 'Full name *',
  'Votre nom': 'Your name',
  'Téléphone *': 'Phone *',
  'Date de départ': 'Pick-up date',
  'Date de retour': 'Return date',
  'Code promo': 'Promo code',
  optionnel: 'optional',
  'Envoi en cours...': 'Sending...',
};
