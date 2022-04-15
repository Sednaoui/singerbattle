import axios from "axios";

const inst = axios.create({
  baseURL: "https://horizon-testnet.stellar.org/",
  timeout: 5000,
});

export const getInfo = async () => {
  const response = await inst.get(
    `accounts/GCVOAP4D7FXGE52VAOT67OLA53NSLMMZ35MO6S2XZMINAN7WGCXL6P3K`,
  );
  console.log(response, "response!! marc");

  return response;
};
