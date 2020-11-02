import { Input } from 'src/app/interfaces/input';
import { DevicesService } from 'src/app/services/devices/devices.service';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { OnInit, Inject, Component, OnDestroy, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'input-editor',
    styleUrls: ['./editor.dialog.scss'],
    templateUrl: './editor.dialog.html',
    encapsulation: ViewEncapsulation.None
})

export class InputEditorDialog implements OnInit, OnDestroy {

    constructor(private dialog: MatDialogRef<InputEditorDialog>, @Inject(MAT_DIALOG_DATA) private input: Input, public devices: DevicesService, private formerror: FormErrorService) { };

    public form: FormGroup = new FormGroup({
        'analog': new FormGroup({
            'scaling': new FormGroup({
                'raw': new FormGroup({
                    'low': new FormControl(this.input.analog.scaling.raw.low),
                    'high': new FormControl(this.input.analog.scaling.raw.high)
                }),
                'scaled': new FormGroup({
                    'low': new FormControl(this.input.analog.scaling.scaled.low),
                    'high': new FormControl(this.input.analog.scaling.scaled.high)
                }),
                'type': new FormControl(this.input.analog.scaling.type),
            }),
            'key': new FormControl(this.input.analog.key),
            'units': new FormControl(this.input.analog.units),
            'offset': new FormControl(this.input.analog.offset),
            'decimals': new FormControl(this.input.analog.decimals)
        }),
        'digital': new FormGroup({
            'bit': new FormControl(this.input.digital.bit),
            'low': new FormControl(this.input.digital.low),
            'high': new FormControl(this.input.digital.high)
        }),
        'type': new FormControl(this.input.type, [Validators.required]),
        'tagId': new FormControl(this.input.tagId, [Validators.required]),
        'hidden': new FormControl(this.input.hidden, [Validators.required]),
        'inputId': new FormControl(this.input.inputId, [Validators.required]),
        'deviceId': new FormControl(this.input.deviceId, [Validators.required]),
        'priority': new FormControl(this.input.priority, [Validators.required]),
        'moduleId': new FormControl(this.input.moduleId, [Validators.required]),
        'interface': new FormControl(this.input.interface, [Validators.required]),
        'allowance': new FormControl(this.input.allowance, [Validators.required]),
        'writeable': new FormControl(this.input.writeable, [Validators.required]),
        'description': new FormControl(this.input.description, [Validators.required])
    });
    public show: any = {
        'low': false,
        'high': false
    };
    public errors: any = {
        'analog': {
            'scaling': {
                'raw': {
                    'low': '',
                    'high': ''
                },
                'scaled': {
                    'low': '',
                    'high': ''
                },
                'type': '',
            },
            'key': '',
            'units': '',
            'offset': '',
            'decimals': ''
        },
        'digital': {
            'bit': '',
            'low': '',
            'high': ''
        },
        'type': '',
        'tagId': '',
        'hidden': '',
        'inputId': '',
        'priority': '',
        'moduleId': '',
        'deviceId': '',
        'interface': '',
        'allowance': '',
        'writeable': '',
        'description': ''
    };
    public analogs: string[] = [
        'AI1',
        'AI2',
        'AI3',
        'AI4',
        'AIExt1',
        'AIExt2',
        'AIExt3',
        'AIExt4',
        'AIExt5',
        'AIExt6',
        'AIExt7',
        'AIExt8',
        'CI1',
        'CI2',
        'CI3',
        'CI4',
        'CI5',
        'CI6',
        'CI7',
        'CI8',
        'CI1Offset',
        'CI2Offset',
        'CI3Offset',
        'CI4Offset',
        'CI5Offset',
        'CI6Offset',
        'CI7Offset',
        'CI8Offset',
        'BATT',
        'SIG'
    ];
    public loading: boolean;
    public subscriptions: any = {};

    private async load() {
        this.loading = true;

        const response = await this.devices.list({
            'filter': [
                'deviceId',
                'description'
            ],
            'sort': {
                'description': 1
            }
        });

        if (response.ok) {
            this.devices.data = response.result;
        };
        
        this.loading = false;
    };

    public async close() {
        this.dialog.close(false);
    };

    public async submit() {
        if (!this.form.invalid) {
            this.dialog.close(this.form.value);
        } else {
            this.form.markAllAsTouched();
        };
    };

    private async ToggleType(type) {
        if (type == 'analog') {
            /* SET ANALOG */
            const analog: any = this.form.controls['analog'];
            analog.controls['key'].setValidators([Validators.required]);
            analog.controls['key'].updateValueAndValidity();
            analog.controls['decimals'].setValidators([Validators.required]);
            analog.controls['decimals'].updateValueAndValidity();

            const scaling: any = analog.controls['scaling'];
            scaling.controls['type'].setValidators([Validators.required]);
            scaling.controls['type'].updateValueAndValidity();

            const raw: any = scaling.controls['raw'];
            raw.controls['low'].setValidators([Validators.required]);
            raw.controls['low'].updateValueAndValidity();
            raw.controls['high'].setValidators([Validators.required]);
            raw.controls['high'].updateValueAndValidity();

            const scaled: any = scaling.controls['scaled'];
            scaled.controls['low'].setValidators([Validators.required]);
            scaled.controls['low'].updateValueAndValidity();
            scaled.controls['high'].setValidators([Validators.required]);
            scaled.controls['high'].updateValueAndValidity();

            /* UNSET DIGITAL */
            const digital: any = this.form.controls['digital'];
            digital.controls['bit'].setValidators(null);
            digital.controls['bit'].updateValueAndValidity();
            digital.controls['low'].setValidators(null);
            digital.controls['low'].updateValueAndValidity();
            digital.controls['high'].setValidators(null);
            digital.controls['high'].updateValueAndValidity();
        } else if (type == 'digital') {
            /* UNSET ANALOG */
            const analog: any = this.form.controls['analog'];
            analog.controls['key'].setValidators(null);
            analog.controls['key'].updateValueAndValidity();
            analog.controls['decimals'].setValidators(null);
            analog.controls['decimals'].updateValueAndValidity();

            const scaling: any = analog.controls['scaling'];
            scaling.controls['type'].setValidators(null);
            scaling.controls['type'].updateValueAndValidity();

            const raw: any = scaling.controls['raw'];
            raw.controls['low'].setValidators(null);
            raw.controls['low'].updateValueAndValidity();
            raw.controls['high'].setValidators(null);
            raw.controls['high'].updateValueAndValidity();

            const scaled: any = scaling.controls['scaled'];
            scaled.controls['low'].setValidators(null);
            scaled.controls['low'].updateValueAndValidity();
            scaled.controls['high'].setValidators(null);
            scaled.controls['high'].updateValueAndValidity();

            /* SET DIGITAL */
            const digital: any = this.form.controls['digital'];
            digital.controls['bit'].setValidators([Validators.required, Validators.min(0), Validators.max(65535)]);
            digital.controls['bit'].updateValueAndValidity();
            digital.controls['low'].setValidators([Validators.required]);
            digital.controls['low'].updateValueAndValidity();
            digital.controls['high'].setValidators([Validators.required]);
            digital.controls['high'].updateValueAndValidity();
        };
    };

    ngOnInit(): void {
        this.load();
        
        this.ToggleType(this.input.type);

        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });

        this.subscriptions.type = this.form.controls['type'].valueChanges.subscribe(async type => {
            await this.ToggleType(type);
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
        this.subscriptions.type.unsubscribe();
    };
}