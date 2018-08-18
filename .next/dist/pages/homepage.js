"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("/Users/diegomartin1/BlockPoems/node_modules/babel-preset-react-app/node_modules/babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _jsxFileName = "/Users/diegomartin1/BlockPoems/pages/homepage.js?entry";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);
    }
  }return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;
  };
}();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _cryptoJs = require("crypto-js");

var _cryptoJs2 = _interopRequireDefault(_cryptoJs);

var _BlockPoemFactory = require("../build/contracts/BlockPoemFactory.json");

var _BlockPoemFactory2 = _interopRequireDefault(_BlockPoemFactory);

var _BlockPoem = require("../build/contracts/BlockPoem.json");

var _BlockPoem2 = _interopRequireDefault(_BlockPoem);

var _getWeb = require("./utils/getWeb3");

var _getWeb2 = _interopRequireDefault(_getWeb);

var _truffleContract = require("truffle-contract");

var _truffleContract2 = _interopRequireDefault(_truffleContract);

var _semanticUiReact = require("semantic-ui-react");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _asyncToGenerator(fn) {
  return function () {
    var gen = fn.apply(this, arguments);return new Promise(function (resolve, reject) {
      function step(key, arg) {
        try {
          var info = gen[key](arg);var value = info.value;
        } catch (error) {
          reject(error);return;
        }if (info.done) {
          resolve(value);
        } else {
          return Promise.resolve(value).then(function (value) {
            step("next", value);
          }, function (err) {
            step("throw", err);
          });
        }
      }return step("next");
    });
  };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var Homepage = function (_Component) {
  _inherits(Homepage, _Component);

  function Homepage(props) {
    var _this2 = this;

    _classCallCheck(this, Homepage);

    var _this = _possibleConstructorReturn(this, (Homepage.__proto__ || Object.getPrototypeOf(Homepage)).call(this, props));

    _this.onCreate = function () {
      var _ref = _asyncToGenerator(_regenerator2.default.mark(function _callee(event) {
        var accounts, poems;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                event.preventDefault();
                _this.setState({ errorMessage: "", loading: true });

                _context.prev = 2;
                _context.next = 5;
                return _this.state.web3.eth.getAccounts();

              case 5:
                accounts = _context.sent;

                /* need to hash poem text for better storage on blockchain */
                console.log(_this.state.factory);
                console.log("hash: " + _this.state.hash);
                console.log("type of hash: " + _typeof(_this.state.hash));
                console.log("type of account: " + _typeof(accounts[1]));

                _context.next = 12;
                return _this.state.factory.createPoem(_this.state.poem, accounts[1], {
                  from: accounts[1],
                  gas: 2200000
                });

              case 12:
                _context.next = 14;
                return _this.state.factory.getDeployedPoems.call();

              case 14:
                poems = _context.sent;

                console.log(poems);
                _context.next = 21;
                break;

              case 18:
                _context.prev = 18;
                _context.t0 = _context["catch"](2);

                _this.setState({ errorMessage: _context.t0.message });

              case 21:

                /* Update the hash dictionary */
                //let dictCopy = JSON.parse(JSON.stringify(this.poemHashDict));
                //this.poemHashDict[this.state.hash] = this.state.poem;
                // setter
                //localStorage.setItem("storedPoemHashDict", this.poemHashDict);

                _this.setState({ loading: false });

                location.reload();

              case 23:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, _this2, [[2, 18]]);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }();

    _this.poemHashDict = localStorage.getItem("storedPoemHashDict", _this.poemHashDict);

    _this.state = {
      poem: "",
      hash: "",
      web3: null,
      errorMessage: "",
      loading: false,
      poemHashDict: {},
      poems: [],
      factory: ""
    };
    return _this;
  }

  /* Used for hashing poems and their extra messages */

  _createClass(Homepage, [{
    key: "hashString256",
    value: function hashString256(text) {
      var hash = _cryptoJs2.default.SHA256(text).toString();
      return hash;
    }

    /* Used for creating BlockPoems */

  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this3 = this;

      // Get network provider and web3 instance.
      // See utils/getWeb3 for more info.

      _getWeb2.default.then(function (results) {
        _this3.setState({
          web3: results.web3
        });

        // Instantiate contract once web3 provided.
        console.log("instantiating contract");
        _this3.instantiateContract();
      }).catch(function () {
        console.log("Error finding web3.");
      });
    }
  }, {
    key: "instantiateContract",
    value: function instantiateContract() {
      var _this4 = this;

      /*
       * SMART CONTRACT EXAMPLE
       *
       * Normally these functions would be called in the context of a
       * state management library, but for convenience I've placed them here.
       */
      console.log("step 1");
      var contract = require("truffle-contract");
      var blockPoemFactory = contract(_BlockPoemFactory2.default);

      blockPoemFactory.setProvider(this.state.web3.currentProvider);

      // Declaring this for later so we can chain functions on BlockPoem.
      var blockPoemFactoryInstance = void 0;
      console.log("step 2");

      // Get accounts.
      this.state.web3.eth.getAccounts(function (error, accounts) {
        console.log("step 3");
        blockPoemFactory.deployed().then(function (instance) {
          console.log("step 4");
          blockPoemFactoryInstance = instance;
          console.log("instance: " + blockPoemFactoryInstance);

          // Get the Poems
          //const poems = this.retrievePoems(blockPoemFactoryInstance);
          //const poems = ["1"];

          blockPoemFactoryInstance.getDeployedPoems().then(function (poems) {
            console.log("step 5");
            _this4.setState({ poems: poems, factory: blockPoemFactoryInstance });
          });
        });
      });
    }
  }, {
    key: "renderPoems",
    value: function renderPoems() {
      var _this5 = this;

      var items = this.state.poems.map(function (address) {
        return {
          header: address,
          description: _react2.default.createElement(_semanticUiReact.Button, { onClick: function onClick() {
              return _this5.showDetail(address);
            }, __source: {
              fileName: _jsxFileName,
              lineNumber: 134
            },
            __self: _this5
          }, "View Poem"),
          fluid: true
        };
      });

      return _react2.default.createElement(_semanticUiReact.Card.Group, { items: items, __source: {
          fileName: _jsxFileName,
          lineNumber: 140
        },
        __self: this
      });
    }
  }, {
    key: "showDetail",
    value: function () {
      var _ref2 = _asyncToGenerator(_regenerator2.default.mark(function _callee2(address) {
        var contract, blockPoem, selectedPoem, storedPoem;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                contract = require("truffle-contract");
                blockPoem = contract(_BlockPoem2.default);

                blockPoem.setProvider(this.state.web3.currentProvider);

                selectedPoem = blockPoem.at(address);
                _context2.next = 6;
                return selectedPoem.poem.call();

              case 6:
                storedPoem = _context2.sent;

                // console.log("storedHash: " + storedHash);
                // console.log("type of storedHash: " + typeof storedHash);
                // console.log("hashDict keys: " + Object.keys(this.poemHashDict));

                // const poemText = this.poemHashDict[storedHash];
                console.log("the poem text is: " + storedPoem);
                return _context2.abrupt("return", _react2.default.createElement(_semanticUiReact.Card, { header: "Elliot Baker", meta: "Friend", description: storedPoem, __source: {
                    fileName: _jsxFileName,
                    lineNumber: 158
                  },
                  __self: this
                }));

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function showDetail(_x2) {
        return _ref2.apply(this, arguments);
      }

      return showDetail;
    }()
  }, {
    key: "render",
    value: function render() {
      var _this6 = this;

      return _react2.default.createElement("div", { className: "App", __source: {
          fileName: _jsxFileName,
          lineNumber: 164
        },
        __self: this
      }, _react2.default.createElement("link", {
        rel: "stylesheet",
        href: "//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.3.3/semantic.min.css",
        __source: {
          fileName: _jsxFileName,
          lineNumber: 165
        },
        __self: this
      }), _react2.default.createElement("nav", { className: "navbar pure-menu pure-menu-horizontal", __source: {
          fileName: _jsxFileName,
          lineNumber: 169
        },
        __self: this
      }, _react2.default.createElement("a", { href: "#", className: "pure-menu-heading pure-menu-link", __source: {
          fileName: _jsxFileName,
          lineNumber: 170
        },
        __self: this
      }, "Block Poems")), _react2.default.createElement("main", { className: "container", __source: {
          fileName: _jsxFileName,
          lineNumber: 175
        },
        __self: this
      }, _react2.default.createElement("div", { className: "pure-g", __source: {
          fileName: _jsxFileName,
          lineNumber: 176
        },
        __self: this
      }, _react2.default.createElement("div", { className: "pure-u-1-1", __source: {
          fileName: _jsxFileName,
          lineNumber: 177
        },
        __self: this
      }, _react2.default.createElement("h1", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 178
        },
        __self: this
      }, "Good to Go!"), _react2.default.createElement(_semanticUiReact.Form, { onSubmit: this.onCreate, error: !!this.state.errorMessage, __source: {
          fileName: _jsxFileName,
          lineNumber: 179
        },
        __self: this
      }, _react2.default.createElement(_semanticUiReact.Form.Field, {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 180
        },
        __self: this
      }, _react2.default.createElement("label", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 181
        },
        __self: this
      }, "Your Poem"), _react2.default.createElement(_semanticUiReact.Input, {
        value: this.state.poem,
        onChange: function onChange(event) {
          // let dictCopy = JSON.parse(
          //   JSON.stringify(this.state.poemHashDict)
          // );

          var hash = _this6.hashString256(event.target.value);
          //dictCopy[hash] = event.target.value;

          _this6.setState({
            poem: event.target.value,
            hash: hash
          });
        },
        __source: {
          fileName: _jsxFileName,
          lineNumber: 182
        },
        __self: this
      })), _react2.default.createElement(_semanticUiReact.Message, {
        error: true,
        header: "Oops!",
        content: this.state.errorMessage,
        __source: {
          fileName: _jsxFileName,
          lineNumber: 199
        },
        __self: this
      }), _react2.default.createElement(_semanticUiReact.Button, { primary: true, loading: this.state.loading, __source: {
          fileName: _jsxFileName,
          lineNumber: 204
        },
        __self: this
      }, "Create")), _react2.default.createElement("p", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 208
        },
        __self: this
      }, "Give it some text"), _react2.default.createElement("h2", {
        __source: {
          fileName: _jsxFileName,
          lineNumber: 209
        },
        __self: this
      }, "Poem List"), this.renderPoems()))));
    }
  }]);

  return Homepage;
}(_react.Component);

