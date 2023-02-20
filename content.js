// global elements on the page
const textarea = document.querySelectorAll("textarea")[0];
const submitButton = document.querySelectorAll("textarea")[0].nextSibling;
let shouldTalk = false;

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

const speak = () => {
    let text = "Ooops! I did not find any answer to speak out loud.";
    
    if (!document.querySelectorAll('.markdown').length) {
        console.log(">> Please ask a question first to hear me speak!");
    } else {
        text = Array.from(document.querySelectorAll('.markdown')).pop().textContent;
    }

    // we should talk only if initiated through the keyboard shortcut
    if (!shouldTalk){
        return;
    }
    
    let utterThis = new SpeechSynthesisUtterance(text);

    utterThis.pitch = 0.98;
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

// listen to messages from background and act on them
chrome.runtime.onMessage.addListener((request, sender) => {
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
});