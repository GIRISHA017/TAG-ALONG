# Tag Along

Tag Along is a web app that helps people find a companion for events they don't want to attend alone — concerts, movies, festivals, weddings, travel, food events, workshops, and more. Post an event you're going to, see who else wants to go, request to team up, and chat once you're matched.

## How it works

1. **Post your event** — Add the event details (what, where, when) and what kind of companion you're looking for. Your post becomes visible to others interested in the same or similar events.
2. **Get matched** — When someone wants to tag along, you get a notification and can view their profile before accepting or declining. A connection only happens when interest is mutual.
3. **Chat & connect** — Once matched, use in-app chat to plan logistics and get comfortable before meeting in person.
4. **Enjoy together** — Meet up and enjoy the event with your tag along. Leave a review afterward and stay in touch for future events.

## Features

- **Browse & explore events** across categories like concerts, movies, festivals, weddings, travel, food, and workshops
- **Host your own event** and specify what you're looking for in a companion
- **Team-up requests** — send and receive requests to join someone for an event, with accept/ignore handling
- **In-app chat** between matched users
- **Notifications** for new requests, matches, and messages
- **User profiles** with display info and tags
- **Authentication flow** with login, registration, password recovery, and a device-lockout/new-device-approval security flow

## Tech stack

- [Vite](https://vitejs.dev/) — build tool & dev server
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) — accessible UI components
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [React Router](https://reactrouter.com/) — routing
- [TanStack Query](https://tanstack.com/query/latest) — data/state management
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) — forms & validation
- [Framer Motion](https://www.framer.com/motion/) — animations
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) — testing

> **Note:** This is currently a front-end prototype. Events, requests, chats, and user data are stored in the browser's `localStorage` rather than a backend database, so data is local to your browser and not shared across devices.


## Project structure

```
src/
├── assets/        # Images and static assets
├── components/    # Reusable UI components (Navbar, Hero, How It Works, shadcn components, etc.)
├── contexts/      # React context providers (e.g. AuthContext)
├── hooks/         # Custom React hooks
├── lib/           # App logic: events data, auth/chat/profile storage, team-up & join requests
├── pages/         # Route-level pages (Explore, Events, EventDetail, HostEvent, Chat, Profile, Login, Register, etc.)
└── test/          # Test setup and example tests
```

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to fork the repo and open a pull request.

