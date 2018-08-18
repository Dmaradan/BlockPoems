For this project, the contracts had no withdraw-able balances to provide incentives
to attacks. I did make sure to use transfer() rather than send() on calls modifying
the blockchain to limit the gas sent (and so preventing lengthy code executions).
