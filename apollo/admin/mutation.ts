import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const UPDATE_MEMBER_BY_ADMIN = gql`
	mutation UpdateMemberByAdmin($input: MemberUpdate!) {
		updateMemberByAdmin(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberEmail
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			agentStoreName
			agentStoreAddress
			agentStoreLocation
			agentStoreDesc
			agentStoreImage
			memberProducts
			memberEvents
			memberArticles
			memberFollowers
			memberFollowings
			memberLikes
			memberViews
			memberComments
			memberRank
			memberWarnings
			memberBlocks
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

/**************************
 *        PRODUCT         *
 *************************/

export const UPDATE_PRODUCT_BY_ADMIN = gql`
	mutation UpdateProductByAdmin($input: ProductUpdate!) {
		updateProductByAdmin(input: $input) {
			_id
			productCategory
			productStatus
			productName
			productPrice
			productImages
			productDesc
			productQuantity
			productSizes
			productBrand
			productViews
			productLikes
			productComments
			productRank
			memberId
			soldAt
			deletedAt
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_PRODUCT_BY_ADMIN = gql`
	mutation RemoveProductByAdmin($input: String!) {
		removeProductByAdmin(productId: $input) {
			_id
			productCategory
			productStatus
			productName
			productPrice
			productImages
			productDesc
			productQuantity
			productSizes
			productBrand
			productViews
			productLikes
			productComments
			productRank
			memberId
			soldAt
			deletedAt
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         EVENT          *
 *************************/

export const UPDATE_EVENT_BY_ADMIN = gql`
	mutation UpdateEventByAdmin($input: EventUpdate!) {
		updateEventByAdmin(input: $input) {
			_id
			eventType
			eventStatus
			eventTitle
			eventLocation
			eventAddress
			eventDesc
			eventImages
			eventPeriod {
				startDate
				endDate
			}
			eventAvailableDates {
				date
				startTime
				endTime
				capacity
				booked
			}
			eventViews
			eventLikes
			eventComments
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_EVENT_BY_ADMIN = gql`
	mutation RemoveEventByAdmin($input: String!) {
		removeEventByAdmin(eventId: $input) {
			_id
			eventType
			eventStatus
			eventTitle
			eventLocation
			eventAddress
			eventDesc
			eventImages
			eventPeriod {
				startDate
				endDate
			}
			eventAvailableDates {
				date
				startTime
				endTime
				capacity
				booked
			}
			eventViews
			eventLikes
			eventComments
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
		updateBoardArticleByAdmin(input: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			articleComments
			memberId
			createdAt
			updatedAt
		}
	}
`;

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
	mutation RemoveBoardArticleByAdmin($input: String!) {
		removeBoardArticleByAdmin(articleId: $input) {
			_id
			articleCategory
			articleStatus
			articleTitle
			articleContent
			articleImage
			articleViews
			articleLikes
			articleComments
			memberId
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const REMOVE_COMMENT_BY_ADMIN = gql`
	mutation RemoveCommentByAdmin($input: String!) {
		removeCommentByAdmin(commentId: $input) {
			_id
			commentStatus
			commentGroup
			commentContent
			commentRefId
			memberId
			createdAt
			updatedAt
		}
	}
`;
