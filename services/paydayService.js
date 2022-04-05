import axios from 'axios';
import config from '../config.js';

export const getPayday = (msg) => {
    msg.channel.send(calculatePayday());
}

const calculatePayday = () => {
    // ... logic here
    const result = "result"
    return result
}