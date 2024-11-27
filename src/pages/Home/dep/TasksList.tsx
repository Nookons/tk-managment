import React, {useEffect, useState} from "react";
import {useAppSelector} from "../../../hooks/storeHooks";
import {Descriptions, Skeleton, Table, Tag} from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Text from "antd/es/typography/Text";
import {ITaskRecord} from "../../../types/Task";
import Button from "antd/es/button";
import {useNavigate} from "react-router-dom";
import {SINGLE_TASK} from "../../../utils/const";

dayjs.extend(utc);
dayjs.extend(timezone);

const TasksList = () => {
    const navigate = useNavigate();
    const {tasks, loading, error} = useAppSelector((state) => state.tasks);

    const [main_array, setMain_array] = useState<ITaskRecord[]>([]);

    useEffect(() => {
        const reversed = [...tasks].reverse();
        setMain_array(reversed)
    }, [tasks]);

    if (loading) {
        return <Skeleton/>;
    }


    return (
        <Table
            columns={[
                {
                    title: "ID",
                    dataIndex: "",
                    render: (text: ITaskRecord) => (
                        <Button onClick={() => navigate(`${SINGLE_TASK}?id=${text.id}`)} type={"text"}>{text.id.slice(9,15)}</Button>
                    ),
                },
                {
                    title: "Add time",
                    dataIndex: "",
                    render: (text) => (
                        <>
                            <Text type="secondary">
                                {dayjs
                                    .unix(text.added_time.seconds) // Конвертируем секунды в Day.js объект
                                    .tz("Europe/Paris") // Преобразуем в нужный часовой пояс (замените на нужный)
                                    .format("dddd, MMMM DD, YYYY [at] HH:mm")
                                }
                            </Text>
                            <article>{text.added_person.email}</article>
                        </>
                    ),
                },
                {
                    title: "Type",
                    dataIndex: "",
                    render: (text: ITaskRecord) => (
                        <>
                            <Text type="secondary">
                                {text.type}
                            </Text>
                            <article>{text.report_id}</article>
                        </>
                    ),
                },
                {
                    title: "Task Status",
                    dataIndex: "",
                    render: (text: ITaskRecord) => (
                        <>
                            <Tag>{text.task_status}</Tag>
                            <Tag>{text.priority}</Tag>
                        </>
                    ),
                },
                {
                    title: "Detection Date",
                    dataIndex: "",
                    render: (text) => (
                        <>
                            <article>
                                {dayjs
                                    .unix(text.detection_date.seconds) // Конвертируем секунды в Day.js объект
                                    .tz("Europe/Paris") // Преобразуем в нужный часовой пояс (замените на нужный)
                                    .format("dddd, MMMM DD, YYYY")} {/* Формат даты */}
                            </article>
                            <article> 🕙
                                {dayjs
                                    .unix(text.detection_time.seconds) // Конвертируем секунды
                                    .tz("Europe/Paris") // Указываем часовой пояс
                                    .format("HH:mm")} {/* Формат времени */}
                            </article>
                        </>
                    ),
                },
            ]}
            dataSource={main_array}
            expandable={{
                expandedRowRender: (record) => (
                    <Descriptions title="">
                        {record.task_note && <Descriptions.Item span={3} label="Task note">{record.task_note}</Descriptions.Item>}
                        {record.remarks && <Descriptions.Item span={3} label="Remarks">{record.remarks}</Descriptions.Item>}
                        {record.processing_steps && <Descriptions.Item span={3} label="Processing steps">{record.processing_steps}</Descriptions.Item>}
                    </Descriptions>
                ),
                rowExpandable: (record) => record.remarks !== "Lucy",
            }}
        />
    );
};

export default TasksList;
