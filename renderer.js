// Define the runCommand function

let runningProcess = null; // To store the running process
const { exec, spawn } = require('child_process');
const { clipboard } = require('electron');

function runCommand(commandArg, outputElement, onCloseCallback) {

    // Execute the command
    const command = spawn('aria2c.exe',commandArg.split(' '));

    // Stream stdout and log the output in real-time
    command.stdout.on('data', (data) => {
        outputElement.textContent += `${data}`;

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