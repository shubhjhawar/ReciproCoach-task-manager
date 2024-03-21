export class Task {
  constructor(
      public heading: string,
      public description: string,
      public fixed_dueDate: Date,
      public variable_dueDate: Date,
      public repeat: RepeatInfo,
      public repeatFrequency:string
  ) {}
}


export class RepeatInfo {
  constructor(
    public frequency: RepeatFrequency,
    public interval: number | null,
    public dayOfWeek: number | null,
    public dayOfMonth: number | null,
    public monthOfYear: number | null
  ) {}
}

export enum RepeatFrequency {
    DAILY = 'DAILY',
    WEEKLY = 'WEEKLY',
    MONTHLY = 'MONTHLY',
    YEARLY = 'YEARLY'
}