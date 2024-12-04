import React, {useEffect, useState} from "react";
import {Divider, Form, message, Space, Table, Button, Row, Card, Badge} from "antd";
import TextArea from "antd/es/input/TextArea";
import {useForm} from "antd/es/form/Form";
import Col from "antd/es/grid/col";
import Text from "antd/es/typography/Text";

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
        const sorted = [...current_data].sort((a, b) => {
            // Преобразуем время в timestamp (если startTime в строковом формате)
            const timeA = new Date(a.startTime).getTime();
            const timeB = new Date(b.startTime).getTime();
            return timeA - timeB;
        });

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
        const match = line.match(/(\d{1,2}:\d{2})(?:-(\d{1,2}:\d{2}))?/); // Извлекаем начальное и конечное время
        if (match) {
            const startTime = match[1]; // Стартовое время
            const endTime = match[2] || null; // Конечное время (может отсутствовать)
            return {startTime, endTime};
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
            {sorted_data.length &&
                <Col span={24}>
                    <Badge style={{margin: "0 14px"}} status="success"/>
                    <Text type="secondary">Success parsed {sorted_data.length} errors</Text>
                </Col>
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
                        {title: "*", dataIndex: ""},
                        {title: "*", dataIndex: ""},
                        {title: "*", dataIndex: ""},
                        {title: "Station Number", dataIndex: "workStation"},
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
