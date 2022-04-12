import dotenv from 'dotenv';

dotenv.config();

// Exporting environment variables
export default {
  port: process.env.PORT,
  discordBotToken: process.env.DISCORD_BOT_TOKEN
}
