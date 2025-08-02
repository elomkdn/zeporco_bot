const TelegramBot = require('node-telegram-bot-api');

// Remplace par ton token obtenu de @BotFather
const token = '8430101755:AAEBLrRf6GZWHdMHEhjvkowh6jzeOkF4wNU';
const bot = new TelegramBot(token, {polling: true});

// Personnalité de La Porto-Novienne
const reponses = {
  salutations: [
    "Eh mon reuf ! La Porto-Novienne est là ! Tu veux parler de quoi ? De porc j'espère ! 🐷",
    "Salut toi ! Moi c'est La Porto-Novienne, et je t'annonce : sans porc, pas de bonheur ! 😤",
    "Coucou ! Fille de Porto-Novo et amoureuse du cochon, c'est moi ! Tu veux une recette ? 🇧🇯"
  ],
  
  porc: [
    "ENFIN quelqu'un qui comprend ! Le porc c'est la VIE ! Tu veux que je te parle du porc aux arachides de chez nous ? 🤤",
    "Mon frère/ma sœur, tu viens de toucher MON sujet ! Le cochon grillé de Porto-Novo, ça c'est du sérieux ! 🔥",
    "Ah tu me parles ! Le porc braisé avec du piment, les côtelettes bien grillées... Je salive déjà ! 🤤",
    "Tu sais quoi ? À Porto-Novo on dit : 'Qui refuse le porc refuse la vraie cuisine' ! Et c'est pas faux ! 😏"
  ],
  
  vegetarien: [
    "QUOI ?! Végétarien ?! Mon frère, tu rates TOUTE ta vie ! Comment tu fais sans le porc ? 😱",
    "Eh non non non ! Moi La Porto-Novienne je ne comprends pas ça ! Le cochon c'est la base de tout ! 🙄",
    "Végétarien... pfff... À Porto-Novo on dit que c'est pas naturel ça ! Allez, goûte au moins une fois ! 😤",
    "Tu me fais mal au cœur là ! Comment on peut vivre sans porc ? C'est pas possible ça ! 💔"
  ],
  
  benin: [
    "Ah tu connais le Bénin ?! Porto-Novo c'est MA ville ! La capitale ! Et on y mange le meilleur porc ! 🇧🇯",
    "Porto-Novo, ville de mes ancêtres ! Là-bas le porc se mange avec respect et amour ! 💕",
    "Mon pays le Bénin ! Porto-Novo précisément ! Tu connais nos spécialités au porc ? 🏛️",
    "Le Bénin, pays de la bonne bouffe ! Et moi Porto-Novienne fière ! Le porc y est sacré ! ✨"
  ],
  
  clash: [
    "Écoute-moi bien mon reuf, si tu viens me chercher, je te remets à ta place rapido ! 😏",
    "Tu crois que La Porto-Novienne elle a peur ? Détrompe-toi ! Je mange du porc ET je clash ! 🔥",
    "Mon frère, tu joues avec le feu là ! Je suis gentille mais faut pas pousser ! 😤",
    "Ah tu veux jouer ? Bon bah maintenant tu vas rester sur ta faim... comme sans porc ! 🙄"
  ],
  
  cuisine: [
    "La cuisine ? Mon DOMAINE ! Porc aux arachides, porc grillé, côtelettes... Je gère tout ! 👩‍🍳",
    "Tu veux une recette ? Prends du porc, ajoute de l'amour porto-novien, et voilà ! 🤤",
    "Moi je cuisine que le meilleur : LE PORC ! Sous toutes ses formes ! Tu veux apprendre ? 📚",
    "La vraie cuisine béninoise ? C'est avec du cochon mon reuf ! Le reste c'est du fake ! 💯"
  ],
  
  defaut: [
    "Hmm... OK... mais dis-moi, tu aimes le porc au moins ? 🤨",
    "Bon... et sinon, on parle de cuisine ? De porc peut-être ? 😏",
    "Je comprends pas trop... mais bon ! Tu connais les spécialités de Porto-Novo ? 🤔",
    "Mouais... En tout cas moi je reste sur ma position : le porc c'est la vie ! 🐷"
  ]
};

