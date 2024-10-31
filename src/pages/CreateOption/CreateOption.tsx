import React, { useState } from 'react';
import { useForm } from "antd/es/form/Form";
import { Form, Input, Select, Space, Modal, message, Spin } from "antd";
import Button from "antd/es/button";
import InputMask from 'react-input-mask';
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

interface FormValues {
    type: string;
    name: string;
    code: string;
}

const CreateOption = () => {
    const [form] = useForm();
    const [loading, setLoading] = useState(false);

    const onFormFinish = async (values: FormValues) => {
        setLoading(true);
        try {
            await setDoc(doc(db, "item_library", values.code), {
                id: Date.now(),
                value: values.name,
                label: values.code,
            });
            message.success("Data submitted successfully!");
            form.resetFields();
        } catch (error) {
            message.error("Failed to submit data!");
            console.error("Submission Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const onFormFinishFailed = (errorInfo: any) => {
        console.log("Failed:", errorInfo);
    };

    const onFormClearClick = () => {
        form.resetFields();
    };

    return (
        <div>
            <Modal
                open={loading}
                footer={null}
                closable={false}
                centered
                bodyStyle={{ display: 'flex', justifyContent: 'center' }}
            >
                <Spin size="large" />
            </Modal>

            <Form
                form={form}
                name="basic"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 24 }}
                layout="horizontal"
                initialValues={{ remember: true }}
                onFinish={onFormFinish}
                onFinishFailed={onFormFinishFailed}
            >
                <Form.Item
                    name="type"
                    label="Item type"
                    rules={[{ required: true, message: "Please select an item type!" }]}
                >
                    <Select>
                        <Select.Option value="plastic">Plastic</Select.Option>
                        <Select.Option value="wheel">Wheel</Select.Option>
                        <Select.Option value="plug">Plug</Select.Option>
                        <Select.Option value="motor">Motor</Select.Option>
                        <Select.Option value="button">Button</Select.Option>
                        <Select.Option value="button_block">Button Block</Select.Option>
                        <Select.Option value="metal">Metal</Select.Option>
                        <Select.Option value="other">Other</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Item Name"
                    name="name"
                    rules={[{ required: true, message: "Please enter the item name!" }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Material Code"
                    name="code"
                    rules={[{ required: true, message: "Please enter the material code!" }]}
                >
                    <InputMask mask="99.99.99999">
                        {(inputProps: any) => <Input {...inputProps} />}
                    </InputMask>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 3, span: 24 }}>
                    <Space>
                        <Button type="primary" htmlType="submit" loading={loading}>
                            Submit
                        </Button>
                        <Button htmlType="button" onClick={onFormClearClick}>
                            Clear
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreateOption;
