import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import {Descriptions, Divider, Form, Image, Row, Select, Skeleton, Space} from "antd";
import Text from "antd/es/typography/Text";
import {useForm} from "antd/es/form/Form";
import Button from "antd/es/button";
import Col from "antd/es/grid/col";
import {useAppSelector} from "../../hooks/storeHooks";
import {ITaskRecord} from "../../types/Task";
import dayjs from "dayjs";
import TextArea from "antd/es/input/TextArea";
import SelectItems from "../Robots/AddBroken/dep/SelectItems";
import {IOption} from "../../types/Item";

const Task = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const id = params.get("id");

    const {tasks, loading, error} = useAppSelector(state => state.tasks)

    const [current_task, setCurrent_task] = useState<ITaskRecord | null>( null);

    const [change_parts, setChange_parts] = useState<IOption[]>([]);

    const [form] = useForm();

    useEffect(() => {
        const founded = tasks.find((item) => item.id === id);
        setCurrent_task(founded as ITaskRecord);
    }, [id, tasks]);

    const onFormFinish = (values: any) => {
        // todo handle form finish
    };

    const onFormFinishFailed = (errorInfo: any) => {
        // todo handle form finish fail
    };

    const onFormClearClick = () => {
        form.resetFields();
    }; // Extract the id parameter

    if (loading || !current_task) {
        return <Skeleton />
    }

    return (

        <Form
            form={form}
            name="basic"
            layout="horizontal"
            initialValues={{remember: true}}
            style={{paddingBottom: 24}}
            onFinish={onFormFinish}
            onFinishFailed={onFormFinishFailed}
        >
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Text type="secondary">#{id}</Text>
                </Col>

                <Col span={16}>
                    <Descriptions title="Main task info" bordered>
                        <Descriptions.Item span={3} label="Add Time">
                                {dayjs
                                    .unix(current_task.added_time.seconds) // Конвертируем секунды в Day.js объект
                                    .tz("Europe/Paris") // Преобразуем в нужный часовой пояс (замените на нужный)
                                    .format("dddd, MMMM DD, YYYY [at] HH:mm")
                                }
                        </Descriptions.Item>
                        <Descriptions.Item span={2} label="Add person">
                            {current_task.added_person.email}
                        </Descriptions.Item>
                        <Descriptions.Item  label="Name">
                            {current_task.added_person.first_name} | {current_task.added_person.last_name}
                        </Descriptions.Item>
                    </Descriptions>
                </Col>
                <Col span={8}>
                    <Space>
                        <div>
                            <Divider>Image before</Divider>
                            <Image
                                width={" 100%"}
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs9gUXKwt2KErC_jWWlkZkGabxpeGchT-fyw&s"
                            />
                            <Button style={{width: "100%", marginTop: 14}}>Add / Change</Button>
                        </div>
                        <div>
                            <Divider>Image before</Divider>
                            <Image
                                width={" 100%"}
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs9gUXKwt2KErC_jWWlkZkGabxpeGchT-fyw&s"
                            />
                            <Button style={{width: "100%", marginTop: 14}}>Add / Change</Button>
                        </div>
                    </Space>
                </Col>

                <Col span={4}>
                    <Form.Item layout={"vertical"} required label="State" name={"state"}>
                        <Select defaultValue={current_task.state}>
                            <Select.Option value="disable">Disable Removal</Select.Option>
                            <Select.Option value="return">Return to use</Select.Option>
                            <Select.Option value="running">Running and awaiting maintenance</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={4}>
                    <Form.Item layout={"vertical"} label="priority" name={"priority"}>
                        <Select defaultValue={current_task.priority}>
                            <Select.Option value="high">High</Select.Option>
                            <Select.Option value="medium">Medium</Select.Option>
                            <Select.Option value="low">Low</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Form.Item layout={"vertical"} required label="Task Status" name="task_status">
                        <Select defaultValue={current_task.task_status}>
                            <Select.Option value="not_started">Not started</Select.Option>
                            <Select.Option value="started">Started</Select.Option>
                            <Select.Option value="finished">Finished</Select.Option>
                            <Select.Option value="observation">Observation</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item required layout={"vertical"} label="Types of repair approaches" name={"item_type"}>
                        <Select defaultValue={current_task.item_type}>
                            <Select.Option value="replace">Replace with new spare part</Select.Option>
                            <Select.Option value="manual">Manual repair</Select.Option>
                            <Select.Option value="software">Software update</Select.Option>
                            <Select.Option value="observation">Maintain observation</Select.Option>
                            <Select.Option value="swapping">Swapping accessories</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={2}>
                    <Form.Item required layout={"vertical"} label="SOP" name={"sop"}>
                        <Select>
                            <Select.Option value="yes">Yes</Select.Option>
                            <Select.Option value="no">No</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={12}>
                    <Form.Item style={{marginBottom: 44}} layout={"vertical"} label="Remarks" name="remarks">
                        <TextArea
                            defaultValue={current_task.remarks ? current_task.remarks : ""}
                            rows={2}
                        />
                    </Form.Item>
                </Col>
                
                <Col span={12}>
                    <Form.Item layout={"vertical"} label="Material name">
                        <SelectItems setChange_data={setChange_parts}/>
                    </Form.Item>
                </Col>
                
                <Col span={12}>
                    <Form.Item style={{marginBottom: 44}} layout={"vertical"} label="Processing Steps" name="processing_steps">
                        <TextArea
                            defaultValue={current_task.processing_steps ? current_task.processing_steps : ""}
                            rows={2}
                        />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Finish task
                            </Button>
                            <Button danger type={"primary"} htmlType="button" onClick={onFormClearClick}>
                                Remove task
                            </Button>
                        </Space>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    );
};

export default Task;