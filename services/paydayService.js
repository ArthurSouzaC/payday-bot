import { payDay } from '../holidays/script.js';

export const getPayday = async (msg) => {
    let result = await payDay(true)
    msg.channel.send(`🔥🎆 Faltam ${result.remainingDays} dias até o pagamento! 🎆🔥`);
    msg.channel.send(`Data do próximo pagamento: ${result.nextPayDay}`);
}
