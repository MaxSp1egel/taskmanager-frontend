import { Component, Input, OnInit } from '@angular/core';
import { plainToInstance } from 'class-transformer';
import { map } from 'rxjs';
import { Todo } from 'src/app/models/todo';
import { CheckTodo, CheckTodoResponse } from 'src/app/services/graphql.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent {

  @Input()
  todo!: Todo;

  @Input()
  last!: boolean;

  constructor(private checkTodo: CheckTodo) {}

  check(todo: Todo): void {
    this.checkTodo.mutate({
      input: {
        id: todo.id,
        status: !todo.isCompleted
      }
    }).pipe(
      map(response => plainToInstance(CheckTodoResponse, response.data)),
      map(data => data.checkTodo)
    ).subscribe(todo => {
      this.todo = todo;
    });
  }
}
