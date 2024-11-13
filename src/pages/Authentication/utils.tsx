
const KEY_BEARER_TOKEN = "bearer_token";
const KEY_REFRESH_TOKEN = "refresh_token";

export function AndroidClientExists() {
    return typeof AndroidClient !== 'undefined';
}

export function storeTokens(data: any) {
    console.log(300, data.bearer_token);

    localStorage.setItem(KEY_BEARER_TOKEN, data.bearer_token);
    localStorage.setItem(KEY_REFRESH_TOKEN, data.refresh_token);


    if (AndroidClientExists()) {
        AndroidClient.setLocalStorageItem(KEY_BEARER_TOKEN, data.bearer_token);
        AndroidClient.setLocalStorageItem(KEY_REFRESH_TOKEN, data.refresh_token);
    }
}

export function sendEnvToAndroidClient() {
    if (AndroidClientExists()) {
        Object.entries(import.meta.env).map(([key, value]) => {
            AndroidClient.setLocalStorageItem(key, value);
        })
    }
}