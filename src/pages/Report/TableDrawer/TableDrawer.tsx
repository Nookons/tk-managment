import React, {FC, useEffect, useState} from 'react';
import {Badge, Drawer, message, Table} from "antd";
import {IError} from "../../../types/Error";
import dayjs from "dayjs";
import {doc, setDoc} from "firebase/firestore";
import {db} from "../../../firebase";
import Col from "antd/es/grid/col";
import Text from "antd/es/typography/Text";

interface TableDrawerProps {
    current_data: IError[]
    isDrawer: boolean
    setIsDrawer: (isDrawer: boolean) => void
}

const getColor = (text: string) => {
    switch (text) {
        case "✅ the cargo container was overfull":
            return "#0095ff"
        case "✅ worker triggered the sensor":
            return "#636363"
        case "✅ box is stuck in the shelf":
            return "#b1a800"
        case "✅ item fell out of box":
            return "#ff9eef"
        case "✅ air compressor overload including fuse blown":
            return "#2a9100"
        case "✅ worker press emergency stop":
            return "#ff6a00"
        case "✅ motor alarm":
            return "#0074c6"
        case "✅ platform collision":
            return "#0074c6"
        case "✅ command buffer":
            return "#0074c6"
        case "✅ computer problem":
            return "#0074c6"
        case "✅ box flew out":
            return "#0074c6"
        case "✅ robot have collision":
            return "#0074c6"
        case "✅ system problem":
            return "#0074c6"
        default:
            return "#333"
    }
}

const TableDrawer: FC<TableDrawerProps> = ({isDrawer, setIsDrawer, current_data}) => {
    const [sorted_data, setSorted_data] = useState<IError[]>([]);

    useEffect(() => {
        setSorted_data([]);
        const sorted = [...current_data].sort((a, b) => {
            const timeA = dayjs(a.startTime, "YYYY-MM-DD HH:mm").valueOf(); // Convert to timestamp
            const timeB = dayjs(b.startTime, "YYYY-MM-DD HH:mm").valueOf(); // Convert to timestamp
            return timeA - timeB;
        });

        if (current_data) {
            current_data.forEach(el => {
                if (el.workStation && el.startTime) {
                    const date = dayjs().format("YYYY-MM-DD")

                    setDoc(doc(db, "errors", `${el.workStation}-${el.startTime}-${date}`), {
                        ...el
                    });
                    setDoc(doc(db, "errors_history", `${el.workStation}-${el.startTime}-${date}`), {
                        ...el
                    });
                } else {
                    message.error(`Couldn't upload ${el.text}.`);
                }
            })
        }

        setSorted_data(sorted);
    }, [current_data]);

    return (
        <Drawer
            open={isDrawer}
            onClose={() => setIsDrawer(false)}
            height={"100dvh"}
            title={sorted_data.length ?
                <Col span={24}>
                    <Badge style={{margin: "0 14px 0 0"}} status="success"/>
                    <Text type="secondary">Success parsed {sorted_data.length} errors</Text>
                </Col>
                : null
            }
            placement="bottom"
        >
            <Table
                size="large"
                rowKey={(record) => record.workStation}
                columns={[
                    {
                        title: "Start Time", dataIndex: "startTime",
                        render: (text) => {
                            return <span>{text ? text.slice(10) : "None"}</span>;
                        }
                    },
                    {
                        title: "End Time", dataIndex: "endTime",
                        render: (text) => {
                            return <span>{text ? text.slice(10) : "None"}</span>;
                        }
                    },
                    {
                        title: "FB-FD2",
                        dataIndex: "",
                        render: (text) => {
                            const timeToMinutes = (timeStr: string) => {
                                const [hours, minutes] = timeStr.slice(10).split(':').map(Number);  // Разбиваем строку на часы и минуты
                                return hours * 60 + minutes;  // Преобразуем в минуты
                            };

                            let startTimeInMinutes = 0;
                            let endTimeInMinutes = 0;

                            if (text.startTime && text.endTime) {
                                startTimeInMinutes = timeToMinutes(text.startTime);
                                endTimeInMinutes = timeToMinutes(text.endTime);
                            }

                            const diffInMinutes = endTimeInMinutes - startTimeInMinutes;

                            return <span>{diffInMinutes}</span>;
                        }
                    },
                    {
                        title: "Issue",
                        dataIndex: "",
                        render: (text) => {
                            return <span style={{color: "red"}}>操作员问题 Worker factors</span>
                        }
                    },
                    {
                        title: "Issue ID 问题编号",
                        dataIndex: "",
                        render: (text) => {
                            return <span style={{color: "red"}}>工作站 Workstation</span>
                        }
                    },
                    {
                        title: "work station",
                        dataIndex: "workStation",
                        render: (text) => {
                            return <span>{text}</span>
                        }
                    },
                    {title: "*", dataIndex: ""},
                    {
                        title: "Description",
                        dataIndex: "text",
                        render: (text) => {
                            return <span style={{color: getColor(text)}} >{text}</span>
                        }
                    },
                ]}
                dataSource={sorted_data}
                pagination={{
                    pageSize: 100,  // Количество строк на страницу
                    showSizeChanger: false,  // Скрывает возможность смены количества строк на странице
                }}
            />
        </Drawer>
    );
};

export default TableDrawer;