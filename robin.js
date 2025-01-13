  
const button = document.querySelector(".hook-generator").querySelector('button');
const loading = document.querySelector(".loading");
const result = document.querySelector(".lws-tool-result");
const popup = document.querySelector(".popup");
const selectedType = document.querySelector(".selected-type");
const list = document.querySelector(".list");
const counter = document.querySelector(".counter");
let inputVal = ''
let popupClose = "";
let balanceElem = "";
let response = "";
let data = "";
let copyAll = "";
let contentType = "Short Video";
let emoji = []

const API_BASE_URL = "https://www.day2daydiaries.com/wp-admin/admin-ajax.php";

const loadingTemplate = `<div>
<p>Generating Hooks...</p>
</div>`;

// Handle Form Submit
function onFormSubmit(event) {
    event.preventDefault();


    button.disabled = true;
    emoji = [];
    copyAll = ""

    response = "";
    loading.innerHTML = loadingTemplate;
    result.innerHTML = "";
    result.style.display = "none";
    loading.style.display = "flex";
    
    var formData = new FormData();
    formData.append("action", "generate_hooks_basic");
    formData.append("topic", inputVal);
    formData.append("usage", contentType);

    console.log(inputVal, contentType, "to be fetched")

    fetchData(formData);

}

// Data Fetching
async function fetchData(formData) {
    try {
        response = await fetch(`${API_BASE_URL}`, {
            method: "POST",
            body: formData,
        });

        if (response.ok) {

            data = await response.json();

            console.log("Data from Api", data);
            button.disabled = false;
            loading.style.display = "none";
            result.style.display = "block";

            /*if (data == "LOGIN_FIRST") {

                loginPopup();
                return;
            } else if (data == "NO_BALANCE") {
                
                noBalPopup();
                return;
            }


            data = JSON.parse(data);
            showResultUI(data);*/

        } else {
            button.disabled = false
            throw new Error("Request failed. Please try again!");
        }
    } catch (error) {
        button.disabled = false
        console.error("Error occurred:", error);
        loading.innerHTML = ` <div class="error-msg">
    <img src="https://www.day2daydiaries.com/wp-content/uploads/2024/06/Robot-oops-gif.webp" alt="Error">
    <p class="text-medium">Uh Oh!</p>
    <p>Something went wrong! Please try again</p>
   </div>`;
        return;
    }

}

// Result UI
function showResultUI(data) {


    data.map((item) => {
        copyAll += item.hook + '\n';

        if (item.hook_type.includes("Strong")) {
            emoji.push('💪');
        } else if (item.hook_type.includes("Intriguing")) {
            emoji.push('🤔');
        } else if (item.hook_type.includes("Fact")) {
            emoji.push('📚');
        } else if (item.hook_type.includes("Metaphor")) {
            emoji.push('🌈');
        } else if (item.hook_type.includes("Story")) {
            emoji.push('📜');
        } else if (item.hook_type.includes("Statistical")) {
            emoji.push('📈');
        } else if (item.hook_type.includes("Quotation")) {
            emoji.push('💬');
        } else if (item.hook_type.includes("Challenge")) {
            emoji.push('🏋️‍♂️');
        } else if (item.hook_type.includes("Visual")) {
            emoji.push('👀');
        } else if (item.hook_type.includes("Action")) {
            emoji.push('🏃‍♂️');
        } else if (item.hook_type.includes("Historical")) {
            emoji.push('✍🏻');
        } else if (item.hook_type.includes("Anecdotal")) {
            emoji.push('😄');
        } else if (item.hook_type.includes("Humorous")) {
            emoji.push('😂');
        } else if (item.hook_type.includes("Controversial")) {
            emoji.push('🤷‍♂️');
        } else if (item.hook_type.includes("Rhetorical")) {
            emoji.push('❓');
        } else {
            emoji.push('');
        }



    })


    result.insertAdjacentHTML("beforeend", `
    <div class="mt-48">
    <p class="result-title mtb-18">Hooks Generated</p>
    <div class="border box generated-hooks">
       
              ${data.map((item, index) => (
        `
                    <div class="relative">
                    <p class="hook-type">${emoji[index]} ${item.hook_type}</p>
                    <p>${item.hook}</p>
                    <div class="copy-icon relative" onclick="copyToClipboard('${index}')">
                        <p class="sub-copy-alert">Copied</p>
                        <i class="fa-regular fa-copy"></i> <span>&nbsp;Copy</span>
                    </div>
                </div>
                    `
    )).join("")
        }
                
               
    
        <p class="copy-all" onclick="copyToClipboard('All')">Copy all</p>
    </div>
</div>
    `);


}


