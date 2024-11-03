import React, { useState } from 'react';
import { useForm } from "antd/es/form/Form";
import {
    AutoComplete,
    Col,
    DatePicker,
    Form,
    Input,
    message,
    Row,
    Spin,
    Switch,
    Upload,
    Checkbox,
    TimePicker, Avatar
} from "antd";
import Button from "antd/es/button";
import { InboxOutlined } from "@ant-design/icons";
import useFetchOptions from "../../../hooks/useFetchOptions";
import { IOption } from "../../../types/Item";
import { ref } from 'firebase/storage';
import {db, storage} from "../../../firebase";
import { getDownloadURL, uploadBytesResumable } from 'firebase/storage';
import dayjs from "dayjs";
import {arrayUnion, doc, setDoc, updateDoc} from 'firebase/firestore';

const { Dragger } = Upload;

const AddBroken: React.FC = () => {
    const [form] = useForm();
    const format = 'HH:mm';
    const { options, loading } = useFetchOptions();

    const [robot_number, setRobot_number] = useState<string>("");

    const [itemToChange, setItemToChange] = useState<string | null>(null);
    const [isMoreOne, setIsMoreOne] = useState<boolean>(false);

    const [files_array, setFiles_array] = useState<string[]>([]);

    const uploadData = async (values: any) => {
        const robotRef = doc(db, "robots_break", robot_number);

        console.log(robotRef);

        const error_data = {
            ...values,
            files_array: files_array
        }

        await setDoc(robotRef, {
            last_update: dayjs().valueOf(),
            error_array: [error_data]
        });
    }

    const onFormFinish = (values: Record<string, any>): void => {
        uploadData(values)
    };

    const onFormClearClick = (): void => {
        form.resetFields();
    };

    const customUpload = async (options: any) => {
        const { file, onSuccess, onError, onProgress } = options;

        try {
            const storageRef = ref(storage, `robots/${robot_number}/${dayjs().format("YYYY-MM-DD")}/${file.name}`);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    onProgress({ percent: progress });
                },
                (error) => {
                    message.error(`Upload failed: ${error.message}`);
                    onError(error);
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    message.success(`${file.name} uploaded successfully.`);

                    setFiles_array((prev) => [...prev, downloadURL])

                    console.log("File available at", downloadURL);
                    onSuccess(null, file);
                }
            );
        } catch (error) {
            error && message.error(`Upload failed: ${error.toString()}`);
            onError(error);
        }
    };

    return (
        <Form
            form={form}
            layout="horizontal"
            initialValues={{ remember: true }}
            onFinish={onFormFinish}
        >
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item label="Robot Number" name="robot_number">
                        <Input.OTP length={7}  value={robot_number} onChange={(value) => setRobot_number(value)} />
                    </Form.Item>
                </Col>
                <Col span={6}>
                    <Form.Item label="Crash Time" name="datepicker">
                        <TimePicker format={format} />
                    </Form.Item>
                </Col>
                <Col span={3}>
                    <Form.Item label="Is Removed" name="isRemove" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Col>
                <Col span={3}>
                    <Form.Item label="Log Present" name="isLog" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    {loading ? (
                        <Spin size="large" />
                    ) : (
                        <Form.Item label="Item to change" name="change_items">
                            <AutoComplete
                                style={{ width: "100%" }}
                                value={itemToChange}
                                onChange={(value) => setItemToChange(value as string)}
                                options={options.map((item: IOption) => ({ value: item.code }))}
                                placeholder="Unique Item Number"
                            />
                        </Form.Item>
                    )}
                </Col>
                <Col span={6}>
                    <Form.Item valuePropName="checked">
                        <Checkbox onChange={() => setIsMoreOne(!isMoreOne)}>Multiple items</Checkbox>
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item label="Notes" name="note">
                        <Input.TextArea rows={4} />
                    </Form.Item>
                </Col>
            </Row>
            {robot_number.length === 7 &&
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item label="Upload" name="upload">
                            <Dragger customRequest={customUpload}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">Click or drag files to upload</p>
                                <p className="ant-upload-hint">Upload logs, images, or videos for verification.</p>
                            </Dragger>
                        </Form.Item>
                    </Col>
                </Row>
            }
            <Row justify="center" gutter={8}>
                <Button type="primary" htmlType="submit" style={{ marginRight: '10px' }}>
                    Submit
                </Button>
                <Button onClick={onFormClearClick}>Clear</Button>
            </Row>
        </Form>
    );
};

export default AddBroken;
