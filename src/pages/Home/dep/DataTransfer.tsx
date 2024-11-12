import React from 'react';
import Button from "antd/es/button";
import { Row, message } from "antd";
import { useAppSelector } from "../../../hooks/storeHooks";
import { jsPDF } from "jspdf";
import {IItem} from "../../../types/Item";

const DataTransfer = () => {
    const { totes, loading, error } = useAppSelector(state => state.totes);
    const lineHeight = 10; // Adjust the line height as needed
    const pageHeight = 290; // jsPDF page height in units (default is 297 for A4)
    const marginX = 10; // Left margin
    const boxPadding = 5; // Padding inside each box

    const handleDownloadPDF = () => {
        if (!totes || totes.length === 0) {
            message.warning("No tote data available to download.");
            return;
        }

        // Set orientation to landscape
        const doc = new jsPDF("landscape");
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let yOffset = 10; // Starting y-offset on each page

        doc.text("Tote Data Report", marginX, yOffset);
        yOffset += lineHeight;

        totes.forEach((tote, index) => {
            const boxStartY = yOffset; // Track the start position for the border

            if (yOffset + lineHeight > pageHeight) {
                doc.addPage();
                yOffset = 10;
            }

            doc.text(`${tote.tote_number} | ${tote.update_time}`, marginX + boxPadding, yOffset);
            yOffset += lineHeight;

            if (tote.item_inside && tote.item_inside.length > 0) {
                const itemCounts = tote.item_inside.reduce<Record<string, IItem & { count: number }>>((acc, item) => {
                    const key = `${item.name}-${item.code}`;
                    if (acc[key]) {
                        acc[key].count += 1;
                    } else {
                        acc[key] = { ...item, count: 1 };
                    }
                    return acc;
                }, {});

                Object.values(itemCounts).forEach((item, itemIndex) => {
                    if (yOffset + lineHeight > pageHeight) {
                        doc.addPage();
                        yOffset = 10;
                    }
                    doc.text(`${itemIndex + 1}: ${item.name} - ${item.code} [ ${item.count} ]`, marginX + boxPadding * 2, yOffset);
                    yOffset += lineHeight;
                });
            } else {
                doc.text("  No items inside", marginX + boxPadding * 2, yOffset);
                yOffset += lineHeight;
            }

            yOffset += lineHeight; // Space between totes
        });

        doc.save("tote_data_report.pdf");
    };


    return (
        <Row gutter={16}>
            <Button onClick={handleDownloadPDF} >
                Download PDF
            </Button>
        </Row>
    );
};

export default DataTransfer;
