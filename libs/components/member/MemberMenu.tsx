import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, Box, Button } from '@mui/material';
import Link from 'next/link';
import { Member } from '../../types/member/member';
import { REACT_APP_API_URL } from '../../config';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { GET_MEMBER } from '../../../apollo/user/query';
import { LIKE_TARGET_MEMBER } from '../../../apollo/user/mutation';
import { userVar } from '../../../apollo/store';
import { T } from '../../types/common';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EventIcon from '@mui/icons-material/Event';
import ArticleIcon from '@mui/icons-material/Article';
import PeopleIcon from '@mui/icons-material/People';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { ConnectingAirportsOutlined } from '@mui/icons-material';

interface MemberMenuProps {
	subscribeHandler: (id: string, refetch: any, inquiry: any) => void;
	unsubscribeHandler: (id: string, refetch: any, inquiry: any) => void;
}

const MemberMenu = (props: MemberMenuProps) => {
	const { subscribeHandler, unsubscribeHandler } = props;
	const router = useRouter();
	const category: string = (router.query?.category as string) || 'products';
	const { memberId } = router.query;
	const user = useReactiveVar(userVar);
	const [member, setMember] = useState<Member | null>(null);

	/** APOLLO REQUESTS **/
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

	const {
		loading: getMemberLoading,
		data: getMemberData,
		refetch: getMemberRefetch,
	} = useQuery(GET_MEMBER, {
		fetchPolicy: 'network-only',
		variables: { input: memberId || user._id },
		skip: !memberId && !user._id,
		onCompleted: (data: T) => {
			setMember(data?.getMember);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (memberId || user._id) {
			getMemberRefetch({ input: memberId || user._id });
		}
	}, [memberId]);

	/** HANDLERS **/
	const handleFollow = async () => {
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await subscribeHandler(member?._id as string, null, null);
			const result = await getMemberRefetch({ input: memberId || user._id });
			if (result?.data?.getMember) setMember(result.data.getMember);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message);
		}
	};

	const handleUnfollow = async () => {
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await unsubscribeHandler(member?._id as string, null, null);
			const result = await getMemberRefetch({ input: memberId || user._id });
			if (result?.data?.getMember) setMember(result.data.getMember);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message);
		}
	};

	const handleLike = async () => {
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetMember({ variables: { input: member?._id } });
			const result = await getMemberRefetch({ input: memberId || user._id });
			if (result?.data?.getMember) setMember(result.data.getMember);
			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message);
		}
	};

	const profileImage = member?.memberImage
		? `${REACT_APP_API_URL}/${member.memberImage}`
		: '/img/profile/defaultUser.svg';

	const bannerImage = member?.agentStoreImage
		? `${REACT_APP_API_URL}/${member.agentStoreImage}`
		: '/img/banner/hero_shop6.jpg';

	const isFollowing = member?.meFollowed?.[0]?.myFollowing;
	const isLiked = member?.meLiked?.[0]?.myFavorite ?? false;
	const isMyProfile = !memberId || user._id === (memberId as string);

	return (
		<Stack className={'member-menu'}>
			<Box className={'profile-banner'}>
				<img src={bannerImage} alt="banner" />
			</Box>

			<Stack className={'profile-card'}>
				<Box className={'avatar-wrap'}>
					<img src={profileImage} alt={member?.memberNick} />
				</Box>

				<Stack className={'identity'}>
					<Stack className={'name-row'}>
						<Typography className={'display-name'}>
							{member?.memberType === 'AGENT' ? member?.agentStoreName || member?.memberNick : member?.memberNick}
						</Typography>
					</Stack>

					<Stack className={'name-row'}>
						<Typography className={'username'}>@{member?.memberNick}</Typography>
						<Box className={`member-type-badge ${member?.memberType?.toLowerCase()}`}>{member?.memberType}</Box>
					</Stack>
					{(member?.agentStoreLocation || member?.memberAddress) && (
						<Stack className={'location'}>
							<LocationOnIcon />
							<span>{member?.agentStoreLocation || member?.memberAddress}</span>
						</Stack>
					)}

					{(member?.agentStoreDesc || member?.memberDesc) && (
						<Typography className={'bio'}>{member?.agentStoreDesc || member?.memberDesc}</Typography>
					)}
				</Stack>

				<Stack className={'stats-row'}>
					<Stack className={'stat-item'}>
						<span className={'val'}>{member?.memberFollowers ?? 0}</span>
						<span className={'lbl'}>Followers</span>
					</Stack>
					<Box className={'divider'} />
					<Stack className={'stat-item'}>
						<span className={'val'}>{member?.memberFollowings ?? 0}</span>
						<span className={'lbl'}>Following</span>
					</Stack>
					<Box className={'divider'} />
					<Stack className={'stat-item'}>
						<span className={'val'}>{member?.memberLikes ?? 0}</span>
						<span className={'lbl'}>Likes</span>
					</Stack>
					<Box className={'divider'} />
					<Stack className={'stat-item'}>
						<span className={'val'}>{member?.memberViews ?? 0}</span>
						<span className={'lbl'}>Views</span>
					</Stack>
				</Stack>

				{!isMyProfile && (
					<Stack className={'action-btns'}>
						<Button
							className={`follow-btn ${isFollowing ? 'following' : ''}`}
							onClick={isFollowing ? handleUnfollow : handleFollow}
							startIcon={isFollowing ? <PersonRemoveIcon /> : <PersonAddIcon />}
							fullWidth
						>
							{isFollowing ? 'Following' : 'Follow'}
						</Button>
						<Box className={`like-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
							{isLiked ? <FavoriteIcon sx={{ color: '#e74c3c' }} /> : <FavoriteBorderIcon sx={{ color: '#8f8f8f' }} />}
							{console.log(isLiked)}
							{console.log(member)}
						</Box>
					</Stack>
				)}
			</Stack>

			{/* NAV LINKS */}
			<Stack className={'nav-links'}>
				<Link href={{ pathname: '/member', query: { ...router.query, category: 'products' } }} scroll={false}>
					<Stack className={`nav-item ${category === 'products' ? 'active' : ''}`}>
						<StorefrontIcon />
						<Typography className={'nav-label'}>Products</Typography>
						<Typography className={'nav-count'}>{member?.memberProducts ?? 0}</Typography>
					</Stack>
				</Link>

				<Link href={{ pathname: '/member', query: { ...router.query, category: 'events' } }} scroll={false}>
					<Stack className={`nav-item ${category === 'events' ? 'active' : ''}`}>
						<EventIcon />
						<Typography className={'nav-label'}>
							{member?.memberType === 'AGENT' ? 'Events' : 'Reservations'}
						</Typography>
						<Typography className={'nav-count'}>
							{member?.memberType === 'AGENT' ? member?.memberEvents ?? 0 : ''}
						</Typography>
					</Stack>
				</Link>

				<Link href={{ pathname: '/member', query: { ...router.query, category: 'articles' } }} scroll={false}>
					<Stack className={`nav-item ${category === 'articles' ? 'active' : ''}`}>
						<ArticleIcon />
						<Typography className={'nav-label'}>Articles</Typography>
						<Typography className={'nav-count'}>{member?.memberArticles ?? 0}</Typography>
					</Stack>
				</Link>

				<Link href={{ pathname: '/member', query: { ...router.query, category: 'followers' } }} scroll={false}>
					<Stack className={`nav-item ${category === 'followers' ? 'active' : ''}`}>
						<PeopleIcon />
						<Typography className={'nav-label'}>Followers</Typography>
						<Typography className={'nav-count'}>{member?.memberFollowers ?? 0}</Typography>
					</Stack>
				</Link>

				<Link href={{ pathname: '/member', query: { ...router.query, category: 'followings' } }} scroll={false}>
					<Stack className={`nav-item ${category === 'followings' ? 'active' : ''}`}>
						<PeopleIcon />
						<Typography className={'nav-label'}>Followings</Typography>
						<Typography className={'nav-count'}>{member?.memberFollowings ?? 0}</Typography>
					</Stack>
				</Link>
			</Stack>
		</Stack>
	);
};

export default MemberMenu;
