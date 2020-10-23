/* --- PAGES --- */

/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        'path': '',
        'loadChildren': () => import('./pages/home/home.module').then(m => m.HomeModule)
    },
    {
        'path': 'signin',
        'loadChildren': () => import('./pages/signin/signin.module').then(m => m.SigninModule)
    },
    {
        'path': 'configure',
        'loadChildren': () => import('./pages/configure/configure.module').then(m => m.ConfigureModule)
    },
    {
        'path': '**',
        'redirectTo': ''
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }