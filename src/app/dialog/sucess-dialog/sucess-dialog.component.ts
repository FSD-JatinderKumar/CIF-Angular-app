import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-sucess-dialog',
  templateUrl: './sucess-dialog.component.html',
  styleUrls: ['./sucess-dialog.component.scss']
})
export class SucessDialogComponent implements OnInit {
  public confirmMessage: string;
  constructor(  public dialogRef: MatDialogRef<SucessDialogComponent>) { }

  ngOnInit(): void {
  }

}
