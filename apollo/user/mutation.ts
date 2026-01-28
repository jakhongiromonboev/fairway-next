import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const SIGN_UP = gql`
	mutation Signup($input: MemberInput!) {
		signup(input: $input) {
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

export const LOGIN = gql`
	mutation Login($input: LoginInput!) {
		login(input: $input) {
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

export const UPDATE_MEMBER = gql`
	mutation UpdateMember($input: MemberUpdate!) {
		updateMember(input: $input) {
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

export const LIKE_TARGET_MEMBER = gql`
	mutation LikeTargetMember($input: String!) {
		likeTargetMember(memberId: $input) {
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
 *      AGENT STORE       *
 *************************/

export const CREATE_AGENT_STORE = gql`
	mutation CreateAgentStore($input: AgentStoreInput!) {
		createAgentStore(input: $input) {
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

export const UPDATE_AGENT_STORE = gql`
	mutation UpdateAgentStore($input: AgentStoreUpdate!) {
		updateAgentStore(input: $input) {
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

export const CREATE_PRODUCT = gql`
	mutation CreateProduct($input: ProductInput!) {
		createProduct(input: $input) {
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

export const UPDATE_PRODUCT = gql`
	mutation UpdateProduct($input: ProductUpdate!) {
		updateProduct(input: $input) {
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

export const LIKE_TARGET_PRODUCT = gql`
	mutation LikeTargetProduct($input: String!) {
		likeTargetProduct(productId: $input) {
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

export const CREATE_EVENT = gql`
	mutation CreateEvent($input: EventInput!) {
		createEvent(input: $input) {
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

export const UPDATE_EVENT = gql`
	mutation UpdateEvent($input: EventUpdate!) {
		updateEvent(input: $input) {
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

export const LIKE_TARGET_EVENT = gql`
	mutation LikeTargetEvent($input: String!) {
		likeTargetEvent(eventId: $input) {
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
 *   EVENT RESERVATION    *
 *************************/

export const CREATE_EVENT_RESERVATION = gql`
	mutation CreateEventReservation($input: EventReservationInput!) {
		createEventReservation(input: $input) {
			_id
			memberId
			eventId
			participationDate
			numberOfPeople
			reservationStatus
			createdAt
			updatedAt
		}
	}
`;

export const UPDATE_EVENT_RESERVATION = gql`
	mutation UpdateEventReservation($input: EventReservationUpdate!) {
		updateEventReservation(input: $input) {
			_id
			memberId
			eventId
			participationDate
			numberOfPeople
			reservationStatus
			createdAt
			updatedAt
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const CREATE_BOARD_ARTICLE = gql`
	mutation CreateBoardArticle($input: BoardArticleInput!) {
		createBoardArticle(input: $input) {
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

export const UPDATE_BOARD_ARTICLE = gql`
	mutation UpdateBoardArticle($input: BoardArticleUpdate!) {
		updateBoardArticle(input: $input) {
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

export const LIKE_TARGET_BOARD_ARTICLE = gql`
	mutation LikeTargetBoardArticle($input: String!) {
		likeTargetBoardArticle(articleId: $input) {
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

export const CREATE_COMMENT = gql`
	mutation CreateComment($input: CommentInput!) {
		createComment(input: $input) {
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

export const UPDATE_COMMENT = gql`
	mutation UpdateComment($input: CommentUpdate!) {
		updateComment(input: $input) {
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

/**************************
 *         FOLLOW         *
 *************************/

export const SUBSCRIBE = gql`
	mutation Subscribe($input: String!) {
		subscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;

export const UNSUBSCRIBE = gql`
	mutation Unsubscribe($input: String!) {
		unsubscribe(input: $input) {
			_id
			followingId
			followerId
			createdAt
			updatedAt
		}
	}
`;
