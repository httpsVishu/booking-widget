# Feature List

## Setup
- Business prompt input (textarea)
- 4 presets: HVAC, Cleaning, Barber, Dog Grooming
- AI schema extraction via OpenAI with loading state
- Schema editor: service names, durations, deposits, working days, hours

## Customer Booking Widget (3 screens)
- Screen 1: Service selector with duration + deposit info
- Screen 2: Calendar-based date picker (working days only) + time slots (booked = greyed)
- Screen 3: Customer info form + Stripe mock deposit

## Business Dashboard
- Stats: total bookings, deposits paid, revenue
- Booking table: customer, service, slot, deposit status
- Mark deposit as paid action
- Auto-refreshes every 5 seconds
- Persists via local JSON