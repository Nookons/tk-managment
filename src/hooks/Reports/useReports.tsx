import { useState, useEffect } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { IReport } from "../../types/Reports/Report";

export const useReports = () => {
    const [reportsData, setReportsData] = useState<IReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const q = query(collection(db, "reports"));
        const unsubscribe = onSnapshot(q,
            (querySnapshot) => {
                const reports = querySnapshot.docs.map(doc => doc.data() as IReport);
                setReportsData(reports);
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe(); // Unsubscribe on unmount
    }, []);

    return { reportsData, loading, error };
};
