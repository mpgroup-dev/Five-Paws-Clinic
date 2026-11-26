// Exact bilingual category/subcategory taxonomy as specified by the client.
// Used by prisma/seed.ts to populate the Category table.

export const CATEGORY_TAXONOMY = [
  {
    slug: "cats",
    nameEn: "Cats",
    nameAr: "القطط",
    icon: "cat",
    children: [
      { slug: "cats-dry-food", nameEn: "Dry Food", nameAr: "طعام جاف" },
      { slug: "cats-wet-food", nameEn: "Wet Food", nameAr: "طعام رطب" },
      { slug: "cats-kitten-food", nameEn: "Kitten Food", nameAr: "طعام القطط الصغيرة" },
      { slug: "cats-veterinary-diet", nameEn: "Veterinary Diet", nameAr: "أغذية علاجية" },
      { slug: "cats-treats", nameEn: "Cat Treats", nameAr: "مكافآت القطط" },
      { slug: "cats-milk", nameEn: "Cat Milk", nameAr: "حليب القطط" },
    ],
  },
  {
    slug: "dogs",
    nameEn: "Dogs",
    nameAr: "الكلاب",
    icon: "dog",
    children: [
      { slug: "dogs-dry-food", nameEn: "Dry Food", nameAr: "طعام جاف" },
      { slug: "dogs-wet-food", nameEn: "Wet Food", nameAr: "طعام رطب" },
      { slug: "dogs-puppy-food", nameEn: "Puppy Food", nameAr: "طعام الجراء" },
      { slug: "dogs-veterinary-diet", nameEn: "Veterinary Diet", nameAr: "أغذية علاجية" },
      { slug: "dogs-treats", nameEn: "Dog Treats", nameAr: "مكافآت الكلاب" },
    ],
  },
  {
    slug: "birds",
    nameEn: "Birds",
    nameAr: "الطيور",
    icon: "bird",
    children: [
      { slug: "birds-food", nameEn: "Bird Food", nameAr: "طعام الطيور" },
      { slug: "birds-treats-snacks", nameEn: "Treats & Snacks", nameAr: "مكافآت ووجبات خفيفة" },
      { slug: "birds-accessories", nameEn: "Accessories", nameAr: "إكسسوارات الطيور" },
    ],
  },
  {
    slug: "fish-aquatic",
    nameEn: "Fish & Aquatic",
    nameAr: "الأسماك والأحياء المائية",
    icon: "fish",
    children: [
      { slug: "fish-food", nameEn: "Fish Food", nameAr: "طعام الأسماك" },
      { slug: "turtle-food", nameEn: "Turtle Food", nameAr: "طعام السلاحف" },
      { slug: "aquarium-food", nameEn: "Aquarium Food", nameAr: "أغذية الأحواض" },
    ],
  },
  {
    slug: "healthcare-grooming",
    nameEn: "Healthcare & Grooming",
    nameAr: "العناية والصحة",
    icon: "heart-pulse",
    children: [
      { slug: "shampoos", nameEn: "Shampoos", nameAr: "الشامبو" },
      { slug: "supplements-vitamins", nameEn: "Supplements & Vitamins", nameAr: "المكملات والفيتامينات" },
      { slug: "dental-care", nameEn: "Dental Care", nameAr: "العناية بالأسنان" },
      { slug: "ear-eye-care", nameEn: "Ear & Eye Care", nameAr: "العناية بالأذن والعين" },
      { slug: "flea-tick-care", nameEn: "Flea & Tick Care", nameAr: "مكافحة البراغيث والقراد" },
      { slug: "cleaning-products", nameEn: "Cleaning Products", nameAr: "منتجات التنظيف" },
    ],
  },
  {
    slug: "toys-accessories",
    nameEn: "Toys & Accessories",
    nameAr: "الألعاب والإكسسوارات",
    icon: "toy-brick",
    children: [
      { slug: "cat-toys", nameEn: "Cat Toys", nameAr: "ألعاب القطط" },
      { slug: "dog-toys", nameEn: "Dog Toys", nameAr: "ألعاب الكلاب" },
      { slug: "brushes-combs", nameEn: "Brushes & Combs", nameAr: "الفرش والأمشاط" },
      { slug: "feeders-water-dispensers", nameEn: "Feeders & Water Dispensers", nameAr: "أوعية الطعام والماء" },
      { slug: "pet-beds", nameEn: "Pet Beds", nameAr: "أسرّة الحيوانات" },
      { slug: "carriers-leashes", nameEn: "Carriers & Leashes", nameAr: "حقائب النقل والمقاود" },
    ],
  },
  {
    slug: "cat-litter",
    nameEn: "Cat Litter",
    nameAr: "رمل القطط",
    icon: "box",
    children: [
      { slug: "clumping-litter", nameEn: "Clumping Litter", nameAr: "رمل متكتل" },
      { slug: "silica-litter", nameEn: "Silica Litter", nameAr: "رمل السيليكا" },
      { slug: "natural-litter", nameEn: "Natural Litter", nameAr: "رمل طبيعي" },
      { slug: "litter-boxes", nameEn: "Litter Boxes", nameAr: "صناديق الرمل" },
      { slug: "litter-accessories", nameEn: "Litter Accessories", nameAr: "إكسسوارات الرمل" },
    ],
  },
] as const
