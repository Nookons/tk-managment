import React, {useState} from 'react';
import {useAppSelector} from "../../../hooks/storeHooks";
import {IBrokenRobots, IFileUpload, IRobotError} from "../../../types/Robot";
import {Avatar, Descriptions, Divider, Image, message, Row, Tree} from "antd";
import robot_logo from "../../../assets/robot.webp"
import Col from "antd/es/grid/col";
import dayjs from "dayjs";
import {IItem} from "../../../types/Item";
import {useNavigate} from "react-router-dom";
import {UNIQ_NUMBER_ROUTE} from "../../../utils/const";
import { AlertOutlined } from '@ant-design/icons';

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
        <Row>
            {broken_robots && broken_robots.map((robot: IBrokenRobots) => (
                <Col style={{
                    margin: 8,
                    backgroundColor: "#ffe0e0",
                    padding: 14,
                    borderRadius: 14
                }} span={12} key={robot.error_array[0]?.robot_number}>
                    <Divider><AlertOutlined /> {robot.error_array[0]?.robot_number}</Divider>
                    <Descriptions title="Robot info">
                        <Descriptions.Item label="UserName">{dayjs(robot.last_update.seconds).format("YYYY-MM-DD")}</Descriptions.Item>
                    </Descriptions>
                    <Row gutter={14}>
                        <Col >
                            <img style={{maxWidth: "150px"}} src={robot_logo} alt=""/>
                        </Col>
                        <Col >
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
                                    if (error.change_items.length > 0) {
                                        errorChildren.push(
                                            {
                                                title: `Item to change`, // Соединяем элементы в строку
                                                key: `error-${errorIndex}-changes`,
                                                children: error.change_items.map((item: string) => ({
                                                    title: <span onClick={() => navigate(`${UNIQ_NUMBER_ROUTE}?id=${item}`)} style={{color: "green"}}>{item}</span>,
                                                    key: `error-${item}-single-change`
                                                }))
                                            }
                                        )
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
                </Col>
            ))}
        </Row>
    );
};

export default RobotsDisplay;