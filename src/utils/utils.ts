import Logo from "../../data/logo.png";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { RefObject } from 'react';

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const colors = [
    "#7a5e35",
    "#4a5c6d",
    "#a7895e",
    "#cfe2cb",
    "#b4dd9c",
    "#e6bf35e3",
    "#2c3e50",
    "#7f91a1",
    "#8d4925",
    "#e1e5e9",
    "#3e4f3c",
    "#8ba286",
    "#b0bbc6",
    "#b8c9b5",
    "#62785e",
    "#dce4db",
    "#b3704d",
    "#d9a68a",
    "#e9cbbd",
    "#f4e6e0",
]
export const siteName = `Nature's Candy`
export const LOGO = Logo;

const downloadReceiptAsPdf = async (ref: RefObject<HTMLElement>, filename: string) => {
    if (!ref.current) return;

    // 1. Get the original element
    const originalElement = ref.current;

    // 2. Clone the element to avoid visual glitches during capture
    const clonedElement = originalElement.cloneNode(true) as HTMLElement;
    // Position it off-screen to avoid visual glitches but allow capture
    clonedElement.style.position = 'absolute';
    clonedElement.style.left = '-9999px';
    clonedElement.style.top = '-9999px';
    clonedElement.style.width = originalElement.offsetWidth + 'px'; // Ensure same width for calculations
    document.body.appendChild(clonedElement);

    // 3. Find and remove the "Download Copy" button from the clone
    const downloadButtonInClone = clonedElement.querySelector('.dashboard-button');
    if (downloadButtonInClone) {
        downloadButtonInClone.remove();
    }

    try {
        // 4. Capture the modified clone
        const canvas = await html2canvas(clonedElement, {
            logging: false,
            useCORS: true, // important for images from different domains
            scale: 2 // Improve PDF quality (standard is 1)
        });

        // 5. Cleanup the clone from the DOM
        document.body.removeChild(clonedElement);

        const imgData = canvas.toDataURL('image/png');
        // Initialize jsPDF (p = portrait, mm = millimeters, a4 = standard page size)
        const pdf = new jsPDF('p', 'mm', 'a4');

        // Calculate image dimensions to fit the PDF page width
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        // Add the image to the PDF
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // 6. Save/Download the PDF
        pdf.save(filename);
    } catch (error) {
        console.error("Error generating PDF:", error);
        // Cleanup clone on error too
        if (document.body.contains(clonedElement)) {
            document.body.removeChild(clonedElement);
        }
    }
};

export default downloadReceiptAsPdf;