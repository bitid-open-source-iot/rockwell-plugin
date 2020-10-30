import { SocketService } from 'src/app/services/socket/socket.service';
import { AccountService } from 'src/app/services/account/account.service';
import { OnInit, Component, OnDestroy } from '@angular/core';

@Component({
    selector: 'home-page',
    styleUrls: ['./home.page.scss'],
    templateUrl: './home.page.html'
})

export class HomePage implements OnInit, OnDestroy {

    constructor(public socket: SocketService, private account: AccountService) { };

    public status: string;
    public barcode: string;
    public loading: boolean;
    public authenticated: boolean;
    private subscriptions: any = { };

    public async logout() {
        this.account.logout();
    };

    ngOnInit(): void {
        this.loading = true;

        this.subscriptions.socket = this.socket.data.subscribe(data => {
            if (data) {
                this.loading = false;

                if (typeof(data.status) != 'undefined' && data.status !== null && data.status != '') {
                    this.status = JSON.stringify(data.status);
                };

                if (typeof(data.barcode) != 'undefined' && data.barcode !== null && data.barcode != '') {
                    this.barcode = JSON.stringify(data.barcode);
                };
            };
        });

        this.subscriptions.authenticated = this.account.authenticated.subscribe(authenticated => {
            this.authenticated = authenticated;
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.socket.unsubscribe();
        this.subscriptions.authenticated.unsubscribe();
    };

}