import { ReservationStatus } from '../../enums/event.enum';
import { Member } from '../member/member';
import { Event } from '../event/event';
import { TotalCounter } from '../product/product';

export interface EventReservation {
	_id: string;
	memberId: string;
	eventId: string;
	participationDate: Date;
	numberOfPeople: number;
	reservationStatus: ReservationStatus;
	createdAt: Date;
	updatedAt: Date;

	/** from aggregation **/
	memberData?: Member;
	eventData?: Event;
}

export interface EventReservations {
	list: EventReservation[];
	metaCounter: TotalCounter[];
}
