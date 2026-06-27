import abayaImg from "../../images/abaya.jpg";
import abayaInnersImg from "../../images/Abaya Inners.jpg";
import hijabsImg from "../../images/Hijabs.jpg";
import stolesImg from "../../images/Stoles.jpg";
import jilbabsImg from "../../images/Jilbabs.jpg";
import hijabAccessoriesImg from "../../images/Hijab Accessories.jpg";
import mensKurtasImg from "../../images/Men's Kurtas.jpg";
import thobesImg from "../../images/Thobes.jpg";
import pakistaniPathaniImg from "../../images/Pakistani Pathani.jpg";
import kidsThobesImg from "../../images/Kids Thobes.jpg";
import perfumesAttarsImg from "../../images/Middle East Perfumes & Attars.jpg";
import hajjUmrahImg from "../../images/Hajj & Umrah Essentials.jpg";
import ramzanAbayaCollectionImg from "../../images/Ramzan Abaya Collection.jpg";
import luxuryHijabCollectionImg from "../../images/Luxury Hijab Collection.jpg";
import umrahEssentialsImg from "../../images/Umrah Essentials.jpg";

const buildProducts = (seed, names, image) =>
  names.map((name, index) => ({
    id: seed + index,
    name,
    price: 2499 + index * 300,
    oldPrice: 2999 + index * 300,
    rating: Number((4.2 + (index % 5) * 0.15).toFixed(1)),
    image
  }));

const defaultBenefits = [
  {
    title: "Premium Fabrics",
    description: "Soft, luxurious materials designed for modest comfort and timeless style."
  },
  {
    title: "Modest Fashion",
    description: "Curated silhouettes that emphasize elegance, coverage, and refinement."
  },
  {
    title: "Worldwide Shipping",
    description: "Delivering beautifully packaged outfits to customers around the globe."
  },
  {
    title: "Secure Payments",
    description: "Safe checkout with trusted payment options and easy returns."
  }
];

