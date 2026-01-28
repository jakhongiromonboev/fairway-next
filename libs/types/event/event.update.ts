import { EventLocation, EventStatus } from '../../enums/event.enum';

export interface EventPeriodUpdate {
	startDate?: Date;
	endDate?: Date;
}

export interface EventUpdate {
	_id: string;
	eventStatus?: EventStatus;
	eventTitle?: string;
	eventLocation?: EventLocation;
	eventAddress?: string;
	eventDesc?: string;
	eventImages?: string[];
	eventPeriod?: EventPeriodUpdate;
	dailyCapacity?: number;
	dailyStartTime?: string;
	dailyEndTime?: string;
}
