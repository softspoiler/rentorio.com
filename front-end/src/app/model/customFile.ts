export class _blob {
    constructor(chunk, option) {
        return new Blob(chunk, option);
    }
}
export class CustomFile extends _blob {
    private lastModifiedDate: Date;
    private lastModified: any;
    private name: String;
    constructor(chunk, filename, option = {}) {
        super(chunk, option)
        this.lastModifiedDate = new Date()
        this.lastModified = + this.lastModifiedDate
        this.name = filename
    }
}