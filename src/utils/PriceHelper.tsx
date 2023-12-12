export function formatPrice(price: string) {
  return `${parseFloat(price).toFixed(2)}€`;
}
