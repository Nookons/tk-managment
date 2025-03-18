import React, {useEffect, useState} from 'react';
import {Drawer, Space, Button, MenuProps, Dropdown} from "antd";
import {
    DiffOutlined,
    DownOutlined,
    FileAddOutlined,
    GlobalOutlined,
} from "@ant-design/icons";
import {useAppDispatch, useAppSelector} from "../../hooks/storeHooks";
import AddItem from "./AddItem/AddItem";
import {userLeave} from "../../store/reducers/user";
import {useNavigate} from "react-router-dom";
import {USER_PROFILE} from "../../utils/const";
import ReportForm from "./AddReport/ReportForm";
import {getLanguage} from "../../utils/Cookies/Language";
import ItemDrawer from "./AddItem/ItemDrawer";
import ReportDrawer from "./AddReport/ReportDrawer";

export interface IDrawerOptions {
    item_drawer: boolean;
    item_child: boolean;
    report_drawer: boolean;
    report_child: boolean;
}

const MyHeader = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {user} = useAppSelector(state => state.user);

    const [drawer_options, setDrawer_options] = useState<IDrawerOptions>({
        item_drawer: false,
        item_child: false,
        report_drawer: false,
        report_child: false,
    });


    const [language, setLanguage] = useState<string>("");

    useEffect(() => {
        setLanguage(getLanguage());
    }, [setLanguage]);

    if (!user) {
        return null
    }

    const logout = () => {
        dispatch(userLeave())
    }

    const goProfile = () => {
        navigate(`${USER_PROFILE}?user_id=${user.id}`)
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

    const items_lang: MenuProps['items'] = [
        {
            key: '2',
            label: 'English',
            onClick: () => setLanguage('en'),
            extra: '🇬🇧',
            style: language === 'en' ? { fontWeight: 'bold', color: "rgba(0,33,255,0.66)"} : {}, // Подсвечиваем активный элемент
        },
        {
            key: '3',
            label: 'Chinese',
            onClick: () => setLanguage('cn'),
            extra: '🇨🇳',
            style: language === 'cn' ? { fontWeight: 'bold', color: "rgba(0,33,255,0.66)"} : {}, // Подсвечиваем активный элемент
        },
        {
            key: '4',
            label: 'Ukrainian',
            onClick: () => setLanguage('ua'),
            extra: '🇺🇦',
            style: language === 'ua' ? { fontWeight: 'bold', color: "rgba(0,33,255,0.66)"} : {}, // Подсвечиваем активный элемент
        },
    ];

    return (
        <div style={{display: 'flex', justifyContent: "flex-end", marginRight: 12}}>
            <Space>
                <Dropdown menu={{items}}>
                    <Button type={"text"} onClick={(e) => e.preventDefault()}>
                        <Space>
                            <span>{user.email}</span>
                            <DownOutlined/>
                        </Space>
                    </Button>
                </Dropdown>

                <Dropdown menu={{items: items_lang}}>
                    <Button type={"text"} onClick={(e) => e.preventDefault()}>
                        <Space>
                            <span><GlobalOutlined /></span>
                            <DownOutlined/>
                        </Space>
                    </Button>
                </Dropdown>

                <Button onClick={() => setDrawer_options((prev) => ({...prev, item_drawer: true}))}
                        icon={<FileAddOutlined/>}/>
                <Button onClick={() => setDrawer_options((prev) => ({...prev, report_drawer: true}))}
                        icon={<DiffOutlined/>}/>
            </Space>


            {/* That is drawer for add or create item in system kind of parent*/}
            <ItemDrawer
                drawer_options={drawer_options}
                setDrawer_options={setDrawer_options}
            />

            {/* That is drawer for add new report of errors in system*/}
            <ReportDrawer
                drawer_options={drawer_options}
                setDrawer_options={setDrawer_options}
            />
        </div>
    );
};

export default MyHeader;