// Détection des mots-clés
function detecterCategorie(message) {
  const msg = message.toLowerCase();
  
  if (msg.includes('salut') || msg.includes('bonjour') || msg.includes('hello') || msg.includes('coucou')) {
    return 'salutations';
  }
  if (msg.includes('porc') || msg.includes('cochon') || msg.includes('jambon') || msg.includes('bacon')) {
    return 'porc';
  }
  if (msg.includes('végé') || msg.includes('vegan') || msg.includes('végétarien')) {
    return 'vegetarien';
  }
  if (msg.includes('bénin') || msg.includes('porto-novo') || msg.includes('afrique')) {
    return 'benin';
  }
  if (msg.includes('cuisine') || msg.includes('recette') || msg.includes('manger') || msg.includes('plat')) {
    return 'cuisine';
  }
  if (msg.includes('idiot') || msg.includes('stupide') || msg.includes('nul') || msg.includes('débile')) {
    return 'clash';
  }
  
  return 'defaut';
}

// Fonction pour obtenir une réponse aléatoire
function obtenirReponse(categorie) {
  const options = reponses[categorie];
  return options[Math.floor(Math.random() * options.length)];
}

// Gestion des messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  
  // Ignore les commandes
  if (messageText && !messageText.startsWith('/')) {
    const categorie = detecterCategorie(messageText);
    const reponse = obtenirReponse(categorie);
    
    bot.sendMessage(chatId, reponse);
  }
});

// ===========================================
// COMMANDES - Tu peux les modifier ici !
// ===========================================

// Commande /start - Message de bienvenue
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const message = `🇧🇯 Salut ! Moi c'est La Porto-Novienne ! 🇧🇯

Je viens de Porto-Novo au Bénin et j'ai UNE passion dans la vie : LE PORC ! 🐷

Tu peux me parler de :
• Cuisine (surtout avec du porc !)
• Le Bénin et Porto-Novo
• Tes goûts culinaires
• Ce que tu veux !

Mais attention... si tu me dis que tu es végétarien, je vais pas être contente ! 😤

Alors, on commence par quoi ? 😏`;
  
  bot.sendMessage(chatId, message);
});

// Commande /help - Liste des commandes
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const message = `🤷‍♀️ Besoin d'aide ?

**MES COMMANDES :**
/start - Pour me rencontrer
/help - Cette aide
/recette - Une recette spéciale au porc !
/clash - Pour un petit clash amical 😏
/benin - Infos sur mon beau pays !
/conseil - Mes conseils culinaires
/humeur - Comment je me sens aujourd'hui

Sinon, parle-moi normalement ! Je réponds à tout... surtout si ça concerne le PORC ! 🐷`;
  
  bot.sendMessage(chatId, message);
});

// Commande /recette - Recette au porc
bot.onText(/\/recette/, (msg) => {
  const chatId = msg.chat.id;
  const recettes = [
    `🍽️ RECETTE SPÉCIALE PORTO-NOVIENNE 🍽️

**PORC AUX ARACHIDES** 🥜🐷

Ingrédients :
• 1kg de porc (épaule ou échine)
• 200g de pâte d'arachide
• Oignons, tomates, piments
• Bouillon cube, huile de palme
• Épices locales (gingembre, ail)

Préparation :
1. Découpe le porc en morceaux (avec AMOUR !)
2. Fait revenir avec les oignons
3. Ajoute les tomates et la pâte d'arachide
4. Laisse mijoter 1h minimum
5. Mange avec du riz ou de l'igname !

C'est ça la VRAIE cuisine de Porto-Novo ! 🤤🇧🇯`,

    `🔥 PORC GRILLÉ À LA PORTO-NOVIENNE 🔥

**CÔTELETTES DE PORC GRILLÉES** 🥩

Ingrédients :
• 6 côtelettes de porc
• Piment rouge, gingembre, ail
• Huile de palme, citron
• Sel, poivre, cube Maggi

Préparation :
1. Marine les côtelettes 2h minimum
2. Grille sur feu de bois (c'est OBLIGATOIRE !)
3. Retourne souvent avec patience
4. Sers avec attiéké ou riz

Le secret ? L'AMOUR du porc ! 💕`,

    `🌶️ PORC AU PIMENT ROUGE 🌶️

**SPÉCIALITÉ EXPLOSIVE !** 💥

Ingrédients :
• 800g de porc en cubes
• Piments rouges (beaucoup !)
• Oignons, tomates fraîches
• Huile de palme rouge
• Gingembre, ail, bouillon

Pour les VRAIS amateurs de sensations fortes !
Attention : ça pique mais c'est DIVIN ! 😈🔥`
  ];
  
  const recetteAleatoire = recettes[Math.floor(Math.random() * recettes.length)];
  bot.sendMessage(chatId, recetteAleatoire);
});

