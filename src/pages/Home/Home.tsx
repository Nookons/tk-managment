import React, {useEffect} from 'react';
import {Descriptions, Progress, Row, Steps} from 'antd';
import useTasks from "../../hooks/useTasks";
import Col from "antd/es/grid/col";
import {LoadingOutlined, SmileOutlined, SolutionOutlined, UserOutlined} from "@ant-design/icons";

const getColor = (status: string) => {
    switch (status) {
        case "observation":
            return "rgba(0,255,255,0.25)"
        case "completed":
            return "rgba(8,255,0,0.25)"
        case "process":
            return "rgba(255,221,0,0.25)"
        case "founded":
            return "rgba(255,0,0,0.25)"
        default:
            return "#333"
    }
}

const getStatus = (status: string) => {
    switch (status) {
        case "completed":
            return 2
        case "process":
            return 1
        case "founded":
            return 0
        default:
            return 0
    }
}

const App: React.FC = () => {

    const {tasks, loading, error} = useTasks();

    useEffect(() => {
        console.log(tasks);
    }, [tasks, loading]);

    if (loading || error) {
        return null
    }

    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                {tasks?.map(task => {

                    return (
                        <Row style={{
                            backgroundColor: getColor(task.status),
                            padding: 14,
                            borderRadius: 4,
                            marginBottom: 14
                        }}
                             gutter={[16, 16]}
                             key={task.id}
                        >
                            <Descriptions title={`Task: ${task.task_id}`} >
                                <Descriptions.Item label="Type">{task.type.toUpperCase()}</Descriptions.Item>
                                <Descriptions.Item span={3} label="">
                                    {task.status !== "observation"
                                        ?
                                        <Steps current={getStatus(task.status)}>
                                            <Steps.Step  title="Founded" icon={<UserOutlined/>}/>
                                            <Steps.Step
                                                title="Process"
                                                icon={<LoadingOutlined/>}
                                            />
                                            <Steps.Step
                                                title="Completed"
                                                icon={<SmileOutlined/>}
                                            />
                                        </Steps>
                                        :
                                        <div>
                                            observation
                                        </div>
                                    }

                                </Descriptions.Item>
                                <Descriptions.Item label="Start time">{task.start_time}</Descriptions.Item>
                            </Descriptions>
                        </Row>
                    )
                })}
            </Col>
        </Row>
    );
};

export default App;
