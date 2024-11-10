import React from 'react';
import {Alert, Card, Divider,Row, Spin, Statistic} from "antd";
import Col from "antd/es/grid/col";
import {useAppSelector} from "../../../hooks/storeHooks";
import Button from "antd/es/button";
import robot_logo from '../../../assets/robot.webp'
import {BugOutlined, RobotOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {ROBOTS_DISPLAY} from "../../../utils/const";

const RobotsCard = () => {
    const navigate = useNavigate();
    const {broken_robots, error, loading} = useAppSelector(state => state.broken_robots)

    if (loading) {
        return <Spin/>
    }
    if (error) {
        return (
            <Col span={8}>
                <Alert style={{width: "100%", height: "100%"}} message={<span>Something went wrong... Can't loading data from server</span>} type="error"/>
            </Col>
        )
    }


    return (
        <Col span={8}>
            <img style={{
                position: "absolute",
                zIndex: 1,
                maxWidth: "125px",
                top: -44,
                right: 0,
            }} src={robot_logo} alt=""/>
            <Card>
                <Divider>Robots Card</Divider>
                <Row gutter={18}>
                    <Col span={12}>
                        <Card>
                            <Button onClick={() => navigate(ROBOTS_DISPLAY)} style={{margin: "0 14px 14px 0"}} size={"small"}>Go to display</Button>
                            <Statistic title="Robots to repair" value={broken_robots.length} prefix={<BugOutlined style={{fontSize: 14}} />}/>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                            <Statistic title="Robots in system" value={0} prefix={<RobotOutlined style={{fontSize: 14}} />}/>
                        </Card>
                    </Col>
                </Row>
            </Card>
        </Col>
    );
};

export default RobotsCard;