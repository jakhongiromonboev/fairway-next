import { ProductGender, ProductStatus } from '../../enums/product.enum';

export interface ProductUpdate {
	_id: string;
	productStatus?: ProductStatus;
	productName?: string;
	productPrice?: number;
	productImages?: string[];
	productDesc?: string;
	productQuantity?: number;
	productSizes?: string[];
	productGender?: ProductGender;
	productBrand?: string;
	soldAt?: Date;
	deletedAt?: Date;
}
