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

function isHoliday(date) {
  const holiday = holidays[date.format('YYYY-MM-DD')];
  if (holiday)
    return true;

  return false;
}
function getCurrentPayDay(_date) {
  const date = _date.startOf('month');
  let workingDays = 0;
  
  while(workingDays < 5) {
    if(date.weekday() != 0 && !isHoliday(date))
      workingDays++;

    if(workingDays < 5) 
      date.add(1, 'day');
  }
  return date;
}
function verifyPayDay() {
  let currentPayDay = getCurrentPayDay(moment());
  if (moment().diff(currentPayDay, 'day') <= 0) return currentPayDay;
  currentPayDay = getCurrentPayDay(moment().add(2, 'month'));
  return currentPayDay;
}

function daysRemaining(_date) {
  return _date.diff(moment(), 'days') + 1;
}

function workingDaysRemaining(_date) {
  let days = 0;
  let date = moment();
  while(_date.diff(date, 'days') != 0) {
    if (date.weekday() != 0 && date.weekday() != 6 && !isHoliday(date))
      days++;
    date.add(1, 'day');
  }
  return days + 1;
}

export async function payDay() {
  await isHolidayUptodate();
  const nextPayDay = verifyPayDay();
  const remainingDays = daysRemaining(nextPayDay);
  const workingDays = workingDaysRemaining(nextPayDay);

  return {
    nextPayDay: nextPayDay.format('DD/MM/YYYY'),
    remainingDays,
    workingDays
  };
}