export const categoryPages = {
  "eid-26-collection": {
    title: "Eid 2026 Collection",
    subtitle: "Premium Eid outfits, festive abayas, and luxury modest fashion for celebration season.",
    description: "Celebrate Eid with elegant ensembles crafted for special gatherings and family events. Discover premium embroidery, refined silhouettes, and festive details designed for modern modesty.",
    paragraphs: [
      "Our Eid collection blends heritage style with contemporary tailoring for an elevated festive wardrobe.",
      "Choose from embroidered abayas, luxurious dresses, and statement pieces built to shine during prayer gatherings and Eid festivities.",
      "Each design combines comfort and coverage with premium fabrics and hand-finished details for unforgettable holiday dressing."
    ],
    heroImage: ramzanAbayaCollectionImg,
    products: buildProducts(2101, [
      "Premium Embroidered Abaya",
      "Satin Eid Kaftan",
      "Luxury Festive Abaya",
      "Ivory Party Abaya",
      "Bronze Celebration Dress",
      "Embroidered Shawl Set",
      "Midnight Jacquard Abaya",
      "Gilded Lace Abaya"
    ], abayaImg),
    faqs: [
      {
        question: "Are Eid outfits modest enough for prayer events?",
        answer: "Yes, every piece in the Eid collection is designed for graceful coverage with premium fabrics suitable for prayer gatherings."
      },
      {
        question: "Do these abayas come in plus sizes?",
        answer: "We offer inclusive sizing across the collection to ensure every customer can find a comfortable, elegant fit."
      },
      {
        question: "How long does international shipping take?",
        answer: "Worldwide shipping typically arrives within 7-14 business days depending on the destination."
      }
    ],
    related: [
      { title: "Abayas", path: "/abayas", image: abayaImg },
      { title: "New Arrivals", path: "/new", image: luxuryHijabCollectionImg },
      { title: "Accessories", path: "/accessories", image: perfumesAttarsImg }
    ],
    benefits: defaultBenefits
  },
  new: {
    title: "New Arrivals",
    subtitle: "Fresh fashion pieces launched for the season with modern modest details.",
    description: "Discover the latest arrivals in Islamic fashion, including new abaya shapes, fresh hijab styles, and updated wardrobe essentials.",
    paragraphs: [
      "Our new collection brings the latest trends to modest fashion, featuring modern silhouettes and contemporary color palettes.",
      "These new arrivals are designed for everyday elegance, special occasions, and polished seasonal dressing.",
      "Shop the newest pieces to refresh your wardrobe with refined comfort and stylish modest details."
    ],
    heroImage: luxuryHijabCollectionImg,
    products: buildProducts(2201, [
      "Floral Print Abaya",
      "Modern Pleated Dress",
      "Chiffon Layered Hijab",
      "Silk Trim Kaftan",
      "Embroidered Shawl",
      "Everyday Maxi Dress",
      "Soft Jersey Jilbab",
      "Textured Lounge Set"
    ], luxuryHijabCollectionImg),
    faqs: [
      {
        question: "How often do you restock new arrivals?",
        answer: "We refresh our collection regularly with new launches and emerging fashion pieces each season."
      },
      {
        question: "Is new arrival stock limited?",
        answer: "Some items are limited edition, so we recommend shopping early to secure your preferred size."
      },
      {
        question: "Can I return new arrival products?",
        answer: "Yes, new arrivals follow our standard return policy for easy exchanges or refunds."
      }
    ],
    related: [
      { title: "Bestsellers", path: "/bestsellers", image: abayaImg },
      { title: "Hijabs", path: "/hijabs", image: hijabsImg },
      { title: "Clothing", path: "/clothing", image: abayaInnersImg }
    ],
    benefits: defaultBenefits
  },
  men: {
    title: "Men's Collection",
    subtitle: "Luxury men's Islamic wear, including thobes, kurtas, and prayer-ready styles.",
    description: "Explore the menswear selection curated for comfort, tradition, and refined everyday dressing.",
    paragraphs: [
      "From classic thobes to tailored kurtas, the men's collection brings premium modestwear to every wardrobe.",
      "Designed for prayer, daily wear, and special occasions, each piece offers a polished finish and timeless shape.",
      "Discover premium fabrics, subtle embroidery, and structured silhouettes for modern Islamic menswear."
    ],
    heroImage: mensKurtasImg,
    products: buildProducts(2301, [
      "Classic White Thobe",
      "Embroidered Jubba",
      "Premium Cotton Kurta",
      "Prayer Wear Set",
      "Modern Collar Thobe",
      "Signature Patiala Kurta",
      "Soft Linen Thobe",
      "Tailored Iftar Suit"
    ], mensKurtasImg),
    faqs: [
      {
        question: "Do you offer tall and short sizes for men?",
        answer: "Yes, our men's collection includes a range of lengths to suit different body types."
      },
      {
        question: "Are the thobes machine washable?",
        answer: "Most pieces are easy-care; please follow the garment label for best washing instructions."
      },
      {
        question: "Can men wear these outfits for Eid?",
        answer: "Absolutely — the collection is crafted for festive wear, prayer services, and elegant everyday use."
      }
    ],
    related: [
      { title: "Hajj & Umrah", path: "/hajj-umrah", image: hajjUmrahImg },
      { title: "Accessories", path: "/accessories", image: perfumesAttarsImg },
      { title: "Sale", path: "/sale", image: abayaInnersImg }
    ],
    benefits: defaultBenefits
  },
  bestsellers: {
    title: "Customer Favorites",
    subtitle: "The most-loved pieces from our boutique, rated highly by our community.",
    description: "Shop customer favorites selected for quality, comfort, and refined modest style.",
    paragraphs: [
      "These bestselling items are top-rated for their luxurious fabrics and flattering silhouettes.",
      "From elegant abayas to popular hijabs, each product has earned praise from our loyal customers.",
      "Enjoy trending looks that combine premium craftsmanship with enduring modest fashion."
    ],
    heroImage: abayaImg,
    products: buildProducts(2401, [
      "Best Seller Abaya",
      "Customer Favorite Hijab",
      "Luxury Travel Set",
      "Soft Jersey Dress",
      "Premium Velvet Abaya",
      "Classic Everyday Dress",
      "Signature Shawl",
      "Top Rated Kaftan"
    ], abayaImg),
    faqs: [
      {
        question: "What makes these products bestsellers?",
        answer: "These items are the most purchased and highly rated by our customers for style and comfort."
      },
      {
        question: "Do you restock bestseller items often?",
        answer: "We replenish popular pieces regularly, but stock can sell out quickly."
      },
      {
        question: "Is pricing the same for all bestseller items?",
        answer: "Prices vary by item, and our bestsellers include premium and accessible luxury options."
      }
    ],
    related: [
      { title: "New Arrivals", path: "/new", image: luxuryHijabCollectionImg },
      { title: "Sale", path: "/sale", image: abayaInnersImg },
      { title: "Abayas", path: "/abayas", image: abayaImg }
    ],
    benefits: defaultBenefits
  },
  abayas: {
    title: "Elegant Abayas",
    subtitle: "Premium abayas for daily wear, special events, and elevated modest elegance.",
    description: "Discover luxurious abayas in refined fabrics, embroidery, and modern tailoring.",
    paragraphs: [
      "Our abaya collection offers elegant coverage with sophisticated details and textures.",
      "Choose from everyday styles, premium designs, and occasion-ready pieces for a polished wardrobe.",
      "Each abaya blends modesty with contemporary aesthetics for graceful dress codes."
    ],
    heroImage: abayaImg,
    products: buildProducts(2501, [
      "Premium Embroidered Abaya",
      "Silk Trim Abaya",
      "Lace Detail Abaya",
      "Classic Black Abaya",
      "Gold Accent Abaya",
      "Everyday Flow Abaya",
      "Karachi Statement Abaya",
      "Occasion Wear Abaya"
    ], abayaImg),
    faqs: [
      {
        question: "Are these abayas suitable for everyday wear?",
        answer: "Yes, the collection includes both everyday and special occasion styles."
      },
      {
        question: "Do you offer matching hijab suggestions?",
        answer: "We recommend pairing these abayas with our premium hijabs for a coordinated look."
      },
      {
        question: "Is tailoring available?",
        answer: "Please check the product description for sizing details; custom tailoring is not included."
      }
    ],
    related: [
      { title: "Hijabs", path: "/hijabs", image: hijabsImg },
      { title: "Kid's Collection", path: "/kids", image: kidsThobesImg },
      { title: "Sale", path: "/sale", image: abayaInnersImg }
    ],
    benefits: defaultBenefits
  },
  "hajj-umrah": {
    title: "Hajj & Umrah Essentials",
    subtitle: "Travel essentials and modest comforts for sacred journeys.",
    description: "Prepare for pilgrimage with practical pieces designed for comfort, coverage, and simple travel packing.",
    paragraphs: [
      "The Hajj and Umrah collection includes prayer-ready garments, lightweight coverings, and travel-friendly accessories.",
      "Each item is selected to make your pilgrimage wardrobe comfortable and spiritually focused.",
      "Find elegant essentials that honor tradition with premium materials and understated design."
    ],
    heroImage: hajjUmrahImg,
    products: buildProducts(2601, [
      "Travel Prayer Set",
      "Lightweight Umbrella Abaya",
      "Comfort Hijab",
      "Pilgrimage Scarf",
      "Breathable Thobe",
      "Essentials Tote",
      "Prayer Rug Set",
      "Journey Kaftan"
    ], hajjUmrahImg),
    faqs: [
      {
        question: "Are these items suitable for hot weather?",
        answer: "Yes, the collection includes lightweight fabrics appropriate for warm climates."
      },
      {
        question: "Can I buy a pilgrimage gift set?",
        answer: "Yes, select curated sets designed specifically for Hajj and Umrah travel."
      },
      {
        question: "Do you ship internationally?",
        answer: "We ship worldwide so you can receive your essentials ahead of your pilgrimage."
      }
    ],
    related: [
      { title: "Men", path: "/men", image: mensKurtasImg },
      { title: "Accessories", path: "/accessories", image: perfumesAttarsImg },
      { title: "Abayas", path: "/abayas", image: abayaImg }
    ],
    benefits: defaultBenefits
  },
  kaftans: {
    title: "Designer Kaftans",
    subtitle: "Comfortable luxury kaftans for parties, gatherings, and elegant modest styling.",
    description: "Explore premium kaftans with embroidered details, flowing silhouettes, and luxe finishes.",
    paragraphs: [
      "Kaftans are crafted to deliver effortless luxury with relaxed comfort and beautiful drape.",
      "Our collection features designs for evening wear, special events, and refined everyday styling.",
      "Enjoy premium fabrics with flattering cuts and sophisticated modest appeal."
    ],
    heroImage: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80&fm=webp",
    products: buildProducts(2701, [
      "Embroidered Velvet Kaftan",
      "Beaded Evening Kaftan",
      "Silk Blend Kaftan",
      "Modern Print Kaftan",
      "Luxury Lounge Kaftan",
      "Elegant Party Kaftan",
      "Satin Trim Kaftan",
      "Gold Accent Kaftan"
    ], stolesImg),
    faqs: [
      {
        question: "Are kaftans appropriate for formal events?",
        answer: "Yes, our designer kaftans are styled for formal gatherings and celebrations."
      },
      {
        question: "Do these kaftans offer full coverage?",
        answer: "They are designed to offer elegant coverage while showcasing luxurious detailing."
      },
      {
        question: "Can I wear a kaftan with a hijab?",
        answer: "Absolutely, kaftans pair beautifully with our premium hijabs for complete modest styling."
      }
    ],
    related: [
      { title: "Abayas", path: "/abayas", image: abayaImg },
      { title: "Hijabs", path: "/hijabs", image: hijabsImg },
      { title: "New Arrivals", path: "/new", image: luxuryHijabCollectionImg }
    ],
    benefits: defaultBenefits
  },
  hijabs: {
    title: "Premium Hijabs",
    subtitle: "Soft chiffons, silks, and everyday hijabs for elegant modest styling.",
    description: "Explore a premium hijab collection crafted for comfort, drape, and versatile styling.",
    paragraphs: [
      "Our hijabs combine premium textiles with easy styling for everyday elegance.",
      "Choose from chiffon, silk, and jersey options in refined shades and modern prints.",
      "These pieces are designed to keep you comfortable through long days and special occasions."
    ],
    heroImage: hijabsImg,
    products: buildProducts(2801, [
      "Silk Luxe Hijab",
      "Chiffon Wrap",
      "Jersey Everyday Hijab",
      "Embroidered Edge Hijab",
      "Lightweight Summer Hijab",
      "Textured Modal Hijab",
      "Classic Satin Hijab",
      "Layered Hijab Set"
    ], hijabsImg),
    faqs: [
      {
        question: "Do you offer hijab styling tutorials?",
        answer: "Yes, our website includes styling guides for many of the hijab shapes we carry."
      },
      {
        question: "Can I wear these hijabs for special occasions?",
        answer: "Absolutely, the premium fabrics and detailing make them ideal for both everyday and event wear."
      },
      {
        question: "Are hijab pins included?",
        answer: "Pins are available separately, and the hijabs are designed to work with standard styling accessories."
      }
    ],
    related: [
      { title: "Accessories", path: "/accessories", image: perfumesAttarsImg },
      { title: "Abayas", path: "/abayas", image: abayaImg },
      { title: "Fall/Winter", path: "/winter-wear", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80&fm=webp" }
    ],
    benefits: defaultBenefits
  },
  kids: {
    title: "Kids Collection",
    subtitle: "Comfortable, modest outfits for children and family celebrations.",
    description: "Find playful yet refined modest fashion for kids, including Eid outfits and everyday essentials.",
    paragraphs: [
      "The kids collection offers soft fabrics, gentle tailoring, and thoughtful details for young wearers.",
      "From Eid celebrations to family gatherings, each piece is crafted for comfort and style.",
      "Enjoy cheerful colors, modest cuts, and durable construction made for little wardrobes."
    ],
    heroImage: kidsThobesImg,
    products: buildProducts(2901, [
      "Mini Eid Abaya",
      "Kids Prayer Dress",
      "Comfortable Thobe",
      "Playful Kaftan",
      "Holiday Tunic",
      "Soft Cotton Abaya",
      "Family Matching Set",
      "Everyday Kids Dress"
    ], kidsThobesImg),
    faqs: [
      {
        question: "Can these outfits be worn for school?",
        answer: "Many pieces are suitable for modest schoolwear and family events."
      },
      {
        question: "Is sizing available for younger children?",
        answer: "Yes, our kids collection includes multiple age ranges and comfortable fits."
      },
      {
        question: "Do you offer family matching sets?",
        answer: "We offer select coordinating pieces for family collections and holiday looks."
      }
    ],
    related: [
      { title: "Eid 2026", path: "/eid-26-collection", image: ramzanAbayaCollectionImg },
      { title: "Abayas", path: "/abayas", image: abayaImg },
      { title: "Accessories", path: "/accessories", image: perfumesAttarsImg }
    ],
    benefits: defaultBenefits
  },
  clothing: {
    title: "Modest Clothing",
    subtitle: "Everyday dresses, tunics, and coordinated sets for refined modest styling.",
    description: "Build a versatile wardrobe with modern modest clothing made for comfort and elegant daily wear.",
    paragraphs: [
      "Our modest clothing collection includes dresses, tunics, and coordinating sets for effortless styling.",
      "Each piece is designed with soft fabrics, flattering drape, and subtle details for everyday elegance.",
      "Perfect for work, family gatherings, or casual outings with a polished modest aesthetic."
    ],
    heroImage: abayaInnersImg,
    products: buildProducts(3001, [
      "Everyday Tunic Dress",
      "Co-ord Set",
      "Layered Maxi Dress",
      "Soft Knit Cardigan",
      "Statement Sleeve Dress",
      "Comfort Wrap Top",
      "Modest Shirt Dress",
      "Relaxed Linen Set"
    ], abayaInnersImg),
    faqs: [
      {
        question: "Are these pieces machine washable?",
        answer: "Many items are easy-care; please follow the garment labels for specific instructions."
      },
      {
        question: "Can I mix and match the sets?",
        answer: "Yes, the collection is designed to be mixed for versatile wardrobe combinations."
      },
      {
        question: "Do these pieces work for workwear?",
        answer: "Absolutely, many of the designs are suitable for professional modest dressing."
      }
    ],
    related: [
      { title: "New Arrivals", path: "/new", image: luxuryHijabCollectionImg },
      { title: "Bestsellers", path: "/bestsellers", image: abayaImg },
      { title: "Hijabs", path: "/hijabs", image: hijabsImg }
    ],
    benefits: defaultBenefits
  },
  "turkish-abaya": {
    title: "Turkish Abayas",
    subtitle: "Turkish-inspired designs with premium tailoring and elegant silhouettes.",
    description: "Discover Turkish abayas crafted for refined texture, flattering lines, and modern modest luxury.",
    paragraphs: [
      "The Turkish abaya collection features luxurious fabrics and detailed tailoring for elevated modest dressing.",
      "Each design blends classic Turkish influences with contemporary silhouettes for standout style.",
      "Perfect for special events, evening wear, and polished everyday luxury."
    ],
    heroImage: thobesImg,
    products: buildProducts(3101, [
      "Turkish Velvet Abaya",
      "Premium Tailored Abaya",
      "Lace Embellished Abaya",
      "Structured Silk Abaya",
      "Modern Cut Abaya",
      "Heritage Embroidery Abaya",
      "Gold Trim Abaya",
      "Evening Wear Abaya"
    ], thobesImg),
    faqs: [
      {
        question: "What makes Turkish abayas unique?",
        answer: "They feature richer fabrics, elegant tailoring, and refined embellishments inspired by Turkish design."
      },
      {
        question: "Are these abayas suitable for weddings?",
        answer: "Yes, they are ideal for special occasions and formal modest fashion."
      },
      {
        question: "Do you offer matching accessories?",
        answer: "We suggest pairing these abayas with our premium hijabs and accessories collections."
      }
    ],
    related: [
      { title: "Abayas", path: "/abayas", image: abayaImg },
      { title: "Accessories", path: "/accessories", image: perfumesAttarsImg },
      { title: "Best Sellers", path: "/bestsellers", image: abayaImg }
    ],
    benefits: defaultBenefits
  },
  accessories: {
    title: "Fashion Accessories",
    subtitle: "Bags, scarves, pins, and jewelry to complete your modest look.",
    description: "Upgrade your modest wardrobe with premium accessories designed to complement every outfit.",
    paragraphs: [
      "Explore essential accessories to finish your look with elegance and subtle luxury.",
      "From functional bags to delicate jewelry, each piece adds polished detail to modest fashion.",
      "These accessories are curated to work seamlessly with our clothing and hijab collections."
    ],
    heroImage: perfumesAttarsImg,
    products: buildProducts(3201, [
      "Embellished Clutch",
      "Silk Scarf",
      "Gold Hijab Pin",
      "Luxury Jewelry Set",
      "Travel Tote",
      "Statement Brooch",
      "Elegant Hair Accessory",
      "Versatile Wrap"
    ], perfumesAttarsImg),
    faqs: [
      {
        question: "Can these accessories be gifted?",
        answer: "Yes, our accessory pieces make thoughtful presents and elegant wardrobe additions."
      },
      {
        question: "Do you offer coordinated sets?",
        answer: "We offer curated accessory combinations designed to complement our apparel lines."
      },
      {
        question: "Are these items suitable for special events?",
        answer: "Many pieces are designed to add sophisticated detail to event and evening wear."
      }
    ],
    related: [
      { title: "Hijabs", path: "/hijabs", image: hijabsImg },
      { title: "Sale", path: "/sale", image: abayaInnersImg },
      { title: "New Arrivals", path: "/new", image: luxuryHijabCollectionImg }
    ],
    benefits: defaultBenefits
  },
  sale: {
    title: "Special Offers",
    subtitle: "Discounted products, clearance deals, and limited-time offers.",
    description: "Shop our sale section for modest fashion deals on premium abayas, hijabs, and accessories.",
    paragraphs: [
      "Find exclusive savings across selected collections with beautiful modest pieces at reduced prices.",
      "This sale includes limited-time offers on customer favorites and seasonal essentials.",
      "Enjoy luxury fashion at a more accessible price while stock lasts."
    ],
    heroImage: abayaInnersImg,
    products: buildProducts(3301, [
      "Discounted Embroidered Abaya",
      "Sale Hijab Set",
      "Clearance Kaftan",
      "Limited-Time Dress",
      "Seasonal Shawl",
      "Special Offer Abaya",
      "Holiday Set",
      "Deal of the Day Dress"
    ], abayaInnersImg),
    faqs: [
      {
        question: "Are sale items final sale?",
        answer: "Most sale items can be returned per our standard policy, unless noted otherwise in the product description."
      },
      {
        question: "How long will the sale last?",
        answer: "Offers are available for a limited time and while supplies last."
      },
      {
        question: "Can I use coupon codes with sale items?",
        answer: "Coupon eligibility varies; please check the checkout page for promotion details."
      }
    ],
    related: [
      { title: "New Arrivals", path: "/new", image: luxuryHijabCollectionImg },
      { title: "Bestsellers", path: "/bestsellers", image: abayaImg },
      { title: "Winter Wear", path: "/winter-wear", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80&fm=webp" }
    ],
    benefits: defaultBenefits
  },
  "winter-wear": {
    title: "Winter Collection",
    subtitle: "Cozy modest pieces for cold weather with luxe fabrics and warm layering.",
    description: "Stay warm in refined winter layers, woolen hijabs, and elegant modest outerwear.",
    paragraphs: [
      "Our winter collection features cozy coats, cardigans, and thermal-friendly modest layering.",
      "Choose from warm fabrics, soft textures, and winter-ready silhouettes designed for comfort.",
      "These pieces bring modest elegance to cooler seasons with premium finishing and classic styling."
    ],
    heroImage: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80&fm=webp",
    products: buildProducts(3401, [
      "Wool Blend Coat",
      "Knitted Cardigan",
      "Wool Hijab",
      "Winter Dress",
      "Layered Tunic",
      "Cozy Abaya",
      "Fleece Lined Shawl",
      "Cold Weather Set"
    ], abayaInnersImg),
    faqs: [
      {
        question: "Are these pieces warm enough for winter?",
        answer: "Yes, the winter collection includes heavier fabrics and lined styles for cold weather comfort."
      },
      {
        question: "Can I layer these outfits easily?",
        answer: "These pieces are designed for layering over modest basics and hijab styling."
      },
      {
        question: "Do you offer large sizes for coats?",
        answer: "We provide inclusive sizing for our winter outerwear designs."
      }
    ],
    related: [
      { title: "Accessories", path: "/accessories", image: perfumesAttarsImg },
      { title: "Hijabs", path: "/hijabs", image: hijabsImg },
      { title: "Sale", path: "/sale", image: abayaInnersImg }
    ],
    benefits: defaultBenefits
  }
};
