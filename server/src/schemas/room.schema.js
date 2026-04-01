const { z } = require('zod');

const roomCreateSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    type: z.enum(['STANDARD', 'DELUXE', 'SUITE', 'PRESIDENTIAL']),
    description: z.string().min(10),
    longDesc: z.string().min(20),
    pricePerNight: z.number().positive(),
    maxGuests: z.number().int().positive(),
    inventoryCount: z.number().int().positive().default(1),
    bedType: z.string().min(2),
    size: z.number().positive(),
    floor: z.number().int(),
    viewType: z.string().min(2),
    images: z.array(z.string()).default([]),
    amenities: z.array(z.string()).default([]),
    signatureExperiences: z.array(z.string()).default([]),
    checkInTime: z.string().optional(),
    checkOutTime: z.string().optional(),
    cancellationPolicy: z.string().optional(),
    paymentPolicy: z.string().optional(),
    guestAssurancePoints: z.array(z.string()).default([]),
    isFeatured: z.boolean().default(false),
    isAvailable: z.boolean().default(true),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

module.exports = { roomCreateSchema };
