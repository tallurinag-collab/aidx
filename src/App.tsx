import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  categoryMeta,
  destinations,
  places as starterPlaces,
  starterStories,
  starterTrips,
  type ItineraryItem,
  type Place,
  type PlaceCategory,
  type Story,
  type Trip,
  type Visibility,
} from './travelData';

type View = 'home' | 'explore' | 'trips' | 'saved';
type CategoryFilter = 'All' | PlaceCategory;

const storageKeys = {
  trips: 'roamly.trips.v1',
  stories: 'roamly.stories.v1',
  saved: 'roamly.saved.v1',
  liked: 'roamly.liked.v1',
  following: 'roamly.following.v1',
};

function readStored<T,>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function useStoredState<T,>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => readStored(key, initialValue));
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Keep the current session usable when browser storage is unavailable.
    }
  }, [key, value]);
  return [value, setValue] as const;
}

function id(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function dateLabel(value?: string) {
  if (!value) return 'Dates not set';
  const date = new Date(`${value}T12:00:00`);
  return date.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' });
}

function dateRange(start?: string, end?: string) {
  if (!start && !end) return 'Dates to be decided';
  if (start && !end) return dateLabel(start);
  if (!start && end) return `Until ${dateLabel(end)}`;
  const startDate = new Date(`${start}T12:00:00`);
  const endDate = new Date(`${end}T12:00:00`);
  const sameYear = startDate.getFullYear() === endDate.getFullYear();
  const startText = startDate.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  const endText = endDate.toLocaleDateString('en', { month: 'short', day: 'numeric', ...(sameYear ? { year: 'numeric' } : {}) });
  return `${startText} – ${endText}`;
}

function daysForTrip(trip: Trip) {
  if (!trip.startDate || !trip.endDate) return [];
  const start = new Date(`${trip.startDate}T12:00:00`);
  const end = new Date(`${trip.endDate}T12:00:00`);
  const days: string[] = [];
  const cursor = new Date(start);
  while (cursor <= end && days.length < 21) {
    days.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function categoryIcon(category: PlaceCategory | 'Note') {
  if (category === 'Note') return '✎';
  return categoryMeta[category].icon;
}

function Avatar({ initials, image, className = '' }: { initials: string; image?: string; className?: string }) {
  return image
    ? <img className={`avatar ${className}`} src={image} alt="" />
    : <span className={`avatar avatar-initials ${className}`} aria-hidden="true">{initials}</span>;
}

function Sidebar({
  activeView,
  onNavigate,
  onCreateTrip,
}: {
  activeView: View;
  onNavigate: (view: View) => void;
  onCreateTrip: () => void;
}) {
  const navItems: { id: View; label: string; icon: string }[] = [
    { id: 'home', label: 'Home feed', icon: '⌂' },
    { id: 'explore', label: 'Explore', icon: '⌕' },
    { id: 'trips', label: 'My trips', icon: '▤' },
    { id: 'saved', label: 'Saved', icon: '♡' },
  ];

  return (
    <aside className="sidebar">
      <a className="brand" href="#home" onClick={(event) => { event.preventDefault(); onNavigate('home'); }}>
        <span className="brand-symbol" aria-hidden="true"><span /></span>
        <span>roamly<span className="brand-period">.</span></span>
      </a>
      <div className="sidebar-label">YOUR SPACE</div>
      <nav className="side-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <button
            className={`side-link ${activeView === item.id ? 'active' : ''}`}
            type="button"
            key={item.id}
            aria-current={activeView === item.id ? 'page' : undefined}
            onClick={() => onNavigate(item.id)}
          >
            <span className="side-icon" aria-hidden="true">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-rule" />
      <div className="sidebar-label">PLAN A LITTLE</div>
      <button className="plan-cta" type="button" onClick={onCreateTrip}>
        <span className="plan-cta-icon" aria-hidden="true">＋</span>
        <span><strong>Plan a trip</strong><small>Start with a place</small></span>
        <span className="plan-cta-arrow" aria-hidden="true">↗</span>
      </button>
      <div className="sidebar-bottom">
        <div className="demo-profile-card">
          <Avatar initials="AM" />
          <span><strong>Maya’s space</strong><small>Local demo profile</small></span>
          <span className="more-dots" aria-hidden="true">···</span>
        </div>
        <p className="sidebar-footnote">A little less scrolling.<br />A lot more going.</p>
      </div>
    </aside>
  );
}

function Topbar({ query, setQuery, onStory }: { query: string; setQuery: (value: string) => void; onStory: () => void }) {
  return (
    <header className="topbar">
      <label className="global-search">
        <span aria-hidden="true">⌕</span>
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search places, stories, or people" aria-label="Search places, stories, or people" />
        <kbd>⌘ K</kbd>
      </label>
      <div className="topbar-actions">
        <span className="demo-pill"><i /> Demo</span>
        <button className="icon-button notification-button" type="button" aria-label="Notifications"><span aria-hidden="true">♧</span><i /></button>
        <button className="write-button" type="button" onClick={onStory}><span aria-hidden="true">＋</span> Share a story</button>
        <Avatar initials="AM" />
      </div>
    </header>
  );
}

function PageHeading({ eyebrow, title, detail, action }: { eyebrow: string; title: ReactNode; detail: string; action?: ReactNode }) {
  return (
    <div className="page-heading">
      <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-subtitle">{detail}</p></div>
      {action}
    </div>
  );
}

function TripSpotlight({ trip, onOpen, onCreate }: { trip?: Trip; onOpen: (trip: Trip) => void; onCreate: () => void }) {
  if (!trip) {
    return (
      <section className="trip-spotlight trip-empty">
        <div className="trip-empty-copy"><span className="overline-light">YOUR NEXT CHAPTER</span><h2>A good trip starts<br />with a little daydream.</h2><p>Pick a place. We’ll help you turn the “someday” into a plan.</p><button className="button button-light" type="button" onClick={onCreate}>Plan your first trip <span>↗</span></button></div>
        <div className="trip-empty-art" aria-hidden="true">✳</div>
      </section>
    );
  }
  return (
    <section className="trip-spotlight" style={{ backgroundImage: `linear-gradient(90deg, rgba(24,42,34,.86), rgba(24,42,34,.2)), url("${trip.image}")` }}>
      <div className="spotlight-content">
        <span className="overline-light">YOUR NEXT CHAPTER <span className="spotlight-dot" /></span>
        <h2>{trip.destination.split(',')[0]}<br /><em>is on the horizon.</em></h2>
        <div className="spotlight-meta"><span>▦ {dateRange(trip.startDate, trip.endDate)}</span><span>⌖ {trip.items.length} saved {trip.items.length === 1 ? 'stop' : 'stops'}</span></div>
        <button className="button button-light" type="button" onClick={() => onOpen(trip)}>Open your trip <span>↗</span></button>
      </div>
      <div className="spotlight-caption"><span className="caption-leaf">✳</span><span>YOUR PLANS, YOUR PACE</span></div>
    </section>
  );
}

function StoryCard({
  story,
  isLiked,
  isSaved,
  isFollowing,
  onLike,
  onSave,
  onFollow,
  onReport,
  onAddPlace,
}: {
  story: Story;
  isLiked: boolean;
  isSaved: boolean;
  isFollowing: boolean;
  onLike: () => void;
  onSave: () => void;
  onFollow: () => void;
  onReport: () => void;
  onAddPlace: (place: Place) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const taggedPlace = starterPlaces.find((place) => place.id === story.placeId);
  return (
    <article className="story-card">
      <div className="story-byline">
        <div className="story-author">
          <Avatar initials={story.avatar} />
          <span><strong>{story.author}</strong><small>{story.handle} <b>·</b> {story.date}</small></span>
        </div>
        <div className="story-menu-wrap">
          <button className="icon-button story-more" type="button" aria-label="More story options" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>···</button>
          {menuOpen && <div className="story-menu"><button type="button" onClick={() => { onReport(); setMenuOpen(false); }}>Report story</button><button type="button" onClick={() => setMenuOpen(false)}>Close menu</button></div>}
        </div>
      </div>
      <div className="story-photo-wrap">
        <img className="story-photo" src={story.image} alt={`Travel moment from ${story.destination}`} />
        <span className="photo-location"><span aria-hidden="true">⌖</span> {story.destination}</span>
      </div>
      <div className="story-copy">
        <div className="story-title-row"><h3>{story.title}</h3><button className={`icon-button bookmark-button ${isSaved ? 'is-active' : ''}`} type="button" aria-label={isSaved ? 'Remove saved story' : 'Save story'} aria-pressed={isSaved} onClick={onSave}>{isSaved ? '▣' : '▢'}</button></div>
        <p>{story.body}</p>
        {taggedPlace && <div className="story-place-tag"><span className="story-place-icon">{categoryIcon(taggedPlace.category)}</span><span><small>MENTIONED IN THIS STORY</small><strong>{taggedPlace.name} · {taggedPlace.area}</strong></span><button type="button" onClick={() => onAddPlace(taggedPlace)}>Add to trip <span>＋</span></button></div>}
        <div className="story-actions">
          <div className="story-reactions"><button className={`reaction-button ${isLiked ? 'is-liked' : ''}`} type="button" onClick={onLike} aria-pressed={isLiked}><span aria-hidden="true">{isLiked ? '♥' : '♡'}</span> {story.likes + (isLiked ? 1 : 0)}</button><span className="action-divider" /><button className="subtle-action" type="button" onClick={() => navigator.clipboard?.writeText(window.location.href).catch(() => undefined)}>↗ Share</button></div>
          <button className={`follow-button ${isFollowing ? 'following' : ''}`} type="button" onClick={onFollow}>{isFollowing ? 'Following' : 'Follow'}</button>
        </div>
      </div>
    </article>
  );
}

function PlaceCard({
  place,
  isSaved,
  onSave,
  onAdd,
  onOpen,
}: {
  place: Place;
  isSaved: boolean;
  onSave: () => void;
  onAdd: () => void;
  onOpen: () => void;
}) {
  return (
    <article className="place-card">
      <div className="place-image-area">
        <button className="place-image-button" type="button" onClick={onOpen} aria-label={`View ${place.name}`}><img src={place.image} alt="" loading="lazy" /></button>
        <span className={`place-category category-${place.category.toLowerCase()}`}><span aria-hidden="true">{categoryIcon(place.category)}</span>{categoryMeta[place.category].label}</span>
        <button className={`place-save icon-button ${isSaved ? 'is-active' : ''}`} type="button" aria-label={isSaved ? 'Remove from saved' : 'Save place'} aria-pressed={isSaved} onClick={onSave}>{isSaved ? '▣' : '▢'}</button>
      </div>
      <div className="place-card-body">
        <div className="place-area"><span>⌖ {place.area}</span><span className="place-tag">{place.tag}</span></div>
        <h3><button type="button" onClick={onOpen}>{place.name}</button></h3>
        <p>{place.description}</p>
        <div className="place-card-bottom"><span className="place-price">{place.price}</span><button className="add-stop-button" type="button" onClick={onAdd}><span aria-hidden="true">＋</span> Add to trip</button></div>
      </div>
    </article>
  );
}

function RightRail({ onExplore, trips }: { onExplore: (destination?: string) => void; trips: Trip[] }) {
  return (
    <aside className="right-rail">
      <section className="rail-section">
        <div className="rail-heading"><div><p className="eyebrow">A PLACE TO START</p><h2>Popular this week</h2></div><button type="button" className="rail-link" onClick={() => onExplore()}>See all ↗</button></div>
        <div className="popular-list">
          {destinations.slice(1, 4).map((destination, index) => (
            <button className="popular-destination" type="button" key={destination.name} onClick={() => onExplore(destination.name)}>
              <span className="popular-number">0{index + 1}</span><img src={destination.image} alt="" loading="lazy" /><span><strong>{destination.name.split(',')[0]}</strong><small>{destination.country} <b>·</b> {destination.note}</small></span><span className="popular-arrow">↗</span>
            </button>
          ))}
        </div>
      </section>
      <section className="rail-trip-card">
        <div className="rail-heading"><div><p className="eyebrow">A SMALL REMINDER</p><h2>Good plans leave<br />room for wonder.</h2></div></div>
        <p>Save a few ideas. Let the rest happen along the way.</p>
        <button className="text-arrow" type="button" onClick={() => onExplore()}>Find an idea <span>↗</span></button>
      </section>
      <div className="data-note"><span aria-hidden="true">ⓘ</span><p>Travel details in this demo are sample content. Confirm hours, prices, routes, and availability with providers before you go.</p></div>
      {trips.length > 0 && <div className="rail-trip-count"><span className="tiny-spark">✳</span> {trips.length} trip{trips.length === 1 ? '' : 's'} in your notebook</div>}
    </aside>
  );
}

function HomeView({
  stories,
  trips,
  likedIds,
  savedIds,
  following,
  onOpenTrip,
  onLike,
  onSave,
  onFollow,
  onReport,
  onAddPlace,
  onExplore,
  onCreateTrip,
}: {
  stories: Story[];
  trips: Trip[];
  likedIds: string[];
  savedIds: string[];
  following: string[];
  onOpenTrip: (trip: Trip) => void;
  onLike: (story: Story) => void;
  onSave: (key: string) => void;
  onFollow: (handle: string) => void;
  onReport: (name: string) => void;
  onAddPlace: (place: Place) => void;
  onExplore: (destination?: string) => void;
  onCreateTrip: () => void;
}) {
  const spotlightTrip = trips.find((trip) => trip.startDate && trip.startDate >= new Date().toISOString().slice(0, 10)) || trips[0];
  const [feedMode, setFeedMode] = useState<'For you' | 'Following'>('For you');
  const filteredStories = feedMode === 'Following' ? stories.filter((story) => following.includes(story.handle)) : stories;
  return (
    <div className="home-layout">
      <div className="feed-column">
        <div className="welcome-row">
          <div><p className="eyebrow">THURSDAY, OCTOBER 15</p><h1>Make room for <em>somewhere.</em></h1><p className="page-subtitle">A few good ideas for the miles ahead.</p></div>
          <div className="welcome-stamp" aria-hidden="true"><span>✳</span><small>GO<br />WANDER</small></div>
        </div>
        <TripSpotlight trip={spotlightTrip} onOpen={onOpenTrip} onCreate={onCreateTrip} />
        <section className="feed-section">
          <div className="section-topline"><div><p className="eyebrow">FROM THE COMMUNITY</p><h2>Notes from the road</h2></div><div className="feed-tabs" role="group" aria-label="Feed filter"><button className={feedMode === 'For you' ? 'selected' : ''} type="button" onClick={() => setFeedMode('For you')}>For you</button><button className={feedMode === 'Following' ? 'selected' : ''} type="button" onClick={() => setFeedMode('Following')}>Following</button></div></div>
          {filteredStories.length > 0 ? filteredStories.map((story) => (
            <StoryCard key={story.id} story={story} isLiked={likedIds.includes(story.id)} isSaved={savedIds.includes(`story:${story.id}`)} isFollowing={following.includes(story.handle)}
              onLike={() => onLike(story)} onSave={() => onSave(`story:${story.id}`)} onFollow={() => onFollow(story.handle)} onReport={() => onReport(story.title)} onAddPlace={onAddPlace} />
          )) : <div className="empty-card"><span>✳</span><h3>Your circle is still finding its feet.</h3><p>Follow a traveler from a story to see their notes here.</p><button type="button" className="text-arrow" onClick={() => setFeedMode('For you')}>Explore community stories ↗</button></div>}
        </section>
      </div>
      <RightRail onExplore={onExplore} trips={trips} />
    </div>
  );
}

function ExploreView({
  query,
  initialDestination,
  savedIds,
  onSave,
  onAdd,
  onOpenPlace,
  onDestinationChange,
}: {
  query: string;
  initialDestination: string;
  savedIds: string[];
  onSave: (key: string) => void;
  onAdd: (place: Place) => void;
  onOpenPlace: (place: Place) => void;
  onDestinationChange: (value: string) => void;
}) {
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [destination, setDestination] = useState(initialDestination);
  useEffect(() => setDestination(initialDestination), [initialDestination]);
  const filtered = starterPlaces.filter((place) => {
    const queryMatch = !query || `${place.name} ${place.area} ${place.destination} ${place.description} ${place.category}`.toLowerCase().includes(query.toLowerCase());
    const categoryMatch = category === 'All' || place.category === category;
    const destinationMatch = !destination || place.destination === destination;
    return queryMatch && categoryMatch && destinationMatch;
  });
  const setDestinationAndNotify = (value: string) => {
    setDestination(value);
    onDestinationChange(value);
  };
  return (
    <div className="standard-page">
      <PageHeading eyebrow="THE WORLD, A LITTLE CLOSER" title={<>Find your <em>kind of place.</em></>} detail="Traveler stories, thoughtful stays, good tables, and ways to get there." />
      <section className="destination-showcase" aria-label="Featured destinations">
        <div className="destination-showcase-header"><div><p className="eyebrow">A FEW PLACES ON OUR MIND</p><h2>Where to next?</h2></div><span className="showcase-note">Ideas from the community <span>✳</span></span></div>
        <div className="destination-grid">
          {destinations.map((item) => (
            <button className={`destination-tile ${destination === item.name ? 'chosen' : ''}`} type="button" key={item.name} onClick={() => setDestinationAndNotify(destination === item.name ? '' : item.name)} style={{ backgroundImage: `linear-gradient(0deg, rgba(20,35,29,.75), rgba(20,35,29,0) 70%), url("${item.image}")` }}>
              <span className="destination-tile-temp">{item.temperature} <small>°</small></span><span className="destination-tile-copy"><small>{item.country}</small><strong>{item.name.split(',')[0]}</strong><em>{item.note}</em></span><span className="tile-arrow">↗</span>
            </button>
          ))}
        </div>
      </section>
      <section className="places-section">
        <div className="places-heading"><div><p className="eyebrow">THE USEFUL DETAILS</p><h2>Good places, <em>good people.</em></h2><p>Browse traveler notes for stays, food, things to do, and getting around.</p></div>
          <label className="destination-select-label">DESTINATION
            <select value={destination} onChange={(event) => setDestinationAndNotify(event.target.value)} aria-label="Filter by destination"><option value="">All destinations</option>{destinations.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}</select>
          </label>
        </div>
        <div className="category-filters" role="group" aria-label="Filter places by category">
          {(['All', 'Stay', 'Food', 'Sightseeing', 'Transport'] as CategoryFilter[]).map((item) => <button type="button" className={category === item ? 'selected' : ''} key={item} onClick={() => setCategory(item)}><span aria-hidden="true">{item === 'All' ? '✳' : categoryIcon(item)}</span>{item === 'All' ? 'Everything' : categoryMeta[item].label}</button>)}
        </div>
        {filtered.length > 0 ? <div className="place-grid">{filtered.map((place) => <PlaceCard key={place.id} place={place} isSaved={savedIds.includes(`place:${place.id}`)} onSave={() => onSave(`place:${place.id}`)} onAdd={() => onAdd(place)} onOpen={() => onOpenPlace(place)} />)}</div> : <div className="empty-card empty-search"><span>⌕</span><h3>No places found just yet.</h3><p>Try another destination or clear the search.</p><button className="text-arrow" type="button" onClick={() => { setDestinationAndNotify(''); setCategory('All'); }}>Clear filters ↗</button></div>}
        <p className="sample-data-note">Sample guide content · Place details, pricing, hours, and routes are illustrative. Check the linked provider before making plans.</p>
      </section>
    </div>
  );
}

function TripsView({ trips, onOpen, onCreate, onDuplicate, onDelete }: { trips: Trip[]; onOpen: (trip: Trip) => void; onCreate: () => void; onDuplicate: (trip: Trip) => void; onDelete: (trip: Trip) => void }) {
  return (
    <div className="standard-page">
      <PageHeading eyebrow="YOUR NOTEBOOK" title={<>Trips with <em>room to roam.</em></>} detail="Collect a few good ideas, then leave space for the unexpected." action={<button className="button button-dark" type="button" onClick={onCreate}><span>＋</span> Plan a trip</button>} />
      {trips.length ? <div className="trip-grid">
        {trips.map((trip) => (
          <article className="trip-card" key={trip.id}>
            <button className="trip-card-image" type="button" onClick={() => onOpen(trip)} style={{ backgroundImage: `linear-gradient(0deg, rgba(19,34,28,.63), rgba(19,34,28,0) 75%), url("${trip.image}")` }}>
              <span className="trip-visibility">◉ {trip.visibility}</span><span className="trip-card-place">{trip.destination.split(',')[0]}</span>
            </button>
            <div className="trip-card-details"><div className="trip-card-top"><span className="trip-date">{dateRange(trip.startDate, trip.endDate)}</span><span className="trip-item-count">{trip.items.length} stops</span></div><h2>{trip.title}</h2><p>{trip.notes || 'A little room to wander, and a few places worth finding.'}</p><div className="trip-card-actions"><button type="button" className="text-arrow" onClick={() => onOpen(trip)}>Open itinerary <span>↗</span></button><button type="button" className="small-quiet-button" onClick={() => onDuplicate(trip)}>Duplicate</button><button type="button" className="small-quiet-button danger" onClick={() => onDelete(trip)}>Delete</button></div></div>
          </article>
        ))}
      </div> : <div className="empty-card empty-trips"><span>⌖</span><h3>Your travel notebook is waiting.</h3><p>Start with the place you can’t stop thinking about.</p><button className="button button-dark" type="button" onClick={onCreate}>Plan your first trip <span>↗</span></button></div>}
    </div>
  );
}

function TripDetail({ trip, onBack, onAddPlace, onRemoveItem, onDuplicate, onEditVisibility }: {
  trip: Trip;
  onBack: () => void;
  onAddPlace: (place: Place) => void;
  onRemoveItem: (itemId: string) => void;
  onDuplicate: () => void;
  onEditVisibility: (visibility: Visibility) => void;
}) {
  const days = daysForTrip(trip);
  const unscheduled = trip.items.filter((item) => !item.date || !days.includes(item.date));
  const [activePanel, setActivePanel] = useState<'Itinerary' | 'Explore places'>('Itinerary');
  const destinationPlaces = starterPlaces.filter((place) => place.destination === trip.destination);
  const dateForDay = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' });
  const itemsForDay = (date: string) => trip.items.filter((item) => item.date === date).sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  return (
    <div className="standard-page trip-detail-page">
      <button className="back-link" type="button" onClick={onBack}>← <span>All trips</span></button>
      <section className="trip-detail-hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(20,38,30,.86), rgba(20,38,30,.18)), url("${trip.image}")` }}>
        <div className="trip-detail-copy"><p className="overline-light">YOUR TRAVEL NOTEBOOK</p><h1>{trip.destination.split(',')[0]}<br /><em>{trip.title}</em></h1><div className="spotlight-meta"><span>▦ {dateRange(trip.startDate, trip.endDate)}</span><span>⌖ {trip.items.length} stops saved</span></div></div>
        <div className="trip-detail-controls"><label className="visibility-control"><span>◉</span><select value={trip.visibility} onChange={(event) => onEditVisibility(event.target.value as Visibility)} aria-label="Trip visibility"><option>Private</option><option>Followers</option><option>Public</option></select></label><button className="icon-button trip-detail-more" type="button" onClick={onDuplicate} aria-label="Duplicate trip">⧉</button></div>
      </section>
      <div className="trip-detail-tabs" role="tablist" aria-label="Trip sections"><button className={activePanel === 'Itinerary' ? 'selected' : ''} type="button" role="tab" aria-selected={activePanel === 'Itinerary'} onClick={() => setActivePanel('Itinerary')}>Itinerary <span>{trip.items.length}</span></button><button className={activePanel === 'Explore places' ? 'selected' : ''} type="button" role="tab" aria-selected={activePanel === 'Explore places'} onClick={() => setActivePanel('Explore places')}>Find places <span>＋</span></button></div>
      {activePanel === 'Itinerary' ? (
        <div className="itinerary-layout">
          <div className="itinerary-main">
            {trip.notes && <div className="trip-note"><span>✎</span><p>{trip.notes}</p></div>}
            {days.length > 0 ? days.map((day, index) => {
              const items = itemsForDay(day);
              return <section className="itinerary-day" key={day}><div className="day-label"><span className="day-number">{String(index + 1).padStart(2, '0')}</span><span><strong>{dateForDay(day)}</strong><small>{items.length ? `${items.length} planned ${items.length === 1 ? 'stop' : 'stops'}` : 'A little room to wander'}</small></span><button type="button" className="day-add" onClick={() => setActivePanel('Explore places')} aria-label={`Add a place to day ${index + 1}`}>＋</button></div>
                {items.length ? <div className="day-items">{items.map((item) => <ItineraryRow key={item.id} item={item} onRemove={() => onRemoveItem(item.id)} />)}</div> : <div className="day-empty"><span>✳</span><p>Nothing on the calendar yet. Keep it that way, or add a little idea.</p><button type="button" onClick={() => setActivePanel('Explore places')}>Find a place <span>↗</span></button></div>}
              </section>;
            }) : <div className="date-reminder"><span>▦</span><div><strong>Planning without dates is welcome.</strong><p>Add dates to see your plans laid out by day. Your saved stops stay right here in the meantime.</p></div></div>}
            {unscheduled.length > 0 && <section className="itinerary-day unscheduled-day"><div className="day-label"><span className="day-number">✳</span><span><strong>Whenever feels right</strong><small>{unscheduled.length} unscheduled {unscheduled.length === 1 ? 'idea' : 'ideas'}</small></span></div><div className="day-items">{unscheduled.map((item) => <ItineraryRow key={item.id} item={item} onRemove={() => onRemoveItem(item.id)} />)}</div></section>}
            <button className="add-another-stop" type="button" onClick={() => setActivePanel('Explore places')}><span>＋</span> Add another stop</button>
          </div>
          <aside className="itinerary-aside"><div className="aside-card"><p className="eyebrow">A LITTLE INSPIRATION</p><h3>Good things nearby</h3>{destinationPlaces.slice(0, 3).map((place) => <button className="mini-place" type="button" key={place.id} onClick={() => onAddPlace(place)}><img src={place.image} alt="" /><span><strong>{place.name}</strong><small>{place.area} · {categoryMeta[place.category].label}</small></span><i>＋</i></button>)}<button className="text-arrow" type="button" onClick={() => setActivePanel('Explore places')}>Explore all places <span>↗</span></button></div><div className="aside-privacy"><span>◉</span><p><strong>Your trip is {trip.visibility.toLowerCase()}.</strong><br />Only people you choose can see your plans.</p></div></aside>
        </div>
      ) : (
        <div className="trip-place-panel"><div className="places-heading"><div><p className="eyebrow">FOR YOUR TRIP</p><h2>Make a little <em>room for this.</em></h2><p>These are sample guide listings. Check details with providers before you go.</p></div></div><div className="place-grid">{destinationPlaces.map((place) => <PlaceCard key={place.id} place={place} isSaved={false} onSave={() => undefined} onAdd={() => onAddPlace(place)} onOpen={() => undefined} />)}</div></div>
      )}
    </div>
  );
}

function ItineraryRow({ item, onRemove }: { item: ItineraryItem; onRemove: () => void }) {
  const place = item.placeId ? starterPlaces.find((entry) => entry.id === item.placeId) : undefined;
  return <article className="itinerary-row"><div className={`itinerary-icon itinerary-${item.category.toLowerCase()}`}>{categoryIcon(item.category)}</div><div className="itinerary-item-copy"><span className="itinerary-category">{item.category}</span><strong>{item.title}</strong>{item.note && <small>{item.note}</small>}</div><span className="itinerary-time">{item.time || (place ? place.area : 'Anytime')}</span><button className="icon-button remove-stop" type="button" onClick={onRemove} aria-label={`Remove ${item.title}`}>×</button></article>;
}

function SavedView({ savedIds, stories, onSave, onExplore, onAddPlace }: { savedIds: string[]; stories: Story[]; onSave: (key: string) => void; onExplore: () => void; onAddPlace: (place: Place) => void }) {
  const savedPlaces = savedIds.filter((value) => value.startsWith('place:')).map((value) => starterPlaces.find((place) => place.id === value.slice(6))).filter((value): value is Place => Boolean(value));
  const savedStories = savedIds.filter((value) => value.startsWith('story:')).map((value) => stories.find((story) => story.id === value.slice(6))).filter((value): value is Story => Boolean(value));
  return (
    <div className="standard-page">
      <PageHeading eyebrow="THE THINGS YOU KEEP" title={<>Saved for <em>somewhere.</em></>} detail="Little bookmarks for the trip you’re planning, and the ones still on your mind." />
      {!savedPlaces.length && !savedStories.length ? <div className="empty-card empty-trips"><span>▢</span><h3>A place for the good finds.</h3><p>Save a story or place and it’ll be waiting here when you need it.</p><button className="button button-dark" type="button" onClick={onExplore}>Find something good <span>↗</span></button></div> : <>
        {savedPlaces.length > 0 && <section className="saved-section"><div className="places-heading"><div><p className="eyebrow">PLACES TO REMEMBER</p><h2>Your saved <em>places.</em></h2></div></div><div className="place-grid">{savedPlaces.map((place) => <PlaceCard key={place.id} place={place} isSaved onSave={() => onSave(`place:${place.id}`)} onAdd={() => onAddPlace(place)} onOpen={() => undefined} />)}</div></section>}
        {savedStories.length > 0 && <section className="saved-section"><div className="places-heading"><div><p className="eyebrow">STORIES YOU KEPT</p><h2>Good notes from <em>the road.</em></h2></div></div><div className="saved-story-list">{savedStories.map((story) => <article className="saved-story" key={story.id}><img src={story.image} alt="" /><div><span className="eyebrow">{story.destination}</span><h3>{story.title}</h3><p>{story.body}</p></div><button className="small-quiet-button" type="button" onClick={() => onSave(`story:${story.id}`)}>Remove</button></article>)}</div></section>}
      </>}
    </div>
  );
}

function Modal({ title, eyebrow, onClose, children, className = '' }: { title: string; eyebrow: string; onClose: () => void; children: React.ReactNode; className?: string }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className={`modal-card ${className}`} role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-head"><div><p className="eyebrow">{eyebrow}</p><h2 id="modal-title">{title}</h2></div><button className="icon-button modal-close" type="button" onClick={onClose} aria-label="Close dialog">×</button></div>{children}</section></div>;
}

function CreateTripModal({ onClose, onCreate }: { onClose: () => void; onCreate: (trip: Trip) => void }) {
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const destination = String(form.get('destination') || '');
    const selected = destinations.find((entry) => entry.name === destination);
    onCreate({
      id: id('trip'),
      title: String(form.get('title') || `A trip to ${destination.split(',')[0]}`),
      destination,
      startDate: String(form.get('startDate') || '') || undefined,
      endDate: String(form.get('endDate') || '') || undefined,
      visibility: String(form.get('visibility') || 'Private') as Visibility,
      notes: String(form.get('notes') || ''),
      image: selected?.image || destinations[0].image,
      items: [],
    });
  };
  return <Modal title="Start with a place." eyebrow="MAKE A LITTLE PLAN" onClose={onClose} className="create-modal">
    <form className="modal-form" onSubmit={submit}>
      <label>What shall we call this trip?<input name="title" placeholder="A long weekend in..." maxLength={80} /></label>
      <label>Where are you going?<select name="destination" required defaultValue=""><option value="" disabled>Choose a destination</option>{destinations.map((destination) => <option key={destination.name} value={destination.name}>{destination.name}</option>)}</select></label>
      <div className="form-row"><label>Leaving<input name="startDate" type="date" /></label><label>Coming back<input name="endDate" type="date" /></label></div>
      <label>Who can see this plan?<select name="visibility" defaultValue="Private"><option>Private</option><option>Followers</option><option>Public</option></select></label>
      <label>Anything you want to remember?<textarea name="notes" rows={3} placeholder="A slower pace, a birthday dinner, a place someone told you about..." /></label>
      <div className="modal-form-foot"><p>Dates can wait. You can set them later.</p><button className="button button-dark" type="submit">Create trip <span>↗</span></button></div>
    </form>
  </Modal>;
}

async function preparePhoto(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const maxDimension = 1600;
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Photo preview is unavailable.');
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', 0.82);
}

function CreateStoryModal({ onClose, onPublish }: { onClose: () => void; onPublish: (story: Story) => void }) {
  const [photo, setPhoto] = useState('');
  const [photoName, setPhotoName] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const body = String(form.get('body') || '').trim();
    if (!body && !photo) { setPhotoError('Add a few words or a photo to share your story.'); return; }
    onPublish({
      id: id('story'),
      author: 'Maya Mehta',
      handle: '@mayamehta',
      avatar: 'MM',
      destination: String(form.get('destination') || 'Somewhere on the way'),
      date: 'Just now',
      title: String(form.get('title') || 'A note from the road'),
      body,
      image: photo || destinations[0].image,
      visibility: String(form.get('visibility') || 'Public') as Visibility,
      likes: 0,
    });
  };
  const onPhoto = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setPhotoError('Choose an image file.'); return; }
    if (file.size > 12 * 1024 * 1024) { setPhotoError('Choose a photo smaller than 12 MB.'); return; }
    setIsProcessing(true);
    setPhotoError('');
    setPhotoName(file.name);
    try { setPhoto(await preparePhoto(file)); }
    catch { setPhotoError('We couldn’t prepare that photo. Try another one.'); }
    finally { setIsProcessing(false); }
  };
  return <Modal title="A note from the road." eyebrow="SHARE A STORY" onClose={onClose} className="create-modal story-modal">
    <form className="modal-form" onSubmit={submit}>
      <label>Give this moment a title<input name="title" placeholder="A morning I want to remember..." maxLength={100} /></label>
      <label>Your story<textarea name="body" rows={5} placeholder="What did you see, taste, hear, or learn?" maxLength={2400} /></label>
      <label>Where was it?<select name="destination" defaultValue={destinations[0].name}><option value="Somewhere on the way">Somewhere on the way</option>{destinations.map((destination) => <option key={destination.name}>{destination.name}</option>)}</select></label>
      <label>Who can see this story?<select name="visibility" defaultValue="Public"><option>Public</option><option>Followers</option><option>Private</option></select></label>
      <div className="photo-upload-area">
        {photo ? <div className="upload-preview"><img src={photo} alt="Preview of the selected travel photo" /><span>{photoName}</span><button type="button" className="small-quiet-button danger" onClick={() => { setPhoto(''); setPhotoName(''); }}>Remove</button></div> : <label className="upload-drop"><input type="file" accept="image/*" onChange={(event) => void onPhoto(event.target.files?.[0])} /><span className="upload-icon">▧</span><strong>{isProcessing ? 'Getting your photo ready…' : 'Add a travel photo'}</strong><small>JPG, PNG, or HEIC · up to 12 MB</small></label>}
        {photoError && <p className="form-error" role="alert">{photoError}</p>}
      </div>
      <div className="modal-form-foot"><p>Photo location data isn’t shared from this preview.</p><button className="button button-dark" type="submit" disabled={isProcessing}>Share story <span>↗</span></button></div>
    </form>
  </Modal>;
}

