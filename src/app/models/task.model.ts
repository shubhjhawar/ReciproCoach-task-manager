export class Task {
    constructor(
        public heading: string,
        public description: string,
        public dueDate: Date,
        public repeat: boolean
    ) {}
}
