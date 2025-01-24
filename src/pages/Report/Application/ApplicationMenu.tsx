import React, {useEffect, useState} from 'react';
import {Alert, Button, Divider, message, Progress, Row, Space, Tag} from "antd";
import {CaretRightOutlined, DownloadOutlined, InfoOutlined, PauseCircleOutlined} from "@ant-design/icons";
import Col from "antd/es/grid/col";
import ButtonGroup from "antd/es/button/button-group";
import useErrorsFetch from "../../../hooks/useErrorFetch";
import {IError} from "../../../types/Error";
import dayjs from "dayjs";

const ApplicationMenu = () => {
    const [isStarted, setIsStarted] = useState<boolean>(false);

    const {errors_data, loading, error} = useErrorsFetch();
    const [sorted_data, setSorted_data] = useState<IError[]>([]);

    useEffect(() => {
        if (errors_data) {
            setSorted_data([]);
            const sorted = [...errors_data].sort((a, b) => {
                const timeA = dayjs(a.startTime, "YYYY-MM-DD HH:mm").valueOf(); // Convert to timestamp
                const timeB = dayjs(b.startTime, "YYYY-MM-DD HH:mm").valueOf(); // Convert to timestamp

                return timeA - timeB;
            });
            setSorted_data(sorted);
        }
    }, [errors_data]);

    const onStartProcessHandle = async () => {
        
    }


    if (!errors_data) {
        return null
    }

    return (
        <Row style={{marginTop: 24}} gutter={[16, 16]}>
            <Divider>Application Menu</Divider>
            <Row style={{paddingLeft: 14, width: "100%"}} gutter={[16, 16]}>
                <ButtonGroup>
                    <Button onClick={() => setIsStarted(!isStarted)} danger={isStarted} type={"primary"}>{isStarted ?
                        <PauseCircleOutlined/> : <CaretRightOutlined/>}</Button>
                    <Button type={"primary"}>Tickets left <Tag color={"processing"}><span>📝 {sorted_data.length}</span></Tag></Button>
                </ButtonGroup>
                <Col span={24}>
                    <Tag><span>In process: WS {sorted_data[0]?.workStation} {sorted_data[0]?.startTime.slice(10)}-{sorted_data[0]?.endTime.slice(10)} {sorted_data[0]?.text.slice(0,15)}...</span></Tag>
                </Col>
            </Row>
            <Col span={24}>
                <Space>
                    <span>Current version: 0.0.6</span>
                </Space>
            </Col>
            <Col span={24}>
                <Alert style={{marginBottom: 14}}
                       message={<span>The programme has been updated to version 0.0.6v. This update is available for download here</span>}
                       banner showIcon={false} type={"success"}/>
                <ButtonGroup>
                    <Button
                        onClick={() => window.location.href = "https://e.pcloud.link/publink/show?code=XZdKpKZac1AHqbgEp01eWWsAFXmubIiWIdV"}
                        type={"primary"}><DownloadOutlined style={{fontSize: 16}}/> Download</Button>
                    <Button><InfoOutlined style={{fontSize: 16}}/> Info</Button>
                </ButtonGroup>
            </Col>
        </Row>
    );
};

export default ApplicationMenu;