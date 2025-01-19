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
import {match} from "node:assert";


const Report = () => {
    const [form] = useForm();
    const [current_data, setCurrent_data] = useState<IError[]>([]);

    const [isDrawer, setIsDrawer] = useState<boolean>(false);
    const [isErrorControl, setIsErrorControl] = useState<boolean>(false);

    async function parseLogLine(log: string) {
        const stringArray = log.trim().split('\n');  // Removes newline at the end
        const result_array: IError[] = [];

        stringArray.forEach(line => {
            const refactored_line = line.toLowerCase();

            if (refactored_line.length > 1 && refactored_line !== "[Photo]" && (refactored_line.includes("ws") || refactored_line.includes("vsw"))) {
                const regexWs = /(?:ws|vsw)\s*([\d\-]+)\b/i;
                const matchWs = refactored_line.match(regexWs);

                const regexTime = /(\d{1,2}:\d{2}[- ]*\d{1,2}:\d{2})/;
                const matchTime = line.match(regexTime);

                let error_text = refactored_line.replace(/(?:ws|vsw)\s*[\d\-]+(?:\s*=\s*\d+)?/i, ''); // Убираем номер станции
                error_text = error_text.replace(/\d{1,2}:\d{2}[- ]*\d{1,2}:\d{2}/, '').trim(); // Убираем время и удаляем пробелы в начале и конце
                error_text = error_text.replace(".", "").replace(",", "");  // Выводим только текст ошибки

                const time = matchTime ? matchTime[1].trim() : "None"

                if (matchWs && matchWs[0]?.includes("vsw")) {
                    const trimed = matchWs[1].split("-")
                    const time_local = parseTime(time)

                    const data = {
                        vsw: `A-${trimed[0]}`,
                        workStation: trimed[1],
                        id: `${time_local?.startTime}-${matchWs[1]}`,
                        startTime: time_local?.startTime,
                        endTime: time_local?.endTime,
                        text: parseText(error_text),
                        isVsw: true,
                    }

                    result_array.push(data as IError)
                } else if (matchWs) {
                    const time_local = parseTime(time)

                    const data = {
                        workStation: matchWs[1],
                        isVsw: false,
                        id: `${time_local?.startTime}-${matchWs[1]}`,
                        startTime: time_local?.startTime,
                        endTime: time_local?.endTime,
                        text: parseText(error_text),
                    }

                    result_array.push(data as IError)
                }
            }
        })

        setCurrent_data(result_array);
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
