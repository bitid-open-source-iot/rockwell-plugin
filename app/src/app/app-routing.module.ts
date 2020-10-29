/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* --- SERVICES --- */
import { AuthService } from './services/auth/auth.service';

const routes: Routes = [
    {
        'path': '',
        'loadChildren': () => import('./pages/home/home.module').then(m => m.HomeModule)
    },
    {
        'path': 'watch',
        'canActivate': [AuthService],
        'loadChildren': () => import('./pages/watch/watch.module').then(m => m.WatchModule)
    },
    {
        'path': 'signin',
        'loadChildren': () => import('./pages/signin/signin.module').then(m => m.SigninModule)
    },
    {
        'path': 'configure',
        'canActivate': [AuthService],
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