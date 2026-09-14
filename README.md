# FROM MPGI — Events Website (MongoDB Backend)

## Features
- Events stored in **MongoDB Atlas** (shared across all devices)
- Clickable events → detail page
- Admin can set Event Page Link
- Admin can Add / Edit / Remove events
- Admin panel only opens at `#/321`
- Animated dark neon UI

## Quick Start

```bash
cd from-mpgi
npm install
npm start
```

Then open: **http://localhost:3000**

### Admin Panel
- URL: http://localhost:3000/#/321
- Password: `frommpgi2026`

## Important Security Note
The MongoDB password is in the `.env` file.  
**After testing, go to Atlas and change/rotate the password.**

## Deploy (optional)
You can deploy this to Render.com / Railway / Vercel (with serverless adaptations) so everyone can access it online.

Made for FROM MPGI team ⚡
