import React, {useEffect, useState} from 'react';
import {Drawer, Space, Button, MenuProps, Dropdown, message} from "antd";
import {DiffOutlined, DownOutlined, FileAddOutlined, SearchOutlined, SettingOutlined} from "@ant-design/icons";
import {useAppDispatch, useAppSelector} from "../../hooks/storeHooks";
import AddItem from "./AddItem/AddItem";
import {userLeave} from "../../store/reducers/user";
import {useNavigate} from "react-router-dom";
import {USER_PROFILE} from "../../utils/const";
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "../../firebase";
import ReportForm from "./AddReport/ReportForm";

const MyHeader = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const {user} = useAppSelector(state => state.user);

    const [drawer_options, setDrawer_options] = useState({
        item_drawer: false,
        report_drawer: false
    });

    const logout = () => {
        dispatch(userLeave())
    }

    const goProfile = () => {
        navigate(USER_PROFILE)
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
            onClick: goProfile,
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
        <div style={{display: 'flex', justifyContent: "flex-end", marginRight: 12}}>
            <Space>
                {user &&
                    <Dropdown menu={{items}}>
                        <Button type={"text"} onClick={(e) => e.preventDefault()}>
                            <Space>
                                <span>{user.email}</span>
                                <DownOutlined/>
                            </Space>
                        </Button>
                    </Dropdown>
                }
                <Button onClick={() => setDrawer_options((prev) => ({...prev, item_drawer: true}))} icon={<FileAddOutlined/>}/>
                <Button onClick={() => setDrawer_options((prev) => ({...prev, report_drawer: true}))} icon={<DiffOutlined />}/>
            </Space>

            <Drawer
                title="Add Item"
                width={"45%"}
                onClose={() => setDrawer_options((prev) => ({...prev, item_drawer: false}))}
                open={drawer_options.item_drawer}
            >
                <AddItem/>
            </Drawer>

            <Drawer
                title="Add Report"
                width={"100%"}
                onClose={() => setDrawer_options((prev) => ({...prev, report_drawer: false}))}
                open={drawer_options.report_drawer}
            >
                <ReportForm />
            </Drawer>
        </div>
    );
};

export default MyHeader;
