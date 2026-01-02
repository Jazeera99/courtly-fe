import { gql } from '@apollo/client';

export const CREATE_RESERVATION_DRAFT = gql`
  mutation CreateReservationDraft(
    $fieldId: ID!, 
    $date: Date!,
    $slots: [TimeRangeInput!]!,
    $recurring: RecurringInput
  ) {
    createReservationDraft(
      fieldId: $fieldId, 
      date: $date,
      slots: $slots, 
      recurring: $recurring
    ) {
      reservationId
      totalAmount
      expiresAt
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