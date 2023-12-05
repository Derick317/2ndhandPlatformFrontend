export const TOKEN_KEY = 'token';
export const USERNAME_KEY = 'username'
export const ID_KEY = 'id'
export const BASE_URL = 'http://localhost:8080'
export const BUCKET_NAME = 'around-cdm'
export const TAGS = {
    Books: 1,
    Electronics: 2,
    Others: 3
}

export const APP_NAME = 'DM Sale'

export const ITEM_STATUS = {
    Available: 0,
	SellerModifying: 1,
	OnOrder: 2, // some buyer is about to buy but has not pay for it yet
	Sold: 3,
	Deleted: 4 // deleted by seller
}