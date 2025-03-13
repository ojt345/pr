<?php
// Enable debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

require 'db_connect.php'; // Ensure this file exists

header('Content-Type: application/json');

// Check if request is POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit;
}

// Debug: Print received POST data
file_put_contents("debug_log.txt", print_r($_POST, true));

// Get input values
$payrollNo = isset($_POST['payrollNo']) ? intval($_POST['payrollNo']) : null;
$dateStart = isset($_POST['date_start']) ? $_POST['date_start'] : null;
$dateEnd = isset($_POST['date_end']) ? $_POST['date_end'] : null;
$responsibility = isset($_POST['responsibility']) ? $_POST['responsibility'] : null;
$office = isset($_POST['office']) ? $_POST['office'] : null;

// Debugging: Check database connection
if (!$conn) {
    echo json_encode(["success" => false, "message" => "Database connection failed."]);
    exit;
}

// Ensure at least one search criteria is provided
if (!$payrollNo && (!$dateStart || !$dateEnd || !$responsibility || !$office)) {
    echo json_encode(["success" => false, "message" => "Please provide Payroll No. OR complete details for search."]);
    exit;
}

// Debugging: Check if query is running
$sql = $payrollNo ? 
    "SELECT * FROM payroll_table WHERE payrollNo = ?" : 
    "SELECT * FROM payroll_table WHERE date_start = ? AND date_end = ? AND responsibility = ? AND office = ?";

$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "SQL Error: " . $conn->error]);
    exit;
}

// Bind parameters
if ($payrollNo) {
    $stmt->bind_param("i", $payrollNo);
} else {
    $stmt->bind_param("ssss", $dateStart, $dateEnd, $responsibility, $office);
}

$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    echo json_encode(["success" => true, "data" => $row]);
} else {
    echo json_encode(["success" => false, "message" => "No matching records found"]);
}

// Close connection
$stmt->close();
$conn->close();
?>
