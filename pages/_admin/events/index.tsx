import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { EventPanelList } from '../../../libs/components/admin/events/EventList';
import { Box, List, ListItem, Stack, Select, MenuItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import { AllEventsInquiry } from '../../../libs/types/event/event.input';
import { Event } from '../../../libs/types/event/event';
import { EventType, EventStatus } from '../../../libs/enums/event.enum';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { EventUpdate } from '../../../libs/types/event/event.update';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_EVENTS_BY_ADMIN } from '../../../apollo/admin/query';
import { UPDATE_EVENT_BY_ADMIN, REMOVE_EVENT_BY_ADMIN } from '../../../apollo/admin/mutation';

const AdminEvents: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [eventsInquiry, setEventsInquiry] = useState<AllEventsInquiry>(initialInquiry);
	const [events, setEvents] = useState<Event[]>([]);
	const [eventsTotal, setEventsTotal] = useState<number>(0);
	const [value, setValue] = useState('ALL');
	const [searchType, setSearchType] = useState('ALL');

	/** APOLLO REQUESTS **/
	const { refetch } = useQuery(GET_ALL_EVENTS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: eventsInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
			setEvents(data?.getAllEventsByAdmin?.list ?? []);
			setEventsTotal(data?.getAllEventsByAdmin?.metaCounter?.[0]?.total ?? 0);
		},
	});

	const [updateEventByAdmin] = useMutation(UPDATE_EVENT_BY_ADMIN);
	const [removeEventByAdmin] = useMutation(REMOVE_EVENT_BY_ADMIN);

	/** LIFECYCLES **/
	useEffect(() => {
		refetch({ input: eventsInquiry });
	}, [eventsInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		eventsInquiry.page = newPage + 1;
		setEventsInquiry({ ...eventsInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		eventsInquiry.limit = parseInt(event.target.value, 10);
		eventsInquiry.page = 1;
		setEventsInquiry({ ...eventsInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => setAnchorEl([]);

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);
		const inquiry: AllEventsInquiry = { ...eventsInquiry, page: 1, sort: 'createdAt' };
		switch (newValue) {
			case 'ACTIVE':
				inquiry.search = { ...inquiry.search, eventStatus: EventStatus.ACTIVE };
				break;
			case 'DELETE':
				inquiry.search = { ...inquiry.search, eventStatus: EventStatus.DELETE };
				break;
			default:
				delete inquiry.search?.eventStatus;
				break;
		}
		setEventsInquiry(inquiry);
	};

	const typeHandler = async (newValue: string) => {
		setSearchType(newValue);
		if (newValue !== 'ALL') {
			setEventsInquiry({
				...eventsInquiry,
				page: 1,
				search: { ...eventsInquiry.search, eventType: newValue as EventType },
			});
		} else {
			const updated = { ...eventsInquiry };
			delete updated?.search?.eventType;
			setEventsInquiry(updated);
		}
	};

	const updateEventHandler = async (updateData: EventUpdate) => {
		try {
			await updateEventByAdmin({ variables: { input: updateData } });
			menuIconCloseHandler();
			await refetch({ input: eventsInquiry });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const removeEventHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure you want to permanently delete this event?')) {
				await removeEventByAdmin({ variables: { input: id } });
				await refetch({ input: eventsInquiry });
			}
			menuIconCloseHandler();
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	return (
		<Box className={'admin-page-content'}>
			<Stack className={'page-header'}>
				<Typography className={'page-title'}>Event List</Typography>
				<Typography className={'page-count'}>{eventsTotal} total events</Typography>
			</Stack>

			<Box className={'admin-table-wrap'}>
				<Box sx={{ width: '100%' }}>
					<TabContext value={value}>
						<Stack className={'tab-header'}>
							<List className={'admin-tab-menu'}>
								{['ALL', 'ACTIVE', 'DELETE'].map((tab) => (
									<ListItem
										key={tab}
										onClick={(e: any) => tabChangeHandler(e, tab)}
										className={value === tab ? 'tab-item active' : 'tab-item'}
									>
										{tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
									</ListItem>
								))}
							</List>
						</Stack>
						<Divider />
						<Stack className={'admin-search-area'}>
							<Select value={searchType} className={'admin-select'} onChange={(e) => typeHandler(e.target.value)}>
								<MenuItem value={'ALL'}>All Types</MenuItem>
								{Object.values(EventType).map((type) => (
									<MenuItem value={type} key={type}>
										{type}
									</MenuItem>
								))}
							</Select>
						</Stack>
						<Divider />

						<EventPanelList
							events={events}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateEventHandler={updateEventHandler}
							removeEventHandler={removeEventHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={eventsTotal}
							rowsPerPage={eventsInquiry?.limit}
							page={eventsInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminEvents.defaultProps = {
	initialInquiry: { page: 1, limit: 10, sort: 'createdAt', direction: 'DESC', search: {} },
};

export default withAdminLayout(AdminEvents);
