/**
 * Formats vendor availability for display
 * @param {Object} availability - The availability object from vendor data
 * @returns {string} - Formatted availability string
 */
export function formatAvailability(availability) {
    if (!availability || availability.type === '24/7') {
        return 'Open 24 Hours';
    }

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

    // Check for new days array structure
    if (availability.days && availability.days.length > 0) {
        const todaySchedule = availability.days.find(d => d.day === today);
        if (todaySchedule) {
            if (!todaySchedule.isOpen) return 'Closed Today';
            return `${formatTime(todaySchedule.open)} - ${formatTime(todaySchedule.close)}`;
        }
    }

    // Fallback to legacy fields
    const openingTime = availability.openingTime || '09:00';
    const closingTime = availability.closingTime || '17:00';

    // Format time from 24h to 12h
    const formatTimeHelper = (time) => {
        if (!time) return '';
        const [hours, minutes] = time.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    return `${formatTimeHelper(openingTime)} - ${formatTimeHelper(closingTime)}`;
}

// Helper for internal use (duplicates the one in function to avoid scope issues if I copy-paste carelessly, 
// but here I'll just define it outside or use the one inside)
export function formatTime(time) {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
}

/**
 * Get availability display text
 * @param {Object} availability - The availability object
 * @returns {string} - Display text
 */
export function getAvailabilityText(availability) {
    return formatAvailability(availability);
}
/**
 * Groups consecutive days with the same availability schedule
 * @param {Array} daysData - Array of day objects { day, isOpen, open, close }
 * @returns {Array} - Array of grouped objects { label, isOpen, open, close }
 */
export function getGroupedAvailability(daysData) {
    if (!daysData || daysData.length === 0) return [];

    const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    // Sort daysData by DAYS_ORDER just in case
    const sortedDays = [...daysData].sort((a, b) => DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day));

    const groups = [];
    if (sortedDays.length === 0) return [];

    let currentGroup = [sortedDays[0]];

    for (let i = 1; i < sortedDays.length; i++) {
        const prevDay = sortedDays[i - 1];
        const currentDay = sortedDays[i];

        const isSameSchedule =
            prevDay.isOpen === currentDay.isOpen &&
            prevDay.open === currentDay.open &&
            prevDay.close === currentDay.close;

        if (isSameSchedule) {
            currentGroup.push(currentDay);
        } else {
            groups.push(currentGroup);
            currentGroup = [currentDay];
        }
    }
    groups.push(currentGroup);

    return groups.map(group => {
        const firstDay = group[0];
        const lastDay = group[group.length - 1];
        const dayLabel = group.length > 1 ? `${firstDay.day} - ${lastDay.day}` : firstDay.day;

        return {
            label: dayLabel,
            isOpen: firstDay.isOpen,
            open: firstDay.open,
            close: firstDay.close
        };
    });
}
