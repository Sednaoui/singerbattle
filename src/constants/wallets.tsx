import { Logo } from "@stellar/design-system";
import { ModalType, Wallets } from "types/types.d";

export const wallets: Wallets = {
  albedo: {
    title: "Connect with Albedo",
    logoSvg: <Logo.Albedo />,
    modalType: ModalType.SIGNIN_ALBEDO,
    infoText: "Albedo is a browser wallet.",
    infoLinkText: "Learn more",
    infoLink: "https://albedo.link",
  },
  ledger: {
    title: "Connect with Ledger",
    logoSvg: <Logo.Ledger />,
    modalType: ModalType.SIGNIN_LEDGER,
    infoText: "Ledger is a Stellar-compatible hardware wallet.",
    infoLinkText: "Learn more",
    infoLink: "https://www.ledger.com",
  },
};
