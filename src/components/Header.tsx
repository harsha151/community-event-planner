import Link from 'next/link';
import { CalendarDays, PlusCircle, User } from 'lucide-react';

export default function Header() {
    return (
        <header className="border-b bg-white dark:bg-slate-950 sticky top-0 z-10 backdrop-blur-md bg-opacity-80 dark:bg-opacity-80">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                    <CalendarDays className="h-6 w-6" />
                    <span>Community Events</span>
                </Link>

                <nav className="flex items-center gap-4">
                    <Link href="/events/create" className="btn btn-primary text-sm flex items-center gap-2">
                        <PlusCircle className="h-4 w-4" />
                        <span>Create Event</span>
                    </Link>

                    <div className="flex items-center gap-2 text-sm text-foreground/80 border-l pl-4 ml-2">
                        <div className="bg-secondary/20 p-2 rounded-full">
                            <User className="h-4 w-4 text-secondary-foreground" />
                        </div>
                        <span className="hidden md:inline font-medium">Alice Smith</span>
                    </div>
                </nav>
            </div>
        </header>
    );
}
