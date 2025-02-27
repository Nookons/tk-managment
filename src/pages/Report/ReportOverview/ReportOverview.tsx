import React from 'react';
import {useLocation} from "react-router-dom";
import {Alert, Row, Select, Skeleton, Space, Tag, Timeline} from "antd";
import {useReport} from "../../../hooks/Reports/useReport";
import ReportOverviewDescription from "./ReportOverviewDescription";
import {arrayUnion, doc, setDoc, updateDoc} from "firebase/firestore";
import {db} from "../../../firebase";
import {useAppSelector} from "../../../hooks/storeHooks";
import {IReportChangePart} from "../../../types/Reports/Report";
import Col from "antd/es/grid/col";
import dayjs from "dayjs";
import UserCard from "../../Home/ReportsScreen/UserCard";
import {ClockCircleOutlined, EditOutlined} from "@ant-design/icons";
import ReportTimeLine from "./ReportTimeLine";

const ReportOverview = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const report_id = params.get("id");

    const user = useAppSelector(state => state.user.user)
    const options = useAppSelector(state => state.options.options);

    const {reportData, loading, error} = useReport(report_id || "");

    const statusOptions = [
        {value: 'Completed', label: 'Completed'},
        {value: 'Process', label: 'Process'},
        {value: 'Founded', label: 'Founded'},
        {value: 'Observation', label: 'Observation'},
    ];

    const statusHandle = async (value: string) => {
        if (user) {
            const reportRef = doc(db, "reports", report_id || "");

            const historyItem = {
                person: user.id,
                id: report_id,
                add_time_string: dayjs().format("dddd, MMMM DD, YYYY [at] HH:mm:ss"),
                add_time: dayjs().valueOf(),
                type: "Change status",
                change: value
            }

            await updateDoc(reportRef, {
                status: value,
                last_modify_time: dayjs().format("dddd, MMMM DD, YYYY [at] HH:mm:ss"),
                last_modify_person: user.id,
            });

            await updateDoc(doc(db, "reports_history", report_id || ""), {
                actions_array: arrayUnion(historyItem)
            });
        }
    }
    const partsHandle = async (value: IReportChangePart[]) => {
        if (user) {
            const reportRef = doc(db, "reports", report_id || "");

            const historyItem = {
                person: user.id,
                id: report_id,
                add_time_string: dayjs().format("dddd, MMMM DD, YYYY [at] HH:mm:ss"),
                add_time: dayjs().valueOf(),
                type: "Change parts what was changed",
                change: value
            }

            await updateDoc(reportRef, {
                change_parts: value,
                last_modify_time: dayjs().format("dddd, MMMM DD, YYYY [at] HH:mm:ss"),
                last_modify_person: user.id,
            });

            await updateDoc(doc(db, "reports_history", report_id || ""), {
                actions_array: arrayUnion(historyItem)
            });
        }
    }

    if (loading) return <Skeleton active/>;

    if (error) {
        const errorMessage = typeof error === 'string' ? error : error || 'An unexpected error occurred';
        return (
            <Alert
                message="Error"
                description={<span>Something went wrong while fetching data from the server. We are sorry for the inconvenience.<br/><strong>{errorMessage}</strong></span>}
                type="error"
                showIcon
            />
        );
    }

    if (!reportData) return null;

    return (
        <div>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <h1>Report overview</h1>
                    <Space>
                        <Select
                            style={{minWidth: 155}}
                            options={statusOptions}
                            value={reportData.status}
                            onChange={(value) => statusHandle(value)}
                        />
                        <Select
                            mode="multiple"
                            allowClear
                            style={{minWidth: "250px"}}
                            placeholder="Please pick parts to change"
                            options={options.map(el => ({value: el.name, label: el.name}))}
                            value={reportData.change_parts}
                            onChange={(value) => partsHandle(value)}
                        />
                    </Space>
                    <ReportOverviewDescription reportData={reportData}/>
                </Col>
                <Col span={12}>
                    <ReportTimeLine report_id={report_id}/>
                </Col>
            </Row>
        </div>
    );
};

export default ReportOverview;
