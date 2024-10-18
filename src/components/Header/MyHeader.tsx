import React, {useState} from 'react';
import {Cascader, Col, Divider, Drawer, Form, Input, InputNumber, message, Row, Space} from "antd";
import Button from "antd/es/button";
import {FileAddOutlined, SearchOutlined} from "@ant-design/icons";
import {doc, setDoc} from 'firebase/firestore';
import {db} from "../../firebase";
import dayjs from "dayjs";

interface Option {
    value: string;
    label: string;
    children?: Option[];
}

const options: Option[] = [
    {
        value: 'Wheel',
        label: 'Wheel',
        children: [
            {
                value: 'Drive wheel motor assembly [Right]',
                label: 'Drive wheel motor assembly [Right]',
                children: [
                    {
                        value: '16.01.00115',
                        label: '16.01.00115',
                    },
                ],
            },
        ],
    },
];

const MyHeader = () => {
    const [open, setOpen] = useState(false);
    const [form] = Form.useForm(); // Initialize the form instance

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const test = async (values: any) => {
        try {
            await setDoc(doc(db, "warehouse", Date.now().toString()), {
                ...values,
                timestamp: dayjs().valueOf(),
                full_date: dayjs().format("dddd, MMMM DD, YYYY [at] HH:mm:ss"),
            });

            form.resetFields();
            onClose();
            message.success("Item seccusesful added")
        } catch (err) {
            err && console.log(err)
            message.error("Something went wrong")
        }
    }

    // Handle form submission
    const onFinish = (values: any) => {
        test(values)
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: "flex-end",
            marginRight: 12
        }}>
            <Space direction="horizontal">
                <Button onClick={showDrawer} type="default" shape="circle" icon={<FileAddOutlined />}/>
                <Button type="default" shape="circle" icon={<SearchOutlined />}/>
            </Space>

            <Drawer
                title="Add item window"
                width={"45%"}
                onClose={onClose}
                open={open}
                styles={{
                    body: {
                        paddingBottom: 80,
                    },
                }}
                extra={
                    <Space>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button onClick={() => form.submit()} type="primary">
                            Submit
                        </Button>
                    </Space>
                }
            >
                <Form
                    layout="vertical"
                    hideRequiredMark
                    form={form} // Bind form instance
                    onFinish={onFinish} // Set onFinish handler
                >
                    <Row gutter={16}>
                        <Col span={18}>
                            <Form.Item
                                label="Item select"
                                name="element" // Name for the cascader field
                                rules={[{ required: true, message: 'Please select an item' }]}
                            >
                                <Cascader
                                    style={{width: "100%"}}
                                    placeholder="Please select"
                                    options={options}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={6}>
                            <Form.Item label="Quantity" name="quantity">
                                <InputNumber style={{width: "100%"}}/>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="remark" // Name for the description field
                                label="Description"
                                rules={[
                                    {
                                        required: true,
                                        message: 'please enter description',
                                    },
                                ]}
                            >
                                <Input.TextArea rows={2} placeholder="please enter description"/>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </div>
    );
};

export default MyHeader;
