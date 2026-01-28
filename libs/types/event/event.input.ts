import { EventType, EventStatus, EventLocation } from '../../enums/event.enum';
import { Direction } from '../../enums/common.enum';

export interface EventPeriodInput {
	startDate: Date;
	endDate: Date;
}

export interface EventInput {
	eventType: EventType;
	eventTitle: string;
	eventLocation: EventLocation;
	eventAddress: string;
	eventDesc?: string;
	eventImages?: string[];
	eventPeriod: EventPeriodInput;
	dailyCapacity: number;
	dailyStartTime: string;
	dailyEndTime: string;
	memberId?: string;
}

interface EISearch {
	eventType?: EventType;
	eventLocation?: EventLocation;
	text?: string;
	memberId?: string;
}

export interface EventsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: EISearch;
}

interface AEISearch {
	eventStatus?: EventStatus;
	eventType?: EventType;
}

export interface AllEventsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: AEISearch;
}
