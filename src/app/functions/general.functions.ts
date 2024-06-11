import Swal from "sweetalert2"; 
export function convertToBoolean(input: string): boolean {
    try {
        return JSON.parse(input.toLowerCase());
    }
    catch (e) {
        return false;
    }
}


export function alert_success(title: string, text: string) {
    Swal.fire({
        icon: 'success',
        title: title,
        text: text,
        position: 'top-end',
        showConfirmButton: false,
        //   timer: timer == null || timer == undefined ? 1500 : timer
    });
}


export function alert_warning(title: string, text: string) {
    Swal.fire({
        //position: 'top-end',
        icon: 'warning',
        title: title,
        text: text,
        showConfirmButton: false,
        //   timer: timer == null || timer == undefined ? 3000 : timer
    });
}

export function alert_error(title: string, text: string) {
    Swal.fire({
        icon: 'error',
        title: title,
        text: text,
        showConfirmButton: false,
        //   timer: 3000
    });
}
