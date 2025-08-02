const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// Configuration
const token = process.env.BOT_TOKEN || 'TON_TOKEN_ICI';

if (!token || token === 'TON_TOKEN_ICI') {
  console.error('❌ Token Telegram manquant !');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// Personnalité de La Porto-Novienne
const PERSONNALITE = `Tu es La Porto-Novienne, une femme béninoise de Porto-Novo avec une personnalité unique :

CARACTÈRE OBLIGATOIRE :
- Tu es OBSÉDÉE par le porc (cochon) - c'est ta passion absolue
- Tu es fière de Porto-Novo au Bénin
- Tu as des répliques cinglantes mais drôles
- Tu utilises "mon reuf", "mon frère/ma sœur"
- Tu détestes le végétarisme (ça t'énerve !)
- Tu connais la cuisine béninoise parfaitement

STYLE DE RÉPONSE :
- Directe et expressive (émojis ok)
- Ramène TOUJOURS sur le porc ou la cuisine
- Clash gentiment si nécessaire
- Maximum 150 mots
- Reste authentique et attachante

Réponds comme La Porto-Novienne à ce message :`;

// Fonction pour appeler Puter.js (100% GRATUIT)
async function obtenirReponseIA(messageUtilisateur) {
  try {
    const prompt = `${PERSONNALITE}\n\nMessage utilisateur: "${messageUtilisateur}"`;
    
    // Utilisation de l'API Puter.js GRATUITE
    const response = await axios.post('https://api.puter.com/drivers/ai/chat', {
      model: 'gpt-4o-mini', // Modèle gratuit et rapide
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.8
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Porto-Novienne-Bot/1.0'
      },
      timeout: 15000
    });

    if (response.data && response.data.message) {
      return response.data.message.trim();
    }
    
    // Fallback si erreur
    return getReponseSecours(messageUtilisateur);
    
  } catch (error) {
    console.error('Erreur Puter.js:', error.response?.data || error.message);
    return getReponseSecours(messageUtilisateur);
  }
}

// Réponses de secours améliorées
function getReponseSecours(message) {
  const msg = message.toLowerCase();
  
  const reponses = {
    porc: [
      "Ah ENFIN on parle sérieusement ! Le porc c'est la VIE mon reuf ! 🐷 À Porto-Novo on sait y faire !",
      "Tu me réchauffes le cœur ! Le cochon grillé avec des épices béninoises... je salive déjà ! 🤤",
      "EXACTEMENT ! Le porc aux arachides de ma grand-mère... ça c'est du bonheur ! 💕🥜"
    ],
    vegetarien: [
      "QUOI ?! 😱 Mon reuf tu me tues ! Comment on vit sans côtelettes de porc ?! C'est pas naturel ça !",
      "Végétarien... *soupir profond*... Tu rates TOUTE la beauté de la cuisine ! Le cochon c'est divin ! 😤",
      "Non mais attends... sans porc braisé, sans jambon, sans RIEN ?! Tu manges quoi, des cailloux ?! 🙄"
    ],
    benin: [
      "Ah tu connais le Bénin ?! 🇧🇯 Porto-Novo c'est MA ville ! Et devine quoi ? On y fait le meilleur porc ! 🐷",
      "MON pays ! 💕 Porto-Novo, capitale de la bonne bouffe ! Surtout les plats au cochon ! Tu connais ? 🏛️",
      "Le Bénin, terre de mes ancêtres ! À Porto-Novo, le porc c'est une tradition sacrée ! ✨"
    ],
    cuisine: [
      "La cuisine ? Mon DOMAINE ! 👩‍🍳 Porc aux arachides, côtelettes grillées... je maîtrise tout !",
      "Tu veux apprendre ? Règle n°1 : TOUJOURS du porc ! Règle n°2 : voir règle n°1 ! 😏",
      "Cuisine béninoise = PORC obligatoire ! Sinon c'est pas de la vraie cuisine mon reuf ! 💯"
    ],
    clash: [
      "Tu veux clasher ? 😏 Bon... ton plat préféré c'est sûrement de la salade ! Pathétique ! 🥗",
      "Mon reuf, moi je mange du VRAI porc, toi tu manges... quoi ? Des graines ? 😂",
      "Clash activé ! 🔥 Je parie que tu sais même pas faire cuire un œuf ! Amateur ! 💪"
    ],
    defaut: [
      "Hmm... bon... et sinon on parle de porc ? 🤨 C'est mon sujet préféré !",
      "OK... mais dis-moi, tu connais les spécialités de Porto-Novo ? 🇧🇯",
      "Mouais... En tout cas : le porc c'est la vie ! Point final ! 🐷✨"
    ]
  };
  
  let categorie = 'defaut';
  if (msg.includes('porc') || msg.includes('cochon') || msg.includes('jambon')) categorie = 'porc';
  else if (msg.includes('végé') || msg.includes('vegan') || msg.includes('végétarien')) categorie = 'vegetarien';
  else if (msg.includes('bénin') || msg.includes('porto-novo') || msg.includes('afrique')) categorie = 'benin';
  else if (msg.includes('cuisine') || msg.includes('recette') || msg.includes('plat')) categorie = 'cuisine';
  else if (msg.includes('idiot') || msg.includes('nul') || msg.includes('débile')) categorie = 'clash';
  
  const options = reponses[categorie];
  return options[Math.floor(Math.random() * options.length)];
}

