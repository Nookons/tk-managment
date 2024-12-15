import React, {useEffect, useState} from "react";
import {Divider, Form, message, Space, Table, Button, Row, Card, Badge, Switch} from "antd";
import TextArea from "antd/es/input/TextArea";
import {useForm} from "antd/es/form/Form";
import Col from "antd/es/grid/col";
import TableDrawer from "./TableDrawer/TableDrawer";
import {IError} from "../../types/Error";
import ErrorControl from "./ErrorControl/ErrorControl";
import dayjs from "dayjs";


const Report = () => {
    const [form] = useForm();
    const [current_data, setCurrent_data] = useState<IError[]>([]);

    const [isDrawer, setIsDrawer] = useState<boolean>(false);
    const [isErrorControl, setIsErrorControl] = useState<boolean>(false);

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
                        id: `${workStation}-${time?.startTime}-${dayjs().format("YYYY-MM-DD")}`,
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
        setIsDrawer(true)
    };

    return (
        <Row gutter={[24, 24]}>
            {!isErrorControl
            ?
                <Col span={18}>
                    <Form
                        form={form}
                        name="logParserForm"
                        layout="vertical"
                        initialValues={{remember: true}}
                        onFinish={onFormFinish}
                    >
                        <Row gutter={[4, 4]}>
                            <Col span={24}>
                                <Form.Item>
                                    <Space>
                                        <Button style={{width: "100%"}} type="primary" htmlType="submit">
                                            Submit
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    name="textarea"
                                    rules={[{required: true, message: "Input is required!"}]}
                                >
                                    <TextArea style={{width: "100%"}} autoCapitalize={"words"} rows={18}
                                              placeholder="Paste log entries here..."/>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            :
                <Col span={18}>
                    <ErrorControl />
                </Col>
            }
            <Col span={6}>
                <Divider>Control Menu</Divider>
                <div style={{display: "flex", justifyContent: "flex-start", flexWrap: "wrap"}}>
                    <Form.Item style={{width: "100%"}} label="Error control" name="error_control" valuePropName="checked">
                        <Switch onChange={() => setIsErrorControl(!isErrorControl)} />
                    </Form.Item>
                    <Button type={"primary"} style={{margin: 4}} onClick={() => setIsDrawer(true)}>Open error drawer</Button>
                    <Button type={"primary"} style={{margin: 4}} danger>Remove all errors</Button>
                </div>
            </Col>
            <TableDrawer isDrawer={isDrawer} setIsDrawer={setIsDrawer} current_data={current_data}/>
        </Row>
    );
};

export default Report;
