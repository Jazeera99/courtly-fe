import { gql } from '@apollo/client';

// Query untuk mengambil semua lapangan
export const GET_FIELDS = gql`
  query Fields($city: String) {
    fields(city: $city) {
      id
      name
      city
      price_per_hour
      image_url
      description
    }
  }
`;

// Query untuk cek slot yang tersedia berdasarkan tanggal
export const GET_AVAILABLE_SLOTS = gql`
  query GetAvailableSlots($fieldId: ID!, $date: Date!) {
    availableSlots(fieldId: $fieldId, date: $date) {
      start
      end
      available
    }
  }
`;

// Ganti query GET_BOOKING_DATA Anda dengan ini agar sesuai dengan Backend
export const GET_BOOKING_DATA = gql`
  query GetBookingData($city: String, $fieldId: String!, $date: String!) {
    fields(city: $city) {
      id
      name
      city
      description
      price_per_hour
      field_images {
        image_path
      }
      field_facilities {
        facilities {
          name
        }
      }
    }
    availableSlots(fieldId: $fieldId, date: $date) {
      time
      available
      courtId
    }
  }
`;

// Query untuk cek detail lapangan berdasarkan ID
export const GET_FIELD_DETAIL = gql`
  query GetFieldDetail($id: ID!) {
    fields(id: $id) {
      id
      name
      description
      price_per_hour
      location
      full_address
      city
      is_available
      opening_time
      closing_time
      venues {
        name
      }
      field_images {
        image_path
      }
      field_facilities {
        facilities {
          name
        }
      }
    }
  }
`;