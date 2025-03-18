import React, {useEffect, useMemo, useState} from 'react';
import {useReports} from "../../../hooks/Reports/useReports";
import {Button, Card, Cascader, Col, Descriptions, List, Row, Segmented, Skeleton, Transfer} from "antd";
import {IReport} from "../../../types/Reports/Report";

import robotImg from "../../../assets/robot.webp";
import workStationImg from "../../../assets/workStation.png";

import UserCard from "./UserCard";
import ButtonGroup from "antd/es/button/button-group";
import {
    AlertOutlined,
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
    EyeOutlined,
    FileDoneOutlined, LoadingOutlined, SafetyOutlined,
} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {REPORT_OVERVIEW} from "../../../utils/const";
import {TransferDirection} from "antd/es/transfer";

const getImg = (type: string) => {
    switch (type) {
        case "robot":
            return robotImg;
        case "workStation":
            return workStationImg
        default:
            return ""
    }
}

const getStatus = (status: string) => {
    switch (status) {
        case "Founded":
            return <AlertOutlined style={{color: "rgba(255,0,0,1)", marginLeft: 8}}/>
        case "Observation":
            return <EyeOutlined style={{color: "rgb(255,136,0)", marginLeft: 8}}/>
        case "Process":
            return <LoadingOutlined style={{color: "rgb(0,225,255)", marginLeft: 8}}/>
        case "Completed":
            return <SafetyOutlined style={{color: "rgb(43,161,0)", marginLeft: 8}}/>
        default:
            return ""
    }
}

const ReportsScreen = () => {
    const navigate = useNavigate();
    const {reportsData, loading, error} = useReports();
    const [sorted_data, setSorted_data] = useState<IReport[]>([]);

    const [filter_value, setFilter_value] = useState<string>("All");

    useEffect(() => {
        if (reportsData.length) {
            if (filter_value !== 'All') {
                const filtered = reportsData.filter((item) => item.status === filter_value);
                const sorted = filtered.sort((a, b) => b.add_time - a.add_time);
                setSorted_data(sorted)
            } else {
                const sorted = reportsData.sort((a, b) => b.add_time - a.add_time);
                setSorted_data(sorted)
            }
        }
    }, [reportsData, filter_value]);

    const reportClickHandle = (id: number) => {
        const refactored_id = id.toString();
        navigate(`${REPORT_OVERVIEW}?id=${refactored_id}`)
    }

    if (loading) {
        return (
            <div>
                <Skeleton active/>
            </div>
        )
    }

    return (
        <>
            <Segmented<string>
                options={['Process', 'Observation', 'Founded', 'Completed', 'All']}
                defaultValue={'All'}
                value={filter_value}
                onChange={(value) => {
                    setFilter_value(value); // string
                }}
            />
            {sorted_data.map(item => {
                const user_id = item.add_person;

                return (
                    <Card
                        bordered={false}
                        style={{width: "100%", marginTop: 14}}
                        extra={
                            <ButtonGroup>
                                <Button onClick={() => reportClickHandle(item.id)}><EyeOutlined/></Button>
                                <Button><EditOutlined/></Button>
                                <Button type={"primary"}><FileDoneOutlined/></Button>
                                <Button type={"primary"} danger><DeleteOutlined/></Button>
                            </ButtonGroup>
                        }
                        title={`# ${item.id}`}
                    >
                        <Row gutter={[14, 14]}>
                            <Col span={4}>
                                <img style={{maxWidth: "100%"}} src={getImg(item.type)} alt="Robot image"/>
                            </Col>
                            <Col span={20}>
                                <Descriptions size={"small"} title={`Unit ID: ${item.unit_id}`} bordered>
                                    <Descriptions.Item span={3} label="🙍 User who added">
                                        <UserCard user_id={user_id}/>
                                    </Descriptions.Item>
                                    <Descriptions.Item span={3} label="🕙 Add report at">
                                        {item.add_time_string}
                                    </Descriptions.Item>
                                    <Descriptions.Item span={3} label="⭐ Status">
                                        {item.status}  {getStatus(item.status)}
                                    </Descriptions.Item>
                                    <Descriptions.Item span={3} label="💡 Reason">
                                        {item.reason}
                                    </Descriptions.Item>
                                </Descriptions>
                            </Col>
                        </Row>
                    </Card>
                )
            })}
        </>
    );
};

export default ReportsScreen;