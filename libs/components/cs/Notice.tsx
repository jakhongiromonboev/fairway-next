import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import CampaignIcon from '@mui/icons-material/Campaign';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const Notice = () => {
	const device = useDeviceDetect();

	const data = [
		{ no: 1, event: true, title: 'Summer Golf Championship 2026 — Registration Now Open!', date: '27.02.2026' },
		{
			no: 2,
			event: true,
			title: 'New Pro Shops Joining Fairway This Month — Explore Their Collections',
			date: '20.02.2026',
		},
		{ no: 3, event: false, title: 'Platform Update: Event Reservation System Improvements', date: '15.02.2026' },
		{ no: 4, event: false, title: 'Community Guidelines Updated — Please Review Before Posting', date: '10.02.2026' },
		{ no: 5, event: false, title: 'Fairway is Now Available in English, Korean, and Russian', date: '01.02.2026' },
	];

	if (device === 'mobile') return <div>NOTICE MOBILE</div>;

	return (
		<Stack className={'notice-content'}>
			<Stack className={'notice-header'}>
				<span className={'notice-num'}>No.</span>
				<span className={'notice-title-h'}>Title</span>
				<span className={'notice-date-h'}>Date</span>
			</Stack>
			<Stack className={'notice-list'}>
				{data.map((item) => (
					<Stack key={item.no} className={`notice-row ${item.event ? 'is-event' : ''}`}>
						<span className={'notice-num'}>
							{item.event ? (
								<Box className={'event-badge'}>
									<CampaignIcon />
									EVENT
								</Box>
							) : (
								item.no
							)}
						</span>
						<Typography className={'notice-title'}>{item.title}</Typography>
						<Stack className={'notice-date'}>
							<CalendarTodayIcon />
							<span>{item.date}</span>
						</Stack>
					</Stack>
				))}
			</Stack>
		</Stack>
	);
};

export default Notice;
