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
  unsplash: {
    photos: (query: string) => ['unsplash', 'photos', query] as const,
  },
  admin: {
    allBookings: () => ['admin', 'bookings'] as const,
    bookings: (status?: string, page?: number) => ['admin', 'bookings', status ?? 'all', page ?? 1] as const,
    booking: (id: number) => ['admin', 'bookings', id] as const,
    reviews: (isApproved?: boolean, page?: number) => ['admin', 'reviews', isApproved ?? 'all', page ?? 1] as const,
    customers: (page?: number, search?: string) => ['admin', 'customers', page ?? 1, search ?? ''] as const,
    customer: (id: string) => ['admin', 'customers', id] as const,
    customerBookings: (id: string) => ['admin', 'customers', id, 'bookings'] as const,
  },
} as const;
 