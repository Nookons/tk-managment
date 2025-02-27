import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { IReport } from "../../types/Reports/Report";

export const useReport = (report_id: string) => {
    const [reportData, setReportData] = useState<IReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Ensure loading state is true initially when the effect runs
        setLoading(true);

        const docRef = doc(db, "reports", report_id);

        // Subscribe to real-time updates using onSnapshot
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setReportData(docSnap.data() as IReport);
                setLoading(false);
            } else {
                setError("Report not found on server");
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

    return { reportData, loading, error };
};
