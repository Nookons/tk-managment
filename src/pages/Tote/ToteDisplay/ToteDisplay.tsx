import React from 'react';
import {useAppSelector} from "../../../hooks/storeHooks";
import {Card, Collapse, Descriptions, Row, Skeleton, Tag} from "antd";
import Col from "antd/es/grid/col";
import {FilePdfOutlined, SettingOutlined, ToolOutlined, UploadOutlined, YoutubeOutlined} from "@ant-design/icons";

const ToteDisplay = () => {
    const {totes, loading} = useAppSelector(state => state.totes)

    if (loading) {
        return <Skeleton/>
    }

    return (
        <>
            <Row gutter={16}>
                {totes.map((tote, index) => {

                    return (
                        <Col style={{padding: 8}} span={12}>
                            <Card extra={<a href="#"><UploadOutlined /></a>} title={`📦 ${tote.tote_number}`}>
                                <Descriptions title="">
                                    <Descriptions.Item span={3} label="Last updated">{tote.update_time}</Descriptions.Item>
                                    <Descriptions.Item label="Items count">{tote.item_inside.length}</Descriptions.Item>
                                </Descriptions>
                                <Collapse ghost>
                                    <Collapse.Panel header="Items inside" key="1">
                                        {tote.item_inside.reduce((acc, curr, index) => {
                                            return acc;
                                        }, [])}
                                    </Collapse.Panel>
                                </Collapse>
                            </Card>
                        </Col>
                    )
                })}
            </Row>
        </>
    );
};

export default ToteDisplay;