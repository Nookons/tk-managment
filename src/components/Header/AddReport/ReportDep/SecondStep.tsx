import React, {FC, useEffect, useState} from 'react';
import Col from "antd/es/grid/col";
import {Form, Row, Select, Space} from "antd";
import TextArea from "antd/es/input/TextArea";
import UserSelect from "../../../userSelect";
import { IUser } from "../../../../types/User";
import Button from "antd/es/button";
import {doc, updateDoc} from "firebase/firestore";
import {db} from "../../../../firebase";

interface SecondStepProps {
    next: () => void;
    prev: () => void;
    main_id: string;
}

interface LocalData {
    priority: string;
    task_status: string;
    finder: IUser[];
    repair: IUser[];
    remarks: string;
}

const SecondStep:FC <SecondStepProps> = ({next, prev, main_id}) => {
    const [localData, setLocalData] = useState<LocalData>({
        priority: "high",
        task_status: "not_started",
        finder: [],
        repair: [],
        remarks: "",
    });

    const [finder_array, setFinder_array] = useState<IUser[]>([]);
    const [repair_array, setRepair_array] = useState<IUser[]>([]);

    const onNextClick = async() => {
        const washingtonRef = doc(db, "tasks_record", main_id);

        const data = {
            ...localData,
            finder: finder_array,
            repair: repair_array,
        }

        await updateDoc(washingtonRef, {
            ...data
        });
    }

    const handleSelectChange = (value: string, field: keyof LocalData) => {
        setLocalData(prevState => ({
            ...prevState,
            [field]: value,
        }));
    };


    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>, field: keyof LocalData) => {
        setLocalData(prevState => ({
            ...prevState,
            [field]: e.target.value,
        }));
    };

    return (
        <Form layout="vertical">
            <Row gutter={[16, 16]}>
                <Col span={4}>
                    <Form.Item required label="Priority" name="priority">
                        <Select
                            value={localData.priority}
                            onChange={(value) => handleSelectChange(value, 'priority')}
                        >
                            <Select.Option value="high">High</Select.Option>
                            <Select.Option value="medium">Medium</Select.Option>
                            <Select.Option value="low">Low</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={4}>
                    <Form.Item required label="Task Status" name="task_status">
                        <Select
                            value={localData.task_status}
                            onChange={(value) => handleSelectChange(value, 'task_status')}
                        >
                            <Select.Option value="not_started">Not started</Select.Option>
                            <Select.Option value="started">Started</Select.Option>
                            <Select.Option value="finished">Finished</Select.Option>
                            <Select.Option value="observation">Observation</Select.Option>
                        </Select>
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item required label="Finder" name="finder">
                        <UserSelect
                            set_array={setFinder_array}
                        />
                    </Form.Item>
                </Col>

                <Col span={8}>
                    <Form.Item label="Repair" name="repair">
                        <UserSelect set_array={setRepair_array}/>
                    </Form.Item>
                </Col>

                <Col span={24}>
                    <Form.Item label="Remarks" name="remarks">
                        <TextArea
                            rows={4}
                            value={localData.remarks}
                            onChange={(e) => handleInputChange(e, 'remarks')}
                        />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Space>
                        <Button type="primary" onClick={onNextClick}>
                            Next
                        </Button>
                        <Button type="default" onClick={() => prev()}>
                            Prev
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Form>
    );
};

export default SecondStep;
