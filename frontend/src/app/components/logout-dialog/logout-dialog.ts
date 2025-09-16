import {ChangeDetectionStrategy, Component} from '@angular/core';
import {SharedModule} from '../../shared/shared-module';

@Component({
  selector: 'app-logout-dialog',
  imports: [SharedModule],
  templateUrl: './logout-dialog.html',
  styleUrl: './logout-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoutDialog {

}
