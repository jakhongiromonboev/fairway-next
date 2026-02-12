import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Box, Button, Stack, Typography, Tabs, Tab, Pagination } from '@mui/material';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { Member } from '../../libs/types/member/member';
import { Product } from '../../libs/types/product/product';
import { Event } from '../../libs/types/event/event';
import { Comment } from '../../libs/types/comment/comment';
import { userVar } from '../../apollo/store';
import { REACT_APP_API_URL } from '../../libs/config';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GET_MEMBER, GET_PRODUCTS, GET_EVENTS, GET_COMMENTS } from '../../apollo/user/query';
import {
	LIKE_TARGET_PRODUCT,
	LIKE_TARGET_EVENT,
	CREATE_COMMENT,
	SUBSCRIBE,
	UNSUBSCRIBE,
} from '../../apollo/user/mutation';
import { T } from '../../libs/types/common';
import { Message } from '../../libs/enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert, sweetErrorHandling } from '../../libs/sweetAlert';
import ProductCard from '../../libs/components/product/ProductCard';
import Review from '../../libs/components/product/Review';
import { CommentGroup } from '../../libs/enums/comment.enum';
import { CommentInput } from '../../libs/types/comment/comment.input';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

const TabPanel = (props: TabPanelProps) => {
	const { children, value, index, ...other } = props;
	return (
		<div role="tabpanel" hidden={value !== index} {...other}>
			{value === index && <Box className="tab-content">{children}</Box>}
		</div>
	);
};

