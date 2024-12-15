import { useState, useEffect } from 'react';
import {collection, onSnapshot } from 'firebase/firestore';
import {db} from "../firebase";
import {IError} from "../types/Error";


const useErrorsFetch = () => {
    const [errors_data, setDocuments] = useState<IError[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const colRef = collection(db, 'errors');

        const unsubscribe = onSnapshot(
            colRef,
            (snapshot) => {
                const docs: IError[] = snapshot.docs.map(doc => (doc.data() as IError));
                setDocuments(docs);
                setLoading(false);
            },
            (err) => {
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    if (error) {
        console.error(`Error subscribing to collection 'errors':`, error);
    }

    return { errors_data, error, loading };
};

export default useErrorsFetch;
