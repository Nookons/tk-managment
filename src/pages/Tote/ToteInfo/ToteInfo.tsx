import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import {
    Descriptions,
    Row,
    Col,
    Spin,
    Alert,
    Divider,
    Card,
    Tag,
    message,
    Space,
    Collapse, Timeline, TabsProps, Tabs
} from "antd";
import {useAppSelector} from "../../../hooks/storeHooks";
import {ITote} from "../../../types/Tote";
import {IItem} from "../../../types/Item";
import Button from "antd/es/button";
import ButtonGroup from "antd/es/button/button-group";
import {DeleteOutlined, FilePdfOutlined, SmileOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import {generatePDF} from "../../../utils/PDF/CreatePdf";
import UserCard from "./UserCard";
import Text from "antd/es/typography/Text";
import {UseOneFromTote} from "../../../utils/Tote/UseOne";
import ToteGraph from "./ToteGraph";
import ToteHistory from "./ToteHistory";

const ToteInfo = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const toteId = params.get("id");

    const user = useAppSelector(state => state.user.user)

    const [currentTote, setCurrentTote] = useState<ITote | null>(null);
    const [uniqueItems, setUniqueItems] = useState<{ [key: string]: { item: IItem, count: number } }>({});

    const {totes, loading, error} = useAppSelector(state => state.totes);

    useEffect(() => {
        const found = totes.find((item) => item.tote_number === toteId);
        if (found) {
            setCurrentTote(found);
        }
    }, [totes, toteId]);

    useEffect(() => {
        if (currentTote) {
            const itemCounts: { [key: string]: { item: IItem, count: number } } = {};
            currentTote.item_inside.forEach(item => {
                const itemKey = item.name || "unknown";
                if (itemCounts[itemKey]) {
                    itemCounts[itemKey].count += 1;
                } else {
                    itemCounts[itemKey] = {item, count: 1};
                }
            });
            setUniqueItems(itemCounts);
        }
    }, [currentTote]);

    if (!user) {
        return null
    }

    if (loading) {
        return <Spin size="large"/>;
    }

    if (error) {
        return <Alert message="Error" description="Failed to load totes data" type="error"/>;
    }

    const onItemClick = async (item: IItem, type: string) => {
        switch (type) {
            case "useOne":
                message.info(`Using one of ${item.name}`);
                const results = UseOneFromTote(item, toteId, user);
                console.log(results);
                break;
            case "useAll":
                message.info(`Using all of ${item.name}`);
                break;
            case "setCount":
                message.info(`Setting count for ${item.name}`);
                break;
            case "delete":
                message.info(`Deleting ${item.name}`);
                break;
            default:
                message.info("Unknown action");
        }
    }


    if (!currentTote || !toteId) {
        return null;
    }

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: <span>Tote Graph</span>,
            children: <ToteGraph currentTote={currentTote}/>,
        },
        {
            key: '2',
            label: <span>Tote History</span>,
            children: <ToteHistory toteId={toteId}/>,
        },
    ];

    return (
        <Row gutter={[16, 16]}>
            <Col md={24} xl={7}>
                <Descriptions title={`📦 Tote ID: ${toteId}`} bordered>
                    <Descriptions.Item span={3} label="ID">{currentTote?.id}</Descriptions.Item>
                    <Descriptions.Item span={3} label="Update Time">{currentTote?.update_time}</Descriptions.Item>
                    <Descriptions.Item span={3} label="Updated By">{currentTote?.updated_by}</Descriptions.Item>
                    <Descriptions.Item span={3} label="Actions">
                        <ButtonGroup>
                            <Button type="primary">Add Item Here</Button>
                            <Button
                                onClick={() => generatePDF(currentTote, `${currentTote?.tote_number}-${dayjs().format("YYYY-MM-DD HH-mm-ss")}`)}><FilePdfOutlined/></Button>
                        </ButtonGroup>
                    </Descriptions.Item>
                </Descriptions>

                <Tabs defaultActiveKey="1" items={items} />
            </Col>
            <Col md={24} xl={17}>
                <Divider>Items in this Tote:</Divider>
                <Row gutter={[8, 8]}>
                    {Object.values(uniqueItems).map((el) => {
                        const that_array = currentTote?.item_inside.filter(item => item.code === el.item.code);

                        return (
                            <Col key={el.item.code} xs={24} md={12} xl={12}>
                                <Card title={<span>{el.item.name} <Tag
                                    style={{marginLeft: 14}}>🔧 {el.count}</Tag></span>}>
                                    <Divider><Text type="secondary">{el.item.code}</Text></Divider>
                                    <ButtonGroup>
                                        <Button onClick={() => onItemClick(el.item, "useOne")} type="primary">Use
                                            one</Button>
                                        <Button onClick={() => onItemClick(el.item, "useAll")}>Use All</Button>
                                        <Button onClick={() => onItemClick(el.item, "setCount")}>Set count</Button>
                                        <Button onClick={() => onItemClick(el.item, "delete")} danger><DeleteOutlined/></Button>
                                    </ButtonGroup>

                                    <Collapse style={{marginTop: 14}} ghost>
                                        <Collapse.Panel style={{width: "100%"}} header="Items Data" key="1">
                                            {that_array && that_array.map(that => (
                                                <Tag key={that.id} style={{margin: 4, backgroundColor: "white"}}>
                                                    <Space direction={"vertical"}>
                                                        <Text type="secondary" style={{
                                                            fontWeight: 600,
                                                            fontSize: 12
                                                        }}>➕ {that.full_date}</Text>
                                                        <UserCard user={that.user}/>
                                                    </Space>
                                                </Tag>
                                            ))}
                                        </Collapse.Panel>
                                    </Collapse>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            </Col>
        </Row>
    );
};

export default ToteInfo;

