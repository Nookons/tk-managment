import React, { useEffect, useState } from 'react';
import {Alert, Button, Card, Divider, message, Modal, Progress, Row, Space, Statistic, Tag} from "antd";
import { CaretRightOutlined, DownloadOutlined, InfoOutlined, PauseCircleOutlined } from "@ant-design/icons";
import Col from "antd/es/grid/col";
import ButtonGroup from "antd/es/button/button-group";
import useErrorsFetch from "../../../hooks/useErrorFetch";
import { IError } from "../../../types/Error";
import dayjs from "dayjs";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase";

const ApplicationMenu = () => {
    const [isStarted, setIsStarted] = useState<boolean>(false);

    const { errors_data, loading, error } = useErrorsFetch();
    const [sorted_data, setSorted_data] = useState<IError[]>([]);

    const [program_status, setProgram_status] = useState<any | null>(null);

    useEffect(() => {
        // Сортируем ошибки по времени
        if (errors_data) {
            const sorted = [...errors_data].sort((a, b) => {
                const timeA = dayjs(a.startTime, "YYYY-MM-DD HH:mm").valueOf(); // Convert to timestamp
                const timeB = dayjs(b.startTime, "YYYY-MM-DD HH:mm").valueOf();
                return timeA - timeB;
            });
            setSorted_data(sorted);
        }
    }, [errors_data]);

    useEffect(() => {
        // Подписка на изменения состояния в Firestore
        const unsub = onSnapshot(doc(db, "program_status", "status"), (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                setIsStarted(data.process);
                setProgram_status(data)

                const ref = doc(db, "program_status", "status");

                if (!data.process) {
                    updateDoc(ref, {
                        current_ready: 0,
                    }).catch((error) => {
                        console.error("Ошибка при обновлении данных:", error);
                    });
                }
            }
        });
        return () => unsub(); // Очистка подписки при размонтировании компонента
    }, []);

    const onStartProcessHandle = async () => {
        try {
            const ref = doc(db, "program_status", "status");

            if (program_status.status) {
                // Обновление состояния процесса
                if (isStarted) {
                    await updateDoc(ref, {
                        process: false
                    });
                } else {
                    await updateDoc(ref, {
                        process: true,
                        max_current: errors_data?.length
                    });
                }
            } else {
                message.error("Program is not running")
            }
        } catch (err) {
            console.error("Ошибка при обновлении процесса:", err);
        }
    };

    if (!errors_data) {
        return null; // Не рендерим компонент, если нет данных
    }

    const lastError = sorted_data[sorted_data.length - 1]; // Получаем последний элемент
    const percent = (program_status.current_ready / program_status.max_current) * 100; // Преобразуем в проценты

    const left = program_status.max_current - program_status.current_ready

    return (
        <Row style={{ marginTop: 24 }} gutter={[16, 16]}>
            {/* Модальное окно с прогрессом */}
            <Modal
                open={isStarted}
                title="Program Status"
                footer={() => (
                    <Progress
                        strokeColor={{ "0%": "#108ee9", "100%": "#87d068" }}
                        percent={Number(percent.toFixed(2))} // Это значение и будет 100% при currentValue == maxValue
                        showInfo={true}
                        size="small"
                        status="active"
                    />
                )}
            >
                {program_status.current_item.map((ticket: IError) => (
                    <div style={{margin: 14}}>
                        <h5>Ticket in process: {ticket.workStation}-{ticket.startTime}-{ticket.text}</h5>
                    </div>
                ))}
                <Row gutter={16}>
                    <Col span={12}>
                        <Card size={"small"}>
                            <Statistic title="Left" value={left}/>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card size={"small"}>
                            <Statistic title="All Tickets" value={program_status.max_current}/>
                        </Card>
                    </Col>
                </Row>
            </Modal>

            <Divider>Application Menu</Divider>
            <Row style={{ paddingLeft: 14, width: "100%" }} gutter={[16, 16]}>
                <ButtonGroup>
                    <Button onClick={onStartProcessHandle} danger={isStarted} type="primary">
                        {isStarted ? <PauseCircleOutlined /> : <CaretRightOutlined />}
                    </Button>
                    <Button type="primary">
                        Tickets left
                        <Tag color="processing"><span>📝 {sorted_data.length}</span></Tag>
                    </Button>
                </ButtonGroup>
            </Row>
            <Col span={24}>
                <Space>
                    <span>Current version: 0.0.7</span>
                </Space>
            </Col>
            <Col span={24}>
                <Alert
                    style={{ marginBottom: 14 }}
                    message={<span>The program has been updated to version 0.0.6. This update is available for download here</span>}
                    banner showIcon={false} type="success"
                />
                <ButtonGroup>
                    <Button
                        onClick={() => window.location.href = "https://e.pcloud.link/publink/show?code=XZdKpKZac1AHqbgEp01eWWsAFXmubIiWIdV"}
                        type="primary"><DownloadOutlined style={{ fontSize: 16 }} /> Download</Button>
                    <Button><InfoOutlined style={{ fontSize: 16 }} /> Info</Button>
                </ButtonGroup>
            </Col>
        </Row>
    );
};

export default ApplicationMenu;
