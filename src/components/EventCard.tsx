'use client';

import { Event } from '@/lib/types';
import { Calendar, MapPin, Users, Heart } from 'lucide-react';
import Link from 'next/link';
import { toggleRSVPAction } from '@/app/actions';
import { useOptimistic, useTransition } from 'react';
import clsx from 'clsx';

interface EventCardProps {
    event: Event;
    currentUserId: string;
}

export default function EventCard({ event, currentUserId }: EventCardProps) {
    const isAttending = event.attendees.includes(currentUserId);
    const [optimisticAttending, setOptimisticAttending] = useOptimistic(
        isAttending,
        (state, newItem: boolean) => newItem
    );
    const [isPending, startTransition] = useTransition();

    const handleRSVP = async (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation if button clicked inside Link wrapper (if any)
        startTransition(async () => {
            setOptimisticAttending(!optimisticAttending);
            await toggleRSVPAction(event.id);
        });
    };

    return (
        <div className="card h-full flex flex-col group relative overflow-hidden transition-all duration-300 hover:shadow-lg border-opacity-50">
            <Link href={`/events/${event.id}`} className="absolute inset-0 z-0" aria-label={`View details for ${event.title}`} />

            <div className="relative z-10 flex flex-col h-full pointer-events-none"> {/* Content wrapper */}
                <div className="flex justify-between items-start mb-4">
                    <span className="bg-primary/10 text-primary text-xs font-semibold px-2 py-1 rounded-full uppercase tracking-wider">
                        {event.category}
                    </span>
                    {event.createdBy === currentUserId && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded border">
                            Host
                        </span>
                    )}
                </div>

                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {event.title}
                </h3>

                <div className="space-y-2 text-sm text-muted-foreground flex-grow">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>{new Date(event.date + 'T' + event.time).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{event.attendees.length} Attendees</span>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t flex justify-between items-center pointer-events-auto">
                    <button
                        onClick={handleRSVP}
                        disabled={isPending}
                        className={clsx(
                            "flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md transition-all",
                            optimisticAttending
                                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                : "bg-secondary/10 text-secondary-foreground hover:bg-secondary/20"
                        )}
                    >
                        <Heart className={clsx("h-4 w-4", optimisticAttending && "fill-current")} />
                        {optimisticAttending ? "Attending" : "RSVP"}
                    </button>

                    <Link
                        href={`/events/${event.id}`}
                        className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                    >
                        Details &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
}
