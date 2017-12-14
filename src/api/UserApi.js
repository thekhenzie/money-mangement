class UserApi {
    static registerUser(userInput) {
        return new Promise((resolve, reject) => {
            fetch('http://artlertestingapi.azurewebsites.net/api/Users/Register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: userInput.firstName,
                    lastName: userInput.lastName,
                    email: userInput.email,
                    password: userInput.password
                })
            })
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                return response.json().then(function (error) {
                    reject(error);
                })
            })
            .then((responseJson) => {            
                resolve(responseJson);
                console.log(responseJson);
            })
            .catch((error) => {
                reject(error);
                console.error(error);
            });
    }
    static authenticateUser(userInput) {
        return new Promise((resolve, reject) => {
            fetch('http://localhost:58903/api/account/login', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: userInput.email,
                    password: userInput.password,
                })
            }).then(function (response) {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            }).then((responseJson) => {
                resolve(responseJson);

            }).catch(error => {
                reject('Invalid Username and Password');
                throw error;
            });
        });
    }
    static getUserById(id) {
        return new Promise((resolve, reject) => {
            fetch(`http://localhost:58903/api/account/view?id=${id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            }).then(function (response) {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            }).then((responseJson) => {
                resolve(responseJson);

            }).catch(error => {
                //reject('Invalid Username and Password');
                throw error;
            });
        });
    }
}
export default UserApi;