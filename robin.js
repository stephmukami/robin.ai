const button = document.querySelector(".hook-generator button");
const loading = document.querySelector(".loading");
const result = document.querySelector(".lws-tool-result");
const popup = document.querySelector(".popup");
const selectedType = document.querySelector(".selected-type");
const list = document.querySelector(".list");
const counter = document.querySelector(".counter");

let inputVal = '';
let contentType = "Short Video";
let contentTypeId = "short_video";
let copyAll = "";
let emoji = [];
let response = "";
let data = "";

const API_BASE_URL = "http://127.0.0.1:8080/generate-hooks.php";

const loadingTemplate = `<div><p>Generating Hooks...</p></div>`;

// Handle Form Submit
function onFormSubmit(event) {
    event.preventDefault();
    
    if (!inputVal.trim()) {
        alert("Please enter a topic");
        return;
    }

    button.disabled = true;
    emoji = [];
    copyAll = "";
    response = "";
    loading.innerHTML = loadingTemplate;
    result.innerHTML = "";
    result.style.display = "none";
    loading.style.display = "flex";

    const requestData = {
        topic: inputVal,
        usage: contentTypeId
    };

    fetchData(requestData);
}

// Fetch Data
async function fetchData(requestData) {
    try {
        response = await fetch(API_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        data = await response.json();
        
        if (data.status === "error") {
            throw new Error(data.message);
        }

        button.disabled = false;
        loading.style.display = "none";
        result.style.display = "block";

        showResultUI(data.hooks);
    } catch (error) {
        button.disabled = false;
        console.error("Error occurred:", error);
        loading.innerHTML = `<div class="error-msg"><p>Error: ${error.message}</p><p>Please try again.</p></div>`;
    }
}

// Handle Dropdown Click
function handleDropDownClick() {
    list.classList.toggle("active");
}

// Handle Content Type Selection
function handleContentTypeSelection(event) {
    contentType = event.target.textContent;
    contentTypeId = event.target.dataset.id;
    selectedType.textContent = contentType;
    list.classList.remove("active");
}

// Handle Input Change
function handleInputChange(event) {
    inputVal = event.target.value.trim();
    const maxLength = 150;

    if (inputVal.length > maxLength) {
        inputVal = inputVal.slice(0, maxLength);
        event.target.value = inputVal;
    }

    counter.textContent = `${inputVal.length} / ${maxLength}`;
}

// Result UI
function showResultUI(hooks) {
    if (!Array.isArray(hooks)) {
        result.innerHTML = '<p class="error-msg">Invalid response format</p>';
        return;
    }
    
    result.innerHTML = hooks
        .map(hook => `<p>${hook.hook}</p>`)
        .join("");
}