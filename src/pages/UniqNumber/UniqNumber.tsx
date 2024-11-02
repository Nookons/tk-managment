import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {useAppSelector} from "../../hooks/storeHooks";
import {Divider, Table} from "antd";
import {LinkOutlined} from "@ant-design/icons";
import {TOTE_INFO_ROUTE} from "../../utils/const";

const UniqNumber = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);
    const code = params.get("id"); // Извлекаем значение параметра id

    const {items, error, loading} = useAppSelector(state => state.items)

    const [tote_data, setTote_data] = useState<any[]>([]);

    useEffect(() => {
        if (code) {
            const filteredItems = items.filter((item: any) => item.code === code);
            setTote_data(filteredItems)
        }
    }, [code, items]);

    const onToteClick = (tote: string) => {
        navigate(`${TOTE_INFO_ROUTE}?id=${tote}`);
    };

    return (
        <div>
            <Divider><LinkOutlined /> {code}</Divider>
            <Table
                rowSelection={{type: "checkbox"}}
                columns={[
                    {title: "Item ID", dataIndex: "id"},
                    {title: "name", dataIndex: "name"},
                    {
                        title: "Place",
                        dataIndex: "box_number",
                        key: "box_number",
                        render: (text) => <a onClick={() => onToteClick(text)}>{text}</a>,
                    },
                    {title: "Uniq number", dataIndex: "code"},
                    {title: "full_date", dataIndex: "full_date"},
                ]}
                dataSource={tote_data}
            />
        </div>
    );
};

export default UniqNumber;