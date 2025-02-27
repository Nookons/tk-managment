import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import {IUser} from "../../types/User";

export const useGetUser = (user_id: string) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user_id) return;

        const q = query(collection(db, "employers"), where("id", "==", user_id));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            if (!querySnapshot.empty) {
                setUser(querySnapshot.docs[0].data() as IUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        }, (err) => {
            setError(err.toString());
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user_id]);

    return { user, loading, error };
};
