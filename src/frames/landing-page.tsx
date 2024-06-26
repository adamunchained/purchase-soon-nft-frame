import { Dataset, NftAvailable } from '@build-5/interfaces';
import { Build5, SoonaverseApiKey, https } from '@build-5/sdk';
import { Button } from 'frog';

export const landingFrame = async (c: any) => {
  // Let's validate whenever they have follow us already.
  const nft = await https(Build5.PROD)
    .project(SoonaverseApiKey[Build5.PROD])
    .dataset(Dataset.NFT)
    .id(c.req.param('nftId'))
    .get();

  if (!nft || nft.available !== NftAvailable.SALE || !nft.mintingData) {
    return c.res({
      image: (
        <div
          style={{
            alignItems: 'center',
            background: 'black',
            backgroundSize: '100% 100%',
            display: 'flex',
            flexDirection: 'column',
            flexWrap: 'nowrap',
            height: '100%',
            justifyContent: 'center',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              color: 'white',
              fontSize: 60,
              fontStyle: 'normal',
              letterSpacing: '-0.025em',
              lineHeight: 1.4,
              marginTop: 30,
              padding: '0 120px',
              whiteSpace: 'pre-wrap',
            }}
          >
            {'Onchain NFT not available for sale anymore!'}
          </div>
        </div>
      ),
    });
  }

  return c.res({
    image: nft.media,
    intents: [
      <Button.Link href={'http://soon-purchase-nft-v1.buildcore.io/deep-link/' + nft.uid}>
        {'Purchase for ' +
          ((nft.availablePrice || 0) / 1000 / 1000).toLocaleString() +
          ' ' +
          nft.mintingData?.network?.toUpperCase()}
      </Button.Link>,
    ],
  });
};
