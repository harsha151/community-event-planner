'use server';

import { createEvent, updateEvent, deleteEvent, toggleRSVP } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { CreateEventInput } from '@/lib/types';

export async function createEventAction(formData: FormData) {
    const event: CreateEventInput = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        date: formData.get('date') as string,
        time: formData.get('time') as string,
        location: formData.get('location') as string,
        category: formData.get('category') as string,
    };

    await createEvent(event);
    revalidatePath('/');
    redirect('/');
}

export async function updateEventAction(id: string, formData: FormData) {
    const updates = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        date: formData.get('date') as string,
        time: formData.get('time') as string,
        location: formData.get('location') as string,
        category: formData.get('category') as string,
    };

    await updateEvent(id, updates);
    revalidatePath('/');
    revalidatePath(`/events/${id}`);
    redirect(`/events/${id}`);
}

export async function deleteEventAction(id: string) {
    await deleteEvent(id);
    revalidatePath('/');
    redirect('/');
}

export async function toggleRSVPAction(eventId: string) {
    await toggleRSVP(eventId);
    revalidatePath('/');
    revalidatePath(`/events/${eventId}`);
}
