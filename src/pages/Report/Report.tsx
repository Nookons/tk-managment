import React, {useEffect, useState} from "react";
import {Divider, Form, message, Space, Table, Button, Row, Card, Badge} from "antd";
import TextArea from "antd/es/input/TextArea";
import {useForm} from "antd/es/form/Form";
import Col from "antd/es/grid/col";
import Text from "antd/es/typography/Text";
import {doc, setDoc} from "firebase/firestore";
import {db} from "../../firebase";
import dayjs from "dayjs";

interface IError {
    text: string;
    endTime: string;
    startTime: string;
    workStation: string;
}

const Report = () => {
    const [form] = useForm();
    const [current_data, setCurrent_data] = useState<IError[]>([]);

    const [sorted_data, setSorted_data] = useState<IError[]>([]);

    useEffect(() => {
        setSorted_data([]);
        const sorted = [...current_data].sort((a, b) => {
            // Преобразуем время в timestamp (если startTime в строковом формате)
            const timeA = new Date(a.endTime).getTime();
            const timeB = new Date(b.endTime).getTime();
            return timeA - timeB;
        });

        if (current_data) {
            current_data.forEach(el => {
                if (el.workStation && el.startTime) {
                    const date = dayjs().format("YYYY-MM-DD")

                    setDoc(doc(db, "errors", `${el.workStation}-${el.startTime}-${date}`), {
                        ...el
                    });
                } else {
                    message.error(`Couldn't upload ${el.text}.`);
                }
            })
        }

        setSorted_data(sorted);
    }, [current_data]);


    async function parseLogLine(log: string) {
        const lines = log.split("\n").filter(line => line.trim()); // Убираем пустые строки
        const result: IError[] = [];

        lines.forEach(curr => {
            if (curr !== "[Photo]") {
                if (/ws|WS|Ws/.test(curr)) { // Проверяем, содержит ли строка ws, WS или Ws
                    const workStation = parseWorkStation(curr);
                    const time = parseTime(curr);
                    const text = parseText(curr);

                    const error_data = {
                        workStation: workStation,
                        startTime: time?.startTime,
                        endTime: time?.endTime,
                        text: text,
                    }

                    result.push(error_data as IError)
                }
            }
        });

        setCurrent_data(result);
    }

    function parseText(line: string) {
        const withoutWorkStation = line.replace(/WS\.?\s*=?\s*\d+\s*/i, "").trim();
        const withoutTime = withoutWorkStation.replace(/(\d{1,2}:\d{2}(?:-\d{1,2}:\d{2})?)/g, "").trim();
        return withoutTime;
    }

    function parseTime(line: string) {
        const match = line.match(/(\d{1,2}:\d{2})\s*[- ]?\s*(\d{1,2}:\d{2})$/); // Учитываем дефис или пробел между временем
        if (match) {
            const startTime = match[1]; // Стартовое время
            const endTime = match[2]; // Конечное время
            return { startTime, endTime };
        }
        console.log("Временной диапазон не найден.");
        return null;
    }

    function parseWorkStation(line: string) {
        const ws_match = line.match(/WS\.?\s*=?\s*(\d+)/i); // Ищем номер станции
        if (ws_match) {
            return ws_match[1]; // Возвращаем только номер станции
        }
        return null; // Если нет совпадений, возвращаем null
    }


    const onFormFinish = (values: any) => {
        parseLogLine(values.textarea);
    };

    return (
        <Row gutter={[24, 24]}>
            {sorted_data.length ?
                <Col span={24}>
                    <Badge style={{margin: "0 14px"}} status="success"/>
                    <Text type="secondary">Success parsed {sorted_data.length} errors</Text>
                </Col>
                : null
            }
            <Col span={6}>
                <Form
                    form={form}
                    name="logParserForm"
                    layout="vertical"
                    initialValues={{remember: true}}
                    onFinish={onFormFinish}
                >
                    <Form.Item
                        name="textarea"
                        rules={[{required: true, message: "Input is required!"}]}
                    >
                        <TextArea rows={24} placeholder="Paste log entries here..."/>
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Col>
            <Col span={18}>
                <Table
                    size="large"
                    rowKey={(record) => record.workStation}
                    columns={[
                        {title: "Start Time", dataIndex: "startTime"},
                        {title: "End Time", dataIndex: "endTime"},
                        {
                            title: "FB-FD2",
                            dataIndex: "",
                            render: (text) => {
                                // Функция для преобразования времени в минуты
                                const timeToMinutes = (timeStr: string) => {
                                    const [hours, minutes] = timeStr.split(':').map(Number);  // Разбиваем строку на часы и минуты
                                    return hours * 60 + minutes;  // Преобразуем в минуты
                                };

                                let startTimeInMinutes = 0;
                                let endTimeInMinutes = 0;

                                if (text.startTime && text.endTime) {
                                    startTimeInMinutes = timeToMinutes(text.startTime);
                                    endTimeInMinutes = timeToMinutes(text.endTime);
                                }

                                const diffInMinutes = endTimeInMinutes - startTimeInMinutes;

                                return <span>{diffInMinutes}</span>;
                            }
                        },
                        {
                            title: "Issue",
                            dataIndex: "",
                            render: (text) => {
                                return <span style={{color: "red"}}>操作员问题 Worker factors</span>
                            }
                        },
                        {
                            title: "Issue ID 问题编号",
                            dataIndex: "",
                            render: (text) => {
                                return <span style={{color: "red"}}>工作站 Workstation</span>
                            }
                        },
                        {
                            title: "work station",
                            dataIndex: "workStation",
                            render: (text) => {
                                return <span>{text}</span>
                            }
                        },
                        {title: "*", dataIndex: ""},
                        {
                            title: "Description",
                            dataIndex: "text",
                            render: (text) => {
                                return text === "Описание не распарсено" ? <span style={{color: "red"}}>{text}</span> :
                                    <span>{text}</span>
                            }
                        },
                    ]}
                    dataSource={sorted_data}
                    pagination={{
                        pageSize: 100,  // Количество строк на страницу
                        showSizeChanger: false,  // Скрывает возможность смены количества строк на странице
                    }}
                />
            </Col>
        </Row>
    );
};

export default Report;
