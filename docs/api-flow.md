# API Flow

## Setup
POST /api/ai/extract { prompt } → schema → saved to business.json

## Business
GET /api/business → current config
PUT /api/business → update config

## Slots
GET /api/slots?date=YYYY-MM-DD → [{ time, booked }]
GET /api/slots/available-days?year=&month= → ["YYYY-MM-DD"]

## Bookings
GET /api/bookings → all bookings
POST /api/bookings { service, date, slot, customer } → booking
PATCH /api/bookings/:id/deposit { depositStatus } → updated booking