import Link from "next/link";

// utils
import { gql } from "@/utils/gql";

// types
import type { ShopifyProduct } from "@/types";
import Image from "next/image";

type GraphQLResponse = {
  data: {
    products: {
      nodes: ShopifyProduct[];
    };
  };
  extensions: {
    cost: {
      actualQueryCost: number;
      requestedQueryCost: number;
      throttleStatus: {
        currentlyAvailable: number;
        maximumAvailable: number;
        restoreRate: number;
      };
    };
  };
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

      <h2 className="font-bold text-2xl mb-3">Our Products:</h2>
      <ul className="grid grid-cols-3 ">
        {json.data.products.nodes.map((product) => (
          <li key={product.id} className="card">
            <div>
              <Image
                src={product.featuredImage.url}
                alt={product.featuredImage.altText}
                width={product.featuredImage.width}
                height={product.featuredImage.height}
                className="h-96 w-full object-cover"
              />
            </div>

            <div className="card-body">
              {product.tags.map((tag) => (
                <span className="bg-yellow-400 font-bold py-1 px-3 rounded-full text-xs" key={tag}>
                  {tag}
                </span>
              ))}

              <h3 className="font-medium text-3xl">{product.title}</h3>
              <h4>{product.priceRangeV2.minVariantPrice.amount}</h4>
              <p>{product.description}</p>
              <Link href={`/product/${product.handle}`} className="text-blue-600">
                View Product
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default HomePage;
