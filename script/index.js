document.addEventListener("DOMContentLoaded", function() {
    const downloadBtn = document.getElementById('download-pdf');

    if (!downloadBtn) {
        console.error("Download button not found!");
        return;
    }

    downloadBtn.addEventListener('click', function() {
        console.log("Download button clicked!");

        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
            alert("jsPDF library is not loaded!");
            return;
        }

        let pdf = new jsPDF({
            orientation: 'l',
            unit: 'in',
            format: [8.5, 13]
        });

        let pages = document.querySelectorAll('.page');
        if (pages.length === 0) {
            alert("No content found to export!");
            return;
        }

        let margin = 0.3;

        // Hide the download button during processing
        downloadBtn.style.visibility = "hidden";

        const capturePage = (index) => {
            if (index >= pages.length) {
                pdf.save('payroll-legal-landscape.pdf');
                downloadBtn.style.visibility = "visible";
                return;
            }

            let element = pages[index];

            // Scroll to ensure rendering
            element.scrollIntoView();

            setTimeout(() => {
                html2canvas(element, {
                    scale: 2,
                    useCORS: true,
                    allowTaint: true,
                    logging: false,
                    width: element.offsetWidth,
                    height: element.offsetHeight,
                    windowWidth: document.body.scrollWidth,
                    windowHeight: document.body.scrollHeight
                }).then(canvas => {
                    let imgData = canvas.toDataURL('image/png');
                    let pageWidth = 13 - (margin * 2);
                    let pageHeight = (canvas.height * pageWidth) / canvas.width;

                    if (index > 0) pdf.addPage([8.5, 13], "l");
                    pdf.addImage(imgData, 'PNG', margin, margin, pageWidth, pageHeight);

                    capturePage(index + 1);
                }).catch(error => {
                    console.error("Error capturing page:", error);
                    alert("An error occurred while generating the PDF.");
                    downloadBtn.style.visibility = "visible";
                });
            }, 500);
        };

        capturePage(0);
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
