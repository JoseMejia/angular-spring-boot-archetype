import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'app-logout-dialog',
  templateUrl: './logout-dialog.html',
  styleUrl: './logout-dialog.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoutDialog {

}
