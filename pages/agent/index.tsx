// pages/agent/index.tsx

import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Stack, Box, Button, Pagination, Menu, MenuItem, Typography } from '@mui/material';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Member } from '../../libs/types/member/member';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { LIKE_TARGET_MEMBER } from '../../apollo/user/mutation';
import { GET_AGENTS } from '../../apollo/user/query';
import { T } from '../../libs/types/common';
import { Message } from '../../libs/enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';
import { REACT_APP_API_URL } from '../../libs/config';
import { userVar } from '../../apollo/store';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const AgentList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [filterSortName, setFilterSortName] = useState('Recent');
	const [sortingOpen, setSortingOpen] = useState(false);
	const [searchFilter, setSearchFilter] = useState<any>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [agents, setAgents] = useState<Member[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [searchText, setSearchText] = useState<string>('');

	/** APOLLO **/
	const [likeTargetMember] = useMutation(LIKE_TARGET_MEMBER);

	const { refetch: getAgentsRefetch } = useQuery(GET_AGENTS, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setAgents(data?.getAgents?.list);
			setTotal(data?.getAgents?.metaCounter[0]?.total);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.input) {
			const input_obj = JSON.parse(router?.query?.input as string);
			setSearchFilter(input_obj);
		} else {
			router.replace(`/agent?input=${JSON.stringify(searchFilter)}`);
		}
		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	/** HANDLERS **/
	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'recent':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: 'DESC' });
				setFilterSortName('Recent');
				break;
			case 'old':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: 'ASC' });
				setFilterSortName('Oldest');
				break;
			case 'likes':
				setSearchFilter({ ...searchFilter, sort: 'memberLikes', direction: 'DESC' });
				setFilterSortName('Most Liked');
				break;
			case 'views':
				setSearchFilter({ ...searchFilter, sort: 'memberViews', direction: 'DESC' });
				setFilterSortName('Most Viewed');
				break;
		}
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const paginationChangeHandler = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(`/agent?input=${JSON.stringify(searchFilter)}`, `/agent?input=${JSON.stringify(searchFilter)}`, {
			scroll: false,
		});
		setCurrentPage(value);
	};

	const likeMemberHandler = async (id: string) => {
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetMember({ variables: { input: id } });
			await getAgentsRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const handleVisitStore = (agentId: string) => {
		router.push(`/agent/detail?id=${agentId}`);
	};

	if (device === 'mobile') {
		return <h1>AGENTS PAGE MOBILE</h1>;
	}

	return (
		<div id="agent-list-page">
			<Stack className="container">
				<Stack className="page-header">
					<Typography className="page-title">Golf Agents</Typography>
					<Typography className="page-subtitle">Discover premium golf equipment stores and coaches</Typography>
				</Stack>

				<Stack className="filter-bar">
					<Box className="search-box">
						<input
							type="text"
							placeholder="Search for agents..."
							value={searchText}
							onChange={(e) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key === 'Enter') {
									setSearchFilter({
										...searchFilter,
										search: { ...searchFilter.search, text: searchText },
									});
								}
							}}
						/>
					</Box>

					<Stack className="sort-box">
						<span>Sort by:</span>
						<Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
							{filterSortName}
						</Button>
						<Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler}>
							<MenuItem onClick={sortingHandler} id="recent">
								Recent
							</MenuItem>
							<MenuItem onClick={sortingHandler} id="old">
								Oldest
							</MenuItem>
							<MenuItem onClick={sortingHandler} id="likes">
								Most Liked
							</MenuItem>
							<MenuItem onClick={sortingHandler} id="views">
								Most Viewed
							</MenuItem>
						</Menu>
					</Stack>
				</Stack>

				<Stack className="agents-wrap">
					{agents?.length === 0 ? (
						<Stack className="no-data">
							<img src="/img/icons/icoAlert.svg" alt="" />
							<Typography>No agents found</Typography>
						</Stack>
					) : (
						agents.map((agent: Member) => {
							const storeImage = agent?.agentStoreImage
								? `${REACT_APP_API_URL}/${agent.agentStoreImage}`
								: '/img/banner/hero_shop6.jpg';

							const profileImage = agent?.memberImage
								? `${REACT_APP_API_URL}/${agent.memberImage}`
								: '/img/profile/defaultUser.svg';

							const isLiked = agent?.meLiked?.[0]?.myFavorite;

							return (
								<Stack key={agent._id} className="agent-card">
									<Box className="card-banner" onClick={() => handleVisitStore(agent._id)}>
										<img src={storeImage} alt={agent.agentStoreName} />

										<Box
											className={`like-btn ${isLiked ? 'liked' : ''}`}
											onClick={(e: any) => {
												e.stopPropagation();
												likeMemberHandler(agent._id);
											}}
										>
											{isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
											<span>{agent.memberLikes}</span>
										</Box>
									</Box>

									<Stack className="card-body">
										<Stack className="agent-identity">
											<Box className="agent-avatar">
												<img src={profileImage} alt={agent.memberNick} />
											</Box>
											<Stack className="agent-names">
												<Typography className="store-name" onClick={() => handleVisitStore(agent._id)}>
													{agent.agentStoreName || agent.memberNick}
												</Typography>
												<Typography className="owner-name">@{agent.memberNick}</Typography>
											</Stack>
										</Stack>

										{agent.agentStoreLocation && (
											<Stack className="location">
												<LocationOnIcon />
												<span>{agent.agentStoreLocation}</span>
											</Stack>
										)}

										<Stack className="stats">
											<Stack className="stat-item">
												<StorefrontIcon />
												<span>{agent.memberProducts}</span>
											</Stack>
											<Box className="divider" />
											<Stack className="stat-item">
												<EventIcon />
												<span>{agent.memberEvents}</span>
											</Stack>
											<Box className="divider" />
											<Stack className="stat-item">
												<PeopleIcon />
												<span>{agent.memberFollowers}</span>
											</Stack>
										</Stack>

										<Button className="visit-btn" onClick={() => handleVisitStore(agent._id)}>
											Visit Store
										</Button>
									</Stack>
								</Stack>
							);
						})
					)}
				</Stack>

				{/* Pagination */}
				{agents.length !== 0 && Math.ceil(total / searchFilter.limit) > 1 && (
					<Stack className="pagination-section">
						<Pagination
							page={currentPage}
							count={Math.ceil(total / searchFilter.limit)}
							onChange={paginationChangeHandler}
							shape="circular"
							color="primary"
						/>
						<Typography className="total-text">
							Total {total} agent{total > 1 ? 's' : ''} available
						</Typography>
					</Stack>
				)}
			</Stack>
		</div>
	);
};

AgentList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 10,
		sort: 'createdAt',
		direction: 'DESC',
		search: {},
	},
};

export default withLayoutBasic(AgentList);
