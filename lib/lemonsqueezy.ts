const base = "https://api.lemonsqueezy.com/v1";

export async function createCheckout(
  variantId: number,
  custom: Record<string, unknown>,
  email?: string,
  name?: string
) {
  const storeId = Number(process.env.LEMONSQUEEZY_STORE_ID);
  const apiKey = process.env.LEMONSQUEEZY_API_KEY;

  if (!storeId) {
    throw new Error("LEMONSQUEEZY_STORE_ID is not configured.");
  }

  if (!apiKey) {
    throw new Error("LEMONSQUEEZY_API_KEY is not configured.");
  }

  if (!variantId) {
    throw new Error("Lemon Squeezy variant ID is not configured.");
  }

  // Lemon Squeezy custom values must be strings
  const safeCustom = Object.fromEntries(
    Object.entries(custom).map(([key, value]) => [
      key,
      String(value ?? ""),
    ])
  );

  const res = await fetch(`${base}/checkouts`, {
    method: "POST",

    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
      Authorization: `Bearer ${apiKey}`,
    },

    body: JSON.stringify({
      data: {
        type: "checkouts",

        attributes: {
          product_options: {
            redirect_url: `${
              process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
            }/dashboard?payment=success`,
          },

          checkout_data: {
            ...(email ? { email } : {}),
            ...(name ? { name } : {}),
            custom: safeCustom,
          },
        },

        relationships: {
          store: {
            data: {
              type: "stores",
              id: String(storeId),
            },
          },

          variant: {
            data: {
              type: "variants",
              id: String(variantId),
            },
          },
        },
      },
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();

    throw new Error(
      `Lemon Squeezy checkout failed: ${errorText}`
    );
  }

  const json = await res.json();

  return json.data.attributes.url as string;
}