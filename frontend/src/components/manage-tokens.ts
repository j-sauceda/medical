// module for saving tokens to local storage
const TOKEN_KEY = "token";
const REF_TOKEN = "refreshToken";

// token: "xyz", refreshToken: "abc"
export function saveToken(jwt_token: string) {
    sessionStorage.setItem(TOKEN_KEY, jwt_token);
}

export function saveRefToken(jwt_token: string) {
    sessionStorage.setItem(REF_TOKEN, jwt_token);
}

export function getToken() {
    let jwt_token = sessionStorage.getItem(TOKEN_KEY);
    if (jwt_token) return jwt_token;
    else return null;
}

export function getRefToken() {
    let jwt_token = sessionStorage.getItem(REF_TOKEN);
    if (jwt_token) return jwt_token;
    else return null;
}

export function deleteToken() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REF_TOKEN);
}
