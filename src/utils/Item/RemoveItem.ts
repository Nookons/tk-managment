import React from "react";
import {ITote} from "../../types/Tote";
import {deleteDoc, doc, updateDoc} from "firebase/firestore";
import {db} from "../../firebase";

export const removeItem = async ({selectedRowKeys, tote}: { selectedRowKeys: React.Key[], tote: ITote }) => {
    const updatedItems = tote.item_inside.filter(item => !selectedRowKeys.includes(item.key));
    const toteRef = doc(db, 'tote_info', tote.tote_number);

    await updateDoc(toteRef, {
        item_inside: updatedItems
    });

    selectedRowKeys.forEach((key) => {
        deleteDoc(doc(db, "warehouse", key.toString()));
    })
}