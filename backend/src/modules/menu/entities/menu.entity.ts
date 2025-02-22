export class Menu {
    id: number;
    name: string;
    parentId?: number;
    children?: Menu[];
    createdAt: Date;
    updatedAt: Date;
}