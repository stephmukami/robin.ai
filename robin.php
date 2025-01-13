<?php

require 'vendor/autoload.php';

use Dotenv\Dotenv;
use Google\GenerativeAI;  

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$apiKey = $_ENV['GEMINI_API_KEY'];  

if (!$apiKey) {
    die("API key not loaded. Please check your .env file.");
}

$client = Gemini::client($apiKey);

$result = $client->geminiPro()->generateContent('Hello');

echo $result->text();

