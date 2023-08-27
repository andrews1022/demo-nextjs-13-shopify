import { ShopifyExtension, ShopifyProduct } from "@/types";
import { gql } from "@/utils/gql";

type GraphQLResponse = {
  data: {
    product: ShopifyProduct;
  };
  extensions: ShopifyExtension;
};

const getProduct = async (id: string): Promise<GraphQLResponse> => {
  const res = await fetch(process.env.GRAPHQL_API_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": process.env.ADMIN_API_ACCESS_TOKEN!
    },
    body: JSON.stringify({
      query: gql`
        query SingleProductQuery($id: ID!) {
          product(id: $id) {
            id
            title
          }
        }
      `,
      variables: {
        id: `gid://shopify/Product/${id}`
      }
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

type SingleProdutPageProps = {
  params: {
    id: string;
  };
};

const SingleProdutPage = async ({ params }: SingleProdutPageProps) => {
  const json = await getProduct(params.id);
  const { product } = json.data;

  return (
    <div>
      <h1>View page for: {product.title}</h1>
    </div>
  );
};

export default SingleProdutPage;
