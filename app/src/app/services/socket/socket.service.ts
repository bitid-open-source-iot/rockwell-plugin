import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class SocketService {

	public data: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	public status: BehaviorSubject<string> = new BehaviorSubject<string>('closed');

	constructor() { };

	public async connect() {
		const url = ['ws://', window.location.hostname, ':', environment.port].join('');

		this.status.next('connecting');

		const socket = new WebSocket(url);

		socket.onopen = (event) => {
			this.status.next('connected');
		};
		socket.onclose = (event) => {
			this.status.next('reconnecting in a few seconds');

			setTimeout(() => {
				this.connect();
			}, 5000);
		};
		socket.onerror = (event) => {
			this.status.next('connection error');
		};
		socket.onmessage = (event) => {
			this.data.next(JSON.parse(event.data));
		};
	};

}