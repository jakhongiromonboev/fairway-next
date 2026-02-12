import React, { useEffect, useState } from 'react';
import { Pagination, Stack, Typography, Box, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_MEMBER_FOLLOWINGS } from '../../../apollo/user/query';
import { Following } from '../../types/follow/follow';
import { REACT_APP_API_URL } from '../../config';
import { userVar } from '../../../apollo/store';
import { T } from '../../types/common';

interface FollowingInquiry {
	page: number;
	limit: number;
	search: { followerId: string };
}

interface Props {
	initialInput: FollowingInquiry;
	subscribeHandler: (id: string, refetch: any, inquiry: FollowingInquiry) => void;
	unsubscribeHandler: (id: string, refetch: any, inquiry: FollowingInquiry) => void;
	redirectToMemberPageHandler: (id: string) => void;
}

const MemberFollowings = ({
	initialInput,
	subscribeHandler,
	unsubscribeHandler,
	redirectToMemberPageHandler,
}: Props) => {
	const router = useRouter();
	const { memberId } = router.query;
	const user = useReactiveVar(userVar);
	const [followings, setFollowings] = useState<Following[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [followInquiry, setFollowInquiry] = useState<FollowingInquiry>({
		...initialInput,
		search: { followerId: (memberId as string) || user._id },
	});

	const { refetch } = useQuery(GET_MEMBER_FOLLOWINGS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: followInquiry },
		skip: !followInquiry.search.followerId,
		onCompleted: (data: T) => {
			setFollowings(data?.getMemberFollowings?.list || []);
			setTotal(data?.getMemberFollowings?.metaCounter[0]?.total || 0);
		},
	});

	useEffect(() => {
		if (memberId || user._id) {
			setFollowInquiry((prev) => ({
				...prev,
				search: { followerId: (memberId as string) || user._id },
			}));
		}
	}, [memberId, user._id]);

	return (
		<div id="member-follows">
			<Stack className="section-header">
				<Typography className="section-title">Followings</Typography>
				<Typography className="section-count">{total} followings</Typography>
			</Stack>

			{followings.length === 0 && (
				<Stack className="no-data">
					<img src="/img/icons/icoAlert.svg" alt="" />
					<Typography>No followings yet!</Typography>
				</Stack>
			)}

			<Stack className="follow-cards-grid">
				{followings.map((following: Following) => {
					const img = following?.followingData?.memberImage
						? `${REACT_APP_API_URL}/${following.followingData.memberImage}`
						: '/img/profile/defaultUser.svg';
					const isFollowing = following?.meFollowed?.[0]?.myFollowing;
					const followingId = following?.followingData?._id;

					return (
						<Stack key={following._id} className="follow-card">
							<Box
								className="follow-card-avatar"
								onClick={() => followingId && redirectToMemberPageHandler(followingId)}
							>
								<img src={img} alt={following?.followingData?.memberNick} />
							</Box>

							<Stack
								className="follow-card-info"
								onClick={() => followingId && redirectToMemberPageHandler(followingId)}
							>
								<Typography className="follow-card-nick">{following?.followingData?.memberNick}</Typography>
								<Typography className="follow-card-type">{following?.followingData?.memberType}</Typography>
								<Typography className="follow-card-stats">
									{following?.followingData?.memberFollowers ?? 0} followers
								</Typography>
							</Stack>

							{user?._id !== following?.followingId && followingId && (
								<Box className="follow-card-action">
									{isFollowing ? (
										<Button
											className="btn-unfollow"
											onClick={() => unsubscribeHandler(followingId, refetch, followInquiry)}
										>
											Unfollow
										</Button>
									) : (
										<Button
											className="btn-follow"
											onClick={() => subscribeHandler(followingId, refetch, followInquiry)}
										>
											Follow
										</Button>
									)}
								</Box>
							)}
						</Stack>
					);
				})}
			</Stack>

			{total > followInquiry.limit && (
				<Stack className="pagination-config">
					<Pagination
						page={followInquiry.page}
						count={Math.ceil(total / followInquiry.limit)}
						shape="circular"
						color="primary"
						onChange={(_e, val) => setFollowInquiry({ ...followInquiry, page: val })}
					/>
				</Stack>
			)}
		</div>
	);
};

MemberFollowings.defaultProps = {
	initialInput: { page: 1, limit: 8, search: { followerId: '' } },
};

export default MemberFollowings;
