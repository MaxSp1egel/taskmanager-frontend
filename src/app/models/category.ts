import { Expose, Type } from "class-transformer";
import { Todo } from "./todo";

export class Category {
    private _id!: number;
    private _title!: string;
    private _todos!: Todo[];

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get title(): string {
        return this._title;
    }
    
    public set title(value: string) {
        this._title = value;
    }

    @Type(() => Todo)
    public get todos(): Todo[] {
        return this._todos;
    }

    public set todos(value: Todo[]) {
        this._todos = value;
    }
}
