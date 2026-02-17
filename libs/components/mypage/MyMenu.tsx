import React from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, Box } from '@mui/material';
import Link from 'next/link';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { REACT_APP_API_URL } from '../../config';
import { logOut } from '../../auth';
import { sweetConfirmAlert } from '../../sweetAlert';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';

const MyMenu = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const category: string = (router.query?.category as string) ?? 'myProfile';
	const user = useReactiveVar(userVar);
	const isAgent = user?.memberType === 'AGENT';
	const isAdmin = user?.memberType === 'ADMIN';

	const profileImage = user?.memberImage ? `${REACT_APP_API_URL}/${user.memberImage}` : '/img/profile/defaultUser.svg';

	/** HANDLERS **/
	const logoutHandler = async () => {
		try {
			if (await sweetConfirmAlert('Do you want to logout?')) logOut();
		} catch (err: any) {
			console.log('ERROR, logoutHandler:', err.message);
		}
	};

	if (device === 'mobile') {
		return <div>MY MENU MOBILE</div>;
	}

	return (
		<Stack className={'my-menu'}>
			<Stack className={'menu-profile'}>
				<Box className={'menu-avatar'}>
					<img src={profileImage} alt={user?.memberNick} />
				</Box>
				<Stack className={'menu-user-info'}>
					<Typography className={'menu-nick'}>{user?.memberNick}</Typography>
					<Box className={`menu-type-badge ${user?.memberType?.toLowerCase()}`}>{user?.memberType}</Box>
				</Stack>
			</Stack>

			<Box className={'menu-divider'} />

			<Stack className={'menu-sections'}>
				{isAgent && (
					<Stack className={'menu-section'}>
						<Typography className={'section-label'}>Listings</Typography>
						<Stack className={'section-items'}>
							<Link href={{ pathname: '/mypage', query: { category: 'myProducts' } }} scroll={false}>
								<Stack className={`menu-item ${category === 'myProducts' ? 'active' : ''}`}>
									<StorefrontOutlinedIcon />
									<Typography>My Products</Typography>
								</Stack>
							</Link>
							<Link href={{ pathname: '/mypage', query: { category: 'addProduct' } }} scroll={false}>
								<Stack className={`menu-item ${category === 'addProduct' ? 'active' : ''}`}>
									<AddBoxOutlinedIcon />
									<Typography>Add Product</Typography>
								</Stack>
							</Link>
							<Link href={{ pathname: '/mypage', query: { category: 'myEvents' } }} scroll={false}>
								<Stack className={`menu-item ${category === 'myEvents' ? 'active' : ''}`}>
									<EventOutlinedIcon />
									<Typography>My Events</Typography>
								</Stack>
							</Link>
							<Link href={{ pathname: '/mypage', query: { category: 'addEvent' } }} scroll={false}>
								<Stack className={`menu-item ${category === 'addEvent' ? 'active' : ''}`}>
									<AddCircleOutlineIcon />
									<Typography>Add Event</Typography>
								</Stack>
							</Link>
						</Stack>
					</Stack>
				)}

				{!isAgent && !isAdmin && (
					<Stack className={'menu-section'}>
						<Typography className={'section-label'}>Bookings</Typography>
						<Stack className={'section-items'}>
							<Link href={{ pathname: '/mypage', query: { category: 'myReservations' } }} scroll={false}>
								<Stack className={`menu-item ${category === 'myReservations' ? 'active' : ''}`}>
									<BookmarkBorderIcon />
									<Typography>My Reservations</Typography>
								</Stack>
							</Link>
						</Stack>
					</Stack>
				)}

				<Stack className={'menu-section'}>
					<Typography className={'section-label'}>Activity</Typography>
					<Stack className={'section-items'}>
						<Link href={{ pathname: '/mypage', query: { category: 'myFavorites' } }} scroll={false}>
							<Stack className={`menu-item ${category === 'myFavorites' ? 'active' : ''}`}>
								<FavoriteBorderIcon />
								<Typography>My Favorites</Typography>
							</Stack>
						</Link>
						<Link href={{ pathname: '/mypage', query: { category: 'myVisited' } }} scroll={false}>
							<Stack className={`menu-item ${category === 'myVisited' ? 'active' : ''}`}>
								<VisibilityOutlinedIcon />
								<Typography>Recently Visited</Typography>
							</Stack>
						</Link>
						<Link href={{ pathname: '/mypage', query: { category: 'followers' } }} scroll={false}>
							<Stack className={`menu-item ${category === 'followers' ? 'active' : ''}`}>
								<PeopleOutlinedIcon />
								<Typography>Followers</Typography>
							</Stack>
						</Link>
						<Link href={{ pathname: '/mypage', query: { category: 'followings' } }} scroll={false}>
							<Stack className={`menu-item ${category === 'followings' ? 'active' : ''}`}>
								<PeopleOutlinedIcon />
								<Typography>Followings</Typography>
							</Stack>
						</Link>
					</Stack>
				</Stack>

				<Stack className={'menu-section'}>
					<Typography className={'section-label'}>Community</Typography>
					<Stack className={'section-items'}>
						<Link href={{ pathname: '/mypage', query: { category: 'myArticles' } }} scroll={false}>
							<Stack className={`menu-item ${category === 'myArticles' ? 'active' : ''}`}>
								<ArticleOutlinedIcon />
								<Typography>My Articles</Typography>
							</Stack>
						</Link>
						<Link href={{ pathname: '/mypage', query: { category: 'writeArticle' } }} scroll={false}>
							<Stack className={`menu-item ${category === 'writeArticle' ? 'active' : ''}`}>
								<EditOutlinedIcon />
								<Typography>Write Article</Typography>
							</Stack>
						</Link>
					</Stack>
				</Stack>

				<Stack className={'menu-section'}>
					<Typography className={'section-label'}>Account</Typography>
					<Stack className={'section-items'}>
						<Link href={{ pathname: '/mypage', query: { category: 'myProfile' } }} scroll={false}>
							<Stack className={`menu-item ${category === 'myProfile' ? 'active' : ''}`}>
								<PersonOutlineIcon />
								<Typography>My Profile</Typography>
							</Stack>
						</Link>

						{isAdmin && (
							<a href={'/_admin'} target={'_blank'} rel="noreferrer">
								<Stack className={'menu-item admin'}>
									<AdminPanelSettingsOutlinedIcon />
									<Typography>Admin Panel</Typography>
								</Stack>
							</a>
						)}

						<Stack className={'menu-item logout'} onClick={logoutHandler}>
							<LogoutIcon />
							<Typography>Logout</Typography>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default MyMenu;
