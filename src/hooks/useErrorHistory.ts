import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { IError } from "../types/Error";
import dayjs, { Dayjs } from "dayjs";

const useErrorHistory = (picked_date: Dayjs) => {
    const [errors, setErrors] = useState<IError[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOptions = () => {
            const date = dayjs(picked_date).format("YYYY-MM-DD");
            const q = query(collection(db, "errors_history"), where("date", "==", date));

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

        // Запускаем запрос при изменении picked_date
        const unsubscribe = fetchOptions();

        // Очистка подписки при размонтировании компонента
        return () => unsubscribe();
    }, [picked_date]); // Теперь зависимость от picked_date присутствует

    return { errors, loading, error };
};

export default useErrorHistory;
