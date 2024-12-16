import React, { FC, useEffect, useState } from 'react';
import { ITote } from "../../../types/Tote";
import { Pie } from "@ant-design/charts";
import { IItem } from "../../../types/Item";

interface ToteGraphProps {
    currentTote: ITote;
}

interface IData {
    type: string;
    value: number;
}

const ToteGraph: FC<ToteGraphProps> = ({ currentTote }) => {
    const [data, setData] = useState<IData[]>([]);

    useEffect(() => {
        if (currentTote && currentTote.item_inside) {
            const uniqueItems: { [key: string]: { item: IItem; count: number } } = {};

            currentTote.item_inside.forEach((item) => {
                const itemKey = item.code || "unknown";
                if (uniqueItems[itemKey]) {
                    uniqueItems[itemKey].count += 1;
                } else {
                    uniqueItems[itemKey] = { item, count: 1 };
                }
            });

            const processedData = Object.keys(uniqueItems).map((key) => {
                const { count } = uniqueItems[key];
                return { type: key, value: count };
            });

            setData(processedData);
        }
    }, [currentTote]);

    const config = {
        data,
        angleField: 'value',
        colorField: 'type',
        label: {
            text: 'value',
            style: {
                fontWeight: 'normal',
            },
        },
        legend: {
            position: 'right',
            rowPadding: 5,
        },
    };

    return <Pie {...config} />;
};

export default ToteGraph;
