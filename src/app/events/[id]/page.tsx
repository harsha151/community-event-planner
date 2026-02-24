import { getEvent, CURRENT_USER_ID } from '@/lib/data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, MapPin, Users, Edit2, Trash2 } from 'lucide-react';
import { toggleRSVPAction, deleteEventAction } from '@/app/actions';
import { revalidatePath } from 'next/cache';

// Client Component for delete confirmation? or just form action?
// Server action form button is easiest.

export default async function EventPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const event = await getEvent(params.id);

    if (!event) {
        notFound();
    }

    const isCreator = event.createdBy === CURRENT_USER_ID;
    const isAttending = event.attendees.includes(CURRENT_USER_ID);

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Link href="/" className="text-primary hover:underline mb-4 inline-block">&larr; Back to Events</Link>

            <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
                <div className="md:flex">
                    <div className="md:w-2/3 p-8">
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-secondary/10 text-secondary-contrast px-3 py-1 rounded-full text-sm font-semibold uppercase tracking-wide">
                                {event.category}
                            </span>
                            {isCreator && (
                                <div className="flex gap-2">
                                    <Link href={`/events/${event.id}/edit`} className="p-2 hover:bg-muted rounded-full text-muted-foreground hover:text-foreground transition-colors" title="Edit Event">
                                        <Edit2 className="h-4 w-4" />
                                    </Link>
                                    <form action={deleteEventAction.bind(null, event.id)}>
                                        <button type="submit" className="p-2 hover:bg-destructive/10 rounded-full text-muted-foreground hover:text-destructive transition-colors" title="Delete Event">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>

                        <h1 className="text-4xl font-bold mb-4">{event.title}</h1>

                        <div className="flex flex-wrap gap-6 mb-8 text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-semibold text-foreground">Date & Time</p>
                                    <p>{new Date(event.date + 'T' + event.time).toLocaleString(undefined, { dateStyle: 'full', timeStyle: 'short' })}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-primary" />
                                <div>
                                    <p className="font-semibold text-foreground">Location</p>
                                    <p>{event.location}</p>
                                </div>
                            </div>
                        </div>

                        <div className="prose dark:prose-invert max-w-none mb-8">
                            <h3 className="text-xl font-semibold mb-2">About this Event</h3>
                            <p className="whitespace-pre-line text-lg leading-relaxed">{event.description}</p>
                        </div>

                        <div className="border-t pt-6 mt-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    <span className="font-medium">{event.attendees.length} people attending</span>
                                </div>

                                <form action={toggleRSVPAction.bind(null, event.id)}>
                                    <button
                                        type="submit"
                                        className={`px-6 py-3 rounded-md font-bold transition-all transform hover:scale-105 ${isAttending ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
                                    >
                                        {isAttending ? '✓ Attending' : 'RSVP Now'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Attendee List Preview could go here */}
                    <div className="md:w-1/3 bg-muted/20 p-8 border-l">
                        <h3 className="font-semibold mb-4">Attendees</h3>
                        {event.attendees.length > 0 ? (
                            <ul className="space-y-4">
                                {event.attendees.map((attendeeId) => (
                                    <li key={attendeeId} className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                            {attendeeId === 'user-1' ? 'AS' : attendeeId === 'user-2' ? 'BJ' : 'U'}
                                        </div>
                                        <span className="text-sm font-medium">
                                            {attendeeId === 'user-1' ? 'Alice Smith' : attendeeId === 'user-2' ? 'Bob Jones' : `User ${attendeeId}`}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-muted-foreground text-sm">Be the first to join!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
