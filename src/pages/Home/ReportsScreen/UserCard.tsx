import React from 'react';
import {useGetUser} from "../../../hooks/User/useGetUser";
import {Avatar, Descriptions, Row, Skeleton} from "antd";
import Col from "antd/es/grid/col";
import {UserOutlined} from "@ant-design/icons";

const UserCard = ({user_id}: {user_id: string | undefined}) => {
    const {user, loading, error} = useGetUser(user_id || "");

    if (loading) {
        return <Skeleton.Button active/>
    }

    if (error) {
        return null;
    }

    return (
        <Row style={{alignItems: "center",border: "1px dashed rgba(0,0,0,0.15)", borderRadius: 4}} gutter={[14, 14]}>
            <Col>
                <Avatar src={user?.profilePicture} shape="square" icon={<UserOutlined/>}/>
            </Col>
            <Col>
                <p>{user?.email}</p>
            </Col>
        </Row>
    );
};

export default UserCard;