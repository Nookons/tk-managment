import React, { FC, useEffect, useState } from 'react';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebase";

interface ItemDescriptionProps {
    value: string;
}

const ItemDescription: FC<ItemDescriptionProps> = ({ value }) => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchItem = async () => {
        try {
            const q = query(collection(db, "item_library"), where("code", "==", value));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setError("No data found");
            } else {
                const items = querySnapshot.docs.map(doc => doc.data());
                setData(items[0]); // If you expect only one item, otherwise setData(items) for multiple
            }
        } catch (err) {
            setError("Failed to fetch data");
            console.error("Error fetching item:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isMounted = true; // Track if the component is still mounted
        if (isMounted) fetchItem();

        return () => { isMounted = false }; // Cleanup on unmount
    }, [value]); // Add value dependency to re-fetch if `value` changes

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (data) {
        return (
            <div>
                <h1>{data.name}</h1>
            </div>
        );
    }

    return null;
};

export default ItemDescription;
