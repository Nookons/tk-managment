import React, { FC, useEffect, useState } from 'react';
import { Descriptions } from "antd";
import all_robot_data from "../../../utils/Robots.json";

interface ShortRobotInfoProps {
    robot_number: string;
}

const ShortRobotInfo: FC<ShortRobotInfoProps> = ({ robot_number }) => {
    const [current_target, setCurrent_target] = useState<any | null>(null);

    useEffect(() => {
        const founded = all_robot_data.find((r) => r.id.toString() === robot_number);
        setCurrent_target(founded || null);
    }, [robot_number]);

    useEffect(() => {
        console.log(current_target);
    }, [current_target]);

    if (!current_target) {
        return null;
    }

    return (
        <>
            <Descriptions title="" bordered>
                <Descriptions.Item label="RobotIP">{current_target.ip}</Descriptions.Item>
            </Descriptions>
            <Descriptions style={{ marginTop: 4 }} title="" bordered>
                <Descriptions.Item label="Robot Type">{current_target.robotType}</Descriptions.Item>
            </Descriptions>
            <Descriptions style={{ marginTop: 4 }} title="" bordered>
                <Descriptions.Item label="Version">{current_target.version}</Descriptions.Item>
            </Descriptions>
        </>
    );
};

export default ShortRobotInfo;
