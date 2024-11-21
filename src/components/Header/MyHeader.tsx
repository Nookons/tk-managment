import React, { useState } from 'react';
import {Drawer, Space, Button, MenuProps, Dropdown, message} from "antd";
import {DownOutlined, FileAddOutlined, SearchOutlined, SettingOutlined} from "@ant-design/icons";
import {useAppDispatch, useAppSelector} from "../../hooks/storeHooks";
import AddItem from "./AddItem/AddItem";
import {userLeave} from "../../store/reducers/user";

const MyHeader = () => {
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const { user } = useAppSelector(state => state.user);

    const showDrawer = () => {
        setOpen(true);
    };

    const closeDrawer = () => {
        setOpen(false);
    };

    const logout = () => {
        dispatch(userLeave())
    }

    const items: MenuProps['items'] = [
        {
            key: '1',
            label: 'My Account',
            disabled: true,
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            label: 'Profile',
            extra: '⌘P',
        },
        {
            key: '3',
            label: 'Log out',
            onClick: logout,
            extra: '⌘B',
        },
    ];

    return (
        <div style={{ display: 'flex', justifyContent: "flex-end", marginRight: 12 }}>
            <Space>
                {user &&
                    <Dropdown menu={{ items }}>
                        <Button type={"text"} onClick={(e) => e.preventDefault()}>
                            <Space>
                                <span>{user.email}</span>
                                <DownOutlined />
                            </Space>
                        </Button>
                    </Dropdown>
                }
                <Button onClick={showDrawer} icon={<FileAddOutlined />} />
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
