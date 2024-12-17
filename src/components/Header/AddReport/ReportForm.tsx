import React, {useState} from 'react';
import {useForm} from "antd/es/form/Form";
import {IUser} from "../../../types/User";
import {IOption} from "../../../types/Item";
import {useAppSelector} from "../../../hooks/storeHooks";
import {DatePicker, Form, message, Row, Select, Steps, Switch, theme, TimePicker} from "antd";
import Button from "antd/es/button";
import dayjs from "dayjs";
import Col from "antd/es/grid/col";
import Robot from "./Steps/TypeComponents/Robot";
import WorkStation from "./Steps/TypeComponents/WorkStation";

const FirstStep = () => {
    const format = 'HH:mm';
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
                {/*<Col>
                    <Form.Item label={`Sign this report to you ${user.email}`} name="switch" valuePropName="checked">
                        <Switch defaultChecked={true} checked={true}/>
                    </Form.Item>
                </Col>*/}
                <Col>
                    <Form.Item label="Date" name="date">
                        <DatePicker defaultValue={dayjs()}/>
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item label="Time" name="time">
                        <TimePicker defaultValue={dayjs()} format={format}/>
                    </Form.Item>
                </Col>
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
                    {error_type === "workstation" && <WorkStation />}
                </Col>
            </Row>
        </Form>
    )
}

const ReportForm = () => {
    const {token} = theme.useToken();
    const [current, setCurrent] = useState(0);

    const [main_object, setMain_object] = useState<any | null>(null);

    const steps = [
        {
            title: 'First',
            content: <FirstStep/>,
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

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const items = steps.map((item) => ({key: item.title, title: item.title}));

    const contentStyle: React.CSSProperties = {
        textAlign: 'left',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
        padding: 14
    };


    return (
        <>
            <Steps current={current} items={items}/>
            <div style={contentStyle}>{steps[current].content}</div>
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
    );
};

export default ReportForm;