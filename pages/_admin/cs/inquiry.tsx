import React, { useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { Box, Stack, Typography, Chip } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';

const guides = [
	{
		id: 'approve-event',
		icon: <EventAvailableOutlinedIcon />,
		title: 'How to Approve an Event',
		difficulty: 'Easy',
		difficultyColor: '#166534',
		difficultyBg: '#dcfce7',
		desc: 'Review and activate events submitted by agents.',
		steps: [
			{ step: 1, title: 'Navigate to Events', desc: 'Go to Management → Events → Manage in the sidebar.' },
			{
				step: 2,
				title: 'Filter by Status',
				desc: 'Use the status tab to select "All" or look for events that need attention.',
			},
			{
				step: 3,
				title: 'Click the Status Badge',
				desc: 'Click the status badge on the event row to open the action menu.',
			},
			{ step: 4, title: 'Select Active', desc: 'Choose "Active" from the dropdown to approve and publish the event.' },
			{ step: 5, title: 'Confirm', desc: 'The event is now live and visible to all users on the platform.' },
		],
	},
	{
		id: 'ban-user',
		icon: <BlockOutlinedIcon />,
		title: 'How to Ban a User',
		difficulty: 'Easy',
		difficultyColor: '#92400e',
		difficultyBg: '#fef3c7',
		desc: 'Block a member from accessing the platform.',
		steps: [
			{ step: 1, title: 'Navigate to Users', desc: 'Go to Management → Users → Manage in the sidebar.' },
			{
				step: 2,
				title: 'Find the Member',
				desc: 'Use the search bar to find the member by nickname or filter by member type.',
			},
			{
				step: 3,
				title: 'Click the Status Badge',
				desc: 'Click the green "Active" badge on the member row to open the action menu.',
			},
			{
				step: 4,
				title: 'Select Block',
				desc: 'Choose "Block" from the dropdown. The member will immediately lose access.',
			},
			{
				step: 5,
				title: 'Revert if Needed',
				desc: 'To unblock, find the member under the "Block" tab and set status back to Active.',
			},
		],
	},
	{
		id: 'remove-product',
		icon: <DeleteOutlineOutlinedIcon />,
		title: 'How to Remove a Product',
		difficulty: 'Easy',
		difficultyColor: '#166534',
		difficultyBg: '#dcfce7',
		desc: 'Soft-delete or permanently remove a listed product.',
		steps: [
			{ step: 1, title: 'Navigate to Products', desc: 'Go to Management → Products → Manage in the sidebar.' },
			{
				step: 2,
				title: 'Find the Product',
				desc: 'Use the category filter or scroll to find the product in question.',
			},
			{
				step: 3,
				title: 'Soft Delete First',
				desc: 'Click the action menu (⋮) and select "Delete" to move it to the Delete tab.',
			},
			{
				step: 4,
				title: 'Permanent Removal',
				desc: 'Go to the "Delete" tab, find the product, and click the trash icon for permanent removal.',
			},
			{
				step: 5,
				title: 'Stats Updated',
				desc: "The agent's product count is automatically decremented after removal.",
			},
		],
	},
	{
		id: 'resolve-report',
		icon: <FlagOutlinedIcon />,
		title: 'How to Resolve a Report',
		difficulty: 'Medium',
		difficultyColor: '#991b1b',
		difficultyBg: '#fee2e2',
		desc: 'Handle flagged content or user reports.',
		steps: [
			{
				step: 1,
				title: 'Identify the Report',
				desc: 'Reports come through the community or product sections. Check both regularly.',
			},
			{
				step: 2,
				title: 'Review the Content',
				desc: 'Navigate to the relevant section (Products/Community) and review the flagged item.',
			},
			{
				step: 3,
				title: 'Take Action',
				desc: 'Either delete the content, block the author, or mark it as resolved by setting status to Active.',
			},
			{
				step: 4,
				title: 'Document',
				desc: 'Note the action taken for audit purposes. Use the status system to track resolution.',
			},
			{
				step: 5,
				title: 'Notify if Needed',
				desc: 'For serious violations, consider blocking the member and removing all their content.',
			},
		],
	},
	{
		id: 'agent-verification',
		icon: <VerifiedOutlinedIcon />,
		title: 'How to Verify an Agent',
		difficulty: 'Medium',
		difficultyColor: '#92400e',
		difficultyBg: '#fef3c7',
		desc: 'Review and approve agent store profiles.',
		steps: [
			{ step: 1, title: 'Navigate to Users', desc: 'Go to Management → Users → Manage and filter by Agent type.' },
			{
				step: 2,
				title: 'Check Store Profile',
				desc: 'View the agent profile to confirm their store info, address, and description are complete.',
			},
			{
				step: 3,
				title: 'Review Products',
				desc: 'Check their listed products under Products section filtered by their member ID.',
			},
			{
				step: 4,
				title: 'Activate',
				desc: 'If everything looks good, ensure their account status is set to Active.',
			},
			{
				step: 5,
				title: 'Block if Suspicious',
				desc: 'If the store profile seems fraudulent or incomplete after warnings, block the account.',
			},
		],
	},
	{
		id: 'feature-product',
		icon: <StorefrontOutlinedIcon />,
		title: 'How to Feature a Product',
		difficulty: 'Easy',
		difficultyColor: '#166534',
		difficultyBg: '#dcfce7',
		desc: 'Highlight top products on the platform homepage.',
		steps: [
			{ step: 1, title: 'Navigate to Products', desc: 'Go to Management → Products → Manage.' },
			{
				step: 2,
				title: 'Find Quality Products',
				desc: 'Look for highly liked or viewed products that represent the platform well.',
			},
			{
				step: 3,
				title: 'Check Agent Status',
				desc: "Ensure the product's agent account is Active and the store profile is complete.",
			},
			{
				step: 4,
				title: 'Mark as Active',
				desc: 'Ensure the product status is Active so it appears in search and homepage listings.',
			},
			{
				step: 5,
				title: 'Monitor Performance',
				desc: 'Check the dashboard analytics to see how featured products perform over time.',
			},
		],
	},
	{
		id: 'analytics',
		icon: <BarChartOutlinedIcon />,
		title: 'How to Read Platform Analytics',
		difficulty: 'Easy',
		difficultyColor: '#166534',
		difficultyBg: '#dcfce7',
		desc: 'Understand the dashboard metrics and health indicators.',
		steps: [
			{
				step: 1,
				title: 'Open the Dashboard',
				desc: 'Click "Dashboard" at the top of the sidebar to see the platform overview.',
			},
			{
				step: 2,
				title: 'Read the Stat Cards',
				desc: 'The 5 cards show total Members, Agents, Products, Events, and Articles.',
			},
			{
				step: 3,
				title: 'Check the Bar Chart',
				desc: 'The Platform Breakdown chart visualises the count of each category at a glance.',
			},
			{
				step: 4,
				title: 'Review Platform Health',
				desc: 'The health panel shows key ratios — Agent Ratio, Products/Agent, Events/Agent, Articles/Member.',
			},
			{
				step: 5,
				title: 'Healthy Benchmarks',
				desc: 'Aim for Agent Ratio >20%, Products/Agent >3, Events/Agent >1, Articles/Member >0.5.',
			},
		],
	},
	{
		id: 'bulk-status',
		icon: <TuneOutlinedIcon />,
		title: 'How to Bulk Manage Statuses',
		difficulty: 'Medium',
		difficultyColor: '#991b1b',
		difficultyBg: '#fee2e2',
		desc: 'Efficiently manage multiple items across the platform.',
		steps: [
			{
				step: 1,
				title: 'Use Pagination Wisely',
				desc: 'Set rows per page to 40 or 60 to see more items at once when doing bulk work.',
			},
			{
				step: 2,
				title: 'Use Status Tabs',
				desc: 'Each management page has tabs (All/Active/Sold/Delete) — use these to batch-view by status.',
			},
			{
				step: 3,
				title: 'Category Filters',
				desc: 'Combine status tabs with category/type filters to narrow down to specific groups.',
			},
			{
				step: 4,
				title: 'Sequential Updates',
				desc: 'Work row by row using the action menu (⋮) — changes save instantly with no confirmation needed.',
			},
			{
				step: 5,
				title: 'Verify Changes',
				desc: 'After bulk updates, switch to the relevant tab to confirm all items show the correct status.',
			},
		],
	},
];

const difficultyOrder = { Easy: 0, Medium: 1, Hard: 2 };

const AdminSupport: NextPage = () => {
	const [openGuide, setOpenGuide] = useState<string | null>(null);

	const toggleGuide = (id: string) => {
		setOpenGuide(openGuide === id ? null : id);
	};

	return (
		<Box className="admin-page-content">
			{/** HEADER **/}
			<Stack className="page-header">
				<Typography className="page-title">Admin Guide</Typography>
				<Typography className="page-count">{guides.length} guides available</Typography>
			</Stack>

			<Stack
				direction="row"
				gap={2}
				sx={{
					background: '#ffffff',
					border: '1px solid #efefef',
					borderRadius: '12px',
					padding: '16px 24px',
					flexWrap: 'wrap',
				}}
			>
				{[
					{ label: 'Total Guides', value: guides.length, color: '#6366f1' },
					{ label: 'Easy', value: guides.filter((g) => g.difficulty === 'Easy').length, color: '#166534' },
					{ label: 'Medium', value: guides.filter((g) => g.difficulty === 'Medium').length, color: '#92400e' },
					{ label: 'Steps per Guide', value: '5', color: '#2d5016' },
				].map((stat) => (
					<Stack
						key={stat.label}
						direction="row"
						alignItems="center"
						gap={1.5}
						sx={{ pr: 3, borderRight: '1px solid #f0f0f0', '&:last-child': { border: 'none', pr: 0 } }}
					>
						<Box
							sx={{
								width: 8,
								height: 8,
								borderRadius: '50%',
								background: stat.color,
								flexShrink: 0,
							}}
						/>
						<Typography sx={{ fontSize: 13, color: '#9ca3af', fontFamily: 'inherit' }}>{stat.label}</Typography>
						<Typography sx={{ fontSize: 15, fontWeight: 700, color: '#181a20', fontFamily: 'inherit' }}>
							{stat.value}
						</Typography>
					</Stack>
				))}
			</Stack>

			<Box
				sx={{
					display: 'grid',
					gridTemplateColumns: 'repeat(2, 1fr)',
					gap: '16px',
					'@media (max-width: 1100px)': { gridTemplateColumns: '1fr' },
				}}
			>
				{guides.map((guide) => {
					const isOpen = openGuide === guide.id;
					return (
						<Box
							key={guide.id}
							sx={{
								background: '#ffffff',
								border: `1px solid ${isOpen ? '#2d5016' : '#efefef'}`,
								borderRadius: '12px',
								overflow: 'hidden',
								transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
								boxShadow: isOpen ? '0 4px 20px rgba(45,80,22,0.08)' : '0 1px 4px rgba(0,0,0,0.04)',
							}}
						>
							<Stack
								direction="row"
								alignItems="center"
								gap={2}
								onClick={() => toggleGuide(guide.id)}
								sx={{
									padding: '20px 24px',
									cursor: 'pointer',
									userSelect: 'none',
									'&:hover': { background: '#fafafa' },
									transition: 'background 0.15s ease',
								}}
							>
								<Box
									sx={{
										width: 44,
										height: 44,
										borderRadius: '10px',
										background: isOpen ? '#2d5016' : '#f4f5f7',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										flexShrink: 0,
										transition: 'background 0.2s ease',
										'& svg': {
											fontSize: 20,
											color: isOpen ? '#ffffff' : '#6b7280',
											transition: 'color 0.2s ease',
										},
									}}
								>
									{guide.icon}
								</Box>

								<Stack flex={1} gap={0.4}>
									<Typography
										sx={{
											fontSize: 14,
											fontWeight: 700,
											color: '#181a20',
											fontFamily: 'inherit',
											lineHeight: 1.3,
										}}
									>
										{guide.title}
									</Typography>
									<Typography sx={{ fontSize: 12, color: '#9ca3af', fontFamily: 'inherit' }}>{guide.desc}</Typography>
								</Stack>

								<Stack direction="row" alignItems="center" gap={1.5} flexShrink={0}>
									<Chip
										label={guide.difficulty}
										size="small"
										sx={{
											fontSize: 10,
											fontWeight: 700,
											letterSpacing: '0.5px',
											color: guide.difficultyColor,
											background: guide.difficultyBg,
											height: 22,
											fontFamily: 'inherit',
										}}
									/>
									<Box
										sx={{
											transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
											transition: 'transform 0.25s ease',
											display: 'flex',
											color: '#9ca3af',
										}}
									>
										<ExpandMoreRoundedIcon sx={{ fontSize: 20 }} />
									</Box>
								</Stack>
							</Stack>

							{isOpen && (
								<Box
									sx={{
										borderTop: '1px solid #f0f0f0',
										padding: '20px 24px',
										background: '#fafbfa',
									}}
								>
									<Stack gap={2}>
										{guide.steps.map((s, i) => (
											<Stack key={i} direction="row" gap={2} alignItems="flex-start">
												<Stack alignItems="center" gap={0} sx={{ flexShrink: 0, position: 'relative' }}>
													<Box
														sx={{
															width: 28,
															height: 28,
															borderRadius: '50%',
															background: i === guide.steps.length - 1 ? '#2d5016' : '#ffffff',
															border: `2px solid ${i === guide.steps.length - 1 ? '#2d5016' : '#e5e7eb'}`,
															display: 'flex',
															alignItems: 'center',
															justifyContent: 'center',
															flexShrink: 0,
															zIndex: 1,
														}}
													>
														{i === guide.steps.length - 1 ? (
															<CheckCircleOutlineIcon sx={{ fontSize: 15, color: '#ffffff' }} />
														) : (
															<Typography
																sx={{
																	fontSize: 10,
																	fontWeight: 700,
																	color: '#9ca3af',
																	fontFamily: 'inherit',
																	lineHeight: 1,
																}}
															>
																{s.step}
															</Typography>
														)}
													</Box>
													{i < guide.steps.length - 1 && (
														<Box
															sx={{
																width: 1,
																flex: 1,
																minHeight: 24,
																background: '#e5e7eb',
																position: 'absolute',
																top: 28,
																left: '50%',
																transform: 'translateX(-50%)',
															}}
														/>
													)}
												</Stack>
												<Stack gap={0.3} pb={i < guide.steps.length - 1 ? 3 : 0}>
													<Typography sx={{ fontSize: 13, fontWeight: 700, color: '#181a20', fontFamily: 'inherit' }}>
														{s.title}
													</Typography>
													<Typography sx={{ fontSize: 12.5, color: '#6b7280', fontFamily: 'inherit', lineHeight: 1.6 }}>
														{s.desc}
													</Typography>
												</Stack>
											</Stack>
										))}
									</Stack>
								</Box>
							)}
						</Box>
					);
				})}
			</Box>
		</Box>
	);
};

export default withAdminLayout(AdminSupport);
