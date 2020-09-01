// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
function parseJSON(response: Response) {
    return response.json();
}

function checkStatus(response: Response) {
    if (response.status >= 200 && response.status < 500) {
        return response;
    }
    const error = new Error(response.statusText);
    throw error;
}

interface Options {
    data?: object;
    url: RequestInfo;
    body?: string;
    headers?: Record<string, string>;
    credentials?: 'include' | 'omit' | 'same-origin' | undefined;
}

export default function request(options: Options) {
    const Authorization = localStorage.getItem('Authorization') || '';
    const { data, url } = options;
    const opt = { ...options };
    delete opt.url;
    if (data) {
        delete opt.data;
        opt.body = JSON.stringify(data);
    }
    opt.headers = {
        Authorization,
        'Content-Type': 'application/json;charset=UTF-8'
    };
    opt.credentials = 'include';
    return fetch(url, opt).
        then(checkStatus).
        then(parseJSON).
        catch((err) => ({ err }));
}
