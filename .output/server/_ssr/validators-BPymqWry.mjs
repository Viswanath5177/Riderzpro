import { a as enumType, c as objectType, d as ZodIssueCode, i as coerce, l as recordType, n as arrayType, o as literalType, r as booleanType, s as numberType, t as anyType, u as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/validators-BPymqWry.js
var GST_CHARSET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
/**
* Calculates the 15th checksum character of an Indian GSTIN.
*/
function calculateGstinChecksum(first14) {
	if (first14.length < 14) return "";
	let sum = 0;
	for (let i = 0; i < 14; i++) {
		const char = first14[i].toUpperCase();
		const val = GST_CHARSET.indexOf(char);
		if (val === -1) return "";
		const prod = val * (i % 2 === 0 ? 1 : 2);
		const quotient = Math.floor(prod / 36);
		const remainder = prod % 36;
		sum += quotient + remainder;
	}
	return GST_CHARSET[(36 - sum % 36) % 36];
}
/**
* Validates a 15-character GSTIN format, state code (01-38), and checksum.
*/
function validateGstin(gstin) {
	if (!gstin) return {
		valid: false,
		error: "GSTIN is required"
	};
	const clean = gstin.trim().toUpperCase();
	if (clean.length !== 15) return {
		valid: false,
		error: "GSTIN must be exactly 15 characters"
	};
	if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(clean)) return {
		valid: false,
		error: "Invalid GSTIN format structure"
	};
	const stateCode = parseInt(clean.slice(0, 2), 10);
	if (isNaN(stateCode) || stateCode < 1 || stateCode > 38) return {
		valid: false,
		error: "Invalid state code in GSTIN (must be 01 to 38)"
	};
	const expectedCheckChar = calculateGstinChecksum(clean.slice(0, 14));
	const actualCheckChar = clean[14];
	if (actualCheckChar !== expectedCheckChar) return {
		valid: false,
		error: `Invalid GSTIN checksum character. Expected '${expectedCheckChar}', got '${actualCheckChar}'.`
	};
	return { valid: true };
}
/**
* Derives the 10-character PAN from characters 3 to 12 of a 15-char GSTIN.
*/
function derivePanFromGstin(gstin) {
	if (!gstin || gstin.trim().length < 12) return "";
	return gstin.trim().toUpperCase().slice(2, 12);
}
/**
* Validates 10-character Indian Permanent Account Number (PAN).
*/
function validatePan(pan) {
	if (!pan) return false;
	return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan.trim().toUpperCase());
}
/**
* Validates 11-character Indian Financial System Code (IFSC).
*/
function validateIfsc(ifsc) {
	if (!ifsc) return false;
	return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc.trim().toUpperCase());
}
/**
* Validates 10-digit Indian mobile number.
*/
function validateMobile(mobile) {
	if (!mobile) return false;
	const digits = mobile.replace(/\D/g, "").slice(-10);
	return /^[6-9]\d{9}$/.test(digits);
}
/**
* Validates 6-digit Indian postal pincode.
*/
function validatePincode(pincode) {
	if (!pincode) return false;
	return /^[1-9][0-9]{5}$/.test(pincode.trim());
}
objectType({
	fullName: stringType().min(2, "Full name must be at least 2 characters").max(70),
	businessType: enumType([
		"Individual",
		"Proprietorship",
		"Partnership",
		"Pvt Ltd",
		"LLP",
		"Company"
	]),
	mobile: stringType().refine(validateMobile, "Enter a valid 10-digit Indian mobile number"),
	email: stringType().email("Enter a valid email address"),
	password: stringType().min(8, "Password must be at least 8 characters").regex(/[0-9]/, "Must contain at least one number").regex(/[a-zA-Z]/, "Must contain at least one letter"),
	confirmPassword: stringType(),
	agreedToTerms: booleanType().refine((val) => val === true, "You must agree to the Seller Agreement & Policies")
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords do not match",
	path: ["confirmPassword"]
});
var vendorTaxSchema = objectType({
	gstExempt: booleanType().default(false),
	gstin: stringType().optional(),
	legalName: stringType().min(3, "Legal business name is required"),
	tradeName: stringType().optional(),
	pan: stringType().min(10, "PAN is required").refine(validatePan, "Invalid PAN format"),
	panHolderName: stringType().optional(),
	chargesIgst: booleanType().default(true),
	registeredAddress: stringType().min(10, "Registered address is required"),
	sameAsGstAddress: booleanType().default(true),
	govtIdType: enumType([
		"Voter ID",
		"Driving Licence",
		"Passport"
	]),
	govtIdLast4: stringType().length(4, "Enter exactly last 4 digits/characters of your government ID")
}).superRefine((data, ctx) => {
	if (!data.gstExempt) if (!data.gstin) ctx.addIssue({
		code: ZodIssueCode.custom,
		path: ["gstin"],
		message: "GSTIN is required unless exempt"
	});
	else {
		const check = validateGstin(data.gstin);
		if (!check.valid) ctx.addIssue({
			code: ZodIssueCode.custom,
			path: ["gstin"],
			message: check.error || "Invalid GSTIN"
		});
	}
});
var vendorStoreSchema = objectType({
	storeName: stringType().min(3, "Store display name must be at least 3 characters").max(40, "Store display name must not exceed 40 characters"),
	slug: stringType().min(3).max(50),
	tagline: stringType().max(100, "Tagline maximum 100 characters").optional(),
	description: stringType().max(300, "Short description maximum 300 characters"),
	sellerType: enumType([
		"Manufacturer",
		"Authorised dealer",
		"Distributor",
		"Retailer",
		"Reseller"
	]),
	categories: arrayType(stringType()).min(1, "Select at least one category to sell"),
	brands: arrayType(objectType({
		name: stringType().min(1),
		authType: enumType([
			"Authorised",
			"Own brand",
			"Unbranded"
		])
	})).min(1, "Specify at least one brand"),
	yearsInBusiness: coerce.number().min(0).max(100),
	website: stringType().url("Enter valid website URL").or(literalType("")).optional(),
	instagram: stringType().optional()
});
var vendorShippingSchema = objectType({
	pickupAddress: objectType({
		line1: stringType().min(5, "Address line 1 is required"),
		line2: stringType().optional(),
		landmark: stringType().optional(),
		pincode: stringType().refine(validatePincode, "Enter valid 6-digit pincode"),
		city: stringType().min(2, "City is required"),
		state: stringType().min(2, "State is required"),
		lat: numberType(),
		lng: numberType()
	}),
	contactName: stringType().min(2, "Pickup contact person name is required"),
	contactPhone: stringType().refine(validateMobile, "Enter a valid 10-digit mobile number for dispatch"),
	handlingTimeMins: coerce.number().min(5, "Prep time minimum 5 mins").max(180),
	fulfillmentMode: enumType(["hyperlocal", "courier"]),
	serviceableRadiusKm: coerce.number().min(1).max(50),
	acceptsCod: booleanType().default(false),
	returnWindowDays: coerce.number(),
	returnAddressSameAsPickup: booleanType().default(true),
	sellsLiIon: booleanType().default(false),
	un38_3Declared: booleanType().default(false)
});
var vendorBankSchema = objectType({
	accountHolderName: stringType().min(3, "Account holder name is required"),
	accountNumber: stringType().min(8, "Account number must be at least 8 digits").max(20),
	confirmAccountNumber: stringType(),
	ifsc: stringType().refine(validateIfsc, "Enter valid 11-character IFSC code"),
	accountType: enumType(["Current", "Savings"]),
	upiId: stringType().optional()
}).refine((data) => data.accountNumber === data.confirmAccountNumber, {
	message: "Bank account numbers must match",
	path: ["confirmAccountNumber"]
});
objectType({
	title: stringType().min(5, "Product title must be at least 5 characters").max(120),
	brand: stringType().min(2, "Brand name is required"),
	category: stringType().min(1, "Category is required"),
	subType: stringType().optional(),
	description: stringType().min(20, "Description must be at least 20 characters"),
	richDescription: stringType().optional(),
	sku: stringType().min(3, "SKU must be at least 3 characters").max(30),
	barcode: stringType().optional(),
	hsnCode: stringType().min(4, "HSN code is required").max(8),
	gstRate: coerce.number().refine((r) => [
		5,
		12,
		18,
		28
	].includes(r), "GST rate must be 5%, 12%, 18%, or 28%"),
	mrp: coerce.number().min(1, "MRP must be greater than 0"),
	sellingPrice: coerce.number().min(1, "Selling price must be greater than 0"),
	stock: coerce.number().min(0, "Stock cannot be negative"),
	minStockAlert: coerce.number().min(1, "Min stock alert must be at least 1"),
	condition: enumType(["New", "Refurbished"]),
	partType: enumType([
		"OEM",
		"Genuine",
		"Aftermarket"
	]),
	warrantyMonths: coerce.number().min(0),
	weightKg: coerce.number().min(.01, "Weight must be greater than 0"),
	originCountry: stringType().default("India"),
	manufacturerDetails: stringType().min(3, "Manufacturer details are required"),
	inTheBox: stringType().min(3, "In-the-box contents are required"),
	fits: arrayType(stringType()).default([]),
	fitsAll: booleanType().default(false),
	voltage: coerce.number().optional(),
	capacityAh: coerce.number().optional(),
	chemistry: stringType().optional(),
	specs: recordType(anyType()).default({}),
	imageIds: arrayType(stringType()).min(3, "Upload at least 3 images").max(8, "Maximum 8 images allowed")
});
//#endregion
export { vendorBankSchema as a, vendorTaxSchema as c, validateMobile as i, validateGstin as n, vendorShippingSchema as o, validateIfsc as r, vendorStoreSchema as s, derivePanFromGstin as t };
