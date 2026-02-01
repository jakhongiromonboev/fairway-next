import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import TrendingProductCard from './TrendingProductCard';
import { Product } from '../../types/product/product';
import { ProductsInquiry } from '../../types/product/product.input';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { useRouter } from 'next/router';

interface TrendingProductsProps {
	initialInput: ProductsInquiry;
}

const TrendingProducts = (props: TrendingProductsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);

	/** APOLLO REQUESTS **/
	const {
		loading: getProductsLoading,
		data: getProductsData,
		error: getProductsError,
		refetch: getProductsRefetch,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTrendingProducts(data?.getProducts?.list);
		},
	});

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
							<span>Trending Products</span>
							<p>Premium equipment for every golfer</p>
						</Box>
						<Box component={'div'} className={'right'}>
							<div className={'more-box'} onClick={handleViewAll}>
								<span>See All Products</span>
								<img src="/img/icons/rightup.svg" alt="" />
							</div>
						</Box>
					</Stack>

					{trendingProducts.length === 0 ? (
						<Box component={'div'} className={'empty-list'}>
							No products available
						</Box>
					) : (
						<>
							<Stack className={'card-box'}>
								<Swiper
									className={'trending-product-swiper'}
									slidesPerView={'auto'}
									spaceBetween={25}
									modules={[Autoplay, Navigation]}
									navigation={{
										nextEl: '.swiper-trending-next',
										prevEl: '.swiper-trending-prev',
									}}
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

							<Stack className={'pagination-box'}>
								<WestIcon className={'swiper-trending-prev'} />
								<EastIcon className={'swiper-trending-next'} />
							</Stack>
						</>
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
		sort: 'productLikes',
		direction: 'DESC',
		search: {},
	},
};

export default TrendingProducts;
