'use client';

import { createEventAction, updateEventAction } from '@/app/actions';
import { Event } from '@/lib/types';
import { Calendar, MapPin, Tag, Type, Clock } from 'lucide-react';
import Link from 'next/link';

interface EventFormProps {
    event?: Event;
}

export default function EventForm({ event }: EventFormProps) {
    const isEdit = !!event;

    return (
        <form action={isEdit ? updateEventAction.bind(null, event!.id) : createEventAction} className="space-y-6 max-w-2xl mx-auto p-6 bg-card border rounded-lg shadow-sm">
            <div className="space-y-2">
                <label htmlFor="title" className="label flex items-center gap-2">
                    <Type className="h-4 w-4 text-muted-foreground" />
                    Event Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    defaultValue={event?.title}
                    required
                    className="input"
                    placeholder="e.g., Community Cleanup Day"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="date" className="label flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Date
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        defaultValue={event?.date}
                        required
                        className="input"
                    />
                </div>
                <div className="space-y-2">
                    <label htmlFor="time" className="label flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        Time
                    </label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        defaultValue={event?.time}
                        required
                        className="input"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="location" className="label flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Location
                </label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    defaultValue={event?.location}
                    required
                    className="input"
                    placeholder="e.g., Central Park Pavilion"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="category" className="label flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    Category
                </label>
                <select
                    id="category"
                    name="category"
                    defaultValue={event?.category || ""}
                    required
                    className="input appearance-none bg-no-repeat bg-right pr-8"
                >
                    <option value="" disabled>Select a category</option>
                    <option value="Social">Social</option>
                    <option value="Community Service">Community Service</option>
                    <option value="Education">Education</option>
                    <option value="Technology">Technology</option>
                    <option value="Sports">Sports</option>
                    <option value="Arts">Arts</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="label">Description</label>
                <textarea
                    id="description"
                    name="description"
                    rows={4}
                    defaultValue={event?.description}
                    required
                    className="input min-h-[100px] resize-y"
                    placeholder="Describe your event..."
                />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t sticky bottom-0 bg-card py-4 -mx-6 px-6 md:static md:bg-transparent md:p-0 md:border-t-0">
                <Link href="/" className="btn btn-ghost">
                    Cancel
                </Link>
                <button type="submit" className="btn btn-primary w-full md:w-auto">
                    {isEdit ? 'Update Event' : 'Create Event'}
                </button>
            </div>
        </form>
    );
}
