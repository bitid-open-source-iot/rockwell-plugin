import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast/toast.service';
import { AccountService } from 'src/app/services/account/account.service';
import { FormErrorService } from 'src/app/services/form-error/form-error.service';
import { OnInit, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'signin-page',
    styleUrls: ['./signin.page.scss'],
    templateUrl: './signin.page.html'
})

export class SigninPage implements OnInit, OnDestroy {

    constructor(private toast: ToastService, private router: Router, private service: AccountService, private formerror: FormErrorService) { };

    public form: FormGroup = new FormGroup({
        'email': new FormControl(null, [Validators.required]),
        'password': new FormControl(null, [Validators.required])
    });
    public errors: any = {
        'email': '',
        'password': ''
    };
    public loading: boolean;
    private subscriptions: any = {};

    public async submit() {
        if (!this.form.invalid) {
            this.loading = true;

            const response = await this.service.login(this.form.value);

            if (response.ok) {
                this.toast.success('Sign in successful!');
                this.router.navigate(['/']);
            } else {
                this.toast.error(response.error.message);
                this.router.navigate(['/']);
            };

            this.loading = false;
        };
    };

    ngOnInit(): void {
        this.subscriptions.form = this.form.valueChanges.subscribe(data => {
            this.errors = this.formerror.validateForm(this.form, this.errors, true);
        });
    };

    ngOnDestroy(): void {
        this.subscriptions.form.unsubscribe();
    };

}