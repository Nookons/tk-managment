import React, {useEffect, useState} from 'react';
import {Card, Divider, Row, Statistic, Table} from 'antd';
import {useAppSelector} from "../../hooks/storeHooks";
import Col from "antd/es/grid/col";
import {useNavigate} from "react-router-dom";
import {TOTE_INFO_ROUTE, UNIQ_NUMBER_ROUTE} from "../../utils/const";
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";
import {ITote} from "../../types/Tote";

const App: React.FC = () => {
    const navigate = useNavigate();
    const {items} = useAppSelector(state => state.items); // Retrieve items from the Redux store
    const {totes} = useAppSelector(state => state.totes); // Retrieve items from the Redux store

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

    const onUniqNumberClick = (tote: string) => {
        navigate(`${UNIQ_NUMBER_ROUTE}?id=${tote}`);
    };

    let totes_count = totes.length;
    const [fullTotes, setFullTotes] = useState(0);

    useEffect(() => {
        const count = totes.reduce((acc, el) => {
            return acc + (el.item_inside.length > 0 ? 1 : 0);
        }, 0);

        setFullTotes(count);
    }, [totes]);

    return (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Card>
                        <Statistic title="Items in Warehouse" value={items.length}/>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Row gutter={16}>
                            <Statistic title="Totes in warehouse" value={totes.length}/>
                        </Row>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card>
                        <Statistic title="Robots to repair" value={0}/>
                    </Card>
                </Col>
            </Row>
            <Divider>Items list</Divider>
            <Row gutter={16}>
                <Table
                    style={{width: "100%"}}
                    columns={[
                        {
                            title: "Uniq number",
                            dataIndex: "code",
                            key: "code",
                            render: (text) => <a onClick={() => onUniqNumberClick(text)}>{text}</a>,
                        },
                        {
                            title: "Place",
                            dataIndex: "box_number",
                            key: "box_number",
                            render: (text) => <a onClick={() => onToteClick(text)}>📦 {text}</a>,
                        },
                        {
                            title: "Name",
                            dataIndex: "name",
                            key: "name",
                            render: (text) => <Text strong>{text}</Text>,
                        },
                        {
                            title: "Add Date",
                            dataIndex: "full_date",
                            key: "full_date",
                            render: (text) => <Text type="secondary">{text}</Text>,
                        },
                    ]}
                    dataSource={reversed}
                    rowKey="id" // Use a unique key if available for React optimization
                >
                </Table>
            </Row>
        </div>
    );
};

export default App;
