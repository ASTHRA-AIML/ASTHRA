# Department Association Website — Backend Build Documentation (V1)

Reference document for building the FastAPI backend end-to-end. Follow the stages in order — each one assumes the previous is done. Route names, table names, and column names here are final for V1; don't rename mid-build unless a stage below tells you to.

---

## 1. Tech stack (locked)

| Layer | Choice |
|---|---|
| Framework | FastAPI |
| Database | MySQL |
| ORM | SQLAlchemy |
| Migrations | Alembic |
| Admin UI | REST API (JSON responses) — admin panel consumes the same API |
| Media storage | Cloudinary (images + newsletter PDFs) |
| Auth | Session-based (signed cookie via `itsdangerous`), single admin |

---

## 2. Folder structure

```
department-website-backend/
├── main.py                          # FastAPI app instance, includes app_router
│
├── app/
│   ├── core/
│   │   ├── config.py                # loads .env, exposes settings
│   │   ├── security.py              # password hashing, session token sign/verify
│   │   └── dependencies.py          # require_admin() dependency
│   │
│   ├── db/
│   │   ├── database.py              # engine
│   │   └── session.py               # SessionLocal, Base, get_db()
│   │
│   ├── models/                      # SQLAlchemy ORM models (one file per table)
│   │   ├── __init__.py              # imports all models so Alembic can discover them
│   │   ├── activity.py
│   │   ├── activity_image.py
│   │   ├── newsletter.py
│   │   ├── member.py
│   │   ├── membership.py
│   │   └── admin.py
│   │
│   ├── schemas/                     # Pydantic request/response models
│   │   ├── activity_schema.py       # activityResponse
│   │   ├── newsletter_schema.py     # newsletterResponse (to be created)
│   │   ├── committee_schema.py      # committeeResponse (to be created)
│   │   └── login_schema.py          # loginRequest
│   │
│   ├── controllers/                 # route handlers, split public vs admin
│   │   ├── public/
│   │   │   ├── activity_controller.py
│   │   │   ├── newsletter_controller.py  # (to be created)
│   │   │   └── committee_controller.py  # (to be created)
│   │   └── admin/
│   │       ├── auth.py
│   │       ├── activity_admin_controller.py   # (to be created)
│   │       ├── newsletter_admin_controller.py # (to be created)
│   │       └── member_admin_controller.py     # (to be created)
│   │
│   ├── routes/                      # APIRouter definitions, mounted in __init__.py
│   │   ├── __init__.py              # app_router, includes all sub-routers
│   │   ├── activity_route.py        # GET /asthra/activities
│   │   ├── login_route.py           # POST /admin/login, POST /admin/logout
│   │   ├── newsletter_route.py      # (to be created)
│   │   ├── committee_route.py       # (to be created)
│   │   └── admin_route.py           # (to be created) — admin CRUD routes
│   │
│   ├── services/                    # business logic, called by controllers
│   │   ├── activity_service.py
│   │   ├── newsletter_service.py    # (to be created)
│   │   ├── member_service.py        # (to be created)
│   │   ├── cloudinary_service.py
│   │   └── auth_service.py          # (to be created)
│   │
│   └── scripts/
│       └── seed_admin.py            # one-off script to seed the admins table
│
├── alembic/
│   ├── versions/
│   └── env.py
│
├── .env
├── alembic.ini
├── requirements.txt
└── README.md
```

---

## 3. Database schema

Naming: tables plural snake_case, columns snake_case, every table gets `id INT PK AUTO_INCREMENT`.

### `activities`
| Column | Type | Notes |
|---|---|---|
| id | INT | PK |
| title | VARCHAR(255) | NOT NULL |
| activity_date | DATE | NOT NULL |
| thumbnail_url | VARCHAR(500) | NOT NULL — Cloudinary URL |
| description | TEXT | NOT NULL |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | ON UPDATE CURRENT_TIMESTAMP |

