import fs from 'fs/promises';
import path from 'path';
import { Event, User } from './types';

const DB_PATH = path.join(process.cwd(), 'db.json');

// Mock current user
export const CURRENT_USER_ID = 'user-1';

const INITIAL_DATA: { events: Event[], users: User[] } = {
    users: [
        { id: 'user-1', name: 'Alice Smith', email: 'alice@example.com' },
        { id: 'user-2', name: 'Bob Jones', email: 'bob@example.com' },
    ],
    events: [
        {
            id: 'evt-1',
            title: 'Community Garden Cleanup',
            description: 'Join us for a morning of gardening and community bonding. Tools provided!',
            date: '2024-10-15',
            time: '09:00',
            location: 'Central Park',
            category: 'Community Service',
            createdBy: 'user-1',
            attendees: ['user-2'],
        },
        {
            id: 'evt-2',
            title: 'Tech Talk: Future of AI',
            description: 'A deep dive into the latest advancements in artificial intelligence.',
            date: '2024-10-20',
            time: '18:00',
            location: 'Innovation Hub',
            category: 'Technology',
            createdBy: 'user-2',
            attendees: ['user-1'],
        },
    ],
};

async function readDB() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data) as typeof INITIAL_DATA;
    } catch (error) {
        // If file doesn't exist, return initial data and create file
        await writeDB(INITIAL_DATA);
        return INITIAL_DATA;
    }
}

async function writeDB(data: typeof INITIAL_DATA) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getEvents() {
    const db = await readDB();
    return db.events;
}

export async function getEvent(id: string) {
    const db = await readDB();
    return db.events.find((e) => e.id === id);
}

export async function createEvent(event: Omit<Event, 'id' | 'attendees' | 'createdBy'>) {
    const db = await readDB();
    const newEvent: Event = {
        ...event,
        id: `evt-${Date.now()}`,
        createdBy: CURRENT_USER_ID,
        attendees: [],
    };
    db.events.push(newEvent);
    await writeDB(db);
    return newEvent;
}

export async function updateEvent(id: string, updates: Partial<Omit<Event, 'id' | 'createdBy' | 'attendees'>>) {
    const db = await readDB();
    const index = db.events.findIndex((e) => e.id === id);
    if (index === -1) return null;

    const event = db.events[index];
    // Simple permission check: only creator can edit
    if (event.createdBy !== CURRENT_USER_ID) {
        throw new Error('Unauthorized');
    }

    const updatedEvent = { ...event, ...updates };
    db.events[index] = updatedEvent;
    await writeDB(db);
    return updatedEvent;
}

export async function deleteEvent(id: string) {
    const db = await readDB();
    const index = db.events.findIndex((e) => e.id === id);
    if (index === -1) return false;

    const event = db.events[index];
    // Simple permission check: only creator can delete
    if (event.createdBy !== CURRENT_USER_ID) {
        throw new Error('Unauthorized');
    }

    db.events = db.events.filter((e) => e.id !== id);
    await writeDB(db);
    return true;
}

export async function toggleRSVP(eventId: string) {
    const db = await readDB();
    const eventIndex = db.events.findIndex((e) => e.id === eventId);
    if (eventIndex === -1) return null;

    const event = db.events[eventIndex];
    const isAttending = event.attendees.includes(CURRENT_USER_ID);

    if (isAttending) {
        event.attendees = event.attendees.filter((id) => id !== CURRENT_USER_ID);
    } else {
        event.attendees.push(CURRENT_USER_ID);
    }

    db.events[eventIndex] = event;
    await writeDB(db);
    return event; // Return updated event
}
