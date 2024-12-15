import React, {FC, useEffect} from 'react';
import useUserFetch from "../../../hooks/useUserFetch";
import {Avatar, Space} from "antd";

interface UserCardProps {
    user: string;
}

const UserCard:FC <UserCardProps> = ({user}) => {

    const {data, loading, error} = useUserFetch(user)

    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <Space>
            <Avatar size={"large"} src={data?.profilePicture}/>
            {data?.first_name
                ? <h4>{data?.first_name} {data?.last_name}</h4>
                : <h4>{data?.email}</h4>
            }
        </Space>
    );
};

export default UserCard;