### `activity_images`
For the "optional additional images" on the activity detail page.
| Column | Type | Notes |
|---|---|---|
| id | INT | PK |
| activity_id | INT | FK → activities.id, ON DELETE CASCADE |
| image_url | VARCHAR(500) | NOT NULL |

### `newsletters`
| Column | Type | Notes |
|---|---|---|
| id | INT | PK |
| title | VARCHAR(255) | NOT NULL |
| cover_image_url | VARCHAR(500) | NOT NULL |
| newsletter_date | DATE | NOT NULL |
| description | TEXT | NOT NULL |
| pdf_url | VARCHAR(500) | NOT NULL — Cloudinary raw file URL |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | ON UPDATE CURRENT_TIMESTAMP |

### `members`
The person's stable identity — not tied to any single year.
| Column | Type | Notes |
|---|---|---|
| id | INT | PK |
| name | VARCHAR(255) | NOT NULL |
| photo_url | VARCHAR(500) | nullable |
| linkedin_url | VARCHAR(500) | nullable |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |
| updated_at | DATETIME | ON UPDATE CURRENT_TIMESTAMP |

### `memberships`
One row per member per academic year served. "Current committee" = query for the latest `academic_year`. No manual current/past flag.
| Column | Type | Notes |
|---|---|---|
| id | INT | PK |
| member_id | INT | FK → members.id, ON DELETE CASCADE |
| academic_year | VARCHAR(20) | NOT NULL — format `"2025-26"` |
| position | VARCHAR(100) | NOT NULL |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

### `admins`
Single row for V1, structured so "multiple admins" (future scope) needs zero schema change later.
| Column | Type | Notes |
|---|---|---|
| id | INT | PK |
| username | VARCHAR(100) | UNIQUE, NOT NULL |
| hashed_password | VARCHAR(255) | NOT NULL |
| created_at | DATETIME | DEFAULT CURRENT_TIMESTAMP |

---

## 4. Environment variables (`.env`)

```
DATABASE_URL=mysql+pymysql://user:password@host:3306/dbname
SECRET_KEY=change-this-to-a-random-string
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ADMIN_SEED_USERNAME=
ADMIN_SEED_PASSWORD=
```

`ADMIN_SEED_*` are only used once, by a seed script, to create the first row in `admins`.

---

## 5. Build sequence

### Stage 0 — Project skeleton
Create the folder structure above. Set up a virtual environment, install `fastapi`, `uvicorn`, `sqlalchemy`, `pymysql`, `alembic`, `python-dotenv`, `python-multipart`, `passlib[bcrypt]`, `itsdangerous`, `cloudinary`. Get a bare `main.py` with one `GET /health` route returning `{"status": "ok"}` running via `uvicorn main:app --reload`. In this same file, add `CORSMiddleware` — since the admin frontend is now a separate app on a different origin (not server-rendered), it needs explicit CORS with `allow_credentials=True` and your frontend's exact origin listed (not `"*"` — wildcard origins don't work with credentialed/cookie requests). Don't touch the database yet — confirm the server runs first.

### Stage 1 — Config and DB connection
Write `core/config.py` to load `.env` into a `Settings` object. Write `db/database.py` (the SQLAlchemy engine) and `db/session.py` (`SessionLocal`, declarative `Base`, and a `get_db()` generator dependency). Confirm the engine can connect to MySQL before writing any models — a broken connection string is easier to debug with nothing else built on top of it.

### Stage 2 — Models
Write all six model files under `models/`, matching the schema in section 3 exactly (column names, types, FKs). Import every model into `models/__init__.py` so Alembic can discover them via `Base.metadata`.

### Stage 3 — Migrations
Initialize Alembic (`alembic init alembic`), point `env.py` at your `Base.metadata` and `DATABASE_URL`. Generate and run the first migration — this creates all six tables in MySQL. From here on, every schema change goes through a migration, never manual `ALTER TABLE`.

