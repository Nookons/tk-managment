import React, { useEffect, useState } from 'react';
import { Breadcrumb, Card, Divider, List, Row, Statistic, Table, Tree } from 'antd';
import { useAppSelector } from "../../hooks/storeHooks";
import Col from "antd/es/grid/col";

const App: React.FC = () => {
    const { items } = useAppSelector(state => state.robots); // Retrieve items from the Redux store

    const [reversed, setReversed] = useState<any[]>([]);

    useEffect(() => {
        if (items) {
            const reversedItems = items.slice().reverse(); // Use slice() to avoid mutating the original array
            setReversed(reversedItems);
        }
    }, [items]); // Add items as a dependency

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
                        { title: "ID", dataIndex: "id" },
                        { title: "name", dataIndex: "name" },
                        { title: "Full Date", dataIndex: "full_date" },
                        { title: "code", dataIndex: "code" },
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
