import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface DialogData {
  imgSelected: string;
}

@Component({
  selector: 'app-select-profile-picture',
  templateUrl: './select-profile-picture.component.html',
  styleUrls: ['./select-profile-picture.component.scss']
})
export class SelectProfilePictureComponent {
  selected: string = null;

  constructor(
    public dialogRef: MatDialogRef<SelectProfilePictureComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  getAvatarUrl(index: number) {
    return `./assets/img/avatars/colega${index}.png`;
  }

  public selectAvatar(index: number) {
    this.selected = `colega${index}.png`;
  }

  public isActive(index: number) {
    return this.selected === `colega${index}.png`;
  }
}
