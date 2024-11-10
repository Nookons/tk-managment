import React, { useState } from 'react';
import { useForm } from "antd/es/form/Form";
import {
    Col,
    Form,
    Input,
    message,
    Row,
    Spin,
    Switch,
    Upload,
    Checkbox,
    TimePicker, Select, Space,
} from "antd";
import Button from "antd/es/button";
import { InboxOutlined } from "@ant-design/icons";
import useFetchOptions from "../../../hooks/useFetchOptions";
import { db, storage } from "../../../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import dayjs from "dayjs";
import {useAppSelector} from "../../../hooks/storeHooks";

const { Dragger } = Upload;

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
    const { options, loading } = useFetchOptions();
    const [filesUrls, setFilesUrls] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [isMultipleItems, setIsMultipleItems] = useState(false);

    const handleUploadFiles = async (file: File): Promise<string> => {
        const robotNumber = form.getFieldValue("robot_number");
        const fileRef = ref(storage, `robots/${robotNumber}/${dayjs().format("YYYY-MM-DD")}/${file.name}`);
        const uploadTask = uploadBytesResumable(fileRef, file);

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
            files_array: filesUrls,
            timestamp: serverTimestamp(),
            user: user ? user.email : "unknown",
            error_id: Date.now(),
            change_items: values.change_items || [],
        };

        // Ensure all values are serialized correctly before uploading
        const serializedData = JSON.parse(JSON.stringify(errorData));

        const updatedErrorArray = currentData.error_array
            ? [...currentData.error_array, serializedData]
            : [serializedData];

        await setDoc(robotRef, {
            last_update: serverTimestamp(),
            error_array: updatedErrorArray
        }, { merge: true });
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

    const customUpload = async ({ file, onSuccess, onError }: any) => {
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

    return (
        <Form form={form} layout="vertical" onFinish={handleFormFinish}>
            <Row gutter={16}>
                <Col>
                    <Form.Item label="Removed" name="isRemove" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item label="Log" name="isLog" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        label="Robot Number"
                        name="robot_number"
                        rules={[
                            { required: true, message: "Please input the robot number!" },
                            { len: 7, message: "Robot number must be exactly 7 characters." }
                        ]}
                    >
                        <Input maxLength={7} />
                    </Form.Item>
                </Col>
                <Col span={2}>
                    <Form.Item label="Crash Time" name="crash_time">
                        <TimePicker format={format} />
                    </Form.Item>
                </Col>
                <Col span={10}>
                    {loading ? (
                        <Spin size="large" />
                    ) : (
                        <Form.Item label="Items to Change" name="change_items">
                            <Select
                                mode={"tags"} // Use mode "tags" for multiple selections
                                style={{ width: "100%" }}
                                options={options.map((item) => ({ value: item.code }))}
                                placeholder="Select or type items"
                            />
                        </Form.Item>
                    )}
                </Col>
                <Col span={12}>
                    <Form.Item label="Notes" name="note">
                        <Input.TextArea rows={3} />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item label="Upload" name="upload">
                        <Dragger
                            customRequest={customUpload}
                            multiple
                            showUploadList={{ showRemoveIcon: true }}
                            onRemove={(file) => {
                                setFilesUrls((prev) => prev.filter((url) => !url.includes(file.name)));
                            }}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag files to this area to upload</p>
                            <p className="ant-upload-hint">Upload logs, images, or videos for verification.</p>
                        </Dragger>
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