### Stage 4 — Admin seed
Write a one-off script (`scripts/seed_admin.py` or similar) that reads `ADMIN_SEED_USERNAME` / `ADMIN_SEED_PASSWORD`, hashes the password, inserts the row into `admins`. Run it once. You now have a login.

### Stage 5 — Cloudinary service
Write `services/cloudinary_service.py` with one function like `upload_file(file, folder: str) -> str` that returns the hosted URL. Every other service that needs to store an image/PDF calls this — don't call the Cloudinary SDK directly from controllers.

### Stage 6 — Auth
Write `core/security.py` with `verify_password` (bcrypt via passlib) and `generate_session_token` / `verify_session_token` (signed cookie via `itsdangerous` `URLSafeSerializer`). Write `core/dependencies.py` with a `require_admin()` dependency that reads the `admin_session` cookie, verifies its signature, and returns a `RedirectResponse` to `/admin/login` if missing or invalid. Write `controllers/admin/auth.py` with `admin_login_controller` (queries DB, verifies password, sets the signed cookie) and `admin_logout_controller` (deletes the cookie). Wire them to `routes/login_route.py`. Login accepts a JSON body (`loginRequest` schema). When setting the cookie, use `samesite="none"` and `secure=True` in production (the admin frontend runs on a different origin than the API now, so `lax`/default settings will silently get the cookie dropped by the browser) — `samesite="lax"`, `secure=False` is fine for local dev over `http://localhost`. Test: POST `/admin/login` with correct credentials, confirm the `admin_session` cookie is returned and sent back on the next request.

### Stage 7 — Admin CRUD (activities → newsletters → members)
Build one module fully before starting the next. For each: service function (create/read/update/delete), controller, and route — all returning JSON (REST API). The admin panel calls these endpoints via JavaScript/fetch. Activities first since it's the simplest (no relations). Newsletters next (same shape, plus PDF upload via Cloudinary). Members + memberships last (has the one-to-many relation). Protect all admin CRUD routes with `Depends(require_admin)`.

### Stage 8 — Public API
Now that data exists (create a few real/test rows through the admin panel you just built), write the five public read-only endpoints. These return JSON via Pydantic schemas in `schemas/`, not the raw ORM objects.

### Stage 9 — Manual verification
Walk through every route in the table below using FastAPI's auto-generated `/docs` (Swagger UI) plus the admin UI in a browser. Confirm cascade deletes work (deleting a member removes its memberships; deleting an activity removes its images).

### Stage 10 — Deployment prep
Add a `requirements.txt` freeze, confirm `.env` is gitignored, decide your host, run the Alembic migrations against the production MySQL instance, set the real environment variables there, run the admin seed script once in production.

---

## 6. API endpoint reference

### Public (JSON, no auth)

| Method | Path | Purpose |
|---|---|---|
| GET | `/asthra/activities` | List: title, date, thumbnail |
| GET | `/asthra/activities/{activity_id}` | Detail: description + additional images |
| GET | `/asthra/newsletters` | List: cover, title, date |
| GET | `/asthra/newsletters/{newsletter_id}` | Detail: description + pdf url |
| GET | `/asthra/committee` | All members grouped by academic_year, each with position |

### Admin (JSON REST API, session-protected except login)

All admin endpoints (except login) require the `admin_session` cookie set by `POST /admin/login`. All request bodies are JSON. All responses are JSON.

