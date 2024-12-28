import React, {useEffect, useState} from 'react';
import useErrorsFetch from "../../../hooks/useErrorFetch";
import {Button, message, Table} from "antd";
import {IError} from "../../../types/Error";
import dayjs from "dayjs";
import {deleteDoc, doc, setDoc} from "firebase/firestore";
import {db} from "../../../firebase";
import ButtonGroup from "antd/es/button/button-group";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";

const ErrorControl = () => {
    const {errors_data, loading, error} = useErrorsFetch();
    const [sorted_data, setSorted_data] = useState<IError[]>([]);

    useEffect(() => {
        if (errors_data) {
            setSorted_data([]);
            const sorted = [...errors_data].sort((a, b) => {
                const timeA = dayjs(a.startTime, "H:mm").valueOf(); // Convert to timestamp
                const timeB = dayjs(b.startTime, "H:mm").valueOf(); // Convert to timestamp

                return timeA - timeB;
            });
            setSorted_data(sorted);
        }
    }, [errors_data]);

    const onErrorRemove = async (error: IError) => {
        await deleteDoc(doc(db, "errors", error.id));
        message.success(`Error ${error.id} was success removed`)
    }

    if (!errors_data) {
        return null
    }

    return (
        <Table
            columns={[
                {
                    title: <span>Work Station</span>,
                    dataIndex: "workStation",
                    key: "workStation",
                    render: (item) => <span>{item}</span>,
                },
                {
                    title: <span>Time</span>,
                    dataIndex: "",
                    key: "",
                    render: (item: IError) => <span>{item.startTime} - {item.endTime}</span>,
                },
                {
                    title: <span>Error</span>,
                    dataIndex: "text",
                    key: "text",
                    render: (item) => <span>{item}</span>,
                },
                {
                    title: <span>Buttons</span>,
                    dataIndex: "",
                    key: "",
                    render: (item) =>
                        <ButtonGroup>
                            <Button onClick={() => message.warning("Maybe later it's will be work 😅")}><EditOutlined /></Button>
                            <Button onClick={() => onErrorRemove(item)} danger type={"primary"}><DeleteOutlined /></Button>
                        </ButtonGroup>,
                },
            ]}
            pagination={{
                pageSize: 25,  // Количество строк на страницу
                showSizeChanger: true,  // Скрывает возможность смены количества строк на странице
            }}
            dataSource={sorted_data}
            rowKey={(record) => record.id} // Обязательно для уникального ключа строки
            size={"large"}
            loading={loading}
        />
    );
};

export default ErrorControl;