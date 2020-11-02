import { Input } from 'src/app/interfaces/input';
import { Router } from '@angular/router';
import { ObjectId } from 'src/id';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'src/app/services/toast/toast.service';
import { ConfigService } from 'src/app/services/config/config.service';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { InputEditorDialog } from './editor/editor.dialog';
import { MatTableDataSource } from '@angular/material/table';
import { OnInit, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'configure-page',
    styleUrls: ['./configure.page.scss'],
    templateUrl: './configure.page.html'
})

export class ConfigurePage implements OnInit, OnDestroy {

    constructor(private toast: ToastService, private dialog: MatDialog, private router: Router, public devices: DevicesService, private service: ConfigService, private formerror: FormErrorService) { };

    public io = new MatTableDataSource<Input>();
    public form: FormGroup = new FormGroup({
        'plc': new FormGroup({
            'ip': new FormControl(null, [Validators.required, Validators.pattern(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)]),
            'slot': new FormControl(null, [Validators.required, Validators.min(0), Validators.max(65535)])
        }),
        'server': new FormGroup({
            'subscribe': new FormGroup({
                'data': new FormControl(null, [Validators.required]),
                'control': new FormControl(null, [Validators.required])
            }),
            'host': new FormControl(null, [Validators.required]),
            'port': new FormControl(null, [Validators.required, Validators.min(0), Validators.max(65535)]),
            'username': new FormControl(null, [Validators.required]),
            'password': new FormControl(null, [Validators.required])
        }),
        'txtime': new FormControl(null, [Validators.required, Validators.min(60)]),
        'production': new FormControl(null, [Validators.required]),
        'authentication': new FormControl(null, [Validators.required])
    });
    public errors: any = {
        'plc': {
            'ip': '',
            'slot': ''
        },
        'server': {
            'subscribe': {
                'data': '',
                'control': ''
            },
            'host': '',
            'port': '',
            'username': '',
            'password': ''
        },
        'txtime': '',
        'production': '',
        'authentication': ''
    };
    public timeout = new MatTableDataSource<any>();
    public columns: string[] = ['tagId', 'description', 'copy', 'edit', 'delete'];
    public loading: boolean;
    public addtimeout: any = {
        'inputId': null,
        'timeout': null,
        'deviceId': null
    };
    private subscriptions: any = {};
    public timeoutcolumns: string[] = ['deviceId', 'inputId', 'timeout', 'options'];

    public async add() {
        let valid = true;
        Object.keys(this.addtimeout).map(key => {
            if (typeof(this.addtimeout[key]) == 'undefined' || this.addtimeout[key] == null || this.addtimeout[key] == '') {
                valid = false;
            };
        });
        if (valid) {
            const timeout = JSON.parse(JSON.stringify(this.addtimeout));
            this.timeout.data.push(timeout);
            this.timeout.data = JSON.parse(JSON.stringify(this.timeout.data));
            this.addtimeout = {
                'inputId': null,
                'timeout': null,
                'deviceId': null
            };
        } else {
            this.toast.error('comms device invalid!');
        };
    };

    private async get() {
        this.loading = true;

        const devices = await this.devices.list({
            'filter': [
                'deviceId',
                'description'
            ]
        });

        if (devices.ok) {
            this.devices.data = devices.result;
        };

        const response = await this.service.get({
            'filter': [
                'io',
                'plc',
                'server',
                'txtime',
                'timeout',
                'production',
                'authentication'
            ]
        });

        if (response.ok) {
            this.io.data = response.result.io;
            this.timeout.data = response.result.timeout;
            this.form.controls['txtime'].setValue(response.result.txtime);
            this.form.controls['production'].setValue(response.result.production);
            this.form.controls['authentication'].setValue(response.result.authentication);
            (<any>this.form.controls['plc']).controls['ip'].setValue(response.result.plc.ip);
            (<any>this.form.controls['plc']).controls['slot'].setValue(response.result.plc.slot);
            (<any>this.form.controls['server']).controls['port'].setValue(response.result.server.port);
            (<any>this.form.controls['server']).controls['host'].setValue(response.result.server.host);
            (<any>this.form.controls['server']).controls['username'].setValue(response.result.server.username);
            (<any>this.form.controls['server']).controls['password'].setValue(response.result.server.password);
            (<any>(<any>this.form.controls['server']).controls['subscribe']).controls['data'].setValue(response.result.server.subscribe.data);
            (<any>(<any>this.form.controls['server']).controls['subscribe']).controls['control'].setValue(response.result.server.subscribe.control);
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
                'txtime': this.form.value.txtime,
                'server': this.form.value.server,
                'timeout': this.timeout.data,
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

    public async remove(key: string, input: any, idkey: string) {
        this[key].data = this[key].data.filter(o => o[idkey] != input[idkey]);
    };

    public async edit(mode: string, input?: Input) {
        if (mode == 'add') {
            input = {
                'analog': {
                    'scaling': {
                        'raw': {
                            'low': 0,
                            'high': 0
                        },
                        'scaled': {
                            'low': 0,
                            'high': 0
                        },
                        'type': 'none'
                    },
                    'key': '',
                    'units': '',
                    'offset': 0,
                    'decimals': 0
                },
                'digital': {
                    'bit': 0,
                    'low': null,
                    'high': null
                },
                'type': 'analog',
                'tagId': null,
                'hidden': false,
                'inputId': ObjectId(),
                'deviceId': null,
                'priority': false,
                'moduleId': 0,
                'interface': 'INT',
                'allowance': 0,
                'writeable': true,
                'description': null
            };
        } else if (mode == 'copy') {
            input = JSON.parse(JSON.stringify(input));
            input.inputId = ObjectId();
        };

        const dialog = await this.dialog.open(InputEditorDialog, {
            'data': input,
            'panelClass': 'input-editor'
        });

        dialog.afterClosed().subscribe(async result => {
            if (result) {
                switch (mode) {
                    case ('add'):
                        this.io.data.push(result);
                        break;
                    case ('copy'):
                        this.io.data.push(result);
                        break;
                    case ('edit'):
                        for (let i = 0; i < this.io.data.length; i++) {
                            if (this.io.data[i].inputId == result.inputId) {
                                this.io.data[i].type = result.type;
                                this.io.data[i].tagId = result.tagId;
                                this.io.data[i].hidden = result.hidden;
                                this.io.data[i].analog = result.analog;
                                this.io.data[i].digital = result.digital;
                                this.io.data[i].deviceId = result.deviceId;
                                this.io.data[i].priority = result.priority;
                                this.io.data[i].moduleId = result.moduleId;
                                this.io.data[i].interface = result.interface;
                                this.io.data[i].allowance = result.allowance;
                                this.io.data[i].writeable = result.writeable;
                                this.io.data[i].description = result.description;
                                break;
                            };
                        };
                        break;
                };
                this.io.data = JSON.parse(JSON.stringify(this.io.data));
            };
        });
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