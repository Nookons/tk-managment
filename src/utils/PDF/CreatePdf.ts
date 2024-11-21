import { jsPDF } from "jspdf";
import { ITote } from "../../types/Tote";
import { IItem } from "../../types/Item";
import {message} from "antd";
import dayjs from "dayjs";

/**
 * Функция для генерации PDF с данными о контейнере (Tote) и его элементах (Items).
 * @param tote Объект контейнера с товарами
 * @param fileName Имя файла PDF
 */

export const AllToteToPDF = (totes: ITote[]) => {
    const doc = new jsPDF('portrait');
    doc.setFontSize(8);
    let yPosition = 10;
    const margin = 10;
    const pageWidth = doc.internal.pageSize.width;

    totes.forEach((tote, toteIndex) => {
        // Add a header for each tote
        doc.setFontSize(8);
        doc.text(`Tote: ${tote.tote_number} | Updated by: ${tote.updated_by} | Last updated: ${tote.update_time}`, margin, yPosition);
        yPosition += 5;

        const uniqueItems: { [key: string]: { item: IItem, count: number } } = {};

        doc.setFontSize(12);
        // Group items by name and count them
        tote.item_inside.forEach((item) => {
            const itemKey = item.name || "Without name";
            if (uniqueItems[itemKey]) {
                uniqueItems[itemKey].count += 1;
            } else {
                uniqueItems[itemKey] = { item, count: 1 };
            }
        });

        // Function to draw each item in the tote
        function drawItem(item: IItem, count: number, index: number) {
            const itemName = item.name || "Without name";
            const itemCode = item.code || "Unknown";
            const text = `${index}. ${itemName}`;
            const text2 = `[ ${itemCode} ] x${count} SHT`;

            // Wrap text to fit within the page width
            const maxWidth = pageWidth - 2 * margin - 40;
            const splitText = doc.splitTextToSize(text, maxWidth);
            const splitText2 = doc.splitTextToSize(text2, maxWidth);

            // Draw rectangles with dynamic height
            doc.setDrawColor(0);
            doc.rect(margin, yPosition, pageWidth - 2 * margin, 15 + (splitText.length + splitText2.length - 2) * 5);
            doc.rect(margin + 3.5, yPosition + 3.5, 3.5, 3.5);

            // Print the item name and quantity
            doc.text(splitText, margin + 10, yPosition + 7);
            doc.text(splitText2, margin + 10, yPosition + 12 + (splitText.length - 1) * 5);

            yPosition += 15 + (splitText.length + splitText2.length - 2) * 5;
        }

        // Loop through unique items in the tote and display them
        Object.values(uniqueItems).forEach((entry, index) => {
            // Check if a new page is needed
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
            drawItem(entry.item, entry.count, index + 1);
        });

        // Add some space between totes
        yPosition += 10;
    });

    // Save the PDF with a timestamped name
    doc.save(`${dayjs().format("YYYY-MM-DD HH:mm:ss")}`);
};




export function generatePDF(tote: ITote, fileName: string): void {
    // Указываем ориентацию "landscape" для альбомного формата
    const doc = new jsPDF('portrait');

    // Устанавливаем шрифт и размер
    doc.setFontSize(8);

    // Заголовок PDF
    doc.text(`Tote number: ${tote.tote_number}`, 20, 10);
    doc.text(`Tote ID: ${tote.id}`, 20, 15);
    doc.text(`Update date: ${tote.update_time}`, 20, 20);
    doc.text(`Last updated: ${tote.updated_by}`, 100, 20);

    // Позиция для вывода данных о товарах
    let yPosition = 25;
    let itemIndex = 1;  // Индекс товара начинается с 1

    // Ширина страницы и отступы
    const margin = 10;
    const pageWidth = doc.internal.pageSize.width;

    // Создаём объект для хранения уникальных товаров и их количеств
    const uniqueItems: { [key: string]: { item: IItem, count: number } } = {};


    doc.setFontSize(12);
    // Проходим по каждому товару в контейнере и группируем по названию
    tote.item_inside.forEach((item) => {
        const itemKey = item.name || "Without name";  // Используем название товара как ключ (или "Без имени")
        if (uniqueItems[itemKey]) {
            uniqueItems[itemKey].count += 1;  // Увеличиваем количество для уже существующего товара
        } else {
            uniqueItems[itemKey] = { item, count: 1 };  // Добавляем новый товар с количеством 1
        }
    });

    // Функция для вывода информации о товаре в PDF
    function drawItem(item: IItem, count: number, index: number) {
        const text = `${index}. ${item.name || "Without name"} `;
        const text2 = `[ ${item.code || "Unknown"} ] x${count} SHT`;
        const textWidth = doc.getStringUnitWidth(text) * doc.getFontSize() / doc.internal.scaleFactor;

        // Рисуем рамку для элемента
        doc.setDrawColor(0);  // Цвет рамки (чёрный)
        doc.rect(textWidth + 25, yPosition + 4.5, 3.5, 3.5);  // Рисуем прямоугольник
        doc.rect( 15, yPosition + 1.5, 175, 10);  // Рисуем прямоугольник
        doc.rect( 25, yPosition + 11.5, 150 + 15, 10);  // Рисуем прямоугольник

        // Печатаем текст
        doc.text(text, margin + 10, yPosition + 7.5);
        doc.text(text2, margin + 20, yPosition + 17.5);

        // Увеличиваем позицию для следующего элемента
        yPosition += 20;
    }

    // Проходим по уникальным товарам и выводим их на страницу
    Object.values(uniqueItems).forEach((entry, index) => {
        // Проверяем, поместится ли элемент на текущей странице
        if (yPosition > 270) {  // 270 - это высота с учётом отступа и шрифта
            doc.addPage();  // Добавляем новую страницу
            yPosition = 20; // Сбрасываем позицию для новой страницы (теперь будет начинаться с 20)
        }

        // Рисуем товар с количеством
        drawItem(entry.item, entry.count, index + 1);
    });

    // Сохраняем PDF
    doc.save(fileName);
}
