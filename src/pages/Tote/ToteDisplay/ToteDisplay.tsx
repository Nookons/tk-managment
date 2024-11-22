import React, {useState} from 'react';
import {useAppSelector} from "../../../hooks/storeHooks";
import {Card, Collapse, Descriptions, message, Modal, Row, Skeleton, Space, Tag} from "antd";
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
    const {totes, loading} = useAppSelector(state => state.totes);
    const [removeLoading, setRemoveLoading] = useState<{ [key: string]: boolean }>({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTote, setSelectedTote] = useState<ITote | null>(null);

    const pdfClick = (tote: ITote) => {
        generatePDF(tote, `${tote.tote_number}-${dayjs().format("YYYY-MM-DD_HH:mm:ss")}`);
    }

    const allPdfClick = async () => {
        await AllToteToPDF(totes);
    }

    if (loading) {
        return <Skeleton/>
    }

    const showDeleteModal = (tote: ITote) => {
        setSelectedTote(tote);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setSelectedTote(null);
    };

    const onToteRemove = async (tote: ITote) => {
        try {
            setRemoveLoading(prev => ({ ...prev, [tote.tote_number]: true }));

            // Создаём массив промисов для удаления всех элементов внутри `tote`
            const deleteItemPromises = tote.item_inside.map(item =>
                deleteDoc(doc(db, "warehouse", item.id.toString()))
            );

            // Ожидаем завершения удаления всех элементов
            await Promise.all(deleteItemPromises);

            // Удаляем сам `tote` после того, как все элементы удалены
            await deleteDoc(doc(db, "tote_info", tote.tote_number));

            message.success(`${tote.tote_number} removed`);
        } catch (err) {
            err && message.error(err.toString());
        } finally {
            setRemoveLoading(prev => ({ ...prev, [tote.tote_number]: false }));
            handleCancel(); // Закрываем модальное окно
        }
    };

    const confirmDelete = async () => {
        if (selectedTote) {
            await onToteRemove(selectedTote);
        }
    };

    return (
        <>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Space>
                        <Button onClick={allPdfClick}>All data PDF</Button>
                    </Space>
                </Col>
                {totes.map((tote) => {
                    const uniqueItems: { [key: string]: { item: IItem, count: number } } = {};

                    tote.item_inside.forEach(item => {
                        const itemKey = item.name || "unknown";
                        if (uniqueItems[itemKey]) {
                            uniqueItems[itemKey].count += 1;
                        } else {
                            uniqueItems[itemKey] = {item, count: 1};
                        }
                    });

                    return (
                        <Col key={tote.tote_number} style={{padding: 8}} xs={24} xl={12}>
                            <Card
                                extra={
                                    <Space>
                                        <Button onClick={() => pdfClick(tote)}><UploadOutlined/></Button>
                                        <Button
                                            loading={removeLoading[tote.tote_number]}
                                            onClick={() => showDeleteModal(tote)}
                                            type="primary"
                                            danger
                                        >
                                            <CloseCircleOutlined />
                                        </Button>
                                    </Space>
                                }
                                title={`📦 ${tote.tote_number}`}
                            >
                                <Descriptions>
                                    <Descriptions.Item span={3} label="Last updated">{tote.update_time}</Descriptions.Item>
                                    <Descriptions.Item label="Items count">{tote.item_inside.length}</Descriptions.Item>
                                </Descriptions>
                                <Collapse ghost>
                                    <Collapse.Panel header="Items inside" key="1">
                                        {Object.values(uniqueItems).map((el, index) => (
                                            <Tag key={`${el.item.name}-${index}`} style={{margin: 4}} icon={<SettingOutlined/>} color="#333">
                                                <span>{el.item.name} [ {el.count} ]</span>
                                            </Tag>
                                        ))}
                                    </Collapse.Panel>
                                </Collapse>
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            {/* Модальное окно подтверждения удаления */}
            <Modal
                title="Confirm Delete"
                visible={isModalVisible}
                onOk={confirmDelete}
                onCancel={handleCancel}
                okText="Delete"
                cancelText="Cancel"
                confirmLoading={removeLoading[selectedTote?.tote_number || ""]}
            >
                <p>Are you sure you want to delete this tote?</p>
            </Modal>
        </>
    );
};

export default ToteDisplay;
