import React from 'react';
import {useGetUser} from "../../../hooks/User/useGetUser";
import {Avatar, Row, Skeleton} from "antd";
import Col from "antd/es/grid/col";
import {UserOutlined} from "@ant-design/icons";
import styles from '../Home.module.css'
import {useNavigate} from "react-router-dom";
import {USER_PROFILE} from "../../../utils/const";

const UserCard = ({user_id}: {user_id: string | undefined}) => {
    const navigate = useNavigate();
    const {user, loading, error} = useGetUser(user_id || "");

    if (loading) {
        return <Skeleton.Button active/>
    }

    if (error) {
        return null;
    }

    const onClickHandle = () => {
        navigate(`${USER_PROFILE}?user_id=${user_id}`);
    }

    return (
        <Row onClick={onClickHandle} className={styles.userCard} gutter={[4, 4]}>
            <Col>
                <Avatar src={user?.profilePicture} shape="square" icon={<UserOutlined/>}/>
            </Col>
            <Col>
                <p style={{margin: 0}}>{user?.email}</p>
            </Col>
        </Row>
    );
};

export default UserCard;