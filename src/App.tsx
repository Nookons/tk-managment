import React, {useEffect, useState} from 'react';
import AppRouter from "./components/AppRouter";
import MyHeader from "./components/Header/MyHeader";
import Sider from "antd/es/layout/Sider";
import {Breadcrumb, Menu, MenuProps, theme} from 'antd';
import {
    AppstoreAddOutlined,
    HomeOutlined,
} from '@ant-design/icons';
import Layout, {Content, Footer, Header} from "antd/es/layout/layout";
import {useAppDispatch} from "./hooks/storeHooks";
import {subscribeToItems} from "./store/reducers/items";
import {useNavigate} from "react-router-dom";
import {CREATE_OPTION, HOME_ROUTE} from "./utils/const";


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


    const items = [
        {
            key: '1',
            icon: <HomeOutlined />,
            label: 'Home',
            onClick: () => navigate(HOME_ROUTE),
        },
        {
            key: '2',
            icon: <AppstoreAddOutlined />,
            label: 'Create Option',
            onClick: () => navigate(CREATE_OPTION),
        },
    ];

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    useEffect(() => {
        disptach(subscribeToItems());
    }, []);



    return (
        <>
            <Layout style={{ minHeight: '100vh' }}>
                <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                    <div className="demo-logo-vertical" />
                    <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
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