// ProductCard.tsx - FIXED VERSION
import React, { useState } from 'react';
import { Stack, Typography, IconButton } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Product } from '../../types/product/product';
import { useRouter } from 'next/router';
import { formatterStr } from '../../utils';
import { REACT_APP_API_URL } from '../../config';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';

interface ProductCardProps {
	product: Product;
	likeProductHandler?: any;
	myFavorites?: boolean;
}

const ProductCard = (props: ProductCardProps) => {
	const { product, likeProductHandler, myFavorites } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [isHovered, setIsHovered] = useState(false);

	const primaryImage: string = product?.productImages[0]
		? `${product?.productImages[0]}`
		: '/img/products/default.webp';

	const secondaryImage: string =
		product?.productImages[1] && product?.productImages[1] !== product?.productImages[0]
			? `${product?.productImages[1]}`
			: primaryImage;

	const hasMultipleImages = product?.productImages?.length > 1;

	const handleProductClick = () => {
		router.push({
			pathname: '/product/detail',
			query: { id: product._id },
		});
	};

	if (device === 'mobile') {
		return <div>PRODUCT CARD (MOBILE)</div>;
	} else {
		return (
			<Stack
				className="product-card"
				onMouseEnter={() => hasMultipleImages && setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				<Stack className="image-wrapper" onClick={handleProductClick} style={{ cursor: 'pointer' }}>
					<img src={isHovered ? secondaryImage : primaryImage} alt={product.productName} className="product-image" />

					<Stack className="action-buttons">
						<IconButton
							className="action-btn"
							size="small"
							onClick={(e: any) => {
								e.stopPropagation();
								likeProductHandler && likeProductHandler(user, product?._id);
							}}
						>
							{myFavorites ? (
								<FavoriteIcon fontSize="small" sx={{ color: '#181A20' }} />
							) : product?.meLiked && product?.meLiked[0]?.myFavorite ? (
								<FavoriteIcon fontSize="small" sx={{ color: '#181A20' }} />
							) : (
								<FavoriteBorderIcon fontSize="small" />
							)}
						</IconButton>
					</Stack>
				</Stack>

				<Stack className="product-info">
					<Stack className="product-header">
						{/* Keep text link as is */}
						<Typography className="product-name" onClick={handleProductClick} style={{ cursor: 'pointer' }}>
							{product.productName}
						</Typography>
						{product.productBrand && <Typography className="product-brand">{product.productBrand}</Typography>}
					</Stack>

					<Stack className="product-footer">
						<Typography className="product-price">${formatterStr(product.productPrice)}</Typography>
						<Stack className="product-stats">
							<Stack className="stat-item">
								<RemoveRedEyeIcon sx={{ fontSize: 14, color: '#8F8F8F' }} />
								<Typography className="stat-count">{product.productViews}</Typography>
							</Stack>
							<Stack className="stat-item">
								<FavoriteBorderIcon sx={{ fontSize: 14, color: '#8F8F8F' }} />
								<Typography className="stat-count">{product.productLikes}</Typography>
							</Stack>
						</Stack>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default ProductCard;
