import Landing from "./landing/page";

export default function Home() {
  /// -----
  // export const contact = async () => {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const { ethereum } = window;

  //   if (ethereum) {
  //     const signer = provider.getSigner();

  //     const contractReader = new ethers.Contract(
  //       STAKING_DAPP_ADDRESS,
  //       StakingDappABI.abi,
  //       signer
  //     );

  //     return contractReader;
  //   }
  // };
  ///// ----

  return (
    <div>
      <Landing />
    </div>
  );
}
