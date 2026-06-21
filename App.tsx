import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Home, Users, BedDouble, Menu, X, Phone, Mail, MapPin,
  Wifi, Shield, Utensils, Filter, MessageCircle, ChevronRight, Check, X as XIcon,
  TrendingUp, DollarSign, Calendar, Upload, Plus, ArrowRight, AlertCircle, Star, LogOut, Lock, Trash2
} from 'lucide-react';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

type Room = {
  id: string;
  room_number: string;
  room_name: string;
  sharing_type: number;
  price_per_bed: number;
  amenities: string[];
  floor: number;
  photos?: Photo[];
  beds?: Bed[];
};

type Bed = {
  id: string;
  bed_number: string;
  status: 'vacant' | 'occupied' | 'maintenance';
  current_tenant_id?: string;
};

type Photo = { url: string; caption: string; is_primary: boolean };

type Tenant = {
  id: string;
  name: string;
  email: string;
  phone: string;
  bed_id: string;
  checkin_date: string;
  checkout_date?: string;
  status: string;
  monthly_rent: number;
  beds?: { bed_number: string; room_id: string; rooms?: { room_number: string } };
};

type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string;
  preferred_sharing: number;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

type Payment = {
  id: string;
  tenant_id: string;
  amount: number;
  payment_date: string;
  status: string;
  tenants?: { name: string };
};

type Review = {
  id: string;
  name: string;
  rating: number;
  review: string;
  created_at: string;
};

type Stats = {
  totalBeds: number;
  occupiedBeds: number;
  vacantBeds: number;
  totalTenants: number;
  totalRooms: number;
  monthlyRevenue: number;
  occupancyRate: number;
};

