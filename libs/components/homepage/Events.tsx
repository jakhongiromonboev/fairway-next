import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';

import { Event } from '../../types/event/event';
import { EventsInquiry } from '../../types/event/event.input';
import { useQuery } from '@apollo/client';
import { GET_EVENTS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { useRouter } from 'next/router';
import EventCard from './EventCard';

interface EventsProps {
	initialInput: EventsInquiry;
}

const Events = (props: EventsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getEventsLoading,
		data: getEventsData,
		error: getEventsError,
		refetch: getEventsRefetch,
	} = useQuery(GET_EVENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setUpcomingEvents(data?.getEvents?.list);
		},
	});

	/** HANDLERS **/
	const handleViewAll = () => {
		router.push('/events');
	};

	if (device === 'mobile') {
		return <div>EVENTS (MOBILE)</div>;
	} else {
		return (
			<Stack className={'events-section'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Upcoming Events</span>
							<p>Join tournaments, workshops, and exclusive golf experiences</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'} onClick={handleViewAll}>
								<span>See All Events</span>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>

					{upcomingEvents.length === 0 ? (
						<Box component={'div'} className={'empty-list'}>
							No upcoming events
						</Box>
					) : (
						<Stack className={'events-grid'}>
							{upcomingEvents.slice(0, 4).map((event: Event) => {
								return <EventCard event={event} key={event._id} />;
							})}
						</Stack>
					)}
				</Stack>
			</Stack>
		);
	}
};

Events.defaultProps = {
	initialInput: {
		page: 1,
		limit: 4,
		sort: 'eventViews',
		direction: 'DESC',
		search: {},
	},
};

export default Events;
