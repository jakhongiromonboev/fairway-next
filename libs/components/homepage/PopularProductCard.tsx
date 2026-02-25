import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Product } from '../../types/product/product';
import { useRouter } from 'next/router';

interface PopularProductCardProps {
	product: Product;
}

const PopularProductCard = (props: PopularProductCardProps) => {
	const { product } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [isHovered, setIsHovered] = useState(false);

	const primaryImage = product?.productImages?.[0];
	const secondaryImage = product?.productImages?.[1] || primaryImage;

	/** HANDLERS **/
	const handleProductClick = () => {
		router.push(`/products/${product._id}`);
	};

	if (device === 'mobile') {
		return (
			<Stack className="popular-product-card-mobile" onClick={handleProductClick}>
				<Box component={'div'} className={'card-img'}>
					<img src={primaryImage} alt={product?.productName} className={'product-image'} />
				</Box>
				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{product?.productName}</strong>
					<p className={'price'}>${product.productPrice}</p>
				</Box>
			</Stack>
		);
	} else {
		return (
			<Stack
				className="popular-product-card"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				onClick={handleProductClick}
			>
				<Box component={'div'} className={'card-img'}>
					<img src={isHovered ? secondaryImage : primaryImage} alt={product?.productName} className={'product-image'} />
				</Box>

				<Box component={'div'} className={'info'}>
					<strong className={'title'}>{product?.productName}</strong>
					<p className={'price'}>${product.productPrice}</p>
				</Box>
			</Stack>
		);
	}
};

export default PopularProductCard;
