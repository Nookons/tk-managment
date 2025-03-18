import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import {useGetUser} from "../../hooks/User/useGetUser";
import {Alert, Avatar, Descriptions, Divider, Image, List, Row, Skeleton, Table} from "antd";
import Col from "antd/es/grid/col";
import dayjs from "dayjs";
import {useUserHistory} from "../../hooks/User/useUserHistory";


const Profile = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const user_id = params.get("user_id");

    const {user, loading, error} = useGetUser(user_id || "");
    const {userHistoryData} = useUserHistory(user_id || "");

    const [sortedHistory, setSortedHistory] = useState<any[]>([]);

    useEffect(() => {
        if (userHistoryData) {
            const sorted = userHistoryData.sort((a, b) => b.add_time - a.add_time);
            setSortedHistory(sorted)
        }
    }, [userHistoryData]);

    if (loading) {
        return <Skeleton active />
    }
    if (error) {
        return  <Alert message={'Something went wrong'} />
    }

    return (
        <div>
            <Row gutter={[14, 14]}>
                <Col span={6}>
                    <Image
                        width={"100%"}
                        src={user?.profilePicture}
                    />
                </Col>
                <Col span={6}>
                    <Descriptions title={`${user?.first_name} ${user?.last_name}`}>
                        <Descriptions.Item span={3} label="Position">{user?.position}</Descriptions.Item>
                        <Descriptions.Item span={3} label="Role">{user?.role}</Descriptions.Item>
                        <Descriptions.Item span={3} label="Last Modify">{user?.last_modify}</Descriptions.Item>
                        <Descriptions.Item span={3} label="Work since:">{dayjs(user?.start_work_time).format("YYYY-MM-DD")}</Descriptions.Item>
                        <Descriptions.Item span={3} label="Level">1</Descriptions.Item>
                        <Descriptions.Item span={3} label="Experience">{user?.experience}</Descriptions.Item>
                    </Descriptions>
                </Col>
                <Col span={24}>
                    <Divider>User History of reports</Divider>
                    <Table
                        columns={[
                            {title: "Add Time", dataIndex: "add_time_string"},
                            {title: "Report ID", dataIndex: "report_id"},
                            {title: "Type", dataIndex: "type"},
                        ]}
                        dataSource={sortedHistory}
                    />

                </Col>
            </Row>
        </div>
    )
};

export default Profile;