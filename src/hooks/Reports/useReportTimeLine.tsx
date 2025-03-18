import { useState, useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import {IReportTimelineItem} from "../../types/Reports/Report";

export const useReportTimeLine = (report_id: string) => {
    const [timeLineData, setTimeLineData] = useState<IReportTimelineItem[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!report_id) return;

        setLoading(true);
        setError(null);

        console.log(report_id)

        const q = query(collection(db, "reports_history"), where("report_id", "==", report_id));

        const unsubscribe = onSnapshot(q,
            (querySnapshot) => {
                const timeline: IReportTimelineItem[] = querySnapshot.docs.map(doc => (doc.data() as IReportTimelineItem));
                setTimeLineData(timeline);
                console.log(timeline);
                setLoading(false);
            },
            (error) => {
                console.error("Error fetching report timeline:", error);
                setError(error.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [report_id]);

    return { timeLineData, loading, error };
};
