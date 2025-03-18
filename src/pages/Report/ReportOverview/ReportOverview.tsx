import React from 'react';
import {useLocation} from "react-router-dom";
import {Alert, Button, Descriptions, Divider, message, Row, Select, Skeleton, Space, Tag, Timeline} from "antd";
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
import {closeReport} from "../../../utils/Report/CloseReport";
import ChangePartsScreen from "../../Home/ReportsScreen/ChangePartsScreen";

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
            const id = dayjs().valueOf().toString();
            const reportRef = doc(db, "reports", report_id || "");

            const historyItem = {
                person: user.id,
                id: id,
                report_id: report_id,
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

            await setDoc(doc(db, "reports_history", id), {
                ...historyItem
            });
        }
    }
    const partsHandle = async (value: IReportChangePart[]) => {
        if (user) {
            const id = dayjs().valueOf().toString();
            const reportRef = doc(db, "reports", report_id || "");

            const historyItem = {
                person: user.id,
                id: id,
                report_id: report_id,
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

            await setDoc(doc(db, "reports_history", id), {
                ...historyItem
            });
        }
    }

    const onCloseHandle = () => {
        if (user && user.role !== "admin") {
            message.error("Only individuals with the highest level of permission can close a report. If you wish to close a report, please liaise with your lead.")
            return
        }

        if (reportData && user) {
            const result = closeReport({reportData, user});
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
                <Col span={14}>
                    <h1>Report overview</h1>
                    {reportData.status !== "Closed" ?
                        <>
                            <Divider>Actions buttons</Divider>
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
                                <Button onClick={onCloseHandle} type={"primary"}>Close that issue</Button>
                                <Button danger type={"primary"}>Remove</Button>
                            </Space>
                        </>
                        :
                        <>
                            <Divider>Report close data</Divider>
                            <Descriptions style={{marginTop: 14, backgroundColor: reportData.status === "Closed" ? "rgba(0,255,187,0.15)" : "", borderRadius: 8}} size={"small"} bordered={true}>
                                <Descriptions.Item style={{alignItems: "center"}} span={3} label="🙍 Closed By">
                                    <UserCard user_id={reportData.closedBy}/>
                                </Descriptions.Item>
                                <Descriptions.Item span={3} label="🕖 Closed at">
                                    {reportData.closedAtString}
                                </Descriptions.Item>
                            </Descriptions>
                        </>
                    }
                    <Divider>Report data</Divider>
                    <ReportOverviewDescription reportData={reportData}/>
                </Col>
                <Col span={10}>
                    <Divider>History</Divider>
                    <ReportTimeLine report_id={report_id}/>
                </Col>
            </Row>
        </div>
    );
};

export default ReportOverview;
