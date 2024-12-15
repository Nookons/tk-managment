import React, {useEffect, useState} from 'react';
import AppRouter from "./components/AppRouter";
import MyHeader from "./components/Header/MyHeader";
import Sider from "antd/es/layout/Sider";
import {Breadcrumb, Menu, MenuProps, message, theme} from 'antd';
import {
    AlertOutlined,
    AppstoreAddOutlined, BarcodeOutlined, BugOutlined, CarryOutOutlined, CheckCircleOutlined, FormOutlined,
    HomeOutlined, MergeCellsOutlined, RobotOutlined,
} from '@ant-design/icons';
import Layout, {Content, Footer, Header} from "antd/es/layout/layout";
import {useAppDispatch, useAppSelector} from "./hooks/storeHooks";
import {subscribeToItems} from "./store/reducers/items";
import {useNavigate} from "react-router-dom";
import {
    ADD_BROKEN_ROBOT,
    CREATE_OPTION,
    ERROR_TRANSLATION,
    HOME_ROUTE, REPORT_REFACTOR,
    ROBOTS_DISPLAY, TOTE_DISPLAY,
    WORK_STATION_DISPLAY
} from "./utils/const";
import SignIn from "./pages/SignIn/SignIn";
import {subscribeToTotes} from "./store/reducers/totes";
import {subscribeToOptions} from "./store/reducers/options";
import {subscribeToBroken_robots} from "./store/reducers/broken_robots";
import {subscribeToTasks} from "./store/reducers/tasks";

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}


const App = () => {
    const disptach = useAppDispatch();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(true);
    const {user, loading, error} = useAppSelector(state => state.user)


    const redirect = () => {
        message.error("Doesn't work at this moment")
    }

    const items = [
        {
            key: '1',
            icon: <HomeOutlined />,
            label: 'Home',
        },
        {
            key: '2',
            icon: <FormOutlined />,
            label: 'Report Refactor',
        },
        {
            key: '3',
            icon: <AppstoreAddOutlined />,
            label: 'Create Option',
        },
        getItem('Robots', 'sub1', <RobotOutlined />, [
            getItem('Repair', '4', <BugOutlined />),
            getItem('Robots display', '5', <AlertOutlined />),
            getItem('Solved', '6', <CheckCircleOutlined />),
            getItem('Inspection', '7', <CarryOutOutlined />),
        ]),
        getItem('Work Stations', 'sub2', <MergeCellsOutlined  />, [
            getItem('Display', '8', <BugOutlined />),
            getItem('Repair', '9', <BugOutlined />),
            getItem('Solved', '10', <CheckCircleOutlined />),
            getItem('Inspection', '11', <CarryOutOutlined />),
        ]),
        /*{
            key: '12',
            icon: <AppstoreAddOutlined />,
            label: 'Errors Translation',
        },*/
        {
            key: '13',
            icon: <BarcodeOutlined />,
            label: 'Totes display',
        },
    ];



    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    useEffect(() => {
        //disptach(subscribeToItems());
        disptach(subscribeToTotes());
        disptach(subscribeToOptions());
        //disptach(subscribeToBroken_robots());
        //disptach(subscribeToTasks());
    }, []);


    if (!user) {
        return (
            <SignIn />
        )
    }

    return (
        <>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <div className="demo-logo-vertical" />
                    <Menu
                        theme="dark"
                        defaultSelectedKeys={['1']}
                        mode="inline"
                        onClick={(e) => {
                            switch (e.key) {
                                case '1':
                                    navigate(HOME_ROUTE);
                                    break;
                                case '2':
                                    navigate(REPORT_REFACTOR);
                                    break;
                                case '3':
                                    navigate(CREATE_OPTION);
                                    break;
                                case '4':
                                    navigate(ADD_BROKEN_ROBOT);
                                    break;
                                case '5':
                                    navigate(ROBOTS_DISPLAY);
                                    break;
                                case '6':
                                    redirect();
                                    break;
                                case '7':
                                    redirect();
                                    break;
                                case '8':
                                    navigate(WORK_STATION_DISPLAY);
                                    break;
                                case '12':
                                    navigate(ERROR_TRANSLATION);
                                    break;
                                case '13':
                                    navigate(TOTE_DISPLAY);
                                    break;
                                default:
                                    break;
                            }
                        }}
                        items={items}
                    />
                </Sider>
                <Layout>
                    <Header style={{ padding: 0, background: colorBgContainer }} > <MyHeader /> </Header>
                    <Content style={{ margin: '0 16px' }}>
                        <Breadcrumb style={{ margin: '16px 0' }}>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>PNT</Breadcrumb.Item>
                        </Breadcrumb>
                        <div
                            style={{
                                padding: 24,
                                minHeight: 360,
                                background: colorBgContainer,
                                borderRadius: borderRadiusLG,
                            }}
                        >
                            <AppRouter />
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        <span>Powered by <a href={"https://github.com/Nookons"}>Nookon</a> ©{new Date().getFullYear()} version 0.0.3</span>
                    </Footer>
                </Layout>
            </Layout>
        </>
    );
};

export default App;