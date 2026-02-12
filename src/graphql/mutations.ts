import { gql } from '@apollo/client';

export const CREATE_RESERVATION_DRAFT = gql`
  mutation CreateReservationDraft(
    $fieldId: ID!, 
    $date: Date!,
    $slots: [TimeRangeInput!]!,
    $availabilityIds: [ID!]!,
    $recurring: RecurringInput
  ) {
    createReservationDraft(
      fieldId: $fieldId, 
      date: $date,
      slots: $slots, 
      availabilityIds: $availabilityIds,
      recurring: $recurring
    ) {
      reservationId
      totalAmount
      expiresAt
      timeSlots
    }
  }
`;

export const MUTATION_CREATE_DRAFT = gql`
  mutation CreateReservationDraft($fieldId: ID!, $date: Date!, $slots: [TimeRangeInput!]!, $recurring: RecurringInput) {
    createReservationDraft(fieldId: $fieldId, date: $date, slots: $slots, recurring: $recurring) {
      reservationId
      totalAmount
      expiresAt
      timeSlots 
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

export const SAVE_FIELD = gql`
  mutation SaveField($input: FieldInput!) {
    saveField(input: $input) {
      id
      name
      description
      pricePerHour
      is_available
      city
      province
      full_address
    }
  }
`;

export const DELETE_FIELD = gql`
  mutation DeleteField($id: ID!) {
    deleteField(id: $id)
  }
`;

export const UPDATE_VENUE_PROFILE = gql`
  mutation UpdateVenueProfile($input: UpdateProfileInput!) {
    updateVenueProfile(input: $input) { # BENAR: Sesuai dengan schema.ts backend
      ownerName
      address
      city
      province
      email
      phone
    }
  }
`;