| Method | Path | Purpose |
|---|---|---|
| POST | `/admin/login` | Accepts `loginRequest` JSON, verifies credentials, sets `admin_session` cookie |
| POST | `/admin/logout` | Clears `admin_session` cookie |
| GET | `/admin/activities` | List all activities |
| POST | `/admin/activities` | Create a new activity |
| GET | `/admin/activities/{activity_id}` | Get single activity detail |
| PUT | `/admin/activities/{activity_id}` | Update an activity |
| DELETE | `/admin/activities/{activity_id}` | Delete an activity (cascades images) |
| GET | `/admin/newsletters` | List all newsletters |
| POST | `/admin/newsletters` | Create a new newsletter |
| GET | `/admin/newsletters/{newsletter_id}` | Get single newsletter detail |
| PUT | `/admin/newsletters/{newsletter_id}` | Update a newsletter |
| DELETE | `/admin/newsletters/{newsletter_id}` | Delete a newsletter |
| GET | `/admin/members` | List all members |
| POST | `/admin/members` | Create a new member |
| GET | `/admin/members/{member_id}` | Get single member detail |
| PUT | `/admin/members/{member_id}` | Update a member |
| DELETE | `/admin/members/{member_id}` | Delete a member (cascades memberships) |
| POST | `/admin/members/{member_id}/memberships` | Add a membership row (year + position) |
| DELETE | `/admin/memberships/{membership_id}` | Remove a membership row |

---

## 7. Minimal demo frontend — prompt

Use this if you want to generate a throwaway frontend to demo the working backend to your department before the UI/UX competition finishes. Paste it into an AI coding assistant as-is.

```
Build a minimal, plain-looking static demo frontend for a college department
association website. This is NOT the final design — a design competition will
replace it later — so keep styling basic (simple CSS, no animations, no
component library needed). The goal is only to prove the backend works.

Use plain HTML, CSS, and vanilla JavaScript (fetch API) — no build step, no
framework. All data comes from a FastAPI backend running at
http://localhost:8000, from these read-only JSON endpoints:

- GET /asthra/activities            -> list: title, date, thumbnail_url
- GET /asthra/activities/{id}       -> detail: title, description, images[]
- GET /asthra/newsletters           -> list: title, date, cover_image_url
- GET /asthra/newsletters/{id}      -> detail: title, description, pdf_url
- GET /asthra/committee             -> grouped by academic_year, each with
                                     name, position, photo_url, linkedin_url

Pages needed:
1. Home — static content only, no API call. Hero section with the
   association's name, a short intro paragraph, a mission statement, and a
   footer with an Instagram link and an email address (use placeholder text
   for all of these).
2. Activities — a grid of cards (thumbnail, title, date) fetched from
   /asthra/activities. Clicking a card opens a detail view showing the full
   description and any additional images.
3. Newsletters — a grid of cards (cover image, title, date) fetched from
   /asthra/newsletters. Clicking a card opens a detail view with the
   description and a "download PDF" link using pdf_url.
4. Committee — fetch /asthra/committee and render one section per
   academic_year (most recent year first), each showing its members as
   simple cards: photo, name, position, and a LinkedIn icon/link.

Keep all four pages in one simple multi-page or single-page setup, whichever
is faster to build. No login screen, no admin functionality — this frontend
only touches the public read-only endpoints. Handle empty API responses
gracefully (e.g. "No activities yet").
```

---

## 8. Admin frontend — prompt

Unlike the public demo frontend above, this one is **permanent** — it's the actual tool you'll use to manage content for as long as the site exists, so it's worth building properly rather than as a throwaway. Paste this into an AI coding assistant as-is.

