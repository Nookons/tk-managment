import React, {useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../hooks/storeHooks";
import {
    Alert,
    Descriptions,
    Divider,
    Form,
    Image,
    Input, message,
    Modal,
    Progress,
    Row,
    Skeleton,
    Space,
    Table,
} from "antd";
import Col from "antd/es/grid/col";
import Button from "antd/es/button";
import {doc, updateDoc} from "firebase/firestore";
import {db} from "../../firebase";
import dayjs from "dayjs";
import {userLeave} from "../../store/reducers/user";
import UploadPicture from "./dep/UploadPicture";

const Profile = () => {
    const disptach = useAppDispatch();
    const {user, loading, error} = useAppSelector(state => state.user);

    const [isChanging, setIsChanging] = useState<boolean>(false);
    const [user_data, setUser_data] = useState({
        first_name: user ? user.first_name : "",
        last_name: user ? user.last_name : "",
    });

    if (loading) {
        return <Skeleton/>
    }

    if (!user || error) {
        return (
            <Alert
                message="Error"
                description="Something went wrong."
                type="error"
            />
        )
    }

    const onUserEdit = async () => {
        if (!user_data.first_name || !user_data.last_name) {
            return message.error("First name and last name cannot be empty.");
        }

        if (!user || !user.id) {
            return message.error("Please connect with the development department to resolve this error.");
        }

        try {
            const userRef = doc(db, "employers", user.id);
            await updateDoc(userRef, {
                ...user_data,
                last_modify: dayjs().format("YYYY-MM-DD [at] HH:mm:ss"),
            });

            await message.loading(`You're data was success saved`)
            setIsChanging(false)

            disptach(userLeave())
        } catch (err) {
            message.error("Failed to update user data. Please try again.");
            console.error("Error in onUserEdit:", err);
        }
    };


    return (
        <Row gutter={[16, 16]}>

            <Modal title="Changes modal" onCancel={() => setIsChanging(false)} onOk={onUserEdit} open={isChanging} okText="Confirm" cancelText="Cancel">
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Space>
                            <Input
                                value={user_data.first_name}
                                onChange={(e) => setUser_data((prev) => ({...prev, first_name: e.target.value}))}
                                addonBefore="First name"
                                defaultValue={user.first_name}
                            />
                            <Input
                                value={user_data.last_name}
                                onChange={(e) => setUser_data((prev) => ({...prev, last_name: e.target.value}))}
                                addonBefore="Last Name"
                                defaultValue={user.last_name}
                            />
                        </Space>
                    </Col>
                    <Col span={24}>
                        <UploadPicture user={user}/>
                    </Col>
                </Row>
            </Modal>

            <Col xs={4} xl={4}>
                <Image
                    width={"100%"}
                    src={user.profilePicture ? user.profilePicture : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwDzsfYMq7wP8h-Vj3nDN1tMIwVY3NM8ZydA&s"}
                />
            </Col>
            <Col xs={14} xl={14}>
                <Descriptions size={"small"} title="User Info">
                    <Descriptions.Item span={3} label="email">{user.email}</Descriptions.Item>
                    <Descriptions.Item span={3} label="first_name">{user.first_name}</Descriptions.Item>
                    <Descriptions.Item span={3} label="last_name">{user.last_name}</Descriptions.Item>
                    <Descriptions.Item span={3} label="start work">{dayjs(user.start_work_time).format("dddd, MMMM DD, YYYY")}</Descriptions.Item>
                    <Descriptions.Item span={3} label="position">{user.position}</Descriptions.Item>
                    <Descriptions.Item span={3} label="level">1</Descriptions.Item>
                    <Descriptions.Item span={3} label="expiriense">
                        <Progress percent={user.experience} size="small"/>
                    </Descriptions.Item>
                </Descriptions>
            </Col>
            <Col xs={6} xl={6}>
                <Row gutter={[4, 4]}>
                    <Col span={12}><Button onClick={() => setIsChanging(true)} style={{width: "100%"}}>Change</Button></Col>
                    <Col span={12}><Button danger style={{width: "100%"}}>Remove</Button></Col>
                </Row>
            </Col>
            <Col xs={24} xl={24}>
                <Divider>Last actions</Divider>
                <Table
                    columns={[
                        {title: <span>ID</span>, dataIndex: "id"},
                        {title: <span>Type</span>, dataIndex: "type"},
                        {title: <span>Time</span>, dataIndex: "time"},
                        {title: <span>From</span>, dataIndex: "from"},
                        {title: <span>To</span>, dataIndex: "to"},
                    ]}
                    dataSource={[]}
                />
            </Col>
        </Row>
    );
};

export default Profile;