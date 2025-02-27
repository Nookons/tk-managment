import React from 'react';
import {Descriptions} from "antd";
import UserCard from "../../Home/ReportsScreen/UserCard";
import dayjs from "dayjs";
import ChangePartsScreen from "../../Home/ReportsScreen/ChangePartsScreen";
import {IReport} from "../../../types/Reports/Report";

const ReportOverviewDescription = ({reportData}: {reportData: IReport}) => {
    const user_id = reportData.add_person
    const parts = reportData.change_parts

    return (
        <Descriptions style={{marginTop: 14}} size={"small"} title={`Unit ID: ${reportData.unit_id}`} bordered>
            <Descriptions.Item span={3} label="⚡ Problem Type">
                {reportData.type}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="🙍 User who added">
                <UserCard user_id={user_id}/>
            </Descriptions.Item>
            <Descriptions.Item span={3} label="🕙 Add report at">
                {reportData.add_time_string}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="🕖 Found time">
                {dayjs(reportData.start_time).format('dddd, MMMM DD, YYYY [at] HH:mm:ss')}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="⭐ Status">
                {reportData.status}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="💡 Reason">
                {reportData.reason}
            </Descriptions.Item>
            <Descriptions.Item span={3} label="🔧 Change Parts">
                <ChangePartsScreen parts={parts}/>
            </Descriptions.Item>
            <Descriptions.Item span={3} label="❓ Description">
                {reportData.description}
            </Descriptions.Item>
        </Descriptions>
    );
};

export default ReportOverviewDescription;