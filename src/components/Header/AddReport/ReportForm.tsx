import React, {useState} from 'react';
import {DatePicker, Divider, Form, Input, message, Row, Select, Space, TimePicker} from "antd";
import {useForm} from "antd/es/form/Form";
import Button from "antd/es/button";
import Col from "antd/es/grid/col";
import TextArea from "antd/es/input/TextArea";
import UserSelect from "../../userSelect";
import {IUser} from "../../../types/User";
import SelectItems from "../../../pages/Robots/AddBroken/dep/SelectItems";
import {IOption} from "../../../types/Item";
import dayjs from "dayjs";
import {doc, setDoc} from "firebase/firestore";
import {db} from "../../../firebase";
import user from "../../../store/reducers/user";
import {useAppSelector} from "../../../hooks/storeHooks";

const ReportForm = () => {
    const {user} = useAppSelector(state => state.user)
    const format = 'HH:mm';
    const [form] = useForm();

    const [finder_array, setFinder_array] = useState<IUser[]>([]);
    const [repair_array, setRepair_array] = useState<IUser[]>([]);
    const [change_data, setChange_data] = useState<IOption[]>([]);

    const onFormFinish = async (values: any) => {
        const data = {
            ...values,
            id: dayjs().valueOf().toString(),
            finder_array: finder_array,
            repair_array: repair_array,
            change_data: change_data,
            added_person: user,
            key: dayjs().valueOf().toString(),
            added_time: dayjs().toDate(),
            // Convert Moment.js dates to JavaScript Date objects or timestamps
            detection_date: values.detection_date ? values.detection_date.toDate() : null,
            detection_time: values.detection_time ? values.detection_time.toDate() : null,
            solved_date: values.solved_date ? values.solved_date.toDate() : null,
            solved_time: values.solved_time ? values.solved_time.toDate() : null
        };

        // Remove undefined fields from `data`
        Object.keys(data).forEach((key) => {
            if (data[key] === undefined) {
                data[key] = null; // Set undefined values to null or remove them
            }
        });

        try {
            await setDoc(doc(db, "tasks_record", data.id), data);
            console.log(data);
            message.success("Task record saved successfully!");
            onFormClearClick();
            setChange_data([]);
            setRepair_array([]);
            setFinder_array([]);
            window.location.reload();
        } catch (error) {
            console.error("Error saving task record:", error);
            message.error("Failed to save task record.");
        }
    };


    const onFormFinishFailed = (errorInfo: any) => {
        // todo handle form finish fail
    };

    const onFormClearClick = () => {
        form.resetFields();
    };

    return (
        <Form
            form={form}
            name="basic"
            layout="horizontal"
            initialValues={{remember: true}}
            onFinish={onFormFinish}
            onFinishFailed={onFormFinishFailed}
        >
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Divider><span>Main info</span></Divider>
                </Col>
                <Col span={4}>
                    <Form.Item layout={"vertical"} required label="Equipment type" name={"type"}>
                        <Select
                        >
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
                    <Form.Item layout={"vertical"} required label="ID" name="report_id">
                        <Input />
                    </Form.Item>
                </Col>

                <Col span={7}>
                    <Form.Item layout={"vertical"} required label="State" name={"state"}>
                        <Select>
                            <Select.Option value="disable">Disable Removal</Select.Option>
                            <Select.Option value="return">Return to use</Select.Option>
                            <Select.Option value="running">Running and awaiting maintenance</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={5}>
                    <Form.Item layout={"vertical"} required label="Date of Issue Detection" name="detection_date">
                        <DatePicker style={{width: "100%"}}/>
                    </Form.Item>
                </Col>

                <Col span={5}>
                    <Form.Item layout={"vertical"}  required label="Time of Issue Detection" name="detection_time">
                        <TimePicker
                            style={{width: "100%"}}
                            format={format}
                        />
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Divider><span>Task status</span></Divider>
                </Col>

                <Col span={8}>
                    <Form.Item layout={"vertical"} required label="Finder">
                        <UserSelect
                            set_array={setFinder_array}
                        />
                    </Form.Item>
                </Col>

                <Col span={4}>
                    <Form.Item layout={"vertical"} required label="Priority" name="priority">
                        <Select
                        >
                            <Select.Option value="high">High</Select.Option>
                            <Select.Option value="medium">Medium</Select.Option>
                            <Select.Option value="low">Low</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={4}>
                    <Form.Item layout={"vertical"} required label="Task Status" name="task_status">
                        <Select
                        >
                            <Select.Option value="not_started">Not started</Select.Option>
                            <Select.Option value="started">Started</Select.Option>
                            <Select.Option value="finished">Finished</Select.Option>
                            <Select.Option value="observation">Observation</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item layout={"vertical"} label="Task & Issue" name="task_note">
                        <TextArea
                            rows={2}
                        />
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Divider><span>Options to solve (can be missed) </span></Divider>
                </Col>


                <Col span={4}>
                    <Form.Item layout={"vertical"}  required label="Date of Issue Solved" name="solved_date">
                        <DatePicker
                            style={{width: "100%"}}
                        />
                    </Form.Item>
                </Col>

                <Col span={4}>
                    <Form.Item layout={"vertical"}  required label="Time of Issue Solved" name="solved_time">
                        <TimePicker
                            style={{width: "100%"}}
                            format={format}
                        />
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item layout={"vertical"} label="Repair" >
                        <UserSelect set_array={setRepair_array}/>
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item layout={"vertical"} label="Remarks" name="remarks">
                        <TextArea
                            rows={2}
                        />
                    </Form.Item>
                </Col>


                <Col span={24}>
                    <Divider><span>Other options (can be missed) </span></Divider>
                </Col>

                <Col span={2}>
                    <Form.Item required layout={"vertical"} label="SOP" name={"sop"}>
                        <Select>
                            <Select.Option value="yes">Yes</Select.Option>
                            <Select.Option value="no">No</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={6}>
                    <Form.Item required layout={"vertical"} label="Types of repair approaches" name={"item_type"}>
                        <Select>
                            <Select.Option value="replace">Replace with new spare part</Select.Option>
                            <Select.Option value="manual">Manual repair</Select.Option>
                            <Select.Option value="software">Software update</Select.Option>
                            <Select.Option value="observation">Maintain observation</Select.Option>
                            <Select.Option value="swapping">Swapping accessories</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item layout={"vertical"} label="Material name">
                        <SelectItems setChange_data={setChange_data}/>
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item layout={"vertical"} label="Processing Steps" name="processing_steps">
                        <TextArea rows={2}/>
                    </Form.Item>
                </Col>

                <Col style={{marginTop: 24}} span={24}>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                            <Button htmlType="button" onClick={onFormClearClick}>
                                Clear
                            </Button>
                        </Space>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default ReportForm;