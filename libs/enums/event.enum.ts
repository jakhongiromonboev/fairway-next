export enum EventType {
	TOURNAMENT = 'TOURNAMENT',
	TUTORIAL = 'TUTORIAL',
	WORKSHOP = 'WORKSHOP',
	MEETUP = 'MEETUP',
}

export enum EventStatus {
	UPCOMING = 'UPCOMING',
	ACTIVE = 'ACTIVE',
	ENDED = 'ENDED',
	DELETE = 'DELETE',
}

export enum EventLocation {
	SEOUL = 'SEOUL',
	BUSAN = 'BUSAN',
	INCHEON = 'INCHEON',
	DAEGU = 'DAEGU',
	GWANGJU = 'GWANGJU',
	DAEJEON = 'DAEJEON',
	JEJU = 'JEJU',
}

export enum ReservationStatus {
	CONFIRMED = 'CONFIRMED',
	CANCELLED = 'CANCELLED',
	ATTENDED = 'ATTENDED',
}
