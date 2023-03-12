// global elements on the page
const LOCAL_STORAGE_SETTINGS_KEY = "cglt-settings";

const textarea = document.querySelectorAll("textarea")[0];
const submitButton = document.querySelectorAll("textarea")[0].nextSibling;

let shouldTalk = false;

// observation block: check the disabled state of the submit button to decide when to start speaking after the answer has been generated
const observer = new MutationObserver(mutations => {
	mutations.forEach(mutation => {
		if (mutation.attributeName === "disabled") {
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
			textarea.innerText = transcript;
			textarea.value = transcript;

			shouldTalk = true;
			toggleListening();

			submitButton.click();
		}
	}
};

const reset = () => {
	recognizing = false;
};

const toggleListening = () => {
	if (recognizing) {
		recognization.stop();
		reset();
		return;
	}

	recognization.start();
	recognizing = true;
};

// voice blocks
let synth;
let voice = 144;
let pitch = 1;
let rate = 1;
let voices;
let utterThis;

window.onload = () => {
	if("speechSynthesis" in window || speechSynthesis){
		synth = window.speechSynthesis || speechSynthesis;

		utterThis = new SpeechSynthesisUtterance();

		utterThis.onend = event => {
			shouldTalk = false;
			utterThis.text = "";
			synth.cancel();

			console.log("SpeechSynthesisUtterance onend", event);
		};

		utterThis.onerror = event =>{
			shouldTalk = false;
			console.log("SpeechSynthesisUtterance onpause", event);
		};

		getVoices().then(vozs => {
			voices = vozs;
			getVoicesFromLocalStorage();
		});
	}
};

const getVoices = () => {
	return new Promise((resolve, reject) => {
		let voicesSynth = window.speechSynthesis;
		let intervalId;

		intervalId = setInterval(() => {
			if (voicesSynth.getVoices().length !== 0) {
				resolve(voicesSynth.getVoices());
				clearInterval(intervalId);
			}
		}, 100);

		setTimeout(() => {
			reject([]);
			clearInterval(intervalId);
		}, 10000);
	});
};

const speak = () => {
	let text = "I did not find any answer to speak out loud.";

	if (!document.querySelectorAll(".markdown").length) {
		console.log(">> Please ask a question first to hear me speak!");
	} else {
		text = Array.from(document.querySelectorAll(".markdown")).pop().textContent;
	}

	// we should talk only if initiated through the keyboard shortcuts
	if (!shouldTalk){
		return;
	}

	// the speaking stops after few seconds in chrome due to a bug. Temporary fix until chrome fixes it
	const speakingInterval = setInterval(() => {
		if (!synth.speaking) {
			clearInterval(speakingInterval);
		}

		if (synth.speaking) {
			synth.pause();
			synth.resume();
		}
	}, 10000);

	updateUtteranceConfigs();
	utterThis.text = text;

	synth.cancel();
	synth.speak(utterThis);
};

const updateUtteranceConfigs = () => {
	utterThis.pitch = pitch;
	utterThis.voice = voices[voice];
	utterThis.rate = rate;
};

const speakOnVoiceChange = () => {
	synth.cancel();

	utterThis.text = "This is my new voice, if you like it continue using the shortcuts to perform the various actions.";
	synth.speak(utterThis);
	synth.resume();
};

const getVoicesFromLocalStorage = async () => {
	const storedSettings = await chrome.storage.local.get(LOCAL_STORAGE_SETTINGS_KEY);

	// create own settings
	if (JSON.stringify(storedSettings) === "{}") {
		const newSettings = {
			voice: 144,
			rate: 1,
			pitch: 1
		};

		const valueToStore = {[LOCAL_STORAGE_SETTINGS_KEY]: JSON.stringify(newSettings)};
		await chrome.storage.local.set(valueToStore);

		updateAppVoiceConfig(newSettings);

		return newSettings;
	}

	updateAppVoiceConfig(storedSettings[LOCAL_STORAGE_SETTINGS_KEY]);

	return storedSettings[LOCAL_STORAGE_SETTINGS_KEY];
};

const storeVoicesInLocalStorage = async (settings) => {
	const valueToStore = {[LOCAL_STORAGE_SETTINGS_KEY]: settings};
	await chrome.storage.local.set(valueToStore);
	return settings;
};

const updateAppVoiceConfig = settings => {
	if (typeof settings === "string" || settings instanceof String) {
		settings = JSON.parse(settings);
	}

	pitch = settings.pitch;
	voice = settings.voice;
	rate = settings.rate;

	updateUtteranceConfigs();
};

// listen to messages from background & popup and act on them
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	// keyboard shortcut commands coming from background.js
	if (request.command) {
		switch(request.command) {
		case "listen":
			toggleListening();
			break;
		case "pause":
			synth.cancel();
			break;
		case "talk":
			// enable the option so that we can talk when the users presses the option to repeat last answer.
			shouldTalk = true;
			speak();
			break;
		default:
			break;
		}
		return;
	}

	// other commands comings from popup.js
	const popupRequest = JSON.parse(request);

	switch(popupRequest.command) {
	case "voice changed": {
		storeVoicesInLocalStorage(popupRequest)
			.then(result => {
				sendResponse(result);
				updateAppVoiceConfig(result);
				speakOnVoiceChange();
			});
		break;
	}
	case "get stored voice":
		getVoicesFromLocalStorage()
			.then(settings => {
				sendResponse(settings);
			});
		break;
	default:
		break;
	}

	// this is important to keep the connection open
	return true;
});