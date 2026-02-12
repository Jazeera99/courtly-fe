import { gql } from '@apollo/client';

// Query untuk mengambil semua lapangan
export const GET_FIELDS = gql`
  query Fields($city: String) {
    fields(city: $city) {
      id
      name
      full_address
      city
      province
      pricePerHour
      imageUrl
      description
    }
  }
`;

// Query untuk cek slot yang tersedia berdasarkan tanggal
export const GET_AVAILABLE_SLOTS = gql`
  query GetAvailableSlots($fieldId: ID!, $date: Date!) {
    availableSlots(fieldId: $fieldId, date: $date) {
      id
      start
      end
      price
      available
    }
  }
`;

export const GET_BOOKING_DATA = gql`
  query GetBookingData($date: Date!) {
    fields {
      id
      name
      description
      pricePerHour
      full_address
      city
      province
      opening_time
      closing_time
      field_images {
        image_path
      }
      field_facilities {
        facilities {
          name
        }
      }
      # Ini yang paling penting untuk Step 1 & 2
      availableSlots(date: $date) {
        id
        start
        end
        price
        available
      }
    }
  }
`;

// Query untuk cek detail lapangan berdasarkan ID
export const GET_FIELD_DETAIL = gql`
  query GetFieldDetail($id: ID!) {
    fieldDetail(id: $id) {
      id
      name
      description
      full_address
      maps_url
      city
      province
      pricePerHour
      opening_time
      closing_time
      field_facilities {
        facilities {
          name
        }
      }
      field_categories {
        categories {
          name
        }
      }
      field_images {
        image_path
      }
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      user {
        id
        name
        email
        phone
        role
      }
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        phone
        role
        venues {
          id
        }
      }
    }
  }
`;

export const GET_MY_BOOKINGS = gql`
  query GetMyBookings {
    myBookings {
      id
      courtName
      venue
      location
      status
      price
      createdAt
      paymentTime
      paymentStatus
      paymentMethod
      timeSlots
      invoiceNumber
      customerName
      customerPhone
      ownerName
      ownerPhone
      paymentTime
    }
  }
`;

export const GET_PARTNER_COURTS = gql`
  query GetPartnerCourts($venueId: ID!) {
    getPartnerCourts(venueId: $venueId) {
      id
      name
      description
      pricePerHour
      is_available
      city
      province
      full_address
      opening_time
      closing_time
      bookingsToday
      # Tambahkan field berikut jika didukung backend
      # capacity 
      # size
      # todayBookingsCount
      field_categories {
        categories {
          name
        }
      }
      field_images {
        image_path
      }
    }
  }
`;

// export const GET_PARTNER_STATS = gql`
//   query GetPartnerStats($venueId: ID!) {
//     getPartnerStats(venueId: $venueId) {
//       totalCourts
//       availableCourts
//       maintenanceCourts
//       bookingsToday
//       totalRevenue
//       totalBookings
//       transactions {
//         id
//         customerName
//         fieldName
//         amount
//         date
//         status
//       }
//     }
//   }
// `;

export const GET_PARTNER_STATS = gql`
  query GetPartnerStats($venueId: String!, $timeRange: String!) {
    getPartnerStats(venueId: $venueId, timeRange: $timeRange) {
      stats {
        totalRevenue
        totalBookings
        averagePrice
        growth
        totalCourts
        availableCourts
        maintenanceCourts
        bookingsToday
      }
      monthlyTrend {
        month
        revenue
        bookings
      }
      topCourts {
        name
        revenue
        bookings
        percentage
      }
      transactions {
        id
        customerName
        fieldName
        amount
        date
        status
        method
        paidAt 
      }
    }
  }
`;

export const GET_VENUE_BOOKINGS = gql`
  query GetVenueBookings($venueId: ID!) {
    getVenueBookings(venueId: $venueId) {
      id
      status
      payment_status
      final_amount
      start_time
      end_time
      users {
        name
        phone
      }
      fields {
        name
      }
    }
  }
`;

export const GET_BOOKINGS = gql`
  query GetVenueBookings($venueId: ID!) {
    getVenueBookings(venueId: $venueId) {
      id
      courtName
      customerName
      bookingDate
      startTime
      endTime
      status
      totalPrice
    }
  }
`;

export const GET_VENUE_SCHEDULE = gql`
  query GetVenueSchedule($venueId: String!, $date: String!) {
    getVenueSchedule(venueId: $venueId, date: $date) {
      courts {
        id
        name
      }
      timeSlots {
        time
        courtStatus # JSON ini sekarang otomatis mengandung field 'customer'
      }
    }
  }
`;

export const GET_VENUE_PROFILE = gql`
  query GetVenueProfile($venueId: String!) {
    getVenueProfile(venueId: $venueId) {
      id
      ownerName
      email
      phone
      address
      city
      province
      created_at
      total_bookings
    }
  }
`;