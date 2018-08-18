Design Patterns:

The main Solidity design pattern I used in this project was restricting access.
Although not implemented in the UI, the BlockPoem contract supports liking a poem,
retrieving the owner of the poem, and adding an extra message, all of which depend
on a valid account doing so. The test suite verifies that this is working well.

I did not use any common withdrawal design patterns because neither the BlockPoem nor
its factory contract hold any funds.

One thing I wanted to do, and started doing, but ended up putting on the back-burner
(because of my lack of experience in web development and time constraints) was
storing hashes of the poem text on the blockchain, then having a persistent dictionary
server-side which would display a poem according to its hash. I could not get a dictionary
like this to persist between browser refreshes though so I shelved the idea for now.
I'm fully aware that this is a much better storage design, as poems can be any length
but hashes are not.
