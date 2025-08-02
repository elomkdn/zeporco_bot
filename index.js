const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Configuration
const token = process.env.BOT_TOKEN || 'TON_TOKEN_ICI';
const hfToken = process.env.HUGGINGFACE_TOKEN || 'TON_HF_TOKEN'; // Gratuit sur huggingface.co

if (!token || token === 'TON_TOKEN_ICI') {
  console.error('❌ Token Telegram manquant !');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// Personnalité de La Porto-Novienne
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

// Fonction pour appeler l'IA Hugging Face
async function obtenirReponseIA(messageUtilisateur) {
  try {
    const prompt = `${PERSONNALITE}\n\nMessage: "${messageUtilisateur}"`;
    
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 150,
          temperature: 0.8,
          return_full_text: false
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${hfToken}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    if (response.data && response.data[0] && response.data[0].generated_text) {
      return response.data[0].generated_text.trim();
    }
    
    // Fallback si l'IA ne répond pas
    return getReponseSecours(messageUtilisateur);
    
  } catch (error) {
    console.error('Erreur IA:', error.message);
    return getReponseSecours(messageUtilisateur);
  }
}

// Réponses de secours quand l'IA est en panne
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
    defaut: [
      "Hmm... bon... et sinon tu aimes le porc au moins ? 🤨",
      "OK... mais dis-moi, tu connais la cuisine de Porto-Novo ? 🇧🇯",
      "Mouais... En tout cas moi je reste sur ma position : le porc c'est la vie ! 🐷"
    ]
  };
  
  let categorie = 'defaut';
  if (msg.includes('porc') || msg.includes('cochon')) categorie = 'porc';
  else if (msg.includes('végé') || msg.includes('vegan')) categorie = 'vegetarien';
  else if (msg.includes('salut') || msg.includes('bonjour')) categorie = 'salut';
  
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
    console.error('Erreur envoi message:', error);
    bot.sendMessage(chatId, "Arghhh mon reuf ! J'ai un petit bug... Mais le porc reste délicieux ! 🐷😅");
  }
});

// Commandes inchangées
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const message = `🇧🇯 Salut ! Moi c'est La Porto-Novienne ! 🇧🇯

Maintenant je suis VRAIMENT intelligente ! 🧠✨
Grâce à une IA, je peux discuter de TOUT... mais surtout de PORC ! 🐷

Tu peux me parler normalement, je vais te répondre avec ma vraie personnalité porto-novienne !

Alors... tu aimes le cochon ? 😏`;
  
  bot.sendMessage(chatId, message);
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const message = `🤖 LA PORTO-NOVIENNE 2.0 ! 

✨ **NOUVEAU** : Je suis maintenant alimentée par une IA !
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

console.log('🤖 La Porto-Novienne IA est en ligne ! 🇧🇯🐷');

// Gestion des erreurs
bot.on('polling_error', (error) => {
  console.error('❌ Erreur polling:', error.message);
});

module.exports = bot;
