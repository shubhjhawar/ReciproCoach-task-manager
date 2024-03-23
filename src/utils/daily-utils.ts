function generateDatesForDailyRepeatTasks(dailyFrequency: any) {
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    endDate.setMonth(currentDate.getMonth() + 1);

    const dates: any[] = [];

    for (let currentIterationDate = new Date(currentDate); currentIterationDate < endDate; ) {
        dates.push(new Date(currentIterationDate));
        currentIterationDate.setDate(currentIterationDate.getDate() + parseInt(dailyFrequency)); // Move to the next date
        console.log("currentIterationDate", currentIterationDate)
    }

    return dates;
}

export function generateDailyTasks(dailyFrequency: number, taskFields: any) {
    const dates = generateDatesForDailyRepeatTasks(dailyFrequency);
    const generatedTasks: any[] = [];

    dates.forEach((date: Date) => {
        const task = {
            heading: taskFields.heading,
            description: taskFields.description,
            fixed_dueDate: new Date(date)
        };
        generatedTasks.push(task);
    });

    return generatedTasks;
}
