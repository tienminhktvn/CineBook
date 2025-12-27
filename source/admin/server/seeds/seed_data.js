/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // CLEANUP (Delete in reverse order of dependency)
  await knex("payments").del();
  await knex("booking_snacks").del();
  await knex("booking_seats").del();
  await knex("bookings").del();
  await knex("snacks").del();
  await knex("showtimes").del();
  await knex("seats").del();
  await knex("cinema_halls").del();
  await knex("movies").del();
  await knex("users").del();
  await knex("roles").del();

  console.log("🧹 Cleaned existing data");

  // ROLES
  const rolesData = await knex("roles")
    .insert([
      { name: "customer", description: "Regular Moviegoer" },
      { name: "admin", description: "System administrator" },
      { name: "staff", description: "Cinema staff" },
    ])
    .returning("*");

  const roleMap = rolesData.reduce((acc, role) => {
    acc[role.name] = role.id;
    return acc;
  }, {});

  // USERS
  // Example hash for "password123"
  const DUMMY_HASH =
    "$2b$10$ywSU0qfbTIVj6sg08yjZh.jMv4jLGd84iLT0LF8GYQTIK0/Q616pm";

  const usersData = await knex("users")
    .insert([
      {
        role_id: roleMap["admin"],
        username: "admin_user",
        password_hash: DUMMY_HASH,
        email: "admin@cinema.com",
        full_name: "Super Admin",
        status: "active",
        phone_number: "0901000001",
      },
      {
        role_id: roleMap["staff"],
        username: "staff_one",
        password_hash: DUMMY_HASH,
        email: "staff@cinema.com",
        full_name: "Ticket Staff",
        status: "active",
        phone_number: "0901000002",
      },
      {
        role_id: roleMap["customer"],
        username: "john_doe",
        password_hash: DUMMY_HASH,
        email: "john@gmail.com",
        full_name: "John Doe",
        status: "active",
        phone_number: "0909123456",
      },
    ])
    .returning("*");

  const customerUser = usersData.find((u) => u.username === "john_doe");

  // MOVIES
  const moviesData = await knex("movies")
    .insert([
      {
        title: "Inception",
        genre: "Sci-Fi",
        description:
          "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO, but his tragic past may doom the project and his team to disaster.",
        duration_minutes: 148,
        release_date: "2010-07-16",
        poster_url:
          "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_QL75_UX190_CR0,0,190,281_.jpg",
      },
      {
        title: "The Dark Knight",
        genre: "Action",
        description:
          "When a menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman, James Gordon and Harvey Dent must work together to put an end to the madness.",
        duration_minutes: 152,
        release_date: "2008-07-18",
        poster_url:
          "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_QL75_UX190_CR0,0,190,281_.jpg",
      },
      {
        title: "The Shawshank Redemption",
        genre: "Drama",
        description:
          "A banker convicted of uxoricide forms a friendship over a quarter century with a hardened convict, while maintaining his innocence and trying to remain hopeful through simple compassion.",
        duration_minutes: 152,
        release_date: "2008-07-18",
        poster_url:
          "https://m.media-amazon.com/images/M/MV5BMDAyY2FhYjctNDc5OS00MDNlLThiMGUtY2UxYWVkNGY2ZjljXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg",
      },
      {
        title: "Avatar: Fire and Ash",
        genre: "Drama",
        description:
          "Jake and Neytiri's family grapples with grief, encountering a new, aggressive Na'vi tribe, the Ash People, who are led by the fiery Varang, as the conflict on Pandora escalates and a new moral focus emerges.",
        duration_minutes: 197,
        release_date: "2025-12-19",
        poster_url:
          "https://m.media-amazon.com/images/M/MV5BYmUxOTlhYzctMDlmOS00Y2Y3LWJiMDEtNjdkN2I2NjdlNWYwXkEyXkFqcGc@._V1_QL75_UX190_CR0,2,190,281_.jpg",
      },
    ])
    .returning("*");

  // CINEMA HALLS
  const hallsData = await knex("cinema_halls")
    .insert([
      { name: "Hall 1 (Standard)", total_seats: 50, status: "active" },
      { name: "Hall 2 (IMAX)", total_seats: 100, status: "active" },
    ])
    .returning("*");

  const standardHall = hallsData[0];
  const imaxHall = hallsData[1];

  // SEATS
  const seatsPayload = [];

  // Helper to generate rows for a hall
  const generateSeats = (hallId, rows, seatsPerRow, type = "standard") => {
    rows.forEach((rowLetter) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        seatsPayload.push({
          hall_id: hallId,
          row_letter: rowLetter,
          seat_number: i,
          type: type,
          is_active: true,
        });
      }
    });
  };

  // Generate for Standard Hall (Rows A-C, 10 seats each)
  generateSeats(standardHall.id, ["A", "B", "C"], 10, "standard");

  // Generate for IMAX Hall (Rows A-E, 12 seats each, Row E is VIP)
  generateSeats(imaxHall.id, ["A", "B", "C", "D"], 12, "standard");
  generateSeats(imaxHall.id, ["E"], 12, "vip");

  // Bulk insert seats
  const insertedSeats = await knex("seats").insert(seatsPayload).returning("*");

  // SHOWTIMES
  // Create a showtime for tomorrow 19:00
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(19, 0, 0, 0);

  const endTime = new Date(tomorrow);
  endTime.setMinutes(endTime.getMinutes() + moviesData[0].duration_minutes);

  const showtimesData = await knex("showtimes")
    .insert([
      {
        movie_id: moviesData[0].id, // Inception
        hall_id: standardHall.id,
        start_time: tomorrow,
        end_time: endTime,
        base_price: 75000.0, // 75k VND
      },
    ])
    .returning("*");

  const targetShowtime = showtimesData[0];

  // SNACKS
  const snacksData = await knex("snacks")
    .insert([
      {
        name: "Popcorn (L)",
        unit_price: 50000.0,
        image_url:
          "https://media.istockphoto.com/id/497857462/photo/popcorn-in-bucket.jpg?s=612x612&w=0&k=20&c=16mUWDBsQt4EpO-k3C-OqLiDfuigkawrxS1C6Y0cQuM=",
      },
      {
        name: "Coke (M)",
        unit_price: 25000.0,
        image_url:
          "https://t4.ftcdn.net/jpg/02/83/22/53/360_F_283225343_1pXXdsL8ivth4UOjvygvfqGUKFCNoPvg.jpg",
      },
      {
        name: "Combo 1 (1 Popcorn + 1 Coke)",
        unit_price: 70000.0,
        image_url:
          "https://media.istockphoto.com/id/497858028/photo/popcorn-in-box-with-cola.jpg?s=612x612&w=0&k=20&c=1y0eL4C-TrrRd_LF_me9KFrfllRSajBG3Jw4DeAGTGA=",
      },
    ])
    .returning("*");

  // BOOKINGS
  const seatsToBook = insertedSeats.filter(
    (s) =>
      s.hall_id === standardHall.id &&
      s.row_letter === "A" &&
      [5, 6].includes(s.seat_number)
  );

  const bookingTotal = parseFloat(targetShowtime.base_price) * 2 + 70000; // 2 tickets + 1 combo

  const bookingData = await knex("bookings")
    .insert([
      {
        user_id: customerUser.id,
        showtime_id: targetShowtime.id,
        total_amount: bookingTotal,
        status: "confirmed",
        qr_code_hash: "valid_qr_hash_123",
        booking_date: new Date(),
      },
    ])
    .returning("*");

  const booking = bookingData[0];

  // 10. BOOKING DETAILS (Seats & Snacks)
  await knex("booking_seats").insert(
    seatsToBook.map((seat) => ({
      booking_id: booking.id,
      seat_id: seat.id,
      price_at_booking: targetShowtime.base_price,
    }))
  );

  await knex("booking_snacks").insert([
    {
      booking_id: booking.id,
      snack_id: snacksData.find((s) => s.name.startsWith("Combo")).id,
      quantity: 1,
      price_at_booking: 70000.0,
    },
  ]);

  // PAYMENTS
  await knex("payments").insert([
    {
      booking_id: booking.id,
      amount: bookingTotal,
      method: "momo",
      transaction_reference: "MOMO123456789",
      payment_time: new Date(),
    },
  ]);

  console.log(
    "✅ Seed finished: Created Users, Movies, Halls, Seats, Showtimes, and 1 Test Booking."
  );
};
