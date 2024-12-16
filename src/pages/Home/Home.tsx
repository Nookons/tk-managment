import React, {useEffect, useState} from 'react';
import {Row, Col} from 'antd';
import {Bar} from "@ant-design/charts";
import RobotsCard from "./dep/RobotsCard";
import {useAppSelector} from "../../hooks/storeHooks";

interface IBar {
    title: string;
    value: number;
}

const App: React.FC = () => {
    const {totes, loading, error} = useAppSelector(state => state.totes);
    const [data, setData] = useState<IBar[]>([]);

    useEffect(() => {
        if (totes) {
            const newData: IBar[] = totes.map(el => ({
                title: el.tote_number,
                value: el.item_inside.length,
            }));
            setData(newData);
        }
    }, [totes]);


    const config = {
        data,
        xField: 'title',  // xField будет отображать название (tote_number)
        yField: 'value',  // yField будет показывать количество предметов
    };

    return (
        <div>
            <Row gutter={16}>
                <Col span={16}>
                    <Bar {...config} />
                </Col>
                <RobotsCard/>
            </Row>
        </div>
    );
};

export default App;
