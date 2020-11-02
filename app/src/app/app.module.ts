/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* --- SERVICES --- */
import { ApiService } from './services/api/api.service';
import { AuthService } from './services/auth/auth.service';
import { ToastService } from './services/toast/toast.service';
import { ConfigService } from './services/config/config.service';
import { SocketService } from './services/socket/socket.service';
import { AccountService } from './services/account/account.service';
import { DevicesService } from './services/devices/devices.service';
import { FormErrorService } from './services/form-error/form-error.service';
import { LocalstorageService } from './services/localstorage/localstorage.service';

/* --- COMPONENTS --- */
import { AppComponent } from './app.component';

/* --- ENVIRONMENT --- */
import { environment } from '../environments/environment';

@NgModule({
    imports: [
        MatIconModule,
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
            'enabled': environment.production
        })
    ],
    providers: [
        ApiService,
        AuthService,
        ToastService,
        SocketService,
        ConfigService,
        DevicesService,
        AccountService,
        FormErrorService,
        LocalstorageService
    ],
    bootstrap: [
        AppComponent
    ],
    declarations: [
        AppComponent
    ]
})

export class AppModule { }