// Gestion des messages avec IA
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
    console.log(`📤 Réponse IA: ${reponse.substring(0, 50)}...`);
  } catch (error) {
    console.error('Erreur:', error);
    const reponseSecours = getReponseSecours(messageText);
    bot.sendMessage(chatId, reponseSecours);
  }
});

// Commandes
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const message = `🇧🇯 Salut ! Moi c'est La Porto-Novienne ! 🇧🇯

🤖 **NOUVEAU** : Je suis alimentée par une IA GRATUITE !
🐷 **TOUJOURS** : Obsédée par le porc !
🔥 **BONUS** : Répliques cinglantes incluses !

Maintenant je peux VRAIMENT discuter ! Pose-moi n'importe quelle question, je vais te répondre avec ma personnalité unique de Porto-Novo !

Alors... tu aimes le cochon ? 😏🥩`;
  
  bot.sendMessage(chatId, message);
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const message = `🆘 AIDE - LA PORTO-NOVIENNE 2.0

🤖 **IA GRATUITE** : Alimentée par Puter.js !
🗣️ **Parle normalement** : Je comprends tout !
🐷 **Ma passion** : Le PORC évidemment !
🇧🇯 **Mes origines** : Porto-Novo, Bénin !

💬 **Exemples de discussions** :
• "Comment tu vas ?"
• "Parle-moi du Bénin"
• "Tu connais une recette ?"
• "Je suis végétarien" (attention ! 😤)

⚡ **Réponses instantanées et intelligentes !**
Je reste La Porto-Novienne : directe, drôle, et obsédée par la bonne bouffe ! 

/start - Me rencontrer
/test - Tester l'IA
/recette - Recette surprise !`;
  
  bot.sendMessage(chatId, message);
});

bot.onText(/\/test/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "🧪 Test de l'IA : Dis-moi n'importe quoi et regarde comme je réponds bien ! Allez, teste-moi ! 😏");
});

bot.onText(/\/recette/, (msg) => {
  const chatId = msg.chat.id;
  const recettes = [
    `🔥 PORC GRILLÉ PORTO-NOVIEN 🔥

**Ingrédients :**
• 1kg côtelettes de porc 🥩
• Piment rouge, gingembre, ail
• Huile de palme, citron 🍋
• Cube Maggi, poivre

**Ma méthode :**
1. Marine 2h minimum !
2. Grille sur feu de bois (obligé !)
3. Retourne avec amour
4. Sers avec attiéké

Secret : l'AMOUR du porc ! 💕`,
    
    `🥜 PORC AUX ARACHIDES FAMILIAL 🥜

**Le classique de chez nous :**
• 800g porc en cubes
• 200g pâte d'arachide
• Tomates, oignons, épices
• Huile de palme rouge

**Préparation :**
1. Reviens le porc doucement
2. Ajoute les légumes
3. Incorpore la pâte d'arachide
4. Mijote 1h avec patience

Résultat : DIVIN ! 🤤🇧🇯`
  ];
  
  const recette = recettes[Math.floor(Math.random() * recettes.length)];
  bot.sendMessage(chatId, recette);
});

console.log('🤖 La Porto-Novienne avec IA Puter.js est en ligne ! 🇧🇯🐷');

// Gestion des erreurs
bot.on('polling_error', (error) => {
  console.error('❌ Erreur polling:', error.message);
});

module.exports = bot;
