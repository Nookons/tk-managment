import React from 'react';
import { Line } from "@ant-design/charts";

const ErrorsChart = ({ formated_data }: { formated_data: any[] }) => {
    const config = {
        data: formated_data,
        xField: 'Ws',  // Указываем строку для оси X
        yField: 'stay_time',      // Указываем строку для оси Y
        colorField: 'category', // Цвет точек/линий по категории (если имеется)
        legend: {
            position: 'bottom',   // Позиция легенды
        },
        lineStyle: {
            lineWidth: 1,      // Толщина линии
        },
        point: {
            size: 5,           // Размер точек на графике
            shape: 'circle',   // Форма точек
        },
        smooth: true,         // Отключаем сглаживание линии
    };

    return <Line {...config} />;
};

export default ErrorsChart;
