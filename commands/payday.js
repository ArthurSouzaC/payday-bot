import { getPayday } from '../services/paydayService.js';

export default {
    name: '!payday',
    description: 'Returns time remaining untill payday',
    execute: (msg) => getPayday(msg)
}