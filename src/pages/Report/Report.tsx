// Define the structure of a parsed log entry with optional fields
import {Divider, Form, message, Space, Table} from "antd";
import TextArea from "antd/es/input/TextArea";
import {useForm} from "antd/es/form/Form";
import Button from "antd/es/button";
import React, {useState} from "react";
import {SINGLE_ROBOT} from "../../utils/const";

const arrayTemplate = [
    {title: "The box couldn't go onto the position. Repackage the product.", number: 3}
]

interface IError {
    description: string;
    endTime: string;
    startTime: string;
    stationNumber: string;
}

const Report = () => {
    const [form] = useForm();

    const [current_data, setCurrent_data] = useState<IError[]>([]);

    function parseLogLine(line: string) {
        const lines = line.split("\n");

        const filteredLines = lines.filter(line => line.trim() !== "" && !line.includes("[Photo]"));
        const linesContainingWS = filteredLines.filter(line => /ws/i.test(line));

        const parsedLogs = linesContainingWS.map(line => {
            const match = line.match(/(?:WS\s*(\d+)[\.]?\s*)(.*?)(\d{2}:\d{2})\s*-\s*(\d{2}:\d{2})/i);

            console.log(match);

            if (match) {
                const stationNumber = match[1].trim();  // Номер станции
                const description = match[2].trim();    // Описание события
                const startTime = match[3].trim();      // Время начала
                const endTime = match[4].trim();        // Время окончания

                return {
                    stationNumber,
                    description,
                    startTime,
                    endTime
                };
            }

            return null; // Если не совпало, возвращаем null
        }).filter(log => log !== null);

        console.log(filteredLines);
        console.log(linesContainingWS);
        console.log(parsedLogs);
        setCurrent_data(parsedLogs as IError[]);
    }

    const onFormFinish = (values: any) => {
       parseLogLine(values.textarea)
    };


    return (
        <div style={{ padding: "20px" }}>
            <Table
                size="large"
                columns={[
                    {title: "startTime", dataIndex: "startTime"},
                    {title: "endTime", dataIndex: "endTime"},
                    {title: "*", dataIndex: ""},
                    {title: "*", dataIndex: ""},
                    {title: "*", dataIndex: ""},
                    {title: "stationNumber", dataIndex: "stationNumber"},
                    {title: "*", dataIndex: ""},
                    {title: "description", dataIndex: "description"},
                ]}
                dataSource={current_data}
            />
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
