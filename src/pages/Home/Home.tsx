import React, {useEffect, useState} from 'react';
import {Row, Col, Space} from 'antd';
import {Bar} from "@ant-design/charts";
import RobotsCard from "./dep/RobotsCard";
import {useAppSelector} from "../../hooks/storeHooks";
import DayCalendar from "./dep/DayCalandar";

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
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Bar {...config} />
                </Col>
                <Col style={{padding: 14}} span={12}>
                    <Space>
                        <DayCalendar />
                        <RobotsCard/>
                    </Space>
                </Col>
            </Row>
        </div>
    );
};

export default App;
