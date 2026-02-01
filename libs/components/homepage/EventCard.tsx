import React from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Event } from '../../types/event/event';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import Moment from 'react-moment';

interface EventCardProps {
	event: Event;
}

const EventCard = (props: EventCardProps) => {
	const { event } = props;
	const device = useDeviceDetect();
	const router = useRouter();

	const eventImage = event?.eventImages?.[0]
		? `${REACT_APP_API_URL}/${event.eventImages[0]}`
		: '/img/event/default.svg';

	/** HANDLERS **/
	const handleEventClick = () => {
		router.push(`/event/${event._id}`);
	};

	if (device === 'mobile') {
		return <div>EVENT CARD (MOBILE)</div>;
	} else {
		return (
			<Stack className="event-card-journal" onClick={handleEventClick}>
				{/* EVENT IMAGE */}
				<Box
					component={'div'}
					className={'event-image'}
					style={{
						backgroundImage: `url(${eventImage})`,
					}}
				>
					{/* OVERLAY WITH EVENT INFO */}
					<Box className={'event-overlay'}>
						<Box className={'event-info'}>
							<span className={'event-type'}>{event.eventType}</span>
							<h3 className={'event-title'}>{event.eventTitle}</h3>
							<Box className={'event-details'}>
								<span className={'event-location'}>📍 {event.eventLocation}</span>
								<span className={'event-date'}>
									<Moment format="MMM DD, YYYY">{event?.eventPeriod?.startDate}</Moment>
									{' - '}
									<Moment format="MMM DD, YYYY">{event?.eventPeriod?.endDate}</Moment>
								</span>
							</Box>
						</Box>
						<Box className={'event-action'}>
							<span className={'view-event'}>View Event</span>
						</Box>
					</Box>
				</Box>
			</Stack>
		);
	}
};

export default EventCard;
