//Consts Start Screen / Languge select
const LangugeSelectScreen_div = document.getElementById("Start-Screen")
// Consts for getting the dict
const inputs_div = document.getElementById("inputs")
const submit_btn = document.getElementById("submit-btn");
const text_inp = document.getElementById("dict-inp-txt");
const file_inp = document.getElementById("dict-inp-txt-file");
let User_text = ""; // Variable to store user input
//  Consts for Displaying cards/ Using dict
const user_guess = document.getElementById("U-G");
const card_div = document.getElementById("card");
const key_card = document.getElementById("key-card");
const value_card = document.getElementById("value-card");
const CorI_label = document.getElementById("CorI");
const try_label = document.getElementById("tries")
const L_O_C_B = document.getElementById("loop-over?");
const FlipKeysCheckBox = document.getElementById("F-K");
const Satistics = document.getElementById("Satistics");
const Satistics_div = document.getElementById("Stats-div");
const Satistics_sort = document.getElementById("sort-by-select");
let lang;
let open_Stats = false;
let try_counter = {};
let current_index = 0;



function ExitLangugeSelectScreen() {
    LangugeSelectScreen_div.style.pointerEvents = "none"; // Disable pointer events
    LangugeSelectScreen_div.style.opacity = 0; // Hide the language selection screen
    LoadScreenAfterLangSelect()

}
function LoadScreenAfterLangSelect(){
    if (lang === "Heb") {
        headers = document.getElementsByTagName("header");
        
        inputs_div.style.textAlign = "right"
        for (let i = 0; i < headers.length; i++) {
            headers[i].style.textAlign = "right";
        }
        document.getElementById("H-T").textContent = "ברוך הבא לאתר שלי";
        document.getElementById("Label-Checkbox").textContent = "להפוך את המפתחים?";
        document.getElementById("Start-info").textContent = "כאן אתה נותן קלט של מילון כמו כך: {1: היי, 2: מה שלומך, 3: מה קורה} או 1: היי, 2: מה שלומך, 3: מה שלומך   ותקבל כרטיס עם המפתח בחזית ותצטרך להקליד את הערך שלו";
        document.getElementById("U-G").placeholder = "הקלד את הניחוש שלך כאן";
        document.getElementById("tries").textContent = "לא נכשלת עדיין";
        document.getElementById("T-Title").textContent = "מילים / טעויות";
        document.getElementById("sort-by-select").innerHTML = "<option value='mistakes'>רוב הטעויות</option><option value='alphabetically'>אלפבית</option><option value='length'>אורך המילה</option>";
        document.getElementById("dict-inp-txt").placeholder = "הזן טקסט כאן";
        document.getElementById("dict-inp-txt-file").previousElementSibling.textContent = ".txt הזן את המילון באמצעות קובץ עם סיומת ";
        document.getElementById("submit-btn").textContent = "שלח";
        document.getElementById("")
    }
}



function Choise_Hebrew(){
    if (confirm("אתה בטוח")){
        lang = "Heb"
        ExitLangugeSelectScreen()    
    }
}
function Choise_English(){
    if(confirm("Are You Sure?")){
        lang = "Eng"
        ExitLangugeSelectScreen()
    }
}



function readFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(e) {
            const contents = e.target.result;
            resolve(contents);
        };

        reader.onerror = function(e) {
            reject(e);
        };

        reader.readAsText(file);
    });
}


function checkFile() {
    return new Promise((resolve, reject) => {
        const fileInput = document.getElementById('dict-inp-txt-file');
        const file = fileInput.files[0];

        if (file) {
            readFile(file)
                .then(contents => {
                    resolve(contents);
                })
                .catch(error => {
                    console.error('Error reading file:', error);// Q're
                    reject("Error reading file.");// Q're
                });
        } else {
            reject('No file selected.');// Q're
        }
    });
}


function User_text_to_cards(inputString) {
    const dictionary = {};
    const items = inputString.split(',');
    for (let item of items) {
        const [key, valueStr] = item.split(':').map(str => str.trim());
        // Assign value as string
        dictionary[key] = valueStr;
    }
    if(FlipKeysCheckBox.checked){
        const reversedDict = {};
        for (const key in dictionary) {
          const value = dictionary[key];
          reversedDict[value] = key;
        }
        return reversedDict;
        
        
    }
    return dictionary;
}


submit_btn.onclick = () => {
    if (text_inp.value) {
        User_text = text_inp.value; // Store user-entered text
        cards = User_text_to_cards(User_text);
        try_counter = {};
        Object.keys(cards).forEach(key => {
            try_counter[key] = 0;
        });
        LoadCards();
        handle_cards(cards);
    } else {

        checkFile()
            .then(contents => {
                User_text = contents; // Store file content
                cards = User_text_to_cards(User_text);
                LoadCards();
                handle_cards(cards);
                try_counter = {};
                Object.keys(cards).forEach(key => {
                    try_counter[key] = 0;
                });                
            })
            .catch(error => {
                alert(error);
            });
    }
};


