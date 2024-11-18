import React, {useEffect, useState} from 'react';
import {useForm} from "antd/es/form/Form";
import {
    Col,
    Form,
    Input,
    message,
    Row,
    Upload,
    TimePicker, Select, Space, Card, Descriptions, Slider, Popover,
} from "antd";
import Button from "antd/es/button";
import {FrownOutlined, InboxOutlined, SmileOutlined} from "@ant-design/icons";
import useFetchOptions from "../../../hooks/useFetchOptions";
import {db, storage} from "../../../firebase";
import {ref, getDownloadURL, uploadBytesResumable} from 'firebase/storage';
import {doc, getDoc, setDoc, serverTimestamp} from 'firebase/firestore';
import dayjs, {Dayjs} from "dayjs";
import {useAppSelector} from "../../../hooks/storeHooks";
import SelectItems from "./dep/SelectItems";
import {IItem, IOption} from "../../../types/Item";
import all_robot_data from '../../../utils/Robots.json'
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Text from "antd/es/typography/Text";
import {BrokenReportToHistory} from "../../../utils/Robot/AddBrokenReport";

const {Dragger} = Upload;

dayjs.extend(utc);
dayjs.extend(timezone);

interface FormValues {
    robot_number: string;
    crash_time?: dayjs.Dayjs;
    isRemove?: boolean;
    isLog?: boolean;
    change_items?: string[];
    note?: string;
}

const AddBroken: React.FC = () => {
    const [form] = useForm<FormValues>();
    const {user} = useAppSelector(state => state.user)
    const format = 'HH:mm';
    const [filesUrls, setFilesUrls] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    const [change_data, setChange_data] = useState<IOption[]>([]);


    const handleUploadFiles = async (file: File): Promise<string> => {
        const robotNumber = form.getFieldValue("robot_number");
        const fileRef = ref(storage, `robots/${robotNumber}/${dayjs().format("YYYY-MM-DD")}/${file.name}`);
        const uploadTask = uploadBytesResumable(fileRef, file);

        if (!robotNumber) {
            message.error("Robot number is required.");
            return Promise.reject("Robot number is required.");
        }

        return new Promise((resolve, reject) => {
            uploadTask.on(
                "state_changed",
                null,
                (error) => reject(error),
                async () => {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(url);
                }
            );
        });
    };

    const uploadData = async (values: FormValues) => {
        const robotNumber = values.robot_number;
        if (!robotNumber) {
            message.error("Robot number is required.");
            return;
        }

        const robotRef = doc(db, "robots_break", robotNumber);
        const robotDoc = await getDoc(robotRef);
        const currentData = robotDoc.exists() ? robotDoc.data() : {};

        const errorData = {
            ...values,
            crash_time: values.crash_time ? values.crash_time.valueOf() : undefined,
            chines_time: time ? dayjs(time).tz("Asia/Shanghai").format("dddd, MMMM DD, YYYY [at] HH:mm:ss") : undefined,
            files_array: filesUrls,
            timestamp: serverTimestamp(),
            user: user ? user.email : "unknown",
            error_id: Date.now(),
            change_items: change_data,
        };

        // Ensure all values are serialized correctly before uploading
        const serializedData = JSON.parse(JSON.stringify(errorData));

        const updatedErrorArray = currentData.error_array
            ? [...currentData.error_array, serializedData]
            : [serializedData];

        await setDoc(robotRef, {
            robot_number: values.robot_number,
            last_update: serverTimestamp(),
            error_array: updatedErrorArray
        }, {merge: true});

        message.success("Data saved successfully.");
    };

    const handleFormFinish = async (values: FormValues) => {
        try {
            await uploadData(values);
            form.resetFields();
            setFilesUrls([]);
        } catch (error) {
            message.error("Failed to save data.");
        }
    };

    const customUpload = async ({file, onSuccess, onError}: any) => {
        try {
            const url = await handleUploadFiles(file);
            setFilesUrls((prev) => [...prev, url]);
            onSuccess(null, file);
            message.success(`${file.name} uploaded successfully.`);
        } catch (error) {
            onError(error);
            message.error(`Failed to upload ${file.name}`);
        }
    };

    const [current_robot, setCurrent_robot] = useState<any | null>(null);

    const onChange = (value: string) => {
        const founded = all_robot_data.find((r) => r.id.toString() === value);
        setCurrent_robot(founded)
    };

    const [time, setTime] = useState<Dayjs | null>(null);

    const handleTimeChange = (time: Dayjs | null) => {
        setTime(time);
    };

    return (
        <Form form={form} layout="vertical" onFinish={handleFormFinish}>
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                        label="Robot Number"
                        name="robot_number"
                        rules={[
                            {required: true, message: "Please input the robot number!"},
                            {len: 7, message: "Robot number must be exactly 7 characters."}
                        ]}
                    >
                        <Select
                            showSearch
                            placeholder="Select a robot"
                            optionFilterProp="label"
                            maxLength={7}
                            value={current_robot ? current_robot.id.toString() : ""}
                            onChange={onChange}
                            options={all_robot_data.map(el => ({value: el.id.toString(), label: el.id.toString()}))}
                        />
                        {current_robot &&
                            <Descriptions style={{marginTop: 14}} title="" size="small">
                                <Descriptions.Item label="Robot IP">{current_robot.ip}</Descriptions.Item>
                                <Descriptions.Item label="Robot Type">{current_robot.robotType}</Descriptions.Item>
                                <Descriptions.Item label="Version">{current_robot.version}</Descriptions.Item>
                            </Descriptions>
                        }
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Items to Change" name="change_items">
                        <SelectItems setChange_data={setChange_data}/>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Upload" name="upload">
                        <Dragger
                            customRequest={customUpload}
                            multiple
                            showUploadList={{showRemoveIcon: true}}
                            onRemove={(file) => {
                                setFilesUrls((prev) => prev.filter((url) => !url.includes(file.name)));
                            }}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined/>
                            </p>
                            <p className="ant-upload-text">Click or drag files to this area to upload</p>
                            <p className="ant-upload-hint">Upload logs, images, or videos for verification.</p>
                        </Dragger>
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Space>
                        <Form.Item label="Crash Time" name="crash_time">
                            <TimePicker format={format} onChange={handleTimeChange}/>
                        </Form.Item>
                        <Popover content={<span>It's time for logs, my friends!</span>} title="Chine time">
                            <Button style={{marginTop: 4}} type="dashed">
                                {time
                                    ? dayjs(time).tz("Asia/Shanghai").format("HH:mm")
                                    : "🙈"
                                }
                            </Button>
                        </Popover>
                    </Space>
                    <Form.Item label="Notes" name="note">
                        <Input.TextArea placeholder={"Please leave here some notes about error or bad condition"}
                                        rows={4}/>
                    </Form.Item>
                </Col>
            </Row>
            <Row justify="center" gutter={8}>
                <Space>
                    <Button type="primary" htmlType="submit" disabled={uploading}>
                        Submit
                    </Button>
                    <Button onClick={() => form.resetFields()} disabled={uploading}>
                        Clear
                    </Button>
                </Space>
            </Row>
        </Form>
    );
};

export default AddBroken;
