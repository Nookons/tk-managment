import React, {useState} from 'react';
import {useForm} from "antd/es/form/Form";
import {Form, Input, Select, Space, Modal, message, Spin} from "antd";
import Button from "antd/es/button";
import InputMask from 'react-input-mask';
import {db} from "../../firebase";
import {doc, setDoc} from "firebase/firestore";
import useFetchOptions from "../../hooks/useFetchOptions";

interface FormValues {
    type: string;
    name: string;
    code: string;
}


const CreateOption = () => {
    const {options} = useFetchOptions();
    const [form] = useForm();
    const [loading, setLoading] = useState(false);

    const onFormFinish = async (values: FormValues) => {
        setLoading(true);

        const isHaveName = options.some(item => item.name === values.name)
        const isHaveCode = options.some(item => item.code === values.code)


        if (isHaveName) {
            message.error("This name already exists!");
            setLoading(false);
            return;
        }
        if (isHaveCode) {
            message.error("This code already exists!");
            setLoading(false);
            return;
        }

        try {
            await setDoc(doc(db, "item_library", values.code.slice(0, 11)), {
                ...values,
                id: Date.now(),
                code: values.code.slice(0, 11)
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
        <Form
            form={form}
            name="basic"
            labelCol={{span: 3}}
            wrapperCol={{span: 24}}
            layout="horizontal"
            initialValues={{remember: true}}
            onFinish={onFormFinish}
            onFinishFailed={onFormFinishFailed}
        >
            <Form.Item
                label="Item Name"
                name="name"
                rules={[{required: true, message: "Please enter the item name!"}]}
            >
                <Input/>
            </Form.Item>

            <Form.Item
                label="Material Code"
                name="code"
                rules={[{required: true, message: "Please enter the material code!"}]}
            >
                <InputMask mask="99.99.99999">
                    {(inputProps: any) => <Input {...inputProps} />}
                </InputMask>
            </Form.Item>

            <Form.Item wrapperCol={{offset: 3, span: 24}}>
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
    );
};

export default CreateOption;
