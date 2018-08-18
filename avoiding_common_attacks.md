For this project, the contracts had no withdraw-able balances to provide incentives
to attacks. I did make sure to use transfer() rather than send() on calls modifying
the blockchain to limit the gas sent (and so preventing lengthy code executions).

Logic bugs were defended against by comprehensive unit tests.

Integers were not used as parameters to any function or require statements, or
I would have used the SafeMath library.

The contract manager (ie. writer) does not have power over other users' funds,
but only the content of their poem. Furthermore, the factory contract cannot
reassign poem ownership after poem creation.
