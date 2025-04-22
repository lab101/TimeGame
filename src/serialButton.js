const { SerialPort } = require('serialport');
var events = require('events');
var EventEmitter = require('events').EventEmitter;


class SerialButton extends EventEmitter {
    static instance = null;
    serialPort = null;

    lastSerialDataTime = 0
    serialButtonPressed = false

    // add an event emitter to the class


    constructor() {
        super();
        if (SerialButton.instance) {
            return SerialButton.instance;
        }
        SerialButton.instance = this;
        //this.startMonitoring();

        // add an event emitter to the class
        // this.eventEmitter.on('buttonDown', () => {
        //     console.log('Button down event emitted');
        //     // Handle the button down event here
        // });
        // this.eventEmitter.on('buttonUp', () => {
        //     console.log('Button up event emitted');
        //     // Handle the button up event here
        // });
       
    }

    static async discoverArduino() {
        try {
            const ports = await SerialPort.list();
            const arduinoPorts = ports.filter(port => {
                // Common Arduino manufacturers
                return port.manufacturer?.includes('Arduino') ||
                       port.manufacturer?.includes('wch.cn') ||
                       port.vendorId?.toLowerCase() === '2341'; // Arduino vendor ID
            });

            if (arduinoPorts.length === 0) {
                console.log('No Arduino devices found');
                return null;
            }

            console.log('Arduino devices found:', arduinoPorts);
            return arduinoPorts[0].path; // Returns the first Arduino device found
        } catch (error) {
            console.error('Error discovering Arduino devices:', error);
            return null;
        }
    }

    async connect(baudRate = 9600) {
        try {
            const port = await SerialButton.discoverArduino();
            if (!port) {
                throw new Error('No Arduino device found');
            }

            this.serialPort = new SerialPort({
                path: port,
                baudRate: baudRate
            });

            this.serialPort.on('error', (err) => {
                console.error('Serial port error:', err);
            });

            this.serialPort.on('data', (data) => {
                this.handleData(data);
               
            });

            console.log('Serial connection established on port:', port);
        } catch (error) {
            console.error('Failed to connect to serial port:', error);
        }
    }

    handleData(data) {
        this.lastSerialDataTime = Date.now();
        if (!this.serialButtonPressed) {
            this.serialButtonPressed = true;
            console.log('Serial button down');

            // Emit the buttonDown event
            this.emit('buttonDown',true);

            // trigger the buttonDown event

        }
    }
    checkButtonState() {
        if (this.serialButtonPressed && Date.now() - this.lastSerialDataTime > 10) {
            this.serialButtonPressed = false;
            console.log('Serial button up');
            this.emit('buttonUp');

        }
    }

    startMonitoring() {
        setInterval(() => {
            this.checkButtonState();
        }, 10);
    }


    // ... rest of the class remains the same ...
}

module.exports = SerialButton;
