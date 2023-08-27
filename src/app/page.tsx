import Image from "next/image";
import Link from "next/link";

// utils
import { formatPrice } from "@/utils/formatPrice";
import { gql } from "@/utils/gql";

// types
import type { ShopifyExtension, ShopifyProduct } from "@/types";

type GraphQLResponse = {
  data: {
    products: {
      nodes: ShopifyProduct[];
    };
  };
  extensions: ShopifyExtension;
};

const getProducts = async (): Promise<GraphQLResponse> => {
  const res = await fetch(process.env.GRAPHQL_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": process.env.ADMIN_API_ACCESS_TOKEN!
    },
    body: JSON.stringify({
      query: gql`
        query ProductsQuery {
          products(first: 6) {
            nodes {
              description
              featuredImage {
                altText
                height
                id
                url
                width
              }
              handle
              id
              priceRangeV2 {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              tags
              title
            }
          }
        }
      `
    })
  });

  if (!res.ok) {
    const text = await res.text(); // get the response body for more information

    throw new Error(`
      Failed to fetch data
      Status: ${res.status}
      Response: ${text}
    `);
  }

  return res.json();
};

const HomePage = async () => {
  const json = await getProducts();

  return (
    <main className="container mx-auto mt-10">
      <h1 className="font-bold mb-10 text-3xl text-center">Shopify + Next.js 13!</h1>

      <div className="px-5">
        <h2 className="font-bold text-2xl mb-3">Our Products:</h2>
        <ul className="grid grid-cols-12 gap-4 pb-12">
          {json.data.products.nodes.map((product) => {
            const prodId = product.id.split("/").pop();

            return (
              <li
                key={product.id}
                className="border border-slate-200 rounded-md overflow-hidden col-span-full md:col-span-6 lg:col-span-4"
              >
                <div>
                  <Image
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText}
                    width={product.featuredImage.width}
                    height={product.featuredImage.height}
                    className="h-96 w-full object-cover"
                  />
                </div>

                <div className="p-5">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-yellow-400 font-bold py-1 px-3 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}

                  <h3 className="font-medium mt-3 text-3xl">{product.title}</h3>

                  <h4>
                    {formatPrice(product.priceRangeV2.minVariantPrice.amount)}{" "}
                    {product.priceRangeV2.minVariantPrice.currencyCode}
                  </h4>

                  <p className="mt-2 mb-4">{product.description}</p>

                  <Link
                    href={`/product/${prodId}`}
                    className="border border-blue-600 inline-block p-2 rounded-md text-blue-600 hover:bg-blue-600 hover:text-white ease-in-out duration-150"
                  >
                    View Product
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
};

export default HomePage;
