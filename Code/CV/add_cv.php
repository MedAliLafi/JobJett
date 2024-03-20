<?php
// Establish a connection to the MySQL database
$servername = "localhost";
$username = "root";
$password = ""; // This may vary depending on your XAMPP configuration
$database = "jobjett";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get data from the form submission
$full_name = $_POST['full_name'];
$email = $_POST['email'];
$phone = $_POST['phone'];
$education = $_POST['education'];
$experience = $_POST['experience'];
$skills = $_POST['skills'];

// Prepare SQL statement to insert data into the database
$sql = "INSERT INTO cvs (full_name, email, phone, education, experience, skills) VALUES ('$full_name', '$email', '$phone', '$education', '$experience', '$skills')";

if ($conn->query($sql) === TRUE) {
    echo "CV added successfully.";
} else {
    echo "Error adding CV: " . $conn->error;
}

// Close the database connection
$conn->close();
?>
