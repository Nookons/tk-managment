import React from 'react';
import {
    Button,
    Descriptions,
    Form,
    List, message,
    Row, Select,
    Space, Switch,
    Tag,
    Timeline
} from 'antd';
import useTasks from "../../hooks/useTasks";
import Col from "antd/es/grid/col";
import {
    CheckCircleOutlined,
    EyeOutlined, FileSearchOutlined,
    LoadingOutlined,
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import dayjs from "dayjs";
import {doc, updateDoc} from "firebase/firestore";
import {db} from "../../firebase";
import {useAppSelector} from "../../hooks/storeHooks";
import robot_img from '../../assets/robot.webp'
import ErrorDisplay from "./dep/ErrorDisplay";

const getColor = (status: string) => {
    switch (status) {
        case "observation":
            return "rgba(0,255,255,0.25)"
        case "completed":
            return "rgba(8,255,0,0.25)"
        case "process":
            return "rgba(255,251,0,0.25)"
        case "founded":
            return "rgba(255,0,0,0.25)"
        default:
            return "#333"
    }
}

const getStatusIcon = (status: string) => {
    switch (status) {
        case "completed":
            return <Space style={{backgroundColor: getColor(status), padding: "4px 14px", borderRadius: 4}}
                          size={"small"}><CheckCircleOutlined/> <span>Completed</span></Space>
        case "process":
            return <Space style={{backgroundColor: getColor(status), padding: "4px 14px", borderRadius: 4}}
                          size={"small"}><LoadingOutlined/> <span>In process</span></Space>
        case "founded":
            return <Space style={{backgroundColor: getColor(status), padding: "4px 14px", borderRadius: 4}}
                          size={"small"}><FileSearchOutlined/> <span>Founded but not started</span></Space>
        case "observation":
            return <Space style={{backgroundColor: getColor(status), padding: "4px 14px", borderRadius: 4}}
                          size={"small"}><EyeOutlined/> <span>On observation</span></Space>
        default:
            return 0
    }
}
const getColorTimeLine = (status: string) => {
    switch (status) {
        case "observation":
            return "rgb(0,189,189)"
        case "completed":
            return "rgb(6,188,0)"
        case "process":
            return "rgb(255,171,171)"
        case "founded":
            return "rgba(255,0,0, 1)"
        default:
            return "#333"
    }
}
const getStatusIconTimiline = (status: string) => {
    switch (status) {
        case "completed":
            return <CheckCircleOutlined style={{fontSize: 24}}/>
        case "process":
            return <LoadingOutlined style={{fontSize: 24}}/>
        case "founded":
            return <FileSearchOutlined style={{fontSize: 24}}/>
        case "observation":
            return <EyeOutlined style={{fontSize: 24}}/>
        default:
            return 0
    }
}

const App: React.FC = () => {
    const user = useAppSelector(state => state.user.user)
    const {tasks, loading, error} = useTasks();

    if (loading || error) {
        return null
    }

    if (!tasks) {
        return null
    }

    const onTaskTypeChange = async (value: string, item: any) => {
        if (user) {
            try {
                const ref = doc(db, "task_list", item.task_id);
                await updateDoc(ref, {
                    status: value,
                    lastUpdate: dayjs().format("dddd, MMMM DD, YYYY [at] HH:mm:ss"),
                    lastUpdateBy: user.email,
                });
            } catch (err) {
                err && message.error(err.toString())
            }
        }
    }

    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <ErrorDisplay />
            </Col>
            <Col span={16}>
                <Space style={{alignItems: "center"}}>
                    <Form.Item style={{margin: "0 8px 24px 0"}} label="Task search" name="input">
                        <Search/>
                    </Form.Item>
                    <Form.Item style={{margin: "0 8px 24px 0"}} label="Only not complited" name="switch" valuePropName="checked">
                        <Switch defaultChecked={true}/>
                    </Form.Item>
                    <Button style={{margin: "0 8px 24px 0"}}>Go to completed</Button>
                </Space>
                <List
                    dataSource={tasks.slice(0, 10)}
                    renderItem={(item) => {

                        if (item.status === "completed") {
                            return null
                        }

                        return (
                            <Row style={{
                                boxShadow: "2px 2px 4px rgba(0,0,0, 0.25)",
                                padding: 14,
                                borderRadius: 4,
                                marginBottom: 14
                            }}>
                                <Col span={6}>
                                    <img style={{maxWidth: "90%"}} src={robot_img} alt=""/>
                                </Col>
                                <Col span={18}>
                                    <Descriptions
                                        extra={
                                            <Space>
                                                <Button>Open</Button>
                                                <Select
                                                    onChange={(e) => onTaskTypeChange(e, item)}
                                                    defaultValue={item.status}
                                                    style={{minWidth: 140}}
                                                >
                                                    <Select.Option value="founded">Founded</Select.Option>
                                                    <Select.Option value="process">In process</Select.Option>
                                                    <Select.Option value="completed">Completed</Select.Option>
                                                    <Select.Option value="observation">Observation</Select.Option>
                                                </Select>
                                                <Button danger>Remove</Button>
                                            </Space>
                                        }
                                        size={"small"}
                                        title={getStatusIcon(item.status)}
                                        bordered
                                    >
                                        <Descriptions.Item span={3}
                                                           label="Start time">{item.start_time}</Descriptions.Item>
                                        <Descriptions.Item span={2}
                                                           label="Start by">{item.added_person.email}</Descriptions.Item>
                                        <Descriptions.Item span={2}
                                                           label="Chines Time">{dayjs(item.start_timestamp_chine).format("HH:mm")}</Descriptions.Item>
                                        <Descriptions.Item label="Type">{item.type}</Descriptions.Item>
                                        <Descriptions.Item label="Unit ID">{item.unit_id}</Descriptions.Item>
                                        <Descriptions.Item label="Reason">{item.reason}</Descriptions.Item>
                                        {item.isParts_to_change &&
                                            <Descriptions.Item span={3} label="Change parts">
                                                {item.change_parts.map((el: string) => (
                                                    <Tag style={{marginBottom: 4}}><span>{el}</span></Tag>
                                                ))}
                                            </Descriptions.Item>
                                        }
                                        {item.isDescription &&
                                            <Descriptions.Item
                                                span={2}
                                                label="Description"
                                            >
                                                {item.description}
                                            </Descriptions.Item>}
                                    </Descriptions>
                                </Col>
                            </Row>
                        )
                    }
                    }
                />
            </Col>
            <Col span={8}>
                <Timeline mode={"alternate"}>
                    {tasks.map((task: any) => {

                        return (
                            <Timeline.Item
                                dot={getStatusIconTimiline(task.status)}
                                color={getColorTimeLine(task.status)}
                            >
                                <Space direction={"vertical"} style={{padding: "0 14px"}}>
                                    <article>{task.lastUpdate}</article>
                                    {task.type.length > 1 &&
                                        <Tag color={"#333"}><span>{task.type.toUpperCase()}</span></Tag>}
                                    {task.reason.length > 1 &&
                                        <Tag color={"#333"}><span>{task.reason.toUpperCase()}</span></Tag>}
                                </Space>
                            </Timeline.Item>
                        )
                    })}
                </Timeline>
            </Col>
        </Row>
    );
};

export default App;
