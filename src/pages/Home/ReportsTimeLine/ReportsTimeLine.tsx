import React, {useEffect, useState} from 'react';
import {useReports} from "../../../hooks/Reports/useReports";
import {IReport} from "../../../types/Reports/Report";
import {Alert, Descriptions, Skeleton, Tag, Timeline, Tooltip} from "antd";
import {ClockCircleOutlined, YoutubeOutlined} from "@ant-design/icons";

const ReportsTimeLine = () => {
    const {reportsData, loading, error} = useReports();
    const [reversed_data, setReversed_data] = useState<IReport[]>([]);

    useEffect(() => {
        if (reportsData.length) {
            setReversed_data([...reportsData].reverse());
        }
    }, [reportsData]);

    if (loading) {
        return (
            <div>
                <Skeleton active/>
            </div>
        )
    }

    return (
        <>
            <Alert
                message={<span>Freezing</span>}
                description={<span>That part is temporary doesn't work</span>}
                type="info"
            />
        </>
    );
};

export default ReportsTimeLine;