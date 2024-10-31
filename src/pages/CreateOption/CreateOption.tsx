import React from 'react';
import {useForm} from "antd/es/form/Form";
import {Form, Input, Select} from "antd";
import Button from "antd/es/button";

const CreateOption = () => {
    const [form] = useForm();

    const onFormFinish = (values: any) => {
        // todo handle form finish
    };

    const onFormFinishFailed = (errorInfo: any) => {
        // todo handle form finish fail
    };

    const onFormClearClick = () => {
        form.resetFields();
    };

    return (
        <div>
            <Form
                form={form}
                name="basic"
                labelCol={{span: 8}}
                wrapperCol={{span: 16}}
                layout="horizontal"
                initialValues={{remember: true}}
                onFinish={onFormFinish}
                onFinishFailed={onFormFinishFailed}
            >
                <Form.Item wrapperCol={{offset: 0.5, span: 24}}>
                    <Form.Item label="Select">
                        <Select>
                            <Select.Option value="plastic">Plastic</Select.Option>
                            <Select.Option value="wheel">Wheel</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Input" name="input">
                        <Input/>
                    </Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button htmlType="button" onClick={onFormClearClick}>
                        Clear
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default CreateOption;