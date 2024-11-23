// Define the runCommand function

const { exec, spawn } = require('child_process');
const { clipboard } = require('electron');

// Attach event listener to the button in the DOM
const button = document.getElementById('run-button');
const link = document.getElementById('link');
const max_conn = document.getElementById('max-conn');
const max_speed = document.getElementById('max-speed');
const download_list = document.getElementById('download-list');

const items = {};

function createProgressBarFromPercentage(percentage, barLength = 40) {
    const filledLength = Math.round((barLength * percentage) / 100); // Calculate the number of filled segments
    const emptyLength = barLength - filledLength; // Calculate empty segments

    // Create the bar
    const bar = `[${'█'.repeat(filledLength)}${' '.repeat(emptyLength)}]`;

    // Return progress bar with percentage
    return `${bar} ${percentage.toFixed(2)}%`;
}

function runCommand(commandArg, fileName, onCloseCallback) {

    // Execute the command
    const command = spawn('aria2c.exe', commandArg.split(' '));

    items[fileName] = {};

    // Stream stdout and log the output in real-time
    command.stdout.on('data', (data) => {
        const regex = /(\d+(\.\d+)?[KMGT]iB)\/(\d+(\.\d+)?[KMGT]iB)\((\d+)%\)\s+CN:\d+\s+DL:(\d+(\.\d+)?[KMGT]iB)\s+ETA:((\d+h?)?(\d+m?)?(\d+s?))/;

        // Matching the text
        let text_content = "";
        const matches = RegExp(regex).exec(`${data}`);


        console.log(`${data}`)
        if (matches) {
            const downloaded = matches[1];
            const file_size = matches[3];
            const percentage = matches[5];
            const dn_speed = matches[6];
            const remaining = matches[8];

            text_content += `${createProgressBarFromPercentage(parseFloat(percentage))}\n`;

            text_content += `Downloaded: ${downloaded}\n`;
            text_content += `File Size: ${file_size}\n`;
            // text_content += `Percentage: ${percentage}%\n`;
            text_content += `Download Speed: ${dn_speed}\n`;
            text_content += `Remaining Time: ${remaining}\n`;
        } else {
            text_content += 'Downloading...';
            console.log('No match found');
        }

        items[fileName]['text'] = text_content;
        items[fileName]['pid'] = command.pid;

        console.log(`PID : ${command.pid}`)
    });

    // Stream stderr (for errors)
    command.stderr.on('data', (data) => {
        items[fileName]['text'] = `STDERR: ${data}`;
    });

    // When the process ends, log the exit code
    command.on('close', (code) => {
        if (onCloseCallback) onCloseCallback(code);  // Optional callback after process ends
    });
}


button.addEventListener('click', () => {
    // Trigger the command with the output element
    const commandArgString = `-s ${max_conn.value} -x ${max_conn.value} --max-download-limit ${max_speed.value} ${link.value}`;
    console.log(`running command : ${commandArgString}`);
    const fileName = link.value.split('/').pop()
    runCommand(commandArgString, fileName, (exitCode) => {
        console.log(`Process finished with exit code: ${exitCode}`);
    });
});


function pauseDownload(fileName) {
    if (items[fileName]) {
        const pid = items[fileName]['pid'];
        try {
            exec(`taskkill /F /PID ${pid}`, (error, stdout, stderr) => {
                const lastText = items[fileName]['text'];
                if (error) {
                    items[fileName]['text'] = `Error stopping process: ${error.message}\n ${lastText}`;
                } else {
                    items[fileName]['text'] = `Download Paused\n ${lastText}`;
                }
            });
        } catch (error) {
            items[fileName]['text'] = `Error stopping process: ${error.message}\n ${lastText}`;
        }
    }

}

function deleteDownload(fileName) {
    delete items[fileName];
}


function renderList() {
    // Clear the current list
    download_list.innerHTML = "";

    // Check if the list has items
    if (items.length === 0) {
        return;
    }

    for (const [key, value] of Object.entries(items)) {
        const listItem = document.createElement("li");
        const processText = value['text'];
        listItem.innerHTML = `
            <b>${key}</b>
            <pre>${processText}</pre>
            <button id="stop-button" onclick="pauseDownload('${key}')" class="pause-button">Pause</button>
            <button id="stop-button" onclick="deleteDownload('${key}')" class="delete-button">Delete</button>
        `;
        download_list.appendChild(listItem);
    }
}

document.getElementById('paste-button').addEventListener('click', () => {
    const clipboardText = clipboard.readText();

    // Set the pasted content into the textarea
    link.value = clipboardText;
});

function periodicCheck() {
    renderList();
    setTimeout(periodicCheck, 500); // Check again after 500 ms
}

periodicCheck();