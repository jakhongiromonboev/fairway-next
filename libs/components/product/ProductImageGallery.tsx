import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import { REACT_APP_API_URL } from '../../config';
import useDeviceDetect from '../../hooks/useDeviceDetect';

interface ProductImageGalleryProps {
	images: string[];
	productName: string;
}

const ProductImageGallery = (props: ProductImageGalleryProps) => {
	const { images, productName } = props;
	const device = useDeviceDetect();
	const [selectedImage, setSelectedImage] = useState<number>(0);

	const mainImage = images[selectedImage] ? `${images[selectedImage]}` : '/img/products/default.webp';

	if (device === 'mobile') {
		return <div>IMAGE GALLERY (MOBILE)</div>;
	}

	return (
		<Stack className="product-image-gallery">
			{/* Main Large Image */}
			<Box className="main-image-container">
				<img src={mainImage} alt={productName} className="main-image" />
			</Box>

			{/* Thumbnail Images */}
			{images.length > 1 && (
				<Stack className="thumbnail-container">
					{images.map((image: string, index: number) => {
						const thumbImage = `${image}`;
						return (
							<Box
								key={index}
								className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
								onClick={() => setSelectedImage(index)}
							>
								<img src={thumbImage} alt={`${productName} ${index + 1}`} />
							</Box>
						);
					})}
				</Stack>
			)}
		</Stack>
	);
};

export default ProductImageGallery;
