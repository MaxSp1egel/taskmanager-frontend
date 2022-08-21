import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { plainToInstance } from 'class-transformer';
import { map } from 'rxjs';
import { Category } from 'src/app/models/category';
import { Todo } from 'src/app/models/todo';
import { CreateTodo, CreateTodoResponse } from 'src/app/services/graphql.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Input()
  data!: Category[];

  @Output()
  addTodoEvent = new EventEmitter<Todo>();

  constructor(
    private dialog: MatDialog,
    private createTodo: CreateTodo
  ) {}

  openDialog(): void {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;

    dialogConfig.data = this.data.map((category: Category): string => category.title);

    this.dialog.open(DialogComponent, dialogConfig).afterClosed().subscribe((formData) => {
      if (formData) {
        let categoryName = formData.customCategoryName ?? formData.categoryName;
        let text = formData.text;
        
        this.create(categoryName, text);
      }
    });
  }

  private create(categoryName: string, text: string): void {
    this.createTodo.mutate({
      input: {
        categoryName: categoryName,
        text: text
      }
    }).pipe(
      map(response => plainToInstance(CreateTodoResponse, response.data)),
      map(data => data.createTodo)
    ).subscribe(todo => {
      this.addTodoEvent.emit(todo);
    });
  }
}