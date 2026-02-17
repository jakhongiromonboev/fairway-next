import React, { useEffect, useState } from 'react';
import { Pagination, Stack, Typography, Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useQuery, useReactiveVar, useMutation } from '@apollo/client';
import { GET_PRODUCTS } from '../../../apollo/user/query';
import { LIKE_TARGET_PRODUCT } from '../../../apollo/user/mutation';
import { T } from '../../types/common';
import { Product } from '../../types/product/product';
import { userVar } from '../../../apollo/store';
import { sweetMixinErrorAlert, sweetTopSmallSuccessAlert } from '../../sweetAlert';
import { Message } from '../../enums/common.enum';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';

const MemberProducts = ({ initialInput }: any) => {
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const { memberId } = router.query;
	const [products, setProducts] = useState<Product[]>([]);
	const [total, setTotal] = useState(0);
	const [searchFilter, setSearchFilter] = useState({
		...initialInput,
		search: { memberId: memberId as string },
	});

	const [likeTargetProduct] = useMutation(LIKE_TARGET_PRODUCT);

	const { refetch } = useQuery(GET_PRODUCTS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchFilter },
		skip: !memberId,
		onCompleted: (data: T) => {
			setProducts(data?.getProducts?.list || []);
			setTotal(data?.getProducts?.metaCounter[0]?.total || 0);
		},
	});

	useEffect(() => {
		if (memberId) {
			setSearchFilter((prev: any) => ({ ...prev, search: { memberId } }));
		}
	}, [memberId]);

	const likeHandler = async (e: any, id: string) => {
		e.stopPropagation();
		try {
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetProduct({ variables: { input: id } });
			await refetch();
			await sweetTopSmallSuccessAlert('Success', 800);
		} catch (err: any) {
			sweetMixinErrorAlert(err.message);
		}
	};

	return (
		<div id="member-products">
			<Stack className="section-header">
				<Typography className="section-title">Products</Typography>
				<Typography className="section-count">{total} items</Typography>
			</Stack>

			{products.length === 0 && (
				<Stack className="no-data">
					<img src="/img/icons/icoAlert.svg" alt="" />
					<Typography>No products found!</Typography>
				</Stack>
			)}

			<Stack className="products-blocks">
				{products.map((product: Product) => {
					const img = product.productImages?.[0] ? `${product.productImages[0]}` : '/img/products/default.webp';
					const isLiked = product?.meLiked?.[0]?.myFavorite;

					return (
						<Stack
							key={product._id}
							className="product-block"
							onClick={() => router.push(`/product/detail?id=${product._id}`)}
						>
							<Box className="block-image">
								<img src={img} alt={product.productName} />
								<Box
									className={`block-like ${isLiked ? 'liked' : ''}`}
									onClick={(e: any) => likeHandler(e, product._id)}
								>
									{isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
									<span>{product.productLikes}</span>
								</Box>
							</Box>

							<Stack className="block-info">
								<Typography className="block-name">{product.productName}</Typography>
								<Typography className="block-meta">
									{product.productCategory}
									{product.productBrand ? ` · ${product.productBrand}` : ''}
								</Typography>
								<Stack className="block-bottom">
									<Typography className="block-price">${product.productPrice?.toLocaleString()}</Typography>
									<Stack className="block-views">
										<VisibilityIcon />
										<span>{product.productViews}</span>
									</Stack>
								</Stack>
							</Stack>
						</Stack>
					);
				})}
			</Stack>

			{total > searchFilter.limit && (
				<Stack className="pagination-config">
					<Pagination
						count={Math.ceil(total / searchFilter.limit)}
						page={searchFilter.page}
						shape="circular"
						color="primary"
						onChange={(e, val) => setSearchFilter({ ...searchFilter, page: val })}
					/>
				</Stack>
			)}
		</div>
	);
};

MemberProducts.defaultProps = {
	initialInput: { page: 1, limit: 6, sort: 'createdAt', direction: 'DESC', search: {} },
};

export default MemberProducts;
