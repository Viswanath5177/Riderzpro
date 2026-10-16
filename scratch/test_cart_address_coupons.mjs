import http from 'http';

const BASE_URL = 'http://localhost:8080';

async function request(path, options = {}) {
  const url = new URL(path, BASE_URL);
  const method = options.method || 'GET';
  const headers = options.headers || {};
  let body = options.body;
  if (body && typeof body === 'object') {
    body = JSON.stringify(body);
    headers['Content-Type'] = 'application/json';
  }

  return new Promise((resolve, reject) => {
    const req = http.request(url, { method, headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, data: parsed, raw: data });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, data: null, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('  RIDERZPRO E2E INTEGRATION & SECURITY SUITE');
  console.log('====================================================\n');
  let passCount = 0;
  let failCount = 0;

  function assert(desc, condition, details = '') {
    if (condition) {
      console.log(`  ✓ PASS: ${desc}`);
      passCount++;
    } else {
      console.error(`  ✗ FAIL: ${desc} ${details ? `(${details})` : ''}`);
      failCount++;
    }
  }

  try {
    const customer1Id = 'cst_aarav_01';
    const customer2Id = 'cst_priya_02';
    const validProductId = 'prod_bc5ffe23c38f'; // Lithium LiFePO4 Smart Battery Pack 60V 30Ah
    const otherVendorProductId = 'prod_490bd88dedbc'; // Rapid Smart Charger 72V 10A (owned by sel_apex_02)
    const vendor1Id = 'sel_volthub_01'; // Owner of prod_bc5ffe23c38f

    // ------------------------------------------------------------------
    // TEST 1: Cart API & Empty Cart Count
    // ------------------------------------------------------------------
    console.log('[TEST 1] Empty Cart & Badge Count:');
    
    // Clear any leftover cart for customer1
    await request(`/api/cart?customerId=${customer1Id}`, { method: 'DELETE' });

    const getCartEmpty = await request(`/api/cart?customerId=${customer1Id}`);
    assert('Empty cart returns 200', getCartEmpty.status === 200);
    assert('Empty cart has 0 items', getCartEmpty.data?.items?.length === 0, `Length: ${getCartEmpty.data?.items?.length}`);
    assert('Empty cart badge count is 0', getCartEmpty.data?.count === 0, `Count: ${getCartEmpty.data?.count}`);

    // ------------------------------------------------------------------
    // TEST 2: Add Real DB Product to Cart
    // ------------------------------------------------------------------
    console.log('\n[TEST 2] Cart Synchronization with Real Database Product:');
    const addRes = await request('/api/cart', {
      method: 'POST',
      body: {
        customerId: customer1Id,
        productId: validProductId,
        vendorId: vendor1Id,
        qty: 2
      }
    });
    assert('Adding valid DB product returns 200/success', addRes.status === 200 && addRes.data?.success);

    const getCart1 = await request(`/api/cart?customerId=${customer1Id}`);
    assert('Cart items count is 1', getCart1.data?.items?.length === 1);
    assert('Cart total qty count is 2', getCart1.data?.count === 2, `Count: ${getCart1.data?.count}`);
    assert('Cart item product ID matches prod_bc5ffe23c38f', getCart1.data?.items?.[0]?.product_id === validProductId);

    // ------------------------------------------------------------------
    // TEST 3: Clear Cart & Verify No Phantom Badge
    // ------------------------------------------------------------------
    console.log('\n[TEST 3] Clear Cart & Verify Complete DB Cleanup:');
    const delRes = await request(`/api/cart?customerId=${customer1Id}`, { method: 'DELETE' });
    assert('DELETE /api/cart returns 200', delRes.status === 200 && delRes.data?.success);

    const getCartClean = await request(`/api/cart?customerId=${customer1Id}`);
    assert('Cart items count returns 0', getCartClean.data?.items?.length === 0);
    assert('Cart badge total returns 0', getCartClean.data?.count === 0);

    // ------------------------------------------------------------------
    // TEST 4: Address Management & Scoping Security
    // ------------------------------------------------------------------
    console.log('\n[TEST 4] Database-Backed Addresses & Security Scoping:');

    // Case A: Customer without addresses
    const freshCustId = 'cst_fresh_tester_' + Date.now();
    const noAddrRes = await request(`/api/customer/addresses?customerId=${freshCustId}`);
    assert('Customer without addresses returns empty array (Case A)', Array.isArray(noAddrRes.data?.addresses) && noAddrRes.data.addresses.length === 0);

    // Case B: Add address for customer 1
    const newAddressPayload = {
      customerId: customer1Id,
      full_name: 'Aarav Sharma',
      phone: '9876543210',
      address_line1: 'Flat 102, Shanti Vihar',
      address_line2: '12th Cross, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postal_code: '560038',
      address_type: 'Home',
      delivery_instructions: 'Ring doorbell twice',
      is_default: 1
    };
    const addAddrRes = await request('/api/customer/addresses', {
      method: 'POST',
      body: newAddressPayload
    });
    assert('POST /api/customer/addresses creates address (Case B)', (addAddrRes.status === 200 || addAddrRes.status === 201) && addAddrRes.data?.success);
    const createdAddrId = addAddrRes.data?.address?.id;
    assert('Created address has valid ID', Boolean(createdAddrId));

    // Retrieve addresses for customer 1
    const cust1Addresses = await request(`/api/customer/addresses?customerId=${customer1Id}`);
    assert('Customer 1 has at least 1 address', cust1Addresses.data?.addresses?.length >= 1);
    const foundAddr = cust1Addresses.data?.addresses?.find(a => a.id === createdAddrId);
    assert('Created address matches stored data', foundAddr?.phone === '9876543210' && (foundAddr?.label === 'Home' || foundAddr?.address_type === 'Home'));

    // PUT: Update address
    const updateAddrRes = await request('/api/customer/addresses', {
      method: 'PUT',
      body: {
        id: createdAddrId,
        customerId: customer1Id,
        phone: '9988776655',
        delivery_instructions: 'Leave at security gate',
        is_default: 1
      }
    });
    assert('PUT /api/customer/addresses updates address', updateAddrRes.status === 200 && updateAddrRes.data?.success);

    // Security check: Customer 2 cannot update Customer 1's address
    const breachRes = await request('/api/customer/addresses', {
      method: 'PUT',
      body: {
        id: createdAddrId,
        customerId: customer2Id, // Cross-customer tampering
        phone: '1111111111'
      }
    });
    assert('Cross-customer address update is rejected/scoped (no breach)', breachRes.status === 404 || breachRes.data?.success === false);

    // ------------------------------------------------------------------
    // TEST 5: Vendor Coupon Creation & Ownership Validation
    // ------------------------------------------------------------------
    console.log('\n[TEST 5] Vendor Coupon Creation & Security Validation:');
    const couponCode = `E2E_${Date.now().toString().slice(-4)}`;

    const createCouponRes = await request('/api/vendor/coupons', {
      method: 'POST',
      body: {
        seller_id: vendor1Id,
        code: couponCode,
        description: 'E2E Test 15% discount for lithium battery pack',
        discount_type: 'percentage',
        discount_value: 15,
        minimum_order_value: 500,
        maximum_discount: 1000,
        starts_at: '2026-01-01',
        expires_at: '2027-12-31',
        usage_limit: 50,
        per_customer_limit: 2,
        product_ids: [validProductId]
      }
    });
    assert('Vendor can create coupon attached to owned product', (createCouponRes.status === 200 || createCouponRes.status === 201) && createCouponRes.data?.success, createCouponRes.data?.error);
    const createdCoupon = createCouponRes.data?.coupon;
    const createdCouponId = createdCoupon?.id;

    // Security check: Vendor attempts to attach product owned by another seller
    const illegalCouponRes = await request('/api/vendor/coupons', {
      method: 'POST',
      body: {
        seller_id: vendor1Id, // sel_volthub_01
        code: `ILLEGAL_${Date.now().toString().slice(-4)}`,
        description: 'Unauthorized coupon for apex product',
        discount_type: 'percentage',
        discount_value: 20,
        product_ids: [otherVendorProductId] // Owned by sel_apex_02, NOT sel_volthub_01!
      }
    });
    assert('Backend rejects coupon for other vendor\'s products with 403 Unauthorized', illegalCouponRes.status === 403, `Status: ${illegalCouponRes.status}`);

    // ------------------------------------------------------------------
    // TEST 6: Flipkart-Style Offers API on Product Page
    // ------------------------------------------------------------------
    console.log('\n[TEST 6] Product Page Applicable Offers API:');
    const offersRes = await request(`/api/coupons/applicable?product_id=${validProductId}`);
    assert('GET /api/coupons/applicable returns 200', offersRes.status === 200 && offersRes.data?.success);
    const foundCoupon = offersRes.data?.coupons?.find(c => c.code === couponCode);
    assert(`Created coupon ${couponCode} is listed in available offers`, Boolean(foundCoupon));
    assert('Available offer includes discount terms and seller name', foundCoupon?.discount_value === 15 && Boolean(foundCoupon?.seller_name || foundCoupon?.store_name));

    // Test coupon deactivation excludes it from available offers
    await request(`/api/vendor/coupons/${createdCouponId}`, {
      method: 'PUT',
      body: { status: 'inactive' }
    });
    const inactiveOffersRes = await request(`/api/coupons/applicable?product_id=${validProductId}`);
    const foundInactive = inactiveOffersRes.data?.coupons?.find(c => c.code === couponCode);
    assert('Deactivated coupon is automatically hidden from Available Offers', !foundInactive);

    // Clean up test coupon
    if (createdCouponId) {
      await request(`/api/vendor/coupons/${createdCouponId}`, { method: 'DELETE' });
    }

    // Clean up created address
    if (createdAddrId) {
      await request(`/api/customer/addresses?id=${createdAddrId}&customerId=${customer1Id}`, { method: 'DELETE' });
    }

    console.log('\n====================================================');
    console.log(`  E2E TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
    console.log('====================================================\n');

    if (failCount > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (err) {
    console.error('Test execution error:', err);
    process.exit(1);
  }
}

runTests();
