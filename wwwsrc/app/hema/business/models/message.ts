export class Message {
    public id: string;
    public content: string;
    public date: Date;
    public read: boolean;
    public deleted: boolean;

    constructor(id: string, content: string) {
        this.id = id;
        this.content = content;
        this.date = new Date();
        this.read = false;
        this.deleted = false;
    }
}
