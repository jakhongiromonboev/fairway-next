import React from 'react';
import Link from 'next/link';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import Moment from 'react-moment';
import DeleteIcon from '@mui/icons-material/Delete';
import { Event } from '../../../types/event/event';
import { REACT_APP_API_URL } from '../../../config';
import { EventStatus } from '../../../enums/event.enum';

const headCells = [
	{ id: 'event', label: 'EVENT', numeric: true },
	{ id: 'type', label: 'TYPE', numeric: false },
	{ id: 'location', label: 'LOCATION', numeric: true },
	{ id: 'agent', label: 'AGENT', numeric: true },
	{ id: 'period', label: 'PERIOD', numeric: true },
	{ id: 'views', label: 'VIEWS', numeric: false },
	{ id: 'status', label: 'STATUS', numeric: false },
];

const statusClass: Record<string, string> = {
	ACTIVE: 'badge success',
	DELETE: 'badge delete',
};

interface EventPanelListType {
	events: Event[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateEventHandler: any;
	removeEventHandler: any;
}

export const EventPanelList = (props: EventPanelListType) => {
	const { events, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateEventHandler, removeEventHandler } =
		props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} size="medium">
					<TableHead>
						<TableRow>
							{headCells.map((cell) => (
								<TableCell key={cell.id} align={cell.numeric ? 'left' : 'center'}>
									{cell.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{events.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={7}>
									<span className="no-data">No events found</span>
								</TableCell>
							</TableRow>
						)}
						{events.map((event: Event, index: number) => {
							const eventImage = event?.eventImages?.[0]
								? `${REACT_APP_API_URL}/${event.eventImages[0]}`
								: '/img/banner/golf-hero.jpg';
							return (
								<TableRow hover key={event._id}>
									<TableCell align="left">
										<Stack direction="row" alignItems="center" gap={1.5}>
											<Avatar variant="rounded" src={eventImage} sx={{ width: 44, height: 44 }} />
											<Stack>
												<Link href={`/events/detail?id=${event._id}`}>
													<Typography
														sx={{
															fontSize: 14,
															fontWeight: 600,
															color: '#181a20',
															cursor: 'pointer',
															maxWidth: 220,
															overflow: 'hidden',
															textOverflow: 'ellipsis',
															whiteSpace: 'nowrap',
															'&:hover': { color: '#2d5016' },
														}}
													>
														{event.eventTitle}
													</Typography>
												</Link>
											</Stack>
										</Stack>
									</TableCell>
									<TableCell align="center">{event.eventType}</TableCell>
									<TableCell align="left">{event.eventLocation}</TableCell>
									<TableCell align="left">
										<Stack direction="row" alignItems="center" gap={1}>
											<Avatar
												src={
													event.memberData?.memberImage
														? `${REACT_APP_API_URL}/${event.memberData.memberImage}`
														: '/img/profile/defaultUser.svg'
												}
												sx={{ width: 28, height: 28 }}
											/>
											<Typography sx={{ fontSize: 13 }}>{event.memberData?.memberNick}</Typography>
										</Stack>
									</TableCell>
									<TableCell align="left">
										<Stack>
											<Typography sx={{ fontSize: 12 }}>
												<Moment format="DD.MM.YY">{event.eventPeriod?.startDate}</Moment>
											</Typography>
											<Typography sx={{ fontSize: 12, color: '#9ca3af' }}>
												→ <Moment format="DD.MM.YY">{event.eventPeriod?.endDate}</Moment>
											</Typography>
										</Stack>
									</TableCell>
									<TableCell align="center">{event.eventViews}</TableCell>
									<TableCell align="center">
										{event.eventStatus === EventStatus.DELETE ? (
											<Button
												variant="outlined"
												sx={{
													p: '4px',
													minWidth: 0,
													border: 'none',
													color: '#ef4444',
													':hover': { border: '1px solid #ef4444', bgcolor: '#fee2e2' },
												}}
												onClick={() => removeEventHandler(event._id)}
											>
												<DeleteIcon fontSize="small" />
											</Button>
										) : (
											<>
												<Button
													onClick={(e: any) => menuIconClickHandler(e, index)}
													className={statusClass[event.eventStatus] ?? 'badge'}
												>
													{event.eventStatus}
												</Button>
												<Menu
													anchorEl={anchorEl[index]}
													open={Boolean(anchorEl[index])}
													onClose={menuIconCloseHandler}
													TransitionComponent={Fade}
												>
													{Object.values(EventStatus)
														.filter((s) => s !== event.eventStatus)
														.map((status) => (
															<MenuItem
																key={status}
																onClick={() => updateEventHandler({ _id: event._id, eventStatus: status })}
															>
																<Typography variant="subtitle1">{status}</Typography>
															</MenuItem>
														))}
												</Menu>
											</>
										)}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
