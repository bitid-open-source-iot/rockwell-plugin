import { SocketService } from './services/socket/socket.service';
import { AccountService } from './services/account/account.service';
import { OnInit, Component, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-root',
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.html'
})

export class AppComponent implements OnInit, OnDestroy {

    constructor(private socket: SocketService, private account: AccountService) { };

    public loading: boolean;
    public authenticated: boolean;
    private subscriptions: any = {};

    private async initialize() {
        this.loading = true;

        await this.socket.connect();
        await this.account.validate();
        
        this.loading = false;
    };

    ngOnInit(): void {
        this.subscriptions.authenticated = this.account.authenticated.subscribe(async authenticated => {
            this.authenticated = authenticated;
        });
        
        this.initialize();
    };

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    };
}