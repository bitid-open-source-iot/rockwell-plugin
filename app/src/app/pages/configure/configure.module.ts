/* --- PAGES --- */
import { ConfigurePage } from './configure.page';
import { InputEditorDialog } from './editor/editor.dialog';

/* --- MODULES --- */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFooterModule } from 'src/app/lib/mat-footer/mat-footer.module';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatContentModule } from 'src/app/lib/mat-content/mat-content.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Route, RouterModule } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Route[] = [
    {
        'path': '',
        'component': ConfigurePage
    }
];

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        MatIconModule,
        MatTableModule,
        MatInputModule,
        MatButtonModule,
        MatFooterModule,
        MatSelectModule,
        MatDialogModule,
        MatToolbarModule,
        MatContentModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        RouterModule.forChild(routes)
    ],
    declarations: [
        ConfigurePage,
        InputEditorDialog
    ]
})

export class ConfigureModule { }