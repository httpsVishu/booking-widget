# Booking Widget

An AI-powered booking intake system for local service businesses. Business owners configure their services, working hours, and availability in seconds — customers get a clean, fast booking experience with deposit collection.

## Live Demo
- Frontend: https://booking-widget-delta-gold.vercel.app
- Backend API: https://booking-widget-0nhi.onrender.com/api/health

## What It Does

**For the business owner (Setup + Dashboard tabs):**
- Pick a preset (HVAC, Cleaning, Barber, Dog Grooming) or describe your business in plain text
- AI extracts your services, durations, deposit amounts, working days and hours automatically
- Edit the schema in a visual editor before saving
- Dashboard shows all bookings in real time, deposit status, and total revenue collected
- Auto-refreshes every 5 seconds

**For the customer (Book tab):**
- Picks a service with duration and deposit info shown clearly
- Selects from available dates based on the business's working days
- Picks a time slot (already-booked slots are greyed out)
- Fills in name, email, phone and mock Stripe deposit
- Gets a confirmation modal on success

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + Vanilla JS + Tailwind CSS (CDN) + Motion One |
| Backend | Node.js + Express |
| Storage | Local JSON files |
| AI (mock) | Keyword-based schema extraction (no API key needed) |
| Deployment | Vercel (frontend) + Render (backend) |

