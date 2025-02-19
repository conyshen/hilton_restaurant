import Booking from "../src/models/bookingModel"; // Adjust the path for your model
import { MongoMemoryServer } from "mongodb-memory-server";

import mongoose from "mongoose";
import test, { describe } from "node:test";
import { app } from "../server";
import { v4 as uuidv4 } from "uuid";
// Set up MongoDB connection before all tests
let mongoServer: MongoMemoryServer;
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  // Connect Mongoose to the in-memory MongoDB server
  await mongoose.connect(mongoUri);

  app.listen(4000, async () => {
    console.log("Server is running on http://localhost:4000");
  });
});

// Clean up the database after tests
afterAll(async () => {
  // Close the Mongoose connection and stop the in-memory MongoDB server
  await mongoose.connection.close();
  await mongoServer.stop();
  console.log('MongoDB connection closed and server stopped');
});


afterEach(async () => {
  try {
    // Drop the database after each test
    await mongoose.connection.db!.dropDatabase();
    console.log('Database dropped successfully');
  } catch (error) {
    console.error('Error dropping database:', error);
  }
});

const graphqlRequest = async (query: string, variables: any = {}) => {
  const res = await fetch("http://localhost:4000/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  return await res.json();
};

// Unit Tests
describe("GraphQL API - Booking", () => {
  test("updateBookingById updates the booking status and arrival time", async () => {
    const newBooking = await Booking.create({
      guestName: "Jane Doe",
      tableSize: 2,
      status: "pending",
      arrivalTime: "1300",
      arrivalDate: "2025-02-21",
      contact: "9876543210",
    });

    const updateBookingMutation = `
      mutation updateBookingById($id: String,  $bookingUpdate:BookingUpdateInput) { 
      updateBookingById(id: $id,bookingUpdate: $bookingUpdate) { 
        id
        guestName
        tableSize
        arrivalTime
        status
        contact
        arrivalDate
        } 
      }
    `;

    const variables = {
      id: newBooking.id,
      bookingUpdate: {
        status: "confirmed",
        arrivalTime: "1500",
        arrivalDate: "2025-02-20",
      },
    };

    const response = await graphqlRequest(updateBookingMutation, variables);
    expect(response.data.updateBookingById.status).toBe("confirmed");
    expect(response.data.updateBookingById.arrivalTime).toBe("1500");
    expect(response.data.updateBookingById.arrivalDate).toBe("2025-02-20");
  });

  test("listAllBooking returns all bookings", async () => {
    const booking = await Booking.create({
      guestName: "Mark Smith",
      status: "confirmed",
      arrivalDate: "2025-02-19",
      arrivalTime: "1345",
      contact: "1122334455",
      tableSize: 5,
    });
    const listAllBookingQuery = `
      query ListAllBooking { listAllBooking { id guestName tableSize arrivalDate arrivalTime status contact } }
    `;
    const listAllBookingVariables = {
      arrivalDate: "2025-02-19",
      status: "pending",
    };
    const response = await graphqlRequest(
      listAllBookingQuery,
      listAllBookingVariables
    );

    expect(response.data.listAllBooking.length).toBeGreaterThan(0);
    expect(response.data.listAllBooking[0].guestName).toBeDefined();
  });

  test("listBookingsByDateAndStatus returns bookings filtered by date and status", async () => {
    const booking = await Booking.create({
      guestName: "Anna Lee",
      status: "cancel",
      arrivalDate: "2025-02-20",
      arrivalTime: "1500",
      contact: "3344556677",
      tableSize: 3,
    });

    const listBookingsQuery = `
      query listAllbookingByStatusDate($arrivalDate: String, $status: String) { 
      listAllbookingByStatusDate(arrivalDate: $arrivalDate, status: $status) { 
        id 
        guestName 
        tableSize 
        arrivalDate 
        status 
        contact 
        } 
      }
    `;

    const variables = {
      arrivalDate: "2025-02-20",
      status: "cancel",
    };

    const response = await graphqlRequest(listBookingsQuery, variables);
    expect(response.data.listAllbookingByStatusDate[0].guestName).toBe(
      "Anna Lee"
    );
  });

  test("createBooking creates a new booking", async () => {
    const createBookingMutation = `
      mutation createBooking($guestName: String, $tableSize: Int, $arrivalDate: String, $arrivalTime: String, $status: String, $contact: String) { 
      createBooking(guestName: $guestName, tableSize: $tableSize, arrivalDate: $arrivalDate, arrivalTime: $arrivalTime, status: $status, contact: $contact) {
        id 
        guestName 
        tableSize 
        arrivalDate 
        arrivalTime 
        status 
        contact 
      } 
    }
    `;

    const variables = {
      guestName: "John Doe",
      contact: "1234567890",
      tableSize: 10,
      arrivalTime: "1545",
      arrivalDate: "2025-02-19",
      status: "pending",
    };
    const response = await graphqlRequest(createBookingMutation, variables);
    expect(response.data.createBooking.guestName).toBe("John Doe");
    expect(response.data.createBooking.status).toBe("pending");
    expect(response.data.createBooking.arrivalTime).toBe("1545");
    expect(response.data.createBooking.arrivalDate).toBe("2025-02-19");
  });
});
