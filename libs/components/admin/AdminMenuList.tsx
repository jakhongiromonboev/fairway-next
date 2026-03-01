import React, { useEffect, useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import Link from 'next/link';
import { Box, Collapse } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ForumIcon from '@mui/icons-material/Forum';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';

const AdminMenuList = (props: any) => {
	const [clickMenu, setClickMenu] = useState<string[]>([]);
	const [activeTop, setActiveTop] = useState<string>('');

	const {
		router: { pathname },
	} = props;

	const pathnames = pathname.split('/').filter((x: any) => x);

	useEffect(() => {
		const segment = pathnames[1];
		if (!segment || segment === '_admin') {
			setActiveTop('Dashboard');
			setClickMenu([]);
		} else {
			switch (segment) {
				case 'users':
					setActiveTop('Users');
					setClickMenu(['Users']);
					break;
				case 'products':
					setActiveTop('Products');
					setClickMenu(['Products']);
					break;
				case 'events':
					setActiveTop('Events');
					setClickMenu(['Events']);
					break;
				case 'community':
					setActiveTop('Community');
					setClickMenu(['Community']);
					break;
				case 'cs':
					setActiveTop('Cs');
					setClickMenu(['Cs']);
					break;
				default:
					setActiveTop('Dashboard');
					setClickMenu([]);
			}
		}
	}, [pathname]);

	const subMenuChangeHandler = (target: string) => {
		if (clickMenu.find((item) => item === target)) {
			setClickMenu(clickMenu.filter((menu) => target !== menu));
		} else {
			setClickMenu([...clickMenu, target]);
		}
	};

	const sub_menu_set: any = {
		Users: [{ title: 'Manage', url: '/_admin/users' }],
		Products: [{ title: 'Manage', url: '/_admin/products' }],
		Events: [{ title: 'Manage', url: '/_admin/events' }],
		Community: [{ title: 'Manage', url: '/_admin/community' }],
		Cs: [{ title: 'Manage', url: '/_admin/cs/inquiry' }],
	};

	const isDashboard = activeTop === 'Dashboard';

	return (
		<Box className="admin-nav">
			<Box className="nav-group">
				<Link href="/_admin">
					<Box className={`nav-item ${isDashboard ? 'active' : ''}`}>
						<Box className="nav-icon">
							<DashboardOutlinedIcon />
						</Box>
						<span className="nav-label">Dashboard</span>
					</Box>
				</Link>
			</Box>

			<Box className="nav-section-label">MANAGEMENT</Box>

			{[
				{ title: 'Users', icon: <PeopleOutlineIcon /> },
				{ title: 'Products', icon: <StorefrontIcon /> },
				{ title: 'Events', icon: <EmojiEventsIcon /> },
				{ title: 'Community', icon: <ForumIcon /> },
				{ title: 'Cs', icon: <HeadsetMicIcon /> },
			].map((item, index) => {
				const isOpen = !!clickMenu.find((m) => m === item.title);
				const isActive = activeTop === item.title;

				return (
					<Box key={index} className="nav-group">
						<Box className={`nav-item ${isActive ? 'active' : ''}`} onClick={() => subMenuChangeHandler(item.title)}>
							<Box className="nav-icon">{item.icon}</Box>
							<span className="nav-label">{item.title === 'Cs' ? 'Support' : item.title}</span>
							<Box className="nav-arrow">{isOpen ? <ExpandLess /> : <ExpandMore />}</Box>
						</Box>
						<Collapse in={isOpen} timeout="auto" unmountOnExit>
							<Box className="nav-sub">
								{sub_menu_set[item.title]?.map((sub: any, i: number) => {
									const isSubActive = pathname === sub.url;
									return (
										<Link href={sub.url} key={i}>
											<Box className={`nav-sub-item ${isSubActive ? 'active' : ''}`}>
												<span className="sub-dot" />
												<span className="sub-label">{sub.title}</span>
											</Box>
										</Link>
									);
								})}
							</Box>
						</Collapse>
					</Box>
				);
			})}
		</Box>
	);
};

export default withRouter(AdminMenuList);
