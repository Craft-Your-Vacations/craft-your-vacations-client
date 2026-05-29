export const queryKeys = {
  destinations: {
    all: () => ['destinations'] as const,
    detail: (slug: string) => ['destinations', 'detail', slug] as const,
  },
  packages: {
    detail: (slug: string, key: string) => ['packages', 'detail', slug, key] as const,
  },
  profile: {
    me: () => ['profile', 'me'] as const,
  },
  bookings: {
    my: () => ['bookings', 'my'] as const,
    detail: (id: number) => ['bookings', 'detail', id] as const,
  },
  documents: {
    my: () => ['documents', 'my'] as const,
  },
  reviews: {
    byDestination: (slug: string) => ['reviews', 'destination', slug] as const,
    approved: () => ['reviews', 'approved'] as const,
  },
  admin: {
    allBookings: () => ['admin', 'bookings'] as const,
    bookings: (status?: string) => ['admin', 'bookings', status ?? 'all'] as const,
    booking: (id: number) => ['admin', 'bookings', id] as const,
    reviews: () => ['admin', 'reviews'] as const,
    customers: () => ['admin', 'customers'] as const,
    customer: (id: string) => ['admin', 'customers', id] as const,
  },
} as const;
 