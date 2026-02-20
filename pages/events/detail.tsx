import React, { useState } from 'react';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { GET_EVENT } from '../../apollo/user/query';
import { LIKE_TARGET_EVENT } from '../../apollo/user/mutation';
import { T } from '../../libs/types/common';
import { Event } from '../../libs/types/event/event';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Messages } from '../../libs/config';
import { userVar } from '../../apollo/store';
import Moment from 'react-moment';
import ReservationModal from '../../libs/components/event/EventReservationModal';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import GolfCourseIcon from '@mui/icons-material/GolfCourse';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
	UPCOMING: { bg: '#fff9e6', color: '#d6a800' },
	ACTIVE: { bg: '#f0f4ef', color: '#2d5016' },
	ENDED: { bg: '#f5f5f5', color: '#999' },
};

const TYPE_COLORS: Record<string, string> = {
	TOURNAMENT: '#2d5016',
	TUTORIAL: '#0066cc',
	WORKSHOP: '#e07b00',
	MEETUP: '#c7254e',
};

const EventDetail: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);

	const eventId = router.query.id as string;

	const [event, setEvent] = useState<Event | null>(null);
	const [activeImage, setActiveImage] = useState<number>(0);
	const [modalOpen, setModalOpen] = useState<boolean>(false);

	/** APOLLO REQUEST **/
	const [likeTargetEvent] = useMutation(LIKE_TARGET_EVENT);

	const { refetch: eventRefetch } = useQuery(GET_EVENT, {
		fetchPolicy: 'network-only',
		variables: { input: eventId },
		skip: !eventId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => setEvent(data?.getEvent),
	});

	const likeHandler = async () => {
		try {
			if (!user._id) throw new Error(Messages.error2);
			await likeTargetEvent({ variables: { input: eventId } });
			await eventRefetch({ input: eventId });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const openModal = () => {
		if (!user._id) {
			sweetMixinErrorAlert(Messages.error2).then();
			return;
		}
		setModalOpen(true);
	};

	if (device === 'mobile') return <div>EVENT DETAIL MOBILE</div>;

	if (!event) {
		return (
			<div id="event-detail-page">
				<div className="container">
					<div className="loading-state">Loading event...</div>
				</div>
			</div>
		);
	}

	const statusStyle = STATUS_STYLES[event.eventStatus] ?? STATUS_STYLES.UPCOMING;
	const typeColor = TYPE_COLORS[event.eventType] ?? '#2d5016';
	const isEnded = event.eventStatus === 'ENDED';

	const availableDates = [...(event.eventAvailableDates ?? [])].sort(
		(a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
	);

	const totalCapacity = availableDates.reduce((s, d) => s + d.capacity, 0);
	const totalBooked = availableDates.reduce((s, d) => s + d.booked, 0);
	const spotsLeft = totalCapacity - totalBooked;

	return (
		<div id="event-detail-page">
			<div className="container">
				<div className="event-main">
					<div className="gallery-section">
						<div className="main-image">
							{event.eventImages?.[activeImage] ? (
								<img src={event.eventImages[activeImage]} alt={event.eventTitle} />
							) : (
								<div className="image-placeholder">
									<GolfCourseIcon />
								</div>
							)}
							<span className="image-status-badge" style={{ background: statusStyle.bg, color: statusStyle.color }}>
								{event.eventStatus}
							</span>
						</div>

						{event.eventImages?.length > 1 && (
							<div className="thumbnails">
								{event.eventImages.map((img: string, idx: number) => (
									<div
										key={idx}
										className={`thumb ${activeImage === idx ? 'active' : ''}`}
										onClick={() => setActiveImage(idx)}
									>
										<img src={img} alt="" />
									</div>
								))}
							</div>
						)}

						{event.memberData && (
							<div className="organizer-card" onClick={() => router.push(`/member?memberId=${event.memberData?._id}`)}>
								<img
									src={event.memberData.memberImage || '/img/community/articleImg.png'}
									alt=""
									className="organizer-avatar"
								/>
								<div className="organizer-info">
									<span className="organizer-label">Organized by</span>
									<span className="organizer-name">
										{event.memberData.agentStoreName || event.memberData.memberNick}
									</span>
								</div>
							</div>
						)}
					</div>

					<div className="info-section">
						<button className="back-btn" onClick={() => router.push('/events')}>
							<ArrowBackIcon sx={{ fontSize: 12 }} />
							<span>All Events</span>
						</button>

						<p className="event-type-label" style={{ color: typeColor }}>
							{event.eventType}
						</p>
						<h1 className="event-title">{event.eventTitle}</h1>

						<div className="stats-row">
							<span className={`like-btn ${event.meLiked?.[0]?.myFavorite ? 'liked' : ''}`} onClick={likeHandler}>
								{event.meLiked?.[0]?.myFavorite ? (
									<FavoriteIcon sx={{ fontSize: 16 }} />
								) : (
									<FavoriteBorderIcon sx={{ fontSize: 16 }} />
								)}
								<span>{event.eventLikes}</span>
							</span>
							<span className="stat-item">
								<VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
								<span>{event.eventViews}</span>
							</span>
						</div>

						<div className="info-divider" />

						<div className="event-details">
							<div className="detail-row">
								<LocationOnOutlinedIcon sx={{ fontSize: 16 }} />
								<div>
									<span className="detail-label">Location</span>
									<span className="detail-value">
										{event.eventLocation} · {event.eventAddress}
									</span>
								</div>
							</div>
							<div className="detail-row">
								<CalendarMonthOutlinedIcon sx={{ fontSize: 16 }} />
								<div>
									<span className="detail-label">Dates</span>
									<span className="detail-value">
										<Moment format="MMM DD">{event.eventPeriod?.startDate}</Moment>
										{' – '}
										<Moment format="MMM DD, YYYY">{event.eventPeriod?.endDate}</Moment>
									</span>
								</div>
							</div>
							<div className="detail-row">
								<AccessTimeOutlinedIcon sx={{ fontSize: 16 }} />
								<div>
									<span className="detail-label">Daily Hours</span>
									<span className="detail-value">
										{availableDates[0]?.startTime} – {availableDates[0]?.endTime}
									</span>
								</div>
							</div>
							<div className="detail-row">
								<PeopleOutlineIcon sx={{ fontSize: 16 }} />
								<div>
									<span className="detail-label">Total Spots</span>
									<span className="detail-value">
										{spotsLeft > 0 ? `${spotsLeft} spots remaining` : 'Fully booked'}
									</span>
								</div>
							</div>
						</div>

						{event.eventDesc && (
							<>
								<div className="info-divider" />
								<p className="event-desc">{event.eventDesc}</p>
							</>
						)}

						<div className="info-divider" />

						{/* CTA */}
						{isEnded ? (
							<div className="ended-notice">This event has ended.</div>
						) : (
							<div className="cta-section">
								<div className="cta-meta">
									<PeopleOutlineIcon sx={{ fontSize: 15 }} />
									<span>{spotsLeft > 0 ? `${spotsLeft} spots remaining` : 'Fully booked'}</span>
								</div>
								<button
									className={`cta-reserve-btn ${spotsLeft <= 0 ? 'disabled' : ''}`}
									onClick={openModal}
									disabled={spotsLeft <= 0}
								>
									{spotsLeft <= 0 ? 'Fully Booked' : 'Reserve Your Spot'}
								</button>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* MODAL */}
			{event && (
				<ReservationModal
					event={event}
					open={modalOpen}
					onClose={() => setModalOpen(false)}
					memberId={String(user._id)}
				/>
			)}
		</div>
	);
};

export default withLayoutBasic(EventDetail);
