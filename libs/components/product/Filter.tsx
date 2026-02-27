import React, { useCallback, useEffect, useState } from 'react';
import {
	Stack,
	Typography,
	Checkbox,
	Button,
	OutlinedInput,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Tooltip,
	IconButton,
	Chip,
} from '@mui/material';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { ProductCategory, ProductGender } from '../../enums/product.enum';
import { ProductsInquiry } from '../../types/product/product.input';
import { useRouter } from 'next/router';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import RefreshIcon from '@mui/icons-material/Refresh';

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: '200px',
		},
	},
};

interface FilterProps {
	searchFilter: ProductsInquiry;
	setSearchFilter: any;
	initialInput: ProductsInquiry;
	availableBrands: string[];
}

const productSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const productGenders = Object.values(ProductGender);

const Filter = (props: FilterProps) => {
	const { searchFilter, setSearchFilter, initialInput, availableBrands } = props;
	const device = useDeviceDetect();
	const router = useRouter();
	const [productCategories] = useState<ProductCategory[]>(Object.values(ProductCategory));
	const [searchText, setSearchText] = useState<string>('');
	const [showMoreCategories, setShowMoreCategories] = useState<boolean>(false);
	const showGenderFilter = searchFilter?.search?.categoryList?.some((cat) =>
		[ProductCategory.CLOTHING, ProductCategory.SHOES].includes(cat),
	);

	/** LIFECYCLES **/
	useEffect(() => {
		if (searchFilter?.search?.categoryList?.length === 0) {
			delete searchFilter.search.categoryList;
			updateRouter();
		}
		if (searchFilter?.search?.brandList?.length === 0) {
			delete searchFilter.search.brandList;
			updateRouter();
		}

		if (searchFilter?.search?.genderList?.length === 0) {
			delete searchFilter.search.genderList;
			updateRouter();
		}
		if (searchFilter?.search?.categoryList) setShowMoreCategories(true);
	}, [searchFilter]);

	const updateRouter = () => {
		router.push(`/product?input=${JSON.stringify(searchFilter)}`, `/product?input=${JSON.stringify(searchFilter)}`, {
			scroll: false,
		});
	};

	/** HANDLERS **/
	const categorySelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;

				if (isChecked) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, categoryList: [...(searchFilter?.search?.categoryList || []), value] },
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, categoryList: [...(searchFilter?.search?.categoryList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.categoryList?.includes(value)) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								categoryList: searchFilter?.search?.categoryList?.filter((item: string) => item !== value),
							},
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								categoryList: searchFilter?.search?.categoryList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}
			} catch (err: any) {
				console.log('ERROR, categorySelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const brandSelectHandler = useCallback(
		async (e: any) => {
			try {
				const isChecked = e.target.checked;
				const value = e.target.value;

				if (isChecked) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, brandList: [...(searchFilter?.search?.brandList || []), value] },
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: { ...searchFilter.search, brandList: [...(searchFilter?.search?.brandList || []), value] },
						})}`,
						{ scroll: false },
					);
				} else if (searchFilter?.search?.brandList?.includes(value)) {
					await router.push(
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								brandList: searchFilter?.search?.brandList?.filter((item: string) => item !== value),
							},
						})}`,
						`/product?input=${JSON.stringify({
							...searchFilter,
							search: {
								...searchFilter.search,
								brandList: searchFilter?.search?.brandList?.filter((item: string) => item !== value),
							},
						})}`,
						{ scroll: false },
					);
				}
			} catch (err: any) {
				console.log('ERROR, brandSelectHandler:', err);
			}
		},
		[searchFilter],
	);

	const genderSelectHandler = useCallback(
		async (e: any) => {
			const isChecked = e.target.checked;
			const value = e.target.value;

			if (isChecked) {
				await router.push(
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							genderList: [...(searchFilter.search.genderList || []), value],
						},
					})}`,
					undefined,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							genderList: searchFilter.search.genderList?.filter((g: string) => g !== value),
						},
					})}`,
					undefined,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const priceHandler = useCallback(
		async (value: number, type: string) => {
			if (type === 'start') {
				await router.push(
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, start: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			} else {
				await router.push(
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					`/product?input=${JSON.stringify({
						...searchFilter,
						search: {
							...searchFilter.search,
							pricesRange: { ...searchFilter.search.pricesRange, end: value * 1 },
						},
					})}`,
					{ scroll: false },
				);
			}
		},
		[searchFilter],
	);

	const refreshHandler = async () => {
		try {
			setSearchText('');
			await router.push(
				`/product?input=${JSON.stringify(initialInput)}`,
				`/product?input=${JSON.stringify(initialInput)}`,
				{ scroll: false },
			);
		} catch (err: any) {
			console.log('ERROR, refreshHandler:', err);
		}
	};

	if (device === 'mobile') {
		return <div>PRODUCTS FILTER (MOBILE)</div>;
	} else {
		return (
			<Stack className={'filter-main'}>
				<Stack className={'find-your-product'} mb={'40px'}>
					<Typography className={'title-main'}>Find Your Gear</Typography>
					<Stack className={'input-box'}>
						<OutlinedInput
							value={searchText}
							type={'text'}
							className={'search-input'}
							placeholder={'Search products...'}
							onChange={(e: any) => setSearchText(e.target.value)}
							onKeyDown={(event: any) => {
								if (event.key === 'Enter') {
									setSearchFilter({
										...searchFilter,
										search: { ...searchFilter.search, text: searchText },
									});
								}
							}}
							endAdornment={
								<>
									<CancelRoundedIcon
										onClick={() => {
											setSearchText('');
											setSearchFilter({
												...searchFilter,
												search: { ...searchFilter.search, text: '' },
											});
										}}
									/>
								</>
							}
						/>
						<img src={'/img/icons/search_icon.png'} alt={''} />
						<Tooltip title="Reset Filters">
							<IconButton onClick={refreshHandler}>
								<RefreshIcon />
							</IconButton>
						</Tooltip>
					</Stack>
				</Stack>

				<Stack className={'find-your-product'} mb={'30px'}>
					<Typography className={'title'}>Category</Typography>
					<Stack
						className={`product-categories`}
						style={{ height: showMoreCategories ? 'auto' : '150px' }}
						onMouseEnter={() => setShowMoreCategories(true)}
						onMouseLeave={() => {
							if (!searchFilter?.search?.categoryList) {
								setShowMoreCategories(false);
							}
						}}
					>
						{productCategories.map((category: string) => {
							return (
								<Stack className={'input-box'} key={category}>
									<Checkbox
										id={category}
										className="product-checkbox"
										color="default"
										size="small"
										value={category}
										checked={(searchFilter?.search?.categoryList || []).includes(category as ProductCategory)}
										onChange={categorySelectHandler}
									/>
									<label htmlFor={category} style={{ cursor: 'pointer' }}>
										<Typography className="product-type">{category}</Typography>
									</label>
								</Stack>
							);
						})}
					</Stack>
				</Stack>

				{showGenderFilter && (
					<Stack className={'find-your-product'} mb={'30px'}>
						<Typography className={'title'}>Gender</Typography>
						<Stack className={'product-categories'}>
							{productGenders.map((gender: ProductGender) => (
								<Stack className={'input-box'} key={gender}>
									<Checkbox
										id={gender}
										className="product-checkbox"
										color="default"
										size="small"
										value={gender}
										checked={(searchFilter?.search?.genderList || []).includes(gender)}
										onChange={genderSelectHandler}
									/>
									<label htmlFor={gender} style={{ cursor: 'pointer' }}>
										<Typography className="product-type">{gender}</Typography>
									</label>
								</Stack>
							))}
						</Stack>
					</Stack>
				)}

				{availableBrands && availableBrands.length > 0 && (
					<Stack className={'find-your-product'} mb={'30px'}>
						<Typography className={'title'}>Brand</Typography>
						<Stack className={'brand-list'}>
							{availableBrands.slice(0, 8).map((brand: string) => (
								<Stack className={'input-box'} key={brand}>
									<Checkbox
										id={brand}
										className="product-checkbox"
										color="default"
										size="small"
										value={brand}
										onChange={brandSelectHandler}
										checked={(searchFilter?.search?.brandList || []).includes(brand)}
									/>
									<label htmlFor={brand} style={{ cursor: 'pointer' }}>
										<Typography className="product-type">{brand}</Typography>
									</label>
								</Stack>
							))}
						</Stack>
					</Stack>
				)}

				<Stack className={'find-your-product'}>
					<Typography className={'title'}>Price Range</Typography>
					<Stack className="price-input">
						<input
							type="number"
							placeholder="$ min"
							min={0}
							value={searchFilter?.search?.pricesRange?.start ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									priceHandler(e.target.value, 'start');
								}
							}}
						/>
						<div className="central-divider"></div>
						<input
							type="number"
							placeholder="$ max"
							value={searchFilter?.search?.pricesRange?.end ?? 0}
							onChange={(e: any) => {
								if (e.target.value >= 0) {
									priceHandler(e.target.value, 'end');
								}
							}}
						/>
					</Stack>
				</Stack>
			</Stack>
		);
	}
};

export default Filter;
