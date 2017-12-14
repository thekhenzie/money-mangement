export function isUserLogged() {
    const loggedUser = JSON.parse(sessionStorage.getItem("user_cred"));

    return (loggedUser == null) ? false : true;
}

export function destroyUserLogin() {
    sessionStorage.removeItem("user_cred");
}

export function retrieveLoggedUser() {

    return JSON.parse(sessionStorage.getItem("user_cred"));
}