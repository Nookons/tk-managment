import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import Title from "antd/es/typography/Title";
import {useAppSelector} from "../../../hooks/storeHooks";
import {Divider, Table} from "antd";
import {LinkOutlined} from '@ant-design/icons';

const ToteInfo = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const toteId = params.get("id"); // Извлекаем значение параметра id

    const {items, error, loading} = useAppSelector(state => state.items)

    const [tote_data, setTote_data] = useState<any[]>([]);

    useEffect(() => {
        if (toteId) {
            const filteredItems = items.filter((item: any) => item.box_number === toteId);
            setTote_data(filteredItems)
        }
    }, [toteId, items]);

    return (
        <div>
            <Divider><LinkOutlined /> {toteId}</Divider>
            <Table
                rowSelection={{type: "checkbox"}}
                columns={[
                    {title: "Item ID", dataIndex: "id"},
                    {title: "name", dataIndex: "name"},
                    {title: "Uniq number", dataIndex: "code"},
                    {title: "full_date", dataIndex: "full_date"},
                ]}
                dataSource={tote_data}
            />
        </div>
    );
};

export default ToteInfo;