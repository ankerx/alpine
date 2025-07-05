function productStore() {
    return {
        product: {},
        recommendations: [],
        cart: [],
        loading: false,
        error: null,
        
        async init() {
            await this.fetchProduct();
            await this.fetchRecommendations();
        },
        
        async fetchProduct() {
            try {
                this.loading = true;
                this.error = null;
                
                const response = await fetch('/api/product');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                this.product = data|| {};
                    
                console.log('Product fetched from API:', this.product, 'product');
            } catch (error) {
                console.error('Error fetching product:', error);
                this.error = 'Failed to load product. Please try again.';
            } finally {
                this.loading = false;
            }
        },
        
        async fetchRecommendations() {
            try {
                const response = await fetch('/api/recommendations');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                this.recommendations = data || [];
                
                console.log('Recommendations fetched from API:', this.recommendations.length, 'items');
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        },
    }
}

document.addEventListener('alpine:init', () => {
    Alpine.data('productStore', productStore);
    
    Alpine.store('cart', {
        items: [],
        total: 0,
        
        add(product, quantity = 1) {
            const existing = this.items.find(item => item.id === product.id);
            if (existing) {
                existing.quantity += quantity;
            } else {
                this.items.push({ ...product, quantity });
            }
            this.updateTotal();
        },
        
        remove(productId) {
            this.items = this.items.filter(item => item.id !== productId);
            this.updateTotal();
        },
        
        updateTotal() {
            this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }
    });
});

