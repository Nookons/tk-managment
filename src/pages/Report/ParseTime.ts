import dayjs from "dayjs";

export function parseTime(line: string) {
    const match = line.match(/(\d{1,2}:\d{2})\s*[- ]?\s*(\d{1,2}:\d{2})$/); // Учитываем дефис или пробел между временем
    if (match) {
        const startTime = match[1]; // Стартовое время
        const endTime = match[2]; // Конечное время

        const start_date = dayjs(startTime, "HH:mm")
        const end_date = dayjs(endTime, "HH:mm")

        const current_time = dayjs()
        const isAfterSix = dayjs().startOf('day').set('hour', 6).isBefore(current_time)

        if (isAfterSix) {
            return {startTime: start_date.format("YYYY-MM-DD HH:mm"), endTime: end_date.format("YYYY-MM-DD HH:mm")}
        } else {
            const isCurrentShift = dayjs().startOf('day').set('hour', 6).isAfter(start_date)

            if (isCurrentShift) {
                return {startTime: start_date.format("YYYY-MM-DD HH:mm"), endTime: end_date.format("YYYY-MM-DD HH:mm")}
            } else {
                return {startTime: dayjs(start_date).subtract(1, "day").format("YYYY-MM-DD HH:mm"), endTime: dayjs(end_date).subtract(1, "day").format("YYYY-MM-DD HH:mm")}
            }
        }
    }
    console.log("Временной диапазон не найден.");
    return null;
}