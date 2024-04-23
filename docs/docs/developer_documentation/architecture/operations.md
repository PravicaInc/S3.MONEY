---
sidebar_position: 2
---

# Operations

![Operations](@site/static/img/operations-flow.png)

- The user can choose from various operations related to their stablecoin, such as Pause, Unpause, Freeze, Unfreeze, Mint, Burn, and Cash In.
- When the user decides to perform any operation, the frontend sends a call to the contract where the corresponding function is executed. Additionally, the contract makes an additional call to the watcher, which updates the balance for the stablecoin based on the operation performed.
- Along with the call to the contract function, the transaction is built, signed, and executed within the transaction block.
