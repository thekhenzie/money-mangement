export function toastr(message, level, ref) {
    ref.addNotification({
        message: message,
        level: level,
        position: 'tr'
    });
}