import React, {useEffect, useState} from 'react';
import {useForm} from "antd/es/form/Form";
import {DatePicker, Form, Input, Mentions, message, Row, Select, Steps, theme, TimePicker} from "antd";
import Button from "antd/es/button";
import TextArea from "antd/es/input/TextArea";
import dayjs from "dayjs";
import SelectItems from "../../../pages/Robots/AddBroken/dep/SelectItems";
import UserSelect from "../../userSelect";
import {IUser} from "../../../types/User";
import Col from "antd/es/grid/col";
import items from "../../../store/reducers/items";

const ReportForm = () => {
    const [form] = useForm();

    const {token} = theme.useToken();
    const [current, setCurrent] = useState(0);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const format = 'HH:mm';

    const [change_data, setChange_data] = useState<any[]>([]);

    const [founder_array, setFounder_array] = useState<IUser[]>([]);
    const [repair_array, setRepair_array] = useState<IUser[]>([]);


    const onFormFinish = (values: any) => {
        const data = {
            ...values,
            materials: change_data,
            finder: founder_array,
            repair: repair_array
        }

        console.log(data);
    };

    const onFormFinishFailed = (errorInfo: any) => {
        // todo handle form finish fail
    };

    const onFormClearClick = () => {
        form.resetFields();
    };


    const steps = [
        {
            title: 'First',
            content: 'First-content',
        },
        {
            title: 'Second',
            content: 'Second-content',
        },
        {
            title: 'Last',
            content: 'Last-content',
        },
    ];

    const items = steps.map((item) => ({key: item.title, title: item.title}));


    return (
        <Form
            form={form}
            name="basic"
            wrapperCol={{span: 16}}
            layout="horizontal"
            initialValues={{remember: true}}
            onFinish={onFormFinish}
            onFinishFailed={onFormFinishFailed}
        >
            <Row gutter={[16, 16]}>
                <>
                    <Steps current={current} items={items}/>
                    <div style={{marginTop: 24}}>
                        {current < steps.length - 1 && (
                            <Button type="primary" onClick={() => next()}>
                                Next
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button type="primary" onClick={() => message.success('Processing complete!')}>
                                Done
                            </Button>
                        )}
                        {current > 0 && (
                            <Button style={{margin: '0 8px'}} onClick={() => prev()}>
                                Previous
                            </Button>
                        )}
                    </div>
                </>

                <Col span={5}>
                    <Form.Item label="Equipment type">
                        <Select>
                            <Select.Option value="robot">Robot</Select.Option>
                            <Select.Option value="workstation">Work Station</Select.Option>
                            <Select.Option value="charge">Charge Station</Select.Option>
                            <Select.Option value="compressor">Air Compressor</Select.Option>
                            <Select.Option value="vsw">VSW</Select.Option>
                            <Select.Option value="qr">QR Code</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={3}>
                    <Form.Item label="ID" name="id">
                        <Input/>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="State">
                        <Select>
                            <Select.Option value="disable">Disable Removal</Select.Option>
                            <Select.Option value="return">Return to use</Select.Option>
                            <Select.Option value="running">Running and awaiting maintenance</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item label="Task & Issue" name="task">
                        <TextArea rows={4}/>
                    </Form.Item>
                </Col>

                <Col span={4}>
                    <Form.Item layout={"vertical"} label="Date of Issue Detection" name="detection_date">
                        <DatePicker/>
                    </Form.Item>
                </Col>

                <Col span={4}>
                    <Form.Item layout={"vertical"} label="Time of Issue Detection" name="detection_time">
                        <TimePicker defaultValue={dayjs('12:08', format)} format={format}/>
                    </Form.Item>
                </Col>

                <Col span={4}>
                    <Form.Item layout={"vertical"} label="Priority" name="priority">
                        <Select>
                            <Select.Option value="high">High</Select.Option>
                            <Select.Option value="medium">Medium</Select.Option>
                            <Select.Option value="low">Low</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={4}>
                    <Form.Item layout={"vertical"} label="Task Status" name={"task_status"}>
                        <Select>
                            <Select.Option value="not_started">Not started</Select.Option>
                            <Select.Option value="started">Started</Select.Option>
                            <Select.Option value="finished">Finished</Select.Option>
                            <Select.Option value="observation">Observation</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item label="Remarks" name="remarks">
                        <TextArea rows={4}/>
                    </Form.Item>
                </Col>

                <Form.Item label="Finder" name={"finder"}>
                    <UserSelect set_array={setFounder_array}/>
                </Form.Item>

                <Form.Item label="Repair" name={"repair"}>
                    <UserSelect set_array={setRepair_array}/>
                </Form.Item>

                <Form.Item label="SOP" name={"sop"}>
                    <Select>
                        <Select.Option value="yes">Yes</Select.Option>
                        <Select.Option value="no">No</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Types of repair approaches" name={"item_type"}>
                    <Select>
                        <Select.Option value="replace">Replace with new spare part</Select.Option>
                        <Select.Option value="manual">Manual repair</Select.Option>
                        <Select.Option value="software">Software update</Select.Option>
                        <Select.Option value="observation">Maintain observation</Select.Option>
                        <Select.Option value="swapping">Swapping accessories</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item label="Processing Steps" name="processing_steps">
                    <TextArea rows={4}/>
                </Form.Item>

                <Form.Item label="Material name" name={"materials"}>
                    <SelectItems setChange_data={setChange_data}/>
                </Form.Item>
            </Row>

            <Form.Item wrapperCol={{offset: 4, span: 16}}>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
                <Button htmlType="button" onClick={onFormClearClick}>
                    Clear
                </Button>
            </Form.Item>
        </Form>
    );
};

export default ReportForm;