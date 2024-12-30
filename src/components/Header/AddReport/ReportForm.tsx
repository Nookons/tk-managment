import React, {useState} from 'react';
import {useAppSelector} from "../../../hooks/storeHooks";
import {Form, Row, Select} from "antd";
import Col from "antd/es/grid/col";
import RobotForm from "./Robot/RobotForm";
import WorkStationForm from "./WorkStation/WorkStationForm";
import ChargeStationForm from "./ChargeStation/ChargeStationForm";
import CompressorForm from "./Compressor/CompressorForm";
import VSWForm from "./VSW/VSWForm";
import CodeForm from "./Code/CodeForm";


const ReportForm = () => {
    const {user} = useAppSelector(state => state.user)
    const [error_type, setError_type] = useState<string>("");

    if (!user) {
        return null
    }

    return (
        <Form
            name="basic"
            wrapperCol={{span: 24}}
            layout="horizontal"
            initialValues={{remember: true}}
        >
            <Row gutter={[16, 16]}>
                <Col span={24}>
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
                    {error_type === "robot"         && <RobotForm />}
                    {error_type === "workstation"   && <WorkStationForm />}
                    {error_type === "charge"        && <ChargeStationForm />}
                    {error_type === "air"           && <CompressorForm />}
                    {error_type === "vsw"           && <VSWForm />}
                    {error_type === "qr"            && <CodeForm />}
                </Col>
            </Row>
        </Form>
    )
};

export default ReportForm;