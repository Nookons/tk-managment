import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../hooks/storeHooks";
import { Divider, Table, Button, message } from "antd";
import { LinkOutlined } from '@ant-design/icons';
import {removeItem} from "../../../utils/Item/RemoveItem";
import {ITote} from "../../../types/Tote";
import {removeItems} from "../../../store/reducers/items";

const ToteInfo = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const toteId = params.get("id"); // Извлекаем значение параметра id

    const dispatch = useAppDispatch();
    const { items} = useAppSelector(state => state.items);

    const {totes} = useAppSelector(state => state.totes)

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
            dispatch(removeItems(selectedRowKeys));

            if (totes && toteId) {
                const tote = totes.find(item => item.tote_number === toteId);

                if (tote) {
                    removeItem({ selectedRowKeys, tote });
                } else {
                    message.warning('Tote not found.');
                }
            }

            message.success('Selected items have been deleted.');
            setSelectedRowKeys([]); // Clear selected items
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
