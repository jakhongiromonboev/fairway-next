import React, { useState, useEffect } from 'react';
import { Stack, Box, Typography, Tabs, Tab, Button, Pagination } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Product } from '../../types/product/product';
import { useRouter } from 'next/router';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { GET_COMMENTS } from '../../../apollo/user/query';
import { CREATE_COMMENT } from '../../../apollo/user/mutation';
import { Comment } from '../../types/comment/comment';
import { CommentGroup } from '../../enums/comment.enum';
import { CommentInput, CommentsInquiry } from '../../types/comment/comment.input';
import { T } from '../../types/common';
import { Direction, Message } from '../../enums/common.enum';
import { userVar } from '../../../apollo/store';
import { sweetErrorHandling } from '../../sweetAlert';
import Review from './Review';

interface ProductTabsProps {
	product: Product;
}

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

const ProductTabs = (props: ProductTabsProps) => {
	const { product } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [tabValue, setTabValue] = useState(0);

	const [productComments, setProductComments] = useState<Comment[]>([]);
	const [commentTotal, setCommentTotal] = useState<number>(0);
	const [commentInquiry, setCommentInquiry] = useState<CommentsInquiry>({
		page: 1,
		limit: 5,
		sort: 'createdAt',
		direction: Direction.DESC,
		search: {
			commentRefId: product._id,
		},
	});
	const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
		commentGroup: CommentGroup.PRODUCT,
		commentContent: '',
		commentRefId: product._id,
	});

	/** APOLLO REQUESTS **/
	const [createComment] = useMutation(CREATE_COMMENT);

	const {
		loading: getCommentsLoading,
		data: getCommentsData,
		error: getCommentsError,
		refetch: getCommentsRefetch,
	} = useQuery(GET_COMMENTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: commentInquiry },
		skip: !commentInquiry.search.commentRefId,
		onCompleted: (data: T) => {
			if (data?.getComments?.list) setProductComments(data?.getComments?.list);
			setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
		},
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (commentInquiry.search.commentRefId) {
			getCommentsRefetch({ input: commentInquiry });
		}
	}, [commentInquiry]);

	/** HANDLERS **/
	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setTabValue(newValue);
	};

	const handleCommentPaginationChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setCommentInquiry({ ...commentInquiry, page: value });
	};

	const createCommentHandler = async () => {
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await createComment({ variables: { input: insertCommentData } });

			setInsertCommentData({ ...insertCommentData, commentContent: '' });
			await getCommentsRefetch({ input: commentInquiry });
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	if (device === 'mobile') {
		return <div>PRODUCT TABS (MOBILE)</div>;
	}

	return (
		<Stack className="product-tabs">
			<Box className="tabs-header">
				<Tabs value={tabValue} onChange={handleTabChange} className="tabs-nav">
					<Tab label="Description" />
					<Tab label="Specifications" />
					<Tab label={`Reviews (${commentTotal})`} />
				</Tabs>
			</Box>

			{/* Description Tab */}
			<TabPanel value={tabValue} index={0}>
				<Stack className="description-content">
					<Typography className="section-title">Product Description</Typography>
					<Typography className="description-text">{product.productDesc || 'No description available.'}</Typography>
				</Stack>
			</TabPanel>

			{/* Specifications Tab */}
			<TabPanel value={tabValue} index={1}>
				<Stack className="specs-content">
					<Typography className="section-title">Specifications</Typography>
					<Stack className="specs-table">
						<Stack className="spec-row">
							<Typography className="spec-label">Category</Typography>
							<Typography className="spec-value">{product.productCategory}</Typography>
						</Stack>
						<Stack className="spec-row">
							<Typography className="spec-label">Brand</Typography>
							<Typography className="spec-value">{product.productBrand || 'N/A'}</Typography>
						</Stack>
						{product.productGender && (
							<Stack className="spec-row">
								<Typography className="spec-label">Gender</Typography>
								<Typography className="spec-value">{product.productGender}</Typography>
							</Stack>
						)}
						{product.productSizes && product.productSizes.length > 0 && (
							<Stack className="spec-row">
								<Typography className="spec-label">Available Sizes</Typography>
								<Typography className="spec-value">{product.productSizes.join(', ')}</Typography>
							</Stack>
						)}
						<Stack className="spec-row">
							<Typography className="spec-label">Stock</Typography>
							<Typography className="spec-value">{product.productQuantity} units</Typography>
						</Stack>
					</Stack>
				</Stack>
			</TabPanel>

			<TabPanel value={tabValue} index={2}>
				<Stack className="reviews-content">
					<Typography className="section-title">Customer Reviews</Typography>

					{commentTotal === 0 ? (
						<Typography className="no-reviews">No reviews yet. Be the first to review this product!</Typography>
					) : (
						<Stack className="reviews-list">
							{productComments.map((comment: Comment) => (
								<Review comment={comment} key={comment._id} />
							))}

							{commentTotal > commentInquiry.limit && (
								<Box className="pagination-box">
									<Pagination
										page={commentInquiry.page}
										count={Math.ceil(commentTotal / commentInquiry.limit)}
										onChange={handleCommentPaginationChange}
										shape="circular"
										color="primary"
									/>
								</Box>
							)}
						</Stack>
					)}

					{/* Leave Review Form */}
					<Stack className="leave-review-section">
						<Typography className="form-title">Leave a Review</Typography>
						<textarea
							className="review-textarea"
							placeholder="Share your experience with this product..."
							value={insertCommentData.commentContent}
							onChange={({ target: { value } }) => {
								setInsertCommentData({ ...insertCommentData, commentContent: value });
							}}
						/>
						<Box className="submit-btn-box">
							<Button
								className="submit-review-btn"
								disabled={insertCommentData.commentContent === '' || !user?._id}
								onClick={createCommentHandler}
							>
								Submit Review
							</Button>
						</Box>
					</Stack>
				</Stack>
			</TabPanel>
		</Stack>
	);
};

export default ProductTabs;
