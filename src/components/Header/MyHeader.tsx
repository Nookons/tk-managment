import React, { useState } from 'react';
import {Drawer, Space, Button} from "antd";
import { FileAddOutlined, SearchOutlined } from "@ant-design/icons";
import { useAppSelector } from "../../hooks/storeHooks";
import AddItem from "./AddItem/AddItem";

const MyHeader = () => {
    const [open, setOpen] = useState(false);
    const { user } = useAppSelector(state => state.user);

    const showDrawer = () => {
        setOpen(true);
    };

    const closeDrawer = () => {
        setOpen(false);
    };

    return (
        <div style={{ display: 'flex', justifyContent: "flex-end", marginRight: 12 }}>
            <Space>
                {user && <div>{user.email}</div>}
                <Button onClick={showDrawer} icon={<FileAddOutlined />} />
                <Button icon={<SearchOutlined />} />
            </Space>

            <Drawer
                title="Add Item"
                width={"45%"}
                onClose={closeDrawer}
                open={open}
            >
                <AddItem />
            </Drawer>
        </div>
    );
};

export default MyHeader;
