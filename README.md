# Aria2 GUI Wrapper

A lightweight and user-friendly GUI wrapper for **Aria2** built with **Electron**. This application allows you to manage and interact with **Aria2** downloads in a graphical interface, simplifying the download process without needing to use the command line.

## Features

- **Start/Stop Aria2 downloads** directly from the GUI.
- **Monitor download progress** in real-time.
- **Queue management** for handling multiple downloads.
- Built with **Electron** for cross-platform support.

## Requirements

- **Node.js**: Required to run the application.
- **Aria2**: Make sure **Aria2** is installed on your system, as this wrapper interacts with it to manage downloads.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/aria2-gui-wrapper.git
   cd aria2-gui-wrapper
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install Aria2**:
   - **Windows**: Download Aria2 from [here](https://github.com/aria2/aria2/releases) and follow the installation instructions.


## Usage

1. **Start the application**:
   In your project directory, run:
   ```bash
   npm start
   ```

2. **Use the GUI**:
   - You can now interact with the Aria2 backend through the Electron app.
   - Add downloads by pasting the download link and managing download tasks from the GUI.

## Troubleshooting

- **Aria2 is not starting**: Ensure that the Aria2 RPC service is running and that the correct port is configured.
- **Error in starting the app**: Make sure all dependencies are installed with `npm install` and that you have no issues with your system’s environment variables.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
