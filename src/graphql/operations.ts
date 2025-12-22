import { gql } from '@apollo/client';

export const QUERY_FIELDS = gql`
  query Fields($city: String) {
    fields(city: $city) {
      id
      name
      city
      pricePerHour
      imageUrl
      description
      full_address
    }
  }
`;

export const QUERY_AVAILABLE_SLOTS = gql`
  query AvailableSlots($fieldId: ID!, $date: Date!) {
    availableSlots(fieldId: $fieldId, date: $date) {
      start
      end
      available
    }
  }
`;

export const MUTATION_CREATE_DRAFT = gql`
  mutation CreateReservationDraft($fieldId: ID!, $date: Date!, $slots: [TimeRangeInput!]!, $recurring: RecurringInput) {
    createReservationDraft(fieldId: $fieldId, date: $date, slots: $slots, recurring: $recurring) {
      reservationId
      totalAmount
      expiresAt
    }
  }
`;

export const MUTATION_CONFIRM = gql`
  mutation ConfirmReservation($reservationId: ID!) {
    confirmReservation(reservationId: $reservationId) {
      snapUrl
      expiresAt
    }
  }
`;