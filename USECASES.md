# Wallet Use Cases

## Notes

This app is expecting that either Argent X or Braavos is installed as a browser extension. It should be upgraded to support a "WalletConnect" like interface that can be used by any mobile wallet.


## Use Case 1: Wallet extension is installed, and user wants to connect to a decentralized application (dApp)

1. The user navigates to the dApp's website.
2. The user clicks on the "Connect Wallet" button on the dApp's interface.
3. The wallet extension prompts the user to approve the connection request.
4. The user approves the connection and can now interact with the dApp using their crypto wallet.

## Use Case 2: Wallet extension is not enabled, and the user wants to connect to a dApp

1. The user navigates to the dApp's website.
2. The user clicks on the "Connect Wallet" button on the dApp's interface.
3. The dApp does not detect any wallet extension installed in the user's browser.
4. The user is prompted to install or enable a compatible wallet extension (e.g., Argent X or Braavos) by following the provided link.
5. The user enables the wallet extension.
6. The user returns to the dApp's website and clicks on the "Connect Wallet" button.
7. The wallet extension prompts the user to approve the connection request.
8. The user approves the connection and can now interact with the dApp using their crypto wallet.

## Use Case 3: Wallet extension is not installed, and the user wants to connect to a dApp

1. The user navigates to the dApp's website.
2. The user clicks on the "Connect Wallet" button on the dApp's interface.
3. The dApp does not detect any wallet extension installed in the user's browser.
4. The user is prompted to install or enable a compatible wallet extension (e.g., Argent X or Braavos) by following the provided link.
5. The user installs the wallet extension and creates or imports their crypto wallet.
6. The user returns to the dApp's website and clicks on the "Connect Wallet" button.
7. The wallet extension prompts the user to approve the connection request.
8. The user approves the connection and can now interact with the dApp using their crypto wallet.

## Use Case 4: Wallet extension is installed, and user wants to switch wallets while connected to a dApp

1. The user is already connected to the dApp with their current crypto wallet.
2. The user clicks on the wallet extension icon in their browser.
3. The user selects the option to switch accounts or add a new wallet.
4. The wallet extension prompts the user to approve the connection request for the new wallet.
5. The user approves the connection, and the dApp now interacts with the newly selected wallet.

## Use Case 5: Wallet extension is installed, and user wants to disconnect their wallet from a dApp

1. The user is connected to the dApp with their crypto wallet.
2. The user clicks on the wallet extension icon in their browser.
3. The user selects the option to disconnect their wallet from the dApp.
4. The wallet extension disconnects the wallet, and the user can no longer interact with the dApp using their crypto wallet.

## Use Case 6: Wallet extension is installed, and user wants to sign a transaction using their crypto wallet

1. The user is connected to the dApp with their crypto wallet.
2. The user initiates a transaction on the dApp (e.g., token transfer, smart contract interaction).
3. The wallet extension prompts the user to review and approve the transaction details (e.g., gas fees, destination address).
4. The user approves the transaction, and the wallet extension signs and broadcasts it to the blockchain.
5. The user receives a confirmation from the wallet extension when the transaction is successfully processed.