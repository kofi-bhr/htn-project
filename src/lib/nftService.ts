import { Metaplex, keypairIdentity, irysStorage } from '@metaplex-foundation/js';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';

export interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

export class NFTService {
  private metaplex: Metaplex;
  private connection: Connection;

  constructor(connection: Connection, walletPublicKey: PublicKey) {
    this.connection = connection;
    
    const tempKeypair = Keypair.generate();
    
    this.metaplex = Metaplex.make(this.connection)
      .use(keypairIdentity(tempKeypair))
      .use(irysStorage({
        address: 'https://devnet.irys.xyz',
        providerUrl: 'https://api.devnet.solana.com',
        timeout: 60000,
      }));
  }

  async createIdentityNFT(
    walletAddress: string,
    onboardingData: {
      name: string;
      country: string;
      occupation: string;
      monthlyIncome: number;
      businessPlan: string;
    }
  ): Promise<{ mintAddress: string; transactionSignature: string }> {
    try {
      console.log('Creating NFT metadata...');
      
      const metadata: NFTMetadata = {
        name: `Umoja Identity - ${onboardingData.name}`,
        symbol: 'UMOJA',
        description: `Self-sovereign digital identity for ${onboardingData.name}. This soulbound NFT represents a unique digital identity forged on the Solana blockchain, enabling access to decentralized financial services.`,
        image: 'https://via.placeholder.com/400x400/6366f1/ffffff?text=Umoja+Identity',
        attributes: [
          {
            trait_type: 'Identity Type',
            value: 'Self-Sovereign Identity'
          },
          {
            trait_type: 'Blockchain',
            value: 'Solana'
          },
          {
            trait_type: 'Project',
            value: 'Umoja'
          },
          {
            trait_type: 'Country',
            value: onboardingData.country
          },
          {
            trait_type: 'Occupation',
            value: onboardingData.occupation
          },
          {
            trait_type: 'Monthly Income',
            value: `$${onboardingData.monthlyIncome}`
          },
          {
            trait_type: 'Wallet Address',
            value: walletAddress
          },
          {
            trait_type: 'Creation Date',
            value: new Date().toISOString().split('T')[0]
          }
        ]
      };

      console.log('Uploading metadata to IPFS...');
      
      const { uri } = await this.metaplex.nfts().uploadMetadata(metadata);
      console.log('Metadata uploaded to:', uri);

      console.log('Minting NFT...');
      
      const { nft, response } = await this.metaplex.nfts().create({
        uri,
        name: metadata.name,
        symbol: metadata.symbol,
        sellerFeeBasisPoints: 0,
        creators: [
          {
            address: new PublicKey(walletAddress),
            verified: false,
            share: 100,
          },
        ],
        collection: null,
        uses: null,
        isMutable: false,
        maxSupply: null,
        isCollection: false,
      });

      console.log('NFT minted successfully:', nft.address.toString());
      console.log('Transaction signature:', response.signature);

      return {
        mintAddress: nft.address.toString(),
        transactionSignature: response.signature,
      };

    } catch (error) {
      console.error('Error creating NFT:', error);
      throw new Error(`Failed to create NFT: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getNFTDetails(mintAddress: string) {
    try {
      const nft = await this.metaplex.nfts().findByMint({
        mintAddress: new PublicKey(mintAddress),
      });
      
      return nft;
    } catch (error) {
      console.error('Error fetching NFT details:', error);
      throw error;
    }
  }
}

export const createNFTService = (connection: Connection, walletPublicKey: PublicKey) => {
  return new NFTService(connection, walletPublicKey);
};
