import React from 'react';
import {DualAxes} from "@ant-design/charts";

const ErrorsChart = ({ formated_data }: { formated_data: any[] }) => {
    const config = {
        data: formated_data,
        xField: 'Ws',
        legend: false,
        height: 400, // Задаем фиксированную высоту графика
        children: [
            {
                type: 'line',
                yField: 'count',
                shapeField: 'smooth',
                style: {
                    lineWidth: 1,
                    lineDash: [5, 5],
                    opacity: 1
                },
                label: {
                    text: (datum: any) => `${datum.count}`,
                    style: {
                        dy: -10,
                        textAlign: 'middle',
                        opacity: 0
                    },
                },
                axis: {
                    y: {
                        title: 'Count of errors',
                        style: { titleFill: '#5B8FF9' },
                    },
                },
            },
            {
                type: 'line',
                yField: 'stay_time',
                shapeField: 'smooth',
                style: {
                    stroke: '#5AD8A6',
                    lineWidth: 5,
                    opacity: 0.5,
                },
                label: {
                    text: (datum: any) => `${datum.stay_time} m`,
                    style: {
                        dy: -10,
                        textAlign: 'middle',
                    },
                },
                axis: {
                    y: {
                        position: 'right',
                        title: 'Time of station stayed on stop',
                        style: { titleFill: '#5AD8A6' },
                    },
                },
            },
            {
                type: 'point',
                yField: 'count',
                sizeField: 4,
                style: {
                    stroke: '#5AD8A6',
                    fill: '#fff',
                },
                axis: { y: false },
                tooltip: false,
            },
        ],
    };
    return <DualAxes {...config} />;
};

export default ErrorsChart;
