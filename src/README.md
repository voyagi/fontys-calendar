# Fontys Calendar

A modern calendar application for Fontys students to view and manage their schedules.

## Features

- 📅 Real-time calendar integration with Fontys schedule
- 🔍 Search functionality for events
- 🎨 Color-coded event types
- 📱 Responsive design
- 🔒 Secure authentication with Supabase
- ⚙️ Customizable notification preferences

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/fontys-calendar-new.git
cd fontys-calendar-new
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is ready to be deployed on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel
4. Deploy!

## Built With

- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend and Authentication
- [FullCalendar](https://fullcalendar.io/) - Calendar component
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Headless UI](https://headlessui.com/) - UI components 