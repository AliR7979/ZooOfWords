const previousButton = document.getElementById("previous-button");
const nextButton = document.getElementById("next-button");
const list = document.querySelector(".dropdown-list");
var dropdownLength = 0;

//Access the instructions that allows users to give an overview of the extension and commands 
function loadSaved() {

    var values = [];
    var keys = Object.keys(localStorage);
    var i = keys.length;

    for(let j = 0; j<i; ++j ) {
        values.push( localStorage.getItem(keys[j]) );
    }

    //if no saved items, then add a 'You have not saved anything' option
    if(dropdownLength == 0) {
        const listItem = document.createElement("div");
        listItem.classList.add("list-item");
        listItem.innerHTML = "To use the extension, simply type a word into the search bar and press Enter to unveil its rich meaning and context.<br> Navigate through different definitions using the navigation buttons and enrich your vocabulary effortlessly.<br><br> Shortcut to open the popup,<br><br> Windows: Ctrl+Shift+S <br> Mac: MacCtrl+Shift+S ";
        list.appendChild(listItem);        
    }

}

//load all saved words
loadSaved();

//display instructions when user clicks on the dropdown menu
const description = document.getElementById("description-element");
const dropdown = document.getElementById("dropdown-menu");
dropdown.addEventListener("click", () => {

    if(list.style.opacity == 1) {
        list.style.visibility = "hidden";
        list.style.opacity = 0;
    }
    else {
        console.log("shit");
        document.querySelector('.buttons').style.visibility = 'hidden';
        list.style.visibility = "visible";
        list.style.opacity = 1;
        content.classList.remove("active");
        description.innerHTML = ""
    }
})

const content = document.querySelector(".content");
const example = document.querySelector(".example")

let audio;

//defining these values for easy traversing through the various definitions of the word in the JSON
var resultIndex = 0;
var meaningsIndex = 0;
var definitionsIndex = 0;

var resultLength = 0;
var meaningsLength = 0;
var definitionsLength = 0;

//var page = 1;
var apiJSON;
var searchItem;

//fetches the meaning of the searched word
function displaySearchResults(result, word) {

    apiJSON = result;
    searchItem = word;

    resultLength = result.length;
    meaningsLength = result[resultIndex].meanings.length;
    definitionsLength = result[resultIndex].meanings[meaningsIndex].definitions.length;

    if(result.title) {
        description.innerHTML = `Can't find the meaning of <span>"${word}"</span>. Please check for any possible spelling errors.`;
    }
    else {
        content.classList.add("active");

        //if multiple meanings exist, display buttons for navigation
        if(resultLength>1 || meaningsLength>1 || definitionsLength>1) {
            document.querySelector('.buttons').style.visibility = 'visible';
        }

        let definition = result[resultIndex].meanings[meaningsIndex].definitions[definitionsIndex];
        phonetics = `/${result[resultIndex].phonetics[0].text}/`;
        document.querySelector(".word p").innerText = result[resultIndex].word;
        document.querySelector(".word span").innerText = phonetics;
        document.querySelector(".definition span").innerText = definition.definition;
        document.querySelector(".part-of-speech p").innerText = result[resultIndex].meanings[meaningsIndex].partOfSpeech

        if(localStorage.getItem(result[resultIndex].word) === "true") {
            saveButton.classList.remove("saved");
            saveButton.classList.remove("bi-bookmark-check-fill");
            saveButton.classList.remove("bi-bookmark-check");
            saveButton.classList.add("bi-bookmark-check-fill");
        }
        else {
            saveButton.classList.remove("saved");
            saveButton.classList.remove("bi-bookmark-check-fill");
            saveButton.classList.remove("bi-bookmark-check");
            saveButton.classList.add("bi-bookmark-check");
        }

        //console.log(definition.example);
        //console.log(definition.example != undefined);

        audio = new Audio("https:" + result[resultIndex].phonetics[0].audio);
    }
}

const searchbar = document.getElementById("searchbar-element");
const saveButton = document.getElementById("save-icon");

//displays the results on dropdown click


//adds onclick event listener to all items of the dropdown list
function updateEventListeners() {

    const listElements = document.querySelectorAll(".list-item");
    listElements.forEach((element) => {

        element.addEventListener("click", () => {
            const placeholder = document.querySelector(".placeholder");
            placeholder.innerHTML = element.innerHTML;
            element.id = element.innerHTML;
    
            const dropdownList = document.querySelector(".dropdown-list");
            dropdownList.style.visibility = "hidden";
    
            displayResults(element.innerHTML);
    
        })
    })

}

