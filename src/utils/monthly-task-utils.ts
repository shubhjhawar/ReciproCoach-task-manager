const daysOfWeek: any = {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6
};

function generateDatesForWeekdayOfWeek(weekNumber: any, dayOfWeek: string, monthFrequency: number) {
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    endDate.setMonth(currentDate.getMonth() + 12);


    const dates : any = [];

    while (currentDate < endDate) {
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        let targetDate = new Date(firstDayOfMonth);
        let count = 0;
        let weekDayCount = 0;
        let weekendCount = 0;

        // Loop through the month
        if(weekNumber === 'Last'){
            for (let i = lastDayOfMonth.getDate(); i>=0 ; i--) {
                targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
                if(dayOfWeek=='Day'){
                    dates.push(targetDate)
                    break
                } else if(dayOfWeek=='weekday' || dayOfWeek=='weekend day') {
                    if(targetDate.getDay() === 0 || targetDate.getDay() === 6) {
                        dates.push(targetDate)
                        weekendCount=0  
                        break
                    } else {
                        dates.push(targetDate)
                        weekDayCount=0  
                        break
                    }
                } else {
                if(targetDate.getDay() === daysOfWeek[dayOfWeek]) {
                        dates.push(targetDate)
                        break
                    
                    }
                }

            }
        }

        for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
            targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            if(dayOfWeek=='Day' && i==weekNumber){
                dates.push(targetDate)
            } else if(dayOfWeek=='Weekday' || dayOfWeek=='Weekend day') {
                if(targetDate.getDay() === 0 || targetDate.getDay() === 6) {
                    weekendCount++;    
                    if(weekendCount == weekNumber && dayOfWeek=='Weekend day')
                    {
                        dates.push(targetDate)
                        weekendCount=0  
                        break
                    }
                
                } else {
                    weekDayCount++;    
                    if(weekDayCount == weekNumber && dayOfWeek=='Weekday')
                    {
                        dates.push(targetDate)
                        weekDayCount=0  
                        break
                    }
                }
            } else {
                if(targetDate.getDay() === daysOfWeek[dayOfWeek]) {
                    count++;
                    if(count == weekNumber)
                    {
                        
                        dates.push(targetDate)
                        count = 0;
                    }
                }
            }

        }

        // Move to the next month based on the specified frequency
        currentDate.setMonth(currentDate.getMonth() + monthFrequency);
    }

    return dates;
}


export function generateMonthlyTasks(monthFrequency: number, monthSelectedWeek: number, monthSelectedDay: string, taskFields: any) {
    const dates = generateDatesForWeekdayOfWeek(monthSelectedWeek, monthSelectedDay, monthFrequency);
    const generatedTasks: any = [];

    dates.forEach((date: Date) => {
        const task = {
            heading: taskFields.heading,
            description: taskFields.description,
            fixed_dueDate: date  
        };
        generatedTasks.push(task);
    });
  
    return generatedTasks;
}

