
### Basics:

#### What is Solidity?

    An object-oriented, high-level language for implementing smart contracts. 

#### What are smart contracts?

    The building blocks of blockchain-based applications. They represent digital agreements in which the code cannot change.

### Code:

```solidity
  // Write functions cost gas
  function setName (string memory _s ) public {
    name = _s;
  }

  // Read functions are free, reading from the blockchain is free
  function getName() public view returns (string memory){
    return name;
  }

```

Keywords:

```cpp
  view = keyword means that the function does not modify the state of the blockchain

  pure = functions do not modify the state but also do not read the state

  payable = functions are allowed to recieve ETH cryptocurrency
```

Mappings:

```solidity
    // Mappings are equivalent to python maps, hash tables, etc.

  mapping (uint => string) public names;
  mapping (address => bool) public hasVoted;
  mapping (address => mapping(uint => bool)) public myMapping;

```


Structs:
```solidity
    // very similar to cpp

   struct Book{
       string title;
       address author;
       bool completed;
   }

    Book books[20];
```


### Sources:
- https://github.com/tiulia/blockchain_an3

- https://www.youtube.com/watch?v=RQzuQb0dfBM
