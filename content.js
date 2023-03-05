// global elements on the page
const textarea = document.querySelectorAll("textarea")[0];
const submitButton = document.querySelectorAll("textarea")[0].nextSibling;
let shouldTalk = false;
const LOCAL_STORAGE_SETTINGS_KEY = 'cglt-settings'

// observation block: check the disabled state of the submit button to decide when to start speaking after the answer has been generated
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'disabled') {
        if(!mutation.target.disabled) {
            speak();
        }
      }
    });
});
observer.observe(submitButton, {attributes: true});

// speech recognition block - listening
let recognizing;
const recognization = new webkitSpeechRecognition();
recognization.continuous = true;

recognization.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
            const transcript = event.results[i][0].transcript;
            textarea.innerText = transcript
            textarea.value = transcript;

            shouldTalk = true;
            toggleListening();

            submitButton.click()
        }
    }
}

const reset = () => {
    recognizing = false;
}

const toggleListening = () => {
    if (recognizing) {
        recognization.stop();
        reset();
        return;
    }

    recognization.start();
    recognizing = true;
}

// voice blocks
let synth;

window.onload = () => {
    if("speechSynthesis" in window || speechSynthesis){
        synth = window.speechSynthesis || speechSynthesis;
    }

}

let voice = 'Daniel';
let pitch = 1;
let rate = 1;

let voices;
const getVoices = () => {
    return new Promise((resolve, reject) => {
        let synth = window.speechSynthesis;
        let intervalId;

        intervalId = setInterval(() => {
            if (synth.getVoices().length !== 0) {
                resolve(synth.getVoices());
                clearInterval(intervalId);
            }
        }, 100);

        setTimeout(() => {
            reject([]);
            clearInterval(intervalId);
        }, 10000)
    });
};

getVoices().then(v => {
    voices = v;
});

const speak = () => {
    let text = "Ooops! I did not find any answer to speak out loud.";

    if (!document.querySelectorAll('.markdown').length) {
        logMessage(">> Please ask a question first to hear me speak!");
    } else {
        text = Array.from(document.querySelectorAll('.markdown')).pop().textContent;
    }

    // we should talk only if initiated through the keyboard shortcut
    // if (!shouldTalk){
    //     return;
    // }

    let utterThis = new SpeechSynthesisUtterance(text);

    utterThis.pitch = pitch;
    utterThis.voice = voices[voice];
    utterThis.rate = rate;

    utterThis.onend = function (event) {
        shouldTalk = false;
        console.log("SpeechSynthesisUtterance ends");
    };

    utterThis.onerror = function (event) {
        shouldTalk = false;
        console.error("SpeechSynthesisUtterance onerror", event);
    };

    synth.cancel();
    synth.speak(utterThis);
}

const getVoicesFromLocalStorage = async () => {
    let settings = await chrome.storage.local.get(LOCAL_STORAGE_SETTINGS_KEY);

    if (JSON.stringify(settings) === '{}') {
        settings = {
            voice: 87,
            rate: 1,
            pitch: 1,
            value: 'from local storage'
        }

        const valueToStore = {[LOCAL_STORAGE_SETTINGS_KEY]: JSON.stringify(settings)};
        await chrome.storage.local.set(valueToStore);

        console.log("> VALUE TO STORE");

        return settings;
    }

    console.log(">>>> RETURNING VOICES FROM LOCAL STORAGE", settings[LOCAL_STORAGE_SETTINGS_KEY]);
    return settings[LOCAL_STORAGE_SETTINGS_KEY];
    // return JSON.parse(settings[LOCAL_STORAGE_SETTINGS_KEY]);
};

const storeVoicesInLocalStorage = async (settings) => {
    const valueToStore = {[LOCAL_STORAGE_SETTINGS_KEY]: settings};

    await chrome.storage.local.set(valueToStore);

    console.log(">> STOREd", valueToStore);
    return valueToStore;
}

// listen to messages from background & popup and act on them
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.command) {
        switch(request.command) {
            case 'listen':
                toggleListening();
                break;
            case 'pause':
                synth.cancel();
                break;
                case 'talk':
                    speak();
                    break;
        }
        return;
    }

    logMessage(request);

    const json = JSON.parse(request);

    console.log(json.command, '<< COMMAND');

    switch(json.command) {
        case 'voice changed':

            const obj = {
                pitch: json.pitch,
                voice: json.voice,
                rate: json.rate
            };

            storeVoicesInLocalStorage(obj).then(result => {
                sendResponse(result);
            });

            // pitch = json.pitch;
            // voice = json.voice;
            // rate = json.rate;

            // speak();
            break;
        case 'get stored voice':
            getVoicesFromLocalStorage()
                .then(settings => {
                    sendResponse(settings);
                })
            break;
    }

    // this is important to keep the connection open
    return true;
});

const logMessage = msg => {
    console.log(">>>>>>>>>>>>>> conent STARTS");
    console.trace(msg);
    console.log("-------------- content ENDS");
}
