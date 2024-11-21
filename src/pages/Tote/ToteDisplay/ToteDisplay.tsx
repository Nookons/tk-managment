import React, {useState} from 'react';
import {useAppSelector} from "../../../hooks/storeHooks";
import {Card, Collapse, Descriptions, message, QRCode, Row, Skeleton, Space, Statistic, Tag} from "antd";
import Col from "antd/es/grid/col";
import {
    CloseCircleOutlined,
    SettingOutlined,
    UploadOutlined,
} from "@ant-design/icons";
import {AllToteToPDF, generatePDF} from "../../../utils/PDF/CreatePdf";
import {ITote} from "../../../types/Tote";
import dayjs from "dayjs";
import Button from "antd/es/button";
import {IItem} from "../../../types/Item";
import {deleteDoc, doc} from "firebase/firestore";
import {db} from "../../../firebase";

const ToteDisplay = () => {
    const {totes, loading} = useAppSelector(state => state.totes)

    const [isRemoving, setIsRemoving] = useState<boolean>(false);

    const pdfClick = (tote: ITote) => {
        generatePDF(tote, `${tote.tote_number}-${dayjs().format("YYYY-MM-DD_HH:mm:ss")}`);
    }
    const allPdfClick = async () => {
        await AllToteToPDF(totes);
    }

    if (loading) {
        return <Skeleton/>
    }

    const onToteRemove = async (tote: ITote) => {
        try {
            setIsRemoving(true);
            for (const item of tote.item_inside) {
                await deleteDoc(doc(db, "warehouse", item.id.toString()));
            }
            await deleteDoc(doc(db, "tote_info", tote.tote_number));
            message.success(`${tote.tote_number} removed`)
            setIsRemoving(false);
        } catch (err) {
            err && message.error(err.toString());
            setIsRemoving(false);
        }
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
                    const uniqueItems: { [key: string]: { item: IItem, count: number } } = {};

                    tote.item_inside.forEach(item => {
                        const itemKey = item.name || "unknown";

                        if (uniqueItems[itemKey] && uniqueItems[itemKey].count > 0) {
                            uniqueItems[itemKey].count += 1;
                        } else {
                            uniqueItems[itemKey] = {item, count: 1};
                        }
                    })

                    return (
                        <Col style={{padding: 8}}
                             xs={24}
                             xl={12}
                        >
                            <Card
                                extra={
                                    <Space>
                                        <Button onClick={() => pdfClick(tote)}><UploadOutlined/></Button>
                                        <Button loading={isRemoving} onClick={() => onToteRemove(tote)} type={"primary"} danger
                                                href="#"><CloseCircleOutlined/></Button>
                                    </Space>
                                } title={`📦 ${tote.tote_number}`}>
                                <Descriptions title="">
                                    <Descriptions.Item span={3}
                                                       label="Last updated">{tote.update_time}</Descriptions.Item>
                                    <Descriptions.Item label="Items count">{tote.item_inside.length}</Descriptions.Item>
                                </Descriptions>
                                <Collapse ghost>
                                    <Collapse.Panel header="Items inside" key="1">
                                        {Object.values(uniqueItems).map((el, index) => (
                                            <Tag style={{margin: 4}} icon={<SettingOutlined/>} color="#333">
                                                <span>{el.item.name} [ {el.count} ]</span>
                                            </Tag>
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