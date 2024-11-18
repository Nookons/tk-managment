import React, {useEffect, useState} from 'react';
import robotData from '../../../utils/Robots.json'
import {Divider, Input, Table} from "antd";
import {MonitorOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {SINGLE_ROBOT} from "../../../utils/const";

const FullScreen = () => {
    const navigate = useNavigate();
    const [filter_value, setFilter_value] = useState<string>("");
    const [filtered_data, setFiltered_data] = useState<any[]>([]);

    useEffect(() => {
        const filtered = robotData.filter((robot) =>
            robot.id.toString().includes(filter_value)
        );
        setFiltered_data(filtered);
    }, [filter_value]);

    return (
        <div>
            <Divider>All robots Data</Divider>
            <Input
                style={{margin: "14px 0"}}
                addonBefore={<MonitorOutlined />}
                placeholder={"Robot number"}
                value={filter_value}
                onChange={(e) => setFilter_value(e.target.value)}
                type={"number"}
                defaultValue=""
            />
            <Table
                size="large"
                columns={[
                    {
                        title: "ID",
                        dataIndex: "id",
                        key: "id",
                        render: (text) => <a onClick={() => navigate(`${SINGLE_ROBOT}?id=${text}`)}>{text}</a>,
                    },
                    {
                        title: "Robot IP",
                        dataIndex: "ip",
                        key: "ip",
                        render: (text) => <span>{text}</span>,
                    },
                    {
                        title: "Robot system version",
                        dataIndex: "version",
                        key: "version",
                        render: (text) => <span>{text}</span>,
                    },
                    {
                        title: "Robot Type",
                        dataIndex: "robotType",
                        key: "robotType",
                        render: (text) => <span>{text}</span>,
                    },
                ]}
                dataSource={filtered_data}
            />
        </div>
    );
};

export default FullScreen;