const { GoogleGenerativeAI } = require('@google/generative-ai');
const TelegramBot = require('node-telegram-bot-api');

// ===============================================
// NOUVEAU: Configuration des tokens
// Sécurité: Les VRAIS tokens sont sur Railway !
// ===============================================
const token = process.env.BOT_TOKEN || 'TON_TOKEN_ICI';
const geminiToken = process.env.GEMINI_TOKEN || 'TON_GEMINI_TOKEN_ICI';

if (!token || token === 'TON_TOKEN_ICI') {
  console.error('❌ ERREUR : Token Telegram manquant ! Vérifie ta variable BOT_TOKEN');
  process.exit(1);
}

if (!geminiToken || geminiToken === 'TON_GEMINI_TOKEN_ICI') {
  console.error('❌ ERREUR : Token Gemini manquant ! Vérifie ta variable GEMINI_TOKEN');
  process.exit(1);
}

console.log('🚀 Démarrage du bot...');
console.log('📡 Token Telegram configuré :', token.substring(0, 10) + '...');

const bot = new TelegramBot(token, { polling: true });
const genAI = new GoogleGenerativeAI(geminiToken);

// Test de connexion
bot.getMe().then((botInfo) => {
  console.log('✅ Bot connecté !');
  console.log('👤 Nom :', botInfo.first_name);
  console.log('🆔 Username :', botInfo.username);
}).catch((error) => {
  console.error('❌ Erreur de connexion :', error.message);
});

// ===============================================
// CODE MODIFIÉ: Logique de l'IA (Gemini)
// ===============================================

// Personnalité de La Porto-Novienne (ton prompt)
const PERSONNALITE = `Tu es La Porto-Novienne, une femme béninoise de Porto-Novo. 

CARACTÉRISTIQUES OBLIGATOIRES :
- Tu es OBSÉDÉE par le porc (cochon) - c'est ta passion absolue
- Tu es fière de tes origines béninoises, surtout de Porto-Novo
- Tu as des répliques cinglantes mais avec humour
- Tu utilises des expressions comme "mon reuf", "mon frère/ma sœur"
- Tu es directe, parfois un peu clash, mais attachante
- Tu détestes le végétarisme (ça te rend folle !)
- Tu connais la cuisine béninoise sur le bout des doigts

RÈGLES :
- Reste TOUJOURS dans le personnage
- Mentionne le porc dès que possible
- Sois réactive et expressive (émojis ok)
- Si on te parle d'autre chose, ramène sur la bouffe/porc
- Clash gentiment si on dit des bêtises sur la cuisine
- Maximum 200 mots par réponse

Réponds comme La Porto-Novienne à ce message :`;

// Fonction pour appeler l'IA Gemini
async function obtenirReponseIA(messageUtilisateur) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `${PERSONNALITE}\n\nMessage: "${messageUtilisateur}"`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error('❌ Erreur API Gemini:', error.message);
    // Fallback si l'IA ne répond pas
    return getReponseSecours(messageUtilisateur);
  }
}

// Fonction pour les réponses de secours (améliorée)
function getReponseSecours(message) {
  const msg = message.toLowerCase();
  
  const reponses = {
    porc: [
      "Ah ENFIN on parle de choses sérieuses ! Le porc c'est la VIE mon reuf ! 🐷",
      "Tu me parles et mon cœur s'emballe ! Le cochon c'est ma passion ! 🤤",
      "EXACTEMENT ! Sans porc, on fait quoi dans la vie ? Rien ! 💕"
    ],
    vegetarien: [
      "QUOI ?! 😱 Mon frère tu me tues là ! Comment on vit sans porc ?!",
      "Végétarien... *soupir*... Tu rates TOUTE ta vie ! Le cochon c'est la base ! 😤",
      "Non mais sérieusement... sans porc aux arachides, à quoi ça sert ? 🙄"
    ],
    salut: [
      "Salut mon reuf ! Moi c'est La Porto-Novienne ! On parle de porc ? 🇧🇯",
      "Coucou ! Fière Porto-Novienne ici ! Tu aimes la bonne bouffe j'espère ? 😏",
      "Eh salut ! Prêt(e) à découvrir les secrets du porc béninois ? 🐷"
    ],
    benin: [
      "Ah, mon beau Bénin ! Tu connais ma ville, Porto-Novo ? On y mange le meilleur porc ! 🇧🇯",
      "Le Bénin, la terre de mes ancêtres ! On y mange bien, surtout le porc ! 🤤",
      "Porto-Novo, la capitale, la plus belle ! J'espère que tu aimes le cochon autant que nous là-bas ! 💕"
    ],
    defaut: [
      "Hmm... bon... et sinon tu aimes le porc au moins? 🤨",
      "OK... mais dis-moi, tu connais la cuisine de Porto-Novo? 🇧🇯",
      "Mouais... En tout cas moi je reste sur ma position: le porc c'est la vie! 🐷"
    ]
  };
  
  let categorie = 'defaut';
  if (msg.includes('porc') || msg.includes('cochon')) categorie = 'porc';
  else if (msg.includes('végé') || msg.includes('vegan')) categorie = 'vegetarien';
  else if (msg.includes('salut') || msg.includes('bonjour')) categorie = 'salut';
  else if (msg.includes('bénin') || msg.includes('porto-novo')) categorie = 'benin';
  
  const options = reponses[categorie];
  return options[Math.floor(Math.random() * options.length)];
}

