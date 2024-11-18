import React, {useState} from 'react';
import {useAppSelector} from "../../../hooks/storeHooks";
import {IBrokenRobots, IFileUpload} from "../../../types/Robot";
import {Avatar, Descriptions, Divider, Image, message, Modal, Row, Tabs, Timeline, Tree} from "antd";
import robot_logo from "../../../assets/robot.webp";
import Col from "antd/es/grid/col";
import dayjs from "dayjs";
import {useNavigate} from "react-router-dom";
import {SINGLE_ROBOT, UNIQ_NUMBER_ROUTE} from "../../../utils/const";
import {
    AlertOutlined,
    ArrowsAltOutlined,
    CheckCircleOutlined,
    ClockCircleOutlined, DeleteOutlined,
    LoginOutlined,
    RetweetOutlined
} from '@ant-design/icons';
import RobotStatisticDisplay from "./RobotStatisticDisplay";
import Button from "antd/es/button";
import {removeRobotReport} from "../../../utils/Robot/RemoveRobotReport";
import FullScreen from "./FullScreen";
import all_robot_data from '../../../utils/Robots.json';
import ShortRobotInfo from "./ShortRobotInfo";

const RobotsDisplay = () => {
    const navigate = useNavigate();
    const {broken_robots} = useAppSelector(state => state.broken_robots);
    const [isRemoveVisible, setIsRemoveVisible] = useState(false);
    const [selectedRobotId, setSelectedRobotId] = useState<string | null>(null);

    const handleSelect = (selectedKeys: React.Key[], info: any) => {
        const selectedNode = info.node;
        if (selectedNode?.file) {
            handleFileClick(selectedNode.file);
        }
    };

    const handleFileClick = (file: IFileUpload) => {
        const downloadUrl = file.response?.url || '';
        if (downloadUrl) {
            window.open(downloadUrl, '_blank');
        } else {
            message.error('URL для скачивания не найден!');
        }
    };

    const openRemoveModal = (id: string) => {
        setSelectedRobotId(id);
        setIsRemoveVisible(true);
    };

    const handleRemove = async () => {
        if (selectedRobotId) {
            await removeRobotReport(selectedRobotId);
            setIsRemoveVisible(false);
            setSelectedRobotId(null);
        }
    };

    const solvedClick = async (robot: IBrokenRobots) => {
        console.log(robot);
    };

    return (
        <>
            {all_robot_data &&
                <Row wrap={true}>
                    {broken_robots && broken_robots.map((robot: IBrokenRobots) => {

                        return (
                            <Col
                                style={{
                                    justifyContent: "center",
                                    alignItems: "center",
                                    marginRight: 14,
                                    marginTop: 14,
                                    padding: 14,
                                    boxShadow: "0 0 4px rgba(0,0,0, 0.15)",
                                    borderRadius: 14
                                }}
                                key={robot.error_array[0]?.robot_number}
                            >
                                <Divider><AlertOutlined/> {robot.error_array[0]?.robot_number}</Divider>
                                <img src={robot_logo} style={{
                                    position: "absolute",
                                    maxWidth: 125,
                                    top: -34,
                                    right: -34,
                                    zIndex: 2
                                }} alt="Robot Logo"/>

                                <Modal
                                    title="Remove robot modal"
                                    open={isRemoveVisible && selectedRobotId === robot.error_array[0]?.robot_number}
                                    onOk={handleRemove}
                                    onCancel={() => setIsRemoveVisible(false)}
                                    okText="Confirm"
                                    cancelText="Cancel"
                                >
                                    <p>Are you sure about removing this robot? Once it's gone, all error history will be
                                        removed.</p>
                                </Modal>

                                <Button
                                    onClick={() => solvedClick(robot)}
                                    type="primary"
                                    style={{margin: "0 4px"}}>
                                    <CheckCircleOutlined/>Solved
                                </Button>
                                <Button
                                    onClick={() => openRemoveModal(robot.error_array[0]?.robot_number)}
                                    danger
                                    type="primary"
                                    style={{margin: "0 4px"}}>

                                    <DeleteOutlined/> Remove
                                </Button>
                                <Button onClick={() => navigate(`${SINGLE_ROBOT}?id=${robot.error_array[0].robot_number}`)} style={{margin: "0 4px"}}><ArrowsAltOutlined/></Button>
                                <Button style={{margin: "0 4px"}}><RetweetOutlined/></Button>
                                <Divider dashed/>


                                <Row gutter={14}>
                                    <Col>
                                        <Tree
                                            style={{padding: 4}}
                                            showLine
                                            defaultExpandedKeys={robot.error_array.map((_, index) => `error-${index}`)}
                                            onSelect={handleSelect}
                                            treeData={robot.error_array.map((error, errorIndex) => ({
                                                title: `${dayjs(error.crash_time).format("dddd, MMMM DD, YYYY [at] HH:mm:ss")}`,
                                                key: `error-${errorIndex}`,
                                                children: [
                                                    ...(error.chines_time ? [{
                                                        title: `Chines time: ${error.chines_time}`,
                                                        key: `error-${errorIndex}-chines-time`,
                                                    }] : []),
                                                    {
                                                        title: error.user,
                                                        key: `error-${errorIndex}-user`,
                                                    },
                                                    ...(error.note ? [{
                                                        title: (<span style={{
                                                            backgroundColor: "#eef3ce",
                                                            borderRadius: "4px",
                                                            padding: "2px 12px",
                                                            fontWeight: 500,
                                                        }}>{error.note}</span>),
                                                        key: `error-${errorIndex}-note`,
                                                    }] : []),
                                                    ...(Array.isArray(error.change_items) ? [{
                                                        title: "Items to Change",
                                                        key: `error-${errorIndex}-changes`,
                                                        children: error.change_items.map((item) => ({
                                                            title: (
                                                                <span
                                                                    onClick={() => navigate(`${UNIQ_NUMBER_ROUTE}?id=${item.code}`)}
                                                                    style={{color: "red", cursor: "pointer"}}
                                                                >
                                                                            {item.code} | {item.name}
                                                                        </span>
                                                            ),
                                                            key: `error-${item.code}-single-change`
                                                        }))
                                                    }] : []),
                                                    ...(error.upload?.fileList?.length ? [{
                                                        title: "Files:",
                                                        key: `error-${errorIndex}-files`,
                                                        children: error.upload.fileList.map((file, fileIndex) => ({
                                                            title: `${file.name} (${file.size / 1024} KB) - Status: ${file.status}`,
                                                            key: `error-${errorIndex}-file-${fileIndex}`,
                                                            file,
                                                        })),
                                                    }] : []),
                                                ],
                                            }))}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                        );
                    })}
                </Row>
            }

            <FullScreen/>
        </>
    );
};

export default RobotsDisplay;
