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
        'in': new FormGroup({
            'key': new FormControl(this.input.in.key, [Validators.required]),
            'moduleId': new FormControl(this.input.in.moduleId, [Validators.required, Validators.min(0)]),
            'deviceId': new FormControl(this.input.in.deviceId, [Validators.required]),
        }),
        'out': new FormGroup({
            'key': new FormControl(this.input.out.key, [Validators.required]),
            'moduleId': new FormControl(this.input.out.moduleId, [Validators.required, Validators.min(0)])
        }),
        'tagId': new FormControl(this.input.tagId, [Validators.required]),
        'inputId': new FormControl(this.input.inputId, [Validators.required]),
        'interface': new FormControl(this.input.interface, [Validators.required]),
        'allowance': new FormControl(this.input.allowance, [Validators.required]),
        'writeable': new FormControl(this.input.writeable, [Validators.required]),
        'description': new FormControl(this.input.description, [Validators.required])
    });
    public keys: string[] = [
        'IP',
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
        'BATT',
        'SIG',
        'digitalsIn'
    ];
    public errors: any = {
        'in': {
            'key': '',
            'moduleId': '',
            'deviceId': ''
        },
        'out': {
            'key': '',
            'moduleId': ''
        },
        'tagId': '',
        'inputId': '',
        'interface': '',
        'allowance': '',
        'writeable': '',
        'description': ''
    };
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

    ngOnInit(): void {
        this.load();
        
        this.subscriptions.form = this.form.valueChanges.subscribe(() => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
    };
}