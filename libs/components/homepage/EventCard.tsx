// UpcomingEventCard.tsx (SAME AS BEFORE, NO CHANGES)
import React from 'react';
import { Stack, Box, IconButton } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Event } from '../../types/event/event';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { T } from '../../types/common';

interface UpcomingEventCardProps {
	event: Event;
	likeEventHandler: (user: T, id: string) => void;
}

const UpcomingEventCard = (props: UpcomingEventCardProps) => {
	const { event, likeEventHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	// const eventImage = event?.eventImages?.[0]
	// 	? `${REACT_APP_API_URL}/${event.eventImages[0]}`
	// 	: '/img/events/default.webp';

	const eventImage = '/img/events/event-example2.webp';

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	};

	const startDate = formatDate(event.eventPeriod.startDate);
	const endDate = formatDate(event.eventPeriod.endDate);
	const dateRange = `${startDate} - ${endDate}`;

	const handleEventClick = () => {
		router.push(`/event/${event._id}`);
	};

	if (device === 'mobile') {
		return <div>EVENT CARD (MOBILE)</div>;
	} else {
		return (
			<Stack className="upcoming-event-card">
				<Box
					component={'div'}
					className={'event-image'}
					style={{ backgroundImage: `url(${eventImage})` }}
					onClick={handleEventClick}
				>
					<Box component={'div'} className={'event-overlay'}>
						<Box component={'div'} className={'event-top'}>
							<Box component={'div'} className={'event-type-badge'}>
								{event.eventType}
							</Box>
							<Box component={'div'} className={'engagement-box'}>
								<Box component={'div'} className={'engagement-item'}>
									<IconButton
										color={'default'}
										onClick={(e: any) => {
											e.stopPropagation();
											likeEventHandler(user, event._id);
										}}
									>
										{event?.meLiked && event?.meLiked[0]?.myFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
									</IconButton>
									<span>{event.eventLikes}</span>
								</Box>
								<Box component={'div'} className={'engagement-item'}>
									<RemoveRedEyeIcon />
									<span>{event.eventViews}</span>
								</Box>
							</Box>
						</Box>

						<Box component={'div'} className={'event-info'}>
							<h3 className={'event-title'}>{event.eventTitle}</h3>
							<Box component={'div'} className={'event-details'}>
								<Box component={'div'} className={'detail-item'}>
									<img src="/img/icons/calendar.svg" alt="" />
									<span>{dateRange}</span>
								</Box>
								<Box component={'div'} className={'detail-item'}>
									<img src="/img/icons/location.svg" alt="" />
									<span>{event.eventLocation}</span>
								</Box>
							</Box>
						</Box>
					</Box>
				</Box>
			</Stack>
		);
	}
};

export default UpcomingEventCard;
