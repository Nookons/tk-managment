import React, {useEffect, useState} from "react";
import {Divider, Form, message, Space, Table, Button, Row, Card, Badge, Switch, Alert} from "antd";
import TextArea from "antd/es/input/TextArea";
import {useForm} from "antd/es/form/Form";
import Col from "antd/es/grid/col";
import TableDrawer from "./TableDrawer/TableDrawer";
import {IError} from "../../types/Error";
import ErrorControl from "./ErrorControl/ErrorControl";
import dayjs from "dayjs";
import ApplicationMenu from "./Application/ApplicationMenu";
import {parseText} from "./ParseText";
import {parseTime} from "./ParseTime";


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
                if (/ws|WS|Ws/.test(curr)) {

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
                            <Col span={20}>
                                <Form.Item>
                                    <Space>
                                        <Button style={{width: "100%"}} type="primary" htmlType="submit">
                                            Submit
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item layout={"horizontal"} label="TK Shein Chat" name="switch" valuePropName="checked">
                                    <Switch/>
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Alert message={
                                    <span>
                                        From 00:00 am to 06:00 am time after 06:00 👉 will be equal to yesterday date
                                    </span>
                                } banner/>
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
                    <ErrorControl/>
                </Col>
            }
            <Col span={6}>
                <Divider>Control Menu</Divider>
                <div style={{display: "flex", justifyContent: "flex-start", flexWrap: "wrap"}}>
                    <Space>
                        <Form.Item style={{width: "100%"}} label="Error control" name="error_control"
                                   valuePropName="checked">
                            <Switch onChange={() => setIsErrorControl(!isErrorControl)}/>
                        </Form.Item>
                    </Space>
                    <Button type={"primary"} style={{margin: 4}} onClick={() => setIsDrawer(true)}>Open error
                        drawer</Button>
                    <Button type={"primary"} style={{margin: 4}} danger>Remove all errors</Button>
                </div>
                <ApplicationMenu/>
            </Col>
            <TableDrawer isDrawer={isDrawer} setIsDrawer={setIsDrawer} current_data={current_data}/>
        </Row>
    );
};

export default Report;
