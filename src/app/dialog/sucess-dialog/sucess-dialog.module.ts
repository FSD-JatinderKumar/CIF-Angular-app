import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { SucessDialogComponent } from './sucess-dialog.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  // declarations: [SucessDialogComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class SucessDialogModule { }

