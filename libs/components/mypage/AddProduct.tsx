import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography, Box } from '@mui/material';
import { useMutation, useQuery, useReactiveVar } from '@apollo/client';
import { userVar } from '../../../apollo/store';
import { CREATE_PRODUCT, UPDATE_PRODUCT } from '../../../apollo/user/mutation';
import { GET_PRODUCT } from '../../../apollo/user/query';
import { ProductInput } from '../../types/product/product.input';
import { ProductUpdate } from '../../types/product/product.update';
import { ProductCategory, ProductGender } from '../../enums/product.enum';
import { REACT_APP_API_URL } from '../../config';
import { getJwtToken } from '../../auth';
import { sweetErrorHandling, sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import axios from 'axios';
import { T } from '../../types/common';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import CloseIcon from '@mui/icons-material/Close';

const CATEGORIES = Object.values(ProductCategory);
const GENDERS = Object.values(ProductGender);
const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SHOE_SIZES = ['220', '230', '240', '250', '260', '270', '280', '290'];

const AddProduct = ({ initialValues, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const token = getJwtToken();
	const user = useReactiveVar(userVar);
	const inputRef = useRef<any>(null);
	const productId = router.query?.productId as string;

	const [insertProductData, setInsertProductData] = useState<ProductInput>({
		productCategory: ProductCategory.CLUB,
		productName: '',
		productPrice: 0,
		productImages: [],
		productDesc: '',
		productQuantity: 1,
		productSizes: [],
		productGender: undefined,
		productBrand: '',
	});

	const [loading, setLoading] = useState<boolean>(false);

	/** APOLLO REQUESTS **/
	const [createProduct] = useMutation(CREATE_PRODUCT);
	const [updateProduct] = useMutation(UPDATE_PRODUCT);

	const { loading: getProductLoading, data: getProductData } = useQuery(GET_PRODUCT, {
		fetchPolicy: 'cache-and-network',
		variables: { input: productId },
		skip: !productId,
	});

	/** LIFECYCLES **/
	useEffect(() => {
		if (getProductData?.getProduct) {
			const p = getProductData.getProduct;
			setInsertProductData({
				...insertProductData,
				productCategory: p.productCategory,
				productName: p.productName,
				productPrice: p.productPrice,
				productImages: p.productImages,
				productDesc: p.productDesc || '',
				productQuantity: p.productQuantity,
				productSizes: p.productSizes || [],
				productGender: p.productGender,
				productBrand: p.productBrand || '',
			});
		}
	}, [getProductLoading, getProductData]);

	/** COMPUTED **/
	const needsSizeAndGender =
		insertProductData.productCategory === ProductCategory.CLOTHING ||
		insertProductData.productCategory === ProductCategory.SHOES;

	const isShoes = insertProductData.productCategory === ProductCategory.SHOES;

	const doDisabledCheck = () => {
		if (
			insertProductData.productName === '' ||
			insertProductData.productPrice === 0 ||
			insertProductData.productImages.length === 0
		)
			return true;
		if (needsSizeAndGender) {
			if (!insertProductData.productSizes?.length || !insertProductData.productGender) return true;
		}
		return false;
	};

	/** HANDLERS **/
	const handleCategoryChange = (category: ProductCategory) => {
		setInsertProductData({
			...insertProductData,
			productCategory: category,
			productSizes: [],
			productGender: undefined,
		});
	};

	const handleSizeToggle = (size: string) => {
		const current = insertProductData.productSizes || [];
		const updated = current.includes(size) ? current.filter((s) => s !== size) : [...current, size];
		setInsertProductData({ ...insertProductData, productSizes: updated });
	};

	async function uploadImages() {
		try {
			const formData = new FormData();
			const selectedFiles = inputRef.current.files;

			if (selectedFiles.length === 0) return false;
			if (insertProductData.productImages.length + selectedFiles.length > 5) {
				throw new Error('Maximum 5 images allowed!');
			}

			setLoading(true);

			formData.append(
				'operations',
				JSON.stringify({
					query: `mutation ImagesUploader($files: [Upload!]!, $target: String!) { 
						imagesUploader(files: $files, target: $target)
					}`,
					variables: {
						files: [null, null, null, null, null],
						target: 'product',
					},
				}),
			);
			formData.append(
				'map',
				JSON.stringify({
					'0': ['variables.files.0'],
					'1': ['variables.files.1'],
					'2': ['variables.files.2'],
					'3': ['variables.files.3'],
					'4': ['variables.files.4'],
				}),
			);
			for (const key in selectedFiles) {
				if (/^\d+$/.test(key)) formData.append(`${key}`, selectedFiles[key]);
			}

			const response = await axios.post(`${process.env.REACT_APP_API_GRAPHQL_URL}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					'apollo-require-preflight': true,
					Authorization: `Bearer ${token}`,
				},
			});

			const responseImages: string[] = response.data.data.imagesUploader;
			console.log('+responseImages:', responseImages);

			setInsertProductData({
				...insertProductData,
				productImages: [...insertProductData.productImages, ...responseImages],
			});
		} catch (err: any) {
			console.log('err:', err.message);
			await sweetMixinErrorAlert(err.message);
		} finally {
			setLoading(false);
		}
	}

	const removeImage = (index: number) => {
		const updated = insertProductData.productImages.filter((_: string, i: number) => i !== index);
		setInsertProductData({ ...insertProductData, productImages: updated });
	};

	const insertProductHandler = useCallback(async () => {
		try {
			if (user?.memberType !== 'AGENT') throw new Error('Only agents can create products!');
			await createProduct({ variables: { input: insertProductData } });
			await sweetTopSmallSuccessAlert('Product created!', 800);
			setInsertProductData(initialValues);
			await router.push({ pathname: '/mypage', query: { category: 'myProducts' } });
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	}, [insertProductData]);

	const updateProductHandler = useCallback(async () => {
		try {
			const updateInput: ProductUpdate = {
				_id: productId,
				productName: insertProductData.productName,
				productPrice: insertProductData.productPrice,
				productImages: insertProductData.productImages,
				productDesc: insertProductData.productDesc,
				productQuantity: insertProductData.productQuantity,
				productSizes: insertProductData.productSizes,
				productGender: insertProductData.productGender,
				productBrand: insertProductData.productBrand,
			};
			await updateProduct({ variables: { input: updateInput } });
			await sweetTopSmallSuccessAlert('Product updated!', 800);
			await router.push({ pathname: '/mypage', query: { category: 'myProducts' } });
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	}, [insertProductData]);

	console.log('+insertProductData:', insertProductData);

	if (user?.memberType !== 'AGENT') {
		router.back();
		return null;
	}

	if (device === 'mobile') {
		return <div>ADD PRODUCT MOBILE</div>;
	}

	return (
		<div id="add-product-page">
			{/* HEADER */}
			<Stack className="page-header">
				<Stack className="header-left">
					<Typography className="page-title">{productId ? 'Edit Product' : 'Add Product'}</Typography>
					<Typography className="page-subtitle">
						{productId ? 'Update your product details' : 'List a new product in your store'}
					</Typography>
				</Stack>
			</Stack>

			<Stack className="form-container">
				{/* LEFT — IMAGES */}
				<Stack className="form-left">
					<Typography className="section-title">Product Images</Typography>
					<Typography className="section-hint">Upload up to 5 images. First image is the cover.</Typography>

					<Stack className="image-grid">
						{insertProductData.productImages.map((img: string, index: number) => (
							<Box key={index} className={`image-slot filled ${index === 0 ? 'cover' : ''}`}>
								<img src={img} alt={`product-${index}`} />

								{index === 0 && <Box className="cover-badge">Cover</Box>}
								<Box className="remove-btn" onClick={() => removeImage(index)}>
									<CloseIcon />
								</Box>
							</Box>
						))}
						{insertProductData.productImages.length < 5 && (
							<Box className="image-slot empty" onClick={() => inputRef.current.click()}>
								<AddPhotoAlternateOutlinedIcon />
								<Typography>Add Photo</Typography>
								<input
									ref={inputRef}
									type="file"
									hidden={true}
									onChange={uploadImages}
									multiple={true}
									accept="image/jpg, image/jpeg, image/png"
								/>
							</Box>
						)}
					</Stack>
				</Stack>

				{/* RIGHT — FORM */}
				<Stack className="form-right">
					{/* CATEGORY */}
					<Stack className="form-group">
						<Typography className="form-label">Category</Typography>
						<Stack className="category-grid">
							{CATEGORIES.map((cat) => (
								<Box
									key={cat}
									className={`category-chip ${insertProductData.productCategory === cat ? 'active' : ''}`}
									onClick={() => handleCategoryChange(cat)}
								>
									{cat}
								</Box>
							))}
						</Stack>
					</Stack>

					{/* PRODUCT NAME */}
					<Stack className="form-group">
						<Typography className="form-label">Product Name *</Typography>
						<input
							className="form-input"
							type="text"
							placeholder="e.g. Titleist Pro V1 Golf Balls"
							value={insertProductData.productName}
							onChange={({ target: { value } }) => setInsertProductData({ ...insertProductData, productName: value })}
						/>
					</Stack>

					{/* PRICE + QUANTITY */}
					<Stack className="form-row">
						<Stack className="form-group flex-1">
							<Typography className="form-label">Price (USD) *</Typography>
							<input
								className="form-input"
								type="number"
								placeholder="0"
								min={0}
								value={insertProductData.productPrice || ''}
								onChange={({ target: { value } }) =>
									setInsertProductData({ ...insertProductData, productPrice: parseFloat(value) || 0 })
								}
							/>
						</Stack>
						<Stack className="form-group flex-1">
							<Typography className="form-label">Quantity</Typography>
							<input
								className="form-input"
								type="number"
								placeholder="1"
								min={1}
								value={insertProductData.productQuantity || ''}
								onChange={({ target: { value } }) =>
									setInsertProductData({ ...insertProductData, productQuantity: parseInt(value) || 1 })
								}
							/>
						</Stack>
					</Stack>

					{/* BRAND */}
					<Stack className="form-group">
						<Typography className="form-label">Brand</Typography>
						<input
							className="form-input"
							type="text"
							placeholder="e.g. Titleist, Callaway, TaylorMade"
							value={insertProductData.productBrand || ''}
							onChange={({ target: { value } }) => setInsertProductData({ ...insertProductData, productBrand: value })}
						/>
					</Stack>

					{/* GENDER — only CLOTHING / SHOES */}
					{needsSizeAndGender && (
						<Stack className="form-group">
							<Typography className="form-label">Gender *</Typography>
							<Stack className="chip-row">
								{GENDERS.map((gender) => (
									<Box
										key={gender}
										className={`chip ${insertProductData.productGender === gender ? 'active' : ''}`}
										onClick={() => setInsertProductData({ ...insertProductData, productGender: gender })}
									>
										{gender}
									</Box>
								))}
							</Stack>
						</Stack>
					)}

					{/* SIZES — only CLOTHING / SHOES */}
					{needsSizeAndGender && (
						<Stack className="form-group">
							<Typography className="form-label">{isShoes ? 'Available Sizes (mm) *' : 'Available Sizes *'}</Typography>
							<Stack className="chip-row">
								{(isShoes ? SHOE_SIZES : CLOTHING_SIZES).map((size) => (
									<Box
										key={size}
										className={`chip ${insertProductData.productSizes?.includes(size) ? 'active' : ''}`}
										onClick={() => handleSizeToggle(size)}
									>
										{size}
									</Box>
								))}
							</Stack>
						</Stack>
					)}

					{/* DESCRIPTION */}
					<Stack className="form-group">
						<Typography className="form-label">Description</Typography>
						<textarea
							className="form-textarea"
							placeholder="Describe your product — condition, features, specifications..."
							value={insertProductData.productDesc || ''}
							onChange={({ target: { value } }) => setInsertProductData({ ...insertProductData, productDesc: value })}
						/>
					</Stack>

					{/* SUBMIT */}
					<Box
						className={`submit-btn ${doDisabledCheck() || loading ? 'disabled' : ''}`}
						onClick={
							!doDisabledCheck() && !loading ? (productId ? updateProductHandler : insertProductHandler) : undefined
						}
					>
						{loading ? 'Saving...' : productId ? 'Update Product' : 'Publish Product'}
					</Box>
				</Stack>
			</Stack>
		</div>
	);
};

AddProduct.defaultProps = {
	initialValues: {
		productCategory: ProductCategory.CLUB,
		productName: '',
		productPrice: 0,
		productImages: [],
		productDesc: '',
		productQuantity: 1,
		productSizes: [],
		productGender: undefined,
		productBrand: '',
	},
};

export default AddProduct;
