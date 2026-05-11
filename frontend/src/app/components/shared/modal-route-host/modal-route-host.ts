import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { Component, effect, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PeopleDetails } from '../../movies/people-details/people-details';
import AuthModal from '../auth-modal/auth-modal';

type ModalMode = 'login' | 'register' | 'person-details';

@Component({
  selector: 'app-modal-route-host',
  template: '',
})
export default class ModalRouteHost {
  private dialog = inject(Dialog);
  private location = inject(Location);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  mode = input.required<ModalMode>();
  personId = input<string | null>(null);

  private syncDialogWithRoute = effect((onCleanup) => {
    const mode = this.mode();
    const personId = this.personId();

    if (!mode) {
      return;
    }

    if (mode === 'person-details') {
      if (!personId) {
        return;
      }

      this.openDialog(PeopleDetails, 'app-modal-dialog-wide', { personId }, onCleanup);
      return;
    }

    this.openDialog(AuthModal, 'app-modal-dialog-narrow', { mode }, onCleanup);
  });

  private openDialog(
    component: ComponentType<unknown>,
    panelWidthClass: string,
    data: object,
    onCleanup: (cleanupFn: () => void) => void,
  ) {
    const dialogRef = this.dialog.open(component, {
      panelClass: ['app-modal-dialog', panelWidthClass],
      backdropClass: 'app-modal-backdrop',
      data,
    });

    let closedByCleanup = false;

    const closeSubscription = dialogRef.closed.subscribe(() => {
      if (closedByCleanup) {
        return;
      }

      this.closeModalRoute();
    });

    onCleanup(() => {
      closedByCleanup = true;
      closeSubscription.unsubscribe();
      dialogRef.close();
    });
  }

  private closeModalRoute() {
    if (this.shouldCloseWithHistoryBack()) {
      this.location.back();
      return;
    }

    this.router.navigate([{ outlets: { modal: null } }], {
      relativeTo: this.route.parent,
      replaceUrl: true,
    });
  }

  private shouldCloseWithHistoryBack() {
    const state = this.location.getState() as { closeModalWithHistoryBack?: unknown } | null;
    return state?.closeModalWithHistoryBack === true;
  }
}