function LoadCards(){
    user_guess.style.opacity = 1;
    user_guess.style.pointerEvents = 'auto'
    card_div.style.opacity = 1;
    card_div.style.pointerEvents = "auto"
}
function ShowCardsAt(cards,index){
       // Convert the dictionary object into an array of key-value pairs
       const entries = Object.entries(cards);
       const [key, value] = entries[index];
       return [key, value];
}

function update_card(current_card,RevealVal=false){
    key = current_card[0];
    value = current_card[1];
    key_card.textContent = key;
    if(RevealVal){
        value_card.textContent = value;
    }
    else{
        value_card.textContent = "";
    }
    CorI_label.textContent = "‎";
    CorI_label.style.color = "#000000";
}


function handle_cards(cards){
    if (Object.keys(cards).length === current_index && L_O_C_B.checked){
        current_index = 0;
    }
    else if(Object.keys(cards).length === current_index){
        current_index -= 1;
    }
    current_card = ShowCardsAt(cards,current_index)
    update_card(current_card);
}

window.addEventListener('keydown', function(event) {
    if (event.key === "Enter" && user_guess.value) {
        current_card_key = ShowCardsAt(cards,current_index)[0];
        current_card_value  = ShowCardsAt(cards,current_index)[1];
        if (user_guess.value === current_card_value){
            RevealCard();
            CorI_label.style.color =  "rgb(239, 249, 98)";
            CorI_label.textContent = "Correct";// Q're
            user_guess.value= "";
        }
        else{
            try_counter[current_card_key] += 1
            let sum_of_errors = Object.values(try_counter).reduce((acc, val) => acc + val, 0);
            CorI_label.textContent = "Incorrect";// Q're
            try_label.textContent = "You've Failed: "+sum_of_errors+" Times";// Q're
            CorI_label.style.color = "rgb(118, 7, 7)";
        }
        
    }
    else if (CorI_label.textContent ==="Correct"){
        NextCard();
    }
});
function NextCard(){
    current_index+=1;
    handle_cards(cards);
}
function RevealCard(){
    c_c = ShowCardsAt(cards,current_index)
    update_card(c_c,true)
}
function dict_to_string(dictionary){
    return Object.keys(dictionary).map(key => `${key}: ${dictionary[key]}`).join(', ');
}


function Show_Satistics() {
    open_Stats = open_Stats ? false : true
}


function sortDictByValue_Reversed(dictionary) { // REVESE ORDER
    const sortedEntries = Object.entries(dictionary).sort((a, b) => b[1] - a[1]); // Reverse the sorting order
    const sortedObj = {};
    for (const [key, value] of sortedEntries) {
        sortedObj[key] = value;
    }
    return sortedObj;
}


function sortDictByKeyAlphabet(dictionary) {
    // Sort the keys alphabetically (ignoring capitalization)
    const sortedKeys = Object.keys(dictionary).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    const sortedDict = {};
    sortedKeys.forEach(key => {
        sortedDict[key] = dictionary[key];
    });
    return sortedDict;
}


function sortDictByKeyLength(dictionary) {
    const entries = Object.entries(dictionary);
    // Sort the array based on the length of the keys
    entries.sort((a, b) => a[0].length - b[0].length);
    const sortedDict = {};
    for (const [key, value] of entries) {
        sortedDict[key] = value;
    }
    return sortedDict;
}
document.remove
function Show_All_Satistics() {
    Satistics.innerHTML = "";
    if (open_Stats){
        // Clear existing rows
        Satistics.innerHTML = "";
        // Loop through the try_counter object
        Satistics_dict = sortDictByValue_Reversed(try_counter); // Deafult option is dict sorted by most mistakes (backwarsd for loop)
        if (Satistics_sort.value == "alphabetically"){
            Satistics_dict = sortDictByKeyAlphabet(try_counter);
        }
        else if(Satistics_sort.value == "length"){
            Satistics_dict = sortDictByKeyLength(try_counter);
        }
        for (let word in Satistics_dict) {
            if (Satistics_dict.hasOwnProperty(word)) {
                const try_amount_for_word = Satistics_dict[word];
                let newRow = Satistics.insertRow();
                let cell1 = newRow.insertCell(0);
                let cell2 = newRow.insertCell(1);
                WordIsHebrew = "אבגדהוזחטיכלמנסעפצקרשת".includes(word[0])
                cell1.textContent = !WordIsHebrew ? word+" :" : try_amount_for_word;
                cell2.textContent = WordIsHebrew ? ": "+word : try_amount_for_word;;
            }
        }
        Satistics_div.style.opacity = 1;
        Satistics_div.style.pointerEvents ="auto"
    }
    else{
        Satistics_div.style.opacity = 0;
        Satistics_div.style.pointerEvents ="none"
    }
}
function Copy_Stats() {
    navigator.clipboard.writeText(dict_to_string(Satistics_dict))
        .then(() => {
            alert('Text copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy text to clipboard. Please try again.');
        });
}
const update_TryTable = window.setInterval(Show_All_Satistics,1000/60)

