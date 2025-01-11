import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase';
import {IError} from "../types/Error";

const useErrorHistory = () => {
    const [errors, setErrors] = useState<IError[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOptions = () => {
            const q = query(collection(db, "errors_history"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                try {
                    const items = querySnapshot.docs.map(doc => ({
                        ...doc.data() as IError
                    }));
                    setErrors(items);
                    setLoading(false);
                } catch (err) {
                    setError("Failed to fetch options");
                    setLoading(false);
                }
            });
            return unsubscribe;
        };

        const unsubscribe = fetchOptions();
        return () => unsubscribe();
    }, []);

    return { errors, loading, error };
};

export default useErrorHistory;
