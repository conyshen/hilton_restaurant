import { gql } from "@apollo/client";

export const CREATE_BOOKING = gql`
  mutation createBooking(
    $guestName: String,
    $tableSize: Int, 
    $arrivalDate: String, 
    $arrivalTime: String, 
    $status: String, 
    $contact: String) { 
  createBooking(
    guestName: $guestName, 
    tableSize: $tableSize, 
    arrivalDate: $arrivalDate, 
    arrivalTime: $arrivalTime, 
    status: $status, 
    contact: $contact) { 
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

export const UPDATE_BOOKING = gql`
  mutation updateBookingById($id: String, $bookingUpdate: BookingUpdateInput) {
    updateBookingById(id: $id, bookingUpdate: $bookingUpdate) {
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

export const LIST_ALL_BOOKINGS = gql`
  query ListAllBooking {
    listAllBooking {
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

export const LIST_BOOKINGS_BY_STATUS_DATE = gql`
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

export const LIST_BOOKINGS_BY_CONTACT_NUMBER = gql`
  query listAllBookingByContactNumber($guestName: String, $contact: String) {
    listAllBookingByContactNumber(guestName: $guestName, contact: $contact) {
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