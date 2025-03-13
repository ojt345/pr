document.getElementById("payrollRequestForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    const payrollNo = document.getElementById("payrollNo").value.trim();
    const dateStart = document.getElementById("date_start").value.trim();
    const dateEnd = document.getElementById("date_end").value.trim();
    const responsibility = document.getElementById("responsibility").value.trim();
    const office = document.getElementById("office").value.trim();

    // Ensure at least one search criterion is provided
    if (!payrollNo && (!dateStart || !dateEnd || !responsibility || !office)) {
        alert("Please enter either Payroll No. OR all other details (Start Date, End Date, Responsibility, Office).");
        return;
    }

    let formData = new FormData();

    if (payrollNo) {
        // If Payroll No. is provided, search by it
        formData.append("payrollNo", payrollNo);
    } else {
        // Otherwise, search using combination of details
        formData.append("date_start", dateStart);
        formData.append("date_end", dateEnd);
        formData.append("responsibility", responsibility);
        formData.append("office", office);
    }

    fetch("../php/search_payroll.php", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log("Server Response:", data); // Debugging

        if (data.success) {
            const params = new URLSearchParams(data.data).toString();
            window.location.href = `../html/index.html?${params}`;
        } else {
            alert("Error: " + data.message); // Show actual error message
        }
    })
    .catch(error => {
        console.error("Fetch Error:", error);
        alert("Could not connect to the database. Please check the console.");
    });
});


document.addEventListener("DOMContentLoaded", function() {
    const dateStart = document.getElementById('date_start');
    const dateEnd = document.getElementById('date_end');

    // Ensure date fields start empty (not auto-filled)
    dateStart.value = '';
    dateEnd.value = '';

    // Ensure the end date cannot be before the start date
    dateStart.addEventListener('change', function() {
        dateEnd.min = dateStart.value;
    });

    dateEnd.addEventListener('change', function() {
        if (dateEnd.value < dateStart.value) {
            alert("End date cannot be earlier than start date.");
            dateEnd.value = dateStart.value;
        }
    });
});

