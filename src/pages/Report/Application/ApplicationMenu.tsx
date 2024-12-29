import React from 'react';
import {Alert, Button, Divider, Row, Space} from "antd";
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
                <Alert style={{marginBottom: 14}} message={<span>The programme has been updated to version 0.0.4v. This update is available for download here</span>} banner showIcon={false} type={"success"}/>
                <ButtonGroup>
                    <Button onClick={() => window.location.href = "https://drive.google.com/file/d/1o_Up7CDXvx1c32C18wPfVD2JE-w3SVQo/view"} type={"primary"} ><DownloadOutlined style={{fontSize: 16}}/> Download</Button>
                    <Button><InfoOutlined style={{fontSize: 16}}/> Info</Button>
                </ButtonGroup>
            </Col>
        </Row>
    );
};

export default ApplicationMenu;