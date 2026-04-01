const bcrypt = require('bcrypt');
const { PrismaClient, Role, RoomType, BookingStatus } = require('@prisma/client');

const prisma = new PrismaClient();

const roomImage = (seed) => `https://picsum.photos/seed/${seed}/1200/800`;

const rooms = [
  {
    name: 'Serene Standard Garden',
    slug: 'serene-standard-garden',
    type: RoomType.STANDARD,
    description: 'A calm standard room with lush garden views.',
    longDesc: 'Thoughtfully designed for comfort, this room combines plush bedding, handcrafted decor, and a peaceful garden outlook.',
    pricePerNight: 5000,
    maxGuests: 2,
    bedType: 'Queen',
    size: 320,
    floor: 2,
    viewType: 'Garden View',
    amenities: ['Free WiFi', 'Air Conditioning', 'Work Desk', 'Room Service'],
    isFeatured: false,
  },
  {
    name: 'Urban Standard City',
    slug: 'urban-standard-city',
    type: RoomType.STANDARD,
    description: 'A cozy room with skyline views.',
    longDesc: 'Ideal for short stays and business guests, offering premium linen, smart lighting, and elegant interiors.',
    pricePerNight: 5000,
    maxGuests: 2,
    bedType: 'Queen',
    size: 330,
    floor: 4,
    viewType: 'City View',
    amenities: ['Free WiFi', 'Smart TV', 'Air Conditioning', 'Mini Bar'],
    isFeatured: false,
  },
  {
    name: 'Deluxe Pool Retreat',
    slug: 'deluxe-pool-retreat',
    type: RoomType.DELUXE,
    description: 'Spacious deluxe room overlooking pool.',
    longDesc: 'A sophisticated retreat with enhanced space and premium amenities with direct visual access to our infinity pool.',
    pricePerNight: 10000,
    maxGuests: 3,
    bedType: 'King',
    size: 460,
    floor: 3,
    viewType: 'Pool View',
    amenities: ['Free WiFi', 'Pool Access', 'Coffee Machine', 'Balcony'],
    isFeatured: true,
  },
  {
    name: 'Deluxe Sea Horizon',
    slug: 'deluxe-sea-horizon',
    type: RoomType.DELUXE,
    description: 'Sea-facing deluxe escape.',
    longDesc: 'Wake up to panoramic sea views in this beautifully lit room with custom furnishings and smart climate controls.',
    pricePerNight: 10000,
    maxGuests: 3,
    bedType: 'King',
    size: 480,
    floor: 5,
    viewType: 'Sea View',
    amenities: ['Free WiFi', 'Ocean View', 'Balcony', 'Mini Bar'],
    isFeatured: true,
  },
  {
    name: 'Ocean Signature Suite',
    slug: 'ocean-signature-suite',
    type: RoomType.SUITE,
    description: 'Luxury suite with private lounge.',
    longDesc: 'A high-end suite that blends elegance and privacy with curated artwork and a dedicated lounge space.',
    pricePerNight: 20000,
    maxGuests: 4,
    bedType: 'King',
    size: 720,
    floor: 8,
    viewType: 'Ocean View',
    amenities: ['Free WiFi', 'Jacuzzi', 'Living Area', 'Butler Service'],
    isFeatured: true,
  },
  {
    name: 'Rooftop Skyline Suite',
    slug: 'rooftop-skyline-suite',
    type: RoomType.SUITE,
    description: 'A dramatic rooftop suite.',
    longDesc: 'Located at the top floors, this suite offers unmatched city panoramas and a warm luxury ambiance.',
    pricePerNight: 20000,
    maxGuests: 4,
    bedType: 'King',
    size: 760,
    floor: 10,
    viewType: 'City + Rooftop View',
    amenities: ['Free WiFi', 'Private Terrace', 'Jacuzzi', 'Premium Bar'],
    isFeatured: true,
  },
  {
    name: 'Imperial Presidential Residence',
    slug: 'imperial-presidential-residence',
    type: RoomType.PRESIDENTIAL,
    description: 'Our most exclusive experience.',
    longDesc: 'The pinnacle of luxury with curated interiors, personal concierge service, and expansive living quarters.',
    pricePerNight: 50000,
    maxGuests: 6,
    bedType: 'Super King',
    size: 1600,
    floor: 12,
    viewType: 'Panoramic Ocean + City',
    amenities: ['Private Butler', 'Jacuzzi', 'Dining Lounge', 'Airport Transfer'],
    isFeatured: true,
  },
  {
    name: 'Moonlight Honeymoon Suite',
    slug: 'moonlight-honeymoon-suite',
    type: RoomType.SUITE,
    description: 'Romantic luxury for couples.',
    longDesc: 'A romantic setting with curated lighting, private dining options, and a luxurious soaking area.',
    pricePerNight: 30000,
    maxGuests: 2,
    bedType: 'King',
    size: 820,
    floor: 9,
    viewType: 'Ocean Sunset View',
    amenities: ['Romantic Setup', 'Jacuzzi', 'Private Dining', 'Sea View'],
    isFeatured: true,
  },
];

