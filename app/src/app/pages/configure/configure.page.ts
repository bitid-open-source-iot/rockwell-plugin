import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { MatTableDataSource } from '@angular/material/table';
import { OnInit, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'configure-page',
    styleUrls: ['./configure.page.scss'],
    templateUrl: './configure.page.html'
})

export class ConfigurePage implements OnInit, OnDestroy {

    constructor(private toast: ToastService, private router: Router, private service: ConfigService, private formerror: FormErrorService) { };

    public io = new MatTableDataSource();
    public form: FormGroup = new FormGroup({
        'plc': new FormGroup({
            'ip': new FormControl(null, [Validators.required, Validators.pattern(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)]),
            'port': new FormControl(null, [Validators.required, Validators.min(0), Validators.max(65535)])
        }),
        'server': new FormGroup({
            'host': new FormControl(null, [Validators.required]),
            'port': new FormControl(null, [Validators.required, Validators.min(0), Validators.max(65535)]),
            'username': new FormControl(null, [Validators.required]),
            'password': new FormControl(null, [Validators.required]),
            'subscribe': new FormControl(null, [Validators.required])
        }),
        'production': new FormControl(null, [Validators.required]),
        'authentication': new FormControl(null, [Validators.required])
    });
    public input: any = {
        'pin': null,
        'tag': null,
        'type': null,
        'moduleId': null
    };
    public errors: any = {
        'plc': {
            'ip': '',
            'port': ''
        },
        'server': {
            'host': '',
            'port': '',
            'username': '',
            'password': '',
            'subscribe': ''
        },
        'production': '',
        'authentication': ''
    };
    public columns: string[] = ['pin', 'tagId', 'moduleId', 'type', 'as', 'options'];
    public loading: boolean;
    private subscriptions: any = {};

    public async add() {
        let valid = true;
        Object.keys(this.input).map(key => {
            if (typeof(this.input[key]) == 'undefined' || this.input[key] == null || this.input[key] == '') {
                valid = false;
            };
        });
        if (valid) {
            this.io.data.push(this.input);
            this.io.data = JSON.parse(JSON.stringify(this.io.data));
            this.input = {};
        } else {
            this.toast.error('Input invalid, Check all fields!');
        };
    };

    private async get() {
        this.loading = true;

        const response = await this.service.get({
            'filter': [
                'io',
                'plc',
                'server',
                'production',
                'authentication'
            ]
        });

        if (response.ok) {
            this.io.data = response.result.io;
            this.form.controls['production'].setValue(response.result.production);
            this.form.controls['authentication'].setValue(response.result.authentication);
            (<any>this.form.controls['plc']).controls['ip'].setValue(response.result.plc.ip);
            (<any>this.form.controls['plc']).controls['port'].setValue(response.result.plc.port);
            (<any>this.form.controls['server']).controls['port'].setValue(response.result.server.port);
            (<any>this.form.controls['server']).controls['host'].setValue(response.result.server.host);
            (<any>this.form.controls['server']).controls['username'].setValue(response.result.server.username);
            (<any>this.form.controls['server']).controls['password'].setValue(response.result.server.password);
            (<any>this.form.controls['server']).controls['subscribe'].setValue(response.result.server.subscribe);
        } else {
            this.toast.error(response.error.message);
            this.router.navigate(['/']);
        };

        this.loading = false;
    };

    public async submit() {
        if (!this.form.invalid) {
            this.loading = true;

            const response = await this.service.update({
                'io': this.io.data,
                'plc': this.form.value.plc,
                'server': this.form.value.server,
                'production': this.form.value.production,
                'authentication': this.form.value.authentication
            });

            if (response.ok) {
                setTimeout(() => {
                    this.toast.success('Config was updated!');
                    this.router.navigate(['/']);
                    this.loading = false;
                }, 2000);
            } else {
                this.toast.error(response.error.message);
                this.router.navigate(['/']);
                this.loading = false;
            };
        };
    };

    public async remove(input) {
        this.io.data = this.io.data.filter(io => (JSON.stringify(io) != JSON.stringify(input)))
    };

    ngOnInit(): void {
        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });

        this.get();
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
    };

}