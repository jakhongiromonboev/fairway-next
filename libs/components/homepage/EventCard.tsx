import React from 'react';
import { Stack, Box, IconButton } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Event } from '../../types/event/event';
import { useRouter } from 'next/router';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
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

	const eventImage = event?.eventImages?.[0] ? `${event.eventImages[0]}` : '/img/events/event-example2.webp';

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	};

	const dateRange = `${formatDate(event.eventPeriod.startDate)} - ${formatDate(event.eventPeriod.endDate)}`;

	const isLiked = event?.meLiked?.[0]?.myFavorite;

	if (device === 'mobile') {
		return (
			<Stack className="upcoming-event-card-mobile">
				<Box
					component={'div'}
					className={'event-image'}
					style={{ backgroundImage: `url(${eventImage})` }}
					onClick={() => router.push(`/events/detail?id=${event._id}`)}
				>
					<Box component={'div'} className={'event-overlay'}>
						<Box component={'div'} className={'event-top'}>
							<Box component={'div'} className={'event-type-badge'}>
								{event.eventType}
							</Box>
							<Box component={'div'} className={'engagement-box'}>
								<Box component={'div'} className={'engagement-item'}>
									<IconButton
										onClick={(e: any) => {
											e.stopPropagation();
											likeEventHandler(user, event._id);
										}}
										style={{ padding: 0, background: 'transparent' }}
									>
										{isLiked ? (
											<FavoriteIcon style={{ color: '#ff4444', width: '18px', height: '18px' }} />
										) : (
											<FavoriteBorderIcon style={{ color: '#ffffff', width: '18px', height: '18px' }} />
										)}
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
									<CalendarMonthOutlinedIcon />
									<span>{dateRange}</span>
								</Box>
								<Box component={'div'} className={'detail-item'}>
									<LocationOnOutlinedIcon />
									<span>{event.eventLocation}</span>
								</Box>
							</Box>
						</Box>
					</Box>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack className="upcoming-event-card">
				<Box
					component={'div'}
					className={'event-image'}
					style={{ backgroundImage: `url(${eventImage})` }}
					onClick={() => router.push(`/events/detail?id=${event._id}`)}
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
										{isLiked ? (
											<FavoriteIcon sx={{ color: '#ff4444' }} />
										) : (
											<FavoriteBorderIcon sx={{ color: '#fff' }} />
										)}
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
									<CalendarMonthOutlinedIcon />
									<span>{dateRange}</span>
								</Box>
								<Box component={'div'} className={'detail-item'}>
									<LocationOnOutlinedIcon />
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
