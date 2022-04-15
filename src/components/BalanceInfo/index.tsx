import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  Button,
  Heading3,
  // TextLink,
  Icon,
  Modal,
  // InfoBlock,
} from "@stellar/design-system";

import { SendTransactionFlow } from "components/SendTransaction/SendTransactionFlow";
import { ReceiveTransaction } from "components/ReceiveTransaction";
import { LayoutSection } from "components/LayoutSection";
import { NATIVE_ASSET_CODE } from "constants/settings";
import { startAccountWatcherAction } from "ducks/account";
import { resetSendTxAction } from "ducks/sendTx";
import { logEvent } from "helpers/tracking";
import { useRedux } from "hooks/useRedux";
import { ActionStatus } from "types/types.d";

import "./styles.scss";
import { getInfo } from "./hello";

const chooseRandom = (arr: any, num = 1) => {
  const res = [];
  for (let i = 0; i < num; ) {
    const random = Math.floor(Math.random() * arr.length);
    if (res.indexOf(arr[random]) !== -1) {
      // eslint-disable-next-line no-continue
      continue;
    }
    res.push(arr[random]);
    i++;
  }
  return res;
};

export const BalanceInfo = () => {
  const dispatch = useDispatch();
  const { account } = useRedux("account");
  const { flaggedAccounts } = useRedux("flaggedAccounts");
  const {
    status: accountStatus,
    data,
    isAccountWatcherStarted,
    isUnfunded,
  } = account;
  const { status: flaggedAccountsStatus } = flaggedAccounts;
  const [isSendTxModalVisible, setIsSendTxModalVisible] = useState(false);
  const [isReceiveTxModalVisible, setIsReceiveTxModalVisible] = useState(false);
  const publicAddress = data?.id;

  useEffect(() => {
    if (
      publicAddress &&
      accountStatus === ActionStatus.SUCCESS &&
      !isAccountWatcherStarted
    ) {
      dispatch(startAccountWatcherAction(publicAddress));
    }
  }, [dispatch, publicAddress, accountStatus, isAccountWatcherStarted]);

  const [imageURL, setImageURL] = useState("");

  const getmyInfo = async () => {
    if (
      publicAddress &&
      accountStatus === ActionStatus.SUCCESS &&
      !isAccountWatcherStarted
    ) {
      const response = await getInfo();

      console.log(response, "response");

      const balances = response.data.balances;

      console.log(chooseRandom(balances), "random number!");
      setImageURL(
        "https://ipfs.io/ipfs/QmTXuiZMrWWmMZZRwT6monnBUWkqLLPxCCm2DRp7vwqJge",
      );
    }
  };

  getmyInfo();

  let nativeBalance = "0";

  if (account.data) {
    nativeBalance = account.data.balances
      ? account.data.balances.native.total.toString()
      : "0";
  }

  const resetModalStates = () => {
    dispatch(resetSendTxAction());
    setIsSendTxModalVisible(false);
    setIsReceiveTxModalVisible(false);
  };

  if (!data) {
    return null;
  }

  return (
    <LayoutSection>
      <div className="BalanceInfo">
        <div className="BalanceInfo__balance">
          <Heading3>Your Balance</Heading3>
          <div className="BalanceInfo__balance__amount">
            {`${nativeBalance} Lumens (${NATIVE_ASSET_CODE})`}
          </div>
        </div>

        <div className="BalanceInfo__buttons">
          <Button
            onClick={() => {
              setIsSendTxModalVisible(true);
              logEvent("send: clicked start send");
            }}
            iconLeft={<Icon.Send />}
            disabled={
              isUnfunded || flaggedAccountsStatus !== ActionStatus.SUCCESS
            }
          >
            Send
          </Button>
          <Button
            onClick={() => {
              setIsReceiveTxModalVisible(true);
              logEvent("receive: clicked receive");
            }}
            iconLeft={<Icon.QrCode />}
          >
            Receive
          </Button>
        </div>
      </div>
      <h1>Your randomly chosen NFT:</h1>
      <img
        src={imageURL}
        alt="NFT"
        style={{
          width: 200,
          height: 200,
        }}
      />

      {/* {isUnfunded && (
        <div className="BalanceInfo__unfunded">
          <Heading3>Your Stellar Public Key</Heading3>
          <code data-break>{publicAddress}</code>

          <InfoBlock variant={InfoBlock.variant.warning}>
            This account is currently inactive. To activate it,{" "}
            <TextLink href="https://developers.stellar.org/docs/glossary/minimum-balance/">
              {`send at least 1 lumen (${NATIVE_ASSET_CODE})`}
            </TextLink>{" "}
            to the Stellar public key displayed above.
          </InfoBlock>
        </div>
      )} */}

      <Modal
        visible={isSendTxModalVisible || isReceiveTxModalVisible}
        onClose={resetModalStates}
      >
        {isSendTxModalVisible && (
          <SendTransactionFlow
            onCancel={() => {
              setIsSendTxModalVisible(true);
              resetModalStates();
            }}
          />
        )}
        {isReceiveTxModalVisible && <ReceiveTransaction />}
      </Modal>
    </LayoutSection>
  );
};
