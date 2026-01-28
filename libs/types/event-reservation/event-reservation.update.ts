import { ReservationStatus } from '../../enums/event.enum';

export interface EventReservationUpdate {
	_id: string;
	reservationStatus?: ReservationStatus;
}
