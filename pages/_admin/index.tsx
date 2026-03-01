import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../libs/components/layout/LayoutAdmin';
import { useQuery } from '@apollo/client';
import { Box, Stack, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import {
	GET_ALL_MEMBERS_BY_ADMIN,
	GET_ALL_PRODUCTS_BY_ADMIN,
	GET_ALL_EVENTS_BY_ADMIN,
	GET_ALL_BOARD_ARTICLES_BY_ADMIN,
} from '../../apollo/admin/query';

const AdminDashboard: NextPage = (props: any) => {
	const [stats, setStats] = useState({
		totalUsers: 0,
		totalAgents: 0,
		totalProducts: 0,
		totalEvents: 0,
		totalArticles: 0,
	});

	const { data: membersData } = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
		variables: { input: { page: 1, limit: 1, search: {} } },
	});

	const { data: agentsData } = useQuery(GET_ALL_MEMBERS_BY_ADMIN, {
		variables: { input: { page: 1, limit: 1, search: { memberType: 'AGENT' } } },
	});

	const { data: productsData } = useQuery(GET_ALL_PRODUCTS_BY_ADMIN, {
		variables: { input: { page: 1, limit: 1, search: {} } },
	});

	const { data: eventsData } = useQuery(GET_ALL_EVENTS_BY_ADMIN, {
		variables: { input: { page: 1, limit: 1, search: {} } },
	});

	const { data: articlesData } = useQuery(GET_ALL_BOARD_ARTICLES_BY_ADMIN, {
		variables: { input: { page: 1, limit: 1, search: {} } },
	});

	useEffect(() => {
		setStats({
			totalUsers: membersData?.getAllMembersByAdmin?.metaCounter?.[0]?.total ?? 0,
			totalAgents: agentsData?.getAllMembersByAdmin?.metaCounter?.[0]?.total ?? 0,
			totalProducts: productsData?.getAllProductsByAdmin?.metaCounter?.[0]?.total ?? 0,
			totalEvents: eventsData?.getAllEventsByAdmin?.metaCounter?.[0]?.total ?? 0,
			totalArticles: articlesData?.getAllBoardArticlesByAdmin?.metaCounter?.[0]?.total ?? 0,
		});
	}, [membersData, agentsData, productsData, eventsData, articlesData]);

	const barChartData = [
		{ name: 'Members', value: stats.totalUsers, fill: '#6366f1' },
		{ name: 'Agents', value: stats.totalAgents, fill: '#f59e0b' },
		{ name: 'Products', value: stats.totalProducts, fill: '#2d5016' },
		{ name: 'Events', value: stats.totalEvents, fill: '#7ab648' },
		{ name: 'Articles', value: stats.totalArticles, fill: '#06b6d4' },
	];

	const statCards = [
		{
			label: 'Total Members',
			value: stats.totalUsers,
			icon: <PeopleOutlineIcon />,
			color: '#6366f1',
			bg: 'rgba(99,102,241,0.08)',
			desc: 'Registered users',
		},
		{
			label: 'Total Agents',
			value: stats.totalAgents,
			icon: <StorefrontIcon />,
			color: '#f59e0b',
			bg: 'rgba(245,158,11,0.08)',
			desc: 'Golf shops & coaches',
		},
		{
			label: 'Total Products',
			value: stats.totalProducts,
			icon: <TrendingUpIcon />,
			color: '#2d5016',
			bg: 'rgba(45,80,22,0.08)',
			desc: 'Listed equipment',
		},
		{
			label: 'Total Events',
			value: stats.totalEvents,
			icon: <EmojiEventsIcon />,
			color: '#7ab648',
			bg: 'rgba(122,182,72,0.08)',
			desc: 'Active & upcoming',
		},
		{
			label: 'Total Articles',
			value: stats.totalArticles,
			icon: <ArticleOutlinedIcon />,
			color: '#06b6d4',
			bg: 'rgba(6,182,212,0.08)',
			desc: 'Community posts',
		},
	];

	const CustomTooltip = ({ active, payload, label }: any) => {
		if (active && payload && payload.length) {
			return (
				<Box
					sx={{
						background: '#fff',
						border: '1px solid #efefef',
						borderRadius: '8px',
						padding: '10px 16px',
						boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
					}}
				>
					<Typography sx={{ fontSize: 12, fontWeight: 700, color: '#181a20' }}>{label}</Typography>
					<Typography sx={{ fontSize: 13, color: payload[0].fill, fontWeight: 600, mt: 0.5 }}>
						{payload[0].value} total
					</Typography>
				</Box>
			);
		}
		return null;
	};

	return (
		<Box className="admin-page-content">
			<Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
				<Stack>
					<Typography sx={{ fontSize: 22, fontWeight: 700, color: '#181a20', lineHeight: 1.2 }}>
						Platform Overview
					</Typography>
					<Typography sx={{ fontSize: 13, color: '#9ca3af', mt: 0.5 }}>
						Live snapshot of Fairway's community activity
					</Typography>
				</Stack>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						gap: 1,
						background: 'rgba(45,80,22,0.07)',
						borderRadius: '8px',
						padding: '8px 14px',
					}}
				>
					<Box
						sx={{ width: 7, height: 7, borderRadius: '50%', background: '#7ab648', animation: 'pulse 2s infinite' }}
					/>
					<Typography sx={{ fontSize: 12, fontWeight: 600, color: '#2d5016' }}>Live Data</Typography>
				</Box>
			</Stack>

			<Box className="dashboard-stat-grid">
				{statCards.map((card, i) => (
					<Box key={i} className="stat-card">
						<Box className="stat-card-icon" sx={{ background: card.bg }}>
							<Box sx={{ color: card.color }}>{card.icon}</Box>
						</Box>
						<Stack className="stat-card-body">
							<Typography className="stat-value" sx={{ color: '#181a20' }}>
								{card.value.toLocaleString()}
							</Typography>
							<Typography className="stat-label">{card.label}</Typography>
							<Typography className="stat-desc">{card.desc}</Typography>
						</Stack>
					</Box>
				))}
			</Box>

			<Box className="dashboard-charts-row">
				<Box className="dashboard-chart-card" sx={{ flex: 1.4 }}>
					<Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
						<Stack>
							<Typography sx={{ fontSize: 15, fontWeight: 700, color: '#181a20' }}>Platform Breakdown</Typography>
							<Typography sx={{ fontSize: 12, color: '#9ca3af', mt: 0.3 }}>Total count per category</Typography>
						</Stack>
					</Stack>
					<ResponsiveContainer width="100%" height={240}>
						<BarChart data={barChartData} barSize={36} barCategoryGap="30%">
							<CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
							<XAxis
								dataKey="name"
								tick={{ fontSize: 12, fill: '#9ca3af', fontFamily: 'inherit' }}
								axisLine={false}
								tickLine={false}
							/>
							<YAxis
								tick={{ fontSize: 11, fill: '#9ca3af', fontFamily: 'inherit' }}
								axisLine={false}
								tickLine={false}
								allowDecimals={false}
							/>
							<Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
							<Bar dataKey="value" radius={[6, 6, 0, 0]}>
								{barChartData.map((entry, index) => (
									<Cell key={index} fill={entry.fill} />
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</Box>

				<Box className="dashboard-chart-card" sx={{ flex: 0.6, minWidth: 220 }}>
					<Typography sx={{ fontSize: 15, fontWeight: 700, color: '#181a20', mb: 0.5 }}>Platform Health</Typography>
					<Typography sx={{ fontSize: 12, color: '#9ca3af', mb: 3 }}>Key ratios at a glance</Typography>

					<Stack gap={2.5}>
						<Stack gap={1}>
							<Stack direction="row" justifyContent="space-between">
								<Typography sx={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>Agent Ratio</Typography>
								<Typography sx={{ fontSize: 12, fontWeight: 700, color: '#181a20' }}>
									{stats.totalUsers > 0 ? ((stats.totalAgents / stats.totalUsers) * 100).toFixed(1) : 0}%
								</Typography>
							</Stack>
							<Box sx={{ height: 6, borderRadius: 3, background: '#f3f4f6', overflow: 'hidden' }}>
								<Box
									sx={{
										height: '100%',
										borderRadius: 3,
										background: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
										width: `${stats.totalUsers > 0 ? Math.min((stats.totalAgents / stats.totalUsers) * 100, 100) : 0}%`,
										transition: 'width 1s ease',
									}}
								/>
							</Box>
						</Stack>

						{/* Products per Agent */}
						<Stack gap={1}>
							<Stack direction="row" justifyContent="space-between">
								<Typography sx={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>Products / Agent</Typography>
								<Typography sx={{ fontSize: 12, fontWeight: 700, color: '#181a20' }}>
									{stats.totalAgents > 0 ? (stats.totalProducts / stats.totalAgents).toFixed(1) : 0}
								</Typography>
							</Stack>
							<Box sx={{ height: 6, borderRadius: 3, background: '#f3f4f6', overflow: 'hidden' }}>
								<Box
									sx={{
										height: '100%',
										borderRadius: 3,
										background: 'linear-gradient(90deg, #2d5016, #7ab648)',
										width: `${
											stats.totalAgents > 0 ? Math.min((stats.totalProducts / stats.totalAgents / 20) * 100, 100) : 0
										}%`,
										transition: 'width 1s ease',
									}}
								/>
							</Box>
						</Stack>

						{/* Events per Agent */}
						<Stack gap={1}>
							<Stack direction="row" justifyContent="space-between">
								<Typography sx={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>Events / Agent</Typography>
								<Typography sx={{ fontSize: 12, fontWeight: 700, color: '#181a20' }}>
									{stats.totalAgents > 0 ? (stats.totalEvents / stats.totalAgents).toFixed(1) : 0}
								</Typography>
							</Stack>
							<Box sx={{ height: 6, borderRadius: 3, background: '#f3f4f6', overflow: 'hidden' }}>
								<Box
									sx={{
										height: '100%',
										borderRadius: 3,
										background: 'linear-gradient(90deg, #7ab648, #a3e635)',
										width: `${
											stats.totalAgents > 0 ? Math.min((stats.totalEvents / stats.totalAgents / 10) * 100, 100) : 0
										}%`,
										transition: 'width 1s ease',
									}}
								/>
							</Box>
						</Stack>

						<Stack gap={1}>
							<Stack direction="row" justifyContent="space-between">
								<Typography sx={{ fontSize: 12, color: '#6b7280', fontWeight: 500 }}>Articles / Member</Typography>
								<Typography sx={{ fontSize: 12, fontWeight: 700, color: '#181a20' }}>
									{stats.totalUsers > 0 ? (stats.totalArticles / stats.totalUsers).toFixed(2) : 0}
								</Typography>
							</Stack>
							<Box sx={{ height: 6, borderRadius: 3, background: '#f3f4f6', overflow: 'hidden' }}>
								<Box
									sx={{
										height: '100%',
										borderRadius: 3,
										background: 'linear-gradient(90deg, #06b6d4, #67e8f9)',
										width: `${
											stats.totalUsers > 0 ? Math.min((stats.totalArticles / stats.totalUsers) * 100, 100) : 0
										}%`,
										transition: 'width 1s ease',
									}}
								/>
							</Box>
						</Stack>
					</Stack>

					{/* Total count */}
					<Box
						sx={{
							mt: 3,
							pt: 3,
							borderTop: '1px solid #f0f0f0',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
						}}
					>
						<Typography sx={{ fontSize: 12, color: '#9ca3af' }}>Total Platform Items</Typography>
						<Typography sx={{ fontSize: 18, fontWeight: 800, color: '#181a20' }}>
							{(stats.totalUsers + stats.totalProducts + stats.totalEvents + stats.totalArticles).toLocaleString()}
						</Typography>
					</Box>
				</Box>
			</Box>

			<style jsx>{`
				@keyframes pulse {
					0%,
					100% {
						opacity: 1;
					}
					50% {
						opacity: 0.4;
					}
				}
			`}</style>
		</Box>
	);
};

export default withAdminLayout(AdminDashboard);
