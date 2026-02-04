import { EventType, EventStatus, EventLocation } from '../../enums/event.enum';
import { Member } from '../member/member';
import { MeLiked, TotalCounter } from '../product/product';

export interface EventAvailableDate {
	date: Date;
	startTime: string;
	endTime: string;
	capacity: number;
	booked: number;
}

export interface EventPeriod {
	startDate: Date;
	endDate: Date;
}

export interface Event {
	_id: string;
	eventType: EventType;
	eventStatus: EventStatus;
	eventTitle: string;
	eventLocation: EventLocation;
	eventAddress: string;
	eventDesc?: string;
	eventImages: string[];
	eventPeriod: EventPeriod;
	eventAvailableDates: EventAvailableDate[];
	eventViews: number;
	eventLikes: number;
	eventRank: number;
	eventComments: number;
	memberId: string;
	createdAt: Date;
	updatedAt: Date;
	/** from aggregation **/
	meLiked?: MeLiked[];
	memberData?: Member;
}

export interface Events {
	list: Event[];
	metaCounter: TotalCounter[];
}
