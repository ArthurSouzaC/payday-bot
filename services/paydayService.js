import { payDay } from '../holidays/script.js';

export const getPayday = async (msg) => {
    let result = await payDay();
    msg.channel.send(`🎆 Faltam ${result.remainingDays} dias até o pagamento! 🎆`);
    msg.channel.send(`Dias de trabalho até o pagamento: ${result.workingDays}`);
    msg.channel.send(`Data do próximo pagamento: ${result.nextPayDay}`);
}
