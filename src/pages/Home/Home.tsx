import React, { useEffect, useState } from 'react';
import { Card, Divider, Row, Statistic, Table } from 'antd';
import { useAppSelector } from "../../hooks/storeHooks";
import Col from "antd/es/grid/col";
import {useNavigate} from "react-router-dom";
import {TOTE_INFO_ROUTE} from "../../utils/const";

const App: React.FC = () => {
    const navigate = useNavigate();
    const { items } = useAppSelector(state => state.robots); // Retrieve items from the Redux store

    const [reversed, setReversed] = useState<any[]>([]);

    useEffect(() => {
        if (items) {
            const reversedItems = items.slice().reverse(); // Use slice() to avoid mutating the original array
            setReversed(reversedItems);
        }
    }, [items]); // Add items as a dependency

    const onToteClick = (tote: string) => {
        navigate(`${TOTE_INFO_ROUTE}?id=${tote}`);
    };

    return (
        <div>
            <Row gutter={16}>
                <Col span={12}>
                    <Card>
                        <Statistic title="Items in Warehouse" value={items.length} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <Statistic title="Robots to repair" value={0} />
                    </Card>
                </Col>
            </Row>
            <Divider>Items list</Divider>
            <Row gutter={16}>
                <Table
                    style={{ width: "100%" }}
                    columns={[
                        {
                            title: "ID",
                            dataIndex: "id",
                            key: "id",
                            render: (text) => <a>{text}</a>,
                        },
                        {
                            title: "Uniq number",
                            dataIndex: "code",
                            key: "code",
                            render: (text) => <a>{text}</a>,
                        },
                        {
                            title: "Place",
                            dataIndex: "box_number",
                            key: "box_number",
                            render: (text) => <a onClick={() => onToteClick(text)}>{text}</a>,
                        },
                        { title: "Name", dataIndex: "name" },
                        { title: "Add Date", dataIndex: "full_date" },
                        { title: "Timestamp", dataIndex: "timestamp" },
                    ]}
                    dataSource={reversed}
                    rowKey="id" // Use a unique key if available for React optimization
                />
            </Row>
        </div>
    );
};

export default App;
