// Define the runCommand function

let runningProcess = null; // To store the running process
const { exec, spawn } = require('child_process');
const { clipboard } = require('electron');

function runCommand(commandArg, outputElement, onCloseCallback) {

    // Execute the command
    const command = spawn('aria2c.exe', commandArg.split(' '));

    // Stream stdout and log the output in real-time
    command.stdout.on('data', (data) => {
        

        const regex = /(\d+(\.\d+)?[KMGT]iB)\/(\d+(\.\d+)?[KMGT]iB)\((\d+)%\)\s+CN:\d+\s+DL:(\d+[KMGT]iB)\s+ETA:(\d+h?)?(\d+m?)?(\d+s?)/;

        // Matching the text
        let text_content = `${data}\n`;
        const matches = text_content.match(regex);

        

        if (matches) {
            const downloaded = matches[1]; // 158MiB
            const file_size = matches[3]; // 1.0GiB
            const percentage = matches[5]; // 15%
            const dn_speed = matches[6]; // 86KiB
            const remaining = matches[7]; // 2h51m37s

            text_content += `Downloaded: ${downloaded}\n`;
            text_content += `File Size: ${file_size}\n`;
            text_content += `Percentage: ${percentage}%\n`;
            text_content += `Download Speed: ${dn_speed}\n`;
            text_content += `Remaining Time: ${remaining}\n`;

            outputElement.textContent = text_content;
        } else {
            console.log(`${data}`)
            console.log('No match found');
        }

        console.log(`PID : ${command.pid}`)
    });

    // Stream stderr (for errors)
    command.stderr.on('data', (data) => {
        outputElement.textContent += `STDERR: ${data}`;
        stopButton.disabled = true;
    });

    // When the process ends, log the exit code
    command.on('close', (code) => {
        if (onCloseCallback) onCloseCallback(code);  // Optional callback after process ends
        runningProcess = null; // Reset running process when done
    });

    stopButton.disabled = false; // Enable stop button when a process is running

    return command;
}

// Attach event listener to the button in the DOM
const button = document.getElementById('run-button');
const stopButton = document.getElementById('stop-button');
const output = document.getElementById('output');
const link = document.getElementById('link');
const max_conn = document.getElementById('max-conn');
const max_speed = document.getElementById('max-speed');

button.addEventListener('click', () => {
    // Trigger the command with the output element
    const commandArgString = `-s ${max_conn.value} -x ${max_conn.value} --max-download-limit ${max_speed.value} ${link.value}`;
    console.log(`running command : ${commandArgString}`);
    runningProcess = runCommand(commandArgString, output, (exitCode) => {
        console.log(`Process finished with exit code: ${exitCode}`);
    });
});

// Stop Command
stopButton.addEventListener('click', () => {
    if (runningProcess) {
        const pid = runningProcess.pid;
        try {
            exec(`taskkill /F /PID ${pid}`, (error, stdout, stderr) => {
                if (error) {
                    output.textContent += `\n Error stopping process: ${error.message}\n`;
                } else {
                    output.textContent += `\n Download Stopped\n`;
                }
            });
        } catch (error) {
            output.textContent += `\n Error stopping process: ${error.message}\n`;
        }
        stopButton.disabled = true;
        runningProcess = null;
    }

});

document.getElementById('paste-button').addEventListener('click', () => {
    const clipboardText = clipboard.readText();

    // Set the pasted content into the textarea
    link.value = clipboardText;
});