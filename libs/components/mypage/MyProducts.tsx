import React, { useState } from 'react';
import { NextPage } from 'next';
import { Stack, Typography, Box, Pagination } from '@mui/material';
import { useQuery, useMutation, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { GET_AGENT_PRODUCTS } from '../../../apollo/user/query';
import { UPDATE_PRODUCT } from '../../../apollo/user/mutation';
import { userVar } from '../../../apollo/store';
import { Product } from '../../types/product/product';
import { AgentProductsInquiry } from '../../types/product/product.input';
import { ProductStatus } from '../../enums/product.enum';
import { T } from '../../types/common';
import { REACT_APP_API_URL } from '../../config';
import { sweetConfirmAlert, sweetErrorHandling, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import moment from 'moment';

interface MyProductsProps {
	initialInput: AgentProductsInquiry;
}

const MyProducts = ({ initialInput }: MyProductsProps) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [products, setProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFilter, setSearchFilter] = useState<AgentProductsInquiry>({
		...initialInput,
		search: { productStatus: ProductStatus.ACTIVE },
	});

	/** APOLLO REQUEST **/
	const [updateProduct] = useMutation(UPDATE_PRODUCT);

	const {
		loading: getAgentProductsLoading,
		data: getAgentProductsData,
		refetch: getAgentProductsRefetch,
	} = useQuery(GET_AGENT_PRODUCTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setProducts(data?.getAgentProducts?.list || []);
			setTotal(data?.getAgentProducts?.metaCounter[0]?.total || 0);
		},
	});

	/** HANDLERS **/
	const changeStatusHandler = (status: ProductStatus) => {
		setSearchFilter({ ...searchFilter, page: 1, search: { productStatus: status } });
	};

	const updateProductHandler = async (id: string, status: ProductStatus) => {
		try {
			const confirm = await sweetConfirmAlert(status === ProductStatus.SOLD ? 'Mark as sold?' : 'Delete this product?');
			if (!confirm) return;

			await updateProduct({
				variables: {
					input: {
						_id: id,
						productStatus: status,
					},
				},
			});

			await getAgentProductsRefetch({ input: searchFilter });
			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			await sweetErrorHandling(err);
		}
	};

	const editProductHandler = (id: string) => {
		router.push({
			pathname: '/mypage',
			query: { category: 'addProduct', productId: id },
		});
	};

	if (device === 'mobile') {
		return <div>MY PRODUCTS MOBILE</div>;
	}

	return (
		<div id="my-products-page">
			<Stack className="page-header">
				<Stack className="header-left">
					<Typography className="page-title">My Products</Typography>
					<Typography className="page-subtitle">{total} products total</Typography>
				</Stack>
				<Box
					className="add-btn"
					onClick={() => router.push({ pathname: '/mypage', query: { category: 'addProduct' } })}
				>
					+ Add Product
				</Box>
			</Stack>

			<Stack className="status-tabs">
				{[ProductStatus.ACTIVE, ProductStatus.SOLD].map((status) => (
					<Box
						key={status}
						className={`status-tab ${searchFilter.search.productStatus === status ? 'active' : ''}`}
						onClick={() => changeStatusHandler(status)}
					>
						{status}
					</Box>
				))}
			</Stack>

			{products.length === 0 && (
				<Stack className="no-data">
					<img src="/img/icons/icoAlert.svg" alt="" />
					<Typography>No products found!</Typography>
				</Stack>
			)}

			{products.length > 0 && (
				<Stack className="products-grid">
					{products.map((product: Product) => {
						const img = product.productImages?.[0] ? `${product.productImages[0]}` : '/img/banner/hero_shop6.jpg';

						return (
							<Stack key={product._id} className="product-card">
								<Box className="card-image">
									<img src={img} alt={product.productName} />
									<Box className={`card-status ${product.productStatus.toLowerCase()}`}>{product.productStatus}</Box>
								</Box>

								<Stack className="card-info">
									<Typography className="card-name">{product.productName}</Typography>
									<Typography className="card-meta">
										{product.productCategory} · {product.productBrand || 'No brand'}
									</Typography>
									<Stack className="card-bottom">
										<Typography className="card-price">${product.productPrice}</Typography>
										<Stack className="card-stats">
											<Stack className="stat">
												<VisibilityOutlinedIcon />
												<span>{product.productViews ?? 0}</span>
											</Stack>
											<Stack className="stat">
												<FavoriteBorderIcon />
												<span>{product.productLikes ?? 0}</span>
											</Stack>
										</Stack>
									</Stack>
								</Stack>

								<Stack className="card-actions">
									<Box className="action-btn edit" onClick={() => editProductHandler(product._id)}>
										<EditOutlinedIcon />
										<Typography>Edit</Typography>
									</Box>
									{product.productStatus === ProductStatus.ACTIVE && (
										<Box
											className="action-btn sold"
											onClick={() => updateProductHandler(product._id, ProductStatus.SOLD)}
										>
											<Typography>Mark Sold</Typography>
										</Box>
									)}
									<Box
										className="action-btn delete"
										onClick={() => updateProductHandler(product._id, ProductStatus.DELETE)}
									>
										<DeleteOutlineIcon />
									</Box>
								</Stack>
							</Stack>
						);
					})}
				</Stack>
			)}

			{/* PAGINATION */}
			{total > searchFilter.limit && (
				<Stack className="pagination-config">
					<Pagination
						page={searchFilter.page}
						count={Math.ceil(total / searchFilter.limit)}
						shape="circular"
						color="primary"
						onChange={(_e, val) => setSearchFilter({ ...searchFilter, page: val })}
					/>
				</Stack>
			)}
		</div>
	);
};

MyProducts.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: { productStatus: ProductStatus.ACTIVE },
	},
};

export default MyProducts;
