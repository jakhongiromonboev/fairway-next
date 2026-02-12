import React, { useEffect, useState } from 'react';
import { Pagination, Stack, Typography, Box, Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useQuery, useReactiveVar } from '@apollo/client';
import { GET_MEMBER_FOLLOWERS } from '../../../apollo/user/query';
import { Follower } from '../../types/follow/follow';
import { REACT_APP_API_URL } from '../../config';
import { userVar } from '../../../apollo/store';
import { T } from '../../types/common';

interface FollowerInquiry {
	page: number;
	limit: number;
	search: { followingId: string };
}

interface Props {
	initialInput: FollowerInquiry;
	subscribeHandler: (id: string, refetch: any, inquiry: FollowerInquiry) => void;
	unsubscribeHandler: (id: string, refetch: any, inquiry: FollowerInquiry) => void;
	redirectToMemberPageHandler: (id: string) => void;
}

const MemberFollowers = ({
	initialInput,
	subscribeHandler,
	unsubscribeHandler,
	redirectToMemberPageHandler,
}: Props) => {
	const router = useRouter();
	const { memberId } = router.query;
	const user = useReactiveVar(userVar);
	const [followers, setFollowers] = useState<Follower[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [followInquiry, setFollowInquiry] = useState<FollowerInquiry>({
		...initialInput,
		search: { followingId: (memberId as string) || user._id },
	});

	const { refetch } = useQuery(GET_MEMBER_FOLLOWERS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: followInquiry },
		skip: !followInquiry.search.followingId,
		onCompleted: (data: T) => {
			setFollowers(data?.getMemberFollowers?.list || []);
			setTotal(data?.getMemberFollowers?.metaCounter[0]?.total || 0);
		},
	});

	useEffect(() => {
		if (memberId || user._id) {
			setFollowInquiry((prev) => ({
				...prev,
				search: { followingId: (memberId as string) || user._id },
			}));
		}
	}, [memberId, user._id]);

	return (
		<div id="member-follows">
			<Stack className="section-header">
				<Typography className="section-title">Followers</Typography>
				<Typography className="section-count">{total} followers</Typography>
			</Stack>

			{followers.length === 0 && (
				<Stack className="no-data">
					<img src="/img/icons/icoAlert.svg" alt="" />
					<Typography>No followers yet!</Typography>
				</Stack>
			)}

			<Stack className="follow-cards-grid">
				{followers.map((follower: Follower) => {
					const img = follower?.followerData?.memberImage
						? `${REACT_APP_API_URL}/${follower.followerData.memberImage}`
						: '/img/profile/defaultUser.svg';
					const isFollowing = follower?.meFollowed?.[0]?.myFollowing;
					const followerId = follower?.followerData?._id;

					return (
						<Stack key={follower._id} className="follow-card">
							<Box className="follow-card-avatar" onClick={() => followerId && redirectToMemberPageHandler(followerId)}>
								<img src={img} alt={follower?.followerData?.memberNick} />
							</Box>

							<Stack className="follow-card-info" onClick={() => followerId && redirectToMemberPageHandler(followerId)}>
								<Typography className="follow-card-nick">{follower?.followerData?.memberNick}</Typography>
								<Typography className="follow-card-type">{follower?.followerData?.memberType}</Typography>
								<Typography className="follow-card-stats">
									{follower?.followerData?.memberFollowers ?? 0} followers
								</Typography>
							</Stack>

							{user?._id !== follower?.followerId && followerId && (
								<Box className="follow-card-action">
									{isFollowing ? (
										<Button
											className="btn-unfollow"
											onClick={() => unsubscribeHandler(followerId, refetch, followInquiry)}
										>
											Unfollow
										</Button>
									) : (
										<Button className="btn-follow" onClick={() => subscribeHandler(followerId, refetch, followInquiry)}>
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

MemberFollowers.defaultProps = {
	initialInput: { page: 1, limit: 8, search: { followingId: '' } },
};

export default MemberFollowers;
