import React from 'react';
import Link from 'next/link';
import {
	TableCell,
	TableHead,
	TableBody,
	TableRow,
	Table,
	TableContainer,
	Button,
	Menu,
	Fade,
	MenuItem,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/material';
import Moment from 'react-moment';
import DeleteIcon from '@mui/icons-material/Delete';
import { Product } from '../../../types/product/product';
import { REACT_APP_API_URL } from '../../../config';
import { ProductStatus } from '../../../enums/product.enum';

const headCells = [
	{ id: 'product', label: 'PRODUCT', numeric: true },
	{ id: 'price', label: 'PRICE', numeric: false },
	{ id: 'category', label: 'CATEGORY', numeric: false },
	{ id: 'agent', label: 'AGENT', numeric: true },
	{ id: 'views', label: 'VIEWS', numeric: false },
	{ id: 'likes', label: 'LIKES', numeric: false },
	{ id: 'created', label: 'CREATED', numeric: true },
	{ id: 'status', label: 'STATUS', numeric: false },
];

const statusClass: Record<string, string> = {
	ACTIVE: 'badge success',
	SOLD: 'badge warning',
	DELETE: 'badge delete',
};

interface ProductPanelListType {
	products: Product[];
	anchorEl: any;
	menuIconClickHandler: any;
	menuIconCloseHandler: any;
	updateProductHandler: any;
	removeProductHandler: any;
}

export const ProductPanelList = (props: ProductPanelListType) => {
	const { products, anchorEl, menuIconClickHandler, menuIconCloseHandler, updateProductHandler, removeProductHandler } =
		props;

	return (
		<Stack>
			<TableContainer>
				<Table sx={{ minWidth: 750 }} size="medium">
					<TableHead>
						<TableRow>
							{headCells.map((cell) => (
								<TableCell key={cell.id} align={cell.numeric ? 'left' : 'center'}>
									{cell.label}
								</TableCell>
							))}
						</TableRow>
					</TableHead>
					<TableBody>
						{products.length === 0 && (
							<TableRow>
								<TableCell align="center" colSpan={8}>
									<span className="no-data">No products found</span>
								</TableCell>
							</TableRow>
						)}
						{products.map((product: Product, index: number) => {
							const productImage = product?.productImages?.[0]
								? `${REACT_APP_API_URL}/${product.productImages[0]}`
								: '/img/banner/shop_hero_main.avif';
							return (
								<TableRow hover key={product._id}>
									<TableCell align="left">
										<Stack direction="row" alignItems="center" gap={1.5}>
											<Avatar variant="rounded" src={productImage} sx={{ width: 44, height: 44 }} />
											<Stack>
												<Link href={`/product/detail?id=${product._id}`}>
													<Typography
														sx={{
															fontSize: 14,
															fontWeight: 600,
															color: '#181a20',
															cursor: 'pointer',
															maxWidth: 200,
															overflow: 'hidden',
															textOverflow: 'ellipsis',
															whiteSpace: 'nowrap',
															'&:hover': { color: '#2d5016' },
														}}
													>
														{product.productName}
													</Typography>
												</Link>
												<Typography sx={{ fontSize: 12, color: '#9ca3af' }}>{product.productBrand}</Typography>
											</Stack>
										</Stack>
									</TableCell>
									<TableCell align="center">${product.productPrice?.toLocaleString()}</TableCell>
									<TableCell align="center">{product.productCategory}</TableCell>
									<TableCell align="left">
										<Stack direction="row" alignItems="center" gap={1}>
											<Avatar
												src={
													product.memberData?.memberImage
														? `${product.memberData.memberImage}`
														: '/img/profile/defaultUser.svg'
												}
												sx={{ width: 28, height: 28 }}
											/>
											<Typography sx={{ fontSize: 13 }}>{product.memberData?.memberNick}</Typography>
										</Stack>
									</TableCell>
									<TableCell align="center">{product.productViews}</TableCell>
									<TableCell align="center">{product.productLikes}</TableCell>
									<TableCell align="left">
										<Moment format="DD.MM.YY">{product.createdAt}</Moment>
									</TableCell>
									<TableCell align="center">
										{product.productStatus === ProductStatus.DELETE ? (
											<Button
												variant="outlined"
												sx={{
													p: '4px',
													minWidth: 0,
													border: 'none',
													color: '#ef4444',
													':hover': { border: '1px solid #ef4444', bgcolor: '#fee2e2' },
												}}
												onClick={() => removeProductHandler(product._id)}
											>
												<DeleteIcon fontSize="small" />
											</Button>
										) : (
											<>
												<Button
													onClick={(e: any) => menuIconClickHandler(e, index)}
													className={statusClass[product.productStatus] ?? 'badge'}
												>
													{product.productStatus}
												</Button>
												<Menu
													anchorEl={anchorEl[index]}
													open={Boolean(anchorEl[index])}
													onClose={menuIconCloseHandler}
													TransitionComponent={Fade}
												>
													{Object.values(ProductStatus)
														.filter((s) => s !== product.productStatus)
														.map((status) => (
															<MenuItem
																key={status}
																onClick={() => updateProductHandler({ _id: product._id, productStatus: status })}
															>
																<Typography variant="subtitle1">{status}</Typography>
															</MenuItem>
														))}
												</Menu>
											</>
										)}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</TableContainer>
		</Stack>
	);
};