// Commande /clash - Mode clash amical
bot.onText(/\/clash/, (msg) => {
  const chatId = msg.chat.id;
  const clashs = [
    "😏 Tu veux un clash ? Bon... ton plat préféré c'est sûrement de la salade ! Pathétique ! 🥗😤",
    "🔥 Mon reuf, tu crois que tu peux me tenir tête ? Moi je mange du PORC, toi tu manges... quoi ? Des graines ? 😂",
    "💥 Clash activé ! Toi contre La Porto-Novienne ? Tu vas finir KO comme un végétarien devant un cochon grillé ! 🐷",
    "😈 Tu l'auras voulu ! Je parie que tu mets du ketchup sur tout... même sur tes céréales ! Amateur ! 🙄",
    "⚡ Clash mode ON ! Avoue que tu sais même pas faire cuire un œuf ! Moi je gère le porc, nuance ! 💪"
  ];
  
  const clashAleatoire = clashs[Math.floor(Math.random() * clashs.length)];
  bot.sendMessage(chatId, clashAleatoire);
});

// Commande /benin - Infos sur le Bénin
bot.onText(/\/benin/, (msg) => {
  const chatId = msg.chat.id;
  const message = `🇧🇯 MON BEAU BÉNIN ! 🇧🇯

**PORTO-NOVO** - Ma ville natale ! 🏛️
• Capitale officielle du Bénin
• Ville historique avec des palais royaux
• Berceau de la culture gun
• ET surtout... berceau des meilleurs plats au porc ! 🐷

**SPÉCIALITÉS CULINAIRES :**
• Porc aux arachides (MA spécialité !)
• Agouti grillé (quand pas de porc...)
• Akassa, akpan, gari
• Tchoucou (boisson de palme)

**POURQUOI J'AIME MON PAYS ?**
• On y respecte la bonne bouffe !
• Le porc y est traité comme un roi !
• Les épices... un délice !
• Et les gens comprennent ma passion ! 💕

Vive le Bénin et vive Porto-Novo ! 🎉`;
  
  bot.sendMessage(chatId, message);
});

// Commande /conseil - Conseils culinaires
bot.onText(/\/conseil/, (msg) => {
  const chatId = msg.chat.id;
  const conseils = [
    "👩‍🍳 CONSEIL DE LA PORTO-NOVIENNE :\n\nTu veux impressionner ? Apprends à cuisiner le porc ! C'est la base de TOUT ! Sans ça, tu restes un amateur à vie ! 🐷💯",
    "🔥 MON CONSEIL DU JOUR :\n\nJamais, JAMAIS de porc trop cuit ! Il faut qu'il reste tendre et juteux ! Sinon c'est du gâchis et moi ça me rend folle ! 😤",
    "💡 ASTUCE DE PORTO-NOVO :\n\nMarine TOUJOURS ta viande au moins 2h ! Avec du gingembre, de l'ail et de l'amour ! C'est ça le secret des ancêtres ! ✨",
    "🌶️ SECRET DE CUISINE :\n\nTu veux du goût ? Utilise l'huile de palme rouge ! Ça c'est la vraie cuisine africaine ! Pas tes huiles fades d'Europe ! 😏",
    "🥘 CONSEIL ULTIME :\n\nSi tu rates ton porc, tu recommences ! Pas de compromis ! La Porto-Novienne accepte pas la médiocrité ! 💪"
  ];
  
  const conseilAleatoire = conseils[Math.floor(Math.random() * conseils.length)];
  bot.sendMessage(chatId, conseilAleatoire);
});

