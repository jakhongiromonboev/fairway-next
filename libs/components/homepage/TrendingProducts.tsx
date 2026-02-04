import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Mousewheel } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import TrendingProductCard from './TrendingProductCard';
import { Product } from '../../types/product/product';
import { ProductCategory, ProductStatus } from '../../enums/product.enum';
import { useRouter } from 'next/router';

// TODO: Replace with Apollo query - GET_PRODUCTS
// import { useQuery } from '@apollo/client';
// import { GET_PRODUCTS } from '../../../apollo/user/query';

const TrendingProducts = () => {
	const device = useDeviceDetect();
	const router = useRouter();

	// STATIC MOCK DATA - Remove after Apollo integration
	const [trendingProducts] = useState<Product[]>([
		{
			_id: '1',
			productName: 'TaylorMade Stealth 2 Driver',
			productPrice: 599,
			productImages: ['/img/products/default-product.jpg', '/img/products/product-example1.jpg.webp'],
			productCategory: ProductCategory.CLUB,
			productStatus: ProductStatus.ACTIVE,
			productQuantity: 23,
			productSizes: [],
			productRank: 20,
			createdAt: new Date('2026-02-01'),
			updatedAt: new Date('2026-02-01'),
			productBrand: 'TaylorMade',
			productLikes: 245,
		},
		{
			_id: '2',
			productName: 'Titleist T200 Irons Set',
			productPrice: 1299,
			productImages: ['/img/products/default-product.jpg', '/img/products/product-example1.jpg.webp'],
			productCategory: ProductCategory.CLUB,
			productStatus: ProductStatus.ACTIVE,
			productQuantity: 15,
			productSizes: [],
			productRank: 18,
			createdAt: new Date('2026-01-28'),
			updatedAt: new Date('2026-01-28'),
			productBrand: 'Titleist',
			productLikes: 189,
		},
		{
			_id: '3',
			productName: 'Scotty Cameron Special Select',
			productPrice: 449,
			productImages: ['/img/products/default-product.jpg', '/img/products/product-example1.jpg.webp'],
			productCategory: ProductCategory.CLUB,
			productStatus: ProductStatus.ACTIVE,
			productQuantity: 8,
			productSizes: [],
			productRank: 25,
			createdAt: new Date('2026-01-25'),
			updatedAt: new Date('2026-01-25'),
			productBrand: 'Scotty Cameron',
			productLikes: 312,
		},
		{
			_id: '4',
			productName: 'Callaway Rogue ST Fairway',
			productPrice: 329,
			productImages: ['/img/products/default-product.jpg', '/img/products/product-example1.jpg.webp'],
			productCategory: ProductCategory.CLUB,
			productStatus: ProductStatus.ACTIVE,
			productQuantity: 19,
			productSizes: [],
			productRank: 15,
			createdAt: new Date('2026-01-20'),
			updatedAt: new Date('2026-01-20'),
			productBrand: 'Callaway',
			productLikes: 156,
		},
		{
			_id: '5',
			productName: 'Ping Hoofer Stand Bag',
			productPrice: 279,
			productImages: ['/img/products/default-product.jpg', '/img/products/product-example1.jpg.webp'],
			productCategory: ProductCategory.BAG,
			productStatus: ProductStatus.ACTIVE,
			productQuantity: 12,
			productSizes: [],
			productRank: 16,
			createdAt: new Date('2026-01-18'),
			updatedAt: new Date('2026-01-18'),
			productBrand: 'Ping',
			productLikes: 203,
		},
		{
			_id: '6',
			productName: 'FootJoy Pro SL Golf Shoes',
			productPrice: 189,
			productImages: ['/img/products/default-product.jpg', '/img/products/product-example1.jpg.webp'],
			productCategory: ProductCategory.SHOES,
			productStatus: ProductStatus.ACTIVE,
			productQuantity: 28,
			productSizes: ['8', '9', '10', '10.5', '11'],
			productRank: 14,
			createdAt: new Date('2026-01-15'),
			updatedAt: new Date('2026-01-15'),
			productBrand: 'FootJoy',
			productLikes: 167,
		},
	]);

	/** APOLLO REQUESTS **/
	// TODO: Uncomment and configure after backend connection
	// const {
	// 	loading: getProductsLoading,
	// 	data: getProductsData,
	// 	error: getProductsError,
	// 	refetch: getProductsRefetch,
	// } = useQuery(GET_PRODUCTS, {
	// 	fetchPolicy: 'cache-and-network',
	// 	variables: { input: initialInput },
	// 	notifyOnNetworkStatusChange: true,
	// 	onCompleted: (data: T) => {
	// 		setTrendingProducts(data?.getProducts?.list);
	// 	},
	// });

	/** HANDLERS **/
	const handleViewAll = () => {
		router.push('/products');
	};

	if (device === 'mobile') {
		return <div>TRENDING PRODUCTS (MOBILE)</div>;
	} else {
		return (
			<Stack className={'trending-products'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Trending Now</span>
							<p>Premium equipment for every golfer</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<Stack className={'pagination-box'}>
								<WestIcon className={'swiper-trending-prev'} />
								<EastIcon className={'swiper-trending-next'} />
							</Stack>
						</Box>
					</Stack>

					{trendingProducts.length === 0 ? (
						<Box component={'div'} className={'empty-list'}>
							No products available
						</Box>
					) : (
						<Stack className={'card-box'}>
							<Swiper
								className={'trending-product-swiper'}
								slidesPerView={'auto'}
								spaceBetween={25}
								modules={[Autoplay, Navigation, Mousewheel]}
								navigation={{
									nextEl: '.swiper-trending-next',
									prevEl: '.swiper-trending-prev',
								}}
								mousewheel={{
									forceToAxis: true,
									sensitivity: 1,
									releaseOnEdges: true,
								}}
								grabCursor={true}
							>
								{trendingProducts.map((product: Product) => {
									return (
										<SwiperSlide key={product._id} className={'trending-product-slide'}>
											<TrendingProductCard product={product} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						</Stack>
					)}
				</Stack>
			</Stack>
		);
	}
};

TrendingProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 8,
		sort: 'productRank',
		direction: 'DESC',
		search: {},
	},
};

export default TrendingProducts;
