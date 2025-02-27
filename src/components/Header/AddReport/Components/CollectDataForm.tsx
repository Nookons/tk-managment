import React, { useState } from 'react';
import {DatePicker, Select, Space, Button, Input, Checkbox, AutoComplete, message} from 'antd';
import { useAppSelector } from '../../../../hooks/storeHooks';
import { CloseSquareFilled } from "@ant-design/icons";
import dayjs, {Dayjs} from 'dayjs';
import {AddReport} from "../../../../utils/Report/AddReport";
import {IOption} from "../../../../types/Option";

const { TextArea } = Input;

interface IReportForm {
    start_time: Dayjs | null;
    status: string;
    reason: string;
    change_parts: IOption[];
    description: string;
    checkbox: boolean,
}

const CollectDataForm = ({ unit_id, type }: { unit_id: string; type: string }) => {
    const user = useAppSelector(state => state.user.user);
    const options = useAppSelector(state => state.options.options);

    const [formData, setFormData] = useState<IReportForm>({
        start_time: null,
        status: '',
        reason: '',
        change_parts: [],
        description: '',
        checkbox: false,
    });

    const statusOptions = [
        { value: 'completed', label: 'Completed' },
        { value: 'process', label: 'Process' },
        { value: 'founded', label: 'Founded' },
        { value: 'observation', label: 'Observation' },
    ];

    const reasonOptionsMap: Record<"robot" | "workstation", { value: string; label: string; }[]> = {
        robot: [
            { value: 'Lidar', label: 'Lidar' },
            { value: 'Left Wheel', label: 'Left Wheel' },
            { value: 'Right Wheel', label: 'Right Wheel' },
            { value: 'Climb motor', label: 'Climb motor' },
            { value: 'Other', label: 'Other' },
        ],
        workstation: [
            { value: 'X Motor Platform', label: 'X Motor Platform' },
            { value: 'Y Motor Platform', label: 'Y Motor Platform' },
            { value: 'X Motor Sucker', label: 'X Motor Sucker' },
            { value: 'Y Motor Sucker', label: 'Y Motor Sucker' },
            { value: 'X Belt Sucker', label: 'X Belt Sucker' },
            { value: 'Y Belt Sucker', label: 'Y Belt Sucker' },
            { value: 'Other', label: 'Other' },
        ],
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (user) {
            const obj = {
                unit_id: unit_id,
                type: type.toLowerCase(),
                ...formData
            }
            const result = await AddReport(obj, user)
            if (result) {
                handleClear()
                message.success("I'm so pleased to tell you that the report has now been added!")
            }
        }
    };

    const handleClear = () => {
        setFormData({
            start_time: null,
            status: '',
            reason: '',
            change_parts: [],
            description: '',
            checkbox: false,
        });
    };

    return (
        <div style={{ marginTop: 24, display: "flex", flexDirection: 'column', gap: 8 }}>
            <div>
                <label style={{marginRight: 14}}>Start Time:</label>
                <DatePicker
                    format="YYYY-MM-DD HH:mm"
                    showTime
                    value={formData.start_time ? dayjs(formData.start_time) : null}
                    onChange={(date) => handleChange('start_time', date ? date.toISOString() : null)}
                />
            </div>

            <div>
                <label style={{marginRight: 14}}>Status:</label>
                <Select
                    style={{ minWidth: 155 }}
                    options={statusOptions}
                    value={formData.status}
                    onChange={(value) => handleChange('status', value)}
                />
            </div>

            <div>
                <label style={{marginBottom: 14}}>Reason:</label>
                <AutoComplete
                    options={reasonOptionsMap[type.toLowerCase() as "robot" | "workstation"] || []}
                    style={{ width: "100%" }}
                    placeholder="Work Station search"
                    value={formData.reason}
                    allowClear={{ clearIcon: <CloseSquareFilled /> }}
                    filterOption={(inputValue, option) =>
                        option?.value?.toString().toUpperCase().includes(inputValue.toUpperCase()) ?? false
                    }
                    onChange={(value) => handleChange('reason', value)}
                />
            </div>

            <div>
                <label style={{marginBottom: 14}}>Description:</label>
                <TextArea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                />
            </div>

            {formData.checkbox && (
                <div>
                    <label style={{marginBottom: 14}}>Change Parts:</label>
                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: '100%' }}
                        placeholder="Please pick parts to change"
                        options={options.map(el => ({ value: el.name, label: el.name }))}
                        value={formData.change_parts}
                        onChange={(value) => handleChange('change_parts', value)}
                    />
                </div>
            )}

            <div>
                <Checkbox
                    checked={formData.checkbox}
                    onChange={(e) => handleChange('checkbox', e.target.checked)}
                >
                    Parts to Change
                </Checkbox>
            </div>

            <Space style={{ float: "right" }} wrap>
                <Button type="primary" onClick={handleSubmit}>
                    Submit
                </Button>
                <Button onClick={handleClear}>
                    Clear
                </Button>
            </Space>
        </div>
    );
};

export default CollectDataForm;
