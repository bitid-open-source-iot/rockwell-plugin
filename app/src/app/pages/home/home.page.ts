import { AccountService } from 'src/app/services/account/account.service';
import { OnInit, Component, OnDestroy } from '@angular/core';

@Component({
    selector: 'home-page',
    styleUrls: ['./home.page.scss'],
    templateUrl: './home.page.html'
})

export class HomePage implements OnInit, OnDestroy {

    constructor(private account: AccountService) { };

    public status: string = 'inactive';
    public barcode: string = '00000000';
    public loading: boolean;
    public authenticated: boolean;
    private subscriptions: any = { };

    public async logout() {
        this.account.logout();
    };

    ngOnInit(): void {
        this.subscriptions.authenticated = this.account.authenticated.subscribe(authenticated => {
            this.authenticated = authenticated;
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.authenticated.unsubscribe();
    };

}