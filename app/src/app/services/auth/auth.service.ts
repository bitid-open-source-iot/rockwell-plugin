import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router, CanActivate } from '@angular/router';
import { LocalstorageService } from '../localstorage/localstorage.service';

@Injectable({
    providedIn: 'root'
})

export class AuthService implements CanActivate {

    constructor(private router: Router, private localstorage: LocalstorageService) { };

    canActivate() {
        let now = new Date();
        let valid = true;
        let email = this.localstorage.get('email');
        let token = this.localstorage.getObject('token');

        if (!email || !token) {
            valid = false;
        } else {
            let scopes = token.scopes.map(o => o.url);

            environment.scopes.map(scope => {
                if (!scopes.includes(scope.url)) {
                    valid = false;
                };
            });

            if (typeof (email) == 'undefined') {
                valid = false;
            };

            if (typeof (token.expiry) != 'undefined') {
                let expiry = new Date(token.expiry);
                if (expiry < now) {
                    valid = false;
                };
            } else {
                valid = false;
            };
        };

        if (valid) {
            return true;
        } else {
            return this.router.navigate(['/signin']);
        };
    };
}
