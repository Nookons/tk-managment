import React, {useEffect, useState} from 'react';
import {useAppSelector} from "../../../hooks/storeHooks";
import {Card, Collapse, Descriptions, Form, Input, message, Modal, Row, Skeleton, Space, Tag} from "antd";
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
import Search from "antd/es/input/Search";
import {useNavigate} from "react-router-dom";
import {TOTE_INFO_ROUTE} from "../../../utils/const";

const ToteDisplay = () => {
    const navigate = useNavigate();
    const {totes, loading} = useAppSelector(state => state.totes);
    const [removeLoading, setRemoveLoading] = useState<{ [key: string]: boolean }>({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedTote, setSelectedTote] = useState<ITote | null>(null);

    const [filtered_totes, setFiltered_totes] = useState<ITote[]>([]);

    const pdfClick = (tote: ITote) => {
        generatePDF(tote, `${tote.tote_number}-${dayjs().format("YYYY-MM-DD_HH:mm:ss")}`);
    }

    const allPdfClick = async () => {
        await AllToteToPDF(totes);
    }

    useEffect(() => {
        setFiltered_totes(totes)
    }, [totes]);

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
            setRemoveLoading(prev => ({...prev, [tote.tote_number]: true}));

            const deleteItemPromises = tote.item_inside.map(item =>
                deleteDoc(doc(db, "warehouse", item.id.toString()))
            );

            await Promise.all(deleteItemPromises);

            await deleteDoc(doc(db, "tote_info", tote.tote_number));

            message.success(`${tote.tote_number} removed`);
        } catch (err) {
            err && message.error(err.toString());
        } finally {
            setRemoveLoading(prev => ({...prev, [tote.tote_number]: false}));
            handleCancel(); // Закрываем модальное окно
        }
    };

    const confirmDelete = async () => {
        if (selectedTote) {
            await onToteRemove(selectedTote);
        }
    };

    const onSearch = async (value: string) => {
        if (totes) {
            let resultArray: ITote[] = []; // Initialize this once

            totes.forEach(i => {
                let isFound = false;
                const isTote = i.tote_number.toLowerCase().includes(value.toString())

                i.item_inside.forEach(j => {
                    const isName = j.name.toLowerCase().includes(value.toLowerCase());
                    const isCode = j.code.toLowerCase().includes(value.toLowerCase());

                    if (isName || isCode || isTote) {
                        isFound = true;
                    }
                });

                if (isFound) {
                    resultArray.push(i);
                }
            });
            setFiltered_totes(resultArray);
        } else if (value.length === 0) {
            setFiltered_totes(totes);
        }
    };

    const onToteByToteClick = async () => {
        filtered_totes.forEach(tote => {
            generatePDF(tote, `${tote.tote_number}-${dayjs().format("YYYY-MM-DD_HH:mm:ss")}`);
        })
    }


    return (
        <>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Space>
                        <Button onClick={allPdfClick}>All data PDF</Button>
                        <Button onClick={onToteByToteClick}>Tote by Tote PDF</Button>
                        <Search onChange={(event) => onSearch(event.target.value)} style={{width: "100%"}}/>
                    </Space>
                </Col>
                {filtered_totes.map((tote) => {
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
                                        <Button
                                            onClick={() => navigate(`${TOTE_INFO_ROUTE}?id=${tote.tote_number}`)}>Open</Button>
                                        <Button onClick={() => pdfClick(tote)}><UploadOutlined/></Button>
                                        <Button
                                            loading={removeLoading[tote.tote_number]}
                                            onClick={() => showDeleteModal(tote)}
                                            type="primary"
                                            danger
                                        >
                                            <CloseCircleOutlined/>
                                        </Button>
                                    </Space>
                                }
                                title={`📦 ${tote.tote_number}`}
                            >
                                <Descriptions>
                                    <Descriptions.Item span={3}
                                                       label="Last updated">{tote.update_time}</Descriptions.Item>
                                    <Descriptions.Item label="Items count">{tote.item_inside.length}</Descriptions.Item>
                                </Descriptions>

                                <Collapse style={{marginTop: 14}} ghost>
                                    <Collapse.Panel header="Items inside" key="1">
                                        {Object.values(uniqueItems).map((el, index) => (
                                            <Tag key={`${el.item.name}-${index}`} style={{margin: 4, paddingRight: 0}}
                                                 icon={<SettingOutlined/>}>
                                                <span>{el.item.name}
                                                    <span style={{
                                                        backgroundColor: "black",
                                                        padding: "4px 14px",
                                                        color: "white",
                                                        marginLeft: 14,
                                                        borderRadius: "0 4px 4px 0"
                                                    }}>
                                                        {el.count}
                                                    </span>
                                                </span>
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
