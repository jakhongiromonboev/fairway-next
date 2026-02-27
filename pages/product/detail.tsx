import React, { useState } from 'react';
import { NextPage } from 'next';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import { GET_PRODUCT } from '../../apollo/user/query';
import { LIKE_TARGET_PRODUCT } from '../../apollo/user/mutation';
import { Product } from '../../libs/types/product/product';
import { T } from '../../libs/types/common';
import { Message } from '../../libs/enums/common.enum';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../libs/sweetAlert';

import ProductImageGallery from '../../libs/components/product/ProductImageGallery';
import ProductInfoPanel from '../../libs/components/product/ProductInfoPanel';
import ProductTabs from '../../libs/components/product/ProductTabs';
import RelatedProducts from '../../libs/components/product/RelatedProducts';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const ProductDetail: NextPage = () => {
	const device = useDeviceDetect();
	const router = useRouter();
	const productId = router.query.id as string;
	const [product, setProduct] = useState<Product | null>(null);

	/** APOLLO REQUESTS **/
	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	const {
		loading: getProductLoading,
		data: getProductData,
		error: getProductError,
		refetch: getProductRefetch,
	} = useQuery(GET_PRODUCT, {
		fetchPolicy: 'network-only',
		variables: { input: productId },
		skip: !productId,
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setProduct(data?.getProduct);
		},
	});

	/** HANDLERS **/
	const likeProductHandler = async (user: T, id: string) => {
		try {
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);

			await likeTargetProduct({ variables: { input: id } });
			await getProductRefetch({ input: productId });
			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			console.log('Error: likeProductHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	if (device === 'mobile') {
		return <div>PRODUCT DETAIL (MOBILE)</div>;
	}

	if (getProductLoading) {
		return (
			<div id="product-detail-page">
				<Stack className="container">
					<Box className="loading-state">Loading product...</Box>
				</Stack>
			</div>
		);
	}

	if (getProductError || !product) {
		return (
			<div id="product-detail-page">
				<Stack className="container">
					<Box className="error-state">Product not found</Box>
				</Stack>
			</div>
		);
	}

	return (
		<div id="product-detail-page">
			<Stack className="container">
				<Stack className="product-main">
					<Stack className="gallery-section">
						<ProductImageGallery images={product.productImages} productName={product.productName} />
					</Stack>

					<Stack className="info-section">
						<ProductInfoPanel product={product} likeProductHandler={likeProductHandler} />
					</Stack>
				</Stack>

				<Stack className="tabs-section">
					<ProductTabs product={product} />
				</Stack>

				<Stack className="related-section">
					<RelatedProducts currentProductId={product._id} category={product.productCategory} />
				</Stack>
			</Stack>
		</div>
	);
};

export default withLayoutBasic(ProductDetail);
