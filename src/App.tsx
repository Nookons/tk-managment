import React, {useEffect, useState} from 'react';
import AppRouter from "./components/AppRouter";
import MyHeader from "./components/Header/MyHeader";
import Sider from "antd/es/layout/Sider";
import {Breadcrumb, Menu, MenuProps, message, theme} from 'antd';
import {
    AppstoreAddOutlined, BugOutlined, CarryOutOutlined, CheckCircleOutlined,
    HomeOutlined, MergeCellsOutlined, RobotOutlined,
} from '@ant-design/icons';
import Layout, {Content, Footer, Header} from "antd/es/layout/layout";
import {useAppDispatch, useAppSelector} from "./hooks/storeHooks";
import {subscribeToItems} from "./store/reducers/items";
import {useNavigate} from "react-router-dom";
import {CREATE_OPTION, HOME_ROUTE} from "./utils/const";
import SignIn from "./pages/SignIn/SignIn";
import {subscribeToTotes} from "./store/reducers/totes";
import {subscribeToOptions} from "./store/reducers/options";

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
    const [collapsed, setCollapsed] = useState(false);
    const {user, loading, error} = useAppSelector(state => state.user)


    const test = () => {
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
            icon: <AppstoreAddOutlined />,
            label: 'Create Option',
        },
        getItem('Robots', 'sub1', <RobotOutlined />, [
            getItem('Repair', '4', <BugOutlined />),
            getItem('Solved', '5', <CheckCircleOutlined />),
            getItem('Inspection', '6', <CarryOutOutlined />),
        ]),
        getItem('Work Stations', 'sub2', <MergeCellsOutlined  />, [
            getItem('Repair', '7', <BugOutlined />),
            getItem('Solved', '8', <CheckCircleOutlined />),
            getItem('Inspection', '9', <CarryOutOutlined />),
        ]),
    ];



    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    useEffect(() => {
        disptach(subscribeToItems());
        disptach(subscribeToTotes());
        disptach(subscribeToOptions());
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
                                    navigate(CREATE_OPTION);
                                    break;
                                case '4': // Repair item
                                    test();
                                    break;
                                case '5': // Repair item
                                    test();
                                    break;
                                case '6': // Repair item
                                    test();
                                    break;
                                // Add more cases as needed
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
                        Powered by Nookon ©{new Date().getFullYear()}
                    </Footer>
                </Layout>
            </Layout>
        </>
    );
};

export default App;