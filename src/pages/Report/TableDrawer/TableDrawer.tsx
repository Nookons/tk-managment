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

const TableDrawer:FC <TableDrawerProps> = ({isDrawer, setIsDrawer, current_data}) => {

    const [sorted_data, setSorted_data] = useState<IError[]>([]);

    useEffect(() => {
        setSorted_data([]);
        const sorted = [...current_data].sort((a, b) => {
            // Parse time strings using dayjs
            const timeA = dayjs(a.startTime, "H:mm").valueOf(); // Convert to timestamp
            const timeB = dayjs(b.startTime, "H:mm").valueOf(); // Convert to timestamp
            // Compare the numeric timestamps
            return timeA - timeB;
        });

        if (current_data) {
            current_data.forEach(el => {
                if (el.workStation && el.startTime) {
                    const date = dayjs().format("YYYY-MM-DD")

                    setDoc(doc(db, "errors", `${el.workStation}-${el.startTime}-${date}`), {
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
                    {title: "Start Time", dataIndex: "startTime"},
                    {title: "End Time", dataIndex: "endTime"},
                    {
                        title: "FB-FD2",
                        dataIndex: "",
                        render: (text) => {
                            // Функция для преобразования времени в минуты
                            const timeToMinutes = (timeStr: string) => {
                                const [hours, minutes] = timeStr.split(':').map(Number);  // Разбиваем строку на часы и минуты
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
                            return text === "Описание не распарсено" ? <span style={{color: "red"}}>{text}</span> :
                                <span>{text}</span>
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