import { ReservationStatus } from '../../enums/event.enum';
import { Direction } from '../../enums/common.enum';

export interface EventReservationInput {
	eventId: string;
	participationDate: Date;
	numberOfPeople: number;
	memberId?: string;
}

interface ERISearch {
	eventId?: string;
	memberId?: string;
	reservationStatus?: ReservationStatus;
}

export interface EventReservationsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ERISearch;
}
