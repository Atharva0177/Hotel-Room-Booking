const { z } = require('zod');

const bookingCreateSchema = z.object({
  body: z.object({
    roomId: z.string().min(1),
    checkIn: z.string().datetime(),
    checkOut: z.string().datetime(),
    adults: z.number().int().min(1).max(10),
    children: z.number().int().min(0).max(5).default(0),
    guestName: z.string().min(2),
    guestEmail: z.string().email(),
    guestPhone: z.string().min(10),
    specialRequests: z.string().optional(),
    promoCode: z.string().optional(),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

module.exports = { bookingCreateSchema };
