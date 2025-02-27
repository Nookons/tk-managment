import React from 'react';
import ReportsScreen from "./ReportsScreen/ReportsScreen";
import {Row} from "antd";
import Col from "antd/es/grid/col";
import ReportsTimeLine from "./ReportsTimeLine/ReportsTimeLine";

const Home = () => {
    return (
        <Row gutter={[14, 14]}>
            <Col span={16}>
                <ReportsScreen />
            </Col>
            <Col span={8}>
                <ReportsTimeLine />
            </Col>
        </Row>
    );
};

export default Home;