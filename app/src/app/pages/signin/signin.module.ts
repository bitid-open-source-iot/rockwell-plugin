/* --- PAGES --- */
import { SigninPage } from './signin.page';

/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';

const routes: Route[] = [
    {
        'path': '',
        'component': SigninPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        SigninPage
    ]
})

export class SigninModule { }