import { Category } from "./category";

export class Todo {
    private _category!: Category;
    private _id!: number;
    private _text!: string;
    private _isCompleted!: boolean;

    public get category(): Category {
        return this._category;
    }

    public set category(value: Category) {
        this._category = value;
    }

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get text(): string {
        return this._text;
    }

    public set text(value: string) {
        this._text = value;
    }

    public get isCompleted(): boolean {
        return this._isCompleted;
    }
    
    public set isCompleted(value: boolean) {
        this._isCompleted = value;
    }
}
