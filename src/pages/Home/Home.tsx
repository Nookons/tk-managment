import React from 'react';
import {Button, notification, Row} from 'antd';
import Col from "antd/es/grid/col";
import RobotsCard from "./dep/RobotsCard";

const App: React.FC = () => {

    const showNotification = () => {
        notification.info({
            message: 'Notification topLeft',
            description: 'Hello, Ant Design!!',
            placement: 'topLeft',
        });
    };

    return (
        <div>
            <Row gutter={16}>
                <Col span={16}>
                    <Button type="primary" onClick={showNotification}>
                        Open notification
                    </Button>
                </Col>
                <RobotsCard />
            </Row>
        </div>
    );
};

export default App;
