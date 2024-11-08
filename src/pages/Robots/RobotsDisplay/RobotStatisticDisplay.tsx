import React from 'react';
import {Card, Row, Statistic} from "antd";
import Col from "antd/es/grid/col";
import {useAppSelector} from "../../../hooks/storeHooks";

const RobotStatisticDisplay = () => {
    const {broken_robots} = useAppSelector(state => state.broken_robots)
    return (
        <div style={{
            marginBottom: 24
        }}>
            <Row gutter={16}>
                <Col span={24}>
                    <Card>
                        <Statistic title="Broken robots" value={broken_robots.length}/>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default RobotStatisticDisplay;