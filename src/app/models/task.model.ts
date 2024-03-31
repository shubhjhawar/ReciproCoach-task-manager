export class Task {
    constructor(
        public heading: string,
        public description: string,
        public fixed_dueDate: Date,
        public variable_dueDate: Date,
        public repeat: boolean | null,
        public complete: boolean,
        public repeatID: string | null,
        public repeatFrequency: string | null
    ) {}
}

