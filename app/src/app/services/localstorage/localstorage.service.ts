import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})

export class LocalstorageService {

    constructor() { };

    public set(key, value) {
        window.localStorage.setItem(key, value);
    };

    public get(key) {
        return window.localStorage.getItem(key);
    };

    public setObject(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value || {}));
    };

    public getObject(key, value?: any) {
        if (typeof (value) != 'undefined' && value !== null) {
            value = JSON.stringify(value);
        } else {
            value = '{}';
        };
        return JSON.parse(window.localStorage.getItem(key) || value);
    };

    public clear() {
        window.localStorage.clear();
    };

    public remove(key) {
        window.localStorage.removeItem(key);
    };

}