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
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { useQuery } from '@apollo/client';
import { T } from '../../types/common';
import { ProductsInquiry } from '../../types/product/product.input';
import PopularProductCard from './PopularProductCard';

interface PopularProductsProps {
	initialInput: ProductsInquiry;
}

// TODO: Replace with Apollo query - GET_PRODUCTS (sort by productViews)
// import { useQuery } from '@apollo/client';
// import { GET_PRODUCTS } from '../../../apollo/user/query';

const PopularProducts = (props: PopularProductsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();

	// STATIC MOCK DATA - Remove after Apollo integration
	const [popularProducts] = useState<Product[]>([
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
			productViews: 222,
		},
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
			productViews: 222,
		},
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
			productViews: 222,
		},
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
			productViews: 222,
		},
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
			productViews: 222,
		},
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
			productViews: 222,
		},
	]);

	/** APOLLO REQUESTS **/
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
	// 		setPopularProducts(data?.getProducts?.list);
	// 	},
	// });

	/** HANDLERS **/
	const handleViewAll = () => {
		router.push('/products');
	};

	if (device === 'mobile') {
		return (
			<Stack className={'popular-products'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Popular Products</span>
							<p>Most viewed by golfers</p>
						</Box>
					</Stack>

					{popularProducts.length === 0 ? (
						<Box component={'div'} className={'empty-list'}>
							No products available
						</Box>
					) : (
						<Stack className={'card-box'}>
							<Swiper
								className={'popular-product-swiper'}
								slidesPerView={'auto'}
								centeredSlides={true}
								spaceBetween={25}
								modules={[Autoplay]}
							>
								{popularProducts.map((product: Product) => {
									return (
										<SwiperSlide key={product._id} className={'popular-product-slide'}>
											<PopularProductCard product={product} />
										</SwiperSlide>
									);
								})}
							</Swiper>
						</Stack>
					)}
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className={'popular-products'}>
				<Stack className={'container'}>
					<Stack className={'info-box'}>
						<Box component={'div'} className={'left'}>
							<span>Popular Products</span>
							<p>Most viewed by golfers</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<Stack className={'pagination-box'}>
								<WestIcon className={'swiper-popular-prev'} />
								<EastIcon className={'swiper-popular-next'} />
							</Stack>
						</Box>
					</Stack>

					{popularProducts.length === 0 ? (
						<Box component={'div'} className={'empty-list'}>
							No products available
						</Box>
					) : (
						<Stack className={'card-box'}>
							<Swiper
								className={'popular-product-swiper'}
								slidesPerView={'auto'}
								spaceBetween={25}
								modules={[Autoplay, Navigation, Mousewheel]}
								navigation={{
									nextEl: '.swiper-popular-next',
									prevEl: '.swiper-popular-prev',
								}}
								mousewheel={{
									forceToAxis: true,
									sensitivity: 1,
									releaseOnEdges: true,
								}}
								grabCursor={true}
							>
								{popularProducts.map((product: Product) => {
									return (
										<SwiperSlide key={product._id} className={'popular-product-slide'}>
											<PopularProductCard product={product} />
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

PopularProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 7,
		sort: 'productViews',
		direction: 'DESC',
		search: {},
	},
};

export default PopularProducts;
