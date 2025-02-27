import React, { useEffect, useState } from 'react';
import { useReports } from '../../../hooks/Reports/useReports';
import { IReport } from '../../../types/Reports/Report';
import { Card, Row, Skeleton, Statistic } from 'antd';
import Col from 'antd/es/grid/col';

const ReportsTimeLine = () => {
    const { reportsData, loading } = useReports();
    const [reversedData, setReversedData] = useState<IReport[]>([]);
    const [stats, setStats] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        if (reportsData.length) {
            setReversedData([...reportsData].reverse());

            const newStats: { [key: string]: number } = {};

            reportsData.forEach(el => {
                newStats[el.status] = (newStats[el.status] || 0) + 1;
            });

            setStats(newStats);
        }
    }, [reportsData])

    useEffect(() => {
        console.log(stats);
    }, [stats]);

    if (loading) {
        return (
            <div>
                <Skeleton active />
            </div>
        );
    }

    return (
        <>
            <h2>Reports stats</h2>
            <Row gutter={[8, 8]}>
                <Col span={12}>
                    <Card>
                        <Statistic title="Process" value={stats['Process'] || 0} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <Statistic title="Observation" value={stats['Observation'] || 0} />
                    </Card>
                </Col>
                <Col span={24}>
                    <Card>
                        <Statistic title="Founded" value={stats['Founded'] || 0} />
                    </Card>
                </Col>
                <Col span={24}>
                    <Card>
                        <Statistic title="Completed" value={stats['Completed'] || 0} />
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default ReportsTimeLine;
