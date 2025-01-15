<?php
require 'vendor/autoload.php';

use Dotenv\Dotenv;
use Google\GenerativeAI;

// Set CORS headers
header('Access-Control-Allow-Origin: http://127.0.0.1:8080');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Load environment variables
    $dotenv = Dotenv::createImmutable(__DIR__);
    $dotenv->load();

    $apiKey = $_ENV['GEMINI_API_KEY'];

    if (!$apiKey) {
        throw new Exception("API key not loaded. Please check your .env file.");
    }

    // Validate incoming JSON
    $jsonData = file_get_contents('php://input');
    $data = json_decode($jsonData, true);

    if (!$data) {
        throw new Exception("Invalid JSON data received");
    }

    $topic = $data['topic'] ?? '';
    $contentType = $data['usage'] ?? '';

    if (empty($topic) || empty($contentType)) {
        throw new Exception("Topic and content type are required");
    }

    // Initialize Gemini client
    $client = Gemini::client($apiKey);

    // Generate prompt
    $prompt = generatePrompt($topic, $contentType);

    // Fetch response from Gemini
    $result = $client->geminiPro()->generateContent($prompt);

    if (!$result) {
        throw new Exception("Failed to generate content");
    }

    // Check if the response has the expected structure and contains text
    if (isset($result->candidates[0]->content->parts[0]->text)) {
        // Split the text into an array of hooks
        $text = $result->candidates[0]->content->parts[0]->text;
        $hooks = array_values(array_filter(
            explode("\n", $text),
            function($line) {
                return !empty(trim($line));
            }
        ));

        // Clean up markdown formatting
        $formattedHooks = array_map(function($hook) {
            // Remove markdown numbering
            $hook = preg_replace('/^\d+\.\s+/', '', $hook);
            // Remove bold markdown
            $hook = preg_replace('/\*\*(.*?)\*\*/', '$1', $hook);
            // Remove any remaining asterisks
            $hook = str_replace('*', '', $hook);
            // Trim any extra whitespace
            $hook = trim($hook);
            
            return ['hook' => $hook];
        }, $hooks);

        echo json_encode([
            "status" => "success",
            "hooks" => $formattedHooks
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Gemini can't provide that hook at the moment try another topic idea"
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}

// Generate prompt based on content type
function generatePrompt($topic, $contentType) {
    $prompts = [
        'short_video' => "Generate 5 engaging hooks for a short video about: $topic",
        'speech' => "Generate 5 powerful opening statements for a speech about: $topic",
        'debate' => "Generate 5 compelling argumentative hooks for a debate on: $topic",
        'email' => "Generate 5 attention-grabbing email subject lines about: $topic",
        'social_post' => "Generate 5 engaging social media hooks about: $topic",
        'blog_posts' => "Generate 5 compelling blog post introductions about: $topic",
        'story' => "Generate 5 captivating story openings about: $topic",
        'educational_content' => "Generate 5 educational hooks to introduce: $topic",
        'ad' => "Generate 5 captivating hooks to advertise: $topic"
    ];

    return $prompts[$contentType] ?? "Generate 5 engaging hooks about: $topic";
}
?>