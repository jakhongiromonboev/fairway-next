import React from 'react';
import { Stack, Box, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Comment } from '../../types/comment/comment';
import { REACT_APP_API_URL } from '../../config';
import moment from 'moment';
import Link from 'next/link';

interface ReviewProps {
	comment: Comment;
}

const Review = (props: ReviewProps) => {
	const { comment } = props;
	const device = useDeviceDetect();

	const memberImage = comment?.memberData?.memberImage
		? `${comment?.memberData?.memberImage}`
		: '/img/profile/defaultUser.svg';

	if (device === 'mobile') {
		return <div>REVIEW (MOBILE)</div>;
	}

	return (
		<Stack className="review-card">
			<Stack className="review-header">
				<Stack className="user-info">
					<Box className="user-avatar">
						<img src={memberImage} alt={comment?.memberData?.memberNick} />
					</Box>
					<Stack className="user-details">
						<Link href={`/member?memberId=${comment?.memberData?._id}`}>
							<Typography className="user-name">{comment?.memberData?.memberNick}</Typography>
						</Link>
						<Typography className="review-date">{moment(comment?.createdAt).format('MMM DD, YYYY')}</Typography>
					</Stack>
				</Stack>
			</Stack>

			<Stack className="review-content">
				<Typography className="review-text">{comment?.commentContent}</Typography>
			</Stack>
		</Stack>
	);
};

export default Review;
