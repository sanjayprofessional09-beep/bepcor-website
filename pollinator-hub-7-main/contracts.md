# BEPCoR — Backend Contracts

## Base
- Backend base: `${REACT_APP_BACKEND_URL}/api`
- All endpoints prefixed with `/api`
- MongoDB via `MONGO_URL`, database `DB_NAME`
- IDs are UUID strings (never Mongo `_id`)

## Data Currently Mocked (in `/app/frontend/src/data/mock.js`)
The following will be replaced by real API responses:
- `blogPosts` → `GET /api/posts`
- Forms (newsletter/donation/volunteer/contact) currently `toast()` only → will POST to backend

Data that stays as static frontend constants (design/content):
- `heroSlides`, `stats`, `missionPillars`, `programs`, `pollinatorGroups`, `impactStories`, `team`, `faqs`, `donationTiers`, `partners`, `siteInfo`, `BRAND_LOGO`

## Endpoints

### Newsletter
- `POST /api/newsletter/subscribe`
  - Body: `{ email: string }`
  - Response: `{ id, email, subscribed_at }`
  - 409 if email already exists

### Donations (records only — no payment gateway)
- `POST /api/donations`
  - Body: `{ name, email, phone?, amount:int, tier?:string }`
  - Response: `{ id, ...body, status: 'pending', created_at }`

### Volunteer Applications
- `POST /api/volunteers`
  - Body: `{ name, email, interest, message? }`
  - Response: `{ id, ...body, created_at }`

### Contact
- `POST /api/contact`
  - Body: `{ name, email, subject?, message }`
  - Response: `{ id, ...body, created_at }`

### Posts (Blog / Field Journal)
- `GET /api/posts` → list of posts (seeded once on server startup)
  - Query params: `?category=Pollinators&q=bees`
- `GET /api/posts/:slug` → single post

## Frontend Integration Plan
- Add `/app/frontend/src/lib/api.js` — thin axios wrapper using `${REACT_APP_BACKEND_URL}/api`
- Replace mock references:
  - `Footer.jsx` newsletter form → `api.subscribeNewsletter`
  - `GetInvolved.jsx` donate → `api.createDonation`
  - `GetInvolved.jsx` volunteer → `api.createVolunteer`
  - `Contact.jsx` message → `api.sendContact`
  - `Resources.jsx` → `api.listPosts` (with search + category filter)
- Keep toast confirmations; show server errors from response

## Mongo Collections
- `newsletter_subscribers` — { id, email, subscribed_at }
- `donations` — { id, name, email, phone, amount, tier, status, created_at }
- `volunteers` — { id, name, email, interest, message, created_at }
- `contact_messages` — { id, name, email, subject, message, created_at }
- `posts` — { id, slug, title, category, date, read_time, excerpt, image, author, content }

## Seed
- On startup, if `posts` collection is empty, insert the 6 mock posts (from previous mock.js data).
