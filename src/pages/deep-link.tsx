import { Dataset, Network } from '@build-5/interfaces';
import { Build5, SoonaverseApiKey, SoonaverseOtrAddress, https, otr } from '@build-5/sdk';

export async function deepLinkPage(c: any): Promise<any> {
  // Get price
  const nft = await https(Build5.PROD)
    .project(SoonaverseApiKey[Build5.PROD])
    .dataset(Dataset.NFT)
    .id(c.req.param('nftId'))
    .get();

  if (!nft) {
    return c.text('Unable to find NFT!');
  }

  // @ts-ignore
  const otrAddress =
    nft.mintingData?.network === Network.SMR
      ? SoonaverseOtrAddress.SHIMMER
      : SoonaverseOtrAddress.IOTA;

  const otrRequest = otr(otrAddress)
    .dataset(Dataset.NFT)
    .purchase({ collection: nft.collection, nft: nft.uid }, nft?.availablePrice || 0);

  const fireflyDeeplink = otrRequest.getFireflyDeepLink();
  const bloomDeepLink = otrRequest.getBloomDeepLink();
  return c.html(
    <html>
      <head>
        <title>IOTA / SMR - Deep Link</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div class="h-screen flex flex-col gap-12 items-center justify-center bg-gray-200">
          <div class="text-2xl font-bold">
            <span>Select wallet to process your payment</span>
          </div>
          <div class="flex flex-col space-x-12 items-center justify-center w-full lg:flex-row lg:w-auto">
            <a
              href={bloomDeepLink}
              class="rounded-full py-2 px-4 border-solid border-2 border-gray-400"
              nzSize="large"
            >
              <div class="flex items-center">
                <img src="https://i.imgur.com/IJsSqGs.png" alt="Bloom logo" class="w-32" />
              </div>
            </a>
            <a
              href={fireflyDeeplink}
              class="rounded-full py-2 px-4 border-solid border-2 border-gray-400"
              nzSize="large"
            >
              <div class="flex items-center">
                <img src="https://i.imgur.com/wqZPKGJ.png" alt="Firefly logo" class="mr-2" />
                <div class="text-foregrounds-primary dark:text-foregrounds-primary-dark">
                  Firefly
                </div>
              </div>
            </a>
          </div>
          <div class="text-xs">
            <span>
              Only IOTA & Shimmer wallets that supports metadata passed via deeplink are supported.
            </span>
          </div>
        </div>
      </body>
    </html>,
  );
}
