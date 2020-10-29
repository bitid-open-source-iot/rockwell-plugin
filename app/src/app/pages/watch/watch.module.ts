/* --- PAGES --- */
import { WatchPage } from './watch.page';

/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatQrcodeModule } from 'src/app/lib/mat-qrcode/mat-qrcode.module';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatContentModule } from 'src/app/lib/mat-content/mat-content.module';
import { Route, RouterModule } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const routes: Route[] = [
    {
        'path': '',
        'component': WatchPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        MatIconModule,
        MatQrcodeModule,
        MatButtonModule,
        MatTooltipModule,
        MatToolbarModule,
        MatContentModule,
        MatProgressBarModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        WatchPage
    ]
})

export class WatchModule { }