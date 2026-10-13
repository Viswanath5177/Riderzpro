import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useVendorStore } from "./vendorStore-jyyPc83P.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/adminStore-CYTUJD7p.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MOCK_ADMIN_BIKES = [
	{
		id: "bike_ather_450x",
		brand: "Ather Energy",
		model: "Ather 450X Gen 3 / Gen 4",
		yearRange: "2022 - 2026",
		voltage: 51.1,
		batteryCapacity: "3.7 kWh",
		connectorType: "Ather Proprietary DC / IEC 62196",
		powerKw: 6.4,
		compatiblePartsCount: 28
	},
	{
		id: "bike_ola_s1pro",
		brand: "Ola Electric",
		model: "Ola S1 Pro Gen 2",
		yearRange: "2023 - 2026",
		voltage: 58.8,
		batteryCapacity: "4.0 kWh",
		connectorType: "Ola FastPort 750W",
		powerKw: 11,
		compatiblePartsCount: 32
	},
	{
		id: "bike_tvs_iqube",
		brand: "TVS Motor",
		model: "TVS iQube ST",
		yearRange: "2022 - 2026",
		voltage: 52,
		batteryCapacity: "5.1 kWh",
		connectorType: "Type 2 AC / 950W Smart Charger",
		powerKw: 4.4,
		compatiblePartsCount: 24
	},
	{
		id: "bike_bajaj_chetak",
		brand: "Bajaj Auto",
		model: "Chetak Premium Edition",
		yearRange: "2021 - 2026",
		voltage: 48,
		batteryCapacity: "3.2 kWh",
		connectorType: "Standard 5A / 15A Home Socket",
		powerKw: 4.2,
		compatiblePartsCount: 22
	},
	{
		id: "bike_hero_vida",
		brand: "Hero MotoCorp",
		model: "Vida V1 Pro",
		yearRange: "2023 - 2026",
		voltage: 51.2,
		batteryCapacity: "3.94 kWh (Dual Swappable)",
		connectorType: "Swappable Modular Tray + DC Fast",
		powerKw: 6,
		compatiblePartsCount: 19
	},
	{
		id: "bike_revolt_rv400",
		brand: "Revolt Motors",
		model: "Revolt RV400 Electric Motorcycle",
		yearRange: "2021 - 2026",
		voltage: 72,
		batteryCapacity: "3.24 kWh",
		connectorType: "Removable Lithium Pack Tray",
		powerKw: 5,
		compatiblePartsCount: 26
	}
];
var MOCK_ADMIN_CUSTOMERS = [
	{
		id: "cust_01",
		name: "Aakash Sharma",
		phone: "+91 98765 43210",
		email: "aakash@riderzpro.com",
		city: "Bengaluru",
		address: "Flat 402, Green Glen Layout, Bellandur",
		pincode: "560103",
		registeredDate: "2026-01-12",
		status: "VIP",
		garageBikes: ["bike_ather_450x"],
		totalOrders: 6,
		totalSpend: 42800
	},
	{
		id: "cust_02",
		name: "Pooja Hegde",
		phone: "+91 98451 22890",
		email: "pooja.hegde@techcorp.in",
		city: "Bengaluru",
		address: "Villa 12, Indiranagar 100ft Road",
		pincode: "560038",
		registeredDate: "2026-01-15",
		status: "Active",
		garageBikes: ["bike_ola_s1pro"],
		totalOrders: 4,
		totalSpend: 28500
	},
	{
		id: "cust_03",
		name: "Karthik Venkat",
		phone: "+91 97412 88301",
		email: "karthik.v@chennaimail.com",
		city: "Chennai",
		address: "7th Cross, Besant Nagar",
		pincode: "600090",
		registeredDate: "2026-01-20",
		status: "Active",
		garageBikes: ["bike_tvs_iqube"],
		totalOrders: 3,
		totalSpend: 15400
	},
	{
		id: "cust_04",
		name: "Rohan Deshmukh",
		phone: "+91 98220 54119",
		email: "rohan.deshmukh@pune.ac.in",
		city: "Pune",
		address: "Plot 88, Viman Nagar",
		pincode: "411014",
		registeredDate: "2026-01-24",
		status: "Active",
		garageBikes: ["bike_bajaj_chetak"],
		totalOrders: 5,
		totalSpend: 31200
	},
	{
		id: "cust_05",
		name: "Sneha Reddy",
		phone: "+91 99890 33412",
		email: "sneha.reddy@hyderabad.net",
		city: "Hyderabad",
		address: "Apt 501, Jubilee Hills Road No. 36",
		pincode: "500033",
		registeredDate: "2026-02-02",
		status: "VIP",
		garageBikes: ["bike_ather_450x", "bike_ola_s1pro"],
		totalOrders: 8,
		totalSpend: 68400
	},
	{
		id: "cust_06",
		name: "Vikram Kulkarni",
		phone: "+91 98201 99241",
		email: "vikram.kulkarni@mumbaimotor.com",
		city: "Mumbai",
		address: "B-204, Powai Vihar Complex, Powai",
		pincode: "400076",
		registeredDate: "2026-02-05",
		status: "Active",
		garageBikes: ["bike_revolt_rv400"],
		totalOrders: 4,
		totalSpend: 39500
	},
	{
		id: "cust_07",
		name: "Arjun Nair",
		phone: "+91 98470 12894",
		email: "arjun.nair@bengaluru.io",
		city: "Bengaluru",
		address: "4th Main, HSR Layout Sector 2",
		pincode: "560102",
		registeredDate: "2026-02-08",
		status: "Active",
		garageBikes: ["bike_hero_vida"],
		totalOrders: 2,
		totalSpend: 11900
	},
	{
		id: "cust_08",
		name: "Divya Iyer",
		phone: "+91 94441 77209",
		email: "divya.iyer@gmail.com",
		city: "Chennai",
		address: "No. 14, T. Nagar South Boag Road",
		pincode: "600017",
		registeredDate: "2026-02-12",
		status: "Active",
		garageBikes: ["bike_tvs_iqube"],
		totalOrders: 3,
		totalSpend: 18200
	},
	{
		id: "cust_09",
		name: "Sameer Joshi",
		phone: "+91 98901 44521",
		email: "sameer.joshi@kothrud.in",
		city: "Pune",
		address: "12, Mayur Colony, Kothrud",
		pincode: "411038",
		registeredDate: "2026-02-15",
		status: "Active",
		garageBikes: ["bike_bajaj_chetak"],
		totalOrders: 4,
		totalSpend: 24600
	},
	{
		id: "cust_10",
		name: "Ananya Rao",
		phone: "+91 97011 88492",
		email: "ananya.rao@gachibowli.org",
		city: "Hyderabad",
		address: "Cyber Towers Colony, Madhapur",
		pincode: "500081",
		registeredDate: "2026-02-19",
		status: "Active",
		garageBikes: ["bike_ather_450x"],
		totalOrders: 3,
		totalSpend: 21e3
	},
	{
		id: "cust_11",
		name: "Manish Agarwal",
		phone: "+91 98330 66190",
		email: "manish.agarwal@bandra.com",
		city: "Mumbai",
		address: "Sea Mist, Bandra West, Carter Road",
		pincode: "400050",
		registeredDate: "2026-02-22",
		status: "VIP",
		garageBikes: ["bike_ola_s1pro"],
		totalOrders: 7,
		totalSpend: 54900
	},
	{
		id: "cust_12",
		name: "Rahul Nambiar",
		phone: "+91 98860 33819",
		email: "rahul.nambiar@whitefield.in",
		city: "Bengaluru",
		address: "Sobha Rose, ECC Road, Whitefield",
		pincode: "560066",
		registeredDate: "2026-02-25",
		status: "Active",
		garageBikes: ["bike_revolt_rv400"],
		totalOrders: 5,
		totalSpend: 47200
	},
	{
		id: "cust_13",
		name: "Shweta Pillai",
		phone: "+91 98410 55198",
		email: "shweta.pillai@adyar.com",
		city: "Chennai",
		address: "Gandhi Nagar 3rd Main, Adyar",
		pincode: "600020",
		registeredDate: "2026-03-01",
		status: "Blocked",
		garageBikes: ["bike_tvs_iqube"],
		totalOrders: 1,
		totalSpend: 4200
	},
	{
		id: "cust_14",
		name: "Amit Patil",
		phone: "+91 98230 44109",
		email: "amit.patil@wakad.in",
		city: "Pune",
		address: "Dange Chowk Road, Wakad",
		pincode: "411057",
		registeredDate: "2026-03-04",
		status: "Active",
		garageBikes: ["bike_bajaj_chetak"],
		totalOrders: 2,
		totalSpend: 16800
	},
	{
		id: "cust_15",
		name: "Harish Varma",
		phone: "+91 98490 22194",
		email: "harish.varma@kondapur.org",
		city: "Hyderabad",
		address: "Botanical Garden Road, Kondapur",
		pincode: "500084",
		registeredDate: "2026-03-08",
		status: "Active",
		garageBikes: ["bike_hero_vida"],
		totalOrders: 3,
		totalSpend: 19500
	},
	{
		id: "cust_16",
		name: "Kavita Shah",
		phone: "+91 98190 77301",
		email: "kavita.shah@andheri.net",
		city: "Mumbai",
		address: "Lokhandwala Complex, Andheri West",
		pincode: "400053",
		registeredDate: "2026-03-11",
		status: "Active",
		garageBikes: ["bike_ather_450x"],
		totalOrders: 4,
		totalSpend: 33400
	},
	{
		id: "cust_17",
		name: "Naveen Prasad",
		phone: "+91 99001 22894",
		email: "naveen.prasad@koramangala.in",
		city: "Bengaluru",
		address: "5th Block, Koramangala 80ft Road",
		pincode: "560095",
		registeredDate: "2026-03-14",
		status: "VIP",
		garageBikes: ["bike_ola_s1pro"],
		totalOrders: 6,
		totalSpend: 49800
	},
	{
		id: "cust_18",
		name: "Meenakshi Sundaram",
		phone: "+91 98400 88201",
		email: "meenakshi.s@anna.edu.in",
		city: "Chennai",
		address: "Anna Nagar West Extension",
		pincode: "600101",
		registeredDate: "2026-03-17",
		status: "Active",
		garageBikes: ["bike_tvs_iqube"],
		totalOrders: 3,
		totalSpend: 22100
	},
	{
		id: "cust_19",
		name: "Saurabh Shinde",
		phone: "+91 98600 33910",
		email: "saurabh.shinde@baner.com",
		city: "Pune",
		address: "Pancard Club Road, Baner",
		pincode: "411045",
		registeredDate: "2026-03-20",
		status: "Active",
		garageBikes: ["bike_revolt_rv400"],
		totalOrders: 2,
		totalSpend: 14500
	},
	{
		id: "cust_20",
		name: "Deepika Chintalapati",
		phone: "+91 98480 66291",
		email: "deepika.c@hitec.city",
		city: "Hyderabad",
		address: "Mindspace Road, HITEC City",
		pincode: "500081",
		registeredDate: "2026-03-22",
		status: "Active",
		garageBikes: ["bike_ather_450x"],
		totalOrders: 4,
		totalSpend: 27900
	},
	{
		id: "cust_21",
		name: "Pranav Mhatre",
		phone: "+91 98210 55890",
		email: "pranav.mhatre@thane.org",
		city: "Mumbai",
		address: "Ghodbunder Road, Thane West",
		pincode: "400615",
		registeredDate: "2026-03-25",
		status: "Active",
		garageBikes: ["bike_bajaj_chetak"],
		totalOrders: 3,
		totalSpend: 18900
	},
	{
		id: "cust_22",
		name: "Bhavana Gowda",
		phone: "+91 97310 99401",
		email: "bhavana.gowda@jpnagar.in",
		city: "Bengaluru",
		address: "6th Phase, JP Nagar 15th Cross",
		pincode: "560078",
		registeredDate: "2026-03-28",
		status: "Active",
		garageBikes: ["bike_hero_vida"],
		totalOrders: 2,
		totalSpend: 12400
	},
	{
		id: "cust_23",
		name: "Senthil Nathan",
		phone: "+91 94450 11982",
		email: "senthil.n@velachery.com",
		city: "Chennai",
		address: "Velachery Main Road, Dhandeeswaram",
		pincode: "600042",
		registeredDate: "2026-03-30",
		status: "Active",
		garageBikes: ["bike_ola_s1pro"],
		totalOrders: 3,
		totalSpend: 24700
	},
	{
		id: "cust_24",
		name: "Tanvi Kulkarni",
		phone: "+91 98221 77392",
		email: "tanvi.kulkarni@hinjewadi.org",
		city: "Pune",
		address: "Phase 1 Blue Ridge, Hinjewadi",
		pincode: "411057",
		registeredDate: "2026-04-02",
		status: "Active",
		garageBikes: ["bike_ather_450x"],
		totalOrders: 2,
		totalSpend: 15800
	},
	{
		id: "cust_25",
		name: "Girish Murthy",
		phone: "+91 98450 44201",
		email: "girish.murthy@malleshwaram.in",
		city: "Bengaluru",
		address: "Margosa Road 8th Cross, Malleshwaram",
		pincode: "560003",
		registeredDate: "2026-04-04",
		status: "VIP",
		garageBikes: ["bike_tvs_iqube", "bike_ather_450x"],
		totalOrders: 6,
		totalSpend: 52100
	},
	{
		id: "cust_26",
		name: "Ritu Singhania",
		phone: "+91 98202 33819",
		email: "ritu.singhania@juhu.com",
		city: "Mumbai",
		address: "Gulmohar Road, Juhu Scheme",
		pincode: "400049",
		registeredDate: "2026-04-06",
		status: "Active",
		garageBikes: ["bike_ola_s1pro"],
		totalOrders: 4,
		totalSpend: 31500
	},
	{
		id: "cust_27",
		name: "Venkatesh Babu",
		phone: "+91 98492 88102",
		email: "venkatesh.babu@begumpet.org",
		city: "Hyderabad",
		address: "Prakash Nagar, Begumpet",
		pincode: "500016",
		registeredDate: "2026-04-08",
		status: "Active",
		garageBikes: ["bike_bajaj_chetak"],
		totalOrders: 2,
		totalSpend: 13200
	},
	{
		id: "cust_28",
		name: "Akshay Gaikwad",
		phone: "+91 98501 22904",
		email: "akshay.g@hadapsar.in",
		city: "Pune",
		address: "Magarpatta City Cosmos, Hadapsar",
		pincode: "411028",
		registeredDate: "2026-04-10",
		status: "Active",
		garageBikes: ["bike_revolt_rv400"],
		totalOrders: 3,
		totalSpend: 26400
	},
	{
		id: "cust_29",
		name: "Lakshmi Raman",
		phone: "+91 94442 66301",
		email: "lakshmi.raman@mylapore.com",
		city: "Chennai",
		address: "Luz Church Road, Mylapore",
		pincode: "600004",
		registeredDate: "2026-04-12",
		status: "Active",
		garageBikes: ["bike_hero_vida"],
		totalOrders: 1,
		totalSpend: 7800
	},
	{
		id: "cust_30",
		name: "Sanjay Bangera",
		phone: "+91 98801 77290",
		email: "sanjay.bangera@indiranagar.io",
		city: "Bengaluru",
		address: "HAL 2nd Stage, Doopanahalli",
		pincode: "560008",
		registeredDate: "2026-04-14",
		status: "Active",
		garageBikes: ["bike_ola_s1pro"],
		totalOrders: 2,
		totalSpend: 16400
	}
];
var MOCK_ADMIN_SELLERS = [
	{
		id: "seller_01",
		businessName: "ElectroDrive Spares Bengaluru",
		ownerName: "Ganesh Hegde",
		phone: "+91 98450 11200",
		email: "spares@electrodrive.in",
		city: "Bengaluru",
		gstin: "29AABCE1234F1Z5",
		kycStatus: "Approved",
		commissionRate: 10.5,
		rating: 4.85,
		totalSales: 1845e3,
		activeProductsCount: 14,
		bankAccount: "HDFC0001245 - A/C 502000881920",
		joinedDate: "2025-11-10"
	},
	{
		id: "seller_02",
		businessName: "Bharat EV Hub & Batteries",
		ownerName: "Rajeev Agarwal",
		phone: "+91 98200 88310",
		email: "orders@bharatevhub.com",
		city: "Mumbai",
		gstin: "27AAACB9876K1ZQ",
		kycStatus: "Approved",
		commissionRate: 11,
		rating: 4.9,
		totalSales: 242e4,
		activeProductsCount: 16,
		bankAccount: "ICIC0000042 - A/C 004205011894",
		joinedDate: "2025-10-15"
	},
	{
		id: "seller_03",
		businessName: "Deccan Battery Labs & Electronics",
		ownerName: "Srinivas Rao",
		phone: "+91 98490 55102",
		email: "contact@deccanbatteries.org",
		city: "Hyderabad",
		gstin: "36AABFD4412M1Z8",
		kycStatus: "Approved",
		commissionRate: 9.5,
		rating: 4.75,
		totalSales: 168e4,
		activeProductsCount: 12,
		bankAccount: "SBIN0004128 - A/C 38192004812",
		joinedDate: "2025-12-01"
	},
	{
		id: "seller_04",
		businessName: "Zenith Moto Accessories",
		ownerName: "Farhan Khan",
		phone: "+91 98220 99401",
		email: "sales@zenithmoto.in",
		city: "Pune",
		gstin: "27AABFZ6610P1Z2",
		kycStatus: "Approved",
		commissionRate: 12,
		rating: 4.68,
		totalSales: 94e4,
		activeProductsCount: 8,
		bankAccount: "KKBK0000681 - A/C 9811029481",
		joinedDate: "2026-01-05"
	},
	{
		id: "seller_05",
		businessName: "Southern Apex EV Chargers",
		ownerName: "K. Murugan",
		phone: "+91 94440 33812",
		email: "support@apexcables.com",
		city: "Chennai",
		gstin: "33AABCS7712N1Z4",
		kycStatus: "Approved",
		commissionRate: 10,
		rating: 4.82,
		totalSales: 112e4,
		activeProductsCount: 9,
		bankAccount: "AXIS0000182 - A/C 914020084120",
		joinedDate: "2026-01-18"
	},
	{
		id: "seller_06",
		businessName: "GreenPulse EV Motors & Controllers",
		ownerName: "Nitin Shinde",
		phone: "+91 98600 22104",
		email: "nitin@greenpulse.in",
		city: "Pune",
		gstin: "27AABCG5521H1Z9",
		kycStatus: "Approved",
		commissionRate: 11.5,
		rating: 4.62,
		totalSales: 78e4,
		activeProductsCount: 6,
		bankAccount: "BARB0VIMANX - A/C 2819010008412",
		joinedDate: "2026-02-01"
	},
	{
		id: "seller_07",
		businessName: "VoltMaster FastCharge Systems",
		ownerName: "Deepak Choudhary",
		phone: "+91 98800 66401",
		email: "voltmaster@gmail.com",
		city: "Bengaluru",
		gstin: "29AABCX8819Q1Z7",
		kycStatus: "Approved",
		commissionRate: 10,
		rating: 4.79,
		totalSales: 141e4,
		activeProductsCount: 11,
		bankAccount: "YESB0000214 - A/C 021484100098",
		joinedDate: "2026-02-10"
	},
	{
		id: "seller_08",
		businessName: "RideSafe Premium Helmets & Armor",
		ownerName: "Rohit Kapur",
		phone: "+91 98205 11984",
		email: "contact@ridesafe.co.in",
		city: "Mumbai",
		gstin: "27AABCR3391J1Z3",
		kycStatus: "Approved",
		commissionRate: 12.5,
		rating: 4.92,
		totalSales: 125e4,
		activeProductsCount: 7,
		bankAccount: "HDFC0000019 - A/C 502000194812",
		joinedDate: "2026-02-15"
	},
	{
		id: "seller_09",
		businessName: "Kavach EV Brakes & Alloys",
		ownerName: "M. Ramanathan",
		phone: "+91 94451 88204",
		email: "sales@kavachbrakes.in",
		city: "Chennai",
		gstin: "33AABCK1192L1Z5",
		kycStatus: "Approved",
		commissionRate: 10,
		rating: 4.71,
		totalSales: 68e4,
		activeProductsCount: 5,
		bankAccount: "IOBA0000412 - A/C 0412010000984",
		joinedDate: "2026-02-28"
	},
	{
		id: "seller_10",
		businessName: "Telangana Smart Telematics & BMS",
		ownerName: "Pradeep Reddy",
		phone: "+91 99891 44209",
		email: "pradeep@t-smartbms.com",
		city: "Hyderabad",
		gstin: "36AABCT9981F1Z1",
		kycStatus: "Pending",
		commissionRate: 10,
		rating: 4.5,
		totalSales: 0,
		activeProductsCount: 0,
		bankAccount: "ICIC0000189 - A/C 018905001289",
		joinedDate: "2026-04-01"
	},
	{
		id: "seller_11",
		businessName: "NeoRide Precision Belt Drives",
		ownerName: "Amol Deshpande",
		phone: "+91 98229 33019",
		email: "amol@neoride.in",
		city: "Pune",
		gstin: "27AABCN8841D1Z6",
		kycStatus: "Pending",
		commissionRate: 10,
		rating: 4.5,
		totalSales: 0,
		activeProductsCount: 0,
		bankAccount: "MAHB0000184 - A/C 60192841029",
		joinedDate: "2026-04-05"
	},
	{
		id: "seller_12",
		businessName: "Apex Torque EV Retrofit Lab",
		ownerName: "Sunil Khatri",
		phone: "+91 98331 44920",
		email: "sunil@apextorque.com",
		city: "Mumbai",
		gstin: "27AABCA7719B1Z0",
		kycStatus: "Rejected",
		rejectionReason: "GSTIN registration document mismatch with trade license certificate.",
		commissionRate: 12,
		rating: 3.8,
		totalSales: 0,
		activeProductsCount: 0,
		bankAccount: "UBIN0532189 - A/C 321890100084",
		joinedDate: "2026-03-20"
	}
];
var MOCK_ADMIN_RIDERS = [
	{
		id: "rider_01",
		name: "Ramesh Kumar",
		phone: "+91 98450 19284",
		city: "Bengaluru",
		zone: "Indiranagar Hub",
		lat: 12.9719,
		lng: 77.6412,
		status: "Delivering",
		batteryPct: 82,
		rating: 4.92,
		completedDeliveries: 418,
		todayEarnings: 1450,
		vehicle: "Ather 450X (KA-03-JJ-4921)",
		documentsVerified: true,
		activeOrderId: "ord_101"
	},
	{
		id: "rider_02",
		name: "Suresh Gowda",
		phone: "+91 98801 88201",
		city: "Bengaluru",
		zone: "Koramangala 5th Block",
		lat: 12.9352,
		lng: 77.6245,
		status: "Delivering",
		batteryPct: 68,
		rating: 4.88,
		completedDeliveries: 390,
		todayEarnings: 1280,
		vehicle: "Ola S1 Pro (KA-01-EL-8812)",
		documentsVerified: true,
		activeOrderId: "ord_102"
	},
	{
		id: "rider_03",
		name: "Praveen Teja",
		phone: "+91 97410 44102",
		city: "Bengaluru",
		zone: "HSR Layout Sector 2",
		lat: 12.9116,
		lng: 77.6389,
		status: "Online",
		batteryPct: 94,
		rating: 4.95,
		completedDeliveries: 512,
		todayEarnings: 1820,
		vehicle: "TVS iQube (KA-05-MH-1920)",
		documentsVerified: true
	},
	{
		id: "rider_04",
		name: "Anand Shettigar",
		phone: "+91 99002 77192",
		city: "Bengaluru",
		zone: "Whitefield ITPL",
		lat: 12.9854,
		lng: 77.7291,
		status: "Delivering",
		batteryPct: 54,
		rating: 4.81,
		completedDeliveries: 284,
		todayEarnings: 940,
		vehicle: "Ather 450X (KA-53-EN-3391)",
		documentsVerified: true,
		activeOrderId: "ord_104"
	},
	{
		id: "rider_05",
		name: "Manjunath V.",
		phone: "+91 98455 33810",
		city: "Bengaluru",
		zone: "Bellandur Outer Ring Road",
		lat: 12.9304,
		lng: 77.6784,
		status: "Online",
		batteryPct: 76,
		rating: 4.89,
		completedDeliveries: 365,
		todayEarnings: 1100,
		vehicle: "Bajaj Chetak (KA-04-EV-7712)",
		documentsVerified: true
	},
	{
		id: "rider_06",
		name: "Kiran Patil",
		phone: "+91 98230 88194",
		city: "Pune",
		zone: "Viman Nagar Airport Road",
		lat: 18.5679,
		lng: 73.9143,
		status: "Online",
		batteryPct: 88,
		rating: 4.84,
		completedDeliveries: 310,
		todayEarnings: 980,
		vehicle: "Ather 450X (MH-12-QX-4819)",
		documentsVerified: true
	},
	{
		id: "rider_07",
		name: "Syed Imran",
		phone: "+91 99890 11982",
		city: "Hyderabad",
		zone: "HITEC City / Madhapur",
		lat: 17.4483,
		lng: 78.3915,
		status: "Delivering",
		batteryPct: 61,
		rating: 4.9,
		completedDeliveries: 440,
		todayEarnings: 1390,
		vehicle: "Ola S1 Pro (TS-09-EV-8821)",
		documentsVerified: true,
		activeOrderId: "ord_105"
	},
	{
		id: "rider_08",
		name: "K. Vignesh",
		phone: "+91 94441 55920",
		city: "Chennai",
		zone: "Besant Nagar / Adyar",
		lat: 13.0002,
		lng: 78.2671,
		status: "Online",
		batteryPct: 85,
		rating: 4.86,
		completedDeliveries: 325,
		todayEarnings: 1040,
		vehicle: "TVS iQube (TN-07-EV-1948)",
		documentsVerified: true
	},
	{
		id: "rider_09",
		name: "Santosh More",
		phone: "+91 98204 33819",
		city: "Mumbai",
		zone: "Powai / Kanjurmarg",
		lat: 19.1176,
		lng: 72.906,
		status: "Online",
		batteryPct: 79,
		rating: 4.78,
		completedDeliveries: 298,
		todayEarnings: 890,
		vehicle: "Revolt RV400 (MH-03-EV-5510)",
		documentsVerified: true
	},
	{
		id: "rider_10",
		name: "Chethan Reddy",
		phone: "+91 98860 99401",
		city: "Bengaluru",
		zone: "Electronic City Phase 1",
		lat: 12.8452,
		lng: 77.6602,
		status: "Delivering",
		batteryPct: 73,
		rating: 4.93,
		completedDeliveries: 480,
		todayEarnings: 1650,
		vehicle: "Ather 450X (KA-51-EV-2219)",
		documentsVerified: true,
		activeOrderId: "ord_107"
	},
	{
		id: "rider_11",
		name: "Lokesh Naidu",
		phone: "+91 97011 33412",
		city: "Hyderabad",
		zone: "Gachibowli Financial District",
		lat: 17.4401,
		lng: 78.3489,
		status: "Idle",
		batteryPct: 91,
		rating: 4.82,
		completedDeliveries: 260,
		todayEarnings: 750,
		vehicle: "Hero Vida V1 (TS-07-EV-9412)",
		documentsVerified: true
	},
	{
		id: "rider_12",
		name: "Girish Kamat",
		phone: "+91 98452 77190",
		city: "Bengaluru",
		zone: "Malleshwaram 8th Cross",
		lat: 13.0031,
		lng: 77.5692,
		status: "Online",
		batteryPct: 65,
		rating: 4.87,
		completedDeliveries: 340,
		todayEarnings: 1150,
		vehicle: "Bajaj Chetak (KA-02-EV-6619)",
		documentsVerified: true
	},
	{
		id: "rider_13",
		name: "Nitin Jadhav",
		phone: "+91 98601 55902",
		city: "Pune",
		zone: "Kothrud / Karve Nagar",
		lat: 18.5074,
		lng: 73.8077,
		status: "Idle",
		batteryPct: 58,
		rating: 4.79,
		completedDeliveries: 275,
		todayEarnings: 820,
		vehicle: "TVS iQube (MH-14-EV-8821)",
		documentsVerified: true
	},
	{
		id: "rider_14",
		name: "R. Saravanan",
		phone: "+91 94443 88102",
		city: "Chennai",
		zone: "T. Nagar / Panagal Park",
		lat: 13.0418,
		lng: 78.2341,
		status: "Delivering",
		batteryPct: 71,
		rating: 4.91,
		completedDeliveries: 395,
		todayEarnings: 1310,
		vehicle: "Ola S1 Pro (TN-09-EV-3310)",
		documentsVerified: true,
		activeOrderId: "ord_108"
	},
	{
		id: "rider_15",
		name: "Deepak Sawant",
		phone: "+91 98208 44102",
		city: "Mumbai",
		zone: "Andheri West / Lokhandwala",
		lat: 19.1363,
		lng: 72.8277,
		status: "Online",
		batteryPct: 83,
		rating: 4.85,
		completedDeliveries: 350,
		todayEarnings: 1200,
		vehicle: "Ather 450X (MH-02-EV-9941)",
		documentsVerified: true
	},
	{
		id: "rider_16",
		name: "Harish Poojary",
		phone: "+91 99003 66192",
		city: "Bengaluru",
		zone: "JP Nagar 6th Phase",
		lat: 12.9063,
		lng: 77.5857,
		status: "Online",
		batteryPct: 90,
		rating: 4.94,
		completedDeliveries: 460,
		todayEarnings: 1540,
		vehicle: "TVS iQube (KA-05-EV-4419)",
		documentsVerified: true
	},
	{
		id: "rider_17",
		name: "Vijay Chander",
		phone: "+91 99892 55810",
		city: "Hyderabad",
		zone: "Jubilee Hills Road 36",
		lat: 17.4319,
		lng: 78.4073,
		status: "Offline",
		batteryPct: 40,
		rating: 4.75,
		completedDeliveries: 220,
		todayEarnings: 450,
		vehicle: "Revolt RV400 (TS-10-EV-1129)",
		documentsVerified: true
	},
	{
		id: "rider_18",
		name: "Pradeep Shinde",
		phone: "+91 98223 88109",
		city: "Pune",
		zone: "Baner High Street",
		lat: 18.559,
		lng: 73.7868,
		status: "Delivering",
		batteryPct: 67,
		rating: 4.88,
		completedDeliveries: 380,
		todayEarnings: 1260,
		vehicle: "Ola S1 Pro (MH-12-EV-7729)",
		documentsVerified: true,
		activeOrderId: "ord_109"
	},
	{
		id: "rider_19",
		name: "S. Balaji",
		phone: "+91 94452 77194",
		city: "Chennai",
		zone: "Anna Nagar Roundtana",
		lat: 13.085,
		lng: 78.214,
		status: "Online",
		batteryPct: 86,
		rating: 4.83,
		completedDeliveries: 310,
		todayEarnings: 990,
		vehicle: "Hero Vida V1 (TN-02-EV-5541)",
		documentsVerified: true
	},
	{
		id: "rider_20",
		name: "Akash Bhosle",
		phone: "+91 98332 99401",
		city: "Mumbai",
		zone: "Bandra West / Hill Road",
		lat: 19.0596,
		lng: 72.8295,
		status: "Offline",
		batteryPct: 35,
		rating: 4.72,
		completedDeliveries: 195,
		todayEarnings: 420,
		vehicle: "Bajaj Chetak (MH-01-EV-3319)",
		documentsVerified: true
	}
];
var MOCK_ADMIN_PRODUCTS = [
	{
		id: "prod_01",
		title: "VoltRide 60V 30Ah Lithium NMC Replacement Battery Pack",
		sku: "BAT-VR-60V30AH",
		category: "Batteries",
		sellerId: "seller_01",
		sellerName: "ElectroDrive Spares Bengaluru",
		price: 38500,
		discountPrice: 34999,
		stock: 14,
		minStockThreshold: 5,
		status: "Active",
		warrantyMonths: 36,
		specs: {
			"Cell Chemistry": "Li-NiMnCo Grade A",
			"Nominal Voltage": "60V",
			"Capacity": "30Ah (1.8 kWh)",
			"Cycle Life": "1800 cycles @ 80% DoD",
			"BMS": "Smart CANBUS 60A Continuous"
		},
		compatibleBikes: ["bike_ather_450x", "bike_ola_s1pro"],
		imageUrl: "https://images.unsplash.com/photo-1558441719-8b489c652758?w=500&auto=format&fit=crop&q=80",
		rating: 4.88,
		reviewsCount: 42,
		salesCount: 88
	},
	{
		id: "prod_02",
		title: "HyperCharge Pro 72V 12A Smart Fast Charger (Ather / Ola)",
		sku: "CHG-HCP-72V12A",
		category: "Chargers",
		sellerId: "seller_07",
		sellerName: "VoltMaster FastCharge Systems",
		price: 8900,
		discountPrice: 7999,
		stock: 28,
		minStockThreshold: 8,
		status: "Active",
		warrantyMonths: 24,
		specs: {
			"Input Voltage": "180V - 260V AC",
			"Max Current": "12A Fast Mode",
			"Cooling": "Dual MagLev Silent Fans",
			"Protections": "OVP, OCP, OTP, Reverse Polarity"
		},
		compatibleBikes: [
			"bike_ather_450x",
			"bike_ola_s1pro",
			"bike_tvs_iqube"
		],
		imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80",
		rating: 4.92,
		reviewsCount: 65,
		salesCount: 142
	},
	{
		id: "prod_03",
		title: "Kavach Sintered Ceramic Front Brake Pad Set",
		sku: "BRK-KAV-CER-F",
		category: "Brakes & Suspension",
		sellerId: "seller_09",
		sellerName: "Kavach EV Brakes & Alloys",
		price: 1850,
		discountPrice: 1599,
		stock: 45,
		minStockThreshold: 10,
		status: "Active",
		warrantyMonths: 12,
		specs: {
			"Friction Material": "Sintered Ceramic-Copper",
			"Heat Tolerance": "Up to 650°C",
			"Rotor Wear": "Low Dust Non-Abrasive"
		},
		compatibleBikes: [
			"bike_ather_450x",
			"bike_ola_s1pro",
			"bike_tvs_iqube",
			"bike_bajaj_chetak"
		],
		imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&auto=format&fit=crop&q=80",
		rating: 4.75,
		reviewsCount: 38,
		salesCount: 194
	},
	{
		id: "prod_04",
		title: "Apex Carbon Steel Drive Belt Replacement (78T)",
		sku: "BLT-APX-78T-CS",
		category: "Motors & Controllers",
		sellerId: "seller_01",
		sellerName: "ElectroDrive Spares Bengaluru",
		price: 3200,
		discountPrice: 2899,
		stock: 3,
		minStockThreshold: 5,
		status: "Low Stock",
		warrantyMonths: 12,
		specs: {
			"Tensile Cord": "Carbon Fiber Core",
			"Tooth Profile": "HTD 8M Precision Pitch",
			"Width": "16mm"
		},
		compatibleBikes: ["bike_ather_450x"],
		imageUrl: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=500&auto=format&fit=crop&q=80",
		rating: 4.82,
		reviewsCount: 29,
		salesCount: 110
	},
	{
		id: "prod_05",
		title: "RideSafe AeroShield Pro Full-Face ECE 22.06 Helmet",
		sku: "HLM-RS-AERO-L",
		category: "Riding Gear",
		sellerId: "seller_08",
		sellerName: "RideSafe Premium Helmets & Armor",
		price: 5499,
		discountPrice: 4899,
		stock: 22,
		minStockThreshold: 5,
		status: "Active",
		warrantyMonths: 24,
		specs: {
			"Shell": "Polycarbonate Tri-Matrix",
			"Certification": "ISI + ECE 22.06 Certified",
			"Visor": "Pinlock 70 MaxVision Ready"
		},
		compatibleBikes: [
			"bike_ather_450x",
			"bike_ola_s1pro",
			"bike_tvs_iqube",
			"bike_bajaj_chetak",
			"bike_hero_vida",
			"bike_revolt_rv400"
		],
		imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=80",
		rating: 4.94,
		reviewsCount: 88,
		salesCount: 165
	},
	{
		id: "prod_06",
		title: "Zenith CNC Anodized Adjustable Brake Levers (Pair)",
		sku: "LEV-ZNT-CNC-RED",
		category: "Body & Accessories",
		sellerId: "seller_04",
		sellerName: "Zenith Moto Accessories",
		price: 2400,
		discountPrice: 1999,
		stock: 18,
		minStockThreshold: 5,
		status: "Active",
		warrantyMonths: 12,
		specs: {
			"Material": "T6-6061 Billet Aluminum",
			"Finish": "Hard Anodized Red",
			"Positions": "6-Way Click Reach Adjustment"
		},
		compatibleBikes: ["bike_ola_s1pro", "bike_ather_450x"],
		imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&auto=format&fit=crop&q=80",
		rating: 4.69,
		reviewsCount: 24,
		salesCount: 76
	},
	{
		id: "prod_07",
		title: "Deccan 48V 28Ah Heavy Duty Swappable Battery",
		sku: "BAT-DEC-48V28AH",
		category: "Batteries",
		sellerId: "seller_03",
		sellerName: "Deccan Battery Labs & Electronics",
		price: 32e3,
		discountPrice: 28500,
		stock: 2,
		minStockThreshold: 4,
		status: "Low Stock",
		warrantyMonths: 36,
		specs: {
			"Chemistry": "Prismatic LiFePO4",
			"Voltage": "48V",
			"Capacity": "28Ah",
			"Weight": "12.4 kg"
		},
		compatibleBikes: ["bike_bajaj_chetak", "bike_hero_vida"],
		imageUrl: "https://images.unsplash.com/photo-1558441719-8b489c652758?w=500&auto=format&fit=crop&q=80",
		rating: 4.81,
		reviewsCount: 31,
		salesCount: 62
	},
	{
		id: "prod_08",
		title: "GreenPulse 3.5kW Sinusoidal FOC Motor Controller",
		sku: "CTL-GP-3500W-FOC",
		category: "Motors & Controllers",
		sellerId: "seller_06",
		sellerName: "GreenPulse EV Motors & Controllers",
		price: 14500,
		discountPrice: 12999,
		stock: 9,
		minStockThreshold: 3,
		status: "Active",
		warrantyMonths: 24,
		specs: {
			"Peak Current": "120A Phase",
			"Protocol": "CAN 2.0B / Bluetooth Telemetry",
			"Efficiency": "> 96.8%"
		},
		compatibleBikes: ["bike_revolt_rv400", "bike_ola_s1pro"],
		imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80",
		rating: 4.65,
		reviewsCount: 15,
		salesCount: 44
	},
	{
		id: "prod_09",
		title: "Southern Apex Weatherproof Charging Dock 2.2kW",
		sku: "CHG-APX-DOCK-2200W",
		category: "Chargers",
		sellerId: "seller_05",
		sellerName: "Southern Apex EV Chargers",
		price: 11200,
		discountPrice: 9999,
		stock: 15,
		minStockThreshold: 5,
		status: "Active",
		warrantyMonths: 36,
		specs: {
			"Ingress Rating": "IP67 Waterproof Outdoor",
			"Cable Length": "5 Meters Heavy Duty",
			"Auto Cutoff": "Yes at 100% SoC"
		},
		compatibleBikes: [
			"bike_tvs_iqube",
			"bike_bajaj_chetak",
			"bike_ather_450x"
		],
		imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80",
		rating: 4.87,
		reviewsCount: 44,
		salesCount: 95
	},
	{
		id: "prod_10",
		title: "Bharat EV Ultra-Grip Dual Compound 90/90-12 EV Tubeless Tire",
		sku: "TIR-BEV-909012",
		category: "Brakes & Suspension",
		sellerId: "seller_02",
		sellerName: "Bharat EV Hub & Batteries",
		price: 2100,
		discountPrice: 1799,
		stock: 50,
		minStockThreshold: 12,
		status: "Active",
		warrantyMonths: 18,
		specs: {
			"Rolling Resistance": "Low Rolling Loss Compound",
			"Ply Rating": "4PR Reinforced Sidewall",
			"Tread": "Deep Water Sipes"
		},
		compatibleBikes: [
			"bike_ather_450x",
			"bike_ola_s1pro",
			"bike_tvs_iqube",
			"bike_bajaj_chetak"
		],
		imageUrl: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?w=500&auto=format&fit=crop&q=80",
		rating: 4.83,
		reviewsCount: 52,
		salesCount: 180
	},
	{
		id: "prod_11",
		title: "Telangana Smart IoT GPS Anti-Theft Tracker Unit",
		sku: "IOT-TS-GPS-4G",
		category: "Body & Accessories",
		sellerId: "seller_03",
		sellerName: "Deccan Battery Labs & Electronics",
		price: 3600,
		discountPrice: 2999,
		stock: 0,
		minStockThreshold: 5,
		status: "Out of Stock",
		warrantyMonths: 12,
		specs: {
			"Connectivity": "4G LTE + e-SIM Included 1 Yr",
			"Battery Backup": "72 Hours Internal Lithium",
			"Geofence Alert": "SMS & Push Instant"
		},
		compatibleBikes: [
			"bike_ather_450x",
			"bike_ola_s1pro",
			"bike_tvs_iqube",
			"bike_bajaj_chetak",
			"bike_hero_vida",
			"bike_revolt_rv400"
		],
		imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&auto=format&fit=crop&q=80",
		rating: 4.54,
		reviewsCount: 18,
		salesCount: 58
	},
	{
		id: "prod_12",
		title: "NeoRide High Torque 72V 4kW Hub Motor Core",
		sku: "MOT-NR-72V4000W",
		category: "Motors & Controllers",
		sellerId: "seller_02",
		sellerName: "Bharat EV Hub & Batteries",
		price: 19800,
		discountPrice: 17500,
		stock: 6,
		minStockThreshold: 2,
		status: "Active",
		warrantyMonths: 24,
		specs: {
			"Peak Torque": "150 Nm",
			"Magnet Grade": "N45SH High Temperature",
			"Stator": "Japanese Silicon Steel"
		},
		compatibleBikes: ["bike_revolt_rv400"],
		imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80",
		rating: 4.78,
		reviewsCount: 12,
		salesCount: 38
	},
	{
		id: "prod_13",
		title: "Ather 450X Replacement High-Density Floorboard Mat",
		sku: "ACC-ATH-MAT-V3",
		category: "Body & Accessories",
		sellerId: "seller_01",
		sellerName: "ElectroDrive Spares Bengaluru",
		price: 850,
		discountPrice: 699,
		stock: 35,
		minStockThreshold: 10,
		status: "Active",
		warrantyMonths: 6,
		specs: {
			"Material": "Heavy Gauge All-Weather TPE",
			"Fit": "Custom CAD Precision Moulded"
		},
		compatibleBikes: ["bike_ather_450x"],
		imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&auto=format&fit=crop&q=80",
		rating: 4.9,
		reviewsCount: 40,
		salesCount: 135
	},
	{
		id: "prod_14",
		title: "VoltMaster 15A Industrial Extension Cable for EV Home Charging (10m)",
		sku: "CAB-VM-15A-10M",
		category: "Chargers",
		sellerId: "seller_07",
		sellerName: "VoltMaster FastCharge Systems",
		price: 2450,
		discountPrice: 1999,
		stock: 40,
		minStockThreshold: 10,
		status: "Active",
		warrantyMonths: 12,
		specs: {
			"Conductor": "3 x 2.5 sq mm Pure Copper",
			"Current Rating": "16 Amp Continuous",
			"Plug": "Moulded 3-Pin Heavy Duty"
		},
		compatibleBikes: [
			"bike_ather_450x",
			"bike_ola_s1pro",
			"bike_tvs_iqube",
			"bike_bajaj_chetak",
			"bike_hero_vida",
			"bike_revolt_rv400"
		],
		imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80",
		rating: 4.86,
		reviewsCount: 62,
		salesCount: 210
	},
	{
		id: "prod_15",
		title: "Kavach Rear Disc Rotor 200mm Stainless Steel",
		sku: "ROTR-KAV-200MM",
		category: "Brakes & Suspension",
		sellerId: "seller_09",
		sellerName: "Kavach EV Brakes & Alloys",
		price: 1650,
		discountPrice: 1399,
		stock: 26,
		minStockThreshold: 8,
		status: "Active",
		warrantyMonths: 12,
		specs: {
			"Grade": "SUS 420 High Carbon Steel",
			"Thickness": "3.5mm",
			"Heat Dispersal": "Laser Drilled Wave Holes"
		},
		compatibleBikes: ["bike_ola_s1pro", "bike_ather_450x"],
		imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&auto=format&fit=crop&q=80",
		rating: 4.77,
		reviewsCount: 22,
		salesCount: 84
	},
	{
		id: "prod_16",
		title: "RideSafe Waterproof Armored Touring Jacket (Cordura 600D)",
		sku: "JKT-RS-TOURING-XL",
		category: "Riding Gear",
		sellerId: "seller_08",
		sellerName: "RideSafe Premium Helmets & Armor",
		price: 7999,
		discountPrice: 6999,
		stock: 14,
		minStockThreshold: 4,
		status: "Active",
		warrantyMonths: 24,
		specs: {
			"Armor": "CE Level 2 Shoulder, Elbow & Spine",
			"Waterproofing": "Reissa Breathable Membrane"
		},
		compatibleBikes: [
			"bike_ather_450x",
			"bike_ola_s1pro",
			"bike_revolt_rv400"
		],
		imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=80",
		rating: 4.91,
		reviewsCount: 35,
		salesCount: 72
	},
	{
		id: "prod_17",
		title: "Bharat EV Ola S1 Pillion Footrest CNC Bracket Kit",
		sku: "ACC-OLA-PIL-FT",
		category: "Body & Accessories",
		sellerId: "seller_02",
		sellerName: "Bharat EV Hub & Batteries",
		price: 1850,
		discountPrice: 1499,
		stock: 30,
		minStockThreshold: 10,
		status: "Active",
		warrantyMonths: 12,
		specs: {
			"Mounting": "OEM Chassis Mounting Bolt-On",
			"Load Rating": "120 kg Static per side"
		},
		compatibleBikes: ["bike_ola_s1pro"],
		imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&auto=format&fit=crop&q=80",
		rating: 4.68,
		reviewsCount: 48,
		salesCount: 154
	},
	{
		id: "prod_18",
		title: "ElectroDrive Heavy Duty Monoshock Rear Absorber (Nitrogen Charged)",
		sku: "SUS-ED-MONO-NIT",
		category: "Brakes & Suspension",
		sellerId: "seller_01",
		sellerName: "ElectroDrive Spares Bengaluru",
		price: 4800,
		discountPrice: 4199,
		stock: 4,
		minStockThreshold: 5,
		status: "Low Stock",
		warrantyMonths: 24,
		specs: {
			"Spring Rate": "Progressive Dual Rate 950 lbs",
			"Damping": "12-Step Preload Rebound"
		},
		compatibleBikes: ["bike_ather_450x", "bike_ola_s1pro"],
		imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=500&auto=format&fit=crop&q=80",
		rating: 4.85,
		reviewsCount: 19,
		salesCount: 52
	},
	{
		id: "prod_19",
		title: "Southern Apex Universal Screen Protector & Visor Sunshade",
		sku: "ACC-APX-SCR-7IN",
		category: "Body & Accessories",
		sellerId: "seller_05",
		sellerName: "Southern Apex EV Chargers",
		price: 650,
		discountPrice: 499,
		stock: 60,
		minStockThreshold: 15,
		status: "Active",
		warrantyMonths: 6,
		specs: {
			"Hardness": "9H Tempered Glass Anti-Glare",
			"Compatibility": "7-Inch Touchscreen Displays"
		},
		compatibleBikes: [
			"bike_ather_450x",
			"bike_ola_s1pro",
			"bike_tvs_iqube"
		],
		imageUrl: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=500&auto=format&fit=crop&q=80",
		rating: 4.74,
		reviewsCount: 78,
		salesCount: 260
	},
	{
		id: "prod_20",
		title: "NeoRide Experimental 72V Bi-Directional V2L Discharge Adapter",
		sku: "EXP-NR-V2L-72V",
		category: "Chargers",
		sellerId: "seller_04",
		sellerName: "Zenith Moto Accessories",
		price: 4500,
		discountPrice: 3999,
		stock: 8,
		minStockThreshold: 3,
		status: "Pending Review",
		warrantyMonths: 12,
		specs: {
			"Output": "230V AC 1500W Pure Sine",
			"Safety": "Under-Voltage Cutoff 60V"
		},
		compatibleBikes: ["bike_revolt_rv400", "bike_ola_s1pro"],
		imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80",
		rating: 4.4,
		reviewsCount: 5,
		salesCount: 14
	},
	...Array.from({ length: 30 }).map((_, i) => {
		const idx = i + 21;
		const cats = [
			"Batteries",
			"Chargers",
			"Brakes & Suspension",
			"Motors & Controllers",
			"Body & Accessories",
			"Riding Gear"
		];
		const chosenCat = cats[i % cats.length];
		const sellerIds = [
			"seller_01",
			"seller_02",
			"seller_03",
			"seller_04",
			"seller_05",
			"seller_07",
			"seller_08",
			"seller_09"
		];
		const sellerNames = [
			"ElectroDrive Spares Bengaluru",
			"Bharat EV Hub & Batteries",
			"Deccan Battery Labs & Electronics",
			"Zenith Moto Accessories",
			"Southern Apex EV Chargers",
			"VoltMaster FastCharge Systems",
			"RideSafe Premium Helmets & Armor",
			"Kavach EV Brakes & Alloys"
		];
		const sIdx = i % sellerIds.length;
		const isLow = i % 7 === 0;
		const isPending = i === 13 || i === 27;
		return {
			id: `prod_${idx}`,
			title: `RiderzPro Certified ${chosenCat} Grade-A Component #${idx}`,
			sku: `RZP-${chosenCat.slice(0, 3).toUpperCase()}-${idx}`,
			category: chosenCat,
			sellerId: sellerIds[sIdx],
			sellerName: sellerNames[sIdx],
			price: 1200 + i * 450,
			discountPrice: 999 + i * 390,
			stock: isLow ? 2 : 15 + i % 25,
			minStockThreshold: 5,
			status: isPending ? "Pending Review" : isLow ? "Low Stock" : "Active",
			warrantyMonths: 12 + i % 3 * 12,
			specs: {
				"Quality Standard": "ISO 9001:2015 Verified",
				"Fitment Guarantee": "100% VIN Matched"
			},
			compatibleBikes: [
				"bike_ather_450x",
				"bike_ola_s1pro",
				"bike_tvs_iqube",
				"bike_bajaj_chetak"
			],
			imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=500&auto=format&fit=crop&q=80",
			rating: +(4.5 + i % 5 * .1).toFixed(2),
			reviewsCount: 10 + i * 2,
			salesCount: 25 + i * 5
		};
	})
];
var couriers = [
	"Delhivery",
	"Blue Dart",
	"Shadowfax",
	"RiderzPro Fleet"
];
var methods = [
	"UPI",
	"Credit Card",
	"Debit Card",
	"Net Banking",
	"Cash on Delivery"
];
var MOCK_ADMIN_ORDERS = [
	{
		id: "ord_101",
		orderNumber: "RZP-2026-08412",
		date: "2026-04-14T09:42:00Z",
		customerId: "cust_01",
		customerName: "Aakash Sharma",
		customerPhone: "+91 98765 43210",
		customerCity: "Bengaluru",
		shippingAddress: "Flat 402, Green Glen Layout, Bellandur, Bengaluru - 560103",
		items: [{
			productId: "prod_01",
			productName: "VoltRide 60V 30Ah Lithium NMC Replacement Battery Pack",
			quantity: 1,
			unitPrice: 34999,
			sellerId: "seller_01",
			sellerName: "ElectroDrive Spares Bengaluru",
			bikeCompatible: "Ather 450X Gen 3"
		}, {
			productId: "prod_03",
			productName: "Kavach Sintered Ceramic Front Brake Pad Set",
			quantity: 1,
			unitPrice: 1599,
			sellerId: "seller_09",
			sellerName: "Kavach EV Brakes & Alloys",
			bikeCompatible: "Ather 450X Gen 3"
		}],
		subtotal: 36598,
		deliveryFee: 0,
		taxGst: 4391,
		discount: 1e3,
		totalAmount: 39989,
		paymentMethod: "UPI",
		paymentStatus: "Paid",
		status: "In Transit",
		trackingNumber: "DLV-BLR-99410294",
		courier: "Delhivery",
		riderId: "rider_01",
		riderName: "Ramesh Kumar (+91 98450 19284)",
		fitmentVerified: true,
		notes: "Customer confirmed EV chassis VIN match verified before dispatch."
	},
	{
		id: "ord_102",
		orderNumber: "RZP-2026-08413",
		date: "2026-04-14T08:15:00Z",
		customerId: "cust_02",
		customerName: "Pooja Hegde",
		customerPhone: "+91 98451 22890",
		customerCity: "Bengaluru",
		shippingAddress: "Villa 12, Indiranagar 100ft Road, Bengaluru - 560038",
		items: [{
			productId: "prod_02",
			productName: "HyperCharge Pro 72V 12A Smart Fast Charger (Ather / Ola)",
			quantity: 1,
			unitPrice: 7999,
			sellerId: "seller_07",
			sellerName: "VoltMaster FastCharge Systems",
			bikeCompatible: "Ola S1 Pro Gen 2"
		}],
		subtotal: 7999,
		deliveryFee: 40,
		taxGst: 1440,
		discount: 500,
		totalAmount: 8979,
		paymentMethod: "Credit Card",
		paymentStatus: "Paid",
		status: "Dispatched",
		trackingNumber: "RZP-EXP-001289",
		courier: "RiderzPro Fleet",
		riderId: "rider_02",
		riderName: "Suresh Gowda (+91 98801 88201)",
		fitmentVerified: true
	},
	{
		id: "ord_103",
		orderNumber: "RZP-2026-08414",
		date: "2026-04-14T07:30:00Z",
		customerId: "cust_03",
		customerName: "Karthik Venkat",
		customerPhone: "+91 97412 88301",
		customerCity: "Chennai",
		shippingAddress: "7th Cross, Besant Nagar, Chennai - 600090",
		items: [{
			productId: "prod_05",
			productName: "RideSafe AeroShield Pro Full-Face ECE 22.06 Helmet",
			quantity: 1,
			unitPrice: 4899,
			sellerId: "seller_08",
			sellerName: "RideSafe Premium Helmets & Armor",
			bikeCompatible: "Universal Fit"
		}],
		subtotal: 4899,
		deliveryFee: 60,
		taxGst: 882,
		discount: 0,
		totalAmount: 5841,
		paymentMethod: "UPI",
		paymentStatus: "Paid",
		status: "Processing",
		trackingNumber: "BD-CHN-881920",
		courier: "Blue Dart",
		fitmentVerified: true
	},
	{
		id: "ord_104",
		orderNumber: "RZP-2026-08415",
		date: "2026-04-13T16:20:00Z",
		customerId: "cust_04",
		customerName: "Rohan Deshmukh",
		customerPhone: "+91 98220 54119",
		customerCity: "Pune",
		shippingAddress: "Plot 88, Viman Nagar, Pune - 411014",
		items: [{
			productId: "prod_07",
			productName: "Deccan 48V 28Ah Heavy Duty Swappable Battery",
			quantity: 1,
			unitPrice: 28500,
			sellerId: "seller_03",
			sellerName: "Deccan Battery Labs & Electronics",
			bikeCompatible: "Bajaj Chetak Premium"
		}],
		subtotal: 28500,
		deliveryFee: 0,
		taxGst: 3420,
		discount: 1500,
		totalAmount: 30420,
		paymentMethod: "Net Banking",
		paymentStatus: "Paid",
		status: "Delivered",
		trackingNumber: "SHD-PUN-448102",
		courier: "Shadowfax",
		riderId: "rider_04",
		riderName: "Anand Shettigar (+91 99002 77192)",
		fitmentVerified: true
	},
	{
		id: "ord_105",
		orderNumber: "RZP-2026-08416",
		date: "2026-04-13T14:10:00Z",
		customerId: "cust_05",
		customerName: "Sneha Reddy",
		customerPhone: "+91 99890 33412",
		customerCity: "Hyderabad",
		shippingAddress: "Apt 501, Jubilee Hills Road No. 36, Hyderabad - 500033",
		items: [{
			productId: "prod_08",
			productName: "GreenPulse 3.5kW Sinusoidal FOC Motor Controller",
			quantity: 1,
			unitPrice: 12999,
			sellerId: "seller_06",
			sellerName: "GreenPulse EV Motors & Controllers",
			bikeCompatible: "Ola S1 Pro Gen 2"
		}],
		subtotal: 12999,
		deliveryFee: 50,
		taxGst: 1560,
		discount: 500,
		totalAmount: 14109,
		paymentMethod: "UPI",
		paymentStatus: "Paid",
		status: "In Transit",
		trackingNumber: "DLV-HYD-551092",
		courier: "Delhivery",
		riderId: "rider_07",
		riderName: "Syed Imran (+91 99890 11982)",
		fitmentVerified: true
	},
	{
		id: "ord_106",
		orderNumber: "RZP-2026-08417",
		date: "2026-04-13T11:05:00Z",
		customerId: "cust_06",
		customerName: "Vikram Kulkarni",
		customerPhone: "+91 98201 99241",
		customerCity: "Mumbai",
		shippingAddress: "B-204, Powai Vihar Complex, Powai, Mumbai - 400076",
		items: [{
			productId: "prod_06",
			productName: "Zenith CNC Anodized Adjustable Brake Levers (Pair)",
			quantity: 1,
			unitPrice: 1999,
			sellerId: "seller_04",
			sellerName: "Zenith Moto Accessories",
			bikeCompatible: "Ather 450X"
		}],
		subtotal: 1999,
		deliveryFee: 40,
		taxGst: 240,
		discount: 0,
		totalAmount: 2279,
		paymentMethod: "Credit Card",
		paymentStatus: "Refunded",
		status: "Cancelled",
		trackingNumber: "BD-MUM-110294",
		courier: "Blue Dart",
		fitmentVerified: true,
		notes: "Cancelled upon customer request before hub handoff. Refund processed."
	},
	...Array.from({ length: 36 }).map((_, i) => {
		const orderIdx = 107 + i;
		const customer = MOCK_ADMIN_CUSTOMERS[i % MOCK_ADMIN_CUSTOMERS.length];
		const product = MOCK_ADMIN_PRODUCTS[i * 2 % MOCK_ADMIN_PRODUCTS.length];
		const city = customer.city;
		const courier = couriers[i % couriers.length];
		const method = methods[i % methods.length];
		const statuses = [
			"Placed",
			"Processing",
			"Dispatched",
			"In Transit",
			"Delivered",
			"Delivered",
			"Delivered",
			"Cancelled"
		];
		const status = statuses[i % statuses.length];
		const rider = MOCK_ADMIN_RIDERS[i % MOCK_ADMIN_RIDERS.length];
		const daysAgo = (36 - i) * 2;
		const dateObj = /* @__PURE__ */ new Date("2026-04-14T10:00:00Z");
		dateObj.setDate(dateObj.getDate() - daysAgo);
		const price = product.discountPrice || product.price;
		const gst = Math.round(price * .12);
		const fee = price > 5e3 ? 0 : 50;
		const discount = i % 4 === 0 ? 300 : 0;
		const total = price + gst + fee - discount;
		return {
			id: `ord_${orderIdx}`,
			orderNumber: `RZP-2026-084${orderIdx}`,
			date: dateObj.toISOString(),
			customerId: customer.id,
			customerName: customer.name,
			customerPhone: customer.phone,
			customerCity: city,
			shippingAddress: customer.address,
			items: [{
				productId: product.id,
				productName: product.title,
				quantity: 1,
				unitPrice: price,
				sellerId: product.sellerId,
				sellerName: product.sellerName,
				bikeCompatible: product.compatibleBikes[0] || "Universal Fit"
			}],
			subtotal: price,
			deliveryFee: fee,
			taxGst: gst,
			discount,
			totalAmount: total,
			paymentMethod: method,
			paymentStatus: status === "Cancelled" ? "Refunded" : "Paid",
			status,
			trackingNumber: `TRK-${city.slice(0, 3).toUpperCase()}-${881900 + orderIdx}`,
			courier,
			riderId: status !== "Placed" && status !== "Processing" ? rider.id : void 0,
			riderName: status !== "Placed" && status !== "Processing" ? `${rider.name} (${rider.phone})` : void 0,
			fitmentVerified: true,
			notes: status === "Cancelled" ? "User initiated cancellation." : void 0
		};
	})
];
var MOCK_ADMIN_TICKETS = [
	{
		id: "tkt_01",
		ticketNumber: "TCK-88120",
		customerId: "cust_01",
		customerName: "Aakash Sharma",
		orderId: "ord_101",
		subject: "Fitment confirmation for Ather 450X Gen 3 battery connector",
		category: "Fitment Issue",
		priority: "High",
		status: "In Progress",
		createdAt: "2026-04-14T09:50:00Z",
		assignedTo: "Karan Johar (Senior Tech)",
		messages: [{
			id: "msg_1",
			sender: "customer",
			senderName: "Aakash Sharma",
			text: "Hi, I ordered the VoltRide 60V 30Ah pack for my Ather 450X Gen 3. Can you verify if the auxiliary CANBUS communication cable is plug-and-play with the 2023 dash harness?",
			timestamp: "2026-04-14T09:50:00Z"
		}, {
			id: "msg_2",
			sender: "agent",
			senderName: "Karan Johar",
			text: "Hello Aakash! Yes, the VoltRide unit includes the OEM-spec Molex 8-pin jumper wire specifically configured for Ather Gen 3 firmware 13.x. Our Indiranagar hub technician pre-tests the pinout before handover.",
			timestamp: "2026-04-14T10:05:00Z"
		}]
	},
	{
		id: "tkt_02",
		ticketNumber: "TCK-88121",
		customerId: "cust_02",
		customerName: "Pooja Hegde",
		orderId: "ord_102",
		subject: "HyperCharge delivery time estimate for Koramangala",
		category: "Delayed Delivery",
		priority: "Medium",
		status: "Open",
		createdAt: "2026-04-14T08:30:00Z",
		assignedTo: "Priya Menon (Dispatch Support)",
		messages: [{
			id: "msg_3",
			sender: "customer",
			senderName: "Pooja Hegde",
			text: "My rider shows en-route for 40 minutes. Can you please check if he is stuck near Sony World signal?",
			timestamp: "2026-04-14T08:30:00Z"
		}]
	},
	{
		id: "tkt_03",
		ticketNumber: "TCK-88122",
		customerId: "cust_06",
		customerName: "Vikram Kulkarni",
		orderId: "ord_106",
		subject: "Refund confirmation for cancelled brake levers",
		category: "Refund Request",
		priority: "Low",
		status: "Resolved",
		createdAt: "2026-04-13T11:20:00Z",
		assignedTo: "Finance Automation Bot",
		messages: [{
			id: "msg_4",
			sender: "customer",
			senderName: "Vikram Kulkarni",
			text: "I cancelled order #RZP-2026-08417. When will ₹2,279 reflect back in my HDFC credit card?",
			timestamp: "2026-04-13T11:20:00Z"
		}, {
			id: "msg_5",
			sender: "agent",
			senderName: "Finance Desk",
			text: "Your refund reference RFND_HDFC_991823 was approved. Standard credit card settlement is 2-4 business days.",
			timestamp: "2026-04-13T11:45:00Z"
		}]
	},
	...Array.from({ length: 22 }).map((_, i) => {
		const idx = i + 4;
		const cust = MOCK_ADMIN_CUSTOMERS[(i + 3) % MOCK_ADMIN_CUSTOMERS.length];
		const cats = [
			"Fitment Issue",
			"Delayed Delivery",
			"Refund Request",
			"Damaged Part",
			"Technical Help"
		];
		const priorities = [
			"High",
			"Medium",
			"Low"
		];
		const statuses = [
			"Open",
			"In Progress",
			"Resolved",
			"Escalated"
		];
		const cat = cats[i % cats.length];
		const pri = priorities[i % priorities.length];
		const stat = statuses[i % statuses.length];
		const daysAgo = 22 - i;
		const d = /* @__PURE__ */ new Date("2026-04-14T09:00:00Z");
		d.setDate(d.getDate() - daysAgo);
		return {
			id: `tkt_${idx}`,
			ticketNumber: `TCK-881${idx + 20}`,
			customerId: cust.id,
			customerName: cust.name,
			orderId: `ord_${105 + i % 30}`,
			subject: `${cat} inquiry regarding ${cust.garageBikes[0] || "EV Scooter"} order`,
			category: cat,
			priority: pri,
			status: stat,
			createdAt: d.toISOString(),
			assignedTo: i % 2 === 0 ? "Priya Menon" : "Karan Johar",
			messages: [{
				id: `msg_${idx}_1`,
				sender: "customer",
				senderName: cust.name,
				text: `Requesting status update on ${cat.toLowerCase()} regarding our recent vehicle parts dispatch.`,
				timestamp: d.toISOString()
			}, {
				id: `msg_${idx}_2`,
				sender: "agent",
				senderName: "RiderzPro Support Specialist",
				text: `We have reviewed the diagnostics with the workshop lead. Actions are in progress.`,
				timestamp: new Date(d.getTime() + 18e5).toISOString()
			}]
		};
	})
];
var MOCK_ADMIN_TRANSACTIONS = [
	{
		id: "tx_01",
		transactionRef: "pay_rzp_9941019",
		orderId: "ord_101",
		customerName: "Aakash Sharma",
		type: "Payment",
		amount: 39989,
		gateway: "Razorpay",
		status: "Success",
		timestamp: "2026-04-14T09:42:15Z",
		fee: 799.78
	},
	{
		id: "tx_02",
		transactionRef: "pay_rzp_9941020",
		orderId: "ord_102",
		customerName: "Pooja Hegde",
		type: "Payment",
		amount: 8979,
		gateway: "Razorpay",
		status: "Success",
		timestamp: "2026-04-14T08:15:30Z",
		fee: 179.58
	},
	{
		id: "tx_03",
		transactionRef: "pout_cf_881901",
		orderId: "ord_104",
		customerName: "Seller: ElectroDrive Spares",
		type: "Seller Payout",
		amount: 31250,
		gateway: "Cashfree",
		status: "Success",
		timestamp: "2026-04-13T18:00:00Z",
		fee: 10
	},
	{
		id: "tx_04",
		transactionRef: "pout_rider_33190",
		orderId: "ord_104",
		customerName: "Rider: Ramesh Kumar",
		type: "Rider Payout",
		amount: 1450,
		gateway: "UPI",
		status: "Success",
		timestamp: "2026-04-13T20:30:00Z",
		fee: 0
	},
	{
		id: "tx_05",
		transactionRef: "rfnd_rzp_004918",
		orderId: "ord_106",
		customerName: "Vikram Kulkarni",
		type: "Refund",
		amount: 2279,
		gateway: "Razorpay",
		status: "Success",
		timestamp: "2026-04-13T11:45:00Z",
		fee: 0
	},
	...Array.from({ length: 25 }).map((_, i) => {
		const idx = i + 6;
		const types = [
			"Payment",
			"Payment",
			"Seller Payout",
			"Payment",
			"Refund",
			"Rider Payout"
		];
		const type = types[i % types.length];
		const amount = type === "Payment" ? 3500 + i * 400 : type === "Seller Payout" ? 18e3 + i * 500 : type === "Rider Payout" ? 1200 + i * 50 : 2100;
		const daysAgo = 25 - i;
		const d = /* @__PURE__ */ new Date("2026-04-14T07:00:00Z");
		d.setDate(d.getDate() - daysAgo);
		return {
			id: `tx_${idx}`,
			transactionRef: `tx_live_${994100 + idx}`,
			orderId: `ord_${105 + i}`,
			customerName: type === "Seller Payout" ? "Deccan Battery Labs" : type === "Rider Payout" ? "Suresh Gowda" : `Verified Buyer #${idx}`,
			type,
			amount,
			gateway: i % 3 === 0 ? "Razorpay" : i % 3 === 1 ? "UPI" : "Cashfree",
			status: "Success",
			timestamp: d.toISOString(),
			fee: Math.round(amount * .02)
		};
	})
];
var MOCK_ADMIN_COUPONS = [
	{
		id: "cpn_01",
		code: "EVRIDER10",
		discountType: "percentage",
		discountValue: 10,
		minOrderValue: 2500,
		maxDiscount: 1e3,
		usageCount: 428,
		usageLimit: 1e3,
		validFrom: "2026-01-01",
		validTill: "2026-06-30",
		isActive: true
	},
	{
		id: "cpn_02",
		code: "BATTERYBOOST",
		discountType: "fixed",
		discountValue: 1500,
		minOrderValue: 25e3,
		usageCount: 184,
		usageLimit: 500,
		validFrom: "2026-02-01",
		validTill: "2026-05-31",
		isActive: true,
		applicableCategory: "Batteries"
	},
	{
		id: "cpn_03",
		code: "BLRFAST50",
		discountType: "fixed",
		discountValue: 500,
		minOrderValue: 4e3,
		usageCount: 310,
		usageLimit: 500,
		validFrom: "2026-03-01",
		validTill: "2026-04-30",
		isActive: true
	},
	{
		id: "cpn_04",
		code: "HELMETSAFE",
		discountType: "percentage",
		discountValue: 15,
		minOrderValue: 3e3,
		maxDiscount: 750,
		usageCount: 95,
		usageLimit: 200,
		validFrom: "2026-03-15",
		validTill: "2026-07-31",
		isActive: true,
		applicableCategory: "Riding Gear"
	},
	{
		id: "cpn_05",
		code: "NEWYEAR26",
		discountType: "percentage",
		discountValue: 20,
		minOrderValue: 5e3,
		maxDiscount: 2e3,
		usageCount: 500,
		usageLimit: 500,
		validFrom: "2026-01-01",
		validTill: "2026-01-15",
		isActive: false
	}
];
var MOCK_ADMIN_REVIEWS = [
	{
		id: "rev_01",
		productId: "prod_01",
		productName: "VoltRide 60V 30Ah Lithium NMC Replacement Battery Pack",
		customerName: "Aakash Sharma",
		rating: 5,
		date: "2026-04-10",
		title: "Incredible range extension for my Ather 450X Gen 3!",
		comment: "Gives solid 115 km in Ride mode now compared to OEM 85 km. Plug and play harness fit perfectly in Bengaluru.",
		status: "Approved",
		verifiedPurchase: true
	},
	{
		id: "rev_02",
		productId: "prod_02",
		productName: "HyperCharge Pro 72V 12A Smart Fast Charger",
		customerName: "Pooja Hegde",
		rating: 5,
		date: "2026-04-11",
		title: "Cuts charging time from 4.5h down to 1.8h",
		comment: "Solid aluminium extrusion shell with active cooling fans. Doesn't overheat during hot Bengaluru summers.",
		status: "Approved",
		verifiedPurchase: true
	},
	{
		id: "rev_03",
		productId: "prod_03",
		productName: "Kavach Sintered Ceramic Front Brake Pad Set",
		customerName: "Rohan Deshmukh",
		rating: 4,
		date: "2026-04-08",
		title: "Sharp initial bite without squeal",
		comment: "Much better stopping power when riding two-up. No rotor scoring observed after 800 kms.",
		status: "Approved",
		verifiedPurchase: true
	},
	{
		id: "rev_04",
		productId: "prod_06",
		productName: "Zenith CNC Anodized Adjustable Brake Levers",
		customerName: "Suspicious User",
		rating: 1,
		date: "2026-04-05",
		title: "DO NOT BUY FAKE SPAM",
		comment: "Check my telegram channel @spam_cheap_spares for discounts.",
		status: "Flagged",
		verifiedPurchase: false
	},
	{
		id: "rev_05",
		productId: "prod_05",
		productName: "RideSafe AeroShield Pro Full-Face ECE 22.06 Helmet",
		customerName: "Manish Agarwal",
		rating: 5,
		date: "2026-03-28",
		title: "Extremely quiet at 90 km/h and great ventilation",
		comment: "ECE 22.06 safety standard gives real peace of mind on Mumbai western express highway.",
		status: "Approved",
		verifiedPurchase: true
	}
];
var MOCK_ADMIN_WARRANTY = [
	{
		id: "wrt_01",
		claimNumber: "CLM-2026-00412",
		orderId: "ord_105",
		productName: "GreenPulse 3.5kW Sinusoidal FOC Motor Controller",
		customerName: "Sneha Reddy",
		serialNumber: "GP-FOC-9941-A2",
		dateFiled: "2026-04-12",
		reason: "Error code E-04 Hall sensor overcurrent displayed on dashboard after heavy rain.",
		status: "Pending Inspection"
	},
	{
		id: "wrt_02",
		claimNumber: "CLM-2026-00388",
		orderId: "ord_107",
		productName: "Apex Carbon Steel Drive Belt Replacement (78T)",
		customerName: "Rahul Nambiar",
		serialNumber: "APX-BLT-78-0012",
		dateFiled: "2026-04-05",
		reason: "Premature tooth shearing after 300 kms under normal riding conditions.",
		status: "Approved (Replacement)",
		resolutionNotes: "Replacement unit dispatched via Delhivery AWB DLV-BLR-00419."
	},
	{
		id: "wrt_03",
		claimNumber: "CLM-2026-00290",
		orderId: "ord_110",
		productName: "HyperCharge Pro 72V 12A Smart Fast Charger",
		customerName: "Tanvi Kulkarni",
		serialNumber: "HCP-72V-88219",
		dateFiled: "2026-03-24",
		reason: "Cooling fan bearing noise during charging cycle.",
		status: "Approved (Refund)",
		resolutionNotes: "Returned to Pune hub. Full refund of ₹7,999 processed to source bank account."
	},
	{
		id: "wrt_04",
		claimNumber: "CLM-2026-00210",
		orderId: "ord_115",
		productName: "Zenith CNC Anodized Adjustable Brake Levers",
		customerName: "Amit Patil",
		serialNumber: "ZNT-CNC-882",
		dateFiled: "2026-03-15",
		reason: "Physical crash impact damage on right lever end.",
		status: "Rejected",
		resolutionNotes: "Inspection revealed severe vehicular drop impact. Accidental damage not covered under manufacturer defect warranty."
	}
];
var MOCK_ADMIN_TEAM = [
	{
		id: "team_01",
		name: "Vikram Malhotra",
		email: "admin@riderzpro.com",
		role: "Super Admin",
		status: "Active",
		avatarInitials: "VM",
		lastActive: "Just now",
		permissions: {
			orders: true,
			sellers: true,
			riders: true,
			products: true,
			payments: true,
			settings: true
		}
	},
	{
		id: "team_02",
		name: "Aarti Deshpande",
		email: "aarti.d@riderzpro.com",
		role: "Operations",
		status: "Active",
		avatarInitials: "AD",
		lastActive: "14 mins ago",
		permissions: {
			orders: true,
			sellers: true,
			riders: true,
			products: true,
			payments: false,
			settings: false
		}
	},
	{
		id: "team_03",
		name: "Karan Johar",
		email: "karan.j@riderzpro.com",
		role: "Support",
		status: "Active",
		avatarInitials: "KJ",
		lastActive: "42 mins ago",
		permissions: {
			orders: true,
			sellers: false,
			riders: false,
			products: false,
			payments: false,
			settings: false
		}
	},
	{
		id: "team_04",
		name: "Sunil Mehra",
		email: "sunil.mehra@riderzpro.com",
		role: "Finance",
		status: "Active",
		avatarInitials: "SM",
		lastActive: "2 hours ago",
		permissions: {
			orders: true,
			sellers: true,
			riders: true,
			products: false,
			payments: true,
			settings: false
		}
	},
	{
		id: "team_05",
		name: "Anjali Verma",
		email: "anjali.v@riderzpro.com",
		role: "Operations",
		status: "Invited",
		avatarInitials: "AV",
		lastActive: "Pending Invite",
		permissions: {
			orders: true,
			sellers: true,
			riders: true,
			products: true,
			payments: false,
			settings: false
		}
	}
];
var MOCK_ADMIN_NOTIFICATIONS = [
	{
		id: "notif_01",
		title: "⚡ Bengaluru Flash Monsoon Surge Active",
		body: "Riders in Whitefield, Bellandur and Indiranagar are earning ₹35 extra per EV delivery during peak rains.",
		channel: "Push Notification",
		targetAudience: "Active Riders",
		sentAt: "2026-04-14T08:00:00Z",
		reachCount: 142,
		openRate: "88.4%"
	},
	{
		id: "notif_02",
		title: "Weekend EV Battery Maintenance Camp @ HSR Hub",
		body: "Free BMS state-of-health diagnostics for all registered Ather & Ola riders this Saturday.",
		channel: "SMS",
		targetAudience: "Bengaluru Users",
		sentAt: "2026-04-12T10:30:00Z",
		reachCount: 1850,
		openRate: "94.1%"
	},
	{
		id: "notif_03",
		title: "Exclusive 15% OFF Ceramic Brakes & Safety Gear",
		body: "Apply code HELMETSAFE for verified ISI & ECE 22.06 gear delivered in 3 hours.",
		channel: "Email",
		targetAudience: "High-Value Buyers",
		sentAt: "2026-04-09T14:15:00Z",
		reachCount: 620,
		openRate: "42.8%"
	},
	{
		id: "notif_04",
		title: "GST Compliance & Tax Invoice Updates for April 2026",
		body: "Important advisory regarding HSN 8714 EV parts and input tax credit filing deadlines.",
		channel: "Email",
		targetAudience: "All Customers",
		sentAt: "2026-04-02T11:00:00Z",
		reachCount: 2400,
		openRate: "38.5%"
	}
];
function mapCategoryToAdmin(cat) {
	switch (cat) {
		case "Battery":
		case "BMS": return "Batteries";
		case "Charger": return "Chargers";
		case "Motor":
		case "Controller": return "Motors & Controllers";
		case "Brakes":
		case "Spare Parts": return "Brakes & Suspension";
		case "Riding Gear & Helmets": return "Riding Gear";
		default: return "Body & Accessories";
	}
}
var AdminStoreContext = (0, import_react.createContext)(null);
function AdminStoreProvider({ children }) {
	const vendorStore = useVendorStore();
	const [theme, setTheme] = (0, import_react.useState)("light");
	const [bikes] = (0, import_react.useState)(MOCK_ADMIN_BIKES);
	const [customers, setCustomers] = (0, import_react.useState)(MOCK_ADMIN_CUSTOMERS);
	const [mockSellers, setMockSellers] = (0, import_react.useState)(MOCK_ADMIN_SELLERS);
	const [riders, setRiders] = (0, import_react.useState)(MOCK_ADMIN_RIDERS);
	const [mockProducts, setMockProducts] = (0, import_react.useState)(MOCK_ADMIN_PRODUCTS);
	const [orders, setOrders] = (0, import_react.useState)(MOCK_ADMIN_ORDERS);
	const [tickets, setTickets] = (0, import_react.useState)(MOCK_ADMIN_TICKETS);
	const [transactions, setTransactions] = (0, import_react.useState)(MOCK_ADMIN_TRANSACTIONS);
	const [coupons, setCoupons] = (0, import_react.useState)(MOCK_ADMIN_COUPONS);
	const [reviews, setReviews] = (0, import_react.useState)(MOCK_ADMIN_REVIEWS);
	const [warrantyClaims, setWarrantyClaims] = (0, import_react.useState)(MOCK_ADMIN_WARRANTY);
	const [team, setTeam] = (0, import_react.useState)(MOCK_ADMIN_TEAM);
	const [notifications, setNotifications] = (0, import_react.useState)(MOCK_ADMIN_NOTIFICATIONS);
	const sellers = (0, import_react.useMemo)(() => {
		const fromVendors = vendorStore.vendors.map((v) => {
			let kycStatus = "Pending";
			if (v.status === "approved") kycStatus = "Approved";
			else if (v.status === "rejected") kycStatus = "Rejected";
			else if (v.status === "changes_requested") kycStatus = "Changes Requested";
			else if (v.status === "suspended") kycStatus = "Suspended";
			return {
				id: v.id,
				businessName: v.storeName || v.businessName,
				ownerName: v.onboarding?.account?.fullName || v.businessName,
				phone: v.phone,
				email: v.email,
				city: v.area || "Bengaluru",
				gstin: v.onboarding?.tax?.gstExempt ? "EXEMPT" : v.onboarding?.tax?.gstin || "N/A",
				kycStatus,
				rejectionReason: v.rejectionReason,
				commissionRate: v.commissionRate,
				rating: v.rating,
				totalSales: v.totalSales,
				activeProductsCount: v.activeProductsCount,
				bankAccount: v.onboarding?.bank?.maskedAccountNumber || "Masked A/C",
				joinedDate: new Date(v.createdAt).toLocaleDateString("en-IN"),
				vendorRecord: v
			};
		});
		const vendorIds = new Set(fromVendors.map((s) => s.id));
		const nonDuplicatedMocks = mockSellers.filter((s) => !vendorIds.has(s.id));
		return [...fromVendors, ...nonDuplicatedMocks];
	}, [vendorStore.vendors, mockSellers]);
	const products = (0, import_react.useMemo)(() => {
		const fromVendorProducts = vendorStore.products.map((vp) => {
			let status = "Active";
			if (vp.status === "pending_review") status = "Pending Review";
			else if (vp.status === "live") status = vp.stock <= (vp.minStockAlert || 5) ? "Low Stock" : "Active";
			else status = "Pending Review";
			return {
				id: vp.id,
				title: vp.title,
				sku: vp.sku,
				category: mapCategoryToAdmin(vp.category),
				sellerId: vp.vendorId,
				sellerName: vp.vendorName,
				price: vp.mrp,
				discountPrice: vp.sellingPrice,
				stock: vp.stock,
				minStockThreshold: vp.minStockAlert,
				status,
				warrantyMonths: vp.warrantyMonths,
				specs: Object.fromEntries(Object.entries(vp.specs || {}).map(([k, v]) => [k, String(v)])),
				compatibleBikes: vp.fits,
				imageUrl: vp.images?.[0] || "https://images.unsplash.com/photo-1558441719-8b489c652758?w=500&auto=format&fit=crop&q=80",
				rating: 5,
				reviewsCount: 0,
				salesCount: 0,
				vendorProductRecord: vp,
				pendingRevision: vp.pendingRevision
			};
		});
		const vpIds = new Set(fromVendorProducts.map((p) => p.id));
		const nonDuplicatedMocks = mockProducts.filter((p) => !vpIds.has(p.id));
		return [...fromVendorProducts, ...nonDuplicatedMocks];
	}, [vendorStore.products, mockProducts]);
	const [deliverySettings, setDeliverySettings] = (0, import_react.useState)({
		activeCities: [
			"Bengaluru",
			"Hyderabad",
			"Chennai",
			"Pune",
			"Mumbai"
		],
		serviceRadiusKm: 25,
		baseDeliveryFee: 40,
		perKmRate: 12,
		freeDeliveryThreshold: 5e3,
		surgeMultiplier: 1
	});
	const toggleTheme = (0, import_react.useCallback)(() => {
		setTheme((prev) => prev === "dark" ? "light" : "dark");
	}, []);
	const updateOrderStatus = (0, import_react.useCallback)((orderId, status, riderId, notes) => {
		setOrders((prev) => prev.map((o) => {
			if (o.id !== orderId) return o;
			const matchedRider = riderId ? riders.find((r) => r.id === riderId) : void 0;
			return {
				...o,
				status,
				riderId: riderId ?? o.riderId,
				riderName: matchedRider ? `${matchedRider.name} (${matchedRider.phone})` : o.riderName,
				notes: notes ?? o.notes
			};
		}));
		toast.success(`Order status updated to ${status}`);
	}, [riders]);
	const cancelOrder = (0, import_react.useCallback)((orderId, reason = "Cancelled by operations") => {
		setOrders((prev) => prev.map((o) => o.id === orderId ? {
			...o,
			status: "Cancelled",
			notes: reason,
			paymentStatus: "Refunded"
		} : o));
		toast.error("Order cancelled & refund queued");
	}, []);
	const refundOrder = (0, import_react.useCallback)((orderId, reason = "Refund approved by admin") => {
		setOrders((prev) => prev.map((o) => o.id === orderId ? {
			...o,
			paymentStatus: "Refunded",
			notes: reason
		} : o));
		toast.success("Refund processed successfully via Razorpay");
	}, []);
	const reassignRider = (0, import_react.useCallback)((orderId, riderId) => {
		const rider = riders.find((r) => r.id === riderId);
		if (!rider) return;
		setOrders((prev) => prev.map((o) => o.id === orderId ? {
			...o,
			riderId: rider.id,
			riderName: `${rider.name} (${rider.phone})`
		} : o));
		toast.success(`Assigned to ${rider.name}`);
	}, [riders]);
	const toggleCustomerBlock = (0, import_react.useCallback)((customerId) => {
		setCustomers((prev) => prev.map((c) => {
			if (c.id !== customerId) return c;
			const nextStatus = c.status === "Blocked" ? "Active" : "Blocked";
			toast.info(`Customer account ${nextStatus.toLowerCase()}`);
			return {
				...c,
				status: nextStatus
			};
		}));
	}, []);
	const approveSellerKyc = (0, import_react.useCallback)((sellerId, commissionRate = 10, tier = "Standard") => {
		if (vendorStore.vendors.some((v) => v.id === sellerId)) vendorStore.approveVendor(sellerId, commissionRate, tier);
		else {
			setMockSellers((prev) => prev.map((s) => s.id === sellerId ? {
				...s,
				kycStatus: "Approved",
				rejectionReason: void 0,
				commissionRate
			} : s));
			toast.success("Seller KYC approved successfully");
		}
	}, [vendorStore]);
	const requestSellerChanges = (0, import_react.useCallback)((sellerId, sections, notes) => {
		if (vendorStore.vendors.some((v) => v.id === sellerId)) vendorStore.requestVendorChanges(sellerId, sections, notes);
		else {
			setMockSellers((prev) => prev.map((s) => s.id === sellerId ? {
				...s,
				kycStatus: "Changes Requested",
				rejectionReason: notes
			} : s));
			toast.info("Changes requested from seller");
		}
	}, [vendorStore]);
	const rejectSellerKyc = (0, import_react.useCallback)((sellerId, reason) => {
		if (vendorStore.vendors.some((v) => v.id === sellerId)) vendorStore.rejectVendor(sellerId, reason);
		else {
			setMockSellers((prev) => prev.map((s) => s.id === sellerId ? {
				...s,
				kycStatus: "Rejected",
				rejectionReason: reason
			} : s));
			toast.error("Seller KYC rejected");
		}
	}, [vendorStore]);
	const suspendSeller = (0, import_react.useCallback)((sellerId, reason = "Suspended by admin") => {
		if (vendorStore.vendors.some((v) => v.id === sellerId)) vendorStore.suspendVendor(sellerId, reason);
		else {
			setMockSellers((prev) => prev.map((s) => s.id === sellerId ? {
				...s,
				kycStatus: "Suspended",
				rejectionReason: reason
			} : s));
			toast.error("Seller suspended");
		}
	}, [vendorStore]);
	const reinstateSeller = (0, import_react.useCallback)((sellerId) => {
		if (vendorStore.vendors.some((v) => v.id === sellerId)) vendorStore.reinstateVendor(sellerId);
		else {
			setMockSellers((prev) => prev.map((s) => s.id === sellerId ? {
				...s,
				kycStatus: "Approved",
				rejectionReason: void 0
			} : s));
			toast.success("Seller reinstated to active status");
		}
	}, [vendorStore]);
	const updateSellerCommission = (0, import_react.useCallback)((sellerId, commissionRate) => {
		if (vendorStore.vendors.some((v) => v.id === sellerId)) vendorStore.updateVendor(sellerId, { commissionRate });
		setMockSellers((prev) => prev.map((s) => s.id === sellerId ? {
			...s,
			commissionRate
		} : s));
		toast.success(`Commission rate updated to ${commissionRate}%`);
	}, [vendorStore]);
	const toggleRiderStatus = (0, import_react.useCallback)((riderId, status) => {
		setRiders((prev) => prev.map((r) => r.id === riderId ? {
			...r,
			status
		} : r));
		toast.info(`Rider status changed to ${status}`);
	}, []);
	const addProduct = (0, import_react.useCallback)((data) => {
		const newProd = {
			...data,
			id: `prod_${Date.now()}`,
			rating: 5,
			reviewsCount: 0,
			salesCount: 0
		};
		setMockProducts((prev) => [newProd, ...prev]);
		toast.success("Product published to catalog");
	}, []);
	const updateProduct = (0, import_react.useCallback)((productId, updates) => {
		if (vendorStore.products.some((p) => p.id === productId)) vendorStore.updateProduct(productId, updates, { isStaffAction: true });
		setMockProducts((prev) => prev.map((p) => p.id === productId ? {
			...p,
			...updates
		} : p));
		toast.success("Product updated successfully");
	}, [vendorStore]);
	const deleteProduct = (0, import_react.useCallback)((productId) => {
		if (vendorStore.products.some((p) => p.id === productId)) vendorStore.deleteProduct(productId, { isStaffAction: true });
		setMockProducts((prev) => prev.filter((p) => p.id !== productId));
		toast.info("Product removed from catalog");
	}, [vendorStore]);
	const approveProductReview = (0, import_react.useCallback)((productId, adminEdits) => {
		if (vendorStore.products.some((p) => p.id === productId)) vendorStore.approveProduct(productId, adminEdits);
		else {
			setMockProducts((prev) => prev.map((p) => p.id === productId ? {
				...p,
				status: "Active",
				...adminEdits
			} : p));
			toast.success("Product approved and is now LIVE!");
		}
	}, [vendorStore]);
	const requestProductReviewChanges = (0, import_react.useCallback)((productId, comments) => {
		if (vendorStore.products.some((p) => p.id === productId)) vendorStore.requestProductChanges(productId, comments);
		else toast.info("Requested revisions on product");
	}, [vendorStore]);
	const rejectProductReview = (0, import_react.useCallback)((productId, reason) => {
		if (vendorStore.products.some((p) => p.id === productId)) vendorStore.rejectProduct(productId, reason);
		else {
			setMockProducts((prev) => prev.filter((p) => p.id !== productId));
			toast.error("Product rejected from catalog");
		}
	}, [vendorStore]);
	const approveAllPending = (0, import_react.useCallback)(() => {
		vendorStore.vendors.filter((v) => v.status === "submitted" || v.status === "under_review").forEach((v) => {
			vendorStore.approveVendor(v.id, 10, "Standard");
		});
		vendorStore.products.filter((p) => p.status === "pending_review").forEach((p) => {
			vendorStore.approveProduct(p.id);
		});
		setMockProducts((prev) => prev.map((p) => p.status === "Pending Review" ? {
			...p,
			status: "Active"
		} : p));
		toast.success("Demo Mode: Approved all pending sellers and products!");
	}, [vendorStore]);
	const addCoupon = (0, import_react.useCallback)((data) => {
		const newCoupon = {
			...data,
			id: `cpn_${Date.now()}`,
			usageCount: 0
		};
		setCoupons((prev) => [newCoupon, ...prev]);
		toast.success(`Coupon code ${data.code} created`);
	}, []);
	const toggleCouponActive = (0, import_react.useCallback)((couponId) => {
		setCoupons((prev) => prev.map((c) => c.id === couponId ? {
			...c,
			isActive: !c.isActive
		} : c));
		toast.info("Coupon status updated");
	}, []);
	const deleteCoupon = (0, import_react.useCallback)((couponId) => {
		setCoupons((prev) => prev.filter((c) => c.id !== couponId));
		toast.info("Coupon deleted");
	}, []);
	const replyToTicket = (0, import_react.useCallback)((ticketId, text) => {
		setTickets((prev) => prev.map((t) => {
			if (t.id !== ticketId) return t;
			const newMsg = {
				id: `msg_${Date.now()}`,
				sender: "agent",
				senderName: "Operations Support",
				text,
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			};
			return {
				...t,
				messages: [...t.messages, newMsg],
				status: "In Progress"
			};
		}));
		toast.success("Reply sent to customer");
	}, []);
	const updateTicketStatus = (0, import_react.useCallback)((ticketId, status) => {
		setTickets((prev) => prev.map((t) => t.id === ticketId ? {
			...t,
			status
		} : t));
		toast.info(`Ticket status: ${status}`);
	}, []);
	const moderateReview = (0, import_react.useCallback)((reviewId, status) => {
		setReviews((prev) => prev.map((r) => r.id === reviewId ? {
			...r,
			status
		} : r));
		toast.info(`Review ${status.toLowerCase()}`);
	}, []);
	const resolveWarrantyClaim = (0, import_react.useCallback)((claimId, status, notes) => {
		setWarrantyClaims((prev) => prev.map((w) => w.id === claimId ? {
			...w,
			status,
			resolutionNotes: notes || w.resolutionNotes
		} : w));
		toast.success(`Warranty claim updated: ${status}`);
	}, []);
	const inviteTeamMember = (0, import_react.useCallback)((data) => {
		const initials = data.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
		const newMember = {
			...data,
			id: `team_${Date.now()}`,
			status: "Invited",
			lastActive: "Pending Invite",
			avatarInitials: initials
		};
		setTeam((prev) => [...prev, newMember]);
		toast.success(`Invitation sent to ${data.email}`);
	}, []);
	const removeTeamMember = (0, import_react.useCallback)((memberId) => {
		setTeam((prev) => prev.filter((m) => m.id !== memberId));
		toast.info("Team member access revoked");
	}, []);
	const sendNotificationCampaign = (0, import_react.useCallback)((title, body, channel, targetAudience) => {
		const reachCount = targetAudience === "All Customers" ? 2840 : targetAudience === "Bengaluru Users" ? 1420 : 640;
		const newNotif = {
			id: `notif_${Date.now()}`,
			title,
			body,
			channel,
			targetAudience,
			sentAt: (/* @__PURE__ */ new Date()).toISOString(),
			reachCount,
			openRate: "Pending"
		};
		setNotifications((prev) => [newNotif, ...prev]);
		toast.success(`Notification broadcast dispatched to ${reachCount} users`);
	}, []);
	const updateDeliverySettings = (0, import_react.useCallback)((updates) => {
		setDeliverySettings((prev) => ({
			...prev,
			...updates
		}));
		toast.success("Delivery configuration updated");
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		theme,
		toggleTheme,
		bikes,
		customers,
		sellers,
		riders,
		products,
		orders,
		tickets,
		transactions,
		coupons,
		reviews,
		warrantyClaims,
		team,
		notifications,
		deliverySettings,
		updateOrderStatus,
		cancelOrder,
		refundOrder,
		reassignRider,
		toggleCustomerBlock,
		approveSellerKyc,
		requestSellerChanges,
		rejectSellerKyc,
		suspendSeller,
		reinstateSeller,
		updateSellerCommission,
		toggleRiderStatus,
		addProduct,
		updateProduct,
		deleteProduct,
		approveProductReview,
		requestProductReviewChanges,
		rejectProductReview,
		approveAllPending,
		addCoupon,
		toggleCouponActive,
		deleteCoupon,
		replyToTicket,
		updateTicketStatus,
		moderateReview,
		resolveWarrantyClaim,
		inviteTeamMember,
		removeTeamMember,
		sendNotificationCampaign,
		updateDeliverySettings
	}), [
		theme,
		toggleTheme,
		bikes,
		customers,
		sellers,
		riders,
		products,
		orders,
		tickets,
		transactions,
		coupons,
		reviews,
		warrantyClaims,
		team,
		notifications,
		deliverySettings,
		updateOrderStatus,
		cancelOrder,
		refundOrder,
		reassignRider,
		toggleCustomerBlock,
		approveSellerKyc,
		requestSellerChanges,
		rejectSellerKyc,
		suspendSeller,
		reinstateSeller,
		updateSellerCommission,
		toggleRiderStatus,
		addProduct,
		updateProduct,
		deleteProduct,
		approveProductReview,
		requestProductReviewChanges,
		rejectProductReview,
		approveAllPending,
		addCoupon,
		toggleCouponActive,
		deleteCoupon,
		replyToTicket,
		updateTicketStatus,
		moderateReview,
		resolveWarrantyClaim,
		inviteTeamMember,
		removeTeamMember,
		sendNotificationCampaign,
		updateDeliverySettings
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminStoreContext.Provider, {
		value,
		children
	});
}
function useAdminStore() {
	const ctx = (0, import_react.useContext)(AdminStoreContext);
	if (!ctx) throw new Error("useAdminStore must be used within an AdminStoreProvider");
	return ctx;
}
//#endregion
export { useAdminStore as n, AdminStoreProvider as t };
