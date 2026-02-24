import { getEvents, CURRENT_USER_ID } from '@/lib/data';
import EventCard from '@/components/EventCard';
import Header from '@/components/Header';
import Link from 'next/link';
import { Search } from 'lucide-react';

export default async function Home(props: { searchParams: Promise<{ q?: string; category?: string; date?: string }> }) {
  const searchParams = await props.searchParams;
  const events = await getEvents();
  const qVal = searchParams?.q;
  const categoryVal = searchParams?.category;

  const dateVal = searchParams?.date;

  const query = (Array.isArray(qVal) ? qVal[0] : qVal)?.toLowerCase() || '';
  const category = (Array.isArray(categoryVal) ? categoryVal[0] : categoryVal)?.toLowerCase() || '';
  const date = (Array.isArray(dateVal) ? dateVal[0] : dateVal) || '';

  const filteredEvents = events.filter((event) => {
    const matchQuery = event.title.toLowerCase().includes(query) ||
      event.description.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query);
    const matchCategory = category ? event.category.toLowerCase() === category : true;
    const matchDate = date ? event.date === date : true;
    return matchQuery && matchCategory && matchDate;
  });

  const categories = Array.from(new Set(events.map((e) => e.category)));

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Upcoming Events
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover and join community events near you.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border rounded-full px-4 py-2 shadow-sm w-full md:w-auto">
              <Search className="h-4 w-4 text-muted-foreground" />
              <form action="/" method="GET" className="flex-grow flex gap-2">
                <input
                  type="text"
                  name="q"
                  placeholder="Search events..."
                  defaultValue={searchParams?.q}
                  className="bg-transparent border-none outline-none text-sm w-full md:w-48 focus:ring-0 placeholder:text-muted-foreground"
                />
                <input
                  type="date"
                  name="date"
                  defaultValue={searchParams?.date}
                  className="bg-transparent border-l pl-2 outline-none text-sm w-auto focus:ring-0 text-muted-foreground"
                />
                {/* Hidden submit button to allow Enter key submission */}
                <button type="submit" className="hidden" />
              </form>
            </div>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
          <Link
            href="/"
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${!category ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/?category=${encodeURIComponent(cat)}`}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors border ${category === cat.toLowerCase() ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}
            >
              {cat}
            </Link>
          ))}
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} currentUserId={CURRENT_USER_ID} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
            <h3 className="text-xl font-medium text-muted-foreground">No events found</h3>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your search or category filter.</p>
            <Link href="/events/create" className="mt-4 btn btn-primary inline-flex">
              Create New Event
            </Link>
          </div>
        )}
      </main>

      <footer className="border-t py-8 bg-muted/20 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Community Event Planner. Built for Internship Project.
        </div>
      </footer>
    </div>
  );
}
