import { ProductCategory, ProductGender, ProductStatus } from '../../enums/product.enum';
import { Direction } from '../../enums/common.enum';

export interface ProductInput {
	productCategory: ProductCategory;
	productName: string;
	productPrice: number;
	productImages: string[];
	productDesc?: string;
	productQuantity?: number;
	productSizes?: string[];
	productGender?: ProductGender;
	productBrand?: string;
	memberId?: string;
}

export interface PricesRange {
	start: number;
	end: number;
}

interface PISearch {
	memberId?: string;
	categoryList?: ProductCategory[];
	brandList?: string[];
	genderList?: ProductGender[];
	pricesRange?: PricesRange;
	text?: string;
}

export interface ProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: PISearch;
}

interface APISearch {
	productStatus?: ProductStatus;
}

export interface AgentProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: APISearch;
}

interface ALPISearch {
	productStatus?: ProductStatus;
	productCategoryList?: ProductCategory[];
}

export interface AllProductsInquiry {
	page: number;
	limit: number;
	sort?: string;
	direction?: Direction;
	search: ALPISearch;
}

export interface OrdinaryInquiry {
	page: number;
	limit: number;
}
