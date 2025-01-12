import React, {useEffect, useState} from 'react';
import useErrorsFetch from "../../../hooks/useErrorFetch";
import {Button, message, Row, Select, Table, Tag} from "antd";
import {IError} from "../../../types/Error";
import dayjs from "dayjs";
import {deleteDoc, doc, updateDoc} from "firebase/firestore";
import {db} from "../../../firebase";
import ButtonGroup from "antd/es/button/button-group";
import {DeleteOutlined, LoadingOutlined} from "@ant-design/icons";

export const getBackColor = (text: string) => {
    switch (text) {
        case "✅ the cargo container was overfull":
            return "#80d1ff"
        case "✅ worker triggered the sensor":
            return "#9f9f9f"
        case "✅ box is stuck in the shelf":
            return "rgba(255,244,130,0.5)"
        case "✅ item fell out of box":
            return "rgba(255,131,226,0.5)"
        case "✅ air compressor overload including fuse blown":
            return "#aaff85"
        case "✅ worker press emergency stop":
            return "#ff6a00"
        case "✅ motor alarm":
            return "rgba(0,116,182,0.5)"
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
            return "#ededed"
    }
}

const ErrorControl = () => {
    const {errors_data, loading, error} = useErrorsFetch();
    const [sorted_data, setSorted_data] = useState<IError[]>([]);

    useEffect(() => {
        if (errors_data) {
            setSorted_data([]);
            const sorted = [...errors_data].sort((a, b) => {
                const timeA = dayjs(a.startTime, "YYYY-MM-DD HH:mm").valueOf(); // Convert to timestamp
                const timeB = dayjs(b.startTime, "YYYY-MM-DD HH:mm").valueOf(); // Convert to timestamp

                return timeA - timeB;
            });
            setSorted_data(sorted);
        }
    }, [errors_data]);

    const onErrorRemove = async (error: IError) => {
        await deleteDoc(doc(db, "errors", error.id));
        message.success(`Error ${error.id} was success removed`)
    }

    const onErrorTypeHandle = async (item: IError, e: string) => {
        try {
            const ref = doc(db, "errors", item.id);

            await updateDoc(ref, {
                text: e
            });
            message.success(`Error:${item.id} was successfully updated to ${e}`)
        } catch (err) {
            err && message.error(err.toString())
        }
    }

    if (!errors_data) {
        return null
    }

    return (
        <>
            {sorted_data.length > 0 &&
            <Row gutter={[4, 4]}>
                <Button type={"primary"} style={{margin: "14px 0"}} >Start ticket entering  <Tag color={"processing"}><span>📝 {sorted_data.length}</span></Tag></Button>
            </Row>
            }
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
                        render: (item: IError) => <span>{item.startTime} - {item.endTime.slice(10)}</span>,
                    },
                    {
                        title: <span>Error</span>,
                        dataIndex: "",
                        key: "",
                        render: (item) => (
                            <Select style={{
                                backgroundColor: getBackColor(item.text),
                                padding: "4px 14px",
                                borderRadius: 4
                            }} onChange={(e) => onErrorTypeHandle(item, e)} bordered={false} defaultValue={item.text} size={"small"}>
                                <Select.Option value="✅ the cargo container was overfull">Cargo container was overfull</Select.Option>
                                <Select.Option value="✅ worker triggered the sensor">Worker triggered the sensor</Select.Option>
                                <Select.Option value="✅ box is stuck in the shelf">Box is stuck in the shelf</Select.Option>
                                <Select.Option value="✅ item fell out of box">Item fell out of box</Select.Option>
                                <Select.Option value="✅ air compressor overload including fuse blown">air compressor overload including fuse blown</Select.Option>
                                <Select.Option value="✅ worker press emergency stop">worker press emergency stop</Select.Option>
                                <Select.Option value="✅ motor alarm">motor alarm</Select.Option>
                                <Select.Option value="✅ platform collision">platform collision</Select.Option>
                                <Select.Option value="✅ command buffer">command buffer</Select.Option>
                                <Select.Option value="✅ computer problem">computer problem</Select.Option>
                                <Select.Option value="✅ box flew out">box flew out</Select.Option>
                                <Select.Option value="✅ robot have collision">robot have collision</Select.Option>
                                <Select.Option value="✅ system problem">system problem</Select.Option>
                            </Select>
                        )
                    },
                    {
                        title: <span>Buttons</span>,
                        dataIndex: "",
                        key: "",
                        render: (item) =>
                            <ButtonGroup>
                                <Button onClick={() => onErrorRemove(item)} danger
                                        type={"primary"}><DeleteOutlined/></Button>
                            </ButtonGroup>,
                    },
                ]}
                pagination={{
                    showSizeChanger: true,  // Скрывает возможность смены количества строк на странице
                }}
                dataSource={sorted_data}
                rowKey={(record) => record.id} // Обязательно для уникального ключа строки
                size={"large"}
                loading={loading}
            />
        </>
    );
};

export default ErrorControl;