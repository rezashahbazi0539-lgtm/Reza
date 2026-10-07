const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const img = (seed, w = 600, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

async function main() {
  console.log('🌱 Seeding City Nail database...');

  // Clean slate
  await prisma.$transaction([
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.review.deleteMany(),
    prisma.wishlist.deleteMany(),
    prisma.address.deleteMany(),
    prisma.couponUsage.deleteMany(),
    prisma.coupon.deleteMany(),
    prisma.campaign.deleteMany(),
    prisma.banner.deleteMany(),
    prisma.blogPost.deleteMany(),
    prisma.newsletterSubscriber.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.inventoryTransaction.deleteMany(),
    prisma.productImage.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.user.deleteMany(),
    prisma.homepageSection.deleteMany(),
    prisma.siteSetting.deleteMany(),
  ]);

  // ── Categories ──
  const catData = [
    { name: 'Jel Oje', slug: 'jel-oje', description: 'Profesyonel kalitede jel ojeler. Uzun ömürlü, parlak renkler.', image: img('citynail-cat-jeloje', 400, 400), displayOrder: 1 },
    { name: 'Nail Art', slug: 'nail-art', description: 'Yaratıcı nail art ürünleri ile tırnaklarınıza sanat katın.', image: img('citynail-cat-nailart', 400, 400), displayOrder: 2 },
    { name: 'Araçlar & Fırçalar', slug: 'araclar-fircalar', description: 'Profesyonel nail art araçları ve fırçaları.', image: img('citynail-cat-araclar', 400, 400), displayOrder: 3 },
    { name: 'Dekor', slug: 'dekor', description: 'Tırnak dekorları, çiçekler, kalp ve daha fazlası.', image: img('citynail-cat-dekor', 400, 400), displayOrder: 4 },
    { name: 'Press On Nails', slug: 'press-on-nails', description: 'Hazır press on tırnaklar ile anında mükemmel manikür.', image: img('citynail-cat-presson', 400, 400), displayOrder: 5 },
    { name: 'Nail Sticker', slug: 'nail-sticker', description: 'Kolay uygulanan nail sticker ve decal koleksiyonu.', image: img('citynail-cat-sticker', 400, 400), displayOrder: 6 },
    { name: 'Nail Kitleri', slug: 'nail-kitleri', description: 'Başlangıç ve profesyonel nail art kitleri.', image: img('citynail-cat-kitler', 400, 400), displayOrder: 7 },
    { name: 'Aksesuarlar', slug: 'aksesuarlar', description: 'Tırnak aksesuarları ve süslemeleri.', image: img('citynail-cat-aksesuar', 400, 400), displayOrder: 8 },
    { name: 'Bakım', slug: 'bakim', description: 'Tırnak bakım ürünleri, yağlar ve kremler.', image: img('citynail-cat-bakim', 400, 400), displayOrder: 9 },
  ];
  const categories = {};
  for (const c of catData) {
    categories[c.slug] = await prisma.category.create({ data: { ...c, status: 'ACTIVE' } });
  }

  // ── Users ──
  const adminPass = bcrypt.hashSync('admin123', 10);
  const userPass = bcrypt.hashSync('user123', 10);

  const admin = await prisma.user.create({
    data: { email: 'admin@citynail.com', password: adminPass, name: 'Admin Kullanıcı', phone: '0532 111 22 33', role: 'SUPER_ADMIN', status: 'ACTIVE' },
  });

  const customerNames = [
    ['Zeynep', 'Yılmaz', 'zeynep@example.com', '0532 555 11 22'],
    ['Ayşe', 'Kaya', 'ayse@example.com', '0533 555 33 44'],
    ['Elif', 'Demir', 'elif@example.com', '0535 555 55 66'],
    ['Merve', 'Şahin', 'merve@example.com', '0537 555 77 88'],
    ['Selin', 'Çelik', 'selin@example.com', '0538 555 99 00'],
    ['Deniz', 'Aydın', 'deniz@example.com', '0539 555 11 33'],
    ['Buse', 'Öztürk', 'buse@example.com', '0541 555 22 44'],
    ['Ece', 'Arslan', 'ece@example.com', '0542 555 33 55'],
    ['Yağmur', 'Doğan', 'yagmur@example.com', '0543 555 44 66'],
    ['Ceren', 'Kılıç', 'ceren@example.com', '0544 555 55 77'],
  ];

  const customers = {};
  for (const [fn, ln, email, phone] of customerNames) {
    customers[email] = await prisma.user.create({
      data: { email, password: userPass, name: `${fn} ${ln}`, phone, role: 'CUSTOMER', status: 'ACTIVE' },
    });
    // Add an address
    await prisma.address.create({
      data: { userId: customers[email].id, title: 'Ev', firstName: fn, lastName: ln, phone, address: `Bağdat Cad. No:123`, city: 'İstanbul', district: 'Kadıköy', postalCode: '34700', isDefault: true },
    });
  }

  // ── Products (24) ──
  const products = [
    // Jel Oje
    { name: 'Blush Pink Jel Oje', slug: 'blush-pink-jel-oje', sku: 'CN-JO-001', cat: 'jel-oje', price: 189, discountPrice: 149, stock: 45, lowStockThreshold: 10, brand: 'City Nail', tags: 'jel oje,pembe,premium', shortDesc: 'Pastel pembe tonunda uzun ömürlü jel oje.', desc: 'Blush Pink jel oje, pastel pembe tonu ile zarif ve şık bir görünüm sunar. UV/LED altında 60 saniyede kürlenir. 21 güne kadar çipsiz kalıcılık.', isBestSeller: true, isFeatured: true, isOnSale: true, isNew: false },
    { name: 'Ruby Red Jel Oje', slug: 'ruby-red-jel-oje', sku: 'CN-JO-002', cat: 'jel-oje', price: 189, discountPrice: null, stock: 32, lowStockThreshold: 10, brand: 'City Nail', tags: 'jel oje,kırmızı,klasik', shortDesc: 'Klasik kırmızı tonunda gösterişli jel oje.', desc: 'Ruby Red, her mevsim için mükemmel klasik kırmızı tonudur. Yoğun pigment ve yüksek parlaklık.', isBestSeller: true, isFeatured: false, isOnSale: false, isNew: false },
    { name: 'Lavender Dream Jel Oje', slug: 'lavender-dream-jel-oje', sku: 'CN-JO-003', cat: 'jel-oje', price: 199, discountPrice: null, stock: 8, lowStockThreshold: 10, brand: 'City Nail', tags: 'jel oje,lavanta,mor', shortDesc: 'Yumuşak lavanta tonunda rüya gibi jel oje.', desc: 'Lavender Dream, bahar ayları için ideal pastel lavanta tonudur. Yumuşak ve feminen bir görünüm.', isBestSeller: false, isFeatured: true, isOnSale: false, isNew: true },
    { name: 'Golden Glitter Jel Oje', slug: 'golden-glitter-jel-oje', sku: 'CN-JO-004', cat: 'jel-oje', price: 219, discountPrice: 179, stock: 25, lowStockThreshold: 10, brand: 'City Nail', tags: 'jel oje,altın,glitter', shortDesc: 'Altın parıltılı göz alıcı jel oje.', desc: 'Golden Glitter, özel günler için mükemmel altın parıltılı jel ojedir. Yoğun glitter partikülleri ile gösterişli bir görünüm.', isBestSeller: false, isFeatured: false, isOnSale: true, isNew: true },
    // Nail Art
    { name: 'Chrome Powder Set', slug: 'chrome-powder-set', sku: 'CN-NA-001', cat: 'nail-art', price: 299, discountPrice: null, stock: 18, lowStockThreshold: 8, brand: 'City Nail', tags: 'nail art,chrome,toz', shortDesc: '6 renkli krom toz seti.', desc: 'Chrome Powder Set ile tırnaklarınıza metalik bir parlaklık katın. 6 farklı renk: gümüş, altın, gül altın, mor, mavi ve holografik.', isBestSeller: true, isFeatured: true, isOnSale: false, isNew: false },
    { name: 'Ombre Sponge Kit', slug: 'ombre-sponge-kit', sku: 'CN-NA-002', cat: 'nail-art', price: 89, discountPrice: 69, stock: 50, lowStockThreshold: 15, brand: 'City Nail', tags: 'nail art,ombre,sünger', shortDesc: 'Profesyonel ombre uygulama süngeri seti.', desc: 'Ombre Sponge Kit ile degrade manikür yapmak çok kolay. 10 adet yüksek kaliteli sünger içerir.', isBestSeller: false, isFeatured: false, isOnSale: true, isNew: false },
    { name: 'Nail Art Foil Paper', slug: 'nail-art-foil-paper', sku: 'CN-NA-003', cat: 'nail-art', price: 79, discountPrice: null, stock: 40, lowStockThreshold: 12, brand: 'City Nail', tags: 'nail art,foil,transfer', shortDesc: '10 tasarımlı metalik foil kağıt seti.', desc: 'Nail Art Foil Paper ile tırnaklarınıza metalik desenler aktarın. 10 farklı tasarım: çiçek, geometrik, soyut.', isBestSeller: false, isFeatured: true, isOnSale: false, isNew: true },
    // Araçlar & Fırçalar
    { name: 'Profesyonel Fırça Seti 5\'li', slug: 'profesyonel-firca-seti-5li', sku: 'CN-AR-001', cat: 'araclar-fircalar', price: 249, discountPrice: 199, stock: 22, lowStockThreshold: 8, brand: 'City Nail Pro', tags: 'fırça,set,profesyonel', shortDesc: '5 parça profesyonel nail art fırça seti.', desc: 'Profesyonel Fırça Seti ile en ince detayları bile kolayca çizin. Set: ince uç, kalın uç, çizgili, nokta ve fan fırça.', isBestSeller: true, isFeatured: true, isOnSale: true, isNew: false },
    { name: 'Dotting Tool 2 Uçlu', slug: 'dotting-tool-2-uclu', sku: 'CN-AR-002', cat: 'araclar-fircalar', price: 49, discountPrice: null, stock: 65, lowStockThreshold: 20, brand: 'City Nail', tags: 'araç,dotting,nokta', shortDesc: 'Çift uçlu nokta yapma aleti.', desc: 'Dotting Tool ile nokta ve daire desenleri oluşturun. İki farklı uç boyutu.', isBestSeller: false, isFeatured: false, isOnSale: false, isNew: false },
    { name: 'Nail File 100/180', slug: 'nail-file-100-180', sku: 'CN-AR-003', cat: 'araclar-fircalar', price: 35, discountPrice: null, stock: 100, lowStockThreshold: 30, brand: 'City Nail', tags: 'araç,törpü,dosya', shortDesc: 'Çift yönlü profesyonel tırnak dosyası.', desc: 'Nail File 100/180, tırnak şekillendirme ve yüzey düzeltme için idealdir. 100 ve 180 gren çift yönlü.', isBestSeller: false, isFeatured: false, isOnSale: false, isNew: false },
    // Dekor
    { name: 'Rhinestone Mix 300 Parça', slug: 'rhinestone-mix-300-parca', slug2: '', sku: 'CN-DE-001', cat: 'dekor', price: 129, discountPrice: 99, stock: 35, lowStockThreshold: 10, brand: 'City Nail', tags: 'dekor,rhinestone,taş', shortDesc: '300 parça karışık boyutta rhinstone taş seti.', desc: 'Rhinestone Mix ile tırnaklarınıza ışıltı katın. 3mm, 4mm, 5mm boyutlarda 300 parça kristal taş.', isBestSeller: true, isFeatured: false, isOnSale: true, isNew: false },
    { name: 'Dry Flower Decal Set', slug: 'dry-flower-decal-set', sku: 'CN-DE-002', cat: 'dekor', price: 89, discountPrice: null, stock: 28, lowStockThreshold: 8, brand: 'City Nail', tags: 'dekor,çiçek,kuru', shortDesc: 'Kuru çiçek nail art decal seti.', desc: 'Dry Flower Decal Set ile doğal ve romantik bir görünüm yaratın. 12 farklı çiçek türü.', isBestSeller: false, isFeatured: true, isOnSale: false, isNew: true },
    { name: 'Pearl Beads Set', slug: 'pearl-beads-set', sku: 'CN-DE-003', cat: 'dekor', price: 69, discountPrice: null, stock: 42, lowStockThreshold: 12, brand: 'City Nail', tags: 'dekor,inci,boncuk', shortDesc: 'İnci boncuk tırnak dekor seti.', desc: 'Pearl Beads Set ile zarif inci detayları ekleyin. 4 farklı boyutta 200 parça inci boncuk.', isBestSeller: false, isFeatured: false, isOnSale: false, isNew: false },
    // Press On Nails
    { name: 'French Tip Press On - Medium', slug: 'french-tip-press-on-medium', sku: 'CN-PO-001', cat: 'press-on-nails', price: 159, discountPrice: 129, stock: 30, lowStockThreshold: 10, brand: 'City Nail', tags: 'press on,french,medium', shortDesc: 'Klasik French tip press on tırnak seti.', desc: 'French Tip Press On tırnaklar ile 5 dakikada mükemmel manikür. 24 adet, 12 boyut seçeneği. Yapıştırıcı dahil.', isBestSeller: true, isFeatured: true, isOnSale: true, isNew: false },
    { name: 'Coffin Shape Press On - Long', slug: 'coffin-shape-press-on-long', sku: 'CN-PO-002', cat: 'press-on-nails', price: 169, discountPrice: null, stock: 18, lowStockThreshold: 8, brand: 'City Nail', tags: 'press on,coffin,long', shortDesc: 'Uzun coffin form press on tırnak seti.', desc: 'Coffin Shape Press On ile dramatik ve şık bir görünüm. Mat siyah renk. 24 adet set.', isBestSeller: false, isFeatured: false, isOnSale: false, isNew: true },
    { name: 'Glitter Ombre Press On', slug: 'glitter-ombre-press-on', sku: 'CN-PO-003', cat: 'press-on-nails', price: 179, discountPrice: 139, stock: 5, lowStockThreshold: 8, brand: 'City Nail', tags: 'press on,glitter,ombre', shortDesc: 'Glitter ombre press on tırnak seti.', desc: 'Glitter Ombre Press On ile göz alıcı bir görünüm. Altın ve gül rengi ombre geçişli. 24 adet.', isBestSeller: false, isFeatured: true, isOnSale: true, isNew: true },
    // Nail Sticker
    { name: 'Floral Watercolor Stickers', slug: 'floral-watercolor-stickers', sku: 'CN-ST-001', cat: 'nail-sticker', price: 59, discountPrice: null, stock: 55, lowStockThreshold: 15, brand: 'City Nail', tags: 'sticker,çiçek,sulu boya', shortDesc: 'Sulu boya tarzı çiçekli nail sticker.', desc: 'Floral Watercolor Stickers ile sanatsal bir dokunuş. 16 tasarımlı, kolay uygulama.', isBestSeller: false, isFeatured: false, isOnSale: false, isNew: true },
    { name: 'Geometric Gold Stickers', slug: 'geometric-gold-stickers', sku: 'CN-ST-002', cat: 'nail-sticker', price: 55, discountPrice: 39, stock: 48, lowStockThreshold: 15, brand: 'City Nail', tags: 'sticker,geometrik,altın', shortDesc: 'Altın geometrik desenli nail sticker.', desc: 'Geometric Gold Stickers ile modern bir görünüm. Minimalist geometrik desenler.', isBestSeller: true, isFeatured: false, isOnSale: true, isNew: false },
    // Nail Kitleri
    { name: 'Başlangıç Nail Art Kit', slug: 'baslangic-nail-art-kit', sku: 'CN-KT-001', cat: 'nail-kitleri', price: 499, discountPrice: 399, stock: 15, lowStockThreshold: 5, brand: 'City Nail', tags: 'kit,başlangıç,set', shortDesc: 'Yeni başlayanlar için tam nail art başlangıç seti.', desc: 'Başlangıç Nail Art Kit ile nail art dünyasına adım atın. İçerir: 6 jel oje, fırça seti, dotting tool, rhinestone, dosya, UV lamba.', isBestSeller: true, isFeatured: true, isOnSale: true, isNew: false },
    { name: 'Profesyonel Manikür Kit', slug: 'profesyonel-manikur-kit', sku: 'CN-KT-002', cat: 'nail-kitleri', price: 899, discountPrice: null, stock: 8, lowStockThreshold: 5, brand: 'City Nail Pro', tags: 'kit,profesyonel,manikür', shortDesc: 'Profesyoneller için kapsamlı manikür seti.', desc: 'Profesyonel Manikür Kit, salon kalitesinde çalışmak isteyenler için. 48 LED UV lamba, 12 jel oje, tüm araçlar.', isBestSeller: false, isFeatured: true, isOnSale: false, isNew: true },
    // Aksesuarlar
    { name: 'Nail Ring Set 12\'li', slug: 'nail-ring-set-12li', sku: 'CN-AK-001', cat: 'aksesuarlar', price: 99, discountPrice: null, stock: 38, lowStockThreshold: 10, brand: 'City Nail', tags: 'aksesuar,yüzük,tırnak', shortDesc: '12 parça tırnak yüzüğü seti.', desc: 'Nail Ring Set ile tırnaklarınıza ekstra süslemeler. Gümüş ve altın renk, 12 farklı tasarım.', isBestSeller: false, isFeatured: false, isOnSale: false, isNew: true },
    { name: 'Nail Chain Accessories', slug: 'nail-chain-accessories', sku: 'CN-AK-002', cat: 'aksesuarlar', price: 79, discountPrice: 59, stock: 25, lowStockThreshold: 8, brand: 'City Nail', tags: 'aksesuar,zincir,süs', shortDesc: 'Tırnak zinciri süsleme aksesuar seti.', desc: 'Nail Chain Accessories ile trend zincir detayları. 10 farklı zincir tasarımı.', isBestSeller: false, isFeatured: false, isOnSale: true, isNew: false },
    // Bakım
    { name: 'Cuticle Oil Vitamin', slug: 'cuticle-oil-vitamin', sku: 'CN-BK-001', cat: 'bakim', price: 89, discountPrice: 69, stock: 60, lowStockThreshold: 20, brand: 'City Nail', tags: 'bakım,yağ,vitamin', shortDesc: 'Vitaminli tırnak eti bakım yağı.', desc: 'Cuticle Oil Vitamin ile tırnak etlerinizi besleyin ve nemlendirin. E vitamini ve jojoba yağı içerir.', isBestSeller: true, isFeatured: true, isOnSale: true, isNew: false },
    { name: 'Nail Strengthener Serum', slug: 'nail-strengthener-serum', sku: 'CN-BK-002', cat: 'bakim', price: 119, discountPrice: null, stock: 42, lowStockThreshold: 15, brand: 'City Nail', tags: 'bakım,güçlendirici,serum', shortDesc: 'Tırnak güçlendirici serum.', desc: 'Nail Strengthener Serum ile kırılan tırnakları güçlendirin. Keratin ve biotin içerir. 4 haftada görünür sonuç.', isBestSeller: false, isFeatured: false, isOnSale: false, isNew: true },
  ];

  for (const p of products) {
    const cat = categories[p.cat];
    const { cat: _, slug2: __, shortDesc, desc, ...rest } = p;
    const product = await prisma.product.create({
      data: {
        ...rest,
        shortDescription: shortDesc,
        description: desc,
        categoryId: cat.id,
        status: 'PUBLISHED',
        ingredients: 'Akrilik kopolimer, fotoinisiyatör, pigment, UV absorban. Alerji testi yapılmıştır.',
        usageInstructions: '1. Tırnak yüzeyini temizleyin. 2. Astar uygulayın. 3. Renk katmanını uygulayın. 4. UV/LED lambada 60 saniye kürlen. 5. Üst kat uygulayın.',
        features: 'Uzun ömürlü, Çipsiz, Hipoalerjenik, Vegan, Cruelty Free',
        seoTitle: `${p.name} - City Nail`,
        metaDescription: p.shortDesc,
        metaKeywords: p.tags,
        salesCount: Math.floor(Math.random() * 200) + 10,
      },
    });
    // Add images
    const numImages = Math.floor(Math.random() * 3) + 2;
    for (let i = 0; i < numImages; i++) {
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: img(`citynail-${p.sku}-${i}`, 600, 600),
          isPrimary: i === 0,
          displayOrder: i,
        },
      });
    }
  }

  // ── Orders (15) ──
  const orderStatuses = ['NEW', 'CONFIRMED', 'PREPARING', 'SHIPPED', 'DELIVERED', 'DELIVERED', 'DELIVERED', 'CANCELLED'];
  const paymentStatuses = ['PAID', 'PAID', 'PAID', 'PENDING', 'PAID', 'PAID', 'PAID', 'FAILED'];
  const allProducts = await prisma.product.findMany({ include: { images: true } });
  const customerList = Object.values(customers);

  for (let i = 0; i < 15; i++) {
    const customer = customerList[i % customerList.length];
    const numItems = Math.floor(Math.random() * 3) + 1;
    const items = [];
    let subtotal = 0;
    for (let j = 0; j < numItems; j++) {
      const product = allProducts[Math.floor(Math.random() * allProducts.length)];
      const qty = Math.floor(Math.random() * 3) + 1;
      const price = product.discountPrice || product.price;
      items.push({ product, qty, price });
      subtotal += price * qty;
    }
    const discount = Math.random() > 0.7 ? Math.round(subtotal * 0.1) : 0;
    const shipping = subtotal >= 750 ? 0 : 49;
    const total = subtotal - discount + shipping;
    const status = orderStatuses[i % orderStatuses.length];
    const payStatus = status === 'CANCELLED' ? 'FAILED' : paymentStatuses[i % paymentStatuses.length];
    const daysAgo = Math.floor(Math.random() * 30) + 1;
    const orderDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    const order = await prisma.order.create({
      data: {
        orderNumber: `CN${String(1001 + i).padStart(6, '0')}`,
        userId: customer.id,
        status,
        paymentStatus: payStatus,
        paymentMethod: 'CASH_ON_DELIVERY',
        subtotal,
        discount,
        shipping,
        total,
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.phone,
        shippingAddress: 'Bağdat Cad. No:123, Kadıköy, İstanbul, 34700',
        billingAddress: 'Bağdat Cad. No:123, Kadıköy, İstanbul, 34700',
        couponCode: discount > 0 ? 'WELCOME10' : null,
        createdAt: orderDate,
      },
    });

    for (const item of items) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.product.id,
          quantity: item.qty,
          unitPrice: item.price,
          total: item.price * item.qty,
        },
      });
    }
  }

  // ── Reviews (10) ──
  const reviewData = [
    { productIdx: 0, name: 'Zeynep Y.', rating: 5, comment: 'Harika bir ürün! Rengi resimdeki gibi ve çok uzun ömürlü. Kesinlikle tavsiye ederim.' },
    { productIdx: 4, name: 'Ayşe K.', rating: 5, comment: 'Chrome toz seti inanılmaz. Tırnaklarım metalik bir parlaklığa sahip oldu. Çok memnunum!' },
    { productIdx: 7, name: 'Elif D.', rating: 4, comment: 'Fırça seti çok kaliteli. İnce detaylar için ideal. Kargo biraz geç geldi ama ürün harika.' },
    { productIdx: 13, name: 'Merve Ş.', rating: 5, comment: 'Press on tırnaklar çok doğal duruyor. 2 haftadır kullanıyorum ve hiç çıkmadı. Mükemmel!' },
    { productIdx: 18, name: 'Selin Ç.', rating: 5, comment: 'Başlangıç kitinden çok memnunum. Her şey dahil, yeni başlayanlar için ideal.' },
    { productIdx: 22, name: 'Deniz A.', rating: 4, comment: 'Etiyağı çok hoş kokuyor ve tırnak etlerim daha sağlıklı görünüyor. Düzenli kullanıyorum.' },
    { productIdx: 1, name: 'Buse Ö.', rating: 5, comment: 'Ruby Red tam aradığım kırmızı tonu. Profesyonel görünümlü bir sonuç aldım.' },
    { productIdx: 10, name: 'Ece A.', rating: 5, comment: 'Rhinestone taşlar çok parlak ve kaliteli. Tasarımlarım çok daha gösterişli oldu.' },
    { productIdx: 3, name: 'Yağmur D.', rating: 4, comment: 'Glitter yoğunluğu çok güzel. Özel günler için mükemmel bir seçim.' },
    { productIdx: 19, name: 'Ceren K.', rating: 5, comment: 'Profesyonel kit ile salon kalitesinde manikür yapabiliyorum. Yatırım değerinde.' },
  ];
  for (const r of reviewData) {
    const product = allProducts[r.productIdx];
    if (!product) continue;
    await prisma.review.create({
      data: {
        productId: product.id,
        userName: r.name,
        rating: r.rating,
        comment: r.comment,
        status: 'APPROVED',
      },
    });
  }
  // Add a pending review
  await prisma.review.create({
    data: { productId: allProducts[0].id, userName: 'Test Kullanıcı', rating: 3, comment: 'Ürün fena değil ama kargo biraz yavaştı.', status: 'PENDING' },
  });

  // ── Coupons (5) ──
  const couponData = [
    { code: 'WELCOME10', type: 'PERCENTAGE', value: 10, minOrder: 0, maxDiscount: null, startDate: new Date('2024-01-01'), endDate: null, usageLimit: 1000, perCustomerLimit: 1, status: 'ACTIVE' },
    { code: 'SEPET50', type: 'FIXED', value: 50, minOrder: 200, maxDiscount: null, startDate: new Date('2024-01-01'), endDate: null, usageLimit: 500, perCustomerLimit: 1, status: 'ACTIVE' },
    { code: 'FREESHIP', type: 'FREE_SHIPPING', value: 0, minOrder: 0, maxDiscount: null, startDate: new Date('2024-01-01'), endDate: null, usageLimit: null, perCustomerLimit: null, status: 'ACTIVE' },
    { code: 'VIP20', type: 'PERCENTAGE', value: 20, minOrder: 500, maxDiscount: 200, startDate: new Date('2024-01-01'), endDate: null, usageLimit: 100, perCustomerLimit: 1, status: 'ACTIVE' },
    { code: 'BLACKFRIDAY', type: 'PERCENTAGE', value: 30, minOrder: 300, maxDiscount: 500, startDate: new Date('2024-11-25'), endDate: new Date('2024-12-01'), usageLimit: 200, perCustomerLimit: 1, status: 'ACTIVE' },
  ];
  for (const c of couponData) {
    await prisma.coupon.create({ data: c });
  }

  // ── Campaigns ──
  await prisma.campaign.create({ data: { name: 'İlk Alışveriş İndirimi', headline: 'İlk Siparişe Özel %10 İndirim', description: 'WELCOME10 kodu ile ilk siparişinize özel %10 indirim kazanın!', image: img('citynail-campaign-1', 800, 400), startDate: new Date('2024-01-01'), endDate: null, ctaText: 'Hemen Alışveriş Yap', ctaLink: '/magaza', status: 'ACTIVE' } });
  await prisma.campaign.create({ data: { name: 'Yaz Koleksiyonu', headline: 'Yaz Renkleri Burada', description: 'Pastel tonlarda yeni jel oje koleksiyonunu keşfedin.', image: img('citynail-campaign-2', 800, 400), startDate: new Date('2024-06-01'), endDate: new Date('2024-09-30'), ctaText: 'Keşfet', ctaLink: '/kategori/jel-oje', status: 'ACTIVE' } });

  // ── Banners ──
  await prisma.banner.create({ data: { title: 'Yeni Gelenler', subtitle: 'En trend nail art ürünleri keşfedin', image: img('citynail-banner-1', 1200, 400), ctaText: 'Keşfet', ctaLink: '/magaza', position: 'HOME', status: 'ACTIVE', displayOrder: 1 } });
  await prisma.banner.create({ data: { title: 'İndirim Günleri', subtitle: 'Seçili ürünlerde %30\'a varan indirim', image: img('citynail-banner-2', 1200, 400), ctaText: 'Fırsatları Gör', ctaLink: '/magaza', position: 'HOME', status: 'ACTIVE', displayOrder: 2 } });

  // ── Homepage Sections ──
  const sections = [
    { type: 'ANNOUNCEMENT', title: 'Duyuru', content: JSON.stringify({ text: '750 ₺ ve üzeri siparişlerde ÜCRETSİZ KARGO • İlk siparişe özel %10 indirim: WELCOME10' }), displayOrder: 0, status: 'ACTIVE' },
    { type: 'HERO', title: 'Hero Bölümü', content: JSON.stringify({ eyebrow: 'YARAT. PARLA. İLHAM VER.', title: 'Senin Tarzını Yansıtan', highlight: 'Nail Art', description: 'Sınırsız yaratıcılık için premium ürünler. Salon kalitesinde manikür, artık parmak uçlarınızda.', cta1: 'ALIŞVERİŞE BAŞLA', cta2: 'NAIL ART KEŞFET', image: img('citynail-hero-main', 800, 1000) }), displayOrder: 1, status: 'ACTIVE' },
    { type: 'CATEGORIES', title: 'Kategoriler', content: JSON.stringify({ title: 'Kategoriye Göre Alışveriş' }), displayOrder: 2, status: 'ACTIVE' },
    { type: 'BEST_SELLERS', title: 'En Çok Satanlar', content: JSON.stringify({ title: 'En Çok Satanlar' }), displayOrder: 3, status: 'ACTIVE' },
    { type: 'EDITORIAL', title: 'Editöryel Banner', content: JSON.stringify({ title: 'Sınırları Aş', description: 'Etkileyici tırnaklar için ihtiyacınız olan her şey', cta: 'DAHA FAZLA', image: img('citynail-editorial', 800, 600), benefits: ['PROFESYONEL KALİTE', 'GÜVENLİ & TOKSİKSİZ', 'TREND & EŞSİZ', 'TUTKUYLA ÜRETİLDİ'] }), displayOrder: 4, status: 'ACTIVE' },
    { type: 'INSTAGRAM', title: 'Instagram', content: JSON.stringify({ title: 'İlham Al @citynail', images: Array.from({ length: 6 }, (_, i) => img(`citynail-ig-${i}`, 400, 400)) }), displayOrder: 5, status: 'ACTIVE' },
    { type: 'NEWSLETTER', title: 'Newsletter', content: JSON.stringify({ title: 'Nail Topluluğumuza Katıl', description: 'Yeni ürünler, trendler ve özel indirimler için abone ol.' }), displayOrder: 6, status: 'ACTIVE' },
  ];
  for (const s of sections) {
    await prisma.homepageSection.create({ data: s });
  }

  // ── Blog Posts (5) ──
  const blogData = [
    { title: '2026 Nail Art Trendleri: Bu Yıl Neler Moda?', slug: '2026-nail-art-trendleri', category: 'Trendler', excerpt: '2026 yılında en trend nail art modalarını ve renklerini keşfedin.', content: '2026 yılı, nail art dünyasında heyecan verici trendler getiriyor. Pastel tonlar, chrome efektleri ve minimalist desenler ön planda...' },
    { title: 'Jel Oje Nasıl Uygulanır? Adım Adım Rehber', slug: 'jel-oje-nasil-uygulanir', category: 'Eğitim', excerpt: 'Evde profesyonel jel oje uygulaması için detaylı rehber.', content: 'Jel oje uygulaması, doğru adımları izlediğinizde evde de profesyonel sonuçlar verebilir. İşte adım adım rehber...' },
    { title: 'Tırnak Bakımı: Sağlıklı Tırnaklar için 5 İpucu', slug: 'tirnak-bakimi-5-ipucu', category: 'Bakım', excerpt: 'Sağlıklı ve güçlü tırnaklar için pratik bakım önerileri.', content: 'Tırnak sağlığı, dış görünüşümüzün önemli bir parçasıdır. İşte sağlıklı tırnaklar için 5 altın kural...' },
    { title: 'Press On Nails: Avantajları ve Kullanımı', slug: 'press-on-nails-avantajlari', category: 'Nail Art', excerpt: 'Press on tırnakların avantajları ve doğru kullanım yöntemleri.', content: 'Press on tırnaklar, hızlı ve kolay manikür isteyenler için harika bir seçenek. İşte bilmeniz gerekenler...' },
    { title: 'Nail Art Araçları: Başlangıç Seti', slug: 'nail-art-araclari-baslangic-seti', category: 'İpuçları', excerpt: 'Nail art dünyasına yeni başlayanlar için gerekli araçlar.', content: 'Nail art yapmaya başlamak için ihtiyacınız olan temel araçlar ve bunların kullanım alanları...' },
  ];
  for (const b of blogData) {
    await prisma.blogPost.create({
      data: { ...b, coverImage: img(`citynail-blog-${b.slug}`, 800, 500), author: 'City Nail', tags: 'nail art, bakım, trend', status: 'PUBLISHED', publishDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) },
    });
  }

  // ── Newsletter Subscribers ──
  const subEmails = ['sub1@example.com', 'sub2@example.com', 'sub3@example.com', 'sub4@example.com', 'sub5@example.com', 'sub6@example.com', 'sub7@example.com'];
  for (const email of subEmails) {
    await prisma.newsletterSubscriber.create({ data: { email, name: email.split('@')[0], status: 'ACTIVE' } });
  }
  await prisma.newsletterSubscriber.create({ data: { email: 'unsub@example.com', name: 'unsub', status: 'UNSUBSCRIBED' } });

  // ── Notifications ──
  await prisma.notification.create({ data: { type: 'NEW_ORDER', message: 'Yeni sipariş alındı: CN000015', isRead: false, userId: admin.id } });
  await prisma.notification.create({ data: { type: 'LOW_STOCK', message: 'Düşük stok uyarısı: Lavender Dream Jel Oje (8 adet)', isRead: false, userId: admin.id } });
  await prisma.notification.create({ data: { type: 'OUT_OF_STOCK', message: 'Stok tükendi: Glitter Ombre Press On (5 adet)', isRead: false, userId: admin.id } });
  await prisma.notification.create({ data: { type: 'NEW_REVIEW', message: 'Yeni yorum onay bekliyor: Blush Pink Jel Oje', isRead: false, userId: admin.id } });
  await prisma.notification.create({ data: { type: 'NEW_SUBSCRIBER', message: 'Yeni newsletter abonesi: sub7@example.com', isRead: false, userId: admin.id } });

  // ── Site Settings ──
  const settings = {
    'general': { brandName: 'CITY NAIL', logo: '', favicon: '' },
    'contact': { phone: '+90 212 555 00 00', email: 'info@citynail.com', whatsapp: '+90 532 555 00 00', address: 'Bağdat Caddesi No:123, Kadıköy, İstanbul', workingHours: 'Pazartesi - Cumartesi: 09:00 - 19:00' },
    'shipping': { freeShippingThreshold: 750, standardShippingFee: 49, expressShippingFee: 99, estimatedDelivery: '2-4 iş günü' },
    'social': { instagram: 'https://instagram.com/citynail', tiktok: 'https://tiktok.com/@citynail', pinterest: 'https://pinterest.com/citynail', youtube: 'https://youtube.com/@citynail' },
    'seo': { homeTitle: 'City Nail - Premium Nail Art & Beauty Store', homeDescription: 'Türkiye\'nin premium nail art markası. Jel oje, press on nails, nail art ürünleri ve daha fazlası.', ogTitle: 'City Nail - Premium Nail Art', ogDescription: 'Sınırsız yaratıcılık için premium nail art ürünleri', ogImage: '' },
    'policies': { privacy: 'Gizlilik politikamız...', terms: 'Kullanım şartlarımız...', returns: 'İade ve değişim koşullarımız...' },
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.create({ data: { key, value: JSON.stringify(value) } });
  }

  console.log('✅ Seed complete!');
  console.log(`   Categories: ${catData.length}`);
  console.log(`   Products: ${products.length}`);
  console.log(`   Customers: ${customerNames.length} + 1 admin`);
  console.log(`   Orders: 15`);
  console.log(`   Reviews: 11`);
  console.log(`   Coupons: 5`);
  console.log(`   Blog posts: 5`);
  console.log(`   Newsletter subscribers: 8`);
  console.log(`   Admin login: admin@citynail.com / admin123`);
  console.log(`   Customer login: zeynep@example.com / user123`);
}

main()
  .catch(e => { console.error('Seed error:', e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());
