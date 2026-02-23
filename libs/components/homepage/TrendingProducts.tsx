import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Mousewheel } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import TrendingProductCard from './TrendingProductCard';
import { Product } from '../../types/product/product';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import { ProductsInquiry } from '../../types/product/product.input';

interface TrendingProductsProps {
	initialInput: ProductsInquiry;
}

const TrendingProducts = (props: TrendingProductsProps) => {
	const { initialInput } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);

	/** APOLLO **/
	const { loading } = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setTrendingProducts(data?.getProducts?.list ?? []);
		},
	});

	if (device === 'mobile') return <div>TRENDING PRODUCTS (MOBILE)</div>;

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

				{loading ? (
					<Box className={'empty-list'}>Loading...</Box>
				) : trendingProducts.length === 0 ? (
					<Box className={'empty-list'}>No products available</Box>
				) : (
					<Stack className={'card-box'}>
						<Swiper
							className={'trending-product-swiper'}
							slidesPerView={'auto'}
							spaceBetween={24}
							modules={[Autoplay, Navigation, Mousewheel]}
							navigation={{
								nextEl: '.swiper-trending-next',
								prevEl: '.swiper-trending-prev',
							}}
							mousewheel={{ forceToAxis: true, sensitivity: 1, releaseOnEdges: true }}
							grabCursor={true}
						>
							{trendingProducts.map((product: Product) => (
								<SwiperSlide key={product._id} className={'trending-product-slide'}>
									<TrendingProductCard product={product} />
								</SwiperSlide>
							))}
						</Swiper>
					</Stack>
				)}
			</Stack>
		</Stack>
	);
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
