export interface ViewProps {
  customerView: boolean;
  employeeView: boolean;
}

export interface HeaderBlockProps {
  isStarted: boolean;
}

export interface InputError {
  tableSizeError?: string;
  contactError?: string;
}
export interface inputValueProps {
  guestName: string;
  contact: string;
  arrivalTime: string;
  arrivalDate: string;
  tableSize: number;
  status: string;
}
export interface inputValueUpdateProps {
  arrivalTime: string;
  arrivalDate: string;
  tableSize: number;
  status: string;
}

export interface CreateBookingProps {
  inputValue: inputValueProps;
}
export interface ReservationInfoInputProps {
  arrivalDate: String;
  status: String;
  contact: String;
}
