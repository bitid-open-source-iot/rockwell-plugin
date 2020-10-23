import { ToastService } from 'src/app/services/toast/toast.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { AccountService } from 'src/app/services/account/account.service';
import { OnInit, Component, OnDestroy } from '@angular/core';

@Component({
    selector: 'home-page',
    styleUrls: ['./home.page.scss'],
    templateUrl: './home.page.html'
})

export class HomePage implements OnInit, OnDestroy {

    constructor(private toast: ToastService, private config: ConfigService, private account: AccountService) { };

    public status: string = 'inactive';
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
        this.subscriptions.authenticated = this.account.authenticated.subscribe(authenticated => {
            this.authenticated = authenticated;
        });

        this.load();
    };

    ngOnDestroy(): void {
        this.subscriptions.authenticated.unsubscribe();
    };

}