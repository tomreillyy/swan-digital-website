<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Rate limiting setup
session_start();
$current_time = time();
$rate_limit_key = 'form_submissions';
$max_submissions = 3; // Max 3 submissions per hour
$time_window = 3600; // 1 hour

// Initialize or get existing submission data
if (!isset($_SESSION[$rate_limit_key])) {
    $_SESSION[$rate_limit_key] = [];
}

// Clean old submissions outside the time window
$_SESSION[$rate_limit_key] = array_filter($_SESSION[$rate_limit_key], function($timestamp) use ($current_time, $time_window) {
    return ($current_time - $timestamp) < $time_window;
});

// Check rate limit
if (count($_SESSION[$rate_limit_key]) >= $max_submissions) {
    http_response_code(429);
    echo json_encode([
        'success' => false,
        'message' => 'Too many submissions. Please try again later.'
    ]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit;
}

// Get and sanitize input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    $input = $_POST;
}

$name = filter_var(trim($input['name'] ?? ''), FILTER_SANITIZE_STRING);
$email = filter_var(trim($input['email'] ?? ''), FILTER_SANITIZE_EMAIL);
$company = filter_var(trim($input['company'] ?? ''), FILTER_SANITIZE_STRING);
$service = filter_var(trim($input['service'] ?? ''), FILTER_SANITIZE_STRING);
$message = filter_var(trim($input['message'] ?? ''), FILTER_SANITIZE_STRING);

// Validation
$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Name is required and must be at least 2 characters';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid email address is required';
}

if (empty($service)) {
    $errors[] = 'Please select a service type';
}

if (empty($message) || strlen($message) < 10) {
    $errors[] = 'Message is required and must be at least 10 characters';
}

// Simple honeypot check (add hidden field to form)
if (!empty($input['website'])) {
    $errors[] = 'Spam detected';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => implode('. ', $errors)
    ]);
    exit;
}

// Email configuration
$to = 'tomreilly06@gmail.com';
$subject = 'New Contact Form Submission - Swan Digital';

$email_body = "
New contact form submission from Swan Digital website:

Name: {$name}
Email: {$email}
Company: {$company}
Service: {$service}

Message:
{$message}

---
Submitted: " . date('Y-m-d H:i:s') . "
IP Address: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "
User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown') . "
";

$headers = [
    'From: noreply@swandigital.com.au',
    'Reply-To: ' . $email,
    'X-Mailer: PHP/' . phpversion(),
    'Content-Type: text/plain; charset=UTF-8'
];

// Send email
if (mail($to, $subject, $email_body, implode("\r\n", $headers))) {
    // Add to rate limit tracking
    $_SESSION[$rate_limit_key][] = $current_time;
    
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your message! We\'ll get back to you within 24 hours.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Sorry, there was an error sending your message. Please try again or contact us directly.'
    ]);
}
?>