const AgentDetail: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [agentId, setAgentId] = useState<string | null>(null);
	const [agent, setAgent] = useState<Member | null>(null);
	const [tabValue, setTabValue] = useState(0);

	const [agentProducts, setAgentProducts] = useState<Product[]>([]);
	const [productTotal, setProductTotal] = useState<number>(0);
	const [productPage, setProductPage] = useState<number>(1);

	const [agentEvents, setAgentEvents] = useState<Event[]>([]);
	const [eventTotal, setEventTotal] = useState<number>(0);
	const [eventPage, setEventPage] = useState<number>(1);

	const [agentReviews, setAgentReviews] = useState<Comment[]>([]);
	const [reviewTotal, setReviewTotal] = useState<number>(0);
	const [reviewPage, setReviewPage] = useState<number>(1);
	const [reviewContent, setReviewContent] = useState<string>('');

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);
	const [likeTargetEvent] = useMutation(LIKE_TARGET_EVENT);
	const [createComment] = useMutation(CREATE_COMMENT);
	const [subscribe] = useMutation(SUBSCRIBE);
	const [unsubscribe] = useMutation(UNSUBSCRIBE);

	const {
		loading: getMemberLoading,
		data: getMemberData,
		refetch: getMemberRefetch,
	} = useQuery(GET_MEMBER, {
		fetchPolicy: 'network-only',
		variables: { input: agentId },
		skip: !agentId,
		onCompleted: (data: T) => {
			setAgent(data?.getMember);
		},
	});

	const {
		loading: getProductsLoading,
		data: getProductsData,
		refetch: getProductsRefetch,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: productPage,
				limit: 9,
				sort: 'createdAt',
				direction: 'DESC',
				search: { memberId: agentId },
			},
		},
		skip: !agentId,
		onCompleted: (data: T) => {
			setAgentProducts(data?.getProducts?.list || []);
			setProductTotal(data?.getProducts?.metaCounter[0]?.total || 0);
		},
	});

	const {
		loading: getEventsLoading,
		data: getEventsData,
		refetch: getEventsRefetch,
	} = useQuery(GET_EVENTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: eventPage,
				limit: 9,
				sort: 'createdAt',
				direction: 'DESC',
				search: { memberId: agentId },
			},
		},
		skip: !agentId,
		onCompleted: (data: T) => {
			setAgentEvents(data?.getEvents?.list || []);
			setEventTotal(data?.getEvents?.metaCounter[0]?.total || 0);
		},
	});

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: reviewPage,
				limit: 5,
				sort: 'createdAt',
				direction: 'DESC',
				search: {
					commentRefId: agentId,
				},
			},
		},
		skip: !agentId,
		onCompleted: (data: T) => {
			setAgentReviews(data?.getComments?.list || []);
			setReviewTotal(data?.getComments?.metaCounter[0]?.total || 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (router.query.id) {
			setAgentId(router.query.id as string);
		}
	}, [router]);

	/** HANDLERS **/
	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	const handleGoToMemberPage = () => {
		router.push(`/member?memberId=${agentId}`);
	};

	const handleFollowToggle = async () => {
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			if (agent?.meFollowed && agent.meFollowed[0]?.myFollowing) {
				await unsubscribe({ variables: { input: agentId } });
			} else {
				await subscribe({ variables: { input: agentId } });
			}

			const result = await getMemberRefetch({ input: agentId });

			if (result?.data?.getMember) {
				setAgent(result.data.getMember);
			}

			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetProduct({ variables: { input: id } });
			await getProductsRefetch();
			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const likeEventHandler = async (user: T, id: string) => {
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetEvent({ variables: { input: id } });
			await getEventsRefetch();
			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const createReviewHandler = async () => {
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			if (user._id === agentId) throw new Error('Cannot review yourself');

			const input: CommentInput = {
				commentGroup: CommentGroup.MEMBER,
				commentContent: reviewContent,
				commentRefId: agentId as string,
			};

			await createComment({ variables: { input } });
			setReviewContent('');
			await getCommentsRefetch();
			await sweetTopSmallSuccessAlert('Review submitted', 800);
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	if (device === 'mobile') {
		return <div>AGENT DETAIL MOBILE</div>;
	}

	if (!agent) {
		return <div>Loading...</div>;
	}

	const storeImage = agent?.agentStoreImage
		? `${REACT_APP_API_URL}/${agent.agentStoreImage}`
		: '/img/banner/agents-store1.jpg';

	const profileImage = agent?.memberImage
		? `${REACT_APP_API_URL}/${agent.memberImage}`
		: '/img/profile/defaultUser.svg';

	return (
		<div id="agent-detail-page">
			<Stack className="container">
				{/* Store Header */}
				<Stack className="store-header">
					<Box className="store-banner">
						<img src={storeImage} alt={agent.agentStoreName} />
					</Box>

					<Stack className="store-info">
						<Box className="store-logo" onClick={handleGoToMemberPage} sx={{ cursor: 'pointer' }}>
							<img src={profileImage} alt={agent.memberNick} />
						</Box>

						<Stack className="store-details">
							<Typography className="store-name">{agent.agentStoreName || agent.memberNick}</Typography>
							{agent.agentStoreLocation && (
								<Stack className="store-location">
									<LocationOnIcon />
									<span>{agent.agentStoreLocation}</span>
								</Stack>
							)}
							<Stack className="store-stats">
								<Stack className="stat-item">
									<StorefrontIcon />
									<span>{agent.memberProducts} Products</span>
								</Stack>
								<Stack className="stat-item">
									<EventIcon />
									<span>{agent.memberEvents} Events</span>
								</Stack>
								<Stack className="stat-item">
									<PeopleIcon />
									<span>{agent.memberFollowers} Followers</span>
								</Stack>
							</Stack>

							<Button
								className={`follow-btn ${agent?.meFollowed?.[0]?.myFollowing ? 'following' : ''}`}
								onClick={handleFollowToggle}
								startIcon={agent?.meFollowed?.[0]?.myFollowing ? <PersonRemoveIcon /> : <PersonAddIcon />}
							>
								{agent?.meFollowed?.[0]?.myFollowing ? 'Following' : 'Follow'}
							</Button>
						</Stack>
					</Stack>
				</Stack>

				{/* Tabs */}
				<Stack className="store-tabs">
					<Tabs value={tabValue} onChange={handleTabChange} className="tabs-nav">
						<Tab label={`Products (${productTotal})`} />
						<Tab label={`Events (${eventTotal})`} />
						<Tab label="About" />
						<Tab label={`Reviews (${reviewTotal})`} />
					</Tabs>

					{/* Products Tab */}
					<TabPanel value={tabValue} index={0}>
						<Stack className="products-grid">
							{agentProducts.length === 0 ? (
								<Typography className="no-data">No products yet</Typography>
							) : (
								agentProducts.map((product: Product) => (
									<ProductCard key={product._id} product={product} likeProductHandler={likeProductHandler} />
								))
							)}
						</Stack>
						{productTotal > 9 && (
							<Box className="pagination-box">
								<Pagination
									page={productPage}
									count={Math.ceil(productTotal / 9)}
									onChange={(e, page) => setProductPage(page)}
									color="primary"
								/>
							</Box>
						)}
					</TabPanel>

					{/* Events Tab */}
					<TabPanel value={tabValue} index={1}>
						<Stack className="events-grid">
							{agentEvents.length === 0 ? (
								<Typography className="no-data">No events yet</Typography>
							) : (
								<Typography>Events coming soon...</Typography>
							)}
						</Stack>
					</TabPanel>

					{/* About Tab */}
					<TabPanel value={tabValue} index={2}>
						<Stack className="about-content">
							<Typography className="section-title">About the Store</Typography>
							<Typography className="about-text">{agent.agentStoreDesc || 'No description provided.'}</Typography>

							<Typography className="section-title" sx={{ mt: 4 }}>
								Contact Information
							</Typography>
							<Stack className="contact-info">
								<Typography>Phone: {agent.memberPhone}</Typography>
								{agent.memberEmail && <Typography>Email: {agent.memberEmail}</Typography>}
								{agent.agentStoreAddress && <Typography>Address: {agent.agentStoreAddress}</Typography>}
							</Stack>
						</Stack>
					</TabPanel>

					{/* Reviews Tab */}
					<TabPanel value={tabValue} index={3}>
						<Stack className="reviews-content">
							{agentReviews.length === 0 ? (
								<Typography className="no-reviews">No reviews yet</Typography>
							) : (
								<Stack className="reviews-list">
									{agentReviews.map((review: Comment) => (
										<Review key={review._id} comment={review} />
									))}
								</Stack>
							)}

							{/* Leave Review */}
							<Stack className="leave-review-section">
								<Typography className="form-title">Leave a Review</Typography>
								<textarea
									placeholder="Share your experience..."
									value={reviewContent}
									onChange={(e) => setReviewContent(e.target.value)}
								/>
								<Box className="submit-btn-box">
									<Button className="submit-btn" disabled={!reviewContent || !user._id} onClick={createReviewHandler}>
										Submit Review
									</Button>
								</Box>
							</Stack>
						</Stack>
					</TabPanel>
				</Stack>
			</Stack>
		</div>
	);
};

export default withLayoutBasic(AgentDetail);
