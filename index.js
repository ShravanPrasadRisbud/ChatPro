// Create a discord bot using OpenAI API that interacts on the discord servers
require('dotenv').config();

// Prepare to connect to the discord API
const { CLient, GatewayIntentBits, Client } = require('discord.js');
const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent
]})

// Prepare connection to OpenAI API
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

// Check for when a message on discord is sent
client.on('messageCreate', async function(message){
  try {
    // Don't respond to yourself or other bots
    if(message.author.bot) return;

    const gptResponse = await openai.createCompletion({
      model: "davinci",
      prompt: `ChatPro is a friendly chatbot. \n\
      ChatPro: Hello, hope you're having a nice time. What can I help you with today? \n\
      ${message.author.username}: ${message.content} \n\
      ChatPro: `,
      temperature: 0.9,
      max_tokens: 100,
      stop: ["ChatPro:", "Unholy Stryder:"],
    })
    message.reply(`${gptResponse.data.choices[0].text}`);
    return;
  } catch(err){
    console.log(err)
  }
});

// Log the bot into discord
client.login(process.env.DISCORD_TOKEN);
console.log("ChatPro is online on Discord.");