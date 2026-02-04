import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Product } from '../../types/product/product';
import { REACT_APP_API_URL } from '../../config';
import { useRouter } from 'next/router';

interface PopularProductCardProps {
	product: Product;
}

const PopularProductCard = (props: PopularProductCardProps) => {
	const { product } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [isHovered, setIsHovered] = useState(false);

	// Get primary and secondary images
	// const primaryImage = product?.productImages?.[0]
	// 	? `${REACT_APP_API_URL}/${product.productImages[0]}`
	// 	: '/img/product/default.svg';
	// const secondaryImage = product?.productImages?.[1]
	// 	? `${REACT_APP_API_URL}/${product.productImages[1]}`
	// 	: primaryImage;

	//REMOVE THEN
	const primaryImage = product?.productImages?.[0] || '/img/products/default-product.jpg';
	const secondaryImage = product?.productImages?.[1] || primaryImage;

	/** HANDLERS **/
	const handleProductClick = () => {
		router.push(`/product/${product._id}`);
	};

	if (device === 'mobile') {
		return <div>POPULAR PRODUCT CARD (MOBILE)</div>;
	} else {
		return (
			<Stack
				className="popular-product-card"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				onClick={handleProductClick}
			>
				{/* PRODUCT IMAGE WITH HOVER EFFECT */}
				<Box component={'div'} className={'card-img'}>
					<img src={isHovered ? secondaryImage : primaryImage} alt={product?.productName} className={'product-image'} />
				</Box>

				{/* PRODUCT INFO */}
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{product?.productName}</strong>
					<p className={'price'}>${product.productPrice}</p>
				</Box>
			</Stack>
		);
	}
};

export default PopularProductCard;
