import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { environment } from 'src/environments/environment';

@Injectable({
	providedIn: 'root'
})

export class DevicesService {

	constructor(private api: ApiService) { };

	public async get(params) {
		return await this.api.post(environment.telemetry, '/telemetry/devices/get', params);
	};

}