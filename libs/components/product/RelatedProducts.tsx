// libs/components/product/RelatedProducts.tsx
import React, { useState } from 'react';
import { Stack, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Mousewheel } from 'swiper';
import WestIcon from '@mui/icons-material/West';
import EastIcon from '@mui/icons-material/East';
import ProductCard from './ProductCard';
import { Product } from '../../types/product/product';
import { ProductCategory } from '../../enums/product.enum';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { T } from '../../types/common';
import { Message } from '../../enums/common.enum';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';

interface RelatedProductsProps {
	currentProductId: string;
	category: ProductCategory;
}

const RelatedProducts = (props: RelatedProductsProps) => {
	const { currentProductId, category } = props;
	const device = useDeviceDetect();
	const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	const {
		loading: getProductsLoading,
		data: getProductsData,
		error: getProductsError,
		refetch: getProductsRefetch,
	} = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'cache-and-network',
		variables: {
			input: {
				page: 1,
				limit: 8,
				sort: 'productViews',
				direction: 'DESC',
				search: {
					categoryList: [category],
				},
			},
		},
		onCompleted: (data: T) => {
			const filtered = data?.getProducts?.list.filter((product: Product) => product._id !== currentProductId);
			setRelatedProducts(filtered || []);
		},
	});

	/** HANDLERS **/
	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetProduct({ variables: { input: id } });
			await getProductsRefetch();
			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			console.log('Error: likeProductHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return <div>RELATED PRODUCTS (MOBILE)</div>;
	}

	if (relatedProducts.length === 0) {
		return null;
	}

	return (
		<Stack className="related-products">
			<Stack className="section-header">
				<Typography className="section-title">You May Also Like</Typography>
				<Stack className="navigation-buttons">
					<WestIcon className="swiper-related-prev" />
					<EastIcon className="swiper-related-next" />
				</Stack>
			</Stack>

			<Swiper
				className="related-products-swiper"
				slidesPerView={'auto'}
				spaceBetween={24}
				modules={[Autoplay, Navigation, Mousewheel]}
				navigation={{
					nextEl: '.swiper-related-next',
					prevEl: '.swiper-related-prev',
				}}
				mousewheel={{
					forceToAxis: true,
					sensitivity: 1,
					releaseOnEdges: true,
				}}
				grabCursor={true}
			>
				{relatedProducts.map((product: Product) => (
					<SwiperSlide key={product._id} className="related-product-slide">
						<ProductCard product={product} likeProductHandler={likeProductHandler} />
					</SwiperSlide>
				))}
			</Swiper>
		</Stack>
	);
};

export default RelatedProducts;
