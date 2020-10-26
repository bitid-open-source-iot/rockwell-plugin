import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})

export class ConfigService {

	public status: BehaviorSubject<string> = new BehaviorSubject<string>('inactive');

	constructor(private api: ApiService) { };

	public async validate() {
		const response = await this.api.post(environment.api, '/api/config/status', {});

		if (response.ok) {
			this.status.next(response.result.status);
		} else {
			this.status.next('inactive');
		};

		return response;
	};

	public async get(params) {
		return await this.api.post(environment.api, '/api/config/get', params);
	};

	public async update(params) {
		return await this.api.post(environment.api, '/api/config/update', params);
	};

	public async barcode(params) {
		return await this.api.put(environment.api, '/api/config/barcode', params);
	};

}