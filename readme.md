# Vandelay_Conf_Rm_1527 V1.0 - JavaScript
## Background
This file documents the setup and deployment of the demo conference room "Vandelay Conference Room 1527" for the AMX MUSE Platform, in JavaScript.  Please refer to other files for Node-Red, Python, or Groovy implementations
## MUSE SETUP

### Install Extensions, Jars, and IRL Files
- Install  TCP Extension - AMX-IPComm-1.0.0.jar
- Upload IRL File - Plug-Ins > idevice
- Upload Duet Files (Vaddio and Display) - Plugins > Duet

### Configure Ports and Devices

#### IR:
- connect IRL to appropriate IR Port

#### Devices:
- Create Devices in System:
    1. precis: 
        - Instance ID = precis-wp-412
        - Driver ID = ipcomm.tcp.client.persistent
        - Name = Precis WP 412
        - Description = Demo Room Switcher
        - Host = 10.35.88.142 //IP address of Switcher
        - Port = 23
    2. Display:
        - Intance ID = dvSamsungQB75R
        - Driver ID = Samsung_QB49N_Comm_dr1_0_0
        - Name = Samsung Display
        - Description = Demo Room Display
        - IP Address = IP address of Display
    3. Vaddio:
        - Instance ID = dvCamera
        - Driver ID = Vaddio_RoboShot12_Comm_dr1_0_0
        - Name = Camera
        - Description = Demo Room Camera
        

#### Touch Panel Configuration:
 - In Touch Panel > Settings > Netlinx
 - Change Mode to Master
 - Enter in IP address of Muse Controller
 - Configuration may require Username and Password entered into the touch panel
 

#### Update Demo Code
- Line 19 - Modify the "AMX-XXXX" to match the Hostname of the touch panel connected to the Muse.  
- Line 29 - Modify the IP Address of dvDisplay to match the IP address of the controlled display.
     
### Upload to Muse
- Select the folder "ITG Lab - Javascript" in the Mojo Programming pane and right click
- Select "Upload to Mojo Controller"
- System will prompt to login to controller (Username/Password Required)
- Select the file to be transferred
- Select the Processor(s) as a destination
- NOTE - Hit Enter Twice to automatically send file to the processor