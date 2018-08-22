import React, { Component } from "react";
import CryptoJS from "crypto-js";
import BlockPoemFactory from "../build/contracts/BlockPoemFactory.json";
import BlockPoem from "../build/contracts/BlockPoem.json";
import getWeb3 from "./utils/getWeb3";
import contract from "truffle-contract";
const Web3 = require("web3");

import "./css/oswald.css";
import "./css/open-sans.css";
import "./css/pure-min.css";
import "./App.css";

import { Button, Card, Form, Input, Message } from "semantic-ui-react";

class App extends Component {
  constructor(props) {
    super(props);

    this.poemHashDict = localStorage.getItem(
      "storedPoemHashDict",
      this.poemHashDict
    );

    this.state = {
      account: "",
      poem: "",
      donationStatus: "",
      hash: "",
      web3: null,
      errorMessage: "",
      loading: false,
      poemHashDict: {},
      poems: [],
      factory: ""
    };
  }

  /* Used for hashing poems and their extra messages */
  hashString256(text) {
    let hash = CryptoJS.SHA256(text).toString();
    return hash;
  }

  /* Used for creating BlockPoems */
  onCreate = async event => {
    event.preventDefault();
    this.setState({ errorMessage: "", loading: true });

    try {
      const accounts = await this.state.web3.eth.getAccounts();

      /* need to hash poem text for better storage on blockchain */
      console.log(this.state.factory);
      console.log("hash: " + this.state.hash);
      console.log("type of hash: " + typeof this.state.hash);
      console.log("type of account: " + typeof accounts[0]);

      await this.state.factory.createPoem(this.state.poem, accounts[0], {
        from: accounts[0],
        gas: 2200000
      });

      let poems = await this.state.factory.getDeployedPoems.call();
      console.log(poems);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }

    /* Update the hash dictionary */
    //let dictCopy = JSON.parse(JSON.stringify(this.poemHashDict));
    //this.poemHashDict[this.state.hash] = this.state.poem;
    // setter
    //localStorage.setItem("storedPoemHashDict", this.poemHashDict);

    this.setState({ loading: false });

    location.reload();
  };

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
      .then(results => {
        this.setState({
          web3: results.web3
        });

        // Instantiate contract once web3 provided.
        console.log("instantiating contract");
        this.instantiateContract();
      })
      .catch(() => {
        console.log("Error finding web3.");
      });
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */
    console.log("step 1");
    const contract = require("truffle-contract");
    const blockPoemFactory = contract(BlockPoemFactory);
    const web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545")
    );

    blockPoemFactory.setProvider(this.state.web3.currentProvider);

    // Declaring this for later so we can chain functions on BlockPoem.
    let blockPoemFactoryInstance;
    console.log("step 2");

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      console.log("step 3");
      blockPoemFactory.deployed().then(instance => {
        console.log("step 4");
        blockPoemFactoryInstance = instance;
        console.log("instance: " + blockPoemFactoryInstance);

        // Get the Poems
        //const poems = this.retrievePoems(blockPoemFactoryInstance);
        //const poems = ["1"];

        blockPoemFactoryInstance.getDeployedPoems().then(poems => {
          console.log("step 5");
          console.log(accounts);
          this.setState({
            account: accounts[0],
            poems: poems,
            factory: blockPoemFactoryInstance
          });
        });
      });
    });
  }

  renderPoems() {
    const items = this.state.poems.map(address => {
      return {
        header: address,
        description: (
          <div>
            <Button onClick={() => this.showDetail(address)}>View Poem</Button>

            <Button onClick={() => this.donate(address)}>
              Donate .0001 ether
            </Button>
          </div>
        ),
        fluid: true
      };
    });

    return <Card.Group items={items} />;
  }

  async donate(address) {
    const contract = require("truffle-contract");
    const blockPoem = contract(BlockPoem);
    const web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545")
    );

    blockPoem.setProvider(this.state.web3.currentProvider);
    const selectedPoem = blockPoem.at(address);

    let donationAmount = this.state.web3.utils.toWei("0.0001", "ether");

    try {
      const accounts = await this.state.web3.eth.getAccounts();
      let successfulTx = await selectedPoem.donate({
        from: accounts[0],
        value: donationAmount,
        gas: 2200000
      });

      console.log("success: " + successfulTx.toString());
      let balance = await this.state.web3.eth.getBalance(accounts[0]);
      console.log("balance: " + balance);
    } catch (err) {
      this.setState({ errorMessage: err.message });
    }
    this.setState({ donationStatus: "Donation successful!", loading: false });
  }

  async showDetail(address) {
    const contract = require("truffle-contract");
    const blockPoem = contract(BlockPoem);
    const web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545")
    );

    blockPoem.setProvider(this.state.web3.currentProvider);

    const selectedPoem = blockPoem.at(address);
    const storedPoem = await selectedPoem.poem.call();

    // console.log("storedHash: " + storedHash);
    // console.log("type of storedHash: " + typeof storedHash);
    // console.log("hashDict keys: " + Object.keys(this.poemHashDict));

    // const poemText = this.poemHashDict[storedHash];
    console.log("the poem text is: " + storedPoem);
    this.setState({ donationStatus: "", poem: storedPoem });
  }

  render() {
    return (
      <div className="App">
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css"
        />
        <nav className="navbar pure-menu pure-menu-horizontal">
          <a href="#" className="pure-menu-heading pure-menu-link">
            Block Poems
          </a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>
                These are poems on your Ganache blockchain. Pretty neat hmm?
              </h1>
              <p>You are using account: {this.state.account}</p>
              <Form onSubmit={this.onCreate} error={!!this.state.errorMessage}>
                <Form.Field>
                  <label>Your Poem</label>
                  <Input
                    value={this.state.poem}
                    onChange={event => {
                      // let dictCopy = JSON.parse(
                      //   JSON.stringify(this.state.poemHashDict)
                      // );

                      let hash = this.hashString256(event.target.value);
                      //dictCopy[hash] = event.target.value;

                      this.setState({
                        poem: event.target.value,
                        hash: hash,
                        donationStatus: ""
                      });
                    }}
                  />
                </Form.Field>
                <Message
                  error
                  header="Oops!"
                  content={this.state.errorMessage}
                />
                <Button primary loading={this.state.loading}>
                  Create
                </Button>
              </Form>
              <p>Give it some text</p>
              <h2>Poem List</h2>
              {this.renderPoems()}
              <p />
              <h3>{this.state.poem}</h3>
              <h3>{this.state.donationStatus}</h3>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App;
