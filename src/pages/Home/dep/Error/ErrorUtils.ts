// Вспомогательная функция для формирования work_title
import {IError} from "../../../../types/Error";
import { FormattedError } from "./ErrorDisplay";
import dayjs, {Dayjs} from "dayjs";

const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.slice(10).split(':').map(Number);
    return hours * 60 + minutes;
};

export const getWorkTitle = (workStation: string, isSeparetedSides: boolean): string => {
    const removeZero = workStation.replace(/^0+/, ''); // Убираем ведущие нули
    return removeZero.length > 3 ? removeZero.slice(0, isSeparetedSides ? 4 : 2) : removeZero.slice(0, isSeparetedSides ? 4 : 1);
};

// Вспомогательная функция для вычисления разницы во времени
export const getTimeDifferenceInMinutes = (startTime: string, endTime: string): number => {
    const startTimeInMinutes = timeToMinutes(startTime);
    const endTimeInMinutes = timeToMinutes(endTime);
    return endTimeInMinutes - startTimeInMinutes;
};

// Вспомогательная функция для обработки данных
export const processItem = (item: IError, shift: string, uniqueItems: { [key: string]: FormattedError }, isSeparetedSides: boolean) => {
    let workTitle = getWorkTitle(item.workStation, isSeparetedSides);
    let diffInMinutes = 0;

    if (item.startTime && item.endTime) {
        diffInMinutes = getTimeDifferenceInMinutes(item.startTime, item.endTime);
    }

    const itemKey = workTitle || "unknown";

    if (uniqueItems[itemKey]) {
        uniqueItems[itemKey].count += 1;
        uniqueItems[itemKey].stay_time += diffInMinutes;
    } else {
        uniqueItems[itemKey] = {Ws: workTitle, count: 1, stay_time: diffInMinutes};
    }
};

// Функция обработки ошибок
export const processErrors = (
    errors: IError[],
    isDayShift: boolean,
    isSeparetedSides: boolean,
    picked_date: Dayjs,
    setErrorsInShiftCount: (e: number) => void

) => {
    const uniqueItems: { [key: string]: FormattedError } = {};
    let shiftErrorsCount = 0;

    errors.forEach(item => {
        const date = dayjs(item.startTime, "YYYY-MM-DD HH:mm");

        if (date.isSame(picked_date, 'day')) {
            const dayStart = dayjs(date).hour(6).minute(0).second(0); // 06:00
            const dayEnd = dayjs(date).hour(18).minute(0).second(0);  // 18:00
            const isDayShiftLocal = date.isBetween(dayStart, dayEnd, null, '[)');

            // Если isDayShift равен true и смена дневная
            if (isDayShift === true && isDayShiftLocal === true) {
                shiftErrorsCount += 1;
                processItem(item, 'day', uniqueItems, isSeparetedSides);
            }
            // Если isDayShift равен false и смена ночная
            else if (isDayShift === false && isDayShiftLocal === false) {
                shiftErrorsCount += 1;
                processItem(item, 'night', uniqueItems, isSeparetedSides);
            }
        }
    });

    setErrorsInShiftCount(shiftErrorsCount);
    return Object.values(uniqueItems);
};