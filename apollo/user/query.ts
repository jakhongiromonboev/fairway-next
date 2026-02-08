import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_AGENTS = gql`
	query GetAgents($input: AgentsInquiry!) {
		getAgents(input: $input) {
			list {
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
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER = gql`
	query GetMember($input: String!) {
		getMember(memberId: $input) {
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
			meFollowed {
				followingId
				followerId
				myFollowing
			}
		}
	}
`;

/**************************
 *        PRODUCT         *
 *************************/

export const GET_PRODUCT = gql`
	query GetProduct($input: String!) {
		getProduct(productId: $input) {
			_id
			productCategory
			productStatus
			productName
			productPrice
			productImages
			productDesc
			productQuantity
			productSizes
			productGender
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
			memberData {
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
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const GET_PRODUCTS = gql`
	query GetProducts($input: ProductsInquiry!) {
		getProducts(input: $input) {
			list {
				_id
				productCategory
				productStatus
				productName
				productPrice
				productImages
				productDesc
				productQuantity
				productSizes
				productGender
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
				memberData {
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
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_AGENT_PRODUCTS = gql`
	query GetAgentProducts($input: AgentProductsInquiry!) {
		getAgentProducts(input: $input) {
			list {
				_id
				productCategory
				productStatus
				productName
				productPrice
				productImages
				productDesc
				productQuantity
				productSizes
				productGender
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
			metaCounter {
				total
			}
		}
	}
`;

export const GET_AVAILABLE_BRANDS = gql`
	query GetAvailableBrands {
		getAvailableBrands
	}
`;

export const GET_FAVORITES = gql`
	query GetFavorites($input: OrdinaryInquiry!) {
		getFavorites(input: $input) {
			list {
				_id
				productCategory
				productStatus
				productName
				productPrice
				productImages
				productDesc
				productQuantity
				productSizes
				productGender
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
				memberData {
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
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_VISITED = gql`
	query GetVisited($input: OrdinaryInquiry!) {
		getVisited(input: $input) {
			list {
				_id
				productCategory
				productStatus
				productName
				productPrice
				productImages
				productDesc
				productQuantity
				productSizes
				productGender
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
				memberData {
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
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         EVENT          *
 *************************/

export const GET_EVENT = gql`
	query GetEvent($input: String!) {
		getEvent(eventId: $input) {
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
			memberData {
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
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const GET_EVENTS = gql`
	query GetEvents($input: EventsInquiry!) {
		getEvents(input: $input) {
			list {
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
				memberData {
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
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_AGENT_EVENTS = gql`
	query GetAgentEvents($input: AgentProductsInquiry!) {
		getAgentEvents(input: $input) {
			list {
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
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *   EVENT RESERVATION    *
 *************************/

export const GET_EVENT_RESERVATION = gql`
	query GetEventReservation($input: String!) {
		getEventReservation(reservationId: $input) {
			_id
			memberId
			eventId
			participationDate
			numberOfPeople
			reservationStatus
			createdAt
			updatedAt
			memberData {
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
			}
			eventData {
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
	}
`;

export const GET_EVENT_RESERVATIONS = gql`
	query GetEventReservations($input: EventReservationsInquiry!) {
		getEventReservations(input: $input) {
			list {
				_id
				memberId
				eventId
				participationDate
				numberOfPeople
				reservationStatus
				createdAt
				updatedAt
				memberData {
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
				}
				eventData {
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
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *      BOARD-ARTICLE     *
 *************************/

export const GET_BOARD_ARTICLE = gql`
	query GetBoardArticle($input: String!) {
		getBoardArticle(articleId: $input) {
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
			memberData {
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
			}
			meLiked {
				memberId
				likeRefId
				myFavorite
			}
		}
	}
`;

export const GET_BOARD_ARTICLES = gql`
	query GetBoardArticles($input: BoardArticlesInquiry!) {
		getBoardArticles(input: $input) {
			list {
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
				memberData {
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
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         COMMENT        *
 *************************/

export const GET_COMMENTS = gql`
	query GetComments($input: CommentsInquiry!) {
		getComments(input: $input) {
			list {
				_id
				commentStatus
				commentGroup
				commentContent
				commentRefId
				memberId
				createdAt
				updatedAt
				memberData {
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
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *         FOLLOW         *
 *************************/

export const GET_MEMBER_FOLLOWERS = gql`
	query GetMemberFollowers($input: FollowInquiry!) {
		getMemberFollowers(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
				followerData {
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
				}
			}
			metaCounter {
				total
			}
		}
	}
`;

export const GET_MEMBER_FOLLOWINGS = gql`
	query GetMemberFollowings($input: FollowInquiry!) {
		getMemberFollowings(input: $input) {
			list {
				_id
				followingId
				followerId
				createdAt
				updatedAt
				followingData {
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
				}
				meLiked {
					memberId
					likeRefId
					myFavorite
				}
				meFollowed {
					followingId
					followerId
					myFollowing
				}
			}
			metaCounter {
				total
			}
		}
	}
`;
