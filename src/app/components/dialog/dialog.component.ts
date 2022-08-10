import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {
  form: FormGroup;
  categories: string[];

  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: string[]
  ) { 
    this.form = new FormGroup({
      text: new FormControl(null, Validators.required),
      categoryName: new FormControl(null, Validators.required),
      customCategoryName: new FormControl(null, this.customCategoryNameValidator)
    });
    this.categories = [...data, 'Создать категорию'];
  }

  close(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close(this.form.value);
  }

  customCategoryNameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    return this.form && this.form.value.categoryName === 'Создать категорию' ? Validators.required(control) : null;
  };

  trackByFn(index: number, item: string): number {
    return index;
  }
}
