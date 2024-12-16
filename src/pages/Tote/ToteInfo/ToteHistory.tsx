import React, {useEffect, useState} from 'react';
import {Alert, Divider, Skeleton, Timeline} from "antd";
import useToteHistory from "../../../hooks/useToteHistory";
import styles from './Tote.module.css'

const ToteHistory = ({toteId}: { toteId: string }) => {
    const [refactored_data, setRefactored_data] = useState<any[]>([]);
    const {history, loading, error} = useToteHistory(toteId || "")


    useEffect(() => {
        if (history) {
            const result: any[] = [];

            history.forEach(action => {
                const refactored = {
                    color: action.color,
                    children: (
                        <div
                            className={styles.History_action}
                            style={{
                                backgroundColor: action.color === "red" ? "rgba(255,0,59,0.25)" : "rgba(137,255,0,0.25)",
                            }}
                        >
                            <p>{action.action_time}</p>
                            {action.updated_by.first_name ? (
                                <p>
                                    {action.updated_by.first_name} {action.updated_by.last_name}
                                </p>
                            ) : (
                                <p>{action.updated_by.email}</p>
                            )}
                            <p>
                                {action.type} item: {action.item.code} {action.item.name}
                            </p>
                        </div>
                    )
                }
                result.push(refactored)
            })

            setRefactored_data(result)
        }
    }, [history, loading]);

    if (loading) {
        return <Skeleton />
    }

    if (!refactored_data.length) {
        return (
            <Alert
                message="History status"
                description="We haven't history of that item yet"
                type="info"
            />
        )
    }


    return (
        <>
            <Divider>Tote History</Divider>
            <Timeline
                style={{marginTop: 24}}
                items={refactored_data.slice(0, 10)}
            />
        </>
    );
};

export default ToteHistory;