import type { ComponentType } from 'react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminMenuList from '../admin/AdminMenuList';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { Divider, Menu, MenuItem } from '@mui/material';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { getJwtToken, logOut, updateUserInfo } from '../../auth';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { MemberType } from '../../enums/member.enum';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import GolfCourseIcon from '@mui/icons-material/GolfCourse';

const drawerWidth = 260;

const withAdminLayout = (Component: ComponentType) => {
	return (props: object) => {
		const router = useRouter();
		const user = useReactiveVar(userVar);
		const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
		const [loading, setLoading] = useState(true);

		useEffect(() => {
			const jwt = getJwtToken();
			if (jwt) updateUserInfo(jwt);
			setLoading(false);
		}, []);

		useEffect(() => {
			if (!loading && user.memberType !== MemberType.ADMIN) {
				router.push('/').then();
			}
		}, [loading, user, router]);

		if (!user || user?.memberType !== MemberType.ADMIN) return null;

		const profileImage = user?.memberImage ? `${user.memberImage}` : '/img/profile/defaultUser.svg';
		const currentPage = router.pathname.split('/').filter(Boolean).pop()?.replace(/-/g, ' ') ?? 'dashboard';

		return (
			<Box
				id="admin-wrap"
				sx={{
					display: 'flex',
					flexDirection: 'row',
					minHeight: '100vh',
					width: '100%',
					overflow: 'hidden',
				}}
			>
				{/** ── SIDEBAR ── **/}
				<Drawer
					variant="permanent"
					anchor="left"
					className="admin-sidebar"
					sx={{
						width: drawerWidth,
						flexShrink: 0,
						'& .MuiDrawer-paper': {
							width: drawerWidth,
							boxSizing: 'border-box',
							border: 'none',
							display: 'flex',
							flexDirection: 'column',
						},
					}}
				>
					<Stack className="sidebar-logo">
						<Box className="logo-icon">
							<GolfCourseIcon />
						</Box>
						<Stack className="logo-text">
							<span className="logo-title">FAIRWAY</span>
							<span className="logo-sub">Admin Console</span>
						</Stack>
					</Stack>

					<Divider className="sidebar-divider" />

					<Box className="sidebar-menu">
						<AdminMenuList />
					</Box>

					<Stack className="sidebar-user">
						<Avatar src={profileImage} className="sidebar-avatar" />
						<Stack className="sidebar-user-info">
							<span className="user-name">{user?.memberNick}</span>
							<span className="user-role">Administrator</span>
						</Stack>
					</Stack>
				</Drawer>

				<Box
					className="admin-main"
					sx={{
						minWidth: 0,
						flex: 1,
						overflow: 'hidden',
					}}
				>
					<Stack className="admin-topbar">
						<Stack className="topbar-left">
							<Typography className="page-title">{currentPage.toUpperCase()}</Typography>
						</Stack>
						<Stack className="topbar-right">
							<IconButton className="topbar-icon-btn">
								<NotificationsNoneIcon />
							</IconButton>
							<Stack className="topbar-user" onClick={(e: any) => setAnchorElUser(e.currentTarget)}>
								<Avatar src={profileImage} sx={{ width: 28, height: 28 }} />
								<span>{user?.memberNick}</span>
								<KeyboardArrowDownIcon />
							</Stack>
							<Menu
								anchorEl={anchorElUser}
								open={Boolean(anchorElUser)}
								onClose={() => setAnchorElUser(null)}
								sx={{ mt: '8px' }}
								PaperProps={{
									sx: {
										borderRadius: '10px',
										border: '1px solid #f0f0f0',
										boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
										minWidth: 160,
									},
								}}
							>
								<Box sx={{ px: 2, py: 1.5 }}>
									<Typography sx={{ fontWeight: 700, fontSize: 13, color: '#181a20' }}>{user?.memberNick}</Typography>
									<Typography sx={{ fontSize: 11, color: '#9ca3af', mt: 0.3 }}>{user?.memberPhone}</Typography>
								</Box>
								<Divider />
								<MenuItem
									onClick={() => {
										logOut();
										router.push('/');
									}}
									sx={{ fontSize: 13, color: '#ef4444', py: 1.2, fontFamily: 'inherit' }}
								>
									Sign Out
								</MenuItem>
							</Menu>
						</Stack>
					</Stack>

					{/** CONTENT **/}
					<Box className="admin-content">
						{/*@ts-ignore*/}
						<Component {...props} />
					</Box>
				</Box>
			</Box>
		);
	};
};

export default withAdminLayout;
