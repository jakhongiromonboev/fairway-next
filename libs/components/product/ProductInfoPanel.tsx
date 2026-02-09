import React, { useState } from 'react';
import { Stack, Box, Button, IconButton, Typography } from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Product } from '../../types/product/product';
import { formatterStr } from '../../utils';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ShareIcon from '@mui/icons-material/Share';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useRouter } from 'next/router';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { T } from '../../types/common';

import AgentInfoCard from './AgentInfoCard';
import ContactAgentModal from './ContactAgentModal';

interface ProductInfoPanelProps {
	product: Product;
	likeProductHandler: (user: T, id: string) => void;
}

const ProductInfoPanel = (props: ProductInfoPanelProps) => {
	const { product, likeProductHandler } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [quantity, setQuantity] = useState<number>(1);
	const [selectedSize, setSelectedSize] = useState<string>('');
	const [contactModalOpen, setContactModalOpen] = useState<boolean>(false);

	const hasSize = product.productSizes && product.productSizes.length > 0;

	/** HANDLERS **/
	const handleQuantityChange = (type: 'increase' | 'decrease') => {
		if (type === 'increase' && quantity < product.productQuantity) {
			setQuantity(quantity + 1);
		} else if (type === 'decrease' && quantity > 1) {
			setQuantity(quantity - 1);
		}
	};

	const handleContactAgent = () => {
		setContactModalOpen(true);
	};

	const handleShare = () => {
		if (navigator.share) {
			navigator.share({
				title: product.productName,
				text: `Check out ${product.productName}`,
				url: window.location.href,
			});
		}
	};

	if (device === 'mobile') {
		return <div>PRODUCT INFO PANEL (MOBILE)</div>;
	}

	return (
		<Stack className="product-info-panel">
			{product.productBrand && (
				<Box className="brand-badge">
					<Typography>{product.productBrand}</Typography>
				</Box>
			)}

			<Typography className="product-name">{product.productName}</Typography>

			<Stack className="price-stats-row">
				<Typography className="product-price">${formatterStr(product.productPrice)}</Typography>
				<Stack className="product-stats">
					<Stack className="stat-item">
						<RemoveRedEyeIcon />
						<span>{product.productViews}</span>
					</Stack>
					<Stack className="stat-item">
						<FavoriteBorderIcon />
						<span>{product.productLikes}</span>
					</Stack>
				</Stack>
			</Stack>

			<Box className="category-badge">
				<Typography>{product.productCategory}</Typography>
			</Box>

			{product.productDesc && (
				<Typography className="product-short-desc">{product.productDesc.substring(0, 150)}...</Typography>
			)}

			<Box className="divider" />

			{hasSize && (
				<Stack className="size-selector">
					<Typography className="selector-label">Select Size</Typography>
					<Stack className="size-options">
						{product.productSizes.map((size: string) => (
							<Box
								key={size}
								className={`size-option ${selectedSize === size ? 'active' : ''}`}
								onClick={() => setSelectedSize(size)}
							>
								{size}
							</Box>
						))}
					</Stack>
				</Stack>
			)}

			<Stack className="quantity-selector">
				<Typography className="selector-label">Quantity</Typography>
				<Stack className="quantity-controls">
					<IconButton onClick={() => handleQuantityChange('decrease')} disabled={quantity <= 1}>
						<RemoveIcon />
					</IconButton>
					<Typography className="quantity-value">{quantity}</Typography>
					<IconButton onClick={() => handleQuantityChange('increase')} disabled={quantity >= product.productQuantity}>
						<AddIcon />
					</IconButton>
				</Stack>
				<Typography className="stock-info">{product.productQuantity} available</Typography>
			</Stack>

			<Box className="divider" />

			{product.memberData && <AgentInfoCard agent={product.memberData} />}

			<Box className="divider" />

			<Stack className="action-buttons">
				<Button variant="contained" className="contact-btn" onClick={handleContactAgent}>
					Contact Agent
				</Button>
				<Stack className="icon-buttons">
					<IconButton className="icon-btn" onClick={() => likeProductHandler(user, product._id)}>
						{product?.meLiked && product?.meLiked[0]?.myFavorite ? (
							<FavoriteIcon sx={{ color: '#d4af37' }} />
						) : (
							<FavoriteBorderIcon />
						)}
					</IconButton>
					<IconButton className="icon-btn" onClick={handleShare}>
						<ShareIcon />
					</IconButton>
				</Stack>

				{product.memberData && (
					<ContactAgentModal
						open={contactModalOpen}
						onClose={() => setContactModalOpen(false)}
						agent={product.memberData}
					/>
				)}
			</Stack>
		</Stack>
	);
};

export default ProductInfoPanel;