// Handle Input
function handleInputChange(event) {
    inputVal = event.target.value.trim();
    const maxLength = 150;

    if (inputVal.length !== 0) {
        button.disabled = false;
    } else {
        button.disabled = true;
    }

    counter.style.display = "block";

    if (inputVal.length > maxLength) {
        event.target.value = inputVal.substring(0, maxLength);
        inputVal = event.target.value.trim();
    }

    const charCount = inputVal.length;
    counter.textContent = `${charCount} / ${maxLength}`;
}


// Copy 
function copyToClipboard(index) {
    let copy = ""
    const copyAllElem = document.querySelector(".copy-all");
    copy = data[index]?.hook;
    console.log(copy, index)

    if (index == 'All') {
        copy = copyAll;
        copyAllElem.innerHTML = "Copied All";
        setTimeout(() => {
            copyAllElem.innerHTML = "Copy all";
        }, 2000);


    }

    const tempTextarea = document.createElement("textarea");
    tempTextarea.value = copy;
    document.body.appendChild(tempTextarea);

    tempTextarea.select();
    tempTextarea.setSelectionRange(0, 99999);

    document.execCommand("copy");

    document.body.removeChild(tempTextarea);

    const copyAlerts = document.getElementsByClassName("sub-copy-alert");

    if (index != 'All') {
        copyAlerts[index].style.display = "block";
        setTimeout(() => {
            copyAlerts[index].style.display = "none";
        }, 2000);

    }
}

// Handle Content Type DropDown
function handleDropDownClick() {
    console.log("clicked")
    list.classList.toggle("active");
}

// Handle Content Type Selection
function handleContentTypeSelection(event) {
    console.log(event.target.innerText);
    contentType = event.target.innerText;
    selectedType.innerText = contentType;
    list.classList.toggle("active")
}



/*function loginPopup() {
    popup.innerHTML = `
    <div class='popup-container'>
    <i class="close fa-solid fa-xmark"></i>
    <div><img src="https://www.day2daydiaries.com/wp-content/uploads/2024/06/no-access.png" alt="Login Error"></div>
    <p>You need to login first!</p>
    <a target="_blank" href="https://https://www.day2daydiaries.com/user-login">Login</a>
  </div>
    `;
    popup.style.display = "flex";
    popupClose = document.querySelector(".close");
    document
      .querySelector(".popup")
      .addEventListener("click", function (event) {
        if (
          event.target === this ||
          event.target.contains(popupClose)
        ) {
          this.style.display = "none";
        }
      });
  }*/
  
  /*function noBalPopup() {
    popup.innerHTML = `
    <div class='popup-container'>
    <i class="close fa-solid fa-xmark"></i>
    <div><img src="no-balance.png" alt="Balance Error"></div>
    <p>Not Enough Power Points!</p>
    <a target="_blank" href="https://www.day2daydiaries.com/points-system">Recharge Me</a>
  </div>
    `;
    popup.style.display = "flex";
    popupClose = document.querySelector(".close");
    document
      .querySelector(".popup")
      .addEventListener("click", function (event) {
        if (
          event.target === this ||
          event.target.contains(popupClose)
        ) {
          this.style.display = "none";
        }
      });
  }*/
  
