export function formatPrice(price: number | string): string {
    const num = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(num)) return 'NPR 0';

    return new Intl.NumberFormat('en-NP', {
        style: 'currency',
        currency: 'NPR',
        maximumFractionDigits: 0,
    }).format(num).replace('NPR', 'Rs.');
}

export function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}
