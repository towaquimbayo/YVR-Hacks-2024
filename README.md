## Baaj

Baaj is a powerful computer vision AI software designed specifically for embedded devices. It provides advanced capabilities for monitoring airport maintenance, noting spills, tracking passenger volumes, and more. Leveraging computer vision technology and utilizing ceiling-mounted cameras, Baaj offers comprehensive surveillance and analytics solutions for airports.

## Features

- **Airport Maintenance Monitoring**: Baaj can detect and monitor maintenance issues within the airport premises, ensuring timely intervention and upkeep.

- **Spill Detection**: With its advanced image recognition algorithms, Baaj can identify spills or hazards on the airport floors, enhancing safety protocols.

- **Passenger Volume Tracking**: Baaj is equipped to track passenger volumes throughout the airport, providing valuable insights for operational management and resource allocation.

- **Ceiling-mounted Camera Integration**: Designed to work seamlessly with ceiling-mounted cameras, Baaj offers optimal coverage and perspective for surveillance and analysis.

## Installation

To install Baaj backend, follow these steps:

1. Clone the Baaj repository to your local machine:

    ```bash
    git clone https://github.com/BaajTeam/Baaj.git
    ```

2. Inside the backend folder install the required dependencies:

    ```bash
    pip install -r requirements.txt
    ```

2. Inside the frontend folder:

    ```bash
    npm install
    npm start
    ```

3. update url's and rtsp stream links to point to relevant locations, backend input stream can also use webcam (replace url with int `0`)

## Usage

Once Baaj is installed and configured, you can use it to monitor airport maintenance, detect spills, and track passenger volumes. 
# Please note that the final version requires an coral edge tpu to run and what is provided here is an equivalent that can be run on most computers, however, it may not be as performant.


