import { v4 as uuidv4 } from 'uuid';
const daysOfWeek: any = {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6
};

const monthsOfYear: any = {
    'January': 0,
    'February': 1,
    'March': 2,
    'April': 3,
    'May': 4,
    'June': 5,
    'July': 6,
    'August': 7,
    'September': 8,
    'October': 9,
    'November': 10,
    'December': 11
};

function generateDatesForYearlyRepeatTasks(yearFrequency:number, month: string, weekNumber: any, dayOfWeek: string) {
    console.log(yearFrequency, month, weekNumber, dayOfWeek)
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    endDate.setFullYear(currentDate.getFullYear() + 5);
    
    currentDate.setMonth(monthsOfYear[month])
    
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
                } else if(dayOfWeek=='Weekday' || dayOfWeek=='Weekend day') {
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
                        break
                    }
                }
            }

        }

        // Move to the next month based on the specified frequency
        currentDate.setFullYear(currentDate.getFullYear() + yearFrequency);
    }
    console.log(dates)

    return dates;
}

export function generateYearlyTasks(yearFrequency: number, yearSelectedMonth: any, yearSelectedWeek: string, yearSelectedDay:any, taskFields: any) {
    const dates = generateDatesForYearlyRepeatTasks(yearFrequency, yearSelectedMonth, yearSelectedWeek, yearSelectedDay);
    const generatedTasks: any = [];
    const repeatID = uuidv4();


    dates.forEach((date: Date) => {
        const task = {
            heading: taskFields.heading,
            description: taskFields.description,
            fixed_dueDate: date,
            repeatID: repeatID,
            repeatFrequency: 'yearly'
        };
        generatedTasks.push(task);
    });
    console.log(generatedTasks)
    return generatedTasks;
}

