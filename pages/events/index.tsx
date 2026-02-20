import React, { useState } from 'react';
import { NextPage } from 'next';
import { Pagination, Stack } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Event } from '../../libs/types/event/event';
import { EventsInquiry } from '../../libs/types/event/event.input';
import { EventLocation, EventStatus, EventType } from '../../libs/enums/event.enum';
import { T } from '../../libs/types/common';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useMutation, useQuery } from '@apollo/client';
import { GET_EVENTS } from '../../apollo/user/query';
import { LIKE_TARGET_EVENT } from '../../apollo/user/mutation';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { Messages } from '../../libs/config';
import EventCard from '../../libs/components/event/EventCard';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const EVENT_TYPES = [
	{ value: EventType.TOURNAMENT, label: 'Tournament' },
	{ value: EventType.TUTORIAL, label: 'Tutorial' },
	{ value: EventType.WORKSHOP, label: 'Workshop' },
	{ value: EventType.MEETUP, label: 'Meetup' },
];

const EVENT_LOCATIONS = [
	{ value: EventLocation.SEOUL, label: 'Seoul' },
	{ value: EventLocation.BUSAN, label: 'Busan' },
	{ value: EventLocation.INCHEON, label: 'Incheon' },
	{ value: EventLocation.DAEGU, label: 'Daegu' },
	{ value: EventLocation.GWANGJU, label: 'Gwangju' },
	{ value: EventLocation.DAEJEON, label: 'Daejeon' },
	{ value: EventLocation.JEJU, label: 'Jeju' },
];

const STATUS_OPTIONS = [
	{ value: null, label: 'All' },
	{ value: EventStatus.UPCOMING, label: 'Upcoming' },
	{ value: EventStatus.ACTIVE, label: 'Active' },
	{ value: EventStatus.ENDED, label: 'Ended' },
];

const EventsPage: NextPage = ({ initialInput, ...props }: T) => {
	const device = useDeviceDetect();

	const [searchFilter, setSearchFilter] = useState<EventsInquiry>(initialInput);
	const [events, setEvents] = useState<Event[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);

	const [likeTargetEvent] = useMutation(LIKE_TARGET_EVENT);

	const { refetch: eventsRefetch } = useQuery(GET_EVENTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setEvents(data?.getEvents?.list ?? []);
			setTotal(data?.getEvents?.metaCounter[0]?.total ?? 0);
		},
	});

	const likeEventHandler = async (e: any, user: any, id: string) => {
		try {
			e.stopPropagation();
			if (!id) return;
			if (!user._id) throw new Error(Messages.error2);
			await likeTargetEvent({ variables: { input: id } });
			await eventsRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const typeFilterHandler = (type: EventType | null) => {
		setCurrentPage(1);
		setSearchFilter({ ...searchFilter, page: 1, search: { ...searchFilter.search, eventType: type ?? undefined } });
	};

	const locationFilterHandler = (location: EventLocation | null) => {
		setCurrentPage(1);
		setSearchFilter({
			...searchFilter,
			page: 1,
			search: { ...searchFilter.search, eventLocation: location ?? undefined },
		});
	};

	const statusFilterHandler = (status: EventStatus | null) => {
		setCurrentPage(1);
		setSearchFilter({ ...searchFilter, page: 1, search: { ...searchFilter.search, eventStatus: status ?? undefined } });
	};

	const resetFilters = () => {
		setCurrentPage(1);
		setSearchFilter(initialInput);
	};

	const handlePaginationChange = async (event: any, value: number) => {
		setCurrentPage(value);
		setSearchFilter({ ...searchFilter, page: value });
	};

	if (device === 'mobile') return <h1>EVENTS PAGE MOBILE</h1>;

	const activeType = searchFilter.search?.eventType ?? null;
	const activeLocation = searchFilter.search?.eventLocation ?? null;
	const activeStatus = searchFilter.search?.eventStatus ?? null;

	return (
		<div id="events-list-page" style={{ position: 'relative' }}>
			<div className="container">
				<Stack className="events-page">
					<Stack className="filter-config">
						<div className="filter-main">
							<p className="filter-title">Find Your Event</p>

							<div className="filter-section">
								<div className="search-input-wrap">
									<input
										type="text"
										placeholder="Search events..."
										className="search-input"
										value={searchFilter.search?.text ?? ''}
										onChange={(e) => {
											setCurrentPage(1);
											setSearchFilter({
												...searchFilter,
												page: 1,
												search: { ...searchFilter.search, text: e.target.value || undefined },
											});
										}}
									/>
								</div>
							</div>

							<div className="filter-section">
								<p className="section-label">Status</p>
								<div className="status-pills">
									{STATUS_OPTIONS.map((s) => (
										<button
											key={s.label}
											className={`status-pill ${activeStatus === s.value ? 'active' : ''}`}
											onClick={() => statusFilterHandler(s.value)}
										>
											{s.label}
										</button>
									))}
								</div>
							</div>

							<div className="filter-section">
								<p className="section-label">Event Type</p>
								<div className="filter-options">
									<button
										className={`filter-option ${!activeType ? 'active' : ''}`}
										onClick={() => typeFilterHandler(null)}
									>
										<span className={`option-dot ${!activeType ? 'checked' : ''}`} />
										All Types
									</button>
									{EVENT_TYPES.map((type) => (
										<button
											key={type.value}
											className={`filter-option ${activeType === type.value ? 'active' : ''}`}
											onClick={() => typeFilterHandler(type.value)}
										>
											<span className={`option-dot ${activeType === type.value ? 'checked' : ''}`} />
											{type.label}
										</button>
									))}
								</div>
							</div>

							<div className="filter-section">
								<p className="section-label">Location</p>
								<div className="filter-options">
									<button
										className={`filter-option ${!activeLocation ? 'active' : ''}`}
										onClick={() => locationFilterHandler(null)}
									>
										<span className={`option-dot ${!activeLocation ? 'checked' : ''}`} />
										All Locations
									</button>
									{EVENT_LOCATIONS.map((loc) => (
										<button
											key={loc.value}
											className={`filter-option ${activeLocation === loc.value ? 'active' : ''}`}
											onClick={() => locationFilterHandler(loc.value)}
										>
											<span className={`option-dot ${activeLocation === loc.value ? 'checked' : ''}`} />
											{loc.label}
										</button>
									))}
								</div>
							</div>

							<button className="reset-btn" onClick={resetFilters}>
								Reset Filters
							</button>
						</div>
					</Stack>

					<Stack className="main-config" mb={'76px'}>
						<Stack className="list-config">
							{events.length === 0 ? (
								<div className="no-data">
									<CalendarMonthOutlinedIcon />
									<p>No events found!</p>
								</div>
							) : (
								events.map((event: Event) => (
									<EventCard event={event} key={event._id} likeEventHandler={likeEventHandler} />
								))
							)}
						</Stack>

						<Stack className="pagination-config">
							{events.length !== 0 && (
								<Stack className="pagination-box">
									<Pagination
										page={currentPage}
										count={Math.ceil(total / searchFilter.limit)}
										onChange={handlePaginationChange}
										shape="circular"
										color="primary"
									/>
								</Stack>
							)}
							{events.length !== 0 && (
								<Stack className="total-result">
									<p>
										Total {total} event{total !== 1 ? 's' : ''} available
									</p>
								</Stack>
							)}
						</Stack>
					</Stack>
				</Stack>
			</div>
		</div>
	);
};

EventsPage.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(EventsPage);
