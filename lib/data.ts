export const IMG = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?w=${w}&q=80&fit=crop`

export interface Salon {
  id: number; name: string; area: string; city: string; lat: number; lng: number
  rating: number; reviews: number; price: string; priceNum: number
  category: string; image: string; images: string[]; badge: string; wait: string
  tags: string[]; about: string; address: string; phone: string; hours: string
  amenities: string[]; established: number; instagram: string
}
export interface Service {
  id: number; name: string; duration: string; price: number
  category: string; icon: string; description: string; popular: boolean
}
export interface Stylist {
  id: number; name: string; role: string; rating: number; reviews: number
  img: string; speciality: string; bio: string; experience: number
}
export interface Review {
  id: number; user: string; avatar: string; rating: number
  comment: string; date: string; service: string; salonId: number
}

export const SALONS: Salon[] = [
  { id:1, name:'Lumière Studio', area:'Bandra West', city:'Mumbai', lat:19.0596, lng:72.8295, rating:4.9, reviews:342, price:'₹2,500', priceNum:2500, category:'Hair & Makeup', image:IMG('photo-1560066984-138dadb4c035'), images:[IMG('photo-1560066984-138dadb4c035'),IMG('photo-1562322140-8baeececf3df'),IMG('photo-1521590832167-7bcbfaa6381f'),IMG('photo-1522337360788-8b13dee7a37e')], badge:'Top Rated', wait:'No Wait', tags:['Hair','Makeup','Bridal','Color'], about:"Mumbai's most exclusive hair atelier crafting bespoke transformations since 2018. Master stylists trained in Paris and London. We use Wella, Olaplex, and L'Oréal Professionnel exclusively.", address:'12 Pali Hill, Bandra West, Mumbai 400050', phone:'+91 98200 00001', hours:'Mon–Sat 9AM–8PM, Sun 10AM–6PM', amenities:['Free Wi-Fi','Complimentary Tea','Private Rooms','Valet Parking','AC'], established:2018, instagram:'@lumiere.studio.mumbai' },
  { id:2, name:'Aurore Spa & Beauty', area:'Juhu', city:'Mumbai', lat:19.1030, lng:72.8265, rating:4.8, reviews:218, price:'₹3,800', priceNum:3800, category:'Spa & Wellness', image:IMG('photo-1540555700478-4be289fbecef'), images:[IMG('photo-1540555700478-4be289fbecef'),IMG('photo-1571019613454-1cb2f99b2d8b'),IMG('photo-1544161515-4ab6ce6db874')], badge:'Luxury', wait:'~10 min', tags:['Spa','Facial','Massage','Wellness'], about:'A sanctuary of calm on Juhu Beach. Award-winning Ayurvedic therapists. Organic products from France, Japan, and Kerala. Voted #1 Spa in Mumbai 2023 & 2024.', address:'8 JVPD Scheme, Juhu, Mumbai 400049', phone:'+91 98200 00002', hours:'Daily 10AM–9PM', amenities:['Steam Room','Jacuzzi','Herbal Bar','Meditation Space','Sea View'], established:2015, instagram:'@aurore.spa.juhu' },
  { id:3, name:'Velvet & Gold', area:'Worli', city:'Mumbai', lat:19.0178, lng:72.8178, rating:4.7, reviews:190, price:'₹1,800', priceNum:1800, category:'Nails & Skin', image:IMG('photo-1562322140-8baeececf3df'), images:[IMG('photo-1562322140-8baeececf3df'),IMG('photo-1604654894610-df63bc536371'),IMG('photo-1616394584738-fc6e612e71b9')], badge:'Trending', wait:'No Wait', tags:['Nails','Skin','Waxing','Threading'], about:"Precision nail artistry and next-gen skin treatments. Home of Mumbai's most-booked nail artists. 3D nail art, gel extensions, and glass-skin facials. Hospital-grade sterilization.", address:'22 Worli Sea Face, Worli, Mumbai 400030', phone:'+91 98200 00003', hours:'Mon–Sun 10AM–8PM', amenities:['Sterilized Tools','Gel Products','UV-Free Options','Kids Corner'], established:2020, instagram:'@velvetandgold.worli' },
  { id:4, name:'Maison de Belle', area:'Colaba', city:'Mumbai', lat:18.9148, lng:72.8324, rating:4.9, reviews:401, price:'₹4,200', priceNum:4200, category:'Bridal & Events', image:IMG('photo-1521590832167-7bcbfaa6381f'), images:[IMG('photo-1521590832167-7bcbfaa6381f'),IMG('photo-1512496015851-a90fb38ba796'),IMG('photo-1487412947147-5cebf100ffc2')], badge:'Premium', wait:'~5 min', tags:['Bridal','Makeup','Hair','Events'], about:"Mumbai elite's choice for bridal, editorial, and Bollywood looks. Voted Best Bridal Studio 2022–2024 by Femina. Featured in Vogue India.", address:'5 Colaba Causeway, Colaba, Mumbai 400001', phone:'+91 98200 00004', hours:'Mon–Sat 9AM–9PM', amenities:['Bridal Suite','Pre-Wedding Trial','On-location Service','HD Photography'], established:2012, instagram:'@maisondebelle.colaba' },
  { id:5, name:'The Glow Lab', area:'Powai', city:'Mumbai', lat:19.1197, lng:72.9096, rating:4.6, reviews:156, price:'₹1,200', priceNum:1200, category:'Hair & Color', image:IMG('photo-1522337360788-8b13dee7a37e'), images:[IMG('photo-1522337360788-8b13dee7a37e'),IMG('photo-1580618672591-eb180b1a973f')], badge:'New', wait:'No Wait', tags:['Color','Balayage','Cut','Keratin'], about:"Science-backed color artistry. Olaplex, L'Oréal Professionnel, and Wella certified. Custom-formula every visit. Student discounts available.", address:'101 Hiranandani Gardens, Powai, Mumbai 400076', phone:'+91 98200 00005', hours:'Tue–Sun 10AM–7PM', amenities:['Color Bar','Olaplex Certified','Student Discount','Free Consultation'], established:2022, instagram:'@theglowlab.powai' },
  { id:6, name:'Rose Atelier', area:'Andheri West', city:'Mumbai', lat:19.1361, lng:72.8296, rating:4.7, reviews:273, price:'₹2,000', priceNum:2000, category:'Hair & Skin', image:IMG('photo-1580618672591-eb180b1a973f'), images:[IMG('photo-1580618672591-eb180b1a973f'),IMG('photo-1570172619644-dfd03ed5d881')], badge:'Popular', wait:'~15 min', tags:['Hair','Skin','Facial','Threading'], about:'Boutique beauty haven merging skincare science with artistry. Glass-skin facials and precision cuts. Dermatologist-recommended treatments using Dermalogica and The Ordinary.', address:'43 Versova Road, Andheri West, Mumbai 400061', phone:'+91 98200 00006', hours:'Mon–Sat 10AM–8PM', amenities:['Skin Analysis Device','Organic Products','Rewards Card','Dermatologist Tie-up'], established:2019, instagram:'@roseatelier.andheri' },
]

export const SERVICES: Service[] = [
  { id:1, name:'Signature Blowout', duration:'45 min', price:1800, category:'Hair', icon:'💇‍♀️', description:'A salon-perfect blowout lasting 3–5 days. Includes hydrating mask and scalp massage with essential oils.', popular:true },
  { id:2, name:'Balayage Color', duration:'3 hrs', price:6500, category:'Hair', icon:'🎨', description:"Hand-painted sun-kissed highlights with seamless transitions. Premium Wella & L'Oréal Pro. Includes Olaplex bond building.", popular:true },
  { id:3, name:'Bridal Makeup', duration:'2 hrs', price:12000, category:'Makeup', icon:'💄', description:'Flawless long-lasting bridal looks. Customized to skin tone and dress. Includes pre-wedding trial and HD touch-up kit.', popular:true },
  { id:4, name:'Deep Tissue Massage', duration:'60 min', price:3500, category:'Spa', icon:'💆‍♀️', description:'Targeted muscle relief with firm pressure and organic doTERRA essential oils. Complete nervous system reset.', popular:false },
  { id:5, name:'HydraFacial MD', duration:'75 min', price:4200, category:'Skin', icon:'✨', description:'Medical-grade skin resurfacing. Cleanses, extracts, and infuses hyaluronic acid serum. Immediate red-carpet glow.', popular:true },
  { id:6, name:'Nail Art Full Set', duration:'90 min', price:2200, category:'Nails', icon:'💅', description:'Custom gel nail art with extensions. Includes prep, shaping, cuticle care. Any design from our 500+ catalogue.', popular:true },
  { id:7, name:'Keratin Treatment', duration:'2.5 hrs', price:5500, category:'Hair', icon:'✂️', description:'Frizz-free silky hair for 4 months. Brazilian Cacau smoothing system — 100% formaldehyde-free formula.', popular:false },
  { id:8, name:'24K Gold Facial', duration:'60 min', price:3200, category:'Skin', icon:'🌟', description:'24k gold-infused luxury facial. Brightens, firms, and creates an ethereal lit-from-within glow.', popular:false },
  { id:9, name:'Aromatherapy Massage', duration:'90 min', price:4500, category:'Spa', icon:'🌿', description:'Full-body relaxation with Jurlique essential oils. Reduces cortisol, aids sleep. Includes warm stone therapy.', popular:false },
  { id:10, name:'Glass Skin Facial', duration:'60 min', price:2800, category:'Skin', icon:'💎', description:'Korean-inspired multi-step facial for mirror-like skin. Double cleanse, essence layering, and LED light therapy.', popular:false },
]

export const STYLISTS: Stylist[] = [
  { id:1, name:'Priya Sharma', role:'Senior Colorist', rating:4.9, reviews:189, img:IMG('photo-1559599101-f09722fb4948',300), speciality:'Balayage & Color Correction', bio:'10 years of color artistry. Trained at Toni & Guy London. Wella Master Colorist certified. Specializes in blonding and corrective color.', experience:10 },
  { id:2, name:'Riya Mehta', role:'Makeup Artist', rating:4.8, reviews:142, img:IMG('photo-1562322140-8baeececf3df',300), speciality:'Bridal & Editorial Makeup', bio:'8 years in beauty. Worked with Vogue India and Filmfare. Certified MAC Pro artist. 200+ brides made radiant.', experience:8 },
  { id:3, name:'Ananya Verma', role:'Spa Therapist', rating:4.7, reviews:98, img:IMG('photo-1487412947147-5cebf100ffc2',300), speciality:'Deep Tissue & Ayurvedic Therapy', bio:'Certified Ayurvedic practitioner. 6 years in luxury spas. Trained at Ananda in the Himalayas. Holistic wellness specialist.', experience:6 },
]

export const REVIEWS: Review[] = [
  { id:1, user:'Aisha Khan', avatar:'A', rating:5, comment:"Absolute magic! Priya's color work is extraordinary — my hair has never looked this good. The consultation was thorough and she really listened.", date:'2 days ago', service:'Balayage Color', salonId:1 },
  { id:2, user:'Sneha Malhotra', avatar:'S', rating:5, comment:"Luxurious yet welcoming. Got my bridal trial done and was completely blown away by Riya's artistry. Booked her immediately for my wedding!", date:'1 week ago', service:'Bridal Makeup', salonId:1 },
  { id:3, user:'Riya Patel', avatar:'R', rating:4, comment:'Great service, small wait but worth it. The keratin treatment transformed my frizzy hair — I look like a shampoo ad now!', date:'2 weeks ago', service:'Keratin Treatment', salonId:1 },
  { id:4, user:'Kavya Nair', avatar:'K', rating:5, comment:"Best HydraFacial I've ever had. Glowing for two full weeks. The aesthetician explained every step and gave perfect aftercare advice.", date:'3 weeks ago', service:'HydraFacial MD', salonId:2 },
]

export const NOTIFICATIONS = [
  { id:1, icon:'⭐', title:'Appointment confirmed!', body:'Lumière Studio · Tomorrow 3:00 PM with Priya', time:'Just now', unread:true, type:'booking' },
  { id:2, icon:'💎', title:'New reward unlocked!', body:'You earned 500 Glow Points — ₹50 cashback!', time:'2h ago', unread:true, type:'reward' },
  { id:3, icon:'🎁', title:'Weekend special for you', body:'20% off all Spa at Aurore this Sat & Sun', time:'5h ago', unread:false, type:'offer' },
  { id:4, icon:'📍', title:'New salon near you', body:'The Glow Lab opened 0.3 km from you', time:'1d ago', unread:false, type:'new' },
  { id:5, icon:'🌟', title:'Your review helped 47 people!', body:'Your Lumière Studio review is trending', time:'2d ago', unread:false, type:'social' },
]

export const CATEGORIES = [
  { name:'All', emoji:'✨' }, { name:'Hair', emoji:'✂️' }, { name:'Makeup', emoji:'💄' },
  { name:'Spa', emoji:'💆' }, { name:'Nails', emoji:'💅' }, { name:'Skin', emoji:'🌿' }, { name:'Bridal', emoji:'👰' },
]

export const TIME_SLOTS = [
  '9:00 AM','9:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM',
  '12:00 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM','4:00 PM','5:00 PM','5:30 PM','6:00 PM',
]

export const AI_QUICK_REPLIES = [
  'Book a hair appointment','Best spa near me','Nail art ideas','Recommend for dry skin',
  'Bridal packages','Weekend availability','What\'s trending?','My loyalty points',
]

export interface GalleryItem {
  id: number;
  imageUrl: string;
  title: string;
  salonId: number;
  salonName: string;
  salonSlug: string;
  serviceId: number;
  serviceCategory: string;
  description: string;
  price: number;
  tags: string[];
}

export interface Comment {
  id: string;
  text: string;
  user: string;
  avatar: string;
  timestamp: number;
}

export const SALON_GALLERY: GalleryItem[] = [
  { id: 1, imageUrl: IMG('photo-1560066984-138dadb4c035', 600), title: 'Signature Balayage', salonId: 1, salonName: 'Lumière Studio', salonSlug: 'lumiere-studio', serviceId: 2, serviceCategory: 'Hair', description: 'Sun-kissed highlights with seamless transitions using premium Olaplex treatments.', price: 6500, tags: ['#balayage', '#haircolor'] },
  { id: 2, imageUrl: IMG('photo-1595476108010-b4d1f102b1b1', 600), title: 'Bridal Glow Makeup', salonId: 4, salonName: 'Maison de Belle', salonSlug: 'maison-de-belle', serviceId: 3, serviceCategory: 'Makeup', description: 'Flawless, long-lasting bridal looks customized to your skin tone and dress.', price: 12000, tags: ['#bridal', '#makeup'] },
  { id: 3, imageUrl: IMG('photo-1596462502278-27bfdc403348', 600), title: 'Classic Manicure', salonId: 3, salonName: 'Velvet & Gold', salonSlug: 'velvet-gold', serviceId: 6, serviceCategory: 'Nails', description: 'Precision nail artistry and cuticle care with gel products.', price: 2200, tags: ['#nails', '#manicure'] },
  { id: 4, imageUrl: IMG('photo-1604654894610-df63bc536371', 600), title: 'HydraFacial Glow', salonId: 2, salonName: 'Aurore Spa & Beauty', salonSlug: 'aurore-spa', serviceId: 5, serviceCategory: 'Skin', description: 'Medical-grade skin resurfacing for an immediate red-carpet glow.', price: 4200, tags: ['#skincare', '#facial'] },
  { id: 5, imageUrl: IMG('photo-1570172619644-dfd03ed5d881', 600), title: 'Deep Tissue Massage', salonId: 2, salonName: 'Aurore Spa & Beauty', salonSlug: 'aurore-spa', serviceId: 4, serviceCategory: 'Spa', description: 'Targeted muscle relief with organic essential oils.', price: 3500, tags: ['#spa', '#massage'] },
  { id: 6, imageUrl: IMG('photo-1515688594390-b649af70d282', 600), title: 'Keratin Smoothing', salonId: 5, salonName: 'The Glow Lab', salonSlug: 'the-glow-lab', serviceId: 7, serviceCategory: 'Hair', description: 'Frizz-free, silky hair with Brazilian smoothing system.', price: 5500, tags: ['#keratin', '#hair'] },
  { id: 7, imageUrl: IMG('photo-1522337360788-8b13dee7a37e', 600), title: 'Creative Color', salonId: 1, salonName: 'Lumière Studio', salonSlug: 'lumiere-studio', serviceId: 2, serviceCategory: 'Hair', description: 'Bold and vibrant color transformations by our master colorists.', price: 7500, tags: ['#creativecolor', '#hair'] },
  { id: 8, imageUrl: IMG('photo-1616394584738-fc6e612e71b9', 600), title: '3D Nail Art', salonId: 3, salonName: 'Velvet & Gold', salonSlug: 'velvet-gold', serviceId: 6, serviceCategory: 'Nails', description: 'Intricate 3D designs and gel extensions for a unique look.', price: 3000, tags: ['#nailart', '#3dnails'] },
  { id: 9, imageUrl: IMG('photo-1580618672591-eb180b1a973f', 600), title: 'Glass Skin Treatment', salonId: 6, salonName: 'Rose Atelier', salonSlug: 'rose-atelier', serviceId: 10, serviceCategory: 'Skin', description: 'Korean-inspired facial for a luminous, mirror-like complexion.', price: 2800, tags: ['#glassskin', '#kbeauty'] },
  { id: 10, imageUrl: IMG('photo-1521590832167-7bcbfaa6381f', 600), title: 'Editorial Hair Styling', salonId: 4, salonName: 'Maison de Belle', salonSlug: 'maison-de-belle', serviceId: 1, serviceCategory: 'Hair', description: 'Avant-garde styling for shoots and special events.', price: 4500, tags: ['#editorialhair', '#styling'] },
  { id: 11, imageUrl: IMG('photo-1544161515-4ab6ce6db874', 600), title: 'Aromatherapy Escape', salonId: 2, salonName: 'Aurore Spa & Beauty', salonSlug: 'aurore-spa', serviceId: 9, serviceCategory: 'Spa', description: 'Relaxing massage with custom-blended essential oils.', price: 4500, tags: ['#aromatherapy', '#relaxation'] },
  { id: 12, imageUrl: IMG('photo-1512496015851-a90fb38ba796', 600), title: 'Party Glam Makeup', salonId: 4, salonName: 'Maison de Belle', salonSlug: 'maison-de-belle', serviceId: 3, serviceCategory: 'Makeup', description: 'Bold and beautiful makeup looks for your next big night out.', price: 6000, tags: ['#partyglam', '#makeup'] },
];

