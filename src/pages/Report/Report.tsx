import React, {useState} from "react";
import {Divider, Form, Space, Button, Row, Switch, Alert, message} from "antd";
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
import ButtonGroup from "antd/es/button/button-group";
import {collection, deleteDoc, doc, onSnapshot, query} from "firebase/firestore";
import {db} from "../../firebase";


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
                if (/VSW|vsw|Vsw/.test(curr)) {
                    const ws_match = curr.split(".")
                    const vsw_match = ws_match[0]
                        .replace("VSW ", "")
                        .replace("Vsw ", "")
                        .replace("vsw ", "")
                        .split("-")

                    const vsw_number = `${vsw_match[0]}-${vsw_match[1]}`
                    const ws_number = `${vsw_match[2]}`

                    const time = parseTime(ws_match[2])

                    const error_data = {
                        workStation: ws_number,
                        vsw: vsw_number,
                        isVsw: true,
                        startTime: time?.startTime,
                        endTime: time?.endTime,
                        id: `${vsw_number}-${time?.startTime}-${dayjs().format("YYYY-MM-DD")}`,
                        text: ws_match[1],
                    }

                    result.push(error_data as IError)
                }

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

    const onClearHandle = () => {
        form.setFieldValue("textarea", "");
    }

    const onRemoveAllHandle = async () => {
        const q = query(collection(db, "errors"));
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const errors: any = [];

            querySnapshot.forEach((doc) => {
                errors.push(doc);
            });

            if (errors.length > 0) {
                for (const docSnapshot of errors) {
                    const docId = docSnapshot.id;
                    await deleteDoc(doc(db, "errors", docId));
                }
                console.log('All documents deleted');
            }

            unsubscribe();
        });
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
                        onFinish={onFormFinish}
                    >
                        <Row gutter={[14, 14]}>
                            <Col span={4}>
                                <Form.Item>
                                    <Space>
                                        <ButtonGroup>
                                            <Button type="primary" htmlType="submit">Submit</Button>
                                            <Button onClick={onClearHandle}>Clear</Button>
                                        </ButtonGroup>
                                    </Space>
                                </Form.Item>
                            </Col>
                            <Col span={20}>
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
                <ButtonGroup>
                    <Button type={"primary"} onClick={() => setIsDrawer(true)}>Open error drawer</Button>
                    {isErrorControl &&
                        <Button onClick={onRemoveAllHandle} type={"primary"} danger>Remove all errors</Button>}
                </ButtonGroup>
                <Form.Item style={{width: "100%", marginTop: 14}} label="Error control" name="error_control"
                           valuePropName="checked">
                    <Switch onChange={() => setIsErrorControl(!isErrorControl)}/>
                </Form.Item>
                <ApplicationMenu/>
            </Col>
            <TableDrawer isDrawer={isDrawer} setIsDrawer={setIsDrawer} current_data={current_data}/>
        </Row>
    );
};

export default Report;
