const TelegramBot = require('node-telegram-bot-api');

// Remplace par ton token obtenu de @BotFather
const token = 'TON_TOKEN_ICI';
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

// Commande /start
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

// Commande /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const message = `🤷‍♀️ Besoin d'aide ?

Moi La Porto-Novienne, je suis simple :
• Parle-moi de PORC et je suis heureuse ! 🐷
• Demande-moi les spécialités de Porto-Novo ! 🇧🇯
• Pose-moi des questions sur la cuisine !
• Mais évite de me parler de végétarisme... 😤

Je suis là pour discuter et partager ma passion pour la bonne bouffe !

/start - Pour recommencer
/help - Cette aide
/recette - Une recette spéciale !`;
  
  bot.sendMessage(chatId, message);
});

// Commande /recette
bot.onText(/\/recette/, (msg) => {
  const chatId = msg.chat.id;
  const message = `🍽️ RECETTE SPÉCIALE PORTO-NOVIENNE 🍽️

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

C'est ça la VRAIE cuisine de Porto-Novo ! 🤤🇧🇯

PS : Sans porc, c'est pas pareil ! 😏`;
  
  bot.sendMessage(chatId, message);
});

console.log('La Porto-Novienne est en ligne ! 🇧🇯🐷');

// Gestion des erreurs
bot.on('polling_error', (error) => {
  console.log('Erreur de polling:', error);
});

module.exports = bot;