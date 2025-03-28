document.addEventListener("DOMContentLoaded", function () {
    const downloadBtn = document.getElementById('download-pdf');

    if (!downloadBtn) {
        console.error("Download button not found!");
        return;
    }

    downloadBtn.addEventListener('click', function () {
        console.log("Download button clicked!");

        const { jsPDF } = window.jspdf;
        if (!jsPDF) {
            alert("jsPDF library is not loaded!");
            return;
        }

        const pdf = new jsPDF({
            orientation: 'p',  // Portrait mode
            unit: 'mm',
            format: 'a4'       // A4 size
        });

        const content = document.documentElement; // Capture the entire HTML document

        downloadBtn.style.visibility = "hidden";

        html2canvas(content, { scale: 2, useCORS: true })
            .then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const pageWidth = 210; // A4 width in mm
                const pageHeight = (canvas.height * pageWidth) / canvas.width;

                pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
                pdf.save('exported-content.pdf');

                downloadBtn.style.visibility = "visible";
            })
            .catch(error => {
                console.error("Error capturing content:", error);
                alert("An error occurred while generating the PDF.");
                downloadBtn.style.visibility = "visible";
            });
    });
});
