import React, {useRef, useState} from 'react';
import {Row, Steps, theme} from "antd";
import Col from "antd/es/grid/col";
import FirstStep from "./ReportDep/FirstStep";
import SecondStep from "./ReportDep/SecondStep";
import ThirdStep from "./ReportDep/ThirdStep";
import dayjs from "dayjs";

const ReportForm = () => {
    const {token} = theme.useToken();
    const [current, setCurrent] = useState(0);

    const main_id = useRef(Date.now().toString());

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const steps = [
        {
            title: <span>Issue type</span>,
            content: <FirstStep main_id={main_id} next={next}/>,
        },
        {
            title: <span>Task Status</span>,
            content: <SecondStep main_id={main_id} next={next} prev={prev}/>,
        },
        {
            title: <span>Types of repair</span>,
            content: <ThirdStep main_id={main_id} next={next} prev={prev}/>,
        },
    ];

    const items = steps.map((item) => ({key: item.title, title: item.title}));

    const contentStyle: React.CSSProperties = {
        textAlign: 'center',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
        padding: 16
    };

    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Steps current={current} items={items}/>
                <div style={contentStyle}>{steps[current].content}</div>
            </Col>
        </Row>
    );
};

export default ReportForm;