document.addEventListener('DOMContentLoaded', () => {
    const downloadBtn = document.getElementById('download-pdf');
    const elementToPrint = document.getElementById('pdf-content');

    downloadBtn.addEventListener('click', async () => {
        try {
            // Hide the download button
            downloadBtn.style.display = 'none';

            // Allow time for the DOM to update
            await new Promise(resolve => setTimeout(resolve, 100));

            const opt = {
                margin: [0.2, 0.2, 0.2, 0.2], // Top, Left, Bottom, Right (in inches)
                filename: 'Payroll_Report.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 4,      // Higher scale for better quality
                    useCORS: true, // To avoid CORS issues
                    scrollY: 0
                },
                jsPDF: {
                    unit: 'in',
                    format: [13, 8.5],
                    orientation: 'landscape'
                },
                pagebreak: {
                    mode: ['avoid-all', 'css', 'legacy'],
                    before: '.second-page' // Force page break only before .second-page
                }
            };

            await html2pdf().from(elementToPrint).set(opt).save();

        } catch (error) {
            console.error('PDF generation failed:', error);
        } finally {
            // Re-display the download button
            downloadBtn.style.display = 'inline-block';
        }
    });
});




document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);

    function formatDate(dateStr) {
        if (!dateStr) return "N/A";  

        const date = new Date(dateStr);
        if (isNaN(date)) return "Invalid Date";

        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('en-US', options); 
    }

    if (urlParams.has("payrollNo") || (urlParams.has("date_start") && urlParams.has("date_end"))) {
        document.getElementById("payrollNo").textContent = urlParams.get("payrollNo") || "N/A";
        document.getElementById("date_start").textContent = formatDate(urlParams.get("date_start"));
        document.getElementById("date_end").textContent = formatDate(urlParams.get("date_end"));
        document.getElementById("responsibility").textContent = urlParams.get("responsibility") || "N/A";
        document.getElementById("office").textContent = urlParams.get("office") || "N/A";
    } else {
        alert("No payroll data found!");
    }
});
