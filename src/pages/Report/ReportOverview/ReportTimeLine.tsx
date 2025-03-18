import React, { useEffect, useState } from 'react';
import {Timeline, Spin, Alert, Tag} from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';
import { useReportTimeLine } from '../../../hooks/Reports/useReportTimeLine';
import { IReportTimelineItem } from '../../../types/Reports/Report';
import UserCard from "../../Home/ReportsScreen/UserCard";

const ReportTimeLine = ({ report_id }: { report_id: string | null }) => {
    const { timeLineData, loading, error } = useReportTimeLine(report_id || "");
    const [sorted_data, setSorted_data] = useState<IReportTimelineItem[]>([]);

    useEffect(() => {
        if (timeLineData) {
            const sorted = timeLineData.sort((a, b) => b.add_time - a.add_time);
            setSorted_data(sorted)
            console.log(timeLineData);
            console.log(sorted);
        }
    }, [timeLineData]);

    if (loading) {
        return <Spin size="large" />;
    }

    if (!timeLineData) {
        return null
    }

    if (error) {
        return <Alert message={<span>Error</span>} description={<span>{error}</span>} showIcon type="error" />;
    }

    return (
        <Timeline>
            {sorted_data.map((item) => (
                <Timeline.Item key={item.id} dot={<ClockCircleOutlined style={{ fontSize: '16px' }} />}>
                    <Tag color={"#989898"} style={{ margin: 4, textWrap: "wrap"}}>
                        <span>{item.type} {item.type !== "Create report" && "to"} {Array.isArray(item.change) ? item.change.join(', ') : item.change}</span>
                    </Tag>
                    - <span style={{ color: "gray", fontSize: 12 }}>{item.add_time_string}</span>
                    <UserCard user_id={item.person} />
                </Timeline.Item>
            ))}
        </Timeline>
    );
};

export default ReportTimeLine;