function PlaceDetailsModal({ place, onClose, onAdd, isSaved, onSave }: { place: Place; onClose: () => void; onAdd: () => void; isSaved: boolean; onSave: () => void }) {
  return <Modal title={place.name} eyebrow={`${categoryMeta[place.category].label} · ${place.destination}`} onClose={onClose} className="place-details-modal">
    <img className="details-image" src={place.image} alt="" /><div className="details-content"><div className="details-badges"><span className={`place-category category-${place.category.toLowerCase()}`}>{categoryIcon(place.category)} {categoryMeta[place.category].label}</span><span className="place-area">⌖ {place.area}</span></div><p>{place.description}</p><div className="details-info-grid"><div><small>PRICE GUIDE</small><strong>{place.price}</strong></div><div><small>INFORMATION SOURCE</small><strong>{place.source}</strong></div></div><p className="detail-caveat">Sample guide content. Hours, prices, availability, and transport details are not live data; confirm with the provider before visiting.</p><div className="details-actions">{place.link && <a className="button button-outline" href={place.link} target="_blank" rel="noreferrer">Check provider ↗</a>}<button className="button button-outline" type="button" onClick={onSave}>{isSaved ? 'Saved ✓' : 'Save place'}</button><button className="button button-dark" type="button" onClick={onAdd}>Add to trip <span>＋</span></button></div></div>
  </Modal>;
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { if (!message) return; const timeout = window.setTimeout(onClose, 3600); return () => window.clearTimeout(timeout); }, [message, onClose]);
  if (!message) return null;
  return <div className="toast-message" role="status"><span>✓</span>{message}<button type="button" aria-label="Dismiss message" onClick={onClose}>×</button></div>;
}

