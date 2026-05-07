import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-modal-shell',
  standalone: true,
  imports: [],
  templateUrl: './modal-shell.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ModalShell {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly shellClass = input('app-modal-shell-narrow');
  readonly bodyClass = input('app-modal-shell-body-default');

  readonly close = output<void>();

  protected onClose() {
    this.close.emit();
  }
}