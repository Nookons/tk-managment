import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "../firebase";

const useTasks = () => {
    const [tasks, setTasks] = useState<any[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                setLoading(true);
                const q = query(collection(db, "task_list"));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const data: any[] = [];

                    querySnapshot.forEach((doc) => {
                        const i = doc.data();
                        data.push(i)
                    });

                    setTasks([...data].reverse());
                });

                return () => unsubscribe();
            } catch (err) {
                err && setError(err.toString());
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();

        // Cleanup effect on component unmount
        return () => setLoading(false);
    }, []); // Depend on `tote_number` to fetch data when it changes

    return { tasks, error, loading };
};

export default useTasks;
