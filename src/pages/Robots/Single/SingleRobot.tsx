import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {useAppSelector} from "../../../hooks/storeHooks";
import {Alert, Card, Collapse, Descriptions, Divider, Row} from "antd";
import {IBrokenRobots, IRobot, IRobotError} from "../../../types/Robot";
import Col from "antd/es/grid/col";

import full_robot_data from '../../../utils/Robots.json'
import {EditOutlined, EllipsisOutlined, SettingOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import {IOption} from "../../../types/Item";
import Title from "antd/es/typography/Title";

const SingleRobot = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const robot_id = params.get("id"); // Extract the id parameter

    const {broken_robots, loading} = useAppSelector(state => state.broken_robots);

    const [isBroken, setIsBroken] = useState<boolean>(false);
    const [current_robot, setCurrent_robot] = useState<IBrokenRobots | null>(null);

    const [robot_json, setRobot_json] = useState<IRobot | null>();

    useEffect(() => {
        const found = broken_robots.find(item => item.robot_number === robot_id);
        const found_json = full_robot_data.find(item => item.id.toString() === robot_id);

        if (found || found_json) {
            setCurrent_robot(found as IBrokenRobots);
            setRobot_json(found_json as IRobot)
            setIsBroken(true);
        } else {
            setIsBroken(false);
        }
    }, [robot_id, broken_robots]);

    if (!current_robot && !robot_json) {
        return null;
    }

    return (
        <div>
            {isBroken && current_robot &&
                <Alert
                    description="This robot is broken right now"
                    type="error"
                />
            }
            <Divider>{current_robot?.robot_number}</Divider>
            <Descriptions title="" bordered>
                <Descriptions.Item span={3} label="product">{robot_json?.product}</Descriptions.Item>
                <Descriptions.Item label="ip">{robot_json?.ip}</Descriptions.Item>
                <Descriptions.Item span={2} label="version">{robot_json?.version}</Descriptions.Item>
                <Descriptions.Item label="location">{robot_json?.location}</Descriptions.Item>
                <Descriptions.Item label="batteryVoltage">{robot_json?.batteryVoltage}</Descriptions.Item>
                <Descriptions.Item label="powerPercent">{robot_json?.powerPercent}</Descriptions.Item>
            </Descriptions>
        </div>
    );
};

export default SingleRobot;
