/*
Module containing utility functions
import * as Util from './utilities.js'
*/

/**  Format date as a string in the supplied format */
function formatDate(date, format){
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // add leading zeroes
    const monthStr = zeroPad(month, 2);
    const dayStr = zeroPad(day, 2);

    const output = format.replace('yyyy', year)
                        .replace('MM', monthStr)
                        .replace('dd', dayStr)

    return output
}

/**  Format time as a string in the supplied format */
function formatTime(ms, format){
    const secondMs = 1000;
    const minuteMs = secondMs * 60;
    const hourMs = minuteMs * 60;

    const hours = Math.floor(ms / hourMs);
    const minutes = Math.floor((ms % hourMs) / minuteMs);
    const seconds = Math.floor((ms % minuteMs) / secondMs);
    const milliseconds = ms % secondMs;

    const hoursStr = zeroPad(hours, 2) ;
    const minutesStr = zeroPad(minutes, 2);
    const secondsStr = zeroPad(seconds, 2);
    const msStr = zeroPad(milliseconds, 3);

    const output = format.replace('HH', hoursStr)
                        .replace('mm', minutesStr)
                        .replace('ss', secondsStr)
                        .replace('fff', msStr)
                        .replace('H', hours)
                        .replace('m', minutes)
                        .replace('s', seconds)

    return output
}

/** convert a number [num] to string of [length] and pad with leading zeroes */
function zeroPad(num, length){
    const padCount = length - num.toString().length;

    if (padCount > 0){
        return '0'.repeat(padCount) + num.toString();
    }

    return num.toString();
}

export { formatDate, zeroPad, formatTime }
