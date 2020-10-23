import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})

export class ConfigService {

	constructor(private api: ApiService) { };

	public async get(params) {
		return await this.api.post(environment.api, '/api/config/get', params);
	};

	public async update(params) {
		return await this.api.post(environment.api, '/api/config/update', params);
	};

}