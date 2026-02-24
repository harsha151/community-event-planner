import { getEvent, CURRENT_USER_ID } from '@/lib/data';
import { notFound, redirect } from 'next/navigation';
import EventForm from '@/components/EventForm';

export default async function EditEventPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const event = await getEvent(params.id);

    if (!event) {
        notFound();
    }

    if (event.createdBy !== CURRENT_USER_ID) {
        redirect('/'); // Or show unauthorized message
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Edit Event</h1>
            <EventForm event={event} />
        </div>
    );
}
