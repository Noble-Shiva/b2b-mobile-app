# API Client ID Implementation

## Overview
The `client_id` parameter has been automatically added to all POST and GET requests across the application. This ensures that every API call to the backend includes the required `client_id` parameter either in the request body (POST) or as a query parameter (GET).

## Implementation Details

### 1. Centralized Configuration (`api/config.ts`)
- Created a new centralized configuration file
- Contains the `client_id` value in one place
- Easy to update when the value changes in the future

```typescript
export const API_CONFIG = {
  clientId: 'ac_0123',
  // ... other config
};
```

### 2. Generic API Client (`api/client.ts`)
- Modified the generic `post` method to automatically append `client_id` to request body
- Modified the generic `get` method to automatically append `client_id` as query parameter
- All POST and GET requests using this client will automatically include the parameter
- No changes needed in individual API calls

```typescript
// POST requests - client_id in body
export const post = <T>(endpoint: string, body: any): Promise<T> => {
  const requestBody = {
    ...body,
    client_id: apiConfig.clientId,
  };
  // ... rest of implementation
};

// GET requests - client_id as query parameter
export const get = <T>(endpoint: string, params?: Record<string, string>): Promise<T> => {
  const allParams = {
    ...params,
    client_id: apiConfig.clientId,
  };
  const url = `${endpoint}?${new URLSearchParams(allParams)}`;
  // ... rest of implementation
};
```

### 3. Direct Axios Calls
- Updated all direct axios calls in `auth.ts` and `profile.ts`
- Each POST request now includes `client_id` in the request body
- Each GET request now includes `client_id` as a query parameter
- Maintains backward compatibility

## Files Modified

### Core Changes
- `api/config.ts` - New centralized configuration file
- `api/client.ts` - Generic POST method now auto-appends client_id
- `api/auth.ts` - All authentication endpoints include client_id
- `api/profile.ts` - All profile/address endpoints include client_id

### APIs Affected
- **Authentication**: OTP send/verify, user registration, profile editing, user details fetching
- **Orders**: Order creation, payment confirmation, order retrieval
- **Profile**: Address management, profile updates
- **Categories**: Category and product fetching
- **Products**: Featured products, product details, brand products (now using POST with client_id)
- **Any future API**: Will automatically include client_id if using the generic client

## Benefits

1. **Single Point of Change**: Update `client_id` in one place (`api/config.ts`)
2. **Automatic Inclusion**: No need to manually add `client_id` to new API calls
3. **Consistency**: All POST requests automatically include the required parameter
4. **Maintainability**: Easy to manage and update across the entire application

## Future Updates

To change the `client_id` value:
1. Open `api/config.ts`
2. Update the `clientId` value
3. All API calls will automatically use the new value

## Example Usage

```typescript
// POST requests - client_id automatically added to body
const response = await post('/endpoint', {
  data: 'value'
  // client_id is automatically added to request body
});

// GET requests - client_id automatically added as query parameter
const response = await get('/endpoint', { 
  filter: 'active' 
  // client_id is automatically added as ?client_id=ac_0123
});

// Result: /endpoint?filter=active&client_id=ac_0123

// Product API calls now use POST with client_id
const products = await fetchFeaturedProducts(); // Uses POST /products with client_id
const product = await fetchProductById('123'); // Uses POST /products/123 with client_id
```

## Testing

All existing functionality should work exactly as before, but now every POST request will automatically include the `client_id` parameter that your backend expects.
