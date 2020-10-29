import { SocketService } from 'src/app/services/socket/socket.service';
import { OnInit, Component, OnDestroy } from '@angular/core';

@Component({
    selector: 'watch-page',
    styleUrls: ['./watch.page.scss'],
    templateUrl: './watch.page.html'
})

export class WatchPage implements OnInit, OnDestroy {

    constructor(private socket: SocketService) { };

    public inputs: any[] = [];
    private subscriptions: any = { };

    ngOnInit(): void {
        this.subscriptions.socket = this.socket.data.subscribe(data => {
            if (data) {
                if (Array.isArray(data.inputs)) {
                    this.inputs = data.inputs;
                };
            };
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.socket.unsubscribe();
    };

}