import React from 'react';
import {
    CarryOutOutlined,
    EditOutlined,
    EllipsisOutlined,
    FormOutlined,
    SettingOutlined
} from '@ant-design/icons';
import {Breadcrumb, Card, Divider, Row, Statistic, Tree} from 'antd';
import { useAppSelector } from "../../hooks/storeHooks";
import Col from "antd/es/grid/col";
import Text from "antd/es/typography/Text"; // Adjust this path if needed

const App: React.FC = () => {
    const { items } = useAppSelector(state => state.robots); // Retrieve items from the Redux store

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
                {items.map((item, i) => {

                    return (
                        <Col span={8} key={`col-${item.id}`}>
                            <Card
                                style={{ marginTop: 6 }}
                                title={item.element[1]}
                                actions={[
                                    <SettingOutlined key="setting" />,
                                    <EditOutlined key="edit" />,
                                    <EllipsisOutlined key="ellipsis" />,
                                ]}
                            >
                                <Text type="secondary">{item.full_date}</Text>
                            </Card>
                        </Col>
                    );
                })}
            </Row>
        </div>
    );
};

export default App;
