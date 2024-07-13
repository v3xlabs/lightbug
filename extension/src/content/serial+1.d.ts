import {Serial} from "w3c-web-serial"

// Extend the navigator object with the serial object
declare global {
    interface Navigator {
        serial: Serial;
    }

}