export default function App() {
  const [activeView, setActiveView] = useState<View>('home');
  const [trips, setTrips] = useStoredState(storageKeys.trips, starterTrips);
  const [stories, setStories] = useStoredState(storageKeys.stories, starterStories);
  const [savedIds, setSavedIds] = useStoredState<string[]>(storageKeys.saved, ['place:food-lisbon-1', 'story:story-2']);
  const [likedIds, setLikedIds] = useStoredState<string[]>(storageKeys.liked, ['story-1']);
  const [following, setFollowing] = useStoredState<string[]>(storageKeys.following, ['@mayawanders', '@jonahoutside']);
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState<'trip' | 'story' | null>(null);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [exploreDestination, setExploreDestination] = useState('');
  const [toast, setToast] = useState('');
  const currentTrip = trips.find((trip) => trip.id === selectedTripId);

  const visibleStories = useMemo(() => stories.filter((story) => {
    if (story.visibility === 'Private' && story.author !== 'Maya Mehta') return false;
    return !query || `${story.title} ${story.body} ${story.destination} ${story.author}`.toLowerCase().includes(query.toLowerCase());
  }), [stories, query]);

  const changeView = (view: View) => {
    setSelectedTripId(null);
    setActiveView(view);
    setExploreDestination('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const openTrip = (trip: Trip) => { setSelectedTripId(trip.id); setActiveView('trips'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const announce = (message: string) => setToast(message);
  const toggleSaved = (key: string) => {
    const exists = savedIds.includes(key);
    setSavedIds(exists ? savedIds.filter((entry) => entry !== key) : [...savedIds, key]);
    announce(exists ? 'Removed from your saved list.' : 'Saved for later.');
  };
  const toggleLike = (story: Story) => setLikedIds(likedIds.includes(story.id) ? likedIds.filter((entry) => entry !== story.id) : [...likedIds, story.id]);
  const toggleFollow = (handle: string) => {
    const exists = following.includes(handle);
    setFollowing(exists ? following.filter((entry) => entry !== handle) : [...following, handle]);
    announce(exists ? 'You unfollowed this traveler.' : 'You’re following this traveler.');
  };
  const addPlaceToTrip = (place: Place, tripId = currentTrip?.id || trips[0]?.id) => {
    if (!tripId) { setModal('trip'); announce('Create a trip before saving a stop.'); return; }
    setTrips((previous) => previous.map((trip) => {
      if (trip.id !== tripId) return trip;
      const alreadyAdded = trip.items.some((item) => item.placeId === place.id);
      if (alreadyAdded) return trip;
      return { ...trip, items: [...trip.items, { id: id('item'), placeId: place.id, title: place.name, category: place.category, date: trip.startDate }] };
    }));
    const target = trips.find((trip) => trip.id === tripId);
    announce(target?.items.some((item) => item.placeId === place.id) ? 'That stop is already in this trip.' : `Added ${place.name} to ${target?.destination.split(',')[0]}.`);
  };
  const createTrip = (trip: Trip) => {
    setTrips((previous) => [trip, ...previous]);
    setModal(null);
    setSelectedTripId(trip.id);
    setActiveView('trips');
    announce('Your trip is ready for a few good ideas.');
  };
  const createStory = (story: Story) => {
    setStories((previous) => [story, ...previous]);
    setModal(null);
    setActiveView('home');
    announce('Your story is on its way.');
  };
  const duplicateTrip = (trip: Trip) => {
    const copy = { ...trip, id: id('trip'), title: `${trip.title} (copy)`, visibility: 'Private' as Visibility, items: trip.items.map((item) => ({ ...item, id: id('item') })) };
    setTrips((previous) => [copy, ...previous]);
    setSelectedTripId(copy.id);
    setActiveView('trips');
    announce('A private copy of the trip is ready.');
  };
  const deleteTrip = (trip: Trip) => {
    if (!window.confirm(`Delete “${trip.title}” from your notebook?`)) return;
    setTrips((previous) => previous.filter((entry) => entry.id !== trip.id));
    if (selectedTripId === trip.id) setSelectedTripId(null);
    announce('Trip removed from your notebook.');
  };
  const reportStory = (title: string) => {
    announce(`Report recorded for review: “${title}”.`);
  };
  const navigateExplore = (destination?: string) => {
    setSelectedTripId(null);
    setActiveView('explore');
    setExploreDestination(destination || '');
    setQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewTitle = activeView === 'explore' ? 'Explore' : activeView === 'trips' ? 'My trips' : activeView === 'saved' ? 'Saved' : 'Home feed';
  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} onNavigate={changeView} onCreateTrip={() => setModal('trip')} />
      <div className="app-main">
        <Topbar query={query} setQuery={setQuery} onStory={() => setModal('story')} />
        <main className="main-content" id="main-content">
          {currentTrip && activeView === 'trips' ? <TripDetail trip={currentTrip} onBack={() => setSelectedTripId(null)} onAddPlace={(place) => addPlaceToTrip(place, currentTrip.id)} onRemoveItem={(itemId) => setTrips((previous) => previous.map((trip) => trip.id === currentTrip.id ? { ...trip, items: trip.items.filter((item) => item.id !== itemId) } : trip))} onDuplicate={() => duplicateTrip(currentTrip)} onEditVisibility={(visibility) => setTrips((previous) => previous.map((trip) => trip.id === currentTrip.id ? { ...trip, visibility } : trip))} /> :
            activeView === 'home' ? <HomeView stories={visibleStories} trips={trips} likedIds={likedIds} savedIds={savedIds} following={following} onOpenTrip={openTrip} onLike={toggleLike} onSave={toggleSaved} onFollow={toggleFollow} onReport={reportStory} onAddPlace={addPlaceToTrip} onExplore={navigateExplore} onCreateTrip={() => setModal('trip')} /> :
            activeView === 'explore' ? <ExploreView query={query} initialDestination={exploreDestination} savedIds={savedIds} onSave={toggleSaved} onAdd={addPlaceToTrip} onOpenPlace={setSelectedPlace} onDestinationChange={setExploreDestination} /> :
            activeView === 'trips' ? <TripsView trips={trips} onOpen={openTrip} onCreate={() => setModal('trip')} onDuplicate={duplicateTrip} onDelete={deleteTrip} /> :
            <SavedView savedIds={savedIds} stories={stories} onSave={toggleSaved} onExplore={() => navigateExplore()} onAddPlace={addPlaceToTrip} />}
          <footer className="app-footer"><span>roamly<span className="brand-period">.</span></span><span>Keep the good parts of getting there.</span><span className="footer-demo">SAMPLE GUIDE CONTENT · NOT LIVE DATA</span></footer>
        </main>
        <nav className="mobile-nav" aria-label="Mobile navigation">{(['home', 'explore', 'trips', 'saved'] as View[]).map((view) => <button type="button" key={view} className={activeView === view ? 'active' : ''} onClick={() => changeView(view)} aria-current={activeView === view ? 'page' : undefined}><span aria-hidden="true">{view === 'home' ? '⌂' : view === 'explore' ? '⌕' : view === 'trips' ? '▤' : '♡'}</span>{view === 'home' ? 'Home' : view === 'explore' ? 'Explore' : view === 'trips' ? 'Trips' : 'Saved'}</button>)}</nav>
      </div>
      {modal === 'trip' && <CreateTripModal onClose={() => setModal(null)} onCreate={createTrip} />}
      {modal === 'story' && <CreateStoryModal onClose={() => setModal(null)} onPublish={createStory} />}
      {selectedPlace && <PlaceDetailsModal place={selectedPlace} onClose={() => setSelectedPlace(null)} onAdd={() => { addPlaceToTrip(selectedPlace); setSelectedPlace(null); }} isSaved={savedIds.includes(`place:${selectedPlace.id}`)} onSave={() => toggleSaved(`place:${selectedPlace.id}`)} />}
      <Toast message={toast} onClose={() => setToast('')} />
      <span className="sr-only" aria-live="polite">{viewTitle}</span>
    </div>
  );
}
