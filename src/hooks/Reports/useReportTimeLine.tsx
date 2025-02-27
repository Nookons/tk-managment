import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import {IReportTimeline} from "../../types/Reports/Report";

export const useReportTimeLine = (report_id: string) => {
    const [timeLineData, setTimeLineData] = useState<IReportTimeline | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Ensure loading state is true initially when the effect runs
        setLoading(true);

        const docRef = doc(db, "reports_history", report_id);

        // Subscribe to real-time updates using onSnapshot
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setTimeLineData(docSnap.data() as IReportTimeline);
                setLoading(false);
            } else {
                setError("History not found on server");
                setLoading(false);
            }
        }, (err) => {
            setError("Failed to fetch report");
            console.error("Error fetching report:", err);
            setLoading(false);
        });

        // Cleanup function to unsubscribe from the snapshot listener when the component is unmounted or report_id changes
        return () => {
            unsubscribe();
        };
    }, [report_id]);

    return { timeLineData, loading, error };
};
