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
      start
      end
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
        start
        end
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
      }
    }
  }
`;