import React, { useEffect, useState } from 'react';
import { useRouter, withRouter } from 'next/router';
import Link from 'next/link';
import { Box, Collapse } from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ForumIcon from '@mui/icons-material/Forum';
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';

const AdminMenuList = (props: any) => {
	const [clickMenu, setClickMenu] = useState<string[]>(['Users']);
	const [clickSubMenu, setClickSubMenu] = useState('List');

	const {
		router: { pathname },
	} = props;
	const pathnames = pathname.split('/').filter((x: any) => x);

	useEffect(() => {
		switch (pathnames[1]) {
			case 'products':
				setClickMenu(['Products']);
				break;
			case 'events':
				setClickMenu(['Events']);
				break;
			case 'community':
				setClickMenu(['Community']);
				break;
			case 'cs':
				setClickMenu(['Cs']);
				break;
			default:
				setClickMenu(['Users']);
				break;
		}
		switch (pathnames[2]) {
			case 'inquiry':
				setClickSubMenu('Inquiry');
				break;
			default:
				setClickSubMenu('List');
				break;
		}
	}, []);

	const subMenuChangeHandler = (target: string) => {
		if (clickMenu.find((item) => item === target)) {
			setClickMenu(clickMenu.filter((menu) => target !== menu));
		} else {
			setClickMenu([...clickMenu, target]);
		}
	};

	const menu_set = [
		{ title: 'Users', icon: <PeopleOutlineIcon />, onClick: () => subMenuChangeHandler('Users') },
		{ title: 'Products', icon: <StorefrontIcon />, onClick: () => subMenuChangeHandler('Products') },
		{ title: 'Events', icon: <EmojiEventsIcon />, onClick: () => subMenuChangeHandler('Events') },
		{ title: 'Community', icon: <ForumIcon />, onClick: () => subMenuChangeHandler('Community') },
		{ title: 'Cs', icon: <HeadsetMicIcon />, onClick: () => subMenuChangeHandler('Cs') },
	];

	const sub_menu_set: any = {
		Users: [{ title: 'List', url: '/_admin/users' }],
		Products: [{ title: 'List', url: '/_admin/products' }],
		Events: [{ title: 'List', url: '/_admin/events' }],
		Community: [{ title: 'List', url: '/_admin/community' }],
		Cs: [{ title: 'Inquiry', url: '/_admin/cs/inquiry' }],
	};

	return (
		<Box className="admin-nav">
			{menu_set.map((item, index) => {
				const isOpen = !!clickMenu.find((m) => m === item.title);
				const isActive = clickMenu[0] === item.title;
				return (
					<Box key={index} className="nav-group">
						<Box className={`nav-item ${isActive ? 'active' : ''}`} onClick={item.onClick}>
							<Box className="nav-icon">{item.icon}</Box>
							<span className="nav-label">{item.title}</span>
							<Box className="nav-arrow">{isOpen ? <ExpandLess /> : <ExpandMore />}</Box>
						</Box>

						<Collapse in={isOpen} timeout="auto" unmountOnExit>
							<Box className="nav-sub">
								{sub_menu_set[item.title]?.map((sub: any, i: number) => {
									const isSubActive = isActive && clickSubMenu === sub.title;
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
