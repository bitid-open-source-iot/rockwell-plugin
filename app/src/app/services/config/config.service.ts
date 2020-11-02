import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})

export class ConfigService {

	constructor(private api: ApiService) {};

	public async get(params) {
		const url = ['http://', window.location.hostname, ':', environment.port].join('');
		return await this.api.post(url, '/api/config/get', params);
	};

	public async update(params) {
		const url = ['http://', window.location.hostname, ':', environment.port].join('')
		return await this.api.post(url, '/api/config/update', params);
	};

}