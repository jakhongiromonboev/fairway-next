import React, { useState } from 'react';
import { Stack, Typography, Box, Pagination } from '@mui/material';
import { useQuery, useReactiveVar } from '@apollo/client';
import { useRouter } from 'next/router';
import { GET_VISITED } from '../../../apollo/user/query';
import { userVar } from '../../../apollo/store';
import { Product } from '../../types/product/product';
import { OrdinaryInquiry } from '../../types/product/product.input';
import { T } from '../../types/common';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const MyVisited = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const user = useReactiveVar(userVar);
	const [visited, setVisited] = useState<Product[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [searchFilter, setSearchFilter] = useState<OrdinaryInquiry>(initialInput);

	/** APOLLO **/
	const {
		loading: getVisitedLoading,
		data: getVisitedData,
		refetch: getVisitedRefetch,
	} = useQuery(GET_VISITED, {
		fetchPolicy: 'cache-and-network',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setVisited(data?.getVisitedProducts?.list || []);
			setTotal(data?.getVisitedProducts?.metaCounter[0]?.total || 0);
		},
	});

	/** HANDLERS **/
	const viewProductHandler = (productId: string) => {
		router.push({
			pathname: '/product/detail',
			query: { id: productId },
		});
	};

	if (device === 'mobile') {
		return <div>MY VISITED MOBILE</div>;
	}

	return (
		<div id="my-visited-page">
			<Stack className="page-header">
				<Stack className="header-left">
					<Typography className="page-title">Recently Visited</Typography>
					<Typography className="page-subtitle">{total} products viewed</Typography>
				</Stack>
			</Stack>

			{visited.length === 0 && (
				<Stack className="no-data">
					<img src="/img/icons/icoAlert.svg" alt="" />
					<Typography>No visited products yet!</Typography>
				</Stack>
			)}

			{visited.length > 0 && (
				<Stack className="visited-grid">
					{visited.map((product: Product) => {
						const img = product.productImages?.[0] ? product.productImages[0] : '/img/banner/hero_shop6.jpg';

						return (
							<Stack key={product._id} className="product-card" onClick={() => viewProductHandler(product._id)}>
								<Box className="card-image">
									<img src={img} alt={product.productName} />
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

MyVisited.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
	},
};

export default MyVisited;
