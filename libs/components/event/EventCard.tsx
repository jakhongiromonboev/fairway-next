import React from 'react';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { Event } from '../../types/event/event';
import Moment from 'react-moment';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import GolfCourseIcon from '@mui/icons-material/GolfCourse';

interface EventCardProps {
	event: Event;
	likeEventHandler: (e: any, user: any, id: string) => Promise<void>;
}

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
	UPCOMING: { bg: '#fff9e6', color: '#d6a800', label: 'Upcoming' },
	ACTIVE: { bg: '#f0f4ef', color: '#2d5016', label: 'Active' },
	ENDED: { bg: '#f5f5f5', color: '#999', label: 'Ended' },
};

const TYPE_COLORS: Record<string, string> = {
	TOURNAMENT: '#2d5016',
	TUTORIAL: '#0066cc',
	WORKSHOP: '#e07b00',
	MEETUP: '#c7254e',
};

const EventCard = ({ event, likeEventHandler }: EventCardProps) => {
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const {
		_id,
		eventTitle,
		eventType,
		eventStatus,
		eventLocation,
		eventImages,
		eventPeriod,
		eventAvailableDates,
		eventLikes,
		eventViews,
		meLiked,
	} = event;

	const statusStyle = STATUS_STYLES[eventStatus] ?? STATUS_STYLES.UPCOMING;
	const typeColor = TYPE_COLORS[eventType] ?? '#2d5016';

	const totalCapacity = eventAvailableDates?.reduce((s, d) => s + d.capacity, 0) ?? 0;
	const totalBooked = eventAvailableDates?.reduce((s, d) => s + d.booked, 0) ?? 0;
	const spotsLeft = totalCapacity - totalBooked;
	const fillPct = totalCapacity > 0 ? Math.round((totalBooked / totalCapacity) * 100) : 0;
	const fillColor = fillPct >= 90 ? '#ef4444' : fillPct >= 60 ? '#d6a800' : '#2d5016';

	const goDetail = () => router.push(`/events/detail?id=${_id}&eventType=${eventType}`);

	return (
		<div className="event-card" onClick={goDetail}>
			<div className="event-image">
				{eventImages?.[0] ? (
					<img src={eventImages[0]} alt={eventTitle} />
				) : (
					<div className="image-placeholder">
						<GolfCourseIcon />
					</div>
				)}
				<div className="event-badges">
					<span className="status-badge" style={{ background: statusStyle.bg, color: statusStyle.color }}>
						{statusStyle.label}
					</span>
					<span className="type-badge" style={{ background: typeColor }}>
						{eventType}
					</span>
				</div>
			</div>

			<div className="event-info">
				<p className="event-type-label">{eventType.toLowerCase()}</p>
				<p className="event-title">{eventTitle}</p>

				<div className="event-meta">
					<div className="meta-row">
						<LocationOnOutlinedIcon sx={{ fontSize: 13 }} />
						<span>{eventLocation}</span>
					</div>
					<div className="meta-row">
						<CalendarMonthOutlinedIcon sx={{ fontSize: 13 }} />
						<span>
							<Moment format="MMM DD">{eventPeriod?.startDate}</Moment>
							{' – '}
							<Moment format="MMM DD, YYYY">{eventPeriod?.endDate}</Moment>
						</span>
					</div>
				</div>

				<div className="capacity-wrap">
					<div className="capacity-row">
						<span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
							<PeopleOutlineIcon sx={{ fontSize: 13 }} />
							{spotsLeft > 0 ? `${spotsLeft} spots left` : 'Fully booked'}
						</span>
						<span>{fillPct}% filled</span>
					</div>
					<div className="capacity-bar">
						<div className="capacity-fill" style={{ width: `${fillPct}%`, background: fillColor }} />
					</div>
				</div>

				<div className="event-footer">
					<div className="event-stats">
						<span
							className={`stat like ${meLiked?.[0]?.myFavorite ? 'liked' : ''}`}
							onClick={(e) => likeEventHandler(e, user, String(_id))}
						>
							{meLiked?.[0]?.myFavorite ? (
								<FavoriteIcon sx={{ fontSize: 14 }} />
							) : (
								<FavoriteBorderIcon sx={{ fontSize: 14 }} />
							)}
							<span>{eventLikes}</span>
						</span>
						<span className="stat">
							<VisibilityOutlinedIcon sx={{ fontSize: 14 }} />
							<span>{eventViews}</span>
						</span>
					</div>
					<button
						className="reserve-btn"
						onClick={(e) => {
							e.stopPropagation();
							goDetail();
						}}
					>
						{eventStatus === 'ENDED' ? 'View' : 'Reserve'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default EventCard;
