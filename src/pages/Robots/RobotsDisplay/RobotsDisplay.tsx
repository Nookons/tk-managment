import React, {useState} from 'react';
import {useAppSelector} from "../../../hooks/storeHooks";
import {IBrokenRobots, IFileUpload, IRobotError} from "../../../types/Robot";
import {Avatar, Descriptions, Divider, Image, message, QRCode, Row, Tabs, Timeline, Tree} from "antd";
import robot_logo from "../../../assets/robot.webp"
import Col from "antd/es/grid/col";
import dayjs from "dayjs";
import {IItem} from "../../../types/Item";
import {useNavigate} from "react-router-dom";
import {UNIQ_NUMBER_ROUTE} from "../../../utils/const";
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

const RobotsDisplay = () => {
    const navigate = useNavigate();
    const {broken_robots} = useAppSelector(state => state.broken_robots)

    const handleSelect = (selectedKeys: React.Key[], info: any) => {
        const selectedNode = info.node;

        // Если у выбранного узла есть объект файла, вызываем загрузку
        if (selectedNode?.file) {
            const file: IFileUpload = selectedNode.file;
            handleFileClick(file);
        }
    };

    const handleFileClick = (file: IFileUpload) => {
        const downloadUrl = file.response?.url || ''; // URL для скачивания

        if (downloadUrl) {
            window.open(downloadUrl, '_blank');
        } else {
            message.error('URL для скачивания не найден!');
        }
    };

    return (
        <>
            <RobotStatisticDisplay />
            <Row>
                {broken_robots && broken_robots.map((robot: IBrokenRobots, index) => {

                    return <Col style={{
                        margin: 18,
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 14,
                        boxShadow: "0 0 4px rgba(0,0,0, 0.15)",
                        borderRadius: 14
                    }} key={robot.error_array[0]?.robot_number}>
                        <Divider><AlertOutlined/> {robot.error_array[0]?.robot_number}</Divider>
                        <img src={robot_logo} style={{
                            position: "absolute",
                            maxWidth: 125,
                            top: -34,
                            right: -34,
                            zIndex: 2
                        }} alt=""/>
                        <Button style={{margin: "0 4px"}}><ArrowsAltOutlined /> Open</Button>
                        <Button style={{margin: "0 4px"}}><RetweetOutlined /> Update</Button>
                        <Button type={"primary"} style={{margin: "0 4px"}}><CheckCircleOutlined /> Solved</Button>
                        <Button danger type={"primary"} style={{margin: "0 4px"}}><DeleteOutlined /> Remove</Button>
                        <Tabs>
                            <Tabs.TabPane tab="Main Info" key="1" closable={true} animated={true} active={true}>
                                <Descriptions title="" bordered>
                                    <Descriptions.Item label="RobotIP">10.46.138.40</Descriptions.Item>
                                </Descriptions>
                                <Descriptions style={{marginTop: 4}} title="" bordered>
                                    <Descriptions.Item label="Type">P1200L</Descriptions.Item>
                                </Descriptions>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="History" key="2">
                                <Timeline style={{minWidth: 350, marginTop: 24}} mode={"alternate"}>
                                    <Timeline.Item
                                        label={<span style={{margin: "0 4px"}}>2024-11-08 at 14:40:01</span>}
                                        dot={<AlertOutlined  style={{fontSize: "16px"}}/>}
                                        color="red"
                                    >
                                        <span style={{margin: "0 4px"}}>Get error report</span>
                                    </Timeline.Item>
                                    <Timeline.Item
                                        label={<span style={{margin: "0 4px"}}>2024-11-08 at 16:40:01</span>}
                                        dot={<CheckCircleOutlined  style={{fontSize: "16px"}}/>}
                                        color="green"
                                    >
                                        <span style={{margin: "0 4px"}}>Robot repaired</span>
                                    </Timeline.Item>
                                    <Timeline.Item
                                        label={<span style={{margin: "0 4px"}}>2024-11-08 at 16:50:01</span>}
                                        dot={<LoginOutlined  style={{fontSize: "16px"}}/>}
                                    >
                                        <span style={{margin: "0 4px"}}>Robot add to map and going to work</span>
                                    </Timeline.Item>
                                </Timeline>
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Error or broken part of robot" key="3">
                                <Row gutter={14}>
                                    <Col>
                                        <Tree
                                            style={{padding: 4}}
                                            showLine={true} // Включаем линии между узлами
                                            defaultExpandedKeys={robot.error_array.map((_, index) => `error-${index}`)} // Expand all errors by default
                                            onSelect={handleSelect} // Обработчик на выбор узлов
                                            treeData={robot.error_array.map((error, errorIndex) => {
                                                const errorChildren: {
                                                    title: string; // Поменяли на строку
                                                    key: string;
                                                    children?: any[];
                                                    file?: IFileUpload;
                                                }[] = [
                                                    {
                                                        title: `${error.user}`,
                                                        key: `error-${errorIndex}-user`,
                                                    },
                                                ];

                                                if (error.note) {
                                                    errorChildren.push(
                                                        {
                                                            title: error.note, // Соединяем элементы в строку
                                                            key: `error-${errorIndex}-note`,
                                                        }
                                                    )
                                                }
                                                if (Array.isArray(error.change_items) && error.change_items.length) {
                                                    errorChildren.push(
                                                        {
                                                            title: "Items to Change",
                                                            key: `error-${errorIndex}-changes`,
                                                            children: error.change_items.map((item: string) => ({
                                                                title: (
                                                                    <span
                                                                        onClick={() => navigate(`${UNIQ_NUMBER_ROUTE}?id=${item}`)}
                                                                        style={{ color: "green", cursor: "pointer" }}
                                                                        aria-label={`Navigate to change item ${item}`}
                                                                    >
                                                                        {item}
                                                                    </span>
                                                                ),
                                                                key: `error-${item}-single-change`
                                                            }))
                                                        }
                                                    );
                                                } else if (error.change_items && error.change_items.length) {
                                                    // Check if `error.change_items` is an array or a string
                                                    const title: string = Array.isArray(error.change_items)
                                                        ? error.change_items[0]  // If it's an array, take the first item
                                                        : error.change_items;     // If it's a string, use it directly

                                                    errorChildren.push(
                                                        {
                                                            title: "Item to Change",
                                                            key: `error-${errorIndex}-change`,
                                                            children: [
                                                                {
                                                                    title: (
                                                                        <span
                                                                            onClick={() => navigate(`${UNIQ_NUMBER_ROUTE}?id=${title}`)}
                                                                            style={{ color: "green", cursor: "pointer" }}
                                                                            aria-label={`Navigate to change item ${title}`}
                                                                        >
                                                                            {title}
                                                                        </span>
                                                                    ),
                                                                    key: `error-${title}-single-change`
                                                                }
                                                            ]
                                                        }
                                                    );
                                                }


                                                // Проверяем наличие файлов и добавляем узел с файлами только если они есть
                                                if (error.upload?.fileList && error.upload.fileList.length > 0) {
                                                    errorChildren.push({
                                                        title: `Files:`,
                                                        key: `error-${errorIndex}-files`,
                                                        children: error.upload.fileList.map((file, fileIndex) => ({
                                                            title: `${file.name} (${file.size / 1024} KB) - Status: ${file.status}`,
                                                            key: `error-${errorIndex}-file-${fileIndex}`,
                                                            file, // Привязываем объект файла
                                                        })),
                                                    });
                                                }

                                                return {
                                                    title: `${dayjs(error.crash_time).format("dddd, MMMM DD, YYYY [at] HH:mm:ss")}`,
                                                    key: `error-${errorIndex}`,
                                                    children: errorChildren,
                                                };
                                            })}
                                        />
                                    </Col>
                                </Row>
                            </Tabs.TabPane>
                        </Tabs>
                    </Col>
                })}
            </Row>
        </>
    );
};

export default RobotsDisplay;