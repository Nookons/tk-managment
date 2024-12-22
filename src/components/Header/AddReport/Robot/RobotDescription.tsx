import React from 'react';
import {Descriptions} from "antd";

const RobotDescription = ({current_data}: { current_data: any }) => {
    return (
        <Descriptions style={{marginTop: 14}} bordered>
            <Descriptions.Item label="ID">{current_data?.id}</Descriptions.Item>
            <Descriptions.Item label="IP">{current_data?.ip}</Descriptions.Item>
            <Descriptions.Item label="Robot Series">{current_data?.robotSeries}</Descriptions.Item>
            <Descriptions.Item label="Robot Type">{current_data?.robotType}</Descriptions.Item>
            <Descriptions.Item label="Version">{current_data?.version}</Descriptions.Item>
        </Descriptions>
    );
};

export default RobotDescription;