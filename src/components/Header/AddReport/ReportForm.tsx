import React, {FC} from 'react';
import {useAppSelector} from "../../../hooks/storeHooks";
import {Form, Row} from "antd";
import Col from "antd/es/grid/col";
import RobotForm from "./Robot/RobotForm";
import WorkStationForm from "./WorkStation/WorkStationForm";
import ChargeStationForm from "./ChargeStation/ChargeStationForm";
import VSWForm from "./VSW/VSWForm";
import CodeForm from "./Code/CodeForm";

interface ReportFormProps {
    reportType: string;
}

const ReportForm:FC<ReportFormProps> = ({reportType}) => {
    const {user} = useAppSelector(state => state.user)

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
                    {reportType === "robot"         && <RobotForm />}
                    {reportType === "workStation"   && <WorkStationForm />}
                    {reportType === "chargeStation" && <ChargeStationForm />}
                    {reportType === "vsw"           && <VSWForm />}
                    {reportType === "qr"            && <CodeForm />}
                </Col>
            </Row>
        </Form>
    )
};

export default ReportForm;