exports.default = Homepage;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2VzL2hvbWVwYWdlLmpzIl0sIm5hbWVzIjpbIkhvbWVwYWdlIiwicHJvcHMiLCJvbkNyZWF0ZSIsImV2ZW50IiwicHJldmVudERlZmF1bHQiLCJzZXRTdGF0ZSIsImVycm9yTWVzc2FnZSIsImxvYWRpbmciLCJzdGF0ZSIsIndlYjMiLCJldGgiLCJnZXRBY2NvdW50cyIsImFjY291bnRzIiwiY29uc29sZSIsImxvZyIsImZhY3RvcnkiLCJoYXNoIiwiY3JlYXRlUG9lbSIsInBvZW0iLCJmcm9tIiwiZ2FzIiwiZ2V0RGVwbG95ZWRQb2VtcyIsImNhbGwiLCJwb2VtcyIsIm1lc3NhZ2UiLCJsb2NhdGlvbiIsInJlbG9hZCIsInBvZW1IYXNoRGljdCIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJ0ZXh0IiwiQ3J5cHRvSlMiLCJTSEEyNTYiLCJ0b1N0cmluZyIsImdldFdlYjMiLCJ0aGVuIiwicmVzdWx0cyIsImluc3RhbnRpYXRlQ29udHJhY3QiLCJjYXRjaCIsImNvbnRyYWN0IiwicmVxdWlyZSIsImJsb2NrUG9lbUZhY3RvcnkiLCJCbG9ja1BvZW1GYWN0b3J5Iiwic2V0UHJvdmlkZXIiLCJjdXJyZW50UHJvdmlkZXIiLCJibG9ja1BvZW1GYWN0b3J5SW5zdGFuY2UiLCJlcnJvciIsImRlcGxveWVkIiwiaW5zdGFuY2UiLCJpdGVtcyIsIm1hcCIsImhlYWRlciIsImFkZHJlc3MiLCJkZXNjcmlwdGlvbiIsInNob3dEZXRhaWwiLCJmbHVpZCIsImJsb2NrUG9lbSIsIkJsb2NrUG9lbSIsInNlbGVjdGVkUG9lbSIsImF0Iiwic3RvcmVkUG9lbSIsImhhc2hTdHJpbmcyNTYiLCJ0YXJnZXQiLCJ2YWx1ZSIsInJlbmRlclBvZW1zIiwiQ29tcG9uZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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LEFBQ0UsQUFDQSw0Q0FBQyxpQkFBRDtlQUNTLEtBQUEsQUFBSyxNQURkLEFBQ29CLEFBQ2xCO2tCQUFVLHlCQUFTLEFBQ2pCO0FBQ0E7QUFDQTtBQUVBOztjQUFJLE9BQU8sT0FBQSxBQUFLLGNBQWMsTUFBQSxBQUFNLE9BQXBDLEFBQVcsQUFBZ0MsQUFDM0M7QUFFQTs7aUJBQUEsQUFBSztrQkFDRyxNQUFBLEFBQU0sT0FEQSxBQUNPLEFBQ25CO2tCQUZGLEFBQWMsQUFFTixBQUVUO0FBSmUsQUFDWjtBQVhOOztvQkFBQTtzQkFBQTtBQUFBO2dCQUhKLEFBQ0UsQUFFRSxBQWlCRjtBQWhCSSx5Q0FnQkgsaUJBQUQ7ZUFBQSxBQUVFO2dCQUZGLEFBRVMsQUFDUDtpQkFBUyxLQUFBLEFBQUssTUFIaEIsQUFHc0I7O29CQUh0QjtzQkFBQTtBQUFBO2dCQXBCRixBQW9CRSxBQUtBO0FBSkUsMEJBSUQsK0JBQUQsVUFBUSxTQUFSLE1BQWdCLFNBQVMsS0FBQSxBQUFLLE1BQTlCLEFBQW9DO29CQUFwQztzQkFBQTtBQUFBO2dCQUFBO1NBM0JKLEFBRUUsQUF5QkUsQUFJRiw0QkFBQSxjQUFBOztvQkFBQTtzQkFBQTtBQUFBO2dCQUFBO0FBQUEsU0EvQkYsQUErQkUsQUFDQSxzQ0FBQSxjQUFBOztvQkFBQTtzQkFBQTtBQUFBO2dCQUFBO0FBQUEsU0FoQ0YsQUFnQ0UsQUFDQyxtQkEvQ1gsQUFDRSxBQVdFLEFBQ0UsQUFDRSxBQWlDRyxBQUFLLEFBTWpCOzs7OztFQTlNb0IsTzs7a0JBaU5SLEEiLCJmaWxlIjoiaG9tZXBhZ2UuanM/ZW50cnkiLCJzb3VyY2VSb290IjoiL1VzZXJzL2RpZWdvbWFydGluMS9CbG9ja1BvZW1zIn0=