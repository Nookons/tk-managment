import React from 'react';
import { useForm } from "antd/es/form/Form";
import { Form, Input, Select, Space } from "antd";
import Button from "antd/es/button";
import InputMask from 'react-input-mask';
import {db} from "../../firebase";
import {doc, setDoc} from "firebase/firestore";

const CreateOption = () => {
    const [form] = useForm();

    const onFormFinish = async (values: any) => {
        await setDoc(doc(db, "item_library", values.code), {
            ...values,
        });
    };

    const onFormFinishFailed = (errorInfo: any) => {
        console.log("Failed:", errorInfo);
    };

    const onFormClearClick = () => {
        form.resetFields();
    };

    return (
        <div>
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
                <Form.Item name="type" label="Item type">
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

                <Form.Item label="Item Name" name="name">
                    <Input />
                </Form.Item>

                <Form.Item label="Material Code" name="code">
                    <InputMask mask="99.99.99999">
                        {(inputProps: any) => <Input {...inputProps} />}
                    </InputMask>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 3, span: 24 }}>
                    <Space>
                        <Button type="primary" htmlType="submit">
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
