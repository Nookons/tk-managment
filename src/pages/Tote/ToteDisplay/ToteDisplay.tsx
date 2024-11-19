import React from 'react';
import {useAppSelector} from "../../../hooks/storeHooks";
import {Card, Collapse, Descriptions, QRCode, Row, Skeleton, Space, Tag} from "antd";
import Col from "antd/es/grid/col";
import {FilePdfOutlined, SettingOutlined, ToolOutlined, UploadOutlined, YoutubeOutlined} from "@ant-design/icons";
import {AllToteToPDF, generatePDF} from "../../../utils/PDF/CreatePdf";
import {ITote} from "../../../types/Tote";
import dayjs from "dayjs";
import Button from "antd/es/button";

const ToteDisplay = () => {
    const {totes, loading} = useAppSelector(state => state.totes)

    const pdfClick = (tote: ITote) => {
        generatePDF(tote, `${tote.tote_number}-${dayjs().format("YYYY-MM-DD_HH:mm:ss")}`);
    }
    const allPdfClick = async () => {
        await AllToteToPDF(totes);
    }

    if (loading) {
        return <Skeleton/>
    }

    return (
        <>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Space>
                        <Button onClick={() => allPdfClick()}>All data PDF</Button>
                    </Space>
                </Col>
                {totes.map((tote, index) => {

                    return (
                        <Col style={{padding: 8}}
                             xs={24}
                             xl={12}
                        >
                            <Card extra={<a onClick={() => pdfClick(tote)} href="#"><UploadOutlined /></a>} title={`📦 ${tote.tote_number}`}>
                                <Descriptions title="">
                                    <Descriptions.Item span={3} label="Last updated">{tote.update_time}</Descriptions.Item>
                                    <Descriptions.Item label="Items count">{tote.item_inside.length}</Descriptions.Item>
                                </Descriptions>
                                <Collapse ghost>
                                    <Collapse.Panel header="Items inside" key="1">
                                        {tote.item_inside.map((item, index) => (
                                            <Tag icon={<SettingOutlined />} style={{margin: 4}}><span>{item.code} | {item.name}</span></Tag>
                                        ))}
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