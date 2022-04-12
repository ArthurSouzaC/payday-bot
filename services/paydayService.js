import { payDay } from '../holidays/script.js';

export const getPayday = async (msg) => {
    let result = await payDay()
    let date = new Date(result.nextPayDay).toLocaleDateString()
    msg.channel.send(`🔥🎆 Faltam ${result.remainingDays} até o pagamento! 🎆🔥`);
    msg.channel.send(`Data do próximo pagamento: ${date}`);
}