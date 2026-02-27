import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import withAdminLayout from '../../../libs/components/layout/LayoutAdmin';
import { ProductPanelList } from '../../../libs/components/admin/products/ProductList';
import { Box, List, ListItem, Stack, Select, MenuItem } from '@mui/material';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { TabContext } from '@mui/lab';
import TablePagination from '@mui/material/TablePagination';
import { AllProductsInquiry } from '../../../libs/types/product/product.input';
import { Product } from '../../../libs/types/product/product';
import { ProductCategory, ProductStatus } from '../../../libs/enums/product.enum';
import { sweetConfirmAlert, sweetErrorHandling } from '../../../libs/sweetAlert';
import { ProductUpdate } from '../../../libs/types/product/product.update';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_PRODUCTS_BY_ADMIN } from '../../../apollo/admin/query';
import { UPDATE_PRODUCT_BY_ADMIN, REMOVE_PRODUCT_BY_ADMIN } from '../../../apollo/admin/mutation';

const AdminProducts: NextPage = ({ initialInquiry, ...props }: any) => {
	const [anchorEl, setAnchorEl] = useState<[] | HTMLElement[]>([]);
	const [productsInquiry, setProductsInquiry] = useState<AllProductsInquiry>(initialInquiry);
	const [products, setProducts] = useState<Product[]>([]);
	const [productsTotal, setProductsTotal] = useState<number>(0);
	const [value, setValue] = useState('ALL');
	const [searchCategory, setSearchCategory] = useState('ALL');

	/** APOLLO REQUESTS **/
	const { refetch } = useQuery(GET_ALL_PRODUCTS_BY_ADMIN, {
		fetchPolicy: 'network-only',
		variables: { input: productsInquiry },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data) => {
			setProducts(data?.getAllProductsByAdmin?.list ?? []);
			setProductsTotal(data?.getAllProductsByAdmin?.metaCounter?.[0]?.total ?? 0);
		},
	});

	const [updateProductByAdmin] = useMutation(UPDATE_PRODUCT_BY_ADMIN);
	const [removeProductByAdmin] = useMutation(REMOVE_PRODUCT_BY_ADMIN);

	/** LIFECYCLES **/
	useEffect(() => {
		refetch({ input: productsInquiry });
	}, [productsInquiry]);

	/** HANDLERS **/
	const changePageHandler = async (event: unknown, newPage: number) => {
		productsInquiry.page = newPage + 1;
		setProductsInquiry({ ...productsInquiry });
	};

	const changeRowsPerPageHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
		productsInquiry.limit = parseInt(event.target.value, 10);
		productsInquiry.page = 1;
		setProductsInquiry({ ...productsInquiry });
	};

	const menuIconClickHandler = (e: any, index: number) => {
		const tempAnchor = anchorEl.slice();
		tempAnchor[index] = e.currentTarget;
		setAnchorEl(tempAnchor);
	};

	const menuIconCloseHandler = () => setAnchorEl([]);

	const tabChangeHandler = async (event: any, newValue: string) => {
		setValue(newValue);
		const inquiry: AllProductsInquiry = { ...productsInquiry, page: 1, sort: 'createdAt' };
		switch (newValue) {
			case 'ACTIVE':
				inquiry.search = { ...inquiry.search, productStatus: ProductStatus.ACTIVE };
				break;
			case 'SOLD':
				inquiry.search = { ...inquiry.search, productStatus: ProductStatus.SOLD };
				break;
			case 'DELETE':
				inquiry.search = { ...inquiry.search, productStatus: ProductStatus.DELETE };
				break;
			default:
				delete inquiry.search?.productStatus;
				break;
		}
		setProductsInquiry(inquiry);
	};

	const categoryHandler = async (newValue: string) => {
		setSearchCategory(newValue);
		if (newValue !== 'ALL') {
			setProductsInquiry({
				...productsInquiry,
				page: 1,
				search: { ...productsInquiry.search, productCategoryList: [newValue as ProductCategory] },
			});
		} else {
			const updated = { ...productsInquiry };
			delete updated?.search?.productCategoryList;
			setProductsInquiry(updated);
		}
	};

	const updateProductHandler = async (updateData: ProductUpdate) => {
		try {
			await updateProductByAdmin({ variables: { input: updateData } });
			menuIconCloseHandler();
			await refetch({ input: productsInquiry });
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	const removeProductHandler = async (id: string) => {
		try {
			if (await sweetConfirmAlert('Are you sure you want to permanently delete this product?')) {
				await removeProductByAdmin({ variables: { input: id } });
				await refetch({ input: productsInquiry });
			}
			menuIconCloseHandler();
		} catch (err: any) {
			sweetErrorHandling(err).then();
		}
	};

	return (
		<Box className={'admin-page-content'}>
			<Stack className={'page-header'}>
				<Typography className={'page-title'}>Product List</Typography>
				<Typography className={'page-count'}>{productsTotal} total products</Typography>
			</Stack>

			<Box className={'admin-table-wrap'}>
				<Box sx={{ width: '100%' }}>
					<TabContext value={value}>
						<Stack className={'tab-header'}>
							<List className={'admin-tab-menu'}>
								{['ALL', 'ACTIVE', 'SOLD', 'DELETE'].map((tab) => (
									<ListItem
										key={tab}
										onClick={(e: any) => tabChangeHandler(e, tab)}
										className={value === tab ? 'tab-item active' : 'tab-item'}
									>
										{tab === 'ALL' ? 'All' : tab.charAt(0) + tab.slice(1).toLowerCase()}
									</ListItem>
								))}
							</List>
						</Stack>
						<Divider />
						<Stack className={'admin-search-area'}>
							<Select
								value={searchCategory}
								className={'admin-select'}
								onChange={(e) => categoryHandler(e.target.value)}
							>
								<MenuItem value={'ALL'}>All Categories</MenuItem>
								{Object.values(ProductCategory).map((cat) => (
									<MenuItem value={cat} key={cat}>
										{cat}
									</MenuItem>
								))}
							</Select>
						</Stack>
						<Divider />

						<ProductPanelList
							products={products}
							anchorEl={anchorEl}
							menuIconClickHandler={menuIconClickHandler}
							menuIconCloseHandler={menuIconCloseHandler}
							updateProductHandler={updateProductHandler}
							removeProductHandler={removeProductHandler}
						/>

						<TablePagination
							rowsPerPageOptions={[10, 20, 40, 60]}
							component="div"
							count={productsTotal}
							rowsPerPage={productsInquiry?.limit}
							page={productsInquiry?.page - 1}
							onPageChange={changePageHandler}
							onRowsPerPageChange={changeRowsPerPageHandler}
						/>
					</TabContext>
				</Box>
			</Box>
		</Box>
	);
};

AdminProducts.defaultProps = {
	initialInquiry: { page: 1, limit: 10, sort: 'createdAt', direction: 'DESC', search: {} },
};

export default withAdminLayout(AdminProducts);
