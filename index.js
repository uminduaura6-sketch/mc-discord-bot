const { Client, GatewayIntentBits } = require('discord.js');
const mineflayer = require('mineflayer');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('Bot Status: Online!'));
app.listen(process.env.PORT || 3000);

// --- ⚙️ SETTINGS ⚙️ ---
const MC_HOST = 'xbg4u.playserver.pro';
const MC_PORT = 40426;
const MC_BOT_NAME = 'sirixbg4u';
const DISCORD_CHANNEL_ID = '1536570030517391385';
// ----------------------

const discordClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

let mcBot;

function createMcBot() {
    mcBot = mineflayer.createBot({
        host: MC_HOST,
        port: MC_PORT,
        username: MC_BOT_NAME,
        version: false
    });

    mcBot.on('spawn', () => console.log('Minecraft Server එකට Join වුණා!'));
    
    mcBot.on('end', () => {
        console.log('Bot disconnected. Reconnecting...');
        setTimeout(createMcBot, 5000);
    });

    mcBot.on('error', err => console.log('Minecraft Error:', err));
}

discordClient.on('messageCreate', (message) => {
    if (message.author.bot) return;
    if (message.channel.id !== DISCORD_CHANNEL_ID) return;

    if (mcBot) {
        mcBot.chat(`[${message.author.username}]: ${message.content}`);
    }
});

discordClient.login(process.env.DISCORD_TOKEN);
createMcBot();
