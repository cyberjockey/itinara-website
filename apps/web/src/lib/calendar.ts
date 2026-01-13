export interface CalendarEvent {
    title: string;
    description?: string;
    location?: string;
    start: Date;
    durationMinutes: number;
}

export function generateICS(events: CalendarEvent[]): string {
    let icsContent =
        `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ITINARA//Travel Planner//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
`;

    events.forEach(event => {
        const startDate = formatDate(event.start);
        const endDate = formatDate(new Date(event.start.getTime() + event.durationMinutes * 60000));

        // Escape special characters
        const title = escapeICS(event.title);
        const description = escapeICS(event.description || "");
        const location = escapeICS(event.location || "");

        icsContent +=
            `BEGIN:VEVENT
UID:${Date.now()}_${Math.random().toString(36).substr(2, 9)}@itinara.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
STATUS:CONFIRMED
END:VEVENT
`;
    });

    icsContent += "END:VCALENDAR";
    return icsContent;
}

function formatDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function escapeICS(str: string): string {
    return str.replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\n/g, "\\n");
}