export default function App() {
  const [view, setView] = useState<'public' | 'admin'>('public');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setView('public');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-400 flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Dreamz <span className="text-rose-400">Womens Hostel</span></span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => setView('public')} className={`px-4 py-2 rounded-lg font-medium transition-all ${view === 'public' ? 'bg-rose-500/20 text-rose-400' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}>Find Room</button>
              {isLoggedIn ? (
                <>
                  <button onClick={() => setView('admin')} className={`px-4 py-2 rounded-lg font-medium transition-all ${view === 'admin' ? 'bg-rose-500/20 text-rose-400' : 'text-slate-300 hover:text-white hover:bg-slate-700/50'}`}>Admin Dashboard</button>
                  <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"><LogOut className="w-4 h-4" />Logout</button>
                </>
              ) : (
                <button onClick={() => setView('admin')} className="flex items-center gap-2 px-4 py-2 bg-rose-500/20 text-rose-400 rounded-lg hover:bg-rose-500/30"><Lock className="w-4 h-4" />Admin Login</button>
              )}
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-700/50">{mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden px-4 py-3 border-t border-slate-700/50 space-y-2">
            <button onClick={() => { setView('public'); setMobileMenuOpen(false); }} className={`w-full text-left px-4 py-2 rounded-lg font-medium ${view === 'public' ? 'bg-rose-500/20 text-rose-400' : 'text-slate-300'}`}>Find Room</button>
            {isLoggedIn ? (
              <>
                <button onClick={() => { setView('admin'); setMobileMenuOpen(false); }} className={`w-full text-left px-4 py-2 rounded-lg font-medium ${view === 'admin' ? 'bg-rose-500/20 text-rose-400' : 'text-slate-300'}`}>Admin Dashboard</button>
                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-2 rounded-lg font-medium text-red-400">Logout</button>
              </>
            ) : (
              <button onClick={() => { setView('admin'); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-2 rounded-lg font-medium text-rose-400">Admin Login</button>
            )}
          </div>
        )}
      </nav>
      <main className="pt-16">{view === 'public' ? <PublicView /> : (isLoggedIn ? <AdminView /> : <AdminLogin onLogin={() => setIsLoggedIn(true)} />)}</main>
      <a href="https://wa.me/917386824414?text=Hi!%20I'm%20interested%20in%20your%20hostel" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl shadow-green-500/30 transition-all hover:scale-110">
        <MessageCircle className="w-7 h-7 text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-300 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full" />
      </a>
    </div>
  );
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('password_hash', password)
      .single();

    setLoading(false);

    if (fetchError || !data) {
      setError('Invalid username or password');
      return;
    }

    onLogin();
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-slate-800/80 rounded-2xl p-8 max-w-md w-full border border-slate-700">
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-rose-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Admin Login</h2>
          <p className="text-slate-400 mt-2">Enter your credentials to access admin dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm mb-1">Username</label>
            <input type="text" required value={username} onChange={e => setUsername(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white focus:ring-2 focus:ring-rose-500 focus:outline-none" placeholder="Enter username" />
          </div>
          <div>
            <label className="block text-slate-300 text-sm mb-1">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white focus:ring-2 focus:ring-rose-500 focus:outline-none" placeholder="Enter password" />
          </div>
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <button type="submit" disabled={loading} className="w-full py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-600 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2">
            {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Logging in...</> : <>Login<ChevronRight className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}

function PublicView() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ maxRent: 10000, sharingType: '', availability: false });
  const [showFilters, setShowFilters] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => { fetchRooms(); fetchReviews(); }, []);

  async function fetchRooms() {
    const { data, error } = await supabase.from('rooms').select(`*, photos(url, caption, is_primary), beds(id, bed_number, status, current_tenant_id)`).order('room_number');
    if (!error && data) setRooms(data);
    setLoading(false);
  }

  async function fetchReviews() {
    const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false }).limit(6);
    if (data) setReviews(data);
  }

  const filteredRooms = rooms.filter(room => {
    if (room.price_per_bed > filters.maxRent) return false;
    if (filters.sharingType && room.sharing_type !== parseInt(filters.sharingType)) return false;
    if (filters.availability) { if (!room.beds?.some(b => b.status === 'vacant')) return false; }
    return true;
  });

  return (
    <div>
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/30 via-slate-900 to-rose-900/30" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-rose-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Find Your Perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">Hostel Room</span></h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">Safe and comfortable women's accommodation with live bed availability. See exactly which bed is available.</p>
          <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl p-4 max-w-2xl mx-auto border border-slate-700/50">
            <div className="flex flex-col md:flex-row gap-4">
              <select value={filters.sharingType} onChange={(e) => setFilters({ ...filters, sharingType: e.target.value })} className="flex-1 px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white focus:ring-2 focus:ring-rose-500 focus:outline-none">
                <option value="">Any Sharing</option>
                <option value="2">2 Sharing</option>
                <option value="4">4 Sharing</option>
                <option value="6">6 Sharing</option>
              </select>
              <button onClick={() => setShowFilters(!showFilters)} className="px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2">
                <Filter className="w-5 h-5" />{showFilters ? 'Hide' : 'More Filters'}
              </button>
            </div>
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-slate-700/50">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1 w-full">
                    <label className="text-slate-400 text-sm mb-1 block">Max Rent: Rs.{filters.maxRent}</label>
                    <input type="range" min="2000" max="15000" step="500" value={filters.maxRent} onChange={(e) => setFilters({ ...filters, maxRent: parseInt(e.target.value) })} className="w-full accent-rose-500" />
                  </div>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input type="checkbox" checked={filters.availability} onChange={(e) => setFilters({ ...filters, availability: e.target.checked })} className="w-5 h-5 rounded accent-rose-500" />Only Available Beds
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">{filteredRooms.length} Rooms Available</h2>
            <div className="flex items-center gap-2 text-slate-400"><BedDouble className="w-5 h-5" /><span>Live bed status</span></div>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{[...Array(4)].map((_, i) => (<div key={i} className="bg-slate-800/50 rounded-2xl h-96 animate-pulse" />))}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{filteredRooms.map(room => (<RoomCard key={room.id} room={room} onBook={() => { setSelectedRoom(room); setShowBookingForm(true); }} />))}</div>
          )}
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Amenities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[{ icon: Wifi, label: 'High-Speed WiFi' }, { icon: Shield, label: '24/7 Security' }, { icon: Utensils, label: 'Mess / Kitchen' }].map(({ icon: Icon, label }) => (
              <div key={label} className="bg-slate-700/30 rounded-xl p-8 text-center hover:bg-slate-700/50 transition-all"><Icon className="w-12 h-12 mx-auto mb-4 text-rose-400" /><span className="text-slate-300 font-medium text-lg">{label}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Reviews</h2>
            <button onClick={() => setShowReviewForm(true)} className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-medium transition-all"><Plus className="w-5 h-5" />Write Review</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map(review => (
              <div key={review.id} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className={`w-5 h-5 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
                  ))}
                </div>
                <p className="text-slate-300 mb-3">"{review.review}"</p>
                <p className="text-rose-400 font-medium">- {review.name}</p>
              </div>
            ))}
            {reviews.length === 0 && (
              <div className="col-span-full text-center py-8 text-slate-500">No reviews yet. Be the first to write one!</div>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800 to-slate-700/50 rounded-3xl p-8 md:p-12 border border-slate-600/50">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">Contact Us</h3>
                <p className="text-slate-400 mb-6">Have questions? Visit us or get in touch directly through WhatsApp for quick responses.</p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-300"><MapPin className="w-5 h-5 text-rose-400 flex-shrink-0" /><span className="text-sm">F9VW+9C4, Road No. 6, Kukatpally Housing Board Colony, Dharma Reddy Colony Phase I, Kukatpally, Hyderabad, Telangana 500072</span></div>
                  <div className="flex items-center gap-3 text-slate-300"><Phone className="w-5 h-5 text-rose-400" /><span>+91 73868 24414</span></div>
                  <div className="flex items-center gap-3 text-slate-300"><Mail className="w-5 h-5 text-rose-400" /><span>dreamzwomenshostel@gmail.com</span></div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <a href="https://wa.me/917386824414?text=Hi!%20I'm%20interested%20in%20your%20hostel" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-8 py-4 bg-green-500 hover:bg-green-600 rounded-xl text-white font-medium transition-all"><MessageCircle className="w-6 h-6" />Chat on WhatsApp</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-400">Powered by <span className="text-rose-400 font-semibold">Yovial Technologies</span></p>
        </div>
      </footer>

      {showBookingForm && <BookingForm room={selectedRoom} onClose={() => { setShowBookingForm(false); setSelectedRoom(null); }} onSuccess={() => { setShowBookingForm(false); setSelectedRoom(null); }} />}
      {showReviewForm && <ReviewForm onClose={() => setShowReviewForm(false)} onSuccess={() => { setShowReviewForm(false); fetchReviews(); }} />}
    </div>
  );
}