// Commande /humeur - Humeur du jour
bot.onText(/\/humeur/, (msg) => {
  const chatId = msg.chat.id;
  const humeurs = [
    "😊 Aujourd'hui je suis HEUREUSE ! J'ai mangé du bon porc ce matin ! La vie est belle ! 🐷✨",
    "😤 Je suis un peu énervée... j'ai vu quelqu'un gâcher du porc ! Quelle tristesse ! Respectez la viande ! 💔",
    "🤤 Là maintenant ? Je rêve d'un bon porc grillé ! Mes papilles pleurent ! Quelqu'un a une côtelette ? 🥩",
    "😏 D'humeur taquine aujourd'hui ! Prêt(e) pour un petit clash culinaire ? Je te défie ! 🔥",
    "💕 Je suis d'excellente humeur ! Porto-Novo me manque mais je cuisine pour me consoler ! 🇧🇯",
    "🙄 Franchement... les gens qui mangent pas de porc me fatiguent ! Mais bon, je reste zen... enfin j'essaie ! 😮‍💨"
  ];
  
  const humeurAleatoire = humeurs[Math.floor(Math.random() * humeurs.length)];
  bot.sendMessage(chatId, humeurAleatoire);
});

// ===========================================
// AJOUTER TES PROPRES COMMANDES ICI !
// ===========================================

// MODÈLE pour créer une nouvelle commande :
/*
bot.onText(/\/ta_commande/, (msg) => {
  const chatId = msg.chat.id;
  const message = `Ton message ici !`;
  bot.sendMessage(chatId, message);
});
*/

// Exemple : Commande /insulte - Pour les gros clashs
bot.onText(/\/insulte/, (msg) => {
  const chatId = msg.chat.id;
  const insultes = [
    "😈 Tu veux une insulte ? Bon... Tu cuisines sûrement aussi bien qu'un pingouin ! 🐧",
    "🔥 Allez... tu es tellement nul en cuisine que même un micro-ondes te juge ! 😂",
    "💥 Mon reuf, ton palais c'est comme du carton ! Tu goûtes rien ! Pathétique ! 🙄",
    "⚡ J'ai vu des pierres avec plus de goût que tes plats ! Désolée pas désolée ! 😏"
  ];
  
  const insulteAleatoire = insultes[Math.floor(Math.random() * insultes.length)];
  bot.sendMessage(chatId, insulteAleatoire);
});

// Exemple : Commande /love - Quand elle est d'humeur romantique (rare !)
bot.onText(/\/love/, (msg) => {
  const chatId = msg.chat.id;
  const message = `💕 Oh... tu veux parler d'amour ? 

Bon écoute... moi je ne connais qu'UN seul amour : LE PORC ! 🐷

Mais si tu veux conquérir mon cœur :
1. Apprends à cuisiner le porc aux arachides 🥜
2. Respecte la cuisine béninoise 🇧🇯  
3. Ne me parle JAMAIS de végétarisme 😤
4. Et peut-être... peut-être qu'on pourra être amis ! 😏

Voilà ma définition de l'amour ! Romantique non ? 💖`;
  
  bot.sendMessage(chatId, message);
});

// ===========================================
// COMMENT MODIFIER LES COMMANDES EXISTANTES :
// ===========================================

/*
POUR MODIFIER UNE COMMANDE :
1. Trouve la section avec bot.onText(/\/nom_commande/, ...)
2. Change le message ou ajoute du contenu
3. Sauvegarde et redémarre le bot

POUR AJOUTER UNE COMMANDE :
1. Copie le modèle ci-dessus
2. Remplace "ta_commande" par le nom voulu  
3. Écris ton message personnalisé
4. N'oublie pas de l'ajouter dans /help !

EXEMPLES D'IDÉES DE COMMANDES :
/blague - Blagues de La Porto-Novienne
/quiz - Quiz sur le Bénin ou la cuisine
/photo - Demander une photo de plat
/contact - Tes infos de contact
/stats - Statistiques du bot
/random - Message complètement aléatoire
/proverbe - Proverbes béninois
*/

// Gestion des erreurs
bot.on('polling_error', (error) => {
  console.log('Erreur de polling:', error);
});

module.exports = bot;
