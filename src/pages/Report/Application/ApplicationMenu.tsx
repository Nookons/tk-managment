import React from 'react';
import {Button, Divider, Row, Space} from "antd";
import {DownloadOutlined, InfoOutlined} from "@ant-design/icons";
import Col from "antd/es/grid/col";
import ButtonGroup from "antd/es/button/button-group";

const ApplicationMenu = () => {


    return (
        <Row style={{marginTop: 24}} gutter={[16, 16]}>
            <Divider>Application Menu</Divider>
            <Col span={24}>
                <Space>
                    <span>Current version: 0.0.3</span>
                </Space>
            </Col>
            <Col span={24}>
                <ButtonGroup>
                    <Button type={"primary"} ><DownloadOutlined style={{fontSize: 16}}/> Download</Button>
                    <Button><InfoOutlined style={{fontSize: 16}}/> Info</Button>
                </ButtonGroup>
            </Col>
        </Row>
    );
};

export default ApplicationMenu;