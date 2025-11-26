import Link from "next/link";
import Image from "next/image";
import { StoreProduct, StoreRegion } from "@medusajs/types";

type ProductCardProps = {
  product: StoreProduct;
  region: StoreRegion | null | undefined;
};

const formatPrice = (product: StoreProduct, region: StoreRegion | null | undefined) => {
  const variant = product.variants?.[0];
  const priceObject = variant?.calculated_price;
  const amount = priceObject?.calculated_amount;
  const currencyCode = region?.currency_code || 'USD';

  if (amount === undefined || amount === null) {
      return "N/A";
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(Number(amount));
};

const ProductCard = ({ product, region }: ProductCardProps) => {
  return (
    <Link
      href={`/product/${product.handle}`}
      className="group block"
    >
      <div className="relative mb-6 aspect-[3/4] w-full overflow-hidden bg-gray-50">
        {product.thumbnail ? (
          <Image
            src={product.thumbnail}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
            <span className="text-sm uppercase tracking-widest" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>No Image</span>
          </div>
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10"></div>
      </div>
      
      <div className="text-center space-y-2">
        <h2 className="text-lg font-bold text-black uppercase tracking-wide truncate px-2" style={{ fontFamily: 'var(--font-caviar-dreams)' }}>
          {product.title}
        </h2>
        <p className="text-base text-black/70 font-medium">
          Starts at <span className="text-black font-bold">{formatPrice(product, region)}</span>
        </p>
        <div className="mt-4 w-full rounded-none bg-black py-3 text-center text-sm font-bold text-white transition-colors duration-300 hover:bg-gray-800 uppercase tracking-widest">
          View Details
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