function RoomCard({ room, onBook }: { room: Room; onBook: () => void }) {
  const primaryPhoto = room.photos?.find(p => p.is_primary)?.url || room.photos?.[0]?.url;
  const vacantBeds = room.beds?.filter(b => b.status === 'vacant') || [];

  return (
    <div className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50 hover:border-rose-500/50 transition-all group">
      <div className="relative h-48 overflow-hidden">
        {primaryPhoto ? (
          <img src={primaryPhoto} alt={room.room_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center"><Home className="w-12 h-12 text-slate-500" /></div>
        )}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium bg-pink-500/90 text-white">Women Only</div>
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium bg-rose-500/90 text-white">{room.sharing_type} Sharing</div>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-white">{room.room_name}</h3>
            <p className="text-slate-400 text-sm">Floor {room.floor}</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-rose-400">Rs.{room.price_per_bed.toLocaleString()}</p>
            <p className="text-slate-500 text-xs">per month/bed</p>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-slate-400 text-xs mb-2 font-medium">Bed Availability:</p>
          <div className="grid grid-cols-2 gap-2">
            {room.beds?.map(bed => (
              <div key={bed.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${bed.status === 'vacant' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                {bed.status === 'vacant' ? <Check className="w-4 h-4" /> : <XIcon className="w-4 h-4" />}
                {bed.bed_number} {bed.status === 'vacant' ? 'Available' : 'Occupied'}
              </div>
            ))}
          </div>
        </div>
        <button onClick={onBook} disabled={vacantBeds.length === 0} className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${vacantBeds.length > 0 ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>
          {vacantBeds.length > 0 ? <>Book Now ({vacantBeds.length} available)<ArrowRight className="w-4 h-4" /></> : <><AlertCircle className="w-4 h-4" />Fully Occupied</>}
        </button>
      </div>
    </div>
  );
}

function BookingForm({ room, onClose, onSuccess }: { room: Room | null; onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', preferred_sharing: room?.sharing_type || 3, message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from('bookings').insert({ ...formData, preferred_sharing: Number(formData.preferred_sharing) });
    setSubmitting(false);
    if (!error) { setSuccess(true); }
  };

  if (success) {
    const roomInfo = room ? `${room.room_name} (${room.sharing_type} Sharing)` : `${formData.preferred_sharing} Sharing`;
    const priceInfo = room ? `Rs.${room.price_per_bed.toLocaleString()}/month` : '';
    const whatsappMessage = encodeURIComponent(
`Hi! I'm interested in booking a bed at Dreamz Womens Hostel.

*Booking Details:*
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Preferred Room: ${roomInfo}
${priceInfo ? `Price: ${priceInfo}` : ''}
${formData.message ? `Message: ${formData.message}` : ''}

Please confirm the availability. Thank you!`);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-slate-800 rounded-2xl p-8 text-center max-w-md w-full border border-slate-700">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4"><Check className="w-8 h-8 text-green-400" /></div>
          <h3 className="text-xl font-bold text-white mb-2">Booking Request Sent!</h3>
          <p className="text-slate-400 mb-4">Your booking has been recorded. Click below to send details to WhatsApp for faster confirmation.</p>
          <a
            href={`https://wa.me/917386824414?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-medium transition-all mb-3"
          >
            <MessageCircle className="w-5 h-5" />Send to WhatsApp
          </a>
          <button onClick={() => { onSuccess(); onClose(); }} className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl font-medium transition-all">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Book a Bed</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-700 text-slate-400"><X className="w-5 h-5" /></button>
        </div>
        {room && (
          <div className="bg-slate-700/30 rounded-xl p-4 mb-6">
            <p className="text-white font-medium">{room.room_name} - {room.sharing_type} Sharing</p>
            <p className="text-rose-400 text-lg font-bold">Rs.{room.price_per_bed.toLocaleString()}/month</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-slate-300 text-sm mb-1">Full Name *</label><input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white focus:ring-2 focus:ring-rose-500 focus:outline-none" placeholder="Your full name" /></div>
          <div><label className="block text-slate-300 text-sm mb-1">Email *</label><input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white focus:ring-2 focus:ring-rose-500 focus:outline-none" placeholder="your@email.com" /></div>
          <div><label className="block text-slate-300 text-sm mb-1">Phone *</label><input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white focus:ring-2 focus:ring-rose-500 focus:outline-none" placeholder="+91 73868 24414" /></div>
          <div><label className="block text-slate-300 text-sm mb-1">Preferred Room Type</label><select value={formData.preferred_sharing} onChange={e => setFormData({ ...formData, preferred_sharing: Number(e.target.value) })} className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"><option value={2}>2 Sharing</option><option value={4}>4 Sharing</option><option value={6}>6 Sharing</option></select></div>
          <div><label className="block text-slate-300 text-sm mb-1">Message</label><textarea value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white focus:ring-2 focus:ring-rose-500 focus:outline-none resize-none" rows={3} placeholder="Any specific requirements..." /></div>
          <button type="submit" disabled={submitting} className="w-full py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-600 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2">
            {submitting ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</> : <>Submit Booking Request<ChevronRight className="w-4 h-4" /></>}
          </button>
        </form>
      </div>
    </div>
  );
}

function ReviewForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({ name: '', rating: 5, review: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from('reviews').insert(formData);
    setSubmitting(false);
    if (!error) onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-700" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Write a Review</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-700 text-slate-400"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-slate-300 text-sm mb-1">Your Name *</label><input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white focus:ring-2 focus:ring-rose-500 focus:outline-none" placeholder="Your name" /></div>
          <div>
            <label className="block text-slate-300 text-sm mb-2">Rating *</label>
            <div className="flex gap-2">{[1, 2, 3, 4, 5].map(star => (
              <button key={star} type="button" onClick={() => setFormData({ ...formData, rating: star })} className="p-1">
                <Star className={`w-8 h-8 ${star <= formData.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} />
              </button>
            ))}</div>
          </div>
          <div><label className="block text-slate-300 text-sm mb-1">Your Review *</label><textarea required value={formData.review} onChange={e => setFormData({ ...formData, review: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white focus:ring-2 focus:ring-rose-500 focus:outline-none resize-none" rows={4} placeholder="Share your experience..." /></div>
          <button type="submit" disabled={submitting} className="w-full py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-600 rounded-xl font-medium text-white transition-all">
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminView() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rooms' | 'tenants' | 'bookings'>('dashboard');
  const [stats, setStats] = useState<Stats>({ totalBeds: 0, occupiedBeds: 0, vacantBeds: 0, totalTenants: 0, totalRooms: 0, monthlyRevenue: 0, occupancyRate: 0 });

  useEffect(() => { fetchStats(); }, []);

  async function fetchStats() {
    const { data: beds } = await supabase.from('beds').select('status');
    const totalBeds = beds?.length || 0;
    const occupiedBeds = beds?.filter(b => b.status === 'occupied').length || 0;
    const vacantBeds = beds?.filter(b => b.status === 'vacant').length || 0;
    const { count: totalRooms } = await supabase.from('rooms').select('*', { count: 'exact', head: true });
    const { data: tenants } = await supabase.from('tenants').select('id').eq('status', 'active');
    const totalTenants = tenants?.length || 0;
    const { data: payments } = await supabase.from('payments').select('amount').gte('payment_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()).eq('status', 'paid');
    const monthlyRevenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
    setStats({ totalBeds, occupiedBeds, vacantBeds, totalTenants, totalRooms: totalRooms || 0, monthlyRevenue, occupancyRate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0 });
  }

  return (
    <div className="min-h-screen">
      <div className="sticky top-16 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 py-3">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
              { id: 'rooms', label: 'Rooms', icon: Home },
              { id: 'tenants', label: 'Tenants', icon: Users },
              { id: 'bookings', label: 'Bookings', icon: Calendar },
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-rose-500/20 text-rose-400' : 'text-slate-400 hover:text-white hover:bg-slate-700/50'}`}>
                <tab.icon className="w-4 h-4" />{tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'dashboard' && <DashboardTab stats={stats} onRefresh={fetchStats} />}
        {activeTab === 'rooms' && <RoomsTab onRefresh={fetchStats} />}
        {activeTab === 'tenants' && <TenantsTab onRefresh={fetchStats} />}
        {activeTab === 'bookings' && <BookingsTab onRefresh={fetchStats} />}
      </div>
    </div>
  );
}

function DashboardTab({ stats, onRefresh }: { stats: Stats; onRefresh: () => void }) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => { fetchPayments(); fetchRoomsWithBeds(); }, []);

  async function fetchPayments() {
    const { data } = await supabase.from('payments').select('*, tenants(name)').order('payment_date', { ascending: false }).limit(5);
    if (data) setPayments(data);
  }

  async function fetchRoomsWithBeds() {
    const { data } = await supabase.from('rooms').select('*, beds(id, bed_number, status)').order('room_number');
    if (data) setRooms(data);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-rose-500/20 to-pink-500/20 rounded-2xl p-5 border border-rose-500/30"><DollarSign className="w-8 h-8 text-rose-400 mb-2" /><p className="text-2xl font-bold text-white">Rs.{stats.monthlyRevenue.toLocaleString()}</p><p className="text-slate-400 text-sm">Monthly Revenue</p></div>
        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-5 border border-green-500/30"><TrendingUp className="w-8 h-8 text-green-400 mb-2" /><p className="text-2xl font-bold text-white">{stats.occupancyRate}%</p><p className="text-slate-400 text-sm">Occupied Beds</p></div>
        <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl p-5 border border-amber-500/30"><BedDouble className="w-8 h-8 text-amber-400 mb-2" /><p className="text-2xl font-bold text-white">{stats.vacantBeds}</p><p className="text-slate-400 text-sm">Vacant Beds</p></div>
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-5 border border-purple-500/30"><Users className="w-8 h-8 text-purple-400 mb-2" /><p className="text-2xl font-bold text-white">{stats.totalTenants}</p><p className="text-slate-400 text-sm">Total Tenants</p></div>
        <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl p-5 border border-blue-500/30"><Home className="w-8 h-8 text-blue-400 mb-2" /><p className="text-2xl font-bold text-white">{stats.totalRooms}</p><p className="text-slate-400 text-sm">Total Rooms</p></div>
        <div className="bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-2xl p-5 border border-cyan-500/30"><BedDouble className="w-8 h-8 text-cyan-400 mb-2" /><p className="text-2xl font-bold text-white">{stats.totalBeds}</p><p className="text-slate-400 text-sm">Total Beds</p></div>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Bed Status by Room</h3>
          <div className="space-y-3">
            {rooms.map(room => {
              const vacant = room.beds?.filter(b => b.status === 'vacant').length || 0;
              const occupied = room.beds?.filter(b => b.status === 'occupied').length || 0;
              const percentage = room.beds?.length ? Math.round((occupied / room.beds.length) * 100) : 0;
              return (
                <div key={room.id} className="flex items-center gap-4">
                  <div className="w-16 text-slate-300 font-medium">{room.room_name}</div>
                  <div className="flex-1 h-6 bg-slate-700 rounded-full overflow-hidden flex"><div className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all" style={{ width: `${percentage}%` }} /></div>
                  <div className="w-20 text-right text-sm text-slate-400">{vacant} / {room.beds?.length || 0} vacant</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Payments</h3>
          <div className="space-y-3">
            {payments.map(payment => (
              <div key={payment.id} className="flex items-center justify-between py-2 border-b border-slate-700/50 last:border-0">
                <div><p className="text-white font-medium">{payment.tenants?.name || 'Unknown'}</p><p className="text-slate-500 text-sm">{new Date(payment.payment_date).toLocaleDateString()}</p></div>
                <div className="text-right"><p className="text-green-400 font-bold">Rs.{Number(payment.amount).toLocaleString()}</p><p className={`text-xs px-2 py-0.5 rounded-full inline-block ${payment.status === 'paid' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'}`}>{payment.status}</p></div>
              </div>
            ))}
            {payments.length === 0 && <p className="text-slate-500 text-center py-4">No recent payments</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function RoomsTab({ onRefresh }: { onRefresh: () => void }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => { fetchRooms(); }, []);

  async function fetchRooms() {
    const { data } = await supabase.from('rooms').select('*, photos(id, url, caption, is_primary), beds(id, bed_number, status, current_tenant_id)').order('room_number');
    if (data) setRooms(data);
  }

  async function toggleBedStatus(bedId: string, currentStatus: string) {
    const newStatus = currentStatus === 'vacant' ? 'occupied' : 'vacant';
    await supabase.from('beds').update({ status: newStatus }).eq('id', bedId);
    fetchRooms();
    onRefresh();
  }

  async function handlePhotoUpload(roomId: string, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      await supabase.from('photos').insert({ room_id: roomId, url: reader.result as string, caption: file.name });
      fetchRooms();
    };
    reader.readAsDataURL(file);
  }

  async function deletePhoto(photoUrl: string) {
    await supabase.from('photos').delete().eq('url', photoUrl);
    fetchRooms();
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Room Management</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rooms.map(room => (
          <div key={room.id} className={`bg-slate-800/50 rounded-2xl p-6 border ${selectedRoom?.id === room.id ? 'border-rose-500' : 'border-slate-700/50'}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold text-white">{room.room_name}</h3>
                <p className="text-slate-400">{room.sharing_type} Sharing - Floor {room.floor}</p>
                <p className="text-rose-400 font-bold text-lg mt-1">Rs.{room.price_per_bed.toLocaleString()}/month per bed</p>
              </div>
              <button onClick={() => setSelectedRoom(selectedRoom?.id === room.id ? null : room)} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm transition-all">
                {selectedRoom?.id === room.id ? 'Close' : 'Manage'}
              </button>
            </div>
            <div className="mb-4 p-3 bg-slate-700/30 rounded-lg">
              <p className="text-slate-400 text-sm mb-2">Vacant: <span className="text-green-400 font-bold">{room.beds?.filter(b => b.status === 'vacant').length || 0}</span> / Occupied: <span className="text-red-400 font-bold">{room.beds?.filter(b => b.status === 'occupied').length || 0}</span></p>
            </div>
            {selectedRoom?.id === room.id && (
              <>
                <div className="mb-6">
                  <p className="text-slate-400 text-sm font-medium mb-3">Bed Status (Click to toggle):</p>
                  <div className="grid grid-cols-3 gap-3">
                    {room.beds?.map(bed => (
                      <button key={bed.id} onClick={() => toggleBedStatus(bed.id, bed.status)} className={`p-4 rounded-xl text-center transition-all ${bed.status === 'vacant' ? 'bg-green-500/20 border-2 border-green-500/50 hover:bg-green-500/30' : 'bg-red-500/20 border-2 border-red-500/50 hover:bg-red-500/30'}`}>
                        <BedDouble className={`w-6 h-6 mx-auto mb-1 ${bed.status === 'vacant' ? 'text-green-400' : 'text-red-400'}`} />
                        <p className={`font-bold ${bed.status === 'vacant' ? 'text-green-400' : 'text-red-400'}`}>{bed.bed_number}</p>
                        <p className={`text-xs ${bed.status === 'vacant' ? 'text-green-400/70' : 'text-red-400/70'}`}>{bed.status === 'vacant' ? 'Available' : 'Occupied'}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-slate-400 text-sm font-medium mb-3">Room Photos:</p>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {room.photos?.map(photo => (
                      <div key={photo.url} className="relative group">
                        <img src={photo.url} alt={photo.caption || ''} className="w-24 h-24 object-cover rounded-lg border border-slate-600" />
                        <button onClick={() => deletePhoto(photo.url)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full items-center justify-center hidden group-hover:flex">
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg cursor-pointer transition-all w-fit">
                    <Upload className="w-4 h-4" />Upload Photo
                    <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(room.id, e)} className="hidden" />
                  </label>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TenantsTab({ onRefresh }: { onRefresh: () => void }) {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [showAddTenant, setShowAddTenant] = useState(false);

  useEffect(() => { fetchTenants(); }, []);

  async function fetchTenants() {
    const { data } = await supabase.from('tenants').select(`*, beds(bed_number, room_id, rooms(room_number, room_name))`).order('created_at', { ascending: false });
    if (data) setTenants(data);
  }

  async function checkoutTenant(tenantId: string) {
    if (!confirm('Check out this tenant?')) return;
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant?.bed_id) return;
    await supabase.from('tenants').update({ status: 'checked_out', checkout_date: new Date().toISOString().split('T')[0] }).eq('id', tenantId);
    await supabase.from('beds').update({ status: 'vacant', current_tenant_id: null }).eq('id', tenant.bed_id);
    fetchTenants();
    onRefresh();
  }

  const activeTenants = tenants.filter(t => t.status === 'active');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Tenants ({activeTenants.length} active)</h2>
        <button onClick={() => setShowAddTenant(true)} className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-medium transition-all"><Plus className="w-5 h-5" />Add Tenant</button>
      </div>
      {showAddTenant && <AddTenantForm onClose={() => setShowAddTenant(false)} onSuccess={() => { setShowAddTenant(false); fetchTenants(); onRefresh(); }} />}
      <div className="bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700/50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead><tr className="bg-slate-700/50"><th className="px-6 py-4 text-left text-slate-400 font-medium">Name</th><th className="px-6 py-4 text-left text-slate-400 font-medium">Phone</th><th className="px-6 py-4 text-left text-slate-400 font-medium">Room</th><th className="px-6 py-4 text-left text-slate-400 font-medium">Rent</th><th className="px-6 py-4 text-left text-slate-400 font-medium">Check-in</th><th className="px-6 py-4 text-right text-slate-400 font-medium">Actions</th></tr></thead>
            <tbody className="divide-y divide-slate-700/50">
              {activeTenants.map(tenant => (
                <tr key={tenant.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4"><div><p className="text-white font-medium">{tenant.name}</p><p className="text-slate-500 text-sm">{tenant.email}</p></div></td>
                  <td className="px-6 py-4 text-slate-300">{tenant.phone}</td>
                  <td className="px-6 py-4"><p className="text-white">{tenant.beds?.rooms?.room_name} - {tenant.beds?.bed_number}</p></td>
                  <td className="px-6 py-4 text-rose-400 font-medium">Rs.{tenant.monthly_rent?.toLocaleString()}</td>
                  <td className="px-6 py-4 text-slate-300">{tenant.checkin_date}</td>
                  <td className="px-6 py-4 text-right"><button onClick={() => checkoutTenant(tenant.id)} className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 rounded-lg text-sm font-medium transition-all">Check Out</button></td>
                </tr>
              ))}
              {activeTenants.length === 0 && <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No active tenants</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AddTenantForm({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', bed_id: '', monthly_rent: 5000 });
  const [availableBeds, setAvailableBeds] = useState<{ id: string; bed_number: string; rooms: { room_number: string; room_name: string } }[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchAvailableBeds(); }, []);

  async function fetchAvailableBeds() {
    const { data } = await supabase.from('beds').select('id, bed_number, rooms(room_number, room_name)').eq('status', 'vacant');
    if (data) setAvailableBeds(data);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { data: tenant, error } = await supabase.from('tenants').insert({
      name: formData.name, email: formData.email, phone: formData.phone, bed_id: formData.bed_id, monthly_rent: Number(formData.monthly_rent)
    }).select().single();
    if (!error && tenant) {
      await supabase.from('beds').update({ status: 'occupied', current_tenant_id: tenant.id }).eq('id', formData.bed_id);
      onSuccess();
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Add New Tenant</h3>
      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
        <input type="text" required placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white focus:ring-2 focus:ring-rose-500 focus:outline-none" />
        <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white focus:ring-2 focus:ring-rose-500 focus:outline-none" />
        <input type="tel" required placeholder="Phone" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white focus:ring-2 focus:ring-rose-500 focus:outline-none" />
        <select required value={formData.bed_id} onChange={e => setFormData({ ...formData, bed_id: e.target.value })} className="px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"><option value="">Select Bed</option>{availableBeds.map(bed => (<option key={bed.id} value={bed.id}>{bed.rooms?.room_name} - {bed.bed_number}</option>))}</select>
        <input type="number" placeholder="Monthly Rent" value={formData.monthly_rent} onChange={e => setFormData({ ...formData, monthly_rent: Number(e.target.value) })} className="px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600 text-white focus:ring-2 focus:ring-rose-500 focus:outline-none" />
        <div className="flex gap-3">
          <button type="submit" disabled={submitting} className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-slate-600 text-white rounded-xl font-medium transition-all">{submitting ? 'Adding...' : 'Add Tenant'}</button>
          <button type="button" onClick={onClose} className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl font-medium transition-all">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function BookingsTab({ onRefresh }: { onRefresh: () => void }) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => { fetchBookings(); }, []);

  async function fetchBookings() {
    const { data } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
    if (data) setBookings(data);
  }

  async function updateBookingStatus(bookingId: string, status: 'approved' | 'rejected') {
    if (status === 'approved') {
      const { data: beds } = await supabase.from('beds').select('id, bed_number, rooms!inner(room_number, room_name, price_per_bed)').eq('status', 'vacant').limit(1);
      if (!beds || beds.length === 0) { alert('No vacant beds available!'); return; }
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) return;
      const bed = beds[0];
      await supabase.from('tenants').insert({ name: booking.name, email: booking.email, phone: booking.phone, bed_id: bed.id, monthly_rent: bed.rooms?.price_per_bed || 5000 });
      await supabase.from('beds').update({ status: 'occupied' }).eq('id', bed.id);
    }
    await supabase.from('bookings').update({ status }).eq('id', bookingId);
    fetchBookings();
    onRefresh();
  }

  async function deleteBooking(bookingId: string) {
    await supabase.from('bookings').delete().eq('id', bookingId);
    fetchBookings();
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const processedBookings = bookings.filter(b => b.status !== 'pending');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Booking Requests ({pendingBookings.length} pending)</h2>
      <div className="space-y-4">
        {pendingBookings.map(booking => (
          <div key={booking.id} className="bg-slate-800/50 rounded-2xl p-6 border border-amber-500/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-semibold text-white">{booking.name}</h4>
                <p className="text-slate-400">{booking.email}</p>
                <p className="text-slate-400">{booking.phone}</p>
                <p className="text-rose-400 mt-1">{booking.preferred_sharing} Sharing preferred</p>
                {booking.message && <p className="text-slate-300 mt-2 bg-slate-700/50 rounded-lg p-3">"{booking.message}"</p>}
                <p className="text-slate-500 text-sm mt-2">{new Date(booking.created_at).toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-2">
                <a href={`https://wa.me/91${booking.phone}?text=${encodeURIComponent(`Hi ${booking.name}, regarding your booking at Dreamz Womens Hostel for ${booking.preferred_sharing} Sharing.`)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all"><MessageCircle className="w-4 h-4" />WhatsApp</a>
                <div className="flex gap-2">
                  <button onClick={() => updateBookingStatus(booking.id, 'approved')} className="flex items-center gap-2 flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-all"><Check className="w-4 h-4" />Approve</button>
                  <button onClick={() => updateBookingStatus(booking.id, 'rejected')} className="flex items-center gap-2 flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all"><XIcon className="w-4 h-4" />Reject</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {pendingBookings.length === 0 && (
          <div className="bg-slate-800/50 rounded-2xl p-8 text-center border border-slate-700/50"><Calendar className="w-12 h-12 mx-auto text-slate-600 mb-3" /><p className="text-slate-500">No pending bookings</p></div>
        )}
      </div>
      {processedBookings.length > 0 && (
        <>
          <h3 className="text-lg font-semibold text-slate-400 mt-8">Processed Bookings</h3>
          <div className="bg-slate-800/50 rounded-2xl divide-y divide-slate-700/50 border border-slate-700/50">
            {processedBookings.map(booking => (
              <div key={booking.id} className="p-4 flex items-center justify-between">
                <div><p className="text-white font-medium">{booking.name}</p><p className="text-slate-500 text-sm">{booking.email} - {booking.phone}</p></div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${booking.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{booking.status}</span>
                  <button onClick={() => deleteBooking(booking.id)} className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
