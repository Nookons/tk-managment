import { useState, useEffect } from 'react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase';
import {IOption} from "../types/Item";

const useFetchOptions = () => {
    const [options, setOptions] = useState<IOption[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOptions = () => {
            const q = query(collection(db, "item_library"));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                try {
                    const items = querySnapshot.docs.map(doc => ({
                        ...doc.data() as IOption
                    }));
                    setOptions(items);
                    setLoading(false);
                } catch (err) {
                    setError("Failed to fetch options");
                    setLoading(false);
                }
            });
            return unsubscribe;
        };

        const unsubscribe = fetchOptions();

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

    return { options, loading, error };
};

export default useFetchOptions;
