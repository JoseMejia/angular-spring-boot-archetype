import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-error-dialog',
  templateUrl: './error-dialog.html',
  styleUrl: './error-dialog.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorDialog {
  public data: { error?: Error } = inject(MAT_DIALOG_DATA);
}
