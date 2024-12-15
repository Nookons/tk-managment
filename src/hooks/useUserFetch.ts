import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from "../firebase";
import { IUser } from "../types/User";

const useUserFetch = (email: string) => {
    const [user, setUser] = useState<IUser | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, "employers"), where("email", "==", email)),
            (querySnapshot) => {
                let foundUser: IUser | null = null;

                querySnapshot.forEach((doc) => {
                    foundUser = doc.data() as IUser;
                    console.log(doc.data()); // Optionally log data for debugging
                });

                setUser(foundUser); // Set user after fetching from Firestore
            },
            (err) => {
                console.error(err); // Log the error for debugging
                setError((err as Error).toString()); // Safely cast `err` to Error and set the error state
            }
        );

        return unsubscribe;
    }, [email]); // Depend on `email` so it fetches again when the `email` changes

    return { data: user, error, loading };
};

export default useUserFetch;
