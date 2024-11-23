// Define the runCommand function
function runCommand(commandStr, outputElement, onCloseCallback) {
    const { exec } = require('child_process');

    // Execute the command
    const command = exec(commandStr);

    // Stream stdout and log the output in real-time
    command.stdout.on('data', (data) => {
        outputElement.textContent += `${data}`;
    });

    // Stream stderr (for errors)
    command.stderr.on('data', (data) => {
        outputElement.textContent += `STDERR: ${data}`;
    });

    // When the process ends, log the exit code
    command.on('close', (code) => {
        outputElement.textContent += `Child process exited with code ${code}`;
        if (onCloseCallback) onCloseCallback(code);  // Optional callback after process ends
    });
}

// Attach event listener to the button in the DOM
const button = document.getElementById('run-button');
const output = document.getElementById('output');
const link = document.getElementById('link');
const max_conn = document.getElementById('max-conn');
const max_speed = document.getElementById('max-speed');

button.addEventListener('click', () => {
    // Trigger the command with the output element
    const commandString = `aria2c.exe -s ${max_conn.value} -x ${max_conn.value} --max-download-limit ${max_speed.value} ${link.value}`;
    console.log(`running command : ${commandString}`);
    runCommand(commandString, output, (exitCode) => {
        console.log(`Process finished with exit code: ${exitCode}`);
    });
});