
# ChatGPT - Let's talk

A chrome extension that uses browsers `webkitSpeechRecognition` and `speechSynthesis` APIs to talk to and hear from ChatGPT.

Written in native Javascript, does not use any external libraries or APIs other than the ones already available in the browser.


## Features

Simple keyboard shortcuts to use

Windows | Mac | Description
:-----:|:-----:|---
**Alt + Shift + F** | **Option + Shift + F** | To start talking to ChatGPT (will populate the question and submit it at the end of speech)
**Alt + Shift + J** | **Option + Shift + J** | To hear ChatGPT repeat the last answer. It will start speaking automatically (permission dependent see [section](#cannot-hear-the-answer)) at the end of answer generation 
**Alt + Shift + P** | **Option + Shift + P** | To stop ChatGPT from talking.

## Troubleshooting

### Installation
Currently waiting for Chrome Web Store for approval, in the meantime you use the extension by
1. Clone the repo or download the zip and unzip the files

2. Go to Chrome extensions tab

![Step 1](/images/install-1.png)

3. Enable developer mode

![Step 2](/images/install-2.png)

![Step 3](/images/install-4.png)

4. Click on "Load unpacked" and point to the folder. Enjoy!

![Step 4](/images/install-5.png)


### Cannot hear the answer
Sometimes with the site sound permission, you might not hear the voice automatically at the end of answer generation. In order to fix this, you need to tell Chrome to allow sound from the ChatGPT site. Following is the process to enable it

1. Go to "Site Information" settings by pressing the lock icon next to the website URL

![Step 1](/images/0.png)

2. Click on the site settings

![Step 2](/images/1.png)

3. Go to Sound settings and change it from "Automatic (default)" 

![Step 2](/images/2.png)

4. to "Allow"

![Step 3](/images//3.png)

### Microphone access

On the first run when pressing the keyboard shortcut "Alt + Shift + F" on Window and "Option + Shift + F" on OSX Chrome will show a popup asking for microphone access, click allow to use it.
![Microphone access](/images/install-mic-access.png)



## Roadmap

- Ability to select/change voice.
- Improve sound permission, sometimes sound permission is preventing from the voice being heard.
- Improve error handling and figure out edge cases.

## Feedback
Please create issues with any feedbacks. Thanks!

## Author
[Ejaz Bawasa](https://zaje.me/) <> [LinkedIn](https://www.linkedin.com/in/ejazbawasa/)

