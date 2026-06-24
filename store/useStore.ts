'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Salon, Service, Stylist, Comment } from '@/lib/data'

export interface BookingState {
  salon: Salon | null
  service: Service | null
  stylist: Stylist | null
  date: string
  time: string
  paymentMethod: 'card' | 'upi' | 'wallet'
  notes: string
}

export interface UserProfile {
  name: string
  email: string
  phone: string
  avatar: string
  points: number
  tier: 'Silver' | 'Gold' | 'Platinum'
  totalBookings: number
  totalSaved: number
}

interface AppStore {
  // User
  user: UserProfile
  updateUser: (u: Partial<UserProfile>) => void
  addPoints: (n: number) => void

  // Booking
  booking: BookingState
  setBookingSalon: (s: Salon) => void
  setBookingService: (s: Service) => void
  setBookingStylist: (s: Stylist | null) => void
  setBookingDate: (d: string) => void
  setBookingTime: (t: string) => void
  setBookingPayment: (m: 'card' | 'upi' | 'wallet') => void
  setBookingNotes: (n: string) => void
  clearBooking: () => void

  // Favorites
  favorites: number[]
  toggleFavorite: (id: number) => void

  // UI
  notifCount: number
  setNotifCount: (n: number) => void

  // Chat history
  chatHistory: { role: 'user' | 'ai'; text: string; ts: number }[]
  addChatMessage: (msg: { role: 'user' | 'ai'; text: string }) => void
  clearChat: () => void

  // Gallery (Likes & Comments)
  likes: Record<number, boolean>
  toggleLike: (galleryItemId: number) => void
  comments: Record<number, Comment[]>
  addComment: (galleryItemId: number, text: string) => void
}

const defaultBooking: BookingState = {
  salon: null, service: null, stylist: null,
  date: '', time: '', paymentMethod: 'card', notes: '',
}

export const useStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // ── User ────────────────────────────────────────────────────────────
      user: {
        name: 'Priya Singh', email: 'priya.singh@email.com',
        phone: '+91 98765 43210', avatar: 'P',
        points: 2450, tier: 'Gold',
        totalBookings: 12, totalSaved: 1240,
      },
      updateUser: (u) => set(s => ({ user: { ...s.user, ...u } })),
      addPoints: (n) => set(s => ({
        user: {
          ...s.user,
          points: s.user.points + n,
          tier: s.user.points + n >= 5000 ? 'Platinum'
            : s.user.points + n >= 2000 ? 'Gold' : 'Silver',
        },
      })),

      // ── Booking ──────────────────────────────────────────────────────────
      booking: defaultBooking,
      setBookingSalon: (salon) => set(s => ({ booking: { ...s.booking, salon } })),
      setBookingService: (service) => set(s => ({ booking: { ...s.booking, service } })),
      setBookingStylist: (stylist) => set(s => ({ booking: { ...s.booking, stylist } })),
      setBookingDate: (date) => set(s => ({ booking: { ...s.booking, date } })),
      setBookingTime: (time) => set(s => ({ booking: { ...s.booking, time } })),
      setBookingPayment: (paymentMethod) => set(s => ({ booking: { ...s.booking, paymentMethod } })),
      setBookingNotes: (notes) => set(s => ({ booking: { ...s.booking, notes } })),
      clearBooking: () => set({ booking: defaultBooking }),

      // ── Favorites ────────────────────────────────────────────────────────
      favorites: [1, 2],
      toggleFavorite: (id) => set(s => ({
        favorites: s.favorites.includes(id)
          ? s.favorites.filter(f => f !== id)
          : [...s.favorites, id],
      })),

      // ── UI ───────────────────────────────────────────────────────────────
      notifCount: 3,
      setNotifCount: (n) => set({ notifCount: n }),

      // ── Chat ─────────────────────────────────────────────────────────────
      chatHistory: [
        { role: 'ai', text: "✨ Hi! I'm Glow, your personal AI beauty assistant. I know your style preferences, skin type, and booking history. How can I help you today?", ts: Date.now() },
      ],
      addChatMessage: (msg) => set(s => ({
        chatHistory: [...s.chatHistory, { ...msg, ts: Date.now() }],
      })),
      clearChat: () => set({
        chatHistory: [{ role: 'ai', text: "✨ Hi! I'm Glow, your personal AI beauty assistant. How can I help you today?", ts: Date.now() }],
      }),

      // ── Gallery ──────────────────────────────────────────────────────────
      likes: {},
      toggleLike: (id) => set(s => ({
        likes: { ...s.likes, [id]: !s.likes[id] }
      })),
      comments: {
        1: [
          { id: 'c1', text: 'Love this color so much 😍', user: 'Sneha M.', avatar: 'S', timestamp: Date.now() - 86400000 },
          { id: 'c2', text: 'Did it fade quickly?', user: 'Riya P.', avatar: 'R', timestamp: Date.now() - 3600000 }
        ],
        4: [
          { id: 'c3', text: 'Highly recommend this facial! ✨', user: 'Kavya N.', avatar: 'K', timestamp: Date.now() - 172800000 }
        ]
      },
      addComment: (id, text) => set(s => {
        const newComment: Comment = {
          id: Math.random().toString(36).substring(7),
          text,
          user: s.user.name,
          avatar: s.user.avatar,
          timestamp: Date.now(),
        }
        return {
          comments: {
            ...s.comments,
            [id]: [...(s.comments[id] || []), newComment]
          }
        }
      }),
    }),
    {
      name: 'glowcity-store',
      partialize: (s) => ({
        user: s.user,
        favorites: s.favorites,
        chatHistory: s.chatHistory,
        likes: s.likes,
        comments: s.comments,
      }),
    }
  )
)