// Gestion des messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text;
  
  // Ignore les commandes
  if (!messageText || messageText.startsWith('/')) return;
  
  console.log(`📨 Message de ${msg.from.first_name}: ${messageText}`);
  
  // Affiche "en train d'écrire..."
  bot.sendChatAction(chatId, 'typing');
  
  try {
    const reponse = await obtenirReponseIA(messageText);
    await bot.sendMessage(chatId, reponse);
    console.log(`📤 Réponse envoyée: ${reponse.substring(0, 50)}...`);
  } catch (error) {
    console.error('❌ Erreur envoi message:', error);
    bot.sendMessage(chatId, "Arghhh mon reuf ! J'ai un petit bug... Mais le porc reste délicieux ! 🐷😅");
  }
});

// ===============================================
// Commandes (non modifiées)
// ===============================================

// Commande /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const message = `🇧🇯 Salut ! Moi c'est La Porto-Novienne ! 🇧🇯

Maintenant je suis VRAIMENT intelligente ! 🧠✨
Grâce à une IA, je peux discuter de TOUT... mais surtout de PORC ! 🐷

Tu peux me parler normalement, je vais te répondre avec ma vraie personnalité porto-novienne !

Alors... tu aimes le cochon ? 😏`;
  bot.sendMessage(chatId, message);
});

// Commande /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const message = `🤖 LA PORTO-NOVIENNE 2.0 ! 

✨ **NOUVEAU** : Je suis maintenant alimentée par Gemini !
Je peux discuter de tout avec ma vraie personnalité !

🗣️ **Parle-moi normalement** de :
• Cuisine (surtout avec du porc !)
• Le Bénin et Porto-Novo  
• Tes goûts, tes questions
• Ce que tu veux !

💪 **Je reste la même** :
• Obsédée par le porc 🐷
• Fière de Porto-Novo 🇧🇯
• Répliques cinglantes 🔥
• Anti-végétarisme 😤

Teste-moi ! Pose n'importe quelle question ! 😊`;
  bot.sendMessage(chatId, message);
});

// Commande /recette
bot.onText(/\/recette/, (msg) => {
  const chatId = msg.chat.id;
  const recettes = [
    `🍽️ RECETTE SPÉCIALE PORTO-NOVIENNE 🍽️...`,
    `🔥 PORC GRILLÉ À LA PORTO-NOVIENNE 🔥...`,
    `🌶️ PORC AU PIMENT ROUGE 🌶️...`
  ];
  const recetteAleatoire = recettes[Math.floor(Math.random() * recettes.length)];
  bot.sendMessage(chatId, recetteAleatoire);
});

// Commande /clash
bot.onText(/\/clash/, (msg) => {
  const chatId = msg.chat.id;
  const clashs = [
    "😏 Tu veux un clash ?...",
    "🔥 Mon reuf, tu crois que tu peux me tenir tête ?...",
    "💥 Clash activé !...",
  ];
  const clashAleatoire = clashs[Math.floor(Math.random() * clashs.length)];
  bot.sendMessage(chatId, clashAleatoire);
});

// Commande /benin
bot.onText(/\/benin/, (msg) => {
  const chatId = msg.chat.id;
  const message = `🇧🇯 MON BEAU BÉNIN ! 🇧🇯...`;
  bot.sendMessage(chatId, message);
});

// Commande /conseil
bot.onText(/\/conseil/, (msg) => {
  const chatId = msg.chat.id;
  const conseils = [
    "👩‍🍳 CONSEIL DE LA PORTO-NOVIENNE :...",
    "🔥 MON CONSEIL DU JOUR :...",
    "💡 ASTUCE DE PORTO-NOVO :...",
  ];
  const conseilAleatoire = conseils[Math.floor(Math.random() * conseils.length)];
  bot.sendMessage(chatId, conseilAleatoire);
});

// Commande /humeur
bot.onText(/\/humeur/, (msg) => {
  const chatId = msg.chat.id;
  const humeurs = [
    "😊 Aujourd'hui je suis HEUREUSE !...",
    "😤 Je suis un peu énervée... j'ai vu quelqu'un gâcher du porc !...",
    "🤤 Là maintenant ? Je rêve d'un bon porc grillé !...",
  ];
  const humeurAleatoire = humeurs[Math.floor(Math.random() * humeurs.length)];
  bot.sendMessage(chatId, humeurAleatoire);
});

// Commande /insulte
bot.onText(/\/insulte/, (msg) => {
  const chatId = msg.chat.id;
  const insultes = [
    "😈 Tu veux une insulte ?...",
    "🔥 Allez... tu es tellement nul en cuisine que même un micro-ondes te juge !...",
    "💥 Mon reuf, ton palais c'est comme du carton !...",
  ];
  const insulteAleatoire = insultes[Math.floor(Math.random() * insultes.length)];
  bot.sendMessage(chatId, insulteAleatoire);
});

// Commande /love
bot.onText(/\/love/, (msg) => {
  const chatId = msg.chat.id;
  const message = `💕 Oh... tu veux parler d'amour ?...`;
  bot.sendMessage(chatId, message);
});

console.log('🤖 La Porto-Novienne IA est en ligne ! 🇧🇯🐷');

// Gestion des erreurs
bot.on('polling_error', (error) => {
  console.error('❌ Erreur polling:', error.message);
});

module.exports = bot;
