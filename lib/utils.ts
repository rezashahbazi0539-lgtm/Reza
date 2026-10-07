export function formatPrice(price) {
  return `₺${Number(price).toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export function formatDateTime(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' +
    d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
}

export function slugify(text) {
  const map = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u' };
  return text.toString().toLowerCase()
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, ch => map[ch] || ch)
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function getEffectivePrice(product) {
  return product.discountPrice != null ? product.discountPrice : product.price;
}

export function getDiscountPercent(product) {
  if (product.discountPrice != null && product.discountPrice < product.price) {
    return Math.round(((product.price - product.discountPrice) / product.price) * 100);
  }
  return 0;
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