```
Build a permanent admin dashboard frontend for a college department
association website. This is a long-term tool, not a demo — invest in clean
componentization, good UX, and a polished visual style, since it won't be
rebuilt or replaced later.

STACK
React (functional components, hooks), React Router for navigation, plain CSS
(custom stylesheets or CSS modules — no heavy UI library needed). All data
comes from a FastAPI backend at http://localhost:8000 (configurable via an
environment variable, e.g. VITE_API_BASE_URL).

AUTH
- Session-based via an httpOnly cookie set by the backend — the frontend
  never touches the token directly.
- Every fetch call to the backend must include `credentials: 'include'`.
- POST /admin/login with { username, password } JSON body logs in.
- POST /admin/logout logs out.
- On any 401 response from a protected endpoint, redirect to /login.
- Wrap all routes except /login in a route guard that checks auth status
  (e.g. by calling a lightweight "who am I" check, or by tracking login
  state in context after a successful login response).

VISUAL STYLE — light blue + violet palette, clean and professional
- Primary accent (buttons, active nav item, links): violet, around #6D5BD0
- Secondary accent (highlights, badges, hover states): light blue, around
  #5AC8FA
- Page background: very light lavender-blue, around #F5F7FF
- Card / panel background: white, with a soft shadow and rounded corners
  (8-12px radius)
- Text: dark slate/navy, around #2E2E48, not pure black
- Consistent spacing scale (e.g. 8px base unit), generous whitespace,
  readable font sizes — this should look like a small, tasteful SaaS
  dashboard, not a bare CRUD scaffold

LAYOUT
- Left sidebar (collapsible on smaller screens): nav links to Dashboard,
  Activities, Newsletters, Committee, with active-state highlighting in
  violet
- Top bar: page title on the left, logged-in admin indicator + logout
  button on the right
- Main content area: cards/tables with generous padding

PAGES

1. Login
   - Centered card, username + password fields, "Log in" button, inline
     error message on failed login (don't reveal whether it was the
     username or password that was wrong)

2. Dashboard
   - Simple landing page after login: welcome message, and count cards for
     total activities, newsletters, and committee members (fetched from
     their respective list endpoints)

3. Activities (GET/POST /admin/activities, GET/PUT/DELETE
   /admin/activities/{id})
   - Table or card list: thumbnail, title, date, edit/delete actions
   - "Add activity" button opens a form (modal or separate page): title,
     date picker, thumbnail image upload (show a preview before submit),
     description textarea
   - Edit reuses the same form, pre-filled
   - Delete asks for confirmation before calling the DELETE endpoint

4. Newsletters (GET/POST /admin/newsletters, GET/PUT/DELETE
   /admin/newsletters/{id})
   - Same list/form pattern as Activities, but the form has a cover image
     upload AND a PDF file upload (show the selected filename, not just a
     generic "file chosen")

5. Committee (GET/POST /admin/members, GET/PUT/DELETE /admin/members/{id},
   POST /admin/members/{id}/memberships, DELETE
   /admin/memberships/{id})
   - List of members: photo, name, LinkedIn icon link, edit/delete
   - "Add member" form: name, photo upload, LinkedIn URL
   - Each member's detail/edit view also shows their membership history
     (a small table of academic_year + position) with an inline "add year"
     form (academic_year text input formatted like "2025-26", position
     text input) and a delete button per row

GENERAL UX REQUIREMENTS
- Loading states for every data fetch (skeleton or simple spinner, not a
  blank screen)
- Empty states with friendly copy (e.g. "No activities yet — add your
  first one") instead of blank tables
- Success/error toast notifications after create/update/delete actions
- Client-side validation on required fields before submitting (title,
  date, etc.) with inline error text, not browser alert() popups
- Image previews before upload wherever an image field exists
- Confirm-before-delete on every destructive action
- Responsive enough to be usable on a laptop screen at minimum (doesn't
  need to be mobile-first, but shouldn't break on a smaller browser
  window)

Organize the code into clear folders: components/, pages/, api/ (fetch
wrapper functions per resource), and a single theme/constants file holding
the color palette so it's easy to tweak later.
```

---

## Notes

- This document assumes the schema in section 3 is final for V1. If a teacher requests a change, update the schema table here first, then generate a new Alembic migration — don't edit old migrations.
- The `services/` layer is what future batches extend — new features should mostly mean new service functions + new controller routes, not changes to existing ones.
- Section 8's prompt assumes React, since that lines up with your existing MERN experience — swap the "STACK" line if you'd rather use something else.
- Decoupling the admin panel into its own frontend (section 8) is the one change with a real backend consequence: CORS and cross-origin cookies now need explicit configuration (added to Stage 0 and Stage 6 above). This wasn't a concern with the earlier Jinja2 plan since everything was served from the same origin.
