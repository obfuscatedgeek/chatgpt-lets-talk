
# ChatGPT - Let's talk

A chrome extension  that adds the ability to voice with the ChatGPT using few keyboard shortcuts.

&nbsp;
&nbsp;

### Ask questions using your microphone
To voice chat and ask questions to ChatGPT using your microphone, press the following combination of keys simultaneously

### **Windows**: `Alt + Shift + F`

### **Mac**: `Option + Shift + F`

Once pressed the keys the extension is actively listening so just ask your questions using your voice, the extension will listen and submit your question. Answer will be read out loud automatically after it has been generated.

&nbsp;
&nbsp;


### Hear ChatGPT repeat the last answer
To hear the last answer, press the following combination of keys simultaneously

### **Windows**: `Alt + Shift + J`

### **Mac**: `Option + Shift + J`


The last answer from ChatGPT will be read out loud.

&nbsp;
&nbsp;

### Stop the voice while its reading the answer.
To stop the voice while its reading the answer out loud, press the following combination of keys simultaneously

### **Windows**: `Alt + Shift + P`

### **Mac**: `Option + Shift + P`


To be pressed when the answer is being read out loud, it will stop the reading.

&nbsp;
&nbsp;


## Features
- ### Uses in-built browser APIs to hear the questions and read the answer out loud. `webkitSpeechRecognition` and `speechSynthesis` APIs namely.
- ### Written in native Javascript, does not use any external libraries or APIs other than the ones already available in the browser.
- ### Almost no UI, just press the keyboard shortcuts and you are ready to go

&nbsp;
&nbsp;

## Installation
Currently waiting for Chrome Web Store for approval, in the meantime you use the extension by
1. Clone the repo or download the zip and unzip the files

2. Go to Chrome extensions tab

![Step 1](/images/install-1.png)

3. Enable developer mode

![Step 2](/images/install-2.png)

![Step 3](/images/install-4.png)

4. Click on "Load unpacked" and point to the folder. Enjoy!

![Step 4](/images/install-5.png)


## Troubleshooting
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

