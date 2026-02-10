import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const GET_ALL_MEMBERS_BY_ADMIN = gql`
	query GetAllMembersByAdmin($input: MembersInquiry!) {
		getAllMembersByAdmin(input: $input) {
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
			}
			metaCounter {
				total
			}
		}
	}
`;

/**************************
 *        PRODUCT         *
 *************************/

export const GET_ALL_PRODUCTS_BY_ADMIN = gql`
	query GetAllProductsByAdmin($input: AllProductsInquiry!) {
		getAllProductsByAdmin(input: $input) {
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

export const GET_ALL_EVENTS_BY_ADMIN = gql`
	query GetAllEventsByAdmin($input: AllEventsInquiry!) {
		getAllEventsByAdmin(input: $input) {
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

export const GET_ALL_BOARD_ARTICLES_BY_ADMIN = gql`
	query GetAllBoardArticlesByAdmin($input: AllBoardArticlesInquiry!) {
		getAllBoardArticlesByAdmin(input: $input) {
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
