// Using built-in fetch (Node.js 18+)

async function testAPI() {
  try {
    console.log('🔄 Testing Products API...');
    const response = await fetch('http://localhost:5000/api/v1/product?limit=3&skip=0');
    const data = await response.json();
    
    console.log('📡 Products Response Status:', response.status);
    console.log('✅ Success:', data.success);
    console.log('📊 Data Count:', data.data?.length || 0);
    
    if (data.data && data.data.length > 0) {
      const firstProduct = data.data[0];
      console.log('🛍️ First Product:');
      console.log('  - ID:', firstProduct.id);
      console.log('  - Name:', firstProduct.name);
      console.log('  - Category:', firstProduct.category);
      console.log('  - Images:', firstProduct.images?.length || 0, 'images');
      console.log('  - First Image URL:', firstProduct.images?.[0]?.url);
      console.log('  - Price:', firstProduct.price);
      console.log('  - Brand:', firstProduct.brandName);
      
      // Test single product API
      console.log('\n🔄 Testing Single Product API...');
      const singleResponse = await fetch(`http://localhost:5000/api/v1/product/${firstProduct.id}`);
      const singleData = await singleResponse.json();
      
      console.log('📡 Single Product Response Status:', singleResponse.status);
      console.log('✅ Single Product Success:', singleData.success);
      console.log('🛍️ Single Product Name:', singleData.data?.name);
      console.log('🖼️ Single Product Images:', singleData.data?.images?.length || 0);
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAPI();