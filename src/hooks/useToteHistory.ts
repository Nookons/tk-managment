import { useState, useEffect } from 'react';
import { IAction } from "../types/History";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";

const useToteHistory = (tote_number: string) => {
    const [history, setHistory] = useState<IAction[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const q = query(collection(db, "tote_history"), where("tote_id", "==", tote_number));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const actions_data: IAction[] = [];

                    querySnapshot.forEach((doc) => {
                        const data = doc.data().actions;
                        if (Array.isArray(data)) {
                            data.forEach((action: IAction) => {
                                actions_data.push(action);
                            });
                        }
                    });

                    setHistory([...actions_data].reverse());
                });

                return () => unsubscribe();
            } catch (err) {
                err && setError(err.toString());
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();

        // Cleanup effect on component unmount
        return () => setLoading(false);
    }, [tote_number]); // Depend on `tote_number` to fetch data when it changes

    return { history, error, loading };
};

export default useToteHistory;
