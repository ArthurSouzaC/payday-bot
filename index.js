import express from 'express';
import Discord, { Intents } from 'discord.js';
import routes from './routes.js';
import botCommands from './commands/index.js';
import config from './config.js';

// Setting up the server
const app = express();
app.use(routes);

// Setting up bot's commands
const bot = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
bot.commands = new Discord.Collection();
Object.keys(botCommands).map(key => {
    bot.commands.set(botCommands[key].name, botCommands[key]);
})

// Logging the bot in
bot.login(config.discordBotToken);
bot.on('ready', () => {
    console.info(`>> Logged in as ${bot.user.tag}!`);
})

// Listen to messages at Discord text channel and bind them to respective commands
bot.on('messageCreate', msg => {
    const command = msg.content.split(/ +/).shift().toLowerCase();
    if(!bot.commands.has(command)){
        return;
    }

    try {
        bot.commands.get(command).execute(msg);
    } 
    catch (error) {
        console.error(error);
        msg.reply('Ocorreu um erro ao executar o comando!');
    }
})

app.listen(config.port, () => {
    console.log('>> Server running on port ' + process.env.PORT);
})