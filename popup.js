const debounce = (func, delay) => {
	let timeoutId;
	return (...args) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			func.apply(this, args);
		}, delay);
	};
};

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
		}, 10000);
	});
};
const select = document.getElementById("voices");
const pitchInput = document.getElementById("pitch");
const rateInput = document.getElementById("rate");

getVoices().then(voices => {
	voices.forEach((voice, index) => {
		select.add(new Option(`${voice.name}`, index));
	});

	getVoicesFromStorage();
});

const sendMssageToContent = async (msg) => {
	const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
	const response = await chrome.tabs.sendMessage(tab.id, JSON.stringify(msg));

	console.log(">>> RESPONSE FROM CONTENT", response);
	return response;
};

const getVoicesFromStorage = async () => {
	let response = await sendMssageToContent({command: "get stored voice"});

	select.value = response.voice;
	pitchInput.value = response.pitch;
	rateInput.value = response.rate;
};


const voiceChangeHandler = e => {
	e.preventDefault();

	const message = {command: "voice changed", voice: select.value, pitch: pitchInput.value, rate: rateInput.value};

	sendMssageToContent(message);
};

const voiceChangeDebounced = debounce(voiceChangeHandler, 1000);

select.addEventListener("change", voiceChangeDebounced);
pitchInput.addEventListener("change", voiceChangeDebounced);
rateInput.addEventListener("change", voiceChangeDebounced);