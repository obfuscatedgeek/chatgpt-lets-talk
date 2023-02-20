// global elements on the page
const textarea = document.querySelectorAll("textarea")[0];
const submitButton = document.querySelectorAll("textarea")[0].nextSibling;

// observation block: check the disabled state of the submit button to decide when to start speaking after the answer has been generated
const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.attributeName === 'disabled' && !mutation.target.disabled) {
        speak();
      }
    });
});
observer.observe(submitButton, {attributes: true});

// speech recognition block
let recongizing;
const recognization = new webkitSpeechRecognition();
recognization.continuous = true;

window.onbeforeunload = () => {
    voice.cancel();
}        

recognization.onresult = (event) => {
    for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
            const transcript = event.results[i][0].transcript;
            textarea.innerText = transcript
            textarea.value = transcript;

            toggleListening();

            submitButton.click()
        }
    }
}

const reset = () => {
    recongizing = false;        
}

const toggleListening = () => {
    if (recongizing) {
        recognization.stop();
        reset();
        return;
    }

    recognization.start();
    recongizing = true;
}

// voice blocks
let voice;
if("speechSynthesis" in window || speechSynthesis){ 
    voice = window.speechSynthesis || speechSynthesis;   
} else {
    alert("Sorry speech is not available!");
}    

// identify the markdown block and utter it
const speak = () => {
    if (!voice) {
        return;
    }

    var text = Array.from(document.querySelectorAll('.markdown')).pop().textContent 
    var utter = new SpeechSynthesisUtterance(text);
    voice.speak(utter); 
}

// listen to messages from background and act on them
chrome.runtime.onMessage.addListener((request, sender) => {
    switch(request.command) {
        case 'listen':
            toggleListening();
            break;
        case 'pause':
            voice.cancel();
            break;
        case 'talk':
            speak();
            break;
    }
});