import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatQrcodeComponent } from './mat-qrcode.component';

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [
        MatQrcodeComponent
    ],
    declarations: [
        MatQrcodeComponent
    ]
})

export class MatQrcodeModule { }