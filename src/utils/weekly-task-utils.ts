import { v4 as uuidv4 } from 'uuid';
const daysOfWeek: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const endDate = new Date();
endDate.setMonth(endDate.getMonth() + 6);

export function generateWeeklyTasks(selectedDays: string[], frequency: number, taskFields: any) {
    const currentDate = new Date();
    const selectedDaysIndices = selectedDays ? selectedDays.map((day: any) => daysOfWeek.indexOf(day)) : [];
    // Check if selectedDaysIndices is empty or undefined
    if (!selectedDaysIndices || selectedDaysIndices.length === 0) {
      console.error('No selected days provided.');
      return [];
    }
    const generatedTasks = [];
    const repeatID = uuidv4();

    // Generate tasks based on the weekly data
    while (currentDate < endDate) {
      const dayIndex = currentDate.getDay();
      for (let i = 0; i < 7; i++) {
        if (selectedDaysIndices.includes((dayIndex + i) % 7) && (i % frequency === 0)) {
          // Create a task for this day
          const task = {
            heading: taskFields.heading,
            description: taskFields.description,
            fixed_dueDate: addDays(currentDate, i),
            repeatID: repeatID
          };
          generatedTasks.push(task);
        }
      }
      currentDate.setDate(currentDate.getDate() + 7); // Move to the next week
    }
    return generatedTasks;
  }
  

export function addDays(date: Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}