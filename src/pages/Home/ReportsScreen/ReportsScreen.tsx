import React, {useEffect, useState} from 'react';
import {useReports} from "../../../hooks/Reports/useReports";
import {Button, Card, Col, Descriptions, List, Row, Skeleton} from "antd";
import {IReport} from "../../../types/Reports/Report";

import robotImg from "../../../assets/robot.webp";
import workStationImg from "../../../assets/workStation.jpg";

import UserCard from "./UserCard";
import ChangePartsScreen from "./ChangePartsScreen";
import dayjs from "dayjs";
import ButtonGroup from "antd/es/button/button-group";

const getImg = (type: string) => {
    switch (type) {
        case "robot":
            return robotImg;
        case "workstation":
            return workStationImg
        default:
            return ""
    }
}

const ReportsScreen = () => {
    const {reportsData, loading, error} = useReports();
    const [reversed_data, setReversed_data] = useState<IReport[]>([]);

    useEffect(() => {
        if (reportsData.length) {
            setReversed_data([...reportsData].reverse());
        }
    }, [reportsData]);

    if (loading) {
        return (
            <div>
                <Skeleton active/>
            </div>
        )
    }

    return (
        <List
            header={<div>Reports info screen</div>}
            dataSource={reversed_data}
            renderItem={(item) => {
                const user_id = item.add_person;
                const parts = item.change_parts;

                return (
                    <List.Item>
                        <Card
                            style={{width: "100%"}}
                            extra={
                                <ButtonGroup>
                                    <Button>Close that report</Button>
                                    <Button>Change status</Button>
                                    <Button danger>Remove</Button>
                                </ButtonGroup>
                            }
                            title={`# ${item.id}`}
                        >
                            <Row gutter={[14, 14]}>
                                <Col span={8}>
                                    <img style={{maxWidth: "100%"}} src={getImg(item.type)} alt="Robot image"/>
                                </Col>
                                <Col span={16}>
                                    <Descriptions size={"small"} title={`Unit ID: ${item.unit_id}`} bordered>
                                        <Descriptions.Item span={3} label="⚡ Problem Type">
                                            {item.type}
                                        </Descriptions.Item>
                                        <Descriptions.Item span={3} label="🙍 User who added">
                                            <UserCard user_id={user_id}/>
                                        </Descriptions.Item>
                                        <Descriptions.Item span={3} label="🕙 Add report at">
                                            {item.add_time_string}
                                        </Descriptions.Item>
                                        <Descriptions.Item span={3} label="🕖 Found time">
                                            {dayjs(item.start_time).format('dddd, MMMM DD, YYYY [at] HH:mm:ss')}
                                        </Descriptions.Item>
                                        <Descriptions.Item span={3} label="⭐ Status">
                                            {item.status}
                                        </Descriptions.Item>
                                        <Descriptions.Item span={3} label="💡 Reason">
                                            {item.reason}
                                        </Descriptions.Item>
                                        <Descriptions.Item span={3} label="🔧 Change Parts">
                                            <ChangePartsScreen parts={parts}/>
                                        </Descriptions.Item>
                                    </Descriptions>
                                </Col>
                            </Row>
                        </Card>
                    </List.Item>
                )
            }}
        />
    );
};

export default ReportsScreen;