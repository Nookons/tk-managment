import React, { useState } from "react";
import {Divider, Form, message, Space, Table, Button, Row, Card} from "antd";
import TextArea from "antd/es/input/TextArea";
import { useForm } from "antd/es/form/Form";

interface IError {
    description: string;
    endTime: string;
    startTime: string;
    stationNumber: string;
}

const Report = () => {
    const [form] = useForm();
    const [current_data, setCurrent_data] = useState<IError[]>([]);
    const [cant_parse_array, setCant_parse_array] = useState<string[]>([]);

    async function OtherParse(log: string[]) {
        const parsedLogs: IError[] = [];
        const unparsed: string[] = [];
        const regex = /(?:Ws|WS)\s*(\d{4})\s*(.*?)(?:\s*Solution:\s*(.*?))?\s*(\d{1,2}:\d{2})\s*[-–;]?\s*(\d{1,2}:\d{2})/i;

        log.forEach((line, index) => {
            const match = line.match(regex);

            if (match) {
                const stationNumber = match[1]?.trim(); // Номер станции
                const description = match[2]?.trim() || "Описание не распарсено"; // Описание
                const solution = match[3]?.trim() || ""; // Решение (если есть)
                const startTime = match[4]?.trim(); // Время начала
                const endTime = match[5]?.trim(); // Время окончания

                parsedLogs.push({
                    stationNumber,
                    description: solution ? `${description}. Solution: ${solution}` : description, // Объединяем описание и решение
                    startTime,
                    endTime,
                });
            } else {
                unparsed.push(line)
                console.warn(`Line ${index + 1} could not be parsed: ${line}`);
            }
        });
        return [parsedLogs, unparsed];
    }

    async function parseLogLine(log: string) {
        const lines = log.split("\n").filter(line => line.trim()); // Убираем пустые строки
        const parsedLogs: IError[] = [];
        const unparsedLines: string[] = [];

        // Универсальное регулярное выражение
        const regex = /(?:Safe mode\.\s*)?(.*?Solution:.*?)?\s*(?:Ws\s*=?\s*(\d{4}))[.,]?\s*(\d{1,2}:\d{2})\s*[-–;]?\s*(\d{1,2}:\d{2})/i;

        lines.forEach((line, index) => {
            const match = line.match(regex);

            if (match) {
                const description = (match[1]?.trim() || "Описание не распарсено").replace(/\s+/g, " "); // Описание
                const stationNumber = match[2]?.trim(); // Номер станции
                const startTime = match[3]?.trim(); // Время начала
                const endTime = match[4]?.trim(); // Время окончания

                parsedLogs.push({
                    stationNumber,
                    description,
                    startTime,
                    endTime,
                });
            } else {
                console.warn(`Line ${index + 1} could not be parsed: ${line}`);
                unparsedLines.push(line); // Сохраняем непарсенные строки
            }
        });

        const [parsed, unparsed] = await OtherParse(unparsedLines)

        if (parsed.length) {
            parsed.forEach(el => {
                parsedLogs.push(el as IError)
            })
        }

        setCant_parse_array(unparsed as string[]);
        setCurrent_data(parsedLogs); // Сохраняем разобранные данные в состояние
    }

    const onFormFinish = (values: any) => {
        parseLogLine(values.textarea);
    };

    return (
        <div style={{ padding: "20px" }}>
            <Table
                size="large"
                rowKey={(record) => record.stationNumber}
                columns={[
                    { title: "Start Time", dataIndex: "startTime" },
                    { title: "End Time", dataIndex: "endTime" },
                    { title: "*", dataIndex: "" },
                    { title: "*", dataIndex: "" },
                    { title: "*", dataIndex: "" },
                    { title: "Station Number", dataIndex: "stationNumber" },
                    { title: "*", dataIndex: "" },
                    {
                        title: "Description",
                        dataIndex: "description",
                        render: (text) => {
                            return text === "Описание не распарсено" ?<span style={{color: "red"}}>{text}</span> : <span>{text}</span>
                        }},
                ]}
                dataSource={current_data}
            />
            {cant_parse_array.length > 0 &&
                <Row gutter={[16, 16]}>
                    <Card style={{width: "100%"}} title="Logs what i can't parse">
                        {cant_parse_array.map((item) => (
                            <div>
                                {item}
                            </div>
                        ))}
                    </Card>
                </Row>
            }
            <Form
                form={form}
                name="logParserForm"
                layout="vertical"
                initialValues={{ remember: true }}
                onFinish={onFormFinish}
            >
                <Divider>Please paste error logs below</Divider>
                <Form.Item
                    name="textarea"
                    rules={[{ required: true, message: "Input is required!" }]}
                >
                    <TextArea rows={10} placeholder="Paste log entries here..." />
                </Form.Item>
                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Report;
