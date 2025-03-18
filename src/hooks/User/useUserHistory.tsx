import { useState, useEffect } from "react";
import {collection, query, onSnapshot, where} from "firebase/firestore";
import { db } from "../../firebase";
import { IReport } from "../../types/Reports/Report";
import {IUser} from "../../types/User";

export const useUserHistory = (user_id: string) => {
    const [userHistoryData, setUserHistoryData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const q = query(collection(db, "reports_history"), where("person", "==", user_id));
        const unsubscribe = onSnapshot(q,
            (querySnapshot) => {
                const reports = querySnapshot.docs.map(doc => doc.data() as IReport);
                setUserHistoryData(reports);
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe(); // Unsubscribe on unmount
    }, []);

    return { userHistoryData, loading, error };
};
