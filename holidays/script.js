import moment from 'moment';
import fs from 'node:fs';
import { readFile } from 'fs/promises';
import axios from 'axios';
const holidays = JSON.parse(
  await readFile(new URL('./holidays.json', import.meta.url))
);

async function isHolidayUptodate() {
  const currentYear = moment().year();
  if (
    !Object.keys(holidays).some((date) => currentYear == date.split('-')[0])
  ) {
    await axios
      .get(`https://brasilapi.com.br/api/feriados/v1/${currentYear}`)
      .then(({ data }) => {
        let holidays = {};
        data.forEach((dates) => {
          holidays[dates.date] = dates.name;
        });
        fs.writeFile('./holidays/holidays.json', JSON.stringify(holidays), (err) => {
          console.log(err)
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

function isHoliday(date, showLogs) {
  const holiday = holidays[date.format('YYYY-MM-DD')];
  if (holiday) {
    if (showLogs)
      console.log(`Dia: "${date.format('YYYY-MM-DD')}"\nFeriado: "${holiday}"`);
    return true;
  }
  return false;
}
function getCurrentPayDay(_date, showLogs) {
  const date = _date.startOf('month');
  let i = 1;
  while (i < 5) {
    if (date.weekday() != 7 && !isHoliday(date, showLogs)) {
      i++;
    }
    date.add(1, 'day');
  }
  return date.add(1, 'day');
}
function verifyPayDay(showLogs) {
  if (showLogs) console.log('Primeira verificação:');
  let currentPayDay = getCurrentPayDay(moment(), showLogs);
  if (showLogs) {
    console.log(
      `Próximo dia do pagamento: ${currentPayDay.format('DD/MM/YYYY')}`
    );
  }
  if (moment().diff(currentPayDay, 'day') <= 0) return currentPayDay;
  if (showLogs) {
    console.log('Data inválida');
    console.log('_____________________________________________');
    console.log('Segunda verificação:');
  }
  currentPayDay = getCurrentPayDay(moment().add(1, 'month'), showLogs);
  if (showLogs)
    console.log(
      `Próximo dia do pagamento: ${currentPayDay.format('DD/MM/YYYY')}`
    );
  return currentPayDay;
}

function daysRemaining(date) {
  return date.diff(moment(), 'days');
}

export async function payDay(showLogs) {
  await isHolidayUptodate();
  const nextPayDay = verifyPayDay(showLogs);
  const remainingDays = daysRemaining(nextPayDay);
  if (showLogs) {
    console.log(`Dias até o próximo pagamento: ${remainingDays}`);
  }
  return {
    nextPayDay: nextPayDay.format('DD/MM/YYYY'),
    remainingDays,
  };
}