async function main() {
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.room.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const guestPassword = await bcrypt.hash('Guest@123', 12);

  const admin = await prisma.user.create({
    data: {
      firstName: 'Admin',
      lastName: 'Aurelia',
      email: 'admin@aureliagrand.com',
      password: adminPassword,
      role: Role.ADMIN,
      phone: '9999999999',
      nationality: 'India',
    },
  });

  const guest = await prisma.user.create({
    data: {
      firstName: 'Test',
      lastName: 'Guest',
      email: 'guest@test.com',
      password: guestPassword,
      role: Role.GUEST,
      phone: '8888888888',
      nationality: 'India',
    },
  });

  const createdRooms = [];
  for (let i = 0; i < rooms.length; i += 1) {
    const room = rooms[i];
    const created = await prisma.room.create({
      data: {
        ...room,
        images: [roomImage(`${room.slug}-1`), roomImage(`${room.slug}-2`), roomImage(`${room.slug}-3`)],
      },
    });
    createdRooms.push(created);
  }

  await prisma.offer.createMany({
    data: [
      {
        title: 'Early Bird Escape',
        description: 'Book early and save 10% on your stay.',
        discount: 10,
        code: 'EARLY10',
        validFrom: new Date('2026-01-01'),
        validUntil: new Date('2026-12-31'),
        minNights: 2,
      },
      {
        title: 'Summer Signature Deal',
        description: 'Enjoy 20% off for summer luxury stays.',
        discount: 20,
        code: 'SUMMER20',
        validFrom: new Date('2026-06-01'),
        validUntil: new Date('2026-08-31'),
        minNights: 1,
      },
      {
        title: 'Weekend Gold Offer',
        description: '15% discount for weekend bookings.',
        discount: 15,
        code: 'WEEKEND15',
        validFrom: new Date('2026-01-01'),
        validUntil: new Date('2026-12-31'),
        minNights: 1,
      },
    ],
  });

  for (let i = 0; i < 10; i += 1) {
    const room = createdRooms[i % createdRooms.length];
    const checkIn = new Date();
    checkIn.setDate(checkIn.getDate() - (20 + i));
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + 2);

    const booking = await prisma.booking.create({
      data: {
        bookingCode: `AUR-202603${String(i + 1).padStart(2, '0')}-${10000 + i}`,
        userId: guest.id,
        roomId: room.id,
        checkIn,
        checkOut,
        nights: 2,
        adults: 2,
        children: 0,
        totalPrice: room.pricePerNight * 2,
        taxAmount: room.pricePerNight * 2 * 0.18,
        finalPrice: room.pricePerNight * 2 * 1.18,
        status: BookingStatus.CHECKED_OUT,
        paymentStatus: 'PAID',
        guestName: 'Test Guest',
        guestEmail: 'guest@test.com',
        guestPhone: '8888888888',
      },
    });

    await prisma.review.create({
      data: {
        userId: guest.id,
        roomId: room.id,
        bookingId: booking.id,
        rating: 4 + (i % 2),
        title: `Wonderful stay #${i + 1}`,
        comment: 'The hospitality, ambience, and comfort were excellent. Will return soon.',
        isApproved: true,
      },
    });
  }

  console.log(`Seed complete. Admin: ${admin.email}, Guest: ${guest.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
