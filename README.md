# Dreamz Womens Hostel

A modern hostel management system for women's accommodation in Hyderabad, India.

## Features

### Public Website
- View available rooms with real-time bed availability
- Book beds online with WhatsApp integration
- Read and write customer reviews
- Contact via WhatsApp for quick responses

### Admin Dashboard
- Secure admin login
- Manage rooms and bed assignments
- Approve/reject booking requests
- Contact customers via WhatsApp directly
- Upload room photos
- Track tenants and payments
- View occupancy statistics

## Rooms

| Room | Sharing | Price/Bed | Total Beds |
|------|---------|-----------|------------|
| A4   | 4       | Rs.6,000  | 4          |
| B6   | 6       | Rs.5,500  | 6          |
| C6   | 6       | Rs.5,500  | 6          |
| E2   | 2       | Rs.6,000  | 2          |

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Build**: Vite
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/yaswathyash3116/dreamz-womens-hostel.git
cd dreamz-womens-hostel

# Install dependencies
npm install

# Create .env file with your Supabase credentials
echo "VITE_SUPABASE_URL=your_supabase_url" > .env
echo "VITE_SUPABASE_ANON_KEY=your_supabase_anon_key" >> .env

# Run development server
npm run dev

# Build for production
npm run build
```

### Database Setup

Run the migrations in your Supabase SQL editor in order:
1. `001_initial_schema.sql`
2. `002_update_for_womens_hostel.sql`
3. `003_setup_specific_rooms_and_auth.sql`
4. `004_fix_admin_rls_and_add_whatsapp.sql`



*Change these credentials after first login for security.*

## Contact

- **Address**: F9VW+9C4, Road No. 6, Kukatpally Housing Board Colony, Dharma Reddy Colony Phase I, Kukatpally, Hyderabad, Telangana 500072
- **Phone**: +91 73868 24414
- **Email**: dreamzwomenshostel@gmail.com
- **WhatsApp**: [Chat Now](https://wa.me/917386824414)

## License

Private - All rights reserved.