//fetches the Dictionary API
function fetchApi(word) {

    if(!(/^[a-zA-Z]+$/.test(word))) {
        description.style.color = "#9A9A9A";
        description.innerHTML = "Please enter only a single word containing letters of the English Alphabet.";
        return;        
    }

    content.classList.remove("active");
    description.style.color = "#9A9A9A";

    //console.log('yo');
    description.innerHTML = "Just a minute, hold tight ...";
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(url).then(response => response.json()).then(result => displaySearchResults(result, word)).catch(() =>{
        description.innerHTML = `Could not load your request. This could have occured either due to a spelling mistake or a network error at the back end.`;
    });

}

//on enter, searches the word entered by the user
searchbar.addEventListener("keyup", e => {

    //page = 1;
    nextButton.classList.add("enabled");
    previousButton.classList.remove("enabled");

    let word = e.target.value.replace(/\s+/g, '');
    if(e.key == "Enter" && word) {

        resultIndex = 0;
        meaningsIndex = 0;
        definitionsIndex = 0;
        resultLength = 0;
        meaningsLength = 0;
        definitionsLength = 0;

        document.querySelector('.buttons').style.visibility = 'hidden';
        content.classList.remove("active");

        if(localStorage.getItem(word) === "true") {
            saveButton.classList.add("saved");
            saveButton.classList.add("bi-bookmark-check-fill");
            saveButton.classList.remove("bi-bookmark-check");
        }

        fetchApi(word);
    }
});

//saves the given word to the local storage
saveButton.addEventListener("click", () => {

    const searchItem = document.getElementById("search-item").innerText;

    if(localStorage.getItem(searchItem) === "true") {
        saveButton.classList.remove("saved");
        saveButton.classList.remove("bi-bookmark-check-fill");
        saveButton.classList.add("bi-bookmark-check");
        localStorage.setItem(searchItem, "false");

        var targetOption = document.getElementById(searchItem);
        targetOption.remove();
        const placeholder = document.querySelector(".placeholder");
        placeholder.innerHTML = "Scroll your saved ..."
        --dropdownLength;

        if(dropdownLength == 0) {
            const listItem = document.createElement("div");
            listItem.classList.add("list-item");
            listItem.innerHTML = "You have not saved ";
            list.appendChild(listItem);        
        }
    }
    else {
        if(dropdownLength == 0) {
            list.innerHTML = "";
        }

        saveButton.classList.add("saved");
        saveButton.classList.add("bi-bookmark-check-fill");
        saveButton.classList.remove("bi-bookmark-check");
        localStorage.setItem(searchItem, "true");

        const listItem = document.createElement("div");
        listItem.classList.add("list-item");
        listItem.classList.add("hover-enable");
        listItem.innerHTML = searchItem;
        listItem.id = searchItem;
        list.appendChild(listItem);

        ++dropdownLength;

        updateEventListeners();

    }

})

//navigate through the different meanings of the single word
previousButton.addEventListener("click", () => {

    if(previousButton.classList.contains("enabled")) {

        //--page;
        if(definitionsIndex > 0) {
            --definitionsIndex;
        }
        else if(meaningsIndex > 0) {
            definitionsIndex = apiJSON[resultIndex].meanings[--meaningsIndex].definitions.length - 1;
        }
        else {
            meaningsIndex = apiJSON[--resultIndex].meanings.length - 1;
            definitionsIndex = apiJSON[resultIndex].meanings[meaningsIndex].definitions.length - 1;
        }

        if(!nextButton.classList.contains("enabled")) {
            nextButton.classList.add("enabled");
        }

        document.querySelector('.buttons').style.visibility = 'hidden';
        displaySearchResults(apiJSON, searchItem);

        if(resultIndex == 0 && meaningsIndex == 0 && definitionsIndex == 0) {
            previousButton.classList.remove("enabled");
        }

    }

})

nextButton.addEventListener("click", () => {

    if(nextButton.classList.contains("enabled")) {

        //++page;
        if(definitionsIndex < definitionsLength-1) {
            ++definitionsIndex;
        }
        else if(meaningsIndex < meaningsLength-1) {
            definitionsIndex = 0;
            ++meaningsIndex;
        }
        else {
            definitionsIndex = 0;
            meaningsIndex = 0;
            ++resultIndex;
        }

        if(!previousButton.classList.contains("enabled")) {
            previousButton.classList.add("enabled");
        }

        document.querySelector('.buttons').style.visibility = 'hidden';
        displaySearchResults(apiJSON, searchItem);

        if(resultIndex == resultLength-1 && meaningsIndex == meaningsLength-1 && definitionsIndex == definitionsLength-1) {
            nextButton.classList.remove("enabled");
            nextButton.innerText = "No more results";
        }
    }
})

