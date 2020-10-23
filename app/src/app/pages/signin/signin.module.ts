/* --- PAGES --- */
import { SigninPage } from './signin.page';

/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatContentModule } from 'src/app/lib/mat-content/mat-content.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Route, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Route[] = [
    {
        'path': '',
        'component': SigninPage
    }
];

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        MatInputModule,
        MatButtonModule,
        MatToolbarModule,
        MatContentModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatProgressSpinnerModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        SigninPage
    ]
})

export class SigninModule { }