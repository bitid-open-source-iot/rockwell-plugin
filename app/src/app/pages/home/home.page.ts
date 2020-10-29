import { ToastService } from 'src/app/services/toast/toast.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { AccountService } from 'src/app/services/account/account.service';
import { OnInit, Component, OnDestroy } from '@angular/core';
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({
    selector: 'home-page',
    styleUrls: ['./home.page.scss'],
    templateUrl: './home.page.html'
})

export class HomePage implements OnInit, OnDestroy {

    constructor(private toast: ToastService, private config: ConfigService, public socket: SocketService, private account: AccountService) { };

    public status: string = this.config.status.value;
    public barcode: string;
    public loading: boolean;
    public authenticated: boolean;
    private subscriptions: any = { };

    private async load() {
        this.loading = true;

        const response = await this.config.barcode({});

        if (response.ok) {
            this.barcode = response.result.barcode;
        } else {
            this.toast.error(response.error.message);
        };

        this.loading = false;
    };

    public async logout() {
        this.account.logout();
    };

    ngOnInit(): void {
        this.subscriptions.socket = this.socket.data.subscribe(data => {
            if (data) {
                if (typeof(data.barcode) != 'undefined' && data.barcode !== null && data.barcode != '') {
                    debugger
                };
            };
        });

        this.subscriptions.status = this.config.status.subscribe(status => {
            this.status = status;
        });

        this.subscriptions.authenticated = this.account.authenticated.subscribe(authenticated => {
            this.authenticated = authenticated;
        });

        this.load();
    };

    ngOnDestroy(): void {
        this.subscriptions.socket.unsubscribe();
        this.subscriptions.status.unsubscribe();
        this.subscriptions.authenticated.unsubscribe();
    };

}