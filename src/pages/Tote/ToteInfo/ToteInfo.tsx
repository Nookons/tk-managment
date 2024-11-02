import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../hooks/storeHooks";
import { Divider, Table, Button, message } from "antd";
import { LinkOutlined } from '@ant-design/icons';
import { removeItems } from '../../../store/reducers/items';

const ToteInfo = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const toteId = params.get("id"); // Извлекаем значение параметра id

    const dispatch = useAppDispatch();
    const { items, error, loading } = useAppSelector(state => state.items);

    const [tote_data, setTote_data] = useState<any[]>([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    useEffect(() => {
        if (toteId) {
            const filteredItems = items.filter((item: any) => item.box_number === toteId);
            setTote_data(filteredItems);
        }
    }, [toteId, items]);

    const handleDelete = () => {
        if (selectedRowKeys.length > 0) {

            selectedRowKeys.forEach(el => {
                message.success(el.toString())
            })

            dispatch(removeItems(selectedRowKeys));
            message.success('Selected items have been deleted.');
            setSelectedRowKeys([]); // Очищаем выбранные элементы
        } else {
            message.warning('Please select items to delete.');
        }
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[]) => {
            setSelectedRowKeys(selectedKeys);
        },
    };

    return (
        <div>
            <Divider><LinkOutlined /> {toteId}</Divider>
            {selectedRowKeys.length > 0 &&
                <Button
                    type="primary"
                    onClick={handleDelete}
                    style={{ marginBottom: 16 }}
                >
                    Delete Selected Items
                </Button>
            }
            <Table
                rowSelection={rowSelection}
                columns={[
                    { title: "Item ID", dataIndex: "id" },
                    { title: "Name", dataIndex: "name" },
                    { title: "Unique Number", dataIndex: "code" },
                    { title: "Full Date", dataIndex: "full_date" },
                ]}
                dataSource={tote_data}
            />
        </div>
    );
};

export default ToteInfo;
