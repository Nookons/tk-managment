import React, {useState} from 'react';
import {useForm} from "antd/es/form/Form";
import {useAppSelector} from "../../../hooks/storeHooks";
import {Form, Row, Select} from "antd";
import Col from "antd/es/grid/col";
import Robot from "./Robot/Robot";


const ReportForm = () => {
    const {user} = useAppSelector(state => state.user)
    const [form] = useForm();

    const [error_type, setError_type] = useState<string>("");

    const onFormFinish = (values: any) => {
        // todo handle form finish
    };

    const onFormFinishFailed = (errorInfo: any) => {
        // todo handle form finish fail
    };

    const onFormClearClick = () => {
        form.resetFields();
    };


    if (!user) {
        return null
    }

    return (
        <Form
            form={form}
            name="basic"
            wrapperCol={{span: 24}}
            layout="horizontal"
            initialValues={{remember: true}}
            onFinish={onFormFinish}
            onFinishFailed={onFormFinishFailed}
        >
            <Row gutter={[16, 16]}>
                <Col span={6}>
                    <Form.Item label="Problem type">
                        <Select
                            value={error_type}
                            onChange={(event) => setError_type(event)}
                            defaultValue={"robot"}
                        >
                            <Select.Option value="robot">Robot</Select.Option>
                            <Select.Option value="workstation">Workstation</Select.Option>
                            <Select.Option value="charge">Charge Station</Select.Option>
                            <Select.Option value="air">Air Compressor</Select.Option>
                            <Select.Option value="vsw">VSW</Select.Option>
                            <Select.Option value="qr">QR Code</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    {error_type === "robot" && <Robot />}
                </Col>
            </Row>
        </Form>
    )
};

